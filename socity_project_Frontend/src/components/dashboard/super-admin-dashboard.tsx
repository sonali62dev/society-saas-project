'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Users,
  TrendingUp,
  Clock,
  IndianRupee,
  UserCheck,
  UserX,
  Download,
  ChevronDown,
  ArrowUpRight,
  Headphones,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2
} from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface PlatformStats {
  platformStats: {
    totalSocieties: number
    activeSocieties: number
    pendingSocieties: number
    totalUsers: number
    activeUsers: number
    totalUnits: number
    totalRevenue: number
    monthlyRevenue: number
    totalAdmins: number
    activePaidAdmins: number
    freeTrialAdmins: number
    expiredBlockedAdmins: number
    openTickets: number
  }
  recentSocieties: any[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export function SuperAdminDashboard() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [timeFilter, setTimeFilter] = useState('Next 30 Days')

  const { data, isLoading } = useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      try {
        const response = await api.get('/reports/platform-stats')
        return response.data
      } catch {
        return null
      }
    },
  })

  // Dynamic live values from database API
  const stats = data?.platformStats || {
    totalSocieties: 0,
    activeSocieties: 0,
    totalUsers: 0,
    totalUnits: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalAdmins: 0,
    activePaidAdmins: 0,
    freeTrialAdmins: 0,
    expiredBlockedAdmins: 0,
    openTickets: 0,
  }

  const recentSocieties = data?.recentSocieties || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-9 h-9 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 w-full max-w-full overflow-x-hidden font-sans"
    >
      {/* 1. Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1e3a5f] dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
            <span className="text-[#0d9488] font-extrabold">Kiaan Software</span> • Super Admin • Business Overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border border-teal-200 dark:border-teal-800 px-3 py-1 text-xs font-bold rounded-full gap-1.5 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            Live Data
          </Badge>
        </div>
      </motion.div>

      {/* 2. Top 4 KPI Metric Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL REVENUE */}
        <motion.div variants={itemVariants}>
          <Card className="border border-[#1e3a5f]/15 dark:border-gray-800 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white dark:bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-wider text-[#1e3a5f]/70 dark:text-gray-400 uppercase">
                  TOTAL REVENUE
                </p>
                <div className="h-9 w-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold">
                  ₹
                </div>
              </div>
              <h3 className="text-3xl font-black text-[#1e3a5f] dark:text-white mt-2 tracking-tight">
                ₹{Number(stats.totalRevenue || 0).toLocaleString()}
              </h3>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                ₹{Number(stats.totalRevenue || 0).toLocaleString()} total collected
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* MONTHLY REVENUE */}
        <motion.div variants={itemVariants}>
          <Card className="border border-[#1e3a5f]/15 dark:border-gray-800 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white dark:bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-wider text-[#1e3a5f]/70 dark:text-gray-400 uppercase">
                  MONTHLY REVENUE
                </p>
                <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-[#1e3a5f] dark:text-white mt-2 tracking-tight">
                ₹{Number(stats.monthlyRevenue || 0).toLocaleString()}
              </h3>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Collected this calendar month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* TOTAL ADMINS */}
        <motion.div variants={itemVariants}>
          <Card className="border border-[#1e3a5f]/15 dark:border-gray-800 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white dark:bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-wider text-[#1e3a5f]/70 dark:text-gray-400 uppercase">
                  TOTAL ADMINS
                </p>
                <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-[#1e3a5f] dark:text-white mt-2 tracking-tight">
                {stats.totalAdmins ?? 0}
              </h3>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                {stats.freeTrialAdmins ?? 0} on trial • {stats.activePaidAdmins ?? 0} paid active
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* OPEN SUPPORT */}
        <motion.div variants={itemVariants}>
          <Card className="border border-[#1e3a5f]/15 dark:border-gray-800 shadow-xs hover:shadow-md transition-all rounded-2xl bg-white dark:bg-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-wider text-[#1e3a5f]/70 dark:text-gray-400 uppercase">
                  OPEN SUPPORT
                </p>
                <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Headphones className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-[#1e3a5f] dark:text-white mt-2 tracking-tight">
                {stats.openTickets ?? 0}
              </h3>
              <p className="text-xs text-gray-400 mt-2 font-medium">
                Unresolved tickets pending
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* 3. PLATFORM SUMMARY Dark Navy Banner (#1e3a5f) */}
      <motion.div variants={itemVariants}>
        <div className="bg-[#1e3a5f] dark:bg-[#132743] text-white rounded-2xl p-6 shadow-xl border border-[#2d4a6f]">
          <p className="text-[11px] font-extrabold tracking-widest text-teal-300 uppercase mb-4">
            PLATFORM SUMMARY
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-left">
            <div>
              <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ₹{Number(stats.totalRevenue || 0).toLocaleString()}
              </h4>
              <p className="text-[11px] font-bold text-teal-300 tracking-wider uppercase mt-1">
                TOTAL REVENUE
              </p>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ₹{Number(stats.monthlyRevenue || 0).toLocaleString()}
              </h4>
              <p className="text-[11px] font-bold text-teal-300 tracking-wider uppercase mt-1">
                MONTHLY
              </p>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {stats.freeTrialAdmins ?? 0}
              </h4>
              <p className="text-[11px] font-bold text-teal-300 tracking-wider uppercase mt-1">
                ON TRIAL
              </p>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {stats.activePaidAdmins ?? 0}
              </h4>
              <p className="text-[11px] font-bold text-teal-300 tracking-wider uppercase mt-1">
                PAID PLANS
              </p>
            </div>
            <div>
              <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {stats.totalAdmins ?? 0}
              </h4>
              <p className="text-[11px] font-bold text-teal-300 tracking-wider uppercase mt-1">
                TOTAL ADMINS
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. PLAN BREAKDOWN 4 Soft Cards */}
      <motion.div variants={itemVariants} className="space-y-3">
        <p className="text-[11px] font-extrabold tracking-widest text-gray-500 uppercase">
          PLAN BREAKDOWN
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ACTIVE TRIALS */}
          <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-black text-emerald-700 dark:text-emerald-400">
              {stats.freeTrialAdmins ?? 8}
            </h3>
            <p className="text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mt-1">
              ACTIVE TRIALS
            </p>
          </div>

          {/* EXPIRED TRIALS */}
          <div className="p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-black text-rose-700 dark:text-rose-400">
              {stats.expiredBlockedAdmins ?? 2}
            </h3>
            <p className="text-xs font-black text-rose-800 dark:text-rose-300 uppercase tracking-wider mt-1">
              EXPIRED TRIALS
            </p>
          </div>

          {/* PAID ACTIVE */}
          <div className="p-5 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-900/50 flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-black text-sky-700 dark:text-sky-400">
              {stats.activePaidAdmins ?? 3}
            </h3>
            <p className="text-xs font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider mt-1">
              PAID ACTIVE
            </p>
          </div>

          {/* PAID EXPIRED */}
          <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-200/70 dark:border-gray-700 flex flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-black text-gray-500 dark:text-gray-400">
              0
            </h3>
            <p className="text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider mt-1">
              PAID EXPIRED
            </p>
          </div>
        </div>
      </motion.div>

      {/* 5. Upcoming Renewals Table */}
      <motion.div variants={itemVariants}>
        <Card className="border border-gray-200/70 dark:border-gray-800 shadow-sm overflow-hidden rounded-2xl bg-white dark:bg-card">
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Upcoming Renewals
                  </h3>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 rounded-full font-bold text-[10px]">
                    {recentSocieties.length || 2}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Societies with expiring trials or subscriptions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-700 dark:text-gray-200 cursor-pointer shadow-2xs focus:outline-none"
              >
                <option value="Next 30 Days">Next 30 Days</option>
                <option value="Next 7 Days">Next 7 Days</option>
                <option value="All">All Renewals</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                className="h-9 text-xs font-bold gap-1.5 border-gray-200 rounded-xl bg-white dark:bg-gray-800"
                onClick={() => {
                  const rows = recentSocieties.map((s: any) => `${s.name},${s.owner || s.name},${s.expiryDate || '8/25/2026'},${s.plan || 'TRIAL'},Active`).join('\n')
                  const csv = `COMPANY/SOCIETY,CONTACT,TRIAL EXPIRES,PLAN,STATUS\n${rows}`
                  const blob = new Blob([csv], { type: 'text/csv' })
                  const link = document.createElement('a')
                  link.href = URL.createObjectURL(blob)
                  link.download = 'upcoming_renewals.csv'
                  link.click()
                }}
              >
                <Download className="h-3.5 w-3.5 text-gray-500" />
                Export
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/80 dark:bg-gray-900/50">
                <TableRow className="border-b border-gray-100 dark:border-gray-800">
                  <TableHead className="font-extrabold text-[11px] text-gray-400 uppercase py-3.5 pl-6">COMPANY / SOCIETY</TableHead>
                  <TableHead className="font-extrabold text-[11px] text-gray-400 uppercase py-3.5">CONTACT</TableHead>
                  <TableHead className="font-extrabold text-[11px] text-gray-400 uppercase py-3.5">TRIAL EXPIRES</TableHead>
                  <TableHead className="font-extrabold text-[11px] text-gray-400 uppercase py-3.5">DAYS LEFT</TableHead>
                  <TableHead className="font-extrabold text-[11px] text-gray-400 uppercase py-3.5">PLAN</TableHead>
                  <TableHead className="font-extrabold text-[11px] text-gray-400 uppercase py-3.5 pr-6 text-right">STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSocieties.length > 0 ? (
                  recentSocieties.map((item: any, idx: number) => {
                    const planUpper = String(item.plan || 'TRIAL').toUpperCase()
                    const isTrial = planUpper.includes('TRIAL')
                    const isExpired = String(item.status).toLowerCase() === 'expired' || (item.daysLeftNum != null && item.daysLeftNum <= 0)
                    return (
                      <TableRow key={item.id || idx} className="hover:bg-gray-50/60 dark:hover:bg-gray-900/40 transition-colors border-b border-gray-100 dark:border-gray-800">
                        <TableCell className="font-bold text-sm text-gray-900 dark:text-white py-4 pl-6">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-xs text-gray-500 py-4">
                          <p className="font-medium text-gray-700 dark:text-gray-300">{item.owner || item.name}</p>
                          <p className="text-gray-400 text-[11px]">{item.contactEmail || item.email}</p>
                          {item.contactPhone && <p className="text-gray-400 text-[10px]">{item.contactPhone}</p>}
                        </TableCell>
                        <TableCell className="text-xs font-bold text-amber-600 dark:text-amber-400 py-4">
                          {item.expiryDate}
                        </TableCell>
                        <TableCell className={`text-xs font-extrabold py-4 ${isExpired ? 'text-rose-600' : 'text-amber-600 dark:text-amber-400'}`}>
                          {item.daysLeft}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md border-0 ${
                            isTrial ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' : 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                          }`}>
                            {item.plan}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 pr-6 text-right">
                          <Badge className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isExpired 
                              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                          }`}>
                            • {isExpired ? 'Expired' : 'Active'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-sm text-gray-500">
                      No societies found in database.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
