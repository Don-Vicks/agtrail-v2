import { useState, useMemo } from 'react'
import { PageHeader } from '~/components/page-header'
import { FarmCard } from '~/components/farm-card'
import { Pagination } from '~/components/pagination'
import { StartCropCycleModal } from '~/components/start-crop-cycle-modal'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { useAuth } from '~/context/auth-context'
import type { Farm } from '~/lib/api/generated/models'
import type { Route } from './+types/crop-cycle'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Start Crop Cycle | Agrolinking' },
    { name: 'description', content: 'Select a farm to start a new crop cycle' },
  ]
}

export default function FarmerCropCycle() {
  const { user } = useAuth()
  const { data: farmsResponse, isLoading } = useGetFarms()
  const farms = farmsResponse?.data?.data || []

  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(12)
  const [sortBy, setSortBy] = useState<'name' | 'hectares' | 'location'>('name')

  // State for the modal
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)

  // Derive display name and initials from auth user
  const displayEmail = user?.email || ''
  const displayName = displayEmail.split('@')[0] || 'Farmer'
  const displayInitials = displayName
    .split(/[._-]/)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('')

  // Filter farms
  const filteredFarms = useMemo(() => {
    let result = farms.filter((farm) => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return (
        farm.name.toLowerCase().includes(q) ||
        (farm.state || '').toLowerCase().includes(q) ||
        (farm.lga || '').toLowerCase().includes(q) ||
        (farm.region || '').toLowerCase().includes(q) ||
        (farm.address || '').toLowerCase().includes(q)
      )
    })

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'hectares':
          return (b.sizeHectares || 0) - (a.sizeHectares || 0)
        case 'location':
          return (a.state || a.lga || '').localeCompare(b.state || b.lga || '')
        default:
          return 0
      }
    })

    return result
  }, [farms, searchQuery, sortBy])

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
            href: '/farmer',
          },
          { label: 'Start Crop Cycle' },
        ]}
      />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2e7d32] mb-1">Start Crop Cycle</h1>
        <p className="text-sm text-gray-500">Select a farm to start a new crop cycle</p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by farm name, location, or state..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full rounded-md border border-gray-200 py-2.5 pl-3.5 pr-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <button
          onClick={() => setSearchQuery('')}
          className="rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shrink-0 transition-colors"
        >
          {searchQuery ? 'Clear' : 'Search'}
        </button>
        <div className="sm:ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="name">Name</option>
            <option value="hectares">Hectares</option>
            <option value="location">Location</option>
          </select>
        </div>
      </div>

      {/* Farm Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-md border border-gray-200 bg-white p-5 animate-pulse">
              <div className="flex items-start justify-between mb-3">
                <div className="size-12 rounded-md bg-gray-200" />
                <div className="h-5 w-20 rounded-full bg-gray-200" />
              </div>
              <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-9 bg-gray-200 rounded" />
            </div>
          ))
        ) : paginatedFarms.length === 0 ? (
          <div className="col-span-3 rounded-md border border-gray-200 bg-white p-12 text-center">
            <svg className="mx-auto size-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <p className="text-sm font-medium text-gray-500">
              {searchQuery ? 'No farms match your search.' : 'No farms registered yet.'}
            </p>
          </div>
        ) : paginatedFarms.map((farm) => (
          <FarmCard
            key={farm.id}
            farm={farm}
            action="start-cycle"
            onAction={handleStartCycle}
            ownerName={displayEmail}
          />
        ))}
      </div>

      {/* Pagination */}
      {!isLoading && filteredFarms.length > 0 && (
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
      )}

      {/* Start Crop Cycle Multi-Step Modal */}
      <StartCropCycleModal
        isOpen={!!selectedFarm}
        onClose={() => setSelectedFarm(null)}
        farmId={selectedFarm?.id}
        farmName={selectedFarm?.name || ''}
        farmLocation={selectedFarm?.state || selectedFarm?.lga || selectedFarm?.region || ''}
        farmerName={displayName}
        farmerInitials={displayInitials}
        farmerColor="#2E5A27"
      />
    </div>
  )
}
