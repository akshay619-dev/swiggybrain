import { createProvider } from "./providers/fallback"
import { TOOL_DEFINITIONS, executeToolCall } from "./tools"
import { SYSTEM_PROMPT } from "./prompts"
import type { Message, StreamChunk, ToolCall } from "./providers/types"

export interface ChatRequest {
  message: string
  history: Message[]
  token: string
}

export async function* streamChat(request: ChatRequest): AsyncGenerator<StreamChunk> {
  const provider = createProvider()

  const messages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...request.history,
    { role: "user", content: request.message },
  ]

  const maxIterations = 15

  for (let i = 0; i < maxIterations; i++) {
    let accumulatedToolCalls: ToolCall[] = []
    let hasToolCalls = false
    let receivedText = false

    for await (const chunk of provider.chat({
      messages,
      tools: TOOL_DEFINITIONS,
    })) {
      if (chunk.type === "tool_calls") {
        hasToolCalls = true
        accumulatedToolCalls = chunk.calls

        for (const call of accumulatedToolCalls) {
          const result = await executeToolCall(
            call.function.name,
            call.function.arguments,
            request.token
          )

          messages.push({
            role: "assistant",
            content: null,
            tool_calls: [call],
          })
          messages.push({
            role: "tool",
            content: result,
            tool_call_id: call.id,
          })
        }
        break // Re-enter loop with tool results
      }

      if (chunk.type === "text") {
        receivedText = true
        yield chunk
      }

      if (chunk.type === "done") {
        return
      }
    }

    if (!hasToolCalls && receivedText) {
      return
    }

    if (!hasToolCalls && !receivedText) {
      return
    }
  }

  yield { type: "text", content: "\n\nI've hit my thinking limit. Could you try rephrasing?" }
  yield { type: "done" }
}
