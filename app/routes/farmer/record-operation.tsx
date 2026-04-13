import { useState, useMemo } from 'react'
import { PageHeader } from '~/components/page-header'
import { Pagination } from '~/components/pagination'
import { SelectOperationModal } from '~/components/select-operation-modal'
import { ViewActivitiesModal } from '~/components/view-activities-modal'
import { useAuth } from '~/context/auth-context'
import { useQueries } from '@tanstack/react-query'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { getGetFarmsIdCropCyclesQueryOptions } from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import type { Route } from './+types/record-operation'
import type { CropCycle } from '~/lib/api/generated/models'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Record Operation | Agrolinking' },
    { name: 'description', content: 'Select a crop cycle to record an operation' },
  ]
}

// Helper to extend CropCycle for UI styling
type UICropCycle = CropCycle & {
  productName: string
  farmName: string
  farmLocation: string
  farmer: string
  farmerInitials: string
  farmerColor: string
  daysToHarvest: number | null
  area: string | null
  plantedDate: string | null
}

export default function RecordOperation() {
  const { user } = useAuth()
  
  // 1. Fetch available farms for the user
  const { data: farmsResponse, isLoading: isLoadingFarms } = useGetFarms()
  const farms = farmsResponse?.data?.data || []

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // 2. Fetch crop cycles for ALL Farms using useQueries
  const cycleQueries = useQueries({
    queries: farms.map((f: any) => ({
      ...getGetFarmsIdCropCyclesQueryOptions(f.id),
      enabled: !!f.id
    }))
  })

  const isLoadingCycles = cycleQueries.some(q => q.isLoading) || isLoadingFarms
  
  // Aggregate all matching crop cycles
  const cropCycles = useMemo(() => {
    return cycleQueries.flatMap(q => {
      const data = q.data as any
      return Array.isArray(data?.data?.data) ? data.data.data : []
    })
  }, [cycleQueries])

  const [selectedUICycle, setSelectedUICycle] = useState<UICropCycle | null>(null)
  const [viewActivitiesCycle, setViewActivitiesCycle] = useState<UICropCycle | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(12)

  // Map API CropCycle to UICropCycle to satisfy modal/UI dependencies
  const mappedCycles: UICropCycle[] = useMemo(() => {
    return cropCycles.map((c: any) => {
      const farmConf = farms.find((f: any) => f.id === c.farmId)
      
      const farmerName = user?.email?.split('@')[0] || 'Farmer'
      const initials = farmerName.substring(0, 2).toUpperCase()
      const location = farmConf ? `${farmConf.state || ''} ${farmConf.lga ? '- ' + farmConf.lga : ''}` : 'Location not specified'
      
      let days = null
      if (c.expectedHarvestDate) {
         const diff = new Date(c.expectedHarvestDate).getTime() - new Date().getTime()
         days = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)))
      }

      return {
        ...c,
        productName: c.productName || 'Unknown Crop',
        farmName: farmConf?.name || 'Unknown Farm',
        farmLocation: location,
        farmer: farmerName,
        farmerInitials: initials,
        farmerColor: '#2E5A27', // Default brand color
        plantedDate: c.plantingDate ? new Date(c.plantingDate).toLocaleDateString() : null,
        area: c.areaPlantedHectares ? `${c.areaPlantedHectares} ha` : null,
        daysToHarvest: days,
      }
    })
  }, [cropCycles, farms, user])

  const filteredCycles = mappedCycles.filter((c) => {
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
          { label: 'Record Operation' },
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">RECORD FARM OPERATION</h1>
        <p className="text-sm text-gray-500">Select a crop cycle to record an operation</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          type="text"
          placeholder="Search by crop, farm, or farmer..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
          className="w-full sm:w-72 rounded-md border border-gray-200 px-3.5 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <button className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Search</button>
        <div className="sm:ml-auto flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20">
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <span className="text-sm text-gray-500 hidden sm:inline">Most Recent</span>
          <select className="rounded-md border border-gray-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20">
            <option>Most Recent</option><option>Name</option><option>Farm</option>
          </select>
        </div>
      </div>

      {/* Crop Cycle Cards Grid */}
      {isLoadingCycles ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           {Array.from({length: 6}).map((_, i) => (
             <div key={i} className="h-64 rounded-md border border-gray-200 bg-white p-5 animate-pulse flex flex-col gap-3">
               <div className="w-1/3 h-4 bg-gray-200 rounded-full"></div>
               <div className="w-2/3 h-5 bg-gray-200 rounded"></div>
               <div className="w-1/2 h-4 bg-gray-200 rounded mt-4"></div>
               <div className="w-full h-8 bg-gray-200 rounded mt-auto"></div>
             </div>
           ))}
        </div>
      ) : paginatedCycles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCycles.map((cycle) => (
            <div key={cycle.id} className="rounded-md border border-gray-200 bg-white p-5 flex flex-col hover:shadow-md transition-shadow">
              {/* Status + Days */}
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  cycle.status?.toLowerCase() === 'planning'
                  ? 'border border-blue-200 bg-blue-50 text-blue-700'
                  : cycle.status?.toLowerCase() === 'active' 
                  ? 'border border-brand-surface bg-brand-surface/50 text-brand'
                  : cycle.status?.toLowerCase() === 'completed'
                  ? 'border border-gray-200 bg-gray-50 text-gray-500'
                  : 'border border-brand-surface bg-brand-surface/50 text-brand'
                  }`}>
                  {cycle.status?.toUpperCase() || 'Planning'}
                </span>
                {cycle.daysToHarvest !== null && (
                  <span className="text-xs text-gray-500 font-medium">{cycle.daysToHarvest} days to harvest</span>
                )}
              </div>

              {/* Product Info */}
              <h4 className="text-base font-semibold text-gray-900">
                {cycle.productName}
                {cycle.variety && <span className="ml-1 text-sm font-normal text-gray-500">({cycle.variety})</span>}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{cycle.farmName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cycle.farmLocation}</p>

              {/* Farmer */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold text-white shadow-inner" style={{ backgroundColor: cycle.farmerColor }}>
                  {cycle.farmerInitials}
                </div>
                <span className="text-xs text-gray-500">{cycle.farmer}</span>
              </div>

              {/* Dates + Area */}
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                {cycle.plantedDate && <p>Planted: <span className="text-gray-900 font-medium float-right">{cycle.plantedDate}</span></p>}
                {cycle.area && <p>Area: <span className="text-gray-900 font-medium float-right">{cycle.area}</span></p>}
              </div>

              {/* Actions */}
              <div className="mt-auto pt-4 space-y-2">
                <button
                  onClick={() => setViewActivitiesCycle(cycle)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <svg className="size-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                  View Activities
                </button>
                <button
                  onClick={() => setSelectedUICycle(cycle)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#255220] py-2.5 text-xs font-bold text-white hover:bg-[#1a3a16] transition-colors shadow-sm"
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
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-lg border border-gray-200 border-dashed">
          <div className="bg-brand/5 p-4 rounded-full mb-4">
            <svg className="size-8 text-brand/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Crop Cycles Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mb-6">There are no active crop cycles. Start a new crop cycle to begin recording operations.</p>
        </div>
      )}

      {/* Pagination */}
      {filteredCycles.length > rowsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCycles.length}
          itemsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(count) => { setRowsPerPage(count); setCurrentPage(1) }}
          itemLabel="crop cycle(s)"
        />
      )}

      {/* Select Operation Modal */}
      <SelectOperationModal
        isOpen={!!selectedUICycle}
        onClose={() => setSelectedUICycle(null)}
        cropCycle={selectedUICycle}
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
