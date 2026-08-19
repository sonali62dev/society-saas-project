'use client'

import { useAuthStore } from '@/lib/stores/auth-store'
import {
    QrCode,
    Wrench,
    Shield,
    History,
    ArrowRight,
    Clock,
    Bell,
    Smartphone,
    User,
    Settings,
    Phone,
    Video,
    TrendingUp,
    Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { EmergencyService } from '@/services/emergency.service'
import { ServiceManagementService } from '@/services/service.service'

export function IndividualDashboard() {
    const { user } = useAuthStore()

    // Real API Queries
    const { data: barcodeData, isLoading: isLoadingBarcodes } = useQuery({
        queryKey: ['emergency-barcodes'],
        queryFn: EmergencyService.listBarcodes
    })

    const { data: logData, isLoading: isLoadingLogs } = useQuery({
        queryKey: ['emergency-logs'],
        queryFn: EmergencyService.listLogs
    })

    const { data: inquiryData, isLoading: isLoadingInquiries } = useQuery({
        queryKey: ['service-inquiries'],
        queryFn: ServiceManagementService.listInquiries
    })

    const barcodes = Array.isArray(barcodeData) ? barcodeData : (barcodeData?.data || [])
    const emergencyLogs = Array.isArray(logData) ? logData : (logData?.data || [])
    const inquiries = Array.isArray(inquiryData) ? inquiryData : (inquiryData?.data || [])

    const activeBarcodes = barcodes.filter((b: any) => b.userId === user?.id || b.residentId === user?.id || b.residentName === user?.name)
    const recentInquiries = inquiries.filter((i: any) => i.userId === user?.id || i.residentName === user?.name || i.residentId === user?.id).slice(0, 3)
    const recentAlerts = emergencyLogs.filter((l: any) => l.barcode?.userId === user?.id || l.residentName === user?.name || l.residentId === user?.id).slice(0, 3)

    return (
        <div className="space-y-8 pb-12">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight">
                        Hello, {user?.name.split(' ')[0]}!
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium text-lg">
                        Welcome to your personal safety and services hub.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/settings">
                        <Button variant="outline" className="rounded-2xl h-12 border-0 ring-1 ring-border shadow-sm px-6 font-bold gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Core Stats / Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-8 border-0 shadow-2xl bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] rounded-[40px] text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20 backdrop-blur-md">
                            <QrCode className="h-6 w-6 text-teal-300" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">My QR Codes</h3>
                        <div className="h-14 mb-6 leading-relaxed">
                            {isLoadingBarcodes ? (
                                <div className="flex items-center gap-2 text-white/40 italic text-sm">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Updating statistics...
                                </div>
                            ) : (
                                <p className="text-white/60 text-sm">
                                    {activeBarcodes.length} active emergency barcodes protecting your assets.
                                </p>
                            )}
                        </div>
                        <Link href="/dashboard/qr-access">
                            <Button className="w-full bg-teal-500 hover:bg-teal-400 text-[#1e3a5f] font-black rounded-2xl h-14 tracking-tight">
                                MANAGE CODES
                            </Button>
                        </Link>
                    </div>
                </Card>

                <Card className="p-8 border-0 shadow-xl bg-card rounded-[40px] ring-1 ring-border relative overflow-hidden group">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6">
                        <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Book Service</h3>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                        Request pest control, plumbing, or electrical services instantly.
                    </p>
                    <Link href="/dashboard/services">
                        <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-2 border-muted hover:bg-muted tracking-tight text-[#1e3a5f] dark:text-foreground">
                            EXPLORE SERVICES
                        </Button>
                    </Link>
                </Card>

                <Card className="p-8 border-0 shadow-xl bg-card rounded-[40px] ring-1 ring-border relative overflow-hidden group">
                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-6">
                        <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Security Hub</h3>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                        Monitor scan logs and manage emergency contacts.
                    </p>
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-2 border-muted hover:bg-muted tracking-tight text-[#1e3a5f] dark:text-foreground">
                        VIEW LOGS
                    </Button>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Emergency Alerts */}
                <Card className="border-0 shadow-xl bg-card rounded-[40px] ring-1 ring-border overflow-hidden">
                    <CardHeader className="p-8 border-b border-border flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black text-foreground">Recent Emergency Alerts</CardTitle>
                            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">Live Updates</p>
                        </div>
                        <Badge className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-0 rounded-full font-black px-3">{recentAlerts.length}</Badge>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            {isLoadingLogs ? (
                                <div className="py-20 text-center">
                                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mx-auto mb-4" />
                                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Retrieving Alert History...</p>
                                </div>
                            ) : recentAlerts.map((log: any) => (
                                <div key={log.id} className="p-6 rounded-3xl bg-muted/50 hover:bg-muted transition-all group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center font-bold text-red-600 dark:text-red-400 shadow-sm text-xl">
                                                {log.visitorName?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{log.visitorName || 'Unknown Scanner'}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                                                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {log.isEmergency && (
                                            <Badge className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-0 rounded-full text-[10px] font-black px-2 shadow-none">URGENT</Badge>
                                        )}
                                    </div>
                                    <p className="mt-4 text-sm text-muted-foreground italic font-medium">"{log.reason || 'No specific reason provided.'}"</p>
                                    <div className="mt-6 flex gap-3">
                                        <Button className="flex-1 h-12 bg-card hover:bg-muted text-[#1e3a5f] dark:text-foreground font-bold rounded-2xl ring-1 ring-border gap-2 border-0">
                                            <Phone className="h-4 w-4" /> CALL
                                        </Button>
                                        <Button className="flex-1 h-12 bg-card hover:bg-muted text-[#1e3a5f] dark:text-foreground font-bold rounded-2xl ring-1 ring-border gap-2 border-0">
                                            <Video className="h-4 w-4" /> VIDEO
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {!isLoadingLogs && recentAlerts.length === 0 && (
                                <div className="py-20 text-center">
                                    <Bell className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No Recent Alerts</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Service Bookings */}
                <Card className="border-0 shadow-xl bg-card rounded-[40px] ring-1 ring-border overflow-hidden">
                    <CardHeader className="p-8 border-b border-border flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black text-foreground">Recent Service Bookings</CardTitle>
                            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">Status Tracking</p>
                        </div>
                        <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-0 rounded-full font-black px-3">{recentInquiries.length}</Badge>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            {isLoadingInquiries ? (
                                <div className="py-20 text-center">
                                    <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mx-auto mb-4" />
                                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Syncing service status...</p>
                                </div>
                            ) : recentInquiries.map((inquiry: any) => (
                                <div key={inquiry.id} className="p-6 rounded-3xl bg-muted/50 hover:bg-muted transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-card rounded-2xl shadow-sm">
                                                <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{inquiry.serviceName}</p>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{inquiry.providerName}</p>
                                            </div>
                                        </div>
                                        <Badge className={`border-0 rounded-full text-[10px] font-black px-3 py-1 shadow-none uppercase ${inquiry.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                                            inquiry.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                            }`}>
                                            {inquiry.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest pt-4 border-t border-border">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {inquiry.preferredDate || 'TBD'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            {inquiry.preferredTime || 'TBD'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {!isLoadingInquiries && recentInquiries.length === 0 && (
                                <div className="py-20 text-center">
                                    <History className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No Recent Service Requests</p>
                                </div>
                            )}
                        </div>
                        {!isLoadingInquiries && recentInquiries.length > 0 && (
                            <Link href="/dashboard/services">
                                <Button variant="ghost" className="w-full mt-4 h-12 rounded-2xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
                                    VIEW ALL SERVICE HISTORY <ArrowRight className="h-3 w-3 ml-2" />
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Premium App Promo */}
            <Card className="border-0 shadow-2xl bg-gradient-to-r from-teal-500 to-blue-600 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="relative z-10 max-w-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Smartphone className="h-6 w-6" />
                        </div>
                        <span className="font-black uppercase tracking-widest text-xs">Mobile Companion</span>
                    </div>
                    <h3 className="text-3xl font-black mb-4">Never miss an emergency alert.</h3>
                    <p className="text-white/80 font-medium leading-relaxed mb-8">
                        Get the IGATESECURITY app to receive instant push notifications, video calls, and real-time scan alerts on your phone.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Button className="bg-white text-teal-600 hover:bg-gray-100 h-14 px-8 rounded-2xl font-black transition-all active:scale-[0.98]">
                            DOWNLOAD APP
                        </Button>
                        <Button variant="ghost" className="h-14 px-8 rounded-2xl font-black text-white hover:bg-white/10 ring-1 ring-white/20">
                            LEARN MORE
                        </Button>
                    </div>
                </div>
                <div className="relative z-10 hidden md:block">
                    <div className="w-48 h-48 bg-white/20 rounded-[40px] backdrop-blur-md border border-white/30 flex items-center justify-center p-8">
                        <QrCode className="w-full h-full text-white/50" />
                    </div>
                </div>
            </Card>
        </div>
    )
}

function Calendar({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
    )
}
