import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const FacilityRequestService = {
    getAll: async (params?: {
        status?: string;
        category?: string;
        search?: string;
    }) => {
        let url = API_CONFIG.FACILITY_REQUEST.LIST;
        const queryParams: string[] = [];

        if (params?.status && params.status !== 'all') {
            queryParams.push(`status=${params.status}`);
        }
        if (params?.category && params.category !== 'all') {
            queryParams.push(`category=${params.category}`);
        }
        if (params?.search) {
            queryParams.push(`search=${params.search}`);
        }

        if (queryParams.length) url += `?${queryParams.join('&')}`;

        const response = await api.get(url);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get(API_CONFIG.FACILITY_REQUEST.STATS);
        return response.data;
    },

    create: async (data: {
        title: string;
        description: string;
        category: string;
    }) => {
        const response = await api.post(API_CONFIG.FACILITY_REQUEST.CREATE, data);
        return response.data;
    },

    updateStatus: async (id: number | string, status: string, adminNotes?: string) => {
        const response = await api.patch(API_CONFIG.FACILITY_REQUEST.UPDATE_STATUS(id), { status, adminNotes });
        return response.data;
    },

    vote: async (id: number | string, type: 'UP' | 'DOWN') => {
        const response = await api.post(API_CONFIG.FACILITY_REQUEST.VOTE(id), { type });
        return response.data;
    },
};
