import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export const VendorService = {
  getAll: async (typeFilter?: string, statusFilter?: string) => {
    let url = API_CONFIG.VENDOR.LIST;
    const params: string[] = [];
    if (typeFilter && typeFilter !== 'all') params.push(`type=${typeFilter}`);
    if (statusFilter && statusFilter !== 'all') params.push(`status=${statusFilter}`);
    if (params.length) url += `?${params.join('&')}`;

    const response = await api.get(url);
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get(API_CONFIG.VENDOR.GET(id));
    return response.data;
  },

  create: async (data: {
    name: string;
    company?: string;
    type: string;
    serviceType?: string;
    contactPerson: string;
    phone: string;
    contact?: string;
    email: string;
    password: string;
    address?: string;
    gst?: string;
    pan?: string;
    contractStart?: string;
    contractEnd?: string;
    contractValue?: number;
    paymentTerms?: string;
    servicePincodes?: string;
  }) => {
    const payload = {
      ...data,
      contact: data.contact || data.phone,
      serviceType: data.serviceType || data.type,
    };
    const response = await api.post(API_CONFIG.VENDOR.CREATE, payload);
    return response.data;
  },

  update: async (id: number | string, data: any) => {
    const response = await api.put(API_CONFIG.VENDOR.UPDATE(id), data);
    return response.data;
  },

  delete: async (id: number | string) => {
    const response = await api.delete(API_CONFIG.VENDOR.DELETE(id));
    return response.data;
  },

  getStats: async () => {
    const response = await api.get(API_CONFIG.VENDOR.STATS);
    return response.data;
  },

  // Renew contract
  renewContract: async (id: number | string) => {
    const response = await api.post(API_CONFIG.VENDOR.RENEW(id), {});
    return response.data;
  },

  // Update status
  updateStatus: async (id: number | string, status: string) => {
    const response = await api.patch(API_CONFIG.VENDOR.UPDATE_STATUS(id), { status });
    return response.data;
  },

  rateVendor: async (id: number | string, rating: number) => {
    const response = await api.post(API_CONFIG.VENDOR.RATE(id), { rating });
    return response.data;
  },

  getPaymentHistory: async (id: number | string) => {
    const response = await api.get(API_CONFIG.VENDOR.PAYMENTS(id));
    return response.data;
  },
};
