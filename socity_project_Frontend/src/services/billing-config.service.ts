import api from "../lib/api";

export interface MaintenanceRule {
    id: number;
    unitType: string;
    calculationType: 'FLAT' | 'AREA';
    amount: number;
    ratePerSqFt: number;
    isActive: boolean;
}

export interface ChargeMaster {
    id: number;
    name: string;
    defaultAmount: number;
    calculationMethod: 'FIXED' | 'VARIABLE';
    isOptional: boolean;
    isActive: boolean;
}

export interface LateFeeConfig {
    id: number;
    gracePeriod: number;
    feeType: 'FIXED' | 'PERCENTAGE' | 'PER_DAY';
    amount: number;
    maxCap: number | null;
    isActive: boolean;
}

export interface BillingConfig {
    maintenanceRules: MaintenanceRule[];
    chargeMaster: ChargeMaster[];
    lateFeeConfig: LateFeeConfig;
}

class BillingConfigService {
    async getConfig(): Promise<BillingConfig> {
        const response = await api.get('/billing-config/config');
        return response.data;
    }

    // Maintenance Rules
    async getMaintenanceRules(): Promise<MaintenanceRule[]> {
        const response = await api.get('/billing-config/maintenance');
        return response.data;
    }

    async updateMaintenanceRule(id: number | 'new', data: Partial<MaintenanceRule>): Promise<MaintenanceRule> {
        const response = await api.post(`/billing-config/maintenance/${id}`, data);
        return response.data;
    }

    async deleteMaintenanceRule(id: number): Promise<void> {
        await api.delete(`/billing-config/maintenance/${id}`);
    }

    // Charge Master
    async getChargeMaster(): Promise<ChargeMaster[]> {
        const response = await api.get('/billing-config/charges');
        return response.data;
    }

    async createCharge(data: Partial<ChargeMaster>): Promise<ChargeMaster> {
        const response = await api.post('/billing-config/charges', data);
        return response.data;
    }

    async updateCharge(id: number, data: Partial<ChargeMaster>): Promise<ChargeMaster> {
        const response = await api.put(`/billing-config/charges/${id}`, data);
        return response.data;
    }

    async deleteCharge(id: number): Promise<void> {
        await api.delete(`/billing-config/charges/${id}`);
    }

    // Late Fee Config
    async getLateFeeConfig(): Promise<LateFeeConfig> {
        const response = await api.get('/billing-config/late-fee');
        return response.data;
    }

    async updateLateFeeConfig(data: Partial<LateFeeConfig>): Promise<LateFeeConfig> {
        const response = await api.post('/billing-config/late-fee', data);
        return response.data;
    }
}

export const billingConfigService = new BillingConfigService();
