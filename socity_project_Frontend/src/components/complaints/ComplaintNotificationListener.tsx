'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { connectSocket, connectPlatformAdmin, getSocket, disconnectSocket } from '@/lib/socket'
import { toast } from 'react-hot-toast'
import { MessageSquare, CheckCircle2, User } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export default function ComplaintNotificationListener() {
    const { user, isAuthenticated } = useAuthStore()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (isAuthenticated) {
            let socket: any;
            if (user?.role === 'super_admin') {
                socket = connectPlatformAdmin()
            } else if (user?.societyId) {
                socket = connectSocket(user.societyId)
            }

            if (socket) {
                socket.on('complaint_updated', (data: any) => {
                    console.log('Complaint Update Received:', data)
                    
                    // Invalidate queries to refresh UI data
                    queryClient.invalidateQueries({ queryKey: ['complaints'] })
                    queryClient.invalidateQueries({ queryKey: ['super-admin-complaints'] })

                    // Show notification
                    toast((t) => (
                        <div className="flex items-start gap-3 min-w-[300px]">
                            <div className={`p-2 rounded-full ${data.status === 'RESOLVED' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                {data.status === 'RESOLVED' ? <CheckCircle2 className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                            </div>
                            <div className="flex flex-col">
                                <p className="font-bold text-gray-900">
                                    Complaint {data.status === 'RESOLVED' ? 'Resolved' : 'Updated'}
                                </p>
                                <p className="text-xs text-gray-500 line-clamp-1">{data.title}</p>
                                {data.assignedTo && (
                                    <p className="text-[10px] text-indigo-600 font-bold mt-1">
                                        Assigned to: {data.assignedTo}
                                    </p>
                                )}
                                {user?.role === 'super_admin' && data.societyName && (
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        Society: {data.societyName}
                                    </p>
                                )}
                            </div>
                        </div>
                    ), {
                        duration: 6000,
                        position: 'bottom-right',
                        style: {
                            borderRadius: '16px',
                            background: '#fff',
                            color: '#333',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }
                    })
                })
            }

            return () => {
                if (socket) {
                    socket.off('complaint_updated')
                }
            }
        }
    }, [isAuthenticated, user, queryClient])

    return null
}
