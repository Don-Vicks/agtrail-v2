import { useState } from 'react'
import { useParams } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Pagination } from '~/components/pagination'
import { StartCropCycleModal } from '~/components/start-crop-cycle-modal'
import { SelectOperationModal } from '~/components/select-operation-modal'
import { farmCropCycles, farms, type CropCycle } from '~/lib/mock-data/farmer'
import type { Route } from './+types/farm-details'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Farm Detail | Agrolinking Cooperative' },
    { name: 'description', content: 'Manage crop cycles and log farm operations' },
  ]
}

export default function CooperativeFarmDetails() {
  const params = useParams()
  const farm = farms.find((f) => f.id === params.id) ?? farms[0]
  const cropCycles = farmCropCycles.filter((c) => c.farmId === farm.id)

  const [isCropCycleModalOpen, setIsCropCycleModalOpen] = useState(false)
  const [selectedCropCycle, setSelectedCropCycle] = useState<CropCycle | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const filteredCycles = cropCycles.filter((c) =>
    c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.variety.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-brand-surface text-lg font-bold text-brand">
          {farm.ownerInitials}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{farm.owner}</h2>
          <p className="text-sm text-gray-600">{farm.name}</p>
          <p className="text-sm text-gray-400">, Nigeria</p>
          <p className="text-sm text-gray-400">No phone number</p>
        </div>
      </div>

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
            <select className="rounded-md border border-gray-200 px-1.5 py-2 text-sm">
              <option>Sort by Name</option>
              <option>Sort by Date</option>
              <option>Sort by Status</option>
            </select>
          </div>
        </div>

        {/* Crop Cycle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCycles.map((cycle) => (
            <div key={cycle.id} className="rounded-md border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-full bg-brand">
                  <svg className="size-5 text-brand-surface" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cycle.status === 'planning'
                  ? 'border border-brand-surface bg-brand-surface/50 text-brand'
                  : 'border border-brand-light/30 bg-brand-light/10 text-brand-light'
                  }`}>
                  {cycle.status}
                </span>
              </div>

              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {cycle.productName} - {cycle.variety}
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
        farmName={farm.name}
        farmLocation={farm.location || farm.region}
        farmerName={farm.owner}
        farmerInitials={farm.ownerInitials}
        farmerColor={farm.ownerColor}
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
