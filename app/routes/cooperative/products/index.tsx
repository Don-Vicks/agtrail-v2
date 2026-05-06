import { useQueries } from '@tanstack/react-query'
import {
  Activity,
  ArrowRight,
  Bookmark,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Layers,
  LayoutDashboard,
  Package,
  Search
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { EmptyState } from '~/components/empty-state'
import { PageHeader } from '~/components/page-header'
import { SelectOperationModal } from '~/components/select-operation-modal'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ViewActivitiesModal } from '~/components/view-activities-modal'
import { CropCycleCard } from '~/components/crop-cycle-card'
import { useGetCooperativesFarms, useGetCooperativesProducts } from '~/lib/api/generated/cooperatives/cooperatives'
import { getGetFarmsIdCropCyclesQueryOptions } from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import type { CropCycle, FarmProduct } from '~/lib/api/generated/models'
import { extractCropCyclesFromQueries, formatFarmLocation } from '~/lib/record-operation-dashboard'
import { cn } from '~/lib/utils'

/* ─── Product Card ─── */
function ProductGridCard({ product }: { product: FarmProduct }) {
  return (
    <div className="group relative rounded-md border border-gray-200 bg-white p-6 shadow-sm hover:border-brand/40 hover:shadow-lg transition-all overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20 scale-125">
        <Package className="size-20 text-brand" />
      </div>

      <div className="flex gap-6 relative z-10 mb-6">
        <div className="shrink-0 size-24 rounded-2xl border-2 border-white shadow-sm ring-1 ring-gray-100 bg-white p-1.5 overflow-hidden">
          <QRCodeSVG value={product.batchNumber} style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <div className="mb-2">
            <Badge className="bg-[#1d3d1e] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border-none shadow-none">
              {product.batchNumber}
            </Badge>
          </div>
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight mb-1 truncate" title={product.productName}>
            {product.productName}
          </h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{product.category || 'Product'}</p>
        </div>
      </div>

      <div className="space-y-3 mb-8 pt-6 border-t border-gray-50 relative z-10">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight text-gray-400">
          <span className="flex items-center gap-2 italic text-gray-300"><Layers className="size-3" /> Inventory</span>
          <span className="text-gray-900">{product.quantityAvailable} {product.unit || 'Units'}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight text-gray-400">
          <span className="flex items-center gap-2 italic text-gray-300"><Bookmark className="size-3" /> Farm ID</span>
          <span className="text-brand truncate max-w-[120px]">{product.farmId}</span>
        </div>
      </div>

      <Link to={`/cooperative/products/${product.id}`} className="mt-auto block relative z-10">
        <Button className="w-full h-11 bg-brand text-white hover:bg-black border-none shadow-sm font-bold uppercase tracking-wider text-[11px] gap-2">
          View Traceability Story
          <ArrowRight className="size-3.5" />
        </Button>
      </Link>
    </div>
  )
}

/* ─── Page ─── */
export default function ProductsIndex() {
  const [activeTab, setActiveTab] = useState('products')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [cycleSearchQuery, setCycleSearchQuery] = useState('')
  const [cycleStatusFilter, setCycleStatusFilter] = useState('all')
  const [selectedCycleForOperation, setSelectedCycleForOperation] = useState<UICropCycle | null>(null)
  const [selectedCycleForActivities, setSelectedCycleForActivities] = useState<UICropCycle | null>(null)

  const { data: productsResponse, isLoading, error } = useGetCooperativesProducts()
  const { data: farmsResponse, isLoading: isLoadingFarms } = useGetCooperativesFarms()
  const allProducts = (productsResponse?.data?.data as unknown as FarmProduct[]) || []
  const farms = farmsResponse?.data?.data || []
  const cycleQueries = useQueries({
    queries: farms.map((farm) => ({
      ...getGetFarmsIdCropCyclesQueryOptions(farm.id),
      enabled: !!farm.id,
    })),
  })
  const isLoadingCycles = isLoadingFarms || cycleQueries.some((q) => q.isLoading)
  const cropCycles = useMemo(() => extractCropCyclesFromQueries(cycleQueries), [cycleQueries])
  const uiCropCycles = useMemo<UICropCycle[]>(() => {
    return cropCycles.map((cycle) => {
      const farm = farms.find((f) => f.id === cycle.farmId)
      const farmName = farm?.name || 'Unknown Farm'
      const farmerInitials = farmName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((v) => v[0])
        .join('')
        .toUpperCase() || 'CF'
      return {
        ...cycle,
        productName: cycle.productName || (cycle as any).cropName || 'Unknown Crop',
        plantedDate: cycle.plantingDate
          ? new Date(cycle.plantingDate).toLocaleDateString()
          : null,
        area: cycle.areaPlanted ? `${cycle.areaPlanted} ${cycle.areaUnit || 'ha'}` : null,
        farmName,
        farmLocation: formatFarmLocation(farm),
        farmerName: 'Cooperative Member',
        farmerInitials,
        farmerColor: '#2E5A27',
      }
    })
  }, [cropCycles, farms])
  const filteredCycles = useMemo(() => {
    const query = cycleSearchQuery.trim().toLowerCase()
    return uiCropCycles.filter((cycle) => {
      const matchesSearch =
        !query ||
        cycle.productName.toLowerCase().includes(query) ||
        cycle.farmName.toLowerCase().includes(query) ||
        cycle.farmerName.toLowerCase().includes(query)
      const matchesStatus =
        cycleStatusFilter === 'all' ||
        (cycle.status || '').toLowerCase() === cycleStatusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [uiCropCycles, cycleSearchQuery, cycleStatusFilter])

  const filteredProducts = allProducts.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <svg className="size-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load products</h3>
          <p className="text-gray-500">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10 px-1">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Products' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage cooperative products and crop cycles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2 h-11 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-600 border-gray-200">
            Export List
          </Button>
        </div>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center justify-between border-b border-gray-100 mb-8">
        <div className="inline-flex rounded-md bg-gray-50/80 p-1 border border-gray-100 shadow-sm mb-4">
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              "flex h-9 items-center justify-center rounded-md px-6 text-[10px] font-bold uppercase tracking-widest transition-all",
              activeTab === 'products' ? "bg-white text-gray-900 shadow-sm font-bold" : "text-gray-400 hover:text-gray-600"
            )}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={cn(
              "flex h-9 items-center justify-center rounded-md px-6 text-[10px] font-bold uppercase tracking-widest transition-all",
              activeTab === 'ongoing' ? "bg-white text-gray-900 shadow-sm font-bold" : "text-gray-400 hover:text-gray-600"
            )}
          >
            Crop Cycles
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <>
          {/* Filter Toolbar: Products */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by product name, batch ID, or category..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="bg-white w-full h-10 pl-10 text-sm border-gray-100 rounded-md focus:ring-1 focus:ring-brand focus:border-brand shadow-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Farm Filter</span>
                  <div className="relative">
                    <select className="h-10 rounded-md border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[160px]">
                      <option>All Farms</option>
                      <option>IITA FCI4Afric</option>
                      <option>Baba Beji Hub</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {searchQuery && (
                  <Button variant="ghost" className="h-10 px-4 text-red-500 font-bold text-[11px] uppercase tracking-wider hover:bg-red-50" onClick={() => setSearchQuery('')}>Reset</Button>
                )}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {paginatedProducts.length === 0 ? (
              <div className="col-span-2">
                <EmptyState
                  icon={<Package className="size-8" />}
                  title={searchQuery ? 'No products match your search' : 'No products available'}
                  description={searchQuery ? 'Try adjusting your search query.' : 'There are no products listed currently.'}
                  action={searchQuery ? { label: "Clear Search", onClick: () => { setSearchQuery(''); setCurrentPage(1) } } : undefined}
                />
              </div>
            ) : paginatedProducts.map(p => (
              <ProductGridCard key={p.id} product={p} />
            ))}
          </div>

          {/* Inventory Footer */}
          <div className="mt-12 border-t border-gray-100 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20 rounded-md">
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Total Products:</span>
              <span className="text-gray-900">{filteredProducts.length} Products</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-300">Show</span>
                <select className="bg-transparent border-none outline-none text-gray-900 font-bold" value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-300">Page {currentPage} / {totalPages}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-7 text-gray-300" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                    <ArrowRight className="size-3.5 rotate-180" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-7 text-gray-400 hover:text-brand" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Filter Toolbar: Cycles */}
          <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Filter by crop cycle, farm name, or owner..."
                  value={cycleSearchQuery}
                  onChange={(e) => setCycleSearchQuery(e.target.value)}
                  className="bg-white w-full h-10 pl-10 text-sm border-gray-100 rounded-md focus:ring-1 focus:ring-brand focus:border-brand shadow-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Phase Status</span>
                  <div className="relative">
                    <select
                      value={cycleStatusFilter}
                      onChange={(e) => setCycleStatusFilter(e.target.value)}
                      className="h-10 rounded-md border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[140px]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="planned">Planned</option>
                      <option value="active">Active</option>
                      <option value="harvested">Harvested</option>
                      <option value="failed">Failed</option>
                      <option value="abandoned">Abandoned</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingCycles ? (
              <>
                <div className="h-64 rounded-md border border-gray-200 bg-white animate-pulse" />
                <div className="h-64 rounded-md border border-gray-200 bg-white animate-pulse" />
                <div className="h-64 rounded-md border border-gray-200 bg-white animate-pulse" />
              </>
            ) : filteredCycles.length === 0 ? (
              <div className="col-span-3">
                <EmptyState
                  icon={<Package className="size-8" />}
                  title="No crop cycles found"
                  description="There are no crop cycles matching your current filters."
                />
              </div>
            ) : filteredCycles.map(cycle => (
              <CropCycleCard
                key={cycle.id}
                cycle={cycle}
                farmName={cycle.farmName}
                farmLocation={cycle.farmLocation}
                farmerName={cycle.farmerName}
                farmerInitials={cycle.farmerInitials}
                farmerColor={cycle.farmerColor}
                onViewActivities={() => setSelectedCycleForActivities(cycle)}
                onRecordOperation={() => setSelectedCycleForOperation(cycle)}
              />
            ))}
          </div>
        </>
      )}
      <SelectOperationModal
        isOpen={!!selectedCycleForOperation}
        onClose={() => setSelectedCycleForOperation(null)}
        cropCycle={selectedCycleForOperation}
        basePath="/cooperative/operations/new"
      />
      <ViewActivitiesModal
        isOpen={!!selectedCycleForActivities}
        onClose={() => setSelectedCycleForActivities(null)}
        cropCycle={selectedCycleForActivities}
      />
    </div>
  )
}

type UICropCycle = CropCycle & {
  productName: string
  plantedDate: string | null
  area: string | null
  farmName: string
  farmLocation: string
  farmerName: string
  farmerInitials: string
  farmerColor: string
}
