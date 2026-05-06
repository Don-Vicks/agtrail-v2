import { PageHeader } from '~/components/page-header'
import { TransferPageContent } from '~/components/transfer/transfer-page-content'
import { mockTransfers } from '~/lib/mock-data/transfer'

export default function FarmerProductTransfer() {
  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Farmer', href: '/farmer' },
          { label: 'Transfer' },
          { label: 'Product Transfer' },
        ]}
      />
      
      <TransferPageContent 
        title="Initiate Product"
        subtitle="Initiate product transfer from your stock to any stakeholders"
        transfers={mockTransfers.filter(t => t.status === 'available')}
      />
    </div>
  )
}
