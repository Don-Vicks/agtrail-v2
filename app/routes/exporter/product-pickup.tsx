import { PageHeader } from '~/components/page-header'
import { TransferPageContent } from '~/components/transfer/transfer-page-content'
import { mockTransfers } from '~/lib/mock-data/transfer'

export default function ExporterProductPickupPage() {
  const transfers = mockTransfers.filter(t => t.status === 'ready_for_pickup')
  
  return (
    <TransferPageContent 
      title="Product Pickup"
      subtitle="Manage and verify product pickups by authorized transporters"
      transfers={transfers}
    />
  )
}
