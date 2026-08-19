'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkle,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/lib/stores/auth-store'
import api from '@/lib/api'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'superadmin@society.com',
      password: 'password123',
    },
  })

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setValue('email', emailParam)
      setValue('password', 'password123')
      toast.success('Your admin email has been pre-filled. Enter your password to log in.')
    }
  }, [searchParams, setValue])

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      const response = await api.post('/auth/login', data)
      const { user, token } = response.data

      login(user, token)
      toast.success(`Welcome back, ${user.name}!`)

      if (user.role === 'super_admin') {
        router.push('/dashboard/super-admin')
      } else if (user.role === 'guard') {
        router.push('/dashboard/guard/dashboard')
      } else if (user.role === 'vendor') {
        router.push('/dashboard/vendor/analytics')
      } else {
        router.push('/dashboard')
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid credentials'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    {
      role: 'Super Admin',
      email: 'superadmin@society.com',
      password: 'password123',
      icon: '⚡',
      badge: 'System Owner',
    },
    {
      role: 'Society Admin',
      email: 'admin@live99.com',
      password: 'password123',
      icon: '🏢',
      badge: 'Sanjay Admin',
    },
    {
      role: 'Resident Owner',
      email: 'resident@society.com',
      password: 'password123',
      icon: '🏠',
      badge: 'Resident App',
    },
    {
      role: 'Gate Guard',
      email: 'guard@society.com',
      password: 'password123',
      icon: '🛡️',
      badge: 'Gate Pass',
    },
    {
      role: 'Vendor / Staff',
      email: 'vendor@society.com',
      password: 'password123',
      icon: '🛠️',
      badge: 'Service Pass',
    },
    {
      role: 'Individual User',
      email: 'individual@example.com',
      password: 'password123',
      icon: '👤',
      badge: 'Personal Pass',
    },
  ]

  const handleDemoLogin = (role: string, email: string, pass: string) => {
    setSelectedRole(role)
    setValue('email', email)
    setValue('password', pass)
    toast.success(`Logging in as ${role}...`)
    onSubmit({ email, password: pass })
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#070A0F] text-slate-100 font-sans selection:bg-teal-500 selection:text-black">
      
      {/* ========================================================= */}
      {/* LEFT PANEL (50%): APARTMENT IMAGE WITH DARK TEAL OVERLAY */}
      {/* ========================================================= */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-slate-800/80">
        {/* Background Image Layer */}
        <img
          src="/images/luxury_apartment.png"
          alt="Luxury Society Building"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        {/* Original Dark Slate/Teal Backdrop Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070A0F] via-[#070A0F]/80 to-[#070A0F]/55 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070A0F]/90 via-transparent to-transparent" />

        {/* Glow Effects */}
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-teal-500/15 rounded-full filter blur-[100px] pointer-events-none" />

        {/* Top Floating Circular Back Button */}
        <div className="relative z-10">
          <Link href="/">
            <button className="w-12 h-12 rounded-full bg-[#131C2E]/80 hover:bg-[#1A253B] backdrop-blur-xl text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-xl border border-slate-700/80">
              <ArrowLeft className="w-5 h-5 text-teal-400" />
            </button>
          </Link>
        </div>

        {/* Bottom Left Branding Header */}
        <div className="relative z-10 space-y-4 max-w-xl pb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-[1px] shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <div className="w-full h-full bg-[#0B0F17] rounded-[11px] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal-400 flex items-center gap-1.5">
              IGATESECURITY PLATFORM <Sparkle className="w-3.5 h-3.5 text-teal-400 animate-spin" />
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
            SOCIETY{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-200 to-indigo-200">
              SOFTWARE
            </span>
          </h1>

          <p className="text-slate-300 text-base leading-relaxed font-medium pt-2">
            Streamline resident management, track gate security visitor check-ins, automated maintenance billing, and scale your society operations effortlessly.
          </p>

          <div className="flex items-center space-x-6 pt-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-teal-400" />
              <span>500+ Active Societies</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-teal-400" />
              <span>99.99% System Uptime</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PANEL (50%): CENTERED LOGIN FORM IN ORIGINAL THEME */}
      {/* ========================================================= */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-[#0B0F17] relative border-l border-slate-800/80">
        {/* Mobile-only Back Button */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link href="/">
            <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-white flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-teal-400" />
            </button>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8 my-auto">
          {/* Header Title & Subtitle */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-[1px] shadow-[0_0_25px_rgba(16,185,129,0.4)]">
              <div className="w-full h-full bg-[#0B0F17] rounded-[15px] flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-teal-400" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-sm text-teal-400 font-medium">
              Please login to your society account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Address */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-11 h-12 bg-[#111622] border-slate-700/80 text-white placeholder:text-slate-500 font-medium rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 shadow-inner"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 bg-[#111622] border-slate-700/80 text-white placeholder:text-slate-500 font-medium rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 shadow-inner"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5 text-teal-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-0.5">
              <Link
                href="/auth/forgot-password"
                className="text-xs text-teal-400 hover:text-teal-300 font-bold transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 hover:from-teal-500 hover:to-cyan-500 text-slate-950 font-extrabold text-base rounded-xl shadow-[0_0_25px_rgba(45,212,191,0.35)] transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                <span>Login to Dashboard</span>
              )}
            </Button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="p-4 bg-[#111622] border border-slate-800 rounded-2xl space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" />
                Quick Demo Accounts
              </p>
              <span className="text-[10px] text-teal-300 font-medium">1-Click Auto Fill</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => {
                const isSelected = selectedRole === acc.role
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleDemoLogin(acc.role, acc.email, acc.password)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-500/20 border-teal-400 text-white ring-1 ring-teal-400'
                        : 'bg-[#0B0F17] border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{acc.icon}</span>
                    <span className="text-xs font-bold truncate mt-1 text-white">{acc.role}</span>
                    <span className="text-[9px] text-slate-400 truncate">{acc.badge}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
