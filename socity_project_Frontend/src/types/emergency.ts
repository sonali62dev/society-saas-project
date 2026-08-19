export type BarcodeStatus = 'active' | 'disabled' | 'regenerated';

export interface EmergencyBarcode {
    id: string;
    residentId: string;
    residentName: string;
    unit: string;
    label: string; // e.g., "Main Door", "Toyota Fortuner"
    type: 'property' | 'vehicle' | 'other';
    status: BarcodeStatus;
    createdAt: string;
    qrCodeUrl: string; // Simulated URL
}

export interface EmergencyScanLog {
    id: string;
    barcodeId: string;
    visitorName: string;
    visitorPhone: string;
    reason?: string;
    timestamp: string;
    isEmergency: boolean;
    unit: string;
    residentName: string;
}

export interface EmergencyAlert {
    id: string;
    scanLogId: string;
    residentId: string;
    status: 'sent' | 'responded' | 'missed';
    type: 'app_notification' | 'call' | 'video_call';
}
