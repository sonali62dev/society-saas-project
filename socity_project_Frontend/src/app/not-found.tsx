'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function NotFound() {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // We only access window.location in useEffect to ensure it runs on the client
    const path = window.location.pathname
    
    // Check if this is a legacy emergency QR code link that couldn't be exported statically
    // e.g., /emergency/eb-12345
    if (path.startsWith('/emergency/') && path.length > 11) {
      setIsRedirecting(true)
      const segments = path.split('/')
      const emergencyId = segments[segments.length - 1]
      
      if (emergencyId) {
        // Redirect to the query-parameter version which works with static export
        router.replace(`/emergency?id=${emergencyId}`)
      }
    }
  }, [router])

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-teal-400" />
          <p className="font-bold">Redirecting to secure emergency portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col px-6">
      <h1 className="text-8xl font-black text-gray-900 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-8">Page Not Found</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button 
        onClick={() => router.push('/dashboard')}
        className="bg-[#1e3a5f] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#2c4c7c] transition-colors cursor-pointer"
      >
        Return to Dashboard
      </button>
    </div>
  )
}
