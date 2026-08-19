import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface B2CUser {
    id: string
    name: string
    email: string
    phone: string
    registeredAt: string
    activeBarcodes: number
    serviceRequests: number
    status: 'active' | 'suspended'
    password?: string // In a real app, never store plain text passwords. This is for the requested demo "id pass dena he".
}

interface UserState {
    users: B2CUser[]
    addUser: (user: B2CUser) => void
    deleteUser: (id: string) => void
    updateUser: (id: string, data: Partial<B2CUser>) => void
}

const initialUsers: B2CUser[] = [
    {
        id: 'b2c-1',
        name: 'John Individual',
        email: 'john@example.com',
        phone: '+91 98765 43210',
        registeredAt: '2024-01-15',
        activeBarcodes: 3,
        serviceRequests: 5,
        status: 'active',
        password: 'password123'
    },
    {
        id: 'b2c-2',
        name: 'Sarah Smith',
        email: 'sarah@example.com',
        phone: '+91 87654 32109',
        registeredAt: '2024-02-10',
        activeBarcodes: 1,
        serviceRequests: 2,
        status: 'active',
        password: 'password123'
    },
    {
        id: 'b2c-3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+91 76543 21098',
        registeredAt: '2024-03-05',
        activeBarcodes: 2,
        serviceRequests: 0,
        status: 'suspended',
        password: 'password123'
    },
]

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            users: initialUsers,
            addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
            deleteUser: (id) => set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
            updateUser: (id, data) => set((state) => ({
                users: state.users.map((u) => u.id === id ? { ...u, ...data } : u)
            })),
        }),
        {
            name: 'b2c-user-storage',
        }
    )
)
