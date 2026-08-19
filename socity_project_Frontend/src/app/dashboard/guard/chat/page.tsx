'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  ChevronLeft,
  Users,
  Paperclip,
  Smile,
  CheckCheck,
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
import { format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const EMOJI_LIST = ['😀', '😊', '👍', '❤️', '😂', '😍', '🙏', '👋', '😅', '🔥', '✨', '💯', '😢', '😡', '🤔', '👏', '🎉', '✅', '❌', '💬']

/**
 * Guard Dashboard – Chat with Residents (same society only).
 * Backend enforces: Guard can only chat with RESIDENT users of their society.
 */
export default function GuardChatPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [pendingAttachments, setPendingAttachments] = useState<{ url: string; type?: string; name?: string }[]>([])
  const [uploadingFile, setUploadingFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const scrollEndRef = useRef<HTMLDivElement>(null)

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.listConversations,
  })

  const selectedChat = conversations.find((c: any) => c.id === selectedChatId)

  const { data: messagesRes } = useQuery({
    queryKey: ['messages', selectedChatId],
    queryFn: () =>
      selectedChatId
        ? chatService.getMessages(selectedChatId)
        : Promise.resolve({ data: [], total: 0, limit: 50, offset: 0 }),
    enabled: !!selectedChatId,
    refetchInterval: 3000,
  })
  const messages = messagesRes?.data ?? []

  useEffect(() => {
    if (selectedChatId) {
      chatService
        .markConversationAsRead(selectedChatId)
        .then(() => queryClient.invalidateQueries({ queryKey: ['conversations'] }))
        .catch(() => {})
    }
  }, [selectedChatId, queryClient])

  const { data: availableUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users-for-chat', 'guard-page', userSearchTerm],
    queryFn: async () => {
      const list = await chatService.getAvailableUsersForChat(undefined, { scope: 'residents_only' })
      if (!userSearchTerm) return list.slice(0, 50)
      const q = userSearchTerm.toLowerCase()
      return list
        .filter(
          (u: any) =>
            (u.name || '').toLowerCase().includes(q) ||
            (u.email || '').toLowerCase().includes(q) ||
            (u.role || '').toLowerCase().includes(q)
        )
        .slice(0, 50)
    },
    enabled: isNewChatOpen,
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
    },
  })

  const startDirectMutation = useMutation({
    mutationFn: (targetUserId: number) => chatService.startDirectConversation(targetUserId),
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
    },
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if ((!newMessage.trim() && pendingAttachments.length === 0) || !selectedChatId) return
    sendMutation.mutate({
      conversationId: selectedChatId,
      content: newMessage.trim() || '(attachment)',
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploadingFile(true)
    try {
      const result = await chatService.uploadAttachment(file)
      setPendingAttachments((prev) => [...prev, { url: result.url, type: result.type, name: result.name }])
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to upload file')
    } finally {
      setUploadingFile(false)
    }
  }

  const displayConversations = (conversations as any[]).map((c: any) => ({
    id: c.id,
    type: c.type || 'DIRECT',
    name: c.otherUser?.name || 'Unknown',
    avatar: (c.otherUser?.name || '?').substring(0, 2).toUpperCase(),
    lastMessage: c.lastMessage?.content ?? 'No messages yet',
    time: c.updatedAt ? format(new Date(c.updatedAt), 'hh:mm a') : '',
    unreadCount: c.unreadCount ?? 0,
    otherUser: c.otherUser,
  }))

  return (
    <div className="h-[calc(100vh-100px)] bg-gray-50">
      <div className="h-full flex">
        <div className={`w-full md:w-80 bg-white border-r flex flex-col min-h-0 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                Chat with Residents
              </h2>
              <Button
                variant={isNewChatOpen ? 'secondary' : 'outline'}
                size="sm"
                className="rounded-xl"
                onClick={() => setIsNewChatOpen(!isNewChatOpen)}
              >
                <Users className="h-4 w-4 mr-1" />
                {isNewChatOpen ? 'Back' : 'New'}
              </Button>
            </div>
            {isNewChatOpen && (
              <div className="mt-3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search residents..."
                  className="pl-10 h-10 rounded-xl"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 min-h-0">
            {isNewChatOpen ? (
              <>
                {usersLoading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Loading residents...</div>
                ) : availableUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">No residents found in your society.</div>
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
                        <p className="text-xs text-gray-500 capitalize">{u.role || 'Resident'}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </>
            ) : (
              <>
                {conversationsLoading ? (
                  <div className="p-4 text-center text-gray-500 text-sm">Loading conversations...</div>
                ) : displayConversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">No conversations yet. Click &quot;New&quot; to chat with a resident.</div>
                ) : (
                  displayConversations.map((conv: any) => (
                    <motion.div
                      key={conv.id}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => {
                        setSelectedChatId(conv.id)
                        setShowMobileChat(true)
                      }}
                      className={`p-4 border-b cursor-pointer transition-colors ${selectedChatId === conv.id ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">{conv.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm truncate">{conv.name}</p>
                            <span className="flex items-center gap-1.5 shrink-0">
                              {conv.unreadCount > 0 && (
                                <Badge variant="destructive" className="h-5 min-w-5 px-1 text-xs">
                                  {conv.unreadCount}
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

        <div className={`flex-1 flex flex-col bg-white ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              <div className="p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="md:hidden p-0 h-8 w-8" onClick={() => setShowMobileChat(false)}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                      {((selectedChat as any)?.otherUser?.name || '??').substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-sm">{(selectedChat as any)?.otherUser?.name || 'Resident'}</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Resident</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  title="Call"
                  onClick={() => {
                    const phone = (selectedChat as any)?.otherUser?.phone
                    if (phone) window.open(`tel:${phone}`, '_self')
                    else toast.error('Phone number not available')
                  }}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4 bg-gray-50/50">
                <div className="space-y-6">
                  {messages.map((msg: any) => {
                    const isMe = msg.sender?.id === user?.id
                    const senderLabel = isMe ? 'You' : msg.sender?.name || 'Resident'
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
                                isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-900 border border-gray-100 rounded-bl-none'
                              }`}
                            >
                              <p className="leading-relaxed">{msg.content}</p>
                              {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {(msg.attachments as { url?: string; type?: string; name?: string }[])
                                    .filter((att) => att?.url)
                                    .map((att, idx) =>
                                      att.url!.match(/\.(jpg|jpeg|png|gif|webp)/i) || att.type === 'image' ? (
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
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 px-1">
                              <span className="text-[10px] text-gray-400 font-medium">{format(new Date(msg.createdAt), 'hh:mm a')}</span>
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

              <div className="p-4 bg-white border-t">
                {pendingAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {pendingAttachments.map((att, i) => (
                      <div key={i} className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1 text-xs">
                        {att.url.match(/\.(jpg|jpeg|png|gif|webp)/i) || att.type === 'image' ? (
                          <img src={att.url} alt="" className="h-8 w-8 rounded object-cover" />
                        ) : (
                          <Paperclip className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="max-w-[120px] truncate">{att.name || 'File'}</span>
                        <button
                          type="button"
                          onClick={() => setPendingAttachments((prev) => prev.filter((_, j) => j !== i))}
                          className="text-red-500 hover:text-red-700 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileSelect} />
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
                              onClick={() => setNewMessage((prev) => prev + emoji)}
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
              <h3 className="text-lg font-bold text-gray-900">Chat with Residents</h3>
              <p className="text-sm text-gray-500 max-w-xs mt-2 font-medium">
                Click &quot;New&quot; to start a chat with a resident, or select an existing conversation from the list.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
