'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RoleGuard } from '@/components/auth/role-guard'
import {
    Calendar,
    Plus,
    Search,
    Filter,
    Users,
    MapPin,
    Clock,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Video,
    FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { MeetingService } from '@/services/meeting.service'

export default function MeetingsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        type: 'physical',
        description: '',
    })
    const queryClient = useQueryClient()

    // Fetch meetings from API
    const { data: meetingsData, isLoading } = useQuery({
        queryKey: ['meetings'],
        queryFn: MeetingService.getAll,
    })

    const meetings = meetingsData?.data || []

    // Create meeting mutation
    const createMutation = useMutation({
        mutationFn: MeetingService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetings'] })
            setIsModalOpen(false)
            setFormData({ title: '', date: '', time: '', location: '', type: 'physical', description: '' })
        },
    })

    const handleCreate = () => {
        createMutation.mutate({
            title: formData.title,
            date: formData.date,
            time: formData.time,
            location: formData.location,
            description: formData.description,
        })
    }

    interface Meeting {
        id: number;
        title: string;
        description?: string;
        agenda?: string;
        status: string;
        date: string;
        time: string;
        location: string;
        type: string;
        attendees: string[];
    }

    // Replace implicit any with explicit Meeting type
    const filteredMeetings = meetings.filter((m: Meeting) =>
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <RoleGuard allowedRoles={['admin']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Society Meetings</h1>
                        <p className="text-muted-foreground">Schedule and manage committee & society meetings</p>
                    </div>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white gap-2 shadow-lg">
                                <Plus className="h-4 w-4" />
                                Schedule Meeting
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Schedule New Meeting</DialogTitle>
                                <DialogDescription>Fill in the details for the society meeting.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Finance Review"
                                        className="col-span-3"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="date" className="text-right">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        className="col-span-3"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="time" className="text-right">Time</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        className="col-span-3"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="location" className="text-right">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="Clubhouse / Zoom"
                                        className="col-span-3"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-right">Type</Label>
                                    <Select defaultValue="physical">
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="physical">Physical</SelectItem>
                                            <SelectItem value="online">Online</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="agenda" className="text-right">Agenda</Label>
                                    <Textarea
                                        id="agenda"
                                        placeholder="Points to discuss..."
                                        className="col-span-3"
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button
                                    className="bg-teal-600 hover:bg-teal-700 text-white"
                                    onClick={handleCreate}
                                    disabled={createMutation.isPending}
                                >
                                    {createMutation.isPending ? 'Scheduling...' : 'Schedule'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search meetings by title or agenda..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Meeting Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredMeetings.map((meeting: Meeting) => (
                        <motion.div key={meeting.id} layout>
                            <Card className="h-full hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={meeting.status === 'completed' ? 'secondary' : 'default'} className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50">
                                                {meeting.status.toUpperCase()}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{meeting.id}</span>
                                        </div>
                                        <CardTitle className="text-lg font-bold">{meeting.title}</CardTitle>
                                    </div>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(meeting.date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            {meeting.time}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                                            {meeting.type === 'online' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                                            {meeting.location}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <p className="text-sm font-semibold flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-teal-600" />
                                            Agenda
                                        </p>
                                        <p className="text-sm text-gray-600 whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            {meeting.description || meeting.agenda || 'No agenda provided'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                {(meeting.attendees || []).map((attendee: string, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="h-7 w-7 rounded-full border-2 border-white bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700"
                                                    >
                                                        {attendee.charAt(0)}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-xs text-muted-foreground">{(meeting.attendees || []).length} Attendees</span>
                                        </div>
                                        <Button size="sm" variant="outline" className="text-xs h-8">
                                            View Details
                                            <ChevronRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                </div>
            </div>
        </RoleGuard>
    )
}
