"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface UseVoiceOutputReturn {
  isSpeaking: boolean
  isSupported: boolean
  speak: (text: string) => void
  stop: () => void
}

/**
 * Hook for voice output using the Web Speech API (SpeechSynthesis).
 * Strips card JSON blocks and markdown formatting before speaking.
 */
export function useVoiceOutput(): UseVoiceOutputReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Check support on mount only (avoids hydration mismatch)
  useEffect(() => {
    setIsSupported("speechSynthesis" in window)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return

      // Stop any current speech
      window.speechSynthesis.cancel()

      // Clean the text: remove card blocks, markdown, and extra whitespace
      const cleaned = text
        .replace(/```card[\s\S]*?```/g, "") // Remove card JSON blocks
        .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold markers
        .replace(/[₹]/g, "rupees ") // Pronounce rupee symbol
        .replace(/\s+/g, " ") // Collapse whitespace
        .trim()

      if (!cleaned) return

      const utterance = new SpeechSynthesisUtterance(cleaned)
      utterance.lang = "en-IN"
      utterance.rate = 1.05
      utterance.pitch = 1.0

      // Try to use a good voice
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("Daniel"))
      )
      if (preferred) utterance.voice = preferred

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [isSupported]
  )

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  return { isSpeaking, isSupported, speak, stop }
}
