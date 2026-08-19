'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Building2,
  User,
  Smartphone,
  MessageSquare,
  Loader2,
  Phone,
  PhoneIncoming,
  Users,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { API_URL } from '@/config/api.config'
import { useSearchParams } from 'next/navigation'
import { useVoiceCall } from '@/components/providers/voice-call-provider'

export default function ClientPage() {
  const searchParams = useSearchParams()
  const [barcodeId, setBarcodeId] = useState<string | null>(searchParams.get('id'))

  // Fallback: If no query param, try to get it from the URL path (e.g., /emergency/eb-xxx)
  useEffect(() => {
    if (!barcodeId && typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/')
      const lastPart = pathParts[pathParts.length - 1]
      // Support eb- and eb-reg- prefixes
      if (lastPart && lastPart.startsWith('eb-')) {
        setBarcodeId(lastPart)
      }
    }
  }, [barcodeId])

  const [barcode, setBarcode] = useState<any>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    reason: '',
  })

  // Use centralized API_URL
  const API_BASE = API_URL

  useEffect(() => {
    if (!barcodeId) return

    const validateBarcode = async () => {
      try {
        setIsValidating(true)
        const res = await fetch(`${API_BASE}/emergency/public/barcodes/${barcodeId}`)
        if (!res.ok) {
          throw new Error('Invalid or inactive barcode')
        }
        const data = await res.json()
        setBarcode(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load barcode')
      } finally {
        setIsValidating(false)
      }
    }

    validateBarcode()
  }, [barcodeId, API_BASE])

  const { startCall, callState } = useVoiceCall()

  const handleVoiceCall = async () => {
    if (!formData.name || !formData.phone) {
      toast.error('Please enter your name and mobile number first.')
      const formElement = document.getElementById('contact-form')
      formElement?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    if (!barcode?.userId) {
      toast.error('Resident is currently unavailable for voice calls.')
      return
    }

    await startCall(barcode.userId, formData.name, formData.phone)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone) {
      toast.error('Name and Mobile number are required.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE}/emergency/public/barcodes/${barcodeId}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName: formData.name,
          visitorPhone: formData.phone,
          reason: formData.reason,
          isEmergency: true
        })
      })

      if (!res.ok) {
        throw new Error('Failed to notify resident')
      }

      if (barcode?.userId) {
        // Automatically initiate voice call
        // DO NOT await so the UI can transition to the submitted state smoothly
        startCall(barcode.userId, formData.name, formData.phone)
      }

      setIsSubmitted(true)
      toast.success('Resident notified successfully.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit')
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-teal-400" />
          <p className="font-bold">Verifying Emergency Barcode...</p>
        </div>
      </div>
    )
  }

  if (error || !barcode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center p-8 border-0 shadow-2xl rounded-[40px]">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
            Invalid Barcode
          </h1>
          <p className="text-gray-500 mb-6 font-medium">
            {error || 'This barcode is no longer active or does not exist.'}
          </p>
          <Button
            className="w-full h-12 bg-[#1e3a5f] rounded-2xl font-bold"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full"
          >
            <Card className="border-0 shadow-2xl bg-white rounded-[40px] overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white relative">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-8 w-8" />
                  <h2 className="text-2xl font-black tracking-tight">Emergency Alert</h2>
                </div>

                <div className="space-y-4">
                  {/* Property Info */}
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                    <p className="text-sm font-bold opacity-80 uppercase tracking-wider">Property/Asset</p>
                    <p className="text-xl font-black mt-1">{barcode.label || barcode.type}</p>
                    <p className="text-sm opacity-80 mt-1">Resident: {barcode.residentName} (Unit: {barcode.unit})</p>
                  </div>

                  {/* Privacy Note */}
                  <div className="bg-black/20 rounded-2xl p-4 border border-white/10">
                    <div className="flex gap-3">
                      <Shield className="h-5 w-5 text-teal-400 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">Privacy Protected</p>
                        <p className="text-xs opacity-70 mt-1 leading-tight font-bold">Family phone numbers are hidden for security. Use the calling button below to connect securely.</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Actions Section */}
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest opacity-70 ml-1">Secure Contact</p>

                    {/* Voice Call Button (NEW PRIMARY ACTION) */}
                    <button
                      onClick={handleVoiceCall}
                      disabled={callState !== 'IDLE'}
                      className="w-full flex items-center justify-between bg-white text-emerald-600 p-4 rounded-2xl shadow-lg hover:bg-gray-50 transition-colors group text-left border-2 border-emerald-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-2 rounded-xl group-hover:bg-emerald-100 transition-colors">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-black text-sm">Direct Voice Call</p>
                          <p className="text-[10px] font-bold opacity-60 uppercase tracking-tight">Connect via internet (Secure)</p>
                        </div>
                      </div>
                      <div className="bg-emerald-600 text-white text-[10px] px-2 py-1 rounded-lg font-black tracking-tighter uppercase whitespace-nowrap">
                        {callState === 'IDLE' ? 'Call Now' : 'Calling...'}
                      </div>
                    </button>

                    {/* Notify Button (Secondary) */}
                    <button
                      onClick={() => {
                        const formElement = document.getElementById('contact-form');
                        formElement?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full flex items-center justify-between bg-gray-50 text-red-600 p-4 rounded-2xl hover:bg-gray-100 transition-all group text-left border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-xl group-hover:bg-gray-50 transition-colors">
                          <PhoneIncoming className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-black text-sm">Send App Alert</p>
                          <p className="text-[10px] font-bold opacity-60 uppercase tracking-tight">Notify via resident app</p>
                        </div>
                      </div>
                      <div className="text-gray-400"><MessageSquare className="h-4 w-4" /></div>
                    </button>
                  </div>
                </div>
              </div>

              <CardContent className="p-8" id="contact-form">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Your Name *</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Your Mobile Number *</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Message / Situation</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <Textarea
                        value={formData.reason}
                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        placeholder="e.g. Your car tire is punctured or blocking the gate..."
                        className="pl-12 pt-4 min-h-[120px] rounded-2xl border-gray-100 bg-gray-50 focus:bg-white font-bold"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-100 transition-all"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        NOTIFYING...
                      </div>
                    ) : 'SEND ALERT TO RESIDENT'}
                  </Button>

                  <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Your details will be shared with the resident for emergency contact only.
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <Card className="p-10 text-center bg-white rounded-[40px] shadow-2xl border-0">
              <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Alert Sent!</h2>
              <p className="text-gray-600 mb-8 font-medium leading-relaxed">
                The resident has been notified on their mobile app. They may contact you shortly. Thank you for your help.
              </p>
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl font-bold text-lg border-2"
                onClick={() => window.location.href = '/'}
              >
                Back to Home
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

