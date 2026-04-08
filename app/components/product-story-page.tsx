import { useMemo } from 'react'
import { useParams } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useGetFarmersProductsId } from '~/lib/api/generated/farm-products/farm-products'
import { useGetFarms } from '~/lib/api/generated/farms/farms'

interface ProductStoryPageProps {
  dashboardHref: string
  productsHref: string
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-b-0">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-right text-sm text-gray-900">{value}</span>
    </div>
  )
}

function formatDate(value?: string | null) {
  if (!value) return 'N/A'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatValue(value: unknown) {
  if (typeof value === 'string' && value.trim()) return value
  if (typeof value === 'number') return value.toLocaleString()
  return 'N/A'
}

export function ProductStoryPage({ dashboardHref, productsHref }: ProductStoryPageProps) {
  const { id } = useParams()

  const { data: productResponse, isLoading: isLoadingProduct } = useGetFarmersProductsId(id ?? '', {
    query: {
      enabled: Boolean(id),
    },
  })
  const { data: farmsResponse } = useGetFarms()

  const product = productResponse?.data?.data
  const farm = useMemo(() => {
    if (!product) return null
    return (farmsResponse?.data?.data || []).find((item) => item.id === product.farmId) ?? null
  }, [farmsResponse?.data?.data, product])

  const traceabilityCount = [product?.blockchainTxHash, product?.stellarTxHash, product?.ipfsCid].filter(Boolean).length

  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: dashboardHref,
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Products', href: productsHref },
          { label: 'Product Details' },
        ]}
      />

      {isLoadingProduct ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
          Loading product details...
        </div>
      ) : !product ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
          This product could not be found in the backend.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex h-56 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500">No product image uploaded yet</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{product.batchNumber}</p>
                  <h1 className="mt-2 text-3xl font-bold text-brand">{product.productName}</h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                    {product.category}
                  </span>
                  <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium capitalize text-green-700">
                    {product.status || 'available'}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  Farm: <span className="font-medium text-gray-900">{farm?.name || product.farmId}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MetricCard label="Available Quantity" value={`${product.quantityAvailable} ${product.unit || 'kg'}`} />
              <MetricCard label="Harvested Quantity" value={`${product.quantityHarvested} ${product.unit || 'kg'}`} />
              <MetricCard label="Suggested Price" value={product.suggestedPricePerUnit ? `${product.priceCurrency || 'NGN'} ${product.suggestedPricePerUnit}` : 'N/A'} />
              <MetricCard label="Anchored Records" value={String(traceabilityCount)} />
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="h-auto w-fit rounded-md border border-gray-200 bg-gray-100 p-1">
              <TabsTrigger value="overview" className="px-5 py-2 text-sm">Overview</TabsTrigger>
              <TabsTrigger value="quality" className="px-5 py-2 text-sm">Quality</TabsTrigger>
              <TabsTrigger value="traceability" className="px-5 py-2 text-sm">Traceability</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <DetailRow label="Variety" value={formatValue(product.variety)} />
              <DetailRow label="Harvest Date" value={formatDate(product.harvestDate)} />
              <DetailRow label="Harvest Method" value={formatValue(product.harvestMethod)} />
              <DetailRow label="Farm" value={farm?.name || product.farmId} />
              <DetailRow label="Storage Location" value={formatValue(product.storageLocation)} />
              <DetailRow label="Created" value={formatDate(product.createdAt)} />
            </TabsContent>

            <TabsContent value="quality" className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <DetailRow label="Quality Grade" value={formatValue(product.qualityGrade)} />
              <DetailRow label="Quality Notes" value={formatValue(product.qualityNotes)} />
              <DetailRow label="Storage Conditions" value={typeof product.storageConditions === 'string' ? product.storageConditions : 'Not specified'} />
              <DetailRow label="AI Summary" value={typeof product.aiSummary === 'string' ? product.aiSummary : 'No AI summary available'} />
            </TabsContent>

            <TabsContent value="traceability" className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <DetailRow label="Product ID" value={product.id} />
              <DetailRow label="Crop Cycle ID" value={formatValue(product.cropCycleId)} />
              <DetailRow label="Blockchain Tx" value={formatValue(product.blockchainTxHash)} />
              <DetailRow label="Stellar Tx" value={formatValue(product.stellarTxHash)} />
              <DetailRow label="IPFS CID" value={formatValue(product.ipfsCid)} />
              <DetailRow label="Created By" value={product.createdBy} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
