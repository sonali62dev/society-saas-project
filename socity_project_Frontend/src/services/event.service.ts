import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const EventService = {
  getAll: async () => {
    const response = await api.get(API_CONFIG.EVENT.LIST);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.EVENT.GET(id));
    return response.data;
  },

  create: async (data: {
    title: string;
    description?: string;
    date: string;
    time?: string;
    location?: string;
    category?: string;
    maxAttendees?: number;
    organizer?: string;
  }) => {
    const response = await api.post(API_CONFIG.EVENT.CREATE, data);
    return response.data;
  },

  update: async (id: number | string, data: any) => {
    const response = await api.patch(API_CONFIG.EVENT.UPDATE(id), data);
    return response.data;
  },

  rsvp: async (eventId: number | string, status: string) => {
    const response = await api.post(API_CONFIG.EVENT.RSVP(eventId), { status });
    return response.data;
  },

  getAttendees: async (id: number | string) => {
    const response = await api.get(API_CONFIG.EVENT.GET_ATTENDEES(id));
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.EVENT.DELETE(id));
    return response.data;
  },
};
