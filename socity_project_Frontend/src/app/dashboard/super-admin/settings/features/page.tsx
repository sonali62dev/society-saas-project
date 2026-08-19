'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Flag,
  ToggleLeft,
  ToggleRight,
  Search,
  Shield,
  Users,
  CreditCard,
  Bell,
  Smartphone,
  Globe,
  Zap,
  Lock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { RoleGuard } from '@/components/auth/role-guard'

const featureFlags = [
  {
    id: 'visitor_management',
    name: 'Visitor Management',
    description: 'Allow societies to manage visitors and gate access',
    category: 'Security',
    icon: Shield,
    enabled: true,
    rollout: 100,
  },
  {
    id: 'online_payments',
    name: 'Online Payments',
    description: 'Enable residents to pay maintenance online',
    category: 'Billing',
    icon: CreditCard,
    enabled: true,
    rollout: 100,
  },
  {
    id: 'push_notifications',
    name: 'Push Notifications',
    description: 'Send real-time notifications to mobile apps',
    category: 'Communication',
    icon: Bell,
    enabled: true,
    rollout: 100,
  },
  {
    id: 'mobile_app_v2',
    name: 'Mobile App V2',
    description: 'New mobile app interface with enhanced features',
    category: 'Mobile',
    icon: Smartphone,
    enabled: true,
    rollout: 75,
  },
  {
    id: 'community_forum',
    name: 'Community Forum',
    description: 'Discussion forum for society members',
    category: 'Community',
    icon: Users,
    enabled: true,
    rollout: 50,
  },
  {
    id: 'ai_chatbot',
    name: 'AI Chatbot',
    description: 'AI-powered helpdesk assistant',
    category: 'Support',
    icon: Zap,
    enabled: false,
    rollout: 0,
  },
  {
    id: 'multi_language',
    name: 'Multi-Language Support',
    description: 'Support for regional languages',
    category: 'Localization',
    icon: Globe,
    enabled: false,
    rollout: 0,
  },
  {
    id: 'biometric_access',
    name: 'Biometric Access',
    description: 'Fingerprint and face recognition for gate access',
    category: 'Security',
    icon: Lock,
    enabled: false,
    rollout: 0,
  },
]

const categories = ['All', 'Security', 'Billing', 'Communication', 'Mobile', 'Community', 'Support', 'Localization']

export default function FeatureFlagsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [features, setFeatures] = useState(featureFlags)

  const filteredFeatures = features.filter((feature) => {
    const matchesSearch =
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || feature.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleToggle = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, enabled: !f.enabled, rollout: f.enabled ? 0 : 100 } : f
      )
    )
  }

  const enabledCount = features.filter((f) => f.enabled).length

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feature Flags</h1>
          <p className="text-gray-600">Control platform features and rollout settings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Flag className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{features.length}</p>
                  <p className="text-sm text-gray-500">Total Features</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ToggleRight className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{enabledCount}</p>
                  <p className="text-sm text-gray-500">Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ToggleLeft className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{features.length - enabledCount}</p>
                  <p className="text-sm text-gray-500">Disabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? 'bg-purple-600' : ''}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features List */}
        <div className="grid gap-4">
          {filteredFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.id} className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${feature.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Icon className={`h-6 w-6 ${feature.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{feature.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {feature.category}
                          </Badge>
                          {feature.rollout > 0 && feature.rollout < 100 && (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">
                              {feature.rollout}% Rollout
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {feature.enabled && (
                        <div className="text-right mr-4">
                          <p className="text-xs text-gray-500">Rollout</p>
                          <p className="font-medium">{feature.rollout}%</p>
                        </div>
                      )}
                      <Switch checked={feature.enabled} onCheckedChange={() => handleToggle(feature.id)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredFeatures.length === 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-8 text-center">
              <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No features found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </RoleGuard>
  )
}
