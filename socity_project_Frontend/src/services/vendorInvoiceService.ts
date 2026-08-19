import api from '@/lib/api';

const vendorInvoiceService = {
  getInvoices: async (status: string = 'all', vendorId: string = 'all') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (vendorId) params.append('vendorId', vendorId);
    
    const response = await api.get(`/vendor-invoices?${params.toString()}`);
    return response.data;
  },

  createInvoice: async (data: any) => {
    const response = await api.post('/vendor-invoices', data);
    return response.data;
  },

  approveInvoice: async (id: number) => {
    const response = await api.post(`/vendor-invoices/${id}/approve`);
    return response.data;
  },

  payInvoice: async (id: number, paymentDetails: any) => {
    const response = await api.post(`/vendor-invoices/${id}/pay`, paymentDetails);
    return response.data;
  }
};

export default vendorInvoiceService;
