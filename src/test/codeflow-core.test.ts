import fs from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";
import { Project, SyntaxKind } from "ts-morph";

import {
  CodeflowCoreGraphProvider,
  buildGraphSnapshot,
  getDeclarationKey,
  resolveNodeAst
} from "../adapters/codeflow-core.js";
import { cleanupPaths, createComplexRepo } from "./helpers.js";

describe("codeflow-core adapter", () => {
  it("builds spans and call sites for tsconfig repositories", async () => {
    const repoPath = await createComplexRepo(true);
    const snapshot = await buildGraphSnapshot(repoPath, new CodeflowCoreGraphProvider());

    expect(snapshot.graph.nodes.some((node) => node.name === "analyzeTypeScriptRepo")).toBe(true);
    expect(snapshot.graph.nodes.some((node) => node.name === "RepoAnalyzer")).toBe(true);
    expect(snapshot.sourceSpans).toHaveProperty(
      snapshot.graph.nodes.find((node) => node.name === "buildBlueprintGraph")?.id ?? ""
    );
    expect(Object.values(snapshot.callSites).some((callSite) => callSite.expressions.includes("analyzeTypeScriptRepo"))).toBe(true);

    await cleanupPaths([repoPath]);
  });

  it("supports repositories without tsconfig files and ignores excluded directories", async () => {
    const repoPath = await createComplexRepo(false);
    await fs.mkdir(path.join(repoPath, "dist"), { recursive: true });
    await fs.writeFile(path.join(repoPath, "dist", "ignored.ts"), "export const ignored = true;", "utf8");

    const snapshot = await buildGraphSnapshot(repoPath, new CodeflowCoreGraphProvider());

    expect(snapshot.graph.nodes.some((node) => node.path?.includes("dist/ignored.ts"))).toBe(false);
    expect(snapshot.graph.nodes.some((node) => node.name === "runAnalysis")).toBe(true);

    await cleanupPaths([repoPath]);
  });

  it("handles module nodes, method symbols, and missing files from custom providers", async () => {
    const repoPath = await createComplexRepo(true);
    const snapshot = await buildGraphSnapshot(repoPath, {
      name: "custom",
      async analyze() {
        return {
          projectName: "repo",
          mode: "essential",
          generatedAt: "2026-04-01T00:00:00.000Z",
          phase: "spec",
          workflows: [],
          warnings: [],
          nodes: [
            {
              id: "module",
              name: "repo-module",
              kind: "module",
              path: "src/services/repo.ts",
              summary: "module",
              signature: "",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo" }]
            },
            {
              id: "class",
              name: "RepoAnalyzer",
              kind: "class",
              path: "src/services/repo.ts",
              summary: "class",
              signature: "class RepoAnalyzer",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "RepoAnalyzer" }]
            },
            {
              id: "method",
              name: "analyze",
              kind: "function",
              path: "src/services/repo.ts",
              summary: "method",
              signature: "analyze(entryPath: string): string",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "RepoAnalyzer.analyze" }]
            },
            {
              id: "missing-path",
              name: "missingPath",
              kind: "function",
              summary: "missing",
              signature: "",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: []
            },
            {
              id: "missing-file",
              name: "missingFile",
              kind: "function",
              path: "src/missing.ts",
              summary: "missing",
              signature: "",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "missingFile" }]
            }
          ],
          edges: [{ kind: "calls", from: "method", to: "missing-file" }]
        };
      }
    });

    expect(snapshot.provider).toBe("custom");
    expect(snapshot.sourceSpans.module?.filePath).toBe("src/services/repo.ts");
    expect(snapshot.sourceSpans.class?.symbol).toBe("RepoAnalyzer");
    expect(snapshot.sourceSpans.method?.symbol).toBe("RepoAnalyzer.analyze");
    expect(snapshot.sourceSpans["missing-file"]).toBeUndefined();
    expect(snapshot.callSites).toEqual({});

    await cleanupPaths([repoPath]);
  });

  it("covers call-site edge cases without crashing", async () => {
    const repoPath = await createComplexRepo(true);
    await fs.writeFile(
      path.join(repoPath, "src", "anonymous.ts"),
      `export default class {
  analyze(): string {
    return "anonymous";
  }
}
`,
      "utf8"
    );
    await fs.writeFile(
      path.join(repoPath, "src", "calls.ts"),
      `import AnonymousAnalyzer from "./anonymous";

const helperArrow = () => "arrow";
const service = {
  run: function () {
    return "service";
  }
};
const arrowService = {
  run: () => "arrow-service"
};

export function repeatedCaller(): string {
  helperArrow();
  return helperArrow();
}

export function anonymousCaller(): string {
  const analyzer = new AnonymousAnalyzer();
  return analyzer.analyze();
}

export function unresolvedCaller(): void {
  missingTarget();
}

export function iifeCaller(): string {
  return (function namedIife() {
    return "iife";
  })();
}

export function propertyCaller(): string {
  return service.run();
}

export function propertyArrowCaller(): string {
  return arrowService.run();
}

export function callbackCaller(callback: () => string): string {
  return callback();
}
`,
      "utf8"
    );

    const snapshot = await buildGraphSnapshot(repoPath, {
      name: "custom",
      async analyze() {
        return {
          projectName: "repo",
          mode: "essential",
          generatedAt: "2026-04-01T00:00:00.000Z",
          phase: "spec",
          workflows: [],
          warnings: [],
          nodes: [
            {
              id: "repeated-caller",
              name: "repeatedCaller",
              kind: "function",
              path: "src/calls.ts",
              summary: "repeated",
              signature: "repeatedCaller(): string",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "repeatedCaller" }]
            },
            {
              id: "helper-arrow",
              name: "helperArrow",
              kind: "function",
              path: "src/calls.ts",
              summary: "helper",
              signature: "helperArrow(): string",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "helperArrow" }]
            },
            {
              id: "anonymous-caller",
              name: "anonymousCaller",
              kind: "function",
              path: "src/calls.ts",
              summary: "anonymous",
              signature: "anonymousCaller(): string",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "anonymousCaller" }]
            },
            {
              id: "anonymous-target",
              name: "analyze",
              kind: "function",
              path: "src/anonymous.ts",
              summary: "anonymous target",
              signature: "analyze(): string",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "analyze" }]
            },
            {
              id: "unresolved-caller",
              name: "unresolvedCaller",
              kind: "function",
              path: "src/calls.ts",
              summary: "unresolved",
              signature: "unresolvedCaller(): void",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "unresolvedCaller" }]
            },
            {
              id: "missing-target",
              name: "missingTarget",
              kind: "function",
              path: "src/calls.ts",
              summary: "missing target",
              signature: "missingTarget(): void",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "missingTarget" }]
            },
            {
              id: "iife-caller",
              name: "iifeCaller",
              kind: "function",
              path: "src/calls.ts",
              summary: "iife",
              signature: "iifeCaller(): string",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "iifeCaller" }]
            },
            {
              id: "iife-target",
              name: "iifeTarget",
              kind: "function",
              path: "src/calls.ts",
              summary: "iife target",
              signature: "",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: []
            },
            {
              id: "property-caller",
              name: "propertyCaller",
              kind: "function",
              path: "src/calls.ts",
              summary: "property caller",
              signature: "",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "propertyCaller" }]
            },
            {
              id: "property-arrow-caller",
              name: "propertyArrowCaller",
              kind: "function",
              path: "src/calls.ts",
              summary: "property arrow caller",
              signature: "",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "propertyArrowCaller" }]
            },
            {
              id: "callback-caller",
              name: "callbackCaller",
              kind: "function",
              path: "src/calls.ts",
              summary: "callback caller",
              signature: "",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "callbackCaller" }]
            },
            {
              id: "no-path",
              name: "noPathCaller",
              kind: "function",
              summary: "no path",
              signature: "",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "noPathCaller" }]
            },
            {
              id: "no-symbol",
              name: "noSymbolCaller",
              kind: "function",
              path: "src/calls.ts",
              summary: "no symbol",
              signature: "",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo" }]
            },
            {
              id: "missing-declaration",
              name: "missingDeclarationCaller",
              kind: "function",
              path: "src/calls.ts",
              summary: "missing declaration",
              signature: "",
              contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
              sourceRefs: [{ kind: "repo", symbol: "missingDeclarationCaller" }]
            }
          ],
          edges: [
            { kind: "calls", from: "repeated-caller", to: "helper-arrow" },
            { kind: "calls", from: "anonymous-caller", to: "anonymous-target" },
            { kind: "calls", from: "unresolved-caller", to: "missing-target" },
            { kind: "calls", from: "iife-caller", to: "iife-target" },
            { kind: "calls", from: "property-caller", to: "missing-target" },
            { kind: "calls", from: "property-arrow-caller", to: "missing-target" },
            { kind: "calls", from: "callback-caller", to: "missing-target" },
            { kind: "calls", from: "no-path", to: "helper-arrow" },
            { kind: "calls", from: "no-symbol", to: "helper-arrow" },
            { kind: "calls", from: "missing-declaration", to: "helper-arrow" }
          ]
        };
      }
    });

    expect(snapshot.sourceSpans["missing-declaration"]).toBeUndefined();
    expect(snapshot.callSites["calls:repeated-caller:helper-arrow"]?.lineNumbers).toEqual([14, 15]);
    expect(snapshot.callSites["calls:repeated-caller:helper-arrow"]?.expressions).toEqual(["helperArrow"]);
    expect(snapshot.callSites["calls:anonymous-caller:anonymous-target"]).toBeUndefined();
    expect(snapshot.callSites["calls:unresolved-caller:missing-target"]).toBeUndefined();
    expect(snapshot.callSites["calls:iife-caller:iife-target"]).toBeUndefined();
    expect(snapshot.callSites["calls:property-caller:missing-target"]).toBeUndefined();
    expect(snapshot.callSites["calls:property-arrow-caller:missing-target"]).toBeUndefined();
    expect(snapshot.callSites["calls:callback-caller:missing-target"]).toBeUndefined();

    await cleanupPaths([repoPath]);
  });

  it("derives declaration keys for function and arrow expressions", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile(
      "/repo/src/demo.ts",
      `const wrapped = function namedExpression() { return "wrapped"; };
const arrowWrapped = () => "arrow";

export function invoke(): string {
  return (function detachedExpression() {
    return "detached";
  })();
}
`
    );

    const functionExpression = sourceFile.getDescendantsOfKind(SyntaxKind.FunctionExpression)[0]!;
    const detachedFunctionExpression = sourceFile.getDescendantsOfKind(SyntaxKind.FunctionExpression)[1]!;
    const arrowFunction = sourceFile.getDescendantsOfKind(SyntaxKind.ArrowFunction)[0]!;

    expect(getDeclarationKey("/repo", functionExpression)).toBe("src/demo.ts::wrapped");
    expect(getDeclarationKey("/repo", arrowFunction)).toBe("src/demo.ts::arrowWrapped");
    expect(getDeclarationKey("/repo", detachedFunctionExpression)).toBeNull();
  });

  it("resolves classes, methods, and anonymous declarations directly from source files", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile(
      "/repo/src/demo.ts",
      `export class Example {
  run(): string {
    return "ok";
  }
}

export default function () {
  return "anonymous";
}
`
    );

    expect(
      resolveNodeAst(
        {
          id: "class",
          name: "Example",
          kind: "class",
          path: "src/demo.ts",
          summary: "",
          signature: "",
          contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
          sourceRefs: [{ kind: "repo" }]
        },
        sourceFile
      )?.getKindName()
    ).toBe("ClassDeclaration");
    expect(
      resolveNodeAst(
        {
          id: "method",
          name: "run",
          kind: "function",
          path: "src/demo.ts",
          summary: "",
          signature: "",
          contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
          sourceRefs: [{ kind: "repo", symbol: "Example.run" }]
        },
        sourceFile
      )?.getKindName()
    ).toBe("MethodDeclaration");
    expect(
      resolveNodeAst(
        {
          id: "missing-method",
          name: "run",
          kind: "function",
          path: "src/demo.ts",
          summary: "",
          signature: "",
          contract: { responsibilities: [], inputs: [], outputs: [], dependencies: [] },
          sourceRefs: [{ kind: "repo", symbol: "Example." }]
        },
        sourceFile
      )
    ).toBeUndefined();

    const anonymousFunction = sourceFile.getFunctions().find((candidate) => !candidate.getName())!;
    expect(getDeclarationKey("/repo", anonymousFunction)).toBeNull();
  });
});
