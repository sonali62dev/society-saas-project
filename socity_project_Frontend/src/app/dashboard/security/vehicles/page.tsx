'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Plus,
  Search,
  Filter,
  Download,
  Car,
  Bike,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Loader2,
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import VehicleService from '@/services/vehicleService'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { Switch } from '@/components/ui/switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [viewVehicle, setViewVehicle] = useState<any>(null)
  const [deleteVehicleId, setDeleteVehicleId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  // Form State
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Car',
    make: '',
    color: '',
    unitId: '',
    parkingSlot: '',
    ownerName: ''
  })

  // Fetch Stats
  const { data: stats } = useQuery({
    queryKey: ['vehicleStats'],
    queryFn: VehicleService.getStats
  })

  // Fetch Vehicles
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles', typeFilter, statusFilter, searchQuery],
    queryFn: () => VehicleService.getAll({ 
        type: typeFilter, 
        status: statusFilter,
        search: searchQuery
    })
  })

  // Fetch Units for dropdown
  const { data: units = [] } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
         const res = await api.get('/units') 
         return res.data
    }
  })

  const registerMutation = useMutation({
    mutationFn: (data: any) => VehicleService.register({
        ...data,
        unitId: parseInt(data.unitId)
    }),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vehicles'] })
        queryClient.invalidateQueries({ queryKey: ['vehicleStats'] })
        setIsRegisterDialogOpen(false)
        setFormData({
            vehicleNumber: '',
            vehicleType: 'Car',
            make: '',
            color: '',
            unitId: '',
            parkingSlot: '',
            ownerName: ''
        })
        toast.success('Vehicle registered successfully')
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to register vehicle')
    }
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      VehicleService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['vehicleStats'] })
      toast.success('Vehicle status updated')
    },
    onError: (error: any) => {
      toast.error('Failed to update status')
    }
  })

  const removeMutation = useMutation({
    mutationFn: VehicleService.remove,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['vehicles'] })
        queryClient.invalidateQueries({ queryKey: ['vehicleStats'] })
        toast.success('Vehicle removed')
        setDeleteVehicleId(null)
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to remove vehicle')
    }
  })

  const handleRegister = () => {
    if(!formData.vehicleNumber || !formData.unitId || !formData.ownerName) {
        toast.error('Please fill required fields')
        return
    }
    registerMutation.mutate(formData)
  }
  
  const handleStatusToggle = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'verified' ? 'pending' : 'verified';
    statusMutation.mutate({ id, status: newStatus });
  }

  const handleDelete = () => {
    if (deleteVehicleId) {
        removeMutation.mutate(deleteVehicleId)
    }
  }

  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats?.total || 0,
      icon: Car,
      color: 'blue',
    },
    {
      title: 'Cars',
      value: stats?.cars || 0,
      icon: Car,
      color: 'green',
    },
    {
      title: 'Two Wheelers',
      value: stats?.twoWheelers || 0,
      icon: Bike,
      color: 'purple',
    },
    {
      title: 'Verified',
      value: stats?.verified || 0,
      icon: CheckCircle,
      color: 'orange',
    },
  ]

  return (
    <RoleGuard allowedRoles={['admin', 'guard', 'resident']}>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
          <p className="text-gray-600 mt-1">
            Track and manage all registered vehicles
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white space-x-2">
                <Plus className="h-4 w-4" />
                <span>Register Vehicle</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Register New Vehicle</DialogTitle>
                <DialogDescription>
                  Add a new vehicle to the society registry
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle Number *</Label>
                    <Input 
                        placeholder="DL-01-AB-1234" 
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Select 
                        value={formData.vehicleType} 
                        onValueChange={(val) => setFormData({...formData, vehicleType: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="Two Wheeler">Two Wheeler</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Make & Model</Label>
                    <Input 
                        placeholder="Honda City" 
                        value={formData.make}
                        onChange={(e) => setFormData({...formData, make: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input 
                        placeholder="Silver" 
                        value={formData.color}
                        onChange={(e) => setFormData({...formData, color: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unit Number *</Label>
                    <Select 
                        value={formData.unitId} 
                        onValueChange={(val) => setFormData({...formData, unitId: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.length > 0 ? units.map((unit: any) => (
                            <SelectItem key={unit.id} value={unit.id.toString()}>
                                {unit.block}-{unit.number}
                            </SelectItem>
                        )) : (
                            <SelectItem value="no-units" disabled>No units found</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Parking Slot</Label>
                    <Input 
                        placeholder="P-A-12" 
                        value={formData.parkingSlot}
                        onChange={(e) => setFormData({...formData, parkingSlot: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Owner Name *</Label>
                  <Input 
                    placeholder="Resident name" 
                    value={formData.ownerName}
                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700" 
                    onClick={handleRegister}
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? 'Registering...' : 'Register Vehicle'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
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
              placeholder="Search by vehicle number, owner, or unit..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Car">Car</SelectItem>
              <SelectItem value="Two Wheeler">Two Wheeler</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="space-x-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </Button>
        </div>
      </Card>

      {/* Vehicles Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle ID</TableHead>
              <TableHead>Vehicle Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Make/Model</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Parking Slot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8"><Loader2 className="animate-spin h-8 w-8 mx-auto"/></TableCell></TableRow>
            ) : vehicles.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No vehicles found</TableCell></TableRow>
            ) : (
                vehicles.map((vehicle: any) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">#VEH-{vehicle.id}</TableCell>
                <TableCell className="font-semibold">{vehicle.number}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {vehicle.type === 'Car' && <Car className="h-4 w-4 text-blue-600" />}
                    {vehicle.type === 'Two Wheeler' && (
                      <Bike className="h-4 w-4 text-purple-600" />
                    )}
                    {vehicle.type === 'SUV' && <Car className="h-4 w-4 text-orange-600" />}
                    {vehicle.type === 'Other' && <Truck className="h-4 w-4 text-gray-600" />}
                    <span>{vehicle.type}</span>
                  </div>
                </TableCell>
                <TableCell>{vehicle.make}</TableCell>
                <TableCell>
                    <Badge variant="outline">
                        {vehicle.unit ? `${vehicle.unit.block}-${vehicle.unit.number}` : 'N/A'}
                    </Badge>
                </TableCell>
                <TableCell>{vehicle.ownerName}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{vehicle.parkingSlot || 'N/A'}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Switch
                        checked={vehicle.status === 'verified'}
                        onCheckedChange={() => handleStatusToggle(vehicle.id, vehicle.status)}
                    />
                    <Badge
                        variant={vehicle.status === 'verified' ? 'default' : 'secondary'}
                        className={
                        vehicle.status === 'verified'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                        }
                    >
                        {vehicle.status === 'verified' && (
                        <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {vehicle.status === 'pending' && <XCircle className="h-3 w-3 mr-1" />}
                        {vehicle.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="View Details"
                      onClick={() => setViewVehicle(vehicle)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                     <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteVehicleId(vehicle.id)}
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

      {/* View Details Dialog */}
      <Dialog open={!!viewVehicle} onOpenChange={() => setViewVehicle(null)}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
            </DialogHeader>
            {viewVehicle && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-gray-500">Vehicle Number</Label>
                            <p className="font-semibold">{viewVehicle.number}</p>
                        </div>
                        <div>
                            <Label className="text-gray-500">Status</Label>
                            <Badge variant={viewVehicle.status === 'verified' ? 'default' : 'secondary'}>
                                {viewVehicle.status}
                            </Badge>
                        </div>
                        <div>
                            <Label className="text-gray-500">Type</Label>
                            <p>{viewVehicle.type}</p>
                        </div>
                        <div>
                            <Label className="text-gray-500">Make/Model</Label>
                            <p>{viewVehicle.make}</p>
                        </div>
                        <div>
                            <Label className="text-gray-500">Owner</Label>
                            <p>{viewVehicle.ownerName}</p>
                        </div>
                        <div>
                            <Label className="text-gray-500">Unit</Label>
                            <p>{viewVehicle.unit ? `${viewVehicle.unit.block}-${viewVehicle.unit.number}` : 'N/A'}</p>
                        </div>
                         <div>
                            <Label className="text-gray-500">Parking Slot</Label>
                            <p>{viewVehicle.parkingSlot || 'N/A'}</p>
                        </div>
                         <div>
                            <Label className="text-gray-500">Color</Label>
                            <p>{viewVehicle.color || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteVehicleId} onOpenChange={() => setDeleteVehicleId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the vehicle 
                from the registry.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </RoleGuard>
  )
}
