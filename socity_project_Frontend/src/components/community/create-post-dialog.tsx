import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, MessageSquare, Image as ImageIcon, Loader2, X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { toast } from 'sonner'

export function CreatePostDialog() {
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState('general')
    const [message, setMessage] = useState('')
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient()

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB')
                return
            }
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setSelectedImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const createPostMutation = useMutation({
        mutationFn: residentService.createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community-feed'] })
            toast.success('Post shared successfully!')
            setOpen(false)
            setCategory('general')
            setMessage('')
            removeImage()
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to share post')
        }
    })

    const handlePost = () => {
        if (!message.trim()) {
            toast.error('Please enter a message')
            return
        }
        createPostMutation.mutate({
            type: category,
            content: message,
            title: '',
            image: selectedImage
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-pink-600 hover:bg-pink-700 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Create Post
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <MessageSquare className="h-5 w-5 text-pink-600" />
                        New Post
                    </DialogTitle>
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

                    <div className="space-y-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageSelect}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-2 text-gray-600"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImageIcon className="h-4 w-4" />
                            Add Photo
                        </Button>
                        {imagePreview && (
                            <div className="relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-32 w-32 object-cover rounded-lg border"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                    onClick={removeImage}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            className="bg-pink-600 hover:bg-pink-700 text-white min-w-[80px]"
                            onClick={handlePost}
                            disabled={createPostMutation.isPending}
                        >
                            {createPostMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Post'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
