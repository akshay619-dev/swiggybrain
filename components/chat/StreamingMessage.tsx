"use client"

import { AssistantContent } from "./MessageBubble"

interface StreamingMessageProps {
  content: string
  onAction?: (message: string) => void
}

export function StreamingMessage({ content, onAction }: StreamingMessageProps) {
  return (
    <div className="animate-enter max-w-[88%]">
      {content ? (
        <>
          <AssistantContent content={content} onAction={onAction} />
          <span className="inline-block w-[3px] h-[18px] bg-[#FF5200] ml-0.5 align-middle animate-blink rounded-full" />
        </>
      ) : (
        <div className="flex items-center gap-1.5 py-1">
          {[0, 0.15, 0.3].map((delay, i) => (
            <span
              key={i}
              className="block w-2 h-2 rounded-full bg-[#444]"
              style={{ animation: "dot-pulse 1.2s ease-in-out infinite", animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
