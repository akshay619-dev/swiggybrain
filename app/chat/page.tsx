"use client"

import { useState, useCallback, useEffect } from "react"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { ChatInput } from "@/components/chat/ChatInput"
import { LogoFull, LogoHero } from "@/components/Logo"
import { useVoiceOutput } from "@/lib/hooks/use-voice-output"
import { Volume2, VolumeX } from "lucide-react"
import type { Message } from "@/lib/ai/providers/types"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "Lunch under ₹300",
  "Best biryani near me",
  "Cook or order tonight?",
  "Surprise me with something new",
  "Saturday dinner for 4",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const { isSpeaking, isSupported: ttsSupported, speak, stop } = useVoiceOutput()

  // Auto-speak new assistant messages when voice is enabled
  const lastMessageCount = messages.length
  useEffect(() => {
    if (!voiceEnabled || lastMessageCount === 0) return
    const lastMsg = messages[messages.length - 1]
    if (lastMsg?.role === "assistant") {
      speak(lastMsg.content)
    }
  }, [lastMessageCount, voiceEnabled, messages, speak])

  const handleSend = useCallback(async (message: string) => {
    if (!message.trim() || isStreaming) return

    // Stop any current speech
    if (isSpeaking) stop()

    const userMessage: ChatMessage = { role: "user", content: message }
    setMessages((prev) => [...prev, userMessage])
    setIsStreaming(true)
    setStreamingContent("")

    const history: Message[] = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      })

      if (response.status === 401) {
        window.location.href = "/"
        return
      }

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split("\n")

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const jsonStr = line.slice(6).trim()
          if (!jsonStr) continue

          try {
            const chunk = JSON.parse(jsonStr)

            if (chunk.type === "text") {
              accumulated += chunk.content
              setStreamingContent(accumulated)
            }

            if (chunk.type === "done") {
              if (accumulated) {
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", content: accumulated },
                ])
              }
              setStreamingContent("")
              setIsStreaming(false)
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    } catch (error) {
      void error
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ])
      setIsStreaming(false)
      setStreamingContent("")
    }
  }, [messages, isStreaming, isSpeaking, stop])

  const handleAction = useCallback(
    (actionMessage: string) => {
      handleSend(actionMessage)
    },
    [handleSend]
  )

  const showSuggestions = messages.length === 0 && !isStreaming

  return (
    <div className="flex flex-col h-screen chat-bg">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-5 h-14 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2.5">
          <LogoFull />
        </div>
        <div className="flex items-center gap-3">
          {/* Voice toggle — only render after mount to avoid hydration mismatch */}
          {mounted && ttsSupported && (
            <button
              onClick={() => {
                if (isSpeaking) stop()
                setVoiceEnabled((v) => !v)
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                voiceEnabled
                  ? "bg-[#FF5200]/15 text-[#FF5200]"
                  : "text-[#555] hover:text-[#999]"
              }`}
              title={voiceEnabled ? "Voice responses on" : "Voice responses off"}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          )}
          <a
            href="/api/auth/logout"
            className="text-[13px] text-[#555] hover:text-[#999] transition-colors"
          >
            Sign out
          </a>
        </div>
      </header>

      {/* Main chat area */}
      <div className="flex-1 overflow-hidden relative">
        {showSuggestions ? (
          <div className="h-full flex flex-col items-center justify-center px-6">
            <div className="text-center space-y-5 max-w-md">
              <LogoHero />
              <div>
                <h2 className="text-white text-lg font-semibold">What are you in the mood for?</h2>
                <p className="text-[#666] text-sm mt-1.5">I&apos;ll find the best option, apply coupons, and get you sorted.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="sb-chip"
                    onClick={() => handleSend(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ChatWindow
            messages={messages}
            streamingContent={streamingContent}
            isStreaming={isStreaming}
            onAction={handleAction}
          />
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-[#1a1a1a] px-4 py-3">
        <ChatInput onSend={handleSend} isLoading={isStreaming} />
      </div>
    </div>
  )
}
