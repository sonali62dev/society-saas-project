'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Plus,
  Search,
  Filter,
  Download,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Truck,
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
import ParcelService from '@/services/parcelService'
import api from '@/lib/api'
import toast from 'react-hot-toast'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ParcelsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewParcel, setViewParcel] = useState<any>(null)
  const [markCollectedId, setMarkCollectedId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  // Form State
  const [formData, setFormData] = useState({
    trackingNumber: '',
    unitId: '',
    courierName: '',
    description: '',
    remarks: '',
    receivedBy: 'Gate Keeper', // Default or from user context
  })

  // Fetch Stats
  const { data: statsData } = useQuery({
    queryKey: ['parcelStats'],
    queryFn: ParcelService.getStats
  })

  // Fetch Parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ['parcels', statusFilter, searchQuery],
    queryFn: () => ParcelService.getAll({
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

  const createMutation = useMutation({
    mutationFn: (data: any) => ParcelService.create({
      ...data,
      unitId: parseInt(data.unitId)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcels'] })
      queryClient.invalidateQueries({ queryKey: ['parcelStats'] })
      setIsAddDialogOpen(false)
      setFormData({
        trackingNumber: '',
        unitId: '',
        courierName: '',
        description: '',
        remarks: '',
        receivedBy: 'Gate Keeper'
      })
      toast.success('Parcel added successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add parcel')
    }
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ParcelService.updateStatus(id, status, 'Gate Keeper'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parcels'] })
      queryClient.invalidateQueries({ queryKey: ['parcelStats'] })
      setMarkCollectedId(null)
      toast.success('Parcel status updated')
    },
    onError: (error: any) => {
      toast.error('Failed to update status')
    }
  })

  const handleAddParcel = () => {
    if (!formData.trackingNumber || !formData.unitId || !formData.courierName) {
      toast.error('Please fill required fields')
      return
    }
    createMutation.mutate(formData)
  }

  const handleMarkCollected = () => {
    if (markCollectedId) {
      statusMutation.mutate({ id: markCollectedId, status: 'COLLECTED' })
    }
  }

  const stats = [
    {
      title: 'Total Parcels',
      value: statsData?.total || 0,
      //   change: '+45',
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Pending Pickup',
      value: statsData?.pending || 0,
      //   change: '+12',
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Delivered',
      value: statsData?.delivered || 0,
      //   change: '+32',
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Overdue',
      value: statsData?.overdue || 0,
      //   change: '+3',
      icon: AlertCircle,
      color: 'red',
    },
  ]

  return (
    <RoleGuard allowedRoles={['admin', 'guard']}>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parcel Management</h1>
            <p className="text-gray-600 mt-1">
              Contactless and safe collection of parcels
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Powered by igate — smart delivery tracking for your community
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Parcel</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Register New Parcel</DialogTitle>
                  <DialogDescription>
                    Add a parcel received at the gate
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tracking Number</Label>
                      <Input
                        placeholder="AMZ123456789"
                        value={formData.trackingNumber}
                        onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Number</Label>
                      <Select
                        value={formData.unitId}
                        onValueChange={(val) => setFormData({ ...formData, unitId: val })}
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Courier Service</Label>
                      <Select
                        value={formData.courierName}
                        onValueChange={(val) => setFormData({ ...formData, courierName: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select courier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Amazon">Amazon</SelectItem>
                          <SelectItem value="Flipkart">Flipkart</SelectItem>
                          <SelectItem value="BlueDart">BlueDart</SelectItem>
                          <SelectItem value="DTDC">DTDC</SelectItem>
                          <SelectItem value="FedEx">FedEx</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Received Time</Label>
                      <Input type="time" disabled defaultValue={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Package size and type"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  {/* 
                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Input placeholder="Optional notes" />
                </div> 
                */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddParcel}
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? 'Adding...' : 'Add Parcel'}
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
                    </div>
                    <div
                      className={`p-3 rounded-xl ${stat.color === 'blue'
                          ? 'bg-blue-100'
                          : stat.color === 'orange'
                            ? 'bg-orange-100'
                            : stat.color === 'green'
                              ? 'bg-green-100'
                              : 'bg-red-100'
                        }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${stat.color === 'blue'
                            ? 'text-blue-600'
                            : stat.color === 'orange'
                              ? 'text-orange-600'
                              : stat.color === 'green'
                                ? 'text-green-600'
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
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by tracking number, unit, or courier..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COLLECTED">Collected</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </Card>

        {/* Parcels Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parcel ID</TableHead>
                <TableHead>Tracking Number</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Resident</TableHead>
                <TableHead>Courier</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></TableCell></TableRow>
              ) : parcels.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No parcels found</TableCell></TableRow>
              ) : (
                parcels.map((parcel: any) => (
                  <TableRow key={parcel.id}>
                    <TableCell className="font-medium">#PCL-{parcel.id}</TableCell>
                    <TableCell className="font-mono text-sm">{parcel.trackingNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {parcel.unit ? `${parcel.unit.block}-${parcel.unit.number}` : 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{parcel.unit?.tenant?.name || parcel.unit?.owner?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span>{parcel.courierName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{new Date(parcel.createdAt).toLocaleDateString()}</div>
                        <div className="text-gray-500">{new Date(parcel.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </TableCell>
                    <TableCell>{parcel.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          parcel.status === 'COLLECTED'
                            ? 'default'
                            : parcel.status === 'OVERDUE'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className={
                          parcel.status === 'COLLECTED'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : parcel.status === 'OVERDUE'
                              ? 'bg-red-100 text-red-700 hover:bg-red-100'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                        }
                      >
                        {parcel.status === 'COLLECTED' && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {parcel.status === 'OVERDUE' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {parcel.status === 'PENDING' && <Clock className="h-3 w-3 mr-1" />}
                        {parcel.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Details"
                          onClick={() => setViewParcel(parcel)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {parcel.status === 'PENDING' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => setMarkCollectedId(parcel.id)}
                          >
                            Mark Collected
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )))}
            </TableBody>
          </Table>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={!!viewParcel} onOpenChange={(open) => !open && setViewParcel(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Parcel Details</DialogTitle>
              <DialogDescription>
                Detailed information for Parcel #{viewParcel?.id}
              </DialogDescription>
            </DialogHeader>
            {viewParcel && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tracking Number</p>
                    <p className="font-medium font-mono">{viewParcel.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant="outline" className={viewParcel.status === 'COLLECTED' ? 'text-green-600 border-green-200 bg-green-50' : viewParcel.status === 'OVERDUE' ? 'text-red-600 border-red-200 bg-red-50' : 'text-orange-600 border-orange-200 bg-orange-50'}>
                      {viewParcel.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Unit</p>
                    <p className="font-medium">{viewParcel.unit?.block}-{viewParcel.unit?.number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Resident</p>
                    <p className="font-medium">{viewParcel.unit?.tenant?.name || viewParcel.unit?.owner?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Courier</p>
                    <p className="font-medium">{viewParcel.courierName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Description</p>
                    <p className="font-medium">{viewParcel.description}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Received At</p>
                    <p className="font-medium">{new Date(viewParcel.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Received By</p>
                    <p className="font-medium">{viewParcel.receivedBy}</p>
                  </div>
                  {viewParcel.collectedAt && (
                    <>
                      <div>
                        <p className="text-muted-foreground">Collected At</p>
                        <p className="font-medium">{new Date(viewParcel.collectedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Collected By</p>
                        <p className="font-medium">{viewParcel.collectedBy}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={() => setViewParcel(null)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Mark Collected Alert Dialog */}
        <AlertDialog open={!!markCollectedId} onOpenChange={(open) => !open && setMarkCollectedId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark Parcel as Collected?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will update the status of the parcel to "COLLECTED" and record the current time. This cannot be undone clearly.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-green-600 hover:bg-green-700"
                onClick={handleMarkCollected}
              >
                Confirm Collection
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </RoleGuard>
  )
}
