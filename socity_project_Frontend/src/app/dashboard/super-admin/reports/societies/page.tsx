'use client'

import { motion } from 'framer-motion'
import {
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  Activity,
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RoleGuard } from '@/components/auth/role-guard'

const societyStats = [
  { month: 'Jul', newSocieties: 8, churned: 1 },
  { month: 'Aug', newSocieties: 12, churned: 2 },
  { month: 'Sep', newSocieties: 10, churned: 1 },
  { month: 'Oct', newSocieties: 15, churned: 3 },
  { month: 'Nov', newSocieties: 11, churned: 2 },
  { month: 'Dec', newSocieties: 14, churned: 1 },
]

const societyPerformance = [
  {
    name: 'Green Valley Apartments',
    users: 1203,
    activeUsers: 956,
    engagement: 79,
    trend: 'up',
    change: '+5%',
  },
  {
    name: 'Lake View Residency',
    users: 945,
    activeUsers: 812,
    engagement: 86,
    trend: 'up',
    change: '+8%',
  },
  {
    name: 'Sunrise Heights',
    users: 856,
    activeUsers: 689,
    engagement: 80,
    trend: 'up',
    change: '+3%',
  },
  {
    name: 'Royal Enclave',
    users: 780,
    activeUsers: 520,
    engagement: 67,
    trend: 'down',
    change: '-5%',
  },
  {
    name: 'Silver Oaks Society',
    users: 512,
    activeUsers: 445,
    engagement: 87,
    trend: 'up',
    change: '+12%',
  },
]

const planDistribution = [
  { plan: 'Enterprise', count: 33, percentage: 21 },
  { plan: 'Professional', count: 78, percentage: 50 },
  { plan: 'Basic', count: 45, percentage: 29 },
]

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { toast } from 'react-hot-toast'

export default function SocietyReportsPage() {
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['platform-reports'],
    queryFn: async () => {
      const response = await api.get('/reports/platform-stats')
      return response.data
    }
  })

  // Transformed data
  const growthData = reportsData?.growthData || []
  const planDistribution = reportsData?.planDistribution || []
  const societyPerformance = reportsData?.societyPerformance || []
  const overview = reportsData?.overview || {}

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
            <h1 className="text-2xl font-bold text-gray-900">Society Reports</h1>
            <p className="text-gray-600">Detailed analytics for all societies</p>
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
            <Button variant="outline" onClick={() => {
              if (!societyPerformance || societyPerformance.length === 0) {
                toast.error('No data to export');
                return;
              }
              const doc = new jsPDF();
              doc.text('Society Performance Report', 14, 15);
              const tableColumn = ["Society", "Users", "Active", "Engagement"];
              const tableRows = societyPerformance.map((s: any) => [
                s.name,
                s.users.toLocaleString(),
                s.activeUsers.toLocaleString(),
                `${s.engagement}%`
              ]);
              autoTable(doc, {
                startY: 20,
                head: [tableColumn],
                body: tableRows,
              });
              doc.save('society_performance_report.pdf');
              toast.success('Report exported successfully');
            }}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  {overview.societiesChange}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{overview.activeSocieties}</p>
                <p className="text-sm text-gray-600">Total Societies</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  +0
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{overview.totalUsers?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Home className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight className="h-4 w-4" />
                  +0
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{overview.totalUnits || 0}</p>
                <p className="text-sm text-gray-600">Total Units</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex items-center text-red-600 text-sm">
                  <ArrowDownRight className="h-4 w-4" />
                  -0%
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{overview.avgEngagement}</p>
                <p className="text-sm text-gray-600">Avg Engagement</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Growth Chart */}
          <Card className="border-0 shadow-md lg:col-span-2">
            <CardHeader>
              <CardTitle>Society Growth</CardTitle>
              <CardDescription>New societies vs churned</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="newSocieties" name="New" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="churned" name="Churned" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Plan Distribution */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
              <CardDescription>Societies by subscription plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planDistribution.map((item: any) => (
                  <div key={item.plan} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.plan}</span>
                      <span className="text-sm text-gray-500">{item.count} societies</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.plan === 'Enterprise'
                          ? 'bg-purple-500'
                          : item.plan === 'Professional'
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                          }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Society Performance Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Society Performance</CardTitle>
            <CardDescription>User engagement across societies</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Society</TableHead>
                  <TableHead>Total Users</TableHead>
                  <TableHead>Active Users</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {societyPerformance.map((society: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Building2 className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium">{society.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{society.users.toLocaleString()}</TableCell>
                    <TableCell>{society.activeUsers.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${society.engagement >= 80 ? 'bg-green-500' : society.engagement >= 60 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${society.engagement}%` }}
                          />
                        </div>
                        <span className="text-sm">{society.engagement}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          society.trend === 'up'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700 font-medium border-0'
                        }
                      >
                        {society.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {society.change}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {societyPerformance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </RoleGuard>
  )
}
