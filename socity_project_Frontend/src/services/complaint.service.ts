import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const ComplaintService = {
  getAll: async (params?: {
    status?: string;
    category?: string;
    search?: string;
    priority?: string;
    page?: number;
    limit?: number;
  }) => {
    let url = API_CONFIG.COMPLAINT.LIST;
    const queryParams: string[] = [];

    if (params?.status && params.status !== 'all') {
      queryParams.push(`status=${params.status.toUpperCase()}`);
    }
    if (params?.category && params.category !== 'all') {
      queryParams.push(`category=${params.category}`);
    }
    if (params?.search) {
      queryParams.push(`search=${params.search}`);
    }
    if (params?.priority && params.priority !== 'all') {
      queryParams.push(`priority=${params.priority.toUpperCase()}`);
    }
    if (params?.page) {
      queryParams.push(`page=${params.page}`);
    }
    if (params?.limit) {
      queryParams.push(`limit=${params.limit}`);
    }

    if (queryParams.length) url += `?${queryParams.join('&')}`;

    const response = await api.get(url);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.COMPLAINT.GET(id));
    return response.data;
  },

  create: async (data: {
    title: string;
    description: string;
    category: string;
    priority: string;
    location?: string;
    images?: string[];
  }) => {
    const response = await api.post(API_CONFIG.COMPLAINT.CREATE, data);
    return response.data;
  },

  createAgainstVendor: async (data: {
    vendorId: number | string;
    title: string;
    description: string;
    category: string;
    priority?: string;
    isPrivate?: boolean;
    images?: string[];
  }) => {
    const response = await api.post(API_CONFIG.COMPLAINT.CREATE_AGAINST_VENDOR, data);
    return response.data;
  },

  updateStatus: async (id: number | string, status: string) => {
    const response = await api.patch(API_CONFIG.COMPLAINT.UPDATE_STATUS(id), { status });
    return response.data;
  },

  assign: async (id: number | string, assignedTo: string) => {
    const response = await api.patch(API_CONFIG.COMPLAINT.ASSIGN(id), { assignedTo });
    return response.data;
  },

  addComment: async (id: number | string, message: string) => {
    const response = await api.post(API_CONFIG.COMPLAINT.ADD_COMMENT(id), { message });
    return response.data;
  },

  resolve: async (id: number | string) => {
    const response = await api.patch(API_CONFIG.COMPLAINT.UPDATE_STATUS(id), {
      status: 'RESOLVED'
    });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get(API_CONFIG.COMPLAINT.STATS);
    return response.data;
  },
};
