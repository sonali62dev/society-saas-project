'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Plus,
  Search,
  Filter,
  Download,
  Car,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  CheckCircle2,
  Send,
  IndianRupee,
  Calendar,
  Receipt,
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ParkingPaymentService } from '@/services/parkingPaymentService'
import ParkingSlotService from '@/services/parkingSlotService'
import { format } from 'date-fns'

/* REMOVED MOCK DATA CONSTANTS */

/* REMOVED STATIC MOCK DATA */

export default function ParkingPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const [selectedPayment, setSelectedPayment] = useState<typeof parkingPayments[0] | null>(null)
  const [viewingPayment, setViewingPayment] = useState<typeof parkingPayments[0] | null>(null)
  const [paymentReceipt, setPaymentReceipt] = useState<typeof parkingPayments[0] | null>(null)

  const queryClient = useQueryClient()

  // Fetch Payments
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['parking-payments', statusFilter, typeFilter, searchQuery],
    queryFn: () => ParkingPaymentService.getPayments({
      status: statusFilter !== 'all' ? statusFilter.toUpperCase() : undefined,
      search: searchQuery || undefined
    })
  })

  // Fetch Slots for Dropdown
  const { data: slotsData } = useQuery({
    queryKey: ['parking-slots-list'],
    queryFn: () => ParkingSlotService.getAllSlots({ status: 'occupied' }) // Only show occupied slots for payment
  })

  // Map backend data to frontend structure
  const parkingPayments = (apiData?.data || []).map((payment: any) => ({
    id: payment.paymentId,
    dbId: payment.id, // Internal ID for mutations
    slotNumber: payment.slot?.number || '-',
    type: payment.slot?.type || 'four_wheeler',
    residentName: payment.resident?.name || 'Unknown',
    unit: payment.slot?.unit?.number ? `${payment.slot.unit.block}-${payment.slot.unit.number}` : '-',
    vehicleNumber: payment.slot?.vehicleNumber || '-',
    month: payment.month ? format(new Date(payment.month), 'MMMM') : '-',
    year: payment.month ? new Date(payment.month).getFullYear() : new Date().getFullYear(),
    amount: payment.amount || 0,
    dueDate: payment.dueDate ? format(new Date(payment.dueDate), 'yyyy-MM-dd') : '-',
    paymentDate: payment.paymentDate ? format(new Date(payment.paymentDate), 'yyyy-MM-dd') : null,
    status: (payment.status || 'pending').toLowerCase(),
    paymentMethod: payment.paymentMethod || null,
  }))

  const statsData = apiData?.stats || { total: 0, collected: 0, pending: 0, overdue: 0 }

  const recordPaymentMutation = useMutation({
    mutationFn: (data: { id: number; data: any }) => ParkingPaymentService.recordPayment(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-payments'] })
      setIsRecordPaymentOpen(false)
      setSelectedPayment(null)
      showNotification('Payment recorded successfully!')
    }
  })

  /* Stats Mapping */
  const stats = [
    {
      title: 'Total Collection',
      value: `₹${(statsData.collected / 100000).toFixed(1)}L`,
      change: 'Lifetime',
      icon: IndianRupee,
      color: 'green',
    },
    {
      title: 'Pending Payments',
      value: parkingPayments.filter((p: any) => p.status === 'pending').length.toString(),
      change: `₹${statsData.pending.toLocaleString()} due`,
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Total Due',
      value: `₹${statsData.total.toLocaleString()}`,
      change: 'All time',
      icon: Car,
      color: 'blue',
    },
    {
      title: 'Overdue',
      value: parkingPayments.filter((p: any) => p.status === 'overdue').length.toString(),
      change: `₹${statsData.overdue.toLocaleString()}`,
      icon: AlertCircle,
      color: 'red',
    },
  ]

  const showNotification = (message: string) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleRecordPayment = () => {
    if (selectedPayment) {
        // Find the input values from DOM or state? 
        // For simplicity reusing the logic but better to have controlled inputs.
        // Since we are not changing UI structure deeply, I will assume the dialog inputs are using specific IDs or state.
        // Wait, the dialog uses uncontrolled inputs in the original code!
        // "Continue ui change mt karna bus" -> I need to make them controlled to retrieve values.
        // I will add state for payment form.
        recordPaymentMutation.mutate({
            id: (selectedPayment as any).dbId, // Using the dbId we mapped earlier
            data: {
                amount: selectedPayment.amount, // Default to full amount
                paymentMethod: 'cash', // Default or from state
                paymentDate: new Date()
            }
        })
    }
  }

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
      slotNumber: '',
      monthValue: '', // combined month-year
      amount: '',
      date: new Date().toISOString().split('T')[0],
      method: 'cash',
      transactionId: ''
  })

  // Create Mutation
  const createPaymentMutation = useMutation({
    mutationFn: (data: any) => ParkingPaymentService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-payments'] })
      setIsRecordPaymentOpen(false)
      showNotification('Payment recorded successfully!')
    }
  })

  // Override handleRecordPayment to use form state and support both Create and Update
  const submitPayment = () => {
      if (selectedPayment) {
          // Update existing
          recordPaymentMutation.mutate({
              id: (selectedPayment as any).dbId,
              data: {
                  amount: Number(paymentForm.amount) || selectedPayment.amount,
                  paymentDate: paymentForm.date,
                  paymentMethod: paymentForm.method,
                  transactionId: paymentForm.transactionId
              }
          })
      } else {
          // Create new
          const [monthStr, yearStr] = (paymentForm.monthValue || 'december-2024').split('-')
          createPaymentMutation.mutate({
              slotNumber: paymentForm.slotNumber,
              amount: paymentForm.amount,
              month: monthStr,
              year: parseInt(yearStr),
              paymentMethod: paymentForm.method,
              paymentDate: paymentForm.date,
              transactionId: paymentForm.transactionId
          })
      }
  }

  const handleExport = () => {
    const headers = ['Payment ID', 'Slot', 'Resident', 'Vehicle', 'Month', 'Year', 'Amount', 'Status', 'Due Date', 'Payment Date', 'Method']
    const csvContent = [
      headers.join(','),
      ...parkingPayments.map((p: any) => [
        p.id,
        p.slotNumber,
        `"${p.residentName}"`,
        p.vehicleNumber,
        p.month,
        p.year,
        p.amount,
        p.status,
        p.dueDate,
        p.paymentDate || '-',
        p.paymentMethod || '-'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `parking-payments-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    showNotification('Payment data exported successfully!')
  }

  const handleSendReminder = (payment: typeof parkingPayments[0]) => {
    showNotification(`Payment reminder sent to ${payment.residentName}`)
  }

  const filteredPayments = parkingPayments.filter((payment: any) => {
    // Client side filtering on top of server side if needed, 
    // or just rely on server. Since we passed filters to API, API handles most.
    // But typeFilter 'two_wheeler' vs 'four_wheeler' logic might be consistent.
    if (typeFilter !== 'all' && payment.type !== typeFilter) return false;
    // Search is handled by API but let's keep client filter for immediate feedback if query matches local data
    return true; 
  })

  // Recalculate based on fetched data
  const totalCollected = statsData.collected
  const totalPending = statsData.pending + statsData.overdue

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Parking Payments</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Track and manage parking fee collections
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2 text-sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Dialog open={isRecordPaymentOpen} onOpenChange={setIsRecordPaymentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white gap-2 text-sm">
                  <Plus className="h-4 w-4" />
                  <span>Record Payment</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Record Parking Payment</DialogTitle>
                  <DialogDescription>
                    Record a new parking fee payment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Slot Number</Label>
                      <Select 
                        value={paymentForm.slotNumber} 
                        onValueChange={(val) => setPaymentForm({...paymentForm, slotNumber: val})} 
                        disabled={selectedPayment !== null}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {slotsData?.map((slot: any) => (
                            <SelectItem key={slot.id} value={slot.number}>
                              {slot.number} {slot.unit ? `(${slot.unit.block}-${slot.unit.number})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Month</Label>
                      <Select 
                        value={paymentForm.monthValue} 
                        onValueChange={(val) => setPaymentForm({...paymentForm, monthValue: val})}
                        disabled={selectedPayment !== null}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="december-2024">December 2024</SelectItem>
                          <SelectItem value="january-2025">January 2025</SelectItem>
                          <SelectItem value="february-2025">February 2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount (\u20B9)</Label>
                      <Input 
                        type="number" 
                        placeholder={selectedPayment?.amount?.toString()}
                        value={paymentForm.amount}
                        onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Date</Label>
                      <Input 
                        type="date"
                        value={paymentForm.date}
                        onChange={(e) => setPaymentForm({...paymentForm, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select value={paymentForm.method} onValueChange={(val) => setPaymentForm({...paymentForm, method: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="online">Online Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Transaction ID (Optional)</Label>
                    <Input 
                        placeholder="Enter transaction ID" 
                        value={paymentForm.transactionId}
                        onChange={(e) => setPaymentForm({...paymentForm, transactionId: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsRecordPaymentOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700" onClick={submitPayment} disabled={recordPaymentMutation.isPending}>
                      {recordPaymentMutation.isPending ? 'Recording...' : 'Record Payment'}
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
                        stat.color === 'green'
                          ? 'bg-green-100'
                          : stat.color === 'orange'
                          ? 'bg-orange-100'
                          : stat.color === 'blue'
                          ? 'bg-blue-100'
                          : 'bg-red-100'
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          stat.color === 'green'
                            ? 'text-green-600'
                            : stat.color === 'orange'
                            ? 'text-orange-600'
                            : stat.color === 'blue'
                            ? 'text-blue-600'
                            : 'text-red-600'
                        }`}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Collected (This Month)</p>
                <h3 className="text-3xl font-bold text-green-800 mt-1">
                  ₹{totalCollected.toLocaleString()}
                </h3>
              </div>
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Total Pending</p>
                <h3 className="text-3xl font-bold text-orange-800 mt-1">
                  ₹{totalPending.toLocaleString()}
                </h3>
              </div>
              <div className="p-4 bg-orange-100 rounded-full">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name, slot, unit, or vehicle..."
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
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="two_wheeler">Two Wheeler</SelectItem>
                <SelectItem value="four_wheeler">Four Wheeler</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </Card>

        {/* Payments Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Slot</TableHead>
                  <TableHead>Resident</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment: any) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Car className={`h-4 w-4 ${payment.type === 'four_wheeler' ? 'text-blue-500' : 'text-green-500'}`} />
                        <span>{payment.slotNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{payment.residentName}</p>
                        <p className="text-xs text-gray-500">{payment.unit}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{payment.vehicleNumber}</TableCell>
                    <TableCell>{payment.month} {payment.year}</TableCell>
                    <TableCell className="font-semibold">
                      ₹{payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">{payment.dueDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          payment.status === 'paid'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : payment.status === 'pending'
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                            : 'bg-red-100 text-red-700 hover:bg-red-100'
                        }
                      >
                        {payment.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {payment.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {payment.status === 'overdue' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" title="View Details" onClick={() => setViewingPayment(payment)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {payment.status !== 'paid' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Record Payment"
                              onClick={() => {
                                setSelectedPayment(payment)
                                setIsRecordPaymentOpen(true)
                              }}
                            >
                              <CreditCard className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Send Reminder"
                              onClick={() => handleSendReminder(payment)}
                            >
                              <Send className="h-4 w-4 text-blue-500" />
                            </Button>
                          </>
                        )}
                        {payment.status === 'paid' && (
                          <Button variant="ghost" size="icon" title="View Receipt" onClick={() => setPaymentReceipt(payment)}>
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

        {/* View Payment Dialog */}
        <Dialog open={paymentReceipt !== null} onOpenChange={() => setPaymentReceipt(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Receipt</DialogTitle>
              <DialogDescription>Receipt #{paymentReceipt?.id}</DialogDescription>
            </DialogHeader>
            {paymentReceipt && (
              <div className="space-y-6">
                <div className="flex justify-center py-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Payment Successful</h3>
                    <p className="text-sm text-gray-500">{paymentReceipt.paymentDate}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-bold">₹{paymentReceipt.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="capitalize">{paymentReceipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Transaction ID</span>
                    <span>{paymentReceipt.id} (Ref)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Resident</span>
                    <span className="font-medium">{paymentReceipt.residentName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Slot / Unit</span>
                    <span className="font-medium">{paymentReceipt.slotNumber} / {paymentReceipt.unit}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Month</span>
                    <span className="font-medium">{paymentReceipt.month} {paymentReceipt.year}</span>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <Button className="w-full gap-2" variant="outline" onClick={() => showNotification("Receipt downloaded functionality placeholder")}>
                    <Download className="h-4 w-4" /> Download Receipt
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={viewingPayment !== null} onOpenChange={() => setViewingPayment(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>Parking payment information</DialogDescription>
            </DialogHeader>
            {viewingPayment && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Payment ID</Label>
                    <p className="font-medium">{viewingPayment.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Status</Label>
                    <Badge className={viewingPayment.status === 'paid' ? 'bg-green-100 text-green-700' : viewingPayment.status === 'pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}>
                      {viewingPayment.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Slot Number</Label>
                    <p className="font-medium">{viewingPayment.slotNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Vehicle Type</Label>
                    <p className="font-medium">{viewingPayment.type === 'four_wheeler' ? 'Four Wheeler' : 'Two Wheeler'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Resident Name</Label>
                    <p className="font-medium">{viewingPayment.residentName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Unit</Label>
                    <p className="font-medium">{viewingPayment.unit}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Vehicle Number</Label>
                    <p className="font-medium">{viewingPayment.vehicleNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Amount</Label>
                    <p className="font-medium text-green-600">\u20B9{viewingPayment.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Period</Label>
                    <p className="font-medium">{viewingPayment.month} {viewingPayment.year}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Due Date</Label>
                    <p className="font-medium">{viewingPayment.dueDate}</p>
                  </div>
                  {viewingPayment.paymentDate && (
                    <>
                      <div>
                        <Label className="text-muted-foreground text-xs">Payment Date</Label>
                        <p className="font-medium">{viewingPayment.paymentDate}</p>
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
