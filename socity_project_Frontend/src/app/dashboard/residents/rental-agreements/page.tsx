'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText, Plus, Home, MapPin, IndianRupee, Calendar, Users,
    ChevronRight, Clock, CheckCircle2, XCircle, Trash2,
    Upload, X, Search, Filter, Info, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rentalAgreementService } from '@/services/rental-agreement.service'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { RoleGuard } from '@/components/auth/role-guard'
import { format } from 'date-fns'

// --- Constants ---
const PROPERTY_TYPES = ['Flat', 'Shop', 'PG', 'Office', 'Other']
const AGREEMENT_TYPES = ['New', 'Renewal']

const statusConfig: Record<string, { icon: any, color: string, bg: string, badge: string }> = {
    'New': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-600 text-white' },
    'Processing': { icon: Info, color: 'text-amber-600', bg: 'bg-amber-50', badge: 'bg-amber-600 text-white' },
    'Completed': { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-600 text-white' },
    'Rejected': { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-600 text-white' },
}

const defaultForm = {
    propertyType: '',
    propertyAddress: '',
    city: '',
    area: '',
    agreementType: 'New',
    rentAmount: '',
    depositAmount: '',
    durationMonths: '11',
    startDate: '',
    ownerName: '',
    tenantName: '',
    numberOfTenants: '1',
    remarks: '',
}

export default function RentalAgreementsPage() {
    const { user } = useAuthStore()
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form, setForm] = useState(defaultForm)
    const [files, setFiles] = useState<File[]>([])
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')

    const f = (field: string, val: string) => setForm(p => ({ ...p, [field]: val }))

    const { data, isLoading } = useQuery({
        queryKey: ['rentalAgreements'],
        queryFn: () => rentalAgreementService.list(),
    })

    const createMutation = useMutation({
        mutationFn: rentalAgreementService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rentalAgreements'] })
            toast.success('Rental agreement enquiry submitted successfully!')
            setIsModalOpen(false)
            setForm(defaultForm)
            setFiles([])
        },
        onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to submit'),
    })

    const deleteMutation = useMutation({
        mutationFn: rentalAgreementService.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rentalAgreements'] })
            toast.success('Enquiry deleted')
        },
        onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to delete'),
    })

    const handleSubmit = () => {
        if (!form.propertyType || !form.propertyAddress || !form.city || !form.area || !form.ownerName || !form.tenantName || !form.startDate) {
            toast.error('Please fill in all required fields')
            return
        }

        const formData = new FormData()
        Object.keys(form).forEach(key => formData.append(key, (form as any)[key]))
        files.forEach(file => formData.append('documents', file))

        createMutation.mutate(formData)
    }

    const leads: any[] = data?.data || []
    const filtered = leads.filter(l => {
        const matchSearch = l.propertyAddress.toLowerCase().includes(search.toLowerCase()) ||
            l.city.toLowerCase().includes(search.toLowerCase()) ||
            l.ownerName.toLowerCase().includes(search.toLowerCase())
        const matchStatus = filterStatus === 'all' || l.status === filterStatus
        return matchSearch && matchStatus
    })

    return (
        <RoleGuard allowedRoles={['resident', 'individual']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1e3a5f] dark:text-white">Rental Agreements</h1>
                            <p className="text-muted-foreground text-sm">Register and track your rental agreement requests</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white gap-2 shadow-lg shadow-indigo-500/25"
                    >
                        <Plus className="h-4 w-4" />
                        New Agreement Enquiry
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Search by address, owner, city..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-40">
                            <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
                            <SelectValue placeholder="Status" />
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

                {/* Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed">
                        <div className="p-5 bg-indigo-50 rounded-full mb-4">
                            <FileText className="h-12 w-12 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1 text-[#1e3a5f] dark:text-white">No rental agreement requests</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mb-6">
                            Submit your first rental agreement registration enquiry to get started.
                        </p>
                        <Button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white gap-2">
                            <Plus className="h-4 w-4" /> Submit Enquiry
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(lead => {
                            const status = statusConfig[lead.status] || statusConfig['New']
                            const StatusIcon = status.icon

                            return (
                                <motion.div key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                    <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                                        <CardContent className="p-0">
                                            <div className="p-4 border-b bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                                                <Badge className={`${status.badge} border-0`}>
                                                    <StatusIcon className="h-3 w-3 mr-1" />
                                                    {lead.status}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                                    {format(new Date(lead.createdAt), 'dd MMM yyyy')}
                                                </span>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <div>
                                                    <h3 className="font-bold text-[#1e3a5f] dark:text-white line-clamp-1">{lead.ownerName} & {lead.tenantName}</h3>
                                                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                                                        <MapPin className="h-3 w-3 mr-1 shrink-0" />
                                                        {lead.area}, {lead.city}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                                                        <IndianRupee className="h-3.5 w-3.5 text-indigo-500" />
                                                        <div>
                                                            <p className="text-[10px] text-muted-foreground leading-none">Rent</p>
                                                            <p className="font-bold">₹{lead.rentAmount}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                                                        <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                                        <div>
                                                            <p className="text-[10px] text-muted-foreground leading-none">Duration</p>
                                                            <p className="font-bold">{lead.durationMonths} Mon</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                                                        <span className="text-xs font-medium">{lead.propertyType}</span>
                                                    </div>
                                                    {lead.status === 'New' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => {
                                                                if (confirm('Delete this request?')) deleteMutation.mutate(lead.id)
                                                            }}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                )}

                {/* Submit Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <FileText className="h-6 w-6 text-indigo-600" />
                                Rental Agreement Enquiry
                            </DialogTitle>
                            <DialogDescription>
                                Provide property and agreement details to register your request.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            {/* Property Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Home className="h-4 w-4 text-indigo-500" /> Property Details
                                </h3>
                                <div className="space-y-2">
                                    <Label>Property Type <span className="text-red-500">*</span></Label>
                                    <Select value={form.propertyType} onValueChange={v => f('propertyType', v)}>
                                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                        <SelectContent>
                                            {PROPERTY_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Full Address <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        placeholder="Complete address of the rental property"
                                        value={form.propertyAddress}
                                        onChange={e => f('propertyAddress', e.target.value)}
                                        className="resize-none"
                                        rows={2}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>City <span className="text-red-500">*</span></Label>
                                        <Input value={form.city} onChange={e => f('city', e.target.value)} placeholder="City" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Area <span className="text-red-500">*</span></Label>
                                        <Input value={form.area} onChange={e => f('area', e.target.value)} placeholder="Locality" />
                                    </div>
                                </div>
                            </div>

                            {/* Agreement Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-indigo-500" /> Agreement Details
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>Type <span className="text-red-500">*</span></Label>
                                        <Select value={form.agreementType} onValueChange={v => f('agreementType', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {AGREEMENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Start Date <span className="text-red-500">*</span></Label>
                                        <Input type="date" value={form.startDate} onChange={e => f('startDate', e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>Rent (₹) <span className="text-red-500">*</span></Label>
                                        <Input type="number" value={form.rentAmount} onChange={e => f('rentAmount', e.target.value)} placeholder="Monthly" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Deposit (₹) <span className="text-red-500">*</span></Label>
                                        <Input type="number" value={form.depositAmount} onChange={e => f('depositAmount', e.target.value)} placeholder="Security" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label>Duration (Months)</Label>
                                        <Input type="number" value={form.durationMonths} onChange={e => f('durationMonths', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>No. of Tenants</Label>
                                        <Input type="number" value={form.numberOfTenants} onChange={e => f('numberOfTenants', e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            {/* People Info */}
                            <div className="space-y-4 md:col-span-2 border-t pt-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Users className="h-4 w-4 text-indigo-500" /> Owner & Tenant Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Owner Full Name <span className="text-red-500">*</span></Label>
                                        <Input value={form.ownerName} onChange={e => f('ownerName', e.target.value)} placeholder="As per ID" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Primary Tenant Name <span className="text-red-500">*</span></Label>
                                        <Input value={form.tenantName} onChange={e => f('tenantName', e.target.value)} placeholder="As per ID" />
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="space-y-4 md:col-span-2 border-t pt-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Upload className="h-4 w-4 text-indigo-500" /> Documents
                                </h3>
                                <p className="text-[10px] text-muted-foreground -mt-3">Upload ID proofs, previous agreements or light bills if available.</p>
                                <div className="grid grid-cols-1 gap-4">
                                    <div
                                        className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer transition-colors"
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                    >
                                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                        <p className="text-sm text-slate-600 font-medium">Click to select files</p>
                                        <p className="text-[10px] text-slate-400">PDF, PNG, JPG (Max 5MB per file)</p>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => {
                                                const selected = Array.from(e.target.files || [])
                                                setFiles(prev => [...prev, ...selected])
                                            }}
                                        />
                                    </div>
                                    {files.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {files.map((file, i) => (
                                                <Badge key={i} variant="secondary" className="gap-1.5 py-1.5 px-3">
                                                    <span className="max-w-[150px] truncate">{file.name}</span>
                                                    <X
                                                        className="h-3 w-3 cursor-pointer hover:text-red-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setFiles(prev => prev.filter((_, idx) => idx !== i))
                                                        }}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Additional Remarks</Label>
                                    <Textarea
                                        placeholder="Any specific instructions or requirements..."
                                        value={form.remarks}
                                        onChange={e => f('remarks', e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="bg-slate-50 dark:bg-slate-800/50 -mx-6 -mb-6 p-4 px-6 rounded-b-2xl border-t">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={createMutation.isPending}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                            >
                                {createMutation.isPending ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </RoleGuard>
    )
}
