import fs from "node:fs/promises";
import path from "node:path";

import type { BlueprintEdge, BlueprintNode } from "@abhinav2203/codeflow-core/schema";

import type { EmbeddingProvider, EmbeddingProviderKind, GraphSnapshot, IndexManifest, IndexedNodeDocument, SourceSpan } from "../types.js";
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

type PreparedIndexedDocument = Omit<IndexedNodeDocument, "vector"> & {
  embeddingText: string;
};

const chunkItems = <T>(items: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }

  return chunks;
};

const embedPreparedDocuments = async (
  preparedDocuments: PreparedIndexedDocument[],
  embeddingProvider: EmbeddingProvider,
  logger?: { info: (msg: string, ctx?: Record<string, unknown>) => void }
): Promise<IndexedNodeDocument[]> => {
  if (preparedDocuments.length === 0) {
    return [];
  }

  if (!embeddingProvider.embedBatch) {
    logger?.info("Embedding documents (sequential)", { count: preparedDocuments.length });
    const embedded: IndexedNodeDocument[] = [];
    for (let i = 0; i < preparedDocuments.length; i += 1) {
      const doc = preparedDocuments[i];
      if (!doc) continue;
      const { embeddingText, ...document } = doc;
      embedded.push({ ...document, vector: await embeddingProvider.embed(embeddingText) });
      if ((i + 1) % 500 === 0) {
        logger?.info(`Embedding progress: ${i + 1}/${preparedDocuments.length}`);
      }
    }
    return embedded;
  }

  const chunkSize = Math.max(1, embeddingProvider.maxBatchSize ?? preparedDocuments.length);
  const chunks = chunkItems(preparedDocuments, chunkSize);
  logger?.info("Embedding documents (batched)", { count: preparedDocuments.length, chunks: chunks.length, chunkSize });

  // Process batches in parallel (Promise.all) instead of sequentially
  const chunkResults = await Promise.all(
    chunks.map(async (chunk, chunkIndex) => {
      const vectors = await embeddingProvider.embedBatch!(chunk.map((document) => document.embeddingText));
      if (vectors.length !== chunk.length) {
        throw new Error("Embedding provider returned a mismatched batch size.");
      }
      if ((chunkIndex + 1) % 50 === 0 || chunkIndex === 0) {
        logger?.info(`Embedding chunk ${chunkIndex + 1}/${chunks.length} complete`);
      }
      return chunk.map(({ embeddingText: _embeddingText, ...document }, index) => {
        const vector = vectors[index];
        return {
          ...document,
          vector: vector ?? []
        };
      });
    })
  );

  return chunkResults.flat() as IndexedNodeDocument[];
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
  docsPath?: string,
  logger?: { info: (msg: string, ctx?: Record<string, unknown>) => void }
): Promise<Record<string, IndexedNodeDocument>> => {
  const preparedDocuments: PreparedIndexedDocument[] = [];

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

    preparedDocuments.push({
      nodeId: node.id,
      name: node.name,
      kind: node.kind,
      filePath: node.path,
      summary: node.summary,
      signature: node.signature ?? "",
      doc,
      sourceText,
      embeddingText,
      startLine: span.startLine,
      endLine: span.endLine
    });
  }

  logger?.info("Prepared documents for embedding", { count: preparedDocuments.length });

  return Object.fromEntries(
    (await embedPreparedDocuments(preparedDocuments, embeddingProvider, logger)).map((document) => [document.nodeId, document])
  );
};

const hashIndexedFile = async (repoPath: string, relativePath: string): Promise<[string, string]> => [
  relativePath,
  await hashFile(path.join(repoPath, relativePath))
];

export const INDEX_SCHEMA_VERSION = 2;

const resolveEmbeddingMetadata = (
  embeddingProvider: Pick<EmbeddingProvider, "name" | "model" | "dimensions"> | string
): {
  provider: EmbeddingProviderKind;
  model: string;
  dimensions: number;
} => {
  if (typeof embeddingProvider === "string") {
    return {
      provider: embeddingProvider as EmbeddingProviderKind,
      model: embeddingProvider,
      dimensions: 256
    };
  }

  return {
    provider: embeddingProvider.name as EmbeddingProviderKind,
    model: embeddingProvider.model,
    dimensions: embeddingProvider.dimensions
  };
};

/**
 * Builds the manifest used for incremental reindex decisions.
 */
export const buildIndexManifest = async (
  repoPath: string,
  snapshot: GraphSnapshot,
  documents: Record<string, IndexedNodeDocument>,
  embeddingProvider: Pick<EmbeddingProvider, "name" | "model" | "dimensions"> | string = "local-hash"
): Promise<IndexManifest> => {
  const uniquePaths = [...new Set(Object.values(documents).map((document) => document.filePath))];
  const fileHashes = Object.fromEntries(await Promise.all(uniquePaths.map((relativePath) => hashIndexedFile(repoPath, relativePath))));
  const embeddingMetadata = resolveEmbeddingMetadata(embeddingProvider);

  return {
    schemaVersion: INDEX_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    repoPath: snapshot.repoPath,
    provider: snapshot.provider,
    embeddingProvider: embeddingMetadata.provider,
    embeddingModel: embeddingMetadata.model,
    embeddingDimensions: embeddingMetadata.dimensions,
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
