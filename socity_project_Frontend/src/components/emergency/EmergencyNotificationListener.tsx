'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { connectSocket, connectPlatformAdmin, disconnectSocket, getSocket } from '@/lib/socket'
import { toast } from 'react-hot-toast'
import { AlertTriangle, Bell, Phone, MapPin, X, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

interface AlertPayload {
  id: number
  type: string
  description: string
  unit: string | null
  userId: number
  societyId: number
  createdAt: string
  user?: {
    name: string
    phone: string
  }
  society?: {
    name: string
  }
}

export default function EmergencyNotificationListener() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, isAuthenticated } = useAuthStore()
  const [activeAlert, setActiveAlert] = useState<AlertPayload | null>(null)
  
  useEffect(() => {
    if (isAuthenticated) {
      let socket: any;
      if (user?.role === 'super_admin') {
        socket = connectPlatformAdmin()
      } else if (user?.societyId) {
        socket = connectSocket(user.societyId)
      }

      if (socket) {
        socket.on('new_emergency_alert', (alert: AlertPayload) => {
          console.log('Received emergency alert:', alert)
          // Refresh bell notifications so new emergency notification shows
          queryClient.invalidateQueries({ queryKey: ['notifications'] })
          
          if (user?.role === 'super_admin') {
            // Logical for Super Admin: Non-disruptive Toast with Society Info
            toast((t) => (
              <div className="flex flex-col gap-2 min-w-[300px]">
                <div className="flex items-center gap-2 text-red-600 font-bold">
                  <AlertTriangle className="h-5 w-5" />
                  <span>EMERGENCY SOS: {alert.society?.name || 'Unknown Society'}</span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">{alert.type.toUpperCase()}</span> alert triggered in 
                  <span className="font-bold"> {alert.unit || 'Society'}</span>
                </p>
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => {
                      router.push('/dashboard/super-admin/emergency-logs')
                      toast.dismiss(t.id)
                    }}
                    className="gap-1 h-8"
                  >
                    <ExternalLink className="h-3 w-3" /> View Logs
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.dismiss(t.id)} className="h-8">
                    Dismiss
                  </Button>
                </div>
              </div>
            ), {
              duration: 15000,
              position: 'top-right',
              style: { border: '2px solid #ef4444', borderRadius: '12px' }
            })
          } else if (user?.role === 'admin' || user?.role === 'guard' || user?.role === 'community-manager') {
            // Disruptive for local Admin/Security
            setActiveAlert(alert)
          } else {
            // Residents
            toast.error(`Emergency SOS: ${alert.type.toUpperCase()} in your society!`, {
              duration: 10000,
              icon: <AlertTriangle className="text-red-500" />
            })
          }
        })
      }

      return () => {
        if (socket) {
          socket.off('new_emergency_alert')
          disconnectSocket()
        }
      }
    }
  }, [isAuthenticated, user, router])

  if (!activeAlert) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-red-600/90 backdrop-blur-lg flex items-center justify-center p-4 text-white overflow-y-auto"
      >
        <div className="absolute top-4 right-4 animate-pulse">
          <Bell className="h-16 w-16 opacity-30" />
        </div>

        <div className="max-w-xl w-full text-center space-y-8 py-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl"
          >
            <AlertTriangle className="h-14 w-14 text-red-600" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-5xl font-black uppercase tracking-tighter animate-bounce">
              Emergency SOS Triggered!
            </h1>
            <p className="text-2xl font-medium opacity-90">
              Immediate Assistance Required
            </p>
          </div>

          <div className="bg-white/10 p-6 rounded-3xl border border-white/20 backdrop-blur-sm text-left space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-white border-white text-lg py-1 px-4">
                {activeAlert.type.toUpperCase()}
              </Badge>
              <span className="text-sm opacity-70">
                {new Date(activeAlert.createdAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm opacity-70 uppercase font-bold tracking-wider">Location</p>
                  <p className="text-2xl font-bold">{activeAlert.unit || 'Unknown Unit'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Bell className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm opacity-70 uppercase font-bold tracking-wider">Reason</p>
                  <p className="text-xl">{activeAlert.description}</p>
                </div>
              </div>

              {activeAlert.user && (
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm opacity-70 uppercase font-bold tracking-wider">Resident Details</p>
                    <p className="text-xl font-bold">{activeAlert.user.name}</p>
                    <p className="text-lg opacity-90">{activeAlert.user.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              size="lg" 
              className="w-full bg-white text-red-600 hover:bg-gray-100 text-2xl h-16 font-black rounded-2xl shadow-xl"
              onClick={() => setActiveAlert(null)}
            >
              ACKNOWLEDGE & DISPATCH
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-white/30 text-white hover:bg-white/10 text-lg h-12 rounded-xl"
              onClick={() => setActiveAlert(null)}
            >
              CLOSE
            </Button>
          </div>
        </div>

        {/* CSS for full-screen alarm animation */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes pulse-bg {
            0% { background-color: rgba(220, 38, 38, 0.9); }
            50% { background-color: rgba(153, 27, 27, 0.95); }
            100% { background-color: rgba(220, 38, 38, 0.9); }
          }
          .animate-alarm {
            animation: pulse-bg 1s infinite;
          }
        `}} />
      </motion.div>
    </AnimatePresence>
  )
}
