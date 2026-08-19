'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Guideline } from '@/types/community'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface GuidelineCardProps {
    guideline: Guideline
}

export function GuidelineCard({ guideline }: GuidelineCardProps) {
    const [acknowledged, setAcknowledged] = useState(false)

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={cn("border-l-4 transition-all hover:shadow-md",
                acknowledged ? "border-l-green-500 bg-green-50/50" : "border-l-blue-500"
            )}>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-lg font-semibold">{guideline.title}</CardTitle>
                                {guideline.isMandatory && (
                                    <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                                )}
                                <Badge variant="outline" className="capitalize text-xs">{guideline.category}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Last updated: {guideline.lastUpdated}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-gray-700 mb-4 whitespace-pre-wrap">
                        {guideline.description}
                    </CardDescription>

                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            variant={acknowledged ? "outline" : "default"}
                            className={cn("gap-2", acknowledged ? "text-green-600 border-green-200 bg-green-50" : "bg-blue-600 hover:bg-blue-700")}
                            onClick={() => setAcknowledged(!acknowledged)}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            {acknowledged ? "Acknowledged" : "I Acknowledge"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
