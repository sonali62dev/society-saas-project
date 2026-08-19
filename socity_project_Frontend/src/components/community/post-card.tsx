'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Edit } from 'lucide-react'
import { Post } from '@/types/community'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { toast } from 'sonner'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { EditPostDialog } from './edit-post-dialog'

interface PostCardProps {
    post: any // Using any to match backend response structure
}

export function PostCard({ post }: PostCardProps) {
    const [liked, setLiked] = useState(post.isLiked || false)
    const [likesCount, setLikesCount] = useState(post.likes || 0)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const queryClient = useQueryClient()

    const likeMutation = useMutation({
        mutationFn: () => residentService.toggleLike(post.id),
        onSuccess: (data) => {
            setLiked(data.liked)
            setLikesCount((prev: number) => data.liked ? prev + 1 : prev - 1)
            queryClient.invalidateQueries({ queryKey: ['community-feed'] })
        },
        onError: () => {
            toast.error('Failed to update like')
        }
    })

    const updateMutation = useMutation({
        mutationFn: (data: { content: string; type: string }) => 
            residentService.updatePost(post.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community-feed'] })
            toast.success('Post updated successfully')
            setEditOpen(false)
        },
        onError: () => {
            toast.error('Failed to update post')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: () => residentService.deletePost(post.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community-feed'] })
            toast.success('Post deleted successfully')
            setDeleteOpen(false)
        },
        onError: () => {
            toast.error('Failed to delete post')
        }
    })

    const handleLike = () => {
        likeMutation.mutate()
    }

    const categoryColors: Record<string, string> = {
        general: 'bg-gray-100 text-gray-700',
        announcement: 'bg-blue-100 text-blue-700',
        lost_found: 'bg-orange-100 text-orange-700',
        service: 'bg-purple-100 text-purple-700',
    }

    const unit = post.author?.ownedUnits?.[0]
        ? `${post.author.ownedUnits[0].block}-${post.author.ownedUnits[0].number}`
        : 'Resident'

    return (
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
                <Avatar>
                    <AvatarImage src={post.author?.profileImg} />
                    <AvatarFallback>{(post.author?.name || 'U')[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">{post.author?.name || 'Unknown'}</h4>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Post
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={() => setDeleteOpen(true)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Post
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <EditPostDialog
                            open={editOpen}
                            onOpenChange={setEditOpen}
                            post={post}
                            onSave={(data) => updateMutation.mutate(data)}
                            isLoading={updateMutation.isPending}
                        />

                        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Post?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your post.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => deleteMutation.mutate()}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                        {unit} • {new Date(post.createdAt).toLocaleDateString()}
                        {post.author?.role && post.author.role !== 'resident' && (
                            <Badge variant="secondary" className="h-5 text-[10px] bg-blue-50 text-blue-600 capitalize">
                                {post.author.role.replace('_', ' ')}
                            </Badge>
                        )}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
                {post.title && <h3 className="font-bold mb-2">{post.title}</h3>}
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{post.content}</p>
                
                {post.imageUrls && post.imageUrls.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {post.imageUrls.slice(0, 4).map((url: string, idx: number) => (
                            <img
                                key={idx}
                                src={url}
                                alt={`Post image ${idx + 1}`}
                                className="rounded-lg object-cover w-full h-48"
                            />
                        ))}
                    </div>
                )}
                
                {post.type && (
                    <Badge variant="secondary" className={`mt-3 text-[10px] font-medium ${categoryColors[post.type] || categoryColors.general}`}>
                        {post.type.replace('_', ' ')}
                    </Badge>
                )}
            </CardContent>

            <CardFooter className="p-2 pt-0 flex items-center justify-between border-t mt-2">
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-2 h-9 ${liked ? 'text-red-500' : 'text-gray-500'}`}
                        onClick={handleLike}
                    >
                        <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                        <span className="text-xs font-medium">{likesCount}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 h-9 text-gray-500">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">{post.comments?.length || 0}</span>
                    </Button>
                </div>
                <Button variant="ghost" size="sm" className="h-9 text-gray-500">
                    <Share2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
