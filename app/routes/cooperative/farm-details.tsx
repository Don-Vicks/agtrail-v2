import { useState } from 'react'
import { useParams } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Pagination } from '~/components/pagination'
import { StartCropCycleModal } from '~/components/start-crop-cycle-modal'
import { SelectOperationModal } from '~/components/select-operation-modal'
import { useGetFarmsIdCropCycles } from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import { useGetFarmsId } from '~/lib/api/generated/farms/farms'
import { useAuth } from '~/context/auth-context'
import { farmCropCycles, farms } from '~/lib/mock-data/farmer'
import type { Route } from './+types/farm-details'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Farm Detail | Agrolinking Cooperative' },
    { name: 'description', content: 'Manage crop cycles and log farm operations' },
  ]
}

export default function CooperativeFarmDetails() {
  const { user } = useAuth()
  const params = useParams()
  
  const { data: farmResponse, isLoading } = useGetFarmsId(params.id as string)
  const farm: any = farmResponse?.data?.data || farms.find((f: any) => f.id === params.id) || farms[0]

  const { data: cyclesResponse, isLoading: isLoadingCycles } = useGetFarmsIdCropCycles(params.id as string, {
    query: { enabled: !!params.id }
  })
  const apiCropCycles = Array.isArray(cyclesResponse?.data?.data) ? cyclesResponse.data.data : []
  
  const cropCycles: any[] = apiCropCycles.map((c: any) => ({
    ...c,
    id: c.id,
    productName: c.cropName || 'Unknown',
    variety: c.variety || '',
    plantedDate: c.plantingDate ? new Date(c.plantingDate).toLocaleDateString() : 'N/A',
    expectedHarvest: c.expectedHarvestDate ? new Date(c.expectedHarvestDate).toLocaleDateString() : 'N/A',
    area: c.areaPlantedHectares || 0,
    season: 'Current',
    status: c.status || 'planned',
    farmName: farm?.name || '',
    farmLocation: farm?.lga || '',
    farmer: user?.email || '',
    farmerInitials: user?.email ? user.email.slice(0, 2).toUpperCase() : 'ME',
    farmerColor: "#4CAF50"
  }))

  const [isCropCycleModalOpen, setIsCropCycleModalOpen] = useState(false)
  const [selectedCropCycle, setSelectedCropCycle] = useState<any | null>(null)
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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <PageHeader
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
          { label: 'Farms', href: '/cooperative/farms' },
          { label: farm.name },
        ]}
      />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand uppercase tracking-wide">RECORD FARM OPERATION</h1>
        <p className="text-sm text-gray-500 mt-1">Manage crop cycles and log farm operations</p>
      </div>

      {/* Farm Owner Card */}
      {isLoading ? (
        <div className="flex items-center gap-4 animate-pulse pt-2">
          <div className="size-14 rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
            <div className="h-3 w-32 rounded bg-gray-200"></div>
            <div className="h-3 w-40 rounded bg-gray-200"></div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-brand-surface text-lg font-bold text-brand">
            {farm?.ownerInitials || 'ME'}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{farm?.owner || 'Cooperative Farm'}</h2>
            <p className="text-sm text-gray-600">{farm?.name || 'Unknown Name'}</p>
            <p className="text-sm text-gray-400">{farm?.lga || farm?.state || ''}, Nigeria</p>
            <p className="text-sm text-gray-400">No phone number</p>
          </div>
        </div>
      )}

      {/* Crop Cycles Section */}
      <div>
        <div className="mb-4 flex flex-col items-center justify-center gap-2 md:flex-row md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Crop Cycles</h3>
            <p className="text-sm text-gray-500">Start a new crop cycle for this farm to track operations and production</p>
          </div>
          <button
            onClick={() => setIsCropCycleModalOpen(true)}
            className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Start New Crop Cycle
          </button>
        </div>

        {/* Search + Sort */}
        <div className="mb-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Search crop cycles..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="w-72 rounded-md border border-gray-200 px-3.5 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          <div className="ml-auto flex items-center gap-2">
            <button className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Search</button>
            <select 
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1) }}
              className="rounded-md border border-gray-200 px-1.5 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>

        {/* Crop Cycle Cards */}
        {isLoadingCycles ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 rounded-md border border-gray-200 bg-white p-5 animate-pulse flex flex-col gap-3">
                <div className="flex items-center justify-between">
                   <div className="size-10 rounded-full bg-gray-200"></div>
                   <div className="h-5 w-16 rounded-full bg-gray-200"></div>
                </div>
                <div className="h-5 w-2/3 rounded bg-gray-200 mt-2"></div>
                <div className="space-y-1">
                   <div className="h-3 w-1/2 rounded bg-gray-200"></div>
                   <div className="h-3 w-2/5 rounded bg-gray-200"></div>
                   <div className="h-3 w-1/3 rounded bg-gray-200"></div>
                </div>
                <div className="mt-auto h-9 w-full rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredCycles.length === 0 ? (
              <div className="col-span-3 py-6 text-center text-sm text-gray-500">No crop cycles found.</div>
            ) : null}
            {filteredCycles.map((cycle) => (
            <div key={cycle.id} className="rounded-md border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand">
                  <svg className="size-5 text-brand-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${cycle.status === 'planned'
                  ? 'border border-blue-200 bg-blue-50 text-blue-700'
                  : cycle.status === 'active' 
                  ? 'border border-brand-surface bg-brand-surface/50 text-brand'
                  : 'border border-gray-200 bg-gray-50 text-gray-500'
                  }`}>
                  {cycle.status}
                </span>
              </div>

              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {cycle.productName} {cycle.variety ? `- ${cycle.variety}` : ''}
              </h4>
              <div className="space-y-0.5 text-sm text-gray-500">
                <p>Planted: {cycle.plantedDate}</p>
                <p>Expected Harvest: {cycle.expectedHarvest}</p>
                <p>Area: {cycle.area} hectares</p>
                <p>Season: {cycle.season}</p>
              </div>

              <button 
                onClick={() => setSelectedCropCycle(cycle)}
                className="mt-4 w-full rounded-md border border-brand py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
               >
                Log Operation
              </button>
            </div>
          ))}
        </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCycles.length}
          itemsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          itemLabel="crop cycle(s)"
        />
      </div>

      {/* Start Crop Cycle Modal */}
      <StartCropCycleModal
        isOpen={isCropCycleModalOpen}
        onClose={() => setIsCropCycleModalOpen(false)}
        farmId={farm?.id}
        farmName={farm?.name || ''}
        farmLocation={farm?.lga || farm?.state || ''}
        farmerName={farm?.owner || user?.email || 'Cooperative'}
        farmerInitials={farm?.ownerInitials || 'CO'}
        farmerColor={farm?.ownerColor || '#4CAF50'}
      />

      <SelectOperationModal
        isOpen={!!selectedCropCycle}
        onClose={() => setSelectedCropCycle(null)}
        cropCycle={selectedCropCycle}
        basePath="/cooperative/operations/new"
      />
    </div>
  )
}
