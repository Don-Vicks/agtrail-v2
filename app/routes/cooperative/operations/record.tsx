import { useState, useMemo, useEffect } from 'react'
import { PageHeader } from '~/components/page-header'
import { Pagination } from '~/components/pagination'
import { SelectOperationModal } from '~/components/select-operation-modal'
import { ViewActivitiesModal } from '~/components/view-activities-modal'
import { useAuth } from '~/context/auth-context'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { useGetFarmsIdCropCycles } from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import type { Route } from './+types/record'
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

  const [selectedFarmId, setSelectedFarmId] = useState<string>('')
  
  // Auto-select first farm if none is selected
  useEffect(() => {
    if (farms.length > 0 && !selectedFarmId) {
      setSelectedFarmId(farms[0].id)
    }
  }, [farms, selectedFarmId])

  // 2. Fetch crop cycles for the selected Farm
  const { data: cyclesResponse, isLoading: isLoadingCycles } = useGetFarmsIdCropCycles(selectedFarmId, {
    query: { enabled: !!selectedFarmId }
  })
  
  const cropCycles = Array.isArray(cyclesResponse?.data?.data) ? cyclesResponse.data.data : []
  const selectedFarmConf = farms.find((f: any) => f.id === selectedFarmId)

  const [selectedUICycle, setSelectedUICycle] = useState<UICropCycle | null>(null)
  const [viewActivitiesCycle, setViewActivitiesCycle] = useState<UICropCycle | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(12)

  // Map API CropCycle to UICropCycle to satisfy modal/UI dependencies
  const mappedCycles: UICropCycle[] = useMemo(() => {
    return cropCycles.map((c: any) => {
      // Setup mock farmer derived from authed user
      const farmerName = user?.email?.split('@')[0] || 'Farmer'
      const initials = farmerName.substring(0, 2).toUpperCase()
      const location = selectedFarmConf ? `${selectedFarmConf.state || ''} ${selectedFarmConf.lga ? '- ' + selectedFarmConf.lga : ''}` : 'Unknown'
      
      let days = null
      if (c.expectedHarvestDate) {
         const diff = new Date(c.expectedHarvestDate).getTime() - new Date().getTime()
         days = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)))
      }

      return {
        ...c,
        productName: c.cropName || 'Unknown Crop',
        farmName: selectedFarmConf?.name || 'Unknown Farm',
        farmLocation: location,
        farmer: farmerName,
        farmerInitials: initials,
        farmerColor: '#2E5A27', // Default brand color
        plantedDate: c.plantingDate, // Map for UI backward compat
        area: c.areaPlantedHectares ? `${c.areaPlantedHectares} ha` : null,
        daysToHarvest: days
      }
    })
  }, [cropCycles, selectedFarmConf, user])

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
            href: '/cooperative',
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

      {/* Header & Farm Select */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RECORD FARM OPERATION</h1>
          <p className="text-sm text-gray-500">Select a crop cycle to record an operation</p>
        </div>
        
        {/* Farm Picker */}
        <div className="w-full sm:w-auto flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-600 pl-2">Farm:</span>
          {isLoadingFarms ? (
            <div className="h-9 w-48 bg-gray-100 animate-pulse rounded-md"></div>
          ) : farms.length > 0 ? (
            <select 
              value={selectedFarmId} 
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="h-9 w-full sm:w-56 rounded-md border-0 bg-transparent py-1.5 pl-3 pr-8 text-gray-900 focus:ring-2 focus:ring-brand sm:text-sm sm:leading-6 font-medium"
            >
              {farms.map((f: any) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          ) : (
            <span className="text-sm text-gray-400 px-3">No farms found</span>
          )}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="text"
          placeholder="Search by crop, farm, or farmer..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
          className="w-full sm:w-72 rounded-md border border-gray-200 px-3.5 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <div className="ml-auto flex items-center gap-2">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20">
            <option value="all">All Status</option>
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* States Grid */}
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
            <div key={cycle.id} className="rounded-md border border-gray-200 bg-white p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              {/* Status + Days */}
              <div className="mb-3 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase ${cycle.status === 'planned'
                  ? 'border border-blue-200 bg-blue-50 text-blue-700'
                  : cycle.status === 'active' 
                  ? 'border border-brand-surface bg-brand-surface/50 text-brand'
                  : 'border border-gray-200 bg-gray-50 text-gray-500'
                  }`}>
                  {cycle.status || 'PLANNED'}
                </span>
                {cycle.daysToHarvest !== null && (
                  <span className="text-xs text-brand/80 font-medium">~{cycle.daysToHarvest} days to harvest</span>
                )}
              </div>

              {/* Product Info */}
              <h4 className="text-base font-semibold text-gray-900">
                {cycle.productName}
                {cycle.variety && <span className="ml-1 text-sm font-normal text-gray-500">({cycle.variety})</span>}
              </h4>
              <p className="text-sm text-gray-600 font-medium">{cycle.farmName}</p>
              <p className="text-xs text-gray-400">{cycle.farmLocation}</p>

              {/* Farmer */}
              <div className="mt-3 flex items-center gap-2 border-t border-gray-50 pt-3">
                <div className="flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-inner" style={{ backgroundColor: cycle.farmerColor }}>
                  {cycle.farmerInitials}
                </div>
                <span className="text-xs text-gray-500">{cycle.farmer}</span>
              </div>

              {/* Dates + Area */}
              <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-400 bg-gray-50/50 p-2 rounded">
                <p>Planted: <span className="text-gray-700 font-medium">{new Date(cycle.plantingDate).toLocaleDateString()}</span></p>
                {cycle.area && <p>Area: <span className="text-gray-700 font-medium">{cycle.area}</span></p>}
                {cycle.expectedYieldKg && <p>Exp Yield: <span className="text-gray-700 font-medium">{cycle.expectedYieldKg}kg</span></p>}
              </div>

              {/* Actions */}
              <div className="mt-auto pt-4 space-y-2">
                <button
                  onClick={() => setViewActivitiesCycle(cycle)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-200 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <svg className="size-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                  View Activities
                </button>
                <button
                  onClick={() => setSelectedUICycle(cycle)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md bg-brand py-2.5 text-xs font-medium text-white hover:bg-brand/90 transition-colors shadow-sm"
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
          <p className="text-sm text-gray-500 max-w-sm mb-6">There are no active crop cycles for this farm. Start a new crop cycle to begin recording operations.</p>
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
        basePath="/cooperative/operations/new"
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
