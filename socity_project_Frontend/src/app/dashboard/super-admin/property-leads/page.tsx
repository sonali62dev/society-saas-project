'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Building2, Search, Filter, ChevronDown,
    MapPin, Phone, Mail, IndianRupee, BedDouble, Layers3,
    Home, Store, Users, Layers, Warehouse, TrendingUp,
    CheckCircle2, Clock, XCircle, Eye, MoreVertical,
    User, Calendar, History, ArrowUpDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyLeadService } from '@/services/property-lead.service'
import { toast } from 'sonner'
import { RoleGuard } from '@/components/auth/role-guard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ['Flat', 'Shop', 'PG', 'LAND', 'Gala', 'Investment']
const ACTION_TYPES = ['Buy', 'Sell', 'Rent', 'Investment']
const STATUSES = ['New Lead', 'Contacted', 'Closed']

const actionColors: Record<string, string> = {
    Buy: 'bg-blue-100 text-blue-700 border-blue-200',
    Sell: 'bg-green-100 text-green-700 border-green-200',
    Rent: 'bg-amber-100 text-amber-700 border-amber-200',
    Investment: 'bg-purple-100 text-purple-700 border-purple-200',
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
    'New Lead': {
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        badge: 'bg-blue-600 text-white border-transparent'
    },
    Contacted: {
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-50',
        badge: 'bg-emerald-600 text-white border-transparent'
    },
    Closed: {
        icon: XCircle,
        color: 'text-gray-500',
        bg: 'bg-gray-50',
        badge: 'bg-gray-600 text-white border-transparent'
    },
}

const categoryIconMap: Record<string, React.ElementType> = {
    Flat: Home, Shop: Store, PG: Users, LAND: Layers,
    Gala: Warehouse, 'Investment': TrendingUp,
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function LeadDetailModal({ lead, open, onClose }: { lead: any; open: boolean; onClose: () => void }) {
    const queryClient = useQueryClient()
    const [statusNote, setStatusNote] = useState('')
    const [newStatus, setNewStatus] = useState('')
    const Icon = categoryIconMap[lead?.category] || Building2

    const statusMutation = useMutation({
        mutationFn: () => propertyLeadService.updateStatus(lead.id, newStatus, statusNote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminPropertyLeads'] })
            toast.success(`Status updated to "${newStatus}"`)
            setStatusNote('')
            setNewStatus('')
        },
        onError: (e: any) => toast.error(e.response?.data?.error || 'Failed to update status'),
    })

    if (!lead) return null

    const status = statusConfig[lead.status] || statusConfig['New Lead']
    const StatusIcon = status.icon

    const formatBudget = (n: number) => {
        if (!n) return '—'
        if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`
        if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`
        return `₹${n.toLocaleString()}`
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        {lead.title}
                    </DialogTitle>
                    <DialogDescription>
                        {lead.category} • {lead.actionType} • Submitted {new Date(lead.createdAt).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status + Action */}
                    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/50 rounded-xl border">
                        <Badge className={`${status.badge} flex items-center gap-1 px-3 py-1 border-0 font-bold shadow-sm`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {lead.status}
                        </Badge>
                        <div className="flex items-center gap-2 ml-auto">
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger className="w-36 h-8 text-sm">
                                    <SelectValue placeholder="Change status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Button
                                size="sm"
                                disabled={!newStatus || statusMutation.isPending}
                                onClick={() => statusMutation.mutate()}
                                className="bg-blue-600 hover:bg-blue-700 text-white h-8"
                            >
                                {statusMutation.isPending ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </div>

                    {/* Notes for status update */}
                    <div className="space-y-2">
                        <Label className="text-sm">Internal Notes (optional)</Label>
                        <Textarea
                            rows={2}
                            placeholder="Add notes about this status change..."
                            value={statusNote}
                            onChange={e => setStatusNote(e.target.value)}
                        />
                    </div>

                    {/* Property Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">Property</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium">{lead.category}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><Badge className={`${actionColors[lead.actionType]} border text-xs`}>{lead.actionType}</Badge></div>
                                {lead.size && <div className="flex justify-between"><span className="text-muted-foreground">Area</span><span>{lead.size} sqft</span></div>}
                                {lead.bedrooms && <div className="flex justify-between"><span className="text-muted-foreground">Bedrooms</span><span>{lead.bedrooms} BHK</span></div>}
                                {lead.floor && <div className="flex justify-between"><span className="text-muted-foreground">Floor</span><span>{lead.floor}</span></div>}
                                {lead.budget && <div className="flex justify-between"><span className="text-muted-foreground">Budget</span><span className="font-semibold text-blue-600">{formatBudget(lead.budget)}</span></div>}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">Contact</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{lead.residentName}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{lead.phone}</span></div>
                                {lead.email && <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="truncate max-w-[140px]">{lead.email}</span></div>}
                                <div className="flex justify-between"><span className="text-muted-foreground">City</span><span>{lead.city}</span></div>
                                <div className="flex justify-between"><span className="text-muted-foreground">Area</span><span>{lead.area}</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {lead.description && (
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-2">Description</h3>
                            <p className="text-sm text-muted-foreground">{lead.description}</p>
                        </div>
                    )}

                    {/* Images */}
                    {lead.media?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-3">Images</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {lead.media.map((m: any) => (
                                    <a key={m.id} href={m.url} target="_blank" rel="noreferrer" className="rounded-lg overflow-hidden aspect-square border shadow-sm hover:opacity-80 transition-opacity">
                                        <img src={m.url} alt="property" className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status History */}
                    {lead.history?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1 mb-3">Status History</h3>
                            <div className="space-y-2">
                                {lead.history.map((h: any) => (
                                    <div key={h.id} className="flex items-start gap-3 text-sm">
                                        <div className="p-1 bg-blue-100 rounded-full mt-0.5"><History className="h-3 w-3 text-blue-600" /></div>
                                        <div>
                                            <span className="font-medium">{h.status}</span>
                                            {h.notes && <p className="text-muted-foreground text-xs">{h.notes}</p>}
                                            <p className="text-muted-foreground text-xs">{new Date(h.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPropertyLeadsPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [filterAction, setFilterAction] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')
    const [selectedLead, setSelectedLead] = useState<any>(null)
    const [page, setPage] = useState(1)

    const params: Record<string, string | number> = { page, limit: 20 }
    if (filterCategory !== 'all') params.category = filterCategory
    if (filterAction !== 'all') params.actionType = filterAction
    if (filterStatus !== 'all') params.status = filterStatus
    if (search) params.search = search

    const { data, isLoading } = useQuery({
        queryKey: ['adminPropertyLeads', params],
        queryFn: () => propertyLeadService.list(params),
    })

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) =>
            propertyLeadService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminPropertyLeads'] })
            toast.success('Status updated')
        },
        onError: (e: any) => toast.error(e.response?.data?.error || 'Failed'),
    })

    const leads: any[] = data?.data || []
    const meta = data?.meta || { total: 0, totalPages: 1 }

    const stats = {
        total: meta.total,
        newLeads: leads.filter(l => l.status === 'New Lead').length,
        contacted: leads.filter(l => l.status === 'Contacted').length,
        closed: leads.filter(l => l.status === 'Closed').length,
    }

    const formatBudget = (n: number) => {
        if (!n) return '—'
        if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`
        if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`
        return `₹${n.toLocaleString()}`
    }

    return (
        <RoleGuard allowedRoles={['super_admin', 'admin']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                        <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[#1e3a5f] dark:text-white">Property Leads</h1>
                        <p className="text-muted-foreground text-sm">Manage all property listings and enquiries from residents</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Leads', value: meta.total, gradient: 'from-blue-500 to-indigo-500' },
                        { label: 'New Leads', value: stats.newLeads, gradient: 'from-sky-500 to-blue-500' },
                        { label: 'Contacted', value: stats.contacted, gradient: 'from-emerald-500 to-green-500' },
                        { label: 'Closed', value: stats.closed, gradient: 'from-gray-400 to-slate-500' },
                    ].map(s => (
                        <Card key={s.label} className="border-0 shadow-md overflow-hidden">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${s.gradient} text-white text-xl font-bold min-w-[2.5rem] text-center`}>
                                    {isLoading ? '—' : s.value}
                                </div>
                                <p className="text-xs text-muted-foreground">{s.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Search name, phone, title..."
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1) }}
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1) }}>
                        <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filterCategory} onValueChange={v => { setFilterCategory(v); setPage(1) }}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filterAction} onValueChange={v => { setFilterAction(v); setPage(1) }}>
                        <SelectTrigger className="w-32"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {ACTION_TYPES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <Card className="border-0 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50 hover:bg-muted/50">
                                    <TableHead className="font-semibold">Property</TableHead>
                                    <TableHead className="font-semibold">Category / Type</TableHead>
                                    <TableHead className="font-semibold">Location</TableHead>
                                    <TableHead className="font-semibold">Budget</TableHead>
                                    <TableHead className="font-semibold">Contact</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            {Array.from({ length: 8 }).map((_, j) => (
                                                <TableCell key={j}><Skeleton className="h-5 w-full rounded" /></TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : leads.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                                            <Building2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
                                            No property leads found
                                        </TableCell>
                                    </TableRow>
                                ) : leads.map((lead, i) => {
                                    const Icon = categoryIconMap[lead.category] || Building2
                                    const status = statusConfig[lead.status] || statusConfig['New Lead']
                                    const StatusIcon = status.icon
                                    return (
                                        <TableRow key={lead.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-2 max-w-[180px]">
                                                    <div className="p-1.5 bg-blue-50 rounded-lg shrink-0">
                                                        <Icon className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <span className="font-medium text-sm truncate">{lead.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-sm">{lead.category}</div>
                                                    <Badge className={`${actionColors[lead.actionType]} border text-xs`}>{lead.actionType}</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                    <span className="truncate max-w-[120px]">{lead.area}, {lead.city}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-semibold text-sm text-blue-600">{formatBudget(lead.budget)}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <p className="font-medium">{lead.residentName}</p>
                                                    <p className="text-muted-foreground text-xs">{lead.phone}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${status.badge} flex items-center gap-1 w-fit border-0 font-bold shadow-sm py-1`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    <span className="text-[10px] uppercase tracking-wider">{lead.status}</span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                                                        onClick={() => setSelectedLead(lead)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                                                                <Eye className="h-4 w-4 mr-2" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            {STATUSES.filter(s => s !== lead.status).map(s => (
                                                                <DropdownMenuItem
                                                                    key={s}
                                                                    onClick={() => statusMutation.mutate({ id: lead.id, status: s })}
                                                                >
                                                                    Mark as {s}
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Page {page} of {meta.totalPages} ({meta.total} total leads)</p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                            <Button variant="outline" size="sm" disabled={page >= meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedLead && (
                <LeadDetailModal
                    lead={selectedLead}
                    open={!!selectedLead}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </RoleGuard>
    )
}
