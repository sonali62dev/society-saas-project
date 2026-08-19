'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  fallbackUrl?: string
  showLabelOnMobile?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"
}

export function BackButton({
  label = 'Back',
  fallbackUrl = '/dashboard',
  showLabelOnMobile = false,
  className,
  variant = 'ghost',
  size = 'sm',
  onClick,
  ...props
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e)
      return
    }

    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackUrl)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={cn(
        'group flex items-center gap-1.5 font-medium transition-all duration-200 hover:bg-muted/80 active:scale-95 text-muted-foreground hover:text-foreground',
        className
      )}
      title="Go back"
      {...props}
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
      {label && (
        <span className={cn(showLabelOnMobile ? 'inline' : 'hidden sm:inline')}>
          {label}
        </span>
      )}
    </Button>
  )
}
