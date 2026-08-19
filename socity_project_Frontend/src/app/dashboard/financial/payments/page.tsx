'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TransactionService } from '@/services/transaction.service'
import { toast } from 'sonner'
import {
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  CreditCard,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

export default function PaymentsPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    invoiceNo: '',
    amount: '',
    paymentMethod: 'CASH',
    date: format(new Date(), 'yyyy-MM-dd'),
    transactionId: '', // Optional reference
    receivedFrom: '',  // Resident Name
    description: ''
  })

  // 1. Fetch Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['payment-stats'],
    queryFn: TransactionService.getStats
  })

  // 2. Fetch Payments (Income Transactions)
  const { data: paymentsData = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments', statusFilter],
    queryFn: async () => {
      const allTransactions = await TransactionService.getAll()
      return allTransactions.filter((t: any) => t.type === 'INCOME')
    },
  })

  // 3. Record Payment Mutation
  const recordMutation = useMutation({
    mutationFn: (data: any) => TransactionService.create({
      ...data,
      type: 'INCOME',
      category: 'Maintenance', // Default category
      status: 'PAID'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['defaulters'] })
      queryClient.invalidateQueries({ queryKey: ['billing-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
      setIsRecordDialogOpen(false)
      setFormData({
        invoiceNo: '',
        amount: '',
        paymentMethod: 'CASH',
        date: format(new Date(), 'yyyy-MM-dd'),
        transactionId: '',
        receivedFrom: '',
        description: ''
      })
      toast.success('Payment recorded successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to record payment')
    }
  })

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.receivedFrom) {
      toast.error('Please fill required fields (Amount, Resident Name)')
      return;
    }

    recordMutation.mutate({
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
      paymentMethod: formData.paymentMethod,
      invoiceNo: formData.invoiceNo || undefined,
      receivedFrom: formData.receivedFrom,
      description: formData.description + (formData.transactionId ? ` (Ref: ${formData.transactionId})` : '')
    })
  }

  // Export to CSV
  const handleExport = () => {
    if (!filteredPayments.length) {
      toast.error('No data to export')
      return
    }

    const headers = ['Payment ID', 'Invoice ID', 'Resident', 'Amount', 'Date', 'Method', 'Transaction Ref', 'Status']
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map((p: any) => [
        p.id,
        p.invoiceNo || '-',
        `"${p.receivedFrom || 'Unknown'}"`, // Quote to handle commas in names
        p.amount,
        format(new Date(p.date), 'yyyy-MM-dd'),
        p.paymentMethod,
        p.transactionId || '-',
        p.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `payments_export_${format(new Date(), 'dd-MM-yyyy')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter Logic
  const filteredPayments = paymentsData.filter((payment: any) => {
    const matchesSearch =
      (payment.receivedFrom?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (payment.invoiceNo?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (payment.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter

    return matchesSearch && matchesStatus
  })

  // Verify Payment
  const verifyMutation = useMutation({
    mutationFn: (id: number) => TransactionService.update(id, { status: 'COMPLETED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      queryClient.invalidateQueries({ queryKey: ['payment-stats'] })
      toast.success('Payment verified successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to verify payment')
    }
  })

  const handleVerify = (id: number) => {
    if (confirm('Are you sure you want to verify this payment as completed?')) {
      verifyMutation.mutate(id)
    }
  }

  // Helper for Stats
  const stats = [
    {
      title: 'Total Payments',
      value: `₹${statsData?.totalIncome?.toLocaleString() || 0}`,
      change: 'Lifetime',
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: 'This Month',
      value: `₹${statsData?.thisMonthIncome?.toLocaleString() || 0}`,
      change: 'Current Month',
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Pending',
      value: `₹${statsData?.pendingIncome?.toLocaleString() || 0}`,
      change: 'To Collect',
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Total Payers',
      value: statsData?.totalPayers || 0,
      change: 'Residents',
      icon: Users,
      color: 'purple',
    },
  ]

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">
              Track and manage all payment transactions
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="space-x-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Record Payment</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Record Manual Payment</DialogTitle>
                  <DialogDescription>
                    Record a payment received through offline mode (Cash, Cheque, etc.)
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRecordSubmit} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Resident Name <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="e.g. Rajesh Kumar"
                        value={formData.receivedFrom}
                        onChange={(e) => setFormData({ ...formData, receivedFrom: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount (₹) <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        placeholder="15000"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(val) => setFormData({ ...formData, paymentMethod: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="CHEQUE">Cheque</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="ONLINE">Online Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Date</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Transaction Ref / ID</Label>
                      <Input
                        placeholder="e.g. UPI Ref No."
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Invoice Number (Optional)</Label>
                      <Input
                        placeholder="e.g. INV-2025-001"
                        value={formData.invoiceNo}
                        onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Remarks</Label>
                    <Input
                      placeholder="Optional notes"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={recordMutation.isPending}>
                      {recordMutation.isPending ? 'Recording...' : 'Record Payment'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2">
                        {statsLoading ? <Skeleton className="h-8 w-24" /> : stat.value}
                      </h3>
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by unit, resident, transaction ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </Card>

        {/* Payments Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref ID</TableHead>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Resident</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentsLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  </TableRow>
                ))
              ) : filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No payments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium text-xs text-gray-500">#{payment.id}</TableCell>
                    <TableCell>{payment.invoiceNo || '-'}</TableCell>
                    <TableCell className="font-medium">{payment.receivedFrom || 'Unknown'}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ₹{payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{format(new Date(payment.date), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        <span className="capitalize">{payment.paymentMethod?.toLowerCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 max-w-[200px] truncate" title={payment.description}>
                      {payment.description || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payment.status === 'PAID' || payment.status === 'COMPLETED'
                            ? 'default'
                            : payment.status === 'FAILED'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className={
                          payment.status === 'PAID' || payment.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : payment.status === 'FAILED'
                              ? 'bg-red-100 text-red-700 hover:bg-red-100'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                        }
                      >
                        {(payment.status === 'PAID' || payment.status === 'COMPLETED') && <CheckCircle className="h-3 w-3 mr-1" />}
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.status === 'PENDING' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-white hover:bg-green-600 border-green-600 h-7 text-xs"
                          onClick={() => handleVerify(payment.id)}
                        >
                          Verify
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </RoleGuard>
  )
}
