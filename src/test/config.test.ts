import fs from "node:fs/promises";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { ConfigurationError } from "../errors/index.js";
import { loadCodeRagConfig, loadSerializableConfig } from "../service/config.js";
import { cleanupPaths, createTempDir } from "./helpers.js";

const createdPaths: string[] = [];
const envKeys = [
  "CODERAG_REPO_PATH",
  "CODERAG_STORAGE_ROOT",
  "CODERAG_TOP_K",
  "CODERAG_RERANK_K",
  "CODERAG_MAX_CONTEXT_CHARS",
  "CODERAG_DEFAULT_DEPTH",
  "CODERAG_MAX_DEPTH",
  "CODERAG_LLM_ENABLED",
  "CODERAG_LLM_TRANSPORT",
  "CODERAG_LLM_BASE_URL",
  "CODERAG_LLM_MODEL",
  "CODERAG_LLM_API_KEY",
  "CODERAG_LLM_TIMEOUT_MS",
  "CODERAG_CUSTOM_HTTP_FORMAT",
  "CODERAG_LLM_HEADERS",
  "CODERAG_SERVICE_HOST",
  "CODERAG_SERVICE_PORT",
  "CODERAG_SERVICE_API_KEY",
  "CODERAG_LOCK_TIMEOUT_MS",
  "CODERAG_LOCK_POLL_MS",
  "CODERAG_LOCK_STALE_MS"
] as const;

afterEach(async () => {
  await cleanupPaths(createdPaths);
  for (const key of envKeys) {
    delete process.env[key];
  }
});

describe("config loading", () => {
  it("loads defaults when no config file exists", async () => {
    const cwd = await createTempDir("coderag-config-");
    createdPaths.push(cwd);

    const config = await loadSerializableConfig(cwd);

    expect(config.repoPath).toBe(cwd);
    expect(config.service.port).toBe(4119);
    expect(config.locking.timeoutMs).toBe(30000);
  });

  it("loads config files and environment overrides", async () => {
    const cwd = await createTempDir("coderag-config-");
    createdPaths.push(cwd);
    await fs.writeFile(
      path.join(cwd, "coderag.config.json"),
      JSON.stringify({
        repoPath: ".",
        storageRoot: ".coderag-data",
        retrieval: { topK: 4, rerankK: 2, maxContextChars: 4096 },
        traversal: { defaultDepth: 1, maxDepth: 2 },
        locking: { timeoutMs: 100, pollMs: 10, staleMs: 500 },
        service: { host: "127.0.0.1", port: 4120 },
        llm: { enabled: false, transport: "openai-compatible", timeoutMs: 1000, customHttpFormat: "json", headers: {} }
      }),
      "utf8"
    );

    process.env.CODERAG_TOP_K = "8";
    process.env.CODERAG_LLM_HEADERS = JSON.stringify({ "x-test": "1" });
    process.env.CODERAG_SERVICE_PORT = "5000";

    const config = await loadSerializableConfig(cwd);

    expect(config.retrieval.topK).toBe(8);
    expect(config.llm.headers["x-test"]).toBe("1");
    expect(config.service.port).toBe(5000);
  });

  it("supports fallback config filenames and ignores invalid numeric env overrides", async () => {
    const cwd = await createTempDir("coderag-config-");
    createdPaths.push(cwd);
    await fs.writeFile(
      path.join(cwd, ".coderag.json"),
      JSON.stringify({
        repoPath: ".",
        storageRoot: ".coderag",
        retrieval: { topK: 4, rerankK: 2, maxContextChars: 2048 },
        traversal: { defaultDepth: 1, maxDepth: 2 },
        locking: { timeoutMs: 100, pollMs: 10, staleMs: 100 },
        service: { host: "127.0.0.1", port: 4119 },
        llm: { enabled: false, transport: "openai-compatible", timeoutMs: 1000, customHttpFormat: "json", headers: {} }
      }),
      "utf8"
    );
    process.env.CODERAG_TOP_K = "not-a-number";

    const config = await loadSerializableConfig(cwd);
    expect(config.retrieval.topK).toBe(4);
  });

  it("supports explicit config paths and false boolean overrides", async () => {
    const cwd = await createTempDir("coderag-config-");
    createdPaths.push(cwd);
    const configPath = path.join(cwd, "custom.json");
    await fs.writeFile(
      configPath,
      JSON.stringify({
        repoPath: ".",
        storageRoot: ".coderag",
        retrieval: { topK: 4, rerankK: 2, maxContextChars: 2048 },
        traversal: { defaultDepth: 1, maxDepth: 2 },
        locking: { timeoutMs: 100, pollMs: 10, staleMs: 100 },
        service: { host: "127.0.0.1", port: 4119 },
        llm: {
          enabled: true,
          transport: "openai-compatible",
          baseUrl: "http://127.0.0.1:1234",
          model: "model",
          timeoutMs: 1000,
          customHttpFormat: "json",
          headers: {}
        }
      }),
      "utf8"
    );
    process.env.CODERAG_LLM_ENABLED = "false";

    const config = await loadSerializableConfig(cwd, "custom.json");
    expect(config.llm.enabled).toBe(false);
  });

  it("rejects invalid header overrides", async () => {
    const cwd = await createTempDir("coderag-config-");
    createdPaths.push(cwd);
    process.env.CODERAG_LLM_HEADERS = "[]";

    await expect(loadSerializableConfig(cwd)).rejects.toThrow(ConfigurationError);
  });

  it("validates rerank and traversal bounds at runtime", async () => {
    const cwd = await createTempDir("coderag-config-");
    createdPaths.push(cwd);
    await fs.writeFile(
      path.join(cwd, "coderag.config.json"),
      JSON.stringify({
        repoPath: ".",
        storageRoot: ".coderag",
        retrieval: { topK: 1, rerankK: 2, maxContextChars: 1024 },
        traversal: { defaultDepth: 5, maxDepth: 4 },
        locking: { timeoutMs: 100, pollMs: 10, staleMs: 100 },
        service: { host: "127.0.0.1", port: 4119 },
        llm: { enabled: false, transport: "openai-compatible", timeoutMs: 1000, customHttpFormat: "json", headers: {} }
      }),
      "utf8"
    );

    await expect(loadCodeRagConfig(cwd)).rejects.toThrow(ConfigurationError);
  });

  it("validates traversal bounds when rerank settings are otherwise valid", async () => {
    const cwd = await createTempDir("coderag-config-");
    createdPaths.push(cwd);
    await fs.writeFile(
      path.join(cwd, "coderag.config.json"),
      JSON.stringify({
        repoPath: ".",
        storageRoot: ".coderag",
        retrieval: { topK: 2, rerankK: 1, maxContextChars: 1024 },
        traversal: { defaultDepth: 5, maxDepth: 4 },
        locking: { timeoutMs: 100, pollMs: 10, staleMs: 100 },
        service: { host: "127.0.0.1", port: 4119 },
        llm: { enabled: false, transport: "openai-compatible", timeoutMs: 1000, customHttpFormat: "json", headers: {} }
      }),
      "utf8"
    );

    await expect(loadCodeRagConfig(cwd)).rejects.toThrow("traversal.defaultDepth");
  });

  it("creates runtime transports when llm config is enabled", async () => {
    const cwd = await createTempDir("coderag-config-");
    createdPaths.push(cwd);
    await fs.writeFile(
      path.join(cwd, "coderag.config.json"),
      JSON.stringify({
        repoPath: ".",
        storageRoot: ".coderag",
        retrieval: { topK: 2, rerankK: 1, maxContextChars: 1024 },
        traversal: { defaultDepth: 1, maxDepth: 2 },
        locking: { timeoutMs: 100, pollMs: 10, staleMs: 100 },
        service: { host: "127.0.0.1", port: 4119 },
        llm: {
          enabled: true,
          transport: "custom-http",
          baseUrl: "http://127.0.0.1:1234",
          model: "test-model",
          timeoutMs: 1000,
          customHttpFormat: "json",
          headers: {}
        }
      }),
      "utf8"
    );

    const config = await loadCodeRagConfig(cwd);
    expect(config.llmTransport?.kind).toBe("custom-http");
  });

  it("creates the OpenAI-compatible runtime transport when requested", async () => {
    const cwd = await createTempDir("coderag-config-");
    createdPaths.push(cwd);
    await fs.writeFile(
      path.join(cwd, "coderag.config.json"),
      JSON.stringify({
        repoPath: ".",
        storageRoot: ".coderag",
        retrieval: { topK: 2, rerankK: 1, maxContextChars: 1024 },
        traversal: { defaultDepth: 1, maxDepth: 2 },
        locking: { timeoutMs: 100, pollMs: 10, staleMs: 100 },
        service: { host: "127.0.0.1", port: 4119 },
        llm: {
          enabled: true,
          transport: "openai-compatible",
          baseUrl: "http://127.0.0.1:1234",
          model: "test-model",
          timeoutMs: 1000,
          customHttpFormat: "json",
          headers: {}
        }
      }),
      "utf8"
    );

    const config = await loadCodeRagConfig(cwd);
    expect(config.llmTransport?.kind).toBe("openai-compatible");
  });
});
