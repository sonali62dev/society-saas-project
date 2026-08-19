'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Package,
  Car,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  Bell,
  Shield,
  Camera,
  Phone,
  QrCode,
  LogIn,
  LogOut,
  Search,
  FileText,
  Upload,
  Printer,
  Filter,
  X,
  Megaphone,
} from 'lucide-react'
import { NoticeService } from '@/services/notice.service'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GuardService } from '@/services/guard.service'
import { VisitorService } from '@/services/visitor.service'
import { StaffService } from '@/services/staff.service'
import { toast } from 'sonner'
import { ParcelService } from '@/services/parcel.service'
import { VehicleService } from '@/services/vehicle.service'
import { UnitService } from '@/services/unit.service'
import { useAuthStore } from '@/lib/stores/auth-store'
import { connectSocket, disconnectSocket } from '@/lib/socket'

export default function GuardDashboardPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [visitorSearch, setVisitorSearch] = useState('')
  const [helperSearch, setHelperSearch] = useState('')
  const [showIncidentDialog, setShowIncidentDialog] = useState(false)
  const [incidentPhoto, setIncidentPhoto] = useState<File | null>(null)
  const [incidentSeverity, setIncidentSeverity] = useState('medium')
  const [incidentDescription, setIncidentDescription] = useState('')
  const [incidentAssignee, setIncidentAssignee] = useState('')

  // New Dialog States
  const [showCheckInDialog, setShowCheckInDialog] = useState(false)
  const [showLogParcelDialog, setShowLogParcelDialog] = useState(false)
  const [showVehicleEntryDialog, setShowVehicleEntryDialog] = useState(false)
  const [showTakePhotoDialog, setShowTakePhotoDialog] = useState(false)
  const [tempPhoto, setTempPhoto] = useState<File | null>(null)

  // Form States
  const [checkInForm, setCheckInForm] = useState({
    name: '',
    phone: '',
    vehicleNo: '',
    purpose: '',
    visitingUnitId: ''
  })

  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    phone: '',
    vehicleNo: '',
    purpose: 'Delivery',
    visitingUnitId: ''
  })

  const [parcelForm, setParcelForm] = useState({
    unitId: '',
    courierName: '',
    trackingNumber: '',
    description: ''
  })

  // Queries
  const { data: statsData } = useQuery({
    queryKey: ['guard-stats'],
    queryFn: () => GuardService.getStats()
  })

  const { data: visitors = [] } = useQuery({
    queryKey: ['visitors', visitorSearch],
    queryFn: () => VisitorService.getAll({ search: visitorSearch })
  })

  const { data: activities = [] } = useQuery({
    queryKey: ['guard-activity'],
    queryFn: () => GuardService.getActivity()
  })

  const { data: helpersData } = useQuery({
    queryKey: ['staff'],
    queryFn: () => StaffService.getAll() // Fetch all staff (maids, drivers, etc.)
  })

  const helpers = helpersData?.data || []

  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: () => UnitService.getUnits()
  })

  const { data: notices = [] } = useQuery({
    queryKey: ['notices', user?.role],
    queryFn: NoticeService.getAll
  })

  const trackViewMutation = useMutation({
    mutationFn: (id: number) => NoticeService.trackView(id)
  })

  useEffect(() => {
    if (notices.length > 0) {
      notices.forEach((notice: any) => {
        trackViewMutation.mutate(notice.id)
      })
    }
  }, [notices.length])

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => GuardService.updateVisitorStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      queryClient.invalidateQueries({ queryKey: ['guard-activity'] })
      queryClient.invalidateQueries({ queryKey: ['guard-stats'] })
      toast.success('Status updated successfully')
    }
  })

  const checkOutMutation = useMutation({
    mutationFn: GuardService.checkOutVisitor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      queryClient.invalidateQueries({ queryKey: ['guard-activity'] })
      queryClient.invalidateQueries({ queryKey: ['guard-stats'] })
      toast.success('Checked out successfully')
    }
  })

  const reportIncidentMutation = useMutation({
    mutationFn: (data: any) => GuardService.reportIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guard-activity'] })
      setShowIncidentDialog(false)
      toast.success('Incident reported successfully')
      setIncidentDescription('')
      setIncidentPhoto(null)
    }
  })

  const createEmergencyMutation = useMutation({
    mutationFn: GuardService.createEmergencyAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guard-activity'] })
      toast.error('Emergency Alert Sent!')
    }
  })

  const checkInMutation = useMutation({
    mutationFn: (formData: FormData) => VisitorService.checkIn(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      queryClient.invalidateQueries({ queryKey: ['guard-activity'] })
      queryClient.invalidateQueries({ queryKey: ['guard-stats'] })
      setShowCheckInDialog(false)
      setShowVehicleEntryDialog(false)
      setCheckInForm({ name: '', phone: '', vehicleNo: '', purpose: '', visitingUnitId: '' })
      setVehicleForm({ name: '', phone: '', vehicleNo: '', purpose: 'Delivery', visitingUnitId: '' })
      setTempPhoto(null)
      toast.success('Visitor Checked In Successfully')
    }
  })

  const updateStaffStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => StaffService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] })
      queryClient.invalidateQueries({ queryKey: ['guard-activity'] })
      queryClient.invalidateQueries({ queryKey: ['guard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['residentDashboard'] }) // Also invalidate resident counts
      toast.success('Helper status updated')
    }
  })

  const logParcelMutation = useMutation({
    mutationFn: ParcelService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcels'] })
      queryClient.invalidateQueries({ queryKey: ['guard-activity'] })
      queryClient.invalidateQueries({ queryKey: ['guard-stats'] })
      setShowLogParcelDialog(false)
      setParcelForm({ unitId: '', courierName: '', trackingNumber: '', description: '' })
      toast.success('Parcel Logged Successfully')
    }
  })

  const handleIncidentSubmit = () => {
    reportIncidentMutation.mutate({
      title: 'Security Incident',
      severity: incidentSeverity,
      description: incidentDescription,
      assignedToId: incidentAssignee ? parseInt(incidentAssignee) : null,
      status: 'open'
    })
  }

  const helperList = helpers.filter((h: any) =>
    h.name.toLowerCase().includes(helperSearch.toLowerCase()) ||
    h.role.toLowerCase().includes(helperSearch.toLowerCase())
  )

  const pendingVisitors = visitors.filter((v: any) => v.status === 'PENDING')
  const expectedVisitors = visitors.filter((v: any) => v.status === 'APPROVED' || v.status === 'PRE_APPROVED')
  const allVisitorsList = visitors

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const stats = [
    { label: 'Visitors Today', value: statsData?.visitorsToday || 0, icon: Users, color: 'bg-blue-500', change: '+5' },
    { label: 'Pending Approvals', value: statsData?.pendingApprovals || 0, icon: Clock, color: 'bg-yellow-500', change: 'urgent' },
    { label: 'Parcels to Deliver', value: statsData?.parcelsToDeliver || 0, icon: Package, color: 'bg-purple-500', change: 'new' },
    { label: 'Vehicles In', value: statsData?.vehiclesIn || 0, icon: Car, color: 'bg-green-500', change: 'active' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Guard Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Main Gate - Shift: Morning (6 AM - 2 PM)</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button
            className="gap-2 bg-red-600 hover:bg-red-700"
            onClick={() => createEmergencyMutation.mutate({
              type: 'SOS',
              description: 'Guard triggered emergency alert'
            })}
          >
            <AlertTriangle className="h-4 w-4" />
            Emergency
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <Badge variant="secondary">{stat.change}</Badge>
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Visitor Management with Tabs */}
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-yellow-500" />
              Visitor Management
            </h2>
            <Badge variant="destructive">{pendingVisitors.length} Pending</Badge>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search visitors by name or unit..."
              value={visitorSearch}
              onChange={(e) => setVisitorSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="relative">
                <Clock className="h-4 w-4 mr-2" />
                Pending
                {pendingVisitors.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white font-bold animate-pulse">
                    {pendingVisitors.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all">
                <Users className="h-4 w-4 mr-2" />
                All Visitors
              </TabsTrigger>
              <TabsTrigger value="expected">
                <CheckCircle className="h-4 w-4 mr-2" />
                Expected
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-3 mt-4">
              {pendingVisitors.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No pending visitors</p>
              ) : (
                pendingVisitors.map((visitor: any) => (
                  <motion.div
                    key={visitor.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {visitor.photo ? (
                        <img src={visitor.photo} alt={visitor.name} className="h-10 w-10 rounded-full object-cover border-2 border-yellow-300" />
                      ) : (
                        <Avatar>
                          <AvatarFallback className="bg-yellow-200">{visitor.name[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="font-medium">{visitor.name}</p>
                        <p className="text-sm text-gray-600">
                          Unit: {visitor.unit ? `${visitor.unit.block}-${visitor.unit.number}` : 'N/A'} • {visitor.purpose}
                        </p>
                        {visitor.whomToMeet && (
                          <p className="text-xs text-gray-500">Meeting: {visitor.whomToMeet}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">{new Date(visitor.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          {visitor.gate && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-cyan-50 text-cyan-700 border-cyan-200">
                              QR: {visitor.gate.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1" asChild>
                        <a href={`tel:${visitor.phone}`}>
                          <Phone className="h-3 w-3" />
                          Visitor
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 border-teal-200 text-teal-700 bg-teal-50" asChild>
                        <a href={`tel:${visitor.unit?.tenant?.phone || visitor.unit?.owner?.phone || visitor.resident?.phone}`}>
                          <Shield className="h-3 w-3" />
                          Resident
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-red-600 border-red-200"
                        onClick={() => updateStatusMutation.mutate({ id: visitor.id, status: 'REJECTED' })}
                      >
                        <UserX className="h-3 w-3" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1 bg-green-600 hover:bg-green-700"
                        onClick={() => updateStatusMutation.mutate({ id: visitor.id, status: 'CHECKED_IN' })}
                      >
                        <UserCheck className="h-3 w-3" />
                        Approve
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-3 mt-4">
              {allVisitorsList.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No visitors found</p>
              ) : (
                allVisitorsList.map((visitor: any) => (
                  <div
                    key={visitor.id}
                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {visitor.photo ? (
                        <img src={visitor.photo} alt={visitor.name} className="h-10 w-10 rounded-full object-cover border" />
                      ) : (
                        <Avatar>
                          <AvatarFallback>{visitor.name[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="font-medium">{visitor.name}</p>
                        <p className="text-sm text-gray-600">
                          Unit: {visitor.unit ? `${visitor.unit.block}-${visitor.unit.number}` : 'N/A'} • {visitor.purpose}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">{new Date(visitor.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          {visitor.gate && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-cyan-50 text-cyan-700 border-cyan-200">
                              QR: {visitor.gate.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      {getStatusBadge(visitor.status.toLowerCase())}
                      <Button size="sm" variant="outline" className="gap-1" asChild>
                        <a href={`tel:${visitor.phone}`}>
                          <Phone className="h-3 w-3" />
                          Visitor
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 border-teal-200 text-teal-700 bg-teal-50" asChild>
                        <a href={`tel:${visitor.unit?.tenant?.phone || visitor.unit?.owner?.phone || visitor.resident?.phone}`}>
                          <Shield className="h-3 w-3" />
                          Resident
                        </a>
                      </Button>
                      {visitor.status === 'PENDING' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs text-red-600 border-red-200"
                            onClick={() => updateStatusMutation.mutate({ id: visitor.id, status: 'REJECTED' })}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-green-600 hover:bg-green-700"
                            onClick={() => updateStatusMutation.mutate({ id: visitor.id, status: 'CHECKED_IN' })}
                          >
                            Approve
                          </Button>
                        </>
                      )}
                      {(visitor.status === 'CHECKED_IN' || visitor.status === 'APPROVED') && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 text-xs gap-1"
                          onClick={() => updateStatusMutation.mutate({ id: visitor.id, status: 'EXITED' })}
                        >
                          <LogOut className="h-3 w-3" />
                          Exit
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="expected" className="space-y-3 mt-4">
              {expectedVisitors.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No expected visitors</p>
              ) : (
                expectedVisitors.map((visitor: any) => (
                  <div
                    key={visitor.id}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-green-200">{visitor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{visitor.name}</p>
                        <p className="text-sm text-gray-600">
                          Unit: {visitor.unit ? `${visitor.unit.block}-${visitor.unit.number}` : 'N/A'} • {visitor.purpose}
                        </p>
                        <p className="text-xs text-gray-500">
                          Expected: Today • Approved by: {visitor.resident?.name || 'Resident'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1" asChild>
                        <a href={`tel:${visitor.phone}`}>
                          <Phone className="h-3 w-3" />
                          Visitor
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 border-teal-200 text-teal-700 bg-teal-50" asChild>
                        <a href={`tel:${visitor.unit?.tenant?.phone || visitor.unit?.owner?.phone || visitor.resident?.phone}`}>
                          <Shield className="h-3 w-3" />
                          Resident
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1 bg-green-600 hover:bg-green-700"
                        onClick={() => updateStatusMutation.mutate({ id: visitor.id, status: 'CHECKED_IN' })}
                      >
                        <UserCheck className="h-3 w-3" />
                        Check In
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </Card>


        {/* Quick Actions */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => setShowCheckInDialog(true)}
            >
              <LogIn className="h-6 w-6 text-green-600" />
              <span className="text-xs">Check In</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => toast.info('Please select a visitor from the list to check out')}
            >
              <LogOut className="h-6 w-6 text-red-600" />
              <span className="text-xs">Check Out</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => setShowLogParcelDialog(true)}
            >
              <Package className="h-6 w-6 text-purple-600" />
              <span className="text-xs">Log Parcel</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 relative overflow-hidden"
              onClick={() => setShowTakePhotoDialog(true)}
            >
              {tempPhoto ? (
                <div className="absolute inset-0 bg-green-50 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              ) : (
                <>
                  <Camera className="h-6 w-6 text-blue-600" />
                  <span className="text-xs">Take Photo</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 border-orange-200 bg-orange-50/30"
              onClick={() => setShowVehicleEntryDialog(true)}
            >
              <Car className="h-6 w-6 text-orange-600" />
              <span className="text-xs">Vehicle Entry</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => setShowIncidentDialog(true)}
            >
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <span className="text-xs">Report Incident</span>
            </Button>
          </div>
        </Card>

        {/* Community Notices */}
        <Card className="p-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-blue-600" />
              Society Notices
            </h2>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {notices.length} Active
            </Badge>
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[300px] flex-1 pr-1">
            {notices.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm italic">No active notices for your role</p>
              </div>
            ) : (
              notices.map((notice: any) => (
                <div 
                  key={notice.id} 
                  className={`p-3 rounded-lg border-l-4 hover:shadow-sm transition-shadow ${
                    notice.type === 'emergency' ? 'bg-red-50 border-red-500' :
                    notice.type === 'maintenance' ? 'bg-orange-50 border-orange-500' :
                    notice.type === 'event' ? 'bg-purple-50 border-purple-500' : 
                    'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm text-gray-900 truncate pr-2">{notice.title}</p>
                    {notice.isPinned && <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px] h-4 px-1">Pinned</Badge>}
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-2 mb-2">{notice.content}</p>
                  <div className="flex justify-between items-center text-[10px] text-gray-500">
                    <span className="capitalize font-medium">{notice.type}</span>
                    <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Activity */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-center text-gray-500 py-4 text-sm">No recent activity</p>
            ) : (
              activities.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${activity.status === 'approved' ? 'bg-green-100' :
                      activity.status === 'rejected' ? 'bg-red-100' :
                        activity.status === 'delivered' ? 'bg-purple-100' :
                          activity.status === 'checkin' ? 'bg-blue-100' :
                            activity.status === 'incident' ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                      {activity.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {activity.status === 'rejected' && <UserX className="h-4 w-4 text-red-600" />}
                      {activity.status === 'delivered' && <Package className="h-4 w-4 text-purple-600" />}
                      {activity.status === 'checkin' && <LogIn className="h-4 w-4 text-blue-600" />}
                      {activity.status === 'exit' && <LogOut className="h-4 w-4 text-gray-600" />}
                      {activity.status === 'incident' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.name} • {activity.unit}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Enhanced Helper Attendance */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Helper Attendance</h2>
            <Button size="sm" variant="outline" className="gap-1">
              <Printer className="h-3 w-3" />
              Gate Pass
            </Button>
          </div>

          {/* Helper Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or unit..."
              value={helperSearch}
              onChange={(e) => setHelperSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {helperList.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No helpers found</p>
            ) : (
              helperList.map((staff: any) => (
                <div key={staff.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{staff.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-xs text-gray-600">{staff.role}</p>
                      </div>
                    </div>
                    <Badge variant={
                      staff.status === 'ON_DUTY' ? 'default' :
                        staff.status === 'OFF_DUTY' ? 'secondary' : 'outline'
                    }>
                      {staff.status === 'ON_DUTY' ? 'Present' :
                        staff.status === 'OFF_DUTY' ? 'Off Duty' : staff.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Shift: {staff.shift || 'N/A'}</p>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <LogIn className="h-3 w-3 text-green-600" />
                        Check-in: {staff.checkInTime || '-'}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {staff.status !== 'ON_DUTY' ? (
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700 h-8"
                          onClick={() => updateStaffStatusMutation.mutate({ id: staff.id, status: 'ON_DUTY' })}
                        >
                          Check In
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1 h-8"
                          onClick={() => updateStaffStatusMutation.mutate({ id: staff.id, status: 'OFF_DUTY' })}
                        >
                          Check Out
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="h-8">Details</Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Enhanced Incident Report Dialog */}
      <Dialog open={showIncidentDialog} onOpenChange={setShowIncidentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Report Incident
            </DialogTitle>
            <DialogDescription>
              Provide detailed information about the incident
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Severity Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="severity">Severity Level</Label>
              <Select value={incidentSeverity} onValueChange={setIncidentSeverity}>
                <SelectTrigger id="severity" className="w-full">
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      High
                    </span>
                  </SelectItem>
                  <SelectItem value="critical">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Critical
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo">Upload Photo (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIncidentPhoto(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                {incidentPhoto && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIncidentPhoto(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {incidentPhoto && (
                <p className="text-xs text-gray-600">Selected: {incidentPhoto.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the incident in detail..."
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Assignee Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="assignee">Assign To</Label>
              <Select value={incidentAssignee} onValueChange={setIncidentAssignee}>
                <SelectTrigger id="assignee" className="w-full">
                  <SelectValue placeholder="Select person to assign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="security-head">Security Head</SelectItem>
                  <SelectItem value="facility-manager">Facility Manager</SelectItem>
                  <SelectItem value="maintenance">Maintenance Team</SelectItem>
                  <SelectItem value="admin">Admin Office</SelectItem>
                  <SelectItem value="emergency">Emergency Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIncidentDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleIncidentSubmit}
              disabled={!incidentSeverity || !incidentDescription || !incidentAssignee}
              className="bg-red-600 hover:bg-red-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check-In Dialog */}
      <Dialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-green-600" />
              Visitor Check-In
            </DialogTitle>
            <DialogDescription> Register a new visitor entry </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Visitor Name</Label>
                <Input
                  placeholder="Full Name"
                  value={checkInForm.name}
                  onChange={(e) => setCheckInForm({ ...checkInForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="+91 XXX XXX XXXX"
                  value={checkInForm.phone}
                  onChange={(e) => setCheckInForm({ ...checkInForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle No. (Optional)</Label>
                <Input
                  placeholder="MH 01 AB 1234"
                  value={checkInForm.vehicleNo}
                  onChange={(e) => setCheckInForm({ ...checkInForm, vehicleNo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Purpose of Visit</Label>
                <Select
                  value={checkInForm.purpose}
                  onValueChange={(v) => setCheckInForm({ ...checkInForm, purpose: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">Personal Visit</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Visiting Unit</Label>
              <Select
                value={checkInForm.visitingUnitId}
                onValueChange={(v) => setCheckInForm({ ...checkInForm, visitingUnitId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit: any) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                      {unit.block} - {unit.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCheckInDialog(false)}>Cancel</Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={!checkInForm.name || !checkInForm.phone || !checkInForm.visitingUnitId}
              onClick={() => {
                const formData = new FormData();
                formData.append('name', checkInForm.name);
                formData.append('phone', checkInForm.phone);
                formData.append('vehicleNo', checkInForm.vehicleNo);
                formData.append('purpose', checkInForm.purpose);
                formData.append('visitingUnitId', checkInForm.visitingUnitId);
                if (tempPhoto) formData.append('photo', tempPhoto);
                checkInMutation.mutate(formData);
              }}
            >
              Register & Check-In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Parcel Dialog */}
      <Dialog open={showLogParcelDialog} onOpenChange={setShowLogParcelDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-600" />
              Log New Parcel
            </DialogTitle>
            <DialogDescription> Record a parcel received at the gate </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Unit Number</Label>
                <Select
                  value={parcelForm.unitId}
                  onValueChange={(v) => setParcelForm({ ...parcelForm, unitId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit: any) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.block} - {unit.number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Courier Company</Label>
                <Input
                  placeholder="Amazon, Flipkart, etc."
                  value={parcelForm.courierName}
                  onChange={(e) => setParcelForm({ ...parcelForm, courierName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tracking Number (Optional)</Label>
              <Input
                placeholder="TRK123456789"
                value={parcelForm.trackingNumber}
                onChange={(e) => setParcelForm({ ...parcelForm, trackingNumber: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogParcelDialog(false)}>Cancel</Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!parcelForm.unitId || !parcelForm.courierName}
              onClick={() => logParcelMutation.mutate({
                ...parcelForm,
                unitId: parseInt(parcelForm.unitId)
              })}
            >
              Log Parcel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vehicle Entry Dialog */}
      <Dialog open={showVehicleEntryDialog} onOpenChange={setShowVehicleEntryDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-orange-600" />
              Vehicle Entry
            </DialogTitle>
            <DialogDescription> Quick log for vehicle-based visitors </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle Number</Label>
                <Input
                  placeholder="EX: KA 01 HH 1234"
                  className="uppercase font-bold"
                  value={vehicleForm.vehicleNo}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleNo: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label>Purpose</Label>
                <Select
                  value={vehicleForm.purpose}
                  onValueChange={(v) => setVehicleForm({ ...vehicleForm, purpose: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Driver Name (Optional)</Label>
                <Input
                  placeholder="Name"
                  value={vehicleForm.name}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone (Optional)</Label>
                <Input
                  placeholder="Phone"
                  value={vehicleForm.phone}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Visiting Unit</Label>
              <Select
                value={vehicleForm.visitingUnitId}
                onValueChange={(v) => setVehicleForm({ ...vehicleForm, visitingUnitId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit: any) => (
                    <SelectItem key={unit.id} value={unit.id.toString()}>
                      {unit.block} - {unit.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {tempPhoto && (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-100 italic text-xs text-green-700">
                <Camera className="h-3 w-3" />
                Photo attached: {tempPhoto.name}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVehicleEntryDialog(false)}>Cancel</Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={!vehicleForm.vehicleNo || !vehicleForm.visitingUnitId}
              onClick={() => {
                const formData = new FormData();
                formData.append('name', vehicleForm.name || 'Vehicle Entry');
                formData.append('phone', vehicleForm.phone || '0000000000');
                formData.append('vehicleNo', vehicleForm.vehicleNo);
                formData.append('purpose', vehicleForm.purpose);
                formData.append('visitingUnitId', vehicleForm.visitingUnitId);
                if (tempPhoto) formData.append('photo', tempPhoto);
                checkInMutation.mutate(formData);
              }}
            >
              Log Vehicle Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Take Photo Dialog */}
      <Dialog open={showTakePhotoDialog} onOpenChange={setShowTakePhotoDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Capture Photo</DialogTitle>
            <DialogDescription> Take a photo of the visitor or vehicle </DialogDescription>
          </DialogHeader>

          <div className="py-8 flex flex-col items-center justify-center space-y-6">
            <div className="h-48 w-48 rounded-3xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 relative group overflow-hidden">
              {tempPhoto ? (
                <img
                  src={URL.createObjectURL(tempPhoto)}
                  className="h-full w-full object-cover"
                  alt="Captured"
                />
              ) : (
                <Camera className="h-12 w-12 text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setTempPhoto(e.target.files[0]);
                  }
                }}
              />
            </div>

            <p className="text-center text-sm text-gray-500 max-w-[200px]">
              {tempPhoto ? 'Photo captured! You can now proceed to check-in.' : 'Click the icon above to open camera and take photo'}
            </p>

            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setTempPhoto(null)}
                disabled={!tempPhoto}
              >
                Clear
              </Button>
              <Button
                className="flex-1 bg-blue-600"
                onClick={() => setShowTakePhotoDialog(false)}
                disabled={!tempPhoto}
              >
                Use Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
