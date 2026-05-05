import Anthropic from "@anthropic-ai/sdk"
import type { LLMProvider, StreamChunk, Message, ToolCall, ToolDefinition } from "./types"
import { LLMError } from "@/lib/utils/errors"

type AnthropicMessageParam = Anthropic.MessageParam
type AnthropicContentBlockParam = Anthropic.ContentBlockParam
type AnthropicTool = Anthropic.Tool

function convertTools(tools: ToolDefinition[]): AnthropicTool[] {
  return tools.map((t) => ({
    name: t.function.name,
    description: t.function.description,
    input_schema: t.function.parameters as Anthropic.Tool.InputSchema,
  }))
}

function convertMessages(messages: Message[]): {
  system: string | undefined
  anthropicMessages: AnthropicMessageParam[]
} {
  // Extract system messages
  const systemParts = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content ?? "")
    .filter(Boolean)

  const system = systemParts.length > 0 ? systemParts.join("\n\n") : undefined

  // Convert non-system messages
  const anthropicMessages: AnthropicMessageParam[] = []

  for (const msg of messages) {
    if (msg.role === "system") {
      // Already extracted above
      continue
    }

    if (msg.role === "tool") {
      // Convert tool result: our { role: "tool", content: "...", tool_call_id: "..." }
      // → Anthropic { role: "user", content: [{ type: "tool_result", tool_use_id: "...", content: "..." }] }
      const toolResultBlock: AnthropicContentBlockParam = {
        type: "tool_result",
        tool_use_id: msg.tool_call_id ?? "",
        content: msg.content ?? "",
      }

      // Anthropic requires tool results to be grouped into a single user message
      // when consecutive tool results appear. Merge into the previous user message if possible.
      const last = anthropicMessages[anthropicMessages.length - 1]
      if (last && last.role === "user" && Array.isArray(last.content)) {
        last.content.push(toolResultBlock)
      } else {
        anthropicMessages.push({
          role: "user",
          content: [toolResultBlock],
        })
      }
      continue
    }

    if (msg.role === "assistant") {
      if (msg.tool_calls && msg.tool_calls.length > 0) {
        // Convert assistant tool_calls to Anthropic tool_use content blocks
        const content: AnthropicContentBlockParam[] = []

        // Include any text content first
        if (msg.content) {
          content.push({ type: "text", text: msg.content })
        }

        for (const tc of msg.tool_calls) {
          let parsedInput: unknown = {}
          try {
            parsedInput = JSON.parse(tc.function.arguments)
          } catch {
            parsedInput = {}
          }
          content.push({
            type: "tool_use",
            id: tc.id,
            name: tc.function.name,
            input: parsedInput,
          })
        }

        anthropicMessages.push({ role: "assistant", content })
      } else {
        anthropicMessages.push({
          role: "assistant",
          content: msg.content ?? "",
        })
      }
      continue
    }

    // role === "user"
    anthropicMessages.push({
      role: "user",
      content: msg.content ?? "",
    })
  }

  return { system, anthropicMessages }
}

export class AnthropicProvider implements LLMProvider {
  readonly name = "anthropic"
  private client: Anthropic

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey })
  }

  async *chat(params: {
    messages: Message[]
    tools: ToolDefinition[]
  }): AsyncGenerator<StreamChunk> {
    try {
      const { system, anthropicMessages } = convertMessages(params.messages)
      const tools = convertTools(params.tools)

      const stream = await this.client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system,
        messages: anthropicMessages,
        tools,
        stream: true,
      })

      // Track tool_use blocks being accumulated
      const toolUseBlocks: Map<number, { id: string; name: string; input: string }> = new Map()

      for await (const event of stream) {
        if (event.type === "content_block_start") {
          if (event.content_block.type === "tool_use") {
            toolUseBlocks.set(event.index, {
              id: event.content_block.id,
              name: event.content_block.name,
              input: "",
            })
          }
        } else if (event.type === "content_block_delta") {
          if (event.delta.type === "text_delta") {
            yield { type: "text", content: event.delta.text }
          } else if (event.delta.type === "input_json_delta") {
            const block = toolUseBlocks.get(event.index)
            if (block) {
              block.input += event.delta.partial_json
            }
          }
        } else if (event.type === "message_delta") {
          const stopReason = event.delta.stop_reason
          if (stopReason === "tool_use") {
            // Emit all accumulated tool calls
            const calls: ToolCall[] = Array.from(toolUseBlocks.values()).map((block) => ({
              id: block.id,
              type: "function" as const,
              function: {
                name: block.name,
                arguments: block.input,
              },
            }))
            if (calls.length > 0) {
              yield { type: "tool_calls", calls }
            }
            return
          } else if (
            stopReason === "end_turn" ||
            stopReason === "stop_sequence" ||
            stopReason === "max_tokens"
          ) {
            yield { type: "done" }
            return
          }
        }
      }

      yield { type: "done" }
    } catch (error) {
      const isRetryable =
        error instanceof Anthropic.APIError &&
        (error.status === 429 || (error.status !== undefined && error.status >= 500))
      throw new LLMError(
        error instanceof Error ? error.message : "Anthropic request failed",
        "anthropic",
        isRetryable
      )
    }
  }
}
