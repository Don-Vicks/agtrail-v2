import { FarmMap } from '~/components/farm-map.client'
import { KYCBanner } from '~/components/kyc-banner'
import { StatCard } from '~/components/stat-card'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  Package,
  Activity,
  MapPin,
  Maximize,
  Wallet,
  Search,
  Filter,
  ChevronDown,
  Plus,
  ArrowRight,
  ClipboardList,
  LayoutDashboard
} from 'lucide-react'
import { useGetFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import { useGetFarms, useGetFarmsStatsDashboard } from '~/lib/api/generated/farms/farms'
import { useGetWalletBalance } from '~/lib/api/generated/wallet/wallet'
import { QuickActions } from '~/components/quick-actions'
import {
  quickActions as MOCK_QUICK_ACTIONS
} from '~/lib/mock-data/farmer'
import type { Route } from './+types/dashboard'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Farmer Dashboard | Agrolinking' },
    { name: 'description', content: 'Overview of your farming operations' },
  ]
}

// StatIcon removed in favor of consistent lucide-react usage in StatCard components

export default function FarmerDashboard() {
  // API hooks for real data
  const { data: walletResponse, isLoading: isWalletLoading } = useGetWalletBalance()
  const { data: farmsResponse, isLoading: isFarmsLoading } = useGetFarms()
  const { data: productsResponse, isLoading: isProductsLoading } = useGetFarmersProducts()
  const { data: farmersStatsResponse, isLoading: isStatsLoading } = useGetFarmsStatsDashboard()

  // Extract real data
  const walletData = walletResponse?.data?.data
  const farmsData = farmsResponse?.data?.data || []
  const productsData = productsResponse?.data?.data || []

  // Calculate real stats
  const totalFarms = farmsData.length
  const totalProducts = productsData.length
  const totalLandArea = farmsData.reduce((sum, farm) => sum + (farm.sizeHectares || 0), 0)

  // Calculate regions from real farm data
  const regions = isFarmsLoading ? [] : farmsData.reduce((acc, farm) => {
    const regionName = farm.region || farm.state || 'Unknown'
    const existing = acc.find(r => r.name === regionName)
    if (existing) {
      existing.count++
    } else {
      acc.push({
        name: regionName,
        count: 1,
        color: '#e8f5e9' // Default green color
      })
    }
    return acc
  }, [] as Array<{ name: string, count: number, color: string }>)

  return (
    <div className="space-y-6 pb-10 px-1">

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Farmer Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your farming operations, production, and farms</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm">
            <Plus className="size-4" />
            <span className="font-bold uppercase tracking-wide text-xs">Add Farm</span>
          </Button>
        </div>
      </div>

      {/* KYC Banner */}
      <KYCBanner />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Wallet Balance"
          value={isWalletLoading ? '...' : `${walletData?.balance?.toLocaleString() || '0'} ${walletData?.currency || 'NGN'}`}
          subtitle="Available funds"
          description="Current wallet balance"
          icon={<Wallet className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Active Products"
          value={isProductsLoading ? '...' : totalProducts.toString()}
          subtitle="Production unit"
          description="Currently tracked items"
          icon={<Package className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Operations"
          value={isStatsLoading ? '...' : (farmersStatsResponse?.data?.data as any)?.operationsLast30Days || '0'}
          subtitle="Recent activity"
          description="Logged in last 30 days"
          icon={<Activity className="size-4" />}
          trend="up"
        />
        <StatCard
          title="Total Farms"
          value={isFarmsLoading ? '...' : totalFarms.toString()}
          subtitle="Registered farms"
          description="Verified farm locations"
          icon={<MapPin className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Total Land Area"
          value={isFarmsLoading ? '...' : `${totalLandArea.toFixed(1)} ha`}
          subtitle="Cultivated area"
          description="Combined farmland size"
          icon={<Maximize className="size-4" />}
          trend="up"
        />
      </div>

      {/* Middle Section: Upcoming Tasks + Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Tasks */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <ClipboardList className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Upcoming Tasks</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Scheduled activities</p>
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50/50 p-4">
            <p className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1">No Upcoming Harvests</p>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">Your current production cycles do not have any harvests scheduled for the next 30 days.</p>
          </div>
        </div>

        {/* Product Category Distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-6">Products</h3>

          {/* Simple donut chart placeholder */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative size-32">
              <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F5F5F5" strokeWidth="4" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1B4332" strokeWidth="4"
                  strokeDasharray="100" strokeDashoffset="0" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-brand uppercase tracking-widest text-[10px]">Active</span>
                <span className="text-lg font-bold text-gray-900">100%</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-brand" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Agri Products</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-gray-200" />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Other</span>
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="mt-4 border-t border-gray-50 pt-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Farm Performance</h4>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-xl font-bold text-gray-900 tracking-tight">
                  {isFarmsLoading ? '...' : totalFarms > 0 ? (totalLandArea / totalFarms).toFixed(1) : '0.0'} ha
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg. Size</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 tracking-tight">
                  {isFarmsLoading || isProductsLoading ? '...' : totalFarms > 0 ? (totalProducts / totalFarms).toFixed(1) : '0.0'}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Prod / Farm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions actions={MOCK_QUICK_ACTIONS} />
      </div>

      {/* Your Products Table Block */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 bg-white border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Products</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Overview of your crops</p>
            </div>
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by identity or name..."
                className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          {/* High Density Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Filter By:</span>
              <div className="relative">
                <select className="h-9 rounded-lg border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none">
                  <option>All Farms</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
              </div>
              <div className="relative">
                <select className="h-9 rounded-lg border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none">
                  <option>Production Status</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-50 bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Product ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Product Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Farm Context</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Inventory</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Harvest Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {isProductsLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin size-6 border-2 border-brand border-t-transparent rounded-full" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Loading Product Catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : productsData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                    No associated products found
                  </td>
                </tr>
              ) : (
                productsData.slice(0, 10).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-[11px] font-bold text-gray-400 tracking-widest uppercase">#{product.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">{product.productName}</td>
                    <td className="px-6 py-4 text-xs font-bold text-brand italic">
                      {farmsData.find(f => f.id === product.farmId)?.name || 'Central Collective'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0 bg-[#e8f5e9] text-[#1b4332] border-[#b7e4c7]"
                      >
                        {product.status || 'Active'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">
                      {product.quantityAvailable || product.quantityHarvested || 0} {product.unit || 'KG'}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500 italic">
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="size-8 text-gray-300 hover:text-gray-900 transition-colors">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Total:</span>
            <span className="text-gray-900">{productsData.length} Products</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Show</span>
              <select className="bg-transparent border-none outline-none text-gray-900 font-bold">
                <option>10</option>
                <option>25</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Page 1 / 1</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-7 text-gray-300" disabled>
                  <ArrowRight className="size-3.5 rotate-180" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7 text-gray-400 hover:text-brand">
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Farm/Crops Locations Block */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Farm Locations</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">See where your farms are located</p>
          </div>
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              placeholder="Search farms..."
              className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Region Tags */}
        <div className="mb-8">
          <p className="mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Farms by Region</p>
          <div className="flex flex-wrap gap-2">
            {regions.slice(0, 3).map((region) => (
              <Badge
                key={region.name}
                variant="outline"
                className="flex items-center gap-2 rounded-lg px-4 py-1.5 font-bold uppercase tracking-tight text-[11px] border-gray-100 bg-gray-50/50 text-gray-700"
              >
                {region.name}
                <span className="flex size-5 items-center justify-center rounded-md bg-white border border-gray-100 text-[10px] text-brand shadow-sm">
                  {region.count}
                </span>
              </Badge>
            ))}
            {regions.length > 3 && (
              <Badge variant="ghost" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">+ {regions.length - 3} MORE</Badge>
            )}
          </div>
        </div>

        {/* Farm Map */}
        <div className="mb-8 rounded-xl overflow-hidden border border-gray-100">
          <FarmMap farms={farmsData.map(farm => ({
            id: farm.id,
            name: farm.name,
            location: farm.state || farm.region || 'Unknown',
            region: farm.region || farm.state || 'Unknown',
            hectares: farm.sizeHectares || 0,
            lat: farm.gpsCoordinates ? (farm.gpsCoordinates as any).coordinates[1] : 9.0820,
            lng: farm.gpsCoordinates ? (farm.gpsCoordinates as any).coordinates[0] : 8.6753,
          }))} />
        </div>

        {/* Farm List Section */}
        <div className="mt-8 pt-8 border-t border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Your Farms</h3>
            <Button variant="link" className="text-xs font-bold uppercase tracking-widest text-brand p-0 h-auto">
              View All Farms ({isFarmsLoading ? '...' : farmsData.length}) <ArrowRight className="ms-1 size-3" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isFarmsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/30 p-4 animate-pulse h-24" />
              ))
            ) : farmsData.length === 0 ? (
              <div className="col-span-full py-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                No farms registered yet
              </div>
            ) : (
              farmsData.slice(0, 4).map((farm) => (
                <div key={farm.id} className="rounded-xl border border-gray-100 bg-gray-50/30 p-5 group hover:bg-white hover:shadow-md transition-all">
                  <h4 className="text-sm font-bold text-gray-900 tracking-tight uppercase mb-1">{farm.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <MapPin className="size-3 text-red-400" />
                    {farm.state || farm.region || 'Unknown Location'}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-brand tracking-tight">{farm.sizeHectares || 0} ha</p>
                    <Badge variant="ghost" className="text-[9px] font-bold text-gray-300 uppercase tracking-widest p-0">#{farm.id.slice(0, 8)}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
