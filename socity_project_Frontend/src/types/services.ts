export type LeadStatus = 'new' | 'contacted' | 'closed'
export type InquiryType = 'callback' | 'booking'

export interface ServiceProvider {
    name: string
    rating: number
    reviews: number
    price: string
    image: string
}

export interface ServiceVariant {
    id: string
    name: string
    price: string
    description: string
}

export interface ServiceCategory {
    id: string
    name: string
    icon: string // Storing icon name as string for persistence
    description: string
    color: string
    providers: ServiceProvider[]
    variants?: ServiceVariant[]
}

export interface ServiceInquiry {
    id: string
    residentId: string
    residentName: string
    unit: string
    phone: string
    serviceId: string
    serviceName: string
    providerName: string
    type: InquiryType
    status: 'pending' | 'booked' | 'done' | 'confirmed' | 'cancelled' | 'completed'
    createdAt: string
    preferredDate?: string
    preferredTime?: string
    notes?: string
    vendorId?: string
    vendorName?: string
    source?: 'society' | 'resident' | 'individual'
}

export interface VendorLead {
    id: string
    vendorId: string
    vendorName: string
    residentName: string
    unit: string
    phone: string
    serviceName: string
    inquiryType: InquiryType
    status: LeadStatus
    receivedAt: string
    lastContactedAt?: string
    notes?: string
}

export interface ServiceComplaint {
    id: string
    title: string
    description: string
    serviceId: string
    serviceName: string
    source: 'society' | 'resident' | 'individual'
    reportedBy: string
    reportedByOriginal?: {
        name: string
        email: string
        role: string
    }
    reportedById?: string
    unit?: string // Optional, for residents
    contactPhone?: string
    status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
    priority: 'low' | 'medium' | 'high' | 'urgent'
    createdAt: string
    updatedAt?: string // For tracking updates
    assignedTo?: string
    images?: string[]
    society?: {
        name: string
    }
}
