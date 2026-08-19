import api from '@/lib/api'

export interface Parcel {
  id: number
  unitId: number
  unit?: {
      id: number
      block: string
      number: string
  }
  courierName: string
  trackingNumber: string
  description: string
  status: 'PENDING' | 'COLLECTED' | 'OVERDUE'
  receivedBy: string
  receivedAt: string
  collectedBy?: string
  collectedAt?: string
}

export interface ParcelStats {
  total: number
  pending: number
  delivered: number
  overdue: number
}

const ParcelService = {
  getAll: async (params?: { status?: string, search?: string }) => {
    const response = await api.get('/parcels', { params })
    return response.data.data
  },

  getStats: async () => {
    const response = await api.get('/parcels/stats')
    return response.data.data
  },

  create: async (data: Partial<Parcel>) => {
    const response = await api.post('/parcels', data)
    return response.data.data
  },

  updateStatus: async (id: number, status: string, collectedBy?: string) => {
    const response = await api.patch(`/parcels/${id}/status`, { 
        status, 
        collectedBy,
        collectedAt: new Date().toISOString()
    })
    return response.data.data
  },

  remove: async (id: number) => {
    const response = await api.delete(`/parcels/${id}`)
    return response.data
  }
}

export default ParcelService
