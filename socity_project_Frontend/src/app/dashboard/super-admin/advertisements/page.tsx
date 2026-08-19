'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Layers,
  Link as LinkIcon,
  ToggleLeft,
  ToggleRight,
  Eye,
  Search,
  Users,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdvertisementManagementPage() {
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAd, setEditingAd] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({
    title: '',
    content: '',
    imageUrl: '',
    linkUrl: '',
    type: 'BANNER',
    targetAudience: 'ALL',
    startDate: '',
    endDate: '',
    isActive: true,
    displayOrder: 0
  })

  const { data: ads = [], isLoading } = useQuery<any[]>({
    queryKey: ['advertisements'],
    queryFn: async () => {
      const response = await api.get('/advertisements')
      return response.data
    }
  })

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.post('/advertisements', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] })
      toast.success('Advertisement created successfully')
      setIsDialogOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create advertisement')
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await api.put(`/advertisements/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] })
      toast.success('Advertisement updated successfully')
      setIsDialogOpen(false)
      resetForm()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update advertisement')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/advertisements/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] })
      toast.success('Advertisement deleted successfully')
    }
  })

  const resetForm = () => {
    setEditingAd(null)
    setFormData({
      title: '',
      content: '',
      imageUrl: '',
      linkUrl: '',
      type: 'BANNER',
      targetAudience: 'ALL',
      startDate: '',
      endDate: '',
      isActive: true,
      displayOrder: 0
    })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleEdit = (ad: any) => {
    setEditingAd(ad)
    setFormData({
      ...ad,
      startDate: ad.startDate ? new Date(ad.startDate).toISOString().slice(0, 16) : '',
      endDate: ad.endDate ? new Date(ad.endDate).toISOString().slice(0, 16) : '',
    })
    setPreviewUrl(ad.imageUrl)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!formData.title) {
      toast.error('Title is required')
      return
    }

    const data = new FormData()
    
    // Append form fields with proper type handling
    data.append('title', formData.title)
    data.append('content', formData.content)
    if (formData.linkUrl) data.append('linkUrl', formData.linkUrl)
    data.append('type', formData.type)
    data.append('targetAudience', formData.targetAudience)
    if (formData.startDate) data.append('startDate', formData.startDate)
    if (formData.endDate) data.append('endDate', formData.endDate)
    data.append('isActive', String(formData.isActive))
    data.append('displayOrder', String(formData.displayOrder))

    if (selectedFile) {
      data.append('image', selectedFile)
    } else if (formData.imageUrl && !selectedFile) {
      // Keep existing image URL if no new file is selected
      data.append('imageUrl', formData.imageUrl)
    }
    
    if (editingAd) {
      updateMutation.mutate({ id: editingAd.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const filteredAds = ads.filter(ad => 
    ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ad.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Megaphone className="h-6 w-6 text-purple-600" />
              Global Advertisements
            </h1>
            <p className="text-gray-600">Promote events, services, or updates to all dashboard users</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
            onClick={() => {
              resetForm()
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Advertisement
          </Button>
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search advertisements..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Ad Details</TableHead>
                <TableHead>Targeting</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredAds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    No advertisements found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAds.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell className="max-w-xs">
                      <div className="flex items-center gap-3">
                        {ad.imageUrl ? (
                          <img src={ad.imageUrl} alt="" className="h-10 w-16 object-cover rounded border" />
                        ) : (
                          <div className="h-10 w-16 bg-gray-100 rounded border flex items-center justify-center">
                            <Megaphone className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{ad.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{ad.content}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <Users className="h-3 w-3" />
                        {ad.targetAudience}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{ad.type.toLowerCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-500 flex flex-col gap-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {ad.startDate ? new Date(ad.startDate).toLocaleDateString() : 'Immediate'}
                        </span>
                        {ad.endDate && (
                          <span className="flex items-center gap-1">
                            <Layers className="h-3 w-3" />
                            {new Date(ad.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={ad.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {ad.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(ad)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(ad.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingAd ? 'Edit Advertisement' : 'Create Advertisement'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  placeholder="e.g., Get 50% discount on Early Bird Registration" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea 
                  placeholder="Describe the offer or update here..." 
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Advertisement Image</Label>
                <div className="flex flex-col gap-4">
                  {previewUrl && (
                    <div className="relative w-full h-32 rounded-lg border overflow-hidden bg-gray-50">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                      <button 
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl(null)
                          setFormData({ ...formData, imageUrl: '' })
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 font-semibold">Click to upload image</p>
                        <p className="text-xs text-gray-400">PNG, JPG or WEBP (Max 5MB)</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Action Link (Optional)</Label>
                <Input 
                  placeholder="https://example.com/learn-more" 
                  value={formData.linkUrl || ''}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select 
                    value={formData.targetAudience} 
                    onValueChange={(v) => setFormData({ ...formData, targetAudience: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Users</SelectItem>
                      <SelectItem value="ADMINS">Society Admins</SelectItem>
                      <SelectItem value="RESIDENTS">Residents</SelectItem>
                      <SelectItem value="INDIVIDUALS">Individual Clients</SelectItem>
                      <SelectItem value="VENDORS">Vendors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BANNER">Hero Banner</SelectItem>
                      <SelectItem value="CARD">Sidebar Card</SelectItem>
                      <SelectItem value="POPUP">Dashboard Popup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input 
                    type="datetime-local" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date (Optional)</Label>
                  <Input 
                    type="datetime-local" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="ad-active-checkbox" 
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="ad-active-checkbox">Is Active?</Label>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Label className="whitespace-nowrap">Display Order:</Label>
                  <Input 
                    type="number" 
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Saving...
                  </div>
                ) : (editingAd ? 'Save Changes' : 'Create Advertisement')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </RoleGuard>
  )
}
