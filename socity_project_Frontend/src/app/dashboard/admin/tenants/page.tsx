'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Plus,
  Search,
  Filter,
  Download,
  Users,
  Home,
  Phone,
  Mail,
  Calendar,
  Car,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  UserPlus,
  FileText,
  AlertCircle,
  Clock,
  IndianRupee,
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
import { TenantService } from '@/services/tenant.service'
import { AdminResidentService } from '@/services/admin-resident.service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface Tenant {
  id: string;
  dbId: number;
  name: string;
  email: string;
  phone: string;
  unit: string;
  block: string;
  floor: string;
  ownerName: string;
  ownerPhone: string;
  leaseStartDate: string;
  leaseEndDate: string;
  rentAmount: number;
  securityDeposit: number;
  maintenanceCharges: number;
  parkingSlot: string;
  vehicleNumber: string;
  emergencyContact: string;
  familyMembers: number;
  status: string;
}

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [blockFilter, setBlockFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)
  const [newTenant, setNewTenant] = useState({
    name: '',
    email: '',
    phone: '',
    familyMembers: '',
    emergencyContact: '',
    block: '',
    floor: '',
    unitNumber: '',
    ownerName: '',
    ownerPhone: '',
    leaseStartDate: '',
    leaseEndDate: '',
    rentAmount: '',
    securityDeposit: '',
    maintenanceCharges: '',
    parkingSlot: '',
    vehicleNumber: '',
    notes: '',
    status: 'active'
  })

  const queryClient = useQueryClient()

  const { data: tenantsData, isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => TenantService.getAll()
  })

  const { data: statsData } = useQuery({
    queryKey: ['tenant-stats'],
    queryFn: () => TenantService.getStats()
  })

  const { data: unitsData } = useQuery({
    queryKey: ['units'],
    queryFn: () => AdminResidentService.getUnits()
  })

  const tenants = tenantsData?.data || []
  const stats = [
    {
      title: 'Total Tenants',
      value: statsData?.data?.totalTenants?.toString() || '0',
      change: '+5 this month',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Active Leases',
      value: statsData?.data?.activeLeases?.toString() || '0',
      change: 'Calculated live',
      icon: Home,
      color: 'green',
    },
    {
      title: 'Notice Period',
      value: statsData?.data?.expiringSoon?.toString() || '0',
      change: 'Expiring soon',
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Monthly Rent Collection',
      value: `₹${((statsData?.data?.totalRent || 0) / 100000).toFixed(1)}L`,
      change: 'Total projected',
      icon: IndianRupee,
      color: 'purple',
    },
  ]

  const createMutation = useMutation({
    mutationFn: TenantService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['tenant-stats'] })
      setIsAddDialogOpen(false)
      toast.success('Tenant added successfully!')
      setNewTenant({
        name: '', email: '', phone: '', familyMembers: '', emergencyContact: '',
        block: '', floor: '', unitNumber: '', ownerName: '', ownerPhone: '',
        leaseStartDate: '', leaseEndDate: '', rentAmount: '', securityDeposit: '',
        maintenanceCharges: '', parkingSlot: '', vehicleNumber: '', notes: '', status: 'active'
      })
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add tenant')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => TenantService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['tenant-stats'] })
      setEditingTenant(null)
      toast.success('Tenant updated successfully!')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update tenant')
  })

  const deleteMutation = useMutation({
    mutationFn: TenantService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['tenant-stats'] })
      toast.success('Tenant removed successfully!')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to remove tenant')
  })

  const handleAddTenant = () => {
    if (!newTenant.name || !newTenant.email || !newTenant.unitNumber) {
      toast.error('Please fill required fields')
      return
    }
    createMutation.mutate(newTenant)
  }

  const handleExport = () => {
    if (!tenants || tenants.length === 0) {
      toast.error('No tenants to export')
      return
    }
    const headers = ['Tenant ID', 'Name', 'Email', 'Phone', 'Unit', 'Block', 'Floor', 'Rent', 'Lease End', 'Status']
    const csvContent = [
      headers.join(','),
      ...(tenants || []).map((t: any) => [
        t.id,
        `"${t.name}"`,
        t.email,
        t.phone,
        t.unit,
        t.block,
        t.floor,
        t.rentAmount,
        t.leaseEndDate,
        t.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `tenants_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Tenant data exported successfully!')
  }

  const handleSaveEdit = () => {
    if (!editingTenant) return
    updateMutation.mutate({ id: editingTenant.dbId, data: editingTenant })
  }

  const handleDeleteTenant = (dbId: number) => {
    if (confirm(`Are you sure you want to remove this tenant?`)) {
      deleteMutation.mutate(dbId)
    }
  }

  const filteredTenants = (tenants || []).filter((tenant: any) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesBlock = blockFilter === 'all' || tenant.block === blockFilter
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter

    return matchesSearch && matchesBlock && matchesStatus
  })

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tenant Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage tenant details, leases, and rental information
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2 text-sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white gap-2 text-sm">
                  <UserPlus className="h-4 w-4" />
                  <span>Add Tenant</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Tenant</DialogTitle>
                  <DialogDescription>
                    Register a new tenant when they rent a unit
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input
                          placeholder="Enter tenant name"
                          value={newTenant.name}
                          onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          placeholder="tenant@email.com"
                          value={newTenant.email}
                          onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number *</Label>
                        <Input
                          placeholder="+91 98765 43210"
                          value={newTenant.phone}
                          onChange={(e) => setNewTenant({ ...newTenant, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Family Members</Label>
                        <Input
                          type="number"
                          placeholder="4"
                          value={newTenant.familyMembers}
                          onChange={(e) => setNewTenant({ ...newTenant, familyMembers: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Emergency Contact</Label>
                        <Input
                          placeholder="+91 87654 32109"
                          value={newTenant.emergencyContact}
                          onChange={(e) => setNewTenant({ ...newTenant, emergencyContact: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Unit Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Unit Details</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Block *</Label>
                        <Select
                          value={newTenant.block}
                          onValueChange={(val) => setNewTenant({ ...newTenant, block: val })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select block" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Block A</SelectItem>
                            <SelectItem value="B">Block B</SelectItem>
                            <SelectItem value="C">Block C</SelectItem>
                            <SelectItem value="D">Block D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Unit Number *</Label>
                        <Select
                          value={newTenant.unitNumber}
                          onValueChange={(val) => setNewTenant({ ...newTenant, unitNumber: val })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitsData?.filter((u: any) => !newTenant.block || u.block === newTenant.block).map((unit: any) => (
                              <SelectItem key={unit.id} value={unit.number}>
                                {unit.number} ({unit.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Owner Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Owner Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Owner Name</Label>
                        <Input
                          placeholder="Property owner name"
                          value={newTenant.ownerName}
                          onChange={(e) => setNewTenant({ ...newTenant, ownerName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Owner Phone</Label>
                        <Input
                          placeholder="+91 87654 32109"
                          value={newTenant.ownerPhone}
                          onChange={(e) => setNewTenant({ ...newTenant, ownerPhone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lease Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Lease & Payment Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Lease Start Date *</Label>
                        <Input
                          type="date"
                          value={newTenant.leaseStartDate}
                          onChange={(e) => setNewTenant({ ...newTenant, leaseStartDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Lease End Date *</Label>
                        <Input
                          type="date"
                          value={newTenant.leaseEndDate}
                          onChange={(e) => setNewTenant({ ...newTenant, leaseEndDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Monthly Rent (₹) *</Label>
                        <Input
                          type="number"
                          placeholder="25000"
                          value={newTenant.rentAmount}
                          onChange={(e) => setNewTenant({ ...newTenant, rentAmount: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Security Deposit (₹) *</Label>
                        <Input
                          type="number"
                          placeholder="75000"
                          value={newTenant.securityDeposit}
                          onChange={(e) => setNewTenant({ ...newTenant, securityDeposit: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Maintenance Charges (₹)</Label>
                        <Input
                          type="number"
                          placeholder="3500"
                          value={newTenant.maintenanceCharges}
                          onChange={(e) => setNewTenant({ ...newTenant, maintenanceCharges: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select
                          value={newTenant.status}
                          onValueChange={(val) => setNewTenant({ ...newTenant, status: val })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="notice_period">Notice Period</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle & Parking */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Vehicle & Parking</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Parking Slot</Label>
                        <Input
                          placeholder="P-A-15"
                          value={newTenant.parkingSlot}
                          onChange={(e) => setNewTenant({ ...newTenant, parkingSlot: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Vehicle Number</Label>
                        <Input
                          placeholder="MH 01 AB 1234"
                          value={newTenant.vehicleNumber}
                          onChange={(e) => setNewTenant({ ...newTenant, vehicleNumber: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      placeholder="Any additional information..."
                      rows={3}
                      value={newTenant.notes}
                      onChange={(e) => setNewTenant({ ...newTenant, notes: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleAddTenant}>
                      Add Tenant
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
                      className={`p-3 rounded-xl ${stat.color === 'blue'
                        ? 'bg-blue-100'
                        : stat.color === 'green'
                          ? 'bg-green-100'
                          : stat.color === 'orange'
                            ? 'bg-orange-100'
                            : 'bg-purple-100'
                        }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${stat.color === 'blue'
                          ? 'text-blue-600'
                          : stat.color === 'green'
                            ? 'text-green-600'
                            : stat.color === 'orange'
                              ? 'text-orange-600'
                              : 'text-purple-600'
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
                placeholder="Search by name, unit, phone, or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger className="w-40">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="notice_period">Notice Period</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </Card>

        {/* Tenants Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Maintenance</TableHead>
                  <TableHead>Lease End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(tenants || []).filter((tenant: any) => {
                  const matchesSearch =
                    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tenant.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tenant.phone.includes(searchQuery) ||
                    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())

                  const matchesBlock = blockFilter === 'all' || tenant.block === blockFilter
                  const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter

                  return matchesSearch && matchesBlock && matchesStatus
                }).map((tenant: any) => (
                  <TableRow key={tenant.dbId}>
                    <TableCell className="font-medium">{tenant.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{tenant.name}</p>
                        <p className="text-xs text-gray-500">{tenant.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{tenant.unit}</p>
                        <p className="text-xs text-gray-500">{tenant.block}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{tenant.phone}</TableCell>
                    <TableCell className="font-semibold">
                      ₹{tenant.rentAmount?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      ₹{tenant.maintenanceCharges?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">{tenant.leaseEndDate}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          tenant.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : tenant.status === 'notice_period'
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                              : 'bg-red-100 text-red-700 hover:bg-red-100'
                        }
                      >
                        {tenant.status === 'active' && 'Active'}
                        {tenant.status === 'notice_period' && 'Notice Period'}
                        {tenant.status === 'inactive' && 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" title="View Details" onClick={() => setViewingTenant(tenant)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => setEditingTenant(tenant)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteTenant(tenant.dbId)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* View Tenant Dialog */}
        <Dialog open={viewingTenant !== null} onOpenChange={() => setViewingTenant(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tenant Details</DialogTitle>
              <DialogDescription>Complete information about the tenant</DialogDescription>
            </DialogHeader>
            {viewingTenant && (
              <div className="space-y-6 py-4">
                {/* Personal Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">PERSONAL INFORMATION</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Name</Label>
                      <p className="font-medium">{viewingTenant.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Tenant ID</Label>
                      <p className="font-medium">{viewingTenant.id}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Email</Label>
                      <p className="font-medium">{viewingTenant.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Phone</Label>
                      <p className="font-medium">{viewingTenant.phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Family Members</Label>
                      <p className="font-medium">{viewingTenant.familyMembers}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Status</Label>
                      <Badge className={viewingTenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                        {viewingTenant.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Unit Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">UNIT DETAILS</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Unit</Label>
                      <p className="font-medium">{viewingTenant.unit}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Block</Label>
                      <p className="font-medium">{viewingTenant.block}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Floor</Label>
                      <p className="font-medium">{viewingTenant.floor}</p>
                    </div>
                  </div>
                </div>

                {/* Owner Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">OWNER DETAILS</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Owner Name</Label>
                      <p className="font-medium">{viewingTenant.ownerName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Owner Phone</Label>
                      <p className="font-medium">{viewingTenant.ownerPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Lease & Payment Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">LEASE & PAYMENT</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Lease Start</Label>
                      <p className="font-medium">{viewingTenant.leaseStartDate}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Lease End</Label>
                      <p className="font-medium">{viewingTenant.leaseEndDate}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Monthly Rent</Label>
                      <p className="font-medium text-green-600">₹{viewingTenant.rentAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Security Deposit</Label>
                      <p className="font-medium">₹{viewingTenant.securityDeposit?.toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Maintenance Charges</Label>
                      <p className="font-medium">₹{viewingTenant.maintenanceCharges?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">VEHICLE & PARKING</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Parking Slot</Label>
                      <p className="font-medium">{viewingTenant.parkingSlot || 'Not Assigned'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Vehicle Number</Label>
                      <p className="font-medium">{viewingTenant.vehicleNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setViewingTenant(null)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Tenant Dialog */}
        <Dialog open={editingTenant !== null} onOpenChange={() => setEditingTenant(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Tenant</DialogTitle>
              <DialogDescription>Update tenant information</DialogDescription>
            </DialogHeader>
            {editingTenant && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={editingTenant.name}
                      onChange={(e) => setEditingTenant({ ...editingTenant, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={editingTenant.phone}
                      onChange={(e) => setEditingTenant({ ...editingTenant, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={editingTenant.email}
                      onChange={(e) => setEditingTenant({ ...editingTenant, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      value={editingTenant.unit}
                      onChange={(e) => setEditingTenant({ ...editingTenant, unit: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Rent (₹)</Label>
                    <Input
                      type="number"
                      value={editingTenant.rentAmount}
                      onChange={(e) => setEditingTenant({ ...editingTenant, rentAmount: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Maintenance (₹)</Label>
                    <Input
                      type="number"
                      value={editingTenant.maintenanceCharges}
                      onChange={(e) => setEditingTenant({ ...editingTenant, maintenanceCharges: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={editingTenant.status}
                      onValueChange={(val) => setEditingTenant({ ...editingTenant, status: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="notice_period">Notice Period</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lease End Date</Label>
                    <Input
                      type="date"
                      value={editingTenant.leaseEndDate}
                      onChange={(e) => setEditingTenant({ ...editingTenant, leaseEndDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingTenant(null)}>Cancel</Button>
                  <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleSaveEdit}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
