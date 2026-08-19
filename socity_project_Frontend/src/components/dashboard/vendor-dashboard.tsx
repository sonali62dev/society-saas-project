'use client'

import { motion } from 'framer-motion'
import { ClipboardList, TrendingUp, Users, CheckCircle2, MoreVertical, Clock, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Cell as RePieCell } from 'recharts'
import { format, subDays, startOfDay } from 'date-fns'

export function VendorDashboard() {
    const queryClient = useQueryClient()

    const { data: inquiriesRaw, isLoading } = useQuery({
        queryKey: ['vendor-my-leads'],
        queryFn: async () => {
            const res = await api.get('/services/inquiries', { params: { limit: 200 } })
            const body = res.data
            return Array.isArray(body) ? body : (body?.data ?? [])
        },
    })

    const vendorLeads = Array.isArray(inquiriesRaw) ? inquiriesRaw : []

    const contactMutation = useMutation({
        mutationFn: async (id: number | string) => {
            const res = await api.patch(`/services/inquiries/${id}/contact`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor-my-leads'] })
            toast.success('Customer marked as contacted.')
        },
        onError: (err: any) => toast.error(err?.response?.data?.error || 'Failed to mark as contacted'),
    })

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number | string; status: string }) => {
            const res = await api.patch(`/services/inquiries/${id}/status`, { status })
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor-my-leads'] })
        },
    })

    const isContacted = (lead: any) => {
        const s = String(lead?.status || '').toLowerCase()
        return lead?.contactedAt != null || s === 'contacted' || s === 'confirmed' || s === 'done' || s === 'completed'
    }

    const handleStatusUpdate = (id: string | number, status: string) => {
        statusMutation.mutate(
            { id, status },
            {
                onSuccess: () => toast.success('Status updated'),
                onError: (err: any) => toast.error(err?.response?.data?.error || 'Failed to update'),
            }
        )
    }

    const activeStatuses = ['pending', 'booked']
    const contactedStatuses = ['contacted', 'confirmed']
    const closedStatuses = ['done', 'completed']

    const activeCount = vendorLeads.filter((l: any) => activeStatuses.includes(String(l.status).toLowerCase())).length
    const completedCount = vendorLeads.filter((l: any) => closedStatuses.includes(String(l.status).toLowerCase())).length
    const contactedCount = vendorLeads.filter((l: any) => contactedStatuses.includes(String(l.status).toLowerCase())).length

    const stats = [
        { label: 'Total Leads', value: vendorLeads.length, icon: ClipboardList, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
        { label: 'To Action', value: activeCount, icon: Users, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { label: 'Completed', value: completedCount, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { label: 'Conversion', value: vendorLeads.length > 0 ? `${Math.round((completedCount / vendorLeads.length) * 100)}%` : '0%', icon: TrendingUp, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    ]

    // Prepare analytics data for last 7 days
    const chartData = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i)
        const dateStr = format(date, 'MMM dd')
        const count = vendorLeads.filter((l: any) => {
            const lDate = new Date(l.createdAt)
            return format(lDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
        }).length
        return { name: dateStr, leads: count }
    })

    const COLORS = ['#10b981', '#f59e0b', '#ef4444']
    const pieData = [
        { name: 'Done', value: completedCount },
        { name: 'In Progress', value: contactedCount },
        { name: 'Pending', value: activeCount },
    ].filter(d => d.value > 0)

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Vendor Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your service inquiries and leads</p>
                </div>
                <Link href="/dashboard/vendor/leads">
                    <Button className="bg-[#1e3a5f] hover:bg-[#2d4a6f] dark:bg-blue-900/50 dark:hover:bg-blue-900/70 rounded-xl font-bold h-11 px-6">
                        View All Leads
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-6 border-0 shadow-sm bg-card rounded-3xl ring-1 ring-border">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-2xl font-black text-foreground">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6 border-0 shadow-sm bg-card rounded-3xl ring-1 ring-border">
                    <h2 className="text-lg font-bold text-foreground mb-6">Recent Enquiries</h2>
                    <div className="space-y-4">
                        {vendorLeads.slice(0, 5).map((lead: any) => {
                            const name = lead.residentName || '—'
                            const unit = lead.unit ?? '—'
                            const st = String(lead.status || '').toLowerCase()
                            return (
                                <div key={lead.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 hover:bg-muted/80 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center font-bold text-teal-600 shadow-sm">
                                            {name.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-foreground">{name} ({unit})</h4>
                                            <p className="text-xs text-muted-foreground">{lead.serviceName || '—'} • {lead.type || 'booking'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${activeStatuses.includes(st) ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                                    contactedStatuses.includes(st) ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                }`}>
                                                {st || '—'}
                                            </span>
                                            <p className="text-[10px] text-muted-foreground font-bold mt-1">
                                                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'}
                                            </p>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background shadow-sm">
                                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-border ring-1 ring-border bg-card">
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(lead.id, 'booked')}
                                                    className="rounded-xl font-bold text-[10px] uppercase p-3 focus:bg-muted focus:text-foreground"
                                                >
                                                    <AlertCircle className="h-4 w-4 mr-2 text-blue-500" /> Mark Pending
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => !isContacted(lead) && contactMutation.mutate(lead.id)}
                                                    disabled={isContacted(lead) || contactMutation.isPending}
                                                    className="rounded-xl font-bold text-[10px] uppercase p-3 focus:bg-muted focus:text-foreground"
                                                >
                                                    <Clock className="h-4 w-4 mr-2 text-yellow-500" /> Mark Contacted
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(lead.id, 'done')}
                                                    className="rounded-xl font-bold text-[10px] uppercase p-3 focus:bg-muted focus:text-foreground"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" /> Mark Complete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    {vendorLeads.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">No assigned leads yet. When Super Admin assigns a service to you, it will appear here.</p>
                    )}
                </Card>

                <Card className="p-6 border-0 shadow-sm bg-card rounded-3xl ring-1 ring-border">
                    <h2 className="text-lg font-bold text-foreground mb-4">Lead Activity</h2>
                    <p className="text-xs text-muted-foreground mb-6">Daily trends for past 7 days</p>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                    cursor={{ fill: 'rgba(128,128,128,0.05)' }}
                                />
                                <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 pt-6 border-t border-dashed border-border">
                        <h3 className="text-sm font-bold text-foreground mb-4">Status Breakdown</h3>
                        {pieData.length > 0 ? (
                            <div className="flex items-center justify-between">
                                <div className="space-y-2 flex-1">
                                    {pieData.map((item, idx) => (
                                        <div key={item.name} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                                <span className="text-muted-foreground font-medium">{item.name}</span>
                                            </div>
                                            <span className="font-black">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="h-24 w-24 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={pieData} dataKey="value" innerRadius={25} outerRadius={40} paddingAngle={5}>
                                                {pieData.map((entry, index) => (
                                                    <RePieCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground italic text-center">No data yet to show distribution</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}
