import api from '@/lib/api';

export interface Staff {
  id: number;
  name: string;
  role: string;
  phone: string;
  email?: string;
  shift?: string;
  workingDays?: string;
  gate?: string;
  status: string;
  attendanceStatus?: string;
  checkInTime?: string;
  rating: number;
  photo?: string;
  joiningDate: string;
  address?: string;
  emergencyContact?: string;
  idProof?: string;
  idNumber?: string;
}

export const StaffService = {
  // Get all staff with optional filters
  getAll: async (filters?: { role?: string; status?: string; shift?: string }) => {
    const response = await api.get('/staff', { params: filters });
    return response.data;
  },

  // Create new staff
  create: async (data: Omit<Staff, 'id' | 'rating' | 'joiningDate'>) => {
    const response = await api.post('/staff', data);
    return response.data;
  },

  // Update staff details
  update: async (id: number, data: Partial<Staff>) => {
    const response = await api.patch(`/staff/${id}`, data);
    return response.data;
  },

  // Update staff status (Check-in/Check-out)
  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/staff/${id}/status`, { status });
    return response.data;
  },

  // Delete staff
  delete: async (id: number) => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  }
};
