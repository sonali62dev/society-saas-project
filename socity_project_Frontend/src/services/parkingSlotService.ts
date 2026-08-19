import api from '@/lib/api';

export interface ParkingSlot {
  id: number;
  number: string;
  type: string;
  status: string;
  block?: string;
  floor?: string;
  monthlyCharge: number;
  societyId: number;
  allocatedToUnitId?: number;
  vehicleNumber?: string;
  unit?: {
    id: number;
    block: string;
    number: string;
    owner?: { name: string };
    tenant?: { name: string };
  };
}

const ParkingSlotService = {
  getAllSlots: async (filters?: any) => {
    const response = await api.get('/parking/slots', { params: filters });
    return response.data.data;
  },

  getStats: async () => {
    const response = await api.get('/parking/stats');
    return response.data.data;
  },

  createSlot: async (data: any) => {
    const response = await api.post('/parking/slots', data);
    return response.data.data;
  },

  assignSlot: async (id: number, data: { unitId: number; vehicleNumber: string }) => {
    const response = await api.patch(`/parking/slots/${id}/assign`, data);
    return response.data.data;
  },

  unassignSlot: async (id: number) => {
    const response = await api.patch(`/parking/slots/${id}/unassign`);
    return response.data.data;
  },

  updateSlot: async (id: number, data: any) => {
      const response = await api.patch(`/parking/slots/${id}`, data);
      return response.data.data;
  },

  deleteSlot: async (id: number) => {
    const response = await api.delete(`/parking/slots/${id}`);
    return response.data;
  }
};

export default ParkingSlotService;
