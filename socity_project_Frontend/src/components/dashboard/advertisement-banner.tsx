'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Megaphone, X, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/auth-store'

export function AdvertisementBanner() {
  const { user } = useAuthStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const { data: ads = [] } = useQuery<any[]>({
    queryKey: ['active-advertisements'],
    queryFn: async () => {
      const response = await api.get('/advertisements/active')
      return response.data
    },
    // Filter by audience in frontend for extra safety
    select: (data) => {
      if (!user?.role) return data
      const roleMap: Record<string, string> = {
        'super_admin': 'ALL',
        'admin': 'ADMINS',
        'resident': 'RESIDENTS',
        'individual': 'INDIVIDUALS',
        'vendor': 'VENDORS'
      }
      const target = roleMap[user.role] || 'ALL'
      return data.filter((ad: any) => ad.targetAudience === 'ALL' || ad.targetAudience === target)
    }
  })

  useEffect(() => {
    if (ads.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [ads.length, isPaused])

  if (ads.length === 0) return null

  const currentAd = ads[currentIndex]

  // Filter only BANNER type for this specific component
  const bannerAds = ads.filter(ad => ad.type === 'BANNER')
  if (bannerAds.length === 0) return null
  
  // Use banner index
  const activeBanner = bannerAds[currentIndex % bannerAds.length]

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl mb-6 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBanner.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="relative h-48 sm:h-56 w-full flex items-center"
        >
          {/* Background Background */}
          <div className="absolute inset-0 z-0">
            {activeBanner.imageUrl ? (
              <>
                <img 
                  src={activeBanner.imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-900 via-indigo-800 to-indigo-600" />
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 sm:px-12 w-full sm:w-2/3">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 mb-3 backdrop-blur-md">
              <Megaphone className="h-3 w-3 mr-1" />
              Announcement
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
              {activeBanner.title}
            </h2>
            <p className="text-white/80 text-sm sm:text-base line-clamp-2 mb-4">
              {activeBanner.content}
            </p>
            {activeBanner.linkUrl && (
              <Button 
                size="sm" 
                className="bg-white text-indigo-900 hover:bg-gray-100 font-semibold"
                asChild
              >
                <a href={activeBanner.linkUrl} target="_blank" rel="noopener noreferrer">
                  Learn More
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      {bannerAds.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {bannerAds.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === (currentIndex % bannerAds.length) ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Side Arrows */}
      {bannerAds.length > 1 && (
        <>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev - 1 + bannerAds.length) % bannerAds.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/20 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setCurrentIndex((prev) => (prev + 1) % bannerAds.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/20 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </div>
  )
}

function Badge({ children, className, ...props }: any) {
  return (
    <span 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
