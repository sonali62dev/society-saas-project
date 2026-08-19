'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Users, Plus, Building2, Star, Mail, Phone, ExternalLink, MoreVertical, Trash2, Ban, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { MapPin, User, Calendar, Shield } from 'lucide-react'

export default function SuperAdminVendorsPage() {
    const queryClient = useQueryClient()
    const [selectedVendor, setSelectedVendor] = useState<any>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit] = useState(10)

    const { data: response, isLoading } = useQuery<any>({
        queryKey: ['super-admin-vendors', page, limit],
        queryFn: async () => {
            const response = await api.get('/vendors/all', {
                params: { page, limit }
            })
            return response.data
        }
    })

    const vendors = response?.data || []
    const meta = response?.meta || { total: 0, totalPages: 0 }

    const { data: stats } = useQuery({
        queryKey: ['vendor-stats'],
        queryFn: async () => {
            const response = await api.get('/vendors/stats')
            return response.data
        }
    })

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            const response = await api.patch(`/vendors/${id}/status`, { status })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['super-admin-vendors'] })
            queryClient.invalidateQueries({ queryKey: ['vendor-stats'] })
            toast.success('Vendor status updated successfully')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update status')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete(`/vendors/${id}`)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['super-admin-vendors'] })
            queryClient.invalidateQueries({ queryKey: ['vendor-stats'] })
            toast.success('Vendor deleted successfully')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to delete vendor')
        }
    })

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
            case 'pending':
                return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Pending</Badge>
            case 'suspended':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Suspended</Badge>
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-display">Vendor Management</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage platform-owned vendors and their assignments</p>
                </div>
                <Link href="/dashboard/super-admin/vendors/new">
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl px-6 shadow-lg shadow-purple-200 transition-all hover:scale-105 active:scale-95">
                        <Plus className="h-5 w-5 mr-2" />
                        Add Platform Vendor
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Platform Vendors</p>
                            <p className="text-3xl font-black text-gray-900">{stats?.totalVendors || 0}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-teal-50 text-teal-600">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Society Connections</p>
                            <p className="text-3xl font-black text-gray-900">{stats?.societyConnections || 0}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                            <Star className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg. Partner Rating</p>
                            <p className="text-3xl font-black text-gray-900">{stats?.avgPartnerRating || '4.8'}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="border-0 shadow-sm bg-white rounded-[40px] ring-1 ring-black/5 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Platform Vendors List</h2>
                    <Badge variant="outline" className="rounded-full px-4 py-1 font-bold text-xs">SUPER ADMIN OWNED</Badge>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor Details</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Info</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Society</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {vendors.map((vendor: any, index: number) => (
                                <motion.tr
                                    key={vendor.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="font-bold text-gray-900">{vendor.name}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">ID: {vendor.id}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge variant="secondary" className="capitalize bg-purple-50 text-purple-700 border-purple-100">
                                            {vendor.serviceType}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="h-3 w-3" /> {vendor.email || 'N/A'}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="h-3 w-3" /> {vendor.contact || 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-xs font-bold text-gray-600">
                                            {vendor.society?.name || 'Platform'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        {getStatusBadge(vendor.status)}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => {
                                                    setSelectedVendor(vendor);
                                                    setIsDetailsOpen(true);
                                                }}>
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                {vendor.status?.toUpperCase() !== 'ACTIVE' && (
                                                    <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: vendor.id, status: 'ACTIVE' })}>
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Activate
                                                    </DropdownMenuItem>
                                                )}
                                                {vendor.status?.toUpperCase() !== 'SUSPENDED' && (
                                                    <DropdownMenuItem className="text-red-600" onClick={() => updateStatusMutation.mutate({ id: vendor.id, status: 'SUSPENDED' })}>
                                                        <Ban className="h-4 w-4 mr-2" />
                                                        Suspend
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="text-red-100 bg-red-600 hover:bg-red-700" onClick={() => {
                                                    if (confirm('Are you sure you want to delete this vendor?')) {
                                                        deleteMutation.mutate(vendor.id)
                                                    }
                                                }}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Vendor
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                 <div className="p-6 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-bold">{(page - 1) * limit + 1}</span> to <span className="font-bold">{Math.min(page * limit, meta.total)}</span> of <span className="font-bold">{meta.total}</span> vendors
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="rounded-xl"
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                                let p = i + 1;
                                if (meta.totalPages > 5 && page > 3) {
                                  p = page - 2 + i;
                                }
                                if (p <= meta.totalPages) {
                                return (
                                <Button
                                    key={p}
                                    variant={page === p ? 'default' : 'outline'}
                                    size="sm"
                                    className={`w-8 rounded-lg ${page === p ? 'bg-purple-600 text-white' : ''}`}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </Button>
                                )
                                }
                                return null;
                            })}
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                            disabled={page === meta.totalPages}
                            className="rounded-xl"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl rounded-[32px] overflow-hidden p-0 border-0 shadow-2xl">
                    {selectedVendor && (
                        <div className="flex flex-col">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                        <Building2 className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold font-display">{selectedVendor.name}</h2>
                                        <div className="flex items-center gap-2 mt-1 opacity-80">
                                            <Badge variant="outline" className="border-white/20 text-white bg-white/5 capitalize">
                                                {selectedVendor.serviceType}
                                            </Badge>
                                            <Badge variant="outline" className="border-white/20 text-white bg-white/5">
                                                ID: {selectedVendor.id}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-8 right-8">
                                    {getStatusBadge(selectedVendor.status)}
                                </div>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Contact Information</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 group">
                                                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
                                                    <Mail className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Email Address</p>
                                                    <p className="text-sm font-bold text-gray-900">{selectedVendor.email || 'Not Provided'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 group">
                                                <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-100">
                                                    <Phone className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Phone Number</p>
                                                    <p className="text-sm font-bold text-gray-900">{selectedVendor.contact || 'Not Provided'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 group">
                                                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-100">
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Office Address</p>
                                                    <p className="text-sm font-bold text-gray-900">{selectedVendor.address || 'Not Provided'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Platform Details</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 group">
                                                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                                                    <Shield className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Assignment</p>
                                                    <p className="text-sm font-bold text-gray-900">{selectedVendor.society?.name || 'Platform-Wide Vendor'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 group">
                                                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                                                    <Calendar className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Joined Date</p>
                                                    <p className="text-sm font-bold text-gray-900">{new Date(selectedVendor.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 group">
                                                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                                                    <Star className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Partner Rating</p>
                                                    <div className="flex items-center gap-1">
                                                        <p className="text-sm font-bold text-gray-900">4.8</p>
                                                        <div className="flex items-center">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star key={star} className={`h-3 w-3 ${star <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                                <Button 
                                    variant="outline" 
                                    className="rounded-2xl border-gray-200 hover:bg-gray-100"
                                    onClick={() => setIsDetailsOpen(false)}
                                >
                                    Close
                                </Button>
                                <Button 
                                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl"
                                    onClick={() => {
                                        setIsDetailsOpen(false);
                                        // Potential edit logic here
                                    }}
                                >
                                    <Star className="h-4 w-4 mr-2" />
                                    Manage Vendor
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
