import {
  Activity,
  ArrowRight,
  ChevronDown,
  Filter,
  LayoutDashboard,
  MapPin,
  Maximize,
  Plus,
  Search
} from 'lucide-react'
import { useState } from 'react'
import { CreateFarmModal } from '~/components/create-farm-modal'
import { EmptyState } from '~/components/empty-state'
import { FarmCard } from '~/components/farm-card'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { Button } from '~/components/ui/button'
import { useAuth } from '~/context/auth-context'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import type { Route } from './+types/farms'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'My Farms | Agrolinking' },
    { name: 'description', content: 'View and manage all farms across the cooperative' },
  ]
}

export default function FarmerFarms() {
  const { user } = useAuth()
  const { data: farmsResponse, isLoading } = useGetFarms()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage)

  const farmsList = farmsResponse?.data?.data || []
  const mappedFarms = farmsList.map((f: any) => ({
    id: f.id,
    name: f.name,
    location: f.lga || f.state || f.region || '',
    owner: user?.email || 'Me',
    ownerInitials: user?.email ? user.email.slice(0, 2).toUpperCase() : 'ME',
    ownerColor: '#4CAF50',
    hectares: f.sizeHectares || 0,
    region: f.region || '',
  }))

  const filteredFarms = mappedFarms.filter((farm: any) =>
    farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.owner.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredFarms.length / rowsPerPage)
  const paginatedFarms = filteredFarms.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const totalArea = mappedFarms.reduce((sum: number, f: any) => sum + f.hectares, 0)
  const activeFarms = mappedFarms.length // all farms are active by default

  return (
    <div className="space-y-6 pb-10 px-1">
      <PageHeader
        items={[
          { label: 'Farmer', href: '/farmer' },
          { label: 'Farm Assets', href: '#' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand">My Farms</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor all your registered farms</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm"
          >
            <Plus className="size-4" />
            <span className="font-bold uppercase tracking-wide text-xs">Register New Asset</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Farm Assets"
          value={isLoading ? '...' : mappedFarms.length.toString()}
          subtitle="Registered units"
          description="Total land holdings"
          icon={<MapPin className="size-4" />}
          trend="neutral"
        />
        <StatCard
          title="Combined Area"
          value={isLoading ? '...' : `${totalArea.toFixed(1)} ha`}
          subtitle="Cultivation volume"
          description="Productive farmland"
          icon={<Maximize className="size-4" />}
          trend="up"
        />
        <StatCard
          title="Active Status"
          value={isLoading ? '...' : activeFarms.toString()}
          subtitle="Operational units"
          description="Verified assets"
          icon={<Activity className="size-4" />}
          trend="neutral"
        />
      </div>

      {/* Asset Filters Panel */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets by identity, location, or owner..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Sort By</span>
              <div className="relative">
                <select className="h-10 rounded-md border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[140px]">
                  <option>Identity (A-Z)</option>
                  <option>Size (Hectares)</option>
                  <option>Region Context</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <Button variant="outline" className="h-10 text-[11px] font-bold uppercase tracking-wider border-gray-200 gap-2">
              <Filter className="size-3.5" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Farm Assets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-[200px] rounded-md border border-gray-100 bg-gray-50/50 animate-pulse" />
          ))}
        </div>
      ) : mappedFarms.length === 0 ? (
        <EmptyState
          className="rounded-md border border-dashed border-gray-200"
          icon={<MapPin className="size-8 text-gray-300" />}
          title="No farms yet"
          description="Register your first farm to begin tracking operations."
          action={{
            label: 'Start registration',
            onClick: () => setIsCreateModalOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedFarms.map((farm: any) => (
            <FarmCard key={farm.id} farm={farm} />
          ))}
        </div>
      )}

      {/* Standardized Pagination Section */}
      <div className="border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20 rounded-md">
        <div className="flex items-center gap-2">
          <span className="text-gray-300">Total Holdings:</span>
          <span className="text-gray-900">{filteredFarms.length} Asset Records</span>
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
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Page {currentPage} / {totalPages || 1}</span>
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
