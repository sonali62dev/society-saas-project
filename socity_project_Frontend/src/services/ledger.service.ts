import api from '@/lib/api';

export const LedgerService = {
  getStats: async () => {
    const response = await api.get('/ledger/stats');
    return response.data;
  },

  createAccount: async (data: { name: string; code: string; type: string }) => {
    const response = await api.post('/ledger/accounts', data);
    return response.data;
  }
};
