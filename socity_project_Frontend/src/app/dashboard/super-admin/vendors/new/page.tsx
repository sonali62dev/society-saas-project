'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Save, X, Phone, Mail, Shield, Lock, MapPin } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { RoleGuard } from '@/components/auth/role-guard'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function NewPlatformVendorPage() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact: '',
        serviceType: '',
        password: '',
        servicePincodes: '' 
    })

    const createVendorMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/vendors', data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['super-admin-vendors'] })
            queryClient.invalidateQueries({ queryKey: ['vendor-stats'] })
            queryClient.invalidateQueries({ queryKey: ['platform-reports'] })
            toast.success('Platform vendor created successfully')
            router.push('/dashboard/super-admin/vendors')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to create vendor')
        }
    })

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const pins = (formData.servicePincodes || '').trim()
        if (!pins) {
            toast.error('Serviceable PIN Codes are required. Individual customers are assigned to vendors by their PIN code.')
            return
        }
        const parts = pins.split(',').map((s) => s.trim()).filter(Boolean)
        if (parts.length === 0) {
            toast.error('Enter at least one PIN code or range (e.g. 110001, 110010-110020).')
            return
        }
        createVendorMutation.mutate(formData)
    }

    return (
        <RoleGuard allowedRoles={['super_admin']}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-6"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-display">Add Platform Vendor</h1>
                        <p className="text-gray-500 mt-1 font-medium">Create a new vendor owned and managed by the platform</p>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="rounded-xl hover:bg-gray-100"
                    >
                        <X className="h-5 w-5 mr-2" />
                        Cancel
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-0 shadow-sm bg-white rounded-[40px] ring-1 ring-black/5 overflow-hidden">
                        <CardHeader className="p-8 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle>Vendor Information</CardTitle>
                                    <CardDescription>Basic details about the service provider</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Business Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., Mega Power Solutions"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="rounded-xl border-gray-200"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Service Category *</Label>
                                    <Select
                                        value={formData.serviceType}
                                        onValueChange={(val) => handleChange('serviceType', val)}
                                        required
                                    >
                                        <SelectTrigger className="rounded-xl border-gray-200">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="electrician">Electrician</SelectItem>
                                            <SelectItem value="plumber">Plumber</SelectItem>
                                            <SelectItem value="carpenter">Carpenter</SelectItem>
                                            <SelectItem value="cleaner">Cleaning Services</SelectItem>
                                            <SelectItem value="security">Security</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <Label htmlFor="servicePincodes" className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4 text-purple-500" />
                                        Serviceable PIN Codes <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="servicePincodes"
                                        placeholder="e.g. 110001, 110002, 110010-110020 (comma-separated or range)"
                                        value={formData.servicePincodes}
                                        onChange={(e) => handleChange('servicePincodes', e.target.value)}
                                        className="rounded-xl border-gray-200"
                                        required
                                    />
                                    <p className="text-xs text-gray-500">
                                        Required for assigning individual customers by location. Individual user PIN code is matched against these to auto-assign this vendor.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Official Email *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="contact@vendor.com"
                                            className="pl-10 rounded-xl border-gray-200"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Contact Phone *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            className="pl-10 rounded-xl border-gray-200"
                                            value={formData.contact}
                                            onChange={(e) => handleChange('contact', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-white rounded-[40px] ring-1 ring-black/5 overflow-hidden">
                        <CardHeader className="p-8 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle>Vendor Login Credentials</CardTitle>
                                    <CardDescription>Vendor will log in with the Official Email above and the password below</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-2 max-w-md">
                                <Label htmlFor="password">Password *</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        minLength={6}
                                        className="pl-10 rounded-xl border-gray-200"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500">Minimum 6 characters. Vendor uses this with their Official Email to sign in.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="rounded-2xl px-6 border-gray-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl px-8 shadow-lg shadow-purple-200"
                        >
                            <Save className="h-5 w-5 mr-2" />
                            Create Platform Vendor
                        </Button>
                    </div>
                </form>
            </motion.div>
        </RoleGuard>
    )
}
