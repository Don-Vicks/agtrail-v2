import { useMemo } from 'react'
import { useParams } from 'react-router'
import { 
  Plus, 
  MapPin, 
  Maximize, 
  LayoutDashboard, 
  Activity, 
  ChevronDown,
  Filter,
  ArrowRight,
  ShoppingCart,
  Receipt,
  Download,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Package,
  FileText,
  Info,
  Award,
  Link as LinkIcon
} from 'lucide-react'
import { PageHeader } from '~/components/page-header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useGetFarmersProductsId } from '~/lib/api/generated/farm-products/farm-products'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

interface ProductStoryPageProps {
  dashboardHref: string
  productsHref: string
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col items-start gap-4">
      <div className="size-10 rounded-xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-xl font-bold text-gray-900 uppercase tracking-tight">{value}</p>
      </div>
    </div>
  )
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-50 py-4 last:border-b-0 text-left">
      <div className="flex items-center gap-3">
        {icon && <div className="text-brand/50">{icon}</div>}
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</span>
      </div>
      <span className="text-right text-xs font-bold text-gray-900 uppercase tracking-tight">{value}</span>
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
    <div className="space-y-6 pb-10 px-1 text-left">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: dashboardHref,
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Products', href: productsHref },
          { label: 'Product Story' },
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-64 h-64 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 shadow-inner group">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-300">
                    <Package className="size-12 opacity-40 animate-pulse" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">No Image</p>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{product.id?.split('-')[0]} // {product.batchNumber || 'BATCH'}</span>
                      <Badge className="bg-brand/5 text-brand border-brand/10 shadow-none text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">Verified</Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight leading-tight">{product.productName}</h1>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-50 border-gray-100 px-3 py-1 shadow-none">
                      {product.category || 'Agricultural'}
                    </Badge>
                    <Badge className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-3 py-1 border shadow-none",
                      product.status === 'available' ? 'bg-green-50 text-emerald-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    )}>
                      {product.status || 'Active'}
                    </Badge>
                  </div>

                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 pt-2">
                    <MapPin className="size-3 text-brand" /> 
                    Farm: <span className="text-gray-900 group-hover:text-brand transition-colors cursor-pointer">{farm?.name || product.farmId}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-8">
                  <Button className="bg-[#1d3d1e] hover:bg-black text-white h-11 px-8 gap-2 font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-brand/10">
                    <ShoppingCart className="size-4" />
                    Buy Product
                  </Button>
                  <Button variant="outline" className="h-11 px-6 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold uppercase tracking-widest text-[11px] gap-2">
                    <Download className="size-4" />
                    Export List
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MetricCard 
                icon={<Layers className="size-5" />}
                label="Available Quantity" 
                value={`${product.quantityAvailable} ${product.unit || 'kg'}`} 
              />
              <MetricCard 
                icon={<Maximize className="size-5" />}
                label="Quantity Harvested" 
                value={`${product.quantityHarvested} ${product.unit || 'kg'}`} 
              />
              <MetricCard 
                icon={<Receipt className="size-5" />}
                label="Price" 
                value={product.suggestedPricePerUnit ? `${product.priceCurrency || 'NGN'} ${product.suggestedPricePerUnit}` : 'N/A'} 
              />
              <MetricCard 
                icon={<ShieldCheck className="size-5 text-emerald-500" />}
                label="Verifications" 
                value={String(traceabilityCount)} 
              />
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="h-auto w-fit rounded-xl bg-gray-50/80 p-1 border border-gray-100 shadow-sm">
              <TabsTrigger value="overview" className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
                <Info className="size-3.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="quality" className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
                <Award className="size-3.5" />
                Quality
              </TabsTrigger>
              <TabsTrigger value="traceability" className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm">
                <Activity className="size-3.5" />
                Traceability
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8 rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                <DetailRow icon={<Layers className="size-4" />} label="Seed Variety" value={formatValue(product.variety)} />
                <DetailRow icon={<Calendar className="size-4" />} label="Harvest Date" value={formatDate(product.harvestDate)} />
                <DetailRow icon={<Activity className="size-4" />} label="Harvest Method" value={formatValue(product.harvestMethod)} />
                <DetailRow icon={<MapPin className="size-4" />} label="Origin" value={farm?.name || product.farmId} />
                <DetailRow icon={<Maximize className="size-4" />} label="Storage" value={formatValue(product.storageLocation)} />
                <DetailRow icon={<Info className="size-4" />} label="Created" value={formatDate(product.createdAt)} />
              </div>
            </TabsContent>

            <TabsContent value="quality" className="mt-8 rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                <DetailRow icon={<CheckCircle2 className="size-4" />} label="Standard Grade" value={formatValue(product.qualityGrade)} />
                <DetailRow icon={<FileText className="size-4" />} label="Notes" value={formatValue(product.qualityNotes)} />
                <DetailRow icon={<Layers className="size-4" />} label="Storage Conditions" value={typeof product.storageConditions === 'string' ? product.storageConditions : 'Not specified'} />
                <div className="lg:col-span-2 pt-6 mt-2 border-t border-gray-50 flex flex-col gap-3">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-brand uppercase tracking-widest"><Activity className="size-3.5" /> AI Summary</div>
                   <p className="text-xs text-gray-500 font-medium leading-relaxed italic">{typeof product.aiSummary === 'string' ? product.aiSummary : 'No AI summary available'}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="traceability" className="mt-8 rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                <DetailRow icon={<Info className="size-4" />} label="Product ID" value={product.id} />
                <DetailRow icon={<Activity className="size-4" />} label="Crop Cycle" value={formatValue(product.cropCycleId)} />
                <DetailRow icon={<LinkIcon className="size-4" />} label="Ethereum TX Hash" value={formatValue(product.blockchainTxHash)} />
                <DetailRow icon={<LinkIcon className="size-4" />} label="Stellar TX Hash" value={formatValue(product.stellarTxHash)} />
                <DetailRow icon={<Layers className="size-4" />} label="IPFS Content ID" value={formatValue(product.ipfsCid)} />
                <DetailRow icon={<ChevronDown className="size-4" />} label="Created By" value={product.createdBy} />
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
