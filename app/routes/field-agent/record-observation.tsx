import { useQueries } from '@tanstack/react-query'
import { Package, Eye, ClipboardList, Clock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { EmptyState } from '~/components/empty-state'
import { PageHeader } from '~/components/page-header'
import { Pagination } from '~/components/pagination'
import { SelectOperationModal } from '~/components/select-operation-modal'
import { ViewActivitiesModal } from '~/components/view-activities-modal'
import { useAuth } from '~/context/auth-context'
import { getGetFarmsIdCropCyclesQueryOptions } from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import {
  RECORD_OPERATION_STATUS_OPTIONS,
  cycleMatchesStatusFilter,
  extractCropCyclesFromQueries,
  formatFarmLocation,
  sortRecordOperationCycles,
  type RecordOperationSort,
} from '~/lib/record-operation-dashboard'

type UICropCycle = {
  id: string
  productName: string
  farmName: string
  farmLocation: string
  farmer: string
  farmerInitials: string
  farmerColor: string
  plantedDate: string | null
  status?: string
  daysToHarvest: number | null
  updatedAt: string
}

export function meta() {
  return [{ title: 'Record Farm Observation | Field Agent' }]
}

export default function FieldAgentRecordObservation() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<RecordOperationSort>('recent')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(12)
  
  const [viewActivitiesCycle, setViewActivitiesCycle] = useState<UICropCycle | null>(null)
  const [selectedCycle, setSelectedCycle] = useState<UICropCycle | null>(null)

  const { data: farmsResponse, isLoading: isLoadingFarms, isError: isFarmsError } = useGetFarms()
  const farms = farmsResponse?.data?.data ?? []
  const cycleQueries = useQueries({
    queries: farms.map((f) => ({
      ...getGetFarmsIdCropCyclesQueryOptions(f.id),
      enabled: !!f.id,
    })),
  })

  const isCyclesError = cycleQueries.some((q) => q.isError)
  const isLoadingCycles = cycleQueries.some((q) => q.isLoading) || isLoadingFarms
  const cropCycles = useMemo(() => extractCropCyclesFromQueries(cycleQueries), [cycleQueries])

  const mappedCycles: UICropCycle[] = useMemo(() => {
    return cropCycles.map((cycle) => {
      const farm = farms.find((item) => item.id === cycle.farmId)
      const farmer = user?.email?.split('@')[0] || 'admin'
      const days = cycle.expectedHarvestDate
        ? Math.max(0, Math.ceil((new Date(cycle.expectedHarvestDate).getTime() - Date.now()) / (1000 * 3600 * 24)))
        : null
      return {
        id: cycle.id,
        productName: (cycle as { cropName?: string }).cropName || 'Plantain',
        farmName: farm?.name || 'Farm',
        farmLocation: formatFarmLocation(farm),
        farmer,
        farmerInitials: farmer.slice(0, 2).toUpperCase(),
        farmerColor: '#2E5A27',
        plantedDate: cycle.plantingDate ? new Date(cycle.plantingDate).toLocaleDateString() : null,
        status: cycle.status,
        daysToHarvest: days,
        updatedAt: cycle.updatedAt ?? new Date().toISOString(),
      }
    })
  }, [cropCycles, farms, user])

  const filtered = mappedCycles.filter((cycle) => {
    const q = searchQuery.toLowerCase()
    return (
      (cycle.productName.toLowerCase().includes(q) ||
        cycle.farmName.toLowerCase().includes(q) ||
        cycle.farmer.toLowerCase().includes(q)) &&
      cycleMatchesStatusFilter(cycle.status as any, statusFilter)
    )
  })
  const sorted = sortRecordOperationCycles<UICropCycle>(filtered, sortBy)
  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage))
  const paginated = sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  if ((isFarmsError || isCyclesError) && !isLoadingCycles) {
    return (
      <div className='p-6'>
        <EmptyState
          icon={<Package className='size-8 text-red-400' />}
          title='Unable to load crop cycles'
          description='Please refresh and try again.'
        />
      </div>
    )
  }

  return (
    <div className='space-y-6 pb-10'>
      <PageHeader
        items={[
          { label: 'Dashboard', href: '/field-agent' },
          { label: 'Record Observation' },
        ]}
      />
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Record Farm Observation</h1>
        <p className='text-sm text-gray-500'>Monitor crop cycles and submit detailed field observations</p>
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search by crop, farm, or farmer...'
          className='w-full sm:w-72 rounded-md border border-gray-200 px-3.5 py-2 text-sm focus:border-brand focus:outline-none'
        />
        <button type='button' className='rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50'>Search</button>
        <div className='sm:ml-auto flex items-center gap-2'>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className='rounded-md border border-gray-200 px-3 py-2 text-sm font-medium'>
            {RECORD_OPERATION_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <span className='text-sm text-gray-500 hidden sm:inline'>Sort by</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as RecordOperationSort)} className='rounded-md border border-gray-200 px-2 py-2 text-sm font-medium'>
            <option value='recent'>Most recent</option>
            <option value='name'>Crop name</option>
            <option value='farm'>Farm</option>
          </select>
        </div>
      </div>

      {isLoadingCycles ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className='h-64 rounded-md border border-gray-200 bg-white p-5 animate-pulse' />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          className='rounded-md border border-dashed border-gray-200 bg-white py-16'
          icon={<Package className='size-8 text-brand/50' />}
          title='No crop cycles found'
          description='There are no crop cycles matching your filters.'
        />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {paginated.map((cycle) => (
            <div key={cycle.id} className='rounded-md border border-gray-200 bg-white p-5 flex flex-col hover:shadow-md transition-shadow'>
              <div className='mb-3 flex items-center justify-between'>
                <span className='rounded-full border border-gray-100 bg-gray-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600'>
                  {cycle.status || 'Active'}
                </span>
                {cycle.daysToHarvest != null && (
                  <span className='text-[11px] font-semibold text-gray-400 flex items-center gap-1'>
                    <Clock className="size-3" />
                    {cycle.daysToHarvest} days to harvest
                  </span>
                )}
              </div>
              <h4 className='text-lg font-bold text-gray-900 tracking-tight'>{cycle.productName}</h4>
              <p className='text-sm font-semibold text-gray-600 mt-0.5'>{cycle.farmName}</p>
              <p className='text-xs text-gray-400 mt-0.5'>{cycle.farmLocation}</p>
              
              <div className='mt-4 flex items-center gap-2'>
                <span className='flex size-6 items-center justify-center rounded-full text-[9px] font-bold text-white shadow-sm' style={{ backgroundColor: cycle.farmerColor }}>
                  {cycle.farmerInitials}
                </span>
                <span className='text-xs font-semibold text-gray-500'>{cycle.farmer}</span>
              </div>
              
              <div className='mt-4 pt-4 border-t border-gray-50 space-y-1 text-xs text-gray-500'>
                <div className="flex justify-between">
                   <span className="font-medium text-gray-400">Planted:</span>
                   <span className='font-semibold text-gray-700'>{cycle.plantedDate ?? 'N/A'}</span>
                </div>
              </div>

              <div className='mt-6 space-y-2'>
                <button 
                  onClick={() => setViewActivitiesCycle(cycle)}
                  type='button' 
                  className='w-full flex items-center justify-center gap-2 rounded-md border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  <Eye className="size-3.5 text-gray-400" />
                  View Activities
                </button>
                <button 
                  type='button' 
                  className='w-full flex items-center justify-center gap-2 rounded-md border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  <ClipboardList className="size-3.5 text-gray-400" />
                  View Observation Log
                </button>
                <button 
                  onClick={() => setSelectedCycle(cycle)}
                  type='button' 
                  className='w-full rounded-md bg-[#255220] py-2.5 text-xs font-semibold text-white hover:bg-[#1b3d18] transition-colors shadow-sm'
                >
                  Submit Observation Log
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sorted.length > rowsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sorted.length}
          itemsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(count) => {
            setRowsPerPage(count)
            setCurrentPage(1)
          }}
          itemLabel='crop cycle(s)'
        />
      )}

      <SelectOperationModal 
        isOpen={!!selectedCycle}
        onClose={() => setSelectedCycle(null)}
        cropCycle={selectedCycle as any}
        basePath='/field-agent/record-observation/new'
      />

      <ViewActivitiesModal 
        isOpen={!!viewActivitiesCycle}
        onClose={() => setViewActivitiesCycle(null)}
        cropCycle={viewActivitiesCycle as any}
      />
    </div>
  )
}
