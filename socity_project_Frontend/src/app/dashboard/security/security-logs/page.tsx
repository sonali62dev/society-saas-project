'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
    Shield,
    AlertTriangle,
    Clock,
    User,
    MapPin,
    Search,
    Filter,
    CheckCircle2,
    FileText,
    Camera,
    History,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import SecurityService from '@/services/securityService'



export default function SecurityLogsPage() {
    const [activeTab, setActiveTab] = useState('incidents')
    const [searchQuery, setSearchQuery] = useState('')

    // Fetch Incidents
    const { data: incidentLogs = [], isLoading: isIncidentsLoading } = useQuery({
        queryKey: ['incidents', searchQuery],
        queryFn: () => SecurityService.getAllIncidents({ search: searchQuery }),
    })

    // Fetch Patrol Logs
    const { data: patrollingLogs = [], isLoading: isPatrolsLoading } = useQuery({
        queryKey: ['patrolLogs'],
        queryFn: () => SecurityService.getAllPatrolLogs(),
    })

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200'
            case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            default: return 'bg-blue-100 text-blue-700 border-blue-200'
        }
    }

    return (
        <RoleGuard allowedRoles={['admin', 'guard']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Shield className="h-7 w-7 text-blue-600" />
                            Security & Operations Logs
                        </h1>
                        <p className="text-muted-foreground">Monitor incidents and patrolling activities</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Export Logs
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search logs..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" className="gap-2">
                                <Filter className="h-4 w-4" />
                                Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Tabs */}
                <Tabs defaultValue="incidents" onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="bg-white border p-1 rounded-xl">
                        <TabsTrigger value="incidents" className="gap-2 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                            <AlertTriangle className="h-4 w-4" />
                            Incident Logs
                        </TabsTrigger>
                        <TabsTrigger value="patrolling" className="gap-2 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                            <History className="h-4 w-4" />
                            Patrolling Updates
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="incidents">
                        <Card className="border-0 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead>Incident ID</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead>Severity</TableHead>
                                        <TableHead>Reported By</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isIncidentsLoading ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                                    ) : incidentLogs.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No incidents found</TableCell></TableRow>
                                    ) : (
                                        incidentLogs.map((log: any) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-xs font-semibold">#INC-{log.id}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-bold text-gray-900">{log.title}</p>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{log.description}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                            <MapPin className="h-3 w-3" /> {log.location || 'N/A'}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                            <Clock className="h-3 w-3" /> {new Date(log.createdAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`capitalize shadow-none ${getSeverityColor(log.severity)}`}>
                                                    {log.severity}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">
                                                        {log.reportedBy?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className="text-xs">{log.reportedBy?.name || 'Unknown'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={log.status === 'resolved' ? 'secondary' : 'default'}
                                                    className={`uppercase text-[10px] ${log.status === 'resolved' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}
                                                >
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">View</Button>
                                            </TableCell>
                                        </TableRow>
                                    )))}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>

                    <TabsContent value="patrolling">
                        <Card className="border-0 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead>Patrol ID</TableHead>
                                        <TableHead>Guard Name</TableHead>
                                        <TableHead>Area Covered</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Notes</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isPatrolsLoading ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
                                    ) : patrollingLogs.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No patrol logs found</TableCell></TableRow>
                                    ) : (
                                        patrollingLogs.map((log: any) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-xs font-semibold">#PAT-{log.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-blue-500" />
                                                    <span className="text-sm">{log.guard?.name || 'Unknown'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">{log.area}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{new Date(log.startTime).toLocaleString()}</TableCell>
                                            <TableCell className="text-sm max-w-xs truncate">{log.notes || '-'}</TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-50 text-green-700 border-green-100 shadow-none uppercase text-[10px]">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                    {log.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )))}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </RoleGuard>
    )
}
