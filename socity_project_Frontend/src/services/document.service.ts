import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const DocumentService = {
  getAll: async (category?: string) => {
    const url = category
      ? `${API_CONFIG.DOCUMENT.LIST}?category=${category}`
      : API_CONFIG.DOCUMENT.LIST;
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.DOCUMENT.GET(id));
    return response.data;
  },

  create: async (data: {
    title: string;
    category: string;
    file: string;
    visibility: string;
  }) => {
    const response = await api.post(API_CONFIG.DOCUMENT.CREATE, data);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.DOCUMENT.DELETE(id));
    return response.data;
  },
};
