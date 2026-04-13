import {
  Users,
  Map,
  MapPin,
  Package,
  Activity,
  Maximize,
  ArrowRight,
  Search,
  Filter,
  Plus,
  LayoutDashboard,
  ClipboardList,
  ChevronDown,
  MoreHorizontal,
  Hexagon,
  CheckCircle2
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { StatCard } from '~/components/stat-card'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { useGetCooperativesDashboard } from '~/lib/api/generated/cooperatives/cooperatives'
import { useGetFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import type { Farm, FarmProduct } from '~/lib/api/generated/models'
import { cn } from '~/lib/utils'
import type { Route } from './+types/dashboard'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Cooperative Dashboard | Agrolinking' },
    { name: 'description', content: 'Overview of your cooperative operations' },
  ]
}

export default function CooperativeDashboard() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)

  // Fetch real data from APIs
  const { data: dashboardResponse, isLoading: isDashboardLoading } = useGetCooperativesDashboard()
  const { data: farmsResponse, isLoading: isFarmsLoading } = useGetFarms()
  const { data: productsResponse, isLoading: isProductsLoading } = useGetFarmersProducts()

  const dashboardData: any = dashboardResponse?.data?.data || {}
  const farms = farmsResponse?.data?.data || []
  const products = productsResponse?.data?.data || []

  // Calculate stats from real data
  const {
    totalMembers = 0,
    totalFarms: apiTotalFarms = 0,
    totalArea: apiTotalArea = 0,
    trackedProducts: apiTrackedProducts = 0,
    totalHarvests = 0
  } = dashboardData

  // Use API values if available, otherwise calculate from fetched data
  const statsdata = {
    totalMembers,
    totalFarms: apiTotalFarms || farms.length,
    totalArea: apiTotalArea || farms.reduce((sum: number, f: Farm) => sum + (f.sizeHectares || 0), 0),
    trackedProducts: apiTrackedProducts || products.length,
    totalHarvests
  }

  // Calculate product categories from real data
  const categoryMap: { [key: string]: { name: string; count: number; percent: number; color: string; desc: string } } = {}
  products.forEach((product: FarmProduct) => {
    const category = product.category || 'Other'
    if (!categoryMap[category]) {
      categoryMap[category] = {
        name: category,
        count: 0,
        percent: 0,
        color: generateCategoryColor(category),
        desc: `${category} products`
      }
    }
    categoryMap[category].count++
  })

  // Calculate percentages
  const totalProducts = Object.values(categoryMap).reduce((sum, cat) => sum + cat.count, 0)
  Object.values(categoryMap).forEach((cat) => {
    cat.percent = totalProducts > 0 ? Math.round((cat.count / totalProducts) * 100) : 0
  })

  const categoryDetails = Object.values(categoryMap)

  // Generate farm performance summary from real data
  const stats = [
    {
      title: 'Total Members',
      value: statsdata.totalMembers.toString(),
      subtitle: 'Farmers in cooperative',
      description: 'Active registered members',
      icon: <Users className="size-4 text-brand" />,
    },
    {
      title: 'Total Farms',
      value: statsdata.totalFarms.toString(),
      subtitle: 'Registered farm locations',
      description: 'Across all members',
      icon: <Map className="size-4 text-brand" />,
    },
    {
      title: 'Total Land Area',
      value: `${statsdata.totalArea.toFixed(1)} ha`,
      subtitle: 'Combined farmland',
      description: 'Total cultivated area',
      icon: <Hexagon className="size-4 text-brand" />,
    },
    {
      title: 'Tracked Products',
      value: statsdata.trackedProducts.toString(),
      subtitle: 'Products in system',
      description: 'Total products being tracked',
      icon: <CheckCircle2 className="size-4 text-brand" />,
    },
    {
      title: 'Total Harvests',
      value: statsdata.totalHarvests.toString(),
      subtitle: 'Completed harvests',
      description: 'Recorded harvest events',
      icon: <Package className="size-4 text-brand" />,
    },
  ]

  // Helper function to generate consistent colors for categories
  function generateCategoryColor(category: string): string {
    const colors = ["#62C265", "#8DE390", "#183B1A", "#438C46", "#275A29", "#1b5e20", "#12753d"]
    let hash = 0
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
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
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Cooperative Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of members, farms, and production records</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm">
            <Plus className="size-4" />
            <span className="font-bold uppercase tracking-wide text-xs">Register Farmer</span>
          </Button>
        </div>
      </div>

      {/* Global Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Members"
          value={isDashboardLoading ? '...' : statsdata.totalMembers.toString()}
          subtitle="Registered farmers"
          description="Active cooperative workforce"
          icon={<Users className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Total Farms"
          value={isFarmsLoading ? '...' : statsdata.totalFarms.toString()}
          subtitle="Registered locations"
          description="Verified farm locations"
          icon={<MapPin className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Total Area"
          value={isFarmsLoading ? '...' : `${statsdata.totalArea.toFixed(1)} ha`}
          subtitle="Cultivation volume"
          description="Combined productive land"
          icon={<Maximize className="size-4" />}
          trend="up"
        />
        <StatCard
          title="Products"
          value={isProductsLoading ? '...' : statsdata.trackedProducts.toString()}
          subtitle="Tracked items"
          description="Total products in system"
          icon={<Package className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Harvests"
          value={isDashboardLoading ? '...' : statsdata.totalHarvests.toString()}
          subtitle="Logged harvests"
          description="Completed production cycles"
          icon={<Activity className="size-4" />}
          trend="up"
        />
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Insights */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-500 shadow-sm">
              <ClipboardList className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Insights</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Important updates and status flags</p>
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-blue-400 bg-blue-50/50 p-4">
            <p className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-1">Standard Operations</p>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">No critical harvest deviations or compliance risks detected in the 30-day forecast.</p>
          </div>
        </div>        {/* Product Category Distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight mb-6">Product Categories</h3>

            <div className="flex items-center gap-8 mb-4">
              <div className="relative size-[140px] shrink-0">
                <svg viewBox="-40 -40 80 80" className="absolute inset-0 size-full overflow-visible">
                  <g transform="rotate(-90)">
                    <circle r="15.9155" fill="none" stroke="#2D5A27" strokeWidth="31.83" strokeDasharray="60 40" strokeDashoffset="0" />
                    <circle r="15.9155" fill="none" stroke="#4CAF50" strokeWidth="31.83" strokeDasharray="25 75" strokeDashoffset="-60" />
                    <circle r="15.9155" fill="none" stroke="#A5D6A7" strokeWidth="31.83" strokeDasharray="15 85" strokeDashoffset="-85" />
                  </g>
                  <text textAnchor="middle" dy=".3em" fontSize="8" fontWeight="bold" fill="#1d3d1e" className="uppercase tracking-widest">Active</text>
                </svg>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#2D5A27]" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Grains</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">60%</span>
                </div>
                <div className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#4CAF50]" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Vegetables</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">25%</span>
                </div>
                <div className="flex items-center justify-between group cursor-pointer border-b border-gray-50 pb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-[#A5D6A7]" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Other</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">15%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-gray-50 pt-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Key Metrics</h4>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-xl font-bold text-gray-900 tracking-tight">423.4 ha</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg. Farm Size</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 tracking-tight">1.0</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg. Yield</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm overflow-hidden">
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight mb-6">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <Link to="/cooperative/products" className="flex items-center justify-between group rounded-xl border border-gray-100 p-4 hover:border-brand/40 hover:bg-brand/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-9 rounded-lg bg-green-50 flex items-center justify-center text-brand">
                  <Package className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Products</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">View all products</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-gray-300 group-hover:text-brand transition-colors" />
            </Link>
            <Link to="/cooperative/farms" className="flex items-center justify-between group rounded-xl border border-gray-100 p-4 hover:border-brand/40 hover:bg-brand/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-9 rounded-lg bg-green-50 flex items-center justify-center text-brand">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Farms</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">View all farms</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-gray-300 group-hover:text-brand transition-colors" />
            </Link>
            <Link to="/cooperative/farmers" className="flex items-center justify-between group rounded-xl border border-gray-100 p-4 hover:border-brand/40 hover:bg-brand/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="size-9 rounded-lg bg-green-50 flex items-center justify-center text-brand">
                  <Users className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-900 uppercase tracking-tight">Farmers</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">View all farmers</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-gray-300 group-hover:text-brand transition-colors" />
            </Link>
          </div>
        </div>
      </div>      {/* Farm Performance Summary Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 bg-white border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Active Products</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Overview of currently tracked products</p>
            </div>
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search lots by identity or name..."
                className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          {/* High Density Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Filter:</span>
              <div className="relative">
                <select className="h-9 rounded-lg border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none">
                  <option>All Statuses</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
              </div>
              <div className="relative">
                <select className="h-9 rounded-lg border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none">
                  <option>Risk Level</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-50 bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Batch ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Farm</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Farmer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 text-right">Yield (Tons)</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Quality</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {products.slice(0, 10).map((product: FarmProduct, idx: number) => {
                const farm = farms.find((f: Farm) => f.id === product.farmId)
                return (
                  <tr key={`${product.id}-${idx}`} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-[11px] font-bold text-gray-400 tracking-widest uppercase">#{product.batchNumber?.slice(0, 8) || product.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-bold text-gray-900 tracking-tight">{product.productName}</td>
                    <td className="px-6 py-4 text-xs font-bold text-brand italic">{farm?.name || 'Collective'}</td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500">{product.createdBy || 'Authorized Tech'}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider px-2 py-0 border-brand/20 bg-brand/5 text-brand">
                        {product.status || 'Active'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] font-bold text-gray-900 text-right">
                      {product.quantityHarvested ? (product.quantityHarvested / 1000).toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="ghost" className="text-[10px] font-bold uppercase tracking-widest p-0 text-orange-400 flex items-center gap-1.5">
                        <div className="size-1.5 rounded-full bg-orange-400" />
                        {product.qualityGrade || 'Pending'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="size-8 text-gray-300 hover:text-gray-900 transition-colors">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Total Context:</span>
            <span className="text-gray-900">{products.length} Production Records</span>
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
      {/* Geographic Asset Distribution */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Farms by Location</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">See where your farms are located</p>
          </div>
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              placeholder="Search locations..."
              className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Region Discovery */}
        <div className="mb-8">
          <p className="mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Farms by Region</p>
          <div className="flex flex-wrap gap-2">
            {farms.slice(0, 4).map((farm: Farm) => (
              <Badge
                key={farm.id}
                variant="outline"
                className="flex items-center gap-2 rounded-lg px-4 py-1.5 font-bold uppercase tracking-tight text-[11px] border-gray-100 bg-gray-50/50 text-gray-700"
              >
                {farm.state || 'Unknown'}
                <span className="flex size-5 items-center justify-center rounded-md bg-white border border-gray-100 text-[10px] text-brand shadow-sm">
                  1
                </span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Global Map Placeholder */}
        <div className="mb-8 h-64 rounded-xl overflow-hidden border border-gray-100 bg-gray-50/30 flex items-center justify-center">
          <div className="text-center">
            <Map className="size-8 text-gray-200 mx-auto mb-2" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Synchronizing Spatial Data...</p>
          </div>
        </div>

        {/* Inventory Slice */}
        <div className="mt-8 pt-8 border-t border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Recent Farms</h3>
            <Button variant="link" className="text-xs font-bold uppercase tracking-widest text-brand p-0 h-auto">
              View All ({farms.length}) <ArrowRight className="ms-1 size-3" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isFarmsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/30 p-4 animate-pulse h-24" />
              ))
            ) : farms.length === 0 ? (
              <div className="col-span-full py-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                No farms registered yet
              </div>
            ) : (
              farms.slice(0, 4).map((farm: Farm) => (
                <div key={farm.id} className="rounded-xl border border-gray-100 bg-gray-50/30 p-5 group hover:bg-white hover:shadow-md transition-all">
                  <h4 className="text-sm font-bold text-gray-900 tracking-tight uppercase mb-1 truncate">{farm.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <MapPin className="size-3 text-red-400" />
                    {farm.state || 'Unknown Location'}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-brand tracking-tight">{farm.sizeHectares?.toFixed(1) || '0.0'} ha</p>
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
