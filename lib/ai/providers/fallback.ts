import type { LLMProvider, StreamChunk, Message, ToolDefinition } from "./types"
import { LLMError } from "@/lib/utils/errors"
import { OpenAIProvider } from "./openai"
import { AnthropicProvider } from "./anthropic"

export class FallbackProvider implements LLMProvider {
  readonly name = "fallback"

  constructor(
    private primary: LLMProvider,
    private secondary: LLMProvider
  ) {}

  async *chat(params: {
    messages: Message[]
    tools: ToolDefinition[]
  }): AsyncGenerator<StreamChunk> {
    try {
      yield* this.primary.chat(params)
    } catch (error) {
      if (error instanceof LLMError && error.isRetryable) {
        yield { type: "text", content: `\n\n*Switched to ${this.secondary.name}*\n\n` }
        yield* this.secondary.chat(params)
      } else {
        throw error
      }
    }
  }
}

export function createProvider(): LLMProvider {
  const openai = new OpenAIProvider(process.env.OPENAI_API_KEY!)
  const anthropic = new AnthropicProvider(process.env.ANTHROPIC_API_KEY!)

  const isPrimaryOpenAI = process.env.PRIMARY_LLM !== "anthropic"
  return new FallbackProvider(
    isPrimaryOpenAI ? openai : anthropic,
    isPrimaryOpenAI ? anthropic : openai
  )
}
