'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { JournalService } from '@/services/journal.service'
import { LedgerService } from '@/services/ledger.service'
import { toast } from 'sonner'
import {
  FileText,
  Plus,
  Search,
  Download,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle
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
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

export default function JournalEntriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false)
  
  // New Entry Form State
  const [newEntryDate, setNewEntryDate] = useState(new Date().toISOString().split('T')[0])
  const [newEntryNarration, setNewEntryNarration] = useState('')
  const [newEntryLines, setNewEntryLines] = useState([
    { accountId: '', debit: 0, credit: 0 },
    { accountId: '', debit: 0, credit: 0 }
  ])

  const queryClient = useQueryClient()

  // Fetch Journal Entries
  const { data: journalEntries = [], isLoading } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: JournalService.getAll
  })

  // Fetch Ledger Account groups to flatten for dropdown
  const { data: accountGroups = [] } = useQuery({
    queryKey: ['ledger-stats'], 
    queryFn: LedgerService.getStats
  })

  // Flatten accounts for Dropdown
  const availableAccounts = (accountGroups || []).flatMap((group: any) => group.accounts || [])

  const createMutation = useMutation({
    mutationFn: JournalService.create,
    onSuccess: () => {
      toast.success('Journal Entry Created')
      setIsNewEntryOpen(false)
      queryClient.invalidateQueries({ queryKey:['journal-entries'] })
      queryClient.invalidateQueries({ queryKey:['ledger-stats'] }) // Updates balances
      // Reset form
      setNewEntryNarration('')
      setNewEntryLines([{ accountId: '', debit: 0, credit: 0 },{ accountId: '', debit: 0, credit: 0 }])
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Failed to create entry')
  })

  const handleAddLine = () => {
    setNewEntryLines([...newEntryLines, { accountId: '', debit: 0, credit: 0 }])
  }

  const handleRemoveLine = (index: number) => {
    if (newEntryLines.length > 2) {
      setNewEntryLines(newEntryLines.filter((_, i) => i !== index))
    }
  }

  const handleLineChange = (index: number, field: string, value: any) => {
    const updated = [...newEntryLines]
    updated[index] = { ...updated[index], [field]: value }
    setNewEntryLines(updated)
  }

  const handleCreate = () => {
    if (!isBalanced) {
      toast.error('Debit and Credit must be equal')
      return
    }
    if (totalDebit <= 0) {
      toast.error('Enter at least one line with amount')
      return
    }
    const hasValidLines = newEntryLines.some(
      (l) => l.accountId && ((parseFloat(String(l.debit)) || 0) > 0 || (parseFloat(String(l.credit)) || 0) > 0)
    )
    if (!hasValidLines) {
      toast.error('Select account and enter debit or credit for at least one line')
      return
    }
    createMutation.mutate({
      date: newEntryDate,
      narration: newEntryNarration,
      lines: newEntryLines
    })
  }

  const totalDebit = newEntryLines.reduce((sum, line) => sum + (parseFloat(line.debit as any) || 0), 0)
  const totalCredit = newEntryLines.reduce((sum, line) => sum + (parseFloat(line.credit as any) || 0), 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'POSTED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Posted</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case 'DRAFT':
        return <Badge variant="secondary"><Edit className="h-3 w-3 mr-1" /> Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-8 w-8 text-orange-600" />
            Journal Entries
          </h1>
          <p className="text-gray-600 mt-1">Record and manage accounting transactions</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>New Journal Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={newEntryDate} onChange={(e) => setNewEntryDate(e.target.value)} />
                  </div>
                  <div>
                    <Label>Narration</Label>
                    <Input placeholder="Enter narration" value={newEntryNarration} onChange={(e) => setNewEntryNarration(e.target.value)} />
                  </div>
                </div>

                <div className="border rounded-lg p-2 max-h-[400px] overflow-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Account</TableHead>
                                <TableHead>Debit</TableHead>
                                <TableHead>Credit</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {newEntryLines.map((line, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <Select value={line.accountId} onValueChange={(val) => handleLineChange(idx, 'accountId', val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableAccounts.map((acc: any) => (
                                                    <SelectItem key={acc.id} value={String(acc.id)}>{acc.code} - {acc.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" min="0" value={line.debit} onChange={(e) => handleLineChange(idx, 'debit', e.target.value)} disabled={line.credit > 0} />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" min="0" value={line.credit} onChange={(e) => handleLineChange(idx, 'credit', e.target.value)} disabled={line.debit > 0} />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveLine(idx)} disabled={newEntryLines.length <= 2}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <Button variant="outline" size="sm" onClick={handleAddLine} className="w-full border-dashed"><Plus className="h-4 w-4 mr-2" /> Add Line</Button>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded text-sm font-semibold">
                    <div className={isBalanced ? "text-green-600 flex items-center gap-2" : "text-red-600 flex items-center gap-2"}>
                        {isBalanced ? <CheckCircle className="h-5 w-5"/> : <AlertTriangle className="h-5 w-5"/>}
                        {isBalanced ? "Balanced" : "Unbalanced"}
                    </div>
                    <div className="flex gap-8">
                        <div>Total Debit: {formatCurrency(totalDebit)}</div>
                        <div>Total Credit: {formatCurrency(totalCredit)}</div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsNewEntryOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={!isBalanced || !newEntryNarration || createMutation.isPending}>
                       {createMutation.isPending ? 'Creating...' : 'Create Entry'}
                    </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Voucher No.</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Narration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(journalEntries || []).map((entry: any) => (
              <TableRow key={entry.id} className="hover:bg-gray-50">
                <TableCell className="font-mono font-medium">{entry.voucherNo}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {new Date(entry.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-xs truncate">{entry.narration}</p>
                </TableCell>
                <TableCell>{getStatusBadge(entry.status)}</TableCell>
                <TableCell className="text-right">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>{entry.voucherNo}</DialogTitle></DialogHeader>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Account</TableHead>
                                        <TableHead className="text-right">Debit</TableHead>
                                        <TableHead className="text-right">Credit</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(entry.lines || []).map((line: any, i: number) => (
                                        <TableRow key={i}>
                                            <TableCell>{line.account?.name || '-'}</TableCell>
                                            <TableCell className="text-right">{line.debit > 0 ? formatCurrency(line.debit) : '-'}</TableCell>
                                            <TableCell className="text-right">{line.credit > 0 ? formatCurrency(line.credit) : '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </DialogContent>
                    </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
