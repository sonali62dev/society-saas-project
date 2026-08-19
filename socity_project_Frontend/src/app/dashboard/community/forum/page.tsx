'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Plus,
  Search,
  ThumbsUp,
  MessageCircle,
  Eye,
  Pin,
  Clock,
  User,
  Tag,
  Filter,
  TrendingUp,
  Bell,
  BookOpen,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const forumPosts = [
  {
    id: 1,
    title: 'Proposal: Community Garden Initiative',
    content: 'Hi everyone! I would like to propose starting a community garden in the unused space near Block C. This would be a great way for residents to connect and grow fresh vegetables. Looking for volunteers to help set this up.',
    author: 'Rahul Sharma',
    unit: 'A-501',
    category: 'Proposals',
    createdAt: '2025-12-18T10:30:00',
    likes: 24,
    comments: 12,
    views: 156,
    isPinned: true,
    isHot: true,
    tags: ['garden', 'community', 'initiative'],
  },
  {
    id: 2,
    title: 'Water Supply Issue - Block B',
    content: 'We have been experiencing low water pressure in Block B for the past 3 days. Has anyone else noticed this? Should we escalate to the management committee?',
    author: 'Priya Patel',
    unit: 'B-203',
    category: 'Issues',
    createdAt: '2025-12-17T15:45:00',
    likes: 18,
    comments: 23,
    views: 245,
    isPinned: false,
    isHot: true,
    tags: ['water', 'block-b', 'maintenance'],
  },
  {
    id: 3,
    title: 'Weekend Football Match - Sunday 6 PM',
    content: 'Organizing a friendly football match this Sunday at 6 PM in the society ground. All skill levels welcome! Please comment if you want to join.',
    author: 'Amit Singh',
    unit: 'C-102',
    category: 'Events',
    createdAt: '2025-12-16T09:00:00',
    likes: 31,
    comments: 28,
    views: 189,
    isPinned: false,
    isHot: false,
    tags: ['sports', 'football', 'weekend'],
  },
  {
    id: 4,
    title: 'Lost: Orange Tabby Cat - Please Help!',
    content: 'Our cat "Milo" went missing yesterday evening near Block D. He is an orange tabby with a blue collar. If anyone spots him, please contact me immediately. Reward offered.',
    author: 'Sneha Kapoor',
    unit: 'D-405',
    category: 'Lost & Found',
    createdAt: '2025-12-15T20:15:00',
    likes: 45,
    comments: 34,
    views: 312,
    isPinned: true,
    isHot: false,
    tags: ['lost', 'pet', 'urgent'],
  },
  {
    id: 5,
    title: 'Diwali Decoration Competition Results',
    content: 'Thank you everyone for participating in the Diwali decoration competition! The results are in: 1st Place - A-302, 2nd Place - B-501, 3rd Place - C-201. Congratulations to all winners!',
    author: 'Society Admin',
    unit: 'Admin',
    category: 'Announcements',
    createdAt: '2025-12-14T11:00:00',
    likes: 67,
    comments: 15,
    views: 423,
    isPinned: false,
    isHot: false,
    tags: ['diwali', 'competition', 'results'],
  },
  {
    id: 6,
    title: 'Recommending a Good Plumber',
    content: 'I recently used a plumber for bathroom renovation and he did an excellent job. Sharing his contact for anyone who needs: Raju - 98765 00000. Reasonable rates and quality work.',
    author: 'Vikram Mehta',
    unit: 'A-102',
    category: 'Recommendations',
    createdAt: '2025-12-13T14:30:00',
    likes: 22,
    comments: 8,
    views: 134,
    isPinned: false,
    isHot: false,
    tags: ['plumber', 'recommendation', 'service'],
  },
]

const categories = [
  { name: 'All', count: forumPosts.length },
  { name: 'Announcements', count: 1 },
  { name: 'Proposals', count: 1 },
  { name: 'Issues', count: 1 },
  { name: 'Events', count: 1 },
  { name: 'Lost & Found', count: 1 },
  { name: 'Recommendations', count: 1 },
]

export default function CommunityForumPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Announcements': 'bg-blue-100 text-blue-800',
      'Proposals': 'bg-purple-100 text-purple-800',
      'Issues': 'bg-red-100 text-red-800',
      'Events': 'bg-green-100 text-green-800',
      'Lost & Found': 'bg-orange-100 text-orange-800',
      'Recommendations': 'bg-teal-100 text-teal-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    }
  }

  const stats = [
    { label: 'Total Posts', value: forumPosts.length, icon: MessageSquare, color: 'bg-blue-500' },
    { label: 'This Week', value: 4, icon: Clock, color: 'bg-green-500' },
    { label: 'Active Discussions', value: 3, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'My Posts', value: 2, icon: User, color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-indigo-600" />
            Community Forum
          </h1>
          <p className="text-gray-600 mt-1">Connect with your neighbors and share updates</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Categories
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === cat.name
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Filters */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select defaultValue="latest">
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="comments">Most Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {forumPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-indigo-100 text-indigo-600">
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {post.isPinned && (
                              <Pin className="h-3 w-3 text-indigo-600" />
                            )}
                            {post.isHot && (
                              <Badge className="bg-red-100 text-red-800 text-xs">Hot</Badge>
                            )}
                            <Badge className={`text-xs ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-gray-900 hover:text-indigo-600">
                            {post.title}
                          </h3>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{post.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span className="font-medium">{post.author}</span>
                          <span>•</span>
                          <span>{post.unit}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" /> {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" /> {post.comments}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {post.views}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" /> {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
