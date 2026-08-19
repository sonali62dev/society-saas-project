'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Hourglass, ArrowRight, Sparkles, X, ChevronRight, Check, Zap, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useRouter } from 'next/navigation'
import { RazorpayModal } from '@/components/society/RazorpayModal'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface TrialExpiryNoticeProps {
  daysLeft?: number
  planName?: string
}

const upgradePlans = [
  {
    name: 'Starter',
    tag: 'ESSENTIAL',
    price: '₹1',
    numericPrice: 1,
    period: 'per month',
    description: 'Essential society management features.',
    features: ['Essential features for small societies', 'Duration: Monthly', 'Up to 100 Units', 'Standard Gate Security'],
    isPopular: false,
  },
  {
    name: 'Standard',
    tag: 'MOST POPULAR',
    price: '₹1,299',
    numericPrice: 1299,
    period: 'per month',
    description: 'Complete features for growing societies.',
    features: ['Complete features for growing societies', 'Duration: Monthly', 'Unlimited Resident & Security Pass', 'Automated Billing & Accounts'],
    isPopular: true,
  },
  {
    name: 'Pro',
    tag: 'AI POWERED',
    price: '₹1,499',
    numericPrice: 1499,
    period: 'per month',
    description: 'Advanced features and priority support.',
    features: ['🤖 Kiaan AI Assistant & AI Features', 'Advanced features and priority support', 'Duration: Monthly', 'Dedicated Account Support'],
    isPopular: false,
  },
]

export function TrialExpiryNotice({ daysLeft = 2, planName = '7-Day Free Trial' }: TrialExpiryNoticeProps) {
  const { user } = useAuthStore()
  const router = useRouter()

  // 0. Only show to Society Admin (customers on trial/paid pack), NEVER Super Admin, Residents, Guards, etc.
  const userRole = (user?.role || '').toLowerCase()
  const isSocietyAdmin = userRole === 'admin' || userRole === 'society_admin'

  // 1. Check if user is already on a paid plan
  const planUpper = (user?.society?.subscriptionPlan || '').toUpperCase()
  const isPaidPlan = planUpper.includes('STARTER') || planUpper.includes('STANDARD') || planUpper.includes('PRO') || planUpper.includes('ENTERPRISE') || planUpper.includes('PROFESSIONAL')

  // 2. Calculate actual remaining days (7-day trial limit vs 30-day billing pack limit)
  const createdTime = user?.society?.createdAt ? new Date(user.society.createdAt).getTime() : null
  const daysElapsed = createdTime ? Math.floor((Date.now() - createdTime) / (1000 * 60 * 60 * 24)) : 5
  const totalPlanDays = isPaidPlan ? 30 : 7
  const actualDaysLeft = Math.max(0, totalPlanDays - (daysElapsed % totalPlanDays))

  // 3. Strict 2-Day Expiry Condition: Only true when user is Society Admin AND <= 2 days remaining
  const isTrialExpiringSoon = isSocietyAdmin && actualDaysLeft <= 2

  const [mounted, setMounted] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showTopBanner, setShowTopBanner] = useState(true)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(upgradePlans[1]) // Standard by default
  const [showRazorpay, setShowRazorpay] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDismissed = typeof window !== 'undefined' ? sessionStorage.getItem('trial_expiry_modal_dismissed') : null
    if (!isDismissed && isTrialExpiringSoon) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }, [isTrialExpiringSoon])

  if (!mounted) return null

  const handleRemindLater = () => {
    setShowModal(false)
    sessionStorage.setItem('trial_expiry_modal_dismissed', 'true')
  }

  const handleUpgradeNow = () => {
    setShowModal(false)
    setShowPlanModal(true)
  }

  const handlePaymentSuccess = async () => {
    setIsProcessing(true)
    try {
      await api.post('/payment/verify-checkout', {
        adminEmail: user?.email || 'admin@society.com',
        societyName: user?.society?.name || 'Nexus Society OS',
        planName: selectedPlan.name,
        paymentId: `pay_${Date.now()}`,
      })
      toast.success(`Subscription upgraded to ${selectedPlan.name} Plan successfully!`)
    } catch (e: any) {
      console.error('Upgrade error:', e)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      {/* 1. TOP NOTICE BANNER */}
      <AnimatePresence>
        {showTopBanner && isTrialExpiringSoon && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs sm:text-sm font-medium py-2.5 px-4 flex items-center justify-between shadow-sm border-b border-amber-600/30 shrink-0 z-40"
          >
            <div className="flex items-center gap-2 max-w-4xl mx-auto text-center sm:text-left justify-center flex-1">
              <span className="bg-amber-700/60 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                Notice
              </span>
              <span>
                {isPaidPlan ? (
                  <>
                    Only <strong className="font-extrabold underline">{actualDaysLeft} Days Left</strong> in your <strong>{user?.society?.subscriptionPlan || 'Subscription'} Pack</strong>! Renew now to keep all services active.
                  </>
                ) : (
                  <>
                    Only <strong className="font-extrabold underline">{actualDaysLeft} Days Left</strong> for Free Trial! Upgrade your plan to unlock higher property & unit limits.
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={handleUpgradeNow}
                className="bg-white hover:bg-amber-50 text-amber-950 font-extrabold text-xs h-7 px-3 rounded-full shadow cursor-pointer flex items-center gap-1 transition-all hover:scale-105"
              >
                <span>{isPaidPlan ? 'Renew / Upgrade' : 'Upgrade Plan'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>

              <button
                onClick={() => setShowTopBanner(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer p-0.5"
                title="Dismiss Banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FREE TRIAL / SUBSCRIPTION EXPIRING SOON POPUP MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#0d1522] rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative border border-slate-800 space-y-6 text-white"
            >
              {/* Hourglass Badge Icon */}
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-inner text-amber-400">
                <span className="text-3xl animate-bounce">⏳</span>
              </div>

              {/* Header Title */}
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {isPaidPlan ? 'Subscription Pack Expiring Soon!' : 'Free Trial Expiring Soon!'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed px-2">
                  {isPaidPlan ? (
                    <>
                      Notice: You have only{' '}
                      <strong className="font-extrabold text-amber-400">{actualDaysLeft} days left</strong> in your{' '}
                      <span className="font-semibold text-slate-200">{user?.society?.subscriptionPlan || 'Subscription'} Pack</span>. Renew your plan now for uninterrupted access.
                    </>
                  ) : (
                    <>
                      Notice: You have only{' '}
                      <strong className="font-extrabold text-amber-400">{actualDaysLeft} days left</strong> in your{' '}
                      <span className="font-semibold text-slate-200">{planName}</span>. Upgrade your plan now to avoid property & unit creation limits.
                    </>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleUpgradeNow}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold h-12 rounded-xl text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all uppercase"
                >
                  <span>{isPaidPlan ? 'RENEW / UPGRADE PLAN NOW' : 'UPGRADE PLAN NOW'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <div>
                  <button
                    onClick={handleRemindLater}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer py-1"
                  >
                    Remind Me Later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. INTERACTIVE PLAN SELECTION UPGRADE MODAL */}
      <AnimatePresence>
        {showPlanModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0d1522] border border-slate-800 text-white rounded-3xl shadow-2xl overflow-hidden my-auto p-6 space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowPlanModal(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Title */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase">
                  <Zap className="w-3.5 h-3.5" />
                  <span>UPGRADE YOUR SUBSCRIPTION</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Choose Your Upgrade Plan</h2>
                <p className="text-xs text-slate-400">Unlock unlimited resident passes, accounting, and AI features.</p>
              </div>

              {/* Plan Cards Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                {upgradePlans.map((plan, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedPlan(plan)}
                    className={`rounded-2xl p-5 border flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${selectedPlan.name === plan.name
                      ? 'bg-gradient-to-b from-[#10241b] to-[#0d1a14] border-2 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                      : 'bg-[#101520] border-slate-800 hover:border-emerald-500/40'
                      }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-black uppercase">
                        MOST POPULAR
                      </span>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{plan.tag}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPlan.name === plan.name ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-slate-700'}`}>
                          {selectedPlan.name === plan.name && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                        <div className="text-2xl font-black text-emerald-400 mt-1">{plan.price} <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
                        <p className="text-[11px] text-slate-400 mt-1">{plan.description}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        {plan.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPlan(plan)
                        setShowPlanModal(false)
                        setShowRazorpay(true)
                      }}
                      className={`w-full h-10 mt-6 font-extrabold text-xs rounded-xl cursor-pointer ${selectedPlan.name === plan.name
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                    >
                      Proceed to Upgrade ({plan.price})
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. RAZORPAY PAYMENT MODAL FOR PLAN UPGRADE */}
      {showRazorpay && selectedPlan && (
        <RazorpayModal
          isOpen={showRazorpay}
          onClose={() => setShowRazorpay(false)}
          onSuccess={handlePaymentSuccess}
          planPrice={selectedPlan.price}
          numericPrice={selectedPlan.numericPrice}
          adminPhone={user?.phone || '74154 54810'}
          adminEmail={user?.email || 'admin@society.com'}
          societyName={user?.society?.name || 'Nexus Society OS'}
          isProcessing={isProcessing}
        />
      )}
    </>
  )
}
