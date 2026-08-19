import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const TenantService = {
    getAll: async () => {
        const response = await api.get(API_CONFIG.TENANT.LIST);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get(API_CONFIG.TENANT.STATS);
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post(API_CONFIG.TENANT.CREATE, data);
        return response.data;
    },

    update: async (id: number | string, data: any) => {
        const response = await api.patch(API_CONFIG.TENANT.UPDATE(id), data);
        return response.data;
    },

    delete: async (id: number | string) => {
        const response = await api.delete(API_CONFIG.TENANT.DELETE(id));
        return response.data;
    }
};
