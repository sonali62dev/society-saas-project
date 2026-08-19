'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Users,
  Home,
  Mail,
  Phone,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RoleGuard } from '@/components/auth/role-guard'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function PendingApprovalsPage() {
  const queryClient = useQueryClient()
  const [selectedSociety, setSelectedSociety] = useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: societies = [], isLoading } = useQuery<any[]>({
    queryKey: ['societies'],
    queryFn: async () => {
      const response = await api.get('/society/all')
      return response.data
    }
  })

  const { data: stats } = useQuery({
    queryKey: ['societies-stats'],
    queryFn: async () => {
      const response = await api.get('/society/stats')
      return response.data
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const response = await api.patch(`/society/${id}/status`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['societies'] })
      queryClient.invalidateQueries({ queryKey: ['societies-stats'] })
      toast.success('Society status updated successfully')
      setDialogOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update status')
    }
  })

  const pendingSocieties = societies.filter(s => s.status === 'pending')

  const handleViewDetails = (society: any) => {
    setSelectedSociety(society)
    setDialogOpen(true)
  }

  const handleApprove = (id: number) => {
    updateStatusMutation.mutate({ id, status: 'ACTIVE' })
  }

  const handleReject = (id: number) => {
    if (confirm('Are you sure you want to reject this society?')) {
      updateStatusMutation.mutate({ id, status: 'INACTIVE' })
    }
  }

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="text-gray-600">Review and approve new society registrations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.PENDING ?? pendingSocieties.length}</p>
                  <p className="text-sm text-gray-500">Pending</p>
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
                  <p className="text-2xl font-bold">{stats?.ACTIVE ?? 0}</p>
                  <p className="text-sm text-gray-500">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.INACTIVE ?? 0}</p>
                  <p className="text-sm text-gray-500">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending List */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Awaiting Approval</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
              </div>
            ) : pendingSocieties.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No pending registrations found.
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSocieties.map((society: any) => (
                  <div
                    key={society.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-gray-50 rounded-xl gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 rounded-xl">
                        <Building2 className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{society.name}</h3>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {society.subscriptionPlan}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3" />
                          {society.city || 'N/A'}, {society.state || 'N/A'}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            {society.expectedUnits} units (req.)
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Requested: {new Date(society.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(society)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleReject(society.id)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(society.id)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Society Details</DialogTitle>
              <DialogDescription>Review the registration details</DialogDescription>
            </DialogHeader>
            {selectedSociety && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-lg">{selectedSociety.name}</h4>
                  <p className="text-sm text-gray-500">
                    {selectedSociety.city}, {selectedSociety.state}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Units Requested</p>
                    <p className="font-medium">{selectedSociety.expectedUnits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Plan</p>
                    <p className="font-medium">{selectedSociety.subscriptionPlan}</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Admin Contact</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      {selectedSociety.admin.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {selectedSociety.admin.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {selectedSociety.admin.phone}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </RoleGuard>
  )
}
