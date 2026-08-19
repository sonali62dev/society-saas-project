import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const NoticeService = {
  getAll: async () => {
    const response = await api.get(API_CONFIG.NOTICE.LIST);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.NOTICE.GET(id));
    return response.data;
  },

  create: async (data: {
    title: string;
    content: string;
    audience: 'ALL' | 'OWNERS' | 'TENANTS';
    expiresAt?: string;
  }) => {
    const response = await api.post(API_CONFIG.NOTICE.CREATE, data);
    return response.data;
  },

  update: async (id: number | string, data: any) => {
    const response = await api.patch(API_CONFIG.NOTICE.UPDATE(id), data);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.NOTICE.DELETE(id));
    return response.data;
  },

  trackView: async (id: number | string) => {
    const response = await api.post(`${API_CONFIG.NOTICE.LIST}/${id}/view`);
    return response.data;
  },

  getViewers: async (id: number | string) => {
    const response = await api.get(`${API_CONFIG.NOTICE.LIST}/${id}/viewers`);
    return response.data;
  },
};
