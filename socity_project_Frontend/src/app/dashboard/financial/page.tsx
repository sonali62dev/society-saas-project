'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FinancialPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/financial/invoices')
  }, [router])

  return (
    <div className="p-6 text-muted-foreground animate-pulse">
      Redirecting to Financial Invoices...
    </div>
  )
}
