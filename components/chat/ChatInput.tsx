"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { ArrowUp, Mic, MicOff } from "lucide-react"
import { useVoiceInput } from "@/lib/hooks/use-voice-input"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleVoiceResult = (text: string) => {
    if (text.trim()) {
      onSend(text.trim())
    }
  }

  const { isListening, isSupported, transcript, startListening, stopListening } =
    useVoiceInput(handleVoiceResult)

  useEffect(() => {
    setMounted(true)
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (transcript) {
      setValue(transcript)
    }
  }, [transcript])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue("")
  }

  function handleMicClick() {
    if (isListening) {
      stopListening()
    } else {
      setValue("")
      startListening()
    }
  }

  // Only show mic after mount to avoid hydration mismatch
  const showMic = mounted && isSupported

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 max-w-2xl mx-auto w-full"
    >
      {/* Mic button — rendered only after client mount */}
      {showMic && (
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isLoading}
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-20 ${
            isListening
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : "bg-[#1a1a1a] border border-[#252525] hover:border-[#FF5200]/40 text-[#888] hover:text-[#FF5200]"
          }`}
        >
          {isListening ? (
            <MicOff className="h-[18px] w-[18px] text-white" />
          ) : (
            <Mic className="h-[18px] w-[18px]" />
          )}
        </button>
      )}

      {/* Text input */}
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={isListening ? "Listening..." : "What are you in the mood for?"}
          disabled={isLoading || isListening}
          className={`w-full h-11 bg-[#151515] border rounded-xl px-4 text-[14px] text-white placeholder:text-[#555] focus:outline-none transition-colors disabled:opacity-50 ${
            isListening
              ? "border-red-500/40 placeholder:text-red-400/60"
              : "border-[#252525] focus:border-[#FF5200]/40"
          }`}
        />
      </div>

      {/* Send button */}
      <button
        type="submit"
        disabled={isLoading || !value.trim() || isListening}
        className="shrink-0 w-10 h-10 rounded-xl bg-[#FF5200] hover:bg-[#e64a00] flex items-center justify-center transition-all disabled:opacity-20 disabled:hover:bg-[#FF5200]"
      >
        <ArrowUp className="text-white h-[18px] w-[18px]" />
      </button>
    </form>
  )
}
