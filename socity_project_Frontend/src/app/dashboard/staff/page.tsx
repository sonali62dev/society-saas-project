'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StaffPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/staff/guards')
  }, [router])

  return (
    <div className="p-6 text-muted-foreground animate-pulse">
      Redirecting to Staff Guards...
    </div>
  )
}
