'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { DashboardService, AdminStats } from '@/services/dashboard.service'
import {
  Users,
  TrendingUp,
  AlertCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Home,
  Activity,
  CheckCircle2,
  Building2,
  Car,
  Package,
  Wrench,
  Calendar,
  MessageSquare,
  Bell,
  FileText,
  Send,
  Phone,
  Mail,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  Clock,
  CreditCard,
  ClipboardList,
  UserCheck,
  TrendingDown,
  UserPlus,
  UserMinus,
  UserX,
  Shield,
  ClipboardCheck,
  Loader2,
  BookOpen,
  Search,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/lib/stores/auth-store'
import { SocietyService } from '@/services/society.service'
import { VehicleSearchDialog } from '@/components/vehicles/VehicleSearchDialog'

// Helpdesk tickets data - matches IGATESECURITY bar chart
const helpdeskData = [
  { month: 'Oct', open: 45, resolved: 38 },
  { month: 'Nov', open: 52, resolved: 48 },
  { month: 'Dec', open: 35, resolved: 42 },
  { month: 'Jan', open: 28, resolved: 22 },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

// Quick action buttons
const quickActions = [
  { icon: Bell, label: 'Broadcast', description: 'App Notification', color: 'bg-blue-500', href: '/dashboard/residents/notices' },
  { icon: Send, label: 'Announcement', description: 'Post to residents', color: 'bg-purple-500', href: '/dashboard/residents/notices' },
  { icon: MessageSquare, label: 'Survey', description: 'Create questions', color: 'bg-green-500', href: '/dashboard/residents/events' },
  { icon: Car, label: 'Search Vehicle', description: 'Find owner by number', color: 'bg-orange-500', isSearch: true },
]


// Amenities data
const amenities = [
  { name: 'Squash Court', status: true },
  { name: 'Fitness Center', status: true },
  { name: 'Swimming Pool', status: false },
  { name: 'Clubhouse', status: true },
]

export function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [showSuccess, setShowSuccess] = useState<string | null>(null)

  // Fetch dashboard stats from backend API
  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ['admin-dashboard-stats'],
    queryFn: DashboardService.getAdminStats,
    refetchInterval: 60000, // Refresh every minute
  })

  // Guidelines & announcements sent to admins (platform or society)
  const isAdmin = (user as any)?.role?.toLowerCase() === 'admin'
  const { data: guidelines = [] } = useQuery<any[]>({
    queryKey: ['guidelines-for-me'],
    queryFn: SocietyService.getGuidelinesForMe,
    enabled: !!user && isAdmin,
  })

  const showNotification = (message: string) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    )
  }

  // Use API data directly from DB
  const communityOverview = {
    totalUnits: stats?.units?.total ?? 0,
    occupiedUnits: stats?.units?.occupied ?? 0,
    vacantUnits: stats?.units?.vacant ?? 0,
    totalUsers: stats?.users?.total ?? 0,
    activeUsers: stats?.users?.active ?? 0,
    inactiveUsers: stats?.users?.inactive ?? 0,
    pendingApprovalUsers: stats?.users?.pending ?? 0,
    owners: stats?.users?.owners ?? 0,
    tenants: stats?.users?.tenants ?? 0,
    neverLoggedIn: stats?.users?.neverLoggedIn ?? 0,
  }

  const financialOverview = {
    totalRevenue: stats?.finance?.totalRevenue ?? 0,
    pendingDues: stats?.finance?.pendingDues ?? 0,
    collectedThisMonth: stats?.finance?.collectedThisMonth ?? 0,
    totalExpenses: stats?.finance?.totalExpenses ?? 0,
    defaultersCount: stats?.finance?.defaultersCount ?? 0,
    totalMaintenance: stats?.finance?.totalRevenue ?? 0,
    maintenanceCollected: stats?.finance?.collectedThisMonth ?? 0,
    maintenancePending: stats?.finance?.pendingDues ?? 0,
    totalOutstanding: stats?.finance?.pendingDues ?? 0,
    totalAssetValue: stats?.finance?.totalRevenue ?? 0,
    monthlyAssetExpense: stats?.finance?.totalExpenses ?? 0,
    parkingIncome: stats?.finance?.parkingIncome ?? 0,
    amenityIncome: stats?.finance?.amenityIncome ?? 0,
    pendingVendorPayments: stats?.finance?.pendingVendorPayments ?? 0,
    lateFees: stats?.finance?.lateFees ?? 0,
  }

  // Income data for pie chart
  const incomeData = [
    { name: 'Collected', value: financialOverview.collectedThisMonth, color: '#3b82f6' },
    { name: 'Pending', value: financialOverview.pendingDues, color: '#ef4444' },
  ]

  // Monthly income from API
  const monthlyData = stats?.finance.monthlyIncome || []

  // Expense tracker data - matching UI layout
  const expenseData = [
    { month: 'Budget', amount: (stats?.finance.totalRevenue || 0) * 1.1 },
    { month: 'Expense', amount: stats?.finance.totalExpenses || 0 },
  ]

  // Quick Stats from API
  const quickStats = [
    {
      title: 'Pending Approvals',
      value: communityOverview.pendingApprovalUsers,
      icon: ClipboardCheck,
      bgColor: 'bg-orange-500',
      trend: 'pending users',
      trendUp: true,
    },
    {
      title: 'Open Complaints',
      value: stats?.activity.openComplaints || 0,
      icon: AlertCircle,
      bgColor: 'bg-red-500',
      trend: 'active issues',
      trendUp: false,
    },
    {
      title: 'Defaulters',
      value: financialOverview.defaultersCount,
      icon: TrendingDown,
      bgColor: 'bg-pink-600',
      trend: 'overdue payments',
      trendUp: false,
    },
    {
      title: "Today's Visitors",
      value: stats?.activity.todayVisitors || 0,
      icon: Shield,
      bgColor: 'bg-blue-600',
      trend: 'checked in today',
      trendUp: true,
    },
  ]

  // Top stats cards from API
  const topStats = [
    {
      title: 'Total Users',
      value: String(communityOverview.totalUsers),
      icon: Users,
      bgColor: 'bg-blue-500',
      textColor: 'text-white',
    },
    {
      title: 'Awaiting Approvals',
      value: String(communityOverview.pendingApprovalUsers).padStart(2, '0'),
      icon: UserCheck,
      bgColor: 'bg-orange-400',
      textColor: 'text-white',
    },
    {
      title: 'Open Meetings',
      value: String(stats?.activity.upcomingMeetings || 0).padStart(2, '0'),
      icon: Calendar,
      bgColor: 'bg-emerald-500',
      textColor: 'text-white',
    },
    {
      title: 'Number of Defaulters',
      value: String(financialOverview.defaultersCount).padStart(2, '0'),
      icon: TrendingDown,
      bgColor: 'bg-pink-500',
      textColor: 'text-white',
    },
  ]

  // Recent activities from API
  const recentActivities = stats?.recentActivities || []

  // Defaulters list from API
  const defaultersList = stats?.defaulters || []

  return (
    <motion.div

      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden"
    >
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-teal-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Header - IGATESECURITY Style */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-4 ring-white/20">
              <AvatarFallback className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white text-xl font-bold">
                {user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-teal-300 text-sm">Welcome!</p>
              <h1 className="text-2xl sm:text-3xl font-bold">{user?.name || 'Admin'}</h1>
              <p className="text-white/70 text-sm">{stats?.societyName || 'Sharlow Bay Community'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <VehicleSearchDialog
              trigger={
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm gap-2">
                  <Search className="h-4 w-4" />
                  Search Vehicle
                </Button>
              }
            />
            <Badge className="bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border-0">
              <span className="w-2 h-2 bg-teal-400 rounded-full mr-1.5 animate-pulse" />
              Online
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - IGATESECURITY Style Colored Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {topStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-xs sm:text-sm font-medium ${stat.textColor} opacity-90`}>{stat.title}</p>
                      <h3 className={`text-2xl sm:text-3xl font-bold ${stat.textColor} mt-1`}>{stat.value}</h3>
                    </div>
                    <div className="p-2 sm:p-3 bg-white/20 rounded-xl">
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Guidelines & Announcements (from Super Admin / platform) */}
      {guidelines.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  Guidelines & Announcements
                </CardTitle>
                <Badge variant="outline" className="bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800">
                  {guidelines.length} item{guidelines.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <CardDescription>Updates and guidelines shared with you by the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(guidelines as any[]).slice(0, 5).map((g: any) => (
                  <li
                    key={g.id}
                    className="flex flex-col gap-1 p-3 rounded-lg bg-muted border border-border"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{g.title}</span>
                      {g.category && (
                        <Badge variant="secondary" className="text-xs">{g.category}</Badge>
                      )}
                      {g.society?.name && (
                        <span className="text-xs text-muted-foreground">· {g.society.name}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{g.content}</p>
                  </li>
                ))}
              </ul>
              {guidelines.length > 5 && (
                <p className="text-sm text-muted-foreground mt-3">+ {guidelines.length - 5} more</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Community Overview Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">Community Overview</CardTitle>
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">Live Data</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Units Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-600 dark:bg-blue-700 rounded-lg">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Units</p>
                    <p className="text-2xl font-bold text-foreground">{communityOverview.totalUnits}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                      Occupied
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-500">{communityOverview.occupiedUnits}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Home className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                      Vacant
                    </span>
                    <span className="font-semibold text-orange-500 dark:text-orange-400">{communityOverview.vacantUnits}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-blue-300 dark:border-blue-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Occupancy Rate</span>
                      <span className="font-bold text-blue-700 dark:text-blue-400">
                        {(communityOverview.totalUnits > 0 ? (communityOverview.occupiedUnits / communityOverview.totalUnits) * 100 : 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Users Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-600 dark:bg-purple-700 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">{communityOverview.totalUsers}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                      Active
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-500">{communityOverview.activeUsers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <UserMinus className="h-3.5 w-3.5 text-muted-foreground" />
                      Inactive
                    </span>
                    <span className="font-semibold text-muted-foreground">{communityOverview.inactiveUsers}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                      Pending
                    </span>
                    <span className="font-semibold text-orange-500 dark:text-orange-400">{communityOverview.pendingApprovalUsers}</span>
                  </div>
                </div>
              </div>

              {/* Owners vs Tenants Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/10 dark:to-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-600 dark:bg-emerald-700 rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Residents</p>
                    <p className="text-2xl font-bold text-foreground">{communityOverview.owners + communityOverview.tenants}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-500" />
                      Owners
                    </span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-500">{communityOverview.owners}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <UserPlus className="h-3.5 w-3.5 text-blue-600 dark:text-blue-500" />
                      Tenants
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-500">{communityOverview.tenants}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-emerald-300 dark:border-emerald-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Owner Ratio</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-500">
                        {((communityOverview.owners + communityOverview.tenants) > 0 ? (communityOverview.owners / (communityOverview.owners + communityOverview.tenants)) * 100 : 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Never Logged In Card */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/10 dark:to-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-600 dark:bg-amber-700 rounded-lg">
                    <UserX className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Never Logged In</p>
                    <p className="text-2xl font-bold text-foreground">{communityOverview.neverLoggedIn}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">% of Total Users</span>
                    <span className="font-semibold text-amber-700 dark:text-amber-500">
                      {(communityOverview.totalUsers > 0 ? (communityOverview.neverLoggedIn / communityOverview.totalUsers) * 100 : 0).toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-500 hover:bg-amber-200 dark:hover:bg-amber-900/20"
                      onClick={() => showNotification('Sending reminder emails...')}
                    >
                      <Mail className="h-3.5 w-3.5 mr-1" />
                      Send Reminders
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Financial Overview Section - NEW */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">Financial Overview</CardTitle>
              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">This Month</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Maintenance Collection */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/10 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-600 dark:bg-green-700 rounded-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Maintenance</p>
                    <p className="text-xl font-bold text-foreground">Rs. {(financialOverview.totalMaintenance / 100000).toFixed(2)}L</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />
                      Collected
                    </span>
                    <span className="font-semibold text-green-600 dark:text-green-500">Rs. {(financialOverview.maintenanceCollected / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                      Pending
                    </span>
                    <span className="font-semibold text-orange-500 dark:text-orange-400">Rs. {(financialOverview.maintenancePending / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-green-300 dark:border-green-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Collection Rate</span>
                      <span className="font-bold text-green-700 dark:text-green-500">
                        {((financialOverview.maintenanceCollected / financialOverview.totalMaintenance) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outstanding Amount */}
              <div className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/10 dark:to-rose-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-600 dark:bg-red-700 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Outstanding</p>
                    <p className="text-xl font-bold text-red-700 dark:text-red-500">Rs. {(financialOverview.totalOutstanding / 100000).toFixed(2)}L</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Defaulters</span>
                    <span className="font-semibold text-red-600 dark:text-red-500">{financialOverview.defaultersCount} units</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Late Fees</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-500">Rs. {(financialOverview.lateFees / 1000).toFixed(2)}K</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                    onClick={() => router.push('/dashboard/admin/defaulters')}
                  >
                    View Defaulters
                  </Button>
                </div>
              </div>


              {/* Parking & Amenity Income */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/10 dark:to-cyan-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-600 dark:bg-blue-700 rounded-lg">
                    <Car className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Other Income</p>
                    <p className="text-xl font-bold text-foreground">Rs. {((financialOverview.parkingIncome + financialOverview.amenityIncome) / 100000).toFixed(2)}L</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Car className="h-3.5 w-3.5 text-blue-600 dark:text-blue-500" />
                      Parking
                    </span>
                    <span className="font-semibold text-blue-600 dark:text-blue-500">Rs. {(financialOverview.parkingIncome / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-purple-600 dark:text-purple-500" />
                      Amenity
                    </span>
                    <span className="font-semibold text-purple-600 dark:text-purple-500">Rs. {(financialOverview.amenityIncome / 1000).toFixed(0)}K</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    onClick={() => router.push('/dashboard/parking/payments')}
                  >
                    View Parking
                  </Button>
                </div>
              </div>

              {/* Assets & Vendor Payments */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/10 dark:to-violet-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-600 dark:bg-purple-700 rounded-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Assets & Expenses</p>
                    <p className="text-xl font-bold text-foreground">Rs. {(financialOverview.totalAssetValue / 10000000).toFixed(2)}Cr</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Wrench className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                      Monthly Exp
                    </span>
                    <span className="font-semibold text-orange-600 dark:text-orange-500">Rs. {(financialOverview.monthlyAssetExpense / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CreditCard className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                      Vendor Due
                    </span>
                    <span className="font-semibold text-red-600 dark:text-red-500">Rs. {(financialOverview.pendingVendorPayments / 1000).toFixed(0)}K</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/20"
                    onClick={() => router.push('/dashboard/accounting/vendor-payments')}
                  >
                    Pay Vendors
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats Widgets */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="outline" className={`text-xs ${stat.trendUp ? 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'}`}>
                      {stat.trendUp ? (
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-0.5" />
                      )}
                      {stat.trend}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Purchase Requests & Helpdesk Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Purchase Requests Card - IGATESECURITY Style */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-foreground">Purchase Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Open</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
                    {String(stats?.activity.openPurchaseRequests || 0).padStart(2, '0')}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Un-Finalized</p>
                  <p className="text-3xl font-bold text-orange-500 dark:text-orange-400">
                    {String(stats?.activity.unfinalizedPurchaseRequests || 0).padStart(2, '0')}
                  </p>
                </div>
              </div>
              <Button
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => router.push('/dashboard/financial/invoices')}
              >
                View All Requests
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Helpdesk Tickets Card - IGATESECURITY Style with Bar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground">Helpdesk Tickets</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Open Tickets</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{stats?.activity.openComplaints || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-red-500 dark:text-red-400 font-semibold">Escalated Tickets</span>
                    <span className="text-red-500 dark:text-red-400 font-bold">{stats?.activity.escalatedComplaints || 0}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={helpdeskData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Bar dataKey="open" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Open" />
                  <Bar dataKey="resolved" fill="#ef4444" radius={[4, 4, 0, 0]} name="Escalated" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Income & Expense Trackers Row - IGATESECURITY Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Income Tracker with Donut Chart - IGATESECURITY Style */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-800">Income Tracker</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-gray-600">Balance</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-gray-600">Collected</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie
                        data={incomeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {incomeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-xs text-gray-500">
                      {stats?.finance.incomePeriod ? new Date(stats.finance.incomePeriod.start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '1 Nov'}
                    </p>
                    <p className="text-[10px] text-gray-400">to</p>
                    <p className="text-xs text-gray-500">
                      {stats?.finance.incomePeriod ? new Date(stats.finance.incomePeriod.end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '1 Dec'}
                    </p>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-500">Collected Amount</p>
                    <p className="text-3xl font-bold text-emerald-600">Rs. {financialOverview.collectedThisMonth.toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {monthlyData.map((item, idx) => (
                      <div key={idx}>
                        <p className="text-xs text-gray-500">{item.month}</p>
                        <p className="text-sm font-semibold">Rs. {(item.amount / 1000).toFixed(0)}K</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => router.push('/dashboard/financial/billing')}
                    >
                      {(stats?.finance?.collectedThisMonth ?? 0) > 0 ? 'Monthly Collections' : 'No Payments Yet'}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => router.push('/dashboard/financial/billing')}
                    >
                      {financialOverview.defaultersCount} Defaulters
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Expense Tracker - IGATESECURITY Style */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-gray-800">Expense Tracker</CardTitle>
              <CardDescription>Variance Amount</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-800 mb-4">Rs. {(stats?.finance.totalExpenses || 0).toLocaleString()}</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={expenseData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
                  <YAxis type="category" dataKey="month" stroke="#6b7280" fontSize={12} width={60} />
                  <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#ef4444" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <Button
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => router.push('/dashboard/financial/invoices')}
              >
                {stats?.activity.openPurchaseRequests || 0} Open Purchase Request
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions & Recent Activities Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions - IGATESECURITY Style */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                const actionButton = (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto py-3 hover:bg-gray-50"
                  >
                    <div className={`p-2 rounded-xl ${action.color} mr-3`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                  </Button>
                )

                if (action.isSearch) {
                  return (
                    <VehicleSearchDialog 
                      key={index}
                      trigger={actionButton}
                    />
                  )
                }

                return (
                  <Link key={index} href={action.href as string} className="w-full block">
                    {actionButton}
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-0 shadow-md h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-gray-800">Recent Activities</CardTitle>
                <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`text-xs font-semibold ${activity.status === 'success' ? 'bg-green-100 text-green-700' :
                        activity.status === 'warning' ? 'bg-orange-100 text-orange-700' :
                          activity.status === 'error' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                        {activity.user?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-gray-100">{'Unit'}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Set Up Amenities - IGATESECURITY Style */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-800">Set Up Amenities</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {amenities.map((amenity, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => router.push('/dashboard/facilities/amenities')}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left w-full cursor-pointer border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Building2 className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-700">{amenity.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${amenity.status ? 'bg-teal-500' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${amenity.status ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
