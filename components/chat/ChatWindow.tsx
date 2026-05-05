"use client"

import { useEffect, useRef } from "react"
import { MessageBubble } from "./MessageBubble"
import { StreamingMessage } from "./StreamingMessage"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatWindowProps {
  messages: Message[]
  streamingContent: string
  isStreaming: boolean
  onAction: (message: string) => void
}

export function ChatWindow({
  messages,
  streamingContent,
  isStreaming,
  onAction,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent])

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-5 py-6 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            onAction={onAction}
          />
        ))}

        {isStreaming && (
          <StreamingMessage content={streamingContent} onAction={onAction} />
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
