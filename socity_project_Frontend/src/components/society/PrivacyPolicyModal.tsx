'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Lock, Eye, Database, Clock, FileText, CheckCircle, Users, AlertTriangle, Globe, Bell, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
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
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white leading-tight">Privacy Policy</h3>
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

          {/* Scrollable Privacy Policy Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs md:text-sm text-slate-300">
            {/* Top Banner Notice */}
            <div className="bg-[#101520] border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">OFFICIAL POLICY DOCUMENT</span>
                <span className="text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
                  Last Updated: August 5, 2026
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                Welcome to <strong className="text-white">Kiaan Technology Private Limited</strong>. This Privacy Policy outlines how we collect, use, process, and protect your personal information when you use our website (<a href="https://kiaantechnology.com/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://kiaantechnology.com/</a>), SaaS platforms, mobile applications, and services (including Payroll Management, HRMS, Job Portals, and Payment Integration). By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-[11px] text-emerald-300">
                🛡️ <strong>Regulatory Compliance:</strong> This policy complies with the Indian IT Act 2000, DPDP Act 2023, GDPR, and global app store guidelines.
              </div>
            </div>

            {/* Section 1 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                1. Information Collection
              </h4>
              <div className="space-y-2 text-xs">
                <p><strong className="text-slate-200">Personal Data:</strong> Name, email address, phone number, physical address, KYC documents, etc.</p>
                <p><strong className="text-slate-200">Professional Data:</strong> Employee ID, designation, salary details, and resume data for HRMS and Job portals.</p>
                <p><strong className="text-slate-200">Usage Data:</strong> IP address, browser type, device identifiers, and platform usage metrics.</p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                2. Personal Data Usage
              </h4>
              <p className="text-xs">We use your data to:</p>
              <ul className="list-disc ml-5 space-y-1 text-xs text-slate-300">
                <li>Provide, operate, and maintain our software solutions.</li>
                <li>Process payroll, attendance, and recruitment functionalities.</li>
                <li>Improve and personalize user experience.</li>
                <li>Communicate regarding updates, security alerts, and support.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                3. Cookies Policy
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>

            {/* Section 4 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                4. Data Retention
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy, complying with legal obligations, resolving disputes, and enforcing our legal agreements.
              </p>
            </div>

            {/* Section 5 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                5. Data Security
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We implement industry-standard security measures (including encryption and secure server infrastructure) to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </div>

            {/* Section 6 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                6. User Rights
              </h4>
              <p className="text-xs">Depending on your jurisdiction (e.g., GDPR, DPDP), you have the right to:</p>
              <ul className="list-disc ml-5 space-y-1 text-xs text-slate-300">
                <li>Access, update, or delete your personal data.</li>
                <li>Withdraw consent at any time.</li>
                <li>Object to the processing of your data.</li>
                <li>Request data portability.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                7. Third-Party Services
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We may employ third-party companies (such as Razorpay for payments) to facilitate our service. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>
            </div>

            {/* Section 8 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                8. Analytics & Tracking
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We may use third-party Service Providers to monitor and analyze the use of our service to improve our offerings.
              </p>
            </div>

            {/* Section 9 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-emerald-400" />
                9. Children's Privacy
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our services are not intended for use by children under the age of 18. We do not knowingly collect personally identifiable information from children.
              </p>
            </div>

            {/* Section 10 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                10. International Data Transfers
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state or country where data protection laws may differ. By consenting to this policy, you agree to that transfer.
              </p>
            </div>

            {/* Section 11 */}
            <div className="bg-[#101520] border border-slate-800/80 rounded-xl p-5 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                11. Changes to Policy
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </div>

            {/* Section 12: Contact Information */}
            <div className="bg-[#142133] border border-slate-800 rounded-xl p-5 space-y-3">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                12. Contact Information
              </h4>
              <p className="text-xs text-slate-300">If you have any questions about this Privacy Policy, please contact us:</p>
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
