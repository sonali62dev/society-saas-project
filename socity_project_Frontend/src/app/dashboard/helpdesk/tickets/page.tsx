'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ticket,
  Plus,
  Search,
  Filter,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  Lock,
  Eye,
  ShieldAlert,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/lib/stores/auth-store'
import { CreateTicketDialog } from '@/components/tickets/create-ticket-dialog'
import { RoleGuard } from '@/components/auth/role-guard'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'

const categories = ['All', 'Technical', 'Maintenance', 'Other']

export default function HelpdeskTicketsPage() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: tickets, isLoading, error } = useQuery({
    queryKey: ['tickets'],
    queryFn: residentService.getTickets,
    refetchInterval: 5000, // Live auto-sync every 5s
  })

  const createTicketMutation = useMutation({
    mutationFn: residentService.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['super-admin-complaints'] })
      setIsDialogOpen(false)
      toast.success('Ticket created successfully')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to create ticket')
  })

  const filteredTickets = useMemo(() => {
    const data = tickets || []
    return data.filter((ticket: any) => {
      // 1. Basic search filter
      const matchesSearch =
        (ticket.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(ticket.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.reportedBy?.name || '').toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      // 2. Category filter
      if (selectedCategory !== 'all' && ticket.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false
      }

      // 3. Tab filter (Status)
      if (activeTab !== 'all') {
        const normalizedStatus = ticket.status?.toLowerCase().replace('_', '-')
        if (normalizedStatus !== activeTab.toLowerCase()) {
          return false
        }
      }

      return true
    })
  }, [tickets, searchQuery, activeTab, selectedCategory])

  const stats = useMemo(() => {
    const data = (tickets || []).filter((ticket: any) => {
      // 1. Basic search filter
      const matchesSearch =
        (ticket.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(ticket.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ticket.reportedBy?.name || '').toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      // 2. Category filter
      if (selectedCategory !== 'all' && ticket.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false
      }
      return true
    })

    const total = data.length
    const getCount = (status: string) => data.filter((t: any) => t.status?.toLowerCase().replace('_', '-') === status.toLowerCase()).length

    return [
      { label: 'Open', value: getCount('open'), color: 'bg-blue-500', percentage: total ? Math.round((getCount('open') / total) * 100) : 0 },
      { label: 'In Progress', value: getCount('in-progress'), color: 'bg-yellow-500', percentage: total ? Math.round((getCount('in-progress') / total) * 100) : 0 },
      { label: 'Resolved', value: getCount('resolved'), color: 'bg-green-500', percentage: total ? Math.round((getCount('resolved') / total) * 100) : 0 },
      { label: 'Closed', value: getCount('closed'), color: 'bg-gray-500', percentage: total ? Math.round((getCount('closed') / total) * 100) : 0 },
    ]
  }, [tickets, searchQuery, selectedCategory])

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-600'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) return <div className="p-8"><Skeleton className="w-full h-[600px] rounded-3xl" /></div>
  if (error) return <div className="p-8 text-red-500">Error loading tickets</div>

  return (
    <RoleGuard allowedRoles={['resident', 'committee', 'admin', 'super_admin', 'individual', 'INDIVIDUAL', 'vendor', 'VENDOR', 'guard', 'GUARD']}>
      <div className="min-h-screen bg-transparent p-0">
        <CreateTicketDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={(data) => createTicketMutation.mutate(data)}
        />
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm ring-1 ring-black/5">
              <Ticket className="h-8 w-8 text-[#1e3a5f]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Help & Support</h1>
              <p className="text-sm font-medium text-gray-400">Manage society issues and private consultations</p>
            </div>
          </div>
          {['resident', 'committee', 'admin'].includes(user?.role?.toLowerCase() || '') && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white gap-2 h-12 px-8 rounded-2xl shadow-lg shadow-blue-100 font-bold"
              disabled={createTicketMutation.isPending}
            >
              <Plus className="h-5 w-5" />
              {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 border-0 shadow-xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-slate-800/30 overflow-hidden relative group">
                <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-150", stat.color)} />
                <div className="flex items-center justify-between relative z-10 mb-3">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <div className={cn("h-2.5 w-2.5 rounded-full", stat.color)} />
                </div>
                <div className="flex items-baseline gap-2 relative z-10">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                  <span className="text-[10px] font-bold text-slate-400">Tickets</span>
                </div>
                <Progress value={stat.percentage} className="h-1 mt-4" />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Advanced Filters */}
        <Card className="p-6 mb-8 border-0 shadow-xl bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-white/20 dark:border-slate-800/30 rounded-[2rem]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Filter by ID, Member Name or Subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 border-0 bg-white/50 dark:bg-slate-800/50 shadow-inner focus:bg-white dark:focus:bg-slate-800 rounded-2xl font-medium"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 h-14 rounded-2xl border-0 bg-white/50 dark:bg-slate-800/50 shadow-inner font-bold text-slate-600 dark:text-slate-300">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-white/20 dark:border-slate-800/50 shadow-2xl backdrop-blur-xl bg-white/90 dark:bg-slate-900/90">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="h-14 w-14 p-0 rounded-2xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800">
                <Filter className="h-5 w-5 text-slate-500" />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl h-auto flex-wrap md:flex-nowrap">
              <TabsTrigger value="all" className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">ALL TICKETS</TabsTrigger>
              <TabsTrigger value="open" className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">OPEN</TabsTrigger>
              <TabsTrigger value="in-progress" className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">IN PROGRESS</TabsTrigger>
              <TabsTrigger value="resolved" className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">RESOLVED</TabsTrigger>
              <TabsTrigger value="closed" className="rounded-xl px-4 py-2 text-xs font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm">CLOSED</TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        {/* Ticket Feed */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredTickets.map((ticket: any, index: number) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/dashboard/helpdesk/tickets/${ticket.id}`}>
                  <Card className="group p-5 hover:shadow-xl hover:-translate-y-1 transition-all border-0 shadow-sm bg-white rounded-3xl ring-1 ring-black/5 relative overflow-hidden">
                    <div className={cn("absolute left-0 top-0 bottom-0 w-2", getPriorityColor(ticket.priority))} />

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center flex-wrap gap-3">
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-black tracking-widest leading-none">#{ticket.id}</span>
                          <Badge className={cn("rounded-full px-3 py-1 text-[10px] font-black border-0 uppercase tracking-tighter", getStatusColor(ticket.status))}>
                            {ticket.status?.replace('-', ' ')}
                          </Badge>
                          {ticket.isPrivate ? (
                            <Badge className="bg-purple-100 text-purple-700 border-0 rounded-full px-3 py-1 text-[10px] font-black flex items-center gap-1 tracking-tighter">
                              <Lock className="h-3 w-3" /> PRIVATE
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-full px-3 py-1 text-[10px] font-black flex items-center gap-1 tracking-tighter">
                              <Eye className="h-3 w-3" /> PUBLIC
                            </Badge>
                          )}
                          {ticket.escalatedToTech && (
                            <Badge className="bg-rose-100 text-rose-700 border-0 rounded-full px-3 py-1 text-[10px] font-black flex items-center gap-1 tracking-tighter">
                              <ShieldAlert className="h-3 w-3" /> ESCALATED
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#1e3a5f] transition-colors">{ticket.title}</h3>
                          <p className="text-sm font-medium text-gray-400 line-clamp-2">{ticket.description}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 pt-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                              {ticket.reportedBy?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Reporter</p>
                              <p className="text-xs font-bold text-gray-700 leading-none">{ticket.reportedBy?.name || 'User'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                              <Calendar className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Created</p>
                              <p className="text-xs font-bold text-gray-700 leading-none">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <MessageSquare className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-300 uppercase leading-none mb-1">Status</p>
                              <p className="text-xs font-bold text-gray-700 leading-none capitalize">{ticket.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-3 shrink-0">
                        <Button variant="ghost" className="h-12 w-12 p-0 rounded-2xl hover:bg-gray-100 text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                          <ArrowUpRight className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTickets.length === 0 && (
            <div className="py-24 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="h-10 w-10 text-gray-200" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No matching tickets</h3>
              <p className="text-gray-400 mt-2 max-w-xs mx-auto">We couldn't find any results for your current filter settings.</p>
              <Button
                variant="outline"
                onClick={() => { setSearchQuery(''); setActiveTab('all'); setSelectedCategory('all'); }}
                className="mt-8 rounded-2xl font-bold border-2 hover:bg-gray-50 px-8 h-12"
              >
                Reset all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  )
}
