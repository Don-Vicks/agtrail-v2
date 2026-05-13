import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '~/components/ui/dialog'
import { usePostAggregatorLotsLotIdStorageLogs } from '~/lib/api/generated/aggregator/aggregator'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

interface StorageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
  lotId?: string
}

export function StorageModal({ open, onOpenChange, onSave, lotId }: StorageModalProps) {
  const queryClient = useQueryClient()
  const logMutation = usePostAggregatorLotsLotIdStorageLogs()
  
  const [location, setLocation] = useState('')
  const [temperature, setTemperature] = useState('')
  const [humidity, setHumidity] = useState('')
  const [notes, setNotes] = useState('')

  const handleSave = async () => {
    if (!lotId) return

    try {
      await logMutation.mutateAsync({
        lotId,
        data: {
          storageLocation: location,
          temperature: temperature ? Number(temperature) : undefined,
          humidity: humidity ? Number(humidity) : undefined,
          notes,
          logDate: new Date().toISOString()
        }
      })
      queryClient.invalidateQueries({ queryKey: [`/aggregator/lots/${lotId}/storage-logs`] })
      toast.success('Storage log recorded')
      onSave()
    } catch (err) {
      toast.error('Failed to record storage log')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[480px] p-8 overflow-hidden border-none shadow-2xl rounded-md bg-white'>
        <div className='space-y-1 mb-8'>
          <DialogTitle className='text-2xl font-bold text-[#1a4332] tracking-tight'>
            Log storage conditions
          </DialogTitle>
          <p className='text-sm text-gray-500'>
            Lot ID: {lotId || '...'}
          </p>
        </div>

        <div className='space-y-6 text-left'>
          <div className='space-y-2'>
            <label className='text-sm font-bold text-[#2e7d32]'>
              Storage Location
            </label>
            <input
              type='text'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder='e.g. Warehouse A - Bay 3'
              className='w-full h-11 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-bold text-[#2e7d32]'>
                Temperature (c)
              </label>
              <input
                type='number'
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder='20'
                className='w-full h-11 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-bold text-[#2e7d32]'>
                Humidity (%)
              </label>
              <input
                type='number'
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                placeholder='65'
                className='w-full h-11 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-bold text-[#2e7d32]'>
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Cooling unit status, anomalies, etc.'
              className='w-full h-24 rounded-md border border-gray-300 p-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none resize-none'
            />
          </div>

          <div className='flex gap-4 pt-4'>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className='flex-1 h-12 rounded-md font-bold'
              disabled={logMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className='flex-1 h-12 rounded-md bg-[#1a4332] text-white font-bold hover:bg-[#122e22] shadow-sm gap-2'
              disabled={logMutation.isPending || !lotId}
            >
              {logMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              Save Entry
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
