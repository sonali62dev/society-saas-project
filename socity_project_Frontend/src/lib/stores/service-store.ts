import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { VendorLead, LeadStatus, ServiceInquiry } from '@/types/services'
import { mockVendorLeads, mockServiceInquiries } from '@/lib/mocks/services'

import { ServiceCategory } from '@/types/services'

interface ServiceState {
    leads: VendorLead[]
    inquiries: ServiceInquiry[]
    categories: ServiceCategory[]
    updateLeadStatus: (leadId: string, status: LeadStatus) => void
    deleteLead: (leadId: string) => void
    addLead: (lead: VendorLead) => void
    addInquiry: (inquiry: ServiceInquiry) => void
    assignVendorToInquiry: (inquiryId: string, vendorId: string, vendorName: string) => void
    updateInquiryStatus: (inquiryId: string, status: 'pending' | 'booked' | 'done') => void
    markInquiryCompleted: (inquiryId: string) => void
    addCategory: (category: ServiceCategory) => void
    updateCategory: (category: ServiceCategory) => void
    deleteCategory: (categoryId: string) => void
}

const initialCategories: ServiceCategory[] = [
    {
        id: 'internet',
        name: 'High-Speed Internet',
        icon: 'Wifi',
        description: 'Fiber optic & broadband connections',
        color: 'blue',
        providers: [
            { name: 'Jio Fiber', rating: 4.5, reviews: 128, price: 'Rs. 699/month', image: 'JF' },
            { name: 'Airtel Xstream', rating: 4.3, reviews: 95, price: 'Rs. 799/month', image: 'AX' },
            { name: 'ACT Fibernet', rating: 4.4, reviews: 112, price: 'Rs. 749/month', image: 'AF' },
        ],
    },
    {
        id: 'pest',
        name: 'Pest Control',
        icon: 'Bug',
        description: 'Cockroaches, Termite, Rat, Bedbugs',
        color: 'green',
        providers: [
            { name: 'PestFree Services', rating: 4.7, reviews: 234, price: 'Rs. 1,500', image: 'PF' },
            { name: 'HygieneFirst', rating: 4.5, reviews: 189, price: 'Rs. 1,200', image: 'HF' },
            { name: 'BugBusters', rating: 4.3, reviews: 156, price: 'Rs. 1,800', image: 'BB' },
        ],
    },
    {
        id: 'cleaning',
        name: 'Cleaning Services',
        icon: 'Sparkles',
        description: 'Deep cleaning, regular cleaning, sanitization',
        color: 'cyan',
        providers: [
            { name: 'CleanPro', rating: 4.6, reviews: 312, price: 'Rs. 2,000', image: 'CP' },
            { name: 'SparkleHome', rating: 4.4, reviews: 245, price: 'Rs. 1,800', image: 'SH' },
            { name: 'Urban Clap Clean', rating: 4.5, reviews: 423, price: 'Rs. 2,500', image: 'UC' },
        ],
    },
    {
        id: 'carpenter',
        name: 'Carpenter',
        icon: 'Wrench',
        description: 'Furniture repair, assembly, custom work',
        color: 'orange',
        providers: [
            { name: 'WoodMaster', rating: 4.4, reviews: 178, price: 'Rs. 500/hr', image: 'WM' },
            { name: 'FixIt Carpenters', rating: 4.2, reviews: 134, price: 'Rs. 400/hr', image: 'FC' },
            { name: 'HomeWood Services', rating: 4.5, reviews: 201, price: 'Rs. 450/hr', image: 'HW' },
        ],
    },
    {
        id: 'water_pump',
        name: 'Water Pump Controller',
        icon: 'Zap',
        description: 'Automatic pump controllers & installation',
        color: 'purple',
        providers: [
            { name: 'AquaSmart', rating: 4.6, reviews: 89, price: 'Rs. 3,500', image: 'AS' },
            { name: 'PumpTech', rating: 4.3, reviews: 67, price: 'Rs. 2,800', image: 'PT' },
            { name: 'WaterWise', rating: 4.5, reviews: 112, price: 'Rs. 4,000', image: 'WW' },
        ],
    },
    {
        id: 'tank_cleaning',
        name: 'Water Tank Cleaning',
        icon: 'Droplets',
        description: 'Tank cleaning & sanitization',
        color: 'teal',
        providers: [
            { name: 'TankClean Pro', rating: 4.7, reviews: 156, price: 'Rs. 2,500', image: 'TC' },
            { name: 'AquaPure', rating: 4.5, reviews: 134, price: 'Rs. 2,000', image: 'AP' },
            { name: 'CleanWater Services', rating: 4.4, reviews: 98, price: 'Rs. 2,200', image: 'CW' },
        ],
    },
    {
        id: 'interior',
        name: 'Interior Design',
        icon: 'Paintbrush',
        description: 'Home & society interior solutions',
        color: 'pink',
        providers: [
            { name: 'DesignHub', rating: 4.8, reviews: 89, price: 'Consultation Free', image: 'DH' },
            { name: 'HomeMakeover', rating: 4.6, reviews: 67, price: 'Rs. 500/sqft', image: 'HM' },
            { name: 'InteriorFirst', rating: 4.5, reviews: 78, price: 'Rs. 400/sqft', image: 'IF' },
        ],
    },
    {
        id: 'cctv',
        name: 'CCTV Installation',
        icon: 'Camera',
        description: 'Security cameras & surveillance systems',
        color: 'red',
        providers: [
            { name: 'SecureView', rating: 4.7, reviews: 234, price: 'Rs. 15,000', image: 'SV' },
            { name: 'EyeWatch', rating: 4.5, reviews: 189, price: 'Rs. 12,000', image: 'EW' },
            { name: 'SafeHome CCTV', rating: 4.6, reviews: 156, price: 'Rs. 18,000', image: 'SC' },
        ],
    },
    {
        id: 'smart_locks',
        name: 'Smart Door Locks',
        icon: 'Lock',
        description: 'IOT enabled smart locks & access control',
        color: 'indigo',
        providers: [
            { name: 'SmartLock Pro', rating: 4.6, reviews: 123, price: 'Rs. 8,000', image: 'SL' },
            { name: 'SecureEntry', rating: 4.4, reviews: 98, price: 'Rs. 6,500', image: 'SE' },
            { name: 'IOT Locks India', rating: 4.5, reviews: 87, price: 'Rs. 9,500', image: 'IL' },
        ],
    },
]

export const useServiceStore = create<ServiceState>()(
    persist(
        (set) => ({
            leads: mockVendorLeads,
            inquiries: mockServiceInquiries,
            categories: initialCategories,
            updateLeadStatus: (leadId, status) =>
                set((state) => ({
                    leads: state.leads.map((l) => l.id === leadId ? { ...l, status } : l)
                })),
            deleteLead: (leadId) =>
                set((state) => ({
                    leads: state.leads.filter((l) => l.id !== leadId)
                })),
            addLead: (lead) =>
                set((state) => ({
                    leads: [lead, ...state.leads]
                })),
            addInquiry: (inquiry) =>
                set((state) => ({
                    inquiries: [inquiry, ...state.inquiries]
                })),
            assignVendorToInquiry: (inquiryId, vendorId, vendorName) =>
                set((state) => ({
                    inquiries: state.inquiries.map((inq) =>
                        inq.id === inquiryId ? { ...inq, vendorId, vendorName, status: 'booked' } : inq
                    )
                })),
            updateInquiryStatus: (inquiryId, status) =>
                set((state) => ({
                    inquiries: state.inquiries.map((inq) =>
                        inq.id === inquiryId ? { ...inq, status } : inq
                    )
                })),
            markInquiryCompleted: (inquiryId) =>
                set((state) => ({
                    inquiries: state.inquiries.map((inq) =>
                        inq.id === inquiryId ? { ...inq, status: 'completed' } : inq
                    )
                })),
            addCategory: (category) =>
                set((state) => ({
                    categories: [...state.categories, category]
                })),
            updateCategory: (category) =>
                set((state) => ({
                    categories: state.categories.map((c) => c.id === category.id ? category : c)
                })),
            deleteCategory: (categoryId) =>
                set((state) => ({
                    categories: state.categories.filter((c) => c.id !== categoryId)
                })),
        }),
        {
            name: 'service-storage-v3',
        }
    )
)
