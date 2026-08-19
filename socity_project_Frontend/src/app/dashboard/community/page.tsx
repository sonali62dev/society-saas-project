'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CommunityPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/community/forum')
  }, [router])

  return (
    <div className="p-6 text-muted-foreground animate-pulse">
      Redirecting to Community Forum...
    </div>
  )
}
