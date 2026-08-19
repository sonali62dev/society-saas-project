'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  Eye,
  UserCheck,
  Database,
  Bell,
  Trash2,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  ChevronLeft,
  Users,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const sectionVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function PrivacyPolicyPage() {
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
              <Shield className="h-10 w-10 text-emerald-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-white tracking-tight"
            >
              Privacy Policy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg text-slate-400"
            >
              Kiaan Technology Private Limited — Official Privacy Policy
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="space-y-8">
          {/* Welcome Notice Banner */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl"
          >
            <p className="text-sm text-slate-300 leading-relaxed">
              Welcome to <strong className="text-white">Kiaan Technology Private Limited</strong>. This Privacy Policy outlines how we collect, use, process, and protect your personal information when you use our website (<a href="https://kiaantechnology.com/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://kiaantechnology.com/</a>), SaaS platforms, mobile applications, and services (including Payroll Management, HRMS, Job Portals, and Payment Integration). By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-xs text-emerald-300">
              🛡️ <strong>Regulatory Compliance:</strong> This policy complies with the Indian IT Act 2000, DPDP Act 2023, GDPR, and global app store guidelines.
            </div>
          </motion.div>

          {/* Section 1: Information Collection */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">1. Information Collection</h2>
            </div>
            <div className="space-y-3 text-xs md:text-sm text-slate-300">
              <div className="p-3.5 bg-[#142133] border border-slate-800 rounded-xl space-y-1">
                <strong className="text-white">Personal Data:</strong>
                <p className="text-slate-400">Name, email address, phone number, physical address, KYC documents, etc.</p>
              </div>
              <div className="p-3.5 bg-[#142133] border border-slate-800 rounded-xl space-y-1">
                <strong className="text-white">Professional Data:</strong>
                <p className="text-slate-400">Employee ID, designation, salary details, and resume data for HRMS and Job portals.</p>
              </div>
              <div className="p-3.5 bg-[#142133] border border-slate-800 rounded-xl space-y-1">
                <strong className="text-white">Usage Data:</strong>
                <p className="text-slate-400">IP address, browser type, device identifiers, and platform usage metrics.</p>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Personal Data Usage */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">2. Personal Data Usage</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300">We use your data to:</p>
            <ul className="space-y-2 text-xs md:text-sm text-slate-300 ml-2">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>Provide, operate, and maintain our software solutions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>Process payroll, attendance, and recruitment functionalities.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>Improve and personalize user experience.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>Communicate regarding updates, security alerts, and support.</span>
              </li>
            </ul>
          </motion.section>

          {/* Section 3: Cookies Policy */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">3. Cookies Policy</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </motion.section>

          {/* Section 4: Data Retention */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">4. Data Retention</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              We retain your personal data only for as long as is necessary for the purposes set out in this Privacy Policy, complying with legal obligations, resolving disputes, and enforcing our legal agreements.
            </p>
          </motion.section>

          {/* Section 5: Data Security */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">5. Data Security</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              We implement industry-standard security measures (including encryption and secure server infrastructure) to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
          </motion.section>

          {/* Section 6: User Rights */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">6. User Rights</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300">Depending on your jurisdiction (e.g., GDPR, DPDP), you have the right to:</p>
            <ul className="space-y-2 text-xs md:text-sm text-slate-300 ml-2">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>Access, update, or delete your personal data.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>Withdraw consent at any time.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>Object to the processing of your data.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>Request data portability.</span>
              </li>
            </ul>
          </motion.section>

          {/* Section 7: Third-Party Services */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">7. Third-Party Services</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              We may employ third-party companies (such as Razorpay for payments) to facilitate our service. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </motion.section>

          {/* Section 8: Analytics & Tracking */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">8. Analytics & Tracking</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              We may use third-party Service Providers to monitor and analyze the use of our service to improve our offerings.
            </p>
          </motion.section>

          {/* Section 9: Children's Privacy */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">9. Children's Privacy</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Our services are not intended for use by children under the age of 18. We do not knowingly collect personally identifiable information from children.
            </p>
          </motion.section>

          {/* Section 10: International Data Transfers */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">10. International Data Transfers</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state or country where data protection laws may differ. By consenting to this policy, you agree to that transfer.
            </p>
          </motion.section>

          {/* Section 11: Changes to Policy */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-3"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">11. Changes to Policy</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </motion.section>

          {/* Section 12: Contact Information */}
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[#101520] border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">12. Contact Information</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300">
              If you have any questions about this Privacy Policy, please contact us:
            </p>

            <div className="bg-[#142133] border border-slate-800 rounded-xl p-5 space-y-3 text-xs md:text-sm">
              <p className="font-bold text-white text-base">Kiaan Technology Private Limited</p>
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Address: 2341/E, Sudama Nagar, Indore, Madhya Pradesh, India</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Phone: <a href="tel:+919752100980" className="text-emerald-400 hover:underline">+91-97521 00980</a></span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Email: <a href="mailto:info@kiaantechnology.com" className="text-emerald-400 hover:underline">info@kiaantechnology.com</a></span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Website: <a href="https://kiaantechnology.com/" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">https://kiaantechnology.com/</a></span>
              </div>
            </div>
          </motion.section>
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
