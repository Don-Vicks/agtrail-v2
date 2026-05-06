import { CheckCircle2, ChevronRight, Eye, Plus } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { StatCard } from './stat-card'

interface Batch {
  id: string
  farmer: string
  farmerId: string
  quantity: string
  harvested: string
  weight: string
}

interface BatchSelectionProps {
  batches: Batch[]
  selectedBatches: string[]
  onToggleBatch: (id: string) => void
  onContinue: () => void
  totalWeight: number
}

export function BatchSelection({ 
  batches, 
  selectedBatches, 
  onToggleBatch, 
  onContinue,
  totalWeight 
}: BatchSelectionProps) {
  const selectedCount = selectedBatches.length

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div className='space-y-1'>
          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
            INBOUND CONSOLIDATION - DRAFT-2026-04-22
          </p>
          <h1 className='text-2xl font-extrabold text-[#2e7d32] tracking-tight'>
            Consolidate the harvest
          </h1>
          <p className='text-[13px] text-gray-500 font-medium'>
            Merge farmer batches into sealed aggregators lots with an
            immutable composition
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            disabled={selectedCount === 0}
            className='rounded-md border-gray-200 bg-white text-[#1a4332] border shadow-sm hover:bg-gray-50 h-10 px-4 text-xs font-bold gap-2 disabled:opacity-50'
          >
            <Plus className='size-4' />
            New Consolidation {selectedCount > 0 && `(${selectedCount})`}
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4'>
        <StatCard label='Available Batches' value='8' />
        <StatCard label='Lots Sealed' value='0' />
        <StatCard
          label='Total KG Consolidated'
          value={`${totalWeight || 8} kg`}
        />
        <StatCard label='Anomalies Flagged' value='0' />
      </div>

      <div className='space-y-4 pt-4'>
        <h2 className='text-sm font-bold text-gray-900 tracking-tight'>
          Available Farmer
        </h2>
        <div className='rounded-md border border-gray-100 bg-white overflow-x-auto shadow-sm'>
          <table className='w-full text-left border-collapse min-w-[700px]'>
            <thead>
              <tr className='bg-[#fdfdfc] border-b border-gray-100'>
                <th className='w-12 px-6'></th>
                <th className='px-6 py-4 text-[11px] font-bold text-[#2e7d32] uppercase tracking-wider'>
                  Batch Identifier
                </th>
                <th className='px-6 py-4 text-[11px] font-bold text-[#2e7d32] uppercase tracking-wider'>
                  Farmer
                </th>
                <th className='px-6 py-4 text-[11px] font-bold text-[#2e7d32] uppercase tracking-wider'>
                  Quantity
                </th>
                <th className='px-6 py-4 text-[11px] font-bold text-[#2e7d32] uppercase tracking-wider'>
                  Harvested
                </th>
                <th className='px-6 py-4 text-[11px] font-bold text-[#2e7d32] uppercase tracking-wider'>
                  Weight
                </th>
                <th className='px-6 py-4'></th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {batches.map((batch, idx) => {
                const isSelected = selectedBatches.includes(batch.id + idx)
                return (
                  <tr
                    key={idx}
                    onClick={() => onToggleBatch(batch.id + idx)}
                    className={cn(
                      'group hover:bg-gray-50/50 transition-colors cursor-pointer',
                      isSelected && 'bg-[#e8f5e9]/10',
                    )}
                  >
                    <td className='px-6 py-5'>
                      <div
                        className={cn(
                          'size-4 rounded-sm border-2 transition-all flex items-center justify-center',
                          isSelected
                            ? 'bg-[#2e7d32] border-[#2e7d32]'
                            : 'border-gray-300 bg-white group-hover:border-gray-400',
                        )}
                      >
                        {isSelected && (
                          <CheckCircle2 className='size-3 text-white' />
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-5'>
                      <span className='text-[13px] font-extrabold text-[#2e7d32] tracking-tight'>
                        {batch.id}
                      </span>
                    </td>
                    <td className='px-6 py-5'>
                      <div>
                        <p className='text-[13px] font-extrabold text-[#2e7d32] tracking-tight'>
                          {batch.farmer}
                        </p>
                        <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                          {batch.farmerId}
                        </p>
                      </div>
                    </td>
                    <td className='px-6 py-5 text-[13px] font-medium text-gray-500 tracking-tight'>
                      {batch.quantity}
                    </td>
                    <td className='px-6 py-5 text-[13px] font-medium text-gray-500 tracking-tight'>
                      {batch.harvested}
                    </td>
                    <td className='px-6 py-5 text-[13px] font-medium text-gray-500 tracking-tight'>
                      {batch.weight}
                    </td>
                    <td className='px-6 py-5 text-right'>
                      <button className='p-2 hover:bg-gray-100 rounded-md transition-colors text-[#2e7d32]/60'>
                        <Eye className='size-4' />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className='flex justify-end gap-3 pt-6'>
        <Button
          variant='outline'
          className='h-10 px-6 rounded-md font-bold text-gray-600'
        >
          Cancel
        </Button>
        <Button
          onClick={onContinue}
          className='h-10 px-6 rounded-md bg-[#1a4332] hover:bg-[#122e22] font-bold text-white shadow-sm'
        >
          Continue to Next Step <ChevronRight className='ml-2 size-4' />
        </Button>
      </div>
    </div>
  )
}
