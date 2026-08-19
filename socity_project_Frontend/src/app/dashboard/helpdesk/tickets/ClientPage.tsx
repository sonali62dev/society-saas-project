'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import {
  ArrowLeft,
  Send,
  Lock,
  Eye,
  Clock,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/lib/stores/auth-store'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'

export default function ClientPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => residentService.getTicketById(id as string),
    enabled: !!id,
    refetchInterval: 4000, // Live sync comments every 4 seconds
  })

  const sendCommentMutation = useMutation({
    mutationFn: (msg: string) => residentService.addTicketComment(id as string, msg),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] })
      setNewMessage('')
      toast.success('Reply sent')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to send reply'),
  })

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => residentService.updateTicketStatus(id as string, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      toast.success('Ticket status updated')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update status'),
  })

  // Scroll to bottom on load or new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [ticket?.comments?.length])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        Error loading ticket or unauthorized.
        <Button className="mt-4 block mx-auto" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    sendCommentMutation.mutate(newMessage.trim())
  }

  const comments = ticket.comments || []

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">#{ticket.id}</span>
              <Badge className="uppercase text-[10px] bg-blue-100 text-blue-800 border-0 font-extrabold">
                {ticket.status}
              </Badge>
              {ticket.isPrivate && (
                <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px] font-extrabold">
                  <Lock className="h-3 w-3 mr-1" /> PRIVATE
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900 mt-0.5">{ticket.title}</h1>
          </div>
        </div>

        {/* Admin / Super Admin Status Controller */}
        {['admin', 'super_admin', 'committee'].includes(user?.role?.toLowerCase() || '') && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Status:</span>
            <Select
              value={ticket.status}
              onValueChange={(val) => updateStatusMutation.mutate(val)}
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-36 h-9 rounded-xl font-bold text-xs bg-gray-50">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="OPEN">OPEN</SelectItem>
                <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
                <SelectItem value="RESOLVED">RESOLVED</SelectItem>
                <SelectItem value="CLOSED">CLOSED</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={() => updateStatusMutation.mutate('RESOLVED')}
              disabled={ticket.status === 'RESOLVED' || updateStatusMutation.isPending}
              className={cn(
                "font-bold text-xs rounded-xl h-9 px-4 gap-1.5 transition-all shadow-xs",
                ticket.status === 'RESOLVED'
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              {ticket.status === 'RESOLVED' ? 'Resolved' : 'Mark Resolved'}
            </Button>
          </div>
        )}
      </div>

      {/* Original Issue Card */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-100">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold uppercase">
              {ticket.reportedBy?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-bold text-gray-900">{ticket.reportedBy?.name || 'User'}</p>
              <span className="text-xs text-gray-400 font-medium">
                {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium uppercase mt-0.5">
              Category: <span className="text-gray-700 font-bold">{ticket.category}</span> | Priority:{' '}
              <span className="text-gray-700 font-bold">{ticket.priority}</span>
            </p>
            <p className="text-gray-700 mt-3 text-sm leading-relaxed font-medium bg-gray-50 p-3.5 rounded-xl">
              {ticket.description}
            </p>
          </div>
        </div>
      </div>

      {/* Live Comments Thread */}
      <Card className="flex-1 flex flex-col overflow-hidden border-0 shadow-sm rounded-2xl bg-slate-50/50">
        <div className="p-3 bg-white border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Discussion & Resolution Feed ({comments.length})
          </h3>
          <span className="text-[10px] text-emerald-600 font-bold animate-pulse">● Live Sync</span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs font-medium">
              No replies yet. Type a message below to start the conversation.
            </div>
          ) : (
            comments.map((comment: any) => {
              const isMe = comment.userId === user?.id
              return (
                <div
                  key={comment.id}
                  className={cn('flex items-start gap-3 max-w-[85%]', isMe ? 'ml-auto flex-row-reverse' : '')}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className={cn(
                        'text-xs font-bold',
                        isMe ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      )}
                    >
                      {comment.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'p-3.5 rounded-2xl text-xs space-y-1 shadow-xs',
                      isMe
                        ? 'bg-[#1e3a5f] text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    )}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className={cn('font-bold', isMe ? 'text-blue-200' : 'text-gray-900')}>
                        {comment.user?.name || 'User'}{' '}
                        {comment.user?.role && (
                          <span className="text-[9px] opacity-75 font-normal">({comment.user.role})</span>
                        )}
                      </span>
                      <span className={cn('text-[9px]', isMe ? 'text-blue-200/70' : 'text-gray-400')}>
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap font-medium">{comment.message}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <Input
            placeholder="Type your message or update here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sendCommentMutation.isPending}
            className="h-11 rounded-xl bg-gray-50 border-0 focus:bg-white text-xs font-medium"
          />
          <Button
            type="submit"
            disabled={sendCommentMutation.isPending || !newMessage.trim()}
            className="h-11 px-5 rounded-xl bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white font-bold gap-2 text-xs"
          >
            <Send className="h-4 w-4" />
            {sendCommentMutation.isPending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
