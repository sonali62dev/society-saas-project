'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Car, User, Home, AlertCircle, Loader2, Phone } from 'lucide-react'
import { VehicleService } from '@/services/vehicle.service'
import { toast } from 'react-hot-toast'
import { Badge } from '@/components/ui/badge'

interface VehicleSearchDialogProps {
  trigger?: React.ReactNode
}

export function VehicleSearchDialog({ trigger }: VehicleSearchDialogProps) {
  const [searchNumber, setSearchNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [vehicle, setVehicle] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchNumber.trim()) return

    setLoading(true)
    setError(null)
    setVehicle(null)

    try {
      const response = await VehicleService.search(searchNumber.toUpperCase())
      if (response.success) {
        setVehicle(response.data)
      } else {
        setError(response.message || 'Vehicle not found')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Vehicle not found in this society')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
        setOpen(val)
        if (!val) {
            setSearchNumber('')
            setVehicle(null)
            setError(null)
        }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Search Vehicle
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-500" />
            Vehicle Search
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="space-y-4 mt-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter Vehicle Number (e.g. DL01AB1234)"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value.toUpperCase())}
              className="uppercase"
            />
            <Button type="submit" disabled={loading || !searchNumber.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {vehicle && (
            <div className="space-y-4 p-4 border rounded-xl bg-slate-50 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-blue-600">{vehicle.number}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.make} ({vehicle.type})</p>
                </div>
                <Badge variant={vehicle.status === 'verified' ? 'default' : 'outline'}>
                  {vehicle.status}
                </Badge>
              </div>

              <div className="grid gap-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-white dark:bg-card rounded-lg shadow-sm">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground leading-none mb-1">Owner Name</p>
                    <p className="font-medium">{vehicle.ownerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-white dark:bg-card rounded-lg shadow-sm">
                    <Home className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground leading-none mb-1">Unit / Address</p>
                    <p className="font-medium">{vehicle.unit}</p>
                  </div>
                </div>
                
                {vehicle.ownerPhone && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-white dark:bg-card rounded-lg shadow-sm">
                      <Phone className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground leading-none mb-1">Mobile Number</p>
                      <a href={`tel:${vehicle.ownerPhone}`} className="font-medium text-blue-600 hover:underline">{vehicle.ownerPhone}</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="text-[10px] text-muted-foreground text-center">
            Search only works for vehicles registered within your society.
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
