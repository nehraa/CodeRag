import type { BlueprintNode } from "@abhinav2203/codeflow-core/schema";

import type { ContextPackage, GraphSnapshot, IndexedNodeDocument, RetrievedNodeContext, RetrievalConfig } from "../types.js";
import { FileCache } from "../store/file-cache.js";
import { createRetrievedNodeContext } from "../retrieval/page-index.js";

const buildGraphSummary = (
  primaryNode: BlueprintNode | undefined,
  dependencies: BlueprintNode[],
  dependents: BlueprintNode[]
): string => {
  if (!primaryNode) {
    return "No matching node was retrieved from the current repository index.";
  }

  const parts = [`Primary node: ${primaryNode.name}.`];
  if (dependencies.length > 0) {
    parts.push(`It depends on: ${dependencies.map((node) => node.name).join(", ")}.`);
  }

  if (dependents.length > 0) {
    parts.push(`It is used by: ${dependents.map((node) => node.name).join(", ")}.`);
  }

  return parts.join(" ");
};

const truncateContext = (context: RetrievedNodeContext, maxChars: number, warnings: string[]): RetrievedNodeContext => {
  if (context.fullFileContent.length <= maxChars) {
    return context;
  }

  warnings.push(`Truncated ${context.filePath} to stay within the context budget.`);
  return {
    ...context,
    fullFileContent: context.fullFileContent.slice(0, Math.max(0, maxChars))
  };
};

const fitPrimaryContext = (
  primaryContext: RetrievedNodeContext | null,
  maxContextChars: number
): {
  primaryContext: RetrievedNodeContext | null;
  remainingBudget: number;
  warnings: string[];
} => {
  if (!primaryContext) {
    return {
      primaryContext: null,
      remainingBudget: maxContextChars,
      warnings: []
    };
  }

  const warnings: string[] = [];
  const fittedPrimaryContext = truncateContext(primaryContext, maxContextChars, warnings);
  return {
    primaryContext: fittedPrimaryContext,
    remainingBudget: Math.max(0, maxContextChars - fittedPrimaryContext.fullFileContent.length),
    warnings
  };
};

const fitRelatedContexts = (
  relatedContexts: RetrievedNodeContext[],
  remainingBudget: number
): {
  relatedContexts: RetrievedNodeContext[];
  warnings: string[];
} => {
  const warnings: string[] = [];
  const fittedContexts: RetrievedNodeContext[] = [];
  let budget = remainingBudget;

  for (const context of relatedContexts) {
    if (budget <= 0) {
      warnings.push(`Dropped file content for ${context.filePath} because the context budget was exhausted.`);
      fittedContexts.push({
        ...context,
        fullFileContent: ""
      });
      continue;
    }

    const fittedContext = truncateContext(context, budget, warnings);
    budget = Math.max(0, budget - fittedContext.fullFileContent.length);
    fittedContexts.push(fittedContext);
  }

  return {
    relatedContexts: fittedContexts,
    warnings
  };
};

const buildRelatedContextPromises = (
  repoPath: string,
  fileCache: FileCache,
  snapshot: GraphSnapshot,
  documents: Record<string, IndexedNodeDocument>,
  primaryNode: BlueprintNode | undefined,
  dependencies: BlueprintNode[],
  dependents: BlueprintNode[]
): Array<Promise<RetrievedNodeContext>> => [
  ...dependencies
    .map((node) => documents[node.id])
    .filter((document): document is IndexedNodeDocument => Boolean(document))
    .map((document) => createRetrievedNodeContext(repoPath, fileCache, snapshot, document, "calls", primaryNode?.id)),
  ...dependents
    .map((node) => documents[node.id])
    .filter((document): document is IndexedNodeDocument => Boolean(document))
    .map((document) => createRetrievedNodeContext(repoPath, fileCache, snapshot, document, "called-by", primaryNode?.id))
];

/**
 * Builds the final context package passed to the LLM or returned directly to the caller.
 */
export const buildContextPackage = async (
  question: string,
  repoPath: string,
  snapshot: GraphSnapshot,
  documents: Record<string, IndexedNodeDocument>,
  retrieval: RetrievalConfig,
  fileCache: FileCache,
  primaryNode: BlueprintNode | undefined,
  dependencies: BlueprintNode[],
  dependents: BlueprintNode[],
  answerMode: ContextPackage["answerMode"]
): Promise<ContextPackage> => {
  const primaryDocument = primaryNode ? documents[primaryNode.id] : undefined;
  const primaryContext = primaryDocument
    ? await createRetrievedNodeContext(repoPath, fileCache, snapshot, primaryDocument, "primary")
    : null;
  const resolvedRelatedContexts = await Promise.all(
    buildRelatedContextPromises(repoPath, fileCache, snapshot, documents, primaryNode, dependencies, dependents)
  );
  const primaryResult = fitPrimaryContext(primaryContext, retrieval.maxContextChars);
  const relatedResult = fitRelatedContexts(resolvedRelatedContexts, primaryResult.remainingBudget);

  return {
    question,
    answerMode,
    primaryNode: primaryResult.primaryContext,
    relatedNodes: relatedResult.relatedContexts,
    graphSummary: buildGraphSummary(primaryNode, dependencies, dependents),
    warnings: [...primaryResult.warnings, ...relatedResult.warnings]
  };
};
