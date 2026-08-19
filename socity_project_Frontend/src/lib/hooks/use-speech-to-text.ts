import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'

interface SpeechRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  lang?: string
}

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState<any>(null)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    const recognizer = new SpeechRecognition()
    recognizer.continuous = false
    recognizer.interimResults = false
    recognizer.lang = 'en-IN' // Set defaults to English Indian which works for Hindi mixed accents too.

    recognizer.onstart = () => setIsListening(true)
    recognizer.onend = () => setIsListening(false)
    recognizer.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      if (event.error !== 'no-speech') {
        toast.error(`Voice recognition error: ${event.error}`)
      }
    }

    setRecognition(recognizer)
  }, [])

  const startListening = useCallback((onResult: (text: string) => void, langOverride?: string) => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in this browser.')
      return
    }

    if (langOverride) {
      recognition.lang = langOverride
    }

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      onResult(text)
    }

    try {
      recognition.start()
    } catch (e) {
      // Already started probably
      console.log(e)
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening
  }
}
