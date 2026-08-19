import api from '../lib/api';

export interface RentalAgreementForm {
    propertyType: string;
    propertyAddress: string;
    city: string;
    area: string;
    agreementType: string;
    rentAmount: number;
    depositAmount: number;
    durationMonths: number;
    startDate: string;
    ownerName: string;
    tenantName: string;
    numberOfTenants: number;
    remarks?: string;
}

export const rentalAgreementService = {
    // Create a new enquiry
    create: async (data: any) => {
        // We use FormData if documents are present, but here we'll handle standard payload 
        // if it's JSON or multipart. The controller expects multipart/form-data for documents.
        const response = await api.post('/rental-agreements', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // List enquiries
    list: async (params?: Record<string, string | number>) => {
        const response = await api.get('/rental-agreements', { params });
        return response.data;
    },

    // Get detail
    get: async (id: number | string) => {
        const response = await api.get(`/rental-agreements/${id}`);
        return response.data;
    },

    // Update status (Admin)
    updateStatus: async (id: number | string, status: string, notes?: string) => {
        const response = await api.patch(`/rental-agreements/${id}/status`, { status, notes });
        return response.data;
    },

    // Assign lead (Admin)
    assign: async (id: number | string, assignedToId: number) => {
        const response = await api.patch(`/rental-agreements/${id}/assign`, { assignedToId });
        return response.data;
    },

    // Delete enquiry (Resident)
    remove: async (id: number | string) => {
        const response = await api.delete(`/rental-agreements/${id}`);
        return response.data;
    },
};
