import api from '../lib/api';
import { API_CONFIG } from '../config/api.config';

export const EmergencyService = {
    listLogs: async () => {
        const response = await api.get(API_CONFIG.EMERGENCY.LOGS);
        return response.data;
    },
    listBarcodes: async () => {
        const response = await api.get(API_CONFIG.EMERGENCY.BARCODES);
        return response.data;
    },
    updateBarcodeStatus: async (id: string, status: string) => {
        const response = await api.put(API_CONFIG.EMERGENCY.UPDATE_BARCODE_STATUS(id), { status });
        return response.data;
    },
    resetBarcodes: async (phone: string) => {
        const response = await api.post(API_CONFIG.EMERGENCY.RESET_BARCODES, { phone });
        return response.data;
    },

    // Alerts
    createAlert: async (data: { type: string, description?: string, unit?: string }) => {
        const response = await api.post(API_CONFIG.EMERGENCY.CREATE_ALERT, data);
        return response.data;
    },
    listAlerts: async (status?: string) => {
        const response = await api.get(API_CONFIG.EMERGENCY.LIST_ALERTS, { params: { status } });
        return response.data;
    },
    resolveAlert: async (id: number | string, resolution: string) => {
        const response = await api.patch(API_CONFIG.EMERGENCY.RESOLVE_ALERT(id), { resolution });
        return response.data;
    },

    // Contacts
    listContacts: async () => {
        const response = await api.get(API_CONFIG.EMERGENCY.LIST_CONTACTS);
        return response.data;
    },
    addContact: async (data: { name: string, phone: string, category: string }) => {
        const response = await api.post(API_CONFIG.EMERGENCY.ADD_CONTACT, data);
        return response.data;
    },
    deleteContact: async (id: number | string) => {
        const response = await api.delete(API_CONFIG.EMERGENCY.DELETE_CONTACT(id));
        return response.data;
    }
};
