import path from "node:path";

import type { CodeRagConfig, GraphSnapshot, IndexManifest, IndexSummary, IndexedNodeDocument } from "../types.js";
import { buildGraphSnapshot } from "../adapters/codeflow-core.js";
import { IndexingError } from "../errors/index.js";
import { ManifestStore } from "../store/manifest-store.js";
import { IndexLock } from "../store/index-lock.js";
import { buildIndexManifest, buildIndexedDocuments } from "./documents.js";

const diffNodeIds = (
  previousManifest: IndexManifest | null,
  nextManifest: IndexManifest
): {
  removedNodeIds: string[];
  changedNodeIds: string[];
} => {
  if (!previousManifest) {
    return {
      removedNodeIds: [],
      changedNodeIds: Object.keys(nextManifest.nodes)
    };
  }

  const previousIds = new Set(Object.keys(previousManifest.nodes));
  const nextIds = new Set(Object.keys(nextManifest.nodes));
  const removedNodeIds = [...previousIds].filter((nodeId) => !nextIds.has(nodeId));
  const changedNodeIds = Object.entries(nextManifest.nodes)
    .filter(([nodeId, entry]) => {
      const previousEntry = previousManifest.nodes[nodeId];
      return !previousEntry || previousEntry.docHash !== entry.docHash || previousEntry.fileHash !== entry.fileHash;
    })
    .map(([nodeId]) => nodeId);

  return {
    removedNodeIds,
    changedNodeIds
  };
};

const buildIndexSummary = (
  snapshot: GraphSnapshot,
  manifest: IndexManifest,
  documents: Record<string, IndexedNodeDocument>
): IndexSummary => ({
  graph: snapshot.graph,
  manifest,
  snapshot,
  indexedNodeCount: Object.keys(documents).length
});

/**
 * Indexes the repository graph and persists the resulting search documents.
 */
export class RepoIndexer {
  private readonly manifestStore: ManifestStore;
  private readonly indexLock: IndexLock;

  constructor(private readonly config: CodeRagConfig) {
    this.manifestStore = new ManifestStore(config.storageRoot);
    this.indexLock = new IndexLock(config.storageRoot, config.locking, config.logger);
  }

  async loadState(): Promise<{
    manifest: IndexManifest | null;
    snapshot: GraphSnapshot | null;
    documents: Record<string, IndexedNodeDocument>;
  }> {
    const [manifest, snapshot, documents] = await Promise.all([
      this.manifestStore.loadManifest(),
      this.manifestStore.loadSnapshot(),
      this.manifestStore.loadDocuments()
    ]);

    return {
      manifest,
      snapshot,
      documents
    };
  }

  async waitForUnlockedState(): Promise<{
    waited: boolean;
    manifest: IndexManifest | null;
    snapshot: GraphSnapshot | null;
    documents: Record<string, IndexedNodeDocument>;
  }> {
    const waited = await this.indexLock.waitForRelease();
    return {
      waited,
      ...(await this.loadState())
    };
  }

  async index(forceFull = false, docsPath?: string): Promise<IndexSummary> {
    const graphProvider = this.config.graphProvider;
    const embeddingProvider = this.config.embeddingProvider;
    const vectorStore = this.config.vectorStore;

    if (!graphProvider || !embeddingProvider || !vectorStore) {
      throw new IndexingError("CodeRag is missing required indexing dependencies.");
    }

    return this.indexLock.withLock("index", async () => {
      const { manifest: previousManifest } = await this.loadState();
      const snapshot = await buildGraphSnapshot(this.config.repoPath, graphProvider);
      const documents = await buildIndexedDocuments(snapshot, embeddingProvider, docsPath);
      const manifest = await buildIndexManifest(this.config.repoPath, snapshot, documents);
      const { removedNodeIds, changedNodeIds } = diffNodeIds(previousManifest, manifest);

      try {
        if (forceFull || !previousManifest) {
          await vectorStore.reset(Object.values(documents));
        } else {
          await vectorStore.deleteByNodeIds(removedNodeIds);
          await vectorStore.upsert(
            changedNodeIds
              .map((nodeId) => documents[nodeId])
              .filter((document): document is IndexedNodeDocument => Boolean(document))
          );
        }
      } catch (error) {
        throw new IndexingError("Failed to persist indexed documents to the vector store.", {
          repoPath: this.config.repoPath
        }, { cause: error });
      }

      await Promise.all([
        this.manifestStore.saveManifest(manifest),
        this.manifestStore.saveSnapshot(snapshot),
        this.manifestStore.saveDocuments(documents)
      ]);

      this.config.logger?.info("Indexed repository", {
        repoPath: path.resolve(this.config.repoPath),
        indexedNodeCount: Object.keys(documents).length,
        fullReindex: forceFull || !previousManifest
      });

      return buildIndexSummary(snapshot, manifest, documents);
    });
  }
}
