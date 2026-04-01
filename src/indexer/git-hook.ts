import fs from "node:fs/promises";
import path from "node:path";

import type { Logger } from "../types.js";
import { ensureDir } from "../utils/filesystem.js";

const HOOK_MARKER = "# Added by CodeRag";

const resolveGitDir = async (repoPath: string): Promise<string | null> => {
  const dotGitPath = path.join(repoPath, ".git");
  const stats = await fs.stat(dotGitPath).catch(() => null);
  if (!stats) {
    return null;
  }

  if (stats.isDirectory()) {
    return dotGitPath;
  }

  const content = await fs.readFile(dotGitPath, "utf8");
  const match = content.match(/gitdir:\s*(.+)\s*/i);
  if (!match?.[1]) {
    return null;
  }

  return path.resolve(repoPath, match[1]);
};

export const installPostCommitHook = async (
  repoPath: string,
  configPath: string | null,
  logger?: Logger
): Promise<void> => {
  const gitDir = await resolveGitDir(repoPath);
  if (!gitDir) {
    logger?.warn("Skipped git hook installation because no Git directory was found.", {
      repoPath
    });
    return;
  }

  const hooksDir = path.join(gitDir, "hooks");
  const hookPath = path.join(hooksDir, "post-commit");
  const backupHookPath = path.join(hooksDir, "post-commit.coderag.previous");
  await ensureDir(hooksDir);

  const existingHook = await fs.readFile(hookPath, "utf8").catch(() => "");
  if (existingHook.includes(HOOK_MARKER)) {
    return;
  }

  if (existingHook.trim()) {
    await fs.writeFile(backupHookPath, existingHook, "utf8");
  }

  const configArgument = configPath ? ` --config "${configPath}"` : "";
  const script = `#!/bin/sh
${HOOK_MARKER}
set -e
if [ -f "${backupHookPath}" ]; then
  sh "${backupHookPath}"
fi
if command -v npx >/dev/null 2>&1; then
  npx --no-install coderag reindex${configArgument} >/dev/null 2>&1 || true
fi
`;

  await fs.writeFile(hookPath, script, { mode: 0o755 });
};
