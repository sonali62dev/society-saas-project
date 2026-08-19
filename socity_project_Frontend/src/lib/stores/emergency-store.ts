import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EmergencyBarcode, EmergencyScanLog, BarcodeStatus } from '@/types/emergency';
import { mockEmergencyBarcodes, mockEmergencyScanLogs } from '@/lib/mocks/emergency';

interface EmergencyState {
    barcodes: EmergencyBarcode[];
    logs: EmergencyScanLog[];
    generateBarcode: (barcode: Omit<EmergencyBarcode, 'id' | 'createdAt' | 'qrCodeUrl'>) => void;
    updateBarcodeStatus: (id: string, status: BarcodeStatus) => void;
    regenerateBarcode: (id: string) => void;
    addScanLog: (log: Omit<EmergencyScanLog, 'id' | 'timestamp'>) => void;
    deleteBarcode: (id: string) => void;
}

export const useEmergencyStore = create<EmergencyState>()(
    persist(
        (set) => ({
            barcodes: mockEmergencyBarcodes,
            logs: mockEmergencyScanLogs,

            generateBarcode: (data) => set((state) => {
                const id = `eb-${Math.random().toString(36).substr(2, 9)}`;
                const newBarcode: EmergencyBarcode = {
                    ...data,
                    id,
                    createdAt: new Date().toISOString(),
                    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`,
                };
                return { barcodes: [...state.barcodes, newBarcode] };
            }),

            updateBarcodeStatus: (id, status) => set((state) => ({
                barcodes: state.barcodes.map(b => b.id === id ? { ...b, status } : b)
            })),

            regenerateBarcode: (id) => set((state) => {
                const barcode = state.barcodes.find(b => b.id === id);
                if (!barcode) return state;

                const newId = `eb-reg-${Math.random().toString(36).substr(2, 9)}`;
                const newBarcode: EmergencyBarcode = {
                    ...barcode,
                    id: newId,
                    createdAt: new Date().toISOString(),
                    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${newId}`,
                    status: 'active' as BarcodeStatus
                };

                return {
                    barcodes: state.barcodes.map(b => b.id === id ? { ...b, status: 'regenerated' as BarcodeStatus } : b).concat(newBarcode)
                };
            }),

            addScanLog: (data) => set((state) => {
                const newLog: EmergencyScanLog = {
                    ...data,
                    id: `log-${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: new Date().toISOString(),
                };
                return { logs: [newLog, ...state.logs] };
            }),

            deleteBarcode: (id) => set((state) => ({
                barcodes: state.barcodes.filter(b => b.id !== id)
            })),
        }),
        {
            name: 'emergency-storage',
        }
    )
);
