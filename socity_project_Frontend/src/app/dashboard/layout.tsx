'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { useAuthStore } from '@/lib/stores/auth-store'
import { SocietyPaymentFlow } from '@/components/society/SocietyPaymentFlow'
import { TrialExpiryNotice } from '@/components/dashboard/TrialExpiryNotice'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, user, _hasHydrated } = useAuthStore()

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router, _hasHydrated])

  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const isAdmin = user?.role === 'admin'



  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar - Hidden on mobile for all users */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <TrialExpiryNotice />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation - For all users on mobile */}
      <MobileBottomNav />
    </div>
  )
}

