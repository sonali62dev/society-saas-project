import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const UnitService = {
  getUnits: async () => {
    const response = await api.get(API_CONFIG.UNIT.LIST);
    return response.data;
  },
  getUnitById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.UNIT.GET(id));
    return response.data;
  },
  createUnit: async (data: { block: string; number: string; floor?: number; type?: string; areaSqFt?: number }) => {
    const response = await api.post(API_CONFIG.UNIT.CREATE, data);
    return response.data;
  }
};
