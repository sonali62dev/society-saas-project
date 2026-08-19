'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MoveRequestService } from '@/services/moveRequestService'
import {
  Truck,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Home,
  User,
  Phone,
  FileText,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Edit,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils/cn'
import { useAuthStore } from '@/lib/stores/auth-store'
import { residentService } from '@/services/resident.service'

// Mock data removed

export default function MoveManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: 'move-in',
    unitId: '',
    residentName: '',
    phone: '',
    email: '',
    scheduledDate: '',
    timeSlot: '',
    vehicleType: '',
    vehicleNumber: '',
    notes: '',
    depositAmount: ''
  })
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const isResident = user?.role?.toLowerCase() === 'resident'

  // Fetch unit data for resident to get unit number
  const { data: unitData } = useQuery({
    queryKey: ['unit-data'],
    queryFn: residentService.getUnitData,
    enabled: isResident
  })

  // Auto-fill resident info when dialog opens
  useEffect(() => {
    if (isCreateDialogOpen && isResident && user) {
      setFormData(prev => ({
        ...prev,
        residentName: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        unitId: unitData?.id?.toString() || unitData?.number || prev.unitId
      }))
    }
  }, [isCreateDialogOpen, isResident, user, unitData])

  // Fetch move requests from backend
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['move-requests'],
    queryFn: () => MoveRequestService.getAll()
  })

  // Transform API data
  const moveRequests = (apiData?.data || []).map((req: any) => ({
    ...req,
    type: req.type ? req.type.replace('_', '-').toLowerCase() : 'move-in', // MOVE_IN -> move-in
    status: req.status ? req.status.toLowerCase() : 'pending', // PENDING -> pending
    nocStatus: req.nocStatus?.toLowerCase() || 'pending',
    depositStatus: req.depositStatus?.toLowerCase() || 'pending',
  }))

  const statsData = apiData?.stats || { total: moveRequests.length, moveIns: moveRequests.filter((r: any) => r.type === 'move-in').length, moveOuts: moveRequests.filter((r: any) => r.type === 'move-out').length, pending: moveRequests.filter((r: any) => r.status === 'pending').length }

  // Filter requests based on tab, status, and search query
  const filteredRequests = moveRequests.filter((req: any) => {
    if (activeTab === 'move-in' && req.type !== 'move-in') return false
    if (activeTab === 'move-out' && req.type !== 'move-out') return false
    if (activeTab === 'pending' && req.status !== 'pending') return false

    if (statusFilter !== 'all' && req.status !== statusFilter) return false

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = req.residentName?.toLowerCase().includes(q)
      const matchUnit = req.unit ? `${req.unit.block}-${req.unit.number}`.toLowerCase().includes(q) : false
      const matchPhone = req.phone?.includes(q)
      const matchId = String(req.id).includes(q)
      if (!matchName && !matchUnit && !matchPhone && !matchId) return false
    }

    return true
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => MoveRequestService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['move-requests'] })
      setIsCreateDialogOpen(false)
      setFormData({
        type: 'move-in',
        unitId: '',
        residentName: '',
        phone: '',
        email: '',
        scheduledDate: '',
        timeSlot: '',
        vehicleType: '',
        vehicleNumber: '',
        notes: '',
        depositAmount: ''
      })
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => MoveRequestService.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['move-requests'] })
      // Close dialog if open? logic depends on UI flow
    }
  })

  const handleApprove = (id: number) => {
    updateStatusMutation.mutate({ id, data: { status: 'APPROVED' } })
  }

  const handleReject = (id: number) => {
    updateStatusMutation.mutate({ id, data: { status: 'REJECTED' } })
  }

  const handleIssueNOC = (id: number) => {
    updateStatusMutation.mutate({ id, data: { nocStatus: 'ISSUED' } })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800"><Calendar className="h-3 w-3 mr-1" /> Scheduled</Badge>
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    return type === 'move-in' ? (
      <Badge className="bg-green-100 text-green-800">
        <ArrowRight className="h-3 w-3 mr-1" /> Move In
      </Badge>
    ) : (
      <Badge className="bg-orange-100 text-orange-800">
        <ArrowLeft className="h-3 w-3 mr-1" /> Move Out
      </Badge>
    )
  }

  const stats = [
    { label: 'Total Requests', value: statsData.total, icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500' },
    { label: 'Move-ins', value: statsData.moveIns, icon: ArrowRight, color: 'text-green-500', bg: 'bg-green-500' },
    { label: 'Move-outs', value: statsData.moveOuts, icon: ArrowLeft, color: 'text-orange-500', bg: 'bg-orange-500' },
    { label: 'Pending Approval', value: statsData.pending, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500' },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-8 w-8 text-orange-600" />
            Move-in/out Management
          </h1>
          <p className="text-gray-600 mt-1">Manage resident move-in and move-out requests</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur hover:bg-white dark:hover:bg-slate-900 transition-all">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d4a6f] hover:scale-105 transition-transform shadow-lg shadow-[#1e3a5f]/20">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Move Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="move-in">Move In</SelectItem>
                        <SelectItem value="move-out">Move Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Unit</label>
                    <Input
                      placeholder="e.g. 101"
                      value={formData.unitId}
                      onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
                      readOnly={isResident}
                      className={isResident ? 'bg-gray-50 text-gray-600' : ''}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Resident Name</label>
                  <Input
                    value={formData.residentName}
                    onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
                    readOnly={isResident}
                    className={isResident ? 'bg-gray-50 text-gray-600' : ''}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      readOnly={isResident}
                      className={isResident ? 'bg-gray-50 text-gray-600' : ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      readOnly={isResident}
                      className={isResident ? 'bg-gray-50 text-gray-600' : ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Slot</label>
                    <Select
                      value={formData.timeSlot}
                      onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</SelectItem>
                        <SelectItem value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</SelectItem>
                        <SelectItem value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Type</label>
                    <Input
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle No.</label>
                    <Input
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                {formData.type === 'move-in' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Security Deposit Amount</label>
                    <Input
                      type="number"
                      placeholder="₹ 0"
                      value={formData.depositAmount}
                      onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                    />
                  </div>
                )}

                <Button className="w-full" onClick={() => createMutation.mutate(formData)}>
                  Create Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 border-0 shadow-xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-slate-800/30 overflow-hidden relative group">
              <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150", stat.bg)} />
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                </div>
                <div className={cn("p-3 rounded-2xl", stat.bg + "/10")}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl">
          <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">All Requests ({moveRequests.length})</TabsTrigger>
          <TabsTrigger value="move-in" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">Move-in ({moveRequests.filter((r: any) => r.type === 'move-in').length})</TabsTrigger>
          <TabsTrigger value="move-out" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">Move-out ({moveRequests.filter((r: any) => r.type === 'move-out').length})</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm">Pending ({moveRequests.filter((r: any) => r.status === 'pending').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="current">
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">This Month</SelectItem>
                  <SelectItem value="next">Next Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Requests Table */}
          <Card className="border-0 shadow-2xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-slate-800/30 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Request ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Resident</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                      <Truck className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">No Move Requests Found</p>
                      <p className="text-xs text-slate-400">There are no move-in or move-out requests matching your criteria.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request: any) => (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono font-medium">{request.id}</TableCell>
                      <TableCell>{getTypeBadge(request.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Home className="h-3 w-3 text-gray-400" />
                          <span className="font-medium">
                            {request.unit ? `${request.unit.block}-${request.unit.number}` : 'No Unit'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.residentName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {request.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(request.scheduledDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </div>
                        <p className="text-xs text-gray-500">{request.timeSlot}</p>
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center justify-between">
                                <span>{request.type === 'move-in' ? 'Move-in' : 'Move-out'} Request - {request.id}</span>
                                {getStatusBadge(request.status)}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Resident Info */}
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <User className="h-4 w-4" /> Resident Details
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-gray-600">Name:</span>
                                    <p className="font-medium">{request.residentName}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Unit:</span>
                                    <p className="font-medium">
                                      {request.unit ? `${request.unit.block}-${request.unit.number}` : 'No Unit'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Phone:</span>
                                    <p>{request.phone}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Email:</span>
                                    <p>{request.email}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Schedule Info */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Scheduled Date:</span>
                                  <p className="font-medium">{new Date(request.scheduledDate).toLocaleDateString('en-IN')}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Time Slot:</span>
                                  <p className="font-medium">{request.timeSlot}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Vehicle:</span>
                                  <p className="font-medium">{request.vehicleType}</p>
                                  <p className="text-xs text-gray-500">{request.vehicleNumber}</p>
                                </div>
                              </div>

                              {/* Status Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <span className="text-sm text-gray-600">NOC Status:</span>
                                  <p className="font-medium capitalize">{request.nocStatus.replace('_', ' ')}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <span className="text-sm text-gray-600">Deposit ({request.type === 'move-in' ? 'Payment' : 'Refund'}):</span>
                                  <p className="font-medium capitalize">₹{request.depositAmount} - {request.depositStatus.replace('_', ' ')}</p>
                                </div>
                              </div>

                              {/* Checklist */}
                              <div>
                                <h4 className="font-semibold mb-2">Checklist</h4>
                                <div className="space-y-2">
                                  {(request.checklistItems || []).map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                      {item.completed ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                                      )}
                                      <span className={item.completed ? 'text-gray-600' : ''}>{item.item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Notes */}
                              {request.notes && (
                                <div>
                                  <h4 className="font-semibold mb-2">Notes</h4>
                                  <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">{request.notes}</p>
                                </div>
                              )}

                              {/* Actions */}
                              {request.status === 'pending' && (
                                <div className="flex gap-2 pt-4">
                                  <Button className="flex-1" onClick={() => handleApprove(request.id)}>Approve</Button>
                                  <Button variant="destructive" className="flex-1" onClick={() => handleReject(request.id)}>Reject</Button>
                                </div>
                              )}
                              {request.status === 'approved' && request.type === 'move-out' && request.nocStatus === 'pending' && (
                                <Button className="w-full gap-2" onClick={() => handleIssueNOC(request.id)}>
                                  <FileText className="h-4 w-4" /> Issue NOC
                                </Button>
                              )}
                              {/* Complete Move-Out with Security Deposit Refund */}
                              {request.type === 'move-out' && request.status === 'approved' && request.depositStatus !== 'refunded' && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                                    <p className="text-sm font-semibold text-orange-700">Security Deposit Refund Pending</p>
                                  </div>
                                  <p className="text-sm text-orange-600 mb-3">
                                    Refund Amount: <strong>₹{request.depositAmount?.toLocaleString() || request.unit?.securityDeposit?.toLocaleString() || 0}</strong>
                                  </p>
                                  <Button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white gap-2"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to complete move-out and process security deposit refund of ₹${request.depositAmount || request.unit?.securityDeposit || 0}?`)) {
                                        updateStatusMutation.mutate({ id: request.id, data: { status: 'COMPLETED' } })
                                      }
                                    }}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Complete Move-Out & Refund Deposit
                                  </Button>
                                </div>
                              )}
                              {/* Show refunded status */}
                              {request.type === 'move-out' && request.depositStatus === 'refunded' && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <p className="text-sm text-green-700 font-medium">Security deposit of ₹{request.depositAmount?.toLocaleString()} has been refunded.</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
