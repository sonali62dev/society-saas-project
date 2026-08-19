import api from '@/lib/api'

export interface ChatMessage {
  id: number
  conversationId: number
  senderId: number
  content: string
  attachments?: any
  status: string
  createdAt: string
  sender: {
    id: number
    name: string
    role: string
  }
}

export interface Conversation {
  id: number
  type: string
  participantId: number
  participant: {
    name: string
    profileImg?: string
  }
  messages: ChatMessage[]
  updatedAt: string
}

export const chatService = {
  /** Users the current user can start a chat with. For Guard: pass scope: 'residents_only' on "Chat with Residents" page so creator (admin) is not shown there; header chat gets full list (creator + residents). */
  getAvailableUsersForChat: async (search?: string, options?: { scope?: 'residents_only' }) => {
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (options?.scope) params.scope = options.scope
    const response = await api.get<{ id: number; name: string; email: string; role: string; profileImg?: string; phone?: string; societyId?: number; societyName?: string }[]>('/chat/available-users', { params })
    return response.data
  },

  listConversations: async () => {
    const response = await api.get<Conversation[]>('/chat/conversations')
    return response.data
  },

  /** Fetch messages with optional pagination. Returns array (data) and total. */
  getMessages: async (
    conversationId: number,
    params?: { limit?: number; offset?: number }
  ): Promise<{ data: ChatMessage[]; total: number; limit: number; offset: number }> => {
    const response = await api.get<{ data: ChatMessage[]; total: number; limit: number; offset: number }>(
      `/chat/conversations/${conversationId}/messages`,
      { params: params || {} }
    )
    return response.data
  },

  /** Mark all messages in conversation as read (for current user). */
  markConversationAsRead: async (conversationId: number) => {
    const response = await api.patch<{ success: boolean }>(`/chat/conversations/${conversationId}/read`)
    return response.data
  },

  /** Individual only: get or create the single conversation with Super Admin (platform support). */
  getOrCreateSupportConversation: async () => {
    const response = await api.get<Conversation & { unreadCount?: number }>('/chat/support-conversation')
    return response.data
  },

  sendMessage: async (data: { conversationId: number; content: string; attachments?: { url: string; type?: string; name?: string }[] }) => {
    const response = await api.post<ChatMessage>('/chat/messages', data)
    return response.data
  },

  uploadAttachment: async (file: File): Promise<{ url: string; type: string; name: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<{ url: string; type: string; name: string }>('/chat/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  startConversation: async (type: string) => {
    const response = await api.post<Conversation>('/chat/start', { type })
    return response.data
  },

  /** Start direct 1:1 chat with another user; optional listingItem from marketplace so product appears in chat for both */
  startDirectConversation: async (
    targetUserId: number,
    listingItem?: { itemId: number; itemTitle: string; itemPrice?: string; itemImage?: string }
  ) => {
    const body: { targetUserId: number; listingItem?: typeof listingItem } = { targetUserId }
    if (listingItem?.itemTitle) body.listingItem = listingItem
    const response = await api.post('/chat/start', body)
    return response.data
  }
}
