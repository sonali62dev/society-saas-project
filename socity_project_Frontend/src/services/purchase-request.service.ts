import { apiClient } from '@/lib/api';
import { API_URL } from '@/config/api.config';

export const PurchaseRequestService = {
  // Get all purchase requests for the current user's society
  getAll: async () => {
    return apiClient.get(`${API_URL}/purchase-requests`);
  },

  // Get a single purchase request by ID
  getById: async (id: number) => {
    return apiClient.get(`${API_URL}/purchase-requests/${id}`);
  },

  // Create a new purchase request
  create: async (data: { title: string; description?: string; amount: number }) => {
    return apiClient.post(`${API_URL}/purchase-requests`, data);
  },

  // Update an existing purchase request
  update: async (id: number, data: Partial<{ title: string; description: string; amount: number; status: string }>) => {
    return apiClient.patch(`${API_URL}/purchase-requests/${id}`, data);
  },

  // Delete a purchase request
  delete: async (id: number) => {
    return apiClient.delete(`${API_URL}/purchase-requests/${id}`);
  },
};
