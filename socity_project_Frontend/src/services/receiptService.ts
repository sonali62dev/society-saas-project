import api from '@/lib/api';

export const ReceiptService = {
  getAll: async (type?: string, status?: string, search?: string) => {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);

    const response = await api.get(`/receipts?${params.toString()}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/receipts', data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/receipts/stats');
    return response.data;
  },

  updateQC: async (id: number, status: string) => {
    const response = await api.patch(`/receipts/${id}/qc`, { status });
    return response.data;
  }
};
