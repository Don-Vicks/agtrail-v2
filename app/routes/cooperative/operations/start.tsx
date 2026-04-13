import { 
  Search, 
  Plus, 
  MapPin, 
  Maximize, 
  LayoutDashboard, 
  Activity, 
  ChevronDown,
  Filter,
  ArrowRight
} from 'lucide-react'
import { useState } from 'react'
import { FarmCard } from '~/components/farm-card'
import { PageHeader } from '~/components/page-header'
import { StartCropCycleModal } from '~/components/start-crop-cycle-modal'
import { Button } from '~/components/ui/button'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import type { Farm } from '~/lib/api/generated/models'
import { cn } from '~/lib/utils'

export default function CooperativeStartCropCycle() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage)

  // State for the modal
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)

  // Fetch real farm data
  const { data: farmsResponse, isLoading } = useGetFarms()
  const farms = farmsResponse?.data?.data || []

  const filteredFarms = farms.filter((farm) =>
    farm.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.state?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredFarms.length / rowsPerPage)
  const paginatedFarms = filteredFarms.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  const handleStartCycle = (farmId: string) => {
    const farm = farms.find((f) => f.id === farmId)
    if (farm) {
      setSelectedFarm(farm)
    }
  }

  return (
    <div className="space-y-6 pb-10 px-1 text-left">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Operations' },
          { label: 'Start New Cycle' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Start New Cycle</h1>
          <p className="text-sm text-gray-500 mt-1">Select a farm to start a new production cycle and track its growth</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2 h-11 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-600 border-gray-200">
            Export Status
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by farm name, owner, or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded-lg border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Sort Metric</span>
              <div className="relative">
                <select className="h-10 rounded-lg border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[140px]">
                  <option>Identity (A-Z)</option>
                  <option>Area Size</option>
                  <option>Location</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            
            <Button variant="outline" className="h-10 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-gray-100">
              <Filter className="size-3.5 mr-2" />
              Advanced
            </Button>
          </div>
        </div>
      </div>

      {/* Farm Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedFarms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              action="start-cycle"
              onAction={handleStartCycle}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 border-t border-gray-100 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-brand/30 animate-pulse" />
          <span className="text-gray-900">Total Farms: {filteredFarms.length}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-300 italic lowercase tracking-wider">Density</span>
            <select className="bg-transparent border-none outline-none text-gray-900 font-bold" value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={60}>60</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 lowercase tracking-tight">Page {currentPage} / {totalPages}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-8 text-gray-300 transition-all hover:bg-white" disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                <ArrowRight className="size-4 rotate-180" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:text-brand transition-all hover:bg-white" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Start Crop Cycle Multi-Step Modal */}
      <StartCropCycleModal
        isOpen={!!selectedFarm}
        onClose={() => setSelectedFarm(null)}
        farmName={selectedFarm?.name || ''}
        farmLocation={selectedFarm?.address || selectedFarm?.state || ''}
        farmerName={selectedFarm?.ownerId || ''}
        farmerInitials={(selectedFarm?.ownerId || '').substring(0, 2).toUpperCase()}
        farmerColor="#2e7d32"
      />
    </div>
  )
}
