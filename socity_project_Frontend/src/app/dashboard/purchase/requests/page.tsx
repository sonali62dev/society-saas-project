'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileQuestion,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Package,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PurchaseRequestService } from '@/services/purchaseRequestService'
import { toast } from 'react-hot-toast'

export default function PurchaseRequestsPage() {
  const [data, setData] = useState<any[]>([])
  const [statsData, setStatsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  
  const [selectedPR, setSelectedPR] = useState<any | null>(null)
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)

  // New Request Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: 'Admin Office',
    priority: 'MEDIUM',
    estimatedAmount: '',
    items: [{ name: '', qty: 1, estPrice: 0 }],
  })

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true)
      const [list, stats] = await Promise.all([
        PurchaseRequestService.getAll(statusFilter, priorityFilter, searchQuery),
        PurchaseRequestService.getStats()
      ])
      setData(list)
      setStatsData(stats)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load purchase requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter, priorityFilter, searchQuery]) // Add debouncing for search in real app

  const handleCreate = async () => {
    try {
      await PurchaseRequestService.create({
        ...formData,
        estimatedAmount: parseFloat(formData.estimatedAmount) || 0,
      })
      toast.success('Purchase Request created successfully')
      setIsNewRequestOpen(false)
      fetchData()
      setFormData({
        title: '',
        description: '',
        department: 'Admin Office',
        priority: 'MEDIUM',
        estimatedAmount: '',
        items: [{ name: '', qty: 1, estPrice: 0 }],
      })
    } catch (error) {
       toast.error('Failed to create request')
    }
  }

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await PurchaseRequestService.updateStatus(id, status)
      toast.success(`Request marked as ${status}`)
      setIsViewOpen(false)
      fetchData()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const addItemSlot = () => {
    setFormData({ ...formData, items: [...formData.items, { name: '', qty: 1, estPrice: 0 }] })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>
      case 'PENDING_CM':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" /> Pending CM</Badge>
      case 'PENDING_FINANCE':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending Finance</Badge>
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
      case 'CONVERTED_PO':
        return <Badge className="bg-purple-100 text-purple-800"><ArrowRight className="h-3 w-3 mr-1" /> Converted to PO</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const stats = [
    { label: 'Total Requests', value: statsData?.total || 0, icon: FileQuestion, color: 'bg-blue-500' },
    { label: 'Pending CM', value: statsData?.pendingCM || 0, icon: Clock, color: 'bg-blue-400' },
    { label: 'Pending Finance', value: statsData?.pendingFinance || 0, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Approved', value: statsData?.approved || 0, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Converted to PO', value: statsData?.convertedPO || 0, icon: ArrowRight, color: 'bg-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileQuestion className="h-8 w-8 text-blue-600" />
            Purchase Requests
          </h1>
          <p className="text-gray-600 mt-1">Create and manage purchase requisitions</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Purchase Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label>Title</Label>
                       <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Garden Tools" />
                    </div>
                    <div className="space-y-2">
                       <Label>Department</Label>
                       <Select value={formData.department} onValueChange={v => setFormData({...formData, department: v})}>
                         <SelectTrigger>
                            <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="Admin Office">Admin Office</SelectItem>
                            <SelectItem value="Security Dept">Security Dept</SelectItem>
                            <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                            <SelectItem value="Clubhouse">Clubhouse</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe requirement..." />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label>Priority</Label>
                       <Select value={formData.priority} onValueChange={v => setFormData({...formData, priority: v})}>
                         <SelectTrigger><SelectValue /></SelectTrigger>
                         <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label>Estimated Total Amount</Label>
                       <Input type="number" value={formData.estimatedAmount} onChange={e => setFormData({...formData, estimatedAmount: e.target.value})} />
                    </div>
                 </div>

                 <div className="border p-3 rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                       <Label>Items List</Label>
                       <Button variant="outline" size="sm" onClick={addItemSlot}>+ Add Item</Button>
                    </div>
                    {formData.items.map((item, idx) => (
                       <div key={idx} className="grid grid-cols-12 gap-2 mb-2">
                          <div className="col-span-6">
                            <Input placeholder="Item Name" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} />
                          </div>
                          <div className="col-span-2">
                            <Input type="number" placeholder="Qty" value={item.qty} onChange={e => updateItem(idx, 'qty', parseInt(e.target.value))} />
                          </div>
                          <div className="col-span-4">
                            <Input type="number" placeholder="Est. Price" value={item.estPrice} onChange={e => updateItem(idx, 'estPrice', parseFloat(e.target.value))} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <DialogFooter>
                 <Button variant="outline" onClick={() => setIsNewRequestOpen(false)}>Cancel</Button>
                 <Button onClick={handleCreate}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING_CM">Pending CM</SelectItem>
              <SelectItem value="PENDING_FINANCE">Pending Finance</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
           <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Purchase Requests Table */}
      <Card className="overflow-hidden">
        {loading ? (
             <div className="p-8 text-center flex justify-center text-gray-500">
               <Loader2 className="animate-spin mr-2" /> Loading Requests...
             </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>PR Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Estimate (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? <TableRow><TableCell colSpan={8} className="text-center py-6">No requests found</TableCell></TableRow> : data.map((pr) => (
              <TableRow key={pr.id} className="hover:bg-gray-50">
                <TableCell className="font-mono font-medium">{pr.prNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-3 w-3" />
                     {new Date(pr.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-xs truncate font-medium">{pr.title}</p>
                   <p className="text-xs text-gray-500 truncate max-w-[200px]">{pr.description}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <User className="h-3 w-3" />
                    {pr.requestedBy?.name || 'Unknown'}
                  </div>
                  <span className="text-[10px] text-gray-400">{pr.department}</span>
                </TableCell>
                <TableCell><Badge variant={pr.priority === 'HIGH' ? 'destructive' : 'secondary'}>{pr.priority}</Badge></TableCell>
                <TableCell>{getStatusBadge(pr.status)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(pr.estimatedAmount)}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog open={isViewOpen && selectedPR?.id === pr.id} onOpenChange={(open) => {
                     setIsViewOpen(open);
                     if(open) setSelectedPR(pr);
                     else setSelectedPR(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                         onClick={() => setSelectedPR(pr)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    {selectedPR && (
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Purchase Request - {selectedPR.prNumber}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Date:</span>
                            <p>{new Date(selectedPR.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <p>{getStatusBadge(selectedPR.status)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Requested By:</span>
                            <p>{selectedPR.requestedBy?.name}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Department:</span>
                            <p>{selectedPR.department}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Description:</p>
                          <p className="text-sm">{selectedPR.description}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Items:</p>
                          {selectedPR.items && Array.isArray(selectedPR.items) ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-center">Qty</TableHead>
                                <TableHead className="text-right">Est. Price</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedPR.items.map((item: any, idx: number) => (
                                <TableRow key={idx}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell className="text-center">{item.qty}</TableCell>
                                  <TableCell className="text-right">{formatCurrency(item.estPrice * item.qty)}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow className="font-bold">
                                <TableCell colSpan={2}>Total</TableCell>
                                <TableCell className="text-right">{formatCurrency(selectedPR.estimatedAmount)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          ) : <p className="text-sm text-gray-400">No items listed</p>}
                        </div>
                        
                        {/* Action Buttons */}
                        {selectedPR.status === 'PENDING_CM' && (
                          <div className="flex gap-2 pt-4">
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleStatusUpdate(selectedPR.id, 'PENDING_FINANCE')}>Approve (CM)</Button>
                            <Button variant="destructive" className="flex-1" onClick={() => handleStatusUpdate(selectedPR.id, 'REJECTED')}>Reject</Button>
                          </div>
                        )}
                        {selectedPR.status === 'PENDING_FINANCE' && (
                          <div className="flex gap-2 pt-4">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(selectedPR.id, 'APPROVED')}>Approve (Finance)</Button>
                            <Button variant="destructive" className="flex-1" onClick={() => handleStatusUpdate(selectedPR.id, 'REJECTED')}>Reject</Button>
                          </div>
                        )}
                        {selectedPR.status === 'APPROVED' && (
                          <Button className="w-full" onClick={() => handleStatusUpdate(selectedPR.id, 'CONVERTED_PO')}>Convert to Purchase Order</Button>
                        )}
                      </div>
                    </DialogContent>
                    )}
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </Card>
    </div>
  )
}
