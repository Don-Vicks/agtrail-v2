import { useState, useMemo } from 'react'
import { PageHeader } from '~/components/page-header'
import { Pagination } from '~/components/pagination'
import { ProductGridCard } from '~/components/product-grid-card'
import { ProductCardSkeleton } from '~/components/product-card-skeleton'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useGetFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import { useGetFarms } from '~/lib/api/generated/farms/farms'

/* ─── Page ─── */
export default function ProductsIndex() {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const [farmFilter, setFarmFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')

  // Live data
  const { data: productsResponse, isLoading: isLoadingProducts } = useGetFarmersProducts()
  const { data: farmsResponse, isLoading: isLoadingFarms } = useGetFarms()

  const products = productsResponse?.data?.data || []
  const farms = farmsResponse?.data?.data || []

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

  // Products linked to a crop cycle
  const cropCycleProducts = useMemo(() => {
    return products.filter(p => p.cropCycleId)
  }, [products])

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
    <div className="space-y-6">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Products' },
        ]}
      />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <p className="text-sm text-gray-500">View and manage all products you have created</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="bg-gray-100 border border-gray-200 p-1 rounded-md h-auto w-fit">
          <TabsTrigger
            value="products"
            className="flex-none px-6 sm:px-8 py-2 text-sm font-medium text-gray-500 rounded-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
          >
            Products ({products.length})
          </TabsTrigger>
          <TabsTrigger
            value="ongoing"
            className="flex-none px-4 sm:px-8 py-2 text-sm font-medium text-gray-500 rounded-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
          >
            Crop Cycle Products ({cropCycleProducts.length})
          </TabsTrigger>
        </TabsList>

        {/* ─── Products Tab ─── */}
        <TabsContent value="products" className="m-0 border-none p-0 outline-none mt-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                className="bg-white w-full h-10 text-sm border-gray-200 rounded-lg"
              />
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                className="h-10 px-4 gap-2 border-gray-200 text-gray-700 font-medium text-sm bg-white hover:bg-gray-50 rounded-lg flex-shrink-0"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}

            <div className="flex items-center gap-3 sm:ml-auto">
              <Select value={farmFilter} onValueChange={(val) => { setFarmFilter(val || 'all'); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[190px] h-10 bg-white text-sm text-gray-600 border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-[#2E5A27] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <SelectValue placeholder="Filter by Farm" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Farms</SelectItem>
                  {uniqueFarms.map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={productFilter} onValueChange={(val) => { setProductFilter(val || 'all'); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[200px] h-10 bg-white text-sm text-gray-600 border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="size-4 text-[#2E5A27] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <SelectValue placeholder="Filter by Product" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {uniqueProductNames.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-12 text-center">
                <svg className="mx-auto size-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                </svg>
                <p className="text-sm font-medium text-gray-500">
                  {hasActiveFilters ? 'No products match your filters.' : 'No products have been created yet.'}
                </p>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="mt-2 text-xs font-medium text-brand hover:underline">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : paginatedProducts.map(p => (
              <ProductGridCard
                key={p.id}
                product={p}
                farmName={farmNameMap.get(p.farmId) || p.farmId.slice(0, 8)}
              />
            ))}
          </div>

          {/* Pagination */}
          {!isLoading && filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={rowsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(count) => {
                setRowsPerPage(count)
                setCurrentPage(1)
              }}
              itemLabel="product(s)"
            />
          )}
        </TabsContent>

        {/* ─── Crop Cycle Products Tab ─── */}
        <TabsContent value="ongoing" className="m-0 border-none p-0 outline-none mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : cropCycleProducts.length === 0 ? (
              <div className="col-span-3 rounded-xl border border-gray-200 bg-white p-12 text-center">
                <svg className="mx-auto size-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <p className="text-sm font-medium text-gray-500">No products linked to crop cycles yet.</p>
                <p className="text-xs text-gray-400 mt-1">Products created from a crop cycle will appear here.</p>
              </div>
            ) : cropCycleProducts.map(p => (
              <ProductGridCard
                key={p.id}
                product={p}
                farmName={farmNameMap.get(p.farmId) || p.farmId.slice(0, 8)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
