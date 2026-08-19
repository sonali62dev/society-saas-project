'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { EventService } from '@/services/event.service'
import { toast } from 'sonner'
import {
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  MapPin,
  Users,
  Clock,
  Eye,
  Edit,
  Trash2,
  PartyPopper,
  Sparkles,
  Heart,
  Trophy,
  Briefcase,
  Music,
  ArrowUpRight,
  MoreHorizontal,
  Share2,
  Bell,
  CheckCircle,
  CalendarPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'



const categoryIcons: Record<string, React.ElementType> = {
  festival: Sparkles,
  celebration: PartyPopper,
  wellness: Heart,
  meeting: Briefcase,
  sports: Trophy,
  cultural: Music,
}

const categoryColors: Record<string, { bg: string; text: string; gradient: string }> = {
  festival: { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-500 to-orange-600' },
  celebration: { bg: 'bg-pink-100', text: 'text-pink-700', gradient: 'from-pink-500 to-rose-600' },
  wellness: { bg: 'bg-green-100', text: 'text-green-700', gradient: 'from-green-500 to-emerald-600' },
  meeting: { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-500 to-indigo-600' },
  sports: { bg: 'bg-purple-100', text: 'text-purple-700', gradient: 'from-purple-500 to-violet-600' },
  cultural: { bg: 'bg-cyan-100', text: 'text-cyan-700', gradient: 'from-cyan-500 to-teal-600' },
}

const categories = [
  { value: 'festival', label: 'Festival', icon: Sparkles },
  { value: 'celebration', label: 'Celebration', icon: PartyPopper },
  { value: 'wellness', label: 'Wellness', icon: Heart },
  { value: 'meeting', label: 'Meeting', icon: Briefcase },
  { value: 'sports', label: 'Sports', icon: Trophy },
  { value: 'cultural', label: 'Cultural', icon: Music },
]

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  status: string;
  category: string;
  isRsvp: boolean;
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('upcoming')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [attendees, setAttendees] = useState<any[]>([])
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false)
  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'
  const queryClient = useQueryClient()

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'meeting',
    maxAttendees: 0,
    organizer: '',
  })

  const { data: eventsResponse, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: EventService.getAll,
  })

  const events: Event[] = eventsResponse?.data || []

  const createEventMutation = useMutation({
    mutationFn: EventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setIsCreateDialogOpen(false)
      toast.success('Event created successfully')
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'meeting',
        maxAttendees: 0,
        organizer: '',
      })
    },
    onError: (err: any) => toast.error(err.message || 'Failed to create event'),
  })

  const updateEventMutation = useMutation({
    mutationFn: (data: { id: number; data: any }) => EventService.update(data.id, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setIsEditDialogOpen(false)
      toast.success('Event updated successfully')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update event'),
  })

  const rsvpMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => EventService.rsvp(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('RSVP updated')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update RSVP'),
  })

  const deleteMutation = useMutation({
    mutationFn: EventService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event deleted successfully')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to delete event'),
  })

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
      toast.error('Please fill required fields')
      return
    }
    createEventMutation.mutate(newEvent)
  }

  const handleRsvp = (eventId: number, currentStatus: boolean) => {
    const newStatus = currentStatus ? 'CANCELLED' : 'RSVP'
    rsvpMutation.mutate({ id: eventId, status: newStatus })
  }

  const handleDeleteEvent = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setNewEvent({
      title: event.title,
      description: event.description || '',
      date: event.date.split('T')[0],
      time: event.time || '',
      location: event.location || '',
      category: event.category,
      maxAttendees: event.maxAttendees || 0,
      organizer: event.organizer || '',
    })
    setIsEditDialogOpen(true)
  }

  const handleViewDetails = async (event: Event) => {
    setSelectedEvent(event)
    setIsViewDetailsOpen(true)
    if (isAdmin) {
      setIsLoadingAttendees(true)
      try {
        const data = await EventService.getAttendees(event.id)
        setAttendees(data.data)
      } catch (error) {
        console.error('Failed to fetch attendees:', error)
      } finally {
        setIsLoadingAttendees(false)
      }
    }
  }

  const handleUpdateEvent = () => {
    if (!selectedEvent) return
    updateEventMutation.mutate({ id: selectedEvent.id, data: newEvent })
  }

  const handleShareEvent = async (event: Event) => {
    const shareText = `Check out this event: ${event.title}\nDate: ${new Date(event.date).toLocaleDateString()}\nLocation: ${event.location}\nOrganized by: ${event.organizer}`

    const copyToClipboard = () => {
      navigator.clipboard.writeText(`${shareText}\nLink: ${window.location.href}`)
      toast.success('Event details copied to clipboard')
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: shareText,
          url: window.location.href,
        })
      } catch (err: any) {
        // If it's not a user-initiated cancellation, fallback to clipboard
        if (err.name !== 'AbortError') {
          copyToClipboard()
        }
      }
    } else {
      copyToClipboard()
    }
  }

  const handleAddToCalendar = (event: Event) => {
    const startDate = new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "")
    const endDate = new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "")
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportCSV = () => {
    if (events.length === 0) return
    const headers = ['ID', 'Title', 'Category', 'Date', 'Time', 'Location', 'Organizer', 'Attendees', 'Status']
    const csvContent = [
      headers.join(','),
      ...events.map(e => [
        e.id,
        `"${e.title}"`,
        e.category,
        e.date,
        e.time,
        `"${e.location}"`,
        `"${e.organizer}"`,
        `${e.attendees}/${e.maxAttendees}`,
        e.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `events_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredEvents = (events || []).filter((event) => {
    const matchesSearch =
      (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (event.location?.toLowerCase() || '').includes(searchQuery.toLowerCase())

    const matchesTab = activeTab === 'all' || (event.status || '').toLowerCase() === activeTab.toLowerCase()
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter

    return matchesSearch && matchesTab && matchesCategory
  })

  const getStatusCounts = () => ({
    all: events.length,
    upcoming: events.filter(e => e.status.toLowerCase() === 'upcoming').length,
    completed: events.filter(e => e.status.toLowerCase() === 'completed').length,
  })

  const counts = getStatusCounts()

  const upcomingCount = events.filter(e => {
    const eventDate = new Date(e.date)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return eventDate >= new Date() && eventDate <= thirtyDaysFromNow
  }).length

  const thisMonthCount = events.filter(e => {
    const date = new Date(e.date)
    const now = new Date()
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
  }).length

  const totalAttendees = events.reduce((sum, e) => sum + (e.attendees || 0), 0)

  const dashboardStats = [
    {
      title: 'Total Events',
      value: events.length.toString(),
      change: `+${events.filter(e => new Date(e.date).getFullYear() === new Date().getFullYear()).length} this year`,
      icon: Calendar,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Upcoming',
      value: upcomingCount.toString(),
      change: 'Next 30 days',
      icon: Clock,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      pulse: true,
    },
    {
      title: 'This Month',
      value: thisMonthCount.toString(),
      change: `${events.filter(e => e.isRsvp).length} you RSVP'd`,
      icon: Calendar,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total Attendees',
      value: totalAttendees.toLocaleString(),
      change: 'Across all events',
      icon: Users,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      trend: 'up',
    },
  ]

  return (
    <RoleGuard allowedRoles={['admin', 'resident']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Events & Activities
                </h1>
                <p className="text-muted-foreground text-sm">
                  {isAdmin ? 'Manage society events and activities' : 'Discover and join community events'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            {isAdmin && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2 shadow-lg shadow-purple-500/25">
                    <Plus className="h-4 w-4" />
                    <span>Create Event</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Create New Event
                    </DialogTitle>
                    <DialogDescription>
                      Schedule a new event for the society
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Event Title *</Label>
                      <Input
                        placeholder="e.g., Diwali Celebration"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe the event details..."
                        rows={3}
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date *</Label>
                        <Input
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time *</Label>
                        <Input
                          type="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Venue *</Label>
                        <Input
                          placeholder="e.g. Community Hall"
                          value={newEvent.location}
                          onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <Select
                          value={newEvent.category}
                          onValueChange={(val) => setNewEvent({ ...newEvent, category: val })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => {
                              const Icon = cat.icon
                              return (
                                <SelectItem key={cat.value} value={cat.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {cat.label}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Max Attendees</Label>
                        <Input
                          type="number"
                          placeholder="100"
                          value={newEvent.maxAttendees}
                          onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Organizer</Label>
                        <Input
                          placeholder="e.g., Cultural Committee"
                          value={newEvent.organizer}
                          onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                        onClick={handleCreateEvent}
                        disabled={createEventMutation.isPending}
                      >
                        <CalendarPlus className="h-4 w-4" />
                        {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                          {isLoading ? '...' : stat.value}
                        </h3>
                        <div className="flex items-center gap-1 mt-2">
                          {stat.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-green-500" />}
                          <p className="text-sm text-muted-foreground">{stat.change}</p>
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor} relative`}>
                        {stat.pulse && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
                        <Icon className={`h-6 w-6 ${stat.textColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search events by title, description, or venue..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b w-full justify-start rounded-none h-auto p-0 space-x-6">
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-purple-600 rounded-none px-0 pb-3"
            >
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse mr-2" />
              Upcoming <Badge className="ml-2 bg-green-100 text-green-700">{counts.upcoming}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-gray-600 rounded-none px-0 pb-3"
            >
              Completed <Badge variant="secondary" className="ml-2">{counts.completed}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none px-0 pb-3"
            >
              All Events <Badge variant="secondary" className="ml-2">{counts.all}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Sparkles className="h-8 w-8 text-purple-600 animate-spin" />
            <span className="ml-2">Loading events...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No events found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredEvents.map((event, index) => {
                const CategoryIcon = categoryIcons[event.category] || Calendar
                const colors = categoryColors[event.category] || categoryColors.meeting
                const attendeePercentage = (event.attendees / (event.maxAttendees || 1)) * 100

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      {/* Header Banner */}
                      <div className={`h-32 bg-gradient-to-br ${colors.gradient} relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute top-4 left-4">
                          <Badge className={`${colors.bg} ${colors.text} border-0`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {event.category}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge
                            className={`${event.status.toLowerCase() === 'upcoming'
                              ? 'bg-white/90 text-green-700'
                              : 'bg-white/90 text-gray-700'
                              } border-0`}
                          >
                            {event.status.toLowerCase() === 'upcoming' && <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />}
                            {event.status}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="text-lg font-bold truncate">{event.title}</h3>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                            <span className="text-muted-foreground">at</span>
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        {/* Attendees Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Attendees
                            </span>
                            <span className="font-medium">
                              {event.attendees}/{event.maxAttendees}
                            </span>
                          </div>
                          <Progress value={attendeePercentage} className="h-2" />
                          {attendeePercentage >= 100 && (
                            <p className="text-xs text-red-600">Event is full.</p>
                          )}
                          {attendeePercentage >= 90 && attendeePercentage < 100 && (
                            <p className="text-xs text-orange-600">Almost full! Book now.</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <p className="text-xs text-muted-foreground">By {event.organizer}</p>
                          <div className="flex items-center gap-1">
                            {event.status.toLowerCase() === 'upcoming' && (
                              <Button
                                size="sm"
                                onClick={() => handleRsvp(event.id, event.isRsvp)}
                                disabled={rsvpMutation.isPending || (attendeePercentage >= 100 && !event.isRsvp)}
                                className={`gap-1 ${event.isRsvp
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                                  }`}
                              >
                                {event.isRsvp ? (
                                  <>
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    RSVP'd
                                  </>
                                ) : (
                                  <>
                                    <CalendarPlus className="h-3.5 w-3.5" />
                                    RSVP
                                  </>
                                )}
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(event)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleShareEvent(event)}>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share Event
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddToCalendar(event)}>
                                  <CalendarPlus className="h-4 w-4 mr-2" />
                                  Add to Calendar
                                </DropdownMenuItem>
                                {isAdmin && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Event
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDeleteEvent(event.id)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Cancel Event
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
        {/* View Details Dialog */}
        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {selectedEvent && (
                  <>
                    <Calendar className="h-6 w-6 text-purple-600" />
                    {selectedEvent.title}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold text-foreground">Date:</span>
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold text-foreground">Time:</span> {selectedEvent.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="font-semibold text-foreground">Location:</span> {selectedEvent.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold text-foreground">Capacity:</span> {selectedEvent.attendees}/{selectedEvent.maxAttendees}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedEvent.description}</p>
                </div>

                {isAdmin && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center justify-between">
                      Attendee List
                      <Badge variant="outline">{attendees.length} Registered</Badge>
                    </h4>
                    {isLoadingAttendees ? (
                      <div className="flex justify-center p-8">
                        <Sparkles className="h-6 w-6 animate-spin text-purple-600" />
                      </div>
                    ) : attendees.length > 0 ? (
                      <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
                        {attendees.map((attendee) => (
                          <div key={attendee.id} className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                                {attendee.name[0]}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{attendee.name}</p>
                                <p className="text-xs text-muted-foreground">{attendee.email}</p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{attendee.phone}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        No attendees registered yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Event Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Event Title</Label>
                <Input
                  id="edit-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea
                  id="edit-desc"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-loc">Location</Label>
                <Input
                  id="edit-loc"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-cat">Category</Label>
                  <Select
                    value={newEvent.category}
                    onValueChange={(v) => setNewEvent({ ...newEvent, category: v })}
                  >
                    <SelectTrigger id="edit-cat">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="festival">Festival</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-max">Max Attendees</Label>
                  <Input
                    id="edit-max"
                    type="number"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({ ...newEvent, maxAttendees: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-org">Organizer</Label>
                <Input
                  id="edit-org"
                  value={newEvent.organizer}
                  onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleUpdateEvent}
                disabled={updateEventMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {updateEventMutation.isPending ? 'Updating...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
