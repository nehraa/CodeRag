import type { EmbeddingProvider } from "../types.js";
import { embedTextDeterministically } from "../utils/text.js";

export class LocalHashEmbeddingProvider implements EmbeddingProvider {
  readonly name = "local-hash";
  readonly dimensions: number;

  constructor(dimensions = 256) {
    this.dimensions = dimensions;
  }

  async embed(text: string): Promise<number[]> {
    return embedTextDeterministically(text, this.dimensions);
  }
}
