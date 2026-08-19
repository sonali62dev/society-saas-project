import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Society {
    id: number | string
    name: string
    city: string
    state: string
    units: number
    users: number
    status: 'active' | 'pending' | 'suspended'
    plan: 'Enterprise' | 'Professional' | 'Basic'
    joinedDate: string
    adminName: string
    adminEmail: string
}

interface SocietyState {
    societies: Society[]
    addSociety: (society: Society) => void
    updateSociety: (society: Society) => void
    deleteSociety: (id: number | string) => void
}

export const useSocietyStore = create<SocietyState>()(
    persist(
        (set) => ({
            societies: [
                {
                    id: 1,
                    name: 'Green Valley Apartments',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    units: 450,
                    users: 1203,
                    status: 'active',
                    plan: 'Enterprise',
                    joinedDate: '2023-06-15',
                    adminName: 'Rajesh Kumar',
                    adminEmail: 'rajesh@greenvalley.com',
                },
                {
                    id: 2,
                    name: 'Sunrise Heights',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    units: 320,
                    users: 856,
                    status: 'active',
                    plan: 'Professional',
                    joinedDate: '2023-08-20',
                    adminName: 'Priya Sharma',
                    adminEmail: 'priya@sunriseheights.com',
                },
                {
                    id: 3,
                    name: 'Palm Gardens',
                    city: 'Chennai',
                    state: 'Tamil Nadu',
                    units: 280,
                    users: 0,
                    status: 'pending',
                    plan: 'Professional',
                    joinedDate: '2024-12-18',
                    adminName: 'Vikram Singh',
                    adminEmail: 'vikram@palmgardens.com',
                },
                {
                    id: 4,
                    name: 'Silver Oaks Society',
                    city: 'Pune',
                    state: 'Maharashtra',
                    units: 190,
                    users: 512,
                    status: 'active',
                    plan: 'Basic',
                    joinedDate: '2023-11-10',
                    adminName: 'Neha Patel',
                    adminEmail: 'neha@silveroaks.com',
                },
                {
                    id: 5,
                    name: 'Lake View Residency',
                    city: 'Hyderabad',
                    state: 'Telangana',
                    units: 380,
                    users: 945,
                    status: 'active',
                    plan: 'Enterprise',
                    joinedDate: '2023-04-05',
                    adminName: 'Arjun Reddy',
                    adminEmail: 'arjun@lakeview.com',
                },
                {
                    id: 6,
                    name: 'Royal Enclave',
                    city: 'Delhi',
                    state: 'Delhi',
                    units: 520,
                    users: 0,
                    status: 'suspended',
                    plan: 'Professional',
                    joinedDate: '2023-02-28',
                    adminName: 'Amit Gupta',
                    adminEmail: 'amit@royalenclave.com',
                },
            ],
            addSociety: (society) =>
                set((state) => ({
                    societies: [...state.societies, society],
                })),
            updateSociety: (society) =>
                set((state) => ({
                    societies: state.societies.map((s) => (s.id === society.id ? society : s)),
                })),
            deleteSociety: (id) =>
                set((state) => ({
                    societies: state.societies.filter((s) => s.id !== id),
                })),
        }),
        {
            name: 'society-storage',
        }
    )
)
