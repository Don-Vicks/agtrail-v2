import { QuickActions } from '~/components/quick-actions'
import { StatCard } from '~/components/stat-card'
import { FarmMap } from '~/components/farm-map.client'
import { FileText, Map, Users, Hexagon, Package, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import {
  farmPerformanceSummary,
  quickActions,
  mapFarms,
  cooperativeFarms
} from '~/lib/mock-data/cooperative'
import { useGetCooperativesDashboard } from '~/lib/api/generated/cooperatives/cooperatives'
import type { Route } from './+types/dashboard'
import { Link } from 'react-router'
import { cn } from '~/lib/utils'
import { useState } from 'react'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Cooperative Dashboard | Agrolinking' },
    { name: 'description', content: 'Overview of your cooperative operations' },
  ]
}

export default function CooperativeDashboard() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  
  const { data: dashboardResponse, isLoading: isDashboardLoading } = useGetCooperativesDashboard()
  const dashboardData: any = dashboardResponse?.data?.data || {}
  
  const {
    totalMembers = 0,
    totalFarms = 0,
    totalArea = 0,
    trackedProducts = 0,
    totalHarvests = 0
  } = dashboardData

  const categoryDetails = [
    { name: "Agricultural Products", desc: "Broad agricultural distribution across cooperative", count: 3, percent: 30, color: "#62C265" },
    { name: "Herbs", desc: "Medicinal and culinary herb categories", count: 1, percent: 10, color: "#8DE390" },
    { name: "Vegetables", desc: "Fresh produce and leaf crops", count: 1, percent: 10, color: "#183B1A" },
    { name: "Grains", desc: "Major staple crops forming the largest segment", count: 4, percent: 40, color: "#438C46" },
    { name: "Root Crops", desc: "Tubers and essential root vegetables", count: 1, percent: 10, color: "#275A29" },
  ];

  const stats = [
    {
      title: 'Total Members',
      value: totalMembers.toString(),
      subtitle: 'Farmers in cooperative',
      description: 'Active registered members',
      icon: <Users className="size-4 text-brand" />,
    },
    {
      title: 'Total Farms',
      value: totalFarms.toString(),
      subtitle: 'Registered farm locations',
      description: 'Across all members',
      icon: <Map className="size-4 text-brand" />,
    },
    {
      title: 'Total Land Area',
      value: `${totalArea} ha`,
      subtitle: 'Combined farmland',
      description: 'Total cultivated area',
      icon: <Hexagon className="size-4 text-brand" />,
    },
    {
      title: 'Tracked Products',
      value: trackedProducts.toString(),
      subtitle: 'Products in system',
      description: 'Total products being tracked',
      icon: <CheckCircle2 className="size-4 text-brand" />,
    },
    {
      title: 'Total Harvests',
      value: totalHarvests.toString(),
      subtitle: 'Completed harvests',
      description: 'Recorded harvest events',
      icon: <Package className="size-4 text-brand" />,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Strategic Alerts */}
        <div className="rounded-md border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
              <span className="text-green-600 font-bold">↑</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Strategic Alerts</h3>
              <p className="text-xs text-gray-500">System-wide monitoring alerts</p>
            </div>
          </div>
          <div className="mt-4 rounded-md border-l-4 border-blue-500 bg-blue-50/50 p-4">
            <h4 className="text-sm font-semibold text-gray-900">No Upcoming Harvests</h4>
            <p className="text-xs text-gray-600 mt-1">No harvests expected in the next 30 days.</p>
          </div>
        </div>

        {/* Product Category Distribution */}
        <div className="rounded-lg border border-gray-100 bg-white p-5 flex flex-col justify-between shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-6 font-sans">Product Category Distribution</h3>

          <div className="flex items-center gap-6 flex-1 mb-4">
            <div className="relative size-[130px] shrink-0 ml-1">
              <svg viewBox="-40 -40 80 80" className="absolute inset-0 size-full overflow-visible">
                {/* SVG Donuts */}
                <g transform="rotate(-90)">
                  {/* Agr Prod - Index 0 */}
                  <circle r="15.9155" fill="none" stroke="#62C265" strokeWidth="31.83" strokeDasharray="29 71" strokeDashoffset="0" 
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setHoveredCategory(0)} onMouseLeave={() => setHoveredCategory(null)} 
                  />
                  {/* Herbs - Index 1 */}
                  <circle r="15.9155" fill="none" stroke="#8DE390" strokeWidth="31.83" strokeDasharray="9 91" strokeDashoffset="-30" 
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setHoveredCategory(1)} onMouseLeave={() => setHoveredCategory(null)} 
                  />
                  {/* Vegetables - Index 2 */}
                  <circle r="15.9155" fill="none" stroke="#183B1A" strokeWidth="31.83" strokeDasharray="9 91" strokeDashoffset="-40" 
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setHoveredCategory(2)} onMouseLeave={() => setHoveredCategory(null)} 
                  />
                  {/* Grains - Index 3 */}
                  <circle r="15.9155" fill="none" stroke="#438C46" strokeWidth="31.83" strokeDasharray="39 61" strokeDashoffset="-50" 
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setHoveredCategory(3)} onMouseLeave={() => setHoveredCategory(null)} 
                  />
                  {/* Root Crops - Index 4 */}
                  <circle r="15.9155" fill="none" stroke="#275A29" strokeWidth="31.83" strokeDasharray="9 91" strokeDashoffset="-90" 
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setHoveredCategory(4)} onMouseLeave={() => setHoveredCategory(null)} 
                  />
                </g>

                {/* 30% label */}
                <polyline points="14,-14 20,-24 28,-24" fill="none" stroke="#62C265" strokeWidth="0.75" />
                <text x="30" y="-21" fill="#62C265" fontSize="7" fontWeight="bold" fontFamily="var(--font-sans)">30%</text>

                {/* 10% label (Herbs) */}
                <polyline points="23,9 30,12 36,12" fill="none" stroke="#8DE390" strokeWidth="0.75" />
                <text x="38" y="14.5" fill="#8DE390" fontSize="7" fontWeight="bold" fontFamily="var(--font-sans)">10%</text>

                {/* 10% label (Root crops) */}
                <polyline points="7.4,22.8 12,30 20,30" fill="none" stroke="#183B1A" strokeWidth="0.75" />
                <text x="22" y="32.5" fill="#183B1A" fontSize="7" fontWeight="bold" fontFamily="var(--font-sans)">10%</text>

                {/* 40% label */}
                <polyline points="-22.8,7.4 -30,12 -36,12" fill="none" stroke="#438C46" strokeWidth="0.75" />
                <text x="-38" y="14.5" fill="#438C46" fontSize="7" fontWeight="bold" fontFamily="var(--font-sans)" textAnchor="end">40%</text>

                {/* 10% label (Vegetables) */}
                <polyline points="-7.4,-22.8 -12,-30 -20,-30" fill="none" stroke="#275A29" strokeWidth="0.75" />
                <text x="-22" y="-27.5" fill="#275A29" fontSize="7" fontWeight="bold" fontFamily="var(--font-sans)" textAnchor="end">10%</text>
              </svg>

              {/* Stateful Tooltip Rendering */}
              {hoveredCategory !== null && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-44 bg-gray-900 border border-gray-700 text-white rounded-md p-3 shadow-xl pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: categoryDetails[hoveredCategory].color }} />
                    <p className="font-bold text-xs leading-tight tracking-wide uppercase truncate">{categoryDetails[hoveredCategory].name}</p>
                  </div>
                  <p className="text-[10px] text-gray-300 mb-2 leading-relaxed">{categoryDetails[hoveredCategory].desc}</p>
                  <div className="flex items-center justify-between text-[11px] font-medium border-t border-gray-700 pt-2">
                    <span className="text-gray-400">Share</span>
                    <span className="text-white">{categoryDetails[hoveredCategory].percent}% ({categoryDetails[hoveredCategory].count} farms)</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 py-1 flex-1 mt-1 pr-2">
              <div 
                className="flex items-center gap-2 text-xs justify-between group cursor-pointer"
                onMouseEnter={() => setHoveredCategory(0)} 
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#62C265]" />
                  <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Agricultural Pro...</span>
                </div>
                <span className="font-bold text-gray-900">3</span>
              </div>
              <div 
                className="flex items-center gap-2 text-xs justify-between group cursor-pointer"
                onMouseEnter={() => setHoveredCategory(1)} 
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#8DE390]" />
                  <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Herbs</span>
                </div>
                <span className="font-bold text-gray-900">1</span>
              </div>
              <div 
                className="flex items-center gap-2 text-xs justify-between group cursor-pointer"
                onMouseEnter={() => setHoveredCategory(3)} 
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#438C46]" />
                  <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Grains</span>
                </div>
                <span className="font-bold text-gray-900">4</span>
              </div>
              <div 
                className="flex items-center gap-2 text-xs justify-between group cursor-pointer"
                onMouseEnter={() => setHoveredCategory(2)} 
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#183B1A]" />
                  <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Vegetables</span>
                </div>
                <span className="font-bold text-gray-900">1</span>
              </div>
              <div 
                className="flex items-center gap-2 text-xs justify-between group cursor-pointer"
                onMouseEnter={() => setHoveredCategory(4)} 
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#275A29]" />
                  <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Root Crops</span>
                </div>
                <span className="font-bold text-gray-900">1</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-2 pt-4">
            <h4 className="text-[13px] font-bold text-gray-900 mb-3 font-sans tracking-tight">Quick Summary</h4>
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Avg. Farm Size</p>
                <p className="text-lg font-bold text-gray-900 tracking-tight">423.4 ha</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Products per Farm</p>
                <p className="text-lg font-bold text-gray-900 tracking-tight">1.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-md border border-gray-200 bg-white p-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/cooperative/products" className="flex items-center gap-3 rounded-lg border border-gray-100 p-2 hover:bg-gray-50 transition-colors">
              <Package className="size-4 text-green-700" />
              <span className="text-xs font-medium text-green-800">View All Products</span>
            </Link>
            <Link to="/cooperative/farms" className="flex items-center gap-3 rounded-lg border border-gray-100 p-2 hover:bg-gray-50 transition-colors">
              <Map className="size-4 text-green-700" />
              <span className="text-xs font-medium text-green-800">View All Farms</span>
            </Link>
            <Link to="/cooperative/farmers" className="flex items-center gap-3 rounded-lg border border-gray-100 p-2 hover:bg-gray-50 transition-colors">
              <Users className="size-4 text-green-700" />
              <span className="text-xs font-medium text-green-800">View All Farmers</span>
            </Link>
            <Link to="/cooperative/operations/record" className="flex items-center gap-3 rounded-lg border border-gray-100 p-2 hover:bg-gray-50 transition-colors">
              <FileText className="size-4 text-green-700" />
              <span className="text-xs font-medium text-green-800">Record Operation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Farm Performance Summary Table */}
      <div className="rounded-md border border-gray-200 bg-white p-4 overflow-hidden flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Farm Performance Summary</h3>
          <p className="text-xs text-gray-500">Performance metrics by geographic region</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <input placeholder="Search Product ID..." className="h-8 w-32 rounded-md border border-gray-200 px-3 text-xs focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none placeholder:text-gray-400" />
            <input placeholder="Search Product Name..." className="h-8 w-40 rounded-md border border-gray-200 px-3 text-xs focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none placeholder:text-gray-400" />
            <input placeholder="Search Farm Name..." className="h-8 w-40 rounded-md border border-gray-200 px-3 text-xs focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none placeholder:text-gray-400" />
            <input placeholder="Search Farmer Name..." className="h-8 w-40 rounded-md border border-gray-200 px-3 text-xs focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none placeholder:text-gray-400" />
            <select className="h-8 w-32 rounded-md border border-gray-200 px-2 text-xs text-gray-600 focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none">
              <option>All Status</option>
            </select>
            <select className="h-8 w-32 rounded-md border border-gray-200 px-2 text-xs text-gray-600 focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none">
              <option>All Compliance</option>
            </select>
          </div>
          <p className="text-[10px] text-gray-400 whitespace-nowrap">Showing 10 of 10 records</p>
        </div>

        <div className="overflow-x-auto min-h-0">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-3 py-2 font-medium">Product ID ↕</th>
                <th className="px-3 py-2 font-medium">Product Name ↕</th>
                <th className="px-3 py-2 font-medium">Farm Name ↕</th>
                <th className="px-3 py-2 font-medium">Farmer Name ↕</th>
                <th className="px-3 py-2 font-medium">Status ↕</th>
                <th className="px-3 py-2 font-medium">Exp. Yield (tons) ↕</th>
                <th className="px-3 py-2 font-medium">Current Yield (tons) ↕</th>
                <th className="px-3 py-2 font-medium">Hectares ↕</th>
                <th className="px-3 py-2 font-medium">Compliance Status ↕</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {farmPerformanceSummary.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-3 font-mono font-medium text-gray-900">{row.id}</td>
                  <td className="px-3 py-3 font-medium text-brand">{row.product}</td>
                  <td className="px-3 py-3 text-green-700">{row.farmName}</td>
                  <td className="px-3 py-3 text-green-700">{row.farmer}</td>
                  <td className="px-3 py-3 text-green-600">{row.status}</td>
                  <td className="px-3 py-3 text-gray-900">{row.yield}</td>
                  <td className="px-3 py-3 text-gray-900">{row.currentYield}</td>
                  <td className="px-3 py-3 font-mono text-gray-900">{row.hectares.toFixed(5)}</td>
                  <td className="px-3 py-3 font-medium text-orange-500">{row.compliance}</td>
                  <td className="px-3 py-3 text-gray-400">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
          <span>Showing 1 to 10 of 10 products</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <select className="rounded-md border border-gray-200 py-1 pl-2 pr-6 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20 text-gray-700">
                <option>10</option>
              </select>
            </div>
            <span>Page 1 of 1</span>
            <div className="flex gap-1">
              <button disabled className="rounded p-1 text-gray-300">«</button>
              <button disabled className="rounded p-1 text-gray-300">‹</button>
              <button disabled className="rounded p-1 text-gray-300">›</button>
              <button disabled className="rounded p-1 text-gray-300">»</button>
            </div>
          </div>
        </div>
      </div>

      {/* Farm / Crops Locations Map */}
      <div className="rounded-md border border-gray-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Farm/Crops Locations</h3>
            <p className="text-xs text-gray-500">Showing {mapFarms.length} of {mapFarms.length} farms</p>
          </div>
          <div className="relative">
            <input
              placeholder="Search forms, locations, farmer"
              className="h-8 w-full sm:w-64 rounded-md border border-gray-200 pl-8 pr-3 text-xs placeholder:text-gray-400 focus:border-brand focus:ring-1 focus:ring-brand focus:outline-none"
            />
            <svg className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Farm Concentration By Region */}
        <div className="mb-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Farm Concentration by Region</h4>
          <div className="flex flex-wrap gap-2">
            {['Z1', 'Lagos express way', 'Zango Kataf', 'Kakuri Textile Company', 'Uyerulhmrweier', 'hgahdkl'].map((region, i) => (
              <div key={region} className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1">
                <span className="text-xs font-medium text-green-800">{region}</span>
                <span className="flex size-4 items-center justify-center rounded-full bg-green-200 text-[9px] font-bold text-green-900">
                  {i === 1 || i === 2 || i === 3 ? '1' : i === 0 || i === 4 ? '1' : '1'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="mb-6">
          <FarmMap farms={mapFarms} />
        </div>

        {/* Farm List Grid */}
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">Farm List</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {cooperativeFarms.slice(0, 4).map((farm, index) => (
              <div key={farm.id} className={cn("rounded-lg border border-gray-100 p-3", index === 0 || index === 1 || index === 2 ? 'bg-green-50/30' : 'bg-white')}>
                <h5 className="text-sm font-semibold text-brand truncate" title={farm.name}>{farm.name}</h5>
                <p className="text-xs text-gray-500 truncate mt-0.5" title={farm.location}>{farm.location}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">By {farm.owner}</span>
                  <span className="text-[10px] font-bold text-gray-900">{farm.hectares} ha</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            {cooperativeFarms.slice(4, 8).map((farm) => (
              <div key={farm.id} className="rounded-lg border border-gray-100 bg-white p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <h5 className="text-sm font-semibold text-brand truncate" title={farm.name}>{farm.name}</h5>
                <p className="text-xs text-gray-500 truncate mt-0.5" title={farm.location}>{farm.location}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">By {farm.owner}</span>
                  <span className="text-[10px] font-bold text-gray-900">{farm.hectares} ha</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
