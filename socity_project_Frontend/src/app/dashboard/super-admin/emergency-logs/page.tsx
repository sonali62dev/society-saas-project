'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Search, Filter, Calendar, Clock, User, Smartphone, MoreVertical, Shield, CheckCircle2, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import { connectPlatformAdmin, disconnectSocket } from '@/lib/socket'

export default function SuperAdminEmergencyLogs() {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState<'all' | 'emergency' | 'normal'>('all')

    useEffect(() => {
        const socket = connectPlatformAdmin()
        
        socket.on('new_emergency_alert', (alert: any) => {
            console.log('Real-time emergency alert received in Super Admin Dashboard:', alert)
            // Trigger a refresh of the logs and barcodes
            queryClient.invalidateQueries({ queryKey: ['emergency-logs'] })
            queryClient.invalidateQueries({ queryKey: ['emergency-barcodes'] })
        })

        return () => {
            socket.off('new_emergency_alert')
            disconnectSocket()
        }
    }, [queryClient])

    const { data: logs = [], isLoading: isLogsLoading } = useQuery<any[]>({
        queryKey: ['emergency-logs'],
        queryFn: async () => {
            const response = await api.get('/emergency/logs')
            return response.data
        }
    })

    const { data: barcodes = [], isLoading: isBarcodesLoading } = useQuery<any[]>({
        queryKey: ['emergency-barcodes'],
        queryFn: async () => {
            const response = await api.get('/emergency/barcodes')
            return response.data
        }
    })

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            const response = await api.put(`/emergency/barcodes/${id}/status`, { status })
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emergency-barcodes'] })
            toast.success('Barcode status updated')
        }
    })

    const filteredLogs = (logs || []).filter((log: any) => {
        const matchesSearch =
            (log.visitorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (log.residentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (log.unit || '').toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter =
            filter === 'all' ||
            (filter === 'emergency' && log.isEmergency) ||
            (filter === 'normal' && !log.isEmergency)
        return matchesSearch && matchesFilter
    })

    const handleDisableBarcode = (barcodeId: string) => {
        updateStatusMutation.mutate({ id: barcodeId, status: 'disabled' })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Emergency Scan Logs</h1>
                    <p className="text-gray-500 mt-1 font-medium">Monitor all barcode scans and emergency alerts across the society.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Card className="flex items-center gap-3 px-4 py-2 border-0 shadow-sm ring-1 ring-black/5 rounded-2xl">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Live Monitoring</span>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Scans</p>
                    <p className="text-3xl font-black text-gray-900">{(logs || []).length}</p>
                </Card>
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Emergency Alerts</p>
                    <p className="text-3xl font-black text-red-600">{(logs || []).filter((l: any) => l.isEmergency).length}</p>
                </Card>
                <Card className="p-6 border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Active Barcodes</p>
                    <p className="text-3xl font-black text-teal-600">{(barcodes || []).filter((b: any) => b.status === 'active').length}</p>
                </Card>
            </div>

            <Card className="border-0 shadow-sm bg-white rounded-[40px] ring-1 ring-black/5 overflow-hidden">
                <CardHeader className="border-b border-gray-50 p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search by name, unit, or phone..."
                                className="pl-12 h-14 rounded-2xl border-0 bg-gray-50 focus:bg-white transition-all font-bold"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'emergency', 'normal'] as const).map((f) => (
                                <Button
                                    key={f}
                                    variant={filter === f ? 'default' : 'outline'}
                                    onClick={() => setFilter(f)}
                                    className={`h-14 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${filter === f ? 'bg-[#1e3a5f] hover:bg-[#2d4a6f] shadow-lg shadow-blue-100' : 'bg-white border-2 border-gray-100'
                                        }`}
                                >
                                    {f}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow className="border-0">
                                <TableHead className="px-8 text-[10px] font-black uppercase text-gray-400">Timestamp</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-400">Visitor Info</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-400">Resident / Unit</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-400">Type</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-400">Reason</TableHead>
                                <TableHead className="text-[10px] font-black uppercase text-gray-400 text-right px-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {(filteredLogs || []).map((log) => (
                                    <TableRow key={log.id} className="border-gray-50 group hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="px-8">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-xs font-bold text-gray-600">{new Date(log.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                                <span className="text-xs font-medium text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-bold text-gray-900">{log.visitorName}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{log.visitorPhone}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-teal-50 text-teal-700 border-0 rounded-full text-[10px] font-black px-2 shadow-none">{log.unit}</Badge>
                                                <p className="text-xs font-bold text-gray-600">{log.residentName}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`border-0 rounded-full text-[10px] font-black px-2 shadow-none ${log.isEmergency ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {log.isEmergency ? 'EMERGENCY' : 'NORMAL'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[200px]">
                                            <p className="text-xs text-gray-500 font-medium italic truncate" title={log.reason}>
                                                "{log.reason || 'No reason specified'}"
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-right px-8">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white shadow-sm ring-1 ring-black/5 ring-inset border-0 transition-all opacity-0 group-hover:opacity-100">
                                                        <MoreVertical className="h-4 w-4 text-gray-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-0 ring-1 ring-black/5">
                                                    <DropdownMenuItem
                                                        className="rounded-xl font-bold text-xs uppercase p-3"
                                                        onClick={() => toast.success('Viewing full resident details...')}
                                                    >
                                                        <User className="h-4 w-4 mr-2 text-[#1e3a5f]" /> View Resident
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="rounded-xl font-bold text-xs uppercase p-3 text-red-600 focus:text-red-600"
                                                        onClick={() => handleDisableBarcode(log.barcodeId)}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-2" /> Disable Barcode
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>

                    {filteredLogs.length === 0 && (
                        <div className="py-24 text-center">
                            <AlertTriangle className="h-12 w-12 text-gray-100 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900">No logs found</h3>
                            <p className="text-gray-400 mt-2 font-medium">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
