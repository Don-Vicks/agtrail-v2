import { PageHeader } from '~/components/page-header'
import { TransferPageContent } from '~/components/transfer/transfer-page-content'
import { useGetProcessorsBatches } from '~/lib/api/generated/processors-batches/processors-batches'
import type { ProductTransfer } from '~/types/transfer'

export default function ProcessorProductTransfer() {
  const { data: batchesData, isLoading } = useGetProcessorsBatches()

  const rawBatches = batchesData?.data?.data || []
  
  // Filter for completed batches (or those ready to transfer)
  const availableBatches = rawBatches.filter(b => b.status === 'completed' || b.status === 'in_progress')

  const transfers: ProductTransfer[] = availableBatches.map(batch => ({
    id: batch.id,
    batchId: batch.batchCode,
    productName: batch.outputProductName,
    farmerName: 'You (Processor)',
    farmName: batch.facilityName || 'Facility',
    location: batch.facilityLocation || 'N/A',
    quantity: 1, // Quantity is not explicitly on batch right now, using 1 as placeholder
    unit: 'Batch',
    status: 'available',
    productType: 'batch_product',
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Processor', href: '/processor' },
          { label: 'Transfer' },
          { label: 'Product Transfer' },
        ]}
      />
      
      {isLoading ? (
        <div className="p-8 text-center text-gray-500 animate-pulse">Loading available batches...</div>
      ) : (
        <TransferPageContent 
          title="Initiate Product Transfer"
          subtitle="Initiate product transfer from processed stock to any stakeholders"
          transfers={transfers}
        />
      )}
    </div>
  )
}
