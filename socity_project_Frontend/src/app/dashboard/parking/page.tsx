'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ParkingPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/parking/slots')
  }, [router])

  return (
    <div className="p-6 text-muted-foreground animate-pulse">
      Redirecting to Parking Slots...
    </div>
  )
}
