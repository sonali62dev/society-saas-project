'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  ShoppingBag,
  Plus,
  Search,
  Heart,
  MessageCircle,
  MapPin,
  Clock,
  User,
  Filter,
  Grid,
  List,
  Tag,
  Phone,
  IndianRupee,
  X,
  ImageIcon,
  Trash2,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { RoleGuard } from '@/components/auth/role-guard'

const listings = [
  {
    id: 1,
    title: 'Sony Bravia 55" 4K Smart TV',
    description: 'Excellent condition, 2 years old. Comes with original remote and wall mount bracket. Selling due to upgrade.',
    price: 35000,
    originalPrice: 75000,
    category: 'Electronics',
    condition: 'Like New',
    images: ['/placeholder-tv.jpg'],
    seller: {
      name: 'Rahul Sharma',
      unit: 'A-501',
      phone: '+91 98765 43210',
      rating: 4.8,
    },
    postedAt: '2025-12-17',
    views: 45,
    likes: 12,
    status: 'available',
  },
  {
    id: 2,
    title: 'Ikea Study Table with Chair',
    description: 'Wooden study table with ergonomic chair. Perfect for work from home setup. Minor scratches on the surface.',
    price: 8000,
    originalPrice: 15000,
    category: 'Furniture',
    condition: 'Good',
    images: ['/placeholder-table.jpg'],
    seller: {
      name: 'Priya Patel',
      unit: 'B-203',
      phone: '+91 98765 11111',
      rating: 4.5,
    },
    postedAt: '2025-12-16',
    views: 32,
    likes: 8,
    status: 'available',
  },
  {
    id: 3,
    title: 'Kids Bicycle - Hero Blast',
    description: 'Suitable for 5-8 year olds. Used for 1 year, in great condition. Training wheels included.',
    price: 2500,
    originalPrice: 5500,
    category: 'Kids',
    condition: 'Good',
    images: ['/placeholder-bike.jpg'],
    seller: {
      name: 'Amit Singh',
      unit: 'C-102',
      phone: '+91 98765 22222',
      rating: 4.9,
    },
    postedAt: '2025-12-15',
    views: 67,
    likes: 15,
    status: 'sold',
  },
  {
    id: 4,
    title: 'Samsung Refrigerator 340L',
    description: 'Double door frost-free refrigerator. 3 years old, works perfectly. Moving out, hence selling.',
    price: 18000,
    originalPrice: 38000,
    category: 'Appliances',
    condition: 'Good',
    images: ['/placeholder-fridge.jpg'],
    seller: {
      name: 'Sneha Kapoor',
      unit: 'D-405',
      phone: '+91 98765 33333',
      rating: 4.7,
    },
    postedAt: '2025-12-14',
    views: 89,
    likes: 23,
    status: 'available',
  },
  {
    id: 5,
    title: 'Yoga Mat + Resistance Bands Set',
    description: 'Premium yoga mat (6mm thick) with carrying bag and set of 5 resistance bands. Never used.',
    price: 1200,
    originalPrice: 2500,
    category: 'Sports',
    condition: 'New',
    images: ['/placeholder-yoga.jpg'],
    seller: {
      name: 'Vikram Mehta',
      unit: 'A-102',
      phone: '+91 98765 44444',
      rating: 4.6,
    },
    postedAt: '2025-12-13',
    views: 28,
    likes: 6,
    status: 'available',
  },
  {
    id: 6,
    title: 'Books Collection - Fiction & Self-Help',
    description: 'Collection of 25+ books including bestsellers from various authors. Take all for the mentioned price.',
    price: 800,
    originalPrice: null,
    category: 'Books',
    condition: 'Good',
    images: ['/placeholder-books.jpg'],
    seller: {
      name: 'Neha Gupta',
      unit: 'B-401',
      phone: '+91 98765 55555',
      rating: 4.4,
    },
    postedAt: '2025-12-12',
    views: 41,
    likes: 9,
    status: 'available',
  },
]

const categories = [
  'All',
  'Electronics',
  'Furniture',
  'Appliances',
  'Kids',
  'Sports',
  'Books',
  'Clothing',
  'Others',
]

export default function MarketplacePage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isSellOpen, setIsSellOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sellForm, setSellForm] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    condition: 'Good',
  })

  const { data: marketItems, isLoading, error } = useQuery({
    queryKey: ['market-items'],
    queryFn: residentService.getMarketItems
  })

  const createItemMutation = useMutation({
    mutationFn: residentService.createMarketItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-items'] })
      setIsSellOpen(false)
      setSellForm({
        title: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'Electronics',
        condition: 'Good',
      })
      setSelectedImage(null)
      setImagePreview(null)
      toast.success('Item listed successfully!')
    },
    onError: (err: any) => toast.error(err.message || 'Failed to list item')
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      residentService.updateMarketItemStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-items'] })
      toast.success('Status updated successfully!')
    },
    onError: () => toast.error('Failed to update status')
  })

  const deleteItemMutation = useMutation({
    mutationFn: residentService.deleteMarketItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-items'] })
      toast.success('Item deleted successfully!')
    },
    onError: () => toast.error('Failed to delete item')
  })

  const items = marketItems || []

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createItemMutation.mutate({
      ...sellForm,
      image: selectedImage
    })
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN').format(price)
  }

  const getConditionBadge = (condition: string) => {
    const colors: Record<string, string> = {
      'New': 'bg-green-100 text-green-800',
      'Like New': 'bg-blue-100 text-blue-800',
      'Good': 'bg-yellow-100 text-yellow-800',
      'Fair': 'bg-orange-100 text-orange-800',
    }
    return colors[condition] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) return <div className="p-8"><Skeleton className="w-full h-[600px] rounded-3xl" /></div>
  if (error) return <div className="p-8 text-red-500">Error loading items</div>

  const filteredItems = items.filter((item: any) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <RoleGuard allowedRoles={['resident', 'committee', 'admin', 'super_admin', 'society_admin']}>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-emerald-600" />
              Buy & Sell Marketplace
            </h1>
            <p className="text-gray-600 mt-1">Buy and sell items within your community</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" className="gap-2">
              <Heart className="h-4 w-4" />
              Saved
            </Button>
            <Dialog open={isSellOpen} onOpenChange={setIsSellOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4" />
                  Sell Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>List an Item for Sale</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSellSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="What are you selling?"
                      value={sellForm.title}
                      onChange={e => setSellForm({ ...sellForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Price (₹)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={sellForm.price}
                        onChange={e => setSellForm({ ...sellForm, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Original Price (Optional)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={sellForm.originalPrice}
                        onChange={e => setSellForm({ ...sellForm, originalPrice: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={sellForm.category}
                        onValueChange={v => setSellForm({ ...sellForm, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(c => c !== 'All').map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <Select
                        value={sellForm.condition}
                        onValueChange={v => setSellForm({ ...sellForm, condition: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Tell buyers more about the item..."
                      value={sellForm.description}
                      onChange={e => setSellForm({ ...sellForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Image (Optional)</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-4 w-4" />
                      {selectedImage ? 'Change Image' : 'Add Image'}
                    </Button>
                    {imagePreview && (
                      <div className="relative inline-block w-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-32 w-full object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 rounded-full"
                          onClick={removeImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsSellOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={createItemMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700">
                      {createItemMutation.isPending ? 'Listing...' : 'List Item'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Listings Grid */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredItems.map((listing: any, index: number) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Card className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${listing.status === 'sold' ? 'opacity-60' : ''}`}>
                    {viewMode === 'grid' ? (
                      <>
                        {/* Image Placeholder */}
                        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag className="h-16 w-16 text-gray-400" />
                          </div>
                          {listing.status === 'sold' && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge className="bg-red-600 text-white text-lg px-4 py-1">SOLD</Badge>
                            </div>
                          )}
                          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
                            <Heart className="h-4 w-4 text-gray-600" />
                          </button>
                          <Badge className={`absolute top-2 left-2 ${getConditionBadge(listing.condition || 'Good')}`}>
                            {listing.condition || 'Good'}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline" className="text-xs">{listing.category}</Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(listing.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{listing.title}</h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-bold text-emerald-600 flex items-center">
                              <IndianRupee className="h-4 w-4" />{formatPrice(listing.price || 0)}
                            </span>
                            {listing.originalPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                ₹{formatPrice(listing.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {listing.owner?.unit || 'Resident'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Heart className="h-3 w-3" /> {listing.likes || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex p-4 gap-4">
                        <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ShoppingBag className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">{listing.category}</Badge>
                            <Badge className={`text-xs ${getConditionBadge(listing.condition || 'Good')}`}>{listing.condition || 'Good'}</Badge>
                            {listing.status === 'sold' && <Badge variant="destructive">Sold</Badge>}
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{listing.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-emerald-600 flex items-center">
                              <IndianRupee className="h-4 w-4" />{formatPrice(listing.price || 0)}
                            </span>
                            <span className="text-xs text-gray-500">{listing.owner?.unit || 'Resident'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{listing.title}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-20 w-20 text-gray-400" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-emerald-600 flex items-center">
                          <IndianRupee className="h-5 w-5" />{formatPrice(listing.price || 0)}
                        </span>
                        {listing.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            ₹{formatPrice(listing.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{listing.category}</Badge>
                        <Badge className={getConditionBadge(listing.condition || 'Good')}>{listing.condition || 'Good'}</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-600">{listing.description}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Seller Information</h4>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-emerald-100 text-emerald-600">
                            {listing.owner?.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{listing.owner?.name || 'Resident'}</p>
                          <p className="text-sm text-gray-500">{listing.owner?.unit || 'Resident'}</p>
                        </div>
                      </div>
                    </div>
                    {listing.status === 'AVAILABLE' && (
                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700">
                          <MessageCircle className="h-4 w-4" /> Chat with Seller
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <Phone className="h-4 w-4" /> Call
                        </Button>
                        <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100 mt-6">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No items found</h3>
            <p className="text-gray-400 mt-2 max-w-xs mx-auto">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </RoleGuard>
  )
}
