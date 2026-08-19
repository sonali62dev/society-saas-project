import api from '@/lib/api';

export const PurchaseRequestService = {
  getAll: async (status?: string, priority?: string, search?: string) => {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (priority && priority !== 'all') params.append('priority', priority);
    if (search) params.append('search', search);

    const response = await api.get(`/purchase-requests?${params.toString()}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/purchase-requests', data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/purchase-requests/stats');
    return response.data;
  },

  updateStatus: async (id: number, status: string, remarks?: string) => {
    const response = await api.patch(`/purchase-requests/${id}/status`, { status, remarks });
    return response.data;
  }
};
