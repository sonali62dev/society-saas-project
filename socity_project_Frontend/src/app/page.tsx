'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Building2,
  Shield,
  Users,
  Wallet,
  Calendar,
  BarChart3,
  ArrowUpRight,
  Check,
  Zap,
  Lock,
  Layers,
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Sliders,
  CheckCircle2,
  HelpCircle,
  X,
  CreditCard,
  QrCode,
  Loader2,
  Sparkle,
  ArrowRight,
  Building,
  Camera,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/stores/auth-store'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { RazorpayModal } from '@/components/society/RazorpayModal'
import { PrivacyPolicyModal } from '@/components/society/PrivacyPolicyModal'
import { TermsAndConditionsModal } from '@/components/society/TermsAndConditionsModal'
import { WhatsAppWidget } from '@/components/society/WhatsAppWidget'

const statsData = [
  { icon: Building2, value: '500+', label: 'ACTIVE SOCIETIES' },
  { icon: Users, value: '50M+', label: 'RESIDENTS MANAGED' },
  { icon: ShieldCheck, value: '99.99%', label: 'SYSTEM UPTIME' },
  { icon: UserCheck, value: '2,000+', label: 'GLOBAL CLIENTS' },
]

const featuresData = [
  {
    icon: Shield,
    tag: 'SECURITY & GATEPASS',
    title: 'Visitor & Gate Management',
    description:
      'Real-time visibility into visitor check-ins, vehicle tracking, and guard activity with precision QR code scanning.',
    highlight: true,
  },
  {
    icon: Wallet,
    tag: 'FINANCIAL ENGINE',
    title: 'Automated Smart Billing',
    description:
      'Streamline maintenance dues, auto-generate invoices, and send instant WhatsApp/email payment reminders with zero hassle.',
    highlight: false,
  },
  {
    icon: BarChart3,
    tag: 'ANALYTICS & INSIGHTS',
    title: 'Reports & Analytics',
    description:
      'Make data-driven decisions with comprehensive financial reporting tools, occupancy charts, and predictive expense insights.',
    highlight: false,
  },
  {
    icon: Layers,
    tag: 'MULTI-LOCATION SUPPORT',
    title: 'Multi-Society & Wing Control',
    description:
      'Manage multiple society wings, towers, gates, and commercial complexes from a single centralized intelligent dashboard.',
    highlight: false,
  },
  {
    icon: Sliders,
    tag: 'GRANULAR CONTROL',
    title: 'Role-Based Access Control',
    description:
      'Secure your community operations with 9 distinct granular permissions for Admins, Guards, Residents, and Accountants.',
    highlight: true,
  },
  {
    icon: Calendar,
    tag: 'FACILITY MANAGEMENT',
    title: 'Amenity & Event Booking',
    description:
      'Track clubhouse, pool, and gym facility slots, event calendars, and automated resident booking management with ease.',
    highlight: false,
  },
]

const benefitsData = [
  {
    title: 'Instant Gate Pass',
    desc: 'Generate digital visitor passes in seconds with OTP & QR code validation.',
  },
  {
    title: 'Zero Late Fees',
    desc: 'Automated payment alerts ensure 95%+ on-time maintenance collection.',
  },
  {
    title: 'Emergency Alarm',
    desc: 'One-click SOS panic alert sent instantly to security gate & nearby neighbors.',
  },
  {
    title: 'Cloud File Vault',
    desc: 'Securely store society audit reports, NOCs, and meeting minutes in the cloud.',
  },
]

const testimonials = [
  {
    name: 'fahimhyder310',
    country: '🇮🇳 India',
    timeAgo: '5 months ago',
    review:
      'They demonstrated strong command over both frontend and backend development, ensuring performance, security, and smooth functionality throughout the build. What stood out most was their deep understanding of the product vision. Their professionalism was consistent throughout the project. Milestones were delivered on time, communication was clear and structured, and they handled feedback with maturity and precision.',
    rating: 5,
    duration: '12 days',
    avatarColor: 'bg-rose-600',
  },
  {
    name: 'hansdjabs',
    country: '🇷🇼 Rwanda',
    timeAgo: '7 months ago',
    review:
      'my experience working with this company is very great , i highly recommend everyone to work with this amazing team. because everything is smooth by working with them .. and they have expert in software development i can tell you .. whatever you have in mind they can build it with professionalism.',
    rating: 5,
    duration: '12 days',
    avatarColor: 'bg-emerald-600',
  },
  {
    name: 'hillfamilybiz',
    country: '🇺🇸 United States',
    timeAgo: '4 months ago',
    review:
      "Did a wonderful job! It's a long term project. They understand concept and vision. Will continue to work with them to complete full scope",
    rating: 5,
    duration: '3 weeks',
    avatarColor: 'bg-purple-600',
  },
  {
    name: 'pop1010',
    country: '🇺🇸 United States',
    timeAgo: '3 months ago',
    review:
      'Best developer ever, always listening and make adjustments to every bugs snd response to messages every seconds',
    rating: 5,
    duration: '1 day',
    avatarColor: 'bg-lime-700',
  },
  {
    name: 'jjbralm',
    country: '🇺🇸 United States',
    timeAgo: '1 day ago',
    review:
      'She is exceptionally diligent, professional, and committed to delivering high-quality work. She understands the assignment thoroughly and pays close attention to every detail. I particularly appreciated her willingness to carefully review and address every correction and feedback I provided throughout the application process.',
    rating: 5,
    duration: '1 month',
    avatarColor: 'bg-teal-600',
  },
  {
    name: 'kellyheflin',
    country: '🇺🇸 United States',
    timeAgo: '3 months ago',
    review:
      'Nalini and her team provided exceptional work on the frontend wireframes for our project. They quickly understood a fairly complex sports-analytics product and translated loose ideas into a clean, intuitive layout that fits our target users perfectly. Communication was fast and clear throughout the process.',
    rating: 5,
    duration: '2 weeks',
    avatarColor: 'bg-amber-600',
  },
]

const pricingPlans = [
  {
    name: '7-Day Free Trial',
    tag: 'FREE ACCESS',
    price: '₹0',
    numericPrice: 0,
    period: 'per week',
    description: '7 Days full feature trial access for societies.',
    features: [
      '7 Days full feature trial access',
      'Duration: 7 Days',
      'Full Resident & Gate Security Access',
      'Basic Email Support',
    ],
    isPopular: false,
    buttonText: 'Get Started',
    buttonVariant: 'outline',
  },
  {
    name: 'Starter',
    tag: 'ESSENTIAL (TESTING)',
    price: '₹1',
    numericPrice: 1,
    period: 'per month',
    description: 'Essential society management features.',
    features: [
      'Essential society management features',
      'Duration: Monthly',
      'Up to 100 Residential Units',
      'Gate Pass & Visitor Logs',
    ],
    isPopular: false,
    buttonText: 'Get Started',
    buttonVariant: 'outline',
  },
  {
    name: 'Standard',
    tag: 'MOST POPULAR',
    price: '₹1,299',
    numericPrice: 1299,
    period: 'per month',
    description: 'Complete features for growing societies.',
    features: [
      'Complete features for growing societies',
      'Duration: Monthly',
      'Unlimited Resident & Security Pass',
      'Automated Billing & Accounts',
    ],
    isPopular: true,
    buttonText: 'Get Started',
    buttonVariant: 'primary',
  },
  {
    name: 'Pro',
    tag: 'AI POWERED',
    price: '₹1,499',
    numericPrice: 1499,
    period: 'per month',
    description: 'Advanced features and priority support.',
    features: [
      '🤖 Kiaan AI Assistant & AI Features',
      'Advanced features and priority support',
      'Duration: Monthly',
      'Dedicated Account Support',
    ],
    isPopular: false,
    buttonText: 'Get Started',
    buttonVariant: 'outline',
  },
  {
    name: 'Custom Plan',
    tag: 'ENTERPRISE',
    price: 'Custom',
    numericPrice: 2999,
    period: 'Tailored to your society',
    description: 'Tailored to your society requirements.',
    features: [
      'SaaS with customization',
      'Personal domain',
      'Personal branding',
      '🤖 AI and automation',
    ],
    isPopular: false,
    buttonText: 'Get Started',
    buttonVariant: 'outline',
  },
]

const faqs = [
  {
    q: 'How fast can our society switch to IGATESECURITY?',
    a: 'Onboarding takes less than 24 hours. Our team helps you bulk-import resident records and flat details via Excel in minutes.',
  },
  {
    q: 'Can security guards use this system without technical training?',
    a: 'Yes! The Guard Mobile interface is designed with large icons, native Hindi/English voice options, and simple one-tap check-in buttons.',
  },
  {
    q: 'How secure is our society financial & resident data?',
    a: 'All data is encrypted in transit and at rest using bank-grade AES-256 encryption with daily automated database backups.',
  },
]

export default function LandingPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [activePlans, setActivePlans] = useState<any[]>(pricingPlans)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api'
        const res = await axios.get(`${backendUrl}/billing-plans`)
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const active = res.data.filter((p: any) => p.status?.toLowerCase() === 'active')
          if (active.length > 0) {
            const mapped = active.map((p: any) => {
              const rawPrice = String(p.price || '0').replace(/[^0-9.]/g, '')
              const numPrice = parseFloat(rawPrice) || 0
              const formattedPrice = numPrice > 0 ? `₹${numPrice.toLocaleString()}` : (String(p.price).startsWith('₹') ? String(p.price) : `₹${p.price || 0}`)
              
              const periodLower = (p.type || '').toLowerCase()
              let periodText = 'per month'
              if (periodLower.includes('year')) periodText = 'per year'
              else if (periodLower.includes('quarter')) periodText = 'per quarter'
              else if (periodLower.includes('one')) periodText = 'one-time'
              else if (periodLower.includes('week')) periodText = 'per week'

              let planFeatures: string[] = []
              if (p.features) {
                if (typeof p.features === 'string') {
                  if (p.features.startsWith('[')) {
                    try { planFeatures = JSON.parse(p.features) } catch (e) { planFeatures = [] }
                  } else {
                    planFeatures = p.features.split('\n').map((f: string) => f.trim()).filter(Boolean)
                  }
                } else if (Array.isArray(p.features)) {
                  planFeatures = p.features
                }
              }

              if (planFeatures.length === 0 || (planFeatures.length <= 4 && planFeatures[0] === p.description)) {
                const nameLower = (p.name || '').toLowerCase()
                const priceVal = numPrice

                if (nameLower.includes('free') || priceVal === 0) {
                  planFeatures = [
                    'Basic Gate Visitor Management',
                    'Up to 1 Society / 50 Residents',
                    'Community Notice Board',
                    'Emergency SOS Trigger',
                    'Standard Support'
                  ]
                } else if (nameLower.includes('trial') || priceVal < 500) {
                  planFeatures = [
                    'Digital Gate QR Scan Entry',
                    'Resident Directory & My Unit',
                    'Basic Maintenance Invoicing',
                    'Complaint & Helpdesk Tickets',
                    'Email & Chat Support'
                  ]
                } else if (nameLower.includes('basic') || priceVal < 1500) {
                  planFeatures = [
                    'Complete Resident & Security Access',
                    'Vehicle Parking QR Stickers',
                    'Domestic Staff / Maid Attendance',
                    'Automated Dues & Payment Receipts',
                    'Priority Support (Mon-Sat)'
                  ]
                } else if (nameLower.includes('pro plan') || (nameLower.includes('pro') && !nameLower.includes('professional')) || priceVal < 3000) {
                  planFeatures = [
                    'All Basic Plan Features Included',
                    'Advanced Accounting & Bank Ledger',
                    'Local Vendor & Service Auto-Matching',
                    'Amenity & Facility Booking System',
                    'Multi-Guard Gate Station Access',
                    '24/7 Dedicated Support'
                  ]
                } else {
                  // Professional / Advance
                  planFeatures = [
                    'All Pro Plan Features Included',
                    'Full Double-Entry Society Accounting',
                    'B2C Individual Client Management',
                    'Super Admin Analytics & Audit Logs',
                    'Unlimited Residents, Units & Guards',
                    'Dedicated Account Manager (24/7)'
                  ]
                }
              }

              return {
                id: p.id,
                name: p.name,
                tag: (p.planType || p.type || 'PACKAGE').toUpperCase(),
                price: formattedPrice,
                numericPrice: numPrice,
                period: periodText,
                description: p.description || 'Full society management access.',
                features: planFeatures,
                isPopular: (p.planType || '').toUpperCase() === 'PROFESSIONAL' || (p.name || '').toLowerCase().includes('popular'),
                buttonText: 'Get Started',
                buttonVariant: 'outline'
              }
            })
            // Sort plans by price in ascending order (Low to High: ₹0 -> ₹499 -> ₹1,299 -> ₹1,999 -> ₹4,999)
            mapped.sort((a: any, b: any) => a.numericPrice - b.numericPrice)
            setActivePlans(mapped)
          }
        }
      } catch (err) {
        console.error('Error fetching billing plans for landing page:', err)
      }
    }
    fetchPlans()
  }, [])

  // Interactive Checkout & Payment Modal States
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState<any | null>(null)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false)
  const [checkoutStep, setCheckoutStep] = useState<number>(1)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'trial'>('upi')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [expandedReviews, setExpandedReviews] = useState<{ [key: number]: boolean }>({})
  const [currentReviewIndex, setCurrentReviewIndex] = useState<number>(0)

  const toggleReviewExpand = (idx: number) => {
    setExpandedReviews((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  // Form Fields State
  const [formData, setFormData] = useState({
    societyName: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    city: '',
    password: '',
    startDate: new Date().toISOString().split('T')[0],
    flatsCount: '150',
    photo: null as string | null,
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvv: '888',
  })

  const openCheckout = (plan: any) => {
    setSelectedCheckoutPlan(plan)
    setCheckoutStep(1)
    setPaymentMethod(plan.numericPrice === 0 ? 'trial' : 'upi')
  }

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.societyName || !formData.adminEmail || !formData.adminPhone) {
      return toast.error('Please fill required Society Name, Email Address, and Phone Number')
    }

    // Auto-derive adminName if not explicitly entered
    if (!formData.adminName) {
      const prefix = formData.adminEmail.split('@')[0].replace(/[^a-zA-Z]/g, ' ')
      formData.adminName = prefix ? prefix.charAt(0).toUpperCase() + prefix.slice(1) : 'Society Admin'
    }

    if (selectedCheckoutPlan?.numericPrice === 0) {
      setIsProcessing(true)
      let alreadyUsed = false

      try {
        const response = await api.post('/auth/check-trial', {
          email: formData.adminEmail,
          phone: formData.adminPhone
        })

        if (response.data?.hasUsedFreeTrial) {
          alreadyUsed = true
        }
      } catch (err) {
        const trialHistory = JSON.parse(localStorage.getItem('used_free_trials') || '[]')
        const normalizedEmail = formData.adminEmail.toLowerCase().trim()
        const normalizedPhone = formData.adminPhone.trim()
        alreadyUsed = trialHistory.some((t: any) => t.email === normalizedEmail || (normalizedPhone && t.phone === normalizedPhone))
      } finally {
        setIsProcessing(false)
      }

      if (alreadyUsed) {
        toast.error("You’ve already used your free trial.", {
          duration: 6000
        })
        setSelectedCheckoutPlan(pricingPlans[2]) // Switch to Standard plan
        handleCompletePayment()
        return
      }

      handleCompletePayment()
    } else {
      handleCompletePayment()
    }
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleCompletePayment = async () => {
    setIsProcessing(true)

    try {
      const societyName = formData.societyName || 'Sharlow Bay Community'
      const adminName = formData.adminName || 'Society Admin'
      const adminEmail = formData.adminEmail || 'admin@society.com'
      const adminPhone = formData.adminPhone || ''

      // 1. FREE TRIAL FLOW
      if (selectedCheckoutPlan?.numericPrice === 0) {
        try {
          const trialHistory = JSON.parse(localStorage.getItem('used_free_trials') || '[]')
          trialHistory.push({
            email: adminEmail.toLowerCase().trim(),
            phone: adminPhone.trim(),
            date: new Date().toISOString()
          })
          localStorage.setItem('used_free_trials', JSON.stringify(trialHistory))
        } catch (_) {}

        try {
          await api.post('/payment/verify-checkout', {
            societyName,
            adminName,
            adminEmail,
            adminPhone,
            planName: 'FREE TRIAL',
            amount: 0,
          })
        } catch (e) {}

        toast.success(`🎉 14-Day Free Trial activated! Account credentials sent to ${adminEmail}. Log in to access dashboard.`, {
          duration: 7000
        })

        setSelectedCheckoutPlan(null)
        router.push(`/auth/login?email=${encodeURIComponent(adminEmail)}`)
        return
      }

      // 2. PAID RAZORPAY PAYMENT FLOW
      let orderData: any = {}
      try {
        const orderRes = await api.post('/payment/create-order', {
          amount: selectedCheckoutPlan.numericPrice,
          societyName,
          adminEmail,
        })
        orderData = orderRes.data || {}
      } catch (err) {
        console.warn('Razorpay backend order create warning:', err)
      }

      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        toast.error('Failed to load Razorpay SDK. Please check your internet connection.')
        setIsProcessing(false)
        return
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.keyId || 'rzp_live_T2CGGz8NLUuopj'

      const options: any = {
        key: razorpayKey,
        amount: orderData.amount || Math.round(selectedCheckoutPlan.numericPrice * 100),
        currency: 'INR',
        name: 'Nexus Society OS',
        description: `Subscription for Nexus Society OS (${selectedCheckoutPlan.name})`,
        order_id: orderData.orderId && !orderData.orderId.startsWith('order_sim_') ? orderData.orderId : undefined,
        prefill: {
          name: adminName,
          email: adminEmail,
          contact: adminPhone,
        },
        theme: {
          color: '#10b981',
        },
        handler: async function (response: any) {
          setIsProcessing(true)
          try {
            await api.post('/payment/verify-checkout', {
              razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpay_order_id: response.razorpay_order_id || orderData.orderId || `order_${Date.now()}`,
              razorpay_signature: response.razorpay_signature || 'live_sig',
              societyName,
              adminName,
              adminEmail,
              adminPhone,
              planName: selectedCheckoutPlan.name,
              amount: selectedCheckoutPlan.numericPrice,
            })

            toast.success(`🎉 Payment Successful! Account credentials sent to ${adminEmail}. Log in to access your dashboard.`, {
              duration: 8000
            })

            setSelectedCheckoutPlan(null)
            router.push(`/auth/login?email=${encodeURIComponent(adminEmail)}`)
          } catch (err: any) {
            toast.error(err.response?.data?.error || 'Payment verification failed. Please try again.')
          } finally {
            setIsProcessing(false)
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
            toast.error('Payment cancelled.')
          },
        },
      }

      const rzpInstance = new (window as any).Razorpay(options)
      rzpInstance.open()
      setIsProcessing(false)
    } catch (error: any) {
      toast.error('Failed to initiate Razorpay checkout. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 selection:bg-emerald-500 selection:text-black font-sans antialiased overflow-x-hidden">
      {/* Background Decorative Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="fixed top-[40%] right-0 w-[600px] h-[400px] bg-purple-600/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Sticky Header / Navbar */}
      <header className="sticky top-0 z-50 bg-[#070A0F]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <div className="w-full h-full bg-[#0B0F17] rounded-[11px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-wider text-white font-mono flex items-center gap-1">
                NEXUS <span className="text-emerald-400">SOCIETY</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
                By Kiaan Tech
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Features
            </a>
            <a href="#benefits" className="hover:text-emerald-400 transition-colors">
              Benefits
            </a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">
              Pricing
            </a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">
              Contact
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Button
              onClick={() => openCheckout(activePlans[0] || pricingPlans[0])}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] flex items-center gap-1.5 text-sm cursor-pointer"
            >
              Start Free Trial
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Version Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide uppercase"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Next-Gen Society Platform v2.0</span>
              <ChevronRight className="w-3 h-3" />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]"
            >
              Manage society operations with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 underline decoration-emerald-500/40 decoration-wavy decoration-2">
                absolute precision.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed"
            >
              The premium, AI-driven operating system for modern residential communities. Scale your
              fulfillment, master your billing, and delight your residents.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button
                onClick={() => openCheckout(activePlans[0] || pricingPlans[0])}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-8 py-6 rounded-full text-base shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-pointer"
              >
                Start for free
                <ArrowUpRight className="w-5 h-5" />
              </Button>
              <a href="#pricing">
                <Button
                  variant="outline"
                  className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold px-8 py-6 rounded-full text-base cursor-pointer"
                >
                  View Plans
                </Button>
              </a>
            </motion.div>

            {/* Social Proof Avatars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center space-x-4 pt-4 text-xs text-slate-400"
            >
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 border-2 border-[#070A0F] flex items-center justify-center text-white font-bold text-xs">
                  RK
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-[#070A0F] flex items-center justify-center text-white font-bold text-xs">
                  PS
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-600 border-2 border-[#070A0F] flex items-center justify-center text-white font-bold text-xs">
                  AP
                </div>
              </div>
              <span>
                Trusted by <strong className="text-white font-semibold">500+ societies</strong>{' '}
                nationwide
              </span>
            </motion.div>
          </div>

          {/* Right Column Graphic / Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Card Graphic Container */}
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-950 p-1 border border-slate-700/60 shadow-2xl shadow-emerald-950/40">
              <div className="relative rounded-[22px] bg-[#0C121E] overflow-hidden p-6 min-h-[380px] flex flex-col justify-between">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, #10B981 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Floating Metric Badge - Top Left */}
                <div className="bg-[#131C2E]/95 backdrop-blur border border-slate-700/80 p-3 rounded-2xl shadow-xl w-48 z-10 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Complaints Resolved
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-white">24,582</span>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center">
                      +18.4% 📈
                    </span>
                  </div>
                </div>

                {/* Floating Metric Badge - Top Right */}
                <div className="self-end bg-[#131C2E]/95 backdrop-blur border border-slate-700/80 p-3 rounded-2xl shadow-xl w-44 z-10 space-y-1 mt-[-20px]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Security Accuracy
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-emerald-400">99.99%</span>
                    <span className="text-[10px] text-slate-400 font-bold">VERIFIED</span>
                  </div>
                </div>

                {/* Center Core Brand Card */}
                <div className="my-auto py-8 text-center relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                    <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-wider font-mono">
                    NEXUS <span className="text-emerald-400">SOCIETY</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">OPERATING SYSTEM v2.0</p>
                </div>

                {/* Floating Metric Badge - Bottom Right */}
                <div className="self-end bg-[#131C2E]/95 backdrop-blur border border-emerald-500/40 p-3 rounded-2xl shadow-xl w-48 z-10">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Active Societies
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-2xl font-black text-white">520+</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                      +12.6%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Metric Bar */}
      <section className="py-12 border-y border-slate-800/80 bg-[#0B0F17]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div
                  key={idx}
                  className="bg-[#111622]/80 border border-slate-800/80 p-6 rounded-2xl hover:border-emerald-500/40 transition-all text-center space-y-2 group"
                >
                  <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-16 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>POWERFUL FEATURES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Powerful tools for <span className="text-emerald-400">modern operations.</span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl">
            Everything you need to scale your society, built with a relentless focus on speed,
            reliability, and beautiful design.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className={`rounded-2xl p-7 border transition-all duration-300 flex flex-col justify-between relative group ${
                  feat.highlight
                    ? 'bg-gradient-to-b from-[#141E2E] to-[#0F1726] border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                    : 'bg-[#101520]/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      feat.highlight
                        ? 'bg-emerald-500 text-black font-bold'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-snug">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
                </div>

                <div className="pt-6 mt-4 flex items-center justify-between border-t border-slate-800/50 text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">
                  <span>LEARN MORE</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      feat.highlight ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Benefits Showcase Section */}
      <section id="benefits" className="py-20 bg-[#0B0F17]/80 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>BENEFITS FOR RESIDENTS & ADMINS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Designed for speed, <br />
                <span className="text-emerald-400">built for trust.</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Empower your gate guards and management committee with tools that automate routine
                paperwork and eliminate entry bottlenecks.
              </p>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              {benefitsData.map((b, i) => (
                <div
                  key={i}
                  className="bg-[#111622] border border-slate-800 p-6 rounded-2xl space-y-2 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <h4 className="text-base font-bold text-white">{b.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials / Rating Section (Continuous Infinite Horizontal Marquee Scroller) */}
      <section id="testimonials" className="py-16 w-full overflow-hidden border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-emerald-400" />
            <span>CLIENT REVIEWS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            What Our <span className="text-emerald-400">Clients Say</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Join thousands of satisfied society owners, admins, and management committee members.
          </p>
        </div>

        {/* Infinite Horizontal Auto-Scrolling Marquee Track */}
        <div className="relative w-full overflow-hidden py-2 select-none group">
          {/* Gradient Edge Blurring Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#0b0f19] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#0b0f19] to-transparent z-10 pointer-events-none" />

          {/* Marquee Motion Container */}
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 35,
            }}
          >
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div
                key={idx}
                className="w-[340px] sm:w-[410px] shrink-0 bg-[#101520] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-3.5 flex flex-col justify-between transition-all duration-300 group-hover:[animation-play-state:paused]"
              >
                {/* 1. Header: Avatar + Username + Subtitle (Country & Duration) */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
                  <div className={`w-10 h-10 rounded-full ${t.avatarColor || 'bg-rose-600'} flex items-center justify-center font-black text-white text-xs uppercase shadow-md font-mono shrink-0`}>
                    {t.name.slice(0, 2)}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-white leading-tight font-sans truncate">{t.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      <span>{t.country}</span>
                      {t.duration && <span className="text-slate-500"> • {t.duration} duration</span>}
                    </p>
                  </div>
                </div>

                {/* 2. Rating Row: 5 Stars + 5.0 + timeAgo */}
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-white">5.0</span>
                  <span className="text-slate-500 text-[11px] font-mono">• {t.timeAgo}</span>
                </div>

                {/* 3. Review Content Paragraph */}
                <p className="text-xs text-slate-300 leading-relaxed font-normal italic">
                  "{t.review}"
                </p>

              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Pricing Section */}
      <section id="pricing" className="py-24 max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>PRICING PLANS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Simple, <span className="text-emerald-400">transparent pricing.</span>
          </h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Flexible plans that grow with your fulfillment network and society size.
          </p>
        </div>

        {/* Dynamic Pricing Cards from Super Admin Billing Plans - 5 Plans Side by Side */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {activePlans.map((plan, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className={`rounded-2xl p-5 flex flex-col justify-between relative transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-[#10241b] to-[#0d1a14] border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                  : 'bg-[#101520] border border-slate-800 hover:border-emerald-500/40'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    {plan.tag}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-2 min-h-[32px]">{plan.description}</p>
                </div>

                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-400">{plan.period}</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  {plan.features.map((feat: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          plan.isPopular ? 'text-purple-400' : 'text-emerald-400'
                        }`}
                      />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Button
                  onClick={() => openCheckout(plan)}
                  className={`w-full py-6 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                    plan.isPopular
                      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]'
                      : 'bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>GOT QUESTIONS?</span>
          </div>
          <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#101520] border border-slate-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between font-bold text-white text-base hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-emerald-400 text-xl font-mono">
                  {activeFaq === index ? '−' : '+'}
                </span>
              </button>
              {activeFaq === index && (
                <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer - KT KIAAN TECHNOLOGY */}
      <footer id="contact" className="bg-[#04060A] border-t border-slate-800/80 pt-16 pb-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-12 pb-12 border-b border-slate-800/80">
            {/* Brand Information */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-white font-mono tracking-wider">
                  KT <span className="text-emerald-400">KIAAN</span> TECHNOLOGY
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                The ultimate premium platform to manage all your society business software from one
                centralized, intelligent dashboard.
              </p>
              {/* Social Icons */}
              <div className="flex items-center space-x-3 pt-2">
                <a
                  href="https://www.linkedin.com/company/kiaan-technology-pvt-ltd/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/kiaan_technology4/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.youtube.com/@kiaantechnology-r3p"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://kiaantechnology.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Company Website"
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">QUICK LINKS</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-emerald-400 transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-emerald-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-emerald-400 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-emerald-400 transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">CONTACT US</h4>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>2341/E, Sudama Nagar, Indore, M.P.</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <a href="tel:+919752100980" className="hover:text-emerald-400 transition-colors">+91-97521 00980</a>
                </li>
                <li className="flex items-center space-x-2.5">
                  <span className="w-4 h-4 text-[#25D366] font-bold text-[10px] flex items-center justify-center">💬</span>
                  <a href="https://wa.me/919752100980?text=Hello%20Kiaan%20Technology,%20I%20want%20to%20know%20more%20about%20Nexus%20Society%20OS." target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline font-bold">WhatsApp Support (+91 97521 00980)</a>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <a href="mailto:info@kiaantechnology.com" className="hover:text-emerald-400 transition-colors">info@kiaantechnology.com</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-4">
            <p>© 2026 Society SaaS. All rights reserved. Powered by Kiaan Technology</p>
            <div className="flex items-center space-x-6">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(true)}
                className="hover:text-white transition-colors text-slate-400 font-medium cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="hover:text-white transition-colors text-slate-400 font-medium cursor-pointer"
              >
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================== */}
      {/* INTERACTIVE SOCIETY ONBOARDING & PAYMENT CHECKOUT MODAL */}
      {/* ========================================================== */}
      <AnimatePresence>
        {selectedCheckoutPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0d1522] border border-slate-700/80 text-white rounded-2xl shadow-2xl overflow-hidden my-auto p-4 sm:p-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCheckoutPlan(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Selected Plan Summary Banner */}
              <div className="flex items-center justify-between gap-3 p-3 bg-[#142133] border border-emerald-500/30 rounded-xl mb-4">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                    SELECTED PLAN
                  </span>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    {selectedCheckoutPlan.name}{' '}
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                      {selectedCheckoutPlan.tag}
                    </Badge>
                  </h3>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{selectedCheckoutPlan.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    {selectedCheckoutPlan.price}
                  </div>
                  <div className="text-[9px] text-slate-400">{selectedCheckoutPlan.period}</div>
                </div>
              </div>

              {/* Step Title Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500 text-black">
                    1
                  </span>
                  <span className="text-xs font-bold text-white">
                    Society & Admin Details
                  </span>
                </div>
              </div>

              {/* STEP 1: SOCIETY & ADMIN ONBOARDING FORM */}
              {checkoutStep === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-3">
                  {/* Photo Upload Circle (Optional) */}
                  <div className="flex flex-col items-center justify-center mb-1">
                    <label
                      htmlFor="photoUpload"
                      className="w-14 h-14 rounded-full border border-dashed border-slate-600 hover:border-emerald-400 bg-slate-900 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden shadow-inner group relative"
                    >
                      {formData.photo ? (
                        <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 mb-0.5" />
                          <span className="text-[9px] font-bold text-slate-400 group-hover:text-emerald-400">Photo</span>
                        </>
                      )}
                    </label>
                    <input
                      type="file"
                      id="photoUpload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            setFormData((prev) => ({ ...prev, photo: reader.result as string }))
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                    <span className="text-[11px] text-slate-400 mt-1 font-medium">Upload Photo (Optional)</span>
                  </div>

                  {/* Selected Plan Input */}
                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-slate-300">Selected Plan</Label>
                    <Input
                      readOnly
                      value={selectedCheckoutPlan.name || '14-Day Free Trial'}
                      className="h-9.5 bg-slate-900/80 border-slate-700 text-slate-200 text-xs font-semibold rounded-lg cursor-not-allowed"
                    />
                  </div>

                  {/* Row 1: Society Name & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="societyName" className="text-[11px] font-bold text-slate-300">
                        Society Name *
                      </Label>
                      <Input
                        id="societyName"
                        required
                        placeholder="Society name"
                        value={formData.societyName}
                        onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                        className="h-9.5 bg-slate-900 border-slate-700 text-white text-xs focus:border-emerald-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="city" className="text-[11px] font-bold text-slate-300">
                        City *
                      </Label>
                      <Input
                        id="city"
                        required
                        placeholder="Your city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="h-9.5 bg-slate-900 border-slate-700 text-white text-xs focus:border-emerald-500 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email Address & Mobile Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="adminEmail" className="text-[11px] font-bold text-slate-300">
                        Email Address *
                      </Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        required
                        placeholder="your@email.com"
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                        className="h-9.5 bg-slate-900 border-slate-700 text-white text-xs focus:border-emerald-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="adminPhone" className="text-[11px] font-bold text-slate-300">
                        Mobile Number *
                      </Label>
                      <Input
                        id="adminPhone"
                        required
                        placeholder="Mobile number"
                        value={formData.adminPhone}
                        onChange={(e) => setFormData({ ...formData, adminPhone: e.target.value })}
                        className="h-9.5 bg-slate-900 border-slate-700 text-white text-xs focus:border-emerald-500 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Row 3: Password & Start Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-[11px] font-bold text-slate-300">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-9.5 bg-slate-900 border-slate-700 text-white text-xs focus:border-emerald-500 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="startDate" className="text-[11px] font-bold text-slate-300">
                        Start Date
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="h-9.5 bg-slate-900 border-slate-700 text-white text-xs focus:border-emerald-500 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Primary Action Button (Website Theme Emerald) */}
                  <div className="pt-3">
                    <Button
                      type="submit"
                      className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      {selectedCheckoutPlan.numericPrice === 0 ? (
                        <span>Activate Free Trial</span>
                      ) : (
                        <span>Proceed to Payment ({selectedCheckoutPlan.price})</span>
                      )}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              )}

              {/* STEP 2: RAZORPAY PAYMENT MODAL (WITH LIVE RAZORPAY GATEWAY INTEGRATION) */}
              {checkoutStep === 2 && (
                <RazorpayModal
                  isOpen={checkoutStep === 2 && !!selectedCheckoutPlan}
                  onClose={() => setCheckoutStep(1)}
                  onSuccess={handleCompletePayment}
                  planPrice={selectedCheckoutPlan?.price || '₹799'}
                  numericPrice={selectedCheckoutPlan?.numericPrice || 799}
                  adminPhone={formData.adminPhone || '74154 54810'}
                  adminEmail={formData.adminEmail || 'admin@society.com'}
                  societyName={formData.societyName || 'Nexus Society OS'}
                  isProcessing={isProcessing}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />

      {/* Terms & Conditions Modal */}
      <TermsAndConditionsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />

      {/* Floating WhatsApp Support Widget */}
      <WhatsAppWidget phoneNumber="919752100980" />
    </div>
  )
}
