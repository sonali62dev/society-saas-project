import api from '../lib/api';
import { API_CONFIG } from '../config/api.config';

export const SocietyService = {
    getAllList: async () => {
        const response = await api.get(API_CONFIG.SOCIETY.ALL);
        return response.data;
    },
    list: async () => {
        const response = await api.get(API_CONFIG.SOCIETY.LIST);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post(API_CONFIG.SOCIETY.CREATE, data);
        return response.data;
    },
    update: async (id: number | string, data: any) => {
        const response = await api.put(API_CONFIG.SOCIETY.UPDATE(id), data);
        return response.data;
    },
    delete: async (id: number | string) => {
        const response = await api.delete(API_CONFIG.SOCIETY.DELETE(id));
        return response.data;
    },
    getById: async (id: number | string) => {
        const response = await api.get(API_CONFIG.SOCIETY.GET(id));
        return response.data;
    },

    // Guidelines Management
    getGuidelines: async (societyId?: number) => {
        const params = societyId ? { societyId } : {};
        const response = await api.get('/society/guidelines', { params });
        return response.data;
    },
    getGuidelinesForMe: async () => {
        const response = await api.get('/society/guidelines/for-me');
        return response.data || [];
    },
    createGuideline: async (data: { societyId?: number | null; title: string; content: string; category: string; targetAudience?: string }) => {
        const response = await api.post('/society/guidelines', data);
        return response.data;
    },
    updateGuideline: async (id: number, data: { title: string; content: string; category: string }) => {
        const response = await api.put(`/society/guidelines/${id}`, data);
        return response.data;
    },
    deleteGuideline: async (id: number) => {
        const response = await api.delete(`/society/guidelines/${id}`);
        return response.data;
    },
};
