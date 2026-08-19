'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Image as ImageIcon,
  Smile,
  CheckCheck,
  ChevronLeft,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chatService } from '@/services/chat.service'
import { toast } from 'sonner'
import { getSocket } from '@/lib/socket'
import { format } from 'date-fns'
import { useSearchParams } from 'next/navigation'
import { ShoppingBag } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getDisplayConversations, SUPPORT_CHANNELS as SUPPORT_CHANNELS_CONFIG } from '@/lib/chat-display'

const EMOJI_LIST = ['😀', '😊', '👍', '❤️', '😂', '😍', '🙏', '👋', '😅', '🔥', '✨', '💯', '😢', '😡', '🤔', '👏', '🎉', '✅', '❌', '💬']

export default function HelpdeskChatPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [marketplaceContext, setMarketplaceContext] = useState<{
    sellerId: number | null;
    itemId: number | null;
    itemTitle: string | null;
    itemPrice: string | null;
    itemImage: string | null;
  }>({ sellerId: null, itemId: null, itemTitle: null, itemPrice: null, itemImage: null })
  const [pendingAttachments, setPendingAttachments] = useState<{ url: string; type?: string; name?: string }[]>([])
  const [uploadingFile, setUploadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollEndRef = useRef<HTMLDivElement>(null)

  // Fetch Conversations (same API as header – returns { id, otherUser, lastMessage, updatedAt }[])
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.listConversations
  })

  // Selected conversation – API shape has otherUser, lastMessage, updatedAt
  const selectedChat = conversations.find((c: any) => c.id === selectedChatId)

  // Fetch Messages (API returns { data, total, limit, offset })
  const { data: messagesRes } = useQuery({
    queryKey: ['messages', selectedChatId],
    queryFn: () => selectedChatId ? chatService.getMessages(selectedChatId) : Promise.resolve({ data: [], total: 0, limit: 50, offset: 0 }),
    enabled: !!selectedChatId,
    refetchInterval: 3000
  })
  const messages = messagesRes?.data ?? []

  // Mark conversation as read when opening it (updates unread count)
  useEffect(() => {
    if (selectedChatId) {
      chatService.markConversationAsRead(selectedChatId).then(() => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      }).catch(() => {})
    }
  }, [selectedChatId, queryClient])

  // Users list for "New conversation": Guard (residents), Resident (guards + admin), Admin/Super Admin/Individual/Committee: from chat API.
  const isAdminFlow = user?.role && ['GUARD', 'RESIDENT', 'ADMIN', 'SUPER_ADMIN', 'INDIVIDUAL', 'COMMITTEE'].includes(user.role.toUpperCase())
  const { data: availableUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users-for-chat', userSearchTerm],
    queryFn: async () => {
      const list = await chatService.getAvailableUsersForChat()
      if (!userSearchTerm) return list.slice(0, 30)
      const q = userSearchTerm.toLowerCase()
      return list
        .filter((u: any) =>
          (u.name || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q) ||
          (u.role || '').toLowerCase().includes(q) ||
          (u.societyName || '').toLowerCase().includes(q)
        )
        .slice(0, 30)
    },
    enabled: isAdminFlow && isNewChatOpen
  })

  const sendMutation = useMutation({
    mutationFn: chatService.sendMessage,
    onSuccess: () => {
      setNewMessage('')
      setPendingAttachments([])
      queryClient.invalidateQueries({ queryKey: ['messages', selectedChatId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: (error: any) => {
      toast.error('Failed to send message: ' + (error.response?.data?.error || error.message))
    }
  })

  const startMutation = useMutation({
    mutationFn: chatService.startConversation,
    onSuccess: (newConv: any) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setSelectedChatId(newConv?.id ?? null)
      setShowMobileChat(true)
      toast.success('Conversation started')
    },
    onError: (error: any) => {
      toast.error('Failed to start chat: ' + (error.response?.data?.error || error.message))
    }
  })

  const startDirectMutation = useMutation({
    mutationFn: (arg: number | { targetUserId: number; listingItem?: { itemId: number; itemTitle: string; itemPrice?: string; itemImage?: string } }) => {
      if (typeof arg === 'number') return chatService.startDirectConversation(arg)
      return chatService.startDirectConversation(arg.targetUserId, arg.listingItem)
    },
    onSuccess: (newConv: any) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setSelectedChatId(newConv?.id ?? null)
      setIsNewChatOpen(false)
      setUserSearchTerm('')
      setShowMobileChat(true)
      toast.success('Conversation started')
    },
    onError: (error: any) => {
      toast.error('Failed to start chat: ' + (error.response?.data?.error || error.message))
    }
  })

  // Socket.io ... (unchanged)

  // ...

  const handleChannelClick = (type: string, existingId?: number) => {
    if (existingId != null && existingId !== -1) {
      setSelectedChatId(existingId)
      setShowMobileChat(true)
    } else if (type && !isAdminFlow) {
      startMutation.mutate(type)
      setShowMobileChat(true)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if ((!newMessage.trim() && pendingAttachments.length === 0) || !selectedChatId) return
    sendMutation.mutate({
      conversationId: selectedChatId,
      content: newMessage.trim() || '(attachment)',
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploadingFile(true)
    try {
      const result = await chatService.uploadAttachment(file)
      setPendingAttachments(prev => [...prev, { url: result.url, type: result.type, name: result.name }])
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to upload file')
    } finally {
      setUploadingFile(false)
    }
  }

  // Handle marketplace context from URL – start direct chat with seller
  useEffect(() => {
    const userId = searchParams.get('userId')
    const itemId = searchParams.get('itemId')
    const itemTitle = searchParams.get('itemTitle')
    const itemPrice = searchParams.get('itemPrice')
    const itemImage = searchParams.get('itemImage')
    if (userId && itemId && itemTitle) {
      const decodedTitle = decodeURIComponent(itemTitle)
      const decodedImage = itemImage ? decodeURIComponent(itemImage) : undefined
      setMarketplaceContext({
        sellerId: parseInt(userId),
        itemId: parseInt(itemId),
        itemTitle: decodedTitle,
        itemPrice: itemPrice || null,
        itemImage: decodedImage || null
      })
      // Pre-fill message only – not sent until user clicks Send
      setNewMessage(`Hi! I'm interested in your listing: "${decodedTitle}"`)
      // Start chat and send listing to backend so product appears in chat for both buyer and seller
      startDirectMutation.mutate({
        targetUserId: parseInt(userId),
        listingItem: {
          itemId: parseInt(itemId),
          itemTitle: decodedTitle,
          itemPrice: itemPrice || undefined,
          itemImage: decodedImage
        }
      })
      setShowMobileChat(true)
    }
  }, [searchParams])

  // Same list as Header – support channels + direct chats for resident; all for admin
  const displayConversations = useMemo(
    () => getDisplayConversations(conversations, user).map((c) => ({ ...c, unread: 0, online: true })),
    [conversations, user]
  )

  return (
    <div className="h-[calc(100vh-100px)] bg-gray-50">
      <div className="h-full flex">
        {/* Conversations List */}
        <div className={`w-full md:w-80 bg-white border-r flex flex-col min-h-0 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                Messages
              </h2>
              {isAdminFlow && (
                <Button
                  variant={isNewChatOpen ? 'secondary' : 'outline'}
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setIsNewChatOpen(!isNewChatOpen)}
                >
                  <Users className="h-4 w-4 mr-1" />
                  {isNewChatOpen ? 'Back' : 'New'}
                </Button>
              )}
            </div>
            {!isNewChatOpen && (
              <div className="mt-3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search conversations..." className="pl-10 h-10 rounded-xl" />
              </div>
            )}
            {isAdminFlow && isNewChatOpen && (
              <div className="mt-3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-10 h-10 rounded-xl"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 min-h-0">
            {isAdminFlow && isNewChatOpen ? (
              <>
                {usersLoading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Loading users...</div>
                ) : availableUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">No users found.</div>
                ) : (
                  availableUsers.map((u: any) => (
                    <motion.div
                      key={u.id}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => startDirectMutation.mutate(u.id)}
                      className="p-4 border-b cursor-pointer transition-colors flex items-center gap-3"
                    >
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                          {(u.name || '?').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{u.name || u.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{u.role || ''}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </>
            ) : (
              <>
                {conversationsLoading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Loading conversations...</div>
                ) : (
                  displayConversations.map((conv) => (
                    <motion.div
                      key={conv.type && conv.type !== 'DIRECT' ? conv.type : `direct-${conv.id}`}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => {
                        if (conv.type && conv.type !== 'DIRECT' && SUPPORT_CHANNELS_CONFIG.some((ch) => ch.type === conv.type)) {
                          handleChannelClick(conv.type, (conv as any).existingId)
                        } else {
                          setSelectedChatId(conv.id)
                          setShowMobileChat(true)
                        }
                      }}
                      className={`p-4 border-b cursor-pointer transition-colors ${selectedChatId === conv.id ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                              {conv.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {conv.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm truncate">{conv.name}</p>
                            <span className="flex items-center gap-1.5 shrink-0">
                              {(conv as any).unreadCount > 0 && (
                                <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs">
                                  {(conv as any).unreadCount}
                                </Badge>
                              )}
                              <span className="text-[10px] text-gray-500 font-medium">{conv.time}</span>
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate mt-0.5">{conv.lastMessage}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </>
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-white ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header – API uses otherUser for direct chats */}
              <div className="p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden p-0 h-8 w-8"
                    onClick={() => setShowMobileChat(false)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                      {((selectedChat as any)?.otherUser?.name || (selectedChat as any)?.participant?.name || (selectedChat as any)?.type?.split('_')[1] || '??').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm">
                      {(selectedChat as any)?.otherUser?.name || (selectedChat as any)?.participant?.name || ((selectedChat as any)?.type || '').replace('SUPPORT_', '') || 'Chat'}
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Online</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    title="Voice call"
                    onClick={() => {
                      const other = (selectedChat as any)?.otherUser || (selectedChat as any)?.participant
                      const phone = other?.phone || (other as any)?.phone
                      if (phone) {
                        window.open(`tel:${phone}`, '_self')
                      } else {
                        toast.error('Phone number not available for this user')
                      }
                    }}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                    title="Video call"
                    onClick={() => {
                      const room = `socity-c${selectedChatId}`
                      const url = `https://meet.jit.si/${room}`
                      window.open(url, '_blank', 'noopener,noreferrer')
                      toast.success('Video call opened. Share the meeting link with the other person to join.')
                    }}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Messages – sender label so it’s clear who sent what */}
              {marketplaceContext.itemId && marketplaceContext.sellerId && (selectedChat as any)?.otherUser?.id === marketplaceContext.sellerId && (
                <div className="mx-4 mt-2 p-3 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {marketplaceContext.itemImage ? (
                      <img src={marketplaceContext.itemImage} alt={marketplaceContext.itemTitle || 'Listing'} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingBag className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">About this listing</p>
                    <p className="font-semibold text-gray-900 truncate">{marketplaceContext.itemTitle}</p>
                    {marketplaceContext.itemPrice && (
                      <p className="text-sm font-bold text-indigo-600">₹{Number(marketplaceContext.itemPrice).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              )}
              <ScrollArea className="flex-1 p-4 bg-gray-50/50">
                <div className="space-y-6">
                  {messages.map((msg: any) => {
                    const isMe = msg.sender?.id === user?.id
                    const senderLabel = isMe ? 'You' : (msg.sender?.name || 'Unknown')
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <span className={`text-xs font-medium px-1 ${isMe ? 'text-blue-600' : 'text-gray-500'}`}>
                          {senderLabel}
                        </span>
                        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} max-w-[85%]`}>
                          <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div
                              className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                                isMe
                                  ? 'bg-blue-600 text-white rounded-br-none'
                                  : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none'
                              }`}
                            >
                              {msg.content?.startsWith('📎 Listing:') ? (
                                <div className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                                    {msg.attachments?.[0]?.url ? (
                                      <img src={msg.attachments[0].url} alt="Listing" className="w-full h-full object-cover" />
                                    ) : (
                                      <ShoppingBag className={`h-6 w-6 ${isMe ? 'text-blue-200' : 'text-gray-400'}`} />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className={`text-xs font-medium uppercase tracking-wide ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>Listing</p>
                                    <p className="font-semibold truncate">{msg.content.replace(/^📎 Listing:\s*/, '').split(/\s*-\s*₹?/)[0]?.trim() || msg.content.replace('📎 Listing: ', '')}</p>
                                    {msg.content.match(/₹[\d,]+/) && (
                                      <p className={`font-bold text-sm mt-0.5 ${isMe ? 'text-blue-100' : 'text-indigo-600'}`}>{msg.content.match(/₹[\d,]+/)?.[0]}</p>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="leading-relaxed">{msg.content}</p>
                                  {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {(msg.attachments as { url?: string; type?: string; name?: string }[])
                                    .filter(att => att?.url)
                                    .map((att, idx) =>
                                      (att.url!.match(/\.(jpg|jpeg|png|gif|webp)/i) || att.type === 'image') ? (
                                        <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className="block">
                                          <img src={att.url} alt={att.name || 'Image'} className="max-w-[200px] max-h-[150px] rounded-lg object-cover" />
                                        </a>
                                      ) : (
                                        <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className={`text-sm underline ${isMe ? 'text-blue-200' : 'text-indigo-600'}`}>
                                          {att.name || 'File'}
                                        </a>
                                      )
                                    )}
                                </div>
                              )}
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 px-1">
                              <span className="text-[10px] text-gray-400 font-medium">
                                {format(new Date(msg.createdAt), 'hh:mm a')}
                              </span>
                              {isMe && <CheckCheck className="h-3 w-3 text-blue-500" />}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  <div ref={scrollEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 bg-white border-t">
                {pendingAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {pendingAttachments.map((att, i) => (
                      <div key={i} className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1 text-xs">
                        {att.url.match(/\.(jpg|jpeg|png|gif|webp)/i) || (att.type === 'image') ? (
                          <img src={att.url} alt="" className="h-8 w-8 rounded object-cover" />
                        ) : (
                          <Paperclip className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="max-w-[120px] truncate">{att.name || 'File'}</span>
                        <button
                          type="button"
                          onClick={() => setPendingAttachments(prev => prev.filter((_, j) => j !== i))}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-gray-400 hover:text-blue-600"
                    title="Attach file"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="h-11 pl-4 pr-10 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 transition-all font-medium"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-blue-500" title="Emoji">
                          <Smile className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 p-2">
                        <div className="grid grid-cols-5 gap-1">
                          {EMOJI_LIST.map((emoji, i) => (
                            <button
                              key={i}
                              type="button"
                              className="text-xl p-1.5 rounded hover:bg-gray-100"
                              onClick={() => setNewMessage(prev => prev + emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    className="h-11 w-11 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                    disabled={(!newMessage.trim() && pendingAttachments.length === 0) || sendMutation.isPending}
                  >
                    <Send className={`h-5 w-5 ${sendMutation.isPending ? 'animate-pulse' : ''}`} />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-10 w-10 text-blue-500 opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Your Conversations</h3>
              <p className="text-sm text-gray-500 max-w-xs mt-2 font-medium">
                {isAdminFlow
                  ? 'Click “New” to start a chat with a user, or select an existing conversation from the list.'
                  : 'Select a support channel from the list to start a real-time chat with our team.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
