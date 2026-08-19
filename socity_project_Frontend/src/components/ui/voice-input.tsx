import React, { useState } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSpeechToText } from '@/lib/hooks/use-speech-to-text'
import { cn } from '@/lib/utils/cn'

interface VoiceInputProps {
  onResult: (text: string) => void
  language?: 'en-IN' | 'hi-IN'
  className?: string
  size?: 'sm' | 'default' | 'icon'
}

export function VoiceInput({ onResult, language = 'en-IN', className, size = 'icon' }: VoiceInputProps) {
  const { isListening, startListening, stopListening, isSupported } = useSpeechToText()
  const [localListening, setLocalListening] = useState(false)

  if (!isSupported) return null

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (localListening) {
      stopListening()
      setLocalListening(false)
    } else {
      setLocalListening(true)
      startListening((txt) => {
        // Clean up simple number parsing if users say numbers, e.g., remove spaces from phone numbers
        onResult(txt)
        setLocalListening(false)
      }, language)
    }
  }

  return (
    <Button
      variant="ghost"
      size={size === 'icon' ? 'icon' : 'sm'}
      type="button"
      onClick={handleToggle}
      className={cn(
        "transition-all duration-300 shrink-0",
        localListening ? "bg-red-50 text-red-600 hover:bg-red-100 animate-pulse" : "hover:bg-muted text-muted-foreground",
        className
      )}
      title="Speak"
    >
      {localListening ? (
        <Mic className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4 opacity-70" />
      )}
    </Button>
  )
}
