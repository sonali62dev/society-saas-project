'use client'

import { User, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { ComplaintService } from '@/services/complaint.service'
import { ComplaintsTable } from '@/components/complaints/complaints-table'
import { RaiseComplaintDialog } from '@/components/complaints/raise-complaint-dialog'
import { Card, CardContent } from '@/components/ui/card'

export default function IndividualComplaintsPage() {
    const { data: response, isLoading } = useQuery({
        queryKey: ['super-admin-individual-complaints'],
        queryFn: () => ComplaintService.getAll()
    })

    const allComplaints = response?.data || (Array.isArray(response) ? response : [])
    const individualComplaints = allComplaints.filter((c: any) => c.source === 'individual' || c.reportedByOriginal?.role === 'INDIVIDUAL' || c.vendorId != null)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Individual Complaints</h1>
                        <p className="text-gray-500 dark:text-gray-400">Complaints from Individual Service Users</p>
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
                        <ComplaintsTable complaints={individualComplaints} showSource={false} />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
