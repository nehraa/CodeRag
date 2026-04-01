import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import type { CodeRag } from "../service/coderag.js";

const serialize = (value: unknown): string => JSON.stringify(value, null, 2);

const DEPTH_SCHEMA = z.number().int().min(0).optional();

/**
 * Creates the stdio MCP server that exposes CodeRag retrieval tools.
 */
export const createMcpServer = (coderag: CodeRag): McpServer => {
  const server = new McpServer({
    name: "coderag",
    version: "0.1.0"
  });

  server.registerTool(
    "query",
    {
      title: "Query repository",
      description: "Answer a natural-language question about the indexed repository.",
      inputSchema: {
        question: z.string().min(1),
        depth: DEPTH_SCHEMA
      }
    },
    async ({ question, depth }) => ({
      content: [{ type: "text", text: serialize(await coderag.query(question, { depth })) }]
    })
  );

  server.registerTool(
    "lookup",
    {
      title: "Lookup node",
      description: "Lookup a graph node by id, name, or file path.",
      inputSchema: {
        identifier: z.string().min(1)
      }
    },
    async ({ identifier }) => ({
      content: [{ type: "text", text: serialize(await coderag.lookup(identifier)) }]
    })
  );

  server.registerTool(
    "explain",
    {
      title: "Explain node",
      description: "Explain what a node does and how it relates to the graph.",
      inputSchema: {
        identifier: z.string().min(1),
        depth: DEPTH_SCHEMA
      }
    },
    async ({ identifier, depth }) => ({
      content: [{ type: "text", text: serialize(await coderag.explain(identifier, depth)) }]
    })
  );

  server.registerTool(
    "impact",
    {
      title: "Impact analysis",
      description: "Show what depends on a node.",
      inputSchema: {
        identifier: z.string().min(1),
        depth: DEPTH_SCHEMA
      }
    },
    async ({ identifier, depth }) => ({
      content: [{ type: "text", text: serialize(await coderag.impact(identifier, depth)) }]
    })
  );

  server.registerTool(
    "status",
    {
      title: "Indexer status",
      description: "Return repository indexing and LLM status.",
      inputSchema: {}
    },
    async () => ({
      content: [{ type: "text", text: serialize(await coderag.status()) }]
    })
  );

  return server;
};

/**
 * Connects the CodeRag MCP server to stdio for local tool execution.
 */
export const serveStdioMcpServer = async (coderag: CodeRag): Promise<void> => {
  const server = createMcpServer(coderag);
  const transport = new StdioServerTransport();
  await server.connect(transport);
};
