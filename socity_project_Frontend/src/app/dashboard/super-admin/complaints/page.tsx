'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SuperAdminComplaintsPage() {
    const router = useRouter()
    useEffect(() => {
        router.replace('/dashboard/helpdesk/tickets')
    }, [router])

    return (
        <div className="p-6 text-muted-foreground animate-pulse font-medium">
            Redirecting to Unified Help & Support Desk...
        </div>
    )
}
