import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const GuardService = {
    getStats: async () => {
        const response = await api.get(API_CONFIG.GUARD.STATS);
        return response.data;
    },

    getActivity: async () => {
        const response = await api.get(API_CONFIG.GUARD.ACTIVITY);
        return response.data;
    },

    updateVisitorStatus: async (id: number, status: string) => {
        const response = await api.patch(API_CONFIG.VISITOR.UPDATE_STATUS(id), { status });
        return response.data;
    },

    checkInVisitor: async (data: any) => {
        const response = await api.post(API_CONFIG.VISITOR.CREATE, data); // Or a specific check-in endpoint if available
        return response.data;
    },

    checkOutVisitor: async (id: number) => {
        const response = await api.patch(`/visitors/${id}/check-out`); // Not in API_CONFIG yet
        return response.data;
    },

    reportIncident: async (data: any) => {
        const response = await api.post('/incidents', data); // Not in API_CONFIG yet
        return response.data;
    },

    createEmergencyAlert: async (data: { type: string, description: string, unit?: string }) => {
        const response = await api.post(API_CONFIG.EMERGENCY.CREATE_ALERT, data);
        return response.data;
    }
};
