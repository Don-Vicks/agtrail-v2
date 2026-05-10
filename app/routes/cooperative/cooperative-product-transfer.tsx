import { PageHeader } from '~/components/page-header'
import { TransferPageContent } from '~/components/transfer/transfer-page-content'
import { useGetCooperativesProducts } from '~/lib/api/generated/cooperatives/cooperatives'
import type { ProductTransfer } from '~/types/transfer'

export default function CooperativeProductTransfer() {
  const { data: productsData, isLoading } = useGetCooperativesProducts()

  const rawProducts = productsData?.data?.data as any[] || []

  // Map products to ProductTransfer format
  const transfers: ProductTransfer[] = rawProducts.map(product => ({
    id: product.id,
    batchId: product.batchNumber,
    productName: product.productName,
    farmerName: 'Cooperative Member',
    farmName: product.farmId.slice(0, 8) + '...',
    location: 'N/A',
    quantity: Number(product.quantityAvailable),
    unit: product.unit || 'KG',
    status: 'available',
    productType: 'farm_product',
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Cooperative', href: '/cooperative' },
          { label: 'Transfer' },
          { label: 'Product Transfer' },
        ]}
      />
      
      {isLoading ? (
        <div className="p-8 text-center text-gray-500 animate-pulse">Loading available products...</div>
      ) : (
        <TransferPageContent 
          title="Initiate Product Transfer"
          subtitle="Initiate product transfer from cooperative stock to any stakeholders"
          transfers={transfers}
        />
      )}
    </div>
  )
}
