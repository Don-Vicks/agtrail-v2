import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '~/components/ui/dialog'

interface StorageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function StorageModal({ open, onOpenChange, onSave }: StorageModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[480px] p-8 overflow-hidden border-none shadow-2xl rounded-md bg-white'>
        <div className='space-y-1 mb-8'>
          <DialogTitle className='text-2xl font-bold text-[#1a4332] tracking-tight'>
            Log storage conditions
          </DialogTitle>
          <p className='text-sm text-gray-500'>
            Lot COC-2025-014. Threshold 15-20c, 60-70%
          </p>
        </div>

        <div className='space-y-6 text-left'>
          <div className='space-y-2'>
            <label className='text-sm font-bold text-[#2e7d32]'>
              Storage Location
            </label>
            <input
              type='text'
              defaultValue='e.g. Warehouse A - Bay 3'
              className='w-full h-11 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-bold text-[#2e7d32]'>
                Date & Time
              </label>
              <input
                type='text'
                defaultValue='04/23/2026 04:12 pm'
                className='w-full h-11 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-bold text-[#2e7d32]'>
                Temperature (c)
              </label>
              <input
                type='text'
                placeholder='Region, Country'
                className='w-full h-11 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-bold text-[#2e7d32]'>
              Humidity
            </label>
            <input
              type='text'
              defaultValue='Cocoa beans'
              className='w-full h-11 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-bold text-[#2e7d32]'>
              Notes (optional)
            </label>
            <textarea
              defaultValue='Cooling unit status, anomalies, custody handover'
              className='w-full h-24 rounded-md border border-gray-300 p-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] outline-none resize-none'
            />
          </div>

          <div className='flex gap-4 pt-4'>
            <Button
              onClick={() => onOpenChange(false)}
              className='flex-1 h-12 rounded-md bg-[#dc2626] text-white font-bold hover:bg-[#b91c1c] shadow-sm'
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              className='flex-1 h-12 rounded-md bg-[#1a4332] text-white font-bold hover:bg-[#122e22] shadow-sm'
            >
              Save Entry
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
