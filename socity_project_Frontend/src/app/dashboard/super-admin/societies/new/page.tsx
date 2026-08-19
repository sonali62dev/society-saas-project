'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Building2,
  ArrowLeft,
  Save,
  CreditCard,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/role-guard'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'
import { INDIAN_STATES, STATE_CITY_MAPPING } from '@/lib/constants'

type BillingPlan = { id: number; name: string; type: string; planType: string; price: string; description?: string; status: string }

export default function AddSocietyPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    units: '',
    plan: 'basic',
    billingPlanId: '' as string,
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminPhone: '',
    discount: '',
  })

  const { data: plans = [], isLoading: plansLoading } = useQuery<BillingPlan[]>({
    queryKey: ['billing-plans'],
    queryFn: async () => {
      const response = await api.get('/billing-plans')
      return Array.isArray(response.data) ? response.data : (response.data?.data ?? [])
    },
  })

  const activePlans = plans.filter((p) => (p.status || '').toLowerCase() === 'active')

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload: Record<string, unknown> = {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        units: data.units,
        plan: data.billingPlanId ? (plans.find((p) => p.id === Number(data.billingPlanId))?.name?.toLowerCase() || 'basic') : data.plan,
      }
      if (data.billingPlanId) payload.billingPlanId = Number(data.billingPlanId)
      if (data.adminName) payload.adminName = data.adminName
      if (data.adminEmail) payload.adminEmail = data.adminEmail
      if (data.adminPassword) payload.adminPassword = data.adminPassword
      if (data.adminPhone) payload.adminPhone = data.adminPhone
      if (data.discount) payload.discount = Number(data.discount)
      const response = await api.post('/society', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-societies'] })
      queryClient.invalidateQueries({ queryKey: ['platform-reports'] })
      toast.success('Society created successfully')
      router.push('/dashboard/super-admin/societies')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create society')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      if (field === 'state') newData.city = '';
      return newData;
    })
  }

  const selectPlan = (planId: string) => {
    setFormData((prev) => ({ ...prev, billingPlanId: planId, plan: 'basic' }))
  }

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/super-admin/societies">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Society</h1>
            <p className="text-gray-600">Register a new society on the platform</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Society Details */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Society Details
              </CardTitle>
              <CardDescription>Basic information about the society</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Society Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter society name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Number of Units *</Label>
                  <Input
                    id="units"
                    type="number"
                    placeholder="e.g., 250"
                    value={formData.units}
                    onChange={(e) => handleChange('units', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount Percentage (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="e.g., 10"
                    value={formData.discount}
                    onChange={(e) => handleChange('discount', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(v) => handleChange('city', v)}
                    disabled={!formData.state}
                  >
                    <SelectTrigger id="city">
                      <SelectValue placeholder={formData.state ? "Select city" : "Select state first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.state && STATE_CITY_MAPPING[formData.state]?.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state} onValueChange={(v) => handleChange('state', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    placeholder="Enter pincode"
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plan - from created plans (Platform Billing > Subscriptions) */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription Plan
              </CardTitle>
              <CardDescription>Select the plan you created in Platform Billing → Subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {plansLoading ? (
                <div className="flex items-center justify-center py-8 gap-2 text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading plans…
                </div>
              ) : activePlans.length === 0 ? (
                <p className="text-center text-amber-600 py-4 bg-amber-50 rounded-lg border border-amber-200">
                  No active plans. Create a plan in <strong>Platform Billing → Subscriptions</strong> first, then come back here.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activePlans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => selectPlan(String(plan.id))}
                      className={`p-4 border-2 rounded-xl text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 relative ${
                        formData.billingPlanId === String(plan.id)
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 line-clamp-1">{plan.name}</h4>
                        <Badge className={`text-[10px] px-1.5 py-0 h-4 ${
                          plan.planType === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                          plan.planType === 'PROFESSIONAL' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {plan.planType || 'BASIC'}
                        </Badge>
                      </div>
                      <div className="mt-1">
                        {formData.discount && parseFloat(formData.discount) > 0 ? (
                          <div className="space-y-0.5">
                            <p className="text-xl font-bold text-purple-600">
                              ₹{Math.round(parseFloat(plan.price) * (1 - parseFloat(formData.discount) / 100)).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              ₹{Number(plan.price).toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xl font-bold text-purple-600">
                            ₹{Number(plan.price).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 mb-2">{plan.type}</p>
                      {plan.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 italic">{plan.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard/super-admin/societies">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={createMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {createMutation.isPending ? 'Creating...' : 'Create Society'}
            </Button>
          </div>
        </form>
      </motion.div>
    </RoleGuard >
  )
}
