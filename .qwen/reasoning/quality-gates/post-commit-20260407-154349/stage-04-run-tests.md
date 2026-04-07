# Stage 4: Run Existing Tests

**Status:** PASS

```

> @abhinav2203/coderag@1.0.1 test
> vitest run


[1m[46m RUN [49m[22m [36mv4.1.0 [39m[90m/Users/abhinavnehra/git/CodeRag[39m

[90mstdout[2m | src/test/cli.test.ts[2m > [22m[2mCLI[2m > [22m[2mparses query flags while skipping empty arguments
[22m[39manswer

 [32m✓[39m src/test/cli.test.ts [2m([22m[2m17 tests[22m[2m)[22m[32m 252[2mms[22m[39m
 [32m✓[39m src/test/codeflow-core.test.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 202[2mms[22m[39m
[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mwraps vector-store persistence failures with indexing context
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":5}
{"level":"info","message":"Embedding documents (batched)","count":5,"chunks":1,"chunkSize":5}

[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mwraps vector-store persistence failures with indexing context
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mroutes incremental and full reindex requests to the correct index mode
[22m[39m{"level":"info","message":"Running incremental CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"none"}

[90mstdout[2m | src/test/indexer.test.ts[2m > [22m[2mRepoIndexer[2m > [22m[2mroutes incremental and full reindex requests to the correct index mode
[22m[39m{"level":"info","message":"Running full CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"none"}

 [32m✓[39m src/test/indexer.test.ts [2m([22m[2m8 tests[22m[2m)[22m[32m 200[2mms[22m[39m
 [32m✓[39m src/test/index-lock.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 169[2mms[22m[39m
 [32m✓[39m src/test/vector-store.test.ts [2m([22m[2m7 tests[22m[2m)[22m[33m 452[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":5}
{"level":"info","message":"Embedding documents (batched)","count":5,"chunks":1,"chunkSize":5}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-uU85JT","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mindexes a repo and answers retrieval queries without an llm
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-uU85JT"}

 [32m✓[39m src/test/config.test.ts [2m([22m[2m19 tests[22m[2m)[22m[32m 103[2mms[22m[39m
 [32m✓[39m src/test/http-serve.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 103[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":5}
{"level":"info","message":"Embedding documents (batched)","count":5,"chunks":1,"chunkSize":5}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

 [32m✓[39m src/test/gemini-embedder.test.ts [2m([22m[2m15 tests[22m[2m)[22m[32m 77[2mms[22m[39m
[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-WJfxA4","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-WJfxA4"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Running incremental CodeRag reindex.","expected":"local-hash:local-hash:256","actual":"local-hash:local-hash:256"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":6}
{"level":"info","message":"Embedding documents (batched)","count":6,"chunks":1,"chunkSize":6}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-WJfxA4","indexedNodeCount":6,"fullReindex":false}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mreindexes changed files and updates the retrieved graph state
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-WJfxA4"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":5}
{"level":"info","message":"Embedding documents (batched)","count":5,"chunks":1,"chunkSize":5}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-KnKPJe","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mloads an existing index when querying a fresh instance
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-KnKPJe"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":5}
{"level":"info","message":"Embedding documents (batched)","count":5,"chunks":1,"chunkSize":5}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-c43ALP","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2muses the configured llm transport when answer generation is enabled
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-c43ALP"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":5}
{"level":"info","message":"Embedding documents (batched)","count":5,"chunks":1,"chunkSize":5}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-D284i4","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mthrows structured not-found errors for unknown identifiers
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-D284i4"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":5}
{"level":"info","message":"Embedding documents (batched)","count":5,"chunks":1,"chunkSize":5}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-NX9CxJ","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains nodes and reports empty impact sets
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-NX9CxJ"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":5}
{"level":"info","message":"Embedding documents (batched)","count":5,"chunks":1,"chunkSize":5}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-F69qSD","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mfails when query execution is missing required runtime dependencies
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-F69qSD"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":5}
{"level":"info","message":"Embedding documents (batched)","count":5,"chunks":1,"chunkSize":5}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-sCQgE2","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mautomatically indexes on the first query when no persisted state exists
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-sCQgE2"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":5}
{"level":"info","message":"Embedding documents (batched)","count":5,"chunks":1,"chunkSize":5}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-sagS9Y","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mhydrates state after waiting for another index process to finish
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-sagS9Y"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"info","message":"Prepared documents for embedding","count":5}
{"level":"info","message":"Embedding documents (batched)","count":5,"chunks":1,"chunkSize":5}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"info","message":"Embedding chunk 1/1 complete"}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"info","message":"Indexed repository","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-2XoKGB","indexedNodeCount":5,"fullReindex":true}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"info","message":"Auto-installing post-commit hook for incremental indexing."}

[90mstdout[2m | src/test/coderag.test.ts[2m > [22m[2mCodeRag[2m > [22m[2mexplains leaf nodes with explicit none summaries
[22m[39m{"level":"warn","message":"Skipped git hook installation because no Git directory was found.","repoPath":"/var/folders/bz/8z6v5xjd19n72nvjd8kfph6m0000gn/T/coderag-repo-2XoKGB"}

 [32m✓[39m src/test/coderag.test.ts [2m([22m[2m16 tests[22m[2m)[22m[33m 763[2mms[22m[39m
 [32m✓[39m src/test/search.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 24[2mms[22m[39m
 [32m✓[39m src/test/git-hook.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 58[2mms[22m[39m
 [32m✓[39m src/test/transports.test.ts [2m([22m[2m31 tests[22m[2m)[22m[33m 2730[2mms[22m[39m
     [33m[2m✓[22m[39m throws structured transport errors for unreachable servers [33m 608[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces final HTTP errors after exhausting retryable statuses [33m 469[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces SSE transport errors for non-OK responses [33m 514[2mms[22m[39m
     [33m[2m✓[22m[39m surfaces NDJSON transport errors for non-OK responses [33m 705[2mms[22m[39m
[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2menforces bearer auth and validates request content types
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"0afc27d2-210b-426c-a5f7-5a75c136884e","method":"POST","pathname":"/v1/query","statusCode":415,"errorCode":"UNSUPPORTED_MEDIA_TYPE"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns structured not-found and validation errors
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"5d72a3be-722e-460d-96fd-f67751a6fe22","method":"POST","pathname":"/v1/lookup","statusCode":400,"errorCode":"INVALID_REQUEST"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mmaps thrown not-found errors to 404 responses
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"c114626f-8e2e-4083-b4e6-75c9e2055f19","method":"POST","pathname":"/v1/lookup","statusCode":404,"errorCode":"NOT_FOUND"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns request-too-large and internal-error responses
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"0405e83f-4a61-4baa-92ba-1722f03795b1","method":"POST","pathname":"/v1/query","statusCode":413,"errorCode":"REQUEST_TOO_LARGE"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mrejects malformed JSON bodies with a 400 response
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"d782c454-68c4-4e86-8de2-36f6822dc736","method":"POST","pathname":"/v1/query","statusCode":400,"errorCode":"INVALID_REQUEST"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2msurfaces unexpected JSON parsing failures as internal errors
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"6c37261f-fa3e-4acc-9366-2cc5a59a4e33","method":"POST","pathname":"/v1/query","statusCode":500,"errorCode":"INTERNAL_SERVER_ERROR"}

[90mstderr[2m | src/test/http.test.ts[2m > [22m[2mHTTP service[2m > [22m[2mreturns 400 errors for structured CodeRag errors and supports non-full index requests
[22m[39m{"level":"error","message":"CodeRag HTTP request failed.","requestId":"f69f0707-7c20-4976-a007-0714c753e054","method":"POST","pathname":"/v1/lookup","statusCode":400,"errorCode":"BAD_REQUEST"}

 [32m✓[39m src/test/http.test.ts [2m([22m[2m11 tests[22m[2m)[22m[32m 61[2mms[22m[39m
 [32m✓[39m src/test/page-index.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 45[2mms[22m[39m
 [32m✓[39m src/test/documents.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 80[2mms[22m[39m
 [32m✓[39m src/test/context-builder.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 38[2mms[22m[39m
 [32m✓[39m src/test/text.test.ts [2m([22m[2m10 tests[22m[2m)[22m[32m 12[2mms[22m[39m
 [32m✓[39m src/test/mcp.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 23[2mms[22m[39m
 [32m✓[39m src/test/logger.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m src/test/traversal.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 7[2mms[22m[39m
 [32m✓[39m src/test/prompt.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 8[2mms[22m[39m
 [32m✓[39m src/test/errors.test.ts [2m([22m[2m1 test[22m[2m)[22m[32m 6[2mms[22m[39m
 [32m✓[39m src/test/manifest-store.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 27[2mms[22m[39m
 [32m✓[39m src/test/filesystem.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 10[2mms[22m[39m
 [32m✓[39m src/test/onnx-embedder.test.ts [2m([22m[2m2 tests[22m[2m)[22m[32m 5[2mms[22m[39m

[2m Test Files [22m [1m[32m25 passed[39m[22m[90m (25)[39m
[2m      Tests [22m [1m[32m202 passed[39m[22m[90m (202)[39m
[2m   Start at [22m 15:43:55
[2m   Duration [22m 4.32s[2m (transform 1.56s, setup 0ms, import 15.56s, tests 5.46s, environment 4ms)[22m
```
