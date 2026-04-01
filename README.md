# CodeRag

CodeRag is a standalone npm package that gives coding agents targeted retrieval over a JavaScript or TypeScript repository. It uses `@abhinav2203/codeflow-core` for repo analysis, stores node documents in LanceDB, traverses graph edges for surrounding context, and can optionally ask a local LLM server to turn the retrieved context into an answer.

## What ships in this repo

- Library API for indexing and querying a repo
- CLI for local setup, indexing, querying, and git hook installation
- MCP server exposing `query`, `lookup`, `explain`, `impact`, and `status`
- Easy-to-swap interfaces for graph providers and LLM transports

## Install

```bash
npm install @abhinav2203/coderag
```

## Quick start

1. Create a config file in the target repo:

```json
{
  "repoPath": ".",
  "storageRoot": ".coderag",
  "retrieval": {
    "topK": 6,
    "rerankK": 3
  },
  "traversal": {
    "defaultDepth": 1,
    "maxDepth": 3
  },
  "llm": {
    "enabled": false,
    "transport": "openai-compatible",
    "baseUrl": "http://127.0.0.1:1234/v1",
    "model": "your-local-model"
  }
}
```

2. Initialize the index:

```bash
npx coderag init
```

3. Query the repo:

```bash
npx coderag query "where is auth handled?"
```

4. Run the MCP server:

```bash
npx coderag serve-mcp
```

## Configuration

CodeRag loads configuration in this order:

1. Explicit `--config` path
2. `coderag.config.json`
3. `.coderag.json`
4. Environment overrides

Supported environment overrides:

- `CODERAG_REPO_PATH`
- `CODERAG_STORAGE_ROOT`
- `CODERAG_TOP_K`
- `CODERAG_RERANK_K`
- `CODERAG_DEFAULT_DEPTH`
- `CODERAG_MAX_DEPTH`
- `CODERAG_LLM_ENABLED`
- `CODERAG_LLM_TRANSPORT`
- `CODERAG_LLM_BASE_URL`
- `CODERAG_LLM_MODEL`
- `CODERAG_LLM_API_KEY`
- `CODERAG_LLM_TIMEOUT_MS`
- `CODERAG_CUSTOM_HTTP_FORMAT`

## Local LLM integration

CodeRag does not require a hosted model. The default documented path is any local or self-hosted model server that exposes an OpenAI-compatible HTTP API on a port.

### OpenAI-compatible server

Point CodeRag at a server that exposes `/v1/chat/completions` and streams tokens over SSE.

```json
{
  "llm": {
    "enabled": true,
    "transport": "openai-compatible",
    "baseUrl": "http://127.0.0.1:1234/v1",
    "model": "qwen2.5-coder-14b-instruct"
  }
}
```

CodeRag sends:

- the user question
- the assembled CodeRag context package
- a system prompt that tells the model to answer only from retrieved code context

Compatibility notes:

- `baseUrl` may already include `/v1`; CodeRag preserves that path when calling `/chat/completions`.
- If a provider rejects `system` role messages, CodeRag retries by folding the system prompt into the first user message.
- Prompt assembly is compact and file-aware so small-context local models can still answer from retrieved code without receiving duplicated file bodies.

### Custom HTTP server

If your local model server is not OpenAI-compatible, use `transport: "custom-http"`.

Request body:

```json
{
  "question": "where is auth handled?",
  "model": "local-model",
  "stream": true,
  "context": {
    "graphSummary": "..."
  },
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ]
}
```

Supported response formats:

- `json`: `{ "answer": "..." }`
- `ndjson`: one JSON object per line with `token` chunks and an optional final `answer`
- `sse`: `data:` frames with `token` chunks and an optional final `answer`

Example:

```json
{
  "llm": {
    "enabled": true,
    "transport": "custom-http",
    "baseUrl": "http://127.0.0.1:8080",
    "model": "local-model",
    "customHttpFormat": "ndjson"
  }
}
```

## Retrieval behavior

- Indexing stores one generated markdown document per blueprint node.
- Search uses deterministic local embeddings, source-span-aware lexical reranking, query expansion for operational terms, and a penalty for oversized catch-all nodes.
- Page index retrieval reads full files from disk and caches them by `mtimeMs`.
- Graph traversal expands both upstream and downstream neighbors up to the requested depth.
- If no LLM is configured, `query` returns `answerMode: "context-only"` with the same context package.

## CLI

```bash
coderag init [--config path]
coderag index [--config path]
coderag reindex [--config path] [--full]
coderag query "question" [--config path] [--depth 2] [--json]
coderag serve-mcp [--config path]
coderag doctor [--config path]
```

## Git hook

`coderag init` installs a `post-commit` hook that triggers `coderag reindex` and preserves any pre-existing hook logic.

## Production notes

- JavaScript and TypeScript repos are supported.
- Call-site extraction is best effort for dynamic dispatch, reflection, or generated code. Missing call sites are returned as unresolved metadata, not guessed values.
- The built-in embedding strategy is deterministic and zero-setup. If you need stronger semantic recall, provide a custom embedding provider through the library API.
- Live E2E runs in this repo were verified against an OpenAI-compatible NVIDIA endpoint and against both the CodeRag and CodeFlow repositories.

## Development

```bash
npm install
npm run lint
npm run check
npm test
npm run build
```
