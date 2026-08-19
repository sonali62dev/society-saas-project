'use client'

import { motion } from 'framer-motion'
import { CreditCard, TrendingUp, Wallet, ArrowUpRight, History, Plus, Save, Building2, User, IndianRupee, Percent, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export default function VendorPaymentsPage() {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({
        vendorId: '',
        vendorName: '',
        societyId: '',
        societyName: '',
        commissionPercent: '',
        dealValue: '',
        payableAmount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        remarks: ''
    })

    const { data: payouts = [], isLoading } = useQuery<any[]>({
        queryKey: ['vendor-payouts'],
        queryFn: async () => {
            const response = await api.get('/vendor-payouts')
            return response.data
        }
    })

    const { data: stats } = useQuery({
        queryKey: ['payout-stats'],
        queryFn: async () => {
            const response = await api.get('/vendor-payouts/stats')
            return response.data
        }
    })

    const { data: vendorsRaw } = useQuery({
        queryKey: ['super-admin-vendors'],
        queryFn: async () => {
            const response = await api.get('/vendors/all')
            return response.data
        }
    })
    const vendors = Array.isArray(vendorsRaw) ? vendorsRaw : (vendorsRaw?.data ?? [])

    const { data: societiesRaw } = useQuery({
        queryKey: ['societies'],
        queryFn: async () => {
            const response = await api.get('/society/all')
            return response.data
        }
    })
    const societies = Array.isArray(societiesRaw) ? societiesRaw : (societiesRaw?.data ?? [])

    const recordPayoutMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/vendor-payouts', data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor-payouts'] })
            queryClient.invalidateQueries({ queryKey: ['payout-stats'] })
            toast.success('Payment recorded successfully!')
            setOpen(false)
            setFormData({
                vendorId: '',
                vendorName: '',
                societyId: '',
                societyName: '',
                commissionPercent: '',
                dealValue: '',
                payableAmount: '',
                date: new Date().toISOString().split('T')[0],
                status: 'PENDING',
                remarks: ''
            })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to record payout')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const calculatedPayable = formData.payableAmount === '' 
            ? (Number(formData.dealValue) * Number(formData.commissionPercent)) / 100
            : Number(formData.payableAmount)
        

        recordPayoutMutation.mutate({
            ...formData,
            payableAmount: calculatedPayable
        })
    }

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number, status: string }) => {
            const response = await api.put(`/vendor-payouts/${id}`, { status })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendor-payouts'] })
            queryClient.invalidateQueries({ queryKey: ['payout-stats'] })
            toast.success('Payout status updated!')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update status')
        }
    })

    const handlePay = (id: number) => {
        if (confirm('Are you sure you want to mark this payout as PAID?')) {
            updateStatusMutation.mutate({ id, status: 'PAID' })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-display">Payments & Commission</h1>
                    <p className="text-gray-500 mt-1 font-medium">Track society payments and vendor commissions</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-12 px-6 rounded-2xl bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white font-bold gap-2 shadow-lg shadow-blue-100">
                            <Plus className="h-5 w-5" />
                            RECORD NEW PAYOUT
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl rounded-[40px] p-0 gap-0">
                        <DialogHeader className="p-8 pb-0 text-left">
                            <DialogTitle className="text-2xl font-black text-gray-900">Record Vendor Payout</DialogTitle>
                            <DialogDescription className="text-gray-500 font-medium mt-1">
                                Create a new commission payment record for a vendor partner
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Vendor & Deal Details Section (Card Style) */}
                            <div className="bg-gray-50/50 rounded-[32px] p-6 ring-1 ring-black/5 space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 tracking-tight uppercase text-xs">Deal Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Vendor Partner *</Label>
                                        <Select
                                            value={formData.vendorId}
                                            onValueChange={(val) => {
                                                const vendor = vendors.find((v: any) => v.id.toString() === val)
                                                setFormData({ ...formData, vendorId: val, vendorName: vendor?.name || '' })
                                            }}
                                        >
                                            <SelectTrigger className="h-12 rounded-2xl border-0 ring-1 ring-black/5 bg-white shadow-sm font-bold">
                                                <SelectValue placeholder="Select a vendor" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-0 shadow-xl ring-1 ring-black/5">
                                                {vendors.map((v: any) => (
                                                    <SelectItem key={v.id} value={v.id.toString()} className="rounded-xl my-1 font-medium">{v.name}</SelectItem>
                                                ))}
                                                {vendors.length === 0 && (
                                                    <div className="p-4 text-center text-xs text-gray-400 font-medium">No vendors found</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Society Name *</Label>
                                        <Select
                                            value={formData.societyId}
                                            onValueChange={(val) => {
                                                const society = societies.find((s: any) => s.id.toString() === val)
                                                setFormData({ ...formData, societyId: val, societyName: society?.name || '' })
                                            }}
                                        >
                                            <SelectTrigger className="h-12 rounded-2xl border-0 ring-1 ring-black/5 bg-white shadow-sm font-bold">
                                                <SelectValue placeholder="Select a society" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-0 shadow-xl ring-1 ring-black/5">
                                                {societies.map((s: any) => (
                                                    <SelectItem key={s.id} value={s.id.toString()} className="rounded-xl my-1 font-medium">{s.name}</SelectItem>
                                                ))}
                                                {societies.length === 0 && (
                                                    <div className="p-4 text-center text-xs text-gray-400 font-medium">No societies found</div>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Deal Value (₹) *</Label>
                                        <Input
                                            type="number"
                                            className="h-12 rounded-2xl border-0 ring-1 ring-black/5 bg-white shadow-sm font-bold"
                                            placeholder="50000"
                                            value={formData.dealValue}
                                            onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Commission % *</Label>
                                        <div className="relative">
                                            <Percent className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                                            <Input
                                                type="number"
                                                className="h-12 rounded-2xl border-0 ring-1 ring-black/5 bg-white shadow-sm font-bold pr-12"
                                                placeholder="10"
                                                value={formData.commissionPercent}
                                                onChange={(e) => setFormData({ ...formData, commissionPercent: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details Section (Card Style) */}
                            <div className="bg-gray-50/50 rounded-[32px] p-6 ring-1 ring-black/5 space-y-6">
                                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                    <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                                        <IndianRupee className="h-4 w-4" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 tracking-tight uppercase text-xs">Payout Details</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Payable Amount (₹) *</Label>
                                        <Input
                                            type="number"
                                            className="h-12 rounded-2xl border-0 ring-1 ring-black/5 bg-white shadow-sm font-bold text-teal-600"
                                            placeholder="5000"
                                            value={formData.payableAmount === '' && formData.dealValue && formData.commissionPercent
                                                ? (Number(formData.dealValue) * Number(formData.commissionPercent)) / 100
                                                : formData.payableAmount}
                                            onChange={(e) => setFormData({ ...formData, payableAmount: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Payment Status *</Label>
                                        <Select
                                            value={formData.status}
                                            onValueChange={(val) => setFormData({ ...formData, status: val })}
                                        >
                                            <SelectTrigger className="h-12 rounded-2xl border-0 ring-1 ring-black/5 bg-white shadow-sm font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-0 shadow-xl ring-1 ring-black/5">
                                                <SelectItem value="Pending" className="rounded-xl my-1 font-medium text-orange-600">Pending</SelectItem>
                                                <SelectItem value="Paid" className="rounded-xl my-1 font-medium text-green-600">Paid</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2 col-span-1 md:col-span-2">
                                        <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Remarks</Label>
                                        <Textarea
                                            className="min-h-[100px] rounded-3xl border-0 ring-1 ring-black/5 bg-white shadow-sm font-medium p-4"
                                            placeholder="Optional payment notes..."
                                            value={formData.remarks}
                                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-50">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className="h-12 px-8 rounded-2xl font-bold border-gray-100"
                                >
                                    CANCEL
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-12 px-10 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black shadow-lg shadow-teal-100 gap-2"
                                >
                                    <Save className="h-5 w-5" />
                                    RECORD PAYMENT
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Society Revenue</p>
                            <p className="text-3xl font-black text-gray-900">₹{(stats?.totalSocietyRevenue || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-teal-50 text-teal-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Commission Payable</p>
                            <p className="text-3xl font-black text-gray-900">₹{(stats?.commissionPayable || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-orange-50 text-orange-600">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Payouts</p>
                            <p className="text-3xl font-black text-gray-900">₹{(stats?.pendingPayouts || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="border-0 shadow-sm bg-white rounded-[40px] ring-1 ring-black/5 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Commission Ledger</h2>
                    <Badge variant="outline" className="rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-wider bg-gray-50 border-gray-200">Transaction History</Badge>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor & Society</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Commission %</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Deal Value</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Payable Amt</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : payouts.map((log: any, index: number) => (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="font-bold text-gray-900">{log.vendorName}</p>
                                            <p className="text-xs text-blue-600 font-medium">{log.societyName || 'Platform'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center font-bold text-gray-700">
                                        {log.commissionPercent}%
                                    </td>
                                    <td className="px-8 py-6 text-center font-bold text-gray-900">
                                        ₹{log.dealValue?.toLocaleString()}
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-bold text-xs ring-1 ring-teal-100">
                                            ₹{log.payableAmount?.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <Badge className={log.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                                            {log.status}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right text-sm text-gray-500 font-medium">
                                        {new Date(log.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        {log.status !== 'PAID' && (
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white font-bold h-8 px-4 rounded-xl shadow-lg shadow-green-100"
                                                onClick={() => handlePay(log.id)}
                                            >
                                                PAY
                                            </Button>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                            {!isLoading && payouts.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-8 py-12 text-center text-gray-400 font-medium">
                                        No payments recorded yet
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
