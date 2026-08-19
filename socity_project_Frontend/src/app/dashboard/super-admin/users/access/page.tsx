'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Key,
  Users,
  Lock,
  Unlock,
  Settings,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RoleGuard } from '@/components/auth/role-guard'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function AccessControlPage() {
  const queryClient = useQueryClient()
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState({ name: '', description: '' })

  // Fetch Roles
  const { data: roles = [], isLoading: isLoadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      try {
        const response = await api.get('/roles')
        return response.data ?? []
      } catch (err: any) {
        toast.error('Failed to fetch roles: ' + (err.response?.data?.error || err.message))
        return []
      }
    }
  })

  // Fetch Permissions
  const { data: permissions = [] } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      try {
        const response = await api.get('/roles/permissions')
        return response.data ?? []
      } catch (err: any) {
        toast.error('Failed to fetch permissions: ' + (err.response?.data?.error || err.message))
        return []
      }
    }
  })

  // Fetch Sessions
  const { data: activeSessions = [], isLoading: isLoadingSessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      try {
        const response = await api.get('/sessions')
        return response.data ?? []
      } catch (err: any) {
        toast.error('Failed to fetch sessions: ' + (err.response?.data?.error || err.message))
        return []
      }
    }
  })

  // Create Role Mutation
  const createRoleMutation = useMutation({
    mutationFn: async (data: { name: string, description: string }) => {
      const response = await api.post('/roles', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Role created successfully')
      setIsCreateDialogOpen(false)
      setNewRole({ name: '', description: '' })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create role')
    }
  })

  // Toggle Permission Mutation
  const togglePermissionMutation = useMutation({
    mutationFn: async ({ roleId, permissionId, enabled }: { roleId: number, permissionId: string, enabled: boolean }) => {
      const response = await api.patch(`/roles/${roleId}/permissions`, { permissionId, enabled })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      toast.success('Permission updated')
    },
    onError: () => {
      toast.error('Failed to update permission')
    }
  })

  // Terminate Session Mutation
  const terminateSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      const response = await api.delete(`/sessions/${sessionId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('Session terminated')
    }
  })

  // Terminate All Sessions Mutation
  const terminateAllMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete('/sessions')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
      toast.success('All sessions terminated')
    }
  })

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRole.name) return toast.error('Role name is required')
    createRoleMutation.mutate(newRole)
  }

  const handleTogglePermission = (permissionId: string, enabled: boolean) => {
    console.log('Toggling permission:', permissionId, 'to', enabled, 'for role:', selectedRole?.id)
    if (!selectedRole) {
      toast.error('Please select a role first')
      return
    }
    togglePermissionMutation.mutate({
      roleId: selectedRole.id,
      permissionId,
      enabled
    })
  }

  // Update selected role when roles data changes
  const currentRole = roles.find((r: any) => r.id === selectedRole?.id) || selectedRole

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
            <p className="text-gray-600">Manage roles, permissions, and active sessions</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20">
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[32px] border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Create New Role</DialogTitle>
                <DialogDescription className="font-medium text-gray-500">
                  Add a new access level role to the platform.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRole} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-gray-700">Role Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Society Manager"
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-bold text-gray-700">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Briefly describe what this role can do..."
                    className="min-h-[100px] rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all font-medium resize-none p-4"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  />
                </div>
                <DialogFooter className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/20"
                    disabled={createRoleMutation.isPending}
                  >
                    {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{roles.length}</p>
                  <p className="text-sm text-gray-500">Roles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Key className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{permissions.length}</p>
                  <p className="text-sm text-gray-500">Permissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeSessions.length}</p>
                  <p className="text-sm text-gray-500">Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Lock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">2FA</p>
                  <p className="text-sm text-gray-500">Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Roles */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>Define access levels for different user types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoadingRoles ? (
                  <div className="flex justify-center p-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                  </div>
                ) : (
                  roles.map((role: any) => (
                    <div
                      key={role.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        currentRole?.id === role.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{role.name}</h4>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                        <Badge variant="secondary">{role.users} users</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {role.permissions?.map((perm: string) => (
                          <Badge key={perm} variant="outline" className="text-[10px] uppercase font-bold tracking-tight">
                            {perm.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                {currentRole?.id ? `Configure permissions for ${currentRole.name}` : 'Select a role to configure'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((permission: any) => {
                  const isEnabled = currentRole?.permissions?.includes(permission.id)
                  return (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {isEnabled ? (
                            <Unlock className="h-4 w-4 text-green-600" />
                          ) : (
                            <Lock className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{permission.label}</p>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={isEnabled || false}
                        disabled={!currentRole?.id || togglePermissionMutation.isPending}
                        onCheckedChange={(checked) => handleTogglePermission(permission.id, checked)}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Sessions */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Currently logged in users across all societies</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200"
                onClick={() => terminateAllMutation.mutate()}
                disabled={terminateAllMutation.isPending}
              >
                Terminate All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingSessions ? (
               <div className="flex justify-center p-8">
               <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
             </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Society</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSessions.map((session: any) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.user}</TableCell>
                      <TableCell>{session.society}</TableCell>
                      <TableCell className="text-xs text-gray-500 max-w-[200px] truncate">{session.device}</TableCell>
                      <TableCell className="text-sm text-gray-500 font-mono">{session.ip}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(session.lastActive).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => terminateSessionMutation.mutate(session.id)}
                          disabled={terminateSessionMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {activeSessions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No active sessions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </RoleGuard>
  )
}
