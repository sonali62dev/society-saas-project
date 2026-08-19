import api from '@/lib/api';

export const VisitorService = {
  getAll: async (filters: { status?: string, search?: string, date?: string, block?: string } = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.date) params.append('date', filters.date);
    if (filters.block) params.append('block', filters.block);
    
    const response = await api.get(`/visitors?${params.toString()}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/visitors/stats');
    return response.data;
  },

  checkIn: async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
      }
    });

    const response = await api.post('/visitors/check-in', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  preApprove: async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
         formData.append(key, data[key]);
      }
    });

    const response = await api.post('/visitors/pre-approve', formData, {
       headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  checkOut: async (id: number) => {
    const response = await api.patch(`/visitors/${id}/check-out`);
    return response.data;
  }
};
