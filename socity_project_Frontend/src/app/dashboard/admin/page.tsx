'use client'

import dynamic from 'next/dynamic'

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

const AdminDashboard = dynamic(
  () => import('@/components/dashboard/admin-dashboard').then(mod => mod.AdminDashboard),
  { loading: () => <DashboardSkeleton /> }
)

export default function AdminPage() {
  return (
    <div className="w-full flex-1 md:p-6 space-y-6">
      <AdminDashboard />
    </div>
  )
}
