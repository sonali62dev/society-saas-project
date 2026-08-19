'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Lock, Eye } from 'lucide-react'
import { TicketCategory, TicketPriority } from '@/types/tickets'

interface CreateTicketDialogProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
}

export function CreateTicketDialog({ isOpen, onClose, onSubmit }: CreateTicketDialogProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General' as TicketCategory,
        priority: 'medium' as TicketPriority,
        isPrivate: false,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Connect with real API later
        onSubmit(formData)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 border-0 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Create New Ticket</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-bold text-gray-500 uppercase">Issue Title</Label>
                        <Input
                            id="title"
                            placeholder="Briefly describe the issue"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="h-12 rounded-xl bg-gray-50 border-gray-100 focus:bg-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-500 uppercase">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val: TicketCategory) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-100">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="Technical">Technical Issue</SelectItem>
                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-500 uppercase">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(val: TicketPriority) => setFormData({ ...formData, priority: val })}
                            >
                                <SelectTrigger className="h-12 rounded-xl bg-gray-50 border-gray-100">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-bold text-gray-500 uppercase">Detailed Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Provide more details about the issue..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="min-h-[120px] rounded-xl bg-gray-50 border-gray-100 focus:bg-white resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className={formData.isPrivate ? "p-2 bg-purple-100 rounded-lg" : "p-2 bg-emerald-100 rounded-lg"}>
                                {formData.isPrivate ? <Lock className="h-4 w-4 text-purple-600" /> : <Eye className="h-4 w-4 text-emerald-600" />}
                            </div>
                            <div>
                                <Label className="text-sm font-bold text-gray-900">Private Issue</Label>
                                <p className="text-[10px] text-gray-500 font-medium leading-tight">
                                    {formData.isPrivate
                                        ? "Visible ONLY to you and the Main Society Admins."
                                        : "Visible to all Society Admins and Committee members."}
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={formData.isPrivate}
                            onCheckedChange={(val) => setFormData({ ...formData, isPrivate: val })}
                        />
                    </div>

                    <DialogFooter className="pt-4 border-t border-gray-50">
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold h-12">Cancel</Button>
                        <Button type="submit" className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-blue-100">
                            Submit Ticket
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
