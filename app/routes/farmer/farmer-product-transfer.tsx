import { PageHeader } from '~/components/page-header'
import { TransferPageContent } from '~/components/transfer/transfer-page-content'
import { useGetFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import type { ProductTransfer } from '~/types/transfer'

export default function FarmerProductTransfer() {
  const { data: productsData, isLoading } = useGetFarmersProducts()

  const products: ProductTransfer[] = (productsData?.data?.data || []).map(product => ({
    id: product.id,
    productName: product.productName,
    batchId: product.batchNumber || 'N/A',
    quantity: product.quantityAvailable,
    unit: product.unit || 'KG',
    farmerName: 'You', // TODO: Get from auth context if needed
    farmName: 'Your Farm',
    location: product.storageLocation || 'N/A',
    status: 'available',
    date: product.createdAt
  }))

  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Farmer', href: '/farmer' },
          { label: 'Transfer' },
          { label: 'Product Transfer' },
        ]}
      />
      
      {isLoading ? (
        <div className="p-8 text-center text-gray-500">Loading products...</div>
      ) : (
        <TransferPageContent 
          title="Initiate Product"
          subtitle="Initiate product transfer from your stock to any stakeholders"
          transfers={products}
        />
      )}
    </div>
  )
}
