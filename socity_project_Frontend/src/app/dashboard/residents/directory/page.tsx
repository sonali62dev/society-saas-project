'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Home,
  Users,
  UserCheck,
  UserX,
  Eye,
  Trash2,
  Pencil,
  Check,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminResidentService } from '@/services/admin-resident.service'
import { UnitService } from '@/services/unit.service'
import { toast } from 'sonner'

const stats = [
  {
    title: 'Total Units',
    value: '248',
    change: '+12',
    icon: Home,
    color: 'blue',
  },
  {
    title: 'Total Residents',
    value: '892',
    change: '+45',
    icon: Users,
    color: 'green',
  },
  {
    title: 'Active',
    value: '240',
    change: '+8',
    icon: UserCheck,
    color: 'purple',
  },
  {
    title: 'Vacant',
    value: '8',
    change: '-2',
    icon: UserX,
    color: 'orange',
  },
]

const residents = [
  {
    id: 'RES-001',
    unit: 'A-101',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    members: 4,
    vehicles: 2,
    status: 'owner',
    joinDate: '2022-01-15',
    avatar: null,
  },
  {
    id: 'RES-002',
    unit: 'B-205',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43211',
    members: 3,
    vehicles: 1,
    status: 'owner',
    joinDate: '2022-03-20',
    avatar: null,
  },
  {
    id: 'RES-003',
    unit: 'C-304',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91 98765 43212',
    members: 2,
    vehicles: 1,
    status: 'tenant',
    joinDate: '2023-06-10',
    avatar: null,
  },
  {
    id: 'RES-004',
    unit: 'A-502',
    name: 'Neha Gupta',
    email: 'neha.gupta@email.com',
    phone: '+91 98765 43213',
    members: 5,
    vehicles: 3,
    status: 'owner',
    joinDate: '2021-11-05',
    avatar: null,
  },
  {
    id: 'RES-005',
    unit: 'D-108',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 98765 43214',
    members: 3,
    vehicles: 2,
    status: 'owner',
    joinDate: '2022-08-22',
    avatar: null,
  },
]

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [blockFilter, setBlockFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isCreateUnitDialogOpen, setIsCreateUnitDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'owner',
    unitId: '',
    block: '',
    number: '',
    floor: '',
    type: '2BHK',
    areaSqFt: '',
    familyMembers: '',
    password: '',
    confirmPassword: '',
    securityDeposit: ''
  })

  // Edit State
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingResident, setEditingResident] = useState<any>(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: ''
  })

  // View State
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingResident, setViewingResident] = useState<any>(null)

  const [unitFormData, setUnitFormData] = useState({
    block: '',
    number: '',
    floor: '',
    type: 'APARTMENT',
    areaSqFt: ''
  })

  // Queries
  const { data: apiResidents = [], isLoading: residentsLoading } = useQuery({
    queryKey: ['admin-residents', blockFilter, statusFilter],
    queryFn: () => AdminResidentService.getResidents({
      block: blockFilter === 'all' ? undefined : blockFilter,
      type: 'directory'
    })
  })

  const { data: serverStats } = useQuery({
    queryKey: ['admin-resident-stats'],
    queryFn: () => AdminResidentService.getStats()
  })

  const { data: units = [], isLoading: unitsLoading, error: unitsError } = useQuery({
    queryKey: ['available-units'],
    queryFn: () => AdminResidentService.getUnits(),
  })

  // Handle units error
  if (unitsError) {
    console.error('Failed to load units:', unitsError)
  }

  // Mutations
  const createUnitMutation = useMutation({
    mutationFn: UnitService.createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-units'] })
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-resident-stats'] })
      setIsCreateUnitDialogOpen(false)
      toast.success('Unit created successfully')
      setUnitFormData({
        block: '',
        number: '',
        floor: '',
        type: 'APARTMENT',
        areaSqFt: ''
      })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error.message || 'Failed to create unit')
    }
  })

  const addResidentMutation = useMutation({
    mutationFn: AdminResidentService.addResident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-residents'] })
      queryClient.invalidateQueries({ queryKey: ['admin-resident-stats'] })
      queryClient.invalidateQueries({ queryKey: ['available-units'] })
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
      setIsAddDialogOpen(false)
      toast.success('Resident added successfully')
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'owner',
        unitId: '',
        block: '',
        number: '',
        floor: '',
        type: '2BHK',
        areaSqFt: '',
        familyMembers: '',
        password: '',
        confirmPassword: '',
        securityDeposit: ''
      })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error?.response?.data?.message || error.message || 'Failed to add resident')
    }
  })

  const updateResidentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) => AdminResidentService.updateResident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-residents'] })
      queryClient.invalidateQueries({ queryKey: ['admin-resident-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
      setIsEditDialogOpen(false)
      toast.success('Resident updated successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error.message || 'Failed to update resident')
    }
  })

  const deleteResidentMutation = useMutation({
    mutationFn: AdminResidentService.deleteResident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-residents'] })
      queryClient.invalidateQueries({ queryKey: ['admin-resident-stats'] })
      queryClient.invalidateQueries({ queryKey: ['available-units'] })
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] })
      toast.success('Resident deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error.message || 'Failed to delete resident')
    }
  })

  const handleDeleteResident = (resident: { id: number | string; name: string }) => {
    if (!confirm(`Are you sure you want to remove "${resident.name}" from the directory? This action cannot be undone.`)) return
    deleteResidentMutation.mutate(resident.id)
  }

  const handleEditResident = (resident: any) => {
    setEditingResident(resident)
    setEditFormData({
      name: resident.name,
      email: resident.email,
      phone: resident.phone || '',
      role: resident.role || 'RESIDENT',
      status: resident.status || 'ACTIVE'
    })
    setIsEditDialogOpen(true)
  }

  const handleViewResident = (resident: any) => {
    setViewingResident(resident)
    setIsViewDialogOpen(true)
  }

  const handleUpdateResident = () => {
    if (!editFormData.name || !editFormData.email) {
      toast.error('Name and Email are required')
      return
    }
    updateResidentMutation.mutate({
      id: editingResident.id,
      data: editFormData
    })
  }

  const filteredResidents = (apiResidents as any[]).filter((resident) => {
    const nameMatch = resident.name.toLowerCase().includes(searchQuery.toLowerCase())
    const emailMatch = resident.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const phoneMatch = resident.phone?.includes(searchQuery)
    const unitMatch = (resident.unit?.block + '-' + resident.unit?.number).toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSearch = nameMatch || emailMatch || phoneMatch || unitMatch
    const matchesStatus = statusFilter === 'all' || resident.role?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleAddResident = () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill in Name and Email')
      return
    }

    if (!formData.unitId && (!formData.block || !formData.number)) {
      toast.error('Please select an existing unit or enter details for a new one')
      return
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Password and Confirm Password do not match')
        return
      }
    }
    const { confirmPassword, ...payload } = formData
    if (payload.unitId === 'create_new') {
      delete (payload as any).unitId
    }
    addResidentMutation.mutate(payload as any)
  }

  const handleCreateUnit = () => {
    if (!unitFormData.block || !unitFormData.number) {
      toast.error('Block and Unit Number are required')
      return
    }
    createUnitMutation.mutate({
      block: unitFormData.block,
      number: unitFormData.number,
      floor: unitFormData.floor ? parseInt(unitFormData.floor) : undefined,
      type: unitFormData.type,
      areaSqFt: unitFormData.areaSqFt ? parseFloat(unitFormData.areaSqFt) : undefined
    })
  }

  const handleExportCSV = () => {
    if (filteredResidents.length === 0) {
      toast.error('No data to export')
      return
    }

    const headers = ['UID', 'Name', 'Unit', 'Email', 'Phone', 'Type', 'Join Date', 'Family Members', 'Vehicles']
    const csvContent = [
      headers.join(','),
      ...filteredResidents.map(r => [
        r.id,
        `"${r.name}"`,
        `"${r.unit ? `${r.unit.block}-${r.unit.number}` : 'N/A'}"`,
        r.email,
        r.phone || 'N/A',
        r.role,
        new Date(r.createdAt).toLocaleDateString(),
        r.familyMembersCount || 0,
        r.vehiclesCount || 0
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `resident_directory_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Directory exported successfully')
  }

  const residentStats = [
    {
      title: 'Total Units',
      value: serverStats?.units?.total || '0',
      change: '+0',
      icon: Home,
      color: 'blue',
    },
    {
      title: 'Total Residents',
      value: serverStats?.users?.totalResidents || '0',
      change: `+${serverStats?.users?.pending || 0}`,
      icon: Users,
      color: 'green',
    },
    {
      title: 'Owners',
      value: serverStats?.users?.owners || '0',
      change: 'Static',
      icon: UserCheck,
      color: 'purple',
    },
    {
      title: 'Tenants',
      value: serverStats?.users?.tenants || '0',
      change: 'Static',
      icon: UserX,
      color: 'orange',
    },
  ]

  return (
    <RoleGuard allowedRoles={['admin']}>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resident Directory</h1>
            <p className="text-gray-600 mt-1">
              View and manage all resident information
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="space-x-2" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button
              variant="outline"
              className="border-teal-500 text-teal-600 hover:bg-teal-50 space-x-2"
              onClick={() => setIsCreateUnitDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Create Unit</span>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Resident</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Resident</DialogTitle>
                  <DialogDescription>
                    Register a new resident to the society
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <div className="flex items-center justify-between">
                        <Label>Unit Selection *</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-blue-600 hover:text-blue-700"
                          onClick={() => setIsCreateUnitDialogOpen(true)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Create Unit
                        </Button>
                      </div>
                      <Select value={formData.unitId} onValueChange={(val) => setFormData({ ...formData, unitId: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select or Create New Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="create_new">-- Create New Unit --</SelectItem>
                          {units.map((unit: any) => {
                            const occupancy = unit.owner ? `Owner: ${unit.owner.name}` : (unit.tenant ? `Tenant: ${unit.tenant.name}` : 'Vacant');
                            const isOccupied = !!(unit.owner || unit.tenant);
                            return (
                              <SelectItem key={unit.id} value={unit.id.toString()}>
                                {unit.block}-{unit.number} ({unit.type}) - {occupancy}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.unitId === 'create_new' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 border rounded-lg bg-gray-50 space-y-4"
                    >
                      <p className="text-sm font-semibold text-blue-600">Unit Details (New Flat)</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Block *</Label>
                          <Input
                            placeholder="A, B, etc."
                            value={formData.block}
                            onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unit Number *</Label>
                          <Input
                            placeholder="101, 102, etc."
                            value={formData.number}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Floor</Label>
                          <Input
                            type="number"
                            placeholder="1"
                            value={formData.floor}
                            onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unit Type</Label>
                          <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2BHK">2BHK</SelectItem>
                              <SelectItem value="3BHK">3BHK</SelectItem>
                              <SelectItem value="4BHK">4BHK</SelectItem>
                              <SelectItem value="1BHK">1BHK</SelectItem>
                              <SelectItem value="VILLA">Villa</SelectItem>
                              <SelectItem value="SHOP">Shop</SelectItem>
                              <SelectItem value="PENTHOUSE">Penthouse</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Area (Sq Ft)</Label>
                          <Input
                            type="number"
                            placeholder="1200"
                            value={formData.areaSqFt}
                            onChange={(e) => setFormData({ ...formData, areaSqFt: e.target.value })}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Resident Type *</Label>
                      <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="tenant">Tenant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Family Members</Label>
                      <Input
                        type="number"
                        placeholder="4"
                        value={formData.familyMembers}
                        onChange={(e) => setFormData({ ...formData, familyMembers: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Security Deposit (Advance)</Label>
                      <Input
                        type="number"
                        placeholder="₹ 0"
                        value={formData.securityDeposit}
                        onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                      />
                      <p className="text-xs text-gray-500">Amount will be recorded in unit and transactions.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Login Password (optional)</Label>
                      <Input
                        type="password"
                        placeholder="Min 6 characters – resident can login with email + this"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        autoComplete="new-password"
                      />
                      <p className="text-xs text-gray-500">Leave blank to use default; resident can change later.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddResident}
                      disabled={addResidentMutation.isPending}
                    >
                      {addResidentMutation.isPending ? 'Adding...' : 'Add Resident'}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>

            {/* Create Unit Dialog */}
            <Dialog open={isCreateUnitDialogOpen} onOpenChange={setIsCreateUnitDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Unit</DialogTitle>
                  <DialogDescription>
                    Add a new unit to your society before adding residents
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Block *</Label>
                      <Input
                        placeholder="A, B, C, etc."
                        value={unitFormData.block}
                        onChange={(e) => setUnitFormData({ ...unitFormData, block: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Number *</Label>
                      <Input
                        placeholder="101, 102, etc."
                        value={unitFormData.number}
                        onChange={(e) => setUnitFormData({ ...unitFormData, number: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Floor</Label>
                      <Input
                        type="number"
                        placeholder="1, 2, 3..."
                        value={unitFormData.floor}
                        onChange={(e) => setUnitFormData({ ...unitFormData, floor: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={unitFormData.type} onValueChange={(val) => setUnitFormData({ ...unitFormData, type: val })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APARTMENT">Apartment</SelectItem>
                          <SelectItem value="VILLA">Villa</SelectItem>
                          <SelectItem value="SHOP">Shop</SelectItem>
                          <SelectItem value="OFFICE">Office</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Area (Sq Ft)</Label>
                    <Input
                      type="number"
                      placeholder="1200"
                      value={unitFormData.areaSqFt}
                      onChange={(e) => setUnitFormData({ ...unitFormData, areaSqFt: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleCreateUnit}
                    disabled={createUnitMutation.isPending || !unitFormData.block || !unitFormData.number}
                  >
                    {createUnitMutation.isPending ? 'Creating...' : 'Create Unit'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {residentStats.map((stat, index) => {
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
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    </div>
                    <div
                      className={`p-3 rounded-xl ${stat.color === 'blue'
                        ? 'bg-blue-100'
                        : stat.color === 'green'
                          ? 'bg-green-100'
                          : stat.color === 'purple'
                            ? 'bg-purple-100'
                            : 'bg-orange-100'
                        }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${stat.color === 'blue'
                          ? 'text-blue-600'
                          : stat.color === 'green'
                            ? 'text-green-600'
                            : stat.color === 'purple'
                              ? 'text-purple-600'
                              : 'text-orange-600'
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
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name, unit, email, or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                <SelectItem value="a">Block A</SelectItem>
                <SelectItem value="b">Block B</SelectItem>
                <SelectItem value="c">Block C</SelectItem>
                <SelectItem value="d">Block D</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </Card>

        {/* Residents Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resident</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Family Members</TableHead>
                <TableHead>Vehicles</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residentsLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                    Loading residents...
                  </TableCell>
                </TableRow>
              ) : filteredResidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                    No residents found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredResidents.map((resident: any) => (
                  <TableRow key={resident.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={resident.profileImg || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                            {resident.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{resident.name}</p>
                          <p className="text-sm text-gray-500">UID: {resident.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">
                        {resident.unit ? `${resident.unit.block}-${resident.unit.number}` : 'No Unit'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{resident.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{resident.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{resident.familyMembersCount || 0}</TableCell>
                    <TableCell className="text-center">{resident.vehiclesCount || 0}</TableCell>
                    <TableCell>
                      <Badge
                        variant={resident.role === 'OWNER' ? 'default' : 'secondary'}
                        className={
                          resident.role === 'OWNER'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                        }
                      >
                        {resident.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(resident.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Details"
                          onClick={() => handleViewResident(resident)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Send Email"
                          onClick={() => window.location.href = `mailto:${resident.email}?subject=Message from Society Management`}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete Resident"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteResident(resident)}
                          disabled={deleteResidentMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit Resident"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleEditResident(resident)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Edit Resident Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Resident Details</DialogTitle>
              <DialogDescription>
                Modify profile information for {editingResident?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Resident Type</Label>
                  <Select
                    value={editFormData.role?.toLowerCase()}
                    onValueChange={(val) => setEditFormData({ ...editFormData, role: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="resident">Resident</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editFormData.status?.toLowerCase()}
                    onValueChange={(val) => setEditFormData({ ...editFormData, status: val })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleUpdateResident}
                disabled={updateResidentMutation.isPending}
              >
                {updateResidentMutation.isPending ? 'Updating...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Resident Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-slate-50">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-8 text-white relative">
              <div className="flex items-center space-x-6">
                <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                  <AvatarImage src={viewingResident?.profileImg} />
                  <AvatarFallback className="bg-white/10 text-3xl font-bold">
                    {viewingResident?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-3xl font-bold">{viewingResident?.name}</h2>
                  <p className="opacity-90 flex items-center mt-1">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mr-2">
                      {viewingResident?.role}
                    </Badge>
                    UID: {viewingResident?.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card className="p-4 space-y-4 border-none shadow-sm">
                <h3 className="font-semibold text-gray-900 flex items-center border-b pb-2">
                  <Phone className="h-4 w-4 mr-2 text-teal-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Email Address</span>
                    <span className="text-sm font-medium">{viewingResident?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Phone Number</span>
                    <span className="text-sm font-medium">{viewingResident?.phone || 'Not Provided'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Member Since</span>
                    <span className="text-sm font-medium">
                      {viewingResident?.createdAt && new Date(viewingResident.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Unit Details */}
              <Card className="p-4 space-y-4 border-none shadow-sm">
                <h3 className="font-semibold text-gray-900 flex items-center border-b pb-2">
                  <Home className="h-4 w-4 mr-2 text-teal-600" />
                  Unit Details
                </h3>
                {viewingResident?.unit ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Block & Number</span>
                      <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                        {viewingResident.unit.block}-{viewingResident.unit.number}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Floor</span>
                      <span className="text-sm font-medium">{viewingResident.unit.floor}th Floor</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Unit Type</span>
                      <span className="text-sm font-medium">{viewingResident.unit.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Area</span>
                      <span className="text-sm font-medium">{viewingResident.unit.areaSqFt} Sq.Ft.</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-400 italic text-sm">
                    No unit assigned yet
                  </div>
                )}
              </Card>

              {/* Stats Card */}
              <Card className="p-4 md:col-span-2 border-none shadow-sm bg-teal-50/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Family Members</p>
                    <p className="text-xl font-bold text-teal-700">{viewingResident?.familyMembersCount || 0}</p>
                  </div>
                  <div className="border-x border-teal-100">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Vehicles</p>
                    <p className="text-xl font-bold text-teal-700">{viewingResident?.vehiclesCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                    <Badge className={
                      viewingResident?.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700 border-none'
                        : 'bg-red-100 text-red-700 border-none'
                    }>
                      {viewingResident?.status || 'ACTIVE'}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>

            <DialogFooter className="p-4 bg-white border-t">
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => {
                  setIsViewDialogOpen(false);
                  handleEditResident(viewingResident);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard >
  )
}
