'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PurchasePage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/purchase/requests')
  }, [router])

  return (
    <div className="p-6 text-muted-foreground animate-pulse">
      Redirecting to Purchase Requests...
    </div>
  )
}
