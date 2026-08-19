import api from '../lib/api';
import { API_CONFIG } from '../config/api.config';

export const AuthService = {
    login: async (credentials: any) => {
        const response = await api.post(API_CONFIG.AUTH.LOGIN, credentials);
        return response.data;
    },
    register: async (userData: any) => {
        const response = await api.post(API_CONFIG.AUTH.REGISTER, userData);
        return response.data;
    },
    getMe: async () => {
        const response = await api.get(API_CONFIG.AUTH.ME);
        return response.data;
    },
    updateProfile: async (data: any) => {
        const response = await api.put(API_CONFIG.AUTH.UPDATE_PROFILE, data);
        return response.data;
    },
    uploadPhoto: async (formData: FormData) => {
        const response = await api.post(API_CONFIG.AUTH.UPLOAD_PHOTO, formData);
        return response.data;
    },
    getAllUsers: async () => {
        const response = await api.get(API_CONFIG.AUTH.ALL_USERS);
        return response.data;
    },
    getStats: async () => {
        const response = await api.get(API_CONFIG.AUTH.STATS);
        return response.data;
    },
    getB2CStats: async () => {
        const response = await api.get(API_CONFIG.AUTH.B2C_STATS);
        return response.data;
    },
    getUserActivity: async (id: number | string) => {
        const response = await api.get(API_CONFIG.AUTH.USER_ACTIVITY(id));
        return response.data;
    },
    deleteUser: async (id: number | string) => {
        const response = await api.delete(API_CONFIG.AUTH.DELETE_USER(id));
        return response.data;
    },
    updateStatus: async (id: number | string, status: string) => {
        const response = await api.patch(API_CONFIG.AUTH.UPDATE_STATUS(id), { status });
        return response.data;
    }
};
