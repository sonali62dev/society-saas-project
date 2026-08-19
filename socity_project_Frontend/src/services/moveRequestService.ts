import api from '@/lib/api';

export const MoveRequestService = {
  // Get all move requests
  getAll: async (params?: { type?: string; status?: string; search?: string }) => {
    const response = await api.get('/move-requests', { params });
    return response.data;
  },

  // Create new move request
  create: async (data: any) => {
    const response = await api.post('/move-requests', data);
    return response.data;
  },

  // Update move request
  update: async (id: number, data: any) => {
    const response = await api.patch(`/move-requests/${id}`, data);
    return response.data;
  },

  // Update status
  updateStatus: async (id: number, data: { status?: string; nocStatus?: string; depositStatus?: string; checklistItems?: any }) => {
    const response = await api.patch(`/move-requests/${id}/status`, data);
    return response.data;
  },

  // Delete move request
  delete: async (id: number) => {
    const response = await api.delete(`/move-requests/${id}`);
    return response.data;
  },
};
