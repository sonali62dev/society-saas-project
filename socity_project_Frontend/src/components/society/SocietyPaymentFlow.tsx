'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, CreditCard, Building2, LayoutDashboard, ArrowRight, ArrowLeft, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/stores/auth-store'
import api from '@/lib/api'
import { toast } from 'sonner'

export function SocietyPaymentFlow() {
  const router = useRouter()
  const { user, updateUser, logout } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)
  
  if (!user || !user.society) return null
  
  const society = user.society
  const plan = society.billingPlan
  const discount = society.discount || 0
  
  const originalPrice = plan?.price || 0
  const finalPrice = Math.round(originalPrice * (1 - discount / 100))

  const handleBack = () => {
    logout()
    router.push('/')
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      await api.post(`/society/${society.id}/pay`)
      
      // Update local storage/state
      updateUser({
        society: {
          ...society,
          isPaid: true
        }
      })
      
      toast.success('Payment successfully processed! Welcome to your dashboard.')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full space-y-6"
      >
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-200 shadow-sm rounded-xl px-4 py-2 transition-all cursor-pointer font-semibold"
          >
            <ArrowLeft className="h-4 w-4 text-slate-500" />
            <span>← Back to Home</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Side: Info */}
          <div className="lg:col-span-3 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}!</h1>
              <p className="text-slate-500 text-lg">
                Your society account for <span className="font-semibold text-teal-600">{society.name}</span> is ready. Just one last step to activate your dashboard.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-teal-100 rounded-xl">
                    <Building2 className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Society Code</p>
                    <p className="font-bold text-slate-800 uppercase">{society.code}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <ShieldCheck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Plan Tier</p>
                    <p className="font-bold text-slate-800">{society.subscriptionPlan || 'STANDARD'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">What's included in your plan:</h3>
              <ul className="space-y-3">
                {[
                  'Full Resident Management',
                  'Digital Gate Pass & Security',
                  'Automated Billing & Invoicing',
                  'Community Engagement Tools',
                  'Advanced Reporting & Analytics'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side: Payment Summary */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl bg-white sticky top-6">
              <CardHeader className="bg-slate-900 text-white rounded-t-xl py-6">
                <CardTitle className="flex items-center justify-between">
                  <span>Activation Fee</span>
                  <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Setup & Subscription Activation
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-inner">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Final Activation Fee</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">₹{finalPrice.toLocaleString()}</span>
                    {discount > 0 && <span className="text-lg text-slate-400 line-through">₹{originalPrice.toLocaleString()}</span>}
                  </div>
                </div>

                <div className="space-y-4 px-2">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500 font-medium">{plan?.name || (society.subscriptionPlan ? society.subscriptionPlan + ' Plan' : 'Subscription Plan')}</span>
                    <span className="text-slate-900 font-semibold">₹{originalPrice.toLocaleString()}</span>
                  </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm items-center py-2 border-y border-dashed border-slate-200">
                    <span className="flex items-center gap-1.5 text-emerald-600 font-semibold italic">
                      <Badge className="bg-emerald-500 text-white border-none h-5 px-1.5 text-[10px] uppercase font-black">
                        Saved
                      </Badge>
                      Special {discount}% Early Bird
                    </span>
                    <span className="text-emerald-600 font-bold">- ₹{(originalPrice - finalPrice).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-900 font-bold">Total Amount</span>
                  <span className="text-xl font-black text-teal-600">₹{finalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white text-lg font-bold shadow-lg shadow-teal-600/20 group"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing Payment...' : 'Complete Payment & Activate'}
                  {!isProcessing && <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </Button>

                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs text-center px-4">
                  <CreditCard className="h-4 w-4" />
                  <span>Secure payment processed via Platform Billing System</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  </div>
  )
}
