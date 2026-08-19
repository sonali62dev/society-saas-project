import api from '@/lib/api';

// Authenticated admin endpoints
export const GateService = {
    list: async () => {
        const res = await api.get('/gates');
        return res.data;
    },
    create: async (name: string) => {
        const res = await api.post('/gates', { name });
        return res.data;
    },
    toggle: async (id: number) => {
        const res = await api.patch(`/gates/${id}/toggle`);
        return res.data;
    },
    remove: async (id: number) => {
        const res = await api.delete(`/gates/${id}`);
        return res.data;
    },
};

// Public endpoints (no auth) — used by visitor-entry page
import { API_URL } from '@/config/api.config';

const API_BASE = API_URL;

export const GatePublicService = {
    validate: async (gateId: string) => {
        const res = await fetch(`${API_BASE}/gates/public/${gateId}/validate`);
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Gate not found' }));
            throw new Error(err.error || 'Gate not found');
        }
        return res.json();
    },
    getUnits: async (gateId: string) => {
        const res = await fetch(`${API_BASE}/gates/public/${gateId}/units`);
        if (!res.ok) throw new Error('Failed to load units');
        return res.json();
    },
    submitEntry: async (gateId: string, formData: FormData) => {
        const res = await fetch(`${API_BASE}/gates/public/${gateId}/walk-in`, {
            method: 'POST',
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Submission failed');
        return data;
    },
};
