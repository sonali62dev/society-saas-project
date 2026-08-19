import { format } from 'date-fns'

/** Support channel config – same as Live Chat page so header and Live Chat show exact same list */
export const SUPPORT_CHANNELS = [
  { type: 'SUPPORT_ADMIN', name: 'Admin Support', avatar: 'AS' },
  { type: 'SUPPORT_MAINTENANCE', name: 'Maintenance Team', avatar: 'MT' },
  { type: 'SUPPORT_SECURITY', name: 'Security Desk', avatar: 'SD' },
  { type: 'SUPPORT_COMMITTEE', name: 'Committee President', avatar: 'CP' },
  { type: 'SUPPORT_ACCOUNTS', name: 'Accounts Department', avatar: 'AD' },
] as const

export type DisplayConversation = {
  id: number
  type?: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  existingId?: number
  otherUser?: { id: number; name: string; profileImg?: string; role?: string; phone?: string } | null
  updatedAt?: string
  unreadCount?: number
}

/**
 * Build the same conversation list for both Header chat dropdown and Live Chat page.
 * Resident: support channels (merged with API) + direct conversations from API.
 * Admin/non-resident: all conversations from API.
 */
export function getDisplayConversations(
  conversations: any[],
  user: { id?: number | string; role?: string } | null
): DisplayConversation[] {
  const userRole = (user?.role || '').toUpperCase()
  const list: DisplayConversation[] = []

  if (userRole === 'RESIDENT') {
    // 1. Support channels (same order as Live Chat) – merge with existing from API
    for (const channel of SUPPORT_CHANNELS) {
      const existing = (conversations as any[]).find((c: any) => c.type === channel.type)
      const lastMsg = existing?.lastMessage || existing?.messages?.[0]
      list.push({
        id: existing?.id ?? -1,
        type: channel.type,
        name: channel.name,
        avatar: channel.avatar,
        lastMessage: (typeof lastMsg === 'string' ? lastMsg : lastMsg?.content) || 'Start a conversation',
        time: existing?.updatedAt ? format(new Date(existing.updatedAt), 'hh:mm a') : '',
        existingId: existing?.id,
        updatedAt: existing?.updatedAt,
      })
    }
    // 2. Direct conversations from API (so header and Live Chat both show e.g. seller chats)
    const directConvs = (conversations as any[]).filter((c: any) => c.type === 'DIRECT')
    for (const c of directConvs) {
      const lastMsg = c.lastMessage?.content ?? 'No messages yet'
      list.push({
        id: c.id,
        type: 'DIRECT',
        name: c.otherUser?.name || 'Unknown',
        avatar: (c.otherUser?.name || '?').substring(0, 2).toUpperCase(),
        lastMessage: lastMsg,
        time: c.updatedAt ? format(new Date(c.updatedAt), 'hh:mm a') : '',
        existingId: c.id,
        otherUser: c.otherUser ?? null,
        updatedAt: c.updatedAt,
        unreadCount: c.unreadCount ?? 0,
      })
    }
    // Sort by updatedAt so most recent first (support channels without existing put at end)
    list.sort((a, b) => {
      const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
      const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
      return bTime - aTime
    })
    return list
  }

  // Admin / non-resident: all from API (same as Live Chat)
  for (const c of conversations as any[]) {
    list.push({
      id: c.id,
      type: c.type || 'DIRECT',
      name: c.otherUser?.name || 'Unknown',
      avatar: (c.otherUser?.name || '?').substring(0, 2).toUpperCase(),
      lastMessage: c.lastMessage?.content ?? 'No messages yet',
      time: c.updatedAt ? format(new Date(c.updatedAt), 'hh:mm a') : '',
      existingId: c.id,
      otherUser: c.otherUser ?? null,
      updatedAt: c.updatedAt,
      unreadCount: c.unreadCount ?? 0,
    })
  }
  return list
}
