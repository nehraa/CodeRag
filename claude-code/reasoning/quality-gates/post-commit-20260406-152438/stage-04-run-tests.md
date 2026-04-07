# Stage 4: Run Existing Tests

**Status:** FAIL

## Test Output
```

> @abhinav2203/coderag@0.2.1 test
> vitest run


[1m[46m RUN [49m[22m [36mv4.1.0 [39m[90m/Users/abhinavnehra/git/CodeRag[39m

[90mstdout[2m | src/test/cli.test.ts[2m > [22m[2mCLI[2m > [22m[2mparses query flags while skipping empty arguments
[22m[39manswer

 [32m✓[39m src/test/cli.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 238[2mms[22m[39m
 [32m✓[39m src/test/config.test.ts [2m([22m[2m14 tests[22m[2m)[22m[32m 139[2mms[22m[39m
 [32m✓[39m src/test/vector-store.test.ts [2m([22m[2m7 tests[22m[2m)[22m[33m 411[2mms[22m[39m
 [32m✓[39m src/test/index-lock.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 165[2mms[22m[39m
 [32m✓[39m src/test/http-serve.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 117[2mms[22m[39m
 [32m✓[39m src/test/gemini-embedder.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 104[2mms[22m[39m
 [32m✓[39m src/test/transports.test.ts [2m([22m[2m31 tests[22m[2m)[22m[33m 2739[2mms[22m[39m
     [33m[2m✓[22m[39m throws structured transport errors for unreachable servers [33m 530[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces final HTTP errors after exhausting retryable statuses [33m 638[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces SSE transport errors for non-OK responses [33m 556[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces NDJSON transport errors for non-OK responses [33m 491[2mms[22m[39m
[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mroutes incremental and full reindex requests to the correct index mode
[22m[39m{"level":"info","message":"Running incremental CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"none"}

[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mroutes incremental and full reindex requests to the correct index mode
[22m[39m{"level":"info","message":"Running full CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"none"}

 [32m✓[39m src/test/indexer.test.ts [2m([22m[2m8 tests[22m[2m)[22m[33m 2072[2mms[22m[39m
     [33m[2m✓[22m[39m wraps vector-store persistence failures with indexing context [33m 1912[2mms[22m[39m
[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2menforces bearer auth and validates request content types
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"a58ca89f-df14-40d2-acc5-91175c5927fb","method":"POST","pathname":"/v1/query","statusCode":415,"errorCode":"UNSUPPORTED_MEDIA_TYPE"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns structured not-found and validation errors
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"5bba4712-b467-42c9-884a-ad49a9317167","method":"POST","pathname":"/v1/lookup","statusCode":400,"errorCode":"INVALID_REQUEST"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mmaps thrown not-found errors to 404 responses
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"5bb0a792-e874-4b95-bbd3-0a6c22466b85","method":"POST","pathname":"/v1/lookup","statusCode":404,"errorCode":"NOT_FOUND"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns request-too-large and internal-error responses
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"4af47d50-1317-454c-9195-97c641d96596","method":"POST","pathname":"/v1/query","statusCode":413,"errorCode":"REQUEST_TOO_LARGE"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mrejects malformed JSON bodies with a 400 response
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"bff0aa3e-8c2e-4859-9863-3e84ce0ef9e4","method":"POST","pathname":"/v1/query","statusCode":400,"errorCode":"INVALID_REQUEST"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2msurfaces unexpected JSON parsing failures as internal errors
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"cf5b6033-fc9b-416a-b40c-b3f92dd7fc95","method":"POST","pathname":"/v1/query","statusCode":500,"errorCode":"INTERNAL_SERVER_ERROR"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns 400 errors for structured CodeRag errors and supports non-full index requests
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"f51d10bd-a5a8-4ac5-a3d5-1ea6836a1ac0","method":"POST","pathname":"/v1/lookup","statusCode":400,"errorCode":"BAD_REQUEST"}

 [32m✓[39m src/test/http.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 83[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-TPAfK9","indexedNodeCount":5,"fullReindex":true}

 [32m✓[39m src/test/git-hook.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 113[2mms[22m[39m
 [32m✓[39m src/test/mcp.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 27[2mms[22m[39m
 [32m✓[39m src/test/logger.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m src/test/search.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 22[2mms[22m[39m
 [32m✓[39m src/test/documents.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 75[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-mLU5YT","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Running incremental CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"local-hash:local-hash:256"}

 [32m✓[39m src/test/text.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 11[2mms[22m[39m
 [32m✓[39m src/test/page-index.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 67[2mms[22m[39m
 [32m✓[39m src/test/errors.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 26[2mms[22m[39m
 [32m✓[39m src/test/context-builder.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 37[2mms[22m[39m
 [32m✓[39m src/test/manifest-store.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 29[2mms[22m[39m
 [32m✓[39m src/test/prompt.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 9[2mms[22m[39m
 [32m✓[39m src/test/traversal.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m src/test/filesystem.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 20[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-mLU5YT","indexedNodeCount":6,"fullReindex":false}

 [32m✓[39m src/test/codeflow-core.test.ts [2m([22m[2m6 tests[22m[2m)[22m[33m 4753[2mms[22m[39m
     [33m[2m✓[22m[39m builds spans and call sites for tsconfig repositories [33m 1474[2mms[22m[39m
     [33m[2m✓[22m[39m supports repositories without tsconfig files and ignores excluded directories [33m 2823[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-BnhTbg","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-DwxHym","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-Ra01iA","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-Ea5PEv","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-bCpuBA","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-O4rAWb","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-D4Vror","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-TeVx0X","indexedNodeCount":5,"fullReindex":true}

 [32m✓[39m src/test/coderag.test.ts [2m([22m[2m16 tests[22m[2m)[22m[33m 6525[2mms[22m[39m
     [33m[2m✓[22m[39m indexes a repo and answers retrieval queries without an llm [33m 1957[2mms[22m[39m
     [33m[2m✓[22m[39m reindexes changed files and updates the retrieved graph state [33m 2102[2mms[22m[39m
     [33m[2m✓[22m[39m loads an existing index when querying a fresh instance [33m 384[2mms[22m[39m
     [33m[2m✓[22m[39m uses the configured llm transport when answer generation is enabled [33m 312[2mms[22m[39m
     [33m[2m✓[22m[39m throws structured not-found errors for unknown identifiers [33m 310[2mms[22m[39m

[2m Test Files [22m [1m[32m24 passed[39m[22m[90m (24)[39m
[2m      Tests [22m [1m[32m193 passed[39m[22m[90m (193)[39m
[2m   Start at [22m 15:24:45
[2m   Duration [22m 8.45s[2m (transform 1.63s, setup 0ms, import 18.68s, tests 17.80s, environment 4ms)[22m
```
