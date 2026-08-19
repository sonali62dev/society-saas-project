'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, User, Wrench, Clock, AlertCircle, Building, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useServiceStore } from '@/lib/stores/service-store'

export default function AdminVendorServicesPage() {
    const { inquiries } = useServiceStore()
    const [searchQuery, setSearchQuery] = useState('')

    // Filter for Admin-managed vendors (IDs that don't start with 'v-plat-')
    const adminVendorServices = inquiries.filter(inq =>
        inq.vendorId &&
        !inq.vendorId.startsWith('v-plat-') &&
        (inq.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inq.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inq.vendorName?.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">Pending</Badge>
            case 'booked':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Assigned</Badge>
            case 'confirmed':
                return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">Confirmed</Badge>
            case 'done':
            case 'completed':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Completed</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-display">Admin Vendor Services</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Read-only monitoring of services managed by Society Admins</p>
                </div>
                <Badge variant="outline" className="h-fit py-1.5 px-3 rounded-xl border-blue-200 bg-blue-50 text-blue-700 gap-1.5 font-bold">
                    <ShieldCheck className="h-4 w-4" />
                    Monitoring Mode
                </Badge>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    placeholder="Search by vendor, resident or service..."
                    className="pl-12 h-12 rounded-2xl border-0 shadow-sm bg-white ring-1 ring-black/5"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {adminVendorServices.length === 0 ? (
                    <Card className="p-12 text-center border-2 border-dashed border-gray-100 rounded-[40px]">
                        <AlertCircle className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No services found</h3>
                        <p className="text-gray-400 mt-2">Services performed by Admin-managed vendors will appear here.</p>
                    </Card>
                ) : (
                    adminVendorServices.map((inq, index) => (
                        <motion.div
                            key={inq.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5 relative overflow-hidden">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-5">
                                            <div className="p-4 rounded-2xl bg-blue-50 shrink-0">
                                                <Building className="h-6 w-6 text-blue-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs font-black uppercase tracking-widest text-blue-600/60">Managed By</p>
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 font-bold">
                                                        Royal Residency Admin
                                                    </Badge>
                                                </div>
                                                <h3 className="font-bold text-xl text-gray-900">
                                                    {inq.vendorName || 'Independent Vendor'}
                                                </h3>
                                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2">
                                                    <Wrench className="h-3.5 w-3.5" />
                                                    {inq.serviceName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {getStatusBadge(inq.status)}
                                            <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                <Clock className="h-3.5 w-3.5" />
                                                {new Date(inq.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-gray-50">
                                                <User className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Resident</p>
                                                <p className="text-sm font-bold text-gray-700">{inq.residentName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-gray-50">
                                                <Building className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-tighter">Location</p>
                                                <p className="text-sm font-bold text-gray-700">{inq.unit}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
