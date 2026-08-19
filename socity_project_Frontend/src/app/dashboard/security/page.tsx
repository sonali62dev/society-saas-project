'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SecurityPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/security/visitors')
  }, [router])

  return (
    <div className="p-6 text-muted-foreground animate-pulse">
      Redirecting to Visitors...
    </div>
  )
}
