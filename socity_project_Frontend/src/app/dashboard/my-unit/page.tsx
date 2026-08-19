'use client'

import { motion } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import { useAuthStore } from '@/lib/stores/auth-store'
import {
  Home,
  Users,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  DollarSign,
  Clock,
  Car,
  PawPrint,
  Plus,
  Edit,
  ChevronRight,
  Shield,
  Key,
  Package,
  UserPlus,
  FileText,
  Bell,
  Upload,
  Building2,
  UserCheck,
  CalendarClock,
  Syringe,
  Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface UnitMember {
  id: number | string
  name: string
  relation: string
  phone?: string
  email?: string
  age?: number
  gender?: string
  avatar?: string
  isOwner?: boolean
}

interface UnitVehicle {
  id: number | string
  number: string
  type: string
  name?: string
  color?: string
  parkingSlot?: string
}

interface UnitPet {
  id: number | string
  name: string
  type: string
  breed?: string
  vaccinationStatus?: string
  vaccinations?: any[]
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { MoveRequestService } from '@/services/moveRequestService'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

export default function MyUnitPage() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('members')
  const [visitorFilter, setVisitorFilter] = useState('all')
  const [selectedUnit, setSelectedUnit] = useState<any>(null)
  const [isAddFlatOpen, setIsAddFlatOpen] = useState(false)
  const [isTenantDialogOpen, setIsTenantDialogOpen] = useState(false)
  const [isVaccinationDialogOpen, setIsVaccinationDialogOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<any>(null)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [memberForm, setMemberForm] = useState({ name: '', relation: '', phone: '', email: '', age: '', gender: '' })
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [vehicleForm, setVehicleForm] = useState({ number: '', type: 'Car', name: '', color: '', parkingSlot: '' })
  const [isAddPetOpen, setIsAddPetOpen] = useState(false)
  const [petForm, setPetForm] = useState({ name: '', type: 'Dog', breed: '', age: '' })
  const [editingItem, setEditingItem] = useState<{ type: 'member' | 'vehicle' | 'pet', id: number | string } | null>(null)
  const [isInvoiceDetailsOpen, setIsInvoiceDetailsOpen] = useState(false)
  const [viewingInvoice, setViewingInvoice] = useState<any>(null)
  const [isMoveOutDialogOpen, setIsMoveOutDialogOpen] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get('activeTab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])
  const [moveOutForm, setMoveOutForm] = useState({ scheduledDate: '', timeSlot: '', vehicleType: '', notes: '' })

  const { data: unit, isLoading, error } = useQuery({
    queryKey: ['unit-data'],
    queryFn: residentService.getUnitData
  })

  const { data: payments } = useQuery({
    queryKey: ['payment-history'],
    queryFn: residentService.getMyPayments
  })

  // Fetch Visitors
  const { data: visitorsData = [], isLoading: isVisitorsLoading } = useQuery({
    queryKey: ['visitors', 'resident', visitorFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (visitorFilter && visitorFilter !== 'all') params.append('status', visitorFilter);
      const response = await api.get(`/visitors?${params.toString()}`);
      return response.data;
    }
  })

  // Mutations
  const updateVisitorStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await api.patch(`/visitors/${id}/status`, { status })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] })
      toast.success('Visitor status updated')
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to update status')
  })

  const handleDownloadHistory = () => {
    if (!payments || payments.length === 0) {
      toast.error('No payment history to download')
      return;
    }

    const headers = ['ID', 'Date', 'Category', 'Amount', 'Method', 'Status', 'Description'];
    const csvContent = [
      headers.join(','),
      ...payments.map((p: any) => [
        p.id,
        new Date(p.date).toLocaleDateString(),
        p.category,
        p.amount,
        p.paymentMethod,
        p.status,
        `"${p.description || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payment_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Initialize selectedUnit when data is loaded
  useEffect(() => {
    if (unit && !selectedUnit) {
      setSelectedUnit(unit)
    }
  }, [unit, selectedUnit])

  // Mutations
  const addMemberMutation = useMutation({
    mutationFn: residentService.addFamilyMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-data'] })
      toast.success('Member added successfully')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add member')
  })

  const addVehicleMutation = useMutation({
    mutationFn: residentService.addVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-data'] })
      toast.success('Vehicle added successfully')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add vehicle')
  })

  const addPetMutation = useMutation({
    mutationFn: residentService.addPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-data'] })
      toast.success('Pet added successfully')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to add pet')
  })

  // Update Mutations
  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string, data: any }) => residentService.updateFamilyMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-data'] })
      toast.success('Member updated successfully')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update member')
  })

  const updateVehicleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string, data: any }) => residentService.updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-data'] })
      toast.success('Vehicle updated successfully')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update vehicle')
  })

  const moveOutMutation = useMutation({
    mutationFn: (data: any) => MoveRequestService.create(data),
    onSuccess: () => {
      toast.success('Move-out request submitted! Admin will review and contact you.')
      setIsMoveOutDialogOpen(false)
      setMoveOutForm({ scheduledDate: '', timeSlot: '', vehicleType: '', notes: '' })
    },
    onError: (err: any) => toast.error(err.response?.data?.message || err.message || 'Failed to submit move-out request')
  })

  const updatePetMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string, data: any }) => residentService.updatePet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-data'] })
      toast.success('Pet updated successfully')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update pet')
  })

  if (isLoading) return <div className="p-8"><Skeleton className="w-full h-[600px]" /></div>
  if (error) return <div className="p-8 text-red-500">Error loading unit data</div>
  if (!unit) return <div className="p-8">No unit data found</div>
  if (!selectedUnit) return <div className="p-8"><Skeleton className="w-full h-[600px]" /></div>

  const residents = unit.members || []
  const vehicles = unit.vehicles || []
  const pets = unit.petsList || []
  const paymentHistory = payments || []
  const pendingPayments: any[] = []
  const allUnits: any[] = [unit] // Show current unit

  const tenantInfo = selectedUnit.tenant ? {
    name: selectedUnit.tenant.name,
    phone: selectedUnit.tenant.phone || 'N/A',
    email: selectedUnit.tenant.email || 'N/A',
    moveInDate: 'N/A',
    agreementEndDate: 'N/A',
    avatar: selectedUnit.tenant.profileImg,
    vehicles: selectedUnit.vehicles || []
  } : null

  return (
    <RoleGuard allowedRoles={['resident']}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">My Units</h1>
            <p className="text-gray-500 mt-1">
              Manage your properties and family members
            </p>
          </div>
          <Dialog open={isAddFlatOpen} onOpenChange={setIsAddFlatOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="hidden md:flex items-center gap-2 text-teal-600 border-teal-200 hover:bg-teal-50"
              >
                <Plus className="h-4 w-4" />
                Add Another Flat
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Another Flat</DialogTitle>
                <DialogDescription>
                  Register another property owned by you in the society
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unitNumber">Unit Number</Label>
                  <Input id="unitNumber" placeholder="e.g., C-402" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="block">Block/Tower</Label>
                    <Input id="block" placeholder="Tower C" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Input id="floor" placeholder="4th Floor" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Input id="type" placeholder="2 BHK" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Input id="area" placeholder="1200 sq.ft" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFlatOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast.success('Flat registration submitted for approval')
                    setIsAddFlatOpen(false)
                  }}
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/20"
                >
                  Submit for Approval
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Multiple Flats Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs
            defaultValue={allUnits[0].id}
            onValueChange={(value) => {
              const unit = allUnits.find((u) => u.id === value)
              if (unit) setSelectedUnit(unit)
            }}
          >
            <TabsList className="w-full md:w-auto">
              {allUnits.map((unit) => (
                <TabsTrigger key={unit.id} value={unit.id} className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {unit.unitNumber}
                </TabsTrigger>
              ))}
              <TabsTrigger value="visitors" className="flex items-center gap-2 text-rose-600 font-bold">
                <UserCheck className="h-4 w-4" />
                Visitors
              </TabsTrigger>
            </TabsList>

            {allUnits.map((unit) => (
              <TabsContent key={unit.id} value={unit.id} className="mt-6 space-y-6">
                {/* Unit Details Card */}
                <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] text-white">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-4 bg-white/10 backdrop-blur rounded-2xl">
                        <Home className="h-8 w-8 text-teal-300" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold">
                          Unit {unit.unitNumber}
                        </h2>
                        <p className="text-white/70 mt-1">
                          {unit.block} | {unit.floor}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <div className="flex items-center text-sm text-white/80">
                            <MapPin className="h-4 w-4 mr-1" />
                            {unit.type} | {unit.area}
                          </div>
                          <Badge className={unit.isRented ? "bg-orange-500/20 text-orange-300 border-orange-500/30" : "bg-teal-500/20 text-teal-300 border-teal-500/30"}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {unit.status}
                          </Badge>
                          <Badge className="bg-white/10 text-white/80 border-white/20">
                            <Key className="h-3 w-3 mr-1" />
                            {unit.ownershipType}
                          </Badge>
                        </div>
                        <p className="text-xs text-white/60 mt-3">
                          Move-in Date: {unit.moveInDate}
                        </p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-4">
                      <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur min-w-[80px]">
                        <PawPrint className="h-5 w-5 mx-auto text-pink-300" />
                        <p className="text-2xl font-bold mt-1">{!selectedUnit.tenantId ? residents.length : 1}</p>
                        <p className="text-xs text-white/70">{selectedUnit.tenantId ? 'Tenant' : 'Members'}</p>
                      </div>
                      {!selectedUnit.tenantId && (
                        <>
                          <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur min-w-[80px]">
                            <PawPrint className="h-5 w-5 mx-auto text-pink-300" />
                            <p className="text-2xl font-bold mt-1">{pets.length}</p>
                            <p className="text-xs text-white/70">Pets</p>
                          </div>
                          <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur min-w-[80px]">
                            <Car className="h-5 w-5 mx-auto text-cyan-300" />
                            <p className="text-2xl font-bold mt-1">{vehicles.length}</p>
                            <p className="text-xs text-white/70">Vehicles</p>
                          </div>
                        </>
                      )}
                      {selectedUnit.tenantId && (
                        <div className="text-center p-3 bg-white/10 rounded-xl backdrop-blur min-w-[80px]">
                          <Car className="h-5 w-5 mx-auto text-cyan-300" />
                          <p className="text-2xl font-bold mt-1">{tenantInfo?.vehicles?.length || 0}</p>
                          <p className="text-xs text-white/70">Vehicles</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </TabsContent>
            ))}

            <TabsContent value="visitors" className="mt-6 space-y-6">
              <Card className="p-6 border-0 shadow-xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-slate-800/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
                      <Users className="h-5 w-5 text-teal-600" />
                      Visitor Management
                    </h3>
                    <p className="text-sm text-gray-500">Track and approve entry for your unit</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                    {['all', 'pending', 'checked-in', 'history'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setVisitorFilter(filter)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${visitorFilter === filter ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {isVisitorsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                    </div>
                  ) : visitorsData.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                      <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
                        <Users className="h-8 w-8 text-gray-200" />
                      </div>
                      <h4 className="font-bold text-gray-900">No visitors found</h4>
                      <p className="text-sm text-gray-500 mt-1">Visitors will appear here when they reach the gate</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visitorsData.map((visitor: any) => (
                        <Card key={visitor.id} className="p-4 border-0 shadow-sm bg-white hover:shadow-md transition-shadow ring-1 ring-black/5 rounded-2xl group">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-14 w-14 ring-2 ring-gray-50">
                              <AvatarImage src={visitor.photo} />
                              <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-bold">
                                {visitor.name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-900 text-lg">{visitor.name}</h4>
                                <Badge className={
                                  visitor.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                    visitor.status === 'CHECKED_IN' ? 'bg-green-100 text-green-700 font-black' :
                                      visitor.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                }>
                                  {visitor.status === 'CHECKED_IN' && <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500 animate-pulse inline-block" />}
                                  {visitor.status?.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">{visitor.phone}</p>

                              <div className="mt-3 grid grid-cols-2 gap-2">
                                <div className="p-2 bg-gray-50 rounded-lg">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Purpose</p>
                                  <p className="text-xs font-bold text-gray-700 truncate">{visitor.purpose}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-lg">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Time</p>
                                  <p className="text-xs font-bold text-gray-700">
                                    {visitor.entryTime ? new Date(visitor.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                                  </p>
                                </div>
                              </div>

                              {visitor.status === 'PENDING' && (
                                <div className="mt-4 flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 text-xs font-bold text-rose-600 border-rose-100 hover:bg-rose-50 rounded-xl"
                                    onClick={() => updateVisitorStatusMutation.mutate({ id: visitor.id, status: 'REJECTED' })}
                                  >
                                    Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="flex-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 rounded-xl"
                                    onClick={() => updateVisitorStatusMutation.mutate({ id: visitor.id, status: 'CHECKED_IN' })}
                                  >
                                    Approve Entry
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Pending Payments Alert */}
        {pendingPayments.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="p-4 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    Payment Due
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    You have {pendingPayments.length} pending payment(s)
                  </p>
                  <div className="mt-3 space-y-2">
                    {pendingPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-xl shadow-sm gap-3"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            Due: {payment.dueDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-xl font-bold text-gray-900">
                            Rs. {payment.amount.toLocaleString()}
                          </p>
                          <Button
                            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/30"
                            onClick={() => toast.info(`Redirecting to payment gateway for ₹${payment.amount.toLocaleString()}...`)}
                          >
                            Pay Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 hover:shadow-md active:scale-95"
              onClick={() => toast.info('Navigating to Helpdesk...')}
            >
              <div className="p-2 bg-teal-100 rounded-lg">
                <FileText className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-sm font-medium">Raise Complaint</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:shadow-md active:scale-95"
              onClick={() => toast.info('Opening Pre-approve Visitor...')}
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Pre-approve Visitor</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 hover:shadow-md active:scale-95"
              onClick={() => toast.info('Opening Book Amenity...')}
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium">Book Amenity</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex-col gap-2 hover:bg-orange-50 hover:border-orange-300 transition-all duration-300 hover:shadow-md active:scale-95"
              onClick={() => setIsMoveOutDialogOpen(true)}
            >
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-sm font-medium">Request Move-Out</span>
            </Button>
          </div>
        </motion.div>

        {/* Move-Out Request Dialog */}
        <Dialog open={isMoveOutDialogOpen} onOpenChange={setIsMoveOutDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-500" />
                Request Move-Out
              </DialogTitle>
              <DialogDescription>
                Submit a move-out request for your unit. Admin will review and process security deposit refund of{' '}
                <strong>₹{unit?.securityDeposit?.toLocaleString() || 0}</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Scheduled Move-Out Date *</Label>
                <Input
                  type="date"
                  value={moveOutForm.scheduledDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setMoveOutForm({ ...moveOutForm, scheduledDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Preferred Time Slot</Label>
                <Select value={moveOutForm.timeSlot} onValueChange={(v) => setMoveOutForm({ ...moveOutForm, timeSlot: v })}>
                  <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</SelectItem>
                    <SelectItem value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</SelectItem>
                    <SelectItem value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vehicle Type (if any)</Label>
                <Input
                  placeholder="e.g. Tempo, Mini Truck"
                  value={moveOutForm.vehicleType}
                  onChange={(e) => setMoveOutForm({ ...moveOutForm, vehicleType: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Input
                  placeholder="Any special instructions..."
                  value={moveOutForm.notes}
                  onChange={(e) => setMoveOutForm({ ...moveOutForm, notes: e.target.value })}
                />
              </div>
              {unit?.securityDeposit > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                  ✅ Security deposit of <strong>₹{unit.securityDeposit.toLocaleString()}</strong> will be refunded after admin approval.
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMoveOutDialogOpen(false)}>Cancel</Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!moveOutForm.scheduledDate || moveOutMutation.isPending}
                onClick={() => {
                  moveOutMutation.mutate({
                    type: 'move-out',
                    unitId: unit?.id?.toString(),
                    residentName: user?.name || '',
                    phone: user?.phone || '',
                    email: user?.email || '',
                    scheduledDate: moveOutForm.scheduledDate,
                    timeSlot: moveOutForm.timeSlot,
                    vehicleType: moveOutForm.vehicleType,
                    notes: moveOutForm.notes,
                  })
                }}
              >
                {moveOutMutation.isPending ? 'Submitting...' : 'Submit Move-Out Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Residents & Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Residents */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-0 shadow-xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-slate-800/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1e3a5f]">
                    Family Members
                  </h3>
                  <p className="text-sm text-gray-500">
                    {residents.length} members registered
                  </p>
                </div>
                <div className="p-2 bg-teal-100 rounded-xl">
                  <Users className="h-5 w-5 text-teal-600" />
                </div>
              </div>
              <div className="space-y-3">
                {residents.map((resident: UnitMember, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <Avatar className="h-12 w-12 ring-2 ring-white shadow">
                      <AvatarImage src={resident.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-semibold">
                        {resident.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900">
                          {resident.name}
                        </p>
                        {resident.isOwner && (
                          <Badge className="bg-teal-100 text-teal-700 text-xs">
                            Owner
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {resident.relation} | Age {resident.age}
                      </p>
                      <div className="flex items-center space-x-3 mt-1">
                        <a
                          href={`tel:${resident.phone}`}
                          className="text-xs text-teal-600 hover:text-teal-700 flex items-center"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          {resident.phone}
                        </a>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-teal-600"
                      onClick={() => {
                        setEditingItem({ type: 'member', id: resident.id })
                        setMemberForm({
                          name: resident.name,
                          relation: resident.relation,
                          phone: resident.phone || '',
                          email: '', // Not in resident object yet
                          age: resident.age?.toString() || '',
                          gender: resident.gender || ''
                        })
                        setIsAddMemberOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-dashed border-teal-300 text-teal-600 hover:bg-teal-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Family Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Edit Family Member' : 'Add Family Member'}</DialogTitle>
                    <DialogDescription>
                      {editingItem ? 'Update details for your family member' : 'Add a new member to your unit records'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="memberName">Full Name</Label>
                      <Input
                        id="memberName"
                        placeholder="John Doe"
                        value={memberForm.name}
                        onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="memberRelation">Relation</Label>
                        <Input
                          id="memberRelation"
                          placeholder="Spouse, Child, etc."
                          value={memberForm.relation}
                          onChange={(e) => setMemberForm({ ...memberForm, relation: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberAge">Age</Label>
                        <Input
                          id="memberAge"
                          type="number"
                          placeholder="25"
                          value={memberForm.age}
                          onChange={(e) => setMemberForm({ ...memberForm, age: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="memberPhone">Phone (Optional)</Label>
                        <Input
                          id="memberPhone"
                          placeholder="+91 98765 43210"
                          value={memberForm.phone}
                          onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="memberEmail">Email (Optional)</Label>
                        <Input
                          id="memberEmail"
                          type="email"
                          placeholder="john@example.com"
                          value={memberForm.email}
                          onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (editingItem) {
                          updateMemberMutation.mutate({
                            id: editingItem.id,
                            data: {
                              ...memberForm,
                              age: parseInt(memberForm.age)
                            }
                          })
                        } else {
                          addMemberMutation.mutate({
                            unitId: selectedUnit.id,
                            ...memberForm,
                            age: parseInt(memberForm.age)
                          })
                        }
                        setIsAddMemberOpen(false)
                        setEditingItem(null)
                        setMemberForm({ name: '', relation: '', phone: '', email: '', age: '', gender: '' })
                      }}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500"
                      disabled={addMemberMutation.isPending || updateMemberMutation.isPending}
                    >
                      {editingItem ? (updateMemberMutation.isPending ? 'Updating...' : 'Update Member') : (addMemberMutation.isPending ? 'Adding...' : 'Add Member')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          </motion.div>

          {/* Vehicles */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-0 shadow-xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-slate-800/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1e3a5f]">
                    Registered Vehicles
                  </h3>
                  <p className="text-sm text-gray-500">
                    {vehicles.length} vehicles registered
                  </p>
                </div>
                <div className="p-2 bg-cyan-100 rounded-xl">
                  <Car className="h-5 w-5 text-cyan-600" />
                </div>
              </div>
              <div className="space-y-3">
                {vehicles.map((vehicle: UnitVehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-4 rounded-xl border border-gray-100 hover:border-teal-300 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#1e3a5f]">
                            {vehicle.number}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {vehicle.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {vehicle.name}
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          Parking: {vehicle.parkingSlot}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-teal-600"
                        onClick={() => {
                          setEditingItem({ type: 'vehicle', id: vehicle.id })
                          setVehicleForm({
                            number: vehicle.number,
                            type: vehicle.type,
                            name: vehicle.name || '',
                            color: vehicle.color || '',
                            parkingSlot: vehicle.parkingSlot || ''
                          })
                          setIsAddVehicleOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-dashed border-cyan-300 text-cyan-600 hover:bg-cyan-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Register New Vehicle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Edit Vehicle Details' : 'Register New Vehicle'}</DialogTitle>
                    <DialogDescription>
                      {editingItem ? 'Update details for your registered vehicle' : 'Add a new vehicle to your unit records'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                      <Input
                        id="vehicleNumber"
                        placeholder="MH 12 AB 1234"
                        value={vehicleForm.number}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, number: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicleType">Type</Label>
                        <Select
                          value={vehicleForm.type}
                          onValueChange={(value) => setVehicleForm({ ...vehicleForm, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Car">Car</SelectItem>
                            <SelectItem value="Bike">Bike/Scooter</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleBrand">Brand/Model</Label>
                        <Input
                          id="vehicleBrand"
                          placeholder="Honda City"
                          value={vehicleForm.name}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vehicleColor">Color</Label>
                        <Input
                          id="vehicleColor"
                          placeholder="White"
                          value={vehicleForm.color}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parkingSlot">Parking Slot (Optional)</Label>
                        <Input
                          id="parkingSlot"
                          placeholder="P1-205"
                          value={vehicleForm.parkingSlot}
                          onChange={(e) => setVehicleForm({ ...vehicleForm, parkingSlot: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        if (editingItem) {
                          updateVehicleMutation.mutate({
                            id: editingItem.id,
                            data: vehicleForm
                          })
                        } else {
                          addVehicleMutation.mutate({
                            unitId: selectedUnit.id,
                            ...vehicleForm
                          })
                        }
                        setIsAddVehicleOpen(false)
                        setEditingItem(null)
                        setVehicleForm({ number: '', type: 'Car', name: '', color: '', parkingSlot: '' })
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500"
                      disabled={addVehicleMutation.isPending || updateVehicleMutation.isPending}
                    >
                      {editingItem ? (updateVehicleMutation.isPending ? 'Updating...' : 'Update Vehicle') : (addVehicleMutation.isPending ? 'Registering...' : 'Register Vehicle')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          </motion.div>
        </div>

        {/* Tenant Management Section */}
        {selectedUnit.tenantId && tenantInfo && (
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-0 shadow-xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-slate-800/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1e3a5f]">
                    Tenant Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Current tenant details for Unit {selectedUnit.unitNumber}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={isTenantDialogOpen} onOpenChange={setIsTenantDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-teal-600 border-teal-200 hover:bg-teal-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Tenant
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Tenant Information</DialogTitle>
                        <DialogDescription>
                          Update tenant details and agreement information
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="tenantName">Tenant Name</Label>
                          <Input id="tenantName" defaultValue={tenantInfo?.name} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="tenantPhone">Phone</Label>
                            <Input id="tenantPhone" defaultValue={tenantInfo?.phone} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tenantEmail">Email</Label>
                            <Input id="tenantEmail" defaultValue={tenantInfo?.email} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="moveInDate">Move-in Date</Label>
                            <Input id="moveInDate" type="date" defaultValue="2024-04-01" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="agreementEndDate">Agreement End Date</Label>
                            <Input id="agreementEndDate" type="date" defaultValue="2026-03-31" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTenantDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            toast.success('Tenant information updated successfully')
                            setIsTenantDialogOpen(false)
                          }}
                          className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/20"
                        >
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50">
                    <Avatar className="h-14 w-14 ring-2 ring-white shadow">
                      <AvatarImage src={tenantInfo?.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold text-lg">
                        {tenantInfo?.name?.charAt(0) || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">{tenantInfo?.name || 'N/A'}</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <a
                          href={`tel:${tenantInfo?.phone}`}
                          className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          {tenantInfo?.phone || 'N/A'}
                        </a>
                        <a
                          href={`mailto:${tenantInfo?.email}`}
                          className="text-sm text-teal-600 hover:text-teal-700 flex items-center"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          {tenantInfo?.email || 'N/A'}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Calendar className="h-4 w-4" />
                        <p className="text-xs font-medium">Move-in Date</p>
                      </div>
                      <p className="font-semibold text-gray-900">{tenantInfo?.moveInDate || 'N/A'}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                      <div className="flex items-center gap-2 text-orange-600 mb-1">
                        <CalendarClock className="h-4 w-4" />
                        <p className="text-xs font-medium">Agreement Ends</p>
                      </div>
                      <p className="font-semibold text-gray-900">{tenantInfo?.agreementEndDate || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Car className="h-4 w-4 text-cyan-600" />
                    Tenant Vehicles
                  </h4>
                  <div className="space-y-2">
                    {tenantInfo?.vehicles?.map((vehicle: UnitVehicle) => (
                      <div
                        key={vehicle.id}
                        className="p-4 rounded-xl border border-gray-100 hover:border-teal-300 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-[#1e3a5f]">{vehicle.number}</p>
                              <Badge variant="outline" className="text-xs">
                                {vehicle.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {vehicle.name} | {vehicle.color}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              Parking: {vehicle.parkingSlot}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Enhanced Pets Section with Vaccination Records */}
        {!selectedUnit.tenantId && pets.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-0 shadow-xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-slate-800/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1e3a5f]">
                    Registered Pets & Vaccinations
                  </h3>
                  <p className="text-sm text-gray-500">
                    {pets.length} pets registered with vaccination records
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={isAddPetOpen} onOpenChange={setIsAddPetOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-dashed border-pink-300 text-pink-600 hover:bg-pink-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Pet
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Pet Details' : 'Add New Pet'}</DialogTitle>
                        <DialogDescription>
                          {editingItem ? 'Update details for your registered pet' : 'Register a new pet for your unit'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="petName">Pet Name</Label>
                          <Input
                            id="petName"
                            placeholder="Bruno"
                            value={petForm.name}
                            onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="petType">Type</Label>
                            <Select
                              value={petForm.type}
                              onValueChange={(value) => setPetForm({ ...petForm, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Dog">Dog</SelectItem>
                                <SelectItem value="Cat">Cat</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="petBreed">Breed</Label>
                            <Input
                              id="petBreed"
                              placeholder="Golden Retriever"
                              value={petForm.breed}
                              onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="petAge">Age</Label>
                          <Input
                            id="petAge"
                            placeholder="3 Years"
                            value={petForm.age}
                            onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddPetOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            if (editingItem) {
                              updatePetMutation.mutate({
                                id: editingItem.id,
                                data: petForm
                              })
                            } else {
                              addPetMutation.mutate({
                                unitId: selectedUnit.id,
                                ...petForm
                              })
                            }
                            setIsAddPetOpen(false)
                            setEditingItem(null)
                            setPetForm({ name: '', type: 'Dog', breed: '', age: '' })
                          }}
                          className="bg-gradient-to-r from-pink-500 to-purple-500"
                          disabled={addPetMutation.isPending || updatePetMutation.isPending}
                        >
                          {editingItem ? (updatePetMutation.isPending ? 'Updating...' : 'Update Pet') : (addPetMutation.isPending ? 'Adding...' : 'Add Pet')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <div className="p-2 bg-pink-100 rounded-xl">
                    <PawPrint className="h-5 w-5 text-pink-600" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {pets.map((pet: UnitPet) => (
                  <Card key={pet.id} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white rounded-full shadow">
                          <PawPrint className="h-6 w-6 text-pink-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{pet.name}</p>
                          <p className="text-sm text-gray-500">{pet.type} | {pet.breed}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-pink-600"
                          onClick={() => {
                            setEditingItem({ type: 'pet', id: pet.id })
                            setPetForm({
                              name: pet.name,
                              type: pet.type,
                              breed: pet.breed || '',
                              age: '' // Not in pet model yet
                            })
                            setIsAddPetOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Dialog
                          open={isVaccinationDialogOpen && selectedPet?.id === pet.id}
                          onOpenChange={(open) => {
                            setIsVaccinationDialogOpen(open)
                            if (open) setSelectedPet(pet)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-pink-300 text-pink-600 hover:bg-pink-100"
                              onClick={() => setSelectedPet(pet)}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Upload Vaccination Certificate</DialogTitle>
                              <DialogDescription>
                                Upload vaccination certificate for {pet.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="vaccineName">Vaccination Name</Label>
                                <Input id="vaccineName" placeholder="e.g., Rabies, DHPP" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="vaccineDate">Vaccination Date</Label>
                                  <Input id="vaccineDate" type="date" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="nextDue">Next Due Date</Label>
                                  <Input id="nextDue" type="date" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="certificate">Certificate File</Label>
                                <Input id="certificate" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                                <p className="text-xs text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsVaccinationDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  toast.success('Vaccination certificate uploaded successfully')
                                  setIsVaccinationDialogOpen(false)
                                }}
                                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20"
                              >
                                Upload Certificate
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                        <Syringe className="h-4 w-4 text-purple-600" />
                        Vaccination Records
                      </h4>
                      {(pet.vaccinations || []).map((vaccination: any) => {
                        const isUpcoming = new Date(vaccination.nextDue) > new Date()
                        const daysUntilDue = Math.ceil((new Date(vaccination.nextDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

                        return (
                          <div
                            key={vaccination.id}
                            className="p-3 bg-white rounded-lg border border-purple-100"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-gray-900 text-sm">
                                    {vaccination.name}
                                  </p>
                                  <Badge
                                    className={
                                      daysUntilDue <= 30 && daysUntilDue > 0
                                        ? "bg-orange-100 text-orange-700 text-xs"
                                        : isUpcoming
                                          ? "bg-green-100 text-green-700 text-xs"
                                          : "bg-red-100 text-red-700 text-xs"
                                    }
                                  >
                                    {daysUntilDue <= 30 && daysUntilDue > 0
                                      ? "Due Soon"
                                      : isUpcoming
                                        ? "Valid"
                                        : "Overdue"}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                                  <div>
                                    <p className="text-gray-500">Vaccinated</p>
                                    <p className="font-medium">{vaccination.date}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Next Due</p>
                                    <p className="font-medium">{vaccination.nextDue}</p>
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                onClick={() => toast.success(`Viewing certificate for ${pet.name}`)}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                      {(!pet.vaccinations || pet.vaccinations.length === 0) && (
                        <p className="text-xs text-gray-500 italic p-2 bg-white/50 rounded border border-dashed border-purple-200 text-center">
                          No vaccination records uploaded yet.
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Payment History */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-0 shadow-xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-slate-800/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1e3a5f]">
                  Payment History
                </h3>
                <p className="text-sm text-gray-500">Recent transactions</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-teal-600 border-teal-200 hover:bg-teal-50"
                  onClick={handleDownloadHistory}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <div className="p-2 bg-green-100 rounded-xl">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto -mx-6 px-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Invoice</TableHead>
                    <TableHead className="font-semibold">Period</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">Paid Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment: any) => (
                    <TableRow key={payment.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-[#1e3a5f]">
                        {payment.id}
                      </TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.category}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        Rs. {payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-gray-500">-</TableCell>
                      <TableCell className="text-gray-500">{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                          onClick={() => {
                            setViewingInvoice(payment)
                            setIsInvoiceDetailsOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="ghost" className="text-teal-600 hover:text-teal-700">
                View All Transactions
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Invoice Details Dialog - MODERN REPLACEMENT FOR ALERT */}
        <Dialog open={isInvoiceDetailsOpen} onOpenChange={setIsInvoiceDetailsOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-0 shadow-2xl p-0 overflow-hidden">
            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] p-6 text-white text-center">
              <div className="mx-auto w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mb-4 border border-white/20">
                <FileText className="h-8 w-8 text-teal-300" />
              </div>
              <DialogTitle className="text-xl font-bold">Invoice Details</DialogTitle>
              <p className="text-white/60 text-sm mt-1">Transaction ID: #{viewingInvoice?.id}</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Category</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-100">
                      {viewingInvoice?.category}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Date</p>
                  <p className="font-semibold">{viewingInvoice ? new Date(viewingInvoice.date).toLocaleDateString() : '-'}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="text-2xl font-black text-[#1e3a5f] dark:text-teal-400">
                    ₹{viewingInvoice?.amount.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-slate-500">Status</p>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {viewingInvoice?.status}
                  </Badge>
                </div>
              </div>

              {viewingInvoice?.description && (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Description</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    "{viewingInvoice.description}"
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="p-6 pt-0 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setIsInvoiceDetailsOpen(false)}
              >
                Close
              </Button>
              <Button
                className="flex-1 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                onClick={() => {
                  toast.success('Downloading Receipt...')
                  setIsInvoiceDetailsOpen(false)
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </RoleGuard>
  )
}
