import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useGetPersonnel } from '~/lib/api/generated/personnel/personnel'
import { Loader2, Truck, User } from 'lucide-react'
import { cn } from '~/lib/utils'
import type { TransferOffer } from '~/types/transfer'

interface AcceptTransferModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: { assignedDriverName?: string; assignedDriverPersonnelId?: string }) => Promise<void>
  offer: TransferOffer | null
}

const acceptTransferSchema = z.object({
  assignedDriverName: z.string().min(1, 'Driver name is required'),
  assignedDriverPersonnelId: z.string().optional(),
})

type AcceptTransferFormValues = z.infer<typeof acceptTransferSchema>

export function AcceptTransferModal({ isOpen, onClose, onConfirm, offer }: AcceptTransferModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { data: personnelData } = useGetPersonnel({ query: { enabled: isOpen } })
  const personnel = personnelData?.data?.data || []

  const form = useForm<AcceptTransferFormValues>({
    resolver: zodResolver(acceptTransferSchema as any),
    defaultValues: {
      assignedDriverName: '',
      assignedDriverPersonnelId: '',
    },
  })

  const { register, handleSubmit, setValue, formState: { errors }, reset } = form

  const onSubmit = async (values: AcceptTransferFormValues) => {
    setIsSubmitting(true)
    try {
      await onConfirm(values)
      reset()
      onClose()
    } catch (error) {
      console.error('Failed to accept transfer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!offer) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        reset()
        onClose()
      }
    }}>
      <DialogContent className="max-w-md p-0 border-none rounded-md overflow-hidden bg-white shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-brand/5">
          <div className="size-12 rounded-full bg-brand/10 flex items-center justify-center mb-4">
            <Truck className="size-6 text-brand" />
          </div>
          <DialogTitle className="text-2xl font-extrabold text-[#1d3d1e] tracking-tight">
            Accept Transfer Offer
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 font-medium">
            Assign a driver to this transfer to finalize acceptance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Driver Name*</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  {...register('assignedDriverName')}
                  placeholder="Enter full name"
                  className={cn("h-11 pl-10 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs", errors.assignedDriverName && "border-red-500")}
                />
              </div>
              {errors.assignedDriverName && <p className="text-[10px] text-red-500 font-bold uppercase">{errors.assignedDriverName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Personnel ID (Optional)</Label>
              <select
                {...register('assignedDriverPersonnelId')}
                onChange={(e) => {
                  const id = e.target.value
                  setValue('assignedDriverPersonnelId', id)
                  const person = (personnel as any[]).find(p => p.id === id)
                  if (person) {
                    setValue('assignedDriverName', person.fullName)
                  }
                }}
                className="w-full h-11 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs outline-none px-3"
              >
                <option value="">Select Personnel</option>
                {personnel.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.fullName} ({p.type})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 bg-brand hover:bg-brand/90 text-white font-black uppercase tracking-widest text-[10px] rounded-md shadow-md transition-all active:scale-95"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-3 animate-spin" />
                  <span>Accepting...</span>
                </div>
              ) : 'Confirm Acceptance'}
            </Button>
            <Button 
              type="button"
              variant="outline" 
              onClick={() => {
                reset()
                onClose()
              }}
              className="flex-1 h-12 border-gray-200 text-gray-500 font-black uppercase tracking-widest text-[10px] rounded-md hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
