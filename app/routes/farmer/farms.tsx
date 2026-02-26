import { useState } from 'react'
import { Breadcrumb } from '~/components/breadcrumb'
import { CreateFarmModal } from '~/components/create-farm-modal'
import { FarmCard } from '~/components/farm-card'
import { Pagination } from '~/components/pagination'
import { farms } from '~/lib/mock-data/farmer'
import type { Route } from './+types/farms'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'My Farms | Agrolinking' },
    { name: 'description', content: 'View and manage all farms across the cooperative' },
  ]
}

export default function FarmerFarms() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage)

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

  const totalArea = farms.reduce((sum, f) => sum + f.hectares, 0)
  const activeFarms = farms.length // all farms are active in mock data

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Farms' },
        ]}
      />

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ALL FARMS</h1>
          <p className="text-sm text-gray-500">View and manage all farms across the cooperative</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Farm
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500 mb-1">Total Farms</p>
          <p className="text-3xl font-bold text-gray-900">{farms.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500 mb-1">Total Area</p>
          <p className="text-3xl font-bold text-gray-900">{totalArea.toFixed(1)} ha</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500 mb-1">Active Farms</p>
          <p className="text-3xl font-bold text-gray-900">{activeFarms}</p>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by farm name, location, or farmer..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-3.5 pr-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <button className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Search
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by</span>
          <select className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
            <option>Name</option>
            <option>Hectares</option>
            <option>Location</option>
          </select>
        </div>
      </div>

      {/* Farm Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {paginatedFarms.map((farm) => (
          <FarmCard key={farm.id} farm={farm} />
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

      {/* Create Farm Modal */}
      <CreateFarmModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
