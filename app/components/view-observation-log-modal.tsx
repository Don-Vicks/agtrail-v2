import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { useGetFieldAgentsObservations } from '~/lib/api/generated/field-agent/field-agent'
import type { CropObservation } from '~/lib/api/generated/models/cropObservation'
import { extractDataArray } from '~/lib/field-agent-utils'

type Props = {
  isOpen: boolean
  onClose: () => void
  cropCycleId?: string | null
  cropLabel?: string
  farmLabel?: string
}

export function ViewObservationLogModal({
  isOpen,
  onClose,
  cropCycleId,
  cropLabel,
  farmLabel,
}: Props) {
  const { data: observations = [], isLoading, isError } = useGetFieldAgentsObservations({
    query: {
      enabled: isOpen,
      select: (res) => {
        const list = extractDataArray<CropObservation>(res.data)
        if (!cropCycleId) return list
        return list.filter((item) => item.cropCycleId === cropCycleId)
      },
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className='fixed top-0 right-0 bottom-0 left-auto m-0 h-full w-full max-w-md translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-l bg-white p-0 shadow-2xl duration-300 outline-none flex data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md'
      >
        <DialogHeader className='flex flex-row items-start bg-white z-10 p-6 shrink-0 relative border-b border-gray-100 space-y-0 text-left'>
          <div className='flex-1 space-y-2'>
            <DialogTitle className='text-lg font-bold text-brand-dark'>Observation Log</DialogTitle>
            <DialogDescription className='space-y-0.5'>
              <p className='font-semibold text-gray-900 text-sm'>{cropLabel || 'Crop cycle observations'}</p>
              {farmLabel ? <p className='text-gray-600 text-sm'>{farmLabel}</p> : null}
            </DialogDescription>
          </div>
          <button
            onClick={onClose}
            className='absolute top-4 right-4 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full p-1.5 transition-colors'
          >
            <svg className='size-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
            <span className='sr-only'>Close</span>
          </button>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto p-6 space-y-4'>
          {isLoading ? (
            <div className='flex items-center justify-center py-10'>
              <Loader2 className='size-5 animate-spin text-gray-400' />
              <span className='ml-2 text-sm text-gray-500'>Loading observations...</span>
            </div>
          ) : isError ? (
            <div className='rounded-md border border-red-100 bg-red-50 p-4 text-sm text-red-600'>
              Failed to load observations. Please try again.
            </div>
          ) : observations.length === 0 ? (
            <div className='rounded-md border border-gray-100 bg-gray-50 p-6 text-center'>
              <p className='text-sm font-medium text-gray-600'>No observations logged yet.</p>
              <p className='mt-1 text-xs text-gray-400'>Submit an observation to see it here.</p>
            </div>
          ) : (
            observations.map((obs) => (
              <div key={obs.id} className='rounded-md border border-gray-100 bg-white p-4 shadow-sm text-left'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-sm font-semibold text-gray-900'>
                    {obs.cropGrowthStage || 'General observation'}
                  </p>
                  <p className='text-xs text-gray-500'>{new Date(obs.createdAt).toLocaleString()}</p>
                </div>
                <p className='mt-2 text-sm text-gray-700'>{obs.notes || 'No notes provided.'}</p>
                <div className='mt-3 text-xs text-gray-500 space-y-1'>
                  {typeof obs.estimatedCoveragePercent === 'number' ? (
                    <p>Estimated coverage: {obs.estimatedCoveragePercent}%</p>
                  ) : null}
                  {obs.fieldCondition ? <p>Field condition: {obs.fieldCondition}</p> : null}
                  {obs.pestOrDiseaseSigns ? <p>Pest/disease signs: {obs.pestOrDiseaseSigns}</p> : null}
                  {obs.photos?.[0] ? (
                    <a href={obs.photos[0]} target='_blank' rel='noreferrer' className='text-brand underline'>
                      View uploaded document
                    </a>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
