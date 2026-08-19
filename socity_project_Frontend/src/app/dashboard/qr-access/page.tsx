'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  QrCode,
  Download,
  Share2,
  RefreshCw,
  Shield,
  Phone,
  Video,
  Package,
  Users,
  Car,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  Smartphone,
  Bell,
  Home,
  Settings,
  History,
  Lock,
  Unlock,
  Plus,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
} from "@/components/ui/select"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { RoleGuard } from '@/components/auth/role-guard'

export default function QRAccessPage() {
  const queryClient = useQueryClient()

  // Queries
  const { data: barcodes = [], isLoading: isLoadingBarcodes } = useQuery<any[]>({
    queryKey: ['emergency-barcodes'],
    queryFn: async () => {
      const response = await api.get('/emergency/barcodes')
      return response.data
    }
  })

  const { data: logs = [], isLoading: isLoadingLogs } = useQuery<any[]>({
    queryKey: ['emergency-logs'],
    queryFn: async () => {
      const response = await api.get('/emergency/logs')
      return response.data
    }
  })

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: { label: string; type: string; phone?: string }) => api.post('/emergency/barcodes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-barcodes'] })
      toast.success('New emergency barcode generated!')
      setIsCreateOpen(false)
      setNewBarcodeData({ label: '', type: 'property', phone: '' })
    },
    onError: (error: any) => toast.error(error.response?.data?.error || 'Failed to create barcode')
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/emergency/barcodes/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-barcodes'] })
      toast.success('Status updated successfully')
    }
  })

  const regenerateMutation = useMutation({
    mutationFn: (id: string) => api.post(`/emergency/barcodes/${id}/regenerate`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-barcodes'] })
      toast.success('QR Code regenerated successfully!')
      setIsRegenerateOpen(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/emergency/barcodes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emergency-barcodes'] })
      toast.success('Barcode deleted successfully')
    }
  })

  const [activeTab, setActiveTab] = useState('active')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isRegenerateOpen, setIsRegenerateOpen] = useState<string | null>(null)
  const [newBarcodeData, setNewBarcodeData] = useState({
    label: '',
    type: 'property' as 'property' | 'vehicle' | 'other',
    phone: ''
  })

  const handleCreateBarcode = () => {
    if (!newBarcodeData.label) {
      toast.error('Please enter a label for the barcode.')
      return
    }
    createMutation.mutate(newBarcodeData)
  }

  const handleDownloadQR = async (label: string, qrUrl: string) => {
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `emergency-qr-${label.toLowerCase().replace(/\s+/g, '-')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success(`${label} QR code downloaded!`)
    } catch (error) {
      toast.error('Failed to download QR code')
    }
  }

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/emergency/${id}`
    navigator.clipboard.writeText(link)
    toast.success('Emergency link copied to clipboard!')
  }

  const isLoading = isLoadingBarcodes || isLoadingLogs

  return (
    <RoleGuard allowedRoles={['admin', 'resident', 'individual']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Emergency QR System</h1>
            <p className="text-gray-500 mt-1 font-medium">
              Generate unique barcodes for your assets to receive emergency alerts securely.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-[#1e3a5f] hover:bg-[#2d4a6f] rounded-2xl h-12 px-6 font-bold shadow-lg shadow-blue-100 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Generate New Barcode
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Barcodes List */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="active">
              <div className="flex items-center justify-between mb-2">
                <TabsList className="bg-gray-100 rounded-xl p-1">
                  <TabsTrigger value="active" className="rounded-lg font-bold text-xs uppercase px-4">Active ({barcodes.filter(b => b.status === 'active').length})</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-lg font-bold text-xs uppercase px-4">All History ({barcodes.length})</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="active" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {barcodes.filter(b => b.status === 'active').map((barcode, index) => (
                      <motion.div
                        key={barcode.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        layout
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border-0 shadow-sm bg-white rounded-[32px] ring-1 ring-black/5 overflow-hidden group">
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-50 rounded-2xl group-hover:scale-110 transition-transform">
                                  {barcode.type === 'vehicle' ? <Car className="h-6 w-6 text-red-600" /> : <Home className="h-6 w-6 text-red-600" />}
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">{barcode.label}</h3>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{barcode.type}</p>
                                </div>
                              </div>
                              <Badge className="bg-green-100 text-green-700 border-0 rounded-full text-[10px] font-black px-2 shadow-none">ACTIVE</Badge>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-center mb-6 border border-dashed border-gray-200">
                              <img src={barcode.qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl font-bold text-[10px] uppercase gap-2 h-10 border-0 ring-1 ring-black/5 hover:bg-gray-50"
                                onClick={() => handleCopyLink(barcode.id)}
                              >
                                <Copy className="h-3.5 w-3.5" />
                                Copy Link
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl font-bold text-[10px] uppercase gap-2 h-10 border-0 ring-1 ring-black/5 hover:bg-gray-50"
                                onClick={() => handleDownloadQR(barcode.label, barcode.qrCodeUrl)}
                              >
                                <Download className="h-3.5 w-3.5" />
                                Download
                              </Button>
                            </div>

                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full mt-2 rounded-xl font-bold text-[10px] uppercase gap-2 h-9 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200"
                              onClick={() => window.open(`/emergency?id=${barcode.id}`, '_blank')}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Test Scan (Preview Alert Page)
                            </Button>

                            <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-50">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={barcode.status === 'active'}
                                  onCheckedChange={(checked) => statusMutation.mutate({ id: barcode.id, status: checked ? 'active' : 'disabled' })}
                                />
                                <span className="text-[10px] font-black text-gray-400 uppercase">ENABLED</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-orange-500 hover:bg-orange-50 rounded-lg"
                                  onClick={() => setIsRegenerateOpen(barcode.id)}
                                  title="Regenerate"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-lg"
                                  onClick={() => deleteMutation.mutate(barcode.id)}
                                  title="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {barcodes.filter(b => b.status === 'active').length === 0 && (
                  <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                    <QrCode className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">No active barcodes</h3>
                    <p className="text-gray-400 mt-2">Generate a barcode for your vehicle or unit to get started.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <Card className="border-0 shadow-sm bg-white rounded-[32px] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow className="border-0">
                        <TableHead className="text-[10px] font-black uppercase text-gray-400 px-6">Label</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-gray-400">Created</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-gray-400">Status</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-gray-400 text-right px-6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {barcodes.map((barcode) => (
                        <TableRow key={barcode.id} className="border-gray-50">
                          <TableCell className="px-6">
                            <p className="font-bold text-gray-900">{barcode.label}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{barcode.type}</p>
                          </TableCell>
                          <TableCell>
                            <p className="text-xs text-gray-600">{new Date(barcode.createdAt).toLocaleDateString()}</p>
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              barcode.status === 'active' ? 'bg-green-100 text-green-700' :
                                barcode.status === 'disabled' ? 'bg-gray-100 text-gray-700' :
                                  'bg-orange-100 text-orange-700'
                                  + " border-0 rounded-full text-[10px] font-black shadow-none px-2"}>
                              {barcode.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-6">
                            <Button variant="ghost" size="sm" className="h-8 px-2 font-bold text-[10px] uppercase rounded-lg" onClick={() => handleCopyLink(barcode.id)}>
                              Link
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="border-0 shadow-sm bg-white rounded-[32px] p-6 border-l-4 border-l-red-500">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 rounded-2xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Security Note</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    These barcodes allow others to contact you for emergencies without knowing your phone number. All calls and messages are securely routed through the IGATESECURITY app.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-full font-bold text-[10px] py-1">NO DATA LEAKAGE</Badge>
                    <Badge variant="outline" className="rounded-full font-bold text-[10px] py-1">SECURE ROUTING</Badge>
                    <Badge variant="outline" className="rounded-full font-bold text-[10px] py-1">24/7 ACTIVE</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Scan Logs */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm bg-white rounded-[32px] p-6 ring-1 ring-black/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <History className="h-5 w-5 text-gray-400" />
                  Recent Alerts
                </h3>
                <Badge className="bg-gray-100 text-gray-600 border-0 rounded-full text-[10px] font-black px-2">{logs.length}</Badge>
              </div>

              <div className="space-y-4">
                {(logs || []).slice(0, 5).map((log: any) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-red-600 text-xs shadow-sm">
                          {(log.visitorName || 'U').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{log.visitorName}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{new Date(log.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      {log.isEmergency && <Badge className="bg-red-100 text-red-700 border-0 rounded-full text-[8px] font-black px-1.5 shadow-none">URGENT</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 italic line-clamp-2">"{log.reason || 'No reason specified'}"</p>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        className="h-8 flex-1 bg-white hover:bg-gray-50 text-teal-600 text-[10px] font-black ring-1 ring-black/5 border-0 rounded-xl gap-1"
                        onClick={() => {
                          if (log.visitorPhone && log.visitorPhone !== 'N/A') {
                            window.open(`tel:${log.visitorPhone}`, '_self')
                          } else {
                            toast.error('No phone number provided by visitor')
                          }
                        }}
                      >
                        <Phone className="h-3 w-3" /> CALL
                      </Button>
                    </div>
                  </div>
                ))}

                {logs.length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 font-medium italic">No alerts yet</p>
                  </div>
                )}
              </div>

              <Button variant="ghost" className="w-full mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600">
                View All History
              </Button>
            </Card>


          </div>
        </div>

        {/* Create Barcode Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="rounded-[40px] border-0 p-8 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-gray-900 tracking-tight">Generate Barcode</DialogTitle>
              <DialogDescription className="font-medium text-gray-500">
                Create a new unique barcode for your property or vehicle.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Label Name</Label>
                <Input
                  placeholder="e.g. Main Door, My Car (MH-12...)"
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold"
                  value={newBarcodeData.label}
                  onChange={(e) => setNewBarcodeData({ ...newBarcodeData, label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Emergency Mobile Number (Optional)</Label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="e.g. 9876543210 (Default: your number)"
                    className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold"
                    value={newBarcodeData.phone}
                    onChange={(e) => setNewBarcodeData({ ...newBarcodeData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Category</Label>
                <Select
                  value={newBarcodeData.type}
                  onValueChange={(v: any) => setNewBarcodeData({ ...newBarcodeData, type: v })}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 font-bold">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-0 shadow-2xl ring-1 ring-black/5">
                    <SelectItem value="property" className="rounded-xl font-bold text-sm">Property / Unit</SelectItem>
                    <SelectItem value="vehicle" className="rounded-xl font-bold text-sm">Vehicle</SelectItem>
                    <SelectItem value="other" className="rounded-xl font-bold text-sm">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                <Shield className="h-5 w-5 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                  A new non-guessable secure barcode will be generated. You can disable or regenerate it anytime.
                </p>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-2xl h-12 font-bold px-6">Cancel</Button>
              <Button
                onClick={handleCreateBarcode}
                className="bg-red-600 hover:bg-red-700 text-white rounded-2xl h-12 px-8 font-black shadow-lg shadow-red-100"
              >
                GENERATE NOW
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Regenerate Warning Dialog */}
        <Dialog open={!!isRegenerateOpen} onOpenChange={(open) => !open && setIsRegenerateOpen(null)}>
          <DialogContent className="rounded-[40px] border-0 p-8 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-orange-600 tracking-tight flex items-center gap-2">
                <AlertTriangle className="h-7 w-7" />
                Regenerate?
              </DialogTitle>
              <DialogDescription className="font-medium text-gray-500">
                This will invalidate your current barcode ID. Any physical copies printed will stop working immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-sm text-orange-800 font-medium">
                You will need to replace the old QR code with the new one at the location/vehicle once regenerated.
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setIsRegenerateOpen(null)} className="rounded-2xl h-12 font-bold px-6">Keep Old</Button>
              <Button
                onClick={() => {
                  if (isRegenerateOpen) regenerateMutation.mutate(isRegenerateOpen)
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl h-12 px-8 font-black shadow-lg shadow-orange-100"
              >
                REGENERATE
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
