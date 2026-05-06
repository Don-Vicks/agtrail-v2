import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { BatchSelection } from './lot-consolidation/components/batch-selection'
import { CompositionTree } from './lot-consolidation/components/composition-tree'
import { FinalizeReview } from './lot-consolidation/components/finalize-review'
import { StorageModal } from './lot-consolidation/components/storage-modal'

// Mock Data
const mockBatches = [
  {
    id: '#BT - 98442',
    farmer: 'Sarah Greenfield',
    farmerId: 'F - 006',
    quantity: '420 Unit',
    harvested: '2025-04-13',
    weight: '250.00 Kg',
  },
  {
    id: '#BT - 98443',
    farmer: 'Sarah Rogers',
    farmerId: 'F - 004',
    quantity: '500 Unit',
    harvested: '2025-04-13',
    weight: '250.00 Kg',
  },
  {
    id: '#BT - 98444',
    farmer: 'Sarah Greenfield',
    farmerId: 'F - 006',
    quantity: '52 Unit',
    harvested: '2025-04-13',
    weight: '250.00 Kg',
  },
  {
    id: '#BT - 98445',
    farmer: 'Sarah Rogers',
    farmerId: 'F - 008',
    quantity: '300 Unit',
    harvested: '2025-04-13',
    weight: '250.00 Kg',
  },
  {
    id: '#BT - 98446',
    farmer: 'Johnathan Arable',
    farmerId: 'F - 007',
    quantity: '10 Unit',
    harvested: '2025-04-13',
    weight: '250.00 Kg',
  },
  {
    id: '#BT - 98447',
    farmer: 'Sarah Rogers',
    farmerId: 'F - 008',
    quantity: '300 Unit',
    harvested: '2025-04-13',
    weight: '250.00 Kg',
  },
  {
    id: '#BT - 98448',
    farmer: 'Johnathan Arable',
    farmerId: 'F - 007',
    quantity: '10 Unit',
    harvested: '2025-04-13',
    weight: '250.00 Kg',
  },
]

const auditLogs = [
  {
    timestamp: '24 Oct 2023, 09:12 AM',
    action: 'Lot Composition Finalized',
    entity: 'LOT-2023-001',
    performedBy: 'Robert Miller (Manager)',
    status: 'COMPLETED',
  },
  {
    timestamp: '23 Oct 2023, 04:45 PM',
    action: 'Batch G05 Verified',
    entity: 'Sarah Greenfield',
    performedBy: 'System Autocheck',
    status: 'VERIFIED',
  },
  {
    timestamp: '22 Oct 2023, 11:30 AM',
    action: 'New Farmer Onboarding',
    entity: 'Jonathan Arable',
    performedBy: 'Alice Wong (Admin)',
    status: 'COMPLETED',
  },
]

export default function AggregatorLotConsolidationPage() {
  const [step, setStep] = useState(1)
  const [selectedBatches, setSelectedBatches] = useState<string[]>([])
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false)

  const toggleBatch = (id: string) => {
    setSelectedBatches((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const selectedCount = selectedBatches.length
  const totalWeight = selectedCount * 250 // Mocking 250kg per batch

  const handleSaveEntry = () => {
    setIsStorageModalOpen(false)
    setStep(1)
  }

  return (
    <div className='space-y-6 pb-10'>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/aggregator',
          },
          { label: 'Lot Consolidation' },
        ]}
      />

      {step === 1 && (
        <BatchSelection 
          batches={mockBatches}
          selectedBatches={selectedBatches}
          onToggleBatch={toggleBatch}
          onContinue={() => setStep(2)}
          totalWeight={totalWeight}
        />
      )}

      {step === 2 && (
        <CompositionTree 
          auditLogs={auditLogs}
          onBack={() => setStep(1)}
          onContinue={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <FinalizeReview 
          onBack={() => setStep(2)}
          onFinalize={() => setIsStorageModalOpen(true)}
        />
      )}

      <StorageModal 
        open={isStorageModalOpen}
        onOpenChange={setIsStorageModalOpen}
        onSave={handleSaveEntry}
      />
    </div>
  )
}
