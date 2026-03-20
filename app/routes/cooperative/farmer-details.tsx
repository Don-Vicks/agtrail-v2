import { Link, useParams } from 'react-router'
import { cooperativeFarmers } from '~/lib/mock-data/cooperative'
import { Plus } from 'lucide-react'
import { Breadcrumb } from '~/components/breadcrumb'
import type { Route } from './+types/farmer-details'

export function meta({ params }: Route.MetaArgs) {
  const farmer = cooperativeFarmers.find((f) => f.id === params.id)
  return [
    { title: `${farmer?.name || 'Farmer'} Details | Agrolinking` },
    { name: 'description', content: 'Farmer profile and activities overview' },
  ]
}

export default function CooperativeFarmerDetails() {
  const { id } = useParams()
  const farmer = cooperativeFarmers.find((f) => f.id === id) || cooperativeFarmers[0]

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <Breadcrumb
        items={[
          {
            label: 'Cooperative',
            href: '/cooperative',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Farmers', href: '/cooperative/farmers' },
          { label: farmer.name }
        ]}
      />

      {/* Page Header */}
      <div>
        <h1 className="text-lg font-bold text-[#18421A] uppercase tracking-wide">FARMER DETAILS</h1>
        <p className="text-xs text-gray-500 mt-1">View and manage farmer profile and activities</p>
      </div>

      {/* Profile Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <img 
            src={farmer.avatar} 
            alt={farmer.name} 
            className="size-12 rounded-full object-cover bg-gray-100" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(farmer.name)}&background=random`
            }}
          />
          <div>
            <h2 className="text-base font-bold text-gray-900">{farmer.name}</h2>
            <p className="text-xs text-gray-600">MDs, {farmer.identifier && 'adasd, '}Nigeria</p>
            <p className="text-xs text-gray-500">{farmer.phone || '+2348232313123'}</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link 
            to={`/cooperative/farmers/${farmer.id}/farms`}
            className="flex items-center justify-center gap-1.5 rounded-md bg-[#2B5C2D] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-black w-full sm:w-auto"
          >
            <Plus className="size-3.5" />
            Record Crop Operation
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Harvests', value: '0', subtitle: 'No harvests yet', desc: 'Total number of completed harvests', trend: '~ 0%' },
          { title: 'Total Land Size', value: '0.00 ha', subtitle: 'No farms registered', desc: 'Total cultivated land area', trend: '~ 0 farms' },
          { title: 'Active Products', value: '0', subtitle: 'No active crops', desc: 'Products in cultivation', trend: '~ 0 total' },
          { title: 'Total Farms', value: '0', subtitle: 'No farms yet', desc: 'Number of registered farms', trend: '~ 0 farms' }
        ].map((stat, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500">{stat.title}</span>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                <svg width="18" height="9" viewBox="0 0 20 10" fill="none" className="opacity-60">
                  <path d="M1 8C3 8 4 3 7 3C10 3 12 7 15 7C17 7 18 4 19 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {stat.trend}
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-3">{stat.value}</p>
            <p className="text-xs font-semibold text-gray-900 mb-0.5">{stat.subtitle}</p>
            <p className="text-[10px] text-gray-400">{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Crop Cycles */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs flex flex-col min-h-[260px]">
          <h3 className="text-sm font-bold text-gray-900">Crop Cycles</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Active crop cycles across all farms</p>
          
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <p className="text-xs font-bold text-gray-500">No crop cycles yet</p>
            <p className="text-[10px] text-gray-400 mt-1 text-center">Start your first crop cycle to begin tracking</p>
          </div>
          
          <Link 
            to={`/cooperative/farmers/${farmer.id}/farms`}
            className="flex items-center justify-center gap-1.5 rounded-md bg-[#2B5C2D] py-2 text-xs font-medium text-white transition-colors hover:bg-black w-full mt-auto"
          >
            <Plus className="size-3.5" />
            Start New Crop Cycle
          </Link>
        </div>

        {/* Center column stack (Crop Distribution + Farm Overview) */}
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs min-h-[130px] flex flex-col">
            <h3 className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Crop Distribution by Category</h3>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs font-medium text-gray-400">No crop data available</p>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs flex-1 flex flex-col justify-between">
            <h3 className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider">Farm Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span className="text-xs font-medium text-gray-500">Total Farms</span>
                <span className="text-sm font-bold text-gray-900 tracking-tight">0</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <span className="text-xs font-medium text-gray-500">Total Land</span>
                <span className="text-sm font-bold text-gray-900 tracking-tight">0.00 ha</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-medium text-gray-500">Active Products</span>
                <span className="text-sm font-bold text-gray-900 tracking-tight">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Alerts */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xs min-h-[260px] flex flex-col">
          <div className="flex items-start gap-2">
            <div className="flex size-5 shrink-0 items-center justify-center rounded bg-green-50">
              <svg className="size-3.5 text-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Strategic Alerts</h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Upcoming harvests and important dates</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold text-gray-500">No upcoming harvests</p>
            <p className="text-[10px] text-gray-400 mt-1">Alerts will appear when harvest dates approach</p>
          </div>
        </div>
      </div>
    </div>
  )
}
