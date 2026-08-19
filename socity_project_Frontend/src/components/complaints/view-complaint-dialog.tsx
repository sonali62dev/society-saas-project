'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ServiceComplaint } from '@/types/services'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { ComplaintService } from '@/services/complaint.service'
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    User,
    Mail,
    Phone,
    Building2
} from 'lucide-react'

interface ViewComplaintDialogProps {
    complaint: ServiceComplaint | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ViewComplaintDialog({ complaint, open, onOpenChange }: ViewComplaintDialogProps) {
    const queryClient = useQueryClient()
    const [status, setStatus] = useState<string>(complaint?.status || 'open')

    // Update local status when complaint changes
    if (complaint && status !== complaint.status && !open) {
        setStatus(complaint.status)
    }

    const { mutate: updateStatus, isPending } = useMutation({
        mutationFn: async (newStatus: string) => {
            if (!complaint) return
            return ComplaintService.updateStatus(complaint.id, newStatus)
        },
        onSuccess: () => {
            toast.success('Complaint status updated')
            queryClient.invalidateQueries({ queryKey: ['complaints'] })
            queryClient.invalidateQueries({ queryKey: ['complaint-stats'] })
            queryClient.invalidateQueries({ queryKey: ['tickets'] }) // Added based on instruction
            onOpenChange(false)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to update status')
        }
    })

    if (!complaint) return null

    const getStatusColor = (s: string) => {
        const lower = s.toLowerCase()
        switch (lower) {
            case 'open': return 'bg-red-100 text-red-700'
            case 'in_progress': return 'bg-blue-100 text-blue-700'
            case 'resolved': return 'bg-green-100 text-green-700'
            case 'closed': return 'bg-gray-100 text-gray-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getPriorityIcon = (p: string) => {
        if (p === 'urgent' || p === 'high') return <AlertCircle className="h-4 w-4 text-red-500" />
        if (p === 'medium') return <Clock className="h-4 w-4 text-orange-500" />
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl flex items-center gap-2">
                                #{complaint.id} - {complaint.title}
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                Reported on {format(new Date(complaint.createdAt), 'PPpp')}
                            </DialogDescription>
                        </div>
                        <Badge variant="outline" className={getStatusColor(complaint.status)}>
                            {complaint.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Status & Priority Actions */}
                    <div className="bg-slate-50 p-4 rounded-lg border flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500 uppercase">Priority</Label>
                                <div className="flex items-center gap-2 font-medium">
                                    {getPriorityIcon(complaint.priority)}
                                    <span className="capitalize">{complaint.priority}</span>
                                </div>
                            </div>
                            <Separator orientation="vertical" className="h-8" />
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-500 uppercase">Category</Label>
                                <div className="font-medium capitalize">{complaint.serviceName || 'General'}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Label>Update Status:</Label>
                            <Select
                                defaultValue={complaint.status}
                                onValueChange={(val) => updateStatus(val)}
                                disabled={isPending}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">Open</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-900">Description</Label>
                        <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 min-h-[100px] whitespace-pre-wrap border">
                            {complaint.description}
                        </div>
                    </div>

                    {/* Reporter Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-slate-900">Reporter Details</Label>
                            <div className="bg-white border rounded-lg p-3 space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-slate-400" />
                                    <span className="font-medium">{complaint.reportedBy}</span>
                                </div>
                                {complaint.reportedByOriginal && (
                                    <>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Mail className="h-4 w-4 text-slate-400" />
                                            <span>{complaint.reportedByOriginal.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Building2 className="h-4 w-4 text-slate-400" />
                                            <span className="capitalize">{complaint.reportedByOriginal.role}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {complaint.unit && (
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-slate-900">Location</Label>
                                <div className="bg-white border rounded-lg p-3 space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Building2 className="h-4 w-4 text-slate-400" />
                                        <span>Unit: <span className="font-medium">{complaint.unit}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <span className="capitalize border px-2 py-0.5 rounded text-xs">
                                            {complaint.source}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    {complaint.status.toLowerCase() !== 'resolved' && (
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            onClick={() => updateStatus('RESOLVED')}
                            disabled={isPending}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Resolve & Notify Society
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
