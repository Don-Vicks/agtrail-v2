import { PageHeader } from '~/components/page-header'
import { OffersPageContent } from '~/components/transfer/offers-page-content'
import { useGetTransfersAvailablePickups } from '~/lib/api/generated/transfers/transfers'
import type { TransferOffer } from '~/types/transfer'

export default function TransporterProductTransfer() {
  const { data: transfersData, isLoading } = useGetTransfersAvailablePickups()

  const rawTransfers = transfersData?.data?.data || []

  const offers: TransferOffer[] = rawTransfers.map((transfer: any) => ({
    id: transfer.id as string,
    transporterName: (transfer.fromUserName as string) || 'Unknown Sender',
    location: (transfer.pickupLocation as string) || 'N/A',
    phone: (transfer.destinationPhone1 as string) || 'N/A',
    avatar: '',
    quantity: Number(transfer.quantityTransferred),
    unit: (transfer.unit as string) || 'KG',
    date: (transfer.initiatedDate as string) || (transfer.createdAt as string),
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
