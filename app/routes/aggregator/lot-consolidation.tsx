import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { BatchSelection } from './lot-consolidation/components/batch-selection'
import { CompositionTree } from './lot-consolidation/components/composition-tree'
import { FinalizeReview } from './lot-consolidation/components/finalize-review'
import { StorageModal } from './lot-consolidation/components/storage-modal'
import { useDraftLot } from '~/lib/aggregator/use-draft-lot'
import { useGetAggregatorLotsDraft } from '~/lib/api/generated/aggregator/aggregator'
import { Loader2 } from 'lucide-react'

export default function AggregatorLotConsolidationPage() {
  const [step, setStep] = useState(1)
  const [selectedBatches, setSelectedBatches] = useState<string[]>([])
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false)
  
  const { draftLotBatches, stats, isLoading } = useDraftLot()
  const { data: draftResponse } = useGetAggregatorLotsDraft()
  const draftId = draftResponse?.data?.data?.id

  const toggleBatch = (id: string) => {
    setSelectedBatches((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const selectedCount = selectedBatches.length
  const totalWeight = draftLotBatches
    .filter(b => selectedBatches.includes(b.id))
    .reduce((sum, b) => sum + b.quantityKg, 0)

  const handleSaveEntry = () => {
    setIsStorageModalOpen(false)
    setStep(1)
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className='space-y-6 pb-10'>
      <PageHeader
        items={[
          {
            label: 'Aggregator',
            href: '/aggregator',
          },
          { label: 'Lot Consolidation' },
        ]}
      />

      {step === 1 && (
        <BatchSelection 
          batches={draftLotBatches.map(b => ({
            id: b.id,
            farmer: b.farmerName,
            farmerId: b.farmerId,
            quantity: `${b.quantityKg} Kg`,
            harvested: b.harvestedAt,
            weight: `${b.quantityKg} Kg`,
          }))}
          selectedBatches={selectedBatches}
          onToggleBatch={toggleBatch}
          onContinue={() => setStep(2)}
          totalWeight={totalWeight}
        />
      )}

      {step === 2 && (
        <CompositionTree 
          auditLogs={[]} // Notifications can be used here if needed
          onBack={() => setStep(1)}
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <FinalizeReview 
          draftId={draftId}
          onBack={() => setStep(2)}
          onFinalize={() => setIsStorageModalOpen(true)}
        />
      )}

      <StorageModal 
        open={isStorageModalOpen}
        onOpenChange={setIsStorageModalOpen}
        onSave={handleSaveEntry}
        draftId={draftId}
      />
    </div>
  )
}
