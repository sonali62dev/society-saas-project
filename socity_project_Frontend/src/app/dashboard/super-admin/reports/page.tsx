'use client'

import { motion } from 'framer-motion'
import {
  TrendingUp,
  Building2,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/role-guard'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export default function PlatformReportsPage() {
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['platform-reports'],
    queryFn: async () => {
      const response = await api.get('/reports/platform-stats')
      return response.data
    }
  })

  // Transformed data
  const statsOverview = [
    {
      title: 'Total Revenue',
      value: reportsData?.overview?.totalRevenue || '₹0',
      change: reportsData?.overview?.revenueChange || '+0%',
      trend: 'up',
      icon: CreditCard,
      color: 'bg-green-500',
    },
    {
      title: 'Active Societies',
      value: reportsData?.overview?.activeSocieties?.toString() || '0',
      change: reportsData?.overview?.societiesChange || '+0 this month',
      trend: 'up',
      icon: Building2,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Users',
      value: reportsData?.overview?.totalUsers?.toLocaleString() || '0',
      change: '+0', // Could be dynamic
      trend: 'up',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Avg. Engagement',
      value: reportsData?.overview?.avgEngagement || '0%',
      change: '-0%',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  const revenueByPlan = reportsData?.revenueByPlan || []
  const topSocieties = reportsData?.topSocieties || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Platform Reports</h1>
            <p className="text-gray-600">Analytics and insights across all societies</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="30d">
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsOverview.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 ${stat.color} rounded-xl`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div
                      className={`flex items-center text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue by Plan */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Revenue by Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByPlan.map((item: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.plan}</p>
                        <p className="text-sm text-gray-500">{item.societies} societies</p>
                      </div>
                      <p className="font-semibold">{item.revenue}</p>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                {revenueByPlan.length === 0 && (
                  <p className="text-center py-4 text-gray-500">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Societies */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Top Performing Societies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSocieties.map((society: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{society.name}</p>
                        <p className="text-sm text-gray-500">{society.users.toLocaleString()} users</p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-600">{society.revenue}</p>
                  </div>
                ))}
                {topSocieties.length === 0 && (
                  <p className="text-center py-4 text-gray-500">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </RoleGuard>
  )
}
