'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { RoleGuard } from '@/components/auth/role-guard'
import { TransactionService } from '@/services/transaction.service'
import {
  BookOpen,
  TrendingUp,
  Scale,
  FileText,
  Building,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  ChevronRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const links = [
  { title: 'Income & Expense', href: '/dashboard/accounting/income-expense', icon: TrendingUp, description: 'Track income and expenses' },
  { title: 'General Ledger', href: '/dashboard/accounting/ledger', icon: BookOpen, description: 'Chart of accounts and balances' },
  { title: 'Trial Balance', href: '/dashboard/accounting/trial-balance', icon: Scale, description: 'Debit and credit summary' },
  { title: 'Journal Entries', href: '/dashboard/accounting/journal', icon: FileText, description: 'Record journal transactions' },
  { title: 'Bank Management', href: '/dashboard/accounting/bank', icon: Building, description: 'Bank accounts and transactions' },
  { title: 'Vendor Payments', href: '/dashboard/accounting/vendor-payments', icon: Receipt, description: 'Vendor invoices and payments' },
]

export default function AccountingOverviewPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['transaction-stats'],
    queryFn: TransactionService.getStats,
  })

  const thisMonthIncome = stats?.thisMonthIncome ?? 0
  const thisMonthExpenses = stats?.thisMonthExpenses ?? 0
  const netBalance = thisMonthIncome - thisMonthExpenses

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Accounting</h1>
          <p className="text-gray-600 mt-1">Overview and quick access to accounting modules</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">This Month Income</p>
                  <h3 className="text-2xl font-bold text-green-800 mt-1">
                    {isLoading ? <Skeleton className="h-8 w-24 bg-green-200" /> : `₹${thisMonthIncome.toLocaleString()}`}
                  </h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ArrowUpRight className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.05 }}>
            <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">This Month Expenses</p>
                  <h3 className="text-2xl font-bold text-red-800 mt-1">
                    {isLoading ? <Skeleton className="h-8 w-24 bg-red-200" /> : `₹${thisMonthExpenses.toLocaleString()}`}
                  </h3>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ArrowDownRight className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
            <Card className={`p-6 ${netBalance >= 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Net Balance</p>
                  <h3 className={`text-2xl font-bold mt-1 ${netBalance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                    {isLoading ? <Skeleton className="h-8 w-24" /> : `₹${Math.abs(netBalance).toLocaleString()}`}
                  </h3>
                  <p className={`text-xs mt-1 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {netBalance >= 0 ? 'Surplus' : 'Deficit'}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                  <IndianRupee className={`h-6 w-6 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.05 * (i + 3) }}
              >
                <Link href={item.href}>
                  <Card className="p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group h-full">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-indigo-700">{item.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 shrink-0 mt-1" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
