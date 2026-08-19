export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketCategory = 'Technical' | 'Maintenance' | 'Other'

export interface TicketMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  content: string
  createdAt: string
  attachments?: string[]
}

export interface SupportTicket {
  id: string
  title: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  isPrivate: boolean // True if only visible to Resident/Secretary and Society Manager
  residentId: string
  residentName: string
  unit: string
  createdAt: string
  updatedAt: string
  assignedTo?: string // Society Manager or Tech Team
  handlerId?: string // Specifically the Society Manager ID
  escalatedToTech: boolean
  messages: TicketMessage[]
}
