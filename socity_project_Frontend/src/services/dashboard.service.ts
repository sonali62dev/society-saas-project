import api from '@/lib/api';
import { API_CONFIG } from '@/config/api.config';

export interface AdminStats {
  societyName: string;
  users: {
    total: number;
    active: number;
    inactive: number;
    pending: number;
    owners: number;
    tenants: number;
    staff: number;
    neverLoggedIn: number;
  };
  units: {
    total: number;
    occupied: number;
    vacant: number;
  };
  finance: {
    totalRevenue: number;
    pendingDues: number;
    collectedThisMonth: number;
    totalExpenses: number;
    defaultersCount: number;
    monthlyIncome: { month: string; amount: number }[];
    incomePeriod: {
      start: string;
      end: string;
    };
    parkingIncome: number;
    amenityIncome: number;
    pendingVendorPayments: number;
    lateFees: number;
  };
  activity: {
    openComplaints: number;
    pendingVisitors: number;
    upcomingMeetings: number;
    activeVendors: number;
    todayVisitors: number;
    openPurchaseRequests: number;
    unfinalizedPurchaseRequests: number;
    escalatedComplaints: number;
  };
  defaulters: {
    receivedFrom: string | null;
    amount: number;
    category: string;
    createdAt: string;
  }[];
  recentActivities: {
    type: string;
    user: string;
    action: string;
    time: string;
    status: string;
  }[];
}

export const DashboardService = {
  getAdminStats: async (): Promise<AdminStats> => {
    const response = await api.get(API_CONFIG.SOCIETY.ADMIN_STATS);
    return response.data;
  },

  getSocietyMembers: async () => {
    const response = await api.get(API_CONFIG.SOCIETY.MEMBERS);
    return response.data;
  },

  getResidentDirectory: async () => {
    const response = await api.get(API_CONFIG.RESIDENT.DIRECTORY);
    return response.data;
  },
};

