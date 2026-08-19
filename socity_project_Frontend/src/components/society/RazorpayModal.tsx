'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeft, ShieldCheck, Check, CreditCard, QrCode, Lock, Loader2, ArrowRight, Menu, HelpCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useFeatureFlags } from '@/lib/hooks/use-feature-flags'

interface RazorpayModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (paymentDetails?: any) => Promise<any> | void
  planPrice: string
  numericPrice: number
  adminPhone?: string
  adminEmail?: string
  societyName?: string
  isProcessing?: boolean
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if ((window as any).Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function RazorpayModal({
  isOpen,
  onClose,
  onSuccess,
  planPrice = '₹799',
  numericPrice = 799,
  adminPhone = '74154 54810',
  adminEmail = 'admin@society.com',
  societyName = 'Nexus Society OS',
  isProcessing = false,
}: RazorpayModalProps) {
  const router = useRouter()
  const { enableOnlinePayment } = useFeatureFlags()
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi')
  const [flowState, setFlowState] = useState<'options' | 'processing' | 'success' | 'confirmed'>('options')
  const [paymentId, setPaymentId] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState(711) // 11:51 in seconds
  const [isLaunchingRzp, setIsLaunchingRzp] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setFlowState('options')
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 711))
    }, 1000)
    return () => clearInterval(timer)
  }, [isOpen])

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleRazorpayCheckout = async () => {
    if (!enableOnlinePayment) {
      toast.error('Online Payment Gateway is temporarily disabled by Platform Administrator for maintenance.', { duration: 5000 })
      return
    }
    const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_T2CGGz8NLUuopj'
    setIsLaunchingRzp(true)

    try {
      // 1. Load Razorpay Script
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        toast.error('Failed to load Razorpay Payment Gateway. Please check internet connection.')
        setIsLaunchingRzp(false)
        return
      }

      // 2. Create Order from Backend
      let orderId = ''
      try {
        const res = await api.post('/payment/create-order', {
          amount: numericPrice,
          currency: 'INR',
          societyName,
          adminEmail,
        })
        if (res.data && res.data.orderId) {
          orderId = res.data.orderId
        }
      } catch (err) {
        console.warn('Backend Razorpay order creation:', err)
      }

      // 3. Open Official Live Razorpay Checkout
      const options = {
        key: rzpKey,
        amount: Math.round(numericPrice * 100),
        currency: 'INR',
        name: 'Nexus Society OS',
        description: `Subscription Payment (${planPrice})`,
        image: '/logo.png',
        order_id: orderId && !orderId.startsWith('order_sim_') ? orderId : undefined,
        handler: async function (response: any) {
          const payId = response.razorpay_payment_id || `pay_${Date.now()}`
          setPaymentId(payId)
          setFlowState('processing')

          try {
            if (onSuccess) {
              await onSuccess({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              })
            }
          } catch (e) {
            console.error('Payment callback error:', e)
          }

          setFlowState('success')
          setTimeout(() => {
            setFlowState('confirmed')
          }, 2500)
        },
        prefill: {
          name: societyName,
          email: adminEmail,
          contact: adminPhone,
        },
        theme: {
          color: '#10b981',
        },
        modal: {
          ondismiss: function () {
            setIsLaunchingRzp(false)
            toast.error('Payment window closed.')
          },
        },
      }

      const razorpayInstance = new (window as any).Razorpay(options)
      razorpayInstance.open()
      setIsLaunchingRzp(false)
    } catch (error: any) {
      console.error('Razorpay Gateway Launch Error:', error)
      toast.error(error.message || 'Error launching Razorpay Gateway')
      setIsLaunchingRzp(false)
    }
  }

  if (!isOpen) return null

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
        {/* ========================================================================= */}
        {/* SCREEN 6: BACK TO YOUR WEBSITE - SOCIETY ACTIVATION CONFIRMED             */}
        {/* (PRESERVED WEBSITE DARK EMERALD THEME)                                   */}
        {/* ========================================================================= */}
        {flowState === 'confirmed' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-[#0d1522] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden text-white border border-slate-800"
          >
            {/* Top Navigation Bar */}
            <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0B0F17]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-black text-base shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  N
                </div>
                <span className="font-extrabold text-base tracking-tight text-white">NEXUS SOCIETY OS</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span>Menu</span>
                <Menu className="w-4 h-4 text-slate-300" />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-8 text-center space-y-6">
              {/* Big Green Checkmark */}
              <div className="w-20 h-20 mx-auto bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] text-black">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white tracking-tight">Society Activation Confirmed!</h2>
                <p className="text-xs text-slate-400">Your account and society subscription have been confirmed successfully.</p>
              </div>

              {/* Confirmation & Payment Receipt Card */}
              <div className="max-w-md mx-auto bg-[#142133] border border-slate-800 rounded-2xl p-5 text-left space-y-3 text-xs shadow-xl relative overflow-hidden">
                {/* Official Paid Stamp Badge */}
                <div className="absolute top-4 right-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-md tracking-wider">
                  ✓ PAID & ACTIVATED
                </div>

                <div className="border-b border-slate-800 pb-2.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">OFFICIAL PAYMENT RECEIPT</span>
                  <h4 className="font-mono text-sm font-bold text-emerald-400 mt-0.5">
                    REC-2026-{paymentId.toUpperCase().slice(-6)}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Billed To:</span>
                    <p className="font-bold text-white leading-tight mt-0.5">{societyName}</p>
                    <p className="text-[11px] text-slate-400">{adminEmail}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[11px]">Payment Date:</span>
                    <p className="font-bold text-slate-200 leading-tight mt-0.5">{todayFormatted}</p>
                    <p className="text-[11px] text-slate-400">Mode: Razorpay / UPI</p>
                  </div>
                </div>

                <div className="bg-[#0b131f] p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>SaaS Subscription (Monthly)</span>
                    <span className="font-mono text-white">{planPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>GST (18%) & Platform Fees</span>
                    <span className="text-emerald-400">Included</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 flex justify-between items-center font-bold text-sm">
                    <span className="text-white">Total Amount Paid</span>
                    <span className="text-emerald-400 font-mono">{planPrice}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons (Receipt Download & Login) */}
              <div className="max-w-md mx-auto space-y-2 pt-1">
                <Button
                  onClick={() => {
                    const printWin = window.open('', '_blank')
                    if (printWin) {
                      printWin.document.write(`
                        <html>
                          <head>
                            <title>Payment Receipt - ${societyName}</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
                              .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; }
                              .stamp { background: #d1fae5; color: #065f46; font-weight: bold; padding: 5px 12px; border-radius: 4px; display: inline-block; }
                              .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                              .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <h2>NEXUS SOCIETY OS - OFFICIAL PAYMENT RECEIPT</h2>
                              <div class="stamp">✓ PAYMENT COMPLETED & ACTIVATED</div>
                            </div>
                            <p><strong>Receipt No:</strong> REC-2026-${paymentId.toUpperCase().slice(-6)}</p>
                            <p><strong>Date:</strong> ${todayFormatted}</p>
                            <p><strong>Society Name:</strong> ${societyName}</p>
                            <p><strong>Admin Email:</strong> ${adminEmail}</p>
                            <p><strong>Payment Mode:</strong> Razorpay / UPI</p>
                            <table class="table">
                              <thead>
                                <tr><th>Description</th><th>Period</th><th>Amount Paid</th></tr>
                              </thead>
                              <tbody>
                                <tr><td>Nexus Society OS Subscription</td><td>Monthly</td><td>${planPrice}</td></tr>
                              </tbody>
                            </table>
                            <h3 style="text-align: right; margin-top: 20px;">Total Paid: ${planPrice}</h3>
                          </body>
                        </html>
                      `)
                      printWin.document.close()
                      printWin.print()
                    }
                  }}
                  className="w-full h-10 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📥 Download / Print Payment Receipt (PDF)</span>
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => router.push(`/auth/login?email=${encodeURIComponent(adminEmail)}`)}
                    className="h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    Proceed to Admin Login →
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="h-11 border-slate-700 text-slate-300 hover:bg-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 pt-2">
                A confirmation email with admin login credentials and payment receipt has been sent to <strong className="text-slate-300">{adminEmail}</strong>.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative w-full max-w-4xl bg-[#0d1522] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[520px] text-white border border-slate-800"
          >
            {/* ========================================================= */}
            {/* LEFT SIDEBAR: DARK BRANDING PANEL                         */}
            {/* ========================================================= */}
            <div className="lg:col-span-4 bg-[#0B131F] text-white p-6 flex flex-col justify-between relative overflow-hidden border-r border-slate-800">
              <div className="space-y-6 relative z-10">
                {/* Brand Title */}
                <div>
                  <div className="text-xs font-bold text-emerald-400 tracking-wider uppercase mb-1">NEXUS SOCIETY OS</div>
                  <h3 className="text-xs text-slate-400 font-medium">Smart Society Management Service</h3>
                </div>

                {/* Amount Section */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 font-medium">Pay Nexus Society OS</span>
                  <div className="text-4xl font-black text-white tracking-tight">{planPrice}</div>
                  <p className="text-xs text-slate-400 pt-1">Subscription for {societyName}</p>
                  <p className="text-[11px] text-slate-500">{todayFormatted}, 10:00 AM</p>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-200">Secure Payments</div>
                      <div className="text-[10px] text-slate-400">Powered by Razorpay</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-200">100% Safe & Secure</div>
                      <div className="text-[10px] text-slate-400">Your data is protected</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-200">24/7 Support</div>
                      <div className="text-[10px] text-slate-400">We are here to help</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Razorpay Footer */}
              <div className="pt-6 relative z-10 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-400">Razorpay</span>
                  <span>Trusted Payment Partner</span>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* RIGHT PANEL: DYNAMIC STEPS (PROCESSING, SUCCESS, OPTIONS) */}
            {/* ========================================================= */}
            <div className="lg:col-span-8 bg-[#101520] flex flex-col justify-between p-6 relative text-white">
              {/* Close Button Header */}
              {flowState === 'options' && (
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <button
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-white">Payment Options</h2>
                  <button
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SCREEN 4: PAYMENT IS PROCESSING                               */}
              {/* ------------------------------------------------------------- */}
              {flowState === 'processing' && (
                <div className="my-auto text-center space-y-6 py-12">
                  <div className="w-24 h-24 mx-auto bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-white">Processing your payment</h3>
                    <p className="text-xs text-slate-400">Please do not close this window</p>
                  </div>

                  {/* Bouncing Loader Dots */}
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SCREEN 5: PAYMENT SUCCESSFUL!                                 */}
              {/* ------------------------------------------------------------- */}
              {flowState === 'success' && (
                <div className="my-auto text-center space-y-6 py-8">
                  {/* Big Green Checkmark Circle */}
                  <div className="w-20 h-20 mx-auto bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <Check className="w-10 h-10 stroke-[3]" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-emerald-400">Payment Successful!</h3>
                    <p className="text-sm font-bold text-white">{planPrice} paid successfully</p>
                    <p className="text-xs font-mono text-slate-400">Payment ID: {paymentId}</p>
                  </div>

                  {/* Redirect Banner Pill */}
                  <div className="max-w-xs mx-auto bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 py-3 px-6 rounded-2xl text-xs font-bold shadow-md">
                    Redirecting to Nexus Society OS...
                  </div>

                  <p className="text-[11px] text-slate-400">You will be redirected in a few seconds.</p>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* OPTIONS PANEL: SELECT PAYMENT METHOD & SCAN QR CODE           */}
              {/* ------------------------------------------------------------- */}
              {flowState === 'options' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left Method Selection Buttons */}
                  <div className="md:col-span-5 space-y-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('upi')}
                      className={`w-full p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        activeTab === 'upi'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">UPI</span>
                        <div className="flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-[8px] text-white flex items-center justify-center font-bold">G</span>
                          <span className="w-4 h-4 rounded-full bg-purple-600 text-[8px] text-white flex items-center justify-center font-bold">P</span>
                          <span className="w-4 h-4 rounded-full bg-cyan-500 text-[8px] text-white flex items-center justify-center font-bold">Pay</span>
                        </div>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full w-fit border border-emerald-500/30">
                        Upto ₹50 cashback
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('card')}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'card'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-sm text-white">Cards</span>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                        <span>VISA</span>
                        <span>MC</span>
                        <span>RUPAY</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('netbanking')}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'netbanking'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-sm text-white">Netbanking</span>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                        <span>HDFC</span>
                        <span>SBI</span>
                        <span>ICICI</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('wallet')}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        activeTab === 'wallet'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-sm text-white">Wallet</span>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                        <span>MOBIKWIK</span>
                        <span>AIRTEL</span>
                      </div>
                    </button>
                  </div>

                  {/* Right Detail Content Box */}
                  <div className="md:col-span-7 space-y-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold">
                      <span>🚀</span>
                      <span>Win upto ₹50 cashback using BHIM App</span>
                    </div>

                    {/* UPI QR Code View */}
                    {activeTab === 'upi' && (
                      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">UPI QR</span>
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                            ⏱ {formatTimer(timeLeft)}
                          </span>
                        </div>

                        {/* Interactive Scannable QR Code */}
                        <div
                          onClick={handleRazorpayCheckout}
                          className="p-3 bg-slate-950 border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl text-center space-y-2 cursor-pointer transition-all hover:bg-slate-900 group"
                        >
                          <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-md border border-slate-200 flex items-center justify-center">
                            <img
                              src="/payment-qr.png"
                              alt="UPI Payment QR Code"
                              className="w-full h-full object-contain rounded-lg"
                            />
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-slate-300 group-hover:text-emerald-400">
                              Scan the QR using any UPI App
                            </p>
                            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400">
                              <span className="bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.5 rounded">GPay</span>
                              <span className="bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded">PhonePe</span>
                              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded">Paytm</span>
                              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">BHIM</span>
                            </div>
                          </div>
                        </div>

                        {/* Trigger Button */}
                        <Button
                          onClick={handleRazorpayCheckout}
                          disabled={isProcessing}
                          className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                        >
                          {isProcessing ? 'Processing Payment...' : `Complete Payment (${planPrice})`}
                        </Button>
                      </div>
                    )}

                    {/* Cards View */}
                    {activeTab === 'card' && (
                      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-bold text-slate-300">Card Number</Label>
                          <Input placeholder="4242 •••• •••• 4242" className="h-9.5 bg-slate-950 border-slate-700 text-white font-mono text-xs rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-300">Expiry</Label>
                            <Input placeholder="MM/YY" className="h-9.5 bg-slate-950 border-slate-700 text-white font-mono text-xs rounded-lg" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs font-bold text-slate-300">CVV</Label>
                            <Input type="password" placeholder="123" maxLength={4} className="h-9.5 bg-slate-950 border-slate-700 text-white font-mono text-xs rounded-lg" />
                          </div>
                        </div>
                        <Button
                          onClick={handleRazorpayCheckout}
                          disabled={isProcessing}
                          className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer mt-2"
                        >
                          Pay {planPrice}
                        </Button>
                      </div>
                    )}

                    {/* Netbanking View */}
                    {activeTab === 'netbanking' && (
                      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                        <Label className="text-xs font-bold text-slate-300">Popular Banks</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((b) => (
                            <button
                              key={b}
                              onClick={handleRazorpayCheckout}
                              className="p-2 border border-slate-800 hover:border-emerald-500 rounded-lg text-xs font-bold text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer transition-all"
                            >
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Wallet View */}
                    {activeTab === 'wallet' && (
                      <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                        <Label className="text-xs font-bold text-slate-300">Select Wallet</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {['PhonePe Wallet', 'Mobikwik', 'Airtel Money', 'JioMoney'].map((w) => (
                            <button
                              key={w}
                              onClick={handleRazorpayCheckout}
                              className="p-2.5 border border-slate-800 hover:border-emerald-500 rounded-lg text-xs font-bold text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer transition-all"
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom Footer Note */}
              {flowState === 'options' && (
                <div className="pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500">
                  By proceeding, I agree to Razorpay's <span className="underline cursor-pointer text-slate-400">Privacy Notice</span> • <span className="underline cursor-pointer text-slate-400">Edit Preferences</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}
