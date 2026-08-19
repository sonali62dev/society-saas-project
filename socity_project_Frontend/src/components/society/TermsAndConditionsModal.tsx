'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Lock, Shield, CreditCard, Clock, UserCheck, AlertTriangle, Mail, Phone, MapPin, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TermsAndConditionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsAndConditionsModal({ isOpen, onClose }: TermsAndConditionsModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-[#0d1522] border border-slate-800 text-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        >
          {/* Top Modal Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0B0F17] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white leading-tight">Terms & Conditions</h3>
                <p className="text-[11px] text-slate-400">Kiaan Technology Private Limited</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Terms Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs md:text-sm text-slate-300">
            {/* Top Banner Notice */}
            <div className="bg-[#101520] border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">LEGAL AGREEMENT</span>
                <span className="text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
                  Last Updated: August 5, 2026
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                Welcome to <strong className="text-white">Kiaan Technology Private Limited</strong>. These Terms & Conditions govern your access to and use of our website (<a href="https://kiaantechnology.com/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://kiaantechnology.com/</a>), SaaS platforms, mobile applications, and management services. By accessing or using our services, you agree to comply with these terms.
              </p>
            </div>

            {/* Section 1 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                1. User Account & Registration
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                To access SaaS features, users must register an account with accurate business details. You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
              </p>
            </div>

            {/* Section 2 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                2. Subscription Plans & Payment Terms
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Subscription fees are payable in advance based on the plan selected. All payment processing is securely handled via integrated payment gateways (such as Razorpay). Rates and taxes comply with Indian IT Act 2000 guidelines.
              </p>
            </div>

            {/* Section 3 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                3. Free Trial Policy
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Free trial accounts are provided for demonstration purposes. Trial access duration is strictly limited (1 Day or as specified). Each email address is eligible for only one free trial. Upon expiration, access requires plan subscription.
              </p>
            </div>

            {/* Section 4 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                4. Acceptable Use
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                You agree not to use the services for any unlawful purpose, interfere with system operations, reverse engineer components, or transmit unauthorized data under DPDP Act 2023 and GDPR guidelines.
              </p>
            </div>

            {/* Section 5 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                5. Intellectual Property
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                All software code, visual design, logos, trademarks, and content provided by Kiaan Technology Private Limited remain the exclusive property of Kiaan Technology.
              </p>
            </div>

            {/* Section 6 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-emerald-400" />
                6. Termination & Limitation of Liability
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We reserve the right to suspend or terminate service access for violations of these terms. In no event shall Kiaan Technology be liable for indirect or consequential damages arising out of service usage.
              </p>
            </div>

            {/* Section 7: Contact Information */}
            <div className="bg-[#142133] border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                7. Contact Information
              </h4>
              <p className="text-xs text-slate-300">For any queries regarding these Terms & Conditions, please reach out to us:</p>
              <div className="space-y-2 text-xs pt-1">
                <p className="font-bold text-white">Company: Kiaan Technology Private Limited</p>
                <div className="flex items-start gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Address: 2341/E, Sudama Nagar, Indore, Madhya Pradesh, India</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Phone: <a href="tel:+919752100980" className="text-emerald-400 hover:underline">+91-97521 00980</a></span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Email: <a href="mailto:info@kiaantechnology.com" className="text-emerald-400 hover:underline">info@kiaantechnology.com</a></span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Website: <a href="https://kiaantechnology.com/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://kiaantechnology.com/</a></span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Actions */}
          <div className="p-4 border-t border-slate-800 bg-[#0B0F17] flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-400">© 2026 Kiaan Technology Private Limited</span>
            <Button
              onClick={onClose}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-6 h-9 rounded-xl cursor-pointer"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
