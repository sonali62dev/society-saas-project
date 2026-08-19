'use client'

import React from 'react'
import { useVoiceCall } from '@/components/providers/voice-call-provider'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, PhoneOff, User, Smartphone, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const IncomingCallModal: React.FC = () => {
  const { callState, incomingCall, acceptCall, rejectCall, endCall } = useVoiceCall()

  if (callState === 'IDLE') return null

  return (
    <AnimatePresence>
      {(callState === 'RINGING' || callState === 'CONNECTED' || callState === 'DIALING') && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="max-w-md w-full"
          >
            <Card className="overflow-hidden border-0 shadow-2xl rounded-[40px] bg-slate-900 text-white">
              <div className="p-8 text-center">
                {/* Visual indicator for call state */}
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <motion.div
                    animate={callState === 'RINGING' ? { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-blue-500 rounded-full"
                  />
                  <div className="relative bg-blue-600 w-24 h-24 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/10">
                    <User className="h-10 w-10" />
                  </div>
                </div>

                <div className="space-y-1 mb-8">
                  <h2 className="text-2xl font-black tracking-tight uppercase">
                    {callState === 'RINGING' ? 'Incoming Voice Call' : 
                     callState === 'CONNECTED' ? 'Call Connected' : 'Calling Resident...'}
                  </h2>
                  <p className="text-blue-400 font-bold text-xs tracking-widest uppercase">
                    {incomingCall?.visitorName || 'Emergency Visitor'}
                  </p>
                </div>

                {/* Visitor Info if available */}
                {incomingCall && (
                  <div className="bg-white/5 rounded-3xl p-4 mb-8 border border-white/10 text-left space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-xl">
                        <Smartphone className="h-4 w-4 text-teal-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black opacity-50 uppercase tracking-wider">Caller Number</p>
                        <p className="font-bold">{incomingCall.visitorPhone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-xl">
                        <ShieldCheck className="h-4 w-4 text-blue-400" />
                      </div>
                      <p className="text-[10px] font-bold opacity-70 leading-tight">Your number is hidden. Security protocol active.</p>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                  {callState === 'RINGING' ? (
                    <>
                      <Button
                        onClick={rejectCall}
                        className="h-16 w-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/40"
                      >
                        <PhoneOff className="h-6 w-6" />
                      </Button>
                      <Button
                        onClick={acceptCall}
                        className="h-20 w-20 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 animate-pulse"
                      >
                        <Phone className="h-8 w-8" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={callState === 'DIALING' ? rejectCall : endCall}
                      className="h-20 w-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-900/40"
                    >
                      <PhoneOff className="h-8 w-8" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
