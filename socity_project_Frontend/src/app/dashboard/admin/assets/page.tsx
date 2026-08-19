'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Plus,
  Search,
  Filter,
  Download,
  Package,
  Wrench,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  CheckCircle2,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AssetService } from '@/services/asset.service'

const stats = [
  {
    title: 'Total Asset Value',
    value: '\u20B91.06Cr',
    change: '156 assets',
    icon: Package,
    color: 'blue',
  },
  {
    title: 'Monthly Expense',
    value: '\u20B92.8L',
    change: 'AMC + Maintenance',
    icon: Wrench,
    color: 'purple',
  },
  {
    title: 'Working Assets',
    value: '142',
    change: '91% operational',
    icon: CheckCircle,
    color: 'green',
  },
  {
    title: 'Maintenance Due',
    value: '8',
    change: 'Needs attention',
    icon: AlertCircle,
    color: 'orange',
  },
]

const assets = [
  {
    id: 'AST-001',
    name: 'Swimming Pool',
    category: 'Amenity',
    location: 'Block A - Ground Floor',
    purchaseDate: '2020-01-15',
    value: 5000000,
    monthlyExpense: 45000,
    amcCost: 120000,
    condition: 'working',
    lastMaintenance: '2024-12-01',
    nextMaintenance: '2025-03-01',
    status: 'active',
  },
  {
    id: 'AST-002',
    name: 'Gymnasium Equipment',
    category: 'Fitness',
    location: 'Club House',
    purchaseDate: '2021-06-10',
    value: 850000,
    monthlyExpense: 15000,
    amcCost: 48000,
    condition: 'working',
    lastMaintenance: '2024-11-15',
    nextMaintenance: '2025-02-15',
    status: 'active',
  },
  {
    id: 'AST-003',
    name: 'Fire Fighting System',
    category: 'Safety',
    location: 'All Blocks',
    purchaseDate: '2019-03-20',
    value: 2500000,
    monthlyExpense: 8000,
    amcCost: 60000,
    condition: 'working',
    lastMaintenance: '2024-12-20',
    nextMaintenance: '2025-06-20',
    status: 'active',
  },
  {
    id: 'AST-004',
    name: 'Elevator - Block A',
    category: 'Equipment',
    location: 'Block A',
    purchaseDate: '2019-01-01',
    value: 1800000,
    monthlyExpense: 35000,
    amcCost: 180000,
    condition: 'maintenance',
    lastMaintenance: '2024-12-28',
    nextMaintenance: '2025-01-10',
    status: 'maintenance',
  },
  {
    id: 'AST-005',
    name: 'CCTV System',
    category: 'Security',
    location: 'All Areas',
    purchaseDate: '2020-08-15',
    value: 450000,
    monthlyExpense: 5000,
    amcCost: 36000,
    condition: 'working',
    lastMaintenance: '2024-11-01',
    nextMaintenance: '2025-05-01',
    status: 'active',
  },
]

export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [conditionFilter, setConditionFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const [viewingAsset, setViewingAsset] = useState<any | null>(null)
  const [editingAsset, setEditingAsset] = useState<any | null>(null)

  // Form state for Add Asset
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    purchaseDate: '',
    value: '',
    condition: 'working',
    description: ''
  })

  const queryClient = useQueryClient()

  // Fetch assets from API
  const { data: assetsData, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: AssetService.getAll,
  })

  // Get stats
  const { data: statsData } = useQuery({
    queryKey: ['assets-stats'],
    queryFn: AssetService.getStats,
  })

  const apiAssets = assetsData?.data || []

  // Create mutation
  const createMutation = useMutation({
    mutationFn: AssetService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['assets-stats'] })
      setIsAddDialogOpen(false)
      setFormData({
        name: '',
        category: '',
        location: '',
        purchaseDate: '',
        value: '',
        condition: 'working',
        description: ''
      })
      showNotification('Asset added successfully!')
    },
    onError: (error: any) => {
      showNotification(error.response?.data?.message || 'Failed to add asset')
    }
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: AssetService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['assets-stats'] })
      showNotification('Asset deleted successfully!')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      AssetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['assets-stats'] })
      setEditingAsset(null)
      setEditFormData({
        name: '',
        category: '',
        location: '',
        value: '',
        condition: 'working'
      })
      showNotification('Asset updated successfully!')
    },
    onError: (error: any) => {
      showNotification(error.response?.data?.message || 'Failed to update asset')
    }
  })

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    category: '',
    location: '',
    value: '',
    condition: 'working'
  })

  const showNotification = (message: string) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(null), 3000)
  }

  const handleAddAsset = () => {
    if (!formData.name || !formData.category || !formData.value || !formData.purchaseDate) {
      showNotification('Please fill in all required fields')
      return
    }

    createMutation.mutate({
      name: formData.name,
      category: formData.category,
      value: parseFloat(formData.value),
      purchaseDate: formData.purchaseDate,
      status: formData.condition.toUpperCase()
    })
  }

  const handleExport = () => {
    const csvData = filteredAssets.map((asset: any) => ({
      'Asset ID': asset.id,
      'Name': asset.name,
      'Category': asset.category || '',
      'Location': asset.location || '',
      'Value': asset.value || 0,
      'Monthly Expense': asset.monthlyExpense || 0,
      'AMC Cost': asset.amcCost || 0,
      'Condition': asset.condition || asset.status || '',
      'Last Maintenance': asset.lastMaintenance || '',
      'Next Maintenance': asset.nextMaintenance || ''
    }))

    const headers = Object.keys(csvData[0] || {})
    const csvContent = [
      headers.join(','),
      ...csvData.map((row: any) => headers.map(header => `"${row[header as keyof typeof row]}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `assets_${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    showNotification('Assets exported successfully!')
  }

  const handleViewAsset = (asset: typeof assets[0]) => {
    setViewingAsset(asset)
  }

  const handleEditAsset = (asset: any) => {
    setEditingAsset(asset)
    setEditFormData({
      name: asset.name || '',
      category: asset.category || '',
      location: asset.location || '',
      value: asset.value?.toString() || '',
      condition: asset.condition || asset.status?.toLowerCase() || 'working'
    })
  }

  const handleSaveEdit = () => {
    if (!editingAsset) return

    if (!editFormData.name || !editFormData.category) {
      showNotification('Please fill in required fields')
      return
    }

    updateMutation.mutate({
      id: editingAsset.id,
      data: {
        name: editFormData.name,
        category: editFormData.category,
        value: editFormData.value ? parseFloat(editFormData.value) : undefined,
        status: editFormData.condition.toUpperCase()
      }
    })
  }

  const handleDeleteAsset = (assetId: string) => {
    if (confirm(`Are you sure you want to delete asset ${assetId}?`)) {
      deleteMutation.mutate(assetId)
    }
  }

  const filteredAssets = apiAssets.filter((asset: any) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.location || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter
    const matchesCondition = conditionFilter === 'all' || (asset.condition || asset.status)?.toLowerCase() === conditionFilter

    return matchesSearch && matchesCategory && matchesCondition
  })

  const stats = [
    {
      title: 'Total Asset Value',
      value: `₹${((statsData?.data?.totalValue || 0) / 10000000).toFixed(2)}Cr`,
      change: `${statsData?.data?.totalAssets || 0} assets`,
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Monthly Expense',
      value: '₹2.8L',
      change: 'AMC + Maintenance',
      icon: Wrench,
      color: 'purple',
    },
    {
      title: 'Working Assets',
      value: filteredAssets.filter((a: any) => (a.condition || a.status)?.toLowerCase() === 'working').length,
      change: '91% operational',
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Maintenance Due',
      value: filteredAssets.filter((a: any) => (a.condition || a.status)?.toLowerCase() === 'maintenance').length,
      change: 'Needs attention',
      icon: AlertCircle,
      color: 'orange',
    },
  ]

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Asset Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Track and manage all society assets and equipment
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2 text-sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white gap-2 text-sm">
                  <Plus className="h-4 w-4" />
                  <span>Add Asset</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Asset</DialogTitle>
                  <DialogDescription>
                    Register a new asset to the society inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Asset Name *</Label>
                      <Input
                        placeholder="Swimming Pool"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Amenity">Amenity</SelectItem>
                          <SelectItem value="Fitness">Fitness</SelectItem>
                          <SelectItem value="Safety">Safety</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="Block A - Ground Floor"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Purchase Date *</Label>
                      <Input
                        type="date"
                        value={formData.purchaseDate}
                        onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Asset Value (₹) *</Label>
                      <Input
                        type="number"
                        placeholder="500000"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="working">Working</SelectItem>
                          <SelectItem value="maintenance">Under Maintenance</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Asset details..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddAsset}
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? 'Adding...' : 'Add Asset'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </h3>
                      <p className={`text-sm mt-1 ${stat.color === 'red' ? 'text-red-600' : 'text-green-600'}`}>
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl ${stat.color === 'blue'
                        ? 'bg-blue-100'
                        : stat.color === 'green'
                          ? 'bg-green-100'
                          : stat.color === 'orange'
                            ? 'bg-orange-100'
                            : stat.color === 'purple'
                              ? 'bg-purple-100'
                              : 'bg-red-100'
                        }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${stat.color === 'blue'
                          ? 'text-blue-600'
                          : stat.color === 'green'
                            ? 'text-green-600'
                            : stat.color === 'orange'
                              ? 'text-orange-600'
                              : stat.color === 'purple'
                                ? 'text-purple-600'
                                : 'text-red-600'
                          }`}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name, category, or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Amenity">Amenity</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="working">Working</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </Card>

        {/* Assets Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Monthly Cost</TableHead>
                  <TableHead>AMC/Year</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset: any) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.id}</TableCell>
                    <TableCell className="font-semibold">{asset.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{asset.category}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{asset.location}</TableCell>
                    <TableCell className="font-semibold">
                      \u20B9{((asset.value || 0) / 100000).toFixed(2)}L
                    </TableCell>
                    <TableCell className="font-medium text-orange-600">
                      \u20B9{(asset.monthlyExpense ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-purple-600">
                      \u20B9{((asset.amcCost || 0) / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          asset.condition === 'working'
                            ? 'default'
                            : asset.condition === 'damaged'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className={
                          asset.condition === 'working'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : asset.condition === 'damaged'
                              ? 'bg-red-100 text-red-700 hover:bg-red-100'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                        }
                      >
                        {asset.condition === 'working' && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {asset.condition === 'damaged' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {asset.condition === 'maintenance' && <Wrench className="h-3 w-3 mr-1" />}
                        {asset.condition}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{asset.nextMaintenance}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" title="View Details" onClick={() => handleViewAsset(asset)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditAsset(asset)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDeleteAsset(asset.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* View Asset Dialog */}
        <Dialog open={viewingAsset !== null} onOpenChange={() => setViewingAsset(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Asset Details</DialogTitle>
              <DialogDescription>View asset information</DialogDescription>
            </DialogHeader>
            {viewingAsset && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Asset ID</Label>
                    <p className="font-medium">{viewingAsset.id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Name</Label>
                    <p className="font-medium">{viewingAsset.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Category</Label>
                    <p className="font-medium">{viewingAsset.category}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Location</Label>
                    <p className="font-medium">{viewingAsset.location}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Value</Label>
                    <p className="font-medium">₹{(viewingAsset.value / 100000).toFixed(2)}L</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Condition</Label>
                    <Badge className={viewingAsset.condition === 'working' ? 'bg-green-100 text-green-700' : viewingAsset.condition === 'damaged' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}>
                      {viewingAsset.condition}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Last Maintenance</Label>
                    <p className="font-medium">{viewingAsset.lastMaintenance}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm">Next Maintenance</Label>
                    <p className="font-medium">{viewingAsset.nextMaintenance}</p>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setViewingAsset(null)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Asset Dialog */}
        <Dialog open={editingAsset !== null} onOpenChange={() => setEditingAsset(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Asset</DialogTitle>
              <DialogDescription>Update asset information</DialogDescription>
            </DialogHeader>
            {editingAsset && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Asset Name *</Label>
                    <Input
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={editFormData.category}
                      onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Amenity">Amenity</SelectItem>
                        <SelectItem value="Fitness">Fitness</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Value (₹)</Label>
                    <Input
                      type="number"
                      value={editFormData.value}
                      onChange={(e) => setEditFormData({ ...editFormData, value: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select
                    value={editFormData.condition}
                    onValueChange={(value) => setEditFormData({ ...editFormData, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="working">Working</SelectItem>
                      <SelectItem value="maintenance">Under Maintenance</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setEditingAsset(null)}>Cancel</Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSaveEdit}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
