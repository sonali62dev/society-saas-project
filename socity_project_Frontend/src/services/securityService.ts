import api from '@/lib/api';

const SecurityService = {
  // Incidents
  getAllIncidents: async (filters?: any) => {
    const response = await api.get('/incidents', { params: filters });
    return response.data.data;
  },

  createIncident: async (data: any) => {
    const response = await api.post('/incidents', data);
    return response.data.data;
  },

  updateIncidentStatus: async (id: number, status: string, assignedToId?: number) => {
    const response = await api.patch(`/incidents/${id}/status`, { status, assignedToId });
    return response.data.data;
  },

  getIncidentStats: async () => {
    const response = await api.get('/incidents/stats');
    return response.data.data;
  },

  // Patrol Logs
  getAllPatrolLogs: async (status?: string) => {
    const response = await api.get('/patrolling', { params: { status } });
    return response.data.data;
  },

  createPatrolLog: async (data: any) => {
    const response = await api.post('/patrolling', data);
    return response.data.data;
  }
};

export default SecurityService;
