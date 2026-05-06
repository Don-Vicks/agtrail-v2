import { PageHeader } from '~/components/page-header'
import { TransferPageContent } from '~/components/transfer/transfer-page-content'
import { mockTransfers } from '~/lib/mock-data/transfer'

export default function ProcessorProductsPickup() {
  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Processor', href: '/processor' },
          { label: 'Transfer' },
          { label: 'Products Pickup' },
        ]}
      />
      
      <TransferPageContent 
        title="Initiate Product"
        subtitle="Initiate product transfer from processed stock to any stakeholders"
        transfers={mockTransfers.filter(t => t.status === 'ready_for_pickup')}
      />
    </div>
  )
}
