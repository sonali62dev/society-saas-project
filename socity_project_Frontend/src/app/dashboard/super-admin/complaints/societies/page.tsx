'use client'

import { Building2, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { ComplaintService } from '@/services/complaint.service'
import { ComplaintsTable } from '@/components/complaints/complaints-table'
import { RaiseComplaintDialog } from '@/components/complaints/raise-complaint-dialog'
import { Card, CardContent } from '@/components/ui/card'

export default function SocietyComplaintsPage() {
    const { data: response, isLoading } = useQuery({
        queryKey: ['super-admin-society-complaints'],
        queryFn: () => ComplaintService.getAll()
    })

    const allComplaints = response?.data || (Array.isArray(response) ? response : [])
    const societyComplaints = allComplaints.filter((c: any) => c.source === 'society' || c.reportedByOriginal?.role === 'ADMIN' || c.escalatedToSuperAdmin)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Society Complaints</h1>
                        <p className="text-gray-500 dark:text-gray-400">Concerns raised by Society Admins</p>
                    </div>
                </div>
                <RaiseComplaintDialog />
            </div>

            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12 text-slate-400">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            Loading complaints...
                        </div>
                    ) : (
                        <ComplaintsTable complaints={societyComplaints} showSource={false} />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
