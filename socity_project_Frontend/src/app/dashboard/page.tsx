'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import dynamic from 'next/dynamic'
import { AdvertisementBanner } from '@/components/dashboard/advertisement-banner'
import { NoticeBanner } from '@/components/dashboard/notice-banner'

// Loading skeleton for dashboards
const DashboardSkeleton = () => (
  <div className="w-full h-full p-6 space-y-6 animate-pulse">
    <div className="h-8 bg-muted rounded w-1/4"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-32 bg-muted rounded-xl"></div>
      <div className="h-32 bg-muted rounded-xl"></div>
      <div className="h-32 bg-muted rounded-xl"></div>
    </div>
    <div className="h-64 bg-muted rounded-xl"></div>
  </div>
)


const SuperAdminDashboard = dynamic(
  () => import('@/components/dashboard/super-admin-dashboard').then(mod => mod.SuperAdminDashboard),
  { loading: () => <DashboardSkeleton /> }
)
const AdminDashboard = dynamic(
  () => import('@/components/dashboard/admin-dashboard').then(mod => mod.AdminDashboard),
  { loading: () => <DashboardSkeleton /> }
)
const ResidentDashboard = dynamic(
  () => import('@/components/dashboard/resident-dashboard').then(mod => mod.ResidentDashboard),
  { loading: () => <DashboardSkeleton /> }
)
const SecurityDashboard = dynamic(
  () => import('@/components/dashboard/security-dashboard').then(mod => mod.SecurityDashboard),
  { loading: () => <DashboardSkeleton /> }
)
const VendorDashboard = dynamic(
  () => import('@/components/dashboard/vendor-dashboard').then(mod => mod.VendorDashboard),
  { loading: () => <DashboardSkeleton /> }
)
const IndividualDashboard = dynamic(
  () => import('@/components/dashboard/individual-dashboard').then(mod => mod.IndividualDashboard),
  { loading: () => <DashboardSkeleton /> }
)

export default function DashboardPage() {
  const { user } = useAuthStore()
  const role = (user?.role || '').toLowerCase()

  // Wrap everything in a main container
  return (
    <div className="w-full flex-1 md:p-6 space-y-6">
      <NoticeBanner />

      {/* Role-specific dashboards */}
      {(role === 'super_admin' || role === 'superadmin') && <SuperAdminDashboard />}
      {role === 'admin' && <AdminDashboard />}
      {role === 'resident' && <ResidentDashboard />}
      {role === 'guard' && <SecurityDashboard />}
      {role === 'vendor' && <VendorDashboard />}
      {role === 'individual' && <IndividualDashboard />}
      {!role && <ResidentDashboard />}
    </div>
  )
}
