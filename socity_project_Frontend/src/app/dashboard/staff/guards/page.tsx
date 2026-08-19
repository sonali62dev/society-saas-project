'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  Star,
  X,
  User,
  Upload,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Textarea } from '@/components/ui/textarea'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { StaffService } from '@/services/staffService'
import { toast } from 'sonner' // Assuming sonner is used for notifications based on previous files, or stick to simple alerts if not sure. 
// Wait, previous file `parking/slots/page.tsx` used `showNotification` helper state. 
// This page doesn't seem to have a toast library imported. It uses a helper function? No, the original code had no toast.
// "sare button exact kam katrne chiye" -> The original code just updated state. I should probably add simple success indication or just refresh.

interface Guard {
  id: number
  name: string
  photo: string | null
  phone: string
  email: string
  shift: string
  gate: string
  status: string
  joinDate: string
  rating: number

  todayStatus: string | null
  checkIn: string
  address?: string
  emergencyContact?: string
  idProof?: string
  idNumber?: string
  workingDays?: string
}

const emptyGuardForm = {
  name: '',
  phone: '',
  password: '',
  email: '',
  shift: '',
  gate: '',
  address: '',
  emergencyContact: '',
  idProof: '',
  idNumber: '',
  photo: '',
  workingDays: 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
}

// Stats mapped dynamically now


export default function GuardsManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  // const [guards, setGuards] = useState<Guard[]>(initialGuards) // Replaced by query

  const queryClient = useQueryClient()
  const photoRef = useRef<string>('') // Store photo separately to avoid state timing issues

  // Fetch Guards
  const { data: apiData, isLoading } = useQuery({
    queryKey: ['staff-guards'],
    queryFn: () => StaffService.getAll({ role: 'GUARD' })
  })

  const guards: Guard[] = (apiData?.data || []).map((staff: any) => ({
    id: staff.id,
    name: staff.name,
    photo: staff.photo || null,
    phone: staff.phone,
    email: staff.email || '',
    shift: staff.shift || 'Morning (6 AM - 2 PM)',
    gate: staff.gate || 'Main Gate',
    status: (staff.status || 'OFF_DUTY').toLowerCase().replace('_', '-'),
    joinDate: staff.joiningDate,
    rating: staff.rating || 0,
    todayStatus: (staff.attendanceStatus || 'UPCOMING').toLowerCase(),
    checkIn: staff.checkInTime || '-',
    address: staff.address,
    emergencyContact: staff.emergencyContact,
    idProof: staff.idProof,
    idNumber: staff.idNumber,
    workingDays: staff.workingDays || 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
  }))

  const statsData = apiData?.stats || { total: 0, onDuty: 0, onLeave: 0, vacant: 0 }

  const stats = [
    { label: 'Total Guards', value: statsData.total.toString(), color: 'bg-blue-500' },
    { label: 'On Duty Now', value: statsData.onDuty.toString(), color: 'bg-green-500' },
    { label: 'On Leave', value: statsData.onLeave.toString(), color: 'bg-yellow-500' },
    { label: 'Vacant Positions', value: statsData.vacant.toString(), color: 'bg-red-500' },
  ]
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false)
  const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null)
  const [formData, setFormData] = useState(emptyGuardForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => StaffService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-guards'] })
      setIsAddDialogOpen(false)
      setFormData(emptyGuardForm)
      photoRef.current = '' // Clear photo ref
      setIsSubmitting(false)
    },
    onError: () => setIsSubmitting(false)
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: any }) => StaffService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-guards'] })
      setIsEditDialogOpen(false)
      setSelectedGuard(null)
      setIsSubmitting(false)
    },
    onError: () => setIsSubmitting(false)
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => StaffService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-guards'] })
      setIsDeleteDialogOpen(false)
      setSelectedGuard(null)
      setIsSubmitting(false)
    },
    onError: () => setIsSubmitting(false)
  })

  const handleAddGuard = () => {
    setIsSubmitting(true)
    const dataToSend = {
      ...formData,
      photo: photoRef.current, // Use ref value instead of state
      role: 'GUARD'
    };
    console.log('Sending guard data to backend:', dataToSend); // Debug log
    createMutation.mutate(dataToSend)
  }

  const handleEditGuard = () => {
    if (!selectedGuard) return
    setIsSubmitting(true)
    updateMutation.mutate({
      id: selectedGuard.id,
      data: formData
    })
  }

  const handleDeleteGuard = () => {
    if (!selectedGuard) return
    setIsSubmitting(true)
    deleteMutation.mutate(selectedGuard.id)
  }

  const openEditDialog = (guard: Guard) => {
    setSelectedGuard(guard)
    setFormData({
      name: guard.name,
      phone: guard.phone,
      password: '', // Don't populate password for security
      email: guard.email,
      shift: guard.shift,
      gate: guard.gate,
      address: guard.address || '',
      emergencyContact: guard.emergencyContact || '',
      idProof: guard.idProof || '',
      idNumber: guard.idNumber || '',
      photo: guard.photo || '',
      workingDays: guard.workingDays || 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
    })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (guard: Guard) => {
    setSelectedGuard(guard)
    setIsViewDialogOpen(true)
  }

  const openDeleteDialog = (guard: Guard) => {
    setSelectedGuard(guard)
    setIsDeleteDialogOpen(true)
  }

  const filteredGuards = guards.filter(guard =>
    guard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guard.phone.includes(searchQuery) ||
    (guard.gate || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Security Guards Management
          </h1>
          <p className="text-gray-600 mt-1">Manage security personnel and their schedules</p>
        </div>
        <Button className="mt-4 md:mt-0 gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add New Guard
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
                <Shield className="h-5 w-5 text-white" />
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
              placeholder="Search guards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="night">Night</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="on-duty">On Duty</SelectItem>
              <SelectItem value="off-duty">Off Duty</SelectItem>
              <SelectItem value="leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Gate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gates</SelectItem>
              <SelectItem value="main">Main Gate</SelectItem>
              <SelectItem value="back">Back Gate</SelectItem>
              <SelectItem value="parking">Parking Gate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Guards Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guard</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Shift & Gate</TableHead>
              <TableHead>Today's Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuards.map((guard) => (
              <TableRow key={guard.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {guard.photo ? (
                        <img src={guard.photo} alt={guard.name} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {guard.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{guard.name}</p>
                      <p className="text-xs text-gray-500">Since {new Date(guard.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {guard.phone}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {guard.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{guard.shift}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {guard.gate}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {guard.todayStatus === 'present' && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> Present
                      </Badge>
                    )}
                    {guard.todayStatus === 'absent' && (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" /> Absent
                      </Badge>
                    )}
                    {guard.todayStatus === 'upcoming' && (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" /> Upcoming
                      </Badge>
                    )}
                    {guard.todayStatus === 'completed' && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <UserCheck className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    )}
                  </div>
                  {guard.checkIn !== '-' && (
                    <p className="text-xs text-gray-500 mt-1">Check-in: {guard.checkIn}</p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{guard.rating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {guard.status === 'on-duty' && (
                    <Badge className="bg-green-600">On Duty</Badge>
                  )}
                  {guard.status === 'off-duty' && (
                    <Badge variant="secondary">Off Duty</Badge>
                  )}
                  {guard.status === 'leave' && (
                    <Badge className="bg-yellow-500">On Leave</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openViewDialog(guard)}>
                        <Eye className="h-4 w-4 mr-2" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        const newStatus = guard.status === 'on-duty' ? 'OFF_DUTY' : 'ON_DUTY'
                        const checkInTime = guard.status === 'on-duty' ? null : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                        updateMutation.mutate({
                          id: guard.id,
                          data: {
                            status: newStatus,
                            checkInTime: checkInTime,
                            attendanceStatus: guard.status === 'on-duty' ? 'UPCOMING' : 'PRESENT'
                          }
                        })
                      }}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        {guard.status === 'on-duty' ? 'Check Out' : 'Check In'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(guard)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedGuard(guard)
                        setIsScheduleDialogOpen(true)
                      }}>
                        <Calendar className="h-4 w-4 mr-2" /> View Schedule
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedGuard(guard)
                        setIsAttendanceDialogOpen(true)
                      }}>
                        <Clock className="h-4 w-4 mr-2" /> Attendance History
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => openDeleteDialog(guard)}>
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Guard Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Add New Security Guard
            </DialogTitle>
            <DialogDescription>
              Fill in the details to add a new security guard to the system.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Photo Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                {formData.photo ? (
                  <AvatarImage src={formData.photo} alt={formData.name} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Create a temporary URL for preview
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const photoData = reader.result as string;
                        console.log('Photo uploaded, size:', photoData.length, 'chars'); // Debug
                        photoRef.current = photoData; // Store in ref
                        setFormData({ ...formData, photo: photoData }); // Also update state for preview
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload Photo
                </Button>
                <p className="text-xs text-gray-500">Or paste URL below</p>
              </div>
            </div>

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

            {/* Photo URL Input */}
            <div className="space-y-2">
              <Label htmlFor="photo">Photo URL</Label>
              <Input
                id="photo"
                placeholder="Enter photo URL or upload"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              />
              <p className="text-xs text-gray-500">Paste image URL or upload to get URL</p>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>
            </div>

            {/* Work Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shift">Shift *</Label>
                <Select
                  value={formData.shift}
                  onValueChange={(value) => setFormData({ ...formData, shift: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning (6 AM - 2 PM)">Morning (6 AM - 2 PM)</SelectItem>
                    <SelectItem value="Afternoon (2 PM - 10 PM)">Afternoon (2 PM - 10 PM)</SelectItem>
                    <SelectItem value="Night (10 PM - 6 AM)">Night (10 PM - 6 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gate">Assigned Gate *</Label>
                <Select
                  value={formData.gate}
                  onValueChange={(value) => setFormData({ ...formData, gate: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Gate">Main Gate</SelectItem>
                    <SelectItem value="Back Gate">Back Gate</SelectItem>
                    <SelectItem value="Parking Gate">Parking Gate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Address */}
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

            {/* ID Proof */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idProof">ID Proof Type</Label>
                <Select
                  value={formData.idProof}
                  onValueChange={(value) => setFormData({ ...formData, idProof: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID Proof" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aadhar Card">Aadhar Card</SelectItem>
                    <SelectItem value="PAN Card">PAN Card</SelectItem>
                    <SelectItem value="Voter ID">Voter ID</SelectItem>
                    <SelectItem value="Driving License">Driving License</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddGuard}
              disabled={!formData.name || !formData.phone || !formData.password || !formData.shift || !formData.gate || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Guard'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Guard Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Guard Profile
            </DialogTitle>
          </DialogHeader>

          {selectedGuard && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {selectedGuard.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedGuard.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500" />
                    <span>{selectedGuard.rating} Rating</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{selectedGuard.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{selectedGuard.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Shift</p>
                  <p className="font-medium">{selectedGuard.shift}</p>
                </div>
                <div>
                  <p className="text-gray-500">Gate</p>
                  <p className="font-medium">{selectedGuard.gate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Join Date</p>
                  <p className="font-medium">{new Date(selectedGuard.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <Badge className={
                    selectedGuard.status === 'on-duty' ? 'bg-green-600' :
                      selectedGuard.status === 'leave' ? 'bg-yellow-500' : ''
                  }>
                    {selectedGuard.status === 'on-duty' ? 'On Duty' :
                      selectedGuard.status === 'leave' ? 'On Leave' : 'Off Duty'}
                  </Badge>
                </div>
                {selectedGuard.address && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium">{selectedGuard.address}</p>
                  </div>
                )}
                {selectedGuard.idProof && (
                  <>
                    <div>
                      <p className="text-gray-500">ID Proof</p>
                      <p className="font-medium">{selectedGuard.idProof}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">ID Number</p>
                      <p className="font-medium">{selectedGuard.idNumber}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false)
              if (selectedGuard) openEditDialog(selectedGuard)
            }}>
              Edit Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Guard Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Guard Details
            </DialogTitle>
            <DialogDescription>
              Update the security guard's information.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
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
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-emergency">Emergency Contact</Label>
                <Input
                  id="edit-emergency"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-shift">Shift *</Label>
                <Select
                  value={formData.shift}
                  onValueChange={(value) => setFormData({ ...formData, shift: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning (6 AM - 2 PM)">Morning (6 AM - 2 PM)</SelectItem>
                    <SelectItem value="Afternoon (2 PM - 10 PM)">Afternoon (2 PM - 10 PM)</SelectItem>
                    <SelectItem value="Night (10 PM - 6 AM)">Night (10 PM - 6 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gate">Assigned Gate *</Label>
                <Select
                  value={formData.gate}
                  onValueChange={(value) => setFormData({ ...formData, gate: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Gate">Main Gate</SelectItem>
                    <SelectItem value="Back Gate">Back Gate</SelectItem>
                    <SelectItem value="Parking Gate">Parking Gate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-idProof">ID Proof Type</Label>
                <Select
                  value={formData.idProof}
                  onValueChange={(value) => setFormData({ ...formData, idProof: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID Proof" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aadhar Card">Aadhar Card</SelectItem>
                    <SelectItem value="PAN Card">PAN Card</SelectItem>
                    <SelectItem value="Voter ID">Voter ID</SelectItem>
                    <SelectItem value="Driving License">Driving License</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-idNumber">ID Number</Label>
                <Input
                  id="edit-idNumber"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditGuard}
              disabled={!formData.name || !formData.phone || !formData.shift || !formData.gate || isSubmitting}
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
              Remove Guard
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this guard? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedGuard && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {selectedGuard.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedGuard.name}</p>
                <p className="text-sm text-gray-500">{selectedGuard.shift} - {selectedGuard.gate}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteGuard}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Removing...' : 'Remove Guard'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Guard Schedule
            </DialogTitle>
            <DialogDescription>
              Weekly schedule for {selectedGuard?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedGuard && (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 text-center">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-600">{day}</p>
                    <p className="text-sm font-semibold mt-1">{selectedGuard.shift.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500 mt-1">{selectedGuard.gate}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Current Assignment</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-blue-600">Shift</p>
                    <p className="font-medium">{selectedGuard.shift}</p>
                  </div>
                  <div>
                    <p className="text-blue-600">Gate</p>
                    <p className="font-medium">{selectedGuard.gate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendance History Dialog */}
      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Attendance History
            </DialogTitle>
            <DialogDescription>
              Last 30 days attendance for {selectedGuard?.name}
            </DialogDescription>
          </DialogHeader>

          {selectedGuard && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">25</p>
                  <p className="text-xs text-green-700">Present</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">2</p>
                  <p className="text-xs text-red-700">Absent</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                  <p className="text-xs text-yellow-700">Leave</p>
                </div>
              </div>

              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - i);
                  const statuses = ['present', 'present', 'present', 'absent', 'leave'];
                  const status = statuses[i % 5];

                  return (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-gray-500">{selectedGuard.shift}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {status === 'present' && (
                          <>
                            <span className="text-xs text-gray-600">
                              {new Date(date.setHours(6, Math.floor(Math.random() * 10))).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" /> Present
                            </Badge>
                          </>
                        )}
                        {status === 'absent' && (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" /> Absent
                          </Badge>
                        )}
                        {status === 'leave' && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            On Leave
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttendanceDialogOpen(false)}>
              Close
            </Button>
            <Button>
              Download Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
