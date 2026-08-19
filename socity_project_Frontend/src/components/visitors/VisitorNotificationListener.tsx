'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { connectSocket, getSocket, connectUser } from '@/lib/socket'
import { toast } from 'react-hot-toast'
import { UserCheck, Bell, MapPin, Building2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter, usePathname } from 'next/navigation'
import api from '@/lib/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function VisitorNotificationListener() {
    const { user, isAuthenticated } = useAuthStore()
    const queryClient = useQueryClient()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isAuthenticated || !user || pathname.startsWith('/visitor-entry')) {
            console.log('[VisitorListener] Skipping toast (Public page or Unauthenticated)');
            return;
        }
        if (!user.societyId) {
            console.log('[VisitorListener] No societyId');
            return;
        }

        console.log(`[VisitorListener] Initializing for user ${user.id} (${user.role}) in society ${user.societyId}`);
        const socket = connectSocket(user.societyId);

        // Ensure user is in their specific room for targeted notifications (like approvals)
        connectUser(user.id);


        // --- 1. Guard/Admin View: New Visitor Request ---
        if (user.role === 'guard' || user.role === 'admin' || user.role === 'community-manager') {
            socket.on('new_visitor_request', (data: any) => {
                queryClient.invalidateQueries({ queryKey: ['visitors'] });
                queryClient.invalidateQueries({ queryKey: ['guard-stats'] });
                queryClient.invalidateQueries({ queryKey: ['notifications'] });

                toast((t) => (
                    <div className="flex flex-col gap-1 min-w-[280px]">
                        <div className="flex items-center gap-2 text-blue-600 font-bold">
                            <UserCheck className="h-5 w-5" />
                            <span>New Visitor Entry</span>
                        </div>
                        <div
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors"
                            onClick={() => {
                                router.push('/dashboard/security/visitors');
                                toast.dismiss(t.id);
                            }}
                        >
                            <Avatar className="h-12 w-12 border-2 border-blue-100">
                                <AvatarImage src={data.photo} />
                                <AvatarFallback className="bg-blue-600 text-white font-bold">{data.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="font-bold text-gray-900">{data.name}</p>
                                <p className="text-xs text-gray-500 line-clamp-1">Purpose: {data.purpose}</p>
                                {data.unit && (
                                    <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                                        <Building2 className="h-3 w-3" /> {data.unit}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => {
                                    router.push('/dashboard/security/visitors');
                                    toast.dismiss(t.id);
                                }}
                                className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                View Details
                            </button>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-200"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                ), {
                    duration: 8000,
                    position: 'top-right',
                    id: `visitor_${data.id}`
                });

                playNotificationSound();
            });
        }

        // --- 2. Resident View: Approval Request ---
        if (user.role === 'resident') {
            socket.on('resident_visitor_request', (data: any) => {
                queryClient.invalidateQueries({ queryKey: ['visitors'] });
                queryClient.invalidateQueries({ queryKey: ['notifications'] });

                const handleAction = async (status: string, toastId: string) => {
                    try {
                        await api.patch(`/visitors/${data.id}/status`, { status });
                        toast.success(`Visitor ${status === 'CHECKED_IN' ? 'Approved' : 'Rejected'}`);
                        queryClient.invalidateQueries({ queryKey: ['visitors'] });
                        toast.dismiss(toastId);
                    } catch (err) {
                        toast.error('Failed to update status');
                    }
                };

                toast((t) => (
                    <div className="flex flex-col gap-2 min-w-[300px] p-1">
                        <div className="flex items-center gap-2 text-rose-600 font-black uppercase text-xs tracking-widest">
                            <Bell className="h-4 w-4 animate-bounce" />
                            <span>Visitor Approval Required</span>
                        </div>
                        <div
                            className="bg-gray-50 p-3 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-4"
                            onClick={() => {
                                router.push('/dashboard/my-unit?activeTab=visitors');
                                toast.dismiss(t.id);
                            }}
                        >
                            <Avatar className="h-14 w-14 ring-4 ring-white shadow-sm">
                                <AvatarImage src={data.photo} />
                                <AvatarFallback className="bg-rose-500 text-white font-bold text-xl">{data.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-black text-gray-900 text-lg leading-tight">{data.name}</p>
                                <p className="text-xs text-gray-500 font-bold mt-0.5">at {data.gateName} • {data.purpose}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    router.push('/dashboard/my-unit?activeTab=visitors');
                                    toast.dismiss(t.id);
                                }}
                                className="flex-1 text-xs font-black bg-gray-100 text-gray-600 py-2.5 rounded-xl hover:bg-gray-200 transition-all uppercase"
                            >
                                View
                            </button>
                            <button
                                onClick={() => handleAction('REJECTED', t.id)}
                                className="flex-1 text-xs font-black bg-white border-2 border-rose-100 text-rose-600 py-2.5 rounded-xl hover:bg-rose-50 transition-all uppercase"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleAction('CHECKED_IN', t.id)}
                                className="flex-1 text-xs font-black bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 uppercase"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                ), {
                    duration: 20000, // Longer duration for resident to see
                    position: 'top-center',
                    id: `resident_approval_${data.id}`,
                    style: {
                        borderRadius: '24px',
                        padding: '12px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                    }
                });

                playNotificationSound();
            });
        }

        return () => {
            socket.off('new_visitor_request');
            socket.off('resident_visitor_request');
        };
    }, [isAuthenticated, user, queryClient, router]);

    const playNotificationSound = () => {
        try {
            const audio = new Audio('/sounds/notification.mp3');
            audio.play().catch(() => { });
        } catch (e) { }
    };

    return null
}
