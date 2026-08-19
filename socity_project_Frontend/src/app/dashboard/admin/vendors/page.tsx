'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Plus,
  Search,
  Filter,
  Download,
  Users,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Eye,
  Edit,
  CheckCircle2,
  Trash2,
  Star,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  FileText,
  Calendar,
  Building2,
  CreditCard,
  History,
  MoreHorizontal,
  RefreshCw,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { VendorService } from '@/services/vendor.service'
import { RaiseComplaintAgainstVendorDialog } from '@/components/complaints/raise-complaint-against-vendor-dialog'

const stats = [
  {
    title: 'Total Vendors',
    value: '32',
    change: '+5 this month',
    icon: Users,
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    title: 'Active Vendors',
    value: '28',
    change: '87.5% active rate',
    icon: CheckCircle,
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    title: 'Contracts Expiring Soon',
    value: '5',
    change: 'Within 30 days',
    icon: AlertTriangle,
    gradient: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  {
    title: 'Pending Payments',
    value: '₹45,000',
    change: '3 vendors',
    icon: DollarSign,
    gradient: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
  },
]

interface Vendor {
  id: string
  name: string
  company: string
  type: string
  contactPerson: string
  phone: string
  email: string
  emergencyContact: string
  address: string
  gst: string
  pan: string
  rating: number
  status: 'active' | 'inactive'
  contractStatus: 'active' | 'expiring' | 'expired'
  contractStart: string
  contractEnd: string
  contractValue: number
  paymentTerms: string
  totalJobs: number
  completedJobs: number
  complaints: number
  lastPayment: string
  pendingAmount: number
  joinDate: string
  createdAt?: string // Optional as it might be missing in mock data but present in API
  serviceType?: string
  contact?: string
}

const vendors: Vendor[] = [
  {
    id: 'VND-001',
    name: 'ABC Electricals',
    company: 'ABC Electricals Pvt Ltd',
    type: 'Electrician',
    contactPerson: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    email: 'ramesh@abcelectricals.com',
    emergencyContact: '+91 98765 43299',
    address: '123 Main Street, Sector 15, Delhi - 110001',
    gst: '07AAACR5055K1Z5',
    pan: 'AAACR5055K',
    rating: 4.5,
    status: 'active',
    contractStatus: 'active',
    contractStart: '2023-01-15',
    contractEnd: '2025-01-14',
    contractValue: 240000,
    paymentTerms: 'Monthly - 30 days',
    totalJobs: 45,
    completedJobs: 42,
    complaints: 2,
    lastPayment: '2025-01-01',
    pendingAmount: 0,
    joinDate: '2022-01-15',
  },
  {
    id: 'VND-002',
    name: 'Green Clean Services',
    company: 'Green Clean Services LLP',
    type: 'Housekeeping',
    contactPerson: 'Priya Sharma',
    phone: '+91 98765 43211',
    email: 'priya@greenclean.com',
    emergencyContact: '+91 98765 43288',
    address: '456 Park Avenue, Dwarka, Delhi - 110075',
    gst: '07AABFG5678L1Z1',
    pan: 'AABFG5678L',
    rating: 4.8,
    status: 'active',
    contractStatus: 'active',
    contractStart: '2023-03-01',
    contractEnd: '2026-02-28',
    contractValue: 480000,
    paymentTerms: 'Monthly - 15 days',
    totalJobs: 120,
    completedJobs: 118,
    complaints: 1,
    lastPayment: '2025-01-05',
    pendingAmount: 0,
    joinDate: '2022-03-20',
  },
  {
    id: 'VND-003',
    name: 'PlumbPro Solutions',
    company: 'PlumbPro Solutions',
    type: 'Plumber',
    contactPerson: 'Amit Patel',
    phone: '+91 98765 43212',
    email: 'amit@plumbpro.com',
    emergencyContact: '+91 98765 43277',
    address: '789 Central Road, Rohini, Delhi - 110085',
    gst: '07AACCP1234M1Z2',
    pan: 'AACCP1234M',
    rating: 4.3,
    status: 'active',
    contractStatus: 'expiring',
    contractStart: '2023-06-10',
    contractEnd: '2025-02-09',
    contractValue: 180000,
    paymentTerms: 'Per Job - 7 days',
    totalJobs: 68,
    completedJobs: 64,
    complaints: 3,
    lastPayment: '2024-12-20',
    pendingAmount: 15000,
    joinDate: '2022-06-10',
  },
  {
    id: 'VND-004',
    name: 'Security Systems Inc',
    company: 'Security Systems India Pvt Ltd',
    type: 'Security',
    contactPerson: 'Rajesh Singh',
    phone: '+91 98765 43213',
    email: 'rajesh@securitysystems.com',
    emergencyContact: '+91 98765 43266',
    address: '321 Market Street, Janakpuri, Delhi - 110058',
    gst: '07AAECS9876N1Z3',
    pan: 'AAECS9876N',
    rating: 4.6,
    status: 'inactive',
    contractStatus: 'expired',
    contractStart: '2022-11-05',
    contractEnd: '2024-11-04',
    contractValue: 360000,
    paymentTerms: 'Quarterly - 30 days',
    totalJobs: 32,
    completedJobs: 30,
    complaints: 1,
    lastPayment: '2024-10-15',
    pendingAmount: 30000,
    joinDate: '2021-11-05',
  },
  {
    id: 'VND-005',
    name: 'Garden Masters',
    company: 'Garden Masters & Co',
    type: 'Housekeeping',
    contactPerson: 'Neha Gupta',
    phone: '+91 98765 43214',
    email: 'neha@gardenmasters.com',
    emergencyContact: '+91 98765 43255',
    address: '654 Green Lane, Pitampura, Delhi - 110034',
    gst: '07AABGM4321P1Z4',
    pan: 'AABGM4321P',
    rating: 4.7,
    status: 'active',
    contractStatus: 'active',
    contractStart: '2023-08-22',
    contractEnd: '2025-08-21',
    contractValue: 150000,
    paymentTerms: 'Monthly - 30 days',
    totalJobs: 56,
    completedJobs: 54,
    complaints: 0,
    lastPayment: '2025-01-03',
    pendingAmount: 0,
    joinDate: '2022-08-22',
  },
  {
    id: 'VND-006',
    name: 'Elite Pest Control',
    company: 'Elite Pest Control Services',
    type: 'Plumber',
    contactPerson: 'Suresh Reddy',
    phone: '+91 98765 43215',
    email: 'suresh@elitepest.com',
    emergencyContact: '+91 98765 43244',
    address: '88 Industrial Area, Mayur Vihar, Delhi - 110091',
    gst: '07AAEPC7890Q1Z5',
    pan: 'AAEPC7890Q',
    rating: 4.4,
    status: 'active',
    contractStatus: 'active',
    contractStart: '2024-01-01',
    contractEnd: '2025-12-31',
    contractValue: 120000,
    paymentTerms: 'Quarterly - 15 days',
    totalJobs: 24,
    completedJobs: 24,
    complaints: 0,
    lastPayment: '2024-12-28',
    pendingAmount: 0,
    joinDate: '2024-01-01',
  },
]

const vendorTypes = [
  'Plumber',
  'Electrician',
  'Housekeeping',
  'Security',
  'Pest Control',
  'Carpenter',
  'Painter',
  'Gardener',
  'Other',
]

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [contractFilter, setContractFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeFormTab, setActiveFormTab] = useState<'basic' | 'contact' | 'contract'>('basic')
  const [formError, setFormError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const [viewingVendor, setViewingVendor] = useState<Vendor | null>(null)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [ratingVendor, setRatingVendor] = useState<Vendor | null>(null)
  const [renewingVendor, setRenewingVendor] = useState<Vendor | null>(null)
  const [paymentHistoryVendor, setPaymentHistoryVendor] = useState<any | null>(null)
  const [complaintVendor, setComplaintVendor] = useState<any | null>(null)
  const [selectedRating, setSelectedRating] = useState(0)
  const queryClient = useQueryClient()

  // Add Vendor Form State (Admin adds society vendor – vendor gets login with email + password)
  const [vendorForm, setVendorForm] = useState({
    name: '',
    company: '',
    type: '',
    contactPerson: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    gst: '',
    pan: '',
    contractStart: '',
    contractEnd: '',
    contractValue: '',
    paymentTerms: '',
    servicePincodes: ''
  })

  // Queries
  const { data: apiVendors = [], isLoading: isVendorsLoading } = useQuery({
    queryKey: ['vendors', typeFilter, statusFilter],
    queryFn: () => VendorService.getAll(typeFilter, statusFilter)
  })

  const { data: serverStats } = useQuery({
    queryKey: ['vendor-stats'],
    queryFn: () => VendorService.getStats()
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: VendorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
      queryClient.invalidateQueries({ queryKey: ['vendor-stats'] })
      setIsAddDialogOpen(false)
      setFormError(null)
      setActiveFormTab('basic')
      setVendorForm({
        name: '',
        company: '',
        type: '',
        contactPerson: '',
        phone: '',
        email: '',
        password: '',
        address: '',
        gst: '',
        pan: '',
        contractStart: '',
        contractEnd: '',
        contractValue: '',
        paymentTerms: '',
        servicePincodes: ''
      })
      showNotification('Vendor added successfully!')
    },
    onError: (error: any) => {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to add vendor'
      setFormError(errorMsg)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: VendorService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
      queryClient.invalidateQueries({ queryKey: ['vendor-stats'] })
      showNotification('Vendor deleted successfully!')
    }
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string | number, status: string }) =>
      VendorService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
      queryClient.invalidateQueries({ queryKey: ['vendor-stats'] })
      showNotification('Status updated successfully!')
    }
  })

  const stats = [
    {
      title: 'Total Vendors',
      value: serverStats?.totalVendors || '0',
      change: '+5 this month',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Vendors',
      value: serverStats?.activeVendors || '0',
      change: '87.5% active rate',
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Contracts Expiring Soon',
      value: '5',
      change: 'Within 30 days',
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Pending Amount',
      value: `₹${(serverStats?.pendingPayments || 0).toLocaleString()}`,
      change: '3 vendors',
      icon: DollarSign,
      gradient: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ]

  const showNotification = (message: string) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleAddVendor = () => {
    setFormError(null)

    if (!vendorForm.name?.trim()) {
      setActiveFormTab('basic')
      setFormError('Please enter Vendor Name in Basic Info tab.')
      return
    }
    if (!vendorForm.type) {
      setActiveFormTab('basic')
      setFormError('Please select Vendor Type in Basic Info tab.')
      return
    }
    if (!vendorForm.contactPerson?.trim()) {
      setActiveFormTab('basic')
      setFormError('Please enter Contact Person name in Basic Info tab.')
      return
    }
    if (!vendorForm.phone?.trim()) {
      setActiveFormTab('contact')
      setFormError('Please enter Phone Number in Contact Details tab.')
      return
    }
    if (!vendorForm.email?.trim()) {
      setActiveFormTab('contact')
      setFormError('Please enter Email Address in Contact Details tab.')
      return
    }
    if (!vendorForm.password || vendorForm.password.length < 6) {
      setActiveFormTab('contact')
      setFormError('Please enter a Login Password (minimum 6 characters) in Contact Details tab.')
      return
    }

    createMutation.mutate({
      name: vendorForm.name.trim(),
      company: vendorForm.company?.trim(),
      type: vendorForm.type,
      contactPerson: vendorForm.contactPerson.trim(),
      phone: vendorForm.phone.trim(),
      email: vendorForm.email.trim(),
      password: vendorForm.password,
      address: vendorForm.address?.trim(),
      gst: vendorForm.gst?.trim(),
      pan: vendorForm.pan?.trim(),
      contractStart: vendorForm.contractStart,
      contractEnd: vendorForm.contractEnd,
      contractValue: vendorForm.contractValue ? parseFloat(vendorForm.contractValue) : undefined,
      paymentTerms: vendorForm.paymentTerms,
      servicePincodes: vendorForm.servicePincodes?.trim() || undefined
    })
  }

  const handleExport = () => {
    // Export vendors to CSV
    const csvData = filteredVendors.map(v => ({
      Name: v.name,
      Company: v.company || '',
      Type: v.serviceType || v.type,
      Contact: v.contact || v.phone,
      Email: v.email || '',
      Status: v.status,
      Address: v.address || ''
    }))

    const headers = Object.keys(csvData[0] || {}).join(',')
    const rows = csvData.map(row => Object.values(row).join(','))
    const csv = [headers, ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vendors-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    showNotification('Vendors data exported successfully!')
  }

  const handleViewDetails = (vendor: any) => {
    setViewingVendor(vendor)
  }

  const handleEditVendor = (vendor: any) => {
    setEditingVendor(vendor)
  }

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number, data: any }) =>
      VendorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
      queryClient.invalidateQueries({ queryKey: ['vendor-stats'] })
      setEditingVendor(null)
      showNotification('Vendor updated successfully!')
    }
  })

  const renewMutation = useMutation({
    mutationFn: VendorService.renewContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
      setRenewingVendor(null)
      showNotification('Contract renewed successfully!')
    }
  })

  const rateMutation = useMutation({
    mutationFn: ({ id, rating }: { id: string | number, rating: number }) =>
      VendorService.rateVendor(id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] })
      setRatingVendor(null)
      showNotification('Rating submitted successfully!')
    }
  })

  const handleSaveEdit = () => {
    if (editingVendor) {
      const payload = {
        ...editingVendor,
        status: editingVendor.contractStatus === 'expired' ? 'INACTIVE' : (editingVendor.status || 'ACTIVE').toUpperCase(),
        serviceType: editingVendor.type || editingVendor.serviceType,
        contact: editingVendor.phone || editingVendor.contact,
        contractStart: editingVendor.contractStart ? new Date(editingVendor.contractStart).toISOString() : undefined,
        contractEnd: editingVendor.contractEnd ? new Date(editingVendor.contractEnd).toISOString() : undefined,
      };
      updateMutation.mutate({ id: editingVendor.id, data: payload });
    }
  }

  const handleDeleteVendor = (vendorId: string) => {
    if (confirm(`Are you sure you want to delete vendor ${vendorId}?`)) {
      deleteMutation.mutate(vendorId)
    }
  }

  const handleMarkInactive = (vendorId: string) => {
    if (confirm(`Are you sure you want to mark vendor ${vendorId} as inactive?`)) {
      statusMutation.mutate({ id: vendorId, status: 'INACTIVE' })
    }
  }

  const handleRenewContract = () => {
    if (renewingVendor) {
      renewMutation.mutate(renewingVendor.id)
    }
  }

  const handleRateVendor = (rating: number) => {
    if (ratingVendor) {
      rateMutation.mutate({ id: ratingVendor.id, rating })
    }
  }

  const handleViewPaymentHistory = (vendor: any) => {
    // Fetch payment history
    VendorService.getPaymentHistory(vendor.id)
      .then(data => {
        setPaymentHistoryVendor({ ...vendor, payments: data })
      })
      .catch(err => {
        showNotification('Failed to load payment history')
      })
  }

  const enrichedVendors = (Array.isArray(apiVendors) ? apiVendors : []).map((vendor: any) => {
    const endDate = vendor.contractEnd ? new Date(vendor.contractEnd) : null;
    let contractStatus = 'active'; // Default
    if (endDate && !isNaN(endDate.getTime())) {
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) contractStatus = 'expired';
      else if (diffDays <= 30) contractStatus = 'expiring';
    }

    return {
      ...vendor,
      type: vendor.serviceType || vendor.type,
      phone: vendor.contact || vendor.phone,
      contractStatus,
    };
  });

  const filteredVendors = enrichedVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.contactPerson || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vendor.phone || '').includes(searchQuery)

    const matchesType = typeFilter === 'all' || vendor.type === typeFilter
    const matchesStatus = statusFilter === 'all' || vendor.status?.toLowerCase() === statusFilter.toLowerCase()
    const matchesContract = contractFilter === 'all' || vendor.contractStatus === contractFilter

    return matchesSearch && matchesType && matchesStatus && matchesContract
  })

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="h-5 w-5" />
              {showSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vendor Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Manage all society vendors and service providers
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2 text-sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white gap-2 text-sm shadow-lg shadow-teal-500/25">
                  <Plus className="h-4 w-4" />
                  <span>Add Vendor</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Vendor</DialogTitle>
                  <DialogDescription>
                    Register a new vendor or service provider with complete details
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="animate-in fade-in slide-in-from-top-2">
                    <Tabs value={activeFormTab} onValueChange={(val: any) => setActiveFormTab(val)} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic">
                          Basic Info
                          {(!vendorForm.name || !vendorForm.type || !vendorForm.contactPerson) && (
                            <span className="ml-1 text-red-500 font-bold">*</span>
                          )}
                        </TabsTrigger>
                        <TabsTrigger value="contact">
                          Contact Details
                          {(!vendorForm.phone || !vendorForm.email || !vendorForm.password) && (
                            <span className="ml-1 text-red-500 font-bold">*</span>
                          )}
                        </TabsTrigger>
                        <TabsTrigger value="contract">Contract Info</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Vendor Name *</Label>
                            <Input
                              placeholder="ABC Services"
                              value={vendorForm.name}
                              onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input
                              placeholder="ABC Services Pvt Ltd"
                              value={vendorForm.company}
                              onChange={(e) => setVendorForm({ ...vendorForm, company: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Vendor Type *</Label>
                            <Select
                              value={vendorForm.type}
                              onValueChange={(value) => setVendorForm({ ...vendorForm, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {vendorTypes.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Contact Person *</Label>
                            <Input
                              placeholder="John Doe"
                              value={vendorForm.contactPerson}
                              onChange={(e) => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>GST Number</Label>
                            <Input
                              placeholder="07AAACR5055K1Z5"
                              value={vendorForm.gst}
                              onChange={(e) => setVendorForm({ ...vendorForm, gst: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>PAN Number</Label>
                            <Input
                              placeholder="AAACR5055K"
                              value={vendorForm.pan}
                              onChange={(e) => setVendorForm({ ...vendorForm, pan: e.target.value })}
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="contact" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Phone Number *</Label>
                            <Input
                              type="tel"
                              placeholder="+91 98765 43210"
                              value={vendorForm.phone}
                              onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email Address *</Label>
                            <Input
                              type="email"
                              placeholder="contact@vendor.com"
                              value={vendorForm.email}
                              onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
                              required
                            />
                            <p className="text-xs text-gray-500">Vendor will use this email to log in to the dashboard.</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Login Password *</Label>
                          <Input
                            type="password"
                            placeholder="Minimum 6 characters"
                            minLength={6}
                            value={vendorForm.password}
                            onChange={(e) => setVendorForm({ ...vendorForm, password: e.target.value })}
                            required
                          />
                          <p className="text-xs text-gray-500">Share this password with the vendor. They will use Email + Password to sign in.</p>
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-teal-500" />
                            Serviceable PIN Codes (optional)
                          </Label>
                          <Input
                            placeholder="e.g. 110001, 110002, 110010-110020"
                            value={vendorForm.servicePincodes}
                            onChange={(e) => setVendorForm({ ...vendorForm, servicePincodes: e.target.value })}
                          />
                          <p className="text-xs text-gray-500">Comma-separated or range. Used if this vendor serves individual customers by location.</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Complete Address</Label>
                          <Textarea
                            placeholder="Street address, city, state, pincode"
                            rows={3}
                            value={vendorForm.address}
                            onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="contract" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Contract Start Date</Label>
                            <Input
                              type="date"
                              value={vendorForm.contractStart}
                              onChange={(e) => setVendorForm({ ...vendorForm, contractStart: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Contract End Date</Label>
                            <Input
                              type="date"
                              value={vendorForm.contractEnd}
                              onChange={(e) => setVendorForm({ ...vendorForm, contractEnd: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Contract Value (₹)</Label>
                            <Input
                              type="number"
                              placeholder="240000"
                              value={vendorForm.contractValue}
                              onChange={(e) => setVendorForm({ ...vendorForm, contractValue: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Payment Terms</Label>
                            <Select
                              value={vendorForm.paymentTerms}
                              onValueChange={(value) => setVendorForm({ ...vendorForm, paymentTerms: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select terms" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly-30">Monthly - 30 days</SelectItem>
                                <SelectItem value="monthly-15">Monthly - 15 days</SelectItem>
                                <SelectItem value="quarterly">Quarterly - 30 days</SelectItem>
                                <SelectItem value="per-job">Per Job - 7 days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <DialogFooter className="pt-4 border-t border-gray-100">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      disabled={createMutation.isPending}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white gap-2"
                      onClick={handleAddVendor}
                    >
                      {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                      {createMutation.isPending ? 'Adding Vendor...' : 'Add Vendor'}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
                  <CardContent className="p-5 sm:p-6 relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-xs text-gray-500">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.textColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Filters */}
        <Card className="p-4 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name, company, contact..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {vendorTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={contractFilter} onValueChange={setContractFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Contract" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contracts</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Vendors Table */}
        <Card className="overflow-hidden shadow-md border-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Vendor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                            {vendor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{vendor.name}</p>
                          <p className="text-xs text-gray-500">{vendor.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">{vendor.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{vendor.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{vendor.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{vendor.rating}</span>
                        <span className="text-xs text-gray-500">({vendor.totalJobs})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          vendor.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                        }
                      >
                        {vendor.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {vendor.status === 'inactive' && <XCircle className="h-3 w-3 mr-1" />}
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          vendor.contractStatus === 'active'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                            : vendor.contractStatus === 'expiring'
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                              : 'bg-red-100 text-red-700 hover:bg-red-100'
                        }
                      >
                        {vendor.contractStatus === 'expiring' && <Clock className="h-3 w-3 mr-1" />}
                        {vendor.contractStatus === 'expired' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {vendor.contractStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="View Details"
                          onClick={() => setViewingVendor(vendor)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewingVendor(vendor)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingVendor(vendor)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Vendor
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRenewingVendor(vendor)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Renew Contract
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewPaymentHistory(vendor)}>
                              <History className="h-4 w-4 mr-2" />
                              Payment History
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setComplaintVendor(vendor)}>
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Raise Complaint Against Vendor
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRatingVendor(vendor)}>
                              <Star className="h-4 w-4 mr-2" />
                              Rate Vendor
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {vendor.status === 'active' && (
                              <DropdownMenuItem onClick={() => handleMarkInactive(vendor.id)}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Mark Inactive
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteVendor(vendor.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* View Vendor Dialog */}
        <Dialog open={viewingVendor !== null} onOpenChange={() => setViewingVendor(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Vendor Details</DialogTitle>
              <DialogDescription>Complete vendor information and performance metrics</DialogDescription>
            </DialogHeader>
            {viewingVendor && (
              <Tabs defaultValue="info" className="py-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="info">Basic Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="contract">Contract</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white text-xl">
                        {viewingVendor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{viewingVendor.name}</h3>
                      <p className="text-sm text-muted-foreground">{viewingVendor.company}</p>
                      <p className="text-xs text-muted-foreground">{viewingVendor.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={viewingVendor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {viewingVendor.status}
                      </Badge>
                      <Badge variant="outline">{viewingVendor.type}</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Label className="text-muted-foreground text-xs">GST Number</Label>
                      <p className="font-mono font-medium text-sm">{viewingVendor.gst || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Label className="text-muted-foreground text-xs">PAN Number</Label>
                      <p className="font-mono font-medium text-sm">{viewingVendor.pan || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Label className="text-muted-foreground text-xs">Join Date</Label>
                      <p className="font-medium text-sm">
                        {viewingVendor.createdAt ? new Date(viewingVendor.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Label className="text-muted-foreground text-xs">Contact Person</Label>
                      <p className="font-medium text-sm">{viewingVendor.contactPerson || 'N/A'}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>Primary Phone</span>
                      </div>
                      <p className="font-semibold">{viewingVendor.phone}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Phone className="h-3 w-3 mr-2" /> Call Now
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>Emergency Contact</span>
                      </div>
                      <p className="font-semibold">{viewingVendor.emergencyContact}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Phone className="h-3 w-3 mr-2" /> Call Emergency
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>Email Address</span>
                    </div>
                    <p className="font-semibold">{viewingVendor.email}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Mail className="h-3 w-3 mr-2" /> Send Email
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>Address</span>
                    </div>
                    <p className="font-medium">{viewingVendor.address}</p>
                  </div>
                </TabsContent>

                <TabsContent value="contract" className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-blue-900">Contract Status</h4>
                      <Badge
                        className={
                          viewingVendor.contractStatus === 'active'
                            ? 'bg-blue-100 text-blue-700'
                            : viewingVendor.contractStatus === 'expiring'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-red-100 text-red-700'
                        }
                      >
                        {viewingVendor.contractStatus}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-blue-700">Start Date</Label>
                        <p className="font-medium">{new Date(viewingVendor.contractStart).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-blue-700">End Date</Label>
                        <p className="font-medium">{new Date(viewingVendor.contractEnd).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <Label className="text-xs text-muted-foreground">Contract Value</Label>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{viewingVendor.contractValue ? viewingVendor.contractValue.toLocaleString() : '0'}
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Label className="text-xs text-muted-foreground">Payment Terms</Label>
                      <p className="font-semibold">{viewingVendor.paymentTerms || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <Label className="text-xs text-muted-foreground">Last Payment</Label>
                      <p className="font-medium">{viewingVendor.lastPayment ? new Date(viewingVendor.lastPayment).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Label className="text-xs text-muted-foreground">Pending Amount</Label>
                      <p className={`text-lg font-bold ${(viewingVendor.pendingAmount || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{(viewingVendor.pendingAmount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs text-muted-foreground">Rating</Label>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                            <span className="text-2xl font-bold">{viewingVendor.rating || '0'}</span>
                          </div>
                        </div>
                        <TrendingUp className="h-8 w-8 text-yellow-600" />
                      </div>
                    </Card>
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs text-muted-foreground">Total Jobs</Label>
                          <p className="text-2xl font-bold mt-1">{viewingVendor.totalJobs || 0}</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                    </Card>
                    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-xs text-muted-foreground">Completed</Label>
                          <p className="text-2xl font-bold mt-1">{viewingVendor.completedJobs || 0}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </Card>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Label className="text-sm text-muted-foreground">Complaints</Label>
                    <div className="flex items-center justify-between mt-2">
                      <p className={`text-3xl font-bold ${viewingVendor.complaints === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                        {viewingVendor.complaints}
                      </p>
                      {viewingVendor.complaints === 0 ? (
                        <Badge className="bg-green-100 text-green-700">No Complaints</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-700">Needs Attention</Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium mb-2 block">Success Rate</Label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                          style={{ width: `${(viewingVendor.completedJobs / viewingVendor.totalJobs) * 100}%` }}
                        />
                      </div>
                      <span className="font-semibold text-sm">
                        {Math.round((viewingVendor.completedJobs / viewingVendor.totalJobs) * 100)}%
                      </span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingVendor(null)}>
                Close
              </Button>
              <Button onClick={() => {
                setViewingVendor(null)
                if (viewingVendor) setEditingVendor(viewingVendor)
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Vendor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Vendor Dialog */}
        <Dialog open={editingVendor !== null} onOpenChange={() => setEditingVendor(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Vendor</DialogTitle>
              <DialogDescription>Update vendor information and contract details</DialogDescription>
            </DialogHeader>
            {editingVendor && (
              <Tabs defaultValue="basic" className="py-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="contract">Contract</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vendor Name *</Label>
                      <Input
                        value={editingVendor.name || ''}
                        onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={editingVendor.company || ''}
                        onChange={(e) => setEditingVendor({ ...editingVendor, company: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type *</Label>
                      <Select
                        value={editingVendor.type || editingVendor.serviceType}
                        onValueChange={(value) => setEditingVendor({ ...editingVendor, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {vendorTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={editingVendor.status?.toLowerCase()}
                        onValueChange={(value) => setEditingVendor({ ...editingVendor, status: value as 'active' | 'inactive' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>GST Number</Label>
                      <Input defaultValue={editingVendor.gst} />
                    </div>
                    <div className="space-y-2">
                      <Label>PAN Number</Label>
                      <Input defaultValue={editingVendor.pan} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input
                      value={editingVendor.contactPerson || ''}
                      onChange={(e) => setEditingVendor({ ...editingVendor, contactPerson: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={editingVendor.phone || editingVendor.contact || ''}
                        onChange={(e) => setEditingVendor({ ...editingVendor, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Emergency Contact</Label>
                      <Input
                        value={editingVendor.emergencyContact || ''}
                        onChange={(e) => setEditingVendor({ ...editingVendor, emergencyContact: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={editingVendor.email || ''}
                      onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={editingVendor.address || ''}
                      onChange={(e) => setEditingVendor({ ...editingVendor, address: e.target.value })}
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="contract" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contract Start Date</Label>
                      <Input
                        type="date"
                        value={editingVendor.contractStart ? new Date(editingVendor.contractStart).toISOString().split('T')[0] : ''}
                        onChange={(e) => setEditingVendor({ ...editingVendor, contractStart: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contract End Date</Label>
                      <Input
                        type="date"
                        value={editingVendor.contractEnd ? new Date(editingVendor.contractEnd).toISOString().split('T')[0] : ''}
                        onChange={(e) => setEditingVendor({ ...editingVendor, contractEnd: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contract Value (₹)</Label>
                      <Input
                        type="number"
                        value={editingVendor.contractValue || ''}
                        onChange={(e) => setEditingVendor({ ...editingVendor, contractValue: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Terms</Label>
                      <Select
                        value={editingVendor.paymentTerms}
                        onValueChange={(value) => setEditingVendor({ ...editingVendor, paymentTerms: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly-30">Monthly - 30 days</SelectItem>
                          <SelectItem value="monthly-15">Monthly - 15 days</SelectItem>
                          <SelectItem value="quarterly-30">Quarterly - 30 days</SelectItem>
                          <SelectItem value="perjob-7">Per Job - 7 days</SelectItem>
                          <SelectItem value="advance">100% Advance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contract Status</Label>
                      <Select
                        value={editingVendor.contractStatus || 'active'}
                        onValueChange={(value) => {
                          let updatedEnd = editingVendor.contractEnd;
                          if (value === 'active') {
                            const currentEnd = editingVendor.contractEnd ? new Date(editingVendor.contractEnd) : new Date();
                            if (currentEnd <= new Date()) {
                              const nextYear = new Date();
                              nextYear.setFullYear(nextYear.getFullYear() + 1);
                              updatedEnd = nextYear.toISOString().split('T')[0];
                            }
                          }
                          setEditingVendor({
                            ...editingVendor,
                            contractStatus: value as 'active' | 'expiring' | 'expired',
                            contractEnd: updatedEnd,
                            status: value === 'expired' ? 'inactive' : 'active'
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expiring">Expiring Soon</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Pending Amount (₹)</Label>
                      <Input
                        type="number"
                        value={editingVendor.pendingAmount || 0}
                        onChange={(e) => setEditingVendor({ ...editingVendor, pendingAmount: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingVendor(null)}>Cancel</Button>
              <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Renew Contract Dialog */}
        <Dialog open={renewingVendor !== null} onOpenChange={() => setRenewingVendor(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Renew Contract</DialogTitle>
              <DialogDescription>
                Renew the contract for {renewingVendor?.name}
              </DialogDescription>
            </DialogHeader>
            {renewingVendor && (
              <div className="space-y-4 py-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Current Contract</Label>
                  <p className="font-medium text-sm mt-1">
                    {new Date(renewingVendor.contractStart).toLocaleDateString()} - {new Date(renewingVendor.contractEnd).toLocaleDateString()}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>New End Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Contract Value (₹)</Label>
                  <Input type="number" defaultValue={renewingVendor.contractValue} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select defaultValue="monthly-30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly-30">Monthly - 30 days</SelectItem>
                      <SelectItem value="monthly-15">Monthly - 15 days</SelectItem>
                      <SelectItem value="quarterly">Quarterly - 30 days</SelectItem>
                      <SelectItem value="per-job">Per Job - 7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenewingVendor(null)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleRenewContract}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Renew Contract
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rate Vendor Dialog */}
        <Dialog open={ratingVendor !== null} onOpenChange={() => setRatingVendor(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Rate Vendor</DialogTitle>
              <DialogDescription>
                Provide a rating for {ratingVendor?.name}
              </DialogDescription>
            </DialogHeader>
            {ratingVendor && (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-center gap-2 py-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="hover:scale-110 transition-transform"
                      onClick={() => setSelectedRating(star)}
                    >
                      <Star
                        className={`h-10 w-10 ${star <= selectedRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} hover:text-yellow-500`}
                      />
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Feedback / Comments</Label>
                  <Textarea placeholder="Share your experience with this vendor..." rows={4} />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Current Rating</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-lg">{ratingVendor.rating}</span>
                    <span className="text-sm text-muted-foreground">({ratingVendor.totalJobs} jobs)</span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setRatingVendor(null)}>Cancel</Button>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={() => handleRateVendor(selectedRating)}>
                <Star className="h-4 w-4 mr-2" />
                Submit Rating
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Raise Complaint Against Vendor */}
        <RaiseComplaintAgainstVendorDialog
          vendor={complaintVendor}
          open={complaintVendor !== null}
          onOpenChange={(o) => !o && setComplaintVendor(null)}
        />

        {/* Payment History Dialog */}
        <Dialog open={paymentHistoryVendor !== null} onOpenChange={() => setPaymentHistoryVendor(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Payment History</DialogTitle>
              <DialogDescription>
                Payment records for {paymentHistoryVendor?.name}
              </DialogDescription>
            </DialogHeader>
            {paymentHistoryVendor && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 border-0 bg-green-50">
                    <Label className="text-xs text-muted-foreground">Total Paid</Label>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{((paymentHistoryVendor.contractValue || 0) - (paymentHistoryVendor.pendingAmount || 0)).toLocaleString()}
                    </p>
                  </Card>
                  <Card className="p-4 border-0 bg-orange-50">
                    <Label className="text-xs text-muted-foreground">Pending</Label>
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{(paymentHistoryVendor.pendingAmount || 0).toLocaleString()}
                    </p>
                  </Card>
                  <Card className="p-4 border-0 bg-blue-50">
                    <Label className="text-xs text-muted-foreground">Last Payment</Label>
                    <p className="font-medium">
                      {paymentHistoryVendor.lastPayment ? new Date(paymentHistoryVendor.lastPayment).toLocaleDateString() : 'N/A'}
                    </p>
                  </Card>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm">Recent Transactions</h4>
                </div>
                <Separator className="mb-3" />
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {(paymentHistoryVendor.payments && paymentHistoryVendor.payments.length > 0) ? (
                    paymentHistoryVendor.payments.map((payment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Payment #{payment.invoiceNumber || index + 1}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(payment.date || new Date()).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">₹{(payment.amount || 0).toLocaleString()}</p>
                          <Badge className="bg-green-100 text-green-700 text-xs">{payment.status || 'Completed'}</Badge>
                        </div>
                      </div>
                    ))) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No payment history available
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setPaymentHistoryVendor(null)}>Close</Button>
              <Button onClick={() => {
                const headers = "Date,Amount,Status,Invoice\n";
                const rows = paymentHistoryVendor.payments?.map((p: any) =>
                  `${new Date(p.date || new Date()).toLocaleDateString()},${p.amount},${p.status || 'Completed'},${p.invoiceNumber || ''}`
                ).join('\n') || '';
                const csv = headers + rows;
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `payment-history-${paymentHistoryVendor.name}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
                showNotification('Report downloaded successfully!');
              }}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
