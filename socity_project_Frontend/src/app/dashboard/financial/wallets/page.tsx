"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Wallet,
    Plus,
    Search,
    Filter,
    History,
    ArrowUpRight,
    ArrowDownLeft,
    ChevronRight,
    Loader2
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"
import { societyReceiptService } from "@/services/society-receipt.service"
import { UnitService } from "@/services/unit.service"
import { RoleGuard } from "@/components/auth/role-guard"

export default function WalletManagementPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUnit, setSelectedUnit] = useState<any>(null)
    const [isAddAdvanceOpen, setIsAddAdvanceOpen] = useState(false)
    const [isAddDepositOpen, setIsAddDepositOpen] = useState(false)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [amount, setAmount] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("CASH")
    const [transactionId, setTransactionId] = useState("")
    const [description, setDescription] = useState("")

    const queryClient = useQueryClient()

    // Fetch all units
    const { data: units, isLoading: unitsLoading } = useQuery({
        queryKey: ["units"],
        queryFn: () => UnitService.getUnits()
    })

    // Fetch Wallet Balances (mapping through units would be slow, ideally backend has a list wallets API)
    // For now, we'll fetch them individually or use a mocked list if not available
    // Let's assume we implement a backend list wallets API later. For now, we'll use units and fetch balance on select.

    const addAdvanceMutation = useMutation({
        mutationFn: (data: any) => societyReceiptService.addAdvance(data),
        onSuccess: () => {
            toast.success("Advance recorded successfully")
            setIsAddAdvanceOpen(false)
            resetForm()
            queryClient.invalidateQueries({ queryKey: ["walletBalance"] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to record advance")
        }
    })

    const addDepositMutation = useMutation({
        mutationFn: (data: any) => societyReceiptService.addSecurityDeposit(data),
        onSuccess: () => {
            toast.success("Security deposit recorded successfully")
            setIsAddDepositOpen(false)
            resetForm()
            queryClient.invalidateQueries({ queryKey: ["walletBalance"] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to record deposit")
        }
    })

    const resetForm = () => {
        setAmount("")
        setPaymentMethod("CASH")
        setTransactionId("")
        setDescription("")
    }

    const handleSubmit = (type: 'advance' | 'deposit') => {
        if (!selectedUnit || !amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        const data = {
            unitId: selectedUnit.id,
            amount: parseFloat(amount),
            paymentMethod,
            transactionId,
            description
        }

        if (type === 'advance') addAdvanceMutation.mutate(data)
        else addDepositMutation.mutate(data)
    }

    const filteredUnits = units?.filter((u: any) =>
        (u.number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.block || '').toLowerCase().includes(searchQuery.toLowerCase())
    ) || []

    return (
        <RoleGuard allowedRoles={['super_admin', 'admin']}>
            <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Wallet Management</h1>
                        <p className="text-muted-foreground">Manage resident advances and security deposits.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search unit..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Unit Wallets</CardTitle>
                        <CardDescription>View and manage financial balances for each unit.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Unit Number</TableHead>
                                    <TableHead>Resident</TableHead>
                                    <TableHead>Advance Balance</TableHead>
                                    <TableHead>Security Deposit</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {unitsLoading ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                                ) : filteredUnits.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center py-10">No units found.</TableCell></TableRow>
                                ) : (
                                    filteredUnits.map((unit: any) => (
                                        <TableRow key={unit.id}>
                                            <TableCell className="font-medium">{unit.block}-{unit.number}</TableCell>
                                            <TableCell>{unit.tenant?.name || unit.owner?.name || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                    ₹{unit.wallet?.advanceBalance || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                                                    ₹{unit.wallet?.securityDepositBalance || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => { setSelectedUnit(unit); setIsAddAdvanceOpen(true); }}
                                                    >
                                                        Record Adv
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => { setSelectedUnit(unit); setIsAddDepositOpen(true); }}
                                                    >
                                                        Record Dep
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => { setSelectedUnit(unit); setIsHistoryOpen(true); }}
                                                    >
                                                        History
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Add Advance Dialog */}
                <Dialog open={isAddAdvanceOpen} onOpenChange={setIsAddAdvanceOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Advance Payment</DialogTitle>
                            <DialogDescription>
                                Add money to unit {selectedUnit?.block}-{selectedUnit?.number} wallet for future dues.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Amount (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH">Cash</SelectItem>
                                        <SelectItem value="CHEQUE">Cheque</SelectItem>
                                        <SelectItem value="UPI">UPI</SelectItem>
                                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Transaction ID / Cheque No (Optional)</Label>
                                <Input
                                    placeholder="Enter ID"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Notes</Label>
                                <Input
                                    placeholder="Optional description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddAdvanceOpen(false)}>Cancel</Button>
                            <Button
                                onClick={() => handleSubmit('advance')}
                                disabled={addAdvanceMutation.isPending}
                            >
                                {addAdvanceMutation.isPending ? 'Processing...' : 'Record Advance'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Add Deposit Dialog - Similar to Advance */}
                <Dialog open={isAddDepositOpen} onOpenChange={setIsAddDepositOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Security Deposit</DialogTitle>
                            <DialogDescription>
                                Record a refundable security deposit for unit {selectedUnit?.block}-{selectedUnit?.number}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Amount (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Method</Label>
                                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CASH">Cash</SelectItem>
                                        <SelectItem value="CHEQUE">Cheque</SelectItem>
                                        <SelectItem value="UPI">UPI</SelectItem>
                                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Transaction ID / Cheque No (Optional)</Label>
                                <Input
                                    placeholder="Enter ID"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddDepositOpen(false)}>Cancel</Button>
                            <Button
                                onClick={() => handleSubmit('deposit')}
                                disabled={addDepositMutation.isPending}
                            >
                                {addDepositMutation.isPending ? 'Processing...' : 'Record Deposit'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* History Dialog */}
                <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Wallet Transaction History</DialogTitle>
                            <DialogDescription>
                                Unit: {selectedUnit?.block}-{selectedUnit?.number}
                            </DialogDescription>
                        </DialogHeader>
                        <WalletHistory unitId={selectedUnit?.id} />
                        <DialogFooter>
                            <Button onClick={() => setIsHistoryOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </RoleGuard>
    )
}

function WalletHistory({ unitId }: { unitId: number }) {
    const { data: transactions, isLoading } = useQuery({
        queryKey: ["walletTransactions", unitId],
        queryFn: () => societyReceiptService.listWalletTransactions(unitId),
        enabled: !!unitId
    })

    if (isLoading) return <div className="py-10 text-center">Loading history...</div>
    if (!transactions || transactions.length === 0) return <div className="py-10 text-center text-muted-foreground">No transaction history.</div>

    return (
        <div className="max-h-[400px] overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((tx: any) => (
                        <TableRow key={tx.id}>
                            <TableCell className="text-xs">{format(new Date(tx.date), 'dd MMM yyyy HH:mm')}</TableCell>
                            <TableCell>
                                <Badge variant={tx.type === 'CREDIT' ? 'outline' : 'destructive'} className={cn(tx.type === 'CREDIT' ? 'text-green-600 border-green-200' : '', "text-[10px]")}>
                                    {tx.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-xs">{tx.purpose.replace('_', ' ')}</TableCell>
                            <TableCell className={`text-right font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                ₹{tx.amount}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
