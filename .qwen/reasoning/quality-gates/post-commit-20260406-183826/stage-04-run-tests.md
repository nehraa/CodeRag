# Stage 4: Run Existing Tests

**Status:** PASS

```

> @abhinav2203/coderag@0.2.1 test
> vitest run


[1m[46m RUN [49m[22m [36mv4.1.0 [39m[90m/Users/abhinavnehra/git/CodeRag[39m

[90mstdout[2m | src/test/cli.test.ts[2m > [22m[2mCLI[2m > [22m[2mparses query flags while skipping empty arguments
[22m[39manswer

 [32m✓[39m src/test/cli.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 257[2mms[22m[39m
 [32m✓[39m src/test/config.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 106[2mms[22m[39m
 [32m✓[39m src/test/vector-store.test.ts [2m([22m[2m7 tests[22m[2m)[22m[33m 368[2mms[22m[39m
 [32m✓[39m src/test/http-serve.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 144[2mms[22m[39m
 [32m✓[39m src/test/index-lock.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 205[2mms[22m[39m
 [32m✓[39m src/test/gemini-embedder.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 165[2mms[22m[39m
 [32m✓[39m src/test/transports.test.ts [2m([22m[2m31 tests[22m[2m)[22m[33m 2661[2mms[22m[39m
     [33m[2m✓[22m[39m throws structured transport errors for unreachable servers [33m 666[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces final HTTP errors after exhausting retryable statuses [33m 522[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces SSE transport errors for non-OK responses [33m 507[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces NDJSON transport errors for non-OK responses [33m 534[2mms[22m[39m
[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mroutes incremental and full reindex requests to the correct index mode
[22m[39m{"level":"info","message":"Running incremental CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"none"}

[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mroutes incremental and full reindex requests to the correct index mode
[22m[39m{"level":"info","message":"Running full CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"none"}

 [32m✓[39m src/test/indexer.test.ts [2m([22m[2m8 tests[22m[2m)[22m[33m 2203[2mms[22m[39m
     [33m[2m✓[22m[39m wraps vector-store persistence failures with indexing context [33m 2046[2mms[22m[39m
[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2menforces bearer auth and validates request content types
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"1a7e5c91-6d10-441e-a77f-4c4fb7c8b3cf","method":"POST","pathname":"/v1/query","statusCode":415,"errorCode":"UNSUPPORTED_MEDIA_TYPE"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns structured not-found and validation errors
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"3e759b92-162e-423d-841f-fda215183e35","method":"POST","pathname":"/v1/lookup","statusCode":400,"errorCode":"INVALID_REQUEST"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mmaps thrown not-found errors to 404 responses
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"dceddd0a-925e-4cbf-a1ff-3be8dcf5eb79","method":"POST","pathname":"/v1/lookup","statusCode":404,"errorCode":"NOT_FOUND"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns request-too-large and internal-error responses
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"35de800b-04aa-4d86-b131-5249872550f1","method":"POST","pathname":"/v1/query","statusCode":413,"errorCode":"REQUEST_TOO_LARGE"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mrejects malformed JSON bodies with a 400 response
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"09664db6-3f5e-4549-9bb9-fd1abd002044","method":"POST","pathname":"/v1/query","statusCode":400,"errorCode":"INVALID_REQUEST"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2msurfaces unexpected JSON parsing failures as internal errors
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"eb31a755-725d-4d43-a965-a53604b76947","method":"POST","pathname":"/v1/query","statusCode":500,"errorCode":"INTERNAL_SERVER_ERROR"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns 400 errors for structured CodeRag errors and supports non-full index requests
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"adc63297-b455-4d06-bf7f-8ab95bcdfe40","method":"POST","pathname":"/v1/lookup","statusCode":400,"errorCode":"BAD_REQUEST"}

 [32m✓[39m src/test/http.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 240[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-3z8bNA","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-3z8bNA"}

 [32m✓[39m src/test/filesystem.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 25[2mms[22m[39m
 [32m✓[39m src/test/mcp.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 69[2mms[22m[39m
 [32m✓[39m src/test/documents.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 142[2mms[22m[39m
 [32m✓[39m src/test/git-hook.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 59[2mms[22m[39m
 [32m✓[39m src/test/search.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 34[2mms[22m[39m
 [32m✓[39m src/test/text.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/test/logger.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 15[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-8T8mz0","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-8T8mz0"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Running incremental CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"local-hash:local-hash:256"}

 [32m✓[39m src/test/manifest-store.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 130[2mms[22m[39m
 [32m✓[39m src/test/prompt.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 30[2mms[22m[39m
 [32m✓[39m src/test/traversal.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 51[2mms[22m[39m
 [32m✓[39m src/test/context-builder.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 164[2mms[22m[39m
 [32m✓[39m src/test/errors.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/test/page-index.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 35[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-8T8mz0","indexedNodeCount":6,"fullReindex":false}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-8T8mz0"}

 [32m✓[39m src/test/onnx-embedder.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/test/codeflow-core.test.ts [2m([22m[2m6 tests[22m[2m)[22m[33m 7238[2mms[22m[39m
     [33m[2m✓[22m[39m builds spans and call sites for tsconfig repositories [33m 1976[2mms[22m[39m
     [33m[2m✓[22m[39m supports repositories without tsconfig files and ignores excluded directories [33m 4360[2mms[22m[39m
     [33m[2m✓[22m[39m handles module nodes, method symbols, and missing files from custom providers [33m 496[2mms[22m[39m
     [33m[2m✓[22m[39m covers call-site edge cases without crashing [33m 384[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-CG0al4","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-CG0al4"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-NLBl96","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-NLBl96"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-AqAwa8","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-AqAwa8"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-IJxltm","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-IJxltm"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-jLdfND","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-jLdfND"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-DPIuTG","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-DPIuTG"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-zNKXsj","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-zNKXsj"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-tZDktK","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-tZDktK"}

 [32m✓[39m src/test/coderag.test.ts [2m([22m[2m16 tests[22m[2m)[22m[33m 19177[2mms[22m[39m
     [33m[2m✓[22m[39m indexes a repo and answers retrieval queries without an llm [33m 2723[2mms[22m[39m
     [33m[2m✓[22m[39m reindexes changed files and updates the retrieved graph state [33m 3309[2mms[22m[39m
     [33m[2m✓[22m[39m loads an existing index when querying a fresh instance [33m 952[2mms[22m[39m
     [33m[2m✓[22m[39m uses the configured llm transport when answer generation is enabled [33m 709[2mms[22m[39m
     [33m[2m✓[22m[39m throws structured not-found errors for unknown identifiers [33m 2102[2mms[22m[39m
     [33m[2m✓[22m[39m explains nodes and reports empty impact sets [33m 2131[2mms[22m[39m
     [33m[2m✓[22m[39m fails when query execution is missing required runtime dependencies [33m 2282[2mms[22m[39m
     [33m[2m✓[22m[39m automatically indexes on the first query when no persisted state exists [33m 2042[2mms[22m[39m
     [33m[2m✓[22m[39m hydrates state after waiting for another index process to finish [33m 1757[2mms[22m[39m
     [33m[2m✓[22m[39m explains leaf nodes with explicit none summaries [33m 1121[2mms[22m[39m

[2m Test Files [22m [1m[32m25 passed[39m[22m[90m (25)[39m
[2m      Tests [22m [1m[32m203 passed[39m[22m[90m (203)[39m
[2m   Start at [22m 18:38:33
[2m   Duration [22m 21.29s[2m (transform 1.65s, setup 0ms, import 26.26s, tests 33.55s, environment 6ms)[22m
```
