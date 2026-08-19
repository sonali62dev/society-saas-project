'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ShieldCheck, Zap, ArrowLeft, ArrowRight, CreditCard, Sparkles, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/stores/auth-store'
import { RazorpayModal } from '@/components/society/RazorpayModal'
import api from '@/lib/api'
import { toast } from 'sonner'

const activationPlans = [
  {
    name: 'Starter',
    tag: 'ESSENTIAL',
    price: '₹1',
    numericPrice: 1,
    period: 'per month',
    description: 'Essential society management features.',
    features: ['Essential features for small societies', 'Duration: Monthly', 'Up to 100 Units', 'Gate Security Access'],
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

export function SocietyPaymentFlow() {
  const router = useRouter()
  const { user, updateUser, logout } = useAuthStore()
  const [selectedPlan, setSelectedPlan] = useState<any>(activationPlans[1]) // Standard by default
  const [showRazorpay, setShowRazorpay] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  if (!user || !user.society) return null

  const society = user.society

  const handleBack = () => {
    logout()
    router.push('/')
  }

  const handlePaymentSuccess = async () => {
    setIsProcessing(true)
    try {
      // 1. Update backend society status to paid
      await api.post(`/society/${society.id}/pay`, {
        planName: selectedPlan.name,
        amount: selectedPlan.numericPrice,
      })

      // 2. Update local state so isPaid becomes true
      updateUser({
        society: {
          ...society,
          isPaid: true,
          subscriptionPlan: selectedPlan.name,
        },
      })

      toast.success(`Subscription activated for ${selectedPlan.name} Plan! Welcome to your dashboard.`)
      setShowRazorpay(false)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Payment verification failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-5xl w-full space-y-8 py-6"
      >
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800 rounded-xl px-4 py-2 transition-all cursor-pointer font-semibold"
          >
            <ArrowLeft className="h-4 w-4 text-slate-400" />
            <span>Back to Home</span>
          </Button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Building2 className="w-4 h-4 text-teal-400" />
            <span>Society: <strong className="text-white">{society.name}</strong></span>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>CHOOSE SUBSCRIPTION PLAN TO ACTIVATE DASHBOARD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome, {user.name}!
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Your trial or plan has completed. Select a subscription plan below to reactivate full dashboard access for <strong className="text-teal-400">{society.name}</strong>.
          </p>
        </div>

        {/* Pricing Cards Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {activationPlans.map((plan, i) => {
            const isSelected = selectedPlan.name === plan.name
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedPlan(plan)}
                className={`rounded-3xl p-6 border flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#0f2820] to-[#0c1f18] border-2 border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.25)]'
                    : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    MOST POPULAR
                  </span>
                )}

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">{plan.tag}</span>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? 'border-teal-500 bg-teal-500 text-slate-950' : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name} Plan</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-black text-teal-400">{plan.price}</span>
                      <span className="text-xs text-slate-400 font-normal">/ month</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">{plan.description}</p>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedPlan(plan)
                    setShowRazorpay(true)
                  }}
                  className={`w-full h-12 mt-8 font-extrabold text-xs tracking-wider uppercase rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.3)]'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Pay & Activate ({plan.price})
                </Button>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Secure Payment Callout */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
            <span>Instant Dashboard Access immediately after successful payment verification.</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <CreditCard className="w-4 h-4" />
            <span>Secured via Razorpay & Online Gateways</span>
          </div>
        </div>
      </motion.div>

      {/* Razorpay Online Payment Gateway Modal */}
      {showRazorpay && selectedPlan && (
        <RazorpayModal
          isOpen={showRazorpay}
          onClose={() => setShowRazorpay(false)}
          onSuccess={handlePaymentSuccess}
          planPrice={selectedPlan.price}
          numericPrice={selectedPlan.numericPrice}
          adminPhone={user.phone || '74154 54810'}
          adminEmail={user.email || 'admin@society.com'}
          societyName={society.name}
          isProcessing={isProcessing}
        />
      )}
    </div>
  )
}

