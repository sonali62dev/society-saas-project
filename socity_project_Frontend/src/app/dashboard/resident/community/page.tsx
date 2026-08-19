'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, MessageSquare, Send, Users, Calendar, Phone, Plus, Trash2, X, Shield, Globe } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { Skeleton } from '@/components/ui/skeleton'
import { RoleGuard } from '@/components/auth/role-guard'
import { PostCard } from '@/components/community/post-card'
import { CreatePostDialog } from '@/components/community/create-post-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import api from '@/lib/api'
import toast from 'react-hot-toast'

type ChatType = 'society' | 'group'

interface SelectedChat {
    type: ChatType
    id?: number
    name: string
    memberCount?: number
    members?: any[]
    createdBy?: any
}

export default function CommunityPage() {
    const { user } = useAuthStore()
    const queryClient = useQueryClient()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    
    // State management
    const [message, setMessage] = useState('')
    const [selectedChat, setSelectedChat] = useState<SelectedChat>({ type: 'society', name: 'Society Chat' })
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
    const [newGroupName, setNewGroupName] = useState('')
    const [newGroupDescription, setNewGroupDescription] = useState('')
    const [selectedMembers, setSelectedMembers] = useState<number[]>([])

    // Fetch community posts
    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['community-feed'],
        queryFn: residentService.getCommunityFeed
    })

    // Fetch society chat messages
    const { data: societyChatMessages = [] } = useQuery<any[]>({
        queryKey: ['community-chat'],
        queryFn: async () => {
            try {
                const response = await api.get('/community/chat')
                return response.data
            } catch (err) {
                return []
            }
        },
        refetchInterval: 3000,
    })

    // Fetch user's groups
    const { data: groups = [] } = useQuery<any[]>({
        queryKey: ['user-groups'],
        queryFn: async () => {
            const response = await api.get('/community/groups')
            return response.data
        },
        refetchInterval: 5000,
    })

    // Fetch group messages when group is selected
    const { data: groupMessages = [] } = useQuery<any[]>({
        queryKey: ['group-messages', selectedChat.id],
        queryFn: async () => {
            if (selectedChat.type !== 'group' || !selectedChat.id) return []
            const response = await api.get(`/community/groups/${selectedChat.id}/messages`)
            return response.data
        },
        enabled: selectedChat.type === 'group' && !!selectedChat.id,
        refetchInterval: 3000,
    })

    // Fetch society members for group creation
    const { data: societyMembers = [] } = useQuery<any[]>({
        queryKey: ['society-members'],
        queryFn: async () => {
            const response = await api.get('/community/members')
            return response.data
        },
        enabled: isCreateGroupOpen,
    })

    // Current messages based on selected chat
    const currentMessages = selectedChat.type === 'society' ? societyChatMessages : groupMessages

    // Send message mutation (society or group)
    const sendMessageMutation = useMutation({
        mutationFn: async (text: string) => {
            if (selectedChat.type === 'society') {
                const response = await api.post('/community/chat', { message: text })
                return response.data
            } else {
                const response = await api.post(`/community/groups/${selectedChat.id}/messages`, { message: text })
                return response.data
            }
        },
        onSuccess: () => {
            setMessage('')
            if (selectedChat.type === 'society') {
                queryClient.invalidateQueries({ queryKey: ['community-chat'] })
            } else {
                queryClient.invalidateQueries({ queryKey: ['group-messages', selectedChat.id] })
                queryClient.invalidateQueries({ queryKey: ['user-groups'] })
            }
            scrollToBottom()
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to send message')
        }
    })

    // Create group
    const createGroupMutation = useMutation({
        mutationFn: async (data: { name: string, description: string, memberIds: number[] }) => {
            const response = await api.post('/community/groups', data)
            return response.data
        },
        onSuccess: (data) => {
            toast.success('Group created successfully!')
            setIsCreateGroupOpen(false)
            setNewGroupName('')
            setNewGroupDescription('')
            setSelectedMembers([])
            queryClient.invalidateQueries({ queryKey: ['user-groups'] })
            // Auto-select the new group
            setSelectedChat({
                type: 'group',
                id: data.id,
                name: data.name,
                memberCount: data.memberCount,
                members: data.members,
                createdBy: { id: user?.id }
            })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to create group')
        }
    })

    // Delete group
    const deleteGroupMutation = useMutation({
        mutationFn: async (groupId: number) => {
            const response = await api.delete(`/community/groups/${groupId}`)
            return response.data
        },
        onSuccess: () => {
            toast.success('Group deleted successfully!')
            setSelectedChat({ type: 'society', name: 'Society Chat' })
            queryClient.invalidateQueries({ queryKey: ['user-groups'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to delete group')
        }
    })

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [currentMessages])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim()) return
        sendMessageMutation.mutate(message.trim())
    }

    const handleCreateGroup = () => {
        if (!newGroupName.trim()) {
            toast.error('Group name is required')
            return
        }
        if (selectedMembers.length === 0) {
            toast.error('Please select at least one member')
            return
        }
        createGroupMutation.mutate({
            name: newGroupName.trim(),
            description: newGroupDescription.trim(),
            memberIds: selectedMembers
        })
    }

    const handleDeleteGroup = () => {
        if (selectedChat.type === 'group' && selectedChat.id) {
            if (confirm('Are you sure you want to delete this group?')) {
                deleteGroupMutation.mutate(selectedChat.id)
            }
        }
    }

    const toggleMember = (memberId: number) => {
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        )
    }

    const selectGroup = (group: any) => {
        setSelectedChat({
            type: 'group',
            id: group.id,
            name: group.name,
            memberCount: group.memberCount,
            members: group.members,
            createdBy: group.createdBy
        })
    }

    // Render message bubble
    const renderMessage = (msg: any, isMyMessage: boolean) => (
        <div key={msg.id} className={`flex gap-3 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
            <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className={isMyMessage ? 'bg-purple-500 text-white' : 'bg-gray-200'}>
                    {msg.userName?.charAt(0) || 'U'}
                </AvatarFallback>
            </Avatar>
            <div className={`flex flex-col max-w-[70%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-700">
                        {isMyMessage ? 'You' : msg.userName || 'Anonymous'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <div
                    className={`px-4 py-2 rounded-2xl ${isMyMessage
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                >
                    <p className="text-sm break-words">{msg.message}</p>
                </div>
            </div>
        </div>
    )

    if (isLoading) return (
        <div className="container mx-auto p-6 max-w-6xl space-y-6">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-96 w-full rounded-xl" />
        </div>
    )

    if (error) return (
        <div className="container mx-auto p-6 text-center">
            <h2 className="text-xl font-bold text-red-600">Error loading community feed</h2>
            <p className="text-muted-foreground">Please try again later.</p>
        </div>
    )

    return (
        <RoleGuard allowedRoles={['resident', 'committee', 'admin', 'super_admin', 'society_admin']}>
            <div className="container mx-auto p-6 max-w-6xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
                            <MessageSquare className="h-8 w-8 text-pink-600" />
                            Community Hub
                        </h1>
                        <p className="text-muted-foreground">
                            Connect with neighbors, chat in groups, and stay updated.
                        </p>
                    </div>
                    <CreatePostDialog />
                </div>

                <Tabs defaultValue="feed" className="w-full">
                    <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                        <TabsTrigger value="feed" className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Community Feed
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" />
                            Live Chat
                            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                                {groups.length + 1}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>

                    {/* Feed Tab */}
                    <TabsContent value="feed">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {(posts || []).map((post: any) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                                {(!posts || posts.length === 0) && (
                                    <Card className="p-12 text-center border-dashed border-2">
                                        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                        <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
                                        <p className="text-muted-foreground">Be the first to share something!</p>
                                    </Card>
                                )}
                            </div>

                            <div className="space-y-6">
                                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                    <CardContent className="p-6">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            Upcoming Events
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                                <div className="bg-white/20 p-2 rounded-lg text-center min-w-[50px]">
                                                    <span className="block text-[10px] font-bold opacity-70">MAR</span>
                                                    <span className="block text-xl font-bold">15</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">Holi Celebration</p>
                                                    <p className="text-[10px] opacity-80">Central Park • 10:00 AM</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-sm bg-gray-50/50">
                                    <CardContent className="p-6">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Useful Contacts
                                        </h3>
                                        <ul className="space-y-3 text-sm">
                                            <li className="flex justify-between py-1 border-b last:border-0">
                                                <span className="text-muted-foreground">Main Gate</span>
                                                <span className="font-semibold text-blue-600">101</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Live Chat Tab - WhatsApp Style */}
                    <TabsContent value="chat">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
                            {/* Chat List Sidebar */}
                            <Card className="border-0 shadow-lg lg:col-span-1 flex flex-col">
                                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Chats</CardTitle>
                                        {user?.role === 'resident' && (
                                            <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
                                                <DialogTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle>Create New Group</DialogTitle>
                                                    <DialogDescription>
                                                        Select members from your society to create a group chat
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div>
                                                        <Label>Group Name *</Label>
                                                        <Input
                                                            value={newGroupName}
                                                            onChange={(e) => setNewGroupName(e.target.value)}
                                                            placeholder="Enter group name"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Description</Label>
                                                        <Textarea
                                                            value={newGroupDescription}
                                                            onChange={(e) => setNewGroupDescription(e.target.value)}
                                                            placeholder="Optional group description"
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Select Members ({selectedMembers.length} selected)</Label>
                                                        <ScrollArea className="h-60 border rounded-lg p-3 mt-2">
                                                            <div className="space-y-2">
                                                                {societyMembers.map((member: any) => (
                                                                    <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                                                        <Checkbox
                                                                            checked={selectedMembers.includes(member.id)}
                                                                            onCheckedChange={() => toggleMember(member.id)}
                                                                        />
                                                                        <Avatar className="h-8 w-8">
                                                                            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="flex-1">
                                                                            <p className="font-medium text-sm">{member.name}</p>
                                                                            <p className="text-xs text-muted-foreground">{member.role}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </ScrollArea>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleCreateGroup}
                                                        disabled={createGroupMutation.isPending}
                                                        className="bg-gradient-to-r from-purple-500 to-pink-500"
                                                    >
                                                        {createGroupMutation.isPending ? 'Creating...' : 'Create Group'}
                                                    </Button>
                                                </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                    </div>
                                </CardHeader>
                                <ScrollArea className="flex-1">
                                    <div className="p-2 space-y-1">
                                        {/* Society Chat */}
                                        <div
                                            onClick={() => setSelectedChat({ type: 'society', name: 'Society Chat' })}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                                selectedChat.type === 'society'
                                                    ? 'bg-purple-50 border-2 border-purple-200'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                                    <Globe className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-sm truncate">Society Chat</p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {societyChatMessages[0]?.message || 'No messages yet'}
                                                    </p>
                                                </div>
                                                {societyChatMessages.length > 0 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {societyChatMessages.length}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Groups */}
                                        {groups.map((group: any) => (
                                            <div
                                                key={group.id}
                                                onClick={() => selectGroup(group)}
                                                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                                    selectedChat.type === 'group' && selectedChat.id === group.id
                                                        ? 'bg-blue-50 border-2 border-blue-200'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                                                        <Users className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-sm truncate">{group.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {group.lastMessage?.message || 'No messages yet'}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {group.memberCount}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </Card>

                            {/* Chat Messages Area */}
                            <Card className="border-0 shadow-lg lg:col-span-3 flex flex-col">
                                {/* Chat Header */}
                                <CardHeader className={`${
                                    selectedChat.type === 'society'
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                } text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                                {selectedChat.type === 'society' ? (
                                                    <Globe className="h-5 w-5" />
                                                ) : (
                                                    <Users className="h-5 w-5" />
                                                )}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">{selectedChat.name}</CardTitle>
                                                <p className="text-xs opacity-90">
                                                    {selectedChat.type === 'society'
                                                        ? 'All society members'
                                                        : `${selectedChat.memberCount} members`}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedChat.type === 'group' && selectedChat.createdBy?.id === user?.id && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-white hover:bg-white/20"
                                                onClick={handleDeleteGroup}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>

                                {/* Messages */}
                                <ScrollArea className="flex-1 p-4 bg-gray-50">
                                    <div className="space-y-4">
                                        {currentMessages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full pt-20">
                                                <MessageCircle className="h-16 w-16 text-gray-300 mb-4" />
                                                <h3 className="text-lg font-medium text-gray-600">No messages yet</h3>
                                                <p className="text-sm text-gray-400">Start the conversation!</p>
                                            </div>
                                        ) : (
                                            currentMessages.map((msg: any) => renderMessage(msg, msg.userId === user?.id))
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>

                                {/* Message Input */}
                                <div className="p-4 bg-white border-t">
                                    <form onSubmit={handleSendMessage} className="flex gap-2">
                                        <Input
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            disabled={sendMessageMutation.isPending}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="submit"
                                            disabled={!message.trim() || sendMessageMutation.isPending}
                                            className={selectedChat.type === 'society'
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                                : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                            }
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            </Card>
                        </div>

                        {/* Info Sidebar */}
                        <div className="mt-6">
                            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
                                <CardContent className="p-6">
                                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-purple-600" />
                                        Chat Guidelines
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex gap-2">
                                            <span className="text-purple-600">•</span>
                                            <span>Society Chat is visible to all residents</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-purple-600">•</span>
                                            <span>Create groups for private conversations</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-purple-600">•</span>
                                            <span>Be respectful to all community members</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-purple-600">•</span>
                                            <span>Only group creators can delete groups</span>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </RoleGuard>
    )
}
