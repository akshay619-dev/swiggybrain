export interface Message {
  role: "system" | "user" | "assistant" | "tool"
  content: string | null
  tool_calls?: ToolCall[]
  tool_call_id?: string
}

export interface ToolCall {
  id: string
  type: "function"
  function: {
    name: string
    arguments: string // JSON string
  }
}

export interface ToolDefinition {
  type: "function"
  function: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

export type StreamChunk =
  | { type: "text"; content: string }
  | { type: "tool_calls"; calls: ToolCall[] }
  | { type: "done" }

export interface LLMProvider {
  readonly name: string
  chat(params: {
    messages: Message[]
    tools: ToolDefinition[]
  }): AsyncGenerator<StreamChunk>
}
