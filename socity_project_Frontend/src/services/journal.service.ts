import api from '@/lib/api';

export const JournalService = {
  // List all journal entries
  getAll: async () => {
    const response = await api.get('/journal');
    return response.data;
  },

  // Create a new journal entry
  create: async (data: {
    date: string;
    narration: string;
    lines: { accountId: string; debit: number; credit: number }[];
  }) => {
    const response = await api.post('/journal', data);
    return response.data;
  }
};
