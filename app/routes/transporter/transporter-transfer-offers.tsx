import { PageHeader } from '~/components/page-header'
import { OffersPageContent } from '~/components/transfer/offers-page-content'
import { useGetTransfers } from '~/lib/api/generated/transfers/transfers'
import type { TransferOffer } from '~/types/transfer'

export default function TransporterProductTransfer() {
  const { data: transfersData, isLoading } = useGetTransfers()

  // Filter transfers that are pending acceptance
  const rawTransfers = transfersData?.data?.data || []
  const pendingTransfers = rawTransfers.filter(t => t.status === 'pending')

  const offers: TransferOffer[] = pendingTransfers.map(transfer => ({
    id: transfer.id,
    transporterName: transfer.fromUserName || 'Unknown Sender',
    location: transfer.pickupLocation || 'N/A',
    phone: 'N/A', // Not provided by the API directly
    avatar: '',
    quantity: Number(transfer.quantityTransferred),
    unit: transfer.unit || 'KG',
    date: transfer.initiatedDate || transfer.createdAt,
    status: transfer.status as any,
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Transporter', href: '/transporter' },
          { label: 'Transfer' },
          { label: 'Transfer Offers' },
        ]}
      />
      
      {isLoading ? (
        <div className="p-8 text-center text-gray-500">Loading offers...</div>
      ) : (
        <OffersPageContent offers={offers} />
      )}
    </div>
  )
}
