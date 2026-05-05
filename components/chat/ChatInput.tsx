"use client"

import { useState, useRef, useEffect, type FormEvent } from "react"
import { ArrowUp } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 max-w-2xl mx-auto w-full"
    >
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="What are you in the mood for?"
          disabled={isLoading}
          className="w-full h-11 bg-[#151515] border border-[#252525] rounded-xl px-4 text-[14px] text-white placeholder:text-[#555] focus:outline-none focus:border-[#FF5200]/40 transition-colors disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !value.trim()}
        className="shrink-0 w-10 h-10 rounded-xl bg-[#FF5200] hover:bg-[#e64a00] flex items-center justify-center transition-all disabled:opacity-20 disabled:hover:bg-[#FF5200]"
      >
        <ArrowUp className="text-white h-[18px] w-[18px]" />
      </button>
    </form>
  )
}
