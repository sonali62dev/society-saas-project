'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NoticeService } from '@/services/notice.service'
import { toast } from 'sonner'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Bell,
  Calendar,
  AlertTriangle,
  Info,
  Megaphone,
  Pin,
  Eye,
  Plus,
  Send,
  Loader2,
  Pencil,
  Trash2
} from 'lucide-react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDistanceToNow } from 'date-fns'

const getNoticeIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'announcement':
      return Megaphone
    case 'emergency':
      return AlertTriangle
    case 'event':
      return Calendar
    case 'maintenance':
      return Info
    default:
      return Bell
  }
}

const getNoticeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'announcement':
      return 'blue'
    case 'emergency':
      return 'red'
    case 'event':
      return 'purple'
    case 'maintenance':
      return 'orange'
    default:
      return 'gray'
  }
}

export default function NoticesPage() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteNoticeId, setDeleteNoticeId] = useState<number | null>(null)
  const [editingNotice, setEditingNotice] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audience: 'ALL',
    type: 'announcement',
    priority: 'medium',
    status: 'PUBLISHED',
    isPinned: false,
    startDate: '',
    expiresAt: ''
  })

  const [viewersNoticeId, setViewersNoticeId] = useState<number | null>(null)
  const { data: viewers = [], isLoading: isLoadingViewers } = useQuery({
    queryKey: ['notice-viewers', viewersNoticeId],
    queryFn: () => NoticeService.getViewers(viewersNoticeId!),
    enabled: !!viewersNoticeId
  })

  const trackViewMutation = useMutation({
    mutationFn: (id: number) => NoticeService.trackView(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] })
    }
  })

  // Fetch Notices
  const { data: notices = [], isLoading } = useQuery({
    queryKey: ['notices', user?.role],
    queryFn: NoticeService.getAll
  })

  // Create/Update Notice Mutation
  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingNotice) {
        return NoticeService.update(editingNotice.id, data)
      }
      return NoticeService.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] })
      queryClient.invalidateQueries({ queryKey: ['residentDashboard'] })
      toast.success(editingNotice ? 'Notice updated successfully' : 'Notice published successfully')
      handleCloseModal()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to save notice')
    }
  })

  // Delete Notice Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => NoticeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] })
      queryClient.invalidateQueries({ queryKey: ['residentDashboard'] })
      toast.success('Notice deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete notice')
    }
  })

  const handleEdit = (notice: any) => {
    setEditingNotice(notice)
    setFormData({
      title: notice.title,
      content: notice.content,
      audience: notice.audience,
      type: notice.type,
      priority: notice.priority,
      status: notice.status,
      isPinned: notice.isPinned,
      startDate: notice.startDate ? new Date(notice.startDate).toISOString().split('T')[0] : '',
      expiresAt: notice.expiresAt ? new Date(notice.expiresAt).toISOString().split('T')[0] : ''
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeleteNoticeId(id)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingNotice(null)
    setFormData({
      title: '',
      content: '',
      audience: 'ALL',
      type: 'announcement',
      priority: 'medium',
      status: 'PUBLISHED',
      isPinned: false,
      startDate: '',
      expiresAt: ''
    })
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all required fields')
      return
    }

    // Format dates for backend to avoid Prisma validation errors
    const submissionData = {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
    }

    saveMutation.mutate(submissionData)
  }

  const pinnedNotices = (notices || []).filter((notice: any) => notice.isPinned)
  const regularNotices = (notices || []).filter((notice: any) => !notice.isPinned)

  // Track views for non-admin users (automatically)
  useEffect(() => {
    if (!isAdmin && notices && notices.length > 0) {
      (notices || []).forEach((notice: any) => {
        // Track each notice as viewed (simplified for now)
        trackViewMutation.mutate(notice.id)
      })
    }
  }, [notices.length, isAdmin])

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={['admin', 'resident', 'guard']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notice Board</h1>
            <p className="text-gray-600 mt-1">
              Stay updated with society announcements and events
            </p>
          </div>
          <RoleGuard allowedRoles={['admin']}>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white gap-2 shadow-lg"
            >
              <Plus className="h-4 w-4" />
              Create Notice
            </Button>
          </RoleGuard>
        </div>

        {/* Create/Edit Notice Modal */}
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingNotice ? 'Edit Society Notice' : 'Create Society Notice'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label>Notice Title</Label>
                <Input
                  placeholder="Enter title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Audience</Label>
                  <Select
                    value={formData.audience}
                    onValueChange={(val) => setFormData({ ...formData, audience: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Members</SelectItem>
                      <SelectItem value="RESIDENTS">Residents Only</SelectItem>
                      <SelectItem value="OWNERS">Owners Only</SelectItem>
                      <SelectItem value="GUARD">Guards Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="announcement">Announcement</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(val) => setFormData({ ...formData, priority: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val: any) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  placeholder="Enter notice content..."
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date (Optional)</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="h-4 w-4 text-teal-600 rounded border-gray-300"
                />
                <Label htmlFor="isPinned" className="cursor-pointer">Pin to Top</Label>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saveMutation.isPending}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {saveMutation.isPending ? 'Saving...' : (editingNotice ? 'Update Notice' : 'Publish Notice')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Pinned Notices */}
        {pinnedNotices.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Pin className="h-5 w-5 text-red-500 rotate-45" />
              Pinned Notices
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pinnedNotices.map((notice: any) => {
                const Icon = getNoticeIcon(notice.type)
                const color = getNoticeColor(notice.type)

                return (
                  <Card key={notice.id} className="p-6 border-2 border-red-200 bg-red-50/50 hover:shadow-lg transition-shadow relative">

                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl flex-shrink-0 bg-${color}-100`}>
                        <Icon className={`h-6 w-6 text-${color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Pin className="h-4 w-4 text-red-600" />
                            <Badge variant="secondary" className="bg-red-100 text-red-700 uppercase">
                              {notice.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {notice.type}
                            </Badge>
                            <RoleGuard allowedRoles={['admin']}>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(notice)}
                                  className="h-8 w-8 text-blue-600 hover:bg-blue-100"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(notice.id)}
                                  className="h-8 w-8 text-red-600 hover:bg-red-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </RoleGuard>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {notice.title}
                        </h3>
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {notice.content}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span>Admin Team</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(notice.createdAt || new Date()))} ago</span>
                          </div>
                          <div 
                            className={`flex items-center space-x-1 ${isAdmin ? 'cursor-pointer hover:text-teal-600 transition-colors bg-teal-50 px-2 py-1 rounded-full' : ''}`}
                            onClick={() => isAdmin && setViewersNoticeId(notice.id)}
                          >
                            <Eye className="h-4 w-4" />
                            <span>{notice.viewsCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Regular Notices */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">All Notices</h2>
          {regularNotices.length === 0 ? (
            <Card className="p-12 text-center text-gray-500 border-dashed">
              No notices published yet.
            </Card>
          ) : (
            <div className="space-y-4">
              {regularNotices.map((notice: any) => {
                const Icon = getNoticeIcon(notice.type)
                const color = getNoticeColor(notice.type)

                return (
                  <Card key={notice.id} className="p-6 hover:shadow-lg transition-shadow relative">

                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl flex-shrink-0 bg-${color}-100`}>
                        <Icon className={`h-6 w-6 text-${color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="capitalize">
                              {notice.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {notice.type}
                            </Badge>
                            <RoleGuard allowedRoles={['admin']}>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(notice)}
                                  className="h-8 w-8 text-blue-600 hover:bg-blue-100"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(notice.id)}
                                  className="h-8 w-8 text-red-600 hover:bg-red-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </RoleGuard>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {notice.title}
                        </h3>
                        <p className="text-gray-700 mb-4">{notice.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">A</AvatarFallback>
                              </Avatar>
                              <span>Admin Team</span>
                            </div>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(notice.createdAt || new Date()))} ago</span>
                            {notice.expiresAt && (
                              <>
                                <span>•</span>
                                <span className="text-red-500">Expires: {new Date(notice.expiresAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                          <div 
                            className={`flex items-center space-x-1 ${isAdmin ? 'cursor-pointer hover:text-teal-600 transition-colors bg-teal-50 px-2 py-1 rounded-full' : ''}`}
                            onClick={() => isAdmin && setViewersNoticeId(notice.id)}
                          >
                            <Eye className="h-4 w-4" />
                            <span>{notice.viewsCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={deleteNoticeId !== null} onOpenChange={(open) => !open && setDeleteNoticeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the notice
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteNoticeId) {
                  deleteMutation.mutate(deleteNoticeId)
                  setDeleteNoticeId(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Notice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={viewersNoticeId !== null} onOpenChange={(open) => !open && setViewersNoticeId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-teal-600" />
              Notice Read Receipts
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h4 className="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-wider">
              Viewed by {(viewers || []).length} people
            </h4>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {isLoadingViewers ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-teal-500" /></div>
              ) : viewers.length === 0 ? (
                <p className="text-center py-6 text-gray-500 italic">No views tracked yet.</p>
              ) : (
                viewers.map((viewer: any) => (
                  <div key={viewer.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-gray-100 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white font-bold">
                          {viewer.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors uppercase text-sm">{viewer.name}</p>
                        <p className="text-xs text-gray-500 font-medium tracking-tight mt-0.5">{viewer.role} • Unit: {viewer.unit || 'Society Staff'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Viewed At</p>
                      <p className="text-[11px] font-semibold text-gray-600">
                        {new Date(viewer.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <span className="mx-1 text-gray-300">|</span>
                        {new Date(viewer.viewedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={() => setViewersNoticeId(null)}>
              Close List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RoleGuard>
  )
}
