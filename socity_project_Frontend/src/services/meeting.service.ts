import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const MeetingService = {
  getAll: async () => {
    const response = await api.get(API_CONFIG.MEETING.LIST);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.MEETING.GET(id));
    return response.data;
  },

  create: async (data: {
    title: string;
    description?: string;
    date: string;
    time: string;
    location: string;
    attendees?: any[];
  }) => {
    const response = await api.post(API_CONFIG.MEETING.CREATE, data);
    return response.data;
  },

  update: async (id: number | string, data: any) => {
    const response = await api.patch(API_CONFIG.MEETING.UPDATE(id), data);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.MEETING.DELETE(id));
    return response.data;
  },
};
