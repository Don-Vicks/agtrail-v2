import { FarmMap } from '~/components/farm-map.client'
import { KYCBanner } from '~/components/kyc-banner'
import { QuickActions } from '~/components/quick-actions'
import { StatCard } from '~/components/stat-card'
import {
    farmerStats,
    farms,
    products,
    quickActions,
    regions,
} from '~/lib/mock-data/farmer'
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
  return (
    <div className="space-y-6">
      {/* KYC Banner */}
      <KYCBanner />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {farmerStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            description={stat.description}
            icon={<StatIcon name={stat.icon} />}
            trend={stat.trend}
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

          {/* Simple donut chart placeholder */}
          <div className="flex items-center justify-center gap-6">
            <div className="relative size-32">
              <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E8F5E9" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4CAF50" strokeWidth="3"
                  strokeDasharray="100" strokeDashoffset="0" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs text-brand-light">product: 1</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-brand-light" />
              <span className="text-xs text-gray-600">Agricultural Pro... 1</span>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500">Avg. Farm Size</p>
                <p className="text-lg font-bold text-gray-900">1679.0 ha</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Products per Farm</p>
                <p className="text-lg font-bold text-gray-900">0.0</p>
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
          <span className="text-xs text-gray-400">Showing {products.length} of {products.length} products</span>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-gray-500">Filters:</span>
          <input placeholder="Search Product ID..." className="rounded-md border border-gray-200 px-3 py-1.5 text-xs placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20" />
          <input placeholder="Search Product Name..." className="rounded-md border border-gray-200 px-3 py-1.5 text-xs placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20" />
          <input placeholder="Search Farm Name..." className="rounded-md border border-gray-200 px-3 py-1.5 text-xs placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20" />
          <select className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-400">
            <option>All Status</option>
          </select>
          <select className="rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-400">
            <option>All Categories</option>
          </select>
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
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Hectares ↕</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Created Date ↕</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-3 py-3 text-xs font-mono text-gray-600">{product.id}</td>
                  <td className="px-3 py-3 font-medium text-brand">{product.name}</td>
                  <td className="px-3 py-3 text-gray-600">{product.farm}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full border border-brand-surface bg-brand-surface/50 px-2 py-0.5 text-xs text-brand">
                      {product.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-600">{product.hectares}</td>
                  <td className="px-3 py-3 text-gray-600">{product.createdDate}</td>
                  <td className="px-3 py-3 text-gray-400">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>Showing 1 to {products.length} of {products.length} products</span>
          <span>Rows per page 10 · Page 1 of 1</span>
        </div>
      </div>

      {/* Farm/Crops Locations */}
      <div className="rounded-md border border-gray-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Farm/Crops Locations</h3>
            <p className="text-xs text-gray-500">Showing {farms.length > 9 ? 9 : farms.length} of {farms.length} farms</p>
          </div>
          <div className="relative">
            <input
              placeholder="Search farms, locations, farms..."
              className="rounded-md border border-gray-200 pl-8 pr-3 py-1.5 text-xs placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/20"
            />
            <svg className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Region Tags */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-gray-500">Farm Concentration by Region</p>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <span
                key={region.name}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: region.color, color: '#333' }}
              >
                {region.name}
                <span className="flex size-4 items-center justify-center rounded-full bg-black/10 text-[10px]">
                  {region.count}
                </span>
              </span>
            ))}
            <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
              +2 more regions
            </span>
          </div>
        </div>

        {/* Farm Map */}
        <div className="mb-4">
          <FarmMap farms={farms} />
        </div>

        {/* Farm Cards Grid */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Farm List</p>
            <button className="text-xs font-medium text-brand hover:underline">
              Show all {farms.length} farms →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {farms.slice(0, 8).map((farm) => (
              <div key={farm.id} className="rounded-md border border-gray-100 bg-gray-50/50 p-3">
                <h4 className="text-sm font-semibold text-brand">{farm.name}</h4>
                <p className="text-xs text-gray-400">{farm.location || farm.region}</p>
                <p className="text-xs text-gray-400">by {farm.owner}</p>
                <p className="mt-1 text-xs font-medium text-gray-600">{farm.hectares} ha</p>
              </div>
            ))}
          </div>
          {farms.length > 8 && (
            <button className="mt-3 w-full rounded-md border border-gray-200 py-2 text-xs font-medium text-gray-500 hover:bg-gray-50">
              +{farms.length - 8} more farms
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
