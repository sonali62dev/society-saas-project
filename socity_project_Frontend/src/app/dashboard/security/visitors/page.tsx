'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  Plus, Search, QrCode, CheckCircle, CheckCircle2, Clock, XCircle, Camera,
  Phone, MapPin, Calendar, Users, Car, MessageSquare, Bell, Filter,
  ArrowUpRight, ArrowDownLeft, Scan, UserCheck, UserX, Shield, Eye,
  MoreHorizontal, Download, Printer, RefreshCw, Loader2, Mic
} from 'lucide-react'
import { VoiceInput } from '@/components/ui/voice-input'
import { useSpeechToText } from '@/lib/hooks/use-speech-to-text'
import { parseVoiceCommand } from '@/lib/utils/voice-parser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VisitorService } from '@/services/visitorService'
import api from '@/lib/api'
import { getSocket } from '@/lib/socket'
import { useEffect } from 'react'

const purposeOptions = [
  'Guest Visit', 'Delivery', 'Maintenance', 'Cab/Taxi', 'Food Delivery',
  'Maid/Cook', 'Plumber', 'Electrician', 'Carpenter', 'Other',
]

function VisitorDetailDialog({ visitor, onCheckIn, onCheckOut }: { visitor: any, onCheckIn?: (data: any) => void, onCheckOut?: (id: any) => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Visitor Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={visitor.photo || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-xl">
                {visitor.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{visitor.name}</h3>
              <p className="text-sm text-muted-foreground">{visitor.phone}</p>
              <Badge className={`mt-2 ${visitor.status === 'CHECKED_IN' ? 'bg-green-100 text-green-700' :
                visitor.status === 'CHECKED_OUT' ? 'bg-gray-100 text-gray-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                {visitor.status === 'CHECKED_IN' && <span className="mr-1 h-2 w-2 rounded-full bg-green-500 animate-pulse inline-block" />}
                {visitor.status?.replace('_', ' ')}
              </Badge>
              {visitor.checkedInBy && (
                <p className="text-xs text-muted-foreground mt-1 font-medium italic">
                  Approved/Checked-in by: <span className="text-teal-600 font-bold">{visitor.checkedInBy.name}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Purpose</p>
              <p className="font-medium">{visitor.purpose}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Visiting</p>
              <p className="font-medium">{visitor.unit ? `${visitor.unit.block}-${visitor.unit.number}` : 'N/A'}</p>
              <p className="text-sm text-muted-foreground">{visitor.resident?.name || 'Resident'}</p>
            </div>
            {visitor.whomToMeet && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Whom to Meet</p>
                <p className="font-medium">{visitor.whomToMeet}</p>
              </div>
            )}
            {visitor.vehicleNo && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Vehicle Number</p>
                <p className="font-medium uppercase">{visitor.vehicleNo}</p>
              </div>
            )}
            {visitor.fromLocation && (
              <div className="p-3 rounded-lg bg-muted/50 col-span-2">
                <p className="text-xs text-muted-foreground">Coming From</p>
                <p className="font-medium">{visitor.fromLocation}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 p-3 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center gap-2 text-green-700">
                <ArrowDownLeft className="h-4 w-4" />
                <span className="text-xs">Entry Time</span>
              </div>
              <p className="font-semibold text-green-800 mt-1">
                {visitor.entryTime ? new Date(visitor.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Not yet'}
              </p>
            </div>
            <div className="flex-1 p-3 rounded-lg bg-red-50 border border-red-100">
              <div className="flex items-center gap-2 text-red-700">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-xs">Exit Time</span>
              </div>
              <p className="font-semibold text-red-800 mt-1">
                {visitor.exitTime ? new Date(visitor.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Still inside'}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            {visitor.status === 'CHECKED_IN' && (
              <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => { onCheckOut?.(visitor.id); setIsOpen(false); }}>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Check Out
              </Button>
            )}
            <Button variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function VisitorsPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [blockFilter, setBlockFilter] = useState('all-blocks')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // New visitor form state
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newUnitId, setNewUnitId] = useState('')
  const [newPurpose, setNewPurpose] = useState('')
  const [newWhomToMeet, setNewWhomToMeet] = useState('')
  const [newVehicleNo, setNewVehicleNo] = useState('')
  const [newCompany, setNewCompany] = useState('')
  const [newIdType, setNewIdType] = useState('')
  const [newIdNumber, setNewIdNumber] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Smart Voice Assistant
  const { startListening, isListening, stopListening } = useSpeechToText()
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)
  
  const handleSmartVoiceCommand = () => {
    if (isListening) {
      stopListening()
      return
    }
    
    toast('Listening to your command...', {
      icon: '🎤',
      style: { background: '#1e293b', color: '#fff', borderRadius: '99px' }
    })

    startListening((fullText) => {
      setIsProcessingVoice(true)
      setTimeout(() => {
        const parsed = parseVoiceCommand(fullText)
        
        // Fill data
        setNewName(parsed.name || '')
        setNewPhone(parsed.phone || '')
        setNewPurpose(parsed.purpose || 'Guest Visit')
        
        // Try to resolve exact unit from dropdown if text contained number
        if (parsed.unit) {
          const matchingUnit = unitsData.find((u: any) => 
            u.number === parsed.unit || `${u.block}${u.number}` === parsed.unit.replace(/[-\s]/g, '')
          )
          if (matchingUnit) {
            setNewUnitId(matchingUnit.id.toString())
          } else {
            // If block-floor-unit structure is common, maybe save just note
            setNewWhomToMeet(`Visiting ${parsed.unit}`)
          }
        }
        
        setIsProcessingVoice(false)
        setIsAddDialogOpen(true)
        toast.success('Information parsed & filled automatically!', { icon: '⚡' })
      }, 800) // brief delay to make it feel AI is processing
    })
  }


  const { user } = useAuthStore()
  const isAdmin = user?.role === 'admin'

  // Socket listener for real-time notifications
  useEffect(() => {
    if (!user?.societyId) return

    const socket = getSocket()

    // Join society room
    socket.emit('join-society', user.societyId)

    // Listen for new visitor entries via QR scan
    socket.on('new_visitor_request', (data: any) => {
      toast.success(data.message || 'New visitor entry requested!', {
        duration: 5000,
        icon: '🔔'
      })
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      queryClient.invalidateQueries({ queryKey: ['visitorStats'] })
    })

    // Listen for status updates (e.g. resident approved from home)
    socket.on('visitor_status_updated', (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      queryClient.invalidateQueries({ queryKey: ['visitorStats'] })
      if (data.message) {
        toast(data.message, { icon: '🔄' })
      }
    })

    return () => {
      socket.off('new_visitor_request')
      socket.off('visitor_status_updated')
    }
  }, [user?.societyId, queryClient])

  // Fetch Stats
  const { data: statsData } = useQuery({
    queryKey: ['visitorStats'],
    queryFn: VisitorService.getStats,
    refetchInterval: 30000 // Refresh every 30s
  })

  // Fetch Visitors
  const { data: visitorsData = [], isLoading } = useQuery({
    queryKey: ['visitors', activeTab, searchQuery, dateFilter, blockFilter],
    queryFn: () => VisitorService.getAll({
      status: activeTab,
      search: searchQuery,
      date: dateFilter,
      block: blockFilter
    })
  })

  // Fetch Units for dropdown
  const { data: unitsData = [] } = useQuery({
    queryKey: ['units'],
    queryFn: async () => {
      const res = await api.get('/units') // Assuming this endpoint exists, or we might need to create it
      return res.data
    }
  })

  // Mutations
  const checkInMutation = useMutation({
    mutationFn: VisitorService.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      queryClient.invalidateQueries({ queryKey: ['visitorStats'] })
      setIsAddDialogOpen(false)
      toast.success('Visitor checked in successfully!')
      resetForm()
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to check in')
  })

  const checkOutMutation = useMutation({
    mutationFn: VisitorService.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      queryClient.invalidateQueries({ queryKey: ['visitorStats'] })
      toast.success('Visitor checked out!')
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to check out')
  })

  const preApproveMutation = useMutation({
    mutationFn: VisitorService.preApprove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      queryClient.invalidateQueries({ queryKey: ['visitorStats'] })
      setIsAddDialogOpen(false)
      toast.success('Visitor pre-approved!')
      resetForm()
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to pre-approve')
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await api.patch(`/visitors/${id}/status`, { status })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      queryClient.invalidateQueries({ queryKey: ['visitorStats'] })
      toast.success('Status updated successfully!')
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to update status')
  })

  // useRef for file input
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetForm = () => {
    setNewName('')
    setNewPhone('')
    setNewUnitId('')
    setNewPurpose('')
    setNewWhomToMeet('')
    setNewVehicleNo('')
    setNewCompany('')
    setNewIdType('')
    setNewIdNumber('')
    setNewNotes('')
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const handleCheckInNow = () => {
    if (!newName || !newPhone || !newUnitId || !newPurpose) {
      toast.error('Please fill all required fields')
      return
    }
    checkInMutation.mutate({
      name: newName,
      phone: newPhone,
      visitingUnitId: newUnitId,
      purpose: newPurpose,
      whomToMeet: newWhomToMeet,
      vehicleNo: newVehicleNo,
      company: newCompany,
      idType: newIdType,
      idNumber: newIdNumber,
      notes: newNotes,
      photo: photoFile
    })
  }

  const handlePreApprove = () => {
    if (!newName || !newPhone || !newPurpose) {
      toast.error('Please fill name, phone and purpose')
      return
    }
    preApproveMutation.mutate({
      name: newName,
      phone: newPhone,
      visitingUnitId: newUnitId || null,
      purpose: newPurpose,
      whomToMeet: newWhomToMeet,
      vehicleNo: newVehicleNo,
      company: newCompany,
      idType: newIdType,
      idNumber: newIdNumber,
      notes: newNotes,
      photo: photoFile
    })
  }


  const stats = [
    {
      title: "Today's Visitors",
      value: statsData?.totalToday || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Currently Inside',
      value: statsData?.activeNow || 0,
      icon: MapPin,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      pulse: true,
    },
    {
      title: 'Pre-approved',
      value: statsData?.preApproved || 0,
      icon: CheckCircle,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'This Month',
      value: statsData?.totalMonth || 0,
      icon: Calendar,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ]

  return (
    <RoleGuard allowedRoles={['admin', 'guard', 'resident']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1e3a5f]">Visitor Management</h1>
              <p className="text-muted-foreground text-sm">Track and manage visitor entries</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                  <Plus className="h-4 w-4 mr-2" /> Add Visitor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    Register New Visitor
                  </DialogTitle>
                  <DialogDescription>
                    Enter visitor details for check-in. A QR pass will be generated.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Photo Capture Area */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                        {photoPreview ? (
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Visitor Name *</Label>
                      <div className="relative flex items-center">
                        <Input
                          placeholder="Enter full name"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="pr-10"
                        />
                        <div className="absolute right-1">
                          <VoiceInput onResult={(txt) => setNewName(txt)} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <div className="relative flex items-center">
                        <Input
                          placeholder="+91 XXXXX XXXXX"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          className="pr-10"
                        />
                        <div className="absolute right-1">
                          <VoiceInput onResult={(txt) => {
                            // Remove non-digits to help voice formatting for numbers
                            const cleaned = txt.replace(/\D/g, '').slice(-10)
                            setNewPhone(cleaned || txt)
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Visiting Unit *</Label>
                      <Select value={newUnitId} onValueChange={setNewUnitId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {unitsData.map((u: any) => (
                            <SelectItem key={u.id} value={u.id.toString()}>
                              {u.block}-{u.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Purpose of Visit *</Label>
                      <Select value={newPurpose} onValueChange={setNewPurpose}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          {purposeOptions.map((purpose) => (
                            <SelectItem key={purpose} value={purpose}>
                              {purpose}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company/Organization</Label>
                      <div className="relative flex items-center">
                        <Input 
                          placeholder="e.g., Amazon, Swiggy" 
                          value={newCompany}
                          onChange={(e) => setNewCompany(e.target.value)}
                          className="pr-10"
                        />
                        <div className="absolute right-1">
                          <VoiceInput onResult={(txt) => setNewCompany(txt)} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Vehicle Number</Label>
                      <div className="relative flex items-center">
                        <Input
                          placeholder="MH 01 AB 1234"
                          value={newVehicleNo}
                          onChange={(e) => setNewVehicleNo(e.target.value.toUpperCase())}
                          className="pr-10 uppercase"
                        />
                        <div className="absolute right-1">
                          <VoiceInput onResult={(txt) => {
                            // Clean spaces and caps for vehicle
                            setNewVehicleNo(txt.replace(/\s/g, '').toUpperCase())
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Whom to Meet</Label>
                    <div className="relative flex items-center">
                      <Input
                        placeholder="Resident name or reason"
                        value={newWhomToMeet}
                        onChange={(e) => setNewWhomToMeet(e.target.value)}
                        className="pr-10"
                      />
                      <div className="absolute right-1">
                        <VoiceInput onResult={(txt) => setNewWhomToMeet(txt)} />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>ID Type</Label>
                      <Select value={newIdType} onValueChange={setNewIdType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                          <SelectItem value="dl">Driving License</SelectItem>
                          <SelectItem value="voter">Voter ID</SelectItem>
                          <SelectItem value="company">Company ID</SelectItem>
                          <SelectItem value="pan">PAN Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>ID Number</Label>
                      <div className="relative flex items-center">
                        <Input 
                          placeholder="Enter ID number" 
                          value={newIdNumber}
                          onChange={(e) => setNewIdNumber(e.target.value)}
                          className="pr-10"
                        />
                        <div className="absolute right-1">
                          <VoiceInput onResult={(txt) => {
                             setNewIdNumber(txt.replace(/\s/g, '').toUpperCase())
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <div className="relative flex items-start">
                      <Textarea 
                        placeholder="Any additional information..." 
                        rows={2} 
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        className="pr-10 min-h-[60px]"
                      />
                      <div className="absolute right-1 top-1">
                        <VoiceInput onResult={(txt) => setNewNotes((prev) => prev ? `${prev} ${txt}` : txt)} />
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Notify Resident</p>
                      <p className="text-xs text-blue-700">Send WhatsApp notification to the flat owner</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button variant="outline" className="gap-2" onClick={handlePreApprove}>
                      <QrCode className="h-4 w-4" />
                      Pre-approve & Generate Pass
                    </Button>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 gap-2" onClick={handleCheckInNow}>
                      <ArrowDownLeft className="h-4 w-4" />
                      Check In Now
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor} relative`}>
                      {stat.pulse && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />}
                      <Icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search visitors..."
                className="pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all-blocks">All Blocks</SelectItem>
                <SelectItem value="A">Block A</SelectItem>
                <SelectItem value="B">Block B</SelectItem>
                <SelectItem value="C">Block C</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => { setSearchQuery(''); setDateFilter('today'); setBlockFilter('all-blocks'); }}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-6">
              <TabsList className="bg-transparent h-auto p-0 space-x-6">
                {['all', 'checked-in', 'checked-out', 'pending', 'approved'].map(tab => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-0 pb-3 capitalize"
                  >
                    {tab.replace('-', ' ')}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Visiting</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></TableCell></TableRow>
                  ) : visitorsData.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No visitors found</TableCell></TableRow>
                  ) : (
                    visitorsData.map((visitor: any) => (
                      <TableRow key={visitor.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={visitor.photo} />
                              <AvatarFallback>{visitor.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{visitor.name}</p>
                              <p className="text-xs text-muted-foreground">{visitor.phone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {visitor.unit ? `${visitor.unit.block}-${visitor.unit.number}` : 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{visitor.purpose}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="text-green-600">In: {visitor.entryTime ? new Date(visitor.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                            <p className="text-red-600">Out: {visitor.exitTime ? new Date(visitor.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge className={
                              visitor.status === 'CHECKED_IN' ? 'bg-green-100 text-green-700' :
                                visitor.status === 'CHECKED_OUT' ? 'bg-gray-100 text-gray-700' :
                                  'bg-blue-100 text-blue-700'
                            }>
                              {visitor.status?.replace('_', ' ')}
                            </Badge>
                            {visitor.checkedInBy && (
                              <p className="text-[10px] text-muted-foreground font-medium">
                                By: {visitor.checkedInBy.name}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <VisitorDetailDialog
                              visitor={visitor}
                              onCheckOut={(id) => checkOutMutation.mutate(id)}
                            />
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0" asChild title="Call Visitor">
                              <a href={`tel:${visitor.phone}`}>
                                <Phone className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-teal-200 text-teal-700 bg-teal-50" asChild title="Call Resident">
                              <a href={`tel:${visitor.unit?.tenant?.phone || visitor.unit?.owner?.phone || visitor.resident?.phone}`}>
                                <Shield className="h-4 w-4" />
                              </a>
                            </Button>
                            {visitor.status === 'PENDING' && (
                              <div className="flex flex-col gap-2">
                                {user?.role !== 'resident' && (
                                  <span className="text-[10px] text-orange-600 font-bold italic bg-orange-50 px-2 py-0.5 rounded border border-orange-100 text-center">
                                    Awaiting Resident...
                                  </span>
                                )}
                                <div className="flex gap-1">
                                  <button
                                    className="h-8 px-2 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                                    onClick={() => updateStatusMutation.mutate({ id: visitor.id, status: 'REJECTED' })}
                                  >
                                    <UserX className="h-3.5 w-3.5" />
                                    Reject
                                  </button>
                                  <button
                                    className="h-8 px-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1"
                                    onClick={() => updateStatusMutation.mutate({ id: visitor.id, status: 'APPROVED' })}
                                  >
                                    <UserCheck className="h-3.5 w-3.5" />
                                    Approve
                                  </button>
                                </div>
                              </div>
                            )}
                            {visitor.status === 'APPROVED' && (
                              <Button
                                size="sm"
                                className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => updateStatusMutation.mutate({ id: visitor.id, status: 'CHECKED_IN' })}
                              >
                                In
                              </Button>
                            )}
                            {visitor.status === 'CHECKED_IN' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 text-xs"
                                onClick={() => updateStatusMutation.mutate({ id: visitor.id, status: 'EXITED' })}
                              >
                                Exit
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </Card>

        {/* Smart AI Voice Floating Assistant */}
        <div className="fixed bottom-24 right-8 z-50 print:hidden">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <button
              onClick={handleSmartVoiceCommand}
              disabled={isProcessingVoice}
              className={`group flex items-center gap-3 p-4 pr-6 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] border transition-all duration-300 ${
                isListening 
                ? 'bg-red-500 border-red-400 animate-pulse text-white' 
                : 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-blue-500'
              }`}
            >
              <div className={`p-2.5 rounded-full ${isListening ? 'bg-white text-red-500' : 'bg-white/20'} transition-all`}>
                {isProcessingVoice ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Mic className={`h-6 w-6 ${isListening ? 'animate-bounce' : ''}`} />
                )}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold opacity-80 tracking-wider uppercase">{isListening ? 'I am listening...' : 'Smart Entry'}</p>
                <p className="font-bold text-sm whitespace-nowrap">
                  {isListening ? 'Speak now...' : 'Bol kar entry karein'}
                </p>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </RoleGuard>
  )
}
