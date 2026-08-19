import api from '@/lib/api'

export const ParkingPaymentService = {
  // List all payments
  getPayments: async (params?: any) => {
    const response = await api.get('/parking/payments', { params })
    return response.data
  },

  // Record a payment (update)
  recordPayment: async (id: number, data: any) => {
    const response = await api.post(`/parking/payments/${id}/record`, data)
    return response.data
  },

  // Create a payment (new)
  createPayment: async (data: any) => {
    const response = await api.post('/parking/payments', data)
    return response.data
  },

  // Generate monthly payments
  generateMonthlyPayments: async (data: { societyId: number; month: number; year: number }) => {
    const response = await api.post('/parking/payments/generate', data)
    return response.data
  }
}
