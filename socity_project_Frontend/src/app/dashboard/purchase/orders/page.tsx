'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  ShoppingCart,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Printer,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Package,
  Calendar,
  Building,
  FileText,
  Send,
  Loader2,
  Trash2,
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
import { PurchaseOrderService } from '@/services/purchaseOrderService'
import { VendorService } from '@/services/vendor.service'
import { toast } from 'react-hot-toast'

export default function PurchaseOrdersPage() {
  const [data, setData] = useState<any[]>([])
  const [statsData, setStatsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('current')
  
  const [selectedPO, setSelectedPO] = useState<any | null>(null)
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)
  const [vendors, setVendors] = useState<any[]>([])

  // New Order Form State
  const [formData, setFormData] = useState({
    vendorId: '',
    description: '',
    paymentTerms: 'Net 30',
    items: [{ name: '', qty: 1, unitPrice: 0, total: 0 }],
    subtotal: 0,
    taxPercentage: 18,
    taxAmount: 0,
    totalAmount: 0,
  })

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true)
      const [list, stats] = await Promise.all([
        PurchaseOrderService.getAll(statusFilter, periodFilter, searchQuery),
        PurchaseOrderService.getStats()
      ])
      setData(list)
      setStatsData(stats)
    } catch (error) {
       console.error(error)
       toast.error('Failed to load purchase orders')
    } finally {
      setLoading(false)
    }
  }

  // Fetch Vendors for Dropdown
  const fetchVendors = async () => {
    try {
      const vendorList = await VendorService.getAll();
      setVendors(Array.isArray(vendorList) ? vendorList : (vendorList?.vendors || []));
    } catch (error) {
      console.error('Failed to fetch vendors', error);
      setVendors([]);
    }
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter, periodFilter, searchQuery])

  useEffect(() => {
    if (isNewOrderOpen) fetchVendors();
  }, [isNewOrderOpen])

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recalculate totals when items change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => {
      const q = isNaN(Number(item.qty)) ? 0 : Number(item.qty);
      const p = isNaN(Number(item.unitPrice)) ? 0 : Number(item.unitPrice);
      return sum + (q * p);
    }, 0);
    const taxPct = isNaN(Number(formData.taxPercentage)) ? 0 : Number(formData.taxPercentage);
    const taxAmount = (subtotal * taxPct) / 100;
    const totalAmount = subtotal + taxAmount;
    
    setFormData(prev => ({
       ...prev,
       subtotal,
       taxAmount,
       totalAmount
    }));
  }, [formData.items, formData.taxPercentage])

  const handleCreate = async () => {
    if (!formData.vendorId || formData.vendorId === 'no-vendor') {
        toast.error('Please select a vendor');
        return;
    }
    const validItems = formData.items.filter(i => i.name && i.name.trim() !== '');
    if (validItems.length === 0) {
        toast.error('Please add at least one item with a name');
        return;
    }

    try {
      setIsSubmitting(true);
      const itemsWithTotals = formData.items.map(item => {
        const qty = isNaN(Number(item.qty)) || Number(item.qty) <= 0 ? 1 : Number(item.qty);
        const unitPrice = isNaN(Number(item.unitPrice)) ? 0 : Number(item.unitPrice);
        return {
          name: item.name || 'Item',
          qty,
          unitPrice,
          total: qty * unitPrice
        };
      });

      await PurchaseOrderService.create({
        ...formData,
        vendorId: parseInt(formData.vendorId),
        items: itemsWithTotals
      })
      toast.success('Purchase Order created successfully')
      setIsNewOrderOpen(false)
      fetchData()
      // Reset Form
      setFormData({
        vendorId: '',
        description: '',
        paymentTerms: 'Net 30',
        items: [{ name: '', qty: 1, unitPrice: 0, total: 0 }],
        subtotal: 0,
        taxPercentage: 18,
        taxAmount: 0,
        totalAmount: 0,
      })
    } catch (error: any) {
       console.error('Create Order Error:', error);
       const errorMessage = error.response?.data?.error || error.message || 'Failed to create order';
       toast.error(errorMessage);
    } finally {
       setIsSubmitting(false);
    }
  }

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await PurchaseOrderService.updateStatus(id, status)
      toast.success(`Order status updated to ${status}`)
      if (selectedPO?.id === id) {
          setSelectedPO({ ...selectedPO, status }); // Optimistic update for dialog
      }
      fetchData()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const addItemSlot = () => {
    setFormData({ ...formData, items: [...formData.items, { name: '', qty: 1, unitPrice: 0, total: 0 }] })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items]
    let parsedVal = value;
    if (field === 'qty' || field === 'unitPrice') {
      const num = parseFloat(value);
      parsedVal = isNaN(num) ? 0 : num;
    }
    newItems[index] = { ...newItems[index], [field]: parsedVal }
    setFormData({ ...formData, items: newItems })
  }
  
  const removeItem = (index: number) => {
      if(formData.items.length === 1) return;
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
  }

  const formatCurrency = (amount: number) => {
    const validAmount = isNaN(amount) || amount == null ? 0 : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(validAmount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge variant="secondary"><Edit className="h-3 w-3 mr-1" /> Draft</Badge>
      case 'SENT':
        return <Badge className="bg-blue-100 text-blue-800"><Send className="h-3 w-3 mr-1" /> Sent to Vendor</Badge>
      case 'CONFIRMED':
        return <Badge className="bg-purple-100 text-purple-800"><CheckCircle className="h-3 w-3 mr-1" /> Confirmed</Badge>
      case 'PARTIALLY_RECEIVED':
        return <Badge className="bg-yellow-100 text-yellow-800"><Package className="h-3 w-3 mr-1" /> Partially Received</Badge>
      case 'DELIVERED':
        return <Badge className="bg-green-100 text-green-800"><Truck className="h-3 w-3 mr-1" /> Delivered</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = [
    { label: 'Total Orders', value: statsData?.total || 0, icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Pending Delivery', value: statsData?.pendingDelivery || 0, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Delivered', value: statsData?.delivered || 0, icon: Truck, color: 'bg-green-500' },
    { label: 'Draft', value: statsData?.draft || 0, icon: FileText, color: 'bg-gray-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-purple-600" />
            Purchase Orders
          </h1>
          <p className="text-gray-600 mt-1">Manage vendor orders and deliveries</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                  <DialogTitle>Create Purchase Order</DialogTitle>
               </DialogHeader>
               <div className="grid grid-cols-2 gap-4 py-4">
                   <div className="space-y-2">
                      <Label>Vendor</Label>
                      <Select value={formData.vendorId} onValueChange={v => setFormData({...formData, vendorId: v})}>
                         <SelectTrigger className="w-full"><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                         <SelectContent className="max-h-60 overflow-y-auto">
                            {vendors && vendors.length > 0 ? (
                                vendors.map(vendor => (
                                    <SelectItem key={vendor.id} value={vendor.id.toString()}>{vendor.name || vendor.company || `Vendor #${vendor.id}`}</SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-vendor" disabled>No vendors found. Please add a vendor first.</SelectItem>
                            )}
                         </SelectContent>
                      </Select>
                   </div>
                  <div className="space-y-2">
                     <Label>Payment Terms</Label>
                     <Input value={formData.paymentTerms} onChange={e => setFormData({...formData, paymentTerms: e.target.value})} />
                  </div>
                  <div className="col-span-2 space-y-2">
                     <Label>Description</Label>
                     <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Order description..." />
                  </div>
               </div>

               <div className="border p-4 rounded-md bg-gray-50 mb-4">
                  <div className="flex justify-between items-center mb-2">
                     <h4 className="font-semibold">Items</h4>
                     <Button variant="outline" size="sm" onClick={addItemSlot}>+ Add Item</Button>
                  </div>
                  <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-500">
                          <div className="col-span-5">Item Name</div>
                          <div className="col-span-2 text-center">Qty</div>
                          <div className="col-span-2 text-right">Unit Price</div>
                          <div className="col-span-2 text-right">Total</div>
                          <div className="col-span-1"></div>
                      </div>
                      {formData.items.map((item, idx) => (
                          <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-5">
                                  <Input value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} placeholder="Item" />
                              </div>
                              <div className="col-span-2">
                                  <Input type="number" value={item.qty} onChange={e => updateItem(idx, 'qty', parseFloat(e.target.value))} className="text-center" />
                              </div>
                              <div className="col-span-2">
                                  <Input type="number" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', parseFloat(e.target.value))} className="text-right" />
                              </div>
                              <div className="col-span-2 text-right font-medium">
                                  {formatCurrency(item.qty * item.unitPrice)}
                              </div>
                              <div className="col-span-1 text-center">
                                  <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                          </div>
                      ))}
                  </div>
               </div>
               
               <div className="flex justify-end">
                   <div className="w-1/3 space-y-2">
                       <div className="flex justify-between text-sm">
                           <span>Subtotal:</span>
                           <span>{formatCurrency(formData.subtotal)}</span>
                       </div>
                       <div className="flex justify-between text-sm items-center">
                           <span>Tax ({formData.taxPercentage}%)</span>
                           <Input 
                             type="number" 
                             className="w-16 h-8 text-right" 
                             value={formData.taxPercentage} 
                             onChange={e => setFormData({...formData, taxPercentage: parseFloat(e.target.value)})} 
                           />
                       </div>
                       <div className="flex justify-between font-bold text-lg pt-2 border-t">
                           <span>Total:</span>
                           <span>{formatCurrency(formData.totalAmount)}</span>
                       </div>
                   </div>
               </div>

               <DialogFooter className="mt-4">
                   <Button variant="outline" onClick={() => setIsNewOrderOpen(false)}>Cancel</Button>
                   <Button onClick={handleCreate}>Create Order</Button>
               </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

      {/* Total Value Card */}
      <Card className="p-4 mb-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100">Total Order Value (This Month)</p>
            <p className="text-2xl md:text-3xl font-bold mt-1">{formatCurrency(statsData?.totalValueMonth || 0)}</p>
          </div>
          <ShoppingCart className="h-12 w-12 text-purple-200 opacity-50" />
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
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
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SENT">Sent</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">This Month</SelectItem>
              <SelectItem value="previous">Last Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Purchase Orders Table */}
      <Card className="overflow-hidden">
        {loading ? (
             <div className="p-8 text-center flex justify-center text-gray-500">
               <Loader2 className="animate-spin mr-2" /> Loading Orders...
             </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>PO Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-6">No orders found</TableCell></TableRow> : data.map((po) => (
              <TableRow key={po.id} className="hover:bg-gray-50">
                <TableCell>
                  <p className="font-mono font-medium">{po.poNumber}</p>
                  {po.prReference && (
                    <p className="text-xs text-gray-500">Ref: {po.prReference}</p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {new Date(po.createdAt).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3 text-gray-400" />
                    <span className="font-medium">{po.vendor?.name || 'Unknown'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-xs truncate">{po.description}</p>
                  <p className="text-xs text-gray-500">{Array.isArray(po.items) ? po.items.length : 0} items</p>
                </TableCell>
                <TableCell>{getStatusBadge(po.status)}</TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(po.totalAmount)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Dialog open={selectedPO?.id === po.id} onOpenChange={(open) => !open && setSelectedPO(null)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPO(po)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center justify-between">
                            <span>Purchase Order - {selectedPO?.poNumber || 'Details'}</span>
                            {selectedPO && getStatusBadge(selectedPO.status)}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedPO ? (
                        <div className="space-y-4">
                          {/* Vendor Info */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-2">Vendor Details</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Name:</span>
                                <p className="font-medium">{selectedPO.vendor?.name}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Contact:</span>
                                <p>{selectedPO.vendor?.contact}</p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-600">Email:</span>
                                <p>{selectedPO.vendor?.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Order Meta */}
                          <div className="grid grid-cols-2 gap-4 text-sm border-t border-b py-3">
                            <div>
                              <span className="text-gray-600">Order Date:</span>
                              <p className="font-medium">{format(new Date(selectedPO.date || Date.now()), 'dd MMM yyyy')}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Payment Terms:</span>
                              <p className="font-medium">{selectedPO.paymentTerms || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Items Table */}
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">Order Items</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Item</TableHead>
                                  <TableHead className="text-center">Qty</TableHead>
                                  <TableHead className="text-right">Unit Price</TableHead>
                                  <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Array.isArray(selectedPO.items) && selectedPO.items.map((item: any, idx: number) => (
                                  <TableRow key={idx}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-center">{item.qty}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.total || (item.qty * item.unitPrice))}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Totals */}
                          <div className="flex justify-end pt-2">
                            <div className="w-1/2 space-y-1 text-sm">
                              <div className="flex justify-between text-gray-600">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(selectedPO.subtotal || 0)}</span>
                              </div>
                              <div className="flex justify-between text-gray-600">
                                <span>Tax:</span>
                                <span>{formatCurrency(selectedPO.taxAmount || 0)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-base border-t pt-1 text-gray-900">
                                <span>Total Amount:</span>
                                <span>{formatCurrency(selectedPO.totalAmount || 0)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Actions */}
                          <div className="flex justify-end gap-2 pt-4 border-t">
                            {selectedPO.status === 'DRAFT' && (
                              <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={() => handleStatusUpdate(selectedPO.id, 'SENT')}>
                                <Send className="h-4 w-4" /> Send to Vendor
                              </Button>
                            )}
                            {selectedPO.status === 'SENT' && (
                              <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={() => handleStatusUpdate(selectedPO.id, 'CONFIRMED')}>
                                <CheckCircle className="h-4 w-4" /> Confirm Order
                              </Button>
                            )}
                            {(selectedPO.status === 'SENT' || selectedPO.status === 'CONFIRMED') && (
                              <Button className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(selectedPO.id, 'DELIVERED')}>
                                <Package className="h-4 w-4" /> Goods Received
                              </Button>
                            )}
                          </div>
                        </div>
                        ) : (
                          <div className="py-8 text-center text-slate-500">Loading order details...</div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
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
