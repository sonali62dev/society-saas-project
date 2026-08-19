import { Suspense } from 'react'
import { UserActivityClient } from './user-activity-client'

export default function UserActivityPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>}>
            <UserActivityClient />
        </Suspense>
    )
}
