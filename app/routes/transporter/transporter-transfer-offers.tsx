import { PageHeader } from '~/components/page-header'
import { OffersPageContent } from '~/components/transfer/offers-page-content'
import { mockOffers } from '~/lib/mock-data/transfer'

export default function TransporterProductTransfer() {
  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Transporter', href: '/transporter' },
          { label: 'Transfer' },
          { label: 'Transfer Offers' },
        ]}
      />
      
      <OffersPageContent offers={mockOffers} />
    </div>
  )
}
