'use client'

import { ShoppingBag, MessageCircle, Tag, Clock } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MarketplaceItem } from '@/types/community'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface MarketplaceItemCardProps {
    item: MarketplaceItem
}

export function MarketplaceItemCard({ item }: any) {
    const router = useRouter()
    const { user } = useAuthStore()
    const queryClient = useQueryClient()
    const owner = item.owner || {}
    const unit = owner.ownedUnits?.[0] ? `${owner.ownedUnits[0].block}-${owner.ownedUnits[0].number}` : 'No Unit'
    const isSell = item.type?.toUpperCase() === 'SELL'
    const isOwner = user?.id === owner.id

    const deleteMutation = useMutation({
        mutationFn: () => residentService.deleteMarketItem(item.id),
        onSuccess: () => {
            toast.success('Item deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['market-items'] })
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Failed to delete item')
        }
    })

    const handleChatClick = () => {
        if (owner.id) {
            const params = new URLSearchParams({
                userId: String(owner.id),
                itemId: String(item.id),
                itemTitle: item.title || '',
                itemPrice: String(item.price ?? ''),
                itemImage: (item.images && item.images[0]) ? item.images[0] : '',
            })
            router.push(`/dashboard/helpdesk/chat?${params.toString()}`)
        } else {
            toast.error('Unable to start chat. Seller information not available.')
        }
    }

    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-md flex flex-col h-full">
            <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                    <ShoppingBag className="h-12 w-12 text-gray-300" />
                )}
                <Badge className={`absolute top-3 right-3 ${isSell ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
                    {isSell ? 'FOR SALE' : 'WANTED'}
                </Badge>
                
                {isOwner && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-3 left-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete this item?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your marketplace listing.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={() => deleteMutation.mutate()}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            <CardContent className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="capitalize text-xs">{item.category}</Badge>
                    {item.condition && <span className="text-xs text-gray-500 capitalize">{item.condition.replace('_', ' ')}</span>}
                </div>

                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.title}</h3>
                <p className="text-xl font-bold text-indigo-600 mt-1">
                    ₹{item.price?.toLocaleString()}
                    {item.priceType && <span className="text-xs font-normal text-gray-500 ml-1 capitalize">({item.priceType})</span>}
                </p>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2 min-h-[40px]">{item.description}</p>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Avatar className="h-6 w-6">
                        <AvatarFallback>{owner.name ? owner.name[0] : 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                        <p className="font-medium">{owner.name || 'Unknown Seller'}</p>
                        <p className="text-gray-500">{unit}</p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 bg-gray-50">
                {isOwner ? (
                    <div className="w-full py-2.5 text-center text-sm font-medium text-gray-500 rounded-lg bg-gray-100">
                        Your listing
                    </div>
                ) : (
                    <Button 
                        className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
                        onClick={handleChatClick}
                    >
                        <MessageCircle className="h-4 w-4" />
                        Chat with {isSell ? 'Seller' : 'Buyer'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
