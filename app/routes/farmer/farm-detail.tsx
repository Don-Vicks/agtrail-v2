import {
  Activity,
  ArrowRight,
  Calendar,
  ChevronDown,
  Layers,
  LayoutDashboard,
  Leaf,
  MapPin,
  Maximize,
  Plus,
  Search
} from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { SelectOperationModal } from '~/components/select-operation-modal'
import { StartCropCycleModal } from '~/components/start-crop-cycle-modal'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { useAuth } from '~/context/auth-context'
import { useGetFarmsIdCropCycles } from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import { useGetFarmsId } from '~/lib/api/generated/farms/farms'
import { type CropCycle } from '~/lib/mock-data/farmer'
import { cn } from '~/lib/utils'
import type { Route } from './+types/farm-detail'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Farm Detail | Agrolinking' },
    { name: 'description', content: 'Manage crop cycles and log farm operations' },
  ]
}

export default function FarmDetail() {
  const { user } = useAuth()
  const params = useParams()

  const { data: farmResponse, isLoading } = useGetFarmsId(params.id as string)
  const farm = farmResponse?.data?.data

  const { data: cyclesResponse, isLoading: isLoadingCycles } = useGetFarmsIdCropCycles(params.id as string, {
    query: { enabled: !!params.id }
  })
  const apiCropCycles = Array.isArray(cyclesResponse?.data?.data) ? cyclesResponse.data.data : []

  // Map backend model back to UI expectation
  const cropCycles: any[] = apiCropCycles.map((c: any) => ({
    ...c,
    id: c.id,
    productName: c.productName || 'Unknown',
    variety: c.variety || '',
    plantedDate: c.plantingDate ? new Date(c.plantingDate).toLocaleDateString() : 'N/A',
    expectedHarvest: c.expectedHarvestDate ? new Date(c.expectedHarvestDate).toLocaleDateString() : 'N/A',
    area: c.areaPlantedHectares || 0,
    season: c.season || 'N/A',
    status: c.status || 'N/A',
    farmName: farm?.name || '',
    farmLocation: farm?.lga || '',
    farmer: user?.email || '',
    farmerInitials: user?.email ? user.email.slice(0, 2).toUpperCase() : 'ME',
    farmerColor: "#4CAF50"
  }))

  const [isCropCycleModalOpen, setIsCropCycleModalOpen] = useState(false)
  const [selectedCropCycle, setSelectedCropCycle] = useState<CropCycle | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const filteredCycles = cropCycles.filter((c) =>
    c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.variety.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortOption === 'name') {
      return a.productName.localeCompare(b.productName)
    }
    if (sortOption === 'date') {
      return new Date(b.plantedDate === 'N/A' ? 0 : b.plantedDate).getTime() - new Date(a.plantedDate === 'N/A' ? 0 : a.plantedDate).getTime()
    }
    if (sortOption === 'status') {
      return a.status.localeCompare(b.status)
    }
    return 0
  })

  const totalPages = Math.max(1, Math.ceil(filteredCycles.length / rowsPerPage))

  return (
    <div className="space-y-6 pb-10 px-1">
      <PageHeader
        items={[
          { label: 'Dashboard', href: '/farmer' },
          { label: 'Farms', href: '/farmer/farms' },
          { label: farm?.name || 'Farm Details' },
        ]}
      />

      {/* Operation Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Farm Operations</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your crops and log activities for this farm</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsCropCycleModalOpen(true)}
            className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm"
          >
            <Plus className="size-4" />
            <span className="font-bold uppercase tracking-wide text-xs">Start New Cycle</span>
          </Button>
        </div>
      </div>

      {/* Farm Information */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        {isLoading ? (
          <div className="flex items-center gap-6 animate-pulse">
            <div className="size-16 rounded-md bg-gray-50"></div>
            <div className="space-y-3 flex-1">
              <div className="h-4 w-32 bg-gray-100 rounded"></div>
              <div className="h-3 w-64 bg-gray-50 rounded"></div>
            </div>
          </div>
        ) : farm ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex size-16 items-center justify-center rounded-md bg-brand/5 border border-brand/10 text-xl font-bold text-brand shadow-inner">
                {farm.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">{farm.name}</h2>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-brand/20 text-brand bg-brand/5">#{farm.id.slice(0, 8)}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="size-3 text-red-400" />
                    {farm.lga || farm.state || farm.region}, Nigeria
                  </p>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Layers className="size-3 text-brand/60" />
                    {farm.sizeHectares || 0} Gross Hectares
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Authenticated Holder</p>
                <p className="text-xs font-bold text-gray-700">{user?.email || 'System Authority'}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white shadow-lg border-2 border-white">
                {user?.email ? user.email.slice(0, 2).toUpperCase() : 'AG'}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center bg-gray-50/50 rounded-md border border-dashed border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Farm details not found</p>
          </div>
        )}
      </div>

      {/* Crop Cycles */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Crops</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Current crop cycles and activities</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative w-full sm:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cycles by product or variety..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="w-full rounded-md border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1 shrink-0">Sort By</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1) }}
                  className="h-10 rounded-md border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[120px]"
                >
                  <option value="name">Product Name</option>
                  <option value="date">Date Planted</option>
                  <option value="status">Status</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* High Density Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingCycles ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-md border border-gray-100 bg-gray-50/50 animate-pulse" />
            ))
          ) : filteredCycles.length === 0 ? (
            <div className="col-span-full py-16 text-center rounded-md border border-dashed border-gray-100 italic font-bold uppercase tracking-widest text-[10px] text-gray-400">
              No crop cycles found
            </div>
          ) : (
            filteredCycles.map((cycle) => (
              <div key={cycle.id} className="rounded-md border border-gray-200 bg-white p-5 group hover:border-brand/40 hover:shadow-md transition-all flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-10 rounded-md bg-green-50 flex items-center justify-center text-brand">
                    <Leaf className="size-5" />
                  </div>
                  <Badge
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-0 border-none",
                      cycle.status === 'active' ? "bg-brand text-white" : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {cycle.status}
                  </Badge>
                </div>

                <div className="mb-4">
                  <h4 className="text-base font-bold text-gray-900 tracking-tight uppercase">
                    {cycle.productName}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{cycle.variety || 'Standard Variety'}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight">
                    <span className="text-gray-400 flex items-center gap-1.5"><Calendar className="size-3" /> Planted</span>
                    <span className="text-gray-700">{cycle.plantedDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight">
                    <span className="text-gray-400 flex items-center gap-1.5"><Activity className="size-3 rotate-45" /> Expected Harvest</span>
                    <span className="text-gray-700">{cycle.expectedHarvest}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-tight">
                    <span className="text-gray-400 flex items-center gap-1.5"><Maximize className="size-3" /> Area</span>
                    <span className="text-gray-700">{cycle.area} HA</span>
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedCropCycle(cycle)}
                  className="mt-6 w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 h-10 font-bold uppercase tracking-widest text-[10px]"
                >
                  Record Activity
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Standardized Table Footer */}
        <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Total Crops:</span>
            <span className="text-gray-900">{filteredCycles.length} Crop Cycles</span>
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

      {/* Start Crop Cycle Modal - Rendered outside conditional to ensure prompt trigger */}
      <StartCropCycleModal
        isOpen={isCropCycleModalOpen}
        onClose={() => setIsCropCycleModalOpen(false)}
        farmId={farm?.id}
        farmName={farm?.name || 'Loading...'}
        farmLocation={farm ? (farm.lga || farm.state || farm.region || '') : ''}
        farmerName={user?.email || 'Me'}
        farmerInitials={user?.email ? user.email.slice(0, 2).toUpperCase() : 'ME'}
        farmerColor="#4CAF50"
      />

      <SelectOperationModal
        isOpen={!!selectedCropCycle}
        onClose={() => setSelectedCropCycle(null)}
        cropCycle={selectedCropCycle as any}
      />
    </div>
  )
}
