import api from '../lib/api';

export interface PropertyLeadForm {
    title: string;
    description?: string;
    category: string;
    actionType: string;
    city: string;
    area: string;
    address?: string;
    size?: number;
    budget?: number;
    bedrooms?: number;
    floor?: number;
    phone: string;
    email?: string;
    images?: string[]; // base64 strings
}

export const propertyLeadService = {
    // Create a new lead
    create: async (data: PropertyLeadForm) => {
        const response = await api.post('/property-leads', data);
        return response.data;
    },

    // Get leads (resident: own; admin: all in society; super-admin: all)
    list: async (params?: Record<string, string | number>) => {
        const response = await api.get('/property-leads', { params });
        return response.data;
    },

    // Get single lead
    get: async (id: number | string) => {
        const response = await api.get(`/property-leads/${id}`);
        return response.data;
    },

    // Update a lead
    update: async (id: number | string, data: Partial<PropertyLeadForm>) => {
        const response = await api.put(`/property-leads/${id}`, data);
        return response.data;
    },

    // Delete a lead
    remove: async (id: number | string) => {
        const response = await api.delete(`/property-leads/${id}`);
        return response.data;
    },

    // Admin: update status
    updateStatus: async (id: number | string, status: string, notes?: string) => {
        const response = await api.patch(`/property-leads/${id}/status`, { status, notes });
        return response.data;
    },

    // Admin: assign lead
    assign: async (id: number | string, assignedToId: number | null) => {
        const response = await api.patch(`/property-leads/${id}/assign`, { assignedToId });
        return response.data;
    },

    // Delete a media item
    deleteMedia: async (leadId: number | string, mediaId: number | string) => {
        const response = await api.delete(`/property-leads/${leadId}/media/${mediaId}`);
        return response.data;
    },
};
