'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Plus,
  Search,
  Filter,
  Download,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  CheckCircle2,
  Building2,
  CreditCard,
  Trash2,
  FileText,
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
import { toast } from 'react-hot-toast'

import vendorInvoiceService from '@/services/vendorInvoiceService'
import { VendorService } from '@/services/vendor.service'
import bankService from '@/services/bankService'

export default function VendorPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  
  const [invoices, setInvoices] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [banks, setBanks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [isMakePaymentOpen, setIsMakePaymentOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null)
  const [viewingPayment, setViewingPayment] = useState<any | null>(null)

  // Form States
  const [newInvoice, setNewInvoice] = useState({
      vendorId: '',
      category: '',
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      description: '',
      amount: '',
      gstAmount: '', // Optional
      remarks: ''
  })

  const [paymentForm, setPaymentForm] = useState({
      bankAccountId: '',
      paymentMethod: 'online',
      paymentDate: new Date().toISOString().split('T')[0],
      transactionRef: '',
      remarks: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
        setLoading(true)
        const [invoiceData, vendorData, bankData] = await Promise.all([
            vendorInvoiceService.getInvoices(),
            VendorService.getAll(),
            bankService.getBanks()
        ])
        setInvoices(invoiceData)
        setVendors(vendorData)
        setBanks(bankData)
    } catch (error) {
        console.error(error)
        toast.error('Failed to load data')
    } finally {
        setLoading(false)
    }
  }

  const handleAddInvoice = async () => {
      try {
          if (!newInvoice.vendorId || !newInvoice.amount || !newInvoice.dueDate || !newInvoice.invoiceNumber) {
              toast.error('Please fill required fields')
              return
          }

          await vendorInvoiceService.createInvoice(newInvoice)
          toast.success('Invoice created successfully')
          setIsAddPaymentOpen(false)
          setNewInvoice({ 
             vendorId: '', category: '', invoiceNumber: '', 
             invoiceDate: new Date().toISOString().split('T')[0], 
             dueDate: '', description: '', amount: '', gstAmount: '', remarks: '' 
          })
          loadData()
      } catch (error: any) {
          toast.error(error.response?.data?.error || 'Failed to create invoice')
      }
  }

  const handleApprove = async (payment: any) => {
      try {
          await vendorInvoiceService.approveInvoice(payment.id)
          toast.success(`Invoice ${payment.invoiceNumber} approved!`)
          loadData()
      } catch (error: any) {
          toast.error('Failed to approve invoice')
      }
  }

  const handleMakePayment = async () => {
      try {
          if (!selectedPayment) return
          if (!paymentForm.bankAccountId) {
              toast.error('Please select a Bank Account')
              return
          }

          await vendorInvoiceService.payInvoice(selectedPayment.id, paymentForm)
          toast.success('Payment processed successfully!')
          setIsMakePaymentOpen(false)
          setSelectedPayment(null)
          loadData() // Refresh list and bank balances (if we were showing them)
      } catch (error: any) {
           toast.error(error.response?.data?.error || 'Failed to process payment')
      }
  }

  const handleExport = () => {
    // Basic CSV export
    const headers = ['Invoice No', 'Vendor', 'Category', 'Description', 'Amount', 'Status', 'Due Date']
    const csvContent = [
        headers.join(','),
        ...filteredPayments.map(p => [
            p.invoiceNumber,
            p.vendor.name,
            p.category,
            `"${p.description}"`,
            p.totalAmount,
            p.status,
            new Date(p.dueDate).toLocaleDateString()
        ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vendor_payments_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Exported successfully')
  }

  // --- Derived State ---
  const totalPending = (invoices || [])
    .filter(p => p.status === 'PENDING' || p.status === 'APPROVED')
    .reduce((sum, p) => sum + p.totalAmount, 0)

  const totalPaid = (invoices || [])
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.totalAmount, 0)
    
  const filteredPayments = (invoices || []).filter((payment) => {
    const matchesSearch =
      payment.vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.invoiceNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.description || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter.toUpperCase() // API returns uppercase
    const matchesCategory = categoryFilter === 'all' || payment.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  // Stats Array
  const stats = [
    {
      title: 'Total Pending',
      value: `\u20B9${(totalPending / 1000).toFixed(1)}K`, // Simple formatting
      change: `${(invoices || []).filter(p => p.status !== 'PAID').length} invoices`,
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Paid This Month', // Using totalPaid for now (not filtered by month for simplicity in display)
      value: `\u20B9${(totalPaid / 100000).toFixed(2)}L`,
      change: `${(invoices || []).filter(p => p.status === 'PAID').length} payments`,
      icon: CheckCircle,
      color: 'green',
    },
    {
        title: 'Total Invoices',
        value: (invoices || []).length.toString(),
        change: 'All time',
        icon: FileText,
        color: 'blue'
    },
    {
      title: 'Total Vendors',
      value: (vendors || []).length.toString(),
      change: 'Active vendors',
      icon: Building2,
      color: 'blue',
    },
  ]

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="h-5 w-5" />
              {showSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vendor Payments</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage and process vendor invoices and payments
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2 text-sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white gap-2 text-sm">
                  <Plus className="h-4 w-4" />
                  <span>Add Invoice</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Add Vendor Invoice</DialogTitle>
                  <DialogDescription>
                    Record a new vendor invoice for payment processing
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Select Vendor *</Label>
                      <Select 
                        value={newInvoice.vendorId} 
                        onValueChange={(v) => setNewInvoice({...newInvoice, vendorId: v})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          {vendors.map(vendor => (
                            <SelectItem key={vendor.id} value={vendor.id.toString()}>
                              {vendor.name} ({vendor.serviceType || vendor.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select 
                        value={newInvoice.category}
                        onValueChange={(v) => setNewInvoice({...newInvoice, category: v})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pest Control">Pest Control</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                          <SelectItem value="Landscaping">Landscaping</SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Invoice Number *</Label>
                      <Input 
                        placeholder="PF-2024-089" 
                        value={newInvoice.invoiceNumber}
                        onChange={(e) => setNewInvoice({...newInvoice, invoiceNumber: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Invoice Date *</Label>
                      <Input 
                        type="date" 
                        value={newInvoice.invoiceDate}
                        onChange={(e) => setNewInvoice({...newInvoice, invoiceDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Input 
                        placeholder="Monthly Pest Control - All Blocks" 
                        value={newInvoice.description}
                        onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Amount (\u20B9) *</Label>
                      <Input 
                        type="number" 
                        placeholder="15000" 
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GST Amount (\u20B9)</Label>
                      <Input 
                        type="number" 
                        placeholder="2700" 
                        value={newInvoice.gstAmount}
                        onChange={(e) => setNewInvoice({...newInvoice, gstAmount: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date *</Label>
                      <Input 
                        type="date" 
                        value={newInvoice.dueDate}
                        onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Remarks</Label>
                    <Textarea 
                        placeholder="Any additional notes..." 
                        rows={2} 
                        value={newInvoice.remarks}
                        onChange={(e) => setNewInvoice({...newInvoice, remarks: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddPaymentOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleAddInvoice}>
                      Add Invoice
                    </Button>
                  </div>
                </div>
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
                        {stat.value}
                      </h3>
                      <p className="text-sm mt-1 text-gray-500">
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl ${
                        stat.color === 'orange'
                          ? 'bg-orange-100'
                          : stat.color === 'green'
                          ? 'bg-green-100'
                          : stat.color === 'red'
                          ? 'bg-red-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          stat.color === 'orange'
                            ? 'text-orange-600'
                            : stat.color === 'green'
                            ? 'text-green-600'
                            : stat.color === 'red'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
        
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by vendor, invoice, or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Pest Control">Pest Control</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Payments Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                           No invoices found. Add one to get started.
                        </TableCell>
                    </TableRow>
                ) : filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{payment.vendor?.name}</p>
                        <p className="text-xs text-gray-500">{payment.category}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">
                      {payment.description}
                    </TableCell>
                    <TableCell>
                        <div className="flex flex-col">
                            <span>\u20B9{payment.totalAmount.toLocaleString()}</span>
                            {payment.gstAmount > 0 && <span className="text-xs text-gray-400">+ GST \u20B9{payment.gstAmount}</span>}
                        </div>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          payment.status === 'PAID'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : payment.status === 'APPROVED'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                        }
                      >
                        {payment.status === 'PAID' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {payment.status === 'APPROVED' && <Clock className="h-3 w-3 mr-1" />}
                        {payment.status === 'PENDING' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" title="View Details" onClick={() => setViewingPayment(payment)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {payment.status === 'PENDING' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Approve"
                            onClick={() => handleApprove(payment)}
                          >
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          </Button>
                        )}
                        {(payment.status === 'PENDING' || payment.status === 'APPROVED') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Make Payment"
                            onClick={() => {
                              setSelectedPayment(payment)
                              setIsMakePaymentOpen(true)
                            }}
                          >
                            <CreditCard className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                        {payment.status === 'PAID' && (
                          <Button variant="ghost" size="icon" title="View Receipt">
                            <Receipt className="h-4 w-4 text-gray-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Make Payment Dialog */}
        <Dialog open={isMakePaymentOpen} onOpenChange={setIsMakePaymentOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Make Payment</DialogTitle>
              <DialogDescription>
                Process payment for {selectedPayment?.vendor?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4 py-4">
                <Card className="p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Invoice</p>
                      <p className="font-medium">{selectedPayment.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Vendor</p>
                      <p className="font-medium">{selectedPayment.vendor?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-bold text-lg text-green-600">
                        \u20B9{selectedPayment.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-medium">{new Date(selectedPayment.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Card>
                <div className="space-y-2">
                    <Label>Pay From (Bank Account) *</Label>
                    <Select 
                        value={paymentForm.bankAccountId}
                        onValueChange={(v) => setPaymentForm({...paymentForm, bankAccountId: v})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Bank Account" />
                        </SelectTrigger>
                        <SelectContent>
                            {banks.map(bank => (
                                <SelectItem key={bank.id} value={bank.id.toString()}>
                                    {bank.name} - \u20B9{bank.balance.toLocaleString()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method *</Label>
                  <Select 
                    value={paymentForm.paymentMethod}
                    onValueChange={(v) => setPaymentForm({...paymentForm, paymentMethod: v})}
                   >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online Transfer (NEFT/RTGS)</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Date *</Label>
                  <Input 
                    type="date" 
                    value={paymentForm.paymentDate}
                    onChange={(e) => setPaymentForm({...paymentForm, paymentDate: e.target.value})}    
                   />
                </div>
                <div className="space-y-2">
                  <Label>Transaction/Reference ID</Label>
                  <Input 
                    placeholder="Enter transaction ID" 
                    value={paymentForm.transactionRef}
                    onChange={(e) => setPaymentForm({...paymentForm, transactionRef: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Textarea 
                    placeholder="Any payment notes..." rows={2} 
                    value={paymentForm.remarks}
                    onChange={(e) => setPaymentForm({...paymentForm, remarks: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsMakePaymentOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleMakePayment}>
                    Confirm Payment
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* View Payment Dialog */}
        <Dialog open={viewingPayment !== null} onOpenChange={() => setViewingPayment(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Invoice Details</DialogTitle>
              <DialogDescription>Vendor payment information</DialogDescription>
            </DialogHeader>
            {viewingPayment && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Invoice Number</Label>
                    <p className="font-medium">{viewingPayment.invoiceNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Status</Label>
                    <Badge className={
                      viewingPayment.status === 'PAID' ? 'bg-green-100 text-green-700' :
                      viewingPayment.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }>
                      {viewingPayment.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Vendor</Label>
                    <p className="font-medium">{viewingPayment.vendor?.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Category</Label>
                    <p className="font-medium">{viewingPayment.category}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground text-xs">Description</Label>
                    <p className="font-medium">{viewingPayment.description}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Invoice Date</Label>
                    <p className="font-medium">{new Date(viewingPayment.invoiceDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Due Date</Label>
                    <p className="font-medium">{new Date(viewingPayment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Base Amount</Label>
                    <p className="font-medium">\u20B9{viewingPayment.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">GST</Label>
                    <p className="font-medium">\u20B9{viewingPayment.gstAmount.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground text-xs">Total Amount</Label>
                    <p className="font-bold text-xl text-green-600">\u20B9{viewingPayment.totalAmount.toLocaleString()}</p>
                  </div>
                  {viewingPayment.paymentDate && (
                    <>
                      <div>
                        <Label className="text-muted-foreground text-xs">Payment Date</Label>
                        <p className="font-medium">{new Date(viewingPayment.paymentDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Payment Method</Label>
                        <p className="font-medium capitalize">{viewingPayment.paymentMethod}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setViewingPayment(null)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
