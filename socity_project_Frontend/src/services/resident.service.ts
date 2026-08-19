import api from '../lib/api';

export const residentService = {
    getDashboardData: async () => {
        const response = await api.get('/resident/dashboard');
        return response.data;
    },

    paySecurityDeposit: async (data: { paymentMethod: string }) => {
        const response = await api.post('/resident/pay-deposit', data);
        return response.data;
    },

    // My Unit
    getUnitData: async () => {
        const response = await api.get('/resident/unit');
        return response.data;
    },
    addFamilyMember: async (data: any) => {
        const response = await api.post('/resident/unit/family', data);
        return response.data;
    },
    updateFamilyMember: async (id: number | string, data: any) => {
        const response = await api.put(`/resident/unit/family/${id}`, data);
        return response.data;
    },
    addVehicle: async (data: any) => {
        const response = await api.post('/resident/unit/vehicle', data);
        return response.data;
    },
    updateVehicle: async (id: number | string, data: any) => {
        const response = await api.put(`/resident/unit/vehicle/${id}`, data);
        return response.data;
    },
    addPet: async (data: any) => {
        const response = await api.post('/resident/unit/pet', data);
        return response.data;
    },
    updatePet: async (id: number | string, data: any) => {
        const response = await api.put(`/resident/unit/pet/${id}`, data);
        return response.data;
    },
    getMyPayments: async () => {
        const response = await api.get('/resident/payments');
        return response.data;
    },

    // SOS
    getSOSData: async () => {
        const response = await api.get('/resident/sos/data');
        return response.data;
    },
    triggerSOS: async (data: any) => {
        const response = await api.post('/resident/sos/trigger', data);
        return response.data;
    },
    addEmergencyContact: async (data: any) => {
        const response = await api.post('/resident/sos/contact', data);
        return response.data;
    },

    // Helpdesk
    getTickets: async () => {
        const response = await api.get('/resident/tickets');
        return response.data;
    },
    createTicket: async (data: any) => {
        const response = await api.post('/resident/tickets', data);
        return response.data;
    },
    getTicketById: async (id: string) => {
        const response = await api.get(`/resident/tickets/${id}`);
        return response.data;
    },
    addTicketComment: async (id: string | number, message: string) => {
        const response = await api.post(`/complaints/${id}/comments`, { message });
        return response.data;
    },
    updateTicketStatus: async (id: string | number, status: string) => {
        const response = await api.patch(`/complaints/${id}/status`, { status });
        return response.data;
    },

    // Marketplace
    getMarketItems: async () => {
        const response = await api.get('/resident/market/items');
        return response.data;
    },
    createMarketItem: async (data: any) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price);
        if (data.originalPrice) formData.append('originalPrice', data.originalPrice);
        formData.append('category', data.category);
        formData.append('condition', data.condition);
        if (data.type) formData.append('type', data.type);
        if (data.priceType) formData.append('priceType', data.priceType);
        if (data.image) formData.append('image', data.image);

        const response = await api.post('/resident/market/items', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    updateMarketItemStatus: async (id: number, status: string) => {
        const response = await api.put(`/resident/market/items/${id}/status`, { status });
        return response.data;
    },
    deleteMarketItem: async (id: number) => {
        const response = await api.delete(`/resident/market/items/${id}`);
        return response.data;
    },

    // Services
    getServices: async () => {
        const response = await api.get('/resident/services');
        return response.data;
    },
    createServiceInquiry: async (data: any) => {
        const response = await api.post('/resident/services/inquiry', data);
        return response.data;
    },

    // Lead payment (only when status = CONFIRMED)
    getPaymentDetails: async (inquiryId: number | string) => {
        const response = await api.get(`/services/inquiries/${inquiryId}/payment-details`);
        return response.data;
    },
    initiatePayment: async (inquiryId: number | string, data: { paymentMethod: string; amount?: number }) => {
        const response = await api.post(`/services/inquiries/${inquiryId}/initiate-payment`, data);
        return response.data;
    },
    updateLeadPaymentStatus: async (inquiryId: number | string, data: { paymentStatus: string; transactionId?: string }) => {
        const response = await api.patch(`/services/inquiries/${inquiryId}/payment-status`, data);
        return response.data;
    },

    // Amenities
    getAmenities: async () => {
        const response = await api.get('/resident/amenities');
        return response.data;
    },
    bookAmenity: async (data: any) => {
        const response = await api.post('/resident/amenities/book', data);
        return response.data;
    },

    // Community
    getCommunityFeed: async () => {
        const response = await api.get('/resident/community/feed');
        return response.data;
    },
    createPost: async (data: any) => {
        const formData = new FormData();
        formData.append('type', data.type);
        formData.append('content', data.content);
        formData.append('title', data.title || '');
        if (data.image) {
            formData.append('image', data.image);
        }
        const response = await api.post('/resident/community/post', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    createComment: async (data: any) => {
        const response = await api.post('/resident/community/comment', data);
        return response.data;
    },
    toggleLike: async (buzzId: number) => {
        const response = await api.post('/resident/community/like', { buzzId });
        return response.data;
    },
    updatePost: async (id: number, data: { title?: string; content: string; type: string }) => {
        const response = await api.put(`/resident/community/post/${id}`, data);
        return response.data;
    },
    deletePost: async (id: number) => {
        const response = await api.delete(`/resident/community/post/${id}`);
        return response.data;
    },

    // Guidelines
    getGuidelines: async () => {
        const response = await api.get('/resident/guidelines');
        return response.data;
    },
};
