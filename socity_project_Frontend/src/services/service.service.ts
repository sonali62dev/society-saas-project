import api from '../lib/api';
import { API_CONFIG } from '../config/api.config';

export const ServiceManagementService = {
    listCategories: async () => {
        const response = await api.get(API_CONFIG.SERVICE.CATEGORIES);
        return response.data;
    },
    getCategory: async (id: string) => {
        const response = await api.get(API_CONFIG.SERVICE.CATEGORY_DETAILS(id));
        return response.data;
    },
    listInquiries: async () => {
        const response = await api.get(API_CONFIG.SERVICE.INQUIRIES);
        return response.data;
    },
    assignVendor: async (inquiryId: string, vendorData: { vendorId: string, vendorName: string }) => {
        const response = await api.patch(API_CONFIG.SERVICE.ASSIGN_VENDOR(inquiryId), vendorData);
        return response.data;
    },
    createInquiry: async (inquiryData: any) => {
        const response = await api.post(API_CONFIG.SERVICE.INQUIRIES, inquiryData);
        return response.data;
    }
};
