import {
  Activity,
  ArrowRight,
  ChevronDown,
  ClipboardList,
  MapPin,
  Maximize,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Wallet
} from 'lucide-react'
import { FarmMap } from '~/components/farm-map.client'
import { KYCBanner } from '~/components/kyc-banner'
import { QuickActions } from '~/components/quick-actions'
import { StatCard } from '~/components/stat-card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { useGetFarmersDashboardStats } from '~/lib/api/generated/farmers/farmers'
import {
  quickActions as MOCK_QUICK_ACTIONS
} from '~/lib/mock-data/farmer'
import { Link } from 'react-router'
import { PageHeader } from '~/components/page-header'
import type { Route } from './+types/dashboard'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Farmer Dashboard | Agrolinking' },
    { name: 'description', content: 'Overview of your farming operations' },
  ]
}

// StatIcon removed in favor of consistent lucide-react usage in StatCard components

export default function FarmerDashboard() {
  // Single API hook for consolidated dashboard data
  const { data: dashboardResponse, isLoading } = useGetFarmersDashboardStats()

  // Extract real data layers
  const statsData = dashboardResponse?.data?.data
  const metrics = statsData?.metrics
  const insights = statsData?.insights
  const activeProducts = statsData?.activeProducts || []
  const upcomingTasks = statsData?.upcomingTasks || []
  const upcomingTasksLimit = 5
  const displayedUpcomingTasks = upcomingTasks.slice(0, upcomingTasksLimit)
  const farmsByRegion = statsData?.farmsByRegion || []

  // Flatten farms from region groups for mapping and counts
  const farmsData = farmsByRegion.flatMap(region => region.farms.map(farm => ({
    ...farm,
    // Add defaults for missing fields in aggregated schema
    sizeHectares: farm.totalArea ?? 0,
    areaUnit: farm.areaUnit ?? 'ha',
    region: region.region
  })))

  // Formatting regions for badges
  const formattedRegions = farmsByRegion.map(r => ({
    name: r.region,
    count: r.count,
    color: '#e8f5e9' // Default branding green
  }))

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        items={[
          {
            label: 'Farmer',
            href: '/farmer',
          },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link to="/farmer/farms/new">
              <Button
                className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm"
              >
                <Plus className="size-4" />
                <span className="font-bold uppercase tracking-wide text-xs">Add Farm</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Greeting and subtitle moved below PageHeader */}
      <div className="px-1">
        <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Farmer Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your farming operations, production, and farms</p>
      </div>

      {/* KYC Banner */}
      <KYCBanner />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Wallet Balance"
          value={isLoading ? '...' : metrics?.walletBalance || '0 NGN'}
          subtitle="Available funds"
          description="Current wallet balance"
          icon={<Wallet className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Active Products"
          value={isLoading ? '...' : (metrics?.activeProducts || 0).toString()}
          subtitle="Production unit"
          description="Currently tracked items"
          icon={<Package className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Operations"
          value={isLoading ? '...' : (metrics?.operationsLast30Days || 0).toString()}
          subtitle="Recent activity"
          description="Logged in last 30 days"
          icon={<Activity className="size-4" />}
          trend="up"
        />
        <StatCard
          title="Total Farms"
          value={isLoading ? '...' : (metrics?.totalFarms || 0).toString()}
          subtitle="Registered farms"
          description="Verified farm locations"
          icon={<MapPin className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Total Land Area"
          value={isLoading ? '...' : `${metrics?.totalLandArea?.toFixed(1) || '0.0'} ha`}
          subtitle="Cultivated area"
          description="Combined farmland size"
          icon={<Maximize className="size-4" />}
          trend="up"
        />
      </div>

      {/* Middle Section: Upcoming Tasks + Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Tasks */}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex size-8 items-center justify-center rounded-md bg-red-50 text-red-500">
              <ClipboardList className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Upcoming Tasks</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Scheduled activities</p>
            </div>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="rounded-md border-l-4 border-gray-100 bg-gray-50/50 p-4 animate-pulse h-20" />
            ) : upcomingTasks.length > 0 ? (
              <>
                {displayedUpcomingTasks.map((task, idx) => (
                  <div key={idx} className="rounded-md border-l-4 border-amber-400 bg-amber-50/50 p-4">
                    <p className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1">{task.title}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      {task.date ? new Date(task.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date set'}
                    </p>
                  </div>
                ))}
                {upcomingTasks.length > upcomingTasksLimit ? (
                  <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    +{upcomingTasks.length - upcomingTasksLimit} more scheduled
                  </p>
                ) : null}
              </>
            ) : (
              <div className="rounded-md border-l-4 border-amber-400 bg-amber-50/50 p-4">
                <p className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1">No Upcoming Tasks</p>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">Your current production cycles do not have any tasks scheduled for the next 30 days.</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Category Distribution */}
        <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
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
              {(statsData?.productCategories || []).length > 0 ? (
                statsData?.productCategories.map((cat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-brand" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{cat.name} ({cat.percentage}%)</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-brand" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Agri Products</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Summary */}
          <div className="mt-4 border-t border-gray-50 pt-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Farm Performance</h4>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-xl font-bold text-gray-900 tracking-tight">
                  {isLoading ? '...' : `${insights?.avgFarmSize?.toFixed(1) || '0.0'} ha`}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg. Size</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 tracking-tight">
                  {isLoading ? '...' : `${insights?.avgYield?.toFixed(1) || '0.0'}`}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg. Yield</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions actions={MOCK_QUICK_ACTIONS} />
      </div>

      {/* Your Products Table Block */}
      <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
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
                className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          {/* High Density Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Filter By:</span>
              <div className="relative">
                <select className="h-9 rounded-md border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none">
                  <option>All Farms</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
              </div>
              <div className="relative">
                <select className="h-9 rounded-md border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none">
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin size-6 border-2 border-brand border-t-transparent rounded-full" />
                      <span className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Loading Product Catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : activeProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                    No associated products found
                  </td>
                </tr>
              ) : (
                activeProducts.slice(0, 10).map((product, idx) => (
                  <tr key={product.batchId || idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-[11px] font-bold text-gray-400 tracking-widest uppercase">#{product.batchId?.slice(0, 8) || 'N/A'}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">{product.product}</td>
                    <td className="px-6 py-4 text-xs font-bold text-brand italic">
                      {product.farm}
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
                      {product.yield || 0} KG
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500 italic">
                      {product.harvestDate ? new Date(product.harvestDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="size-8 text-gray-300 hover:text-gray-900 transition-colors">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </td>
                  </tr>
                )))
              }
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Total:</span>
            <span className="text-gray-900">{activeProducts.length} Products</span>
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
      <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Farm Locations</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">See where your farms are located</p>
          </div>
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              placeholder="Search farms..."
              className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Region Tags */}
        <div className="mb-8">
          <p className="mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Farms by Region</p>
          <div className="flex flex-wrap gap-2">
            {formattedRegions.slice(0, 3).map((region) => (
              <Badge
                key={region.name}
                variant="outline"
                className="flex items-center gap-2 rounded-md px-4 py-1.5 font-bold uppercase tracking-tight text-[11px] border-gray-100 bg-gray-50/50 text-gray-700"
              >
                {region.name}
                <span className="flex size-5 items-center justify-center rounded-md bg-white border border-gray-100 text-[10px] text-brand shadow-sm">
                  {region.count}
                </span>
              </Badge>
            ))}
            {formattedRegions.length > 3 && (
              <Badge variant="ghost" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">+ {formattedRegions.length - 3} MORE</Badge>
            )}
          </div>
        </div>

        {/* Farm Map */}
        <div className="mb-8 rounded-md overflow-hidden border border-gray-100">
          <FarmMap farms={farmsData.map(farm => ({
            id: farm.id,
            name: farm.name,
            location: farm.state || 'Unknown',
            region: farm.region || 'Unknown',
            hectares: 0,
            lat: farm.coordinates ? (farm.coordinates as any).coordinates[1] : 9.0820,
            lng: farm.coordinates ? (farm.coordinates as any).coordinates[0] : 8.6753,
          }))} />
        </div>

        {/* Farm List Section */}
        <div className="mt-8 pt-8 border-t border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Your Farms</h3>
            <Button variant="link" className="text-xs font-bold uppercase tracking-widest text-brand p-0 h-auto">
              View All Farms ({isLoading ? '...' : farmsData.length}) <ArrowRight className="ms-1 size-3" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-md border border-gray-100 bg-gray-50/30 p-4 animate-pulse h-24" />
              ))
            ) : farmsData.length === 0 ? (
              <div className="col-span-full py-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                No farms registered yet
              </div>
            ) : (
              farmsData.slice(0, 4).map((farm) => (
                <div key={farm.id} className="rounded-md border border-gray-100 bg-gray-50/30 p-5 group hover:bg-white hover:shadow-md transition-all">
                  <h4 className="text-sm font-bold text-gray-900 tracking-tight uppercase mb-1">{farm.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <MapPin className="size-3 text-red-400" />
                    {farm.state || 'Unknown Location'}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-brand tracking-tight">
                      {farm.totalArea != null ? `${Number(farm.totalArea).toFixed(1)} ${farm.areaUnit || 'ha'}` : 'N/A'}
                    </p>
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
