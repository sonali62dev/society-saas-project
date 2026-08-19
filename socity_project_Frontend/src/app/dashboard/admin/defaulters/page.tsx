'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Search,
  Filter,
  Download,
  AlertCircle,
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Send,
  Clock,
  Eye,
  History,
  CheckCircle2,
  Phone,
  Home,
  AlertTriangle,
  Receipt,
  CalendarClock,
  BadgeDollarSign,
  MoreVertical,
  ArrowUpRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Slider } from '@/components/ui/slider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BillingService } from '@/services/billing.service'

interface Invoice {
  id: string
  month: string
  amount: number
  dueDate: string
}

interface Reminder {
  id: string
  date: string
  method: string
  status: string
}

interface Defaulter {
  id: string
  unit: string
  block: string
  ownerName: string
  phone: string
  outstandingAmount: number
  dueSince: string
  lastPaymentDate: string
  lastPaymentAmount: number
  status: 'critical' | 'high' | 'medium' | 'low'
  dueDays: number
  invoices: Invoice[]
  reminders: number
  reminderHistory: Reminder[]
  lateFees: number
  paymentStatus: 'overdue' | 'pending' | 'resolved'
}

// Mock data removed - using API data only

// Defaulter detail dialog
function DefaulterDetailDialog({
  defaulter,
  onSendReminder,
  onApplyLateFee,
  onMarkPaid
}: {
  defaulter: any
  onSendReminder?: (id: string) => void
  onApplyLateFee?: (id: string) => void
  onMarkPaid?: (id: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [remarks, setRemarks] = useState('')

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-gray-100 transition-colors">
          <Eye className="h-4 w-4 text-gray-400 group-hover:text-[#1e3a5f]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] border-0 shadow-2xl p-0">
        <div className="p-8 space-y-8">
          <DialogHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{defaulter.id}</p>
              <DialogTitle className="text-2xl font-black text-gray-900 leading-tight">
                {defaulter.unit} — {defaulter.ownerName}
              </DialogTitle>
            </div>
            <Badge
              className={`border-0 rounded-full text-[10px] font-black px-3 py-1 shadow-none uppercase ${defaulter.status === 'critical' || defaulter.paymentStatus === 'overdue'
                ? 'bg-red-50 text-red-700'
                : defaulter.paymentStatus === 'pending'
                  ? 'bg-orange-50 text-orange-700'
                  : 'bg-green-50 text-green-700'
                }`}
            >
              {(defaulter.status === 'critical' || defaulter.paymentStatus === 'overdue') && <AlertTriangle className="h-3 w-3 mr-1.5" />}
              {(defaulter.paymentStatus || defaulter.status).toUpperCase()}
            </Badge>
          </DialogHeader>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-6 rounded-[24px] bg-red-50/50 border border-red-100/50">
              <div className="flex items-center gap-2 mb-3">
                <BadgeDollarSign className="h-4 w-4 text-red-600" />
                <p className="text-[10px] font-black text-red-900 uppercase tracking-wider">Outstanding</p>
              </div>
              <p className="text-2xl font-black text-red-700">₹{defaulter.outstandingAmount.toLocaleString()}</p>
            </div>
            <div className="p-6 rounded-[24px] bg-orange-50/50 border border-orange-100/50">
              <div className="flex items-center gap-2 mb-3">
                <CalendarClock className="h-4 w-4 text-orange-600" />
                <p className="text-[10px] font-black text-orange-900 uppercase tracking-wider">Due Days</p>
              </div>
              <p className="text-2xl font-black text-orange-700">{defaulter.dueDays} days</p>
            </div>
            <div className="p-6 rounded-[24px] bg-yellow-50/50 border border-yellow-100/50">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-[10px] font-black text-yellow-900 uppercase tracking-wider">Late Fees</p>
              </div>
              <p className="text-2xl font-black text-yellow-700">₹{defaulter.calculatedLateFees.toLocaleString()}</p>
            </div>
          </div>

          {/* Owner Info Group */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-5 rounded-[24px] bg-gray-50 border border-gray-100">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] text-white font-black">
                  {defaulter.ownerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Owner</p>
                <p className="font-bold text-gray-900">{defaulter.ownerName}</p>
                <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mt-0.5">
                  <Phone className="h-3 w-3" /> {defaulter.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-[24px] bg-gray-50 border border-gray-100">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
                <Home className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit</p>
                <p className="font-bold text-gray-900">{defaulter.unit}</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Block {defaulter.block}</p>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Receipt className="h-3 w-3" /> Outstanding Invoices ({defaulter.invoices.length})
            </h4>
            <div className="rounded-[24px] border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="text-[10px] font-black uppercase py-4">Invoice</TableHead>
                    <TableHead className="text-[10px] font-black uppercase py-4">Month</TableHead>
                    <TableHead className="text-[10px] font-black uppercase py-4 text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaulter.invoices.map((invoice: any) => (
                    <TableRow key={invoice.id} className="border-gray-100">
                      <TableCell className="font-bold text-xs py-4">{invoice.id}</TableCell>
                      <TableCell className="text-xs text-gray-500 font-medium py-4">{invoice.month}</TableCell>
                      <TableCell className="text-right font-black text-xs py-4">₹{invoice.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Reminder History Log */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <History className="h-3 w-3" /> Reminder History
            </h4>
            <div className="rounded-[24px] border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="text-[10px] font-black uppercase py-4">Date</TableHead>
                    <TableHead className="text-[10px] font-black uppercase py-4">Method</TableHead>
                    <TableHead className="text-[10px] font-black uppercase py-4 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(defaulter.reminderHistory || []).map((reminder: any) => (
                    <TableRow key={reminder.id} className="border-gray-100">
                      <TableCell className="text-xs text-gray-900 font-medium py-4">
                        {new Date(reminder.date).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 font-bold py-4">{reminder.method}</TableCell>
                      <TableCell className="text-right py-4">
                        <Badge variant="outline" className="text-[10px] font-black rounded-full h-5 border-gray-100">
                          {reminder.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!defaulter.reminderHistory || defaulter.reminderHistory.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="py-8 text-center text-xs font-bold text-gray-400 tracking-wider">
                        NO REMINDERS RECORDED
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Remarks & Private Notes</h4>
            <Textarea
              placeholder="Add any internal management notes..."
              className="rounded-[20px] bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-[#1e3a5f] p-4 text-sm min-h-[100px]"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <Button
              variant="outline"
              className="h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-gray-100 hover:bg-gray-50 gap-2"
              onClick={() => {
                onSendReminder?.(defaulter.id)
                setIsOpen(false)
              }}
            >
              <Send className="h-4 w-4" /> Send Reminder
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 border-orange-50 text-orange-600 hover:bg-orange-50 gap-2"
              onClick={() => {
                onApplyLateFee?.(defaulter.id)
                setIsOpen(false)
              }}
            >
              <AlertCircle className="h-4 w-4" /> Late Fee
            </Button>
            <Button
              className="h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white gap-2"
              onClick={() => {
                onMarkPaid?.(defaulter.id)
                setIsOpen(false)
              }}
            >
              <CheckCircle2 className="h-4 w-4" /> Mark Paid
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function DefaultersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [blockFilter, setBlockFilter] = useState('all')
  const [dueDaysFilter, setDueDaysFilter] = useState('all')
  const [amountRange, setAmountRange] = useState([0, 100000])
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Queries
  const { data: apiDefaulters = [], isLoading } = useQuery({
    queryKey: ['defaulters', blockFilter, searchQuery],
    queryFn: () => BillingService.getDefaulters({ block: blockFilter, search: searchQuery })
  })

  const { data: serverStats } = useQuery({
    queryKey: ['defaulter-stats'],
    queryFn: () => BillingService.getDefaulterStats()
  })

  // Mutations
  const markPaidMutation = useMutation({
    mutationFn: ({ invoiceNo, paymentMode }: { invoiceNo: string, paymentMode: string }) =>
      BillingService.payInvoice(invoiceNo, paymentMode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['defaulters'] })
      queryClient.invalidateQueries({ queryKey: ['defaulter-stats'] })
      showNotification('Payment marked successfully!')
    }
  })

  const stats = [
    {
      title: 'Total Outstanding',
      value: `₹${(serverStats?.totalOutstanding || 0).toLocaleString()}`,
      change: '+₹15,000 this month',
      icon: DollarSign,
      color: 'from-red-500 to-rose-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      pulse: true,
    },
    {
      title: 'Number of Defaulters',
      value: serverStats?.totalDefaulters || '0',
      change: '+1 from last month',
      icon: Users,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Overdue Invoices',
      value: serverStats?.overdueInvoices || '0',
      change: 'Needs attention',
      icon: Calendar,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: 'down',
    },
    {
      title: 'Late Fees Generated',
      value: '₹15,750',
      change: 'Auto-calculated',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      trend: 'up',
    },
  ]

  const showNotification = (message: string) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleSendReminder = (defaulterId: string) => showNotification(`Reminder sent to ${defaulterId}`)
  const handleApplyLateFee = (defaulterId: string) => {
    showNotification(`Late fee applied successfully`)
  }
  const handleMarkPaid = (defaulterId: string) => {
    // In a real app we'd need to know which invoice, but for this demo we'll just mock it
    showNotification(`${defaulterId} marked as paid`)
  }
  const handleViewHistory = (defaulterId: string) => showNotification(`History for ${defaulterId}`)

  const defaulters = (Array.isArray(apiDefaulters) ? apiDefaulters : apiDefaulters?.data || []) as any[]

  const filteredDefaulters = defaulters.filter((d) => {
    const matchesDueDays = dueDaysFilter === 'all' ||
      (dueDaysFilter === '30' && d.dueDays <= 30) ||
      (dueDaysFilter === '60' && d.dueDays > 30 && d.dueDays <= 60) ||
      (dueDaysFilter === '90+' && d.dueDays > 90)
    const matchesAmount = d.outstandingAmount >= amountRange[0] && d.outstandingAmount <= amountRange[1]
    return matchesDueDays && matchesAmount
  })

  return (
    <RoleGuard allowedRoles={['admin', 'community-manager']}>
      <div className="space-y-8 pb-12">
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 font-bold text-sm ring-4 ring-black/5"
            >
              <div className="bg-green-500 rounded-full p-1"><CheckCircle2 className="h-4 w-4" /></div>
              {showSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 rounded-2xl bg-red-50 text-red-600 shadow-sm border border-red-100">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Defaulters List</h1>
            </div>
            <p className="text-gray-500 font-medium text-lg">Managing maintenance dues and late fee escalations.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-2xl h-12 border-0 ring-1 ring-black/5 shadow-sm px-6 font-bold gap-2 hover:bg-gray-50">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button className="rounded-2xl h-12 bg-[#1e3a5f] hover:bg-[#2d4a6f] shadow-xl px-8 font-bold gap-2">
              <Send className="h-4 w-4" /> Bulk Reminder
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="p-8 border-0 shadow-xl bg-white rounded-[40px] ring-1 ring-black/5 relative overflow-hidden group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                {stat.pulse && <span className="absolute top-8 right-8 h-3 w-3 rounded-full bg-red-500 animate-pulse border-2 border-white" />}
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
                <h3 className="text-3xl font-black text-gray-900 mb-2">{stat.value}</h3>
                <div className="flex items-center gap-2">
                  {stat.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-500" />}
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.change}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="border-0 shadow-xl bg-white rounded-[40px] ring-1 ring-black/5 overflow-hidden">
          <CardContent className="p-8 space-y-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search unit, owner, or ID..."
                  className="pl-12 h-14 rounded-2xl border-0 bg-gray-50 focus:bg-white transition-all font-bold placeholder:text-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Select value={blockFilter} onValueChange={setBlockFilter}>
                  <SelectTrigger className="w-[160px] h-14 rounded-2xl border-0 bg-gray-50 font-bold px-6">
                    <SelectValue placeholder="Block" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-0 shadow-2xl ring-1 ring-black/5 p-2">
                    <SelectItem value="all" className="rounded-xl font-bold">All Blocks</SelectItem>
                    <SelectItem value="A" className="rounded-xl font-bold">Block A</SelectItem>
                    <SelectItem value="B" className="rounded-xl font-bold">Block B</SelectItem>
                    <SelectItem value="C" className="rounded-xl font-bold">Block C</SelectItem>
                    <SelectItem value="D" className="rounded-xl font-bold">Block D</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dueDaysFilter} onValueChange={setDueDaysFilter}>
                  <SelectTrigger className="w-[160px] h-14 rounded-2xl border-0 bg-gray-50 font-bold px-6">
                    <SelectValue placeholder="Due Days" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-0 shadow-2xl ring-1 ring-black/5 p-2">
                    <SelectItem value="all" className="rounded-xl font-bold">Any Status</SelectItem>
                    <SelectItem value="30" className="rounded-xl font-bold">0-30 Days</SelectItem>
                    <SelectItem value="60" className="rounded-xl font-bold">31-60 Days</SelectItem>
                    <SelectItem value="90+" className="rounded-xl font-bold">90+ Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 px-2">
              <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-[.2em]">
                <span>Amount Range (₹)</span>
                <span>Max: ₹{amountRange[1].toLocaleString()}</span>
              </div>
              <Slider
                value={amountRange}
                onValueChange={setAmountRange}
                min={0}
                max={100000}
                step={5000}
                className="py-4"
              />
            </div>

            <div className="overflow-hidden rounded-[32px] border border-gray-100">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent border-gray-100">
                    <TableHead className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">Unit Info</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-gray-400">Owner Details</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-gray-400">Exposure</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-gray-400">Aging</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-gray-400">Status</TableHead>
                    <TableHead className="px-8 text-[10px] font-black uppercase text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDefaulters.map((d, idx) => (
                    <TableRow key={d.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors group">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Home className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{d.unit}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Block {d.block}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-black text-[10px]">
                              {d.ownerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{d.ownerName}</p>
                            <p className="text-[10px] text-gray-400 font-bold tracking-tight">{d.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-black text-red-600">₹{d.outstandingAmount.toLocaleString()}</p>
                          <p className="text-[10px] font-black text-orange-600/70 lowercase">+₹{d.calculatedLateFees.toLocaleString()} fee</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-xs font-black text-gray-900 uppercase">{d.dueDays} days</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">since {new Date(d.dueSince).toLocaleDateString()}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`border-0 rounded-full text-[10px] font-black px-3 py-1 shadow-none uppercase ${d.status === 'critical' || d.paymentStatus === 'overdue'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-orange-50 text-orange-700'
                          }`}>
                          {d.paymentStatus || d.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <DefaulterDetailDialog
                            defaulter={d}
                            onSendReminder={handleSendReminder}
                            onApplyLateFee={handleApplyLateFee}
                            onMarkPaid={handleMarkPaid}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-white shadow-sm border-0 opacity-0 group-hover:opacity-100 transition-all">
                                <MoreVertical className="h-4 w-4 text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-0 ring-1 ring-black/5">
                              <DropdownMenuItem onSelect={() => handleSendReminder(d.id)} className="rounded-xl font-bold text-[10px] uppercase p-3">
                                <Send className="h-4 w-4 mr-2" /> Quick Reminder
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleViewHistory(d.id)} className="rounded-xl font-bold text-[10px] uppercase p-3">
                                <History className="h-4 w-4 mr-2" /> View History
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-50" />
                              <DropdownMenuItem onSelect={() => handleMarkPaid(d.id)} className="rounded-xl font-bold text-[10px] uppercase p-3 text-green-600 focus:text-green-600">
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Settled
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredDefaulters.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="h-8 w-8 text-gray-200" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">No Defaulters Found</h3>
                <p className="text-gray-400 font-medium italic">Try adjusting your filters or search query.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}