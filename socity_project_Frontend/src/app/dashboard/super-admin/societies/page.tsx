'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Search,
  Plus,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  Users,
  Home,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Ban,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RoleGuard } from '@/components/auth/role-guard'
import Link from 'next/link'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function SocietiesPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingSociety, setEditingSociety] = useState<any>(null)
  const [viewingSociety, setViewingSociety] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const { data: societies = [], isLoading } = useQuery<any[]>({
    queryKey: ['societies'],
    queryFn: async () => {
      const response = await api.get('/society/all')
      return response.data
    }
  })

  const { data: plans = [] } = useQuery<any[]>({
    queryKey: ['billing-plans'],
    queryFn: async () => {
      const response = await api.get('/billing-plans')
      return Array.isArray(response.data) ? response.data : (response.data?.data ?? [])
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await api.patch(`/society/${id}/status`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['societies'] })
      toast.success('Society status updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update status')
    }
  })

  const updateSocietyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await api.put(`/society/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['societies'] })
      toast.success('Society updated successfully')
      setIsEditDialogOpen(false)
      setEditingSociety(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update society')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/society/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['societies'] })
      toast.success('Society deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete society')
    }
  })

  const stats = [
    { title: 'Total Societies', value: societies.length, icon: Building2, color: 'bg-blue-500' },
    { title: 'Active', value: societies.filter((s: any) => s.status === 'active').length, icon: CheckCircle2, color: 'bg-green-500' },
    { title: 'Pending Approval', value: societies.filter((s: any) => s.status === 'pending').length, icon: Clock, color: 'bg-orange-500' },
    { title: 'Suspended', value: societies.filter((s: any) => s.status === 'suspended').length, icon: XCircle, color: 'bg-red-500' },
  ]

  const filteredSocieties = societies.filter((society: any) => {
    const matchesSearch =
      society.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (society.city && society.city.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || society.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Pending</Badge>
      case 'suspended':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">{plan}</Badge>
      case 'Professional':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">{plan}</Badge>
      case 'Basic':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">{plan}</Badge>
      default:
        return <Badge variant="outline">{plan}</Badge>
    }
  }

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Societies Management</h1>
            <p className="text-gray-600">Manage all registered societies on the platform</p>
          </div>
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/dashboard/super-admin/societies/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Society
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 ${stat.color} rounded-xl`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Search and Filter */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search societies by name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>Pending</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('suspended')}>Suspended</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Societies Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>All Societies</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Society</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : filteredSocieties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                      No societies found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSocieties.map((society: any) => (
                    <TableRow key={society.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Building2 className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{society.name}</p>
                            <p className="text-xs text-gray-500">Joined {new Date(society.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {society.city}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Home className="h-3 w-3 text-gray-400" />
                          {society.unitsCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          {society.usersCount}
                        </div>
                      </TableCell>
                      <TableCell>{getPlanBadge(society.subscriptionPlan)}</TableCell>
                      <TableCell>{getStatusBadge(society.status)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">
                            {society.admin?.name || "No Admin Assigned"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {society.admin?.email || "N/A"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setEditingSociety(society)
                              setIsEditDialogOpen(true)
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setViewingSociety(society)
                              setIsViewDialogOpen(true)
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {society.status !== 'active' && (
                              <DropdownMenuItem
                                onClick={() => updateStatusMutation.mutate({ id: society.id, status: 'ACTIVE' })}
                                className="text-green-600 focus:text-green-600 focus:bg-green-50"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            {society.status !== 'suspended' && (
                              <DropdownMenuItem
                                className="text-orange-600 focus:text-orange-600 focus:bg-orange-50"
                                onClick={() => updateStatusMutation.mutate({ id: society.id, status: 'SUSPENDED' })}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingId(society.id)
                                setIsDeleteDialogOpen(true)
                              }}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Society
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )))
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Society Details</DialogTitle>
            </DialogHeader>
            {editingSociety && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Society Name</Label>
                  <Input
                    id="name"
                    value={editingSociety.name}
                    onChange={(e) => setEditingSociety({ ...editingSociety, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editingSociety.city}
                      onChange={(e) => setEditingSociety({ ...editingSociety, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={editingSociety.state}
                      onChange={(e) => setEditingSociety({ ...editingSociety, state: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={editingSociety.address || ''}
                    onChange={(e) => setEditingSociety({ ...editingSociety, address: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={editingSociety.pincode}
                    onChange={(e) => setEditingSociety({ ...editingSociety, pincode: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingPlan">Billing Plan</Label>
                  <Select
                    value={editingSociety.billingPlanId?.toString()}
                    onValueChange={(value) => setEditingSociety({ ...editingSociety, billingPlanId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select billing plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan: any) => {
                        const price = parseFloat(plan.price) || 0;
                        const disk = parseFloat(editingSociety.discount || '0');
                        const finalPrice = disk > 0 ? Math.round(price * (1 - disk / 100)) : price;
                        return (
                          <SelectItem key={plan.id} value={plan.id.toString()}>
                            {plan.name} ({plan.planType}) - ₹{finalPrice.toLocaleString()}
                            {disk > 0 && ` (-${disk}%)`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Subscription Tier (Manual Override)</Label>
                  <Select
                    value={editingSociety.subscriptionPlan}
                    onValueChange={(value) => setEditingSociety({ ...editingSociety, subscriptionPlan: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BASIC">Basic</SelectItem>
                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-discount">Discount Percentage (%)</Label>
                  <Input
                    id="edit-discount"
                    type="number"
                    value={editingSociety.discount ?? 0}
                    onChange={(e) => setEditingSociety({ ...editingSociety, discount: e.target.value })}
                  />
                </div>
                {editingSociety.billingPlanId && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-purple-700">Calculated Final Price:</span>
                    <div className="text-right">
                      {(() => {
                        const plan = plans.find((p: any) => p.id.toString() === editingSociety.billingPlanId?.toString());
                        if (!plan) return null;
                        const price = parseFloat(plan.price) || 0;
                        const disk = parseFloat(editingSociety.discount || '0');
                        const finalPrice = disk > 0 ? Math.round(price * (1 - disk / 100)) : price;
                        return (
                          <>
                            <span className="text-lg font-bold text-purple-600">₹{finalPrice.toLocaleString()}</span>
                            {disk > 0 && <span className="ml-2 text-xs text-gray-400 line-through">₹{price.toLocaleString()}</span>}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => updateSocietyMutation.mutate({
                  id: editingSociety.id,
                  data: {
                    name: editingSociety.name,
                    address: editingSociety.address,
                    city: editingSociety.city,
                    state: editingSociety.state,
                    pincode: editingSociety.pincode,
                    subscriptionPlan: editingSociety.subscriptionPlan,
                    billingPlanId: editingSociety.billingPlanId,
                    discount: editingSociety.discount
                  }
                })}
                disabled={updateSocietyMutation.isPending}
              >
                {updateSocietyMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Society Detailed Report</DialogTitle>
            </DialogHeader>
            {viewingSociety && (
              <div className="space-y-6 py-4">
                <div className="flex items-center gap-4 border-b pb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Building2 className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{viewingSociety.name}</h2>
                    <p className="text-gray-500">ID: {viewingSociety.code}</p>
                  </div>
                  <div className="ml-auto">
                    {getStatusBadge(viewingSociety.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Location</p>
                      <p className="mt-1 flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {viewingSociety.address || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 ml-5">{viewingSociety.city}, {viewingSociety.state} - {viewingSociety.pincode}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Subscription</p>
                      <div className="mt-1 flex items-center gap-2">
                        {getPlanBadge(viewingSociety.subscriptionPlan)}
                        <span className="text-sm text-gray-600">Joined {new Date(viewingSociety.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Admin Contact</p>
                      <p className="mt-1 font-medium">{viewingSociety.admin.name}</p>
                      <p className="text-sm text-gray-600">{viewingSociety.admin.email}</p>
                      <p className="text-sm text-gray-600">{viewingSociety.admin.phone || 'No phone provided'}</p>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Units</p>
                        <p className="text-lg font-bold">{viewingSociety.unitsCount} / {viewingSociety.expectedUnits}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Users</p>
                        <p className="text-lg font-bold">{viewingSociety.usersCount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Delete Society?</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">
                This will permanently delete the society and all related data (users, units, billing). This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deletingId) {
                    deleteMutation.mutate(deletingId)
                    setIsDeleteDialogOpen(false)
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </RoleGuard>
  )
}
