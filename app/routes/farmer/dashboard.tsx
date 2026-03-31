import { useState, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { KYCBanner } from '~/components/kyc-banner'
import { QuickActions } from '~/components/quick-actions'
import { StatCard } from '~/components/stat-card'
import { FarmMap } from '~/components/farm-map'
import { Skeleton } from '~/components/ui/skeleton'
import {
  farmerStats,
  quickActions,
  regions,
} from '~/lib/mock-data/farmer'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { useGetFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import { getGetFarmsIdOperationsQueryOptions } from '~/lib/api/generated/farms-operations/farms-operations'
import { useAuth } from '~/context/auth-context'
import type { Route } from './+types/dashboard'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Farmer Dashboard | Agrolinking' },
    { name: 'description', content: 'Overview of your farming operations' },
  ]
}

function StatIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    'package': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
    'activity': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    'map-pin': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    'maximize': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
      </svg>
    ),
    'link': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
  }
  return icons[name] ?? null
}

export default function FarmerDashboard() {
  const { user } = useAuth()
  const { data: farmsResponse, isLoading: isLoadingFarms } = useGetFarms()
  const { data: productsResponse, isLoading: isLoadingProducts } = useGetFarmersProducts()
  



  const farms = farmsResponse?.data?.data || []
  const products = productsResponse?.data?.data || []

  // ── Filter state ─────────────────────────────────────────────────
  const [searchId, setSearchId] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchFarm, setSearchFarm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [farmSearch, setFarmSearch] = useState('')
  const [showAllFarms, setShowAllFarms] = useState(false)
  const [stateFilter, setStateFilter] = useState<string | null>(null)

  // ── Fetch operations for each farm in parallel ───────────────────
  const operationQueries = useQueries({
    queries: farms.map(farm => ({
      ...getGetFarmsIdOperationsQueryOptions(farm.id),
      enabled: !!farm.id,
    })),
  })

  const isLoadingOperations = operationQueries.some(q => q.isLoading)
  const isAnyLoading = isLoadingFarms || isLoadingProducts || isLoadingOperations
  const totalOperations = operationQueries.reduce((sum, q) => {
    const ops = (q.data as any)?.data?.data
    return sum + (Array.isArray(ops) ? ops.length : 0)
  }, 0)

  // ── Dynamic calculations ─────────────────────────────────────────
  const totalArea = farms.reduce((sum, f) => sum + (f.sizeHectares || 0), 0)
  const avgArea = farms.length > 0 ? (totalArea / farms.length).toFixed(1) : '0.0'
  const productsPerFarm = farms.length > 0 ? (products.length / farms.length).toFixed(1) : '0.0'
  const blockchainRecords = products.filter(p => p.blockchainTxHash || p.stellarTxHash).length

  // Override mock stat values with live data
  const liveStats = farmerStats.map((stat) => {
    switch (stat.id) {
      case 'active-products':
        return { ...stat, value: String(products.filter(p => p.status === 'available' || p.status === 'reserved').length), isLoading: isLoadingProducts }
      case 'farm-operations':
        return { ...stat, value: String(totalOperations), isLoading: isLoadingOperations }
      case 'total-farms':
        return { ...stat, value: String(farms.length), isLoading: isLoadingFarms }
      case 'total-land-area':
        return { ...stat, value: `${totalArea.toLocaleString()} ha`, isLoading: isLoadingFarms }
      case 'blockchain-records':
        return { ...stat, value: String(blockchainRecords), isLoading: isLoadingProducts }
      default:
        return stat
    }
  })

  // Helper: get the location label for a farm
  const getFarmLocation = (f: { state?: string | null; region?: string | null; lga?: string | null }) =>
    f.state || f.lga || f.region || 'Unknown'

  // ── Derive location-based grouping ────────────────────────────────
  const stateGroups = useMemo(() => {
    if (farms.length === 0) return regions
    const stateColors = ['#E8F5E9', '#E3F2FD', '#F3E5F5', '#FFF3E0', '#FCE4EC', '#E0F7FA', '#F1F8E9', '#E8EAF6']
    const stateMap = new Map<string, number>()
    farms.forEach(f => {
      const name = getFarmLocation(f)
      stateMap.set(name, (stateMap.get(name) || 0) + 1)
    })
    return Array.from(stateMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], i) => ({ name, count, color: stateColors[i % stateColors.length] }))
  }, [farms])

  // ── Live product categories ──────────────────────────────────────
  const categories = useMemo(() => {
    const map = new Map<string, number>()
    products.forEach(p => {
      const cat = p.category || 'Uncategorised'
      map.set(cat, (map.get(cat) || 0) + 1)
    })
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [products])

  const totalCategoryCount = categories.reduce((s, [, c]) => s + c, 0)
  const categoryColors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4']

  let cumulativeOffset = 0
  const segments = categories.map(([, count], i) => {
    const pct = totalCategoryCount > 0 ? (count / totalCategoryCount) * 100 : 0
    const segment = { offset: cumulativeOffset, pct, color: categoryColors[i % categoryColors.length] }
    cumulativeOffset += pct
    return segment
  })

  // ── Unique statuses for dropdown ─────────────────────────────────
  const statuses = useMemo(() => {
    const set = new Set<string>()
    products.forEach(p => { if (p.status) set.add(p.status) })
    return Array.from(set)
  }, [products])

  // ── Filtered products ────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (searchId && !p.id.toLowerCase().includes(searchId.toLowerCase())) return false
      if (searchName && !p.productName.toLowerCase().includes(searchName.toLowerCase())) return false
      if (searchFarm) {
        const farm = farms.find(f => f.id === p.farmId)
        const farmName = farm?.name || p.farmId
        if (!farmName.toLowerCase().includes(searchFarm.toLowerCase())) return false
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
      return true
    })
  }, [products, farms, searchId, searchName, searchFarm, statusFilter, categoryFilter])

  // ── Filtered farms (by search + state filter) ────────────────────
  const filteredFarms = useMemo(() => {
    return farms.filter(f => {
      // Location filter
      if (stateFilter && getFarmLocation(f) !== stateFilter) return false
      // Search
      if (farmSearch) {
        const q = farmSearch.toLowerCase()
        if (
          !f.name.toLowerCase().includes(q) &&
          !(f.region || '').toLowerCase().includes(q) &&
          !(f.lga || '').toLowerCase().includes(q) &&
          !(f.state || '').toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [farms, farmSearch, stateFilter])

  const visibleFarms = showAllFarms ? filteredFarms : filteredFarms.slice(0, 8)

  const mapFarms = filteredFarms.map((f: any) => {
    const coords = f.gpsCoordinates as any
    return {
      id: f.id,
      name: f.name,
      location: f.lga || f.state || f.region || '',
      region: f.region || '',
      hectares: f.sizeHectares || 0,
      lat: coords?.coordinates ? coords.coordinates[1] : 0,
      lng: coords?.coordinates ? coords.coordinates[0] : 0,
    }
  })

  return (
    <div className="space-y-6">
      {/* KYC Banner */}
      <KYCBanner />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {liveStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            description={stat.description}
            icon={<StatIcon name={stat.icon} />}
            trend={stat.trend}
            isLoading={(stat as any).isLoading}
          />
        ))}
      </div>

      {/* Middle Section: Upcoming Tasks + Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Tasks */}
        <div className="rounded-md border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex size-6 items-center justify-center rounded bg-brand-surface">
              <svg className="size-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Upcoming Tasks</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">Important reminders for your farms</p>

          <div className="rounded-md border-l-4 border-brand bg-brand-surface/50 p-3">
            <p className="text-sm font-semibold text-gray-900">No Upcoming Harvests</p>
            <p className="text-xs text-gray-500">No harvests expected in the next 30 days.</p>
          </div>
        </div>

        {/* Product Category Distribution */}
        <div className="rounded-md border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Category Distribution</h3>

          {/* Simple donut chart */}
          <div className="flex items-center justify-center gap-6">
            <div className="relative size-32">
              <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E8F5E9" strokeWidth="3" />
                {segments.length > 0 ? segments.map((seg, i) => (
                  <circle
                    key={i}
                    cx="18" cy="18" r="15.9"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="3"
                    strokeDasharray={`${seg.pct} ${100 - seg.pct}`}
                    strokeDashoffset={`${-seg.offset}`}
                  />
                )) : (
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4CAF50" strokeWidth="3"
                    strokeDasharray="100" strokeDashoffset="0" />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{totalCategoryCount}</span>
                <span className="text-[10px] text-gray-400">{totalCategoryCount === 1 ? 'product' : 'products'}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {categories.length > 0 ? categories.map(([name, count], i) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: categoryColors[i % categoryColors.length] }} />
                  <span className="text-xs text-gray-600 truncate max-w-[120px]">{name}</span>
                  <span className="text-xs font-bold text-gray-900">{count}</span>
                </div>
              )) : (
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-brand-light" />
                  <span className="text-xs text-gray-600">No products yet</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Summary */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">Avg. Farm Size</p>
                <p className="text-lg font-bold text-gray-900">{avgArea} ha</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Products per Farm</p>
                <p className="text-lg font-bold text-gray-900">{productsPerFarm}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions actions={quickActions} />
      </div>

      {/* Your Products Table */}
      <div className="rounded-md border border-gray-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Your Products</h3>
            <p className="text-xs text-gray-500">Overview of all your tracked products</p>
          </div>
          <span className="text-xs text-gray-400">
            {isLoadingProducts ? 'Loading...' : `Showing ${filteredProducts.length} of ${products.length} products`}
          </span>
        </div>

        {/* Filters — now functional */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-gray-500">Filters:</span>
          <input
            placeholder="Search Product ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
          />
          <input
            placeholder="Search Product Name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
          />
          <input
            placeholder="Search Farm Name..."
            value={searchFarm}
            onChange={(e) => setSearchFarm(e.target.value)}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600"
          >
            <option value="all">All Status</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600"
          >
            <option value="all">All Categories</option>
            {categories.map(([cat]) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {(searchId || searchName || searchFarm || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => { setSearchId(''); setSearchName(''); setSearchFarm(''); setStatusFilter('all'); setCategoryFilter('all') }}
              className="rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Product ID ↕</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Product Name ↕</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Farm ↕</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Status ↕</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Quantity ↕</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Created Date ↕</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {isLoadingProducts ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-3 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-3 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-3 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-3 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-3 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-3 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-3 py-4"></td>
                  </tr>
                ))
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-sm text-gray-500">
                    {products.length > 0 ? 'No products match the current filters.' : 'No products available.'}
                  </td>
                </tr>
              ) : filteredProducts.map((product) => {
                const matchedFarm = farms.find(f => f.id === product.farmId)
                return (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-3 py-3 text-xs font-mono text-gray-600">{product.id.slice(0, 8)}</td>
                    <td className="px-3 py-3 font-medium text-brand">{product.productName}</td>
                    <td className="px-3 py-3 text-gray-600">{matchedFarm?.name || product.farmId.slice(0, 8)}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${product.status === 'available'
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : product.status === 'sold'
                          ? 'border-blue-200 bg-blue-50 text-blue-700'
                          : product.status === 'reserved'
                            ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                            : 'border-brand-surface bg-brand-surface/50 text-brand'
                        }`}>
                        {product.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-600">{product.quantityAvailable} {product.unit || 'kg'}</td>
                    <td className="px-3 py-3 text-gray-600">{new Date(product.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-3 text-gray-400">—</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>Showing 1 to {filteredProducts.length} of {products.length} products</span>
          <span>Rows per page 10 · Page 1 of 1</span>
        </div>
      </div>

      {/* Farm/Crops Locations */}
      <div className="rounded-md border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Farm/Crops Locations</h3>
            <p className="text-xs text-gray-500">
              {isLoadingFarms ? 'Loading...' : `Showing ${visibleFarms.length} of ${filteredFarms.length} farms`}
            </p>
          </div>
          <div className="relative">
            <input
              placeholder="Search farms, locations, farms..."
              value={farmSearch}
              onChange={(e) => setFarmSearch(e.target.value)}
              className="rounded-md border border-gray-200 pl-8 pr-3 py-1.5 text-xs placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
            />
            <svg className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* State Tags — clickable to filter */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-gray-500">Farm Concentration by State</p>
          <div className="flex flex-wrap gap-2">
            {stateFilter && (
              <button
                onClick={() => setStateFilter(null)}
                className="flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white hover:bg-gray-700 transition-colors"
              >
                All States ✕
              </button>
            )}
            {stateGroups.slice(0, 8).map((state) => (
              <button
                key={state.name}
                onClick={() => setStateFilter(stateFilter === state.name ? null : state.name)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer ${stateFilter === state.name
                  ? 'ring-2 ring-brand ring-offset-1 shadow-sm'
                  : 'hover:shadow-sm'
                  }`}
                style={{ backgroundColor: state.color, color: '#333' }}
              >
                {state.name}
                <span className="flex size-4 items-center justify-center rounded-full bg-black/10 text-[10px]">
                  {state.count}
                </span>
              </button>
            ))}
            {stateGroups.length > 8 && (
              <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                +{stateGroups.length - 8} more states
              </span>
            )}
          </div>
        </div>

        {/* Farm Cards Grid */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Farm List</p>
            {filteredFarms.length > 8 && (
              <button
                onClick={() => setShowAllFarms(!showAllFarms)}
                className="text-xs font-medium text-brand hover:underline"
              >
                {showAllFarms ? 'Show less ←' : `Show all ${filteredFarms.length} farms →`}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {isLoadingFarms ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-md border border-gray-100 bg-white p-3 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))
            ) : visibleFarms.length === 0 ? (
              <p className="text-sm text-gray-500">{farmSearch ? 'No farms match your search.' : 'No farms registered yet.'}</p>
            ) : visibleFarms.map((farm) => (
              <div key={farm.id} className="rounded-md border border-gray-300 bg-white p-3">
                <h4 className="text-sm font-semibold text-brand">{farm.name}</h4>
                <p className="text-xs text-gray-400">{farm.state || farm.lga || farm.region}{farm.lga ? `, ${farm.lga}` : ''}</p>
                <p className="text-xs text-gray-400">by {(farm as any).contactEmail || user?.email || 'Me'}</p>
                <p className="mt-1 text-xs font-medium text-gray-600">{farm.sizeHectares || 0} ha</p>
              </div>
            ))}
          </div>
          {!showAllFarms && filteredFarms.length > 8 && (
            <button
              onClick={() => setShowAllFarms(true)}
              className="mt-3 w-full rounded-md border border-gray-200 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50"
            >
              +{filteredFarms.length - 8} more farms
            </button>
          )}
        </div>

        {/* Farm Map */}
        <div className="mb-4">
          <FarmMap farms={mapFarms} />
        </div>
      </div>
    </div>
  )
}
