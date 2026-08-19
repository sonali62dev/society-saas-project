'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  PackageCheck,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Calendar,
  Building,
  FileText,
  Truck,
  Package,
  ClipboardCheck,
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
import { ReceiptService } from '@/services/receiptService'
import { VendorService } from '@/services/vendor.service'
import { PurchaseOrderService } from '@/services/purchaseOrderService'
import { toast } from 'react-hot-toast'

export default function GoodsReceiptsPage() {
  const [data, setData] = useState<any[]>([])
  const [statsData, setStatsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  
  const [selectedGR, setSelectedGR] = useState<any | null>(null)
  const [isNewOpen, setIsNewOpen] = useState(false)
  const [vendors, setVendors] = useState<any[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])

  // Form State
  const [formData, setFormData] = useState({
     vendorId: '',
     poId: '',
     type: 'GOODS',
     description: '',
     invoiceNumber: '',
     receivedBy: '',
     items: [{ name: '', ordered: 0, received: 0, rejected: 0, status: 'complete' }]
  })

  const fetchData = async () => {
    try {
      setLoading(true)
      const [list, stats] = await Promise.all([
        ReceiptService.getAll(typeFilter, statusFilter, searchQuery),
        ReceiptService.getStats()
      ])
      setData(list)
      setStatsData(stats)
    } catch (error) {
       console.error(error)
       toast.error('Failed to load receipts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
     fetchData()
  }, [typeFilter, statusFilter, searchQuery])

  useEffect(() => {
     if(isNewOpen) {
         VendorService.getAll().then(res => setVendors(Array.isArray(res) ? res : (res?.vendors || []))).catch(() => setVendors([]))
         PurchaseOrderService.getAll('SENT', 'current').then(res => setPurchaseOrders(Array.isArray(res) ? res : [])).catch(() => setPurchaseOrders([]))
     }
  }, [isNewOpen])

  const handleCreate = async () => {
     if(!formData.vendorId || formData.vendorId === 'no-vendor') {
         toast.error('Vendor is required');
         return;
     }

     try {
         await ReceiptService.create({
           ...formData,
           vendorId: parseInt(formData.vendorId),
           poId: formData.poId ? parseInt(formData.poId) : null
         });
         toast.success('Receipt created successfully');
         setIsNewOpen(false);
         fetchData();
         setFormData({
            vendorId: '',
            poId: '',
            type: 'GOODS',
            description: '',
            invoiceNumber: '',
            receivedBy: '',
            items: [{ name: '', ordered: 0, received: 0, rejected: 0, status: 'complete' }]
         });
     } catch(error: any) {
         toast.error(error.response?.data?.error || 'Failed to create receipt');
     }
  }

  const handleQC = async (id: number, status: string) => {
      try {
          await ReceiptService.updateQC(id, status);
          toast.success('QC status updated');
          if(selectedGR?.id === id) {
              setSelectedGR({...selectedGR, qualityCheckStatus: status});
          }
          fetchData();
      } catch(error) {
          toast.error('Failed to update QC');
      }
  }
  
  const addItem = () => {
      setFormData({...formData, items: [...formData.items, { name: '', ordered: 0, received: 0, rejected: 0, status: 'complete' }]});
  }
  
  const removeItem = (index: number) => {
      if (formData.items.length === 1) return;
      const items = formData.items.filter((_, i) => i !== index);
      setFormData({...formData, items});
  }

  const updateItem = (index: number, field: string, value: any) => {
      const items = [...formData.items];
      let val = value;
      if (field === 'ordered' || field === 'received' || field === 'rejected') {
        const parsed = parseInt(value);
        val = isNaN(parsed) ? 0 : parsed;
      }
      items[index] = { ...items[index], [field]: val };
      setFormData({...formData, items});
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>
      case 'PARTIAL':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Partial</Badge>
      case 'PENDING':
        return <Badge variant="secondary"><Package className="h-3 w-3 mr-1" /> Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = [
    { label: 'Total Receipts', value: statsData?.total || 0, icon: PackageCheck, color: 'bg-blue-500' },
    { label: 'Completed', value: statsData?.completed || 0, icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Partial', value: statsData?.partial || 0, icon: Clock, color: 'bg-yellow-500' },
    { label: 'Pending QC', value: statsData?.pendingQC || 0, icon: ClipboardCheck, color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <PackageCheck className="h-8 w-8 text-teal-600" />
            Goods & Service Receipts
          </h1>
          <p className="text-gray-600 mt-1">Record and manage deliveries from vendors</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Receipt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-6">
                <DialogHeader><DialogTitle>Create New Receipt</DialogTitle></DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="GOODS">Goods Receipt</SelectItem>
                                <SelectItem value="SERVICE">Service Receipt</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Vendor</Label>
                        <Select value={formData.vendorId} onValueChange={(v) => setFormData({...formData, vendorId: v})}>
                            <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                            <SelectContent>
                                {vendors && vendors.length > 0 ? (
                                    vendors.map(v => <SelectItem key={v.id} value={v.id.toString()}>{v.name || v.company || `Vendor #${v.id}`}</SelectItem>)
                                ) : (
                                    <SelectItem value="no-vendor" disabled>No vendors found</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Link Purchase Order (Optional)</Label>
                        <Select value={formData.poId} onValueChange={(v) => setFormData({...formData, poId: v === 'none' ? '' : v})}>
                            <SelectTrigger><SelectValue placeholder="Select PO" /></SelectTrigger>
                             <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {purchaseOrders.map(po => <SelectItem key={po.id} value={po.id.toString()}>{po.poNumber} ({po.status})</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Received By</Label>
                        <Input value={formData.receivedBy} onChange={e => setFormData({...formData, receivedBy: e.target.value})} placeholder="Person Name" />
                    </div>
                     <div className="space-y-2">
                        <Label>Invoice Number (Optional)</Label>
                        <Input value={formData.invoiceNumber} onChange={e => setFormData({...formData, invoiceNumber: e.target.value})} placeholder="INV-12345" />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                        <Label>Description</Label>
                        <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Receipt description..." />
                    </div>
                </div>
                
                 <div className="border p-4 rounded-md bg-gray-50 mb-4 overflow-x-auto">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800">Items</h4>
                        <Button variant="outline" size="sm" onClick={addItem}>+ Add Item</Button>
                    </div>
                    
                    <div className="min-w-[600px]">
                      <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 mb-2 px-1">
                          <div className="col-span-3">Item Name</div>
                          <div className="col-span-2 text-center">Ordered</div>
                          <div className="col-span-2 text-center">Received</div>
                          <div className="col-span-2 text-center">Rejected</div>
                          <div className="col-span-2">Status</div>
                          <div className="col-span-1"></div>
                      </div>
                      {formData.items.map((item, idx) => (
                          <div key={idx} className="grid grid-cols-12 gap-2 items-center mb-2">
                              <div className="col-span-3"><Input placeholder="Item Name" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} /></div>
                              <div className="col-span-2"><Input type="number" placeholder="0" value={item.ordered} onChange={e => updateItem(idx, 'ordered', e.target.value)} className="text-center" /></div>
                              <div className="col-span-2"><Input type="number" placeholder="0" value={item.received} onChange={e => updateItem(idx, 'received', e.target.value)} className="text-center" /></div>
                              <div className="col-span-2"><Input type="number" placeholder="0" value={item.rejected} onChange={e => updateItem(idx, 'rejected', e.target.value)} className="text-center" /></div>
                              <div className="col-span-2">
                                 <Select value={item.status} onValueChange={v => updateItem(idx, 'status', v)}>
                                     <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                     <SelectContent>
                                         <SelectItem value="complete">Complete</SelectItem>
                                         <SelectItem value="partial">Partial</SelectItem>
                                         <SelectItem value="pending">Pending</SelectItem>
                                     </SelectContent>
                                 </Select>
                              </div>
                              <div className="col-span-1 text-center">
                                 <Button variant="ghost" size="sm" onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 p-1">
                                   ✕
                                 </Button>
                              </div>
                          </div>
                      ))}
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setIsNewOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate}>Create Receipt</Button>
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

      {/* Filters- Same as before but wired to state */}
       <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search receipts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="GOODS">Goods Receipt</SelectItem>
              <SelectItem value="SERVICE">Service Receipt</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PARTIAL">Partial</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Receipts Table */}
      <Card className="overflow-hidden">
        {loading ? (
             <div className="p-8 text-center flex justify-center text-gray-500">
               <Loader2 className="animate-spin mr-2" /> Loading Receipts...
             </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Receipt No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>QC</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? <TableRow><TableCell colSpan={8} className="text-center py-6">No receipts found</TableCell></TableRow> : data.map((gr) => (
              <TableRow key={gr.id} className="hover:bg-gray-50">
                <TableCell>
                  <p className="font-mono font-medium">{gr.grNumber}</p>
                  {gr.purchaseOrder?.poNumber && (
                    <p className="text-xs text-gray-500">PO: {gr.purchaseOrder.poNumber}</p>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {new Date(gr.date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Building className="h-3 w-3 text-gray-400" />
                    <span>{gr.vendor?.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-xs truncate">{gr.description}</p>
                  <p className="text-xs text-gray-500">{Array.isArray(gr.items) ? gr.items.length : 0} items</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {gr.type === 'GOODS' ? (
                      <><Package className="h-3 w-3 mr-1" /> Goods</>
                    ) : (
                      <><FileText className="h-3 w-3 mr-1" /> Service</>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>{getStatusBadge(gr.status)}</TableCell>
                <TableCell>
                  {gr.qualityCheckStatus === 'PASSED' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : gr.qualityCheckStatus === 'FAILED' ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog open={selectedGR?.id === gr.id} onOpenChange={(o) => !o && setSelectedGR(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedGR(gr)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    {selectedGR && (
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                          <span>{selectedGR.type === 'GOODS' ? 'Goods' : 'Service'} Receipt - {selectedGR.grNumber}</span>
                          {getStatusBadge(selectedGR.status)}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {/* Receipt Info */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Date:</span>
                            <p className="font-medium">{new Date(selectedGR.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Vendor:</span>
                            <p className="font-medium">{selectedGR.vendor?.name}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Received By:</span>
                            <p className="font-medium">{selectedGR.receivedBy}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <span className="text-sm text-gray-600">Description:</span>
                          <p className="text-sm">{selectedGR.description}</p>
                        </div>

                        {/* Items */}
                        <div>
                          <h4 className="font-semibold mb-2">Items Received</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-center">Ordered</TableHead>
                                <TableHead className="text-center">Received</TableHead>
                                <TableHead className="text-center">Rejected</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Array.isArray(selectedGR.items) && selectedGR.items.map((item: any, idx: number) => (
                                <TableRow key={idx}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell className="text-center">{item.ordered}</TableCell>
                                  <TableCell className="text-center font-medium">{item.received}</TableCell>
                                  <TableCell className="text-center">
                                    {item.rejected > 0 ? (
                                      <span className="text-red-600">{item.rejected}</span>
                                    ) : '-'}
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {item.status}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        
                        {/* QC Action */}
                        {selectedGR.qualityCheckStatus === 'PENDING' && (
                            <div className="flex gap-2 justify-end">
                                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleQC(selectedGR.id, 'FAILED')}>Mark QC Failed</Button>
                                <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleQC(selectedGR.id, 'PASSED')}>Mark QC Passed</Button>
                            </div>
                        )}
                        {selectedGR.qualityCheckStatus !== 'PENDING' && (
                             <div className="text-right text-sm font-medium">QC Status: {selectedGR.qualityCheckStatus}</div>
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
