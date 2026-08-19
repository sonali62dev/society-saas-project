import api from '@/lib/api';

export interface BankAccount {
  id: number;
  name: string;
  code: string;
  type: string;
  balance: number;
  bankDetails: {
      ifsc: string;
      accountNo: string;
      branch: string;
  };
}

export interface BankTransaction {
    id: number;
    amount: number;
    type: string;
    description: string;
    date: string;
    paymentMethod: string;
    bankAccount: {
        name: string;
    };
    invoiceNo?: string;
    status: string;
}

const bankService = {
  getBanks: async () => {
    const response = await api.get('/banks');
    return response.data;
  },

  createBank: async (data: any) => {
    const response = await api.post('/banks', data);
    return response.data;
  },

  getTransactions: async (bankId?: string) => {
      const response = await api.get('/banks/transactions', {
          params: { bankId }
      });
      return response.data;
  }
};

export default bankService;
