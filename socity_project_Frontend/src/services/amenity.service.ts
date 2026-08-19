import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const AmenityService = {
  getAll: async () => {
    const response = await api.get(API_CONFIG.AMENITY.LIST);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.AMENITY.GET(id));
    return response.data;
  },

  create: async (data: {
    name: string;
    type: string;
    description?: string;
    capacity: number;
    chargesPerHour: number;
    availableDays: string[];
    timings: { start: string; end: string };
    status: string;
  }) => {
    const response = await api.post(API_CONFIG.AMENITY.CREATE, data);
    return response.data;
  },

  update: async (id: number | string, data: any) => {
    const response = await api.patch(API_CONFIG.AMENITY.UPDATE(id), data);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.AMENITY.DELETE(id));
    return response.data;
  },

  // Bookings
  getBookings: async () => {
    const response = await api.get(API_CONFIG.AMENITY.BOOKINGS);
    return response.data;
  },

  book: async (data: {
    amenityId: number;
    startTime: string;
    endTime: string;
  }) => {
    const response = await api.post(API_CONFIG.AMENITY.BOOK, data);
    return response.data;
  },

  updateBookingStatus: async (id: number | string, status: string) => {
    const response = await api.patch(API_CONFIG.AMENITY.UPDATE_BOOKING(id), { status });
    return response.data;
  },
};
