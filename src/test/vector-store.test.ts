import { describe, expect, it } from "vitest";

import { LanceVectorStore, fromRow, toRow } from "../store/vector-store.js";
import { cleanupPaths, createTempDir } from "./helpers.js";

const record = {
  nodeId: "auth",
  name: "requireAuth",
  kind: "function" as const,
  filePath: "src/lib/auth.ts",
  summary: "Handles authentication.",
  signature: "requireAuth(): void",
  doc: "requireAuth handles authentication",
  vector: [1, 0, 0],
  startLine: 1,
  endLine: 4
};

describe("LanceVectorStore", () => {
  it("normalizes row shapes for storage and retrieval", () => {
    const storedRow = toRow({
      ...record,
      signature: undefined as unknown as string
    });

    expect(storedRow.signature).toBe("");
    expect(fromRow(storedRow).signature).toBe("");
    expect(
      fromRow({
        ...storedRow,
        signature: undefined
      }).signature
    ).toBe("");
    expect(fromRow({ ...storedRow, vector: new Float32Array([1, 0, 0]) }).vector).toEqual([1, 0, 0]);
  });

  it("returns empty results before the table exists", async () => {
    const storageRoot = await createTempDir("coderag-lancedb-");
    const store = new LanceVectorStore(storageRoot) as LanceVectorStore & {
      getAllRows: () => Promise<unknown[]>;
    };

    expect(await store.search([1, 0, 0], 1)).toEqual([]);
    expect(await store.get("missing")).toBeNull();
    expect(await store.getMany([])).toEqual([]);
    expect(await store.getAllRows()).toEqual([]);
    await store.reset([]);
    await store.deleteByNodeIds(["missing"]);
    await store.close();

    await cleanupPaths([storageRoot]);
  });

  it("resets, searches, reads, upserts, deletes, and closes the store", async () => {
    const storageRoot = await createTempDir("coderag-lancedb-");
    const store = new LanceVectorStore(storageRoot);

    await store.reset([record]);
    expect((await store.search([1, 0, 0], 1))[0]?.nodeId).toBe("auth");
    expect((await store.get("auth"))?.nodeId).toBe("auth");
    expect(await store.getMany(["auth"])).toHaveLength(1);

    await store.upsert([{ ...record, summary: "Updated authentication." }]);
    expect((await store.get("auth"))?.summary).toBe("Updated authentication.");

    await store.reset([{ ...record, summary: "Reset authentication." }]);
    expect((await store.get("auth"))?.summary).toBe("Reset authentication.");

    await store.deleteByNodeIds(["auth"]);
    expect(await store.get("auth")).toBeNull();

    await store.reset([]);
    await store.close();
    await cleanupPaths([storageRoot]);
  });

  it("upserts into a missing table, ignores empty upserts, and preserves undeleted rows", async () => {
    const storageRoot = await createTempDir("coderag-lancedb-");
    const store = new LanceVectorStore(storageRoot);
    const secondRecord = {
      ...record,
      nodeId: "session",
      name: "getSession",
      filePath: "src/lib/api.ts",
      summary: "Loads the current session."
    };

    await store.upsert([record]);
    await store.upsert([]);
    await store.upsert([secondRecord]);
    await store.deleteByNodeIds(["auth"]);

    expect((await store.get("session"))?.nodeId).toBe("session");
    expect(await store.get("auth")).toBeNull();

    await store.close();
    await cleanupPaths([storageRoot]);
  });
});
