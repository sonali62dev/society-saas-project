'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Phone, MapPin, Headphones, MessageCircle, Globe } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/lib/stores/auth-store'
import api from '@/lib/api'

export default function SupportPage() {
    const { user } = useAuthStore()

    const { data: societyDetails } = useQuery({
        queryKey: ['my-society-details', user?.societyId],
        queryFn: async () => {
            const res = await api.get('/society/my-society/details')
            return res.data
        },
    })

    const adminEmail = societyDetails?.email || (user?.role?.toUpperCase() === 'ADMIN' ? user?.email : 'lalit.admin@society.com')
    const adminPhone = societyDetails?.phone || (user?.role?.toUpperCase() === 'ADMIN' ? (user?.phone || '+91 98765 43210') : '+91 98765 43210')
    const societyAddress = societyDetails?.address || 'Trinity CHS Office: Near Central Park, Noida, UP, 201301'

    const contactItems = [
        {
            icon: Mail,
            label: 'Society Admin Email',
            value: adminEmail,
            href: `mailto:${adminEmail}`,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            icon: Phone,
            label: 'Society Admin Contact Number',
            value: adminPhone,
            href: `tel:${adminPhone}`,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            iconColor: 'text-green-600 dark:text-green-400',
        },
        {
            icon: MapPin,
            label: 'Society Office Address',
            value: societyAddress,
            href: null,
            color: 'from-orange-500 to-red-500',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            iconColor: 'text-orange-600 dark:text-orange-400',
        },
    ]

    return (
        <div className="min-h-[80vh] space-y-6">
            {/* Back Button */}
            <Link href="/dashboard/admin/complaints">
                <Button variant="ghost" className="gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Complaints
                </Button>
            </Link>

            {/* Header Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="overflow-hidden border-0 shadow-2xl rounded-[2rem]">
                    <div className="relative bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 p-8 md:p-12">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20" />
                        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white/10 rounded-full -mb-16" />
                        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/5 rounded-full" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                            {/* Icon illustration */}
                            <div className="flex-shrink-0">
                                <div className="w-28 h-28 md:w-36 md:h-36 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-xl">
                                    <Headphones className="w-14 h-14 md:w-20 md:h-20 text-white" />
                                </div>
                            </div>

                            {/* Text content */}
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Support</h1>
                                <p className="text-white/90 text-lg md:text-xl max-w-md">
                                    For any service related queries or general help, please contact us at:
                                </p>
                            </div>

                            {/* Decorative icons */}
                            <div className="hidden md:flex flex-col gap-3 ml-auto">
                                <div className="w-12 h-12 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center">
                                    <MessageCircle className="w-6 h-6 text-white/80" />
                                </div>
                                <div className="w-12 h-12 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center ml-6">
                                    <Globe className="w-6 h-6 text-white/80" />
                                </div>
                                <div className="w-12 h-12 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-white/80" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Contact Cards */}
            <div className="space-y-4">
                {contactItems.map((item, index) => {
                    const Icon = item.icon
                    const content = (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.15 }}
                        >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl overflow-hidden group cursor-pointer">
                                <div className="flex items-start gap-5 p-6">
                                    {/* Icon */}
                                    <div className={`flex-shrink-0 w-14 h-14 ${item.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-7 h-7 ${item.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                            {item.label}
                                        </p>
                                        <p className={`text-base font-semibold text-slate-800 dark:text-slate-200 ${item.href ? 'text-teal-600 dark:text-teal-400' : ''}`}>
                                            {item.value}
                                        </p>
                                    </div>

                                    {/* Chevron / expand indicator */}
                                    <div className="flex-shrink-0 self-center">
                                        <svg className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )

                    if (item.href) {
                        return (
                            <a key={item.label} href={item.href} className="block no-underline">
                                {content}
                            </a>
                        )
                    }
                    return <div key={item.label}>{content}</div>
                })}
            </div>
        </div>
    )
}
