'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
    Plus, QrCode, Download, Trash2, ToggleLeft, ToggleRight,
    Shield, Copy, Check, Loader2, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription
} from '@/components/ui/dialog'
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GateService } from '@/services/gate.service'
import { toast } from 'sonner'

function generateQRCodeURL(text: string, size = 300) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&format=png&margin=10`
}

export default function GateManagementPage() {
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newGateName, setNewGateName] = useState('')
    const [deleteGateId, setDeleteGateId] = useState<number | null>(null)
    const [selectedGate, setSelectedGate] = useState<any>(null)
    const [copied, setCopied] = useState(false)
    const queryClient = useQueryClient()

    const { data: gates = [], isLoading } = useQuery({
        queryKey: ['gates'],
        queryFn: GateService.list
    })

    const createMutation = useMutation({
        mutationFn: (name: string) => GateService.create(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gates'] })
            setIsAddOpen(false)
            setNewGateName('')
            toast.success('Gate created successfully')
        },
        onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to create gate')
    })

    const toggleMutation = useMutation({
        mutationFn: (id: number) => GateService.toggle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gates'] })
            toast.success('Gate status updated')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => GateService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gates'] })
            setDeleteGateId(null)
            toast.success('Gate deleted')
        },
        onError: () => toast.error('Failed to delete gate')
    })

    const getGateURL = (gateId: number) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
        return `${baseUrl}/visitor-entry?gateId=${gateId}`
    }

    const handleDownloadQR = async (gate: any) => {
        const url = getGateURL(gate.id)
        const qrUrl = generateQRCodeURL(url, 600)
        try {
            const res = await fetch(qrUrl)
            const blob = await res.blob()
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = `igate-qr-${gate.name.replace(/\s+/g, '-').toLowerCase()}.png`
            link.click()
            URL.revokeObjectURL(link.href)
            toast.success('QR code downloaded')
        } catch {
            toast.error('Failed to download QR')
        }
    }

    const handleCopyLink = (gateId: number) => {
        navigator.clipboard.writeText(getGateURL(gateId))
        setCopied(true)
        toast.success('Link copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <RoleGuard allowedRoles={['admin', 'super_admin']}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gate QR Management</h1>
                        <p className="text-gray-600 mt-1">
                            Create gate QR codes for contactless visitor entry
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Powered by igate — scan-based walk-in visitor registration
                        </p>
                    </div>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Add Gate</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Gate</DialogTitle>
                                <DialogDescription>
                                    Create a gate entry point for QR-based visitor registration
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Gate Name</Label>
                                    <Input
                                        placeholder='e.g. Main Gate, Gate A, Back Gate'
                                        value={newGateName}
                                        onChange={(e) => setNewGateName(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() => newGateName.trim() && createMutation.mutate(newGateName.trim())}
                                        disabled={!newGateName.trim() || createMutation.isPending}
                                    >
                                        {createMutation.isPending ? 'Creating...' : 'Create Gate'}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Info Banner */}
                <Card className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
                    <div className="flex items-start gap-3">
                        <QrCode className="h-6 w-6 text-cyan-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-cyan-900">How it works</h3>
                            <p className="text-sm text-cyan-700 mt-1">
                                1. Create a gate entry point below → 2. Download the QR code →
                                3. Print and display at the gate → 4. Visitors scan QR to fill their details →
                                5. Guard sees pending visitors and approves/rejects
                            </p>
                            <div className="mt-2 text-xs text-cyan-800 bg-white/70 p-2.5 rounded-lg border border-cyan-200 font-medium">
                                📱 <strong>Mobile Camera Scan Tip:</strong> Laptop me test karte waqt QR URL <code>localhost:3000</code> hota hai jo browser me paste karne par khulta hai. Mobile phone se scan karne ke liye Live Domain (e.g. <code>https://socity.kiaantechnology.com</code>) ya Wi-Fi IP par phone instant open hota hai!
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Gates Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : gates.length === 0 ? (
                    <Card className="p-12 text-center">
                        <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">No gates created yet</h3>
                        <p className="text-gray-500 mt-1">
                            Create your first gate to generate a visitor entry QR code
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gates.map((gate: any, index: number) => (
                            <motion.div
                                key={gate.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                                    {/* QR Preview */}
                                    <div
                                        className="p-6 bg-gradient-to-br from-slate-50 to-gray-100 flex justify-center cursor-pointer"
                                        onClick={() => setSelectedGate(gate)}
                                    >
                                        <img
                                            src={generateQRCodeURL(getGateURL(gate.id), 200)}
                                            alt={`QR for ${gate.name}`}
                                            className="w-48 h-48 rounded-lg shadow-sm"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900 text-lg">{gate.name}</h3>
                                            <Badge
                                                variant="outline"
                                                className={gate.isActive
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-red-50 text-red-700 border-red-200'
                                                }
                                            >
                                                {gate.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>

                                        <p className="text-xs text-gray-400">
                                            {gate._count?.visitors || 0} visitor entries • Created {new Date(gate.createdAt).toLocaleDateString()}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 pt-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 text-xs"
                                                onClick={() => handleDownloadQR(gate)}
                                            >
                                                <Download className="h-3.5 w-3.5 mr-1" /> Download
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1 text-xs"
                                                onClick={() => handleCopyLink(gate.id)}
                                            >
                                                {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                                                Copy Link
                                            </Button>
                                        </div>

                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="w-full text-xs font-bold bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200"
                                            onClick={() => window.open(getGateURL(gate.id), '_blank')}
                                        >
                                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                            Test Entry Form (Preview)
                                        </Button>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="flex-1 text-xs"
                                                onClick={() => toggleMutation.mutate(gate.id)}
                                            >
                                                {gate.isActive ? (
                                                    <><ToggleRight className="h-3.5 w-3.5 mr-1 text-green-600" /> Deactivate</>
                                                ) : (
                                                    <><ToggleLeft className="h-3.5 w-3.5 mr-1 text-gray-400" /> Activate</>
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="flex-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setDeleteGateId(gate.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* QR Detail Dialog */}
                <Dialog open={!!selectedGate} onOpenChange={(open) => !open && setSelectedGate(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Gate QR: {selectedGate?.name}</DialogTitle>
                            <DialogDescription>
                                Print this QR code and display it at the gate entrance
                            </DialogDescription>
                        </DialogHeader>
                        {selectedGate && (
                            <div className="flex flex-col items-center space-y-4 py-4">
                                <div className="p-6 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                    <img
                                        src={generateQRCodeURL(getGateURL(selectedGate.id), 400)}
                                        alt="QR Code"
                                        className="w-72 h-72"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-lg text-gray-900">{selectedGate.name}</p>
                                    <p className="text-xs text-gray-500 mt-1 font-mono break-all">
                                        {getGateURL(selectedGate.id)}
                                    </p>
                                </div>
                                <div className="flex gap-3 w-full">
                                    <Button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                        onClick={() => handleDownloadQR(selectedGate)}
                                    >
                                        <Download className="h-4 w-4 mr-2" /> Download QR
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => window.open(getGateURL(selectedGate.id), '_blank')}
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" /> Preview
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation */}
                <AlertDialog open={!!deleteGateId} onOpenChange={(open) => !open && setDeleteGateId(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete this gate?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the gate and its QR code. Existing visitor records will be preserved.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => deleteGateId && deleteMutation.mutate(deleteGateId)}
                            >
                                Delete Gate
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </RoleGuard>
    )
}
