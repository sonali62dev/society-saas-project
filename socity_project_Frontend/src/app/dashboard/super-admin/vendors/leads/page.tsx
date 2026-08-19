'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, Wrench, Clock, CheckCircle2, AlertCircle, ChevronDown, MapPin, Phone, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

/** Derive lead source from inquiry (society/resident/individual) for filter tabs */
function leadSource(inq: any): string {
    if (inq.residentId && inq.societyId) return 'resident'
    if (inq.societyId) return 'society'
    return 'individual'
}

export default function SuperAdminLeadsPage() {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [leadType, setLeadType] = useState<string>('all')
    const [assignInquiry, setAssignInquiry] = useState<any | null>(null)
    const [vendorSearch, setVendorSearch] = useState('')
    const [showAllVendors, setShowAllVendors] = useState(false)
    const [viewUser, setViewUser] = useState<any | null>(null)

    const { data: inquiriesRaw, isLoading } = useQuery<any>({
        queryKey: ['platform-inquiries', 'all'],
        queryFn: async () => {
            const res = await api.get('/services/inquiries', { params: { limit: 200 } })
            const body = res.data
            return Array.isArray(body) ? body : (body?.data ?? [])
        }
    })
    const inquiries = Array.isArray(inquiriesRaw) ? inquiriesRaw : []

    const leadPincode = assignInquiry
        ? (assignInquiry.pincode || assignInquiry.society?.pincode || '').trim()
        : ''

    const { data: vendorsByPincode = [], isLoading: vendorsLoading } = useQuery<any[]>({
        queryKey: ['vendors-by-pincode', leadPincode, showAllVendors],
        queryFn: async () => {
            const usePincode = leadPincode && !showAllVendors
            const res = await api.get('/vendors/all', {
                params: usePincode ? { pincode: leadPincode, limit: 100 } : { limit: 100 }
            })
            const body = res.data
            const list = Array.isArray(body) ? body : (body?.data ?? [])
            return list
        },
        enabled: !!assignInquiry
    })

    const filteredVendorsInDialog = useMemo(() => {
        if (!vendorSearch.trim()) return vendorsByPincode
        const q = vendorSearch.toLowerCase()
        return vendorsByPincode.filter(
            (v: any) =>
                (v.name || '').toLowerCase().includes(q) ||
                (v.serviceType || '').toLowerCase().includes(q) ||
                (v.contact || '').toLowerCase().includes(q) ||
                (v.servicePincodes || '').toLowerCase().includes(q)
        )
    }, [vendorsByPincode, vendorSearch])

    const assignVendorMutation = useMutation({
        mutationFn: async ({ inquiryId, vendorId, vendorName }: { inquiryId: string; vendorId: string; vendorName: string }) => {
            const response = await api.patch(`/services/inquiries/${inquiryId}/assign`, { vendorId, vendorName })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['platform-inquiries'] })
            setAssignInquiry(null)
            setVendorSearch('')
            toast.success(`Vendor assigned successfully!`)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to assign vendor')
        }
    })

    const filteredInquiries = inquiries.filter((inq: any) => {
        const matchesSearch = (inq.residentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (inq.serviceName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (inq.unit || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (inq.phone || '').toLowerCase().includes(searchQuery.toLowerCase())

        const source = leadSource(inq)
        
        let matchesType = true;
        if (leadType === 'all') matchesType = true;
        else if (leadType === 'callback') matchesType = inq.type === 'CALLBACK';
        else if (leadType === 'booking') matchesType = inq.type !== 'CALLBACK';
        else matchesType = source === leadType;

        return matchesSearch && matchesType
    })

    const handleAssignVendor = (inquiryId: string, vendorId: string, vendorName: string) => {
        assignVendorMutation.mutate({ inquiryId, vendorId, vendorName })
    }

    const openAssignDialog = (inq: any) => {
        setAssignInquiry(inq)
        setVendorSearch('')
        setShowAllVendors(false)
    }

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">Pending</Badge>
            case 'booked':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Assigned</Badge>
            case 'contacted':
            case 'confirmed':
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Contacted</Badge>
            case 'done':
            case 'completed':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Done</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-display">Service Leads</h1>
                    <p className="text-gray-500 mt-1 font-medium">Assign and track service requests across the platform</p>
                </div>
            </div>

            <div className="flex flex-col space-y-4">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {['all', 'callback', 'booking', 'society', 'resident', 'individual'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setLeadType(type)}
                            className={`
                                px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 capitalize
                                ${leadType === type
                                    ? 'bg-[#1e3a5f] text-white shadow-lg shadow-blue-500/20 translate-y-[-1px]'
                                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                                }
                            `}
                        >
                            {type === 'all' ? 'All Leads' : type === 'callback' ? 'Callback Requests' : type === 'booking' ? 'Bookings' : type}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search by resident, unit, service or phone..."
                        className="pl-12 h-12 rounded-2xl border-0 shadow-sm bg-white ring-1 ring-black/5"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredInquiries.length === 0 ? (
                    // ... Empty State ...
                    <Card className="p-12 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
                        <AlertCircle className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No leads found</h3>
                        <p className="text-gray-400 mt-2">Any new service requests from residents will appear here.</p>
                    </Card>
                ) : (
                    filteredInquiries.map((inq, index) => (
                        <motion.div
                            key={inq.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5 relative overflow-hidden group">
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${inq.status === 'pending' ? 'bg-yellow-500' : inq.status === 'booked' ? 'bg-blue-500' : 'bg-green-500'}`} />

                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-start gap-5">
                                        {/* ... Icon ... */}
                                        <div className={`p-4 rounded-2xl shrink-0 ${inq.type === 'CALLBACK' ? 'bg-amber-50' : 'bg-gray-50'}`}>
                                            {inq.type === 'CALLBACK' ? (
                                                <Phone className="h-6 w-6 text-amber-500" />
                                            ) : (
                                                <User className="h-6 w-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-gray-900">{inq.residentName}</h3>
                                                
                                                {/* View Profile Button */}
                                                <button 
                                                    onClick={() => setViewUser(inq)}
                                                    className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-colors"
                                                    title="View User Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>

                                                <Badge variant="outline" className="rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                    {inq.unit}
                                                </Badge>
                                                {getStatusBadge(inq.status)}
                                            </div>
                                            {/* ... Rest of details ... */}
                                            <p className="text-sm font-bold text-[#1e3a5f] uppercase tracking-wide flex items-center gap-2">
                                                <Wrench className="h-3.5 w-3.5" />
                                                {inq.serviceName}
                                                <span className="text-gray-300 mx-1">|</span>
                                                <span className={`text-xs font-bold uppercase tracking-wider ${inq.type === 'CALLBACK' ? 'text-amber-600' : 'text-gray-400'}`}>
                                                    {inq.type}
                                                </span>
                                                <>
                                                    <span className="text-gray-300 mx-1">|</span>
                                                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                                                        {leadSource(inq)}
                                                    </Badge>
                                                </>
                                            </p>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-gray-500 font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {new Date(inq.createdAt).toLocaleString()}
                                                </span>
                                                
                                                {/* Role Badge */}
                                                {inq.residentRole && (
                                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-bold uppercase text-[10px]">
                                                        {inq.residentRole}
                                                    </span>
                                                )}

                                                {/* Phone Display */}
                                                {(inq.residentPhone && inq.residentPhone !== '—') && (
                                                    <span className="flex items-center gap-1.5 text-gray-700 font-semibold bg-gray-50 px-2 py-0.5 rounded-md">
                                                        <Phone className="h-3 w-3" />
                                                        {inq.residentPhone}
                                                    </span>
                                                )}

                                                {/* Email Display */}
                                                {(inq.residentEmail && inq.residentEmail !== '—') && (
                                                    <span className="flex items-center gap-1.5 text-gray-600 bg-gray-50 px-2 py-0.5 rounded-md">
                                                        <User className="h-3 w-3" />
                                                        {inq.residentEmail}
                                                    </span>
                                                )}

                                                {inq.paymentStatus === 'PAID' && (
                                                    <span className="flex items-center gap-1.5 text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        PAID
                                                    </span>
                                                )}
                                                {inq.vendorName && (
                                                    <span className="flex items-center gap-1.5 text-blue-600">
                                                        <User className="h-3.5 w-3.5" />
                                                        Assigned to: {inq.vendorName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex items-center gap-3">
                                        {/* ... Actions ... */}
                                        {inq.type === 'CALLBACK' && inq.status !== 'completed' && (
                                            <Button
                                                variant="outline"
                                                className="h-11 px-4 rounded-xl gap-2 font-bold ring-1 ring-amber-500/20 text-amber-700 bg-amber-50 hover:bg-amber-100 border-0"
                                                onClick={() => window.open(`tel:${inq.phone}`)}
                                            >
                                                <Phone className="h-4 w-4" />
                                                Call Now
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            className="h-11 px-4 rounded-xl gap-2 font-bold ring-1 ring-black/5 border-0 hover:bg-gray-50"
                                            disabled={inq.status === 'done'}
                                            onClick={() => openAssignDialog(inq)}
                                        >
                                            {inq.vendorId ? 'Reassign Vendor' : 'Assign Vendor'}
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </div>
                                </div>

                                {inq.notes && (
                                    <div className="mt-4 pt-4 border-t border-gray-50 text-xs font-medium text-gray-400 italic">
                                        &quot; {inq.notes} &quot;
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            {/* User Details Dialog */}
            <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
                <DialogContent className="max-w-md rounded-3xl shadow-2xl border-0 ring-1 ring-black/5">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                             <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                             </div>
                             User Details
                        </DialogTitle>
                    </DialogHeader>
                    {viewUser && (
                        <div className="space-y-4 pt-2">
                            <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</label>
                                    <p className="font-bold text-gray-900 text-lg">{viewUser.residentName}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</label>
                                        <div className="mt-1">
                                            <Badge variant="secondary" className="bg-white border border-gray-200 text-gray-700">
                                                {viewUser.residentRole || leadSource(viewUser).toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unit / Area</label>
                                        <p className="font-medium text-gray-700 mt-1">{viewUser.unit || '—'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Phone className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Phone Number</p>
                                        <p className="font-semibold text-gray-900">{viewUser.residentPhone || viewUser.phone || '—'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <User className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Email Address</p>
                                        <p className="font-semibold text-gray-900">{viewUser.residentEmail || '—'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                                <Button className="w-full rounded-xl font-bold" onClick={() => setViewUser(null)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Assign Vendor Dialog - Existing ... */}
            <Dialog open={!!assignInquiry} onOpenChange={(open) => !open && setAssignInquiry(null)}>
                {/* ... existing dialog content ... */}
                <DialogContent className="max-w-lg rounded-3xl shadow-2xl border-0 ring-1 ring-black/5">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-900">Assign vendor to lead</DialogTitle>
                        <DialogDescription>
                            {assignInquiry && (
                                <span className="flex items-center gap-2 mt-2 text-sm">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    Customer PIN code: <strong>{leadPincode || 'Not set'}</strong>
                                    {!leadPincode && (
                                        <span className="text-gray-400"> (All vendors shown. Add PIN on lead or society to filter by area.)</span>
                                    )}
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    {leadPincode && (
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-600">
                                {showAllVendors
                                    ? 'Showing all vendors (PIN filter off). You can assign any vendor.'
                                    : `Vendors registered for this area (PIN ${leadPincode}) are listed below. You can search by name.`}
                            </p>
                            <Button
                                type="button"
                                variant={showAllVendors ? 'secondary' : 'outline'}
                                size="sm"
                                className="w-fit rounded-xl"
                                onClick={() => setShowAllVendors(!showAllVendors)}
                            >
                                {showAllVendors ? 'Filter by PIN ' + leadPincode : 'Show all vendors (ignore PIN)'}
                            </Button>
                        </div>
                    )}
                    {!leadPincode && (
                        <p className="text-sm text-gray-600">All vendors are listed below. You can search by name.</p>
                    )}
                    <div className="space-y-3 pt-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search vendors by name or service..."
                                className="pl-10 rounded-xl"
                                value={vendorSearch}
                                onChange={(e) => setVendorSearch(e.target.value)}
                            />
                        </div>
                        <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1">
                            {vendorsLoading ? (
                                <div className="py-8 text-center text-gray-500 text-sm">Loading vendors...</div>
                            ) : filteredVendorsInDialog.length === 0 ? (
                                <div className="py-8 text-center text-gray-500 text-sm space-y-2">
                                    <p>{leadPincode && !showAllVendors ? `No vendors registered for PIN ${leadPincode}.` : 'No vendors found.'}</p>
                                    {leadPincode && !showAllVendors && (
                                        <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={() => setShowAllVendors(true)}>
                                            Show all vendors (assign from any)
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                filteredVendorsInDialog.map((v: any) => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => assignInquiry && handleAssignVendor(assignInquiry.id, String(v.id), v.name)}
                                        disabled={assignVendorMutation.isPending}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 text-left transition-colors"
                                    >
                                        <div className="p-2 rounded-lg bg-gray-100">
                                            <Wrench className="h-4 w-4 text-gray-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{v.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{v.serviceType} {v.servicePincodes ? `• PIN: ${v.servicePincodes}` : ''}</p>
                                        </div>
                                        <span className="text-xs text-blue-600 font-medium">Assign</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
