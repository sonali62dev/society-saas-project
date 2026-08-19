'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  MoreVertical,
  Plus,
  Trash2,
  Tag,
  FileText,
  DollarSign,
  Edit
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/role-guard'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function SubscriptionsPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editPlan, setEditPlan] = useState<any | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const [newPlan, setNewPlan] = useState({
    name: '',
    type: 'Monthly',
    planType: 'BASIC',
    price: '',
    description: '',
    features: '',
    status: 'active'
  })

  const { data: plansRaw = [], isLoading } = useQuery<any[]>({
    queryKey: ['billing-plans'],
    queryFn: async () => {
      const response = await api.get('/billing-plans')
      return response.data
    }
  })

  const plans = Array.isArray(plansRaw) ? plansRaw : []

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/billing-plans', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-plans'] })
      toast.success('Subscription plan created successfully')
      setIsAddOpen(false)
      setNewPlan({
        name: '',
        type: 'Monthly',
        planType: 'BASIC',
        price: '',
        description: '',
        features: '',
        status: 'active'
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create plan')
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: any }) => {
      const response = await api.put(`/billing-plans/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-plans'] })
      toast.success('Subscription plan updated')
      setEditPlan(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update plan')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/billing-plans/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-plans'] })
      toast.success('Subscription plan deleted')
      setDeleteId(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete plan')
    }
  })

  const filteredPlans = plans.filter(
    (plan) =>
      (plan.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (plan.price || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddPlan = () => {
    if (!newPlan.name?.trim()) {
      return toast.error('Please enter a plan name')
    }
    createMutation.mutate({
      ...newPlan,
      price: newPlan.price ? String(newPlan.price) : '0'
    })
  }

  const handleUpdatePlan = () => {
    if (!editPlan) return
    updateMutation.mutate({ id: editPlan.id, data: editPlan })
  }

  const handleDeletePlan = () => {
    if (deleteId === null) return
    deleteMutation.mutate(deleteId)
  }

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="text-gray-600">Manage and create billing plans for societies</p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Plan
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{plans.length}</p>
                  <p className="text-sm text-gray-500">Total Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{plans.filter(p => p.status === 'active').length}</p>
                  <p className="text-sm text-gray-500">Active Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Tag className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Monthly</p>
                  <p className="text-sm text-gray-500">Most Popular Type</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search plans by name or price..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : filteredPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                      No plans found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                    <TableCell>
                      <div className="font-bold text-gray-900">{plan.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        plan.planType === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                        plan.planType === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {plan.planType || 'BASIC'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-medium text-green-700">
                        {plan.price}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                        {plan.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-500">
                      {plan.description}
                    </TableCell>
                    <TableCell>
                      <Badge className={plan.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                        {plan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditPlan(plan)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Plan
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(plan.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Plan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Plan Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
              <DialogDescription>Define a new subscription pricing plan.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Gold Tier"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    placeholder="e.g. ₹5000"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="planType">Plan Tier</Label>
                  <Select
                    value={newPlan.planType}
                    onValueChange={(val) => setNewPlan({ ...newPlan, planType: val })}
                  >
                    <SelectTrigger id="planType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BASIC">Basic</SelectItem>
                      <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise (Custom)</SelectItem>
                      <SelectItem value="CUSTOM">Custom Plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Billing Type</Label>
                <Select
                  value={newPlan.type}
                  onValueChange={(val) => setNewPlan({ ...newPlan, type: val })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Yearly">Yearly</SelectItem>
                    <SelectItem value="One-Time">One-Time</SelectItem>
                    <SelectItem value="Custom">Custom / Contact Us</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What does this plan include?"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Plan Features / Highlights (1 per line)</Label>
                <Textarea
                  id="features"
                  rows={4}
                  placeholder={"Up to 100 Residential Units\nGate Pass & Visitor Logs\nAutomated Billing & Accounts\n24/7 Dedicated Support"}
                  value={newPlan.features}
                  onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                />
                <p className="text-[11px] text-gray-500">Each line will be displayed as a feature bullet point on the public Landing Page.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddPlan} className="bg-[#1e3a5f] text-white hover:bg-[#2d4a6f]">Create Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Plan Dialog */}
        <Dialog open={!!editPlan} onOpenChange={() => setEditPlan(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Plan</DialogTitle>
            </DialogHeader>
            {editPlan && (
              <>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Plan Name</Label>
                    <Input
                      id="edit-name"
                      value={editPlan.name}
                      onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">Price</Label>
                      <Input
                        id="edit-price"
                        value={editPlan.price}
                        onChange={(e) => setEditPlan({ ...editPlan, price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-planType">Plan Tier</Label>
                      <Select
                        value={editPlan.planType}
                        onValueChange={(val) => setEditPlan({ ...editPlan, planType: val })}
                      >
                        <SelectTrigger id="edit-planType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BASIC">Basic</SelectItem>
                          <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                          <SelectItem value="ENTERPRISE">Enterprise (Custom)</SelectItem>
                          <SelectItem value="CUSTOM">Custom Plan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Billing Type</Label>
                    <Select
                      value={editPlan.type}
                      onValueChange={(val) => setEditPlan({ ...editPlan, type: val })}
                    >
                      <SelectTrigger id="edit-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Yearly">Yearly</SelectItem>
                        <SelectItem value="One-Time">One-Time</SelectItem>
                        <SelectItem value="Custom">Custom / Contact Us</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editPlan.description || ''}
                      onChange={(e) => setEditPlan({ ...editPlan, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-features">Plan Features / Highlights (1 per line)</Label>
                    <Textarea
                      id="edit-features"
                      rows={4}
                      placeholder={"Up to 100 Residential Units\nGate Pass & Visitor Logs"}
                      value={
                        typeof editPlan.features === 'string' && editPlan.features.startsWith('[')
                          ? (() => { try { return JSON.parse(editPlan.features).join('\n') } catch(e) { return editPlan.features } })()
                          : (editPlan.features || '')
                      }
                      onChange={(e) => setEditPlan({ ...editPlan, features: e.target.value })}
                    />
                    <p className="text-[11px] text-gray-500">Each line will be displayed as a feature bullet point on the public Landing Page.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editPlan.status}
                      onValueChange={(val) => setEditPlan({ ...editPlan, status: val })}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditPlan(null)}>Cancel</Button>
                  <Button onClick={handleUpdatePlan} className="bg-[#1e3a5f] text-white hover:bg-[#2d4a6f]">Save Changes</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Plan</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this plan? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeletePlan}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </RoleGuard>
  )
}
