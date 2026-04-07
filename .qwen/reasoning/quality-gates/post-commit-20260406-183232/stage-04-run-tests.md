# Stage 4: Run Existing Tests

**Status:** PASS

## Test Output
```

> @abhinav2203/coderag@0.2.1 test
> vitest run


[1m[46m RUN [49m[22m [36mv4.1.0 [39m[90m/Users/abhinavnehra/git/CodeRag[39m

[90mstdout[2m | src/test/cli.test.ts[2m > [22m[2mCLI[2m > [22m[2mparses query flags while skipping empty arguments
[22m[39manswer

 [32m✓[39m src/test/cli.test.ts [2m([22m[2m17 tests[22m[2m)[22m[33m 427[2mms[22m[39m
 [32m✓[39m src/test/index-lock.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 227[2mms[22m[39m
 [32m✓[39m src/test/vector-store.test.ts [2m([22m[2m7 tests[22m[2m)[22m[33m 323[2mms[22m[39m
 [32m✓[39m src/test/gemini-embedder.test.ts [2m([22m[2m15 tests[22m[2m)[22m[33m 303[2mms[22m[39m
 [32m✓[39m src/test/http-serve.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 238[2mms[22m[39m
 [32m✓[39m src/test/config.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 159[2mms[22m[39m
 [32m✓[39m src/test/transports.test.ts [2m([22m[2m31 tests[22m[2m)[22m[33m 3030[2mms[22m[39m
     [33m[2m✓[22m[39m throws structured transport errors for unreachable servers [33m 580[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces final HTTP errors after exhausting retryable statuses [33m 571[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces SSE transport errors for non-OK responses [33m 474[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces NDJSON transport errors for non-OK responses [33m 736[2mms[22m[39m
 [32m✓[39m src/test/mcp.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 134[2mms[22m[39m
[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mroutes incremental and full reindex requests to the correct index mode
[22m[39m{"level":"info","message":"Running incremental CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"none"}

[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mroutes incremental and full reindex requests to the correct index mode
[22m[39m{"level":"info","message":"Running full CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"none"}

 [32m✓[39m src/test/indexer.test.ts [2m([22m[2m8 tests[22m[2m)[22m[33m 3539[2mms[22m[39m
     [33m[2m✓[22m[39m wraps vector-store persistence failures with indexing context [33m 3336[2mms[22m[39m
[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2menforces bearer auth and validates request content types
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"77e07521-e8e3-45e0-a588-821beecc4f35","method":"POST","pathname":"/v1/query","statusCode":415,"errorCode":"UNSUPPORTED_MEDIA_TYPE"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns structured not-found and validation errors
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"8ec03ac2-ac1b-4f4b-9ccf-cc74dd6a3101","method":"POST","pathname":"/v1/lookup","statusCode":400,"errorCode":"INVALID_REQUEST"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mmaps thrown not-found errors to 404 responses
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"58f8d60c-2a64-4f26-a285-eb00a36ca27e","method":"POST","pathname":"/v1/lookup","statusCode":404,"errorCode":"NOT_FOUND"}

 [32m✓[39m src/test/search.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 28[2mms[22m[39m
[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns request-too-large and internal-error responses
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"d0c9d488-6c7e-4187-864d-8094748e17b9","method":"POST","pathname":"/v1/query","statusCode":413,"errorCode":"REQUEST_TOO_LARGE"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mrejects malformed JSON bodies with a 400 response
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"d8671523-da55-43fd-9894-49e738bcf34b","method":"POST","pathname":"/v1/query","statusCode":400,"errorCode":"INVALID_REQUEST"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2msurfaces unexpected JSON parsing failures as internal errors
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"25e946df-3e25-458a-87f1-761a5f25d18c","method":"POST","pathname":"/v1/query","statusCode":500,"errorCode":"INTERNAL_SERVER_ERROR"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns 400 errors for structured CodeRag errors and supports non-full index requests
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"7a718929-e7a3-448e-beb6-d54716a6024f","method":"POST","pathname":"/v1/lookup","statusCode":400,"errorCode":"BAD_REQUEST"}

 [32m✓[39m src/test/http.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 131[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-UJ5H61","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-UJ5H61"}

 [32m✓[39m src/test/documents.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 114[2mms[22m[39m
 [32m✓[39m src/test/git-hook.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 116[2mms[22m[39m
 [32m✓[39m src/test/logger.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 19[2mms[22m[39m
 [32m✓[39m src/test/text.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 13[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-yh3KJ7","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-yh3KJ7"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Running incremental CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"local-hash:local-hash:256"}

 [32m✓[39m src/test/filesystem.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 144[2mms[22m[39m
 [32m✓[39m src/test/context-builder.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 56[2mms[22m[39m
 [32m✓[39m src/test/manifest-store.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 32[2mms[22m[39m
 [32m✓[39m src/test/traversal.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 32[2mms[22m[39m
 [32m✓[39m src/test/prompt.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 31[2mms[22m[39m
 [32m✓[39m src/test/page-index.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 104[2mms[22m[39m
 [32m✓[39m src/test/errors.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m src/test/onnx-embedder.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 9[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-yh3KJ7","indexedNodeCount":6,"fullReindex":false}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-yh3KJ7"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-Z08LXk","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-Z08LXk"}

 [32m✓[39m src/test/codeflow-core.test.ts [2m([22m[2m6 tests[22m[2m)[22m[33m 9162[2mms[22m[39m
     [33m[2m✓[22m[39m builds spans and call sites for tsconfig repositories [33m 3440[2mms[22m[39m
     [33m[2m✓[22m[39m supports repositories without tsconfig files and ignores excluded directories [33m 4919[2mms[22m[39m
     [33m[2m✓[22m[39m handles module nodes, method symbols, and missing files from custom providers [33m 438[2mms[22m[39m
     [33m[2m✓[22m[39m covers call-site edge cases without crashing [33m 356[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-MVEiVg","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-MVEiVg"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-hgHSFb","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-hgHSFb"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-4AYZ25","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-4AYZ25"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-KufhBI","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-KufhBI"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-ujUEiM","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-ujUEiM"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-wyndkl","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-wyndkl"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-QET01T","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-QET01T"}

 [32m✓[39m src/test/coderag.test.ts [2m([22m[2m16 tests[22m[2m)[22m[33m 11139[2mms[22m[39m
     [33m[2m✓[22m[39m indexes a repo and answers retrieval queries without an llm [33m 3757[2mms[22m[39m
     [33m[2m✓[22m[39m reindexes changed files and updates the retrieved graph state [33m 4119[2mms[22m[39m
     [33m[2m✓[22m[39m loads an existing index when querying a fresh instance [33m 873[2mms[22m[39m
     [33m[2m✓[22m[39m uses the configured llm transport when answer generation is enabled [33m 445[2mms[22m[39m
     [33m[2m✓[22m[39m throws structured not-found errors for unknown identifiers [33m 412[2mms[22m[39m
     [33m[2m✓[22m[39m explains nodes and reports empty impact sets [33m 343[2mms[22m[39m

[2m Test Files [22m [1m[32m25 passed[39m[22m[90m (25)[39m
[2m      Tests [22m [1m[32m203 passed[39m[22m[90m (203)[39m
[2m   Start at [22m 18:32:39
[2m   Duration [22m 13.58s[2m (transform 2.82s, setup 0ms, import 33.51s, tests 29.52s, environment 16ms)[22m
```
