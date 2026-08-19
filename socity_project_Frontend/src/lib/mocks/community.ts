import { Guideline, MarketplaceItem, Post } from '@/types/community'

export const mockGuidelines: Guideline[] = [
    {
        id: 'GL-001',
        title: 'Noise Control Policy',
        description: 'Residents are requested to maintain silence between 10 PM and 6 AM. loud music and parties are not allowed during these hours.',
        category: 'society',
        isMandatory: true,
        lastUpdated: '2024-01-10',
    },
    {
        id: 'GL-002',
        title: 'Visitor Entry Rules',
        description: 'All visitors must be approved via the app before entry. Pre-approval is recommended for faster access.',
        category: 'security',
        isMandatory: true,
        lastUpdated: '2023-12-15',
    },
    {
        id: 'GL-003',
        title: 'Swimming Pool Etiquette',
        description: 'Proper swimwear is mandatory. Shower before entering the pool. No food or drinks allowed in the pool area.',
        category: 'amenities',
        isMandatory: false,
        lastUpdated: '2024-02-01',
    },
]

export const mockMarketplaceItems: MarketplaceItem[] = [
    {
        id: 'MKT-001',
        title: 'Wooden Dining Table (4 Seater)',
        description: 'Solid wood dining table in excellent condition. Moving out sale.',
        category: 'furniture',
        condition: 'good',
        price: 15000,
        priceType: 'negotiable',
        owner: {
            id: 'res-001',
            name: 'Amit Sharma',
            ownedUnits: [{ block: 'A', number: '502' }],
        },
        images: [],
        status: 'active',
        createdAt: '2024-03-10T10:00:00Z',
        type: 'sell',
    },
    {
        id: 'MKT-002',
        title: 'Sofa Set 3+2',
        description: 'Comfortable sofa set, bought 2 years ago. Fabric needs minor cleaning.',
        category: 'furniture',
        condition: 'fair',
        price: 8000,
        priceType: 'fixed',
        owner: {
            id: 'res-002',
            name: 'Priya Singh',
            ownedUnits: [{ block: 'B', number: '304' }],
        },
        images: [],
        status: 'active',
        createdAt: '2024-03-12T14:30:00Z',
        type: 'sell',
    },
    {
        id: 'MKT-003',
        title: 'Looking for Bicycle',
        description: 'Looking for a used bicycle for kids (age 8-10).',
        category: 'vehicles',
        condition: 'good',
        price: 3000,
        priceType: 'negotiable',
        owner: {
            id: 'res-003',
            name: 'Rahul Verma',
            ownedUnits: [{ block: 'C', number: '101' }],
        },
        images: [],
        status: 'active',
        createdAt: '2024-03-13T09:15:00Z',
        type: 'buy',
    }
]

export const mockPosts: Post[] = [
    {
        id: 'POST-001',
        author: {
            id: 'admin-001',
            name: 'Society Admin',
            unit: 'Office',
            role: 'admin',
        },
        type: 'announcement',
        title: 'Water Supply Maintenance',
        content: 'Dear Residents, water supply will be interrupted tomorrow from 10 AM to 2 PM due to tank cleaning.',
        likes: 15,
        comments: [],
        createdAt: '2024-03-14T08:00:00Z',
    },
    {
        id: 'POST-002',
        author: {
            id: 'res-005',
            name: 'Sneha Gupta',
            unit: 'D-202',
            role: 'resident',
        },
        type: 'general',
        content: 'Found a set of keys near the park bench. Please contact me if they are yours.',
        likes: 5,
        comments: [
            {
                id: 'c1',
                author: { id: 'res-006', name: 'Vikram' },
                content: 'Is it a Honda key?',
                createdAt: '2024-03-14T09:00:00Z'
            }
        ],
        createdAt: '2024-03-14T08:30:00Z',
    },
]
