'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText,
  UserCheck,
  CreditCard,
  Clock,
  Shield,
  Lock,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Globe,
  ChevronLeft,
  ArrowUp,
} from 'lucide-react'

export default function TermsAndConditionsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#0d1522] text-slate-200">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-[#0B0F17] border-b border-slate-800/80 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors mb-8 text-xs font-bold uppercase tracking-wider"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)] mb-2"
            >
              <FileText className="h-10 w-10 text-emerald-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-white tracking-tight"
            >
              Terms & Conditions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg text-slate-400"
            >
              Kiaan Technology Private Limited — Terms & Conditions of Service
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400"
            >
              Last Updated: August 5, 2026
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-8">
        {/* Welcome Notice Banner */}
        <div className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3 shadow-xl">
          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome to <strong className="text-white">Kiaan Technology Private Limited</strong>. These Terms & Conditions govern your access to and use of our website (<a href="https://kiaantechnology.com/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://kiaantechnology.com/</a>), SaaS platforms, mobile applications, and management services. By accessing or using our services, you agree to comply with these terms.
          </p>
        </div>

        {/* Section 1 */}
        <div className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            1. User Account & Registration
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            To access SaaS features, users must register an account with accurate business details. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            2. Subscription Plans & Payment Terms
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Subscription fees are payable in advance based on the plan selected. All payment processing is securely handled via integrated payment gateways (such as Razorpay). Rates and taxes comply with Indian IT Act 2000 guidelines.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            3. Free Trial Policy
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Free trial accounts are provided for demonstration purposes. Trial access duration is strictly limited (1 Day or as specified). Each email address is eligible for only one free trial. Upon expiration, access requires plan subscription.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            4. Acceptable Use
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            You agree not to use the services for any unlawful purpose, interfere with system operations, reverse engineer components, or transmit unauthorized data under DPDP Act 2023 and GDPR guidelines.
          </p>
        </div>

        {/* Section 5 */}
        <div className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            5. Intellectual Property
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            All software code, visual design, logos, trademarks, and content provided by Kiaan Technology Private Limited remain the exclusive property of Kiaan Technology.
          </p>
        </div>

        {/* Section 6 */}
        <div className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-emerald-400" />
            6. Termination & Limitation of Liability
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            We reserve the right to suspend or terminate service access for violations of these terms. In no event shall Kiaan Technology be liable for indirect or consequential damages arising out of service usage.
          </p>
        </div>

        {/* Section 7 */}
        <div className="bg-[#142133] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-400" />
            7. Contact Information
          </h2>
          <p className="text-xs md:text-sm text-slate-300">
            For any queries regarding these Terms & Conditions, please reach out to us:
          </p>
          <div className="space-y-2.5 text-xs md:text-sm text-slate-300 pt-1">
            <p className="font-bold text-white text-base">Kiaan Technology Private Limited</p>
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Address: 2341/E, Sudama Nagar, Indore, Madhya Pradesh, India</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Phone: <a href="tel:+919752100980" className="text-emerald-400 hover:underline">+91-97521 00980</a></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Email: <a href="mailto:info@kiaantechnology.com" className="text-emerald-400 hover:underline">info@kiaantechnology.com</a></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Website: <a href="https://kiaantechnology.com/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://kiaantechnology.com/</a></span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B0F17] border-t border-slate-800 text-slate-400 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-xs text-slate-300">
            © 2026 Kiaan Technology Private Limited. All rights reserved.
          </p>
          <div className="pt-2">
            <Link href="/" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-bold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-110 cursor-pointer"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 stroke-[2.5]" />
      </button>
    </div>
  )
}
