'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Building2,
  Dumbbell,
  Car,
  Wifi,
  Camera,
  Zap,
  Droplets,
  TreePine,
  Users,
  Send,
  Image,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FacilityRequestService } from '@/services/facility-request.service'

const facilityCategories = [
  { value: 'new', label: 'New Facility', icon: Plus },
  { value: 'upgrade', label: 'Upgrade Existing', icon: Zap },
  { value: 'maintenance', label: 'Maintenance Request', icon: Building2 },
]

const facilityTypes = [
  { value: 'gym', label: 'Gym Equipment', icon: Dumbbell },
  { value: 'ev_charging', label: 'EV Charging Station', icon: Zap },
  { value: 'library', label: 'Library / Reading Room', icon: FileText },
  { value: 'yoga_room', label: 'Yoga / Meditation Room', icon: Users },
  { value: 'cctv', label: 'CCTV / Security', icon: Camera },
  { value: 'wifi', label: 'WiFi / Internet', icon: Wifi },
  { value: 'parking', label: 'Parking Enhancement', icon: Car },
  { value: 'water', label: 'Water System', icon: Droplets },
  { value: 'garden', label: 'Garden / Landscaping', icon: TreePine },
  { value: 'other', label: 'Other', icon: Lightbulb },
]

// Mock data removed - using API data only

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  under_review: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
}

export default function FacilityRequestsPage() {
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  })

  // Queries
  const { data: apiRequests = [], isLoading } = useQuery({
    queryKey: ['facility-requests', statusFilter],
    queryFn: () => FacilityRequestService.getAll()
  })

  const { data: serverStats } = useQuery({
    queryKey: ['facility-request-stats'],
    queryFn: () => FacilityRequestService.getStats()
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: FacilityRequestService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-requests'] })
      queryClient.invalidateQueries({ queryKey: ['facility-request-stats'] })
      setIsAddDialogOpen(false)
      showNotification('Facility request submitted successfully!')
    }
  })

  const voteMutation = useMutation({
    mutationFn: ({ id, type }: { id: string | number, type: 'UP' | 'DOWN' }) =>
      FacilityRequestService.vote(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-requests'] })
      showNotification('Vote recorded! Thank you for your feedback.')
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, adminNotes }: { id: string | number, status: string, adminNotes?: string }) =>
      FacilityRequestService.updateStatus(id, status, adminNotes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['facility-requests'] })
      queryClient.invalidateQueries({ queryKey: ['facility-request-stats'] })
      setIsViewDialogOpen(false)
      showNotification(`Request updated successfully!`)
    }
  })

  const showNotification = (message: string) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleSubmitRequest = () => {
    createMutation.mutate(formData)
  }

  const handleUpdateStatus = (status: string, adminNotes?: string) => {
    if (selectedRequest) {
      updateStatusMutation.mutate({ id: selectedRequest.id, status, adminNotes })
    }
  }

  const handleVote = (id: string | number, type: 'UP' | 'DOWN') => {
    voteMutation.mutate({ id, type })
  }

  const requests = (Array.isArray(apiRequests) ? apiRequests : apiRequests?.data || []) as any[]

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            {showSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Facility Requests</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {isAdmin ? 'Manage facility requests from residents' : 'Request new facilities or upgrades for the society'}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Submit Facility Request</DialogTitle>
              <DialogDescription>
                Request a new facility or suggest an upgrade for the society
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Request Type *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilityCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <cat.icon className="h-4 w-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Facility Category *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select facility type" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  placeholder="Brief title for your request"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  placeholder="Describe the facility you're requesting and why it would benefit the community..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Nice to have</SelectItem>
                    <SelectItem value="medium">Medium - Important</SelectItem>
                    <SelectItem value="high">High - Urgent need</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button
                className="bg-gradient-to-r from-teal-500 to-cyan-500"
                onClick={handleSubmitRequest}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{serverStats?.total || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500 bg-opacity-10">
                <Lightbulb className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {serverStats?.byStatus?.find((s: any) => s.status === 'pending')?._count || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-500 bg-opacity-10">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {serverStats?.byStatus?.find((s: any) => s.status === 'approved')?._count || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-500 bg-opacity-10">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {serverStats?.byStatus?.find((s: any) => s.status === 'rejected')?._count || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-500 bg-opacity-10">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search requests..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table/Cards */}
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request: any) => {
                const typeInfo = facilityTypes.find(t => t.value === request.category)
                const TypeIcon = typeInfo?.icon || Lightbulb
                return (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <TypeIcon className="h-4 w-4 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{request.title}</p>
                          <p className="text-xs text-gray-500">{typeInfo?.label || request.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-xs">
                            {(request.user?.name || 'U').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{request.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{request.user?.society?.name || 'Resident'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-1 text-green-600 hover:text-green-700"
                          onClick={() => handleVote(request.id, 'UP')}
                          disabled={voteMutation.isPending}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-xs font-medium">{request.upvotes}</span>
                        </button>
                        <button
                          className="flex items-center gap-1 text-red-500 hover:text-red-600"
                          onClick={() => handleVote(request.id, 'DOWN')}
                          disabled={voteMutation.isPending}
                        >
                          <ThumbsDown className="h-4 w-4" />
                          <span className="text-xs font-medium">{request.downvotes}</span>
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[request.priority?.toLowerCase()] || 'bg-gray-100'}>
                        {request.priority || 'Medium'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[request.status?.toLowerCase()] || 'bg-blue-100'}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request)
                          setIsViewDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* View/Manage Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-teal-100 rounded-xl">
                    <Lightbulb className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <DialogTitle>{selectedRequest.title}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      <span>{selectedRequest.id}</span>
                      <span>•</span>
                      <Badge className={statusColors[selectedRequest.status]}>
                        {selectedRequest.status.replace('_', ' ')}
                      </Badge>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Requested By</p>
                    <p className="font-medium">{selectedRequest.user?.name || 'Unknown'} ({selectedRequest.user?.society?.name || 'Resident'})</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date Submitted</p>
                    <p className="font-medium">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Priority</p>
                    <Badge className={priorityColors[selectedRequest.priority?.toLowerCase()] || 'bg-gray-100'}>
                      {selectedRequest.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-500">Community Votes</p>
                    <div className="flex items-center gap-3">
                      <span className="text-green-600 flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" /> {selectedRequest.upvotes}
                      </span>
                      <span className="text-red-500 flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4" /> {selectedRequest.downvotes}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-sm mb-1">Description</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRequest.description}</p>
                </div>

                {selectedRequest.adminNotes && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Admin Notes</p>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      {selectedRequest.adminNotes}
                    </p>
                  </div>
                )}

                {isAdmin && selectedRequest.status === 'pending' && (
                  <div className="space-y-2">
                    <Label>Add Admin Notes</Label>
                    <Textarea placeholder="Add internal notes or decision reasoning..." rows={3} />
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                {!isAdmin && (
                  <div className="flex gap-2 mr-auto">
                    <Button variant="outline" onClick={() => handleVote(selectedRequest.id, 'UP')} className="gap-1">
                      <ThumbsUp className="h-4 w-4" /> Support
                    </Button>
                    <Button variant="outline" onClick={() => handleVote(selectedRequest.id, 'DOWN')} className="gap-1">
                      <ThumbsDown className="h-4 w-4" /> Oppose
                    </Button>
                  </div>
                )}
                {isAdmin && (selectedRequest.status === 'pending' || selectedRequest.status === 'under_review') && (
                  <>
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => handleUpdateStatus('marked as under review')}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Under Review
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleUpdateStatus('rejected')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleUpdateStatus('approved')}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
                <Button variant="ghost" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
