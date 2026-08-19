'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Shield,
  Users,
  Car,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Bell,
  Phone,
  QrCode,
  MapPin,
  Eye,
  UserCheck,
  Calendar,
  TrendingUp,
  Activity,
  Search,
  Building,
  BookOpen,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GuardService } from '@/services/guard.service'
import { VisitorService } from '@/services/visitor.service'
import { EmergencyService } from '@/services/emergency.service'
import { StaffService } from '@/services/staff.service'
import { ComplaintService } from '@/services/complaint.service'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { SocietyService } from '@/services/society.service'

// Daily visitor data for chart
const visitorChartData = [
  { day: 'Sun', visitors: 120, avg: 150 },
  { day: 'Mon', visitors: 280, avg: 150 },
  { day: 'Tue', visitors: 320, avg: 150 },
  { day: 'Wed', visitors: 250, avg: 150 },
  { day: 'Thu', visitors: 180, avg: 150 },
  { day: 'Fri', visitors: 420, avg: 150 },
  { day: 'Sat', visitors: 380, avg: 150 },
]

// IGATESECURITY Gatekeeper features (page 31)
const gatekeeperFeatures = [
  { icon: Users, label: 'Visitor Management', count: 'visitorsToday', subtext: 'Today', color: 'bg-blue-500', href: '/dashboard/security/visitors' },
  { icon: UserCheck, label: 'Staff Attendance', count: 'staffPresent', subtext: 'Present', color: 'bg-purple-500', href: '/dashboard/security/visitors' },
  { icon: Package, label: 'Parcel Tracking', count: 'parcelsToDeliver', subtext: 'Pending', color: 'bg-orange-500', href: '/dashboard/security/parcels' },
  { icon: AlertTriangle, label: 'Incident Report', count: 'incidentsCount', subtext: 'Open', color: 'bg-red-500', href: '/dashboard/admin/complaints' },
  { icon: Car, label: 'Parking', count: 'vehiclesIn', subtext: 'Occupied', color: 'bg-green-500', href: '/dashboard/security/vehicles' },
  { icon: Shield, label: 'Guard Patrol', count: 'guardsOnDuty', subtext: 'Active', color: 'bg-teal-500', href: '/dashboard/security/visitors' },
]

// Recent visitors - IGATESECURITY style
const recentVisitors = [
  {
    id: 1,
    name: 'Cab - Uber',
    visitor: 'Dominic Marshall',
    unit: 'A-04',
    time: '3:00 pm',
    status: 'approved',
    approvedBy: 'Meenakshi Menon',
  },
  {
    id: 2,
    name: 'Home service - Urban Company',
    visitor: 'Beena shah',
    unit: 'B-102',
    time: '5:30 pm',
    status: 'approved',
    approvedBy: 'Saleem',
  },
  {
    id: 3,
    name: 'Guest',
    visitor: 'Natalia Shustova',
    unit: 'C-201',
    time: '9:00 pm',
    status: 'approved',
    approvedBy: 'Mumtaz',
  },
]

// Pending approvals
const pendingApprovals = [
  {
    id: 1,
    vehicle: 'MH 02 AB 1234',
    unit: 'A-205',
    resident: 'Rajesh Kumar',
    type: 'Guest Vehicle',
    time: '5 mins ago',
  },
  {
    id: 2,
    vehicle: 'MH 04 CD 5678',
    unit: 'B-301',
    resident: 'Amit Sharma',
    type: 'Delivery Van',
    time: '12 mins ago',
  },
]

const emergencyContacts = [
  { name: 'Police Station', number: '100', icon: Shield },
  { name: 'Fire Brigade', number: '101', icon: AlertTriangle },
  { name: 'Ambulance', number: '102', icon: Phone },
  { name: 'Society Admin', number: '+91 98765 00000', icon: Phone },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export function SecurityDashboard() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<'visitor' | 'parcel' | 'staff'>('visitor')
  const [helperSearch, setHelperSearch] = useState('')
  const queryClient = useQueryClient()

  // Fetch Guard Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['guard-stats'],
    queryFn: () => GuardService.getStats(),
  })

  // Fetch Recent Activity (for visitors and parcels)
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['guard-activity'],
    queryFn: () => GuardService.getActivity(),
  })

  // Fetch Pending Visitor Approvals
  const { data: visitors, isLoading: visitorsLoading } = useQuery({
    queryKey: ['visitors', 'pending'],
    queryFn: () => VisitorService.getAll({ status: 'pending' }),
  })

  // Fetch Emergency Contacts
  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['emergency-contacts'],
    queryFn: () => EmergencyService.listContacts(),
  })

  // Fetch Staff for attendance count
  const { data: staff, isLoading: staffLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => StaffService.getAll(),
  })

  // Fetch Complaints for incident count
  const { data: complaintStats, isLoading: complaintsLoading } = useQuery({
    queryKey: ['complaint-stats'],
    queryFn: () => ComplaintService.getStats(),
  })

  // Fetch guidelines for guards
  const { data: guidelines = [] } = useQuery<any[]>({
    queryKey: ['guidelines-for-me', user?.id],
    queryFn: SocietyService.getGuidelinesForMe,
    enabled: !!user?.id,
  })

  // Mutations for Approving/Rejecting
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: string }) =>
      VisitorService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      queryClient.invalidateQueries({ queryKey: ['guard-activity'] })
      queryClient.invalidateQueries({ queryKey: ['guard-stats'] })
      toast.success('Visitor status updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update visitor status')
    },
  })

  const updateStaffStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: string }) =>
      StaffService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      queryClient.invalidateQueries({ queryKey: ['guard-activity'] })
      queryClient.invalidateQueries({ queryKey: ['guard-stats'] })
      toast.success('Helper status updated')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update staff status')
    },
  })

  // Dynamic Chart Data
  const currentDayName = format(new Date(), 'EEE')
  const chartData = visitorChartData.map(d =>
    d.day === currentDayName ? { ...d, visitors: stats?.visitorsToday || d.visitors } : d
  )

  const showNotification = (message: string) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleApprove = (id: number | string) => {
    updateStatusMutation.mutate({ id, status: 'APPROVED' })
  }

  const handleReject = (id: number | string) => {
    updateStatusMutation.mutate({ id, status: 'REJECTED' })
  }

  const helperList = (staff || []).filter((h: any) =>
    h.name.toLowerCase().includes(helperSearch.toLowerCase()) ||
    h.role.toLowerCase().includes(helperSearch.toLowerCase())
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
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

      {/* Welcome Header - IGATESECURITY Gatekeeper Style */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#1e3a5f] to-[#0f766e] rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-4 ring-white/20">
              <AvatarFallback className="bg-gradient-to-br from-teal-400 to-emerald-500 text-white text-xl font-bold">
                {user?.name?.charAt(0) || 'G'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-teal-300 text-sm">Welcome!</p>
              <h1 className="text-2xl sm:text-3xl font-bold">{user?.name || 'Security'}</h1>
              <p className="text-white/70 text-sm">IGATESECURITY Gatekeeper</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{stats?.visitorsToday || 0}</p>
            <p className="text-xs text-white/70">Visitors Today</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{stats?.vehiclesIn || 0}</p>
            <p className="text-xs text-white/70">Still Inside</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{stats?.parcelsToDeliver || 0}</p>
            <p className="text-xs text-white/70">Parcel</p>
          </div>
        </div>
      </motion.div>

      {/* Gatekeeper Features Grid - IGATESECURITY Style */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {gatekeeperFeatures.map((feature, index) => {
          const Icon = feature.icon
          let count: number | string = 0

          if (feature.count === 'visitorsToday') count = stats?.visitorsToday || 0
          if (feature.count === 'staffPresent') count = staff?.filter((s: any) => s.status === 'ON_DUTY').length || 0
          if (feature.count === 'parcelsToDeliver') count = stats?.parcelsToDeliver || 0
          if (feature.count === 'incidentsCount') count = complaintStats?.pending || 0
          if (feature.count === 'vehiclesIn') count = stats?.vehiclesIn || 0
          if (feature.count === 'guardsOnDuty') count = staff?.filter((s: any) => s.role === 'GUARD' && s.status === 'ON_DUTY').length || 0

          return (
            <motion.div key={index} variants={itemVariants}>
              <Link href={feature.href}>
                <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer h-full bg-card">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} mx-auto mb-3 flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{feature.label}</p>
                    <p className="text-xl font-bold text-foreground">{count}</p>
                    <p className="text-[10px] text-muted-foreground">{feature.subtext}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })
        }
      </motion.div >

      {/* Daily Visitor Chart & Recent Visitors */}
      < div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6" >
        {/* Daily Visitor-In Chart - IGATESECURITY Style */}
        < motion.div variants={itemVariants} >
          <Card className="border-0 shadow-md bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">Daily Visitor-In</CardTitle>
                  <CardDescription className="text-muted-foreground">Visitors Today: {stats?.visitorsToday || 0} | Still Inside: {stats?.vehiclesIn || 0}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-xs bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400" onClick={() => router.push('/dashboard/security/visitors')}>
                    Check-Out
                  </Button>
                  <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                    Parcel: {stats?.parcelsToDeliver || 0}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-slate-700" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} className="dark:text-muted-foreground" tick={{ fill: 'currentColor' }} />
                  <YAxis stroke="#6b7280" fontSize={12} className="dark:text-muted-foreground" tick={{ fill: 'currentColor' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  <Line type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-gray-600 dark:text-muted-foreground">Visitors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-green-500"></span>
                  <span className="text-gray-600 dark:text-muted-foreground">Average</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div >

        {/* Recent Visitors - IGATESECURITY Style */}
        < motion.div variants={itemVariants} >
          <Card className="border-0 shadow-md h-full bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground">Recent Visitors</CardTitle>
                <div className="flex gap-2">
                  <Badge
                    variant={activeCategory === 'visitor' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => setActiveCategory('visitor')}
                  >
                    My Visitors
                  </Badge>
                  <Badge
                    variant={activeCategory === 'parcel' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => setActiveCategory('parcel')}
                  >
                    Parcels
                  </Badge>
                  <Badge
                    variant={activeCategory === 'staff' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => setActiveCategory('staff')}
                  >
                    Helpers
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {activitiesLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading activity...</div>
                ) : activities?.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No recent activity</div>
                ) : (
                  activities?.filter((a: any) => a.id.startsWith(`${activeCategory}-`)).slice(0, 5).map((activity: any) => (
                    <div
                      key={activity.id}
                      className="p-3 rounded-xl border border-border hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 w-full">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs text-[10px]">
                              {activity.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground truncate text-sm">{activity.action}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
                              {activity.name} • {activity.time ? (() => {
                                try { return format(new Date(activity.time), 'h:mm a') } catch (e) { return 'N/A' }
                              })() : 'N/A'}
                            </p>
                            <p className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1 mt-0.5">
                              <CheckCircle className="h-3 w-3" />
                              {activeCategory === 'staff' ? activity.unit : `Unit ${activity.unit}`}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[10px] h-7 px-2 text-muted-foreground">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link href={activeCategory === 'parcel' ? '/dashboard/security/parcels' : '/dashboard/security/visitors'}>
                <Button variant="outline" className="w-full mt-4 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                  View All {activeCategory === 'visitor' ? 'Visitors' : activeCategory === 'parcel' ? 'Parcels' : 'Staff Activities'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div >
      </div >

      {/* Pending Approvals & Emergency Contacts */}
      < div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6" >
        {/* Pending Vehicle Approvals */}
        < motion.div variants={itemVariants} >
          <Card className="border-0 shadow-md bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground">Pending Approvals</CardTitle>
                <Badge className="bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">{(visitors as any)?.length || 0} Pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {visitorsLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading pending approvals...</div>
                ) : (visitors as any)?.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground italic">No pending approvals</div>
                ) : (
                  (visitors as any)?.slice(0, 3).map((item: any) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-orange-100 dark:border-orange-800/50 bg-orange-50/30 dark:bg-orange-900/10 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            <h4 className="font-semibold text-foreground">{item.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Unit: {item.unit?.block}-{item.unit?.number} • {item.purpose}
                          </p>
                          <Badge variant="outline" className="mt-2 text-xs text-muted-foreground">{item.phone}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.createdAt ? (() => {
                            try { return format(new Date(item.createdAt), 'MMM d, h:mm a') } catch (e) { return '' }
                          })() : ''}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleReject(item.id)}>
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(item.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/dashboard/security/vehicles">
                <Button variant="outline" className="w-full mt-4">
                  View All Vehicles
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div >

        {/* Helper Attendance Management */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md h-full bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">Helper Attendance</CardTitle>
                  <CardDescription>Check-in/out domestic helpers</CardDescription>
                </div>
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search helpers..."
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border-0 rounded-xl text-sm focus:ring-2 focus:ring-purple-500"
                  value={helperSearch}
                  onChange={(e) => setHelperSearch(e.target.value)}
                />
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {staffLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading helpers...</div>
                ) : helperList.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground italic">No helpers found</div>
                ) : (
                  helperList.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-border bg-card hover:border-purple-200 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                              {item.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.role}</p>
                          </div>
                        </div>
                        <Badge variant={item.status === 'ON_DUTY' ? 'default' : 'secondary'} className="text-[10px]">
                          {item.status === 'ON_DUTY' ? 'ON DUTY' : 'OFF DUTY'}
                        </Badge>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {item.status !== 'ON_DUTY' ? (
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 h-8 text-[11px]"
                            onClick={() => updateStaffStatusMutation.mutate({ id: item.id, status: 'ON_DUTY' })}
                          >
                            <UserCheck className="h-3 w-3 mr-1" />
                            Check In
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1 h-8 text-[11px]"
                            onClick={() => updateStaffStatusMutation.mutate({ id: item.id, status: 'OFF_DUTY' })}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Check Out
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="h-8 text-[11px] px-2" asChild>
                           <a href={`tel:${item.phone}`}><Phone className="h-3 w-3" /></a>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div >


      {/* Emergency Contacts - IGATESECURITY Style */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">Emergency Contacts</CardTitle>
              <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(contacts as any)?.map((contact: any, index: number) => (
                <a
                  key={index}
                  href={`tel:${contact.phone}`}
                  className="p-4 bg-white dark:bg-card rounded-xl border border-border hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg shrink-0">
                      <Phone className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-medium text-foreground truncate">{contact.name}</p>
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate">{contact.phone}</p>
                    </div>
                  </div>
                </a>
              ))}
              {(!contacts || (contacts as any).length === 0) && emergencyContacts.map((contact, index) => {
                const Icon = contact.icon
                return (
                  <a
                    key={index}
                    href={`tel:${contact.number}`}
                    className="p-4 bg-white dark:bg-card rounded-xl border border-border hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg shrink-0">
                        <Icon className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-medium text-foreground truncate">{contact.name}</p>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate">{contact.number}</p>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Community Guidelines - NEW Section for Guards */}
      {guidelines.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md bg-white dark:bg-card overflow-hidden">
            <CardHeader className="bg-teal-500/5 border-b border-teal-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-teal-500/10 rounded-lg">
                    <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground">Community Guidelines</CardTitle>
                    <CardDescription className="text-xs">Important instructions from Management</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800">
                  {guidelines.length} {guidelines.length === 1 ? 'Guideline' : 'Guidelines'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {guidelines.slice(0, 3).map((guideline: any) => (
                  <div key={guideline.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-sm text-foreground">{guideline.title}</h4>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold py-0 h-4">
                        {guideline.category || 'General'}
                      </Badge>
                      <Badge className={guideline.society?.name ? "bg-teal-500/10 text-teal-600 hover:bg-teal-500/10 border-teal-500/20 text-[10px]" : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-blue-500/20 text-[10px]"}>
                        {guideline.society?.name || "Official Platform"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{guideline.content}</p>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] text-muted-foreground/60">{guideline.createdAt ? new Date(guideline.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
              {guidelines.length > 3 && (
                <div className="p-3 bg-muted/20 text-center border-t border-border">
                  <Link href="/dashboard/guidelines/updates" className="text-xs font-bold text-teal-600 hover:underline">
                    View All {guidelines.length} Guidelines
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Actions Row */}
      < motion.div variants={itemVariants} >
        <Card className="border-0 shadow-md bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => router.push('/dashboard/security/visitors')}>
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">Check-in Visitor</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => router.push('/dashboard/security/vehicles')}>
                <Car className="h-6 w-6 text-green-600 dark:text-green-400" />
                <span className="text-sm">Register Vehicle</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => router.push('/dashboard/security/parcels')}>
                <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <span className="text-sm">Log Parcel</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => router.push('/dashboard/admin/complaints')}>
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <span className="text-sm">Report Incident</span>
              </Button>
              <VehicleSearchDialog
                trigger={
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                    <Search className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm">Search Vehicle</span>
                  </Button>
                }
              />
            </div>
          </CardContent>
        </Card>
      </motion.div >
    </motion.div >
  )
}

import { VehicleSearchDialog } from '@/components/vehicles/VehicleSearchDialog'
