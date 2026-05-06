import { PageHeader } from '~/components/page-header'
import { TransferPageContent } from '~/components/transfer/transfer-page-content'
import { mockTransfers } from '~/lib/mock-data/transfer'

export default function AggregatorProductTransfer() {
  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Aggregator', href: '/aggregator' },
          { label: 'Transfer' },
          { label: 'Product Transfer' },
        ]}
      />
      
      <TransferPageContent 
        title="Initiate Product"
        subtitle="Initiate product transfer from aggregated stock to any stakeholders"
        transfers={mockTransfers.filter(t => t.status === 'available')}
      />
    </div>
  )
}
