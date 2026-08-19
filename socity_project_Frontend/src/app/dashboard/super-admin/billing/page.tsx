'use client'

import { motion } from 'framer-motion'
import {
  CreditCard,
  TrendingUp,
  DollarSign,
  FileText,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RoleGuard } from '@/components/auth/role-guard'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

// Mock types/interfaces for platform stats
interface PlatformStats {
  platformStats: {
    totalSocieties: number;
    monthlyRevenue: number;
  };
  societyGrowthData: any[];
  revenueData: any[];
  subscriptionStats: any[];
}

export default function PlatformBillingPage() {
  const { data: stats, isLoading: isStatsLoading } = useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const response = await api.get('/reports/platform-stats')
      return response.data
    }
  })

  const { data: transactions = [], isLoading: isTxLoading } = useQuery<any[]>({
    queryKey: ['platform-transactions'],
    queryFn: async () => {
      const response = await api.get('/transactions')
      return response.data
    }
  })

  if (isStatsLoading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const { platformStats, revenueData, subscriptionStats } = stats
  // For totalMRR in subscriptions we calculate based on existing stats
  const totalMRR = platformStats.monthlyRevenue;
  const recentTransactions = transactions.slice(0, 5).map(tx => ({
    id: tx.id,
    society: tx.society?.name || 'N/A',
    amount: tx.amount,
    type: tx.category || tx.type,
    date: new Date(tx.date).toLocaleDateString(),
    status: tx.status.toLowerCase()
  }));

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Billing</h1>
          <p className="text-gray-600">Revenue, subscriptions, and billing management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Monthly Revenue</p>
                  <p className="text-3xl font-bold">₹{(totalMRR / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +12% from last month
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
                  <p className="text-sm text-white/80">Active Subscriptions</p>
                  <p className="text-3xl font-bold">156</p>
                  <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +8 this month
                  </p>
                </div>
                <CreditCard className="h-10 w-10 text-white/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Outstanding</p>
                  <p className="text-3xl font-bold">₹2.4L</p>
                  <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                    <ArrowDownRight className="h-3 w-3" />
                    -5% from last month
                  </p>
                </div>
                <FileText className="h-10 w-10 text-white/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Avg Revenue/Society</p>
                  <p className="text-3xl font-bold">₹29K</p>
                  <p className="text-xs text-white/70 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +3% from last month
                  </p>
                </div>
                <Building2 className="h-10 w-10 text-white/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly platform revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 100000}L`} />
                  <Tooltip formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`} />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subscription Plans */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Revenue by plan type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionStats.map((plan) => (
                  <div key={plan.plan} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                        <span className="font-medium">{plan.plan}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{((plan.societies * 10000) / 100000).toFixed(1)}L/mo</p>
                        <p className="text-xs text-gray-500">{plan.societies} societies</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${plan.color} h-2 rounded-full`}
                        style={{ width: `${(plan.societies / platformStats.totalSocieties) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total MRR</p>
                    <p className="text-2xl font-bold text-green-700">₹{(totalMRR / 100000).toFixed(1)}L</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CreditCard className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{tx.society}</p>
                      <p className="text-xs text-gray-500">{tx.type} • {tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+₹{(tx.amount / 1000).toFixed(0)}K</p>
                    <Badge
                      variant="outline"
                      className={tx.status === 'completed' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </RoleGuard>
  )
}
