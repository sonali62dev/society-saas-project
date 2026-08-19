'use client'

import { useState } from 'react'
import { ServiceComplaint } from '@/types/services'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Clock, CheckCircle2, AlertTriangle, Building2, User, Users, MessageSquare } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ViewComplaintDialog } from './view-complaint-dialog'
import { cn } from '@/lib/utils/cn'

interface ComplaintsTableProps {
    complaints: ServiceComplaint[]
    showSource?: boolean
}

export function ComplaintsTable({ complaints, showSource = true }: ComplaintsTableProps) {
    const [selectedComplaint, setSelectedComplaint] = useState<ServiceComplaint | null>(null)
    const [viewOpen, setViewOpen] = useState(false)

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase()
        switch (s) {
            case 'open': return 'bg-red-100 text-red-700 border-red-200'
            case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'resolved': return 'bg-green-100 text-green-700 border-green-200'
            case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-500 text-white'
            case 'high': return 'bg-orange-500 text-white'
            case 'medium': return 'bg-yellow-500 text-white'
            case 'low': return 'bg-blue-500 text-white'
            default: return 'bg-gray-500 text-white'
        }
    }

    const getSourceIcon = (source: string) => {
        switch (source) {
            case 'society': return <Building2 className="h-4 w-4 text-purple-500" />
            case 'resident': return <Users className="h-4 w-4 text-orange-500" />
            case 'individual': return <User className="h-4 w-4 text-blue-500" />
            default: return <User className="h-4 w-4" />
        }
    }

    return (
        <div className="border-0 shadow-2xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-slate-800/30 rounded-2xl w-full max-w-[100vw] overflow-x-auto">
            <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800/50">
                    <TableRow className="hover:bg-transparent border-0 font-bold uppercase tracking-wider text-[10px]">
                        <TableHead className="w-[80px]">ID</TableHead>
                        {showSource && <TableHead>Source</TableHead>}
                        <TableHead>Society</TableHead>
                        <TableHead className="min-w-[200px]">Complaint Details</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {complaints.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-20 text-slate-400 font-medium">
                                <div className="flex flex-col items-center gap-3">
                                    <MessageSquare className="h-10 w-10 opacity-20" />
                                    No complaints recorded.
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        complaints.map((complaint) => (
                            <TableRow key={complaint.id} className="hover:bg-white/50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0 group">
                                <TableCell className="font-black text-[10px] text-slate-400 group-hover:text-indigo-500 transition-colors">
                                    #{complaint.id}
                                </TableCell>

                                {showSource && (
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 shadow-inner group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                                                {getSourceIcon(complaint.source)}
                                            </div>
                                            <span className="capitalize text-xs font-bold text-slate-700 dark:text-slate-300">{complaint.source}</span>
                                        </div>
                                    </TableCell>
                                )}

                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20">
                                            <Building2 className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{complaint.society?.name || 'Platform'}</span>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="max-w-[250px]">
                                        <p className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-0.5">{complaint.title}</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                            {complaint.description}
                                        </p>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge variant="outline" className="bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-[10px] font-bold tracking-tight">
                                        {complaint.serviceName}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <div className="flex items-center gap-2.5">
                                        <Avatar className="h-8 w-8 rounded-xl ring-2 ring-white dark:ring-slate-800 shadow-sm">
                                            <AvatarFallback className="text-[10px] font-black bg-gradient-to-br from-indigo-500 to-purple-600 text-white leading-none">
                                                {(complaint.reportedBy || 'U').charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate leading-none mb-1">{complaint.reportedBy || 'Unknown User'}</span>
                                            {complaint.unit && (
                                                <span className="text-[10px] text-slate-400 font-medium">Unit: {complaint.unit}</span>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <Badge className={`${getPriorityColor(complaint.priority)} border-0 text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-lg shadow-sm`}>
                                        {complaint.priority}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-[10px] font-black border-0 uppercase tracking-tighter shadow-sm", getStatusColor(complaint.status))}>
                                        {complaint.status.toLowerCase() === 'resolved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                        {complaint.status.toLowerCase() === 'open' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                        {complaint.status.replace('_', ' ')}
                                    </Badge>
                                </TableCell>

                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group-hover:scale-110"
                                        onClick={() => {
                                            setSelectedComplaint(complaint)
                                            setViewOpen(true)
                                        }}
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )))}
                </TableBody>
            </Table>
            <ViewComplaintDialog
                complaint={selectedComplaint}
                open={viewOpen}
                onOpenChange={setViewOpen}
            />
        </div>
    )
}
