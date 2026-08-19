import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const VehicleService = {
  getAll: async () => {
    const response = await api.get(API_CONFIG.VEHICLE.LIST);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get(API_CONFIG.VEHICLE.STATS);
    return response.data;
  },

  register: async (data: {
    slotId: number;
    vehicleNumber: string;
    vehicleType: string;
    ownerName?: string;
  }) => {
    const response = await api.post(API_CONFIG.VEHICLE.REGISTER, data);
    return response.data;
  },

  remove: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.VEHICLE.REMOVE(id));
    return response.data;
  },
  
  search: async (number: string) => {
    const response = await api.get(`${API_CONFIG.VEHICLE.SEARCH}?number=${number}`);
    return response.data;
  },
};
