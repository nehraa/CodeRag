import type { EmbeddingProvider } from "../types.js";
import { ConfigurationError } from "../errors/index.js";

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "models/gemini-embedding-2-preview";

export interface GeminiEmbeddingConfig {
  apiKey?: string;
  model?: string;
  timeoutMs?: number;
}

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  readonly name = "gemini";
  readonly dimensions = 768;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly timeoutMs: number;

  constructor(config?: GeminiEmbeddingConfig) {
    const key = config?.apiKey ?? process.env.CODERAG_GEMINI_API_KEY;
    if (!key) {
      throw new ConfigurationError(
        "Gemini API key required. Set CODERAG_GEMINI_API_KEY environment variable or pass apiKey in config."
      );
    }
    this.apiKey = key;
    this.model = config?.model ?? process.env.CODERAG_GEMINI_MODEL ?? DEFAULT_MODEL;
    this.timeoutMs = config?.timeoutMs ?? 30000;
  }

  async embed(text: string): Promise<number[]> {
    const url = `${GEMINI_API_BASE}/${this.model}:embedContent?key=${this.apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: {
            parts: [{ text }],
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText} - ${errorBody}`
        );
      }

      const data = await response.json() as {
        embedding?: { values?: number[] };
      };

      if (!data.embedding?.values) {
        throw new Error("Invalid response from Gemini API: missing embedding values");
      }

      return data.embedding.values;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Gemini API request timed out after ${this.timeoutMs}ms`);
      }
      throw error;
    }
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) {
      return [];
    }

    if (texts.length > 250) {
      throw new Error(
        `Batch size ${texts.length} exceeds Gemini API limit of 250. Split into smaller batches.`
      );
    }

    const url = `${GEMINI_API_BASE}/${this.model}:batchEmbedContents?key=${this.apiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: texts.map((text) => ({
            content: {
              parts: [{ text }],
            },
          })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText} - ${errorBody}`
        );
      }

      const data = await response.json() as {
        embeddings?: Array<{ values?: number[] }>;
      };

      if (!data.embeddings || data.embeddings.length !== texts.length) {
        throw new Error("Invalid response from Gemini API: mismatched embedding count");
      }

      return data.embeddings.map((emb) => emb.values ?? []);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Gemini API request timed out after ${this.timeoutMs}ms`);
      }
      throw error;
    }
  }
}
