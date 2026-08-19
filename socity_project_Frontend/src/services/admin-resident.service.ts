import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const AdminResidentService = {
    getResidents: async (params?: { block?: string; search?: string; type?: string }) => {
        const response = await api.get(API_CONFIG.RESIDENT.LIST, { params });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get(API_CONFIG.SOCIETY.ADMIN_STATS);
        return response.data;
    },

    getUnits: async () => {
        const response = await api.get(API_CONFIG.UNIT.LIST);
        return response.data;
    },

    addResident: async (data: {
        name: string;
        email: string;
        phone: string;
        role: string;
        unitId?: string | number;
        status?: string;
        familyMembers?: string;
        password?: string;
        block?: string;
        number?: string;
        floor?: string | number;
        type?: string;
        areaSqFt?: string | number;
    }) => {
        const { familyMembers, password, ...rest } = data;
        const payload: Record<string, unknown> = { ...rest };
        if (familyMembers !== undefined && familyMembers !== '') payload.familyMembers = familyMembers;
        if (password !== undefined && password !== '') payload.password = password;
        const response = await api.post(API_CONFIG.RESIDENT.LIST, payload);
        return response.data;
    },

    deleteResident: async (id: number | string) => {
        const response = await api.delete(API_CONFIG.RESIDENT.DELETE(id));
        return response.data;
    },

    updateResident: async (id: number | string, data: any) => {
        const response = await api.put(API_CONFIG.RESIDENT.UPDATE(id), data);
        return response.data;
    }
};
