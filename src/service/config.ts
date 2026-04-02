import path from "node:path";

import type { CodeRagConfig, SerializableCodeRagConfig } from "../types.js";
import { CodeflowCoreGraphProvider } from "../adapters/codeflow-core.js";
import { ConfigurationError } from "../errors/index.js";
import { GeminiEmbeddingProvider } from "../indexer/gemini-embedder.js";
import { LocalHashEmbeddingProvider } from "../indexer/embedder.js";
import { CustomHttpTransport, OpenAiCompatibleTransport } from "../llm/transports.js";
import { LanceVectorStore } from "../store/vector-store.js";
import { fileExists, readJson, resolveWithin } from "../utils/filesystem.js";
import { createConsoleLogger } from "../utils/logger.js";
import {
  llmConfigSchema,
  lockingConfigSchema,
  serializableConfigSchema,
  serviceConfigSchema
} from "../types.js";

const CONFIG_FILES = ["coderag.config.json", ".coderag.json"];

const parseBoolean = (value: string | undefined): boolean | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return value === "1" || value.toLowerCase() === "true";
};

const parseNumber = (value: string | undefined): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseJsonRecord = (value: string | undefined): Record<string, string> | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = JSON.parse(value) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new ConfigurationError("CODERAG_LLM_HEADERS must be a JSON object.");
  }

  return Object.fromEntries(
    Object.entries(parsed).map(([key, entryValue]) => [key, String(entryValue)])
  );
};

const resolveConfigPath = async (cwd: string, configPath?: string): Promise<string | undefined> => {
  if (configPath) {
    return path.resolve(cwd, configPath);
  }

  const existingConfig = await Promise.all(
    CONFIG_FILES.map(async (candidate) => (await fileExists(path.join(cwd, candidate)) ? candidate : null))
  );
  const matchedConfig = existingConfig.find(Boolean);
  return matchedConfig ? path.resolve(cwd, matchedConfig) : undefined;
};

/**
 * Loads the serializable CodeRag config from disk and environment overrides.
 */
export const loadSerializableConfig = async (cwd: string, configPath?: string): Promise<SerializableCodeRagConfig> => {
  const resolvedConfigPath = await resolveConfigPath(cwd, configPath);
  const baseConfig = resolvedConfigPath
    ? serializableConfigSchema.parse(await readJson<SerializableCodeRagConfig>(resolvedConfigPath))
    : serializableConfigSchema.parse({ repoPath: cwd });
  const envHeaders = parseJsonRecord(process.env.CODERAG_LLM_HEADERS);

  return serializableConfigSchema.parse({
    ...baseConfig,
    repoPath: process.env.CODERAG_REPO_PATH ?? baseConfig.repoPath,
    storageRoot: process.env.CODERAG_STORAGE_ROOT ?? baseConfig.storageRoot,
    embedding: {
      ...baseConfig.embedding,
      provider: (process.env.CODERAG_EMBEDDING_PROVIDER as typeof baseConfig.embedding.provider) ?? baseConfig.embedding.provider,
      dimensions: parseNumber(process.env.CODERAG_EMBEDDING_DIMENSIONS) ?? baseConfig.embedding.dimensions,
      geminiModel: process.env.CODERAG_GEMINI_MODEL ?? baseConfig.embedding.geminiModel,
      timeoutMs: parseNumber(process.env.CODERAG_EMBEDDING_TIMEOUT_MS) ?? baseConfig.embedding.timeoutMs
    },
    retrieval: {
      ...baseConfig.retrieval,
      topK: parseNumber(process.env.CODERAG_TOP_K) ?? baseConfig.retrieval.topK,
      rerankK: parseNumber(process.env.CODERAG_RERANK_K) ?? baseConfig.retrieval.rerankK,
      maxContextChars: parseNumber(process.env.CODERAG_MAX_CONTEXT_CHARS) ?? baseConfig.retrieval.maxContextChars
    },
    traversal: {
      ...baseConfig.traversal,
      defaultDepth: parseNumber(process.env.CODERAG_DEFAULT_DEPTH) ?? baseConfig.traversal.defaultDepth,
      maxDepth: parseNumber(process.env.CODERAG_MAX_DEPTH) ?? baseConfig.traversal.maxDepth
    },
    locking: lockingConfigSchema.parse({
      ...baseConfig.locking,
      timeoutMs: parseNumber(process.env.CODERAG_LOCK_TIMEOUT_MS) ?? baseConfig.locking.timeoutMs,
      pollMs: parseNumber(process.env.CODERAG_LOCK_POLL_MS) ?? baseConfig.locking.pollMs,
      staleMs: parseNumber(process.env.CODERAG_LOCK_STALE_MS) ?? baseConfig.locking.staleMs
    }),
    service: serviceConfigSchema.parse({
      ...baseConfig.service,
      host: process.env.CODERAG_SERVICE_HOST ?? baseConfig.service.host,
      port: parseNumber(process.env.CODERAG_SERVICE_PORT) ?? baseConfig.service.port,
      apiKey: process.env.CODERAG_SERVICE_API_KEY ?? baseConfig.service.apiKey
    }),
    llm: llmConfigSchema.parse({
      ...baseConfig.llm,
      enabled: parseBoolean(process.env.CODERAG_LLM_ENABLED) ?? baseConfig.llm.enabled,
      transport: process.env.CODERAG_LLM_TRANSPORT ?? baseConfig.llm.transport,
      baseUrl: process.env.CODERAG_LLM_BASE_URL ?? baseConfig.llm.baseUrl,
      model: process.env.CODERAG_LLM_MODEL ?? baseConfig.llm.model,
      apiKey: process.env.CODERAG_LLM_API_KEY ?? baseConfig.llm.apiKey,
      timeoutMs: parseNumber(process.env.CODERAG_LLM_TIMEOUT_MS) ?? baseConfig.llm.timeoutMs,
      customHttpFormat: process.env.CODERAG_CUSTOM_HTTP_FORMAT ?? baseConfig.llm.customHttpFormat,
      headers: envHeaders ?? baseConfig.llm.headers
    })
  });
};

/**
 * Resolves the runtime dependencies needed to execute CodeRag.
 */
export const resolveRuntimeConfig = (config: SerializableCodeRagConfig, cwd: string): CodeRagConfig => {
  const repoPath = resolveWithin(cwd, config.repoPath);
  const storageRoot = resolveWithin(repoPath, config.storageRoot);
  const graphProvider = new CodeflowCoreGraphProvider();

  // Provide defaults when embedding config is missing (backward compatibility)
  const embeddingConfig = config.embedding ?? {
    provider: "local-hash" as const,
    dimensions: 256,
    geminiModel: "models/gemini-embedding-2-preview",
    timeoutMs: 30000
  };

  const embeddingProvider =
    embeddingConfig.provider === "gemini"
      ? new GeminiEmbeddingProvider({
          apiKey: process.env.CODERAG_GEMINI_API_KEY,
          model: embeddingConfig.geminiModel,
          timeoutMs: embeddingConfig.timeoutMs
        })
      : new LocalHashEmbeddingProvider(embeddingConfig.dimensions);
  const vectorStore = new LanceVectorStore(storageRoot);
  const llmTransport =
    config.llm.enabled && config.llm.baseUrl
      ? config.llm.transport === "custom-http"
        ? new CustomHttpTransport(config.llm)
        : new OpenAiCompatibleTransport(config.llm)
      : undefined;

  return {
    ...config,
    repoPath,
    storageRoot,
    logger: createConsoleLogger(),
    graphProvider,
    embeddingProvider,
    vectorStore,
    llmTransport
  };
};

/**
 * Loads and validates the full runtime config for the current working directory.
 */
export const loadCodeRagConfig = async (cwd: string, configPath?: string): Promise<CodeRagConfig> => {
  const serializableConfig = await loadSerializableConfig(cwd, configPath);
  const runtimeConfig = resolveRuntimeConfig(serializableConfig, cwd);

  if (runtimeConfig.retrieval.rerankK > runtimeConfig.retrieval.topK) {
    throw new ConfigurationError("retrieval.rerankK must be less than or equal to retrieval.topK.");
  }

  if (runtimeConfig.traversal.defaultDepth > runtimeConfig.traversal.maxDepth) {
    throw new ConfigurationError("traversal.defaultDepth must be less than or equal to traversal.maxDepth.");
  }

  return runtimeConfig;
};
