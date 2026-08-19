'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Phone,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  Star,
  Home,
  UserCheck,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { StaffService } from '@/services/staffService'
import { toast } from 'react-hot-toast'

export default function MaidsManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false)
  const [isReviewsDialogOpen, setIsReviewsDialogOpen] = useState(false)
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false)
  const [selectedHelper, setSelectedHelper] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    email: '',
    role: 'MAID',
    shift: '',
    address: '',
    emergencyContact: '',
    idProof: '',
    idNumber: '',
    photo: '',
    workingDays: 'Mon,Tue,Wed,Thu,Fri,Sat', // Set default to standard working week
  })

  const queryClient = useQueryClient()

  // Mutation for updating gate status (Mark Present / Exit)
  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: number; status: string }) => StaffService.updateStatus(data.id, data.status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['staff-helpers'] })
      queryClient.invalidateQueries({ queryKey: ['guard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['guard-activity'] })
      toast.success(variables.status === 'ON_DUTY' ? 'Helper marked as Present (Checked In)' : 'Helper marked as Exit (Off Duty)')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to update helper status')
    }
  })

  // Fetch helpers/maids from backend
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['staff-helpers', typeFilter],
    queryFn: () => StaffService.getAll({
      role: typeFilter === 'all' ? 'MAID' : typeFilter.toUpperCase()
    })
  })

  const helpers = (apiData?.data || []).map((staff: any) => {
    console.log('Helper data from backend:', staff); // Debug log
    return {
      id: staff.id,
      name: staff.name,
      type: staff.role || 'Maid',
      phone: staff.phone,
      units: [], // TODO: Add unit assignment logic
      status: staff.status === 'ON_DUTY' ? 'active' : 'inactive',
      todayStatus: staff.attendanceStatus?.toLowerCase() === 'present' ? 'present' : 'absent',
      checkIn: staff.checkInTime || '-',
      checkOut: '-',
      rating: staff.rating || 0,
      verified: true, // TODO: Add verification logic
      documents: true, // TODO: Add document verification logic
      workingDays: staff.workingDays || staff.shift || 'Mon-Sat',
      photo: staff.photo || '',
    };
  })

  const statsData = apiData?.stats || { total: 0, onDuty: 0, onLeave: 0, vacant: 0 }

  const stats = [
    { label: 'Total Helpers', value: statsData.total.toString(), icon: Users, color: 'bg-blue-500' },
    { label: 'Present Today', value: statsData.onDuty.toString(), icon: CheckCircle, color: 'bg-green-500' },
    { label: 'On Leave', value: statsData.onLeave.toString(), icon: XCircle, color: 'bg-red-500' },
    { label: 'Off Duty', value: statsData.vacant.toString(), icon: AlertTriangle, color: 'bg-yellow-500' },
  ]

  // Filter helpers based on search and status
  const filteredHelpers = helpers.filter((helper: any) => {
    const matchesSearch = helper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      helper.phone.includes(searchQuery)
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'present' && helper.todayStatus === 'present') ||
      (statusFilter === 'absent' && helper.todayStatus === 'absent') ||
      (statusFilter === 'verified' && helper.verified) ||
      (statusFilter === 'unverified' && !helper.verified)
    return matchesSearch && matchesStatus
  })

  // Mutation for creating helper
  const createMutation = useMutation({
    mutationFn: (data: any) => StaffService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-helpers'] })
      setIsAddDialogOpen(false)
      setFormData({
        name: '',
        phone: '',
        password: '',
        email: '',
        role: 'MAID',
        shift: '',
        address: '',
        emergencyContact: '',
        idProof: '',
        idNumber: '',
        photo: '',
        workingDays: 'Mon,Tue,Wed,Thu,Fri,Sat',
      })
      setIsSubmitting(false)
    },
    onError: () => setIsSubmitting(false)
  })

  const handleAddHelper = () => {
    setIsSubmitting(true)
    createMutation.mutate(formData)
  }

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: any }) => StaffService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-helpers'] })
      setIsEditDialogOpen(false)
      setSelectedHelper(null)
      setIsSubmitting(false)
    },
    onError: () => setIsSubmitting(false)
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => StaffService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-helpers'] })
      setIsDeleteDialogOpen(false)
      setSelectedHelper(null)
      setIsSubmitting(false)
    },
    onError: () => setIsSubmitting(false)
  })

  const handleEditHelper = () => {
    if (!selectedHelper) return
    setIsSubmitting(true)
    updateMutation.mutate({
      id: selectedHelper.id,
      data: formData
    })
  }

  const handleDeleteHelper = () => {
    if (!selectedHelper) return
    setIsSubmitting(true)
    deleteMutation.mutate(selectedHelper.id)
  }

  const openEditDialog = (helper: any) => {
    setSelectedHelper(helper)
    setFormData({
      name: helper.name,
      phone: helper.phone,
      password: '',
      email: helper.email || '',
      role: helper.type,
      shift: helper.workingDays,
      address: '',
      emergencyContact: '',
      idProof: '',
      idNumber: '',
      photo: helper.photo || '',
      workingDays: helper.workingDays || 'Mon-Sat',
    })
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-purple-600" />
            Domestic Helpers Management
          </h1>
          <p className="text-gray-600 mt-1">Manage maids, cooks, drivers and other domestic staff</p>
        </div>
        <Button className="mt-4 md:mt-0 gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Register New Helper
        </Button>
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
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search helpers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="maid">Maid</SelectItem>
              <SelectItem value="cook">Cook</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="helper">Helper</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present Today</SelectItem>
              <SelectItem value="absent">Absent Today</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Helpers Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Helper</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assigned Units</TableHead>
              <TableHead>Today's Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHelpers.map((helper: any) => (
              <TableRow key={helper.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {helper.photo ? (
                        <img src={helper.photo} alt={helper.name} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {helper.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{helper.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {helper.phone}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{helper.type}</Badge>
                  <p className="text-xs text-gray-500 mt-1">{helper.workingDays}</p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {helper.units.slice(0, 3).map((unit: string) => (
                      <Badge key={unit} variant="secondary" className="text-xs">
                        <Home className="h-3 w-3 mr-1" /> {unit}
                      </Badge>
                    ))}
                    {helper.units.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{helper.units.length - 3} more
                      </Badge>
                    )}
                    {helper.units.length === 0 && (
                      <span className="text-xs text-gray-400">No units assigned</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {helper.todayStatus === 'present' ? (
                        <Badge className="bg-green-100 text-green-800 font-bold px-2.5 py-1">
                          <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-600" /> Present
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="font-bold px-2.5 py-1">
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Off Duty / Absent
                        </Badge>
                      )}
                    </div>
                    
                    {helper.checkIn !== '-' && (
                      <p className="text-xs text-gray-500 font-medium">
                        <Clock className="h-3 w-3 inline mr-1 text-purple-600" />
                        In: {helper.checkIn} {helper.checkOut !== '-' && `| Out: ${helper.checkOut}`}
                      </p>
                    )}

                    {/* Direct Gate Attendance Toggle Button */}
                    <div>
                      {helper.todayStatus === 'present' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border-red-200 rounded-xl transition-all"
                          onClick={() => updateStatusMutation.mutate({ id: helper.id, status: 'OFF_DUTY' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Mark Exit (Off Duty)
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm rounded-xl transition-all"
                          onClick={() => updateStatusMutation.mutate({ id: helper.id, status: 'ON_DUTY' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Mark Present (Check In)
                        </Button>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{helper.rating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {helper.verified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <UserCheck className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Unverified
                      </Badge>
                    )}
                    {helper.documents ? (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Docs Complete
                      </p>
                    ) : (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <FileText className="h-3 w-3" /> Docs Pending
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {helper.todayStatus === 'present' ? (
                        <DropdownMenuItem 
                          className="text-red-600 font-bold"
                          onClick={() => updateStatusMutation.mutate({ id: helper.id, status: 'OFF_DUTY' })}
                        >
                          <XCircle className="h-4 w-4 mr-2" /> Mark Exit (Off Duty)
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          className="text-emerald-600 font-bold"
                          onClick={() => updateStatusMutation.mutate({ id: helper.id, status: 'ON_DUTY' })}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" /> Mark Present (Check In)
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => {
                        console.log('View Profile clicked', helper)
                        setSelectedHelper(helper)
                        setIsViewDialogOpen(true)
                      }}>
                        <Eye className="h-4 w-4 mr-2" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        console.log('Edit clicked', helper)
                        openEditDialog(helper)
                      }}>
                        <Edit className="h-4 w-4 mr-2" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedHelper(helper)
                        setIsAttendanceDialogOpen(true)
                      }}>
                        <Calendar className="h-4 w-4 mr-2" /> Attendance History
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedHelper(helper)
                        setIsReviewsDialogOpen(true)
                      }}>
                        <Star className="h-4 w-4 mr-2" /> View Reviews
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedHelper(helper)
                        setIsDocumentsDialogOpen(true)
                      }}>
                        <FileText className="h-4 w-4 mr-2" /> Documents
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => {
                        setSelectedHelper(helper)
                        setIsDeleteDialogOpen(true)
                      }}>
                        <Trash2 className="h-4 w-4 mr-2" /> Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Helper Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-purple-600" />
              Register New Helper
            </DialogTitle>
            <DialogDescription>
              Add a new domestic helper to the system
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password for login"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Type *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAID">Maid</SelectItem>
                    <SelectItem value="COOK">Cook</SelectItem>
                    <SelectItem value="DRIVER">Driver</SelectItem>
                    <SelectItem value="HELPER">Helper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Working Days *</Label>
                <div className="flex flex-wrap gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                    const isSelected = (formData.workingDays || '').includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const days = formData.workingDays.split(',').filter(d => d !== '');
                          const newDays = isSelected
                            ? days.filter(d => d !== day)
                            : [...days, day];
                          setFormData({
                            ...formData, workingDays: newDays.sort((a, b) => {
                              const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                              return order.indexOf(a) - order.indexOf(b);
                            }).join(',')
                          });
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isSelected
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter full address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idProof">ID Proof Type</Label>
                <Select value={formData.idProof} onValueChange={(value) => setFormData({ ...formData, idProof: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID Proof" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aadhar Card">Aadhar Card</SelectItem>
                    <SelectItem value="PAN Card">PAN Card</SelectItem>
                    <SelectItem value="Voter ID">Voter ID</SelectItem>
                    <SelectItem value="Driving License">Driving License</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number</Label>
              <Input
                id="idNumber"
                placeholder="Enter ID number"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddHelper}
              disabled={!formData.name || !formData.phone || !formData.password || !formData.role || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Helper'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" />
              Helper Profile
            </DialogTitle>
          </DialogHeader>

          {selectedHelper && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-purple-200 text-purple-700 text-xl">
                    {selectedHelper.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedHelper.name}</h3>
                  <p className="text-sm text-gray-600">{selectedHelper.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedHelper.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rating</p>
                  <p className="font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    {selectedHelper.rating}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Working Days</p>
                  <p className="font-medium">{selectedHelper.workingDays}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-medium">{selectedHelper.status}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Helper Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-purple-600" />
              Edit Helper Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Type</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAID">Maid</SelectItem>
                    <SelectItem value="COOK">Cook</SelectItem>
                    <SelectItem value="DRIVER">Driver</SelectItem>
                    <SelectItem value="HELPER">Helper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Working Days *</Label>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const isSelected = (formData.workingDays || '').includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const days = formData.workingDays.split(',').filter(d => d !== '');
                        const newDays = isSelected
                          ? days.filter(d => d !== day)
                          : [...days, day];
                        setFormData({
                          ...formData, workingDays: newDays.sort((a, b) => {
                            const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                            return order.indexOf(a) - order.indexOf(b);
                          }).join(',')
                        });
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isSelected
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditHelper}
              disabled={!formData.name || !formData.phone || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Deactivate Helper
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate this helper? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedHelper && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Avatar>
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {selectedHelper.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedHelper.name}</p>
                <p className="text-sm text-gray-500">{selectedHelper.type}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteHelper}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deactivating...' : 'Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendance History Dialog */}
      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Attendance History
            </DialogTitle>
            <DialogDescription>
              Attendance records for {selectedHelper?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No attendance records available</p>
            <p className="text-sm text-gray-400">Attendance tracking feature coming soon</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttendanceDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Reviews Dialog */}
      <Dialog open={isReviewsDialogOpen} onOpenChange={setIsReviewsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              Reviews & Ratings
            </DialogTitle>
            <DialogDescription>
              Feedback from residents for {selectedHelper?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No reviews available</p>
            <p className="text-sm text-gray-400">Reviews and ratings feature coming soon</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Documents Dialog */}
      <Dialog open={isDocumentsDialogOpen} onOpenChange={setIsDocumentsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Documents
            </DialogTitle>
            <DialogDescription>
              Uploaded documents for {selectedHelper?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">No documents uploaded</p>
            <p className="text-sm text-gray-400">Document management feature coming soon</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
