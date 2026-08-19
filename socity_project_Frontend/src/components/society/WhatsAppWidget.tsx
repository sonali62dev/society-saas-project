'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'

interface WhatsAppWidgetProps {
  phoneNumber?: string
  message?: string
}

export function WhatsAppWidget({
  phoneNumber = '919752100980',
  message = 'Hello Kiaan Technology! I want to know more about Nexus Society OS.',
}: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="mb-3 w-80 bg-[#0d1522] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-white border-slate-700/80"
          >
            {/* Header */}
            <div className="bg-[#128C7E] p-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-black text-white text-xs border border-white/30">
                    KT
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#128C7E] rounded-full" />
                </div>
                <div>
                  <h4 className="font-bold text-xs leading-tight text-white">WhatsApp Support</h4>
                  <p className="text-[10px] text-emerald-100">Typically replies in minutes</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-black/10 rounded-full transition-colors text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body preview */}
            <div className="p-3.5 bg-[#0B0F17] space-y-2.5">
              <div className="bg-[#142133] p-3 rounded-xl border border-slate-800 text-xs text-slate-200 space-y-1 shadow-sm">
                <span className="font-bold text-emerald-400 text-[10px] block uppercase tracking-wider">Kiaan Support Team</span>
                <p className="leading-relaxed text-[11px]">
                  Hi there! 👋 How can we help you with your society management software today?
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-3 bg-[#0d1522] border-t border-slate-800">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full h-9.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Start WhatsApp Chat</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Circular Icon Floating Button */}
      <div className="relative group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_0_25px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all hover:scale-110 cursor-pointer border-2 border-white/20"
          aria-label="WhatsApp Support"
        >
          {/* Official WhatsApp Clean SVG Icon */}
          <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
            <path d="M12.031 2c-5.514 0-9.999 4.486-9.999 10.001 0 1.764.46 3.486 1.332 5.006l-1.417 5.176 5.297-1.389c1.46.797 3.111 1.218 4.787 1.218 5.515 0 10.001-4.485 10.001-10.001 0-5.515-4.486-10.001-10.001-10.001zm5.922 14.181c-.246.69-1.222 1.314-1.706 1.378-.466.063-1.077.287-3.488-.707-3.08-1.269-5.074-4.409-5.228-4.613-.153-.204-1.254-1.666-1.254-3.176 0-1.51.789-2.253 1.066-2.559.277-.307.604-.384.806-.384.202 0 .404.002.58.01.188.008.439-.071.688.528.257.616.879 2.148.956 2.302.077.153.128.332.026.536-.103.204-.154.332-.307.511-.153.18-.323.402-.461.539-.153.153-.313.321-.135.627.178.306.791 1.306 1.701 2.116 1.168 1.04 2.153 1.362 2.46 1.515.307.153.486.128.665-.077.179-.204.767-.894.972-1.2.205-.306.409-.255.69-.153.282.102 1.79.843 2.096.996.307.153.512.23.588.358.076.128.076.741-.17 1.431z" />
          </svg>
        </button>

        {/* Hover Tooltip */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 hidden group-hover:block bg-[#101520] border border-slate-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg pointer-events-none">
          WhatsApp Support 💬
        </div>
      </div>
    </div>
  )
}
