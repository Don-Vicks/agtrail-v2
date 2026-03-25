import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { CreateFarmModal } from '~/components/create-farm-modal'
import { FarmCard } from '~/components/farm-card'
import { Pagination } from '~/components/pagination'
import type { Route } from './+types/farms'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { useAuth } from '~/context/auth-context'

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
    <div className="space-y-6">
      <PageHeader
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand">ALL FARMS</h1>
          <p className="text-sm tracking-tight text-gray-500">View and manage all farms across the cooperative</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Farm
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-md border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500 mb-1">Total Farms</p>
          <p className="text-3xl font-bold text-brand">{isLoading ? '...' : mappedFarms.length}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500 mb-1">Total Area</p>
          <p className="text-3xl font-bold text-brand">{isLoading ? '...' : totalArea.toFixed(1)} ha</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500 mb-1">Active Farms</p>
          <p className="text-3xl font-bold text-brand">{isLoading ? '...' : activeFarms}</p>
        </div>
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
            className="w-full sm:w-4/5 rounded-md border border-brand/30 py-2.5 pl-3.5 pr-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="sm:ml-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button className="rounded-md border border-brand/30 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shrink-0">
            Search
          </button>
          <select className="rounded-md border border-brand/30 px-3 py-2 text-sm">
            <option>Sort by Name</option>
            <option>Sort by Hectares</option>
            <option>Sort by Location</option>
          </select>
        </div>
      </div>

      {/* Farm Cards Grid */}
      {isLoading ? (
        <div className="py-8 text-center text-sm font-medium text-gray-500">Loading farms...</div>
      ) : mappedFarms.length === 0 ? (
        <div className="py-8 text-center text-sm font-medium text-gray-500">You don't have any farms yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedFarms.map((farm: any) => (
            <FarmCard key={farm.id} farm={farm} />
          ))}
        </div>
      )}

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
