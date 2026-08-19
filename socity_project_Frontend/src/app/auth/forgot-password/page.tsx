'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Mail, ArrowLeft, CheckCircle2, Smartphone, Key, Shield } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

const phoneSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
})

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
})

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type EmailFormValues = z.infer<typeof emailSchema>
type PhoneFormValues = z.infer<typeof phoneSchema>
type OTPFormValues = z.infer<typeof otpSchema>
type ResetFormValues = z.infer<typeof resetSchema>

type Step = 'request' | 'verify' | 'reset' | 'success'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('request')
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [identifier, setIdentifier] = useState('')

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  })

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
  })

  const otpForm = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
  })

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  })

  const handleSendOTP = async (data: EmailFormValues | PhoneFormValues) => {
    setIsLoading(true)
    setIdentifier('email' in data ? data.email : data.phone)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep('verify')
      toast.success(`OTP sent to your ${method === 'email' ? 'email' : 'phone'}!`)
    }, 1500)
  }

  const handleVerifyOTP = async (data: OTPFormValues) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      if (data.otp === '123456') {
        setStep('reset')
        toast.success('OTP verified successfully!')
      } else {
        toast.error('Invalid OTP. Try 123456 for demo.')
      }
    }, 1000)
  }

  const handleResetPassword = async (data: ResetFormValues) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep('success')
      toast.success('Password reset successfully!')
    }, 1500)
  }

  const handleResendOTP = () => {
    toast.success('OTP resent successfully!')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e3a5f] via-[#2d4a6f] to-[#1e3a5f] p-12 text-white flex-col justify-between relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl shadow-lg">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-wide">IGATESECURITY</h2>
              <p className="text-teal-300 text-sm">Smart Community Management</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Forgot Your
                <br />
                <span className="text-teal-300">Password?</span>
              </h1>
              <p className="text-white/70 text-lg max-w-md">
                Don't worry! It happens to the best of us. We'll help you reset it securely.
              </p>
            </div>

            <div className="space-y-4 mt-12">
              {[
                { icon: Mail, text: 'Reset via Email - OTP sent to your registered email' },
                { icon: Smartphone, text: 'Reset via Phone - OTP sent to your mobile' },
                { icon: Shield, text: 'Secure Process - Your data is always protected' },
                { icon: Key, text: 'New Password - Create a strong new password' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <feature.icon className="h-5 w-5 text-teal-300" />
                  </div>
                  <span className="text-white/80">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-sm">
            Need help? Contact support@IGATESECURITY.com
          </p>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 md:p-8 shadow-xl border-0">
            {/* Back Button */}
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-teal-600 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>

            <AnimatePresence mode="wait">
              {/* Step 1: Request OTP */}
              {step === 'request' && (
                <motion.div
                  key="request"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4 shadow-lg shadow-orange-500/30">
                      <Key className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
                      Reset Password
                    </h2>
                    <p className="text-gray-500">
                      Choose how you want to receive your OTP
                    </p>
                  </div>

                  <Tabs value={method} onValueChange={(v) => setMethod(v as 'email' | 'phone')}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="email" className="gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="phone" className="gap-2">
                        <Smartphone className="h-4 w-4" />
                        Phone
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email">
                      <form onSubmit={emailForm.handleSubmit(handleSendOTP)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your registered email"
                              className="pl-10 h-12"
                              {...emailForm.register('email')}
                            />
                          </div>
                          {emailForm.formState.errors.email && (
                            <p className="text-sm text-red-600">{emailForm.formState.errors.email.message}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Sending OTP...
                            </div>
                          ) : (
                            'Send OTP'
                          )}
                        </Button>
                      </form>
                    </TabsContent>

                    <TabsContent value="phone">
                      <form onSubmit={phoneForm.handleSubmit(handleSendOTP)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="Enter your registered phone"
                              className="pl-10 h-12"
                              {...phoneForm.register('phone')}
                            />
                          </div>
                          {phoneForm.formState.errors.phone && (
                            <p className="text-sm text-red-600">{phoneForm.formState.errors.phone.message}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Sending OTP...
                            </div>
                          ) : (
                            'Send OTP'
                          )}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}

              {/* Step 2: Verify OTP */}
              {step === 'verify' && (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
                      Verify OTP
                    </h2>
                    <p className="text-gray-500">
                      Enter the 6-digit code sent to
                    </p>
                    <p className="text-teal-600 font-medium">{identifier}</p>
                  </div>

                  <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        className="h-14 text-center text-2xl tracking-[0.5em] font-mono"
                        maxLength={6}
                        {...otpForm.register('otp')}
                      />
                      {otpForm.formState.errors.otp && (
                        <p className="text-sm text-red-600">{otpForm.formState.errors.otp.message}</p>
                      )}
                      <p className="text-xs text-gray-500 text-center">
                        Demo: Use <span className="font-mono font-bold">123456</span> as OTP
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Verifying...
                        </div>
                      ) : (
                        'Verify OTP'
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-teal-600 hover:text-teal-700"
                        onClick={handleResendOTP}
                      >
                        Didn't receive OTP? Resend
                      </button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setStep('request')}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Change {method}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Reset Password */}
              {step === 'reset' && (
                <motion.div
                  key="reset"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-4 shadow-lg shadow-green-500/30">
                      <Key className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
                      Create New Password
                    </h2>
                    <p className="text-gray-500">
                      Your new password must be different from previous ones
                    </p>
                  </div>

                  <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter new password"
                        className="h-12"
                        {...resetForm.register('password')}
                      />
                      {resetForm.formState.errors.password && (
                        <p className="text-sm text-red-600">{resetForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        className="h-12"
                        {...resetForm.register('confirmPassword')}
                      />
                      {resetForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-600">{resetForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                      <p className="text-xs text-blue-700 font-medium mb-1">Password Requirements:</p>
                      <ul className="text-xs text-blue-600 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• Include at least one number</li>
                        <li>• Include at least one special character</li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Resetting...
                        </div>
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg shadow-green-500/30">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">
                    Password Reset Successful!
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Your password has been reset successfully. You can now login with your new password.
                  </p>
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
                    onClick={() => router.push('/auth/login')}
                  >
                    Go to Login
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-teal-600 hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
