import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const AssetService = {
  getAll: async () => {
    const response = await api.get(API_CONFIG.ASSET.LIST);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get(API_CONFIG.ASSET.STATS);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.ASSET.GET(id));
    return response.data;
  },

  create: async (data: {
    name: string;
    category: string;
    value: number;
    purchaseDate: string;
    status?: string;
  }) => {
    const response = await api.post(API_CONFIG.ASSET.CREATE, data);
    return response.data;
  },

  update: async (id: number | string, data: any) => {
    const response = await api.patch(API_CONFIG.ASSET.UPDATE(id), data);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.ASSET.DELETE(id));
    return response.data;
  },
};
