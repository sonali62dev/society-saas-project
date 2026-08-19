import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const TransactionService = {
  getAll: async () => {
    const response = await api.get(API_CONFIG.TRANSACTION.LIST);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get(API_CONFIG.TRANSACTION.STATS);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.TRANSACTION.GET(id));
    return response.data;
  },

  create: async (data: {
    type: 'INCOME' | 'EXPENSE';
    category: string;
    amount: number;
    date: string;
    description?: string;
    paymentMethod: string;
    status: string;
    invoiceNo?: string;
    paidTo?: string;
    receivedFrom?: string;
  }) => {
    const endpoint = data.type === 'INCOME' ? '/transactions/income' : '/transactions/expense';
    const response = await api.post(endpoint, data);
    return response.data;
  },

  update: async (id: number | string, data: any) => {
    const response = await api.patch(API_CONFIG.TRANSACTION.UPDATE(id), data);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.TRANSACTION.DELETE(id));
    return response.data;
  },
};
