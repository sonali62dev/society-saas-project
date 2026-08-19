'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { connectSocket, connectPlatformAdmin, connectUser, getSocket } from '@/lib/socket'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { MessageCircle } from 'lucide-react'

export default function ChatNotificationListener() {
  const { user, isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    const socket = getSocket()
    if (user.role === 'super_admin') {
      connectPlatformAdmin()
    } else if (user.societyId) {
      connectSocket(user.societyId)
    } else {
      connectUser(user.id)
    }

    const joinUserRoom = () => {
      socket.emit('join-user', user.id)
    }
    if (socket.connected) {
      joinUserRoom()
    } else {
      socket.once('connect', joinUserRoom)
    }

    const handler = (data: { title?: string; description?: string; conversationId?: number }) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      queryClient.invalidateQueries({ queryKey: ['support-conversation'] })
      const isIndividual = (user?.role || '').toString().toUpperCase().replace(/\s+/g, '_') === 'INDIVIDUAL'
      const chatPath = isIndividual ? '/dashboard/chat' : '/dashboard/helpdesk/chat'
      toast(data.title || 'New message', {
        description: data.description,
        icon: <MessageCircle className="h-5 w-5 text-blue-600" />,
        action: data.conversationId
          ? {
              label: 'Open chat',
              onClick: () => window.location.assign(chatPath),
            }
          : undefined,
      })
    }

    socket.on('new-chat-message', handler)

    return () => {
      socket?.off('new-chat-message', handler)
    }
  }, [isAuthenticated, user?.id, user?.societyId, user?.role, queryClient])

  return null
}
