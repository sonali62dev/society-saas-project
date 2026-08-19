"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Settings,
    Plus,
    Trash2,
    Save,
    AlertCircle,
    ChevronLeft,
    Check,
    Clock,
    DollarSign,
    Percent,
    ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { billingConfigService, MaintenanceRule, ChargeMaster, LateFeeConfig } from "@/services/billing-config.service"
import { BillingService } from "@/services/billing.service"

export default function BillingConfigPage() {
    const queryClient = useQueryClient()
    const router = useRouter()

    // Fetch Data
    const { data: config, isLoading } = useQuery({
        queryKey: ['billing-config'],
        queryFn: () => billingConfigService.getConfig()
    })

    // Mutations
    const finalizeMutation = useMutation({
        mutationFn: () => BillingService.finalizeSetup(),
        onSuccess: (data) => {
            toast.success(data.message || "Setup finalized and initial bills generated!");
            router.push('/dashboard/financial/billing');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to finalize setup");
        }
    })

    const updateRuleMutation = useMutation({
        mutationFn: ({ id, data }: { id: number | 'new', data: Partial<MaintenanceRule> }) =>
            billingConfigService.updateMaintenanceRule(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing-config'] })
            toast.success("Maintenance rule updated")
        }
    })

    const deleteRuleMutation = useMutation({
        mutationFn: (id: number) => billingConfigService.deleteMaintenanceRule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing-config'] })
            toast.success("Maintenance rule removed")
        }
    })

    const updateChargeMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: Partial<ChargeMaster> }) =>
            billingConfigService.updateCharge(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing-config'] })
            toast.success("Charge head updated")
        }
    })

    const createChargeMutation = useMutation({
        mutationFn: (data: Partial<ChargeMaster>) => billingConfigService.createCharge(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing-config'] })
            toast.success("New charge head added")
        }
    })

    const deleteChargeMutation = useMutation({
        mutationFn: (id: number) => billingConfigService.deleteCharge(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing-config'] })
            toast.success("Charge head removed")
        }
    })

    const updateLateFeeMutation = useMutation({
        mutationFn: (data: Partial<LateFeeConfig>) => billingConfigService.updateLateFeeConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['billing-config'] })
            toast.success("Late fee settings updated")
        }
    })

    if (isLoading) return <div className="p-8">Loading configuration...</div>

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Billing Configuration</h1>
                        <p className="text-muted-foreground text-sm">Configure how dues and penalties are calculated.</p>
                    </div>
                </div>
                <Button
                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
                    onClick={() => finalizeMutation.mutate()}
                    disabled={finalizeMutation.isPending}
                >
                    <Check className="h-4 w-4 mr-2" />
                    {finalizeMutation.isPending ? "Finalizing..." : "Finalize & Generate Bills"}
                </Button>
            </div>

            <Tabs defaultValue="maintenance" className="space-y-4">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="maintenance">Maintenance Rules</TabsTrigger>
                    <TabsTrigger value="charges">Charge Master</TabsTrigger>
                    <TabsTrigger value="late-fee">Late Fee Settings</TabsTrigger>
                </TabsList>

                {/* Maintenance Rules Section */}
                <TabsContent value="maintenance">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Maintenance Rules</CardTitle>
                                <CardDescription>Define rates based on flat type or area.</CardDescription>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" /> Add New Rule
                                    </Button>
                                </DialogTrigger>
                                <RuleModal onSave={(data) => updateRuleMutation.mutate({ id: 'new', data })} />
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Flat Type</TableHead>
                                        <TableHead>Calc Method</TableHead>
                                        <TableHead>Amount/Rate</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {config?.maintenanceRules?.map((rule) => (
                                        <TableRow key={rule.id}>
                                            <TableCell className="font-medium">{rule.unitType}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{rule.calculationType}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {rule.calculationType === 'FLAT'
                                                    ? `₹${rule.amount}`
                                                    : `₹${rule.ratePerSqFt} / sq.ft`}
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={rule.isActive}
                                                    onCheckedChange={(val) => updateRuleMutation.mutate({ id: rule.id, data: { isActive: val } })}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="sm">Edit</Button>
                                                        </DialogTrigger>
                                                        <RuleModal rule={rule} onSave={(data) => updateRuleMutation.mutate({ id: rule.id, data })} />
                                                    </Dialog>
                                                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteRuleMutation.mutate(rule.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Charge Master Section */}
                <TabsContent value="charges">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Charge Master</CardTitle>
                                <CardDescription>Manage recurring charge heads for invoices.</CardDescription>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" /> New Charge
                                    </Button>
                                </DialogTrigger>
                                <ChargeModal onSave={(data) => createChargeMutation.mutate(data)} />
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {config?.chargeMaster?.map((charge) => (
                                    <Card key={charge.id} className={!charge.isActive ? 'opacity-60' : ''}>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{charge.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{charge.calculationMethod}</p>
                                                </div>
                                                <Switch
                                                    checked={charge.isActive}
                                                    onCheckedChange={(val) => updateChargeMutation.mutate({ id: charge.id, data: { isActive: val } })}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between mt-6">
                                                <div className="text-xl font-bold">₹{charge.defaultAmount}</div>
                                                <div className="flex gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm">Edit</Button>
                                                        </DialogTrigger>
                                                        <ChargeModal charge={charge} onSave={(data) => updateChargeMutation.mutate({ id: charge.id, data })} />
                                                    </Dialog>
                                                    <Button variant="ghost" size="sm" onClick={() => deleteChargeMutation.mutate(charge.id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Late Fee Section */}
                <TabsContent value="late-fee">
                    <Card>
                        <CardHeader>
                            <CardTitle>Late Fee Configuration</CardTitle>
                            <CardDescription>Rules to automatically apply penalties to overdue bills.</CardDescription>
                        </CardHeader>
                        <CardContent className="max-w-2xl">
                            <form className="space-y-6" onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                updateLateFeeMutation.mutate({
                                    gracePeriod: parseInt(formData.get('gracePeriod') as string),
                                    feeType: formData.get('feeType') as any,
                                    amount: parseFloat(formData.get('amount') as string),
                                    maxCap: formData.get('maxCap') ? parseFloat(formData.get('maxCap') as string) : null,
                                    isActive: config?.lateFeeConfig?.isActive
                                });
                            }}>
                                <div className="flex items-center justify-between pb-4 border-b">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Late Fee Status</Label>
                                        <p className="text-sm text-muted-foreground">Enable or disable automatic penalty logic.</p>
                                    </div>
                                    <Switch
                                        checked={config?.lateFeeConfig?.isActive}
                                        onCheckedChange={(val) => updateLateFeeMutation.mutate({ isActive: val })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
                                        <Input id="gracePeriod" name="gracePeriod" type="number" defaultValue={config?.lateFeeConfig?.gracePeriod} placeholder="e.g. 5" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="feeType">Fee Type</Label>
                                        <Select name="feeType" defaultValue={config?.lateFeeConfig?.feeType}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="FIXED">Fixed Amount</SelectItem>
                                                <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                                <SelectItem value="PER_DAY">Per Day Rate</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Late Fee Amount/Rate</Label>
                                        <Input id="amount" name="amount" type="number" step="0.01" defaultValue={config?.lateFeeConfig?.amount} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maxCap">Max Penalty Cap (Optional)</Label>
                                        <Input id="maxCap" name="maxCap" type="number" defaultValue={config?.lateFeeConfig?.maxCap || ''} placeholder="No max cap" />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit" disabled={updateLateFeeMutation.isPending}>
                                        {updateLateFeeMutation.isPending ? "Saving..." : "Save Configuration"}
                                    </Button>
                                </div>
                            </form>

                            {/* Current Configuration Summary */}
                            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-slate-500" />
                                    Active Late Fee Policy
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${config?.lateFeeConfig?.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                {config?.lateFeeConfig?.isActive ? 'ACTIVE' : 'DISABLED'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Calculation</p>
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {config?.lateFeeConfig?.feeType === 'FIXED' && 'Fixed Amount'}
                                            {config?.lateFeeConfig?.feeType === 'PERCENTAGE' && 'Percentage (%)'}
                                            {config?.lateFeeConfig?.feeType === 'PER_DAY' && 'Per Day Rate'}
                                        </span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Penalty Value</p>
                                        <span className="font-bold text-slate-900 dark:text-white text-lg">
                                            {config?.lateFeeConfig?.feeType === 'PERCENTAGE'
                                                ? `${config?.lateFeeConfig?.amount}%`
                                                : `₹${config?.lateFeeConfig?.amount?.toLocaleString()}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                        <p className="text-sm text-blue-800 dark:text-blue-300">
                                            Penalties start after <span className="font-bold">{config?.lateFeeConfig?.gracePeriod || 0} days</span> of due date.
                                        </p>
                                    </div>
                                    {config?.lateFeeConfig?.maxCap && (
                                        <Badge variant="outline" className="border-blue-200 dark:border-blue-800 text-blue-700 bg-blue-100/50">
                                            Max Cap: ₹{config?.lateFeeConfig?.maxCap?.toLocaleString()}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

// Helper Components
function RuleModal({ rule, onSave }: { rule?: MaintenanceRule, onSave: (data: any) => void }) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{rule ? 'Edit Rule' : 'Add Maintenance Rule'}</DialogTitle>
                <DialogDescription>Define how maintenance is calculated for this unit type.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onSave({
                    unitType: formData.get('unitType'),
                    calculationType: formData.get('calculationType'),
                    amount: formData.get('amount'),
                    ratePerSqFt: formData.get('ratePerSqFt'),
                    isActive: true
                });
            }}>
                <div className="space-y-2">
                    <Label>Unit Type</Label>
                    <Select name="unitType" defaultValue={rule?.unitType || 'ALL'}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Units (Global)</SelectItem>
                            <SelectItem value="2BHK">2BHK</SelectItem>
                            <SelectItem value="3BHK">3BHK</SelectItem>
                            <SelectItem value="4BHK">4BHK</SelectItem>
                            <SelectItem value="1BHK">1BHK</SelectItem>
                            <SelectItem value="VILLA">Villa</SelectItem>
                            <SelectItem value="PENTHOUSE">Penthouse</SelectItem>
                            <SelectItem value="SHOP">Shop</SelectItem>
                            <SelectItem value="OFFICE">Office</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Calculation Method</Label>
                    <Select name="calculationType" defaultValue={rule?.calculationType || 'FLAT'}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FLAT">Flat Rate (Fixed Amount)</SelectItem>
                            <SelectItem value="AREA">Area Based (Per sq.ft)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Fixed Amount (₹)</Label>
                        <Input name="amount" type="number" defaultValue={rule?.amount} />
                    </div>
                    <div className="space-y-2">
                        <Label>Rate per sq.ft (₹)</Label>
                        <Input name="ratePerSqFt" type="number" step="0.01" defaultValue={rule?.ratePerSqFt} />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save Rule</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}

function ChargeModal({ charge, onSave }: { charge?: ChargeMaster, onSave: (data: any) => void }) {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{charge ? 'Edit Charge' : 'Add New Charge Head'}</DialogTitle>
                <DialogDescription>Charges will be automatically added to bills.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onSave({
                    name: formData.get('name'),
                    defaultAmount: formData.get('defaultAmount'),
                    calculationMethod: formData.get('calculationMethod'),
                    isOptional: formData.get('isOptional') === 'on'
                });
            }}>
                <div className="space-y-2">
                    <Label>Charge Name</Label>
                    <Input name="name" defaultValue={charge?.name} placeholder="e.g. Water Charges" required />
                </div>
                <div className="space-y-2">
                    <Label>Default Amount (₹)</Label>
                    <Input name="defaultAmount" type="number" defaultValue={charge?.defaultAmount} required />
                </div>
                <div className="space-y-2">
                    <Label>Calculation Method</Label>
                    <Select name="calculationMethod" defaultValue={charge?.calculationMethod || 'FIXED'}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FIXED">Fixed Amount</SelectItem>
                            <SelectItem value="VARIABLE">Variable Input</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button type="submit">Add Charge</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    )
}
