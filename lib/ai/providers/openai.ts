import OpenAI from "openai"
import type { LLMProvider, StreamChunk, Message, ToolDefinition } from "./types"
import { LLMError } from "@/lib/utils/errors"

export class OpenAIProvider implements LLMProvider {
  readonly name = "openai"
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async *chat(params: {
    messages: Message[]
    tools: ToolDefinition[]
  }): AsyncGenerator<StreamChunk> {
    try {
      const stream = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: params.messages as OpenAI.ChatCompletionMessageParam[],
        tools: params.tools as OpenAI.ChatCompletionTool[],
        stream: true,
      })

      const toolCalls: Map<number, { id: string; name: string; arguments: string }> = new Map()

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta
        if (!delta) continue

        // Accumulate text
        if (delta.content) {
          yield { type: "text", content: delta.content }
        }

        // Accumulate tool calls
        if (delta.tool_calls) {
          for (const tc of delta.tool_calls) {
            const existing = toolCalls.get(tc.index)
            if (existing) {
              existing.arguments += tc.function?.arguments ?? ""
            } else {
              toolCalls.set(tc.index, {
                id: tc.id ?? "",
                name: tc.function?.name ?? "",
                arguments: tc.function?.arguments ?? "",
              })
            }
          }
        }

        // Check for finish
        if (chunk.choices[0]?.finish_reason === "tool_calls") {
          const calls = Array.from(toolCalls.values()).map((tc) => ({
            id: tc.id,
            type: "function" as const,
            function: { name: tc.name, arguments: tc.arguments },
          }))
          yield { type: "tool_calls", calls }
          return
        }

        if (chunk.choices[0]?.finish_reason === "stop") {
          yield { type: "done" }
          return
        }
      }

      yield { type: "done" }
    } catch (error) {
      const isRetryable =
        error instanceof OpenAI.APIError &&
        (error.status === 429 || (error.status !== undefined && error.status >= 500))
      throw new LLMError(
        error instanceof Error ? error.message : "OpenAI request failed",
        "openai",
        isRetryable
      )
    }
  }
}
