# Stage 4: Run Existing Tests

**Status:** PASS

```

> @abhinav2203/coderag@0.2.2 test
> vitest run


[1m[46m RUN [49m[22m [36mv4.1.0 [39m[90m/Users/abhinavnehra/git/CodeRag[39m

[90mstdout[2m | src/test/cli.test.ts[2m > [22m[2mCLI[2m > [22m[2mparses query flags while skipping empty arguments
[22m[39manswer

 [32m✓[39m src/test/cli.test.ts [2m([22m[2m17 tests[22m[2m)[22m[33m 476[2mms[22m[39m
 [32m✓[39m src/test/http-serve.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 155[2mms[22m[39m
 [32m✓[39m src/test/config.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 278[2mms[22m[39m
 [32m✓[39m src/test/vector-store.test.ts [2m([22m[2m7 tests[22m[2m)[22m[33m 537[2mms[22m[39m
 [32m✓[39m src/test/transports.test.ts [2m([22m[2m31 tests[22m[2m)[22m[33m 2813[2mms[22m[39m
     [33m[2m✓[22m[39m throws structured transport errors for unreachable servers [33m 626[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces final HTTP errors after exhausting retryable statuses [33m 507[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces SSE transport errors for non-OK responses [33m 499[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces NDJSON transport errors for non-OK responses [33m 596[2mms[22m[39m
 [32m✓[39m src/test/gemini-embedder.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 252[2mms[22m[39m
 [32m✓[39m src/test/git-hook.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 217[2mms[22m[39m
 [32m✓[39m src/test/index-lock.test.ts [2m([22m[2m11 tests[22m[2m)[22m[33m 445[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-zKRgQ4","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-zKRgQ4"}

[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mroutes incremental and full reindex requests to the correct index mode
[22m[39m{"level":"info","message":"Running incremental CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"none"}

[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mroutes incremental and full reindex requests to the correct index mode
[22m[39m{"level":"info","message":"Running full CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"none"}

 [32m✓[39m src/test/indexer.test.ts [2m([22m[2m8 tests[22m[2m)[22m[33m 3685[2mms[22m[39m
     [33m[2m✓[22m[39m wraps vector-store persistence failures with indexing context [33m 3427[2mms[22m[39m
[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2menforces bearer auth and validates request content types
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"789f210c-1928-4bf9-9ba9-346cd3c17397","method":"POST","pathname":"/v1/query","statusCode":415,"errorCode":"UNSUPPORTED_MEDIA_TYPE"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns structured not-found and validation errors
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"6ca4785b-73ca-4327-a951-e531277c864a","method":"POST","pathname":"/v1/lookup","statusCode":400,"errorCode":"INVALID_REQUEST"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mmaps thrown not-found errors to 404 responses
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"6cd7e7d3-c91f-41a9-94fc-5c45de4ca0de","method":"POST","pathname":"/v1/lookup","statusCode":404,"errorCode":"NOT_FOUND"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns request-too-large and internal-error responses
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"f0d0f02b-72b0-402a-bdd3-c51833aff1fb","method":"POST","pathname":"/v1/query","statusCode":413,"errorCode":"REQUEST_TOO_LARGE"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mrejects malformed JSON bodies with a 400 response
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"743f0312-b04a-4511-b764-e500a4ec19f1","method":"POST","pathname":"/v1/query","statusCode":400,"errorCode":"INVALID_REQUEST"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2msurfaces unexpected JSON parsing failures as internal errors
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"a5616f46-a976-4311-8eb4-4ab66378b9df","method":"POST","pathname":"/v1/query","statusCode":500,"errorCode":"INTERNAL_SERVER_ERROR"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns 400 errors for structured CodeRag errors and supports non-full index requests
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"d7babeae-fe30-4672-b153-e34e35348618","method":"POST","pathname":"/v1/lookup","statusCode":400,"errorCode":"BAD_REQUEST"}

 [32m✓[39m src/test/http.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 252[2mms[22m[39m
 [32m✓[39m src/test/documents.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 250[2mms[22m[39m
 [32m✓[39m src/test/mcp.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 138[2mms[22m[39m
 [32m✓[39m src/test/manifest-store.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 109[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-duCn8m","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-duCn8m"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Running incremental CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"local-hash:local-hash:256"}

 [32m✓[39m src/test/search.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 217[2mms[22m[39m
 [32m✓[39m src/test/text.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 52[2mms[22m[39m
 [32m✓[39m src/test/logger.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 29[2mms[22m[39m
 [32m✓[39m src/test/filesystem.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 230[2mms[22m[39m
 [32m✓[39m src/test/traversal.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/test/prompt.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m src/test/errors.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 26[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-duCn8m","indexedNodeCount":6,"fullReindex":false}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-duCn8m"}

 [32m✓[39m src/test/page-index.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 162[2mms[22m[39m
 [32m✓[39m src/test/context-builder.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 244[2mms[22m[39m
 [32m✓[39m src/test/onnx-embedder.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 27[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-2XDezQ","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-2XDezQ"}

 [32m✓[39m src/test/codeflow-core.test.ts [2m([22m[2m6 tests[22m[2m)[22m[33m 14734[2mms[22m[39m
     [33m[2m✓[22m[39m builds spans and call sites for tsconfig repositories [33m 2386[2mms[22m[39m
     [33m[2m✓[22m[39m supports repositories without tsconfig files and ignores excluded directories [33m 9109[2mms[22m[39m
     [33m[2m✓[22m[39m handles module nodes, method symbols, and missing files from custom providers [33m 1268[2mms[22m[39m
     [33m[2m✓[22m[39m covers call-site edge cases without crashing [33m 1919[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-OOcBHa","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-OOcBHa"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-vJ4YbH","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-vJ4YbH"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-tN5Zuy","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-tN5Zuy"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-puTrXv","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-puTrXv"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-hlepkM","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-hlepkM"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-jzhYgL","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-jzhYgL"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-loVZXz","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-loVZXz"}

 [32m✓[39m src/test/coderag.test.ts [2m([22m[2m16 tests[22m[2m)[22m[33m 20722[2mms[22m[39m
     [33m[2m✓[22m[39m indexes a repo and answers retrieval queries without an llm [33m 3267[2mms[22m[39m
     [33m[2m✓[22m[39m reindexes changed files and updates the retrieved graph state [33m 7658[2mms[22m[39m
     [33m[2m✓[22m[39m loads an existing index when querying a fresh instance [33m 3482[2mms[22m[39m
     [33m[2m✓[22m[39m uses the configured llm transport when answer generation is enabled [33m 1478[2mms[22m[39m
     [33m[2m✓[22m[39m throws structured not-found errors for unknown identifiers [33m 1301[2mms[22m[39m
     [33m[2m✓[22m[39m explains nodes and reports empty impact sets [33m 951[2mms[22m[39m
     [33m[2m✓[22m[39m fails when query execution is missing required runtime dependencies [33m 669[2mms[22m[39m
     [33m[2m✓[22m[39m automatically indexes on the first query when no persisted state exists [33m 713[2mms[22m[39m
     [33m[2m✓[22m[39m hydrates state after waiting for another index process to finish [33m 529[2mms[22m[39m
     [33m[2m✓[22m[39m explains leaf nodes with explicit none summaries [33m 638[2mms[22m[39m

[2m Test Files [22m [1m[32m25 passed[39m[22m[90m (25)[39m
[2m      Tests [22m [1m[32m203 passed[39m[22m[90m (203)[39m
[2m   Start at [22m 18:40:11
[2m   Duration [22m 23.41s[2m (transform 3.23s, setup 0ms, import 45.41s, tests 46.07s, environment 52ms)[22m
```
