import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { FarmCard } from '~/components/farm-card'
import { Pagination } from '~/components/pagination'
import { StartCropCycleModal } from '~/components/start-crop-cycle-modal'
import { cooperativeFarms as farms } from '~/lib/mock-data/cooperative'
import type { Farm } from '~/lib/mock-data/farmer'
import type { Route } from './+types/start'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Start Crop Cycle | Agrolinking' },
    { name: 'description', content: 'Select a farm to start a new crop cycle' },
  ]
}

export default function FarmerCropCycle() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage)

  // State for the modal
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)

  const filteredFarms = farms.filter((farm) =>
    farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    farm.owner.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="space-y-6">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Start Crop Cycle' },
        ]}
      />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold uppercase text-brand-dark mb-1">Start Crop Cycle</h1>
        <p className="text-sm text-gray-500">Select a farm to start a new crop cycle</p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by farm name, location, or farmer..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full rounded-md border border-gray-200 py-2.5 pl-3.5 pr-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <button className="rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex-shrink-0 transition-colors">
          Search
        </button>
        <div className="sm:ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by</span>
          <select className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20">
            <option>Name</option>
            <option>Hectares</option>
            <option>Location</option>
          </select>
        </div>
      </div>

      {/* Farm Cards Grid */}
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

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredFarms.length}
        itemsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(count) => {
          setRowsPerPage(count)
          setCurrentPage(1)
        }}
        itemLabel="farm(s)"
      />

      {/* Start Crop Cycle Multi-Step Modal */}
      <StartCropCycleModal
        isOpen={!!selectedFarm}
        onClose={() => setSelectedFarm(null)}
        farmName={selectedFarm?.name || ''}
        farmLocation={selectedFarm?.location || ''}
        farmerName={selectedFarm?.owner || ''}
        farmerInitials={selectedFarm?.ownerInitials || ''}
        farmerColor={selectedFarm?.ownerColor || ''}
      />
    </div>
  )
}
