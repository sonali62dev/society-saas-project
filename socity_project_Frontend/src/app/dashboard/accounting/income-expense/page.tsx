'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TransactionService } from '@/services/transaction.service'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  Eye,
  Edit,
  Loader2,
  Trash2,
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
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

const incomeCategoryColors: Record<string, string> = {
  Maintenance: 'bg-green-100 text-green-700',
  Parking: 'bg-blue-100 text-blue-700',
  Amenity: 'bg-purple-100 text-purple-700',
  Penalty: 'bg-orange-100 text-orange-700',
  Deposit: 'bg-cyan-100 text-cyan-700',
  Event: 'bg-pink-100 text-pink-700',
  Other: 'bg-gray-100 text-gray-700',
}

const expenseCategoryColors: Record<string, string> = {
  Salary: 'bg-blue-100 text-blue-700',
  Security: 'bg-indigo-100 text-indigo-700',
  Housekeeping: 'bg-green-100 text-green-700',
  Utilities: 'bg-yellow-100 text-yellow-700',
  Maintenance: 'bg-orange-100 text-orange-700',
  Repairs: 'bg-red-100 text-red-700',
  Vendor: 'bg-purple-100 text-purple-700',
  Other: 'bg-gray-100 text-gray-700',
}

export default function IncomeExpensePage() {
  const queryClient = useQueryClient()

  // UI State
  const [activeTab, setActiveTab] = useState('income')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false)
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)

  // Action State
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    receivedFrom: '', // For Income
    paidTo: '',       // For Expense
    paymentMethod: 'ONLINE',
    invoiceNo: '',
    notes: ''
  })

  // 1. Fetch Stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['transaction-stats'],
    queryFn: TransactionService.getStats
  })

  // 2. Fetch All Transactions
  const { data: transactions = [], isLoading: listLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: TransactionService.getAll
  })

  // 3. Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => TransactionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] })
      setIsAddIncomeOpen(false)
      setIsAddExpenseOpen(false)
      resetForm()
      toast.success('Transaction recorded successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to record transaction')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => TransactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transaction-stats'] })
      setIsDeleteOpen(false)
      toast.success('Transaction deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete transaction')
    }
  })

  // Helpers
  const resetForm = () => {
    setFormData({
      category: '',
      description: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      receivedFrom: '',
      paidTo: '',
      paymentMethod: 'ONLINE',
      invoiceNo: '',
      notes: ''
    })
  }

  const handleRecordIncome = () => {
    if (!formData.amount || !formData.category || !formData.receivedFrom) {
      toast.error('Please fill required fields (Category, Amount, Received From)')
      return
    }
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    createMutation.mutate({
      type: 'INCOME',
      category: formData.category,
      amount,
      date: new Date(formData.date).toISOString(),
      receivedFrom: formData.receivedFrom,
      paymentMethod: formData.paymentMethod || 'ONLINE',
      description: formData.description || undefined,
      invoiceNo: formData.invoiceNo || undefined,
      status: 'PAID'
    })
  }

  const handleRecordExpense = () => {
    if (!formData.amount || !formData.category || !formData.paidTo) {
      toast.error('Please fill required fields (Category, Amount, Paid To)')
      return
    }
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    createMutation.mutate({
      type: 'EXPENSE',
      category: formData.category,
      amount,
      date: new Date(formData.date).toISOString(),
      paidTo: formData.paidTo,
      paymentMethod: formData.paymentMethod || 'ONLINE',
      description: formData.description || undefined,
      invoiceNo: formData.invoiceNo || undefined,
      status: 'PAID'
    })
  }

  const handleView = (item: any) => {
    setSelectedTransaction(item)
    setIsViewOpen(true)
  }

  const handleDeleteClick = (item: any) => {
    setSelectedTransaction(item)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedTransaction?.id) {
      deleteMutation.mutate(selectedTransaction.id)
    }
  }

  // Filter Data
  const filteredData = transactions.filter((item: any) => {
    const isIncome = activeTab === 'income'
    if (isIncome && item.type !== 'INCOME') return false
    if (!isIncome && item.type !== 'EXPENSE') return false

    const searchIn = isIncome ? (item.receivedFrom || '') : (item.paidTo || '')
    const matchesSearch =
      (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (searchIn.toLowerCase() || '').includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleExport = () => {
    if (!filteredData.length) {
      toast.error('No data to export')
      return
    }

    const headers = ['ID', 'Type', 'Category', 'Description', 'Entity', 'Amount', 'Date', 'Status']
    const csvContent = [
      headers.join(','),
      ...filteredData.map((t: any) => [
        t.id,
        t.type,
        t.category,
        `"${t.description || ''}"`,
        `"${t.type === 'INCOME' ? (t.receivedFrom || '') : (t.paidTo || '')}"`,
        t.amount,
        format(new Date(t.date), 'yyyy-MM-dd'),
        t.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${activeTab}_export.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Exported successfully')
  }

  const netBalance = (stats?.totalIncome || 0) - (stats?.totalExpenses || 0)

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Income & Expense Tracking</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Track all society income and expenses
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2 text-sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Income (This Month)</p>
                <h3 className="text-3xl font-bold text-green-800 mt-1">
                  {statsLoading ? <Skeleton className="h-8 w-24 bg-green-200" /> : `\u20B9${(stats?.thisMonthIncome || 0).toLocaleString()}`}
                </h3>
              </div>
              <div className="p-4 bg-green-100 rounded-full">
                <ArrowUpRight className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Total Expenses (This Month)</p>
                <h3 className="text-3xl font-bold text-red-800 mt-1">
                  {statsLoading ? <Skeleton className="h-8 w-24 bg-red-200" /> : `\u20B9${(stats?.thisMonthExpenses || 0).toLocaleString()}`}
                </h3>
              </div>
              <div className="p-4 bg-red-100 rounded-full">
                <ArrowDownRight className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </Card>
          <Card className={`p-6 ${netBalance >= 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Net Balance</p>
                <h3 className={`text-3xl font-bold mt-1 ${netBalance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                  {statsLoading ? <Skeleton className="h-8 w-24" /> : `\u20B9${Math.abs(netBalance).toLocaleString()}`}
                </h3>
                <p className={`text-xs mt-1 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {netBalance >= 0 ? 'Surplus' : 'Deficit'}
                </p>
              </div>
              <div className={`p-4 rounded-full ${netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <IndianRupee className={`h-8 w-8 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
            </div>
          </Card>
        </div>

        {/* View Details Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            {selectedTransaction && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Transaction ID</Label>
                    <p className="font-medium">#{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Date</Label>
                    <p className="font-medium">{format(new Date(selectedTransaction.date), 'dd MMM yyyy')}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Type</Label>
                    <Badge className={selectedTransaction.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {selectedTransaction.type}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-500">Category</Label>
                    <p className="font-medium">{selectedTransaction.category}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Amount</Label>
                    <p className={`font-bold ${selectedTransaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                      \u20B9{selectedTransaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Payment Method</Label>
                    <p className="font-medium">{selectedTransaction.paymentMethod}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">Description</Label>
                  <p className="font-medium">{selectedTransaction.description || '-'}</p>
                </div>
                {selectedTransaction.type === 'INCOME' ? (
                  <>
                    <div>
                      <Label className="text-gray-500">Received From</Label>
                      <p className="font-medium">{selectedTransaction.receivedFrom}</p>
                    </div>
                    {selectedTransaction.invoiceNo && (
                      <div>
                        <Label className="text-gray-500">Invoice / Receipt No</Label>
                        <p className="font-medium">{selectedTransaction.invoiceNo}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      <Label className="text-gray-500">Paid To</Label>
                      <p className="font-medium">{selectedTransaction.paidTo}</p>
                    </div>
                    {selectedTransaction.invoiceNo && (
                      <div>
                        <Label className="text-gray-500">Invoice No</Label>
                        <p className="font-medium">{selectedTransaction.invoiceNo}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this transaction? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            <div>
              {activeTab === 'income' ? (
                <Dialog open={isAddIncomeOpen} onOpenChange={setIsAddIncomeOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white gap-2" onClick={resetForm}>
                      <Plus className="h-4 w-4" />
                      Record Income
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Record New Income</DialogTitle>
                      <DialogDescription>Add a new income entry</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Parking">Parking</SelectItem>
                            <SelectItem value="Amenity">Amenity</SelectItem>
                            <SelectItem value="Penalty">Penalty</SelectItem>
                            <SelectItem value="Deposit">Deposit</SelectItem>
                            <SelectItem value="Event">Event</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Amount (\u20B9) *</Label>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Received From *</Label>
                        <Input
                          placeholder="Resident Name / Unit"
                          value={formData.receivedFrom}
                          onChange={(e) => setFormData({ ...formData, receivedFrom: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Payment Method</Label>
                          <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ONLINE">Online</SelectItem>
                              <SelectItem value="UPI">UPI</SelectItem>
                              <SelectItem value="CHEQUE">Cheque</SelectItem>
                              <SelectItem value="CASH">Cash</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Invoice / Receipt No.</Label>
                          <Input
                            placeholder="Optional"
                            value={formData.invoiceNo}
                            onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          placeholder="Optional"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                          placeholder="Optional"
                          rows={2}
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAddIncomeOpen(false)}>Cancel</Button>
                        <Button
                          className="bg-green-600 hover:bg-green-700"
                          onClick={handleRecordIncome}
                          disabled={createMutation.isPending}
                        >
                          {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Record'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-600 hover:bg-red-700 text-white gap-2" onClick={resetForm}>
                      <Plus className="h-4 w-4" />
                      Record Expense
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Record New Expense</DialogTitle>
                      <DialogDescription>Add a new expense entry</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Salary">Salary</SelectItem>
                            <SelectItem value="Security">Security</SelectItem>
                            <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                            <SelectItem value="Utilities">Utilities</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                            <SelectItem value="Repairs">Repairs</SelectItem>
                            <SelectItem value="Vendor">Vendor</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Amount (\u20B9) *</Label>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="0"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Paid To *</Label>
                        <Input
                          placeholder="Vendor / Service Name"
                          value={formData.paidTo}
                          onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Invoice No.</Label>
                          <Input
                            placeholder="Optional"
                            value={formData.invoiceNo}
                            onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Payment Method</Label>
                          <Select value={formData.paymentMethod} onValueChange={(v) => setFormData({ ...formData, paymentMethod: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ONLINE">Online</SelectItem>
                              <SelectItem value="UPI">UPI</SelectItem>
                              <SelectItem value="CHEQUE">Cheque</SelectItem>
                              <SelectItem value="CASH">Cash</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          placeholder="Optional"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                          placeholder="Optional"
                          rows={2}
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>Cancel</Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700"
                          onClick={handleRecordExpense}
                          disabled={createMutation.isPending}
                        >
                          {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Record'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-4">
            {/* ... Keep Search/Filters ... */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Category Filter - Simplified */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {activeTab === 'income' ? (
                    Object.keys(incomeCategoryColors).map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)
                  ) : (
                    Object.keys(expenseCategoryColors).map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)
                  )}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <TabsContent value="income">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Received From</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listLoading ? (
                      <TableRow><TableCell colSpan={8} className="text-center p-4">Loading...</TableCell></TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow><TableCell colSpan={8} className="text-center p-4">No records found</TableCell></TableRow>
                    ) : (
                      filteredData.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-xs text-gray-400">#{item.id}</TableCell>
                          <TableCell>
                            <Badge className={incomeCategoryColors[item.category] || 'bg-gray-100'}>
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{item.receivedFrom}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {item.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">{format(new Date(item.date), 'dd MMM yyyy')}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleView(item)}><Eye className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)} className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Paid To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listLoading ? (
                      <TableRow><TableCell colSpan={8} className="text-center p-4">Loading...</TableCell></TableRow>
                    ) : filteredData.length === 0 ? (
                      <TableRow><TableCell colSpan={8} className="text-center p-4">No records found</TableCell></TableRow>
                    ) : (
                      filteredData.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-xs text-gray-400">#{item.id}</TableCell>
                          <TableCell>
                            <Badge className={expenseCategoryColors[item.category] || 'bg-gray-100'}>
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{item.paidTo}</p>
                              {item.invoiceNo && <span className="text-xs text-gray-400">Inv: {item.invoiceNo}</span>}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-red-600">
                            -\u20B9{item.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-sm">{format(new Date(item.date), 'dd MMM yyyy')}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleView(item)}><Eye className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)} className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
