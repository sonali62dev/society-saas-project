'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { NoticeService } from '@/services/notice.service'
import { Megaphone, X, Pin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/stores/auth-store'

export function NoticeBanner() {
  const { user } = useAuthStore()
  const [closedIds, setClosedIds] = useState<number[]>([])

  const { data: notices = [] } = useQuery({
    queryKey: ['notices', user?.role],
    queryFn: NoticeService.getAll,
    // Refresh every 5 minutes
    refetchInterval: 1000 * 60 * 5,
    enabled: !!user && !['admin', 'super_admin', 'society_admin'].includes(user.role as string)
  })

  // Only show pinned notices that haven't been closed in this session
  const pinnedNotices = notices.filter((n: any) => n.isPinned && !closedIds.includes(n.id))

  const trackViewMutation = useMutation({
    mutationFn: (id: number) => NoticeService.trackView(id)
  })

  // Track views when banner is shown
  useEffect(() => {
    const isAdmin = ['admin', 'super_admin', 'society_admin'].includes(user?.role as string)
    if (!isAdmin && pinnedNotices.length > 0) {
      pinnedNotices.forEach((notice: any) => {
        trackViewMutation.mutate(notice.id)
      })
    }
  }, [pinnedNotices.length, user?.role])

  if (!user || ['admin', 'super_admin', 'society_admin'].includes(user.role as string)) {
    return null
  }

  if (pinnedNotices.length === 0) return null

  return (
    <div className="space-y-3 w-full">
      <AnimatePresence>
        {pinnedNotices.map((notice: any) => (
          <motion.div
            key={notice.id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`relative p-4 rounded-xl border-2 flex items-start gap-4 shadow-sm transition-all hover:shadow-md ${
              notice.type === 'emergency' 
                ? 'bg-red-50 border-red-200 text-red-900' 
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <div className={`p-2 rounded-lg shrink-0 ${
                notice.type === 'emergency' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {notice.type === 'emergency' ? (
                  <Pin className="h-5 w-5 text-red-600 rotate-45" />
                ) : (
                  <Megaphone className="h-5 w-5 text-blue-600" />
                )}
              </div>
              
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={notice.type === 'emergency' ? 'bg-red-600' : 'bg-blue-600'}>
                    IMPORTANT
                  </Badge>
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                    {notice.type}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-1 truncate">
                  {notice.title}
                </h3>
                <p className="text-xs sm:text-sm line-clamp-2 opacity-90">
                  {notice.content}
                </p>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 hover:bg-black/5"
                onClick={() => setClosedIds(prev => [...prev, notice.id])}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
