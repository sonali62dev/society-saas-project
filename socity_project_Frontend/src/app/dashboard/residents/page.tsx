'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ResidentsPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/residents/directory')
  }, [router])

  return (
    <div className="p-6 text-muted-foreground animate-pulse">
      Redirecting to Resident Directory...
    </div>
  )
}
