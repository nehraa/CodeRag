#!/usr/bin/env node
// Auto-discovers or creates a default coderag.config.json in CWD,
// auto-indexes if needed, then launches the CodeRag MCP server.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CODERAG_DIR = "/Users/abhinavnehra/git/CodeRag";
const CLI_PATH = path.join(CODERAG_DIR, "dist/cli.js");
const CONFIG_NAME = "coderag.config.json";
const CONFIG_NAMES = [CONFIG_NAME, ".coderag.json"];

const defaultConfig = (cwd) => ({
  repoPath: cwd,
  storageRoot: ".coderag",
  retrieval: { topK: 6, rerankK: 3 },
  traversal: { defaultDepth: 1, maxDepth: 3 },
  embedding: { provider: "onnx" }
});

const findConfig = () => {
  let dir = process.cwd();
  while (true) {
    for (const name of CONFIG_NAMES) {
      const candidate = path.join(dir, name);
      if (fs.existsSync(candidate)) {
        return { configPath: candidate, cwd: dir };
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
};

// 1. Find existing config or create one in CWD
let found = findConfig();
let configPath, configCwd;

if (found) {
  configPath = found.configPath;
  configCwd = found.cwd;
} else {
  configCwd = process.cwd();
  configPath = path.join(configCwd, CONFIG_NAME);
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig(configCwd), null, 2) + "\n");
  console.error(`[coderag-mcp] Created default config at ${configPath}`);
}

// 2. Auto-index if the .coderag directory is missing
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const storageRoot = path.resolve(configCwd, config.storageRoot ?? ".coderag");
if (!fs.existsSync(storageRoot)) {
  console.error(`[coderag-mcp] No index found. Running coderag init...`);
  const result = spawnSync("node", [CLI_PATH, "init", "--config", configPath], {
    cwd: configCwd,
    stdio: "inherit",
    env: process.env
  });
  if (result.status !== 0) {
    console.error(`[coderag-mcp] Indexing failed with exit code ${result.status}. MCP server will start but queries will be empty.`);
  }
}

// 3. Launch MCP server
const child = spawnSync("node", [CLI_PATH, "serve-mcp", "--config", configPath], {
  stdio: "inherit",
  cwd: configCwd,
  env: process.env
});

process.exit(child.status ?? 0);
