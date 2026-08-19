'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Download,
  Eye,
  FileText,
  BadgeCheck,
  Calendar,
  CreditCard,
  Building2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
} from '@/components/ui/dialog'
import { useQuery } from '@tanstack/react-query'
import { BillingService } from '@/services/billing.service'
import { PDFService } from '@/services/pdf.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

export default function PlatformInvoicesPage() {
  const [viewInvoice, setViewInvoice] = useState<any>(null)

  // 1. Fetch Invoices
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['platform-invoices'],
    queryFn: BillingService.getPlatformInvoices
  })

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100 border-teal-200">Paid</Badge>
      case 'OVERDUE':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Overdue</Badge>
      default:
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Pending</Badge>
    }
  }

  return (
    <RoleGuard allowedRoles={['admin', 'super_admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Invoices</h1>
          <p className="text-gray-600 mt-1">
            Subscription and activation fees for your society
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-gradient-to-br from-teal-500/10 to-teal-500/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-teal-500 rounded-xl text-white">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-teal-700">Account Status</p>
                <h3 className="text-2xl font-bold text-slate-900">Active & Paid</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Invoices</p>
                <h3 className="text-2xl font-bold text-slate-900">{invoices?.length || 0}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Last Payment</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {invoices?.[0]?.paidDate ? format(new Date(invoices[0].paidDate), 'dd MMM yyyy') : 'N/A'}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card className="border-none shadow-md overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : !invoices || invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-10 w-10 text-slate-300" />
                      <p>No platform invoices found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (invoices || []).map((inv: any) => (
                  <TableRow key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-semibold text-slate-700">{inv.invoiceNo}</TableCell>
                    <TableCell className="font-bold text-slate-900">₹{inv.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-slate-600">
                      {inv.issueDate ? format(new Date(inv.issueDate), 'dd MMM yyyy') : format(new Date(inv.createdAt), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell>{getStatusBadge(inv.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-600"
                          onClick={() => setViewInvoice(inv)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-200 text-slate-700"
                          onClick={() => {
                            PDFService.generateInvoicePDF(inv);
                            toast.success('Downloading invoice...');
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* View Invoice Dialog */}
        <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
          <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
            {viewInvoice && (
              <div className="bg-white">
                <div className="bg-slate-900 p-8 text-white relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Building2 className="h-24 w-24" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-teal-400 mb-2">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-xs uppercase tracking-widest font-bold">Official Invoice</span>
                    </div>
                    <h2 className="text-3xl font-black mb-1">#{viewInvoice.invoiceNo}</h2>
                    <p className="text-slate-400 text-sm">Issued to {viewInvoice.society?.name || 'Your Society'}</p>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Date Issued</p>
                      <p className="font-semibold text-slate-900">
                        {format(new Date(viewInvoice.issueDate || viewInvoice.createdAt), 'dd MMMM, yyyy')}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Payment Status</p>
                      <div>{getStatusBadge(viewInvoice.status)}</div>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between text-[10px] uppercase tracking-widest font-black text-slate-400">
                      <span>Description</span>
                      <span>Amount</span>
                    </div>
                    <div className="px-6 py-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-900">Society Activation & Setup</p>
                          <p className="text-xs text-slate-500 mt-1">Full platform access for 1 year</p>
                        </div>
                        <p className="font-bold text-slate-900">₹{viewInvoice.amount.toLocaleString()}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                        <p className="text-sm font-extrabold text-slate-900">Total Amount Paid</p>
                        <p className="text-2xl font-black text-teal-600">₹{viewInvoice.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl"
                      onClick={() => {
                        PDFService.generateInvoicePDF(viewInvoice);
                        toast.success('Invoice exported as PDF');
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 h-12 border-slate-200 text-slate-700 font-bold rounded-xl"
                      onClick={() => window.print()}
                    >
                      Print Invoice
                    </Button>
                  </div>
                  
                  <p className="text-center text-[10px] text-slate-400 mt-4 italic">
                    This is a computer generated invoice and does not require a physical signature.
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RoleGuard>
  )
}
