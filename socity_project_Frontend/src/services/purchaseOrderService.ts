import api from '@/lib/api';

export const PurchaseOrderService = {
  getAll: async (status?: string, period?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (period && period !== 'current') params.append('period', period);
    if (search) params.append('search', search);

    const response = await api.get(`/purchase-orders?${params.toString()}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/purchase-orders', data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/purchase-orders/stats');
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/purchase-orders/${id}/status`, { status });
    return response.data;
  }
};
