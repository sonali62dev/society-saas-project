import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const ParkingService = {
  getSlots: async () => {
    const response = await api.get(API_CONFIG.PARKING.SLOTS);
    return response.data;
  },

  getPayments: async () => {
    const response = await api.get(API_CONFIG.PARKING.PAYMENTS);
    return response.data;
  },

  create: async (data: {
    number: string;
    type: string;
    status?: string;
    allocatedToUnitId?: number;
    vehicleNumber?: string;
  }) => {
    const response = await api.post(API_CONFIG.PARKING.CREATE, data);
    return response.data;
  },

  update: async (id: number | string, data: any) => {
    const response = await api.patch(API_CONFIG.PARKING.UPDATE(id), data);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.PARKING.DELETE(id));
    return response.data;
  },
};
