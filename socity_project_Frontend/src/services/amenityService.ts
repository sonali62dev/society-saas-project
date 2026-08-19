import api from '@/lib/api'

export interface Amenity {
  id: number
  name: string
  type: string
  description: string
  capacity: number
  chargesPerHour: number
  availableDays: string
  timings: any
  status: string
  societyId: number
}

export interface AmenityBooking {
  id: number
  amenityId: number
  userId: number
  startTime: string
  endTime: string
  purpose: string
  amountPaid: number
  status: string
  amenity: Amenity
  user: {
    id: number
    name: string
    email: string
  }
}

const AmenityService = {
  // Amenities
  getAll: async () => {
    const response = await api.get('/amenities')
    return response.data
  },

  create: async (data: Partial<Amenity>) => {
    const response = await api.post('/amenities', data)
    return response.data
  },

  update: async (id: number, data: Partial<Amenity>) => {
    const response = await api.patch(`/amenities/${id}`, data)
    return response.data
  },

  delete: async (id: number) => {
    const response = await api.delete(`/amenities/${id}`)
    return response.data
  },

  // Bookings
  getAllBookings: async () => {
    const response = await api.get('/amenities/bookings/all')
    return response.data
  },

  createBooking: async (data: any) => {
    const response = await api.post('/amenities/bookings', data)
    return response.data
  },

  updateBookingStatus: async (id: number, status: string) => {
    const response = await api.patch(`/amenities/bookings/${id}`, { status })
    return response.data
  }
}

export default AmenityService
