import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export interface InvoiceItem {
  id: number;
  invoiceId: number;
  name: string;
  amount: number;
}

export interface Invoice {
  id: number;
  invoiceNo: string;
  societyId: number;
  unitId: number;
  residentId?: number;
  amount: number;
  maintenance: number;
  utilities: number;
  penalty: number;
  description?: string;
  dueDate: string;
  status: string;
  paidDate?: string;
  paymentMode?: string;
  items?: InvoiceItem[];
  unit?: {
    number: string;
    block: string;
    type: string;
  };
  resident?: {
    name: string;
    phone: string;
  };
}

export const BillingService = {
  getInvoices: async (params?: {
    status?: string;
    block?: string;
    search?: string;
  }) => {
    const response = await api.get(API_CONFIG.BILLING.INVOICES, { params });
    return response.data;
  },

  getMyInvoices: async () => {
    const response = await api.get(API_CONFIG.BILLING.MY_INVOICES);
    return response.data;
  },

  generateInvoices: async (data: {
    month: string;
    dueDate: string;
    block?: string;
    maintenanceAmount: number;
    utilityAmount: number;
    lateFee?: number;
  }) => {
    const response = await api.post(API_CONFIG.BILLING.GENERATE, data);
    return response.data;
  },

  createInvoice: async (data: {
    unitId: string;
    amount: number;
    issueDate: string;
    dueDate: string;
    description: string;
  }) => {
    const response = await api.post(API_CONFIG.BILLING.INVOICES, data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get(API_CONFIG.BILLING.STATS);
    return response.data;
  },

  payInvoice: async (invoiceNo: string, paymentMode: string = 'CASH') => {
    const response = await api.patch(API_CONFIG.BILLING.PAY(invoiceNo), { paymentMode });
    return response.data;
  },

  getDefaulters: async (params?: { block?: string; search?: string }) => {
    const response = await api.get(API_CONFIG.BILLING.DEFAULTERS, { params });
    return response.data;
  },

  getDefaulterStats: async () => {
    const response = await api.get(API_CONFIG.BILLING.DEFAULTER_STATS);
    return response.data;
  },

  getPlatformInvoices: async () => {
    const response = await api.get(API_CONFIG.BILLING.PLATFORM_INVOICES);
    return response.data;
  },

  deleteInvoice: async (id: number) => {
    const response = await api.delete(`${API_CONFIG.BILLING.INVOICES}/${id}`);
    return response.data;
  },

  applyLateFees: async () => {
    const response = await api.post(API_CONFIG.BILLING.APPLY_LATE_FEES);
    return response.data;
  },

  finalizeSetup: async () => {
    const response = await api.post(API_CONFIG.BILLING.FINALIZE);
    return response.data;
  },

  createPlatformInvoice: async (data: {
    societyId: number;
    amount: number;
    dueDate: string;
    invoiceNo?: string;
  }) => {
    const response = await api.post(API_CONFIG.BILLING.PLATFORM_INVOICES, data);
    return response.data;
  },
};
