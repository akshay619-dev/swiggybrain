"use client"

import { FoodCard } from "@/components/cards/FoodCard"
import { ComparisonCard } from "@/components/cards/ComparisonCard"
import { DineoutCard } from "@/components/cards/DineoutCard"
import { CartCard } from "@/components/cards/CartCard"

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
  onAction?: (message: string) => void
}

function parseContentBlocks(content: string): Array<{ type: "text" | "card"; value: string }> {
  const cardBlockRegex = /```card\n([\s\S]*?)```/g
  const blocks: Array<{ type: "text" | "card"; value: string }> = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = cardBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ type: "text", value: content.slice(lastIndex, match.index) })
    }
    blocks.push({ type: "card", value: match[1].trim() })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    blocks.push({ type: "text", value: content.slice(lastIndex) })
  }

  return blocks
}

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-white font-medium">{part.slice(2, -2)}</strong>
        }
        return part.split("\n").map((line, j, arr) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ))
      })}
    </>
  )
}

function CardBlock({
  json,
  onAction,
}: {
  json: string
  onAction?: (message: string) => void
}) {
  let parsed: { cardType: string; data: unknown }

  try {
    parsed = JSON.parse(json)
  } catch {
    return (
      <pre className="text-xs text-red-400 bg-[#1a1a1a] rounded-lg p-3 overflow-x-auto my-2">
        {json}
      </pre>
    )
  }

  switch (parsed.cardType) {
    case "food":
      return <div className="my-3"><FoodCard data={parsed.data as never} onAction={onAction} /></div>
    case "comparison":
      return <div className="my-3"><ComparisonCard data={parsed.data as never} onAction={onAction} /></div>
    case "dineout":
      return <div className="my-3"><DineoutCard data={parsed.data as never} onAction={onAction} /></div>
    case "cart":
      return <div className="my-3"><CartCard data={parsed.data as never} onAction={onAction} /></div>
    default:
      return (
        <pre className="text-xs text-[#666] bg-[#1a1a1a] rounded-lg p-3 overflow-x-auto my-2">
          {json}
        </pre>
      )
  }
}

function AssistantContent({
  content,
  onAction,
}: {
  content: string
  onAction?: (message: string) => void
}) {
  const blocks = parseContentBlocks(content)
  return (
    <>
      {blocks.map((block, i) =>
        block.type === "card" ? (
          <CardBlock key={i} json={block.value} onAction={onAction} />
        ) : block.value.trim() ? (
          <p key={i} className="text-[14px] text-[#bbb] leading-[1.7]">
            <RichText text={block.value} />
          </p>
        ) : null
      )}
    </>
  )
}

export function MessageBubble({ role, content, onAction }: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end animate-enter">
        <div className="bg-[#FF5200] rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[75%]">
          <p className="text-[14px] text-white leading-relaxed">{content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-enter max-w-[88%]">
      <AssistantContent content={content} onAction={onAction} />
    </div>
  )
}

export { AssistantContent }
