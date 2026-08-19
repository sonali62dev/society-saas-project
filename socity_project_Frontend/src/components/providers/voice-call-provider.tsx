'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { getSocket, connectUser } from '@/lib/socket'
import { useAuthStore } from '@/lib/stores/auth-store'
import toast from 'react-hot-toast'

type CallState = 'IDLE' | 'RINGING' | 'CONNECTED' | 'DIALING' | 'ENDED'

interface VoiceCallContextType {
  callState: CallState
  incomingCall: any
  startCall: (toUserId: number | string, visitorName: string, visitorPhone: string) => Promise<void>
  acceptCall: () => Promise<void>
  rejectCall: () => void
  endCall: () => void
  localStream: MediaStream | null
  remoteStream: MediaStream | null
}

const VoiceCallContext = createContext<VoiceCallContextType | undefined>(undefined)

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}

export const VoiceCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [callState, setCallState] = useState<CallState>('IDLE')
  const [incomingCall, setIncomingCall] = useState<any>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const startCall = async (toUserId: number | string, visitorName: string, visitorPhone: string) => {
    setCallState('DIALING')
    toast.success(`Calling ${visitorName}... (Demo Voice Call)`)
    setTimeout(() => {
      setCallState('CONNECTED')
    }, 2000)
  }

  const acceptCall = async () => {
    setCallState('CONNECTED')
    toast.success('Call connected')
  }

  const rejectCall = () => {
    setCallState('IDLE')
    setIncomingCall(null)
    toast('Call rejected')
  }

  const endCall = () => {
    setCallState('IDLE')
    setIncomingCall(null)
    toast('Call ended')
  }

  return (
    <VoiceCallContext.Provider value={{
      callState,
      incomingCall,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      localStream,
      remoteStream
    }}>
      {children}
    </VoiceCallContext.Provider>
  )
}

export const useVoiceCall = () => {
  const context = useContext(VoiceCallContext)
  if (!context) throw new Error('useVoiceCall must be used within a VoiceCallProvider')
  return context
}
