import { PageHeader } from '~/components/page-header'
import { TransferPageContent } from '~/components/transfer/transfer-page-content'
import { mockTransfers } from '~/lib/mock-data/transfer'

export default function ExporterProductTransferPage() {
  const transfers = mockTransfers.filter(t => t.status === 'available')
  
  return (
    <TransferPageContent 
      title="Product Transfer"
      subtitle="Initiate and track product transfers to transporters or other partners"
      transfers={transfers}
    />
  )
}
