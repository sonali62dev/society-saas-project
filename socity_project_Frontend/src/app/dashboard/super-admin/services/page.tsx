'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Wrench,
    Search,
    Plus,
    ArrowRight,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Building2,
    Trash2,
    Edit2,
    X,
    IndianRupee,
    Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { iconMap } from '@/lib/constants/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import toast from 'react-hot-toast'

// Local types if needed or just use any for now but let's try to be clean
interface ServiceVariant {
    id: string;
    name: string;
    price: string;
    description?: string;
}

interface ServiceCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    variants: ServiceVariant[];
}

export default function AdminServicesPage() {
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')
    const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null)

    const { data: categories = [], isLoading } = useQuery<ServiceCategory[]>({
        queryKey: ['service-categories'],
        queryFn: async () => {
            const response = await api.get('/services/categories')
            return response.data
        }
    })

    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/services/categories', data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-categories'] })
            toast.success('Service category created')
            setIsAddServiceOpen(false)
        }
    })

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: any }) => {
            const response = await api.put(`/services/categories/${id}`, data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-categories'] })
            toast.success('Service category updated')
            setIsAddServiceOpen(false)
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/services/categories/${id}`)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['service-categories'] })
            toast.success('Service category deleted')
        }
    })

    // New Service Form State
    const [formData, setFormData] = useState<Partial<ServiceCategory>>({
        name: '',
        description: '',
        icon: 'Wrench', // Default icon
        color: 'blue',  // Default color
        variants: []
    })

    // New Variant Form State
    const [newVariant, setNewVariant] = useState<Partial<ServiceVariant>>({
        name: '',
        price: '',
        description: ''
    })

    // Filtered categories
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleOpenAdd = () => {
        setEditingCategory(null)
        setFormData({
            name: '',
            description: '',
            icon: 'Wrench',
            color: 'blue',
            variants: []
        })
        setIsAddServiceOpen(true)
    }

    const handleOpenEdit = (category: ServiceCategory) => {
        setEditingCategory(category)
        setFormData({ ...category })
        setIsAddServiceOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this service category?')) {
            deleteMutation.mutate(id)
        }
    }

    const handleSaveService = () => {
        if (!formData.name || !formData.description) return

        const categoryData = {
            id: editingCategory ? editingCategory.id : formData.name!.toLowerCase().replace(/\s+/g, '_'),
            name: formData.name!,
            description: formData.description!,
            icon: editingCategory ? editingCategory.icon : 'Wrench',
            color: editingCategory ? editingCategory.color : 'blue',
            variants: formData.variants || []
        }

        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory.id, data: categoryData })
        } else {
            createMutation.mutate(categoryData)
        }
    }

    const handleAddVariant = () => {
        if (!newVariant.name || !newVariant.price) return

        setFormData((prev: any) => ({
            ...prev,
            variants: [...(prev.variants || []), {
                id: Math.random().toString(36).substr(2, 9),
                name: newVariant.name!,
                price: newVariant.price!,
                description: newVariant.description || ''
            } as ServiceVariant]
        }))

        setNewVariant({
            name: '',
            price: '',
            description: ''
        })
    }

    const handleRemoveVariant = (index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            variants: prev.variants?.filter((_: any, i: number) => i !== index)
        }))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Services</h1>
                    <p className="text-gray-600 mt-1">Manage society services and rate cards</p>
                </div>
                <Button
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white"
                    onClick={handleOpenAdd}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Service
                </Button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search services..."
                        className="pl-9 bg-gray-50 border-gray-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Service Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
                    </div>
                ) : filteredCategories.map((category: ServiceCategory) => {
                    const Icon = (iconMap as any)[category.icon] || Building2

                    return (
                        <Card key={category.id} className="border-0 shadow-md hover:shadow-lg transition-all group overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                                    <div className="flex justify-between items-start">
                                        <div className="p-3 rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                                            <Icon className="h-6 w-6 text-teal-600" />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/50">
                                                    <MoreVertical className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(category)}>
                                                    <Edit2 className="h-4 w-4 mr-2" />
                                                    Edit Service
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(category.id)}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Service
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mt-4">{category.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
                                </div>

                                <div className="p-4 bg-white border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm mb-3">
                                        <span className="text-gray-500 font-medium">Service Variants</span>
                                        <Badge variant="secondary" className="bg-teal-50 text-teal-700">
                                            {category.variants?.length || 0} Types
                                        </Badge>
                                    </div>

                                    {/* Preview of variants */}
                                    <div className="space-y-2">
                                        {category.variants?.slice(0, 3).map((variant, i) => (
                                            <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-gray-50 last:border-0">
                                                <span className="text-gray-700 truncate max-w-[140px]">{variant.name}</span>
                                                <span className="font-semibold text-gray-900">{variant.price}</span>
                                            </div>
                                        ))}
                                        {(category.variants?.length || 0) > 3 && (
                                            <p className="text-xs text-center text-gray-400 pt-1">+{category.variants!.length - 3} more</p>
                                        )}
                                        {(!category.variants || category.variants.length === 0) && (
                                            <p className="text-xs text-center text-gray-400 italic">No variants added</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Add/Edit Service Dialog */}
            <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                        <DialogDescription>
                            {editingCategory ? 'Update service details and rate card.' : 'Create a new service category (e.g., Plumbing) and add its sub-services.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto px-1">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <Label>Service Category Name</Label>
                                <Input
                                    placeholder="e.g. Electrician, Plumbing, Cleaning"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Brief description of what this service covers..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Variants / Rate Card */}
                        <div className="space-y-4 border-t pt-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-teal-600" />
                                    Service Sub-Types / Rate Card
                                </h4>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                                <div className="grid grid-cols-5 gap-3">
                                    <div className="space-y-1 col-span-3">
                                        <Label className="text-xs text-gray-500">Service Type Name</Label>
                                        <Input
                                            placeholder="e.g. Fan Repair"
                                            value={newVariant.name}
                                            onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                                            className="bg-white"
                                        />
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <Label className="text-xs text-gray-500">Price</Label>
                                        <div className="relative">
                                            <IndianRupee className="h-3 w-3 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <Input
                                                placeholder="500"
                                                value={newVariant.price}
                                                onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                                                className="bg-white pl-8"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full bg-gray-900 text-white hover:bg-gray-800"
                                    onClick={handleAddVariant}
                                    disabled={!newVariant.name || !newVariant.price}
                                >
                                    <Plus className="h-3 w-3 mr-2" />
                                    Add to Rate Card
                                </Button>
                            </div>

                            {/* List of added variants */}
                            <div className="space-y-2">
                                {formData.variants?.map((variant: ServiceVariant, index: number) => (
                                    <div key={index} className="flex items-center justify-between bg-white border p-3 rounded-lg shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                                                <CheckCircle2 className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{variant.name}</p>
                                                <p className="text-xs text-gray-500">{variant.price}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={() => handleRemoveVariant(index)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {(!formData.variants || formData.variants.length === 0) && (
                                    <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-lg">
                                        <p className="text-sm text-gray-400">No service types added yet.</p>
                                        <p className="text-xs text-gray-300">Add variants above to build the rate card.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddServiceOpen(false)}>Cancel</Button>
                        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white" onClick={handleSaveService}>
                            {editingCategory ? 'Update Changes' : 'Create Service'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
