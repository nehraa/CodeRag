import fs from "node:fs/promises";
import path from "node:path";

import { analyzeTypeScriptRepo } from "@abhinav2203/codeflow-core/analyzer";
import type { BlueprintGraph, BlueprintNode } from "@abhinav2203/codeflow-core/schema";
import { Node, Project, SyntaxKind } from "ts-morph";

import type { CallSite, GraphProvider, GraphSnapshot, SourceSpan } from "../types.js";

const EXCLUDED_SEGMENTS = ["/node_modules/", "/.next/", "/dist/", "/artifacts/", "/coverage/"];

const toPosixPath = (value: string): string => value.split(path.sep).join("/");

const isIncludedFile = (repoPath: string, filePath: string): boolean => {
  const normalized = toPosixPath(filePath);
  return normalized.startsWith(toPosixPath(repoPath)) && !EXCLUDED_SEGMENTS.some((segment) => normalized.includes(segment));
};

const createSymbolKey = (relativePath: string, symbolName: string): string => `${relativePath}::${symbolName}`;

const getAliasedSymbol = (node: Node) => {
  const symbol = node.getSymbol();
  return symbol?.getAliasedSymbol() ?? symbol;
};

const buildProject = async (repoPath: string): Promise<Project> => {
  const tsconfigPath = path.join(repoPath, "tsconfig.json");
  const hasTsconfig = await fs
    .stat(tsconfigPath)
    .then((stats) => stats.isFile())
    .catch(() => false);

  const project = hasTsconfig
    ? new Project({
        tsConfigFilePath: tsconfigPath,
        skipAddingFilesFromTsConfig: false
      })
    : new Project({
        compilerOptions: {
          allowJs: true,
          jsx: 4
        }
      });

  if (!hasTsconfig) {
    project.addSourceFilesAtPaths([
      path.join(repoPath, "**/*.ts"),
      path.join(repoPath, "**/*.tsx"),
      path.join(repoPath, "**/*.js"),
      path.join(repoPath, "**/*.jsx")
    ]);
  }

  return project;
};

const getRepoSymbol = (node: BlueprintNode): string | undefined =>
  node.sourceRefs.find((sourceRef) => sourceRef.kind === "repo" && sourceRef.symbol)?.symbol;

export const resolveNodeAst = (node: BlueprintNode, sourceFile: ReturnType<Project["getSourceFiles"]>[number]) => {
  const symbol = getRepoSymbol(node);

  if (node.kind === "module") {
    return sourceFile;
  }

  if (node.kind === "class") {
    return sourceFile.getClasses().find((classDeclaration) => classDeclaration.getName() === symbol || classDeclaration.getName() === node.name);
  }

  if (symbol?.includes(".")) {
    const [className, methodName] = symbol.split(".");
    const classDeclaration = sourceFile.getClasses().find((candidate) => candidate.getName() === className);
    return methodName ? classDeclaration?.getMethod(methodName) : undefined;
  }

  const functionDeclaration =
    sourceFile.getFunctions().find((candidate) => candidate.getName() === symbol) ??
    sourceFile.getFunctions().find((candidate) => candidate.getName() === node.name);
  if (functionDeclaration) {
    return functionDeclaration;
  }

  return sourceFile.getVariableDeclarations().find((candidate) => candidate.getName() === symbol || candidate.getName() === node.name);
};

const createSourceSpan = (node: BlueprintNode, astNode: Node | undefined): SourceSpan | undefined => {
  if (!node.path || !astNode) {
    return undefined;
  }

  return {
    nodeId: node.id,
    filePath: node.path,
    startLine: astNode.getStartLineNumber(),
    endLine: astNode.getEndLineNumber(),
    symbol: getRepoSymbol(node)
  };
};

export const getDeclarationKey = (repoPath: string, declaration: Node): string | null => {
  const relativePath = toPosixPath(path.relative(repoPath, declaration.getSourceFile().getFilePath()));

  if (Node.isMethodDeclaration(declaration)) {
    const classDeclaration = declaration.getFirstAncestorByKind(SyntaxKind.ClassDeclaration);
    const className = classDeclaration?.getName();
    if (!className) {
      return null;
    }

    return createSymbolKey(relativePath, `${className}.${declaration.getName()}`);
  }

  if (Node.isFunctionDeclaration(declaration) || Node.isVariableDeclaration(declaration)) {
    return declaration.getName() ? createSymbolKey(relativePath, declaration.getName()!) : null;
  }

  if (Node.isArrowFunction(declaration) || Node.isFunctionExpression(declaration)) {
    const variableDeclaration = declaration.getFirstAncestorByKind(SyntaxKind.VariableDeclaration);
    return variableDeclaration?.getName() ? createSymbolKey(relativePath, variableDeclaration.getName()) : null;
  }

  return null;
};

const buildCallSiteMap = (
  repoPath: string,
  graph: BlueprintGraph,
  declarationMap: Map<string, Node>,
  nodeKeyMap: Map<string, string>
): Record<string, CallSite> => {
  const edgeMap = new Map<string, CallSite>();

  for (const edge of graph.edges.filter((candidate) => candidate.kind === "calls")) {
    const callerNode = graph.nodes.find((node) => node.id === edge.from);
    if (!callerNode?.path) {
      continue;
    }

    const callerSymbol = getRepoSymbol(callerNode);
    if (!callerSymbol) {
      continue;
    }

    const callerKey = createSymbolKey(callerNode.path, callerSymbol);
    const callerDeclaration = declarationMap.get(callerKey);
    if (!callerDeclaration) {
      continue;
    }

    for (const callExpression of callerDeclaration.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      const expression = callExpression.getExpression();
      const targetSymbol = getAliasedSymbol(expression);
      const targetDeclaration = targetSymbol?.getDeclarations()[0];
      if (!targetDeclaration) {
        continue;
      }

      const targetKey = getDeclarationKey(repoPath, targetDeclaration);
      if (!targetKey) {
        continue;
      }

      const targetNodeId = nodeKeyMap.get(targetKey);
      if (!targetNodeId || targetNodeId !== edge.to) {
        continue;
      }

      const edgeKey = `${edge.kind}:${edge.from}:${edge.to}`;
      const existing = edgeMap.get(edgeKey);
      const lineNumber = callExpression.getStartLineNumber();

      if (!existing) {
        edgeMap.set(edgeKey, {
          edgeKey,
          fromNodeId: edge.from,
          toNodeId: edge.to,
          filePath: callerNode.path,
          lineNumbers: [lineNumber],
          expressions: [expression.getText()]
        });
        continue;
      }

      existing.lineNumbers.push(lineNumber);
      existing.expressions.push(expression.getText());
    }
  }

  return Object.fromEntries(
    [...edgeMap.entries()].map(([edgeKey, callSite]) => [
      edgeKey,
      {
        ...callSite,
        lineNumbers: [...new Set(callSite.lineNumbers)].sort((left, right) => left - right),
        expressions: [...new Set(callSite.expressions)]
      }
    ])
  );
};

export class CodeflowCoreGraphProvider implements GraphProvider {
  readonly name = "codeflow-core";

  async analyze(repoPath: string): Promise<BlueprintGraph> {
    const repoGraph = (await analyzeTypeScriptRepo(repoPath)) as Omit<BlueprintGraph, "projectName" | "mode" | "generatedAt">;

    return {
      projectName: path.basename(repoPath),
      mode: "essential",
      generatedAt: new Date().toISOString(),
      nodes: repoGraph.nodes,
      edges: repoGraph.edges,
      workflows: repoGraph.workflows,
      warnings: repoGraph.warnings,
      phase: "spec"
    };
  }
}

export const buildGraphSnapshot = async (
  repoPath: string,
  provider: GraphProvider
): Promise<GraphSnapshot> => {
  const resolvedRepoPath = path.resolve(repoPath);
  const graph = await provider.analyze(resolvedRepoPath);
  const project = await buildProject(resolvedRepoPath);
  const sourceFiles = project
    .getSourceFiles()
    .filter((sourceFile) => isIncludedFile(resolvedRepoPath, sourceFile.getFilePath()));

  const sourceFileMap = new Map(
    sourceFiles.map((sourceFile) => [
      toPosixPath(path.relative(resolvedRepoPath, sourceFile.getFilePath())),
      sourceFile
    ])
  );

  const declarationMap = new Map<string, Node>();
  const nodeKeyMap = new Map<string, string>();
  const sourceSpans = new Map<string, SourceSpan>();

  for (const node of graph.nodes) {
    if (!node.path) {
      continue;
    }

    const sourceFile = sourceFileMap.get(node.path);
    if (!sourceFile) {
      continue;
    }

    const astNode = resolveNodeAst(node, sourceFile);
    const sourceSpan = createSourceSpan(node, astNode);
    if (sourceSpan) {
      sourceSpans.set(node.id, sourceSpan);
    }

    const repoSymbol = getRepoSymbol(node);
    if (repoSymbol && astNode) {
      const key = createSymbolKey(node.path, repoSymbol);
      declarationMap.set(key, astNode);
      nodeKeyMap.set(key, node.id);
    }
  }

  return {
    provider: provider.name,
    repoPath: resolvedRepoPath,
    generatedAt: new Date().toISOString(),
    graph,
    sourceSpans: Object.fromEntries(sourceSpans),
    callSites: buildCallSiteMap(resolvedRepoPath, graph, declarationMap, nodeKeyMap)
  };
};
