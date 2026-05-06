import { PageHeader } from '~/components/page-header'
import { TransferPageContent } from '~/components/transfer/transfer-page-content'
import { mockTransfers } from '~/lib/mock-data/transfer'
import type { ProductTransfer } from '~/types/transfer'

export default function CooperativeProductsPickup() {
  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Cooperative', href: '/cooperative' },
          { label: 'Transfer' },
          { label: 'Products Pickup' },
        ]}
      />
      
      <TransferPageContent 
        title="Initiate Product"
        subtitle="Initiate product transfer from cooperative stock to any stakeholders"
        transfers={mockTransfers.filter((t: ProductTransfer) => t.status === 'ready_for_pickup')}
      />
    </div>
  )
}
