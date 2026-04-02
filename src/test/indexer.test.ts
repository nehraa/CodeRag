import { describe, expect, it } from "vitest";

import { IndexingError } from "../errors/index.js";
import { RepoIndexer } from "../indexer/indexer.js";
import { cleanupPaths, createRuntimeConfig, createTempRepo } from "./helpers.js";

describe("RepoIndexer", () => {
  it("reports unlocked state when no index is in progress", async () => {
    const repoPath = await createTempRepo();
    const indexer = new RepoIndexer(createRuntimeConfig(repoPath));

    const state = await indexer.waitForUnlockedState();
    expect(state.waited).toBe(false);

    await cleanupPaths([repoPath]);
  });

  it("fails fast when required dependencies are missing", async () => {
    const repoPath = await createTempRepo();
    const config = createRuntimeConfig(repoPath);
    config.graphProvider = undefined;
    const indexer = new RepoIndexer(config);

    await expect(indexer.index()).rejects.toThrow(IndexingError);
    await cleanupPaths([repoPath]);
  });

  it("wraps vector-store persistence failures with indexing context", async () => {
    const repoPath = await createTempRepo();
    const config = createRuntimeConfig(repoPath);
    config.vectorStore = {
      async reset() {
        throw new Error("boom");
      },
      async deleteByNodeIds() {},
      async upsert() {},
      async search() {
        return [];
      },
      async get() {
        return null;
      },
      async getMany() {
        return [];
      },
      async close() {},
      async getMetadata() {
        return null;
      },
      async setMetadata() {},
      async clear() {}
    };
    const indexer = new RepoIndexer(config);

    await expect(indexer.index()).rejects.toThrow(IndexingError);
    await cleanupPaths([repoPath]);
  });
});
