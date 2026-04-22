import type { ContextPackage, RetrievedNodeContext, LlmRequest } from "../types.js";

const PRIMARY_DOC_CHAR_LIMIT = 1_200;
const PRIMARY_FILE_CHAR_LIMIT = 4_000;
const RELATED_DOC_CHAR_LIMIT = 320;
const RELATED_FILE_CHAR_LIMIT = 1_200;
const WARNING_CHAR_LIMIT = 160;
const MAX_WARNING_COUNT = 4;

const truncateText = (value: string, maxChars: number): string => {
  if (value.length <= maxChars) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxChars - 15)).trimEnd()}\n...[truncated]`;
};

const formatCallSiteLines = (lineNumbers: number[]): string =>
  lineNumbers.length > 0 ? lineNumbers.join(", ") : "none";

const formatNodeHeader = (node: RetrievedNodeContext): string =>
  [
    `name=${node.name}`,
    `relationship=${node.relationship}`,
    `kind=${node.kind}`,
    `file=${node.filePath}:${node.startLine}-${node.endLine}`,
    `callSites=${formatCallSiteLines(node.callSiteLines)}`
  ].join(" | ");

const formatDocSection = (label: string, value: string, maxChars: number): string =>
  value.trim().length === 0 ? "" : `${label}:\n${truncateText(value, maxChars)}`;

const formatFileSection = (value: string, maxChars: number): string =>
  value.trim().length === 0 ? "" : `File excerpt:\n${truncateText(value, maxChars)}`;

const joinSections = (sections: string[]): string => sections.filter(Boolean).join("\n\n");

const formatPrimaryNode = (node: RetrievedNodeContext): string =>
  joinSections([
    `Primary node:\n${formatNodeHeader(node)}`,
    formatDocSection("Primary doc", node.doc, PRIMARY_DOC_CHAR_LIMIT),
    formatFileSection(node.fullFileContent, PRIMARY_FILE_CHAR_LIMIT)
  ]);

const shouldIncludeRelatedFile = (
  node: RetrievedNodeContext,
  primaryNode: RetrievedNodeContext | null,
  includedFiles: Set<string>
): boolean => !includedFiles.has(node.filePath) && node.filePath !== primaryNode?.filePath;

const formatRelatedNode = (
  node: RetrievedNodeContext,
  primaryNode: RetrievedNodeContext | null,
  includedFiles: Set<string>
): string => {
  const includeFile = shouldIncludeRelatedFile(node, primaryNode, includedFiles);
  if (includeFile) {
    includedFiles.add(node.filePath);
  }

  return joinSections([
    formatNodeHeader(node),
    formatDocSection("Related doc", node.doc, RELATED_DOC_CHAR_LIMIT),
    includeFile ? formatFileSection(node.fullFileContent, RELATED_FILE_CHAR_LIMIT) : ""
  ]);
};

const formatRelatedNodes = (
  relatedNodes: RetrievedNodeContext[],
  primaryNode: RetrievedNodeContext | null
): string => {
  if (relatedNodes.length === 0) {
    return "Related nodes:\nnone";
  }

  const includedFiles = new Set(primaryNode ? [primaryNode.filePath] : []);
  const entries = relatedNodes.map((node, index) =>
    `${index + 1}. ${formatRelatedNode(node, primaryNode, includedFiles)}`
  );
  return `Related nodes:\n${entries.join("\n\n")}`;
};

const formatWarnings = (warnings: string[]): string => {
  if (warnings.length === 0) {
    return "";
  }

  const entries = warnings
    .slice(0, MAX_WARNING_COUNT)
    .map((warning, index) => `${index + 1}. ${truncateText(warning, WARNING_CHAR_LIMIT)}`);
  return `Warnings:\n${entries.join("\n")}`;
};

const summarizeContext = (context: ContextPackage): string =>
  joinSections([
    `Graph summary:\n${context.graphSummary}`,
    context.primaryNode ? formatPrimaryNode(context.primaryNode) : "Primary node:\nnone",
    formatRelatedNodes(context.relatedNodes, context.primaryNode),
    formatWarnings(context.warnings)
  ]);

export const buildSystemPrompt = (): string =>
  [
    "You are answering questions about a codebase.",
    "Only use the provided repository context.",
    "If the context is insufficient, say so plainly.",
    "Do not invent functions, files, or behavior that is not present in the retrieved context."
  ].join(" ");

export const buildMessages = (question: string, context: ContextPackage): LlmRequest["messages"] => [
  {
    role: "system",
    content: buildSystemPrompt()
  },
  {
    role: "user",
    content: `Question:\n${question}\n\n${summarizeContext(context)}`
  }
];

const MULTI_HOP_SYSTEM_PROMPT = [
  "You are answering questions about a codebase using multi-hop retrieved context.",
  "The context was gathered by breaking the question into sub-questions and retrieving code for each.",
  "Only use the provided repository context.",
  "If the context is insufficient, say so plainly and identify which sub-questions lack coverage.",
  "Do not invent functions, files, or behavior that is not present in the retrieved context."
].join(" ");

const formatSubQuestionSection = (
  index: number,
  question: string,
  nodes: RetrievedNodeContext[]
): string => {
  if (nodes.length === 0) {
    return `Sub-question ${index + 1}: "${question}"\nNo matching code found.`;
  }

  const nodeEntries = nodes
    .map((node, ni) => `${ni + 1}. ${formatNodeHeader(node)}`)
    .join("\n");

  return `Sub-question ${index + 1}: "${question}"\nRetrieved ${nodes.length} node(s):\n${nodeEntries}`;
};

/**
 * Builds LLM messages for multi-hop synthesis.
 * Instructs the model to address each sub-question then unify the answer.
 */
export const buildMultiHopMessages = (
  question: string,
  context: ContextPackage
): LlmRequest["messages"] => {
  const subQuestions = context.subQuestions ?? [];
  const nodeByIndex = new Map<number, RetrievedNodeContext[]>();

  for (const node of context.relatedNodes) {
    const idx = node.subQuestionIndex ?? 0;
    const list = nodeByIndex.get(idx) ?? [];
    list.push(node);
    nodeByIndex.set(idx, list);
  }

  const subQuestionSections = subQuestions
    .map((sq, i) => {
      const nodes = nodeByIndex.get(i) ?? [];
      return formatSubQuestionSection(i, sq, nodes);
    })
    .join("\n\n");

  const userContent = [
    `Question:\n${question}`,
    ``,
    `This question was decomposed into ${subQuestions.length} sub-questions.`,
    `Context was retrieved independently for each, then deduplicated and merged.`,
    ``,
    subQuestionSections,
    ``,
    `Graph summary:`,
    context.graphSummary,
    ``,
    formatWarnings(context.warnings),
    ``,
    `Answer the question comprehensively. Address each sub-question specifically,`,
    `then synthesize into a unified answer. If some sub-questions couldn't be`,
    `answered from the context, explicitly state what's missing.`
  ]
    .filter(Boolean)
    .join("\n");

  return [
    { role: "system", content: MULTI_HOP_SYSTEM_PROMPT },
    { role: "user", content: userContent }
  ];
};
