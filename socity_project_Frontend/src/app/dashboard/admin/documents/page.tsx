'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
    FileText,
    Search,
    Plus,
    Filter,
    Download,
    Eye,
    Trash2,
    FolderOpen,
    Shield,
    Home,
    Clock,
    MoreVertical,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DocumentService } from '@/services/document.service'

const societyDocuments = [
    { id: 'DOC-001', name: 'Society Bylaws 2024.pdf', type: 'Legal', size: '2.4 MB', date: '2024-12-01', visibility: 'all' },
    { id: 'DOC-002', name: 'Registration Certificate.jpg', type: 'Certificate', size: '1.1 MB', date: '2024-10-15', visibility: 'committee' },
    { id: 'DOC-003', name: 'Fire Safety Insurance.pdf', type: 'Insurance', size: '4.5 MB', date: '2024-11-20', visibility: 'committee' },
    { id: 'DOC-004', name: 'Annual Audit Report 2023.pdf', type: 'Finance', size: '3.8 MB', date: '2024-08-05', visibility: 'all' },
]

const unitDocuments = [
    { id: 'UDOC-001', unit: 'A-101', name: 'Possession Letter.pdf', type: 'Possession', size: '1.2 MB', date: '2024-01-10' },
    { id: 'UDOC-002', unit: 'B-205', name: 'Maintenance Bill - Dec 2024.pdf', type: 'Bill', size: '0.5 MB', date: '2025-01-02' },
    { id: 'UDOC-003', unit: 'C-301', name: 'Khata Certificate.pdf', type: 'Legal', size: '2.1 MB', date: '2024-05-20' },
    { id: 'UDOC-004', unit: 'A-101', name: 'NOC for Renovation.pdf', type: 'NOC', size: '0.8 MB', date: '2024-11-12' },
]

export default function DocumentsPage() {
    const [activeTab, setActiveTab] = useState('society')
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const queryClient = useQueryClient()

    const { data: apiDocs = [], isLoading } = useQuery({
        queryKey: ['documents'],
        queryFn: () => DocumentService.getAll()
    })

    const documents = (Array.isArray(apiDocs) ? apiDocs : apiDocs?.data || []) as any[]

    const [newDoc, setNewDoc] = useState({ title: '', category: 'legal', visibility: 'all', file: '' })
    const [uploading, setUploading] = useState(false)

    const handleDownload = async (url: string, title: string) => {
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const urlBlob = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = urlBlob

            // Determine extension from URL or fallback
            const ext = url.split('.').pop()?.split(/[?#]/)[0] || 'pdf'
            const filename = title.endsWith(`.${ext}`) ? title : `${title}.${ext}`

            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(urlBlob)
        } catch (error) {
            console.error('Download failed:', error)
            window.open(url, '_blank')
        }
    }

    const createMutation = useMutation({
        mutationFn: DocumentService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] })
            setIsModalOpen(false)
            setNewDoc({ title: '', category: 'legal', visibility: 'all', file: '' })
            setSelectedFileName('')
            setUploading(false)
            toast.success('Document uploaded successfully!')
        },
        onError: (err: any) => {
            setUploading(false)
            toast.error(err?.response?.data?.message || err?.message || 'Failed to upload document')
        }
    })

    const [selectedFileName, setSelectedFileName] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFileName(file.name)
            if (!newDoc.title) {
                const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
                setNewDoc(prev => ({ ...prev, title: nameWithoutExt }))
            }
            const reader = new FileReader()
            reader.onloadend = () => {
                setNewDoc(prev => ({ ...prev, file: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleUpload = () => {
        if (!newDoc.file) {
            toast.error('Please select a file to upload')
            return
        }
        if (!newDoc.title) {
            toast.error('Please enter a document name')
            return
        }
        setUploading(true)
        createMutation.mutate(newDoc)
    }

    const deleteMutation = useMutation({
        mutationFn: DocumentService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] })
        }
    })

    const filteredSocietyDocs = documents.filter(doc =>
        doc.visibility !== 'unit' &&
        (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const filteredUnitDocs = documents.filter(doc =>
        doc.visibility === 'unit' &&
        (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Document Library</h1>
                    <p className="text-muted-foreground mt-1">Manage society documents and unit records</p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2 shadow-sm">
                                <Plus className="h-4 w-4" /> Upload New Document
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Upload Document</DialogTitle>
                                <DialogDescription>Add a new document to the society repository.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="doc-name">Document Name</Label>
                                    <Input
                                        id="doc-name"
                                        placeholder="e.g. Society Bylaws 2024"
                                        value={newDoc.title}
                                        onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={newDoc.category} onValueChange={(val) => setNewDoc({ ...newDoc, category: val })}>
                                            <SelectTrigger id="category">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="legal">Legal</SelectItem>
                                                <SelectItem value="finance">Finance</SelectItem>
                                                <SelectItem value="insurance">Insurance</SelectItem>
                                                <SelectItem value="certificate">Certificate</SelectItem>
                                                <SelectItem value="noc">NOC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="visibility">Visibility</Label>
                                        <Select value={newDoc.visibility} onValueChange={(val) => setNewDoc({ ...newDoc, visibility: val })}>
                                            <SelectTrigger id="visibility">
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Residents</SelectItem>
                                                <SelectItem value="committee">Committee Only</SelectItem>
                                                <SelectItem value="unit">Specific Unit</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="file">Select File</Label>
                                    <label className="block cursor-pointer">
                                        <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors bg-gray-50/50 ${newDoc.file ? 'border-teal-500 bg-teal-50/30' : 'border-gray-200 hover:border-teal-500'}`}>
                                            <FileText className={`h-8 w-8 mx-auto mb-2 ${newDoc.file ? 'text-teal-600' : 'text-gray-400'}`} />
                                            <p className="text-sm font-medium text-gray-700">{selectedFileName ? selectedFileName : (newDoc.file ? 'File selected (Ready to upload)' : 'Click to upload or drag and drop')}</p>
                                            <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button
                                    className="bg-teal-600 hover:bg-teal-700 text-white"
                                    onClick={handleUpload}
                                    disabled={uploading || !newDoc.file || !newDoc.title}
                                >
                                    {uploading ? 'Uploading...' : 'Upload'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="society" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <TabsList className="bg-white border p-1 h-11 rounded-xl shadow-sm">
                        <TabsTrigger value="society" className="gap-2 px-4 rounded-lg data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
                            <Shield className="h-4 w-4" /> Society Documents
                        </TabsTrigger>
                        <TabsTrigger value="unit" className="gap-2 px-4 rounded-lg data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700">
                            <Home className="h-4 w-4" /> Unit Documents
                        </TabsTrigger>
                    </TabsList>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search documents..."
                            className="pl-9 bg-white border-gray-200 focus:border-teal-500 rounded-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <TabsContent value="society">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSocietyDocs.map((doc) => (
                            <Card key={doc.id} className="group hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-500"
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this document?')) {
                                                deleteMutation.mutate(doc.id)
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate pr-4">{doc.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-[10px] px-1.5 h-4 uppercase">{doc.category}</Badge>
                                                <span className="text-xs text-muted-foreground">{doc.size || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-xs gap-1 hover:text-teal-600 hover:bg-teal-50"
                                                onClick={() => window.open(doc.fileUrl, '_blank')}
                                            >
                                                <Eye className="h-3 w-3" /> View
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-xs gap-1 hover:text-teal-600 hover:bg-teal-50"
                                                onClick={() => handleDownload(doc.fileUrl, doc.title)}
                                            >
                                                <Download className="h-3 w-3" /> Download
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="unit">
                    <Card className="border-0 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead>Document Name</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Uploaded On</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUnitDocs.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-blue-500" />
                                                <span className="font-medium">{doc.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
                                                N/A
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs uppercase font-medium text-gray-500">{doc.category}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{doc.size || 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:text-teal-600"
                                                    onClick={() => window.open(doc.fileUrl, '_blank')}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 hover:text-teal-600"
                                                    onClick={() => handleDownload(doc.fileUrl, doc.title)}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <RoleGuard allowedRoles={['admin']}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:text-red-600"
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this document?')) {
                                                                deleteMutation.mutate(doc.id)
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </RoleGuard>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
