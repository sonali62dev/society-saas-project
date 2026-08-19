import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const ParcelService = {
  getAll: async (status?: string) => {
    const url = status 
      ? `${API_CONFIG.PARCEL.LIST}?status=${status}` 
      : API_CONFIG.PARCEL.LIST;
    const response = await api.get(url);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.PARCEL.GET(id));
    return response.data;
  },

  create: async (data: {
    unitId: number;
    courierName: string;
    trackingNumber?: string;
    description?: string;
    receivedBy?: string;
  }) => {
    const response = await api.post(API_CONFIG.PARCEL.CREATE, data);
    return response.data;
  },

  updateStatus: async (id: number | string, status: string, collectedBy?: string) => {
    const response = await api.patch(API_CONFIG.PARCEL.UPDATE_STATUS(id), { 
      status, 
      collectedBy,
      collectedAt: new Date().toISOString()
    });
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.PARCEL.DELETE(id));
    return response.data;
  },
};
