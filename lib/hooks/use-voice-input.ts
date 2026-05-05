"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface UseVoiceInputReturn {
  isListening: boolean
  isSupported: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
}

/**
 * Hook for voice input using the Web Speech API (SpeechRecognition).
 * Works in Chrome, Edge, Safari. Falls back gracefully if unsupported.
 *
 * @param onResult - called with final transcript when user stops speaking
 */
export function useVoiceInput(onResult: (text: string) => void): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const onResultRef = useRef(onResult)

  // Keep the callback ref up to date without re-creating the recognition instance
  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  // Create recognition instance ONCE on mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) return

    setIsSupported(true)

    const recognition = new SpeechRecognition()
    recognition.continuous = true // Keep listening until user stops it
    recognition.interimResults = true
    recognition.lang = "en-IN"

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ""
      let final = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          final += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      setTranscript(final || interim)

      if (final) {
        onResultRef.current(final.trim())
        setTranscript("")
        setIsListening(false)
        recognition.stop()
      }
    }

    recognition.onerror = (event) => {
      // "no-speech" is not a real error — user just hasn't spoken yet
      const errorEvent = event as Event & { error?: string }
      if (errorEvent.error === "no-speech") return

      setIsListening(false)
      setTranscript("")
    }

    recognition.onend = () => {
      // Only update state — don't restart. The user controls start/stop.
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
    }
  }, []) // Empty deps — create once

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    setTranscript("")
    setIsListening(true)
    try {
      recognitionRef.current.start()
    } catch {
      // Already started — ignore
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
    setTranscript("")
  }, [])

  return { isListening, isSupported, transcript, startListening, stopListening }
}
