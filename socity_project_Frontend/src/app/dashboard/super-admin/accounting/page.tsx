'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  FileText,
  Search,
  DollarSign,
  Receipt,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { RoleGuard } from '@/components/auth/role-guard'

export default function SuperAdminAccountingPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: response, isLoading } = useQuery<any>({
    queryKey: ['super-admin-accounting-payments'],
    queryFn: async () => {
      const res = await api.get('/services/inquiries', {
        params: { limit: 500, page: 1 },
      })
      return res.data
    },
  })

  const inquiries = response?.data ?? []
  const paymentsList = useMemo(() => {
    const list = inquiries.filter((inq: any) => {
      const hasPayment =
        inq.payableAmount != null ||
        inq.paymentStatus ||
        inq.paymentMethod ||
        inq.transactionId
      return hasPayment
    })
    const q = searchTerm.toLowerCase().trim()
    if (q) {
      return list.filter(
        (p: any) =>
          (p.serviceName || '').toLowerCase().includes(q) ||
          (p.residentName || '').toLowerCase().includes(q) ||
          (p.transactionId || '').toLowerCase().includes(q) ||
          (p.vendorName || '').toLowerCase().includes(q)
      )
    }
    if (statusFilter === 'all') return list
    const status = statusFilter.toUpperCase()
    return list.filter(
      (p: any) => (p.paymentStatus || 'PENDING').toUpperCase() === status
    )
  }, [inquiries, searchTerm, statusFilter])

  const paidCount = paymentsList.filter(
    (p: any) => (p.paymentStatus || '').toUpperCase() === 'PAID'
  ).length
  const pendingCount = paymentsList.filter(
    (p: any) => (p.paymentStatus || 'PENDING').toUpperCase() === 'PENDING'
  ).length
  const totalPaid = paymentsList
    .filter((p: any) => (p.paymentStatus || '').toUpperCase() === 'PAID')
    .reduce((sum: number, p: any) => sum + (Number(p.payableAmount) || 0), 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display flex items-center gap-2">
            <Receipt className="h-8 w-8 text-teal-600" />
            Accounting & Payments
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Payments overview for service leads (Individual / Resident)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm bg-white rounded-2xl ring-1 ring-black/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-50">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Paid</p>
                  <p className="text-2xl font-black text-gray-900">{paidCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white rounded-2xl ring-1 ring-black/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-50">
                  <CreditCard className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</p>
                  <p className="text-2xl font-black text-gray-900">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-white rounded-2xl ring-1 ring-black/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-teal-50">
                  <Receipt className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total collected (₹)</p>
                  <p className="text-2xl font-black text-gray-900">
                    {totalPaid.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm bg-white rounded-2xl ring-1 ring-black/5 overflow-hidden">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              Payment list
            </CardTitle>
            <CardDescription>
              Lead reference, amount, status, method and date
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by service, customer, transaction ID..."
                  className="pl-10 h-10 rounded-xl border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All statuses</option>
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Lead #</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Service</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Customer</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Amount (₹)</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Method</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Date / Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        No payment records found.
                      </td>
                    </tr>
                  ) : (
                    paymentsList.map((row: any) => {
                      const payStatus = (row.paymentStatus || 'PENDING').toUpperCase()
                      return (
                        <tr
                          key={row.id}
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 px-4 font-mono font-semibold text-gray-900">
                            #{row.id}
                          </td>
                          <td className="py-4 px-4 text-gray-700">{row.serviceName || '—'}</td>
                          <td className="py-4 px-4 text-gray-700">{row.residentName || '—'}</td>
                          <td className="py-4 px-4 font-semibold text-gray-900">
                            {row.payableAmount != null
                              ? Number(row.payableAmount).toLocaleString('en-IN')
                              : '—'}
                          </td>
                          <td className="py-4 px-4">
                            <Badge
                              className={
                                payStatus === 'PAID'
                                  ? 'bg-green-100 text-green-700 border-green-200'
                                  : payStatus === 'FAILED'
                                    ? 'bg-red-100 text-red-700 border-red-200'
                                    : 'bg-amber-100 text-amber-700 border-amber-200'
                              }
                            >
                              {payStatus}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {row.paymentMethod || '—'}
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {row.paymentDate
                              ? new Date(row.paymentDate).toLocaleDateString()
                              : row.transactionId || '—'}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
