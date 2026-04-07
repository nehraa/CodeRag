# Stage 2: Security Analysis

**Status:** FAIL

## Findings

### 1. [P2 — MEDIUM] — src/indexer/test-embedder-config.ts:23 — Missing type imports for `Embedder`, `OpenAIEmbedder`, `GeminiEmbedder`

**Description:** The `createEmbedder` function references types `Embedder`, `OpenAIEmbedder`, and `GeminiEmbedder` that are not imported anywhere in this file. This file will fail TypeScript compilation, which means:
- The module cannot be built or shipped
- If a developer adds stub implementations to make it compile, there is no guarantee those implementations follow secure patterns established elsewhere in the codebase (e.g., `GeminiEmbeddingProvider` handles API key resolution securely via environment variables)
- The `CodeRagConfig` interface defined here has `embedding.provider` and `llm.provider` typed as `string` instead of a discriminated union or validated enum, allowing any arbitrary string to pass type-checking

**Remediation:**
```typescript
import type { EmbeddingProvider } from "../types.js";
// Import or define concrete embedder classes, or use the existing ones:
import { GeminiEmbeddingProvider } from "./gemini-embedder.js";

// Narrow the provider type to known literals:
export interface CodeRagConfig {
  embedding: {
    provider: "openai" | "gemini";
    model: string;
    dimensions: number;
  };
  llm: {
    provider: "openai-compatible" | "custom-http";
    model: string;
    baseUrl?: string;
  };
}
```

### 2. [P2 — MEDIUM] — src/indexer/test-embedder-config.ts:25-26 — API key not passed to embedder constructors

**Description:** The `createEmbedder` function instantiates `OpenAIEmbedder` and `GeminiEmbedder` with only `model` and `dimensions` parameters. No API key is passed. Looking at the existing `GeminiEmbeddingProvider` class (in `gemini-embedder.ts`), it resolves API keys from `config.apiKey` or environment variables (`CODERAG_GEMINI_API_KEY`). If the new `OpenAIEmbedder`/`GeminiEmbedder` classes follow a similar pattern but the `CodeRagConfig` interface has no `apiKey` field, then:
- API key resolution may fail silently or throw at runtime
- Developers might be tempted to hardcode keys inline to make it work
- There is no secure path for passing API keys through this config interface

**Remediation:**
```typescript
export interface CodeRagConfig {
  embedding: {
    provider: "openai" | "gemini";
    model: string;
    dimensions: number;
    apiKey?: string; // Allow explicit key override
  };
  llm: {
    provider: string;
    model: string;
    baseUrl?: string;
    apiKey?: string;
  };
}

export function createEmbedder(config: CodeRagConfig): EmbeddingProvider {
  switch (config.embedding.provider) {
    case 'openai':
      return new OpenAIEmbedder({
        model: config.embedding.model,
        dimensions: config.embedding.dimensions,
        apiKey: config.embedding.apiKey
      });
    case 'gemini':
      return new GeminiEmbeddingProvider({
        model: config.embedding.model,
        apiKey: config.embedding.apiKey,
        timeoutMs: 30000
      });
    default:
      throw new Error(`Unknown embedder: ${config.embedding.provider}`);
  }
}
```

### 3. [P3 — LOW] — src/indexer/test-embedder-config.ts:1-33 — File header claims config loader but no loading logic exists

**Description:** The file's JSDoc comment states "Reads coderag.config.json and merges with .env variables" but the file contains only a type definition and a factory function — no actual config loading, `.env` parsing, or file I/O. This is misleading and could lead developers to assume config loading (including secure secret loading from `.env`) is happening here when it is not. If someone adds `.env` loading logic later without proper sanitization, it introduces risk.

**Remediation:** Update the file header to accurately describe what the file does, or implement the documented config loading with proper validation:
```typescript
/**
 * Embedder configuration and factory.
 * Defines the CodeRagConfig shape and creates embedder instances.
 * Note: Actual config loading from coderag.config.json/.env is handled
 * by src/service/config.ts — this module only provides the factory.
 */
```

### 4. [P3 — LOW] — src/indexer/test-embedder-config.ts:29 — Unvalidated provider string used in template literal error

**Description:** The default case throws `new Error(\`Unknown embedder: ${config.embedding.provider}\`)`. Since `provider` is typed as `string`, any value including malicious or very long strings could be passed in. While this is a low risk (error messages are typically logged, not rendered), it's a minor injection surface if the error propagates to an HTTP response or log aggregation system.

**Remediation:**
```typescript
default: {
  const safeProvider = String(config.embedding.provider).slice(0, 128);
  throw new Error(`Unknown embedder: ${safeProvider}`);
}
```

## Checks Performed

| Check | Result |
|-------|--------|
| Hardcoded secrets (API keys, passwords, tokens) | ✅ None found |
| Injection risks (SQL, command, XSS) | ⚠️ Minor: unvalidated string in error message (P3) |
| Dangerous functions (eval, exec, child_process) | ✅ None found |
| Authentication/authorization gaps | ⚠️ No API key field in config interface (P2) |
| Unsafe patterns (path traversal, SSRF, deserialization) | ✅ None found |
| Secret exposure (keys in URLs, logs, serializable secrets) | ✅ None in this file; but no secure key-passing path exists (P2) |
| Missing input validation | ⚠️ Provider typed as `string` instead of discriminated union (P2) |
| Dependency vulnerabilities | ✅ No new dependencies added; file is pure TypeScript |
| TypeScript compilation correctness | ❌ Missing imports for `Embedder`, `OpenAIEmbedder`, `GeminiEmbedder` |

## Summary

The changed file (`src/indexer/test-embedder-config.ts`) introduces an embedder factory function and config interface but has **three actionable findings**:

1. **Missing type imports** — The file references `Embedder`, `OpenAIEmbedder`, and `GeminiEmbedder` without importing them, causing compilation failure.
2. **No API key pathway** — The `CodeRagConfig` interface lacks `apiKey` fields, meaning there is no secure way to pass credentials to embedder instances through this interface. This could lead to runtime failures or insecure workarounds.
3. **Broad string types** — Provider fields typed as `string` instead of literal unions reduce type safety and allow invalid values to pass compile-time checks.

No hardcoded secrets, dangerous function calls, or critical injection vulnerabilities were found. The issues are structural and would prevent the code from compiling or functioning correctly in production.
