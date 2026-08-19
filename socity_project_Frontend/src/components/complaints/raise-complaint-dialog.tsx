'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, Plus, Send } from 'lucide-react'

export function RaiseComplaintDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white gap-2 shadow-lg shadow-red-500/25">
                    <Plus className="h-4 w-4" />
                    <span>Raise Complaint</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        Raise New Complaint
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Source Type</Label>
                            <Select defaultValue="society">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="society">Society</SelectItem>
                                    <SelectItem value="resident">Resident</SelectItem>
                                    <SelectItem value="individual">Individual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Select Entity</Label>
                            <Input placeholder="Search name/ID..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Service Category</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="security">Security Services</SelectItem>
                                <SelectItem value="cleaning">Cleaning</SelectItem>
                                <SelectItem value="pest">Pest Control</SelectItem>
                                <SelectItem value="plumbing">Plumbing</SelectItem>
                                <SelectItem value="electric">Electrical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input placeholder="Brief title of the complaint" />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Detailed description of the issue..." className="min-h-[100px]" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select defaultValue="medium">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Contact Number</Label>
                            <Input placeholder="+91..." />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2" onClick={() => setOpen(false)}>
                            <Send className="h-4 w-4" />
                            Submit Complaint
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
