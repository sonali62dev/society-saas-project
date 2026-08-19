'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HelpdeskPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/helpdesk/tickets')
  }, [router])

  return (
    <div className="p-6 text-muted-foreground animate-pulse">
      Redirecting to Helpdesk Tickets...
    </div>
  )
}
