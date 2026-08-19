'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    FileText, Search, Filter, MoreHorizontal, UserCheck,
    CheckCircle2, XCircle, Info, Phone, Mail, MapPin,
    Calendar, Users, IndianRupee, ExternalLink, Download,
    User, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rentalAgreementService } from '@/services/rental-agreement.service'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { RoleGuard } from '@/components/auth/role-guard'
import { Skeleton } from '@/components/ui/skeleton'

const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
    'New': { label: 'New Lead', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Info },
    'Processing': { label: 'Processing', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Info },
    'Completed': { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    'Rejected': { label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
}

export default function SuperAdminRentalAgreementsPage() {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedLead, setSelectedLead] = useState<any>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isStatusOpen, setIsStatusOpen] = useState(false)
    const [isAssignOpen, setIsAssignOpen] = useState(false)

    // Status update form
    const [statusForm, setStatusForm] = useState({ status: '', notes: '' })
    // Assignment form
    const [assignId, setAssignId] = useState('')

    // Fetch leads
    const { data, isLoading } = useQuery({
        queryKey: ['adminRentalAgreements'],
        queryFn: () => rentalAgreementService.list(),
    })

    // Fetch users for assignment (simulated/existing pattern)
    const { data: userData } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch('/api/resident/all?role=ADMIN&role=SUPER_ADMIN');
            return res.json();
        }
    })
    const users = userData?.data || []

    const statusMutation = useMutation({
        mutationFn: ({ id, status, notes }: any) => rentalAgreementService.updateStatus(id, status, notes),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminRentalAgreements'] })
            toast.success('Status updated successfully')
            setIsStatusOpen(false)
        }
    })

    const assignMutation = useMutation({
        mutationFn: ({ id, assignedToId }: any) => rentalAgreementService.assign(id, assignedToId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminRentalAgreements'] })
            toast.success('Lead assigned successfully')
            setIsAssignOpen(false)
        }
    })

    const leads: any[] = data?.data || []
    const filtered = leads.filter(l => {
        const matchSearch = l.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
            l.tenantName?.toLowerCase().includes(search.toLowerCase()) ||
            l.residentName?.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === 'all' || l.status === statusFilter
        return matchSearch && matchStatus
    })

    const stats = {
        total: leads.length,
        new: leads.filter(l => l.status === 'New').length,
        processing: leads.filter(l => l.status === 'Processing').length,
        completed: leads.filter(l => l.status === 'Completed').length,
    }

    return (
        <RoleGuard allowedRoles={['super_admin', 'admin']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#1e3a5f] shadow-lg shadow-blue-500/20">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1e3a5f] dark:text-white">Rental Agreement Leads</h1>
                            <p className="text-muted-foreground text-sm">Manage and process rental agreement registration enquiries</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Leads', value: stats.total, color: 'from-blue-600 to-blue-400' },
                        { label: 'New Requests', value: stats.new, color: 'from-sky-600 to-sky-400' },
                        { label: 'Processing', value: stats.processing, color: 'from-amber-600 to-amber-400' },
                        { label: 'Completed', value: stats.completed, color: 'from-emerald-600 to-emerald-400' },
                    ].map(s => (
                        <Card key={s.label} className="border-0 shadow-sm overflow-hidden">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${s.color} text-white shadow-md`}>
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                                </div>
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
                            placeholder="Search by name..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-44">
                            <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <Card className="border-0 shadow-sm overflow-hidden rounded-2xl">
                    <Table>
                        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                            <TableRow>
                                <TableHead>Owner & Tenant</TableHead>
                                <TableHead>Property</TableHead>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [1, 2, 3].map(i => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                                        No leads found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map(lead => {
                                    const status = statusConfig[lead.status] || statusConfig['New']
                                    return (
                                        <TableRow key={lead.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-white">{lead.ownerName}</span>
                                                    <span className="text-[10px] text-muted-foreground bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded w-fit mt-0.5">Tenant: {lead.tenantName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col max-w-[200px]">
                                                    <span className="text-sm font-medium line-clamp-1">{lead.area}, {lead.city}</span>
                                                    <span className="text-[10px] text-muted-foreground">{lead.propertyType}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium">{lead.residentName}</span>
                                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Phone className="h-2.5 w-2.5" /> {lead.phone}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground">{format(new Date(lead.createdAt), 'dd/MM/yyyy')}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${status.color} border font-medium text-[10px] py-0.5 shadow-none`}>
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                        <DropdownMenuItem onClick={() => { setSelectedLead(lead); setIsDetailOpen(true) }}>
                                                            <ExternalLink className="h-4 w-4 mr-2" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setSelectedLead(lead); setStatusForm({ status: lead.status, notes: '' }); setIsStatusOpen(true) }}>
                                                            <CheckCircle2 className="h-4 w-4 mr-2" /> Update Status
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setSelectedLead(lead); setIsAssignOpen(true) }}>
                                                            <UserCheck className="h-4 w-4 mr-2" /> Assign Lead
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Detail Modal */}
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <FileText className="h-6 w-6 text-blue-600" />
                                Rental Agreement Detail
                            </DialogTitle>
                        </DialogHeader>

                        {selectedLead && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                                <div className="space-y-6">
                                    <section className="space-y-3">
                                        <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-1 text-slate-400">
                                            <Building2 className="h-4 w-4" /> PROPERTY & RENT
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase text-muted-foreground">Type</p>
                                                <p className="font-semibold text-sm">{selectedLead.propertyType}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-muted-foreground">Rent</p>
                                                <p className="font-bold text-sm text-blue-600">₹{selectedLead.rentAmount}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-muted-foreground">Deposit</p>
                                                <p className="font-semibold text-sm text-blue-600">₹{selectedLead.depositAmount}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-muted-foreground">Duration</p>
                                                <p className="font-semibold text-sm">{selectedLead.durationMonths} Months</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-muted-foreground">Address</p>
                                            <p className="text-sm">{selectedLead.propertyAddress}, {selectedLead.city}, {selectedLead.area}</p>
                                        </div>
                                    </section>

                                    <section className="space-y-3">
                                        <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-1 text-slate-400">
                                            <Users className="h-4 w-4" /> PARTIES INVOLVED
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase text-muted-foreground">Owner</p>
                                                <p className="font-semibold text-sm">{selectedLead.ownerName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-muted-foreground">Tenant</p>
                                                <p className="font-semibold text-sm">{selectedLead.tenantName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase text-muted-foreground">Total Tenants</p>
                                                <p className="font-semibold text-sm">{selectedLead.numberOfTenants}</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-6">
                                    <section className="space-y-3">
                                        <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-1 text-slate-400">
                                            <User className="h-4 w-4" /> APPLICANT INFO
                                        </h3>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl space-y-2">
                                            <p className="font-bold text-sm">{selectedLead.residentName}</p>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-xs text-muted-foreground flex items-center gap-2">
                                                    <Phone className="h-3 w-3" /> {selectedLead.phone}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-2">
                                                    <Mail className="h-3 w-3" /> {selectedLead.email || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="space-y-3">
                                        <h3 className="text-sm font-bold flex items-center gap-2 border-b pb-1 text-slate-400">
                                            <FileText className="h-4 w-4" /> DOCUMENTS
                                        </h3>
                                        {selectedLead.documents && selectedLead.documents.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-2">
                                                {selectedLead.documents.map((doc: any) => (
                                                    <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-lg border bg-white dark:bg-slate-900 shadow-sm group">
                                                        <div className="flex items-center gap-2">
                                                            <div className="p-2 rounded bg-blue-50 text-blue-600">
                                                                <FileText className="h-4 w-4" />
                                                            </div>
                                                            <span className="text-[10px] font-medium max-w-[150px] truncate">{doc.name || 'document'}</span>
                                                        </div>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" asChild>
                                                            <a href={doc.url} target="_blank" rel="noreferrer">
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground italic">No documents uploaded</p>
                                        )}
                                    </section>
                                </div>

                                {selectedLead.remarks && (
                                    <section className="md:col-span-2 space-y-2">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-[10px]">Remarks</h3>
                                        <div className="p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                                            <p className="text-sm italic">{selectedLead.remarks}</p>
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}

                        <DialogFooter className="bg-slate-50 dark:bg-slate-800/50 -mx-6 -mb-6 p-4 px-6 rounded-b-2xl border-t">
                            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close Window</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Status Update Modal */}
                <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
                    <DialogContent className="max-w-md rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Update Status</DialogTitle>
                            <DialogDescription>Update the progress of this rental agreement registration.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={statusForm.status} onValueChange={v => setStatusForm(p => ({ ...p, status: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="New">New Lead</SelectItem>
                                        <SelectItem value="Processing">Processing</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                        <SelectItem value="Rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Notes / Reason</Label>
                                <Textarea
                                    placeholder="Explanation for status change..."
                                    value={statusForm.notes}
                                    onChange={e => setStatusForm(p => ({ ...p, notes: e.target.value }))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsStatusOpen(false)}>Cancel</Button>
                            <Button
                                onClick={() => statusMutation.mutate({ id: selectedLead.id, ...statusForm })}
                                disabled={statusMutation.isPending}
                                className="bg-blue-600 text-white"
                            >
                                {statusMutation.isPending ? 'Updating...' : 'Update Status'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Assignment Modal */}
                <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                    <DialogContent className="max-w-md rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Assign Lead</DialogTitle>
                            <DialogDescription>Assign this request to a team member for processing.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Team Member</Label>
                                <Select value={assignId} onValueChange={setAssignId}>
                                    <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                                    <SelectContent>
                                        {users.map((u: any) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>{u.name} ({u.role})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
                            <Button
                                onClick={() => assignMutation.mutate({ id: selectedLead.id, assignedToId: parseInt(assignId) })}
                                disabled={assignMutation.isPending || !assignId}
                                className="bg-[#1e3a5f] text-white"
                            >
                                {assignMutation.isPending ? 'Assigning...' : 'Assign Lead'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </RoleGuard>
    )
}
