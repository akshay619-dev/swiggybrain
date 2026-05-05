import { MCPError } from "@/lib/utils/errors"

export type MCPServer = "food" | "instamart" | "dineout"

const SERVER_URLS: Record<MCPServer, string> = {
  food: "https://mcp.swiggy.com/food",
  instamart: "https://mcp.swiggy.com/im",
  dineout: "https://mcp.swiggy.com/dineout",
}

export class MCPClient {
  constructor(
    private server: MCPServer,
    private token: string
  ) {}

  async callTool<T>(toolName: string, args: Record<string, unknown> = {}): Promise<T> {
    const url = SERVER_URLS[this.server]
    const maxRetries = 2

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: crypto.randomUUID(),
          method: "tools/call",
          params: {
            name: toolName,
            arguments: args,
          },
        }),
      })

      if (response.ok) {
        const json = await response.json() as { error?: { message?: string; code?: number }; result: T }
        if (json.error) {
          throw new MCPError(json.error.message ?? "MCP tool error", json.error.code ?? 500, this.server)
        }
        return json.result as T
      }

      const error = new MCPError(
        `MCP ${this.server} error: ${response.status}`,
        response.status,
        this.server
      )

      if (!error.isRetryable || attempt === maxRetries) {
        throw error
      }

      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
    }

    throw new MCPError("Max retries exceeded", 500, this.server)
  }
}
