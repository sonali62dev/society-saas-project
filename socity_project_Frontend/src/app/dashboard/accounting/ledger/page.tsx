'use client'

import { useState, Fragment } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { LedgerService } from '@/services/ledger.service'
import { toast } from 'sonner'
import {
  BookOpen,
  Search,
  Filter,
  Download,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Plus,
  Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

export default function GeneralLedgerPage() {
  const queryClient = useQueryClient()
  const [expandedGroups, setExpandedGroups] = useState<number[]>([1, 2, 3, 4])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newAccount, setNewAccount] = useState({
    name: '',
    code: '',
    type: 'ASSET'
  })
  // Missing Filters State
  const [accountTypeFilter, setAccountTypeFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('current')

  const { data: accountGroups = [], isLoading } = useQuery({
    queryKey: ['ledger-stats'],
    queryFn: LedgerService.getStats
  })

  // ... (useMutation logic same as before)
  const createMutation = useMutation({
    mutationFn: LedgerService.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ledger-stats'] })
      setIsAddOpen(false)
      setNewAccount({ name: '', code: '', type: 'ASSET' })
      toast.success('Account created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create account')
    }
  })

  // Export Logic
  const handleExport = () => {
    // Flaten groups to accounts
    const allAccounts = filteredGroups.flatMap((g: any) => g.accounts.map((a: any) => ({
      ...a,
      group: g.name
    })))

    if (!allAccounts.length) return toast.error("No data to export")

    const headers = ['Group', 'Code', 'Account Name', 'Type', 'Balance']
    const csvContent = [
      headers.join(','),
      ...allAccounts.map((a: any) => [
        a.group,
        a.code,
        `"${a.name}"`,
        a.type,
        a.balance
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'general_ledger_export.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleGroup = (groupId: number) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleCreate = () => {
    if (!newAccount.name || !newAccount.code) return toast.error("Please fill all fields")
    createMutation.mutate(newAccount)
  }

  // Filter Logic Updated
  const filteredGroups = (accountGroups || []).map((group: any) => {
    // Filter by Account Type Logic (Asset/Liability etc)
    // Since backend returns predefined groups (1=Asset, 2=Liability, etc), we filter groups entirely or filtered accounts inside

    // Correct mapping:
    // If accountTypeFilter is 'asset', only show Group 1 (Assets).
    const typeMap: Record<string, string> = {
      'asset': 'Asset',
      'liability': 'Liability',
      'income': 'Income',
      'expense': 'Expense'
    }

    if (accountTypeFilter !== 'all' && typeMap[accountTypeFilter] !== group.type) {
      return { ...group, accounts: [] }
    }

    return {
      ...group,
      accounts: (group.accounts || []).filter((acc: any) =>
        ((acc.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (acc.code || '').includes(searchQuery))
      )
    }
  }).filter((group: any) => group.accounts && group.accounts.length > 0)


  if (isLoading) {
    // ... (skeleton)
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          {/* ... Title ... */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            General Ledger
          </h1>
          <p className="text-gray-600 mt-1">Chart of Accounts and Balances</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            {/* ... Dialog implementation ... */}
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Ledger Account</DialogTitle>
                <DialogDescription>Add a new account head to your chart of accounts</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Account Name</Label>
                  <Input
                    placeholder="e.g. Festival Fund"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Code</Label>
                  <Input
                    placeholder="e.g. 5001"
                    value={newAccount.code}
                    onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Must be unique within this society (e.g. 1001, 1002 are already used by system accounts).</p>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={newAccount.type} onValueChange={(v) => setNewAccount({ ...newAccount, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASSET">Asset</SelectItem>
                      <SelectItem value="LIABILITY">Liability</SelectItem>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreate} disabled={createMutation.isPending}>
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* ... Summary Cards Mapping ... */}
        {(accountGroups || []).map((group: any, index: number) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{group.name}</p>
                {group.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <p className="text-xl font-bold">{formatCurrency(group.balance)}</p>
              <p className="text-xs text-gray-500 mt-1">{(group.accounts || []).length} accounts</p>
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
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Account Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="asset">Assets</SelectItem>
              <SelectItem value="liability">Liabilities</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
            </SelectContent>
          </Select>
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current FY</SelectItem>
              <SelectItem value="previous">Previous FY</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Ledger Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12"></TableHead>
              <TableHead>Account Code</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Debit (₹)</TableHead>
              <TableHead className="text-right">Credit (₹)</TableHead>
              <TableHead className="text-right">Balance (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-6 text-gray-500">No accounts match your filters</TableCell></TableRow>
            ) : filteredGroups.map((group: any) => (
              <Fragment key={group.id}>
                {/* ... Rows ... */}
                <TableRow
                  key={group.id}
                  className="bg-blue-50 cursor-pointer hover:bg-blue-100"
                  onClick={() => toggleGroup(group.id)}
                >
                  <TableCell>
                    {expandedGroups.includes(group.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell className="font-bold">{group.id}000</TableCell>
                  <TableCell className="font-bold">{group.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{group.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {group.type === 'Asset' || group.type === 'Expense' ? formatCurrency(group.balance) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {group.type === 'Liability' || group.type === 'Income' ? formatCurrency(group.balance) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(group.balance)}</TableCell>
                </TableRow>
                {expandedGroups.includes(group.id) && group.accounts.map((account: any) => (
                  <TableRow key={account.id} className="hover:bg-gray-50">
                    <TableCell></TableCell>
                    <TableCell className="text-gray-600">{account.code}</TableCell>
                    <TableCell className="pl-8">{account.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{account.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {account.type === 'Debit' ? formatCurrency(account.balance) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {account.type === 'Credit' ? formatCurrency(account.balance) : '-'}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(account.balance)}</TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
