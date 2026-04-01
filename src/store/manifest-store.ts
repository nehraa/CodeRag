import path from "node:path";

import { IndexingError } from "../errors/index.js";
import type { GraphSnapshot, IndexManifest, IndexedNodeDocument } from "../types.js";
import { fileExists, readJson, writeJson } from "../utils/filesystem.js";

const MANIFEST_FILE = "index-manifest.json";
const SNAPSHOT_FILE = "graph-snapshot.json";
const DOCUMENTS_FILE = "documents.json";

const loadOptionalJson = async <Value>(filePath: string): Promise<Value | null> => {
  if (!(await fileExists(filePath))) {
    return null;
  }

  try {
    return await readJson<Value>(filePath);
  } catch (error) {
    throw new IndexingError("Failed to read persisted CodeRag state.", { filePath }, { cause: error });
  }
};

/**
 * Persists the graph snapshot, manifest, and node documents used by CodeRag.
 */
export class ManifestStore {
  private readonly manifestPath: string;
  private readonly snapshotPath: string;
  private readonly documentsPath: string;

  constructor(storageRoot: string) {
    this.manifestPath = path.join(storageRoot, MANIFEST_FILE);
    this.snapshotPath = path.join(storageRoot, SNAPSHOT_FILE);
    this.documentsPath = path.join(storageRoot, DOCUMENTS_FILE);
  }

  async loadManifest(): Promise<IndexManifest | null> {
    return loadOptionalJson<IndexManifest>(this.manifestPath);
  }

  async saveManifest(manifest: IndexManifest): Promise<void> {
    await writeJson(this.manifestPath, manifest);
  }

  async loadSnapshot(): Promise<GraphSnapshot | null> {
    return loadOptionalJson<GraphSnapshot>(this.snapshotPath);
  }

  async saveSnapshot(snapshot: GraphSnapshot): Promise<void> {
    await writeJson(this.snapshotPath, snapshot);
  }

  async loadDocuments(): Promise<Record<string, IndexedNodeDocument>> {
    return (await loadOptionalJson<Record<string, IndexedNodeDocument>>(this.documentsPath)) ?? {};
  }

  async saveDocuments(documents: Record<string, IndexedNodeDocument>): Promise<void> {
    await writeJson(this.documentsPath, documents);
  }
}
