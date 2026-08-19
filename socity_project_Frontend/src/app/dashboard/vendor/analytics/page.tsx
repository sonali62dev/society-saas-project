'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
    TrendingUp, 
    IndianRupee, 
    CheckCircle2, 
    Clock, 
    Calendar, 
    FileText, 
    ArrowUpRight, 
    Filter, 
    Building2,
    Download
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell 
} from 'recharts'
import { format, subDays } from 'date-fns'

export default function AnalyticsPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const { data: inquiriesRaw, isLoading } = useQuery({
        queryKey: ['vendor-analytics-leads'],
        queryFn: async () => {
            const res = await api.get('/services/inquiries', { params: { limit: 500 } })
            const body = res.data
            return Array.isArray(body) ? body : (body?.data ?? [])
        },
    })

    const inquiries = Array.isArray(inquiriesRaw) ? inquiriesRaw : []

    // Calculate real financial stats from DB inquiries
    const financialStats = useMemo(() => {
        let totalRevenue = 0
        let pendingPayouts = 0
        let completedJobsCount = 0
        let totalJobs = inquiries.length

        const completedList = inquiries.filter((inq: any) => {
            const s = (inq.status || '').toLowerCase()
            return s === 'done' || s === 'completed' || inq.paymentStatus === 'PAID'
        })

        completedJobsCount = completedList.length

        completedList.forEach((inq: any) => {
            const amt = Number(inq.vendorPrice || inq.payableAmount || 0)
            totalRevenue += amt
            if (inq.paymentStatus !== 'PAID') {
                pendingPayouts += amt
            }
        })

        const avgEarningPerJob = completedJobsCount > 0 ? Math.round(totalRevenue / completedJobsCount) : 0

        return {
            totalRevenue,
            pendingPayouts,
            completedJobsCount,
            totalJobs,
            avgEarningPerJob,
            completedList
        }
    }, [inquiries])

    // Chart Data (Last 7 Days Revenue)
    const dailyChartData = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = subDays(new Date(), 6 - i)
            const dateStr = format(date, 'yyyy-MM-dd')
            const displayDate = format(date, 'MMM dd')

            const dayEarnings = inquiries
                .filter((inq: any) => {
                    const inqDate = format(new Date(inq.createdAt), 'yyyy-MM-dd')
                    const s = (inq.status || '').toLowerCase()
                    return inqDate === dateStr && (s === 'done' || s === 'completed' || inq.paymentStatus === 'PAID')
                })
                .reduce((sum: number, inq: any) => sum + Number(inq.vendorPrice || inq.payableAmount || 0), 0)

            return { name: displayDate, earnings: dayEarnings }
        })
    }, [inquiries])

    // Status breakdown chart data
    const pieData = useMemo(() => {
        const completed = financialStats.completedJobsCount
        const pending = inquiries.filter((i: any) => (i.status || '').toLowerCase() === 'pending' || (i.status || '').toLowerCase() === 'booked').length
        const contacted = inquiries.filter((i: any) => (i.status || '').toLowerCase() === 'contacted' || (i.status || '').toLowerCase() === 'confirmed').length

        return [
            { name: 'Completed', value: completed, color: '#10b981' },
            { name: 'In Progress', value: contacted, color: '#f59e0b' },
            { name: 'Pending', value: pending, color: '#6366f1' },
        ].filter(d => d.value > 0)
    }, [inquiries, financialStats])

    // Filtered transaction list
    const filteredTransactions = useMemo(() => {
        if (statusFilter === 'all') return inquiries
        if (statusFilter === 'completed') {
            return inquiries.filter((i: any) => {
                const s = (i.status || '').toLowerCase()
                return s === 'done' || s === 'completed' || i.paymentStatus === 'PAID'
            })
        }
        if (statusFilter === 'paid') return inquiries.filter((i: any) => i.paymentStatus === 'PAID')
        if (statusFilter === 'pending') return inquiries.filter((i: any) => i.paymentStatus !== 'PAID')
        return inquiries
    }, [inquiries, statusFilter])

    if (isLoading) {
        return (
            <div className="p-8 space-y-6">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-teal-500 border-t-transparent mx-auto py-12" />
            </div>
        )
    }

    return (
        <div className="space-y-8 p-4 md:p-0">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Financial Overview
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Earning Stats & Revenue Analytics</h1>
                    <p className="text-teal-100/70 text-sm max-w-xl">
                        Track your completed service jobs, revenue breakdown, and real-time payment settlements.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl font-bold backdrop-blur-sm"
                        onClick={() => window.print()}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-3xl">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-black uppercase tracking-wider text-emerald-100">Total Gross Earnings</p>
                        <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
                            <IndianRupee className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <p className="text-3xl font-black mt-4">₹{financialStats.totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-emerald-100/80 mt-2 font-medium">From {financialStats.completedJobsCount} completed service jobs</p>
                </Card>

                <Card className="p-6 border-0 shadow-sm bg-white dark:bg-slate-900 rounded-3xl ring-1 ring-border">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Jobs</p>
                        <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-4">{financialStats.completedJobsCount}</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Out of {financialStats.totalJobs} total assigned leads</p>
                </Card>

                <Card className="p-6 border-0 shadow-sm bg-white dark:bg-slate-900 rounded-3xl ring-1 ring-border">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Payout</p>
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600">
                            <Clock className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-4">₹{financialStats.pendingPayouts.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Awaiting settlement or cash collect</p>
                </Card>

                <Card className="p-6 border-0 shadow-sm bg-white dark:bg-slate-900 rounded-3xl ring-1 ring-border">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Order Value</p>
                        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600">
                            <ArrowUpRight className="h-5 w-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-4">₹{financialStats.avgEarningPerJob.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Average revenue per service</p>
                </Card>
            </div>

            {/* Visual Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend Chart */}
                <Card className="lg:col-span-2 p-6 border-0 shadow-sm bg-white dark:bg-slate-900 rounded-3xl ring-1 ring-border">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Daily Revenue Trend</h2>
                            <p className="text-xs text-slate-500">Earnings earned over the last 7 days</p>
                        </div>
                        <Badge className="bg-teal-100 text-teal-700 font-bold">Last 7 Days</Badge>
                    </div>

                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    formatter={(value: any) => [`₹${value}`, 'Earnings']}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="earnings" fill="#10b981" radius={[8, 8, 0, 0]} barSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Job Status Breakdown */}
                <Card className="p-6 border-0 shadow-sm bg-white dark:bg-slate-900 rounded-3xl ring-1 ring-border flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Order Status Distribution</h2>
                        <p className="text-xs text-slate-500">Breakdown of all assigned leads</p>

                        <div className="h-[200px] w-full mt-4 flex items-center justify-center">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={pieData} 
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius={55} 
                                            outerRadius={80} 
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-center text-xs text-slate-400">No status data available</div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-xs font-semibold">
                                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.name}
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white">{item.value} Jobs</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Detailed Transaction History Table */}
            <Card className="p-6 border-0 shadow-sm bg-white dark:bg-slate-900 rounded-3xl ring-1 ring-border">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detailed Service & Payment History</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Real-time ledger of completed and assigned service orders</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-bold text-slate-500">Filter Status:</span>
                        <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            {['all', 'completed', 'paid', 'pending'].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setStatusFilter(st)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                                        statusFilter === st
                                            ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-400 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 px-3">Customer / Resident</th>
                                <th className="pb-3 px-3">Service Name</th>
                                <th className="pb-3 px-3">Booking Date</th>
                                <th className="pb-3 px-3">Status</th>
                                <th className="pb-3 px-3">Payment Method</th>
                                <th className="pb-3 px-3 text-right">Earning Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                            {filteredTransactions.map((inq: any) => {
                                const amount = Number(inq.vendorPrice || inq.payableAmount || 0)
                                const isDone = ['done', 'completed'].includes((inq.status || '').toLowerCase())
                                return (
                                    <tr key={inq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-4 px-3 font-semibold text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-xs">
                                                    {(inq.residentName || 'U')[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{inq.residentName || 'Resident'}</p>
                                                    <p className="text-xs text-slate-400 font-normal">Unit: {inq.unit || '—'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 font-medium text-slate-700 dark:text-slate-300">
                                            {inq.serviceName}
                                        </td>
                                        <td className="py-4 px-3 text-xs text-slate-500 font-medium">
                                            {format(new Date(inq.createdAt), 'dd MMM yyyy')}
                                        </td>
                                        <td className="py-4 px-3">
                                            {isDone ? (
                                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Completed</Badge>
                                            ) : (
                                                <Badge className="bg-amber-100 text-amber-700 border-amber-200 capitalize">{inq.status || 'Pending'}</Badge>
                                            )}
                                        </td>
                                        <td className="py-4 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase">
                                            {inq.paymentMethod || 'CASH / DIRECT'}
                                        </td>
                                        <td className="py-4 px-3 text-right font-black text-emerald-600 dark:text-emerald-400 text-base">
                                            ₹{amount.toLocaleString()}
                                        </td>
                                    </tr>
                                )
                            })}

                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 text-xs font-medium">
                                        No service transaction records match your filter criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
