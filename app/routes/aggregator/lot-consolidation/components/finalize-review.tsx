import { AlertTriangle, Building2, ChevronRight, History, MapPin, Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { FarmMap } from '~/components/farm-map.client'
import { StatCard } from './stat-card'
import { usePostAggregatorLotsDraftIdFinalise } from '~/lib/api/generated/aggregator/aggregator'
import { useDraftLot } from '~/lib/aggregator/use-draft-lot'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

interface FinalizeReviewProps {
  draftId?: string
  onBack: () => void
  onFinalize: () => void
}

export function FinalizeReview({ draftId, onBack, onFinalize }: FinalizeReviewProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { stats, draftLotBatches } = useDraftLot()
  const finalizeMutation = usePostAggregatorLotsDraftIdFinalise({
    request: {
      headers: { 'X-Offline-Label': 'Finalize & create lot' }
    }
  } as any)

  const handleFinalize = async () => {
    if (!draftId) return
    
    try {
      await finalizeMutation.mutateAsync({
        draftId,
        data: {
          actualWeight: stats.totalDraftWeightKg
        }
      })
      queryClient.invalidateQueries({ queryKey: [`/aggregator/lots`] })
      queryClient.invalidateQueries({ queryKey: [`/aggregator/lots/draft`] })
      toast.success('Lot finalized successfully')
      navigate('/aggregator')
    } catch (err) {
      toast.error('Failed to finalize lot')
    }
  }

  // Unique farmers count
  const uniqueFarmers = new Set(draftLotBatches.map(b => b.farmerName)).size

  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-bold text-[#2e7d32] tracking-tight'>
          Finalize Lot Review
        </h1>
        <p className='text-[13px] text-gray-500 font-medium'>
          Merge farmer batches into sealed aggregators lots with an
          immutable composition
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          label='Total Batches'
          value={stats.scanned.toString()}
          subtext='All Verified'
        />
        <StatCard
          label='Total Farmers'
          value={uniqueFarmers.toString()}
          subtext='Direct Sourcing'
        />
        <StatCard
          label='Final Weight'
          value={`${stats.totalDraftWeightKg.toLocaleString()} kg`}
          subtext='Aggregated Total'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Composition Tree Summary */}
        <div className='lg:col-span-2 bg-white border border-gray-100 rounded-md p-6 shadow-sm'>
          <div className='flex items-center justify-between mb-8'>
            <h3 className='text-lg font-bold text-gray-900'>
              Composition Tree
            </h3>
            <span className='text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 uppercase tracking-widest'>
              Hierarchy View
            </span>
          </div>

          <div className='flex flex-col items-center overflow-x-auto pb-4'>
            <div className='bg-[#1a4332] text-white rounded-md p-4 w-64 text-center shadow-md z-10 relative shrink-0'>
              <p className='text-[9px] text-white/70 uppercase tracking-widest font-bold mb-1'>
                Lot Root
              </p>
              <p className='text-lg font-bold'>{draftId ? `#DRAFT-${draftId.slice(-6)}` : 'NEW LOT'}</p>
            </div>

            <div className='w-px h-6 bg-gray-200 shrink-0'></div>
            <div className='w-[320px] border-t border-gray-200 shrink-0'></div>
            <div className='flex justify-between w-[320px] shrink-0'>
              <div className='w-px h-6 bg-gray-200'></div>
              <div className='w-px h-6 bg-gray-200'></div>
            </div>

            <div className='flex justify-between w-[480px] relative -top-px mb-6 shrink-0'>
              <div className='bg-white border border-gray-200 rounded-md p-4 w-52 flex items-center justify-center gap-3 shadow-sm'>
                <MapPin className='size-5 text-[#2e7d32]' />
                <div className='text-center'>
                  <p className='text-sm font-bold text-gray-900'>
                    Inbound Batches
                  </p>
                  <p className='text-[10px] font-medium text-gray-500'>
                    {stats.scanned} Batches
                  </p>
                </div>
              </div>
              <div className='bg-white border border-gray-200 rounded-md p-4 w-52 flex items-center justify-center gap-3 shadow-sm'>
                <Building2 className='size-5 text-[#2e7d32]' />
                <div className='text-center'>
                  <p className='text-sm font-bold text-gray-900'>
                    Direct Source
                  </p>
                  <p className='text-[10px] font-medium text-gray-500'>
                    {uniqueFarmers} Farmers
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full mt-4'>
              <div className='bg-[#fcfdfc] border border-gray-100 rounded-md p-4 flex gap-3 shadow-sm'>
                <div className='size-8 rounded bg-[#e8f5e9] flex items-center justify-center shrink-0'>
                  <Building2 className='size-4 text-[#2e7d32]' />
                </div>
                <div>
                  <p className='text-xs font-bold text-gray-900 mb-1'>
                    Sub-Lot Traceability
                  </p>
                  <p className='text-[10px] text-gray-500 font-medium'>
                    All nodes linked to source farm IDs
                  </p>
                </div>
              </div>
              <div className='bg-[#fcfdfc] border border-gray-100 rounded-md p-4 flex gap-3 shadow-sm'>
                <div className='size-8 rounded bg-[#e8f5e9] flex items-center justify-center shrink-0'>
                  <History className='size-4 text-[#2e7d32]' />
                </div>
                <div>
                  <p className='text-xs font-bold text-gray-900 mb-1'>
                    Audit Readiness
                  </p>
                  <p className='text-[10px] text-gray-500 font-medium'>
                    Compliance checks passed for all branches
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Origin Summary */}
        <div className='bg-white border border-gray-100 rounded-md p-6 shadow-sm flex flex-col'>
          <h3 className='text-sm font-bold text-gray-900 mb-4'>
            Lot Content
          </h3>
          <div className='flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2'>
            {draftLotBatches.map(batch => (
              <div key={batch.id} className="p-3 rounded-md bg-gray-50 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{batch.batchIdentifier}</p>
                    <p className="text-[10px] text-gray-500">{batch.farmerName}</p>
                  </div>
                  <span className="text-[10px] font-bold text-brand">{batch.quantityKg} Kg</span>
                </div>
              </div>
            ))}
          </div>
          <div className='pt-4 border-t border-gray-100 mt-4 space-y-3'>
            <div className='flex justify-between items-center text-xs'>
              <span className='text-gray-500 font-medium'>
                Total Batches
              </span>
              <span className='font-bold text-gray-900'>
                {stats.scanned}
              </span>
            </div>
            <div className='flex justify-between items-center text-xs'>
              <span className='text-gray-500 font-medium'>Net Weight</span>
              <span className='font-bold text-gray-900'>
                {stats.totalDraftWeightKg} Kg
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-[#fef2f2] border border-[#fecaca] rounded-md p-5 flex gap-4 items-start shadow-sm mt-4'>
        <AlertTriangle className='size-5 text-[#dc2626] shrink-0 mt-0.5' />
        <div className='space-y-1 text-left'>
          <h4 className='text-sm font-bold text-[#dc2626]'>
            Critical Action: Data Lock Notice
          </h4>
          <p className='text-xs font-medium text-[#dc2626]/80 leading-relaxed'>
            Finalizing will permanently lock all data and logs for this lot.
            This action cannot be undone. Ensure all weights, farmer
            attributions, and batch links are accurate before proceeding.
          </p>
        </div>
      </div>

      <div className='flex justify-end gap-3 pt-6 border-t border-gray-100'>
        <Button
          onClick={onBack}
          variant='outline'
          className='h-11 px-6 rounded-md font-bold text-gray-600'
          disabled={finalizeMutation.isPending}
        >
          Back
        </Button>
        <Button
          onClick={handleFinalize}
          className='h-11 px-6 rounded-md bg-[#1a4332] hover:bg-[#122e22] font-bold text-white shadow-sm gap-2'
          disabled={finalizeMutation.isPending || !draftId}
        >
          {finalizeMutation.isPending && <Loader2 className="size-4 animate-spin" />}
          Finalize & Create Lot <ChevronRight className='size-4' />
        </Button>
      </div>
    </div>
  )
}
