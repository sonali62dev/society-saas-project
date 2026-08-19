'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GuidelinesPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/guidelines/updates')
  }, [router])

  return (
    <div className="p-6 text-muted-foreground animate-pulse">
      Redirecting to Guidelines...
    </div>
  )
}
