import { 
  Plus, 
  Search, 
  MapPin, 
  Maximize, 
  Activity, 
  ArrowRight, 
  LayoutDashboard,
  Filter,
  ChevronDown
} from 'lucide-react'
import { useState } from 'react'
import { CreateFarmModal } from '~/components/create-farm-modal'
import { FarmCard } from '~/components/farm-card'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { Button } from '~/components/ui/button'
import { useGetCooperativesFarms as useGetCopertativesFarms } from '~/lib/api/generated/cooperatives/cooperatives'
import type { Route } from './+types/farms'
import { cn } from '~/lib/utils'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'All Farms | Agrolinking Cooperative' },
    { name: 'description', content: 'Manage all cooperative farms' },
  ]
}

export default function CooperativeFarms() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage)

  const { data: farmsResponse, isLoading, error } = useGetCopertativesFarms()
  const farms = farmsResponse?.data?.data || []

  const filteredFarms = farms.filter((farm) =>
    farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (farm.state && farm.state.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredFarms.length / rowsPerPage)
  const paginatedFarms = filteredFarms.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const totalArea = farms.reduce((sum, farm) => sum + (farm.totalArea || 0), 0)
  const activeFarms = farms.length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load farms</h3>
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
          { label: 'Farms' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Farms</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor your cooperative's farm assets and land holdings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm"
          >
            <Plus className="size-4" />
            <span className="font-bold uppercase tracking-wide text-xs">Add New Farm</span>
          </Button>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Farms"
          value={farms.length.toString()}
          subtitle="Registered locations"
          description="Global farm distribution"
          icon={<MapPin className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Total Area"
          value={`${totalArea.toFixed(1)} ha`}
          subtitle="Total hectares"
          description="Verified productive land"
          icon={<Maximize className="size-4" />}
          trend="up"
        />
        <StatCard
          title="Operational Status"
          value={activeFarms.toString()}
          subtitle="Active locations"
          description="Currently productive assets"
          icon={<Activity className="size-4 text-brand" />}
          trend="neutral"
        />
      </div>

      {/* Search & Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search farms by name, location, or owner..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Sort By</span>
              <div className="relative">
                <select className="h-10 rounded-lg border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[140px]">
                  <option>Name (A-Z)</option>
                  <option>Area Size</option>
                  <option>Region</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {searchQuery && (
              <Button
                variant="ghost"
                className="h-10 px-4 gap-2 text-red-500 font-bold text-[11px] uppercase tracking-wider hover:bg-red-50"
                onClick={() => setSearchQuery('')}
              >
                Reset Search
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Farm Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedFarms.map((farm) => (
          <FarmCard 
            key={farm.id} 
            farm={farm} 
            basePath="/cooperative/farms"
          />
        ))}
      </div>

      {/* Table Footer */}
      <div className="mt-12 border-t border-gray-100 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-gray-300">Total:</span>
          <span className="text-gray-900">{filteredFarms.length} Farms Registered</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Show</span>
            <select 
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="bg-transparent border-none outline-none text-gray-900 font-bold"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
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

      {/* Create Farm Modal */}
      <CreateFarmModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
