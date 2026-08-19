'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Search,
  Download,
  Car,
  Bike,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  MapPin,
  User,
  UserX,
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
import ParkingSlotService, { ParkingSlot } from '@/services/parkingSlotService'
import { UnitService } from '@/services/unit.service'
import { toast } from 'sonner'

export default function ParkingSlotsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [blockFilter, setBlockFilter] = useState('all')
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null)
  const [viewingSlot, setViewingSlot] = useState<ParkingSlot | null>(null)
  
  const [newSlot, setNewSlot] = useState({
    number: '',
    type: 'four_wheeler',
    block: 'Block A',
    floor: 'Ground',
    monthlyCharge: '',
    status: 'available'
  })

  // Assignment states
  const [selectedUnit, setSelectedUnit] = useState('')
  const [assignVehicleNo, setAssignVehicleNo] = useState('')

  const queryClient = useQueryClient()
  
  const showNotification = (message: string) => {
      toast.success(message)
  }

  // Fetch Slots
  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['parking-slots', statusFilter, typeFilter, blockFilter, searchQuery],
    queryFn: () => ParkingSlotService.getAllSlots({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      block: blockFilter !== 'all' ? blockFilter : undefined,
      search: searchQuery || undefined
    })
  })

  // Fetch Stats
  const { data: statsData } = useQuery({
    queryKey: ['parking-stats'],
    queryFn: ParkingSlotService.getStats
  })

  // Fetch Units for assignment
  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
        const res = await UnitService.getUnits();
        return Array.isArray(res) ? res : (res.data || []);
    },
    enabled: isAssignDialogOpen
  })


  /* Edit State */
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | null>(null)

  // Mutations
  const createMutation = useMutation({
    mutationFn: ParkingSlotService.createSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-slots'] })
      queryClient.invalidateQueries({ queryKey: ['parking-stats'] })
      setIsAddDialogOpen(false)
      setNewSlot({ number: '', type: 'four_wheeler', block: 'Block A', floor: 'Ground', monthlyCharge: '', status: 'available' })
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, data: any }) => ParkingSlotService.updateSlot(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-slots'] })
      queryClient.invalidateQueries({ queryKey: ['parking-stats'] })
      setIsEditDialogOpen(false)
      setEditingSlot(null)
      setEditingSlot(null)
      showNotification('Parking slot updated successfully!')
    }
  })

  const assignMutation = useMutation({
    mutationFn: (data: { id: number; unitId: number; vehicleNumber: string }) => 
      ParkingSlotService.assignSlot(data.id, { unitId: data.unitId, vehicleNumber: data.vehicleNumber }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-slots'] })
      queryClient.invalidateQueries({ queryKey: ['parking-stats'] })
      setIsAssignDialogOpen(false)
      setSelectedSlot(null)
      setSelectedUnit('')
      setAssignVehicleNo('')
    }
  })

  const unassignMutation = useMutation({
    mutationFn: ParkingSlotService.unassignSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-slots'] })
      queryClient.invalidateQueries({ queryKey: ['parking-stats'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: ParkingSlotService.deleteSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-slots'] })
      queryClient.invalidateQueries({ queryKey: ['parking-stats'] })
    }
  })


  const handleCreate = () => {
    createMutation.mutate({
      ...newSlot,
      monthlyCharge: Number(newSlot.monthlyCharge)
    })
  }

  const handleAssign = () => {
    if (selectedSlot && selectedUnit && assignVehicleNo) {
      assignMutation.mutate({
        id: selectedSlot.id,
        unitId: parseInt(selectedUnit),
        vehicleNumber: assignVehicleNo
      })
    }
  }

  const handleUnassign = (slot: ParkingSlot) => {
    if (confirm(`Unassign slot ${slot.number}?`)) {
      unassignMutation.mutate(slot.id)
    }
  }

  const handleDelete = (id: number) => {
      if (confirm('Are you sure you want to delete this slot?')) {
          deleteMutation.mutate(id)
      }
  }

  const handleExport = () => {
    if (!slots || slots.length === 0) {
      showNotification('No data to export')
      return
    }

    const headers = ['Slot Number', 'Type', 'Block', 'Floor', 'Status', 'Monthly Charge', 'Assigned To', 'Vehicle Number']
    const csvContent = [
      headers.join(','),
      ...slots.map((slot: ParkingSlot) => [
        slot.number,
        slot.type,
        slot.block || '-',
        slot.floor || '-',
        slot.status,
        slot.monthlyCharge,
        slot.unit ? (slot.unit.owner?.name || slot.unit.tenant?.name || 'Occupied') : 'Available',
        slot.vehicleNumber || '-'
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `parking_slots_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showNotification('Exported successfully')
  }

  const handleUpdate = () => {
      if (editingSlot) {
          updateMutation.mutate({
              id: editingSlot.id,
              data: {
                  number: editingSlot.number,
                  type: editingSlot.type,
                  block: editingSlot.block,
                  floor: editingSlot.floor,
                  monthlyCharge: Number(editingSlot.monthlyCharge)
              }
          })
      }
  }


  const stats = [
    {
      title: 'Total Slots',
      value: statsData?.total || 0,
      change: 'All parking slots',
      icon: Car,
      color: 'blue',
    },
    {
      title: 'Occupied',
      value: statsData?.occupied || 0,
      change: `${statsData?.total ? Math.round((statsData.occupied / statsData.total) * 100) : 0}% occupancy`,
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Available',
      value: statsData?.available || 0,
      change: 'Ready to assign',
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Under Maintenance',
      value: statsData?.maintenance || 0,
      change: 'Temporarily blocked',
      icon: AlertCircle,
      color: 'red',
    },
  ]

  return (
    <RoleGuard allowedRoles={['admin', 'guard']}>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Parking Slot Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage parking slots and assignments
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
                  <Plus className="h-4 w-4" />
                  <span>Add Slot</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Parking Slot</DialogTitle>
                  <DialogDescription>
                    Create a new parking slot in the system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Slot Number *</Label>
                      <Input 
                        placeholder="P-A-30" 
                        value={newSlot.number}
                        onChange={(e) => setNewSlot({...newSlot, number: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type *</Label>
                      <Select 
                        value={newSlot.type} 
                        onValueChange={(val) => setNewSlot({...newSlot, type: val})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="two_wheeler">Two Wheeler</SelectItem>
                          <SelectItem value="four_wheeler">Four Wheeler</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                          <SelectItem value="visitor">Visitor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Block *</Label>
                      <Select 
                        value={newSlot.block} 
                        onValueChange={(val) => setNewSlot({...newSlot, block: val})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select block" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Block A">Block A</SelectItem>
                          <SelectItem value="Block B">Block B</SelectItem>
                          <SelectItem value="Block C">Block C</SelectItem>
                          <SelectItem value="Block D">Block D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Floor *</Label>
                      <Select 
                        value={newSlot.floor} 
                        onValueChange={(val) => setNewSlot({...newSlot, floor: val})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select floor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ground">Ground</SelectItem>
                          <SelectItem value="Basement 1">Basement 1</SelectItem>
                          <SelectItem value="Basement 2">Basement 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Charge (\u20B9) *</Label>
                    <Input 
                        type="number" 
                        placeholder="2000" 
                        value={newSlot.monthlyCharge}
                        onChange={(e) => setNewSlot({...newSlot, monthlyCharge: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleCreate} disabled={createMutation.isPending}>
                      {createMutation.isPending ? 'Adding...' : 'Add Slot'}
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
                              : 'bg-red-100'
                        }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${stat.color === 'blue'
                            ? 'text-blue-600'
                            : stat.color === 'green'
                              ? 'text-green-600'
                              : stat.color === 'orange'
                                ? 'text-orange-600'
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

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by slot, resident, or vehicle..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="two_wheeler">Two Wheeler</SelectItem>
                <SelectItem value="four_wheeler">Four Wheeler</SelectItem>
              </SelectContent>
            </Select>
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                <SelectItem value="Block A">Block A</SelectItem>
                <SelectItem value="Block B">Block B</SelectItem>
                <SelectItem value="Block C">Block C</SelectItem>
                <SelectItem value="Block D">Block D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Slots Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Slot ID</TableHead>
                  <TableHead>Slot Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Monthly Charge</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">Loading slots...</TableCell>
                    </TableRow>
                ) : slots.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">No parking slots found</TableCell>
                    </TableRow>
                ) : (
                    slots.map((slot: ParkingSlot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">#{slot.id}</TableCell>
                    <TableCell className="font-semibold">{slot.number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {slot.type === 'four_wheeler' ? (
                          <Car className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Bike className="h-4 w-4 text-green-500" />
                        )}
                        <span className="capitalize">{slot.type.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span>{slot.block || '-'}, {slot.floor || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {slot.unit ? (
                        <div>
                          <p className="font-medium">{slot.unit.owner?.name || slot.unit.tenant?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{slot.unit.block}-{slot.unit.number}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {slot.vehicleNumber || '-'}
                    </TableCell>
                    <TableCell className="font-semibold">
                      \u20B9{(slot.monthlyCharge || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          slot.status === 'occupied'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : slot.status === 'available'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                              : 'bg-red-100 text-red-700 hover:bg-red-100'
                        }
                      >
                        {slot.status === 'occupied' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {slot.status === 'available' && <Clock className="h-3 w-3 mr-1" />}
                        {slot.status === 'maintenance' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" title="View Details" onClick={() => setViewingSlot(slot)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {slot.status === 'available' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Assign Slot"
                            onClick={() => {
                              setSelectedSlot(slot)
                              setIsAssignDialogOpen(true)
                            }}
                          >
                            <User className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                        {slot.status === 'occupied' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Unassign"
                            onClick={() => handleUnassign(slot)}
                          >
                            <UserX className="h-4 w-4 text-orange-500" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(slot.id)}>
                             <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Assign Slot Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Assign Parking Slot</DialogTitle>
              <DialogDescription>
                Assign slot {selectedSlot?.number} to a resident
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Resident *</Label>
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resident" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit: any) => (
                        <SelectItem key={unit.id} value={unit.id.toString()}>
                            {unit.owner?.name || unit.tenant?.name || `Unit ${unit.block}-${unit.number}`} ({unit.block}-{unit.number})
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vehicle Number *</Label>
                <Input 
                    placeholder="MH 01 AB 1234" 
                    value={assignVehicleNo}
                    onChange={(e) => setAssignVehicleNo(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleAssign} disabled={assignMutation.isPending}>
                  {assignMutation.isPending ? 'Assigning...' : 'Assign Slot'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Slot Dialog */}
        <Dialog open={viewingSlot !== null} onOpenChange={() => setViewingSlot(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Slot Details</DialogTitle>
              <DialogDescription>Parking slot information</DialogDescription>
            </DialogHeader>
            {viewingSlot && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Slot ID</Label>
                    <p className="font-medium">#{viewingSlot.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Slot Number</Label>
                    <p className="font-medium">{viewingSlot.number}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Type</Label>
                    <p className="font-medium capitalize">{viewingSlot.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Status</Label>
                    <Badge className={viewingSlot.status === 'occupied' ? 'bg-green-100 text-green-700' : viewingSlot.status === 'available' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}>
                      {viewingSlot.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Block</Label>
                    <p className="font-medium">{viewingSlot.block || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Floor</Label>
                    <p className="font-medium">{viewingSlot.floor || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Monthly Charge</Label>
                    <p className="font-medium text-green-600">\u20B9{(viewingSlot.monthlyCharge || 0).toLocaleString()}</p>
                  </div>
                  {viewingSlot.unit && (
                    <>
                      <div>
                        <Label className="text-muted-foreground text-xs">Assigned To</Label>
                        <p className="font-medium">{viewingSlot.unit.owner?.name || viewingSlot.unit.tenant?.name || 'Unknown'}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Unit</Label>
                        <p className="font-medium">{viewingSlot.unit.block}-{viewingSlot.unit.number}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Vehicle Number</Label>
                        <p className="font-medium">{viewingSlot.vehicleNumber || '-'}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setViewingSlot(null)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Parking Slot</DialogTitle>
              <DialogDescription>
                Update parking slot details
              </DialogDescription>
            </DialogHeader>
            {editingSlot && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Slot Number *</Label>
                  <Input 
                    placeholder="P-A-30" 
                    value={editingSlot.number}
                    onChange={(e) => setEditingSlot({...editingSlot, number: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <Select 
                    value={editingSlot.type} 
                    onValueChange={(val) => setEditingSlot({...editingSlot, type: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="two_wheeler">Two Wheeler</SelectItem>
                      <SelectItem value="four_wheeler">Four Wheeler</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="visitor">Visitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Block *</Label>
                  <Select 
                    value={editingSlot.block} 
                    onValueChange={(val) => setEditingSlot({...editingSlot, block: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Block A">Block A</SelectItem>
                      <SelectItem value="Block B">Block B</SelectItem>
                      <SelectItem value="Block C">Block C</SelectItem>
                      <SelectItem value="Block D">Block D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Floor *</Label>
                  <Select 
                    value={editingSlot.floor} 
                    onValueChange={(val) => setEditingSlot({...editingSlot, floor: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ground">Ground</SelectItem>
                      <SelectItem value="Basement 1">Basement 1</SelectItem>
                      <SelectItem value="Basement 2">Basement 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Monthly Charge (\u20B9) *</Label>
                <Input 
                    type="number" 
                    placeholder="2000" 
                    value={editingSlot.monthlyCharge}
                    onChange={(e) => setEditingSlot({...editingSlot, monthlyCharge: parseFloat(e.target.value)})}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleUpdate} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Updating...' : 'Update Slot'}
                </Button>
              </div>
            </div>
            )}
          </DialogContent>
        </Dialog>
        
        </Dialog>
      </div>
    </RoleGuard>
  )
}
