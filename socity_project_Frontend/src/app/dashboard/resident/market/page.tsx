'use client'

import { useState, useMemo } from 'react'
import { ShoppingBag, Search, Filter } from 'lucide-react'
import { MarketplaceItemCard } from '@/components/community/marketplace-item-card'
import { CreateListingDialog } from '@/components/community/create-listing-dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { RoleGuard } from '@/components/auth/role-guard'
import { motion, AnimatePresence } from 'framer-motion'

export default function MarketplacePage() {
    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState('all')

    const { data: items = [], isLoading, error } = useQuery({
        queryKey: ['market-items'],
        queryFn: residentService.getMarketItems
    })

    const filteredItems = useMemo(() => {
        return items.filter((item: any) => {
            const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase())
            const matchesTab = activeTab === 'all' || item.type.toLowerCase() === activeTab
            return matchesSearch && matchesTab
        })
    }, [items, search, activeTab])

    if (error) {
        toast.error('Failed to load marketplace items')
    }

    return (
        <RoleGuard allowedRoles={['resident', 'admin', 'super_admin']}>
            <div className="space-y-6 container mx-auto p-6 max-w-7xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-900">
                            <ShoppingBag className="h-8 w-8 text-indigo-600" />
                            Marketplace
                        </h1>
                        <p className="text-muted-foreground">
                            Buy, sell, or request items within your society securely.
                            {items.length > 0 && ` Showing ${filteredItems.length} of ${items.length} items.`}
                        </p>
                    </div>
                    <CreateListingDialog />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border">
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search items..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-gray-100">
                        <TabsTrigger value="all">All Items</TabsTrigger>
                        <TabsTrigger value="sell">For Sale</TabsTrigger>
                        <TabsTrigger value="buy">Requested</TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div key={i} className="space-y-3">
                                        <Skeleton className="h-[200px] w-full rounded-xl" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                <AnimatePresence mode='popLayout'>
                                    {filteredItems.map((item: any) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <MarketplaceItemCard item={item} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
                                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No items found</h3>
                                <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                </Tabs>
            </div>
        </RoleGuard>
    )
}
