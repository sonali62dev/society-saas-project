'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Search,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AmenityService, { Amenity, AmenityBooking } from '@/services/amenityService'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

function formatSafeDate(value: string | Date | null | undefined, fmt: string): string {
  if (value == null || value === '') return '–'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '–'
  return format(d, fmt)
}

export default function AmenitiesPage() {
  const [activeTab, setActiveTab] = useState('browse')
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null)
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  // Form States
  const [bookingForm, setBookingForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: ''
  })

  // Fetch Amenities
  const { data: amenities = [], isLoading: amenitiesLoading } = useQuery({
    queryKey: ['amenities'],
    queryFn: AmenityService.getAll
  })

  // Fetch Bookings
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['amenityBookings'],
    queryFn: AmenityService.getAllBookings
  })

  const createBookingMutation = useMutation({
    mutationFn: (data: any) => AmenityService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenityBookings'] })
      setIsBookingDialogOpen(false)
      toast.success('Booking request submitted')
      setBookingForm({ date: '', startTime: '', endTime: '', purpose: '' })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create booking')
    }
  })
  
  const updateBookingStatusMutation = useMutation({
      mutationFn: ({ id, status }: { id: number, status: string }) => AmenityService.updateBookingStatus(id, status),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['amenityBookings'] })
          toast.success('Booking status updated')
      },
      onError: () => toast.error('Failed to update status')
  })

  const handleBook = () => {
    if (!selectedAmenity || !bookingForm.date || !bookingForm.startTime || !bookingForm.endTime) {
      toast.error('Please fill all fields')
      return
    }

    const startDateTime = new Date(`${bookingForm.date}T${bookingForm.startTime}`)
    const endDateTime = new Date(`${bookingForm.date}T${bookingForm.endTime}`)
    
    // Calculate amount
    const hours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60)
    const amount = hours * selectedAmenity.chargesPerHour

    createBookingMutation.mutate({
      amenityId: selectedAmenity.id,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      amountPaid: amount > 0 ? amount : 0,
      purpose: bookingForm.purpose
    })
  }

  return (
    <RoleGuard allowedRoles={['admin', 'resident', 'super_admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Amenities & Booking</h1>
            <p className="text-gray-600 mt-1">
              Book and manage community facilities
            </p>
          </div>
          {/* Admin Create Amenity Button could go here */}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="browse">Browse Amenities</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {amenities.map((amenity: Amenity) => (
                <motion.div
                  key={amenity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 relative">
                        {/* Placeholder image */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                             <Users className="h-12 w-12" />
                        </div>
                        <Badge className="absolute top-4 right-4 bg-white/90 text-black hover:bg-white">
                            {amenity.type}
                        </Badge>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{amenity.name}</h3>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                          Available
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {amenity.description}
                      </p>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span>Capacity: {amenity.capacity} people</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>₹{amenity.chargesPerHour}/hour</span>
                        </div>
                      </div>

                      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => setSelectedAmenity(amenity)}
                          >
                            Book Now
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Book {selectedAmenity?.name}</DialogTitle>
                            <DialogDescription>
                                Fill in the details to request a booking.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input 
                                    type="date" 
                                    value={bookingForm.date}
                                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Time</Label>
                                    <Input 
                                        type="time" 
                                        value={bookingForm.startTime}
                                        onChange={(e) => setBookingForm({...bookingForm, startTime: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time</Label>
                                    <Input 
                                        type="time" 
                                        value={bookingForm.endTime}
                                        onChange={(e) => setBookingForm({...bookingForm, endTime: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Purpose</Label>
                                <Input 
                                    placeholder="e.g., Birthday Party"
                                    value={bookingForm.purpose}
                                    onChange={(e) => setBookingForm({...bookingForm, purpose: e.target.value})}
                                />
                            </div>
                            <Button className="w-full" onClick={handleBook} disabled={createBookingMutation.isPending}>
                                {createBookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <Card>
                <div className="p-6">
                    {bookings.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No bookings found.</p>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking: AmenityBooking) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <CalendarIcon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{booking.amenity?.name}</h4>
                                            <p className="text-sm text-gray-600">
                                                {formatSafeDate(booking.startTime, 'PPP')} • {formatSafeDate(booking.startTime, 'p')} – {formatSafeDate(booking.endTime, 'p')}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">Booked by: {booking.user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Badge variant={booking.status === 'CONFIRMED' ? 'default' : booking.status === 'PENDING' ? 'secondary' : 'destructive'}>
                                            {booking.status}
                                        </Badge>
                                        {/* Admin Actions */}
                                        {/* In a real app, verify role here properly. Assuming accessible for demo */}
                                        {booking.status === 'PENDING' && (
                                            <div className="flex space-x-2">
                                                <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => updateBookingStatusMutation.mutate({id: booking.id, status: 'CONFIRMED'})}>
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => updateBookingStatusMutation.mutate({id: booking.id, status: 'REJECTED'})}>
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RoleGuard>
  )
}
