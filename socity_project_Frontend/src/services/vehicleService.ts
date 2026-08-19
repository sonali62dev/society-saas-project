import api from '@/lib/api'

export interface Vehicle {
  id: number
  number: string
  type: string
  make: string
  color: string | null
  unitId: number
  unit: {
    id: number
    block: string
    number: string
  }
  ownerName: string | null
  parkingSlot: string | null
  status: string
  createdAt: string
}

export interface VehicleStats {
  total: number
  cars: number
  twoWheelers: number
  verified: number
}

const VehicleService = {
  getAll: async (params?: { type?: string; status?: string; search?: string }) => {
    const response = await api.get('/vehicles', { params })
    return response.data.data
  },

  getStats: async () => {
    const response = await api.get('/vehicles/stats')
    return response.data.data
  },

  register: async (data: {
    vehicleNumber: string
    vehicleType: string
    make: string
    color: string
    unitId: number
    parkingSlot: string
    ownerName: string
  }) => {
    const response = await api.post('/vehicles/register', data)
    return response.data.data
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/vehicles/${id}/status`, { status })
    return response.data.data
  },

  remove: async (id: number) => {
    const response = await api.delete(`/vehicles/${id}`)
    return response.data
  }
}

export default VehicleService
