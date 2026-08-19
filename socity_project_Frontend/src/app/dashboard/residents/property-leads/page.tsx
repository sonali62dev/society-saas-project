'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Building2, Plus, Home, Store, Users, Layers, Warehouse, TrendingUp,
    Tag, MapPin, IndianRupee, BedDouble, Layers3,
    Phone, Mail, Upload, X, Eye, Pencil, Trash2,
    CheckCircle2, Clock, XCircle, ChevronRight,
    Image as ImageIcon, Search, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyLeadService } from '@/services/property-lead.service'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { RoleGuard } from '@/components/auth/role-guard'

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = ['Flat', 'Shop', 'PG', 'LAND', 'Gala', 'Investment']
const ACTION_TYPES = ['Buy', 'Sell', 'Rent', 'Investment']

const categoryIcons: Record<string, React.ElementType> = {
    Flat: Home,
    Shop: Store,
    PG: Users,
    LAND: Layers,
    Gala: Warehouse,
    'Investment': TrendingUp,
}

const actionColors: Record<string, string> = {
    Buy: 'bg-blue-100 text-blue-700',
    Sell: 'bg-green-100 text-green-700',
    Rent: 'bg-amber-100 text-amber-700',
    Investment: 'bg-purple-100 text-purple-700',
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string; badge: string }> = {
    'New Lead': {
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        badge: 'bg-blue-600 text-white border-transparent shadow-sm'
    },
    Contacted: {
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-50',
        badge: 'bg-emerald-600 text-white border-transparent shadow-sm'
    },
    Closed: {
        icon: XCircle,
        color: 'text-gray-500',
        bg: 'bg-gray-50',
        badge: 'bg-gray-600 text-white border-transparent shadow-sm'
    },
}

// ─── Form default state ───────────────────────────────────────────────────────

const defaultForm = {
    title: '',
    description: '',
    category: '',
    actionType: '',
    city: '',
    area: '',
    address: '',
    size: '',
    budget: '',
    bedrooms: '',
    floor: '',
    phone: '',
    email: '',
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────

function PropertyLeadModal({
    open, onOpenChange, editLead, userPhone, userEmail,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    editLead?: any
    userPhone?: string
    userEmail?: string
}) {
    const queryClient = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [form, setForm] = useState({
        ...defaultForm,
        category: 'Flat',
        actionType: 'Sell',
        phone: userPhone ?? '',
        email: userEmail ?? '',
    })
    const [previewImages, setPreviewImages] = useState<string[]>([])

    useEffect(() => {
        if (open) {
            if (editLead) {
                setForm({
                    title: editLead.title ?? '',
                    description: editLead.description ?? '',
                    category: editLead.category ?? 'Flat',
                    actionType: editLead.actionType ?? 'Sell',
                    city: editLead.city ?? '',
                    area: editLead.area ?? '',
                    address: editLead.address ?? '',
                    size: editLead.size?.toString() ?? '',
                    budget: editLead.budget?.toString() ?? '',
                    bedrooms: editLead.bedrooms?.toString() ?? '',
                    floor: editLead.floor?.toString() ?? '',
                    phone: editLead.phone ?? userPhone ?? '',
                    email: editLead.email ?? userEmail ?? '',
                })
            } else {
                setForm({
                    ...defaultForm,
                    category: 'Flat',
                    actionType: 'Sell',
                    phone: userPhone ?? '',
                    email: userEmail ?? '',
                })
            }
            setPreviewImages([])
        }
    }, [open, editLead, userPhone, userEmail])

    const f = (field: string, val: string) => setForm(p => ({ ...p, [field]: val }))

    const createMutation = useMutation({
        mutationFn: propertyLeadService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['propertyLeads'] })
            toast.success('Property lead submitted successfully!')
            onOpenChange(false)
            setForm({ ...defaultForm, category: 'Flat', actionType: 'Sell', phone: userPhone ?? '', email: userEmail ?? '' })
            setPreviewImages([])
        },
        onError: (err: any) => toast.error(err.response?.data?.error || err.message || 'Failed to submit'),
    })

    const updateMutation = useMutation({
        mutationFn: (data: any) => propertyLeadService.update(editLead.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['propertyLeads'] })
            toast.success('Property lead updated!')
            onOpenChange(false)
        },
        onError: (err: any) => toast.error(err.response?.data?.error || err.message || 'Failed to update'),
    })

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = (ev) => {
                setPreviewImages(prev => [...prev, ev.target?.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index: number) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = () => {
        if (!form.title || !form.city || !form.area) {
            toast.error('Please fill in Property Title, City, and Area')
            return
        }
        const payload = {
            ...form,
            category: form.category || 'Flat',
            actionType: form.actionType || 'Sell',
            phone: form.phone || userPhone || '9876543210',
            size: form.size ? parseFloat(form.size) : undefined,
            budget: form.budget ? parseFloat(form.budget) : undefined,
            bedrooms: form.bedrooms ? parseInt(form.bedrooms) : undefined,
            floor: form.floor ? parseInt(form.floor) : undefined,
            images: previewImages.length > 0 ? previewImages : undefined,
        }
        if (editLead) {
            updateMutation.mutate(payload)
        } else {
            createMutation.mutate(payload as any)
        }
    }

    const isPending = createMutation.isPending || updateMutation.isPending

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        {editLead ? 'Edit Property Listing' : 'Add Property / Enquiry'}
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details below to list your property or post an enquiry
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    {/* Basic Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">
                            Basic Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Property Category <span className="text-red-500">*</span></Label>
                                <Select value={form.category} onValueChange={v => f('category', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(c => (
                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Action Type <span className="text-red-500">*</span></Label>
                                <Select value={form.actionType} onValueChange={v => f('actionType', v)}>
                                    <SelectTrigger><SelectValue placeholder="Buy / Sell / Rent" /></SelectTrigger>
                                    <SelectContent>
                                        {ACTION_TYPES.map(a => (
                                            <SelectItem key={a} value={a}>{a}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Property Title <span className="text-red-500">*</span></Label>
                            <Input placeholder="e.g. 3BHK Flat for Sale in Andheri West" value={form.title} onChange={e => f('title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea rows={3} placeholder="Describe the property, key features, highlights..." value={form.description} onChange={e => f('description', e.target.value)} />
                        </div>
                    </div>

                    {/* Location Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">
                            Location Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>City <span className="text-red-500">*</span></Label>
                                <Input placeholder="e.g. Mumbai" value={form.city} onChange={e => f('city', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Area / Locality <span className="text-red-500">*</span></Label>
                                <Input placeholder="e.g. Andheri West" value={form.area} onChange={e => f('area', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Full Address</Label>
                            <Input placeholder="Street address, landmark..." value={form.address} onChange={e => f('address', e.target.value)} />
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">
                            Property Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Area (sq ft)</Label>
                                <Input type="number" placeholder="e.g. 1200" value={form.size} onChange={e => f('size', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Budget / Expected Price (₹)</Label>
                                <Input type="number" placeholder="e.g. 8500000" value={form.budget} onChange={e => f('budget', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Bedrooms (optional)</Label>
                                <Input type="number" placeholder="e.g. 3" value={form.bedrooms} onChange={e => f('bedrooms', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Floor (optional)</Label>
                                <Input type="number" placeholder="e.g. 5" value={form.floor} onChange={e => f('floor', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">
                            Contact Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Phone Number <span className="text-red-500">*</span></Label>
                                <Input placeholder="e.g. 9876543210" value={form.phone} onChange={e => f('phone', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" placeholder="your@email.com" value={form.email} onChange={e => f('email', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Media Upload */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-1">
                            Property Images
                        </h3>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-dashed h-20 flex-col gap-2 text-muted-foreground hover:text-foreground hover:border-blue-400"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="h-5 w-5" />
                            <span className="text-sm">Click to upload images (multiple)</span>
                        </Button>
                        {previewImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-3">
                                {previewImages.map((img, i) => (
                                    <div key={i} className="relative group rounded-lg overflow-hidden aspect-square border shadow-sm">
                                        <img src={img} alt={`preview-${i}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Existing images in edit mode */}
                        {editLead?.media?.length > 0 && (
                            <div className="grid grid-cols-4 gap-3">
                                {editLead.media.map((m: any) => (
                                    <div key={m.id} className="relative rounded-lg overflow-hidden aspect-square border shadow-sm">
                                        <img src={m.url} alt="property" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="border-t pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2"
                    >
                        {isPending ? 'Submitting...' : (editLead ? 'Update Listing' : 'Submit Enquiry')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Lead Card ────────────────────────────────────────────────────────────────

function LeadCard({ lead, onEdit, onDelete }: { lead: any; onEdit: (l: any) => void; onDelete: (id: number) => void }) {
    const Icon = categoryIcons[lead.category] || Building2
    const status = statusConfig[lead.status] || statusConfig['New Lead']
    const StatusIcon = status.icon

    const formatBudget = (n: number) => {
        if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`
        if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`
        return `₹${n.toLocaleString()}`
    }

    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}>
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
                {/* Image or gradient header */}
                <div className="relative h-40 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 overflow-hidden">
                    {lead.media?.[0]?.url ? (
                        <img src={lead.media[0].url} alt={lead.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <Icon className="h-16 w-16 text-white/40" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                        <Badge className={`${actionColors[lead.actionType] || 'bg-gray-100 text-gray-700'} border-0 font-semibold`}>
                            {lead.actionType}
                        </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                        <Badge className={`${status.badge} font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 border-0`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {lead.status}
                        </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-bold text-lg leading-tight line-clamp-1 drop-shadow-md">{lead.title}</p>
                    </div>
                </div>

                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex flex-col">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Icon className="h-3.5 w-3.5" />
                                {lead.category}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${status.color} mt-0.5`}>
                                Status: {lead.status}
                            </span>
                        </div>
                        {lead.budget && (
                            <div className="text-right">
                                <span className="font-bold text-blue-600 text-base block leading-none">
                                    {formatBudget(lead.budget)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{lead.area}, {lead.city}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {lead.size && <span className="flex items-center gap-1"><Layers3 className="h-3 w-3" />{lead.size} sqft</span>}
                        {lead.bedrooms && <span className="flex items-center gap-1"><BedDouble className="h-3 w-3" />{lead.bedrooms} BHK</span>}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t">
                        <Button size="sm" variant="outline" className="flex-1 gap-1 h-8 text-xs" onClick={() => onEdit(lead)}>
                            <Pencil className="h-3 w-3" /> Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 gap-1 h-8 text-xs text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 hover:bg-red-50" onClick={() => onDelete(lead.id)}>
                            <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PropertyLeadsPage() {
    const { user } = useAuthStore()
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editLead, setEditLead] = useState<any>(null)
    const [search, setSearch] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [filterAction, setFilterAction] = useState('all')

    const { data, isLoading } = useQuery({
        queryKey: ['propertyLeads'],
        queryFn: () => propertyLeadService.list(),
    })

    const deleteMutation = useMutation({
        mutationFn: propertyLeadService.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['propertyLeads'] })
            toast.success('Property lead deleted')
        },
        onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to delete'),
    })

    const leads: any[] = data?.data || []

    const filtered = leads.filter(l => {
        const matchSearch = !search ||
            l.title.toLowerCase().includes(search.toLowerCase()) ||
            l.area.toLowerCase().includes(search.toLowerCase()) ||
            l.city.toLowerCase().includes(search.toLowerCase())
        const matchCat = filterCategory === 'all' || l.category === filterCategory
        const matchAction = filterAction === 'all' || l.actionType === filterAction
        return matchSearch && matchCat && matchAction
    })

    const handleEdit = (lead: any) => {
        setEditLead(lead)
        setIsModalOpen(true)
    }

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this listing?')) {
            deleteMutation.mutate(id)
        }
    }

    const openAdd = () => {
        setEditLead(null)
        setIsModalOpen(true)
    }

    const stats = {
        total: leads.length,
        newLeads: leads.filter(l => l.status === 'New Lead').length,
        contacted: leads.filter(l => l.status === 'Contacted').length,
        closed: leads.filter(l => l.status === 'Closed').length,
    }

    return (
        <RoleGuard allowedRoles={['resident', 'admin', 'super_admin', 'committee', 'individual']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1e3a5f] dark:text-white">Property / Investment</h1>
                            <p className="text-muted-foreground text-sm">Post and manage your property listings & enquiries</p>
                        </div>
                    </div>
                    <Button
                        onClick={openAdd}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 shadow-lg shadow-blue-500/25"
                    >
                        <Plus className="h-4 w-4" />
                        Add Property / Enquiry
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Listings', value: stats.total, color: 'from-blue-500 to-indigo-500' },
                        { label: 'New Leads', value: stats.newLeads, color: 'from-sky-500 to-blue-500' },
                        { label: 'Contacted', value: stats.contacted, color: 'from-emerald-500 to-green-500' },
                        { label: 'Closed', value: stats.closed, color: 'from-gray-400 to-slate-500' },
                    ].map(s => (
                        <Card key={s.label} className="border-0 shadow-md overflow-hidden">
                            <CardContent className="p-4 flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${s.color} text-white text-2xl font-bold min-w-[2.5rem] text-center`}>
                                    {isLoading ? <Skeleton className="h-7 w-7 rounded" /> : s.value}
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{s.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Search + Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Search by title, area, city..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-40">
                            <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filterAction} onValueChange={setFilterAction}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            {ACTION_TYPES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {/* Listings Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 rounded-xl" />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="p-5 bg-blue-50 rounded-full mb-4">
                            <Building2 className="h-12 w-12 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">No property listings yet</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mb-4">
                            Add your first property listing or enquiry to get started.
                        </p>
                        <Button onClick={openAdd} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white gap-2">
                            <Plus className="h-4 w-4" /> Add First Listing
                        </Button>
                    </div>
                ) : (
                    <AnimatePresence>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map(lead => (
                                <LeadCard key={lead.id} lead={lead} onEdit={handleEdit} onDelete={handleDelete} />
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>

            {/* Add/Edit Modal */}
            <PropertyLeadModal
                open={isModalOpen}
                onOpenChange={v => { setIsModalOpen(v); if (!v) setEditLead(null) }}
                editLead={editLead}
                userPhone={user?.phone}
                userEmail={user?.email}
            />
        </RoleGuard>
    )
}
