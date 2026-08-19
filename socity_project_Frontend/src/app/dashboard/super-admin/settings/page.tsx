'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Shield,
  Bell,
  Globe,
  Mail,
  Key,
  Database,
  Smartphone,
  Save,
  Bot,
  CreditCard,
  ShieldCheck,
  Package,
  Receipt,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RoleGuard } from '@/components/auth/role-guard'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function SystemSettingsPage() {
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState({
    platformName: 'Societly Platform',
    supportEmail: 'support@societly.com',
    maintenanceMode: false,
    newRegistrations: true,
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    twoFactorRequired: false,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    enableKiaanAI: true,
    enableOnlinePayment: true,
    enableVisitorPass: true,
    enableParcelTracking: true,
    enableNoticeBoard: true,
    enableBillingModule: true,
  })

  const { data: backendSettings = {}, isLoading } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const response = await api.get('/settings')
      return response?.data ?? {}
    }
  })

  useEffect(() => {
    if (backendSettings && Object.keys(backendSettings).length > 0) {
      setSettings(prev => ({
        ...prev,
        ...backendSettings,
        maintenanceMode: backendSettings.maintenanceMode === 'true',
        newRegistrations: backendSettings.newRegistrations === 'true',
        emailNotifications: backendSettings.emailNotifications === 'true',
        smsNotifications: backendSettings.smsNotifications === 'true',
        pushNotifications: backendSettings.pushNotifications === 'true',
        twoFactorRequired: backendSettings.twoFactorRequired === 'true',
        enableKiaanAI: backendSettings.enableKiaanAI !== 'false',
        enableOnlinePayment: backendSettings.enableOnlinePayment !== 'false',
        enableVisitorPass: backendSettings.enableVisitorPass !== 'false',
        enableParcelTracking: backendSettings.enableParcelTracking !== 'false',
        enableNoticeBoard: backendSettings.enableNoticeBoard !== 'false',
        enableBillingModule: backendSettings.enableBillingModule !== 'false',
      }))
    }
  }, [backendSettings])

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/settings', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] })
      toast.success('System settings updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to save settings')
    }
  })

  const handleToggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  const handleSave = () => {
    saveSettingsMutation.mutate(settings)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600">Configure platform-wide settings and preferences</p>
          </div>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSave}
            disabled={saveSettingsMutation.isPending}
          >
            {saveSettingsMutation.isPending ? 'Saving...' : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-white border">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Platform Configuration
                </CardTitle>
                <CardDescription>Basic platform settings and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={settings.platformName}
                      onChange={(e) => setSettings((prev) => ({ ...prev, platformName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-gray-900">Maintenance Mode</p>
                      <p className="text-sm text-gray-600">Temporarily disable the platform for maintenance</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={() => handleToggle('maintenanceMode')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Allow New Registrations</p>
                      <p className="text-sm text-gray-600">Allow new societies to register on the platform</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.newRegistrations}
                    onCheckedChange={() => handleToggle('newRegistrations')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure authentication and security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings((prev) => ({ ...prev, sessionTimeout: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => setSettings((prev) => ({ ...prev, maxLoginAttempts: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Require Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">Require 2FA for all society admins</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.twoFactorRequired}
                    onCheckedChange={() => handleToggle('twoFactorRequired')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure platform-wide notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Send email notifications to users</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleToggle('emailNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Send SMS notifications to users</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={() => handleToggle('smsNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-600">Send push notifications to mobile apps</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={() => handleToggle('pushNotifications')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  Feature Flags & Global Controls
                </CardTitle>
                <CardDescription>Enable or disable platform features globally across all societies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3">
                    <Bot className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900">Kiaan AI Assistant</p>
                      <p className="text-sm text-gray-600">Enable AI chatbot assistant globally for all societies & residents</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.enableKiaanAI}
                    onCheckedChange={() => handleToggle('enableKiaanAI')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-gray-900">Online Payment Gateway</p>
                      <p className="text-sm text-gray-600">Enable Razorpay & UPI payment processing</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.enableOnlinePayment}
                    onCheckedChange={() => handleToggle('enableOnlinePayment')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Visitor Security & Gatekeeper</p>
                      <p className="text-sm text-gray-600">Enable gate visitor entry logs and security passes</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.enableVisitorPass}
                    onCheckedChange={() => handleToggle('enableVisitorPass')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Parcel Management</p>
                      <p className="text-sm text-gray-600">Enable gate parcel tracking & pickup alerts</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.enableParcelTracking}
                    onCheckedChange={() => handleToggle('enableParcelTracking')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-gray-900">Automated Billing & Accounting</p>
                      <p className="text-sm text-gray-600">Enable maintenance bill generation and ledgers</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.enableBillingModule}
                    onCheckedChange={() => handleToggle('enableBillingModule')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </RoleGuard>
  )
}
