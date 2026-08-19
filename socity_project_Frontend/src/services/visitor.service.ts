import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const VisitorService = {
  getAll: async (params?: { search?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_CONFIG.VISITOR.LIST}?${queryString}`
      : API_CONFIG.VISITOR.LIST;

    const response = await api.get(url);
    return response.data;
  },

  getLogs: async () => {
    const response = await api.get(API_CONFIG.VISITOR.LOGS);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.VISITOR.GET(id));
    return response.data;
  },

  create: async (data: {
    name: string;
    phone: string;
    vehicleNo?: string;
    purpose: string;
    visitingUnitId: number;
    idType?: string;
    idNumber?: string;
  }) => {
    const response = await api.post(API_CONFIG.VISITOR.CREATE, data);
    return response.data;
  },

  checkIn: async (formData: FormData) => {
    const response = await api.post('/visitors/check-in', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateStatus: async (id: number | string, status: string) => {
    const response = await api.patch(API_CONFIG.VISITOR.UPDATE_STATUS(id), { status });
    return response.data;
  },
};
