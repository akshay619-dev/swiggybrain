import { NextRequest } from "next/server"
import { getToken } from "@/lib/auth/tokens"
import { streamChat } from "@/lib/ai/agent"
import { checkRateLimit, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "@/lib/utils/rate-limit"
import type { Message } from "@/lib/ai/providers/types"

export async function POST(request: NextRequest) {
  // Rate limit by IP to save LLM credits
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown"
  const { allowed, retryAfterMs } = checkRateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please slow down." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil((retryAfterMs ?? 1000) / 1000)),
        },
      }
    )
  }

  let token: string | null
  if (process.env.DEV_MODE === "true") {
    token = "dev-mock-token"
  } else {
    token = await getToken()
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  const body = await request.json()
  const { message, history } = body as { message: string; history: Message[] }

  if (!message || typeof message !== "string") {
    return new Response(JSON.stringify({ error: "Message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()

      try {
        for await (const chunk of streamChat({
          message,
          history: history ?? [],
          token,
        })) {
          const data = `data: ${JSON.stringify(chunk)}\n\n`
          controller.enqueue(encoder.encode(data))
        }
      } catch (error) {
        const errorChunk = {
          type: "text",
          content: "\n\nSomething went wrong. Please try again.",
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(errorChunk)}\n\n`)
        )
      } finally {
        const doneChunk = { type: "done" }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(doneChunk)}\n\n`)
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
