"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
    Receipt,
    Wallet,
    CreditCard,
    Download,
    AlertCircle,
    CheckCircle2,
    Clock,
    ChevronRight,
    Printer,
    ArrowLeft,
    Building2,
} from "lucide-react"
import { format } from "date-fns"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { BillingService } from "@/services/billing.service"
import { residentService } from "@/services/resident.service"
import { PDFService } from "@/services/pdf.service"
import { RoleGuard } from "@/components/auth/role-guard"
import { useAuthStore } from "@/lib/stores/auth-store"

function InvoiceDialog({ invoice, sname = 'My Society' }: { invoice: any, sname?: string }) {
    if (!invoice) return null

    const isPaid = invoice.status === 'paid'

    const handleDownload = () => {
        PDFService.generateInvoicePDF(invoice, sname);
    }

    const handlePrint = () => {
        window.print();
    }

    const formatRate = (val: any) => {
        return parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })
    }

    const capitalize = (str: string) => {
        if (!str) return ''
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    }

    // Combine all line items for summary
    const allItems = [
        { name: 'Maintenance Charges', amount: invoice.maintenance },
        { name: 'Utility Charges', amount: invoice.utilities },
        ...(invoice.items || [])
    ].filter(item => item.amount > 0)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline" size="sm"
                    className={`gap-1.5 transition-all active:scale-[0.98] ${isPaid
                        ? 'hover:bg-zinc-50 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                        : 'hover:bg-orange-50 border-orange-200 text-orange-700'
                        }`}
                >
                    {isPaid ? <Receipt className="h-3.5 w-3.5" /> : <CreditCard className="h-3.5 w-3.5" />}
                    {isPaid ? 'Receipt' : 'View'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg p-0 border-0 shadow-2xl rounded-2xl dark:bg-zinc-950 max-h-[90vh] overflow-y-auto">
                <div className="bg-white dark:bg-zinc-950 min-h-full">
                    {/* Header */}
                    <div className="bg-primary/5 px-6 py-10 flex flex-col items-center text-center border-b border-dashed relative">
                        <div className="h-16 w-16 bg-white dark:bg-zinc-900 rounded-full shadow-sm flex items-center justify-center mb-4 border relative z-10">
                            {isPaid ? <Receipt className="h-8 w-8 text-primary" /> : <CreditCard className="h-8 w-8 text-orange-500" />}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-foreground">
                            {isPaid ? 'Payment Receipt' : 'Invoice Details'}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">{invoice.invoiceNo}</p>

                        <div className="mt-8 flex flex-col items-center">
                            {isPaid ? (
                                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 mb-4 border border-green-100 dark:border-green-900/30">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    PAID
                                </div>
                            ) : (
                                <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 mb-4 border border-orange-100 dark:border-orange-900/30">
                                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                                    {invoice.status?.toUpperCase()}
                                </div>
                            )}
                            <p className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                                {isPaid
                                    ? (invoice.paidDate ? format(new Date(invoice.paidDate), 'dd MMMM yyyy') : 'N/A')
                                    : `Due: ${format(new Date(invoice.dueDate), 'dd MMMM yyyy')}`
                                }
                            </p>
                            <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                ₹{formatRate(invoice.amount)}
                            </div>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8 space-y-8">
                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-3">Description / Reference</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">
                                {invoice.description || `Society Maintenance - ${invoice.invoiceNo?.split('-')[1] || 'Monthly'}`}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4">Breakdown</p>
                            <div className="space-y-3">
                                {allItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-500 dark:text-zinc-400 font-medium">{capitalize(item.name)}</span>
                                        <span className="font-bold text-gray-900 dark:text-zinc-100">₹{formatRate(item.amount)}</span>
                                    </div>
                                ))}

                                {invoice.penalty > 0 && (
                                    <div className="flex justify-between items-center text-sm pt-2 border-t border-zinc-100 dark:border-zinc-900">
                                        <span className="text-red-500 font-bold">Late Fee / Penalty</span>
                                        <span className="font-bold text-red-600 tracking-tight">₹{formatRate(invoice.penalty)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-base pt-3 border-t-2 border-zinc-900 dark:border-zinc-100">
                                    <span className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-tight">Total Payable</span>
                                    <span className="font-black text-zinc-900 dark:text-white">₹{formatRate(invoice.amount)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 grid grid-cols-2 gap-6 border-t border-zinc-100 dark:border-zinc-900">
                            <div>
                                <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1.5">Unit</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                                    {typeof invoice.unit === 'object' ? `${invoice.unit.block}-${invoice.unit.number}` : (invoice.unit || 'N/A')}
                                </p>
                            </div>
                            {isPaid && (
                                <div>
                                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-1.5">Payment Mode</p>
                                    <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">{invoice.paymentMode || 'Online'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-8 pb-8 flex flex-col gap-3">
                        {isPaid ? (
                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl py-6 font-bold text-sm shadow-xl transition-all active:scale-[0.98]"
                                    onClick={handleDownload}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 border-zinc-200 dark:border-zinc-800 rounded-xl py-6 font-bold text-sm transition-all active:scale-[0.98]"
                                    onClick={handlePrint}
                                >
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 pt-2">
                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-xl py-6 font-bold text-sm shadow-xl transition-all active:scale-[0.98]"
                                        onClick={handleDownload}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        PDF
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-zinc-200 dark:border-zinc-800 rounded-xl py-6 font-bold text-sm transition-all active:scale-[0.98]"
                                        onClick={handlePrint}
                                    >
                                        <Printer className="h-4 w-4 mr-2" />
                                        Print
                                    </Button>
                                </div>
                                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 text-sm text-orange-700 dark:text-orange-400 text-center">
                                    <Clock className="h-5 w-5 mx-auto mb-1" />
                                    Payment pending. Pay by <strong>{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</strong>.
                                </div>
                            </div>
                        )}
                        <p className="text-[10px] text-center text-zinc-400 font-medium">System generated. No signature required.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}


export default function SocietyDuesPage() {
    const [activeTab, setActiveTab] = useState("invoices")
    const { user } = useAuthStore()

    // Fetch Dashboard Data (for summary)
    const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
        queryKey: ["residentDashboard"],
        queryFn: () => residentService.getDashboardData()
    })

    // Fetch my invoices (resident-specific)
    const { data: invoices = [], isLoading: invoicesLoading, error: invoicesError } = useQuery({
        queryKey: ["myInvoices"],
        queryFn: async () => {
            try {
                const result = await BillingService.getMyInvoices();
                console.log('[MyInvoices] API result:', result);
                return Array.isArray(result) ? result : []
            } catch (err: any) {
                console.error('[MyInvoices] API error:', err?.response?.data || err?.message);
                toast.error('Failed to load invoices: ' + (err?.response?.data?.error || err?.message || 'Unknown error'));
                throw err;
            }
        },
        retry: false,
    })

    const paidInvoices = (invoices as any[]).filter((i: any) => i.status === 'paid')
    const pendingInvoices = (invoices as any[]).filter((i: any) => i.status !== 'paid')

    if (dashboardLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <RoleGuard allowedRoles={['resident']}>
            <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Dues & Receipts</h1>
                    <p className="text-muted-foreground text-sm mt-1">View your maintenance payments and download receipts.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Outstanding Dues</CardTitle>
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">₹{dashboardData?.dues?.amount || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {pendingInvoices.length} pending invoice{pendingInvoices.length !== 1 ? 's' : ''}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                ₹{paidInvoices.reduce((sum: number, i: any) => sum + (i.amount || 0), 0).toLocaleString('en-IN')}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{paidInvoices.length} paid receipt{paidInvoices.length !== 1 ? 's' : ''}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-md col-span-2 sm:col-span-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">My Unit</CardTitle>
                            <Building2 className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">
                                {dashboardData?.unit?.unitNo || 'N/A'}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{user?.name}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 w-full max-w-sm">
                        <TabsTrigger value="invoices">
                            Invoices
                            {pendingInvoices.length > 0 && (
                                <Badge className="ml-2 bg-orange-500 text-white text-[10px] px-1.5 py-0 h-4">{pendingInvoices.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="receipts">
                            Receipts
                            {paidInvoices.length > 0 && (
                                <Badge className="ml-2 bg-green-600 text-white text-[10px] px-1.5 py-0 h-4">{paidInvoices.length}</Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    {/* All Invoices */}
                    <TabsContent value="invoices" className="mt-4">
                        <Card className="border-0 shadow-md">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">All Invoices</CardTitle>
                                <CardDescription>Your maintenance and utility invoices.</CardDescription>
                            </CardHeader>
                            <CardContent className="px-0">
                                {invoicesLoading ? (
                                    <div className="py-10 text-center text-muted-foreground">Loading invoices...</div>
                                ) : invoicesError ? (
                                    <div className="py-10 text-center text-destructive text-sm">
                                        Failed to load invoices. Please try refreshing the page.
                                    </div>
                                ) : invoices.length === 0 ? (
                                    <div className="py-10 text-center text-muted-foreground">No invoices found.</div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Invoice No</TableHead>
                                                <TableHead>Due Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pendingInvoices.map((invoice: any) => (
                                                <TableRow key={invoice.id}>
                                                    <TableCell>
                                                        <div className="font-medium text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                                                            {invoice.invoiceNo}
                                                        </div>
                                                        {invoice.description && (
                                                            <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                                                                {invoice.description}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</TableCell>
                                                    <TableCell className="font-semibold">₹{Number(invoice.amount).toLocaleString('en-IN')}</TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={invoice.status === 'paid' ? 'outline' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}
                                                            className={invoice.status === 'paid' ? 'text-green-600 border-green-200 bg-green-50' : ''}
                                                        >
                                                            {invoice.status.toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-teal-600"
                                                                onClick={() => PDFService.generateInvoicePDF(invoice, dashboardData?.societyName)}
                                                                title="Download PDF"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                                                                onClick={() => window.print()}
                                                                title="Print"
                                                            >
                                                                <Printer className="h-4 w-4" />
                                                            </Button>
                                                            <InvoiceDialog invoice={invoice} sname={dashboardData?.societyName} />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Paid Receipts */}
                    <TabsContent value="receipts" className="mt-4">
                        <div className="space-y-3">
                            {invoicesLoading ? (
                                <div className="py-10 text-center text-muted-foreground">Loading receipts...</div>
                            ) : paidInvoices.length === 0 ? (
                                <Card className="border-0 shadow-md">
                                    <CardContent className="py-10 text-center text-muted-foreground">
                                        No paid receipts yet.
                                    </CardContent>
                                </Card>
                            ) : (
                                paidInvoices.map((invoice: any) => (
                                    <Card key={invoice.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-sm text-gray-900 dark:text-foreground">{invoice.invoiceNo}</p>
                                                        {invoice.description && (
                                                            <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{invoice.description}</p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            Paid on {invoice.paidDate ? format(new Date(invoice.paidDate), 'dd MMM yyyy') : 'N/A'}
                                                        </p>
                                                        {invoice.paymentMode && (
                                                            <p className="text-xs text-muted-foreground">{invoice.paymentMode}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-2">
                                                    <p className="font-bold text-gray-900 dark:text-foreground">
                                                        ₹{Number(invoice.amount).toLocaleString('en-IN')}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-teal-600"
                                                            onClick={() => PDFService.generateInvoicePDF(invoice, dashboardData?.societyName)}
                                                            title="Download Receipt"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                        <InvoiceDialog invoice={invoice} sname={dashboardData?.societyName} />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </RoleGuard>
    )
}
