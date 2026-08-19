'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  MessageSquare,
  Phone,
  Mail,
  MoreHorizontal,
  CheckCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Printer,
  Share2,
  ChevronRight,
  Sparkles,
  Building2,
  Receipt,
  CreditCard,
  Banknote,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BillingService } from '@/services/billing.service'
import { UnitService } from '@/services/unit.service'
import { PDFService } from '@/services/pdf.service'
import { toast } from 'sonner'

const stats = [
  {
    title: 'Total Billed',
    value: '₹12,45,000',
    change: '+12% from last month',
    icon: Receipt,
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
  },
  {
    title: 'Collected',
    value: '₹10,85,000',
    change: '87% collection rate',
    icon: Banknote,
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-100',
  },
  {
    title: 'Pending',
    value: '₹1,60,000',
    change: '24 invoices pending',
    icon: Clock,
    gradient: 'from-orange-500 to-amber-500',
    bgGradient: 'from-orange-50 to-amber-100',
  },
  {
    title: 'Overdue',
    value: '₹45,000',
    change: '8 invoices overdue',
    icon: AlertTriangle,
    gradient: 'from-red-500 to-rose-500',
    bgGradient: 'from-red-50 to-rose-100',
  },
]

const invoices = [
  {
    id: 'INV-2025-001',
    unit: 'A-101',
    block: 'A',
    resident: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    amount: 15000,
    maintenance: 12000,
    utilities: 3000,
    penalty: 0,
    dueDate: '2025-01-05',
    status: 'paid',
    paidDate: '2025-01-03',
    paymentMode: 'UPI',
  },
  {
    id: 'INV-2025-002',
    unit: 'B-205',
    block: 'B',
    resident: 'Priya Sharma',
    phone: '+91 98765 43211',
    amount: 18500,
    maintenance: 12000,
    utilities: 5500,
    penalty: 1000,
    dueDate: '2025-01-05',
    status: 'paid',
    paidDate: '2025-01-04',
    paymentMode: 'Net Banking',
  },
  {
    id: 'INV-2025-003',
    unit: 'C-304',
    block: 'C',
    resident: 'Amit Patel',
    phone: '+91 98765 43212',
    amount: 16200,
    maintenance: 12000,
    utilities: 4200,
    penalty: 0,
    dueDate: '2025-01-05',
    status: 'pending',
    paidDate: null,
    paymentMode: null,
  },
  {
    id: 'INV-2025-004',
    unit: 'A-502',
    block: 'A',
    resident: 'Neha Gupta',
    phone: '+91 98765 43213',
    amount: 24500,
    maintenance: 12000,
    utilities: 4500,
    penalty: 8000,
    dueDate: '2024-12-20',
    status: 'overdue',
    paidDate: null,
    paymentMode: null,
  },
  {
    id: 'INV-2025-005',
    unit: 'D-108',
    block: 'D',
    resident: 'Vikram Singh',
    phone: '+91 98765 43214',
    amount: 14500,
    maintenance: 12000,
    utilities: 2500,
    penalty: 0,
    dueDate: '2025-01-05',
    status: 'pending',
    paidDate: null,
    paymentMode: null,
  },
  {
    id: 'INV-2025-006',
    unit: 'B-301',
    block: 'B',
    resident: 'Sunita Verma',
    phone: '+91 98765 43215',
    amount: 19000,
    maintenance: 12000,
    utilities: 7000,
    penalty: 0,
    dueDate: '2025-01-05',
    status: 'pending',
    paidDate: null,
    paymentMode: null,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

const formatUnit = (unit: any) => {
  if (!unit) return '';
  if (typeof unit === 'object') {
    return `${unit.block}-${unit.number}`;
  }
  return unit;
};

const formatResident = (resident: any) => {
  if (!resident) return '';
  if (typeof resident === 'object') {
    return resident.name;
  }
  return resident;
};

const getResidentPhone = (resident: any) => {
  if (typeof resident === 'object' && resident) {
    return resident.phone;
  }
  return null;
};

function SendWhatsAppButton({ invoice }: { invoice: any }) {
  const unitStr = formatUnit(invoice.unit);
  const residentName = formatResident(invoice.resident);
  const message = `Dear ${residentName},

Your maintenance bill for ${unitStr} is ${invoice.status === 'overdue' ? 'OVERDUE' : 'due'}.

Invoice: ${invoice.id}
Amount: ₹${invoice.amount.toLocaleString()}
Due Date: ${invoice.dueDate}
${invoice.penalty > 0 ? `Penalty: ₹${invoice.penalty.toLocaleString()}` : ''}

Please pay at your earliest convenience to avoid additional penalties.

Thank you,
SocietyHub Management`

  const phone = invoice.phone || getResidentPhone(invoice.resident) || '';
  const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
      onClick={() => window.open(whatsappUrl, '_blank')}
      title="Send via WhatsApp"
    >
      <MessageSquare className="h-4 w-4" />
    </Button>
  )
}

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [blockFilter, setBlockFilter] = useState('all')
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [viewInvoice, setViewInvoice] = useState<any | null>(null)
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [isBulkGenerateDialogOpen, setIsBulkGenerateDialogOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState<string | null>(null)

  // Form State for Single Invoice Creation
  const [newInvoice, setNewInvoice] = useState({
    unitId: '',
    amount: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
    description: ''
  });

  // Form State for Bulk Generation
  const [bulkConfig, setBulkConfig] = useState({
    month: new Date().toLocaleString('en-US', { month: 'short' }).toLowerCase() + '-' + new Date().getFullYear(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
    block: 'all',
    maintenanceAmount: '',
    utilityAmount: ''
  });

  // Fetch units for dropdown
  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: UnitService.getUnits
  });
  const queryClient = useQueryClient();

  // Fetch billing stats
  const { data: billingStats, isLoading: statsLoading } = useQuery({
    queryKey: ['billing-stats'],
    queryFn: BillingService.getStats
  });

  // Fetch invoices
  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ['invoices', statusFilter, blockFilter, searchQuery],
    queryFn: () => BillingService.getInvoices({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      block: blockFilter !== 'all' ? blockFilter : undefined,
      search: searchQuery || undefined
    })
  });

  // Create single invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: BillingService.createInvoice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-stats'] });
      setIsGenerateDialogOpen(false);
      // Reset form
      setNewInvoice({
        unitId: '',
        amount: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
        description: ''
      });
      toast.success('Invoice created successfully');
    }
  });

  // Bulk generate bills mutation
  const generateBillsMutation = useMutation({
    mutationFn: BillingService.generateInvoices,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-stats'] });
      setIsBulkGenerateDialogOpen(false);
      toast.success(data.message || 'Bills generated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to generate bills');
    }
  });

  // Pay invoice mutation
  const payMutation = useMutation({
    mutationFn: ({ no, mode }: { no: string, mode: string }) => BillingService.payInvoice(no, mode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['billing-stats'] });
      showNotification('Invoice marked as paid!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark invoice as paid');
    }
  });

  const showNotification = (message: string) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleCreateInvoice = () => {


    const amount = parseFloat(newInvoice.amount);

    if (!newInvoice.unitId || isNaN(amount) || amount <= 0 || !newInvoice.issueDate || !newInvoice.dueDate) {
      console.warn('Validation failed:', {
        unitId: !!newInvoice.unitId,
        amount: !isNaN(amount) && amount > 0,
        issueDate: !!newInvoice.issueDate,
        dueDate: !!newInvoice.dueDate
      });
      toast.error('Please fill in all required fields with valid values');
      return;
    }

    createInvoiceMutation.mutate({
      unitId: newInvoice.unitId,
      amount,
      issueDate: newInvoice.issueDate,
      dueDate: newInvoice.dueDate,
      description: newInvoice.description
    });
  }

  const handleBulkGenerate = () => {
    if (!bulkConfig.month || !bulkConfig.dueDate) {
      toast.error('Please fill in required fields');
      return;
    }

    generateBillsMutation.mutate({
      month: bulkConfig.month,
      dueDate: bulkConfig.dueDate,
      block: bulkConfig.block === 'all' ? undefined : bulkConfig.block,
      maintenanceAmount: parseFloat(bulkConfig.maintenanceAmount || '0'),
      utilityAmount: parseFloat(bulkConfig.utilityAmount || '0')
    });
  }

  const handleExport = () => {
    if (!invoicesData || invoicesData.length === 0) {
      toast.error('No invoices to export')
      return
    }

    const headers = ['Invoice ID', 'Unit', 'Resident', 'Amount', 'Maintenance', 'Utilities', 'Penalty', 'Status', 'Due Date', 'Paid Date', 'Payment Mode']
    const csvContent = [
      headers.join(','),
      ...invoicesData.map((inv: any) => [
        inv.id,
        `${formatUnit(inv.unit)}`,
        `"${formatResident(inv.resident)}"`,
        inv.amount,
        inv.maintenance,
        inv.utilities,
        inv.penalty,
        inv.status,
        inv.dueDate,
        inv.paidDate || '',
        inv.paymentMode || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    showNotification('Data exported successfully!')
  }

  const handleBulkWhatsApp = () => {
    showNotification(`WhatsApp sent to ${selectedInvoices.length} residents!`)
  }

  const handleBulkEmail = () => {
    showNotification(`Email sent to ${selectedInvoices.length} residents!`)
  }

  const handleBulkDownload = () => {
    if (selectedInvoices.length === 0) {
      toast.error('No invoices selected');
      return;
    }

    selectedInvoices.forEach((id) => {
      const invoice = invoicesData?.find((inv: any) => String(inv.id) === String(id));
      if (invoice) {
        PDFService.generateInvoicePDF(invoice);
      }
    });

    showNotification(`Downloading ${selectedInvoices.length} invoices as PDF...`);
  }

  const handleMarkAsPaid = (invoiceNo: string) => {
    payMutation.mutate({ no: invoiceNo, mode: 'CASH' });
  }

  const filteredInvoices = invoicesData || []

  const toggleSelect = (id: string) => {
    setSelectedInvoices(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([])
    } else {
      setSelectedInvoices(filteredInvoices.map((i: any) => i.id))
    }
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 p-1"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f]">
                Billing Management
              </h1>
            </div>
            <p className="text-gray-500">
              Generate invoices, track payments, and send reminders
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="text-xs sm:text-sm">
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Dialog open={isBulkGenerateDialogOpen} onOpenChange={setIsBulkGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 text-xs sm:text-sm">
                  <Sparkles className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Generate Monthly Bills</span>
                  <span className="sm:hidden">Generate</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Generate Monthly Bills</DialogTitle>
                  <DialogDescription>
                    Automatically calculate and generate bills for all units based on your set rules.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Billing Month</Label>
                    <Input
                      placeholder="e.g. feb-2025"
                      value={bulkConfig.month}
                      onChange={(e) => setBulkConfig({ ...bulkConfig, month: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={bulkConfig.dueDate}
                      onChange={(e) => setBulkConfig({ ...bulkConfig, dueDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Block (Optional)</Label>
                    <Select
                      value={bulkConfig.block}
                      onValueChange={(val) => setBulkConfig({ ...bulkConfig, block: val })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Blocks</SelectItem>
                        <SelectItem value="A">Block A</SelectItem>
                        <SelectItem value="B">Block B</SelectItem>
                        <SelectItem value="C">Block C</SelectItem>
                        <SelectItem value="D">Block D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Maintenance Amount (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={bulkConfig.maintenanceAmount}
                        onChange={(e) => setBulkConfig({ ...bulkConfig, maintenanceAmount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Utility Amount (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={bulkConfig.utilityAmount}
                        onChange={(e) => setBulkConfig({ ...bulkConfig, utilityAmount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700 flex gap-2 items-start">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <p>This will use the maintenance and charge rules configured in "Billing Setup" to generate bills for all units in one click.</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBulkGenerateDialogOpen(false)}>Cancel</Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleBulkGenerate}
                    disabled={generateBillsMutation.isPending}
                  >
                    {generateBillsMutation.isPending ? 'Generating...' : 'Generate Bills Now'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-xs sm:text-sm">
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Manual Invoice</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Invoice</DialogTitle>
                  <DialogDescription>
                    Generate a new invoice for a unit
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Unit Number</Label>
                      <Select
                        value={newInvoice.unitId}
                        onValueChange={(val) => setNewInvoice({ ...newInvoice, unitId: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {units && units.length > 0 ? (
                            units.map((u: any) => (
                              <SelectItem key={u.id} value={u.id.toString()}>{`${u.block}-${u.number}`}</SelectItem>
                            ))
                          ) : (
                            <>
                              <SelectItem value="1">A-101</SelectItem>
                              <SelectItem value="2">A-102</SelectItem>
                              <SelectItem value="3">B-101</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount (₹)</Label>
                      <Input
                        type="number"
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Issue Date</Label>
                      <Input
                        type="date"
                        value={newInvoice.issueDate}
                        onChange={(e) => setNewInvoice({ ...newInvoice, issueDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={newInvoice.dueDate}
                        onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                      placeholder="Enter description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>Cancel</Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleCreateInvoice}
                    disabled={createInvoiceMutation.isPending}
                  >
                    {createInvoiceMutation.isPending ? 'Creating...' : 'Create Invoice'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div >
        </motion.div >

        {/* Stats */}
        < motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" >
          {
            stats.map((stat, index) => {
              const Icon = stat.icon
              let value = stat.value;
              let change = stat.change;

              // Use live data if available
              if (!statsLoading && billingStats) {
                if (stat.title === 'Total Billed') {
                  value = `₹${(billingStats.totalBilled || 0).toLocaleString()}`;
                } else if (stat.title === 'Collected') {
                  value = `₹${(billingStats.collected || 0).toLocaleString()}`;
                  const rate = billingStats.totalBilled > 0
                    ? ((billingStats.collected / billingStats.totalBilled) * 100).toFixed(0)
                    : 0;
                  change = `${rate}% collection rate`;
                } else if (stat.title === 'Pending') {
                  value = `₹${(billingStats.pending || 0).toLocaleString()}`;
                  change = `${billingStats.pendingCount || 0} invoices pending`;
                } else if (stat.title === 'Overdue') {
                  value = `₹${(billingStats.overdue || 0).toLocaleString()}`;
                  change = `${billingStats.overdueCount || 0} invoices overdue`;
                }
              }

              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
                    <CardContent className="p-5 relative">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                            {statsLoading ? '...' : value}
                          </h3>
                          <p className="text-xs text-gray-500">{statsLoading ? 'Loading...' : change}</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          }
        </motion.div >

        {/* Tabs */}
        < motion.div variants={itemVariants} >
          <Tabs
            value={statusFilter === 'all' ? 'invoices' : statusFilter}
            onValueChange={(value) => setStatusFilter(value === 'invoices' ? 'all' : value)}
            className="space-y-4"
          >
            <div className="flex flex-col gap-4">
              <div className="overflow-x-auto -mx-1 px-1">
                <TabsList className="bg-gray-100 w-max sm:w-auto p-1">
                  <TabsTrigger value="invoices" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm data-[state=active]:border-teal-500 border-2 border-transparent">All Invoices</TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm data-[state=active]:border-teal-500 border-2 border-transparent">Pending</TabsTrigger>
                  <TabsTrigger value="overdue" className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm data-[state=active]:border-teal-500 border-2 border-transparent">Overdue</TabsTrigger>
                </TabsList>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-10 w-full sm:w-48"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-24 sm:w-32 text-xs sm:text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={blockFilter} onValueChange={setBlockFilter}>
                  <SelectTrigger className="w-24 sm:w-32 text-xs sm:text-sm">
                    <SelectValue placeholder="Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Blocks</SelectItem>
                    <SelectItem value="A">Block A</SelectItem>
                    <SelectItem value="B">Block B</SelectItem>
                    <SelectItem value="C">Block C</SelectItem>
                    <SelectItem value="D">Block D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {/* Bulk Actions */}
              {selectedInvoices.length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="text-sm font-medium text-blue-700">
                    {selectedInvoices.length} selected
                  </span>
                  <div className="flex-1" />
                  <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={handleBulkWhatsApp}>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    WhatsApp All
                  </Button>
                  <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={handleBulkEmail}>
                    <Mail className="h-4 w-4 mr-1" />
                    Email All
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleBulkDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
              )}

              {/* Invoices Table */}
              <Card className="border-0 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                            onCheckedChange={selectAll}
                          />
                        </TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Unit / Resident</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoicesLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Clock className="h-5 w-5 animate-spin text-blue-500" />
                              Loading invoices...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                            No invoices found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices.map((invoice: any) => (
                          <TableRow key={invoice.id} className="hover:bg-gray-50">
                            <TableCell>
                              <Checkbox
                                checked={selectedInvoices.includes(invoice.id)}
                                onCheckedChange={() => toggleSelect(invoice.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${invoice.status === 'paid' ? 'bg-green-100' :
                                  invoice.status === 'overdue' ? 'bg-red-100' : 'bg-orange-100'
                                  }`}>
                                  <Receipt className={`h-4 w-4 ${invoice.status === 'paid' ? 'text-green-600' :
                                    invoice.status === 'overdue' ? 'text-red-600' : 'text-orange-600'
                                    }`} />
                                </div>
                                <span className="font-medium text-sm">{invoice.id}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">{formatUnit(invoice.unit)}</Badge>
                                  <span className="font-medium text-sm">{formatResident(invoice.resident)}</span>
                                </div>
                                <span className="text-xs text-gray-500">{invoice.phone || getResidentPhone(invoice.resident) || ''}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div>
                                <span className="font-bold">₹{invoice.amount.toLocaleString()}</span>
                                {invoice.penalty > 0 && (
                                  <p className="text-xs text-red-500">+₹{invoice.penalty} penalty</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{invoice.dueDate}</span>
                            </TableCell>
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
                                {invoice.status === 'paid' && <CheckCircle className="h-3 w-3 mr-1" />}
                                {invoice.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                                {invoice.status === 'overdue' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setViewInvoice(invoice)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <SendWhatsAppButton invoice={invoice} />
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setViewInvoice(invoice)}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      const email = invoice.resident?.email || `${formatResident(invoice.resident).toLowerCase().replace(' ', '.')}@email.com`;
                                      window.location.href = `mailto:${email}?subject=Invoice ${invoice.id}&body=Dear ${formatResident(invoice.resident)},%0D%0A%0D%0APlease find your invoice ${invoice.id} for amount ₹${invoice.amount.toLocaleString()}.%0D%0A%0D%0AThank you.`
                                    }}>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      const phone = invoice.phone || getResidentPhone(invoice.resident) || '';
                                      window.location.href = `tel:${phone.replace(/[^0-9]/g, '')}`
                                    }}>
                                      <Phone className="h-4 w-4 mr-2" />
                                      Call Resident
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => {
                                      window.print();
                                      showNotification(`Printing invoice ${invoice.invoiceNo}...`)
                                    }}>
                                      <Printer className="h-4 w-4 mr-2" />
                                      Print Invoice
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                      PDFService.generateInvoicePDF(invoice);
                                      showNotification(`Downloading PDF for invoice ${invoice.invoiceNo}...`);
                                    }}>
                                      <Download className="h-4 w-4 mr-2" />
                                      Download PDF
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {invoice.status !== 'paid' && (
                                      <DropdownMenuItem className="text-green-600" onClick={() => handleMarkAsPaid(invoice.invoiceNo)}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark as Paid
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </Tabs>
        </motion.div >

        {/* Invoice Detail Dialog */}
        < Dialog open={!!viewInvoice
        } onOpenChange={() => setViewInvoice(null)}>
          <DialogContent className="max-w-lg">
            {viewInvoice && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Invoice {viewInvoice.id}</span>
                    <Badge
                      className={
                        viewInvoice.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : viewInvoice.status === 'overdue'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                      }
                    >
                      {viewInvoice.status}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {formatResident(viewInvoice.resident).split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{formatResident(viewInvoice.resident)}</p>
                        <p className="text-sm text-gray-500">Unit {formatUnit(viewInvoice.unit)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{viewInvoice.phone || getResidentPhone(viewInvoice.resident)}</p>
                  </div>

                  <div className="space-y-0 text-sm">
                    <p className="font-semibold text-gray-700 mb-2 uppercase text-xs tracking-wider">Charge Breakdown</p>

                    {/* Maintenance Charges */}
                    {(viewInvoice.maintenance > 0 || !viewInvoice.items?.length) && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Maintenance Charges</span>
                        <span className="font-medium text-gray-900">₹{viewInvoice.maintenance.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Utility Charges */}
                    {viewInvoice.utilities > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Utility Charges</span>
                        <span className="font-medium text-gray-900">₹{viewInvoice.utilities.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Additional Items Breakdown */}
                    {viewInvoice.items && viewInvoice.items.length > 0 && (
                      viewInvoice.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">{item.name}</span>
                          <span className="font-medium text-gray-900">₹{item.amount.toLocaleString()}</span>
                        </div>
                      ))
                    )}

                    {/* Late Fee / Penalty */}
                    {viewInvoice.penalty > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-100 text-red-600">
                        <span>Late Fee / Penalty</span>
                        <span className="font-medium">₹{viewInvoice.penalty.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-4 text-lg font-bold text-blue-900 border-t-2 border-blue-100 mt-2">
                      <span>Total Payable</span>
                      <span>₹{viewInvoice.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline" onClick={() => {
                      const message = `Invoice ${viewInvoice.id} - Amount: ₹${viewInvoice.amount.toLocaleString()}`
                      const phone = viewInvoice.phone || getResidentPhone(viewInvoice.resident) || ''
                      window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
                      showNotification('WhatsApp opened!')
                    }}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button className="flex-1" variant="outline" onClick={() => showNotification(`Email sent to ${formatResident(viewInvoice.resident)}!`)}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button className="flex-1" variant="outline" onClick={() => {
                      PDFService.generateInvoicePDF(viewInvoice);
                      showNotification('PDF downloaded!');
                    }}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog >
      </motion.div >
    </RoleGuard >
  )
}
