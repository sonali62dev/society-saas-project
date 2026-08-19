'use client'

import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/role-guard'

import { toast } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export default function RevenueReportsPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['revenue-stats'],
    queryFn: async () => {
      const response = await api.get('/platform-invoices/stats')
      return response.data
    }
  })

  const totalRevenue = statsData?.totalRevenue || 0
  
  const monthlyRevenue = Object.entries(statsData?.trend || {}).map(([month, revenue]) => ({
    month,
    revenue: revenue as number,
    target: (revenue as number) * 0.9 // Mock target based on real revenue
  }))

  const revenueByStatus = (statsData?.invoicesByStatus || []).map((item: any) => ({
    name: item.status,
    value: item._sum.amount || 0,
    color: item.status === 'PAID' ? '#10b981' : item.status === 'PENDING' ? '#f59e0b' : '#ef4444'
  }))

  const outstanding = (statsData?.invoicesByStatus || [])
    .find((item: any) => item.status === 'PENDING')?._sum.amount || 0

  const mrr = Object.values(statsData?.trend || {}).pop() as number || 0
  const topSocieties = statsData?.topSocieties || []

  const handleExport = () => {
    toast.success('Exporting revenue report...')
  }

  const handleYearChange = (year: string) => {
    toast.success(`Showing reports for year ${year}`)
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Revenue Reports</h1>
            <p className="text-gray-600">Platform revenue analytics and insights</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="2024" onValueChange={handleYearChange}>
              <SelectTrigger className="w-32">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +0% vs last month
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-white/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Current MRR</p>
                  <p className="text-3xl font-bold">₹{mrr.toLocaleString()}</p>
                  <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +0% from last month
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-white/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Active Societies</p>
                  <p className="text-3xl font-bold">{topSocieties.length}</p>
                  <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" />
                    Live Data
                  </p>
                </div>
                <Building2 className="h-10 w-10 text-white/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Outstanding</p>
                  <p className="text-3xl font-bold">₹{outstanding.toLocaleString()}</p>
                  <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                    <ArrowDownRight className="h-3 w-3" />
                    Pending Invoices
                  </p>
                </div>
                <TrendingDown className="h-10 w-10 text-white/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <Card className="border-0 shadow-md lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue vs trend</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="target" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue by Plan */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Revenue by Status</CardTitle>
              <CardDescription>Paid vs Pending Distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={revenueByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {revenueByStatus.map((entry: any, index: number) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {revenueByStatus.map((status: any) => (
                  <div key={status.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="text-sm text-gray-600">{status.name}</span>
                  </div>
                ))}
                {revenueByStatus.length === 0 && (
                  <span className="text-xs text-gray-400 font-medium">No invoice data</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Societies */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Top Revenue Generating Societies</CardTitle>
            <CardDescription>Total Collections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSocieties.map((society: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{society.name}</p>
                      <p className="text-sm text-gray-500">Subscription</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{society.revenue}</p>
                    <p className={`text-sm ${society.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {society.growth}
                    </p>
                  </div>
                </div>
              ))}
              {topSocieties.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 font-medium">No revenue entries found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </RoleGuard>
  )
}
