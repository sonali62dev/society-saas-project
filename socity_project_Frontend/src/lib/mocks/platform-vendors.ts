import { Vendor } from '@/types'

export const mockPlatformVendors: Vendor[] = [
    {
        id: 'v-plat-001',
        name: 'Mega Power Solutions',
        category: 'electrician',
        contact: '+91 99999 11111',
        email: 'contact@megapower.com',
        rating: 4.8,
        status: 'active',
        servicesProvided: ['Industrial Wiring', 'Panel Maintenance'],
        ownerType: 'super_admin',
        vendorType: 'platform',
    },
    {
        id: 'v-plat-002',
        name: 'AquaFlow Services',
        category: 'plumber',
        contact: '+91 99999 22222',
        email: 'support@aquaflow.com',
        rating: 4.5,
        status: 'active',
        servicesProvided: ['Bulk Water Solutions', 'Pipe Repair'],
        ownerType: 'super_admin',
        vendorType: 'platform',
    },
]

export const mockVendorCommissions = [
    {
        id: 'comm-001',
        vendorName: 'Mega Power Solutions',
        societyName: 'Royal Residency',
        commissionPercent: 10,
        dealValue: 50000,
        payableAmount: 5000,
        status: 'Paid',
        date: '2024-12-01',
    },
    {
        id: 'comm-002',
        vendorName: 'AquaFlow Services',
        societyName: 'Green Valley',
        commissionPercent: 8,
        dealValue: 30000,
        payableAmount: 2400,
        status: 'Pending',
        date: '2024-12-15',
    },
]
