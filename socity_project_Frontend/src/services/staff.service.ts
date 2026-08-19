import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const StaffService = {
  getAll: async (type?: 'guard' | 'maid') => {
    const url = type
      ? `${API_CONFIG.STAFF.LIST}?type=${type}`
      : API_CONFIG.STAFF.LIST;
    const response = await api.get(url);
    return response.data.data;
  },

  getGuards: async () => {
    const response = await api.get(API_CONFIG.STAFF.GUARDS);
    return response.data;
  },

  getMaids: async () => {
    const response = await api.get(API_CONFIG.STAFF.MAIDS);
    return response.data;
  },

  create: async (data: {
    name: string;
    email: string;
    phone: string;
    role: 'GUARD' | 'MAID';
    password?: string;
  }) => {
    const response = await api.post(API_CONFIG.STAFF.CREATE, data);
    return response.data;
  },

  updateStatus: async (id: number | string, status: string) => {
    const response = await api.patch(API_CONFIG.STAFF.UPDATE_STATUS(id), { status });
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.STAFF.DELETE(id));
    return response.data;
  },
};
