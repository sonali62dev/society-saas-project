'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
    ArrowLeft, 
    User, 
    Mail, 
    Phone, 
    Calendar,
    Shield, 
    AlertTriangle,
    QrCode,
    Clock,
    CheckCircle2,
    Ban
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import api from '@/lib/api'
import { format } from 'date-fns'

export function UserActivityClient() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const userId = searchParams.get('id')

    const { data: activity, isLoading } = useQuery({
        queryKey: ['user-activity', userId],
        queryFn: async () => {
            const response = await api.get(`/auth/${userId}/activity`)
            return response.data
        }
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        )
    }

    if (!activity) return null

    const { user, logs, barcodes } = activity

    return (
        <div className="min-h-screen bg-slate-50/50 p-8 space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="hover:bg-white/50"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Users
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Activity</h1>
                    <p className="text-slate-500">Detailed logs and history for {user.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Profile Card */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-indigo-600" />
                            Profile Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{user.name}</h3>
                                <Badge variant={user.status === 'ACTIVE' ? 'default' : 'destructive'}>
                                    {user.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail className="h-4 w-4" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Phone className="h-4 w-4" />
                                {user.phone || 'N/A'}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Calendar className="h-4 w-4" />
                                Joined {format(new Date(user.createdAt), 'PPP')}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-8">
                    {/* Activity Timeline */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-indigo-600" />
                                Emergency & Access Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8 pl-4 border-l-2 border-slate-100">
                                {logs.length === 0 && (
                                    <p className="text-slate-500 text-sm">No activity logs found.</p>
                                )}
                                {logs.map((log: any) => (
                                    <motion.div 
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="relative"
                                    >
                                        <div className={`absolute -left-[25px] h-4 w-4 rounded-full border-2 border-white ${log.isEmergency ? 'bg-red-500' : 'bg-green-500'}`} />
                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    {log.isEmergency ? (
                                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                                    ) : (
                                                        <Shield className="h-4 w-4 text-green-500" />
                                                    )}
                                                    <span className={`font-bold text-sm ${log.isEmergency ? 'text-red-700' : 'text-slate-700'}`}>
                                                        {log.isEmergency ? 'EMERGENCY ALERT' : 'Access Scan'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {format(new Date(log.timestamp), 'PP p')}
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-600">
                                                <p><strong>Resident:</strong> {log.residentName} ({log.unit})</p>
                                                {log.reason && <p className="mt-1 text-slate-500 italic">" {log.reason} "</p>}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Barcodes */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <QrCode className="h-5 w-5 text-indigo-600" />
                                Active Barcodes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {barcodes.length === 0 && (
                                    <p className="text-slate-500 text-sm col-span-2">No active barcodes found.</p>
                                )}
                                {barcodes.map((barcode: any) => (
                                    <div key={barcode.id} className="bg-slate-50 p-4 rounded-xl flex items-center gap-4">
                                        <div className="bg-white p-2 rounded-lg shadow-sm">
                                            <QrCode className="h-8 w-8 text-slate-700" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700">{barcode.residentName}</p>
                                            <p className="text-xs text-slate-500">{barcode.unit}</p>
                                            <Badge variant="outline" className="mt-2 bg-green-50 text-green-700 border-green-200">
                                                {barcode.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
