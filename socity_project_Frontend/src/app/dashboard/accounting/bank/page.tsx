'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Plus,
  Search,
  Download,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  CreditCard,
  TrendingUp,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  Loader2
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import bankService from '@/services/bankService'
import { toast } from 'react-hot-toast'

interface BankAccount {
  id: number;
  name: string;
  code: string;
  bankDetails: {
      accountNo: string;
      ifsc: string;
      branch: string;
  };
  balance: number;
  type: string;
}

interface Transaction {
    id: number;
    date: string;
    description: string;
    type: string;
    amount: number;
    status: string;
    paymentMethod: string;
    bankAccount?: {
        name: string;
    };
    invoiceNo?: string;
}

export default function BankManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBank, setSelectedBank] = useState('all')
  const [activeTab, setActiveTab] = useState('transactions')
  const [banks, setBanks] = useState<BankAccount[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Form State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newBank, setNewBank] = useState({
      name: '',
      accountNo: '',
      ifsc: '',
      branch: '',
      openingBalance: ''
  })

  useEffect(() => {
     loadData()
  }, [])

  useEffect(() => {
     loadTransactions()
  }, [selectedBank])

  const loadData = async () => {
    try {
        setLoading(true)
        const [bankData, txData] = await Promise.all([
            bankService.getBanks(),
            bankService.getTransactions(selectedBank)
        ])
        setBanks(bankData)
        setTransactions(txData)
    } catch (error) {
        console.error(error)
        toast.error('Failed to load bank data')
    } finally {
        setLoading(false)
    }
  }

  const loadTransactions = async () => {
      try {
          const data = await bankService.getTransactions(selectedBank)
          setTransactions(data)
      } catch (error) {
          console.error(error)
      }
  }

  const handleRefresh = async () => {
      setRefreshing(true)
      await loadData()
      setRefreshing(false)
      toast.success('Data refreshed')
  }

  const handleCreateBank = async () => {
      try {
          await bankService.createBank(newBank)
          toast.success('Bank Account added successfully')
          setIsAddOpen(false)
          setNewBank({ name: '', accountNo: '', ifsc: '', branch: '', openingBalance: '' })
          loadData()
      } catch (error: any) {
          console.error(error)
          toast.error(error.response?.data?.error || 'Failed to create bank account')
      }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalBalance = banks.reduce((sum, acc) => sum + acc.balance, 0)
  
  const handleViewBank = (bankId: string) => {
      setSelectedBank(bankId)
      setActiveTab('transactions')
      // Small timeout to allow state to filter specific bank before scrolling
      setTimeout(() => {
          const element = document.getElementById('transactions-section')
          if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
          }
      }, 100)
  }

  const handleDownloadStatement = () => {
      const headers = ['Date', 'Description', 'Bank', 'Type', 'Amount', 'Status']
      const csvContent = [
          headers.join(','),
          ...filteredTransactions.map(t => [
              t.date,
              `"${t.description}"`,
              t.bankAccount?.name || '',
              t.type,
              t.amount,
              t.status
          ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bank-statement-${selectedBank === 'all' ? 'all' : selectedBank}-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
  }
  
  const filteredTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.bankAccount?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
      return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-emerald-600" />
            Bank Management
          </h1>
          <p className="text-gray-600 mt-1">Manage bank accounts and transactions</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="gap-2" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Bank
                </Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Add New Bank Account</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                      <div className="space-y-2">
                          <Label>Bank Name</Label>
                          <Input placeholder="e.g. HDFC Bank" value={newBank.name} onChange={e => setNewBank({...newBank, name: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label>Account Number</Label>
                              <Input placeholder="XXXX XXXX 1234" value={newBank.accountNo} onChange={e => setNewBank({...newBank, accountNo: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                              <Label>IFSC Code</Label>
                              <Input placeholder="HDFC0001234" value={newBank.ifsc} onChange={e => setNewBank({...newBank, ifsc: e.target.value})} />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Branch</Label>
                            <Input placeholder="Main Branch" value={newBank.branch} onChange={e => setNewBank({...newBank, branch: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Opening Balance</Label>
                            <Input type="number" placeholder="0.00" value={newBank.openingBalance} onChange={e => setNewBank({...newBank, openingBalance: e.target.value})} />
                        </div>
                      </div>
                  </div>
                  <DialogFooter>
                      <Button onClick={handleCreateBank}>Create Account</Button>
                  </DialogFooter>
              </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-6 mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100">Total Bank Balance</p>
              <p className="text-3xl md:text-4xl font-bold mt-1">{formatCurrency(totalBalance)}</p>
              <p className="text-emerald-100 text-sm mt-2">Across {banks.length} accounts</p>
            </div>
            <div className="hidden md:block">
              <TrendingUp className="h-16 w-16 text-emerald-200 opacity-50" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bank Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {banks.map((account, index) => (

          <motion.div
            key={account.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <Badge variant="outline">{account.type}</Badge>
              </div>
              <h3 className="font-semibold text-gray-900">{account.name}</h3>
              <p className="text-sm text-gray-500">{account.bankDetails?.accountNo}</p>
              <p className="text-2xl font-bold text-emerald-600 mt-3">
                {formatCurrency(account.balance)}
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <p className="text-xs text-gray-500">
                  {account.bankDetails?.ifsc}
                </p>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleViewBank(account.id.toString())}>
                  <Eye className="h-3 w-3 mr-1" /> View
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Transactions Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4" id="transactions-section">
        <TabsList>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="reconciliation">Bank Reconciliation</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            {/* Filters */}
            <div className="p-4 border-b">
              <div className="flex flex-col md:flex-row gap-4">
                {/* ... Search ... */}
                
                {/* ... Select ... */}
                
                <Button variant="outline" className="gap-2" onClick={handleDownloadStatement} disabled={filteredTransactions.length === 0}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Transactions Table ... */}
            
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation">
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank Reconciliation</h3>
            <p className="text-gray-600 mb-4">Compare bank statements with your books to identify discrepancies</p>
            <div className="max-w-md mx-auto p-4 bg-gray-50 rounded-lg text-left">
                <div className="mb-4">
                    <Label>Select Bank</Label>
                    <Select onValueChange={(v) => setSelectedBank(v)} value={selectedBank}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Bank" />
                        </SelectTrigger>
                        <SelectContent>
                            {banks.map(b => <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                {selectedBank !== 'all' && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>System Balance:</span>
                            <span className="font-bold">{formatCurrency(banks.find(b => b.id.toString() === selectedBank)?.balance || 0)}</span>
                        </div>
                        <div className="space-y-1">
                            <Label>Statement Balance</Label>
                            <Input type="number" placeholder="Enter balance from bank statement" />
                        </div>
                        <Button className="w-full mt-2">Check Difference</Button>
                    </div>
                )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="statements">
          <Card className="p-8 text-center">
            <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Statement History</h3>
            <p className="text-gray-600 mb-4">View previously generated statements</p>
            <Button onClick={handleDownloadStatement}>Download Current Report</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
