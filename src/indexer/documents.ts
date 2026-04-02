import fs from "node:fs/promises";
import path from "node:path";

import type { BlueprintEdge, BlueprintNode } from "@abhinav2203/codeflow-core/schema";

import type { EmbeddingProvider, GraphSnapshot, IndexManifest, IndexedNodeDocument, SourceSpan } from "../types.js";
import { hashContent, hashFile } from "../utils/filesystem.js";

/**
 * Reads the markdown document for a node from the external docsPath.
 * Files are matched by node ID: `${docsPath}/${nodeId}.md`
 */
const readExternalNodeDoc = async (nodeId: string, docsPath: string): Promise<string | null> => {
  const docFilePath = path.join(docsPath, `${nodeId}.md`);
  try {
    return await fs.readFile(docFilePath, "utf8");
  } catch {
    return null;
  }
};

const EMPTY_LIST = "- None";

const formatList = (items: string[]): string => (items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : EMPTY_LIST);

const formatFieldList = (fields: Array<{ name: string; type: string; description?: string | undefined }>): string => {
  if (fields.length === 0) {
    return EMPTY_LIST;
  }

  return fields
    .map((field) => `- ${field.name}: ${field.type}${field.description ? ` - ${field.description}` : ""}`)
    .join("\n");
};

const findRelatedNode = (
  currentNodeId: string,
  edge: BlueprintEdge,
  graphNodes: BlueprintNode[]
): BlueprintNode | undefined => {
  const relatedNodeId = edge.from === currentNodeId ? edge.to : edge.from;
  return graphNodes.find((node) => node.id === relatedNodeId);
};

const summarizeEdges = (
  currentNodeId: string,
  edges: BlueprintEdge[],
  graphNodes: BlueprintNode[]
): string[] =>
  edges.map((edge) => {
    const relatedNode = findRelatedNode(currentNodeId, edge, graphNodes);
    const relatedLabel = relatedNode?.path ? `${relatedNode.name} (${relatedNode.path})` : relatedNode?.name ?? edge.to;
    return `${edge.kind}: ${relatedLabel}`;
  });

const formatSourceRefs = (node: BlueprintNode): string =>
  formatList(
    node.sourceRefs.map((sourceRef) =>
      `${sourceRef.kind}${sourceRef.symbol ? `:${sourceRef.symbol}` : ""}${sourceRef.path ? ` @ ${sourceRef.path}` : ""}`
    )
  );

const buildHeader = (node: BlueprintNode, span: SourceSpan | undefined): string[] => [
  `# ${node.name}`,
  "",
  `Kind: ${node.kind}`,
  `Path: ${node.path ?? "unknown"}`,
  `File Name: ${node.path ? path.basename(node.path) : "unknown"}`,
  `Lines: ${span ? `${span.startLine}-${span.endLine}` : "unknown"}`,
  `Signature: ${node.signature ?? "N/A"}`
];

const readSourceText = async (
  repoPath: string,
  span: SourceSpan
): Promise<string> => {
  const fileContent = await fs.readFile(path.join(repoPath, span.filePath), "utf8");
  return fileContent.split(/\r?\n/).slice(span.startLine - 1, span.endLine).join("\n");
};

/**
 * Builds the natural-language search document stored for a blueprint node.
 */
export const buildNodeDocument = (
  node: BlueprintNode,
  span: SourceSpan | undefined,
  snapshot: GraphSnapshot
): string => {
  const outgoingEdges = snapshot.graph.edges.filter((edge) => edge.from === node.id);
  const incomingEdges = snapshot.graph.edges.filter((edge) => edge.to === node.id);

  return [
    ...buildHeader(node, span),
    "",
    "Summary:",
    node.summary,
    "",
    "Responsibilities:",
    formatList(node.contract.responsibilities),
    "",
    "Inputs:",
    formatFieldList(node.contract.inputs),
    "",
    "Outputs:",
    formatFieldList(node.contract.outputs),
    "",
    "Declared Dependencies:",
    formatList(node.contract.dependencies),
    "",
    "Source References:",
    formatSourceRefs(node),
    "",
    "Calls:",
    formatList(summarizeEdges(node.id, outgoingEdges, snapshot.graph.nodes)),
    "",
    "Called By:",
    formatList(summarizeEdges(node.id, incomingEdges, snapshot.graph.nodes))
  ].join("\n");
};

/**
 * Embeds graph-node documents so they can be searched and reranked later.
 * If docsPath is provided, reads markdown files from that directory (named by node ID)
 * and uses their content as the embedding text instead of generating thin markdown.
 */
export const buildIndexedDocuments = async (
  snapshot: GraphSnapshot,
  embeddingProvider: EmbeddingProvider,
  docsPath?: string
): Promise<Record<string, IndexedNodeDocument>> => {
  const documents: Record<string, IndexedNodeDocument> = {};

  for (const node of snapshot.graph.nodes) {
    const span = snapshot.sourceSpans[node.id];
    if (!node.path || !span) {
      continue;
    }

    const doc = buildNodeDocument(node, span, snapshot);
    const sourceText = await readSourceText(snapshot.repoPath, span).catch(() => "");

    let embeddingText: string;
    if (docsPath) {
      const externalDoc = await readExternalNodeDoc(node.id, docsPath);
      embeddingText = externalDoc ?? [doc, sourceText].filter(Boolean).join("\n\n");
    } else {
      embeddingText = [doc, sourceText].filter(Boolean).join("\n\n");
    }

    documents[node.id] = {
      nodeId: node.id,
      name: node.name,
      kind: node.kind,
      filePath: node.path,
      summary: node.summary,
      signature: node.signature ?? "",
      doc,
      sourceText,
      vector: await embeddingProvider.embed(embeddingText),
      startLine: span.startLine,
      endLine: span.endLine
    };
  }

  return documents;
};

const hashIndexedFile = async (repoPath: string, relativePath: string): Promise<[string, string]> => [
  relativePath,
  await hashFile(path.join(repoPath, relativePath))
];

/**
 * Builds the manifest used for incremental reindex decisions.
 */
export const buildIndexManifest = async (
  repoPath: string,
  snapshot: GraphSnapshot,
  documents: Record<string, IndexedNodeDocument>
): Promise<IndexManifest> => {
  const uniquePaths = [...new Set(Object.values(documents).map((document) => document.filePath))];
  const fileHashes = Object.fromEntries(await Promise.all(uniquePaths.map((relativePath) => hashIndexedFile(repoPath, relativePath))));

  return {
    generatedAt: new Date().toISOString(),
    repoPath: snapshot.repoPath,
    provider: snapshot.provider,
    nodes: Object.fromEntries(
      Object.values(documents).map((document) => [
        document.nodeId,
        {
          nodeId: document.nodeId,
          filePath: document.filePath,
          docHash: hashContent(document.doc),
          fileHash: fileHashes[document.filePath]!
        }
      ])
    ),
    fileHashes
  };
};
