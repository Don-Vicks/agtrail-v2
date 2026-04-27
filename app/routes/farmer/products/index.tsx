import { useQueries, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutDashboard, 
  MapPin, 
  Package, 
  ArrowRight,
  ClipboardList,
  Layers,
  ChevronDown
} from 'lucide-react'
import { 
  getGetFarmersProductsQueryKey, 
  useGetFarmersProducts 
} from '~/lib/api/generated/farm-products/farm-products'
import { getGetFarmsIdCropCyclesQueryOptions } from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import type { CropCycle } from '~/lib/api/generated/models'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { ProductGridCard } from '~/components/product-grid-card'
import { ProductCardSkeleton } from '~/components/product-card-skeleton'
import { CreateProductModal } from '~/components/create-product-modal'
import { EmptyState } from '~/components/empty-state'
import { cn } from '~/lib/utils'
import { extractCropCyclesFromQueries } from '~/lib/record-operation-dashboard'

/* ─── Page ─── */
export default function ProductsIndex() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState<'products' | 'ongoing'>('products')
  const [search, setSearch] = useState('')
  const [farmFilter, setFarmFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [cycleStatusFilter, setCycleStatusFilter] = useState('all')

  const queryClient = useQueryClient()

  // Live data
  const { data: productsResponse, isLoading: isLoadingProducts } = useGetFarmersProducts()
  const { data: farmsResponse, isLoading: isLoadingFarms } = useGetFarms()

  const products = productsResponse?.data?.data || []
  const farms = farmsResponse?.data?.data || []
  const cycleQueries = useQueries({
    queries: farms.map((farm) => ({
      ...getGetFarmsIdCropCyclesQueryOptions(farm.id),
      enabled: !!farm.id,
    })),
  })
  const cropCycles = useMemo(() => extractCropCyclesFromQueries(cycleQueries), [cycleQueries])

  // Farm name lookup
  const farmNameMap = useMemo(() => {
    const map = new Map<string, string>()
    farms.forEach(f => map.set(f.id, f.name))
    return map
  }, [farms])

  // Unique farm names for dropdown
  const uniqueFarms = useMemo(() => {
    const set = new Map<string, string>()
    products.forEach(p => {
      if (!set.has(p.farmId)) {
        set.set(p.farmId, farmNameMap.get(p.farmId) || p.farmId.slice(0, 8))
      }
    })
    return Array.from(set.entries())
  }, [products, farmNameMap])

  // Unique product names for dropdown
  const uniqueProductNames = useMemo(() => {
    const set = new Set<string>()
    products.forEach(p => set.add(p.productName))
    return Array.from(set).sort()
  }, [products])

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (search) {
        const q = search.toLowerCase()
        const farmName = farmNameMap.get(p.farmId) || ''
        if (
          !p.productName.toLowerCase().includes(q) &&
          !p.batchNumber.toLowerCase().includes(q) &&
          !farmName.toLowerCase().includes(q) &&
          !p.id.toLowerCase().includes(q)
        ) return false
      }
      if (farmFilter !== 'all' && p.farmId !== farmFilter) return false
      if (productFilter !== 'all' && p.productName !== productFilter) return false
      return true
    })
  }, [products, search, farmFilter, productFilter, farmNameMap])

  const cropCycleRows = useMemo<FarmerUICropCycle[]>(() => {
    return cropCycles.map((cycle) => ({
      ...cycle,
      farmName: farmNameMap.get(cycle.farmId) || cycle.farmId.slice(0, 8),
    }))
  }, [cropCycles, farmNameMap])
  const filteredCropCycles = useMemo(() => {
    const query = search.trim().toLowerCase()
    return cropCycleRows.filter((cycle) => {
      const matchesSearch =
        !query ||
        cycle.cropName.toLowerCase().includes(query) ||
        cycle.farmName.toLowerCase().includes(query) ||
        cycle.id.toLowerCase().includes(query)
      const matchesFarm = farmFilter === 'all' || cycle.farmId === farmFilter
      const matchesStatus =
        cycleStatusFilter === 'all' ||
        (cycle.status || '').toLowerCase() === cycleStatusFilter.toLowerCase()
      return matchesSearch && matchesFarm && matchesStatus
    })
  }, [cropCycleRows, search, farmFilter, cycleStatusFilter])

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const isLoading = isLoadingProducts || isLoadingFarms
  const hasActiveFilters = search || farmFilter !== 'all' || productFilter !== 'all'

  const clearFilters = () => {
    setSearch('')
    setFarmFilter('all')
    setProductFilter('all')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6 pb-10 px-1">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Products' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2e7d32]">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your crops and harvested products</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm"
          >
            <Plus className="size-4" />
            <span className="font-bold uppercase tracking-wide text-xs">Add Product</span>
          </Button>
        </div>
      </div>

      {/* Tab Interface */}
      <div className="rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm inline-flex w-fit mb-6">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              "px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
              activeTab === 'products' ? "bg-brand text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={cn(
              "px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
              activeTab === 'ongoing' ? "bg-brand text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            Crop Cycles ({cropCycleRows.length})
          </button>
        </div>
      </div>

      {activeTab === 'products' ? (
        <>
          {/* Filtration Block */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                  className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Farm</span>
                  <div className="relative">
                    <select 
                      value={farmFilter} 
                      onChange={(e) => { setFarmFilter(e.target.value); setCurrentPage(1) }}
                      className="h-10 rounded-lg border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[140px]"
                    >
                      <option value="all">All Farms</option>
                      {uniqueFarms.map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Product</span>
                  <div className="relative">
                    <select 
                      value={productFilter} 
                      onChange={(e) => { setProductFilter(e.target.value); setCurrentPage(1) }}
                      className="h-10 rounded-lg border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[140px]"
                    >
                      <option value="all">All Products</option>
                      {uniqueProductNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    className="h-10 px-4 gap-2 text-red-500 font-bold text-[11px] uppercase tracking-wider hover:bg-red-50"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {isLoading ? (
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : paginatedProducts.length === 0 ? (
              <div className="col-span-2">
                <EmptyState
                  icon={<Package className="size-8" />}
                  title={hasActiveFilters ? 'No products match your filters' : 'No products have been created yet'}
                  description={hasActiveFilters ? 'Try adjusting your search or filters to find what you\'re looking for.' : undefined}
                  action={hasActiveFilters ? { label: "Clear Filters", onClick: clearFilters } : undefined}
                />
              </div>
            ) : paginatedProducts.map(p => (
              <ProductGridCard
                key={p.id}
                product={p}
                farmName={farmNameMap.get(p.farmId) || p.farmId.slice(0, 8)}
              />
            ))}
          </div>

          {/* Standardized Table Footer */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="mt-8 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-gray-300">Total Products:</span>
                <span className="text-gray-900">{filteredProducts.length} Products</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">Show</span>
                  <select 
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="bg-transparent border-none outline-none text-gray-900 font-bold"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-300">Page {currentPage} / {totalPages}</span>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-7 text-gray-300" 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      <ArrowRight className="size-3.5 rotate-180" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-7 text-gray-400 hover:text-brand"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    >
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search crop cycles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Status</span>
                  <div className="relative">
                    <select
                      value={cycleStatusFilter}
                      onChange={(e) => setCycleStatusFilter(e.target.value)}
                      className="h-10 rounded-lg border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[140px]"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : filteredCropCycles.length === 0 ? (
              <div className="col-span-3">
                <EmptyState
                  icon={<Package className="size-8" />}
                  title="No crop cycles found"
                  description="No crop cycles match the selected filters."
                />
              </div>
            ) : filteredCropCycles.map((cycle) => (
              <FarmerCropCycleCard key={cycle.id} cycle={cycle} />
            ))}
          </div>
        </>
      )}

      <CreateProductModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  )
}

type FarmerUICropCycle = CropCycle & { farmName: string }

function FarmerCropCycleCard({ cycle }: { cycle: FarmerUICropCycle }) {
  const badgeClass =
    (cycle.status || '').toLowerCase() === 'harvested'
      ? 'border border-gray-200 bg-gray-50 text-gray-500'
      : (cycle.status || '').toLowerCase() === 'active'
        ? 'border border-brand-surface bg-brand-surface/50 text-brand'
        : 'border border-blue-200 bg-blue-50 text-blue-700'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
          {(cycle.status || 'planned').toUpperCase()}
        </span>
      </div>
      <h4 className="text-base font-semibold text-gray-900">{cycle.cropName}</h4>
      <p className="text-sm text-gray-600 mt-1">{cycle.farmName}</p>
      <p className="text-xs text-gray-400 mt-1">
        Planted: {cycle.plantingDate ? new Date(cycle.plantingDate).toLocaleDateString() : 'N/A'}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Area: {cycle.areaPlantedHectares ? `${cycle.areaPlantedHectares} ha` : 'N/A'}
      </p>
    </div>
  )
}
