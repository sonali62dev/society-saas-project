'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Phone,
  Search,
  ChevronLeft,
  Filter,
  Star,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { StaffService } from '@/services/staff.service'
import { Skeleton } from '@/components/ui/skeleton'

export default function ResidentDailyHelpPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')

  const { data: helpers = [], isLoading } = useQuery({
    queryKey: ['daily-help'],
    queryFn: () => StaffService.getAll(),
  })

  const filteredHelpers = helpers.filter((helper: any) => {
    const matchesSearch = helper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         helper.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || helper.role.toUpperCase() === selectedRole.toUpperCase()
    return matchesSearch && matchesRole
  })

  const roles = ['all', ...Array.from(new Set(helpers.map((h: any) => h.role)))]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Help</h1>
          <p className="text-muted-foreground">Available service providers in society</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or service (e.g. Maid, Plumber)..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {roles.map((role: any) => (
            <Button
              key={role}
              variant={selectedRole === role ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRole(role)}
              className="capitalize whitespace-nowrap"
            >
              {role}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : filteredHelpers.length === 0 ? (
        <Card className="text-center py-12 border-dashed">
          <CardContent>
            <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No helpers available</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
              There are currently no {selectedRole !== 'all' ? selectedRole : 'service providers'} checked-in at the gate.
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredHelpers.map((helper: any) => (
              <motion.div key={helper.id} variants={itemVariants} layout transition={{ duration: 0.2 }}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-sm">
                  <CardHeader className="pb-3 flex flex-row items-start gap-4 space-y-0">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                      <AvatarImage src={helper.photo} />
                      <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                        {helper.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className="bg-teal-50 text-teal-700 capitalize">
                          {helper.role}
                        </Badge>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs font-bold ml-1">{helper.rating > 0 ? helper.rating : 'New'}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{helper.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> In campus since {helper.checkInTime || 'Morning'}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Shift: {helper.shift || 'Regular'}</span>
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 shadow-none text-[10px] uppercase font-bold">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Available
                        </Badge>
                      </div>
                      
                      <div className="pt-4 border-t flex gap-2">
                        <Button className="flex-1 gap-2 bg-[#1e3a5f] hover:bg-[#2d4a6f]" asChild>
                          <a href={`tel:${helper.phone}`}>
                            <Phone className="h-4 w-4" />
                            Call Now
                          </a>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <User className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
