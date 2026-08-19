'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import { useAuthStore } from '@/lib/stores/auth-store'
import {
  Calendar,
  Clock,
  IndianRupee,
  Users,
  MapPin,
  Plus,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Dumbbell,
  Waves,
  PartyPopper,
  Volleyball,
  Utensils,
  Building,
  ArrowUpRight,
  Eye,
  MoreHorizontal,
  CalendarCheck,
  AlertCircle,
  Settings,
  History,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { AmenityService } from '@/services/amenity.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const amenityIcons: Record<string, React.ElementType> = {
  hall: PartyPopper,
  pool: Waves,
  gym: Dumbbell,
  court: Volleyball,
  dining: Utensils,
  other: Building,
}

const amenityColors: Record<string, { bg: string; text: string; gradient: string }> = {
  hall: { bg: 'bg-pink-100', text: 'text-pink-700', gradient: 'from-pink-500 to-rose-600' },
  pool: { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-500 to-cyan-600' },
  gym: { bg: 'bg-orange-100', text: 'text-orange-700', gradient: 'from-orange-500 to-amber-600' },
  court: { bg: 'bg-green-100', text: 'text-green-700', gradient: 'from-green-500 to-emerald-600' },
  dining: { bg: 'bg-purple-100', text: 'text-purple-700', gradient: 'from-purple-500 to-violet-600' },
  other: { bg: 'bg-gray-100', text: 'text-gray-700', gradient: 'from-gray-500 to-slate-600' },
}

const DEFAULT_AMENITIES = [
  { id: 101, name: 'Club House', type: 'hall', description: 'Multipurpose luxury clubhouse for celebrations and indoor gatherings', capacity: 150, chargesPerHour: 500, status: 'available', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], timings: { start: '09:00', end: '22:00' } },
  { id: 102, name: 'Swimming Pool', type: 'pool', description: 'Olympic size temperature-controlled swimming pool with toddler splash zone', capacity: 30, chargesPerHour: 0, status: 'available', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], timings: { start: '06:00', end: '21:00' } },
  { id: 103, name: 'Gym & Fitness Center', type: 'gym', description: 'State-of-the-art gym with modern cardio & strength training equipment', capacity: 25, chargesPerHour: 0, status: 'available', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], timings: { start: '06:00', end: '22:00' } },
  { id: 104, name: 'Community Hall', type: 'hall', description: 'Air-conditioned hall for society meetings, cultural events, and festivals', capacity: 200, chargesPerHour: 1000, status: 'available', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], timings: { start: '09:00', end: '23:00' } },
  { id: 105, name: 'Party Lawn', type: 'hall', description: 'Lush green open lawn suitable for outdoor parties, receptions & dinners', capacity: 300, chargesPerHour: 1500, status: 'available', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], timings: { start: '10:00', end: '23:00' } },
  { id: 106, name: 'Sports Area & Badminton Court', type: 'court', description: 'Synthetic indoor court for badminton, table tennis, and sports training', capacity: 20, chargesPerHour: 200, status: 'available', availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], timings: { start: '06:00', end: '21:00' } },
]

function BookingDialog({
  amenity,
  onBookingComplete
}: {
  amenity: any,
  onBookingComplete?: (message: string) => void
}) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [purpose, setPurpose] = useState('')

  const bookMutation = useMutation({
    mutationFn: residentService.bookAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] })
      setIsOpen(false)
      toast.success(`${amenity.name} booked successfully! Opening My Bookings...`)
      if (onBookingComplete) onBookingComplete('bookings')
      setSelectedDate('')
      setStartTime('')
      setEndTime('')
      setPurpose('')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to book amenity')
  })

  const calculateTotal = () => {
    if (!startTime || !endTime) return 0
    const start = parseInt(startTime.split(':')[0])
    const end = parseInt(endTime.split(':')[0])
    const hours = end - start
    return (amenity.chargesPerHour || 0) * hours
  }

  const handleConfirmBooking = () => {
    if (!selectedDate || !startTime || !endTime || !purpose) {
      toast.error('Please fill all required fields')
      return
    }
    bookMutation.mutate({
      amenityId: amenity.id,
      date: selectedDate,
      startTime,
      endTime,
      purpose,
      amount: calculateTotal()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-blue-700 hover:to-purple-700 gap-2"
          disabled={amenity.status !== 'available'}
        >
          {amenity.status === 'available' ? (
            <>
              <CalendarCheck className="h-4 w-4" />
              Book Now
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" />
              Under Maintenance
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-blue-600" />
            Book {amenity.name}
          </DialogTitle>
          <DialogDescription>
            Select date and time for your booking
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${amenityColors[amenity.type].bg}`}>
                {(() => {
                  const Icon = amenityIcons[amenity.type]
                  return <Icon className={`h-5 w-5 ${amenityColors[amenity.type].text}`} />
                })()}
              </div>
              <div>
                <p className="font-medium">{amenity.name}</p>
                <p className="text-sm text-muted-foreground">
                  {amenity.chargesPerHour === 0 ? 'Free' : `Rs. ${amenity.chargesPerHour}/hr`}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date *</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Available: {Array.isArray(amenity.availableDays) ? amenity.availableDays.join(', ') : 'All Days'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time *</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }, (_, i) => i + 6).map((hour) => (
                    <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {hour.toString().padStart(2, '0')}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>End Time *</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }, (_, i) => i + 7).map((hour) => (
                    <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {hour.toString().padStart(2, '0')}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Purpose *</Label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="party">Birthday/Anniversary Party</SelectItem>
                <SelectItem value="meeting">Meeting/Gathering</SelectItem>
                <SelectItem value="sports">Sports Activity</SelectItem>
                <SelectItem value="fitness">Fitness/Yoga</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Summary */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-medium">
                {startTime && endTime
                  ? `${parseInt(endTime.split(':')[0]) - parseInt(startTime.split(':')[0])} hours`
                  : '-'
                }
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium">
                {amenity.chargesPerHour === 0 || !amenity.chargesPerHour ? 'Free' : `Rs. ${amenity.chargesPerHour}/hr`}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-blue-200">
              <span className="font-semibold">Total Amount</span>
              <span className="text-xl font-bold text-blue-600">
                {amenity.chargesPerHour === 0 || !amenity.chargesPerHour ? 'Free' : `Rs. ${calculateTotal()}`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-blue-700 hover:to-purple-700 gap-2"
              onClick={handleConfirmBooking}
              disabled={bookMutation.isPending}
            >
              {bookMutation.isPending ? 'Booking...' : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Confirm Booking
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AmenitiesPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('amenities')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'pending'>('all')
  const [historyFilter, setHistoryFilter] = useState<'all' | 'completed' | 'cancelled'>('all')
  const isAdmin = user?.role === 'admin'
  const queryClient = useQueryClient()
  const [newAmenity, setNewAmenity] = useState({
    name: '',
    type: 'other',
    description: '',
    capacity: 0,
    chargesPerHour: 0,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    timings: { start: '09:00', end: '22:00' },
    status: 'available'
  })

  const { data: amenitiesData, isLoading, error } = useQuery({
    queryKey: ['amenities'],
    queryFn: residentService.getAmenities
  })

  const createAmenityMutation = useMutation({
    mutationFn: AmenityService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] })
      setIsAddDialogOpen(false)
      toast.success('Amenity added successfully!')
      setNewAmenity({
        name: '',
        type: 'other',
        description: '',
        capacity: 0,
        chargesPerHour: 0,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        timings: { start: '09:00', end: '22:00' },
        status: 'available'
      })
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add amenity')
  })

  const rawAmenities = amenitiesData?.amenities || []
  const amenities = rawAmenities.length > 0 ? rawAmenities : DEFAULT_AMENITIES
  const allBookings = amenitiesData?.myBookings || []

  const upcomingBookings = allBookings.filter((b: any) => {
    const isUpcoming = new Date(b.date) >= new Date(new Date().setHours(0, 0, 0, 0)) && b.status !== 'CANCELLED'
    if (!isUpcoming) return false
    if (bookingFilter === 'confirmed') return b.status === 'CONFIRMED' || b.status === 'APPROVED'
    if (bookingFilter === 'pending') return b.status === 'PENDING'
    return true
  })

  const pastBookings = allBookings.filter((b: any) => {
    const isHistory = new Date(b.date) < new Date(new Date().setHours(0, 0, 0, 0)) || b.status === 'CANCELLED' || b.status === 'COMPLETED'
    if (!isHistory) return false
    if (historyFilter === 'completed') return b.status === 'COMPLETED' || (new Date(b.date) < new Date() && b.status !== 'CANCELLED')
    if (historyFilter === 'cancelled') return b.status === 'CANCELLED'
    return true
  })

  const handleAddAmenity = () => {
    if (!newAmenity.name) {
      toast.error('Name is required')
      return
    }
    createAmenityMutation.mutate(newAmenity)
  }

  const handleViewDetails = (bookingId: string) => {
    toast.info(`Viewing booking details #${bookingId}`)
  }

  const handleCancelBooking = (id: number) => {
    if (confirm('Are you sure you want to cancel this amenity booking?')) {
      updateStatusMutation.mutate({ id, status: 'CANCELLED' })
    }
  }

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: string }) => AmenityService.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] })
      toast.success('Booking status updated successfully!')
    },
    onError: (err: any) => toast.error('Failed to update booking status')
  })

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatusMutation.mutate({ id, status })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (isLoading) return <div className="p-8"><Skeleton className="w-full h-[600px] rounded-3xl" /></div>
  if (error) return <div className="p-8 text-red-500">Error loading amenities</div>

  return (
    <RoleGuard allowedRoles={['admin', 'resident', 'committee', 'society_admin', 'super_admin']}>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a5f]">
                  {isAdmin ? 'Amenities Management' : 'Amenities Booking'}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {isAdmin
                    ? 'Manage and monitor amenity bookings'
                    : 'Book facilities and amenities for your events'}
                </p>
              </div>
            </div>
          </div>
          {isAdmin && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 gap-2 shadow-lg shadow-teal-500/25">
                  <Plus className="h-4 w-4" />
                  Add Amenity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Amenity</DialogTitle>
                  <DialogDescription>
                    Create a new facility or amenity for residents to book
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amenity Name</Label>
                      <Input
                        placeholder="e.g. Mini Theater"
                        value={newAmenity.name}
                        onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amenity Type</Label>
                      <Select
                        value={newAmenity.type}
                        onValueChange={(value) => setNewAmenity({ ...newAmenity, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hall">Party Hall / Clubhouse</SelectItem>
                          <SelectItem value="pool">Swimming Pool</SelectItem>
                          <SelectItem value="gym">Gym / Fitness Center</SelectItem>
                          <SelectItem value="court">Sports Court</SelectItem>
                          <SelectItem value="dining">Dining Area</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Capacity (Persons)</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 50"
                        value={newAmenity.capacity}
                        onChange={(e) => setNewAmenity({ ...newAmenity, capacity: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price per Hour (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0 for free"
                        value={newAmenity.chargesPerHour}
                        onChange={(e) => setNewAmenity({ ...newAmenity, chargesPerHour: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Describe the amenity and its features..."
                      rows={3}
                      value={newAmenity.description}
                      onChange={(e) => setNewAmenity({ ...newAmenity, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Available Days</Label>
                    <div className="flex flex-wrap gap-4">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="flex items-center gap-2">
                          <Checkbox
                            id={`day-${day}`}
                            checked={newAmenity.availableDays.includes(day)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewAmenity({ ...newAmenity, availableDays: [...newAmenity.availableDays, day] })
                              } else {
                                setNewAmenity({ ...newAmenity, availableDays: newAmenity.availableDays.filter(d => d !== day) })
                              }
                            }}
                          />
                          <label htmlFor={`day-${day}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Select
                        value={newAmenity.timings.start}
                        onValueChange={(val) => setNewAmenity({ ...newAmenity, timings: { ...newAmenity.timings, start: val } })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                            const val = `${hour.toString().padStart(2, '0')}:00`
                            return <SelectItem key={hour} value={val}>{val}</SelectItem>
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Select
                        value={newAmenity.timings.end}
                        onValueChange={(val) => setNewAmenity({ ...newAmenity, timings: { ...newAmenity.timings, end: val } })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => i).map((hour) => {
                            const val = `${hour.toString().padStart(2, '0')}:00`
                            return <SelectItem key={hour} value={val}>{val}</SelectItem>
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter className="pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                      onClick={handleAddAmenity}
                      disabled={createAmenityMutation.isPending}
                    >
                      {createAmenityMutation.isPending ? 'Creating...' : 'Create Amenity'}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
            <TabsList className="bg-transparent border-b w-max sm:w-full justify-start rounded-none h-auto p-0 space-x-4 sm:space-x-6">
              <TabsTrigger
                value="amenities"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-blue-600 rounded-none px-0 pb-3 text-sm sm:text-base whitespace-nowrap"
              >
                <Building className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">All Amenities</span>
                <span className="sm:hidden">Amenities</span>
              </TabsTrigger>
              <TabsTrigger
                value="bookings"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-green-600 rounded-none px-0 pb-3 text-sm sm:text-base whitespace-nowrap"
              >
                <CalendarCheck className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">My Bookings</span>
                <span className="sm:hidden">Bookings</span>
                <Badge className="ml-1 sm:ml-2 bg-green-100 text-green-700 text-xs">{upcomingBookings.length}</Badge>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-gray-600 rounded-none px-0 pb-3 text-sm sm:text-base whitespace-nowrap"
              >
                <History className="h-4 w-4 mr-1 sm:mr-2" />
                History
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-yellow-500 rounded-none px-0 pb-3 text-sm sm:text-base whitespace-nowrap"
                >
                  <AlertCircle className="h-4 w-4 mr-1 sm:mr-2" />
                  Pending Requests
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {amenities.map((amenity: any, index: number) => {
                  const AmenityIcon = amenityIcons[amenity.type] || Building
                  const colors = amenityColors[amenity.type] || amenityColors.other

                  return (
                    <motion.div
                      key={amenity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        {/* Header */}
                        <div className={`h-36 bg-gradient-to-br ${colors.gradient} relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-black/10" />
                          <div className="absolute top-4 left-4">
                            <Badge
                              className={`border-0 ${amenity.status === 'available'
                                ? 'bg-white/90 text-green-700'
                                : 'bg-white/90 text-orange-700'
                                }`}
                            >
                              {amenity.status === 'available' && (
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                              )}
                              {amenity.status}
                            </Badge>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <AmenityIcon className="h-16 w-16 text-white/80" />
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-bold text-white">{amenity.name}</h3>
                          </div>
                        </div>

                        <CardContent className="p-4 space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {amenity.description}
                          </p>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{amenity.capacity} people</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {typeof amenity.timings === 'object' && amenity.timings !== null
                                  ? `${amenity.timings.start} - ${amenity.timings.end}`
                                  : amenity.timings || 'N/A'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <IndianRupee className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {amenity.chargesPerHour === 0 ? 'Free' : `Rs. ${amenity.chargesPerHour}/hr`}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{amenity.bookingsCount || 0} today</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Available:</span>
                            <div className="flex gap-1">
                              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                <span
                                  key={day}
                                  className={`px-1.5 py-0.5 rounded ${amenity.availableDays?.includes(day)
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                  {day[0]}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <BookingDialog amenity={amenity} onBookingComplete={(tab) => setActiveTab(tab)} />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* Pending Approvals Tab (Admin Only) */}
          {isAdmin && (
            <TabsContent value="pending" className="mt-6 space-y-4">
              {allBookings.filter((b: any) => b.status === 'PENDING').length > 0 ? (
                allBookings.filter((b: any) => b.status === 'PENDING').map((booking: any) => (
                  <Card key={booking.id} className="border-l-4 border-l-yellow-500 shadow-sm">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">{booking.amenity?.name || 'Unknown Amenity'}</h3>
                        <p className="text-sm text-muted-foreground">
                          Requested by: <span className="font-medium text-foreground">{booking.user?.name}</span>
                          {booking.user?.ownedUnits?.[0] && ` (Unit: ${booking.user.ownedUnits[0].block}-${booking.user.ownedUnits[0].number})`}
                        </p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(booking.date)}</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.startTime} - {booking.endTime}</span>
                        </div>
                        <p className="text-sm mt-1">Purpose: {booking.purpose}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleUpdateStatus(booking.id, 'APPROVED')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-xl">
                  <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p>No pending booking requests</p>
                </div>
              )}
            </TabsContent>
          )}

          {/* My Bookings Tab */}
          <TabsContent value="bookings" className="mt-6 space-y-4">
            {/* Sub-filter Navigation Pills */}
            <div className="flex flex-wrap gap-2 pb-2">
              <Button
                size="sm"
                variant={bookingFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setBookingFilter('all')}
                className="text-xs rounded-full h-8"
              >
                Upcoming All
              </Button>
              <Button
                size="sm"
                variant={bookingFilter === 'confirmed' ? 'default' : 'outline'}
                onClick={() => setBookingFilter('confirmed')}
                className="text-xs rounded-full h-8"
              >
                Confirmed / Approved
              </Button>
              <Button
                size="sm"
                variant={bookingFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setBookingFilter('pending')}
                className="text-xs rounded-full h-8"
              >
                Pending
              </Button>
            </div>

            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking: any, index: number) => {
                const bookingAmenity = booking.amenity || {}
                const AmenityIcon = amenityIcons[bookingAmenity.type] || Building
                const colors = amenityColors[bookingAmenity.type] || amenityColors.other

                const statusStyles: Record<string, string> = {
                  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
                  APPROVED: "bg-green-100 text-green-700 border-green-200",
                  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
                  REJECTED: "bg-red-100 text-red-700 border-red-200",
                  CANCELLED: "bg-gray-100 text-gray-700 border-gray-200"
                }

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${colors.bg}`}>
                              <AmenityIcon className={`h-6 w-6 ${colors.text}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{bookingAmenity.name}</h3>
                              <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                              <div className="flex items-center gap-3 mt-1 text-sm">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(booking.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {booking.startTime} - {booking.endTime}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-blue-600">
                                {booking.amountPaid === 0 ? 'Free' : `Rs. ${booking.amountPaid}`}
                              </p>
                              <Badge className={`${statusStyles[booking.status] || statusStyles.PENDING} border`}>
                                {booking.status === 'APPROVED' || booking.status === 'CONFIRMED' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                                {booking.status}
                              </Badge>
                            </div>
                            {(booking.status === 'PENDING' || booking.status === 'APPROVED' || booking.status === 'CONFIRMED') && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 text-xs font-semibold px-3 rounded-lg flex items-center gap-1"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Cancel Booking</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <CalendarCheck className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No upcoming bookings</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Book an amenity to see your reservations here
                </p>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6 space-y-4">
            {/* Sub-filter Navigation Pills */}
            <div className="flex flex-wrap gap-2 pb-2">
              <Button
                size="sm"
                variant={historyFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setHistoryFilter('all')}
                className="text-xs rounded-full h-8"
              >
                All History
              </Button>
              <Button
                size="sm"
                variant={historyFilter === 'completed' ? 'default' : 'outline'}
                onClick={() => setHistoryFilter('completed')}
                className="text-xs rounded-full h-8"
              >
                Completed
              </Button>
              <Button
                size="sm"
                variant={historyFilter === 'cancelled' ? 'default' : 'outline'}
                onClick={() => setHistoryFilter('cancelled')}
                className="text-xs rounded-full h-8"
              >
                Cancelled
              </Button>
            </div>
            {pastBookings.length > 0 ? (
              pastBookings.map((booking: any, index: number) => {
                const bookingAmenity = booking.amenity || {}
                const AmenityIcon = amenityIcons[bookingAmenity.type] || Building

                const statusStyles: Record<string, string> = {
                  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
                  APPROVED: "bg-green-100 text-green-700 border-green-200",
                  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
                  REJECTED: "bg-red-100 text-red-700 border-red-200",
                  CANCELLED: "bg-gray-100 text-gray-700 border-gray-200",
                  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200"
                }

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-lg opacity-80">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-gray-100`}>
                              <AmenityIcon className="h-6 w-6 text-gray-500" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{bookingAmenity.name}</h3>
                              <p className="text-sm text-muted-foreground">{booking.purpose}</p>
                              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {formatDate(booking.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {booking.startTime} - {booking.endTime}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-muted-foreground">
                              {booking.amountPaid === 0 ? 'Free' : `Rs. ${booking.amountPaid}`}
                            </p>
                            <Badge className={`${statusStyles[booking.status] || statusStyles.COMPLETED} border`}>
                              {booking.status === 'APPROVED' || booking.status === 'CONFIRMED' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <History className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No booking history</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your past bookings will appear here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
