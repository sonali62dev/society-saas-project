'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FacilitiesPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/facilities/amenities')
  }, [router])

  return (
    <div className="p-6 text-muted-foreground animate-pulse">
      Redirecting to Amenities...
    </div>
  )
}
