import { useState } from 'react'
import { Breadcrumb } from '~/components/breadcrumb'
import { Pagination } from '~/components/pagination'
import { SelectOperationModal } from '~/components/select-operation-modal'
import { ViewActivitiesModal } from '~/components/view-activities-modal'
import { allCropCycles, type CropCycle } from '~/lib/mock-data/farmer'
import type { Route } from './+types/record-operation'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Record Operation | Agrolinking' },
    { name: 'description', content: 'Select a crop cycle to record an operation' },
  ]
}

export default function RecordOperation() {
  const [selectedCropCycle, setSelectedCropCycle] = useState<CropCycle | null>(null)
  const [viewActivitiesCycle, setViewActivitiesCycle] = useState<CropCycle | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(12)

  const filteredCycles = allCropCycles.filter((c) => {
    const matchesSearch = c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.farmer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredCycles.length / rowsPerPage))
  const paginatedCycles = filteredCycles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  )

  return (
    <div className="space-y-6">
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
          { label: 'Record Operation' },
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">RECORD FARM OPERATION</h1>
        <p className="text-sm text-gray-500">Select a crop cycle to record an operation</p>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by crop, farm, or farmer..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
          className="w-72 rounded-md border border-gray-200 px-3.5 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <button className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Search</button>
        <div className="ml-auto flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm">
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="completed">Completed</option>
          </select>
          <span className="text-sm text-gray-500">Most Recent</span>
          <select className="rounded-md border border-gray-200 px-2 py-2 text-sm">
            <option>Most Recent</option><option>Name</option><option>Farm</option>
          </select>
        </div>
      </div>

      {/* Crop Cycle Cards Grid */}
      <div className="grid grid-cols-3 gap-4">
        {paginatedCycles.map((cycle) => (
          <div key={cycle.id} className="rounded-md border border-gray-200 bg-white p-5 flex flex-col">
            {/* Status + Days */}
            <div className="mb-3 flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cycle.status === 'planning'
                ? 'border border-brand-surface bg-brand-surface/50 text-brand'
                : 'border border-gray-200 bg-gray-50 text-gray-500'
                }`}>
                {cycle.status}
              </span>
              {cycle.daysToHarvest && (
                <span className="text-xs text-gray-400">{cycle.daysToHarvest} days to harvest</span>
              )}
            </div>

            {/* Product Info */}
            <h4 className="text-base font-semibold text-gray-900">
              {cycle.productName}
              {cycle.variety && <span className="ml-1 text-sm font-normal text-gray-500">({cycle.variety})</span>}
            </h4>
            <p className="text-sm text-gray-600">{cycle.farmName}</p>
            <p className="text-xs text-gray-400">{cycle.farmLocation}</p>

            {/* Farmer */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ backgroundColor: cycle.farmerColor }}>
                {cycle.farmerInitials}
              </div>
              <span className="text-xs text-gray-500">{cycle.farmer}</span>
            </div>

            {/* Dates + Area */}
            <div className="mt-3 space-y-0.5 text-xs text-gray-400">
              {cycle.plantedDate && <p>Planted: <span className="text-gray-600">{cycle.plantedDate}</span></p>}
              {cycle.area && <p>Area: <span className="text-gray-600">{cycle.area}</span></p>}
            </div>

            {/* Actions */}
            <div className="mt-auto pt-4 space-y-2">
              <button
                onClick={() => setViewActivitiesCycle(cycle)}
                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-200 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                View Activities
              </button>
              <button
                onClick={() => setSelectedCropCycle(cycle)}
                className="flex w-full items-center justify-center gap-1.5 rounded-md bg-brand py-2 text-xs font-medium text-white hover:bg-brand-dark transition-colors"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                </svg>
                Record Operation
              </button>
            </div>
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
        onItemsPerPageChange={(count) => { setRowsPerPage(count); setCurrentPage(1) }}
        itemLabel="crop cycle(s)"
      />

      {/* Select Operation Modal */}
      <SelectOperationModal
        isOpen={!!selectedCropCycle}
        onClose={() => setSelectedCropCycle(null)}
        cropCycle={selectedCropCycle}
      />

      {/* View Activities Modal */}
      <ViewActivitiesModal
        isOpen={!!viewActivitiesCycle}
        onClose={() => setViewActivitiesCycle(null)}
        cropCycle={viewActivitiesCycle}
      />
    </div>
  )
}
