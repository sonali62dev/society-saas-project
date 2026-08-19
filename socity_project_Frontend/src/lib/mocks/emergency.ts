import { EmergencyBarcode, EmergencyScanLog } from '@/types/emergency';

export const mockEmergencyBarcodes: EmergencyBarcode[] = [
    {
        id: 'eb-1',
        residentId: 'resident-1',
        residentName: 'Resident User',
        unit: 'A-101',
        label: 'Main Door',
        type: 'property',
        status: 'active',
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EB-1',
    },
    {
        id: 'eb-2',
        residentId: 'resident-1',
        residentName: 'Resident User',
        unit: 'A-101',
        label: 'Toyota Fortuner (MH-12-AB-1234)',
        type: 'vehicle',
        status: 'active',
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EB-2',
    },
];

export const mockEmergencyScanLogs: EmergencyScanLog[] = [
    {
        id: 'log-1',
        barcodeId: 'eb-1',
        visitorName: 'John Doe',
        visitorPhone: '+91 91234 56789',
        reason: 'Parcel left at door, need to confirm.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isEmergency: false,
        unit: 'A-101',
        residentName: 'Resident User',
    },
    {
        id: 'log-2',
        barcodeId: 'eb-2',
        visitorName: 'Security Guard',
        visitorPhone: '+91 88888 77777',
        reason: 'Car blocking the driveway. Please move.',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isEmergency: true,
        unit: 'A-101',
        residentName: 'Resident User',
    },
];
