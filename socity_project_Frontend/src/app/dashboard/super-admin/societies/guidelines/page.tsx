'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { SocietyService } from '@/services/society.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function GuidelinesManagementPage() {
  const queryClient = useQueryClient()
  const [selectedSociety, setSelectedSociety] = useState<number | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingGuideline, setEditingGuideline] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'SOCIETY',
    targetAudience: 'ALL'
  })

  // Fetch societies
  const { data: societies = [] } = useQuery({
    queryKey: ['societies'],
    queryFn: SocietyService.getAllList
  })

  // Fetch guidelines
  const { data: guidelines = [], isLoading } = useQuery({
    queryKey: ['super-admin-guidelines', selectedSociety],
    queryFn: () => SocietyService.getGuidelines(selectedSociety || undefined),
    enabled: true
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: SocietyService.createGuideline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-guidelines'] })
      setIsCreateOpen(false)
      setFormData({ title: '', content: '', category: 'SOCIETY', targetAudience: 'ALL' })
      toast.success('Guideline created successfully')
    },
    onError: () => toast.error('Failed to create guideline')
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => SocietyService.updateGuideline(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-guidelines'] })
      setIsEditOpen(false)
      setEditingGuideline(null)
      toast.success('Guideline updated successfully')
    },
    onError: () => toast.error('Failed to update guideline')
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: SocietyService.deleteGuideline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-guidelines'] })
      toast.success('Guideline deleted successfully')
    },
    onError: () => toast.error('Failed to delete guideline')
  })

  const handleCreate = () => {
    // Determine target society: explicit selection or null for "All" (if user intends global)
    // Current UI forces selection. We need to allow "All".
    // If selectedSociety is null, we treat it as Global.
    
    createMutation.mutate({
      societyId: selectedSociety ?? undefined,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      targetAudience: formData.targetAudience || 'ALL'
    })
  }

  const handleEdit = (guideline: any) => {
    setEditingGuideline(guideline)
    setFormData({
      title: guideline.title,
      content: guideline.content,
      category: guideline.category,
      targetAudience: guideline.targetAudience || 'ALL'
    })
    setIsEditOpen(true)
  }

  const handleUpdate = () => {
    if (!editingGuideline) return
    updateMutation.mutate({
      id: editingGuideline.id,
      data: {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        targetAudience: formData.targetAudience || 'ALL'
      }
    })
  }

  const filteredGuidelines = selectedSociety
    ? guidelines.filter((g: any) => g.societyId === selectedSociety)
    : guidelines

  return (
    <div className="space-y-6 container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Guidelines Management
          </h1>
          <p className="text-gray-500 mt-1">
            Create and manage community guidelines for all societies
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Guideline
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Guideline</DialogTitle>
              <DialogDescription>
                Add a new community guideline
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Society *</Label>
                <Select
                  value={selectedSociety === null ? 'null' : selectedSociety?.toString()}
                  onValueChange={(v) => setSelectedSociety(v === 'null' ? null : parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select society" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">All Societies (Global)</SelectItem>
                    {societies.map((s: any) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Target Audience *</Label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(v) => setFormData({ ...formData, targetAudience: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Who should see this" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All (Residents, Admins, Individuals, Vendors)</SelectItem>
                    <SelectItem value="RESIDENTS">Residents only</SelectItem>
                    <SelectItem value="ADMINS">Society Admins only</SelectItem>
                    <SelectItem value="INDIVIDUALS">Individual clients only</SelectItem>
                    <SelectItem value="VENDORS">Vendors only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Noise Control Policy"
                />
              </div>
              <div>
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOCIETY">Society</SelectItem>
                    <SelectItem value="SECURITY">Security</SelectItem>
                    <SelectItem value="AMENITIES">Amenities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={5}
                  placeholder="Guideline details..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label className="w-32">Filter by Society:</Label>
            <Select
              value={selectedSociety?.toString() || 'all'}
              onValueChange={(v) => setSelectedSociety(v === 'all' ? null : parseInt(v))}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="All Societies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Societies</SelectItem>
                {societies.map((s: any) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-500">
              {filteredGuidelines.length} guidelines found
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Guidelines List */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : filteredGuidelines.length > 0 ? (
          filteredGuidelines.map((guideline: any) => (
            <Card key={guideline.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <CardTitle className="text-lg">{guideline.title}</CardTitle>
                      <Badge variant="outline">{guideline.category}</Badge>
                      {guideline.targetAudience && (
                        <Badge variant="secondary" className="text-xs">
                          For: {guideline.targetAudience === 'ALL' ? 'All' : guideline.targetAudience}
                        </Badge>
                      )}
                    </div>
                    {guideline.society && (
                      <p className="text-sm text-gray-500">
                        Society: {guideline.society.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(guideline)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Guideline?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the guideline.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(guideline.id)}
                            className="bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{guideline.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No guidelines found</p>
              <p className="text-sm text-gray-400 mt-1">
                {selectedSociety
                  ? 'Create your first guideline for this society'
                  : 'Select a society or create a new guideline'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Guideline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Target Audience *</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(v) => setFormData({ ...formData, targetAudience: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="RESIDENTS">Residents only</SelectItem>
                  <SelectItem value="ADMINS">Society Admins only</SelectItem>
                  <SelectItem value="INDIVIDUALS">Individual clients only</SelectItem>
                  <SelectItem value="VENDORS">Vendors only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOCIETY">Society</SelectItem>
                  <SelectItem value="SECURITY">Security</SelectItem>
                  <SelectItem value="AMENITIES">Amenities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
