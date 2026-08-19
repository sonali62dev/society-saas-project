import api from '../lib/api';

export interface SocietyReceipt {
    id: number;
    receiptNo: string;
    societyId: number;
    unitId: number;
    residentId: number;
    amount: number;
    date: string;
    paymentMethod: string;
    transactionId?: string;
    description?: string;
    unit?: {
        number: string;
        block: string;
    };
    breakups?: Array<{
        id: number;
        invoiceId?: number;
        amount: number;
        description?: string;
        invoice?: {
            invoiceNo: string;
        };
    }>;
}

export interface Wallet {
    id: number;
    unitId: number;
    advanceBalance: number;
    securityDepositBalance: number;
    updatedAt: string;
}

export interface WalletTransaction {
    id: number;
    walletId: number;
    type: 'CREDIT' | 'DEBIT';
    purpose: 'ADVANCE' | 'SECURITY_DEPOSIT' | 'MAINTENANCE_ADJUSTMENT' | 'REVERSAL';
    amount: number;
    date: string;
    description?: string;
    receiptId?: number;
}

export const societyReceiptService = {
    // Receipts
    listReceipts: async (params?: any) => {
        const response = await api.get('/society-dues/receipts', { params });
        return response.data as SocietyReceipt[];
    },
    getReceipt: async (id: number) => {
        const response = await api.get(`/society-dues/receipts/${id}`);
        return response.data as SocietyReceipt;
    },
    createReceipt: async (data: any) => {
        const response = await api.post('/society-dues/receipts', data);
        return response.data as SocietyReceipt;
    },

    // Wallet
    getWalletBalance: async (unitId: number) => {
        const response = await api.get(`/society-dues/wallet/${unitId}/balance`);
        return response.data as Wallet;
    },
    listWalletTransactions: async (unitId: number) => {
        const response = await api.get(`/society-dues/wallet/${unitId}/transactions`);
        return response.data as WalletTransaction[];
    },
    addAdvance: async (data: { unitId: number; amount: number; paymentMethod: string; transactionId?: string; description?: string }) => {
        const response = await api.post('/society-dues/wallet/advance', data);
        return response.data;
    },
    addSecurityDeposit: async (data: { unitId: number; amount: number; paymentMethod: string; transactionId?: string; description?: string }) => {
        const response = await api.post('/society-dues/wallet/security-deposit', data);
        return response.data;
    }
};
