'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface EditPostDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    post: any
    onSave: (data: { content: string; type: string }) => void
    isLoading?: boolean
}

export function EditPostDialog({ open, onOpenChange, post, onSave, isLoading }: EditPostDialogProps) {
    const [category, setCategory] = useState(post?.type || 'general')
    const [message, setMessage] = useState(post?.content || '')

    const handleSave = () => {
        onSave({
            content: message,
            type: category
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">General Discussion</SelectItem>
                                <SelectItem value="announcement">Announcement</SelectItem>
                                <SelectItem value="lost_found">Lost & Found</SelectItem>
                                <SelectItem value="service">Service Recommendation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                            placeholder="What's on your mind?"
                            rows={5}
                            className="resize-none"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button
                            className="bg-pink-600 hover:bg-pink-700 text-white min-w-[80px]"
                            onClick={handleSave}
                            disabled={isLoading || !message.trim()}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
