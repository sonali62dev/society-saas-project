'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, Send, Loader2, UserX } from 'lucide-react'
import { ComplaintService } from '@/services/complaint.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const categoryOptions = [
  { value: 'security', label: 'Security Services' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'pest', label: 'Pest Control' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electric', label: 'Electrical' },
  { value: 'other', label: 'Other' },
]

/** Maps vendor serviceType to complaint category value */
function serviceTypeToCategory(serviceType: string): string {
  const s = (serviceType || '').toLowerCase()
  if (s.includes('security') || s.includes('guard')) return 'security'
  if (s.includes('clean') || s.includes('housekeep') || s.includes('maid')) return 'cleaning'
  if (s.includes('pest')) return 'pest'
  if (s.includes('plumb')) return 'plumbing'
  if (s.includes('electric') || s.includes('electrical')) return 'electric'
  return 'other'
}

export interface VendorForComplaint {
  id: number | string
  name: string
  serviceType?: string
  type?: string
}

interface RaiseComplaintAgainstVendorDialogProps {
  vendor: VendorForComplaint | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RaiseComplaintAgainstVendorDialog({
  vendor,
  open,
  onOpenChange,
}: RaiseComplaintAgainstVendorDialogProps) {
  const queryClient = useQueryClient()
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('other')
  const [priority, setPriority] = useState('MEDIUM')

  useEffect(() => {
    if (vendor && open) {
      setCategory(serviceTypeToCategory(vendor.serviceType || vendor.type || ''))
      setSubject('')
      setDescription('')
      setPriority('MEDIUM')
    }
  }, [vendor, open])

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof ComplaintService.createAgainstVendor>[0]) =>
      ComplaintService.createAgainstVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] })
      queryClient.invalidateQueries({ queryKey: ['complaint-stats'] })
      toast.success('Complaint against vendor submitted. Vendor will be notified.')
      onOpenChange(false)
    },
    onError: (error: any) => {
      toast.error('Failed to submit complaint: ' + (error?.message || 'Unknown error'))
    },
  })

  const handleSubmit = () => {
    if (!vendor) return
    if (!subject?.trim() || !description?.trim() || !category) {
      toast.error('Please fill subject, description and category')
      return
    }
    mutation.mutate({
      vendorId: vendor.id,
      title: subject.trim(),
      description: description.trim(),
      category,
      priority,
    })
  }

  if (!vendor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserX className="h-5 w-5 text-amber-600" />
            Raise Complaint Against Vendor
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="text-sm font-medium text-muted-foreground">Vendor</p>
            <p className="font-semibold">{vendor.name}</p>
            <p className="text-xs text-muted-foreground">{vendor.serviceType || vendor.type || '—'}</p>
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subject *</Label>
            <Input
              placeholder="Brief title of the issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              placeholder="Describe the issue with this vendor in detail..."
              className="min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
              onClick={handleSubmit}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {mutation.isPending ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
