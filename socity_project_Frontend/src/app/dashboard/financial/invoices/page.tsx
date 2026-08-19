'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  Trash2,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  MessageSquare,
  Mail,
  Printer,
  MoreHorizontal,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BillingService } from '@/services/billing.service'
import { UnitService } from '@/services/unit.service'
import { PDFService } from '@/services/pdf.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

// --- Formatting Helpers to safe-guard against Object Rendering Errors ---
const formatUnit = (unit: any) => {
  if (!unit) return 'N/A';
  if (typeof unit === 'object') {
    return `${unit.block}-${unit.number}`;
  }
  return unit;
};

const formatResident = (resident: any) => {
  if (!resident) return 'N/A';
  if (typeof resident === 'object') {
    return resident.name || 'Unknown';
  }
  return resident;
};

const getResidentPhone = (resident: any) => {
  if (typeof resident === 'object' && resident) {
    return resident.phone;
  }
  return null;
};

export default function InvoicesPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewInvoice, setViewInvoice] = useState<any>(null)
  const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null)

  // 1. Fetch Stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['billing-stats'],
    queryFn: BillingService.getStats
  })

  // 2. Fetch Invoices
  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => BillingService.getInvoices({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchQuery || undefined
    })
  })

  // 3. Fetch Units (for Create Dialog)
  const { data: unitsData } = useQuery({
    queryKey: ['units'],
    queryFn: UnitService.getUnits,
    enabled: isCreateDialogOpen
  })

  // 4. Create Invoice Mutation
  const createInvoiceMutation = useMutation({
    mutationFn: BillingService.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['billing-stats'] })
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] })
      queryClient.invalidateQueries({ queryKey: ['defaulters'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
      setIsCreateDialogOpen(false)
      toast.success('Invoice created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create invoice')
    }
  })

  // 5. Delete Invoice Mutation
  const deleteInvoiceMutation = useMutation({
    mutationFn: BillingService.deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['billing-stats'] })
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] })
      queryClient.invalidateQueries({ queryKey: ['defaulters'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
      toast.success('Invoice deleted successfully')
      setInvoiceToDelete(null)
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || error.message || 'Failed to delete invoice'
      toast.error(message)
    }
  })

  // 6. Handle Export
  const handleExport = () => {
    if (!invoicesData || invoicesData.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Create CSV content
    const headers = ['Invoice ID', 'Unit', 'Resident', 'Amount', 'Issue Date', 'Due Date', 'Status'];
    const rows = invoicesData.map((inv: any) => [
      inv.id,
      formatUnit(inv.unit),
      formatResident(inv.resident),
      inv.amount,
      inv.issueDate ? format(new Date(inv.issueDate), 'yyyy-MM-dd') : '',
      inv.dueDate ? format(new Date(inv.dueDate), 'yyyy-MM-dd') : '',
      inv.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map((row: any[]) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `invoices_export_${format(new Date(), 'yyyyMMdd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Export downloaded');
  }

  // 7. Apply Late Fees Mutation
  const applyLateFeesMutation = useMutation({
    mutationFn: BillingService.applyLateFees,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['billing-stats'] })
      queryClient.invalidateQueries({ queryKey: ['invoice-stats'] })
      queryClient.invalidateQueries({ queryKey: ['defaulters'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
      toast.success(data.message || 'Late fees applied successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || error.message || 'Failed to apply late fees')
    }
  })

  // Helper to construct Stats Array
  const stats = [
    {
      title: 'Total Invoices',
      value: statsData?.totalInvoices || 0,
      change: 'Lifetime',
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: 'Paid',
      value: statsData?.paidInvoices || 0,
      change: `₹${statsData?.totalCollection?.toLocaleString() || 0}`,
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Pending',
      value: statsData?.pendingInvoices || 0,
      change: `₹${statsData?.pendingAmount?.toLocaleString() || 0}`,
      icon: Calendar,
      color: 'orange',
    },
    {
      title: 'Overdue',
      value: statsData?.overdueInvoices || 0,
      change: 'Action Needed',
      icon: Users,
      color: 'red',
    },
  ]

  const invoices = invoicesData || []

  const filteredInvoices = invoices.filter((invoice: any) => {
    const unitStr = formatUnit(invoice.unit).toLowerCase();
    const residentStr = formatResident(invoice.resident).toLowerCase();
    const idStr = String(invoice.id).toLowerCase();
    const query = searchQuery.toLowerCase();

    return unitStr.includes(query) || residentStr.includes(query) || idStr.includes(query);
  })

  // Dialog Form State
  const [formData, setFormData] = useState({
    unitId: '',
    amount: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(new Date().setDate(new Date().getDate() + 15)), 'yyyy-MM-dd'),
    description: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.unitId || !formData.amount) {
      toast.error('Please fill required fields')
      return;
    }
    createInvoiceMutation.mutate({
      unitId: formData.unitId,
      amount: Number(formData.amount),
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      description: formData.description
    })
  }

  return (
    <RoleGuard allowedRoles={['admin']}>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all society invoices
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="space-x-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
            <Button 
              variant="outline" 
              className="text-orange-600 border-orange-200 hover:bg-orange-50 space-x-2"
              onClick={() => {
                if(confirm('Are you sure you want to calculate and apply late fees to all overdue invoices?')) {
                  applyLateFeesMutation.mutate()
                }
              }}
              disabled={applyLateFeesMutation.isPending}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>{applyLateFeesMutation.isPending ? 'Applying...' : 'Apply Late Fees'}</span>
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Invoice</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>
                    Generate a new invoice for a unit
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Unit Number</Label>
                      <Select value={formData.unitId} onValueChange={(val) => setFormData({ ...formData, unitId: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {unitsData?.map((unit: any) => (
                            <SelectItem key={unit.id} value={String(unit.id)}>
                              {unit.block}-{unit.number} ({unit.owner?.name || 'Vacant'})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount (₹)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 5000"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Issue Date</Label>
                      <Input
                        type="date"
                        value={formData.issueDate}
                        onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="e.g. Monthly maintenance charge"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={createInvoiceMutation.isPending}>
                      {createInvoiceMutation.isPending ? 'Creating...' : 'Create Invoice'}
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
                        {statsLoading ? <Skeleton className="h-8 w-20" /> : stat.value}
                      </h3>
                      <p className={`text-sm mt-1 ${stat.color === 'red' ? 'text-red-600' : 'text-green-600'}`}>
                        {stat.change}
                      </p>
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
                placeholder="Search by unit, resident, or invoice number..."
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
          </div>
        </Card>

        {/* Invoices Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Resident</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoicesLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No invoices found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice: any) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">#{invoice.id}</TableCell>
                    <TableCell>{formatUnit(invoice.unit)}</TableCell>
                    <TableCell>{formatResident(invoice.resident)}</TableCell>
                    <TableCell className="font-semibold">
                      ₹{invoice.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{invoice.issueDate ? format(new Date(invoice.issueDate), 'dd MMM yyyy') : '-'}</TableCell>
                    <TableCell>{invoice.dueDate ? format(new Date(invoice.dueDate), 'dd MMM yyyy') : '-'}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : invoice.status === 'overdue'
                              ? 'bg-red-100 text-red-700 hover:bg-red-100'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View"
                          onClick={() => setViewInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Download PDF"
                          onClick={() => {
                            PDFService.generateInvoicePDF(invoice);
                            toast.success('Invoice downloaded');
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Send WhatsApp"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => {
                            const message = `Dear ${formatResident(invoice.resident)}, your invoice #${invoice.invoiceNo || invoice.id} for ₹${invoice.amount.toLocaleString()} is ${invoice.status.toUpperCase()}. Due date: ${invoice.dueDate}. Please pay to avoid penalties.`
                            const phone = invoice.phone || getResidentPhone(invoice.resident) || ''
                            window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setInvoiceToDelete(invoice)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )))}
            </TableBody>
          </Table>
        </Card>

        {/* View Invoice Dialog */}
        <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
          <DialogContent className="max-w-md">
            {viewInvoice && (
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Invoice #{viewInvoice.id}</DialogTitle>
                  <DialogDescription>Details for {formatUnit(viewInvoice.unit)}</DialogDescription>
                </DialogHeader>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-lg">₹{viewInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <Badge variant={viewInvoice.status === 'paid' ? 'default' : 'secondary'}>{viewInvoice.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Issue Date</span>
                    <span>{viewInvoice.issueDate ? format(new Date(viewInvoice.issueDate), 'dd MMM yyyy') : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Due Date</span>
                    <span>{viewInvoice.dueDate ? format(new Date(viewInvoice.dueDate), 'dd MMM yyyy') : '-'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Resident Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Name:</div>
                    <div>{formatResident(viewInvoice.resident)}</div>
                    <div className="text-gray-500">Phone:</div>
                    <div>{viewInvoice.phone || getResidentPhone(viewInvoice.resident) || 'N/A'}</div>
                  </div>
                </div>

                {viewInvoice.items && viewInvoice.items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium border-b pb-1">Invoice Breakdown</h4>
                    <div className="space-y-1">
                      {viewInvoice.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600 truncate mr-4">{item.name}</span>
                          <span className="font-medium whitespace-nowrap">₹{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm pt-2 border-t mt-2 font-bold">
                        <span>Grand Total</span>
                        <span>₹{viewInvoice.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline" onClick={() => {
                    PDFService.generateInvoicePDF(viewInvoice);
                    toast.success('PDF downloaded');
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={() => {
                    window.print();
                  }}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!invoiceToDelete} onOpenChange={() => setInvoiceToDelete(null)}>
          <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
            <div className="bg-red-50 p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse shadow-inner">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-900 tracking-tight">Destructive Action</h3>
              <p className="text-red-700 mt-4 text-sm leading-relaxed max-w-[280px]">
                Are you sure you want to delete invoice <span className="font-extrabold text-red-900 underline decoration-2 offset-2">#{invoiceToDelete?.invoiceNo || invoiceToDelete?.id}</span>?
                <br />
                <span className="opacity-75 italic mt-2 block">This record will be permanently purged from all reports.</span>
              </p>
            </div>

            <div className="p-6 bg-white flex justify-end gap-3 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setInvoiceToDelete(null)}
                className="hover:bg-gray-50 border-gray-200 transition-all duration-200 px-6"
              >
                No, Keep Record
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteInvoiceMutation.mutate(invoiceToDelete.id)}
                className="bg-red-600 hover:bg-red-700 px-8 font-bold shadow-lg shadow-red-200 hover:shadow-red-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Yes, Delete Permanent
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
