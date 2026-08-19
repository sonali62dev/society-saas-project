'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, ShoppingBag, Upload, CheckCircle2, X } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { residentService } from '@/services/resident.service'
import { toast } from 'sonner'

export function CreateListingDialog() {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)

    // Form states
    const [type, setType] = useState('SELL')
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [condition, setCondition] = useState('good')
    const [price, setPrice] = useState('')
    const [priceType, setPriceType] = useState('fixed')
    const [description, setDescription] = useState('')
    const [selectedImage, setSelectedImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const createListingMutation = useMutation({
        mutationFn: (data: any) => residentService.createMarketItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['market-items'] })
            toast.success('Listing posted successfully!')
            setOpen(false)
            resetForm()
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to post listing')
        }
    })

    const resetForm = () => {
        setType('SELL')
        setTitle('')
        setCategory('')
        setCondition('good')
        setPrice('')
        setPriceType('fixed')
        setDescription('')
        setSelectedImage(null)
        setImagePreview(null)
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

    const handleSubmit = () => {
        if (!title || !price || !category) {
            toast.error('Please fill in all required fields')
            return
        }

        createListingMutation.mutate({
            title,
            description,
            price: parseFloat(price),
            condition,
            category,
            type,
            priceType,
            image: selectedImage,
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                    <Plus className="h-4 w-4" />
                    Create Listing
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <ShoppingBag className="h-5 w-5 text-indigo-600" />
                        Post Ad
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-3">
                        <Label>I want to...</Label>
                        <RadioGroup defaultValue="SELL" value={type} onValueChange={setType} className="flex gap-4">
                            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem value="SELL" id="r-sell" />
                                <Label htmlFor="r-sell" className="cursor-pointer font-medium">Sell Item</Label>
                            </div>
                            <div className="flex items-center space-x-2 border p-3 rounded-lg flex-1 cursor-pointer hover:bg-gray-50">
                                <RadioGroupItem value="BUY" id="r-buy" />
                                <Label htmlFor="r-buy" className="cursor-pointer font-medium">Buy / Request</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label>Item Name *</Label>
                        <Input
                            placeholder="e.g. Wooden Sofa, Kids Bicycle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category *</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="furniture">Furniture</SelectItem>
                                    <SelectItem value="electronics">Electronics</SelectItem>
                                    <SelectItem value="vehicles">Vehicles</SelectItem>
                                    <SelectItem value="clothing">Clothing</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Condition</Label>
                            <Select value={condition} onValueChange={setCondition} disabled={type === 'BUY'}>
                                <SelectTrigger>
                                    <SelectValue placeholder={type === 'BUY' ? 'Any' : "Select"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="like_new">Like New</SelectItem>
                                    <SelectItem value="good">Good</SelectItem>
                                    <SelectItem value="fair">Fair</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Price (₹) *</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Price Type</Label>
                            <Select value={priceType} onValueChange={setPriceType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                    <SelectItem value="negotiable">Negotiable</SelectItem>
                                    <SelectItem value="free">Free</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Describe the item, features, usage duration, etc."
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {type === 'SELL' && (
                        <div className="space-y-2">
                            <Label>Upload Photos</Label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageSelect}
                            />
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-40 object-cover rounded-lg border"
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
                            ) : (
                                <div 
                                    className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-8 w-8 mb-2 text-gray-400" />
                                    <span className="text-sm">Click to upload images</span>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="pt-4 border-t mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
                            onClick={handleSubmit}
                            disabled={createListingMutation.isPending}
                        >
                            {createListingMutation.isPending ? 'Posting...' : 'Post Now'}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
