import { SupportTicket } from '@/types/tickets'

// Mock Data for Tickets
// TODO: Replace with real API connection later
export const mockTickets: SupportTicket[] = [
    {
        id: 'TKT-1001',
        title: 'Broken Lobby Window',
        description: 'The main lobby window in Tower A is cracked.',
        category: 'Maintenance',
        priority: 'high',
        status: 'open',
        isPrivate: false,
        residentId: 'res-001',
        residentName: 'Rajesh Kumar',
        unit: 'A-205',
        createdAt: '2024-12-20T10:00:00Z',
        updatedAt: '2024-12-20T10:00:00Z',
        assignedTo: 'Society Manager',
        handlerId: 'admin-001',
        escalatedToTech: false,
        messages: [
            {
                id: 'msg-001',
                senderId: 'res-001',
                senderName: 'Rajesh Kumar',
                senderRole: 'resident',
                content: 'I noticed the crack this morning. It looks dangerous.',
                createdAt: '2024-12-20T10:00:00Z'
            }
        ]
    },
    {
        id: 'TKT-1002',
        title: 'Private Dispute with Neighbor',
        description: 'Ongoing issue with noise from C-304. Please handle discreetly.',
        category: 'Other',
        priority: 'medium',
        status: 'in-progress',
        isPrivate: true,
        residentId: 'res-002',
        residentName: 'Priya Sharma',
        unit: 'C-305',
        createdAt: '2024-12-21T14:30:00Z',
        updatedAt: '2024-12-22T09:00:00Z',
        assignedTo: 'Society Manager',
        handlerId: 'admin-001',
        escalatedToTech: false,
        messages: [
            {
                id: 'msg-002',
                senderId: 'res-002',
                senderName: 'Priya Sharma',
                senderRole: 'resident',
                content: 'Is there any update on the mediation?',
                createdAt: '2024-12-22T08:30:00Z'
            },
            {
                id: 'msg-003',
                senderId: 'admin-001',
                senderName: 'Society Manager',
                senderRole: 'admin',
                content: 'I have spoken to the owner of C-304. They will try to keep it down.',
                createdAt: '2024-12-22T09:00:00Z'
            }
        ]
    },
    {
        id: 'TKT-1003',
        title: 'Network Outage in Clubhouse',
        description: 'The Wi-Fi in the clubhouse is not working since afternoon.',
        category: 'Technical',
        priority: 'medium',
        status: 'open',
        isPrivate: false,
        residentId: 'sec-001',
        residentName: 'Amit Verma',
        unit: 'Clubhouse',
        createdAt: '2024-12-23T11:00:00Z',
        updatedAt: '2024-12-23T11:00:00Z',
        assignedTo: 'Society Manager',
        handlerId: 'admin-001',
        escalatedToTech: false,
        messages: []
    },
    {
        id: 'TKT-1004',
        title: 'Billing Error - Maintenance Dues',
        description: 'My maintenance bill shows double the amount for this month.',
        category: 'Other',
        priority: 'high',
        status: 'resolved',
        isPrivate: true,
        residentId: 'res-001',
        residentName: 'Rajesh Kumar',
        unit: 'A-205',
        createdAt: '2024-12-15T09:00:00Z',
        updatedAt: '2024-12-16T16:00:00Z',
        assignedTo: 'Society Manager',
        handlerId: 'admin-001',
        escalatedToTech: false,
        messages: [
            {
                id: 'msg-004',
                senderId: 'admin-001',
                senderName: 'Society Manager',
                senderRole: 'admin',
                content: 'This has been corrected. Please check your dashboard.',
                createdAt: '2024-12-16T16:00:00Z'
            }
        ]
    }
]
