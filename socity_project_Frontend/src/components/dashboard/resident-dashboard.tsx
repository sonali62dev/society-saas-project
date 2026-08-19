'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Home,
  CreditCard,
  AlertCircle,
  Calendar,
  Bell,
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Car,
  Dog,
  ChevronRight,
  Wrench,
  FileText,
  MessageSquare,
  ShoppingBag,
  User,
  Phone,
  MapPin,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { SocietyService } from '@/services/society.service'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'




// Shortcuts - IGATESECURITY style (page 3)
const shortcuts = [
  { icon: Wrench, label: 'Services', href: '/dashboard/services', color: 'bg-blue-50' },
  { icon: Calendar, label: 'Facilities', href: '/dashboard/residents/amenities', color: 'bg-green-50' },
  { icon: FileText, label: 'Guidelines', href: '/dashboard/resident/guidelines', color: 'bg-yellow-50' },
  { icon: MessageSquare, label: 'Community', href: '/dashboard/resident/community', color: 'bg-purple-50' },
  { icon: ShoppingBag, label: 'Marketplace', href: '/dashboard/resident/market', color: 'bg-pink-50' },
  { icon: User, label: 'Daily Help', href: '/dashboard/resident/daily-help', color: 'bg-teal-50' },
  { icon: Car, label: 'Search Vehicle', isSearch: true, color: 'bg-orange-50' },
]

import { VehicleSearchDialog } from '@/components/vehicles/VehicleSearchDialog'


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

export function ResidentDashboard() {
  const router = useRouter()
  const { user } = useAuthStore()

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['residentDashboard'],
    queryFn: residentService.getDashboardData,
  })

  // Fetch guidelines for residents (from Super Admin)
  const { data: guidelines = [] } = useQuery<any[]>({
    queryKey: ['guidelines-for-me', user?.id],
    queryFn: SocietyService.getGuidelinesForMe,
    enabled: !!user?.id,
  })

  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('ONLINE')
  const queryClient = useQueryClient()

  const payDepositMutation = useMutation({
    mutationFn: residentService.paySecurityDeposit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residentDashboard'] })
      setIsDepositDialogOpen(false)
      toast.success('Security deposit paid successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error.message || 'Payment failed')
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <Skeleton className="h-[100px] w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-2xl" />
          <Skeleton className="h-[300px] w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  const { societyName, unit, gateUpdates: apiGateUpdates, dues, announcements: apiAnnouncements, buzz: apiBuzz, events: apiEvents } = dashboardData || {}

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 sm:space-y-6"
    >
      {/* Welcome Header - IGATESECURITY App Style */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 ring-4 ring-white/20">
              <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-lg sm:text-xl font-bold">
                {user?.name?.charAt(0) || 'R'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-cyan-100 text-sm">Hello {user?.name?.split(' ')[0] || 'Resident'}!!</p>
              <h1 className="text-xl sm:text-2xl font-bold">{societyName || 'My Community'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 h-10 w-10">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 h-10 w-10">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* My Dues Card - IGATESECURITY Style */}
        <div className="mt-4 bg-white dark:bg-card rounded-xl p-3 sm:p-4 text-gray-900 dark:text-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-muted-foreground">My Dues</p>
                <p className="text-xl sm:text-2xl font-bold">Rs. {dues?.amount?.toLocaleString() || '0'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/residents/dues">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">History</Button>
              </Link>
              <Link href="/dashboard/residents/dues">
                <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white text-xs sm:text-sm">Pay</Button>
              </Link>
            </div>
          </div>

          {/* Security Deposit Alert - Conditional */}
          {dues?.isDepositPending && (
            <div className={`mt-3 p-3 rounded-lg flex items-center justify-between border ${dues.depositPaymentMethod && dues.depositPaymentMethod !== 'ONLINE' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'}`}>
              <div className="flex items-center gap-2">
                <AlertCircle className={`h-4 w-4 ${dues.depositPaymentMethod && dues.depositPaymentMethod !== 'ONLINE' ? 'text-orange-500' : 'text-red-500'}`} />
                <span className={`text-[11px] sm:text-xs font-medium ${dues.depositPaymentMethod && dues.depositPaymentMethod !== 'ONLINE' ? 'text-orange-700 dark:text-orange-400' : 'text-red-700 dark:text-red-400'}`}>
                  {dues.depositPaymentMethod && dues.depositPaymentMethod !== 'ONLINE'
                    ? `Admin verification pending for Security Deposit ${dues.pendingDepositAmount > 0 ? `of ₹${dues.pendingDepositAmount}` : ''} (${dues.depositPaymentMethod})`
                    : `Alert: Please pay your Security Deposit ${dues.pendingDepositAmount > 0 ? `of ₹${dues.pendingDepositAmount}` : ''}`}
                </span>
              </div>

              {(!dues.depositPaymentMethod || dues.depositPaymentMethod === 'ONLINE') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDepositDialogOpen(true)}
                  className={`h-7 text-[10px] p-0 px-2 font-bold uppercase ${dues.depositPaymentMethod && dues.depositPaymentMethod !== 'ONLINE' ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/20' : 'text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20'}`}
                >
                  Pay Now
                </Button>
              )}
            </div>
          )}
          {unit?.securityDeposit > 0 && !dues?.isDepositPending && (
            <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-lg flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-[10px] font-medium text-green-700 dark:text-green-400">
                Security Deposit of Rs. {unit.securityDeposit.toLocaleString()} is recorded.
              </span>
            </div>
          )}

          {/* Upcoming Due Alert - Logical Reminder */}
          {dues?.upcomingDuesAlert && (
            <div className={`mt-3 p-3 border rounded-xl flex items-center justify-between ${dues.upcomingDuesAlert.isOverdue
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${dues.upcomingDuesAlert.isOverdue ? 'bg-red-100 dark:bg-red-800' : 'bg-blue-100 dark:bg-blue-800'
                  }`}>
                  {dues.upcomingDuesAlert.isOverdue
                    ? <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-300" />
                    : <Clock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  }
                </div>
                <div>
                  <p className={`text-[11px] font-bold uppercase tracking-wider ${dues.upcomingDuesAlert.isOverdue ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'
                    }`}>
                    {dues.upcomingDuesAlert.isOverdue ? 'Urgent: Overdue Payment' : 'Upcoming Due'}
                  </p>
                  <p className={`text-xs ${dues.upcomingDuesAlert.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                    }`}>
                    ₹{dues.upcomingDuesAlert.amount.toLocaleString()} {
                      dues.upcomingDuesAlert.isOverdue
                        ? `was due ${Math.abs(dues.upcomingDuesAlert.daysLeft)} days ago`
                        : `is due in ${dues.upcomingDuesAlert.daysLeft} days`
                    } ({new Date(dues.upcomingDuesAlert.dueDate).toLocaleDateString()})
                  </p>
                </div>
              </div>
              <Link href="/dashboard/residents/dues">
                <Button
                  size="sm"
                  variant="outline"
                  className={`h-8 text-[10px] ${dues.upcomingDuesAlert.isOverdue
                    ? 'border-red-300 text-red-700 hover:bg-red-100'
                    : 'border-blue-300 text-blue-700 hover:bg-blue-100'
                    }`}
                >
                  PAY NOW
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Shortcuts - IGATESECURITY Style */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-foreground">Shortcuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
              {shortcuts.map((shortcut, index) => {
                const Icon = shortcut.icon
                const shortcutContent = (
                  <div className="flex flex-col items-center gap-2 w-16 sm:w-20 cursor-pointer group">
                    <div className={`p-3 sm:p-4 rounded-xl ${shortcut.color} dark:bg-muted/50 transition-transform group-hover:scale-110`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-foreground" />
                    </div>
                    <span className="text-xs text-muted-foreground text-center">{shortcut.label}</span>
                  </div>
                )

                if (shortcut.isSearch) {
                  return (
                    <VehicleSearchDialog
                      key={index}
                      trigger={shortcutContent}
                    />
                  )
                }

                return (
                  <Link key={index} href={shortcut.href as string} className="flex-shrink-0">
                    {shortcutContent}
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* My Unit Card - IGATESECURITY Style (page 5) */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">My Unit</CardTitle>
              <Badge variant="outline" className="bg-muted text-foreground">
                Unit No : {unit?.unitNo || 'N/A'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 sm:p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{unit?.members?.toString().padStart(2, '0') || '00'}</p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/10 rounded-xl p-3 sm:p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Dog className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{unit?.pets?.toString().padStart(2, '0') || '00'}</p>
                <p className="text-xs text-muted-foreground">Pets</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-3 sm:p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Car className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground">{unit?.vehicles?.toString().padStart(2, '0') || '00'}</p>
                <p className="text-xs text-muted-foreground">Vehicles</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-3">Gate Updates</h4>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {apiGateUpdates?.map((item: any, index: number) => {
                  const Icon = item.type === 'Visitor' ? Users : item.type === 'Helper' ? User : Package
                  const colorParts = (item.color || 'bg-muted text-muted-foreground').replace('bg-purple-100', 'bg-purple-100 dark:bg-purple-900/20').replace('bg-pink-100', 'bg-pink-100 dark:bg-pink-900/20').replace('bg-blue-100', 'bg-blue-100 dark:bg-blue-900/20').split(' ')
                  return (
                    <Link key={index} href={item.type === 'Helper' ? '/dashboard/resident/daily-help' : '#'} className={`rounded-xl p-3 ${colorParts[0]} text-center hover:opacity-80 transition-opacity`}>
                      <Icon className={`h-5 w-5 mx-auto mb-1 ${colorParts[1] || 'text-muted-foreground'}`} />
                      <p className="text-xs font-medium text-foreground">{item.type}</p>
                      <p className="text-lg font-bold text-foreground">{item.count}</p>
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* My Dues Detail */}
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-3">My Dues</h4>
              {dues?.penalty > 0 && dues?.penaltyLabel && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-medium px-3 py-1 rounded-full inline-block mb-2">
                  {dues.penaltyLabel} Rs. {dues.penalty}
                </div>
              )}
              <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-red-300">Maintenance Fee</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-red-100">Rs. {dues?.amount?.toLocaleString() || '0'}</p>
                  </div>
                  <Link href="/dashboard/residents/dues">
                    <Button className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white">PAY</Button>
                  </Link>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link href="/dashboard/residents/dues" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Clock className="h-3 w-3 mr-1" /> History
                    </Button>
                  </Link>
                  <Link href="/dashboard/residents/dues?tab=wallet" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <CreditCard className="h-3 w-3 mr-1" /> Advance / Deposit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Announcements - IGATESECURITY Style */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">Announcements</CardTitle>
              <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 text-sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
              {(apiAnnouncements && apiAnnouncements.length > 0) ? apiAnnouncements.map((announcement: any) => (
                <div
                  key={announcement.id}
                  className="flex-shrink-0 w-[280px] sm:w-[320px] p-4 rounded-xl border border-border hover:border-blue-200 transition-colors bg-card"
                >
                  <h4 className="font-semibold text-foreground mb-2 line-clamp-2">{announcement.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{announcement.description}</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        {(announcement.author || '').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{announcement.author}</span>
                    <span className="text-xs text-muted-foreground">• {announcement.time ? new Date(announcement.time).toLocaleDateString() : '—'}</span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground py-4">No announcements yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Community Buzz - IGATESECURITY Style */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">Community Buzz</CardTitle>
              <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 text-sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(apiBuzz && apiBuzz.length > 0) ? apiBuzz.map((item: any) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-border hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {item.hasResult && (
                        <Badge variant="outline" className="text-red-500 border-red-200 mb-2 text-xs">
                          View Result
                        </Badge>
                      )}
                      <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                            {(item.author || '').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{item.author}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground py-4">No community buzz yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Community Guidelines - Super Admin Messages */}
      {guidelines.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground">Community Guidelines</CardTitle>
                <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                  {guidelines.length} {guidelines.length === 1 ? 'Guideline' : 'Guidelines'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {guidelines.slice(0, 3).map((guideline: any) => (
                  <div
                    key={guideline.id}
                    className="p-4 rounded-xl border border-purple-100 dark:border-purple-800/50 bg-purple-50/30 dark:bg-purple-900/10 hover:bg-purple-50/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex-shrink-0">
                        <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] uppercase font-bold py-0 h-4">
                            {guideline.category || 'General'}
                          </Badge>
                          <Badge className={guideline.society?.name ? "bg-teal-500/10 text-teal-600 hover:bg-teal-500/10 border-teal-500/20 text-[10px]" : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-blue-500/20 text-[10px]"}>
                            {guideline.society?.name || "Official Platform"}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground ml-auto">
                            {guideline.createdAt ? new Date(guideline.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <h4 className="font-semibold text-foreground mb-1">{guideline.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{guideline.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {guidelines.length > 3 && (
                  <Link href="/dashboard/resident/guidelines">
                    <Button variant="outline" className="w-full border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      View All {guidelines.length} Guidelines
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upcoming Events */}
      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-foreground">Upcoming Events</CardTitle>
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(apiEvents && apiEvents.length > 0) ? apiEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl border border-border hover:border-teal-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => router.push('/dashboard/residents/events')}
                >
                  <h4 className="font-semibold text-foreground mb-2">{event.title}</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {event.location}
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground col-span-full py-4">No upcoming events.</p>
              )}
            </div>
            <Link href="/dashboard/residents/events">
              <Button variant="outline" className="w-full mt-4 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20">
                View All Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Deposit Payment Dialog */}
      <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay Security Deposit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl flex items-center gap-3 border border-red-100 dark:border-red-900/30">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-400">Amount Due</p>
                <p className="text-2xl font-bold text-red-700">₹{dues?.pendingDepositAmount?.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="h-12 border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONLINE">Online Payment (Card/UPI/Net Banking)</SelectItem>
                  <SelectItem value="CASH">Cash Pay to Admin</SelectItem>
                  <SelectItem value="CHEQUE">Submit Cheque to Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {paymentMethod !== 'ONLINE' && (
              <p className="text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-md">
                Note: Upon confirmation, your deposit request will be marked as paid. Please ensure you submit the {paymentMethod.toLowerCase()} to the society administration office today.
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDepositDialogOpen(false)}>Cancel</Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700 text-white min-w-[140px]"
              onClick={() => payDepositMutation.mutate({ paymentMethod })}
              disabled={payDepositMutation.isPending}
            >
              {payDepositMutation.isPending ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
