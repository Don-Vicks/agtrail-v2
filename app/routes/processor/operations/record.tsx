import { useState, useMemo } from 'react'
import { PageHeader } from '~/components/page-header'
import { EmptyState } from '~/components/empty-state'
import { Package } from 'lucide-react'
import { Pagination } from '~/components/pagination'
import { SelectOperationModal } from '~/components/select-operation-modal'
import { ViewActivitiesModal } from '~/components/view-activities-modal'
import { useAuth } from '~/context/auth-context'
import { useQueries } from '@tanstack/react-query'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { getGetFarmsIdCropCyclesQueryOptions } from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import type { Route } from './+types/record'
import type { CropCycle } from '~/lib/api/generated/models'
import {
  RECORD_OPERATION_STATUS_OPTIONS,
  cropCycleStatusLabel,
  cropCycleStatusPillClass,
  cycleMatchesStatusFilter,
  extractCropCyclesFromQueries,
  formatFarmLocation,
  sortRecordOperationCycles,
  type RecordOperationSort,
} from '~/lib/record-operation-dashboard'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Record Operation | Agrolinking' },
    { name: 'description', content: 'Select a crop cycle to record an operation' },
  ]
}

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

  const {
    data: farmsResponse,
    isLoading: isLoadingFarms,
    isError: isFarmsError,
    error: farmsError,
  } = useGetFarms()
  const farms = farmsResponse?.data?.data ?? []

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState<RecordOperationSort>('recent')

  const cycleQueries = useQueries({
    queries: farms.map((f) => ({
      ...getGetFarmsIdCropCyclesQueryOptions(f.id),
      enabled: !!f.id,
    })),
  })

  const isCyclesError = cycleQueries.some((q) => q.isError)
  const isLoadingCycles =
    cycleQueries.some((q) => q.isLoading) || isLoadingFarms

  const cropCycles = useMemo(
    () => extractCropCyclesFromQueries(cycleQueries),
    [cycleQueries],
  )

  const [selectedUICycle, setSelectedUICycle] = useState<UICropCycle | null>(null)
  const [viewActivitiesCycle, setViewActivitiesCycle] = useState<UICropCycle | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(12)

  const mappedCycles: UICropCycle[] = useMemo(() => {
    return cropCycles.map((c) => {
      const farmConf = farms.find((f) => f.id === c.farmId)

      const farmerName = user?.email?.split('@')[0] || 'Operator'
      const initials = farmerName.substring(0, 2).toUpperCase()

      let days: number | null = null
      if (c.expectedHarvestDate) {
        const diff =
          new Date(c.expectedHarvestDate).getTime() - new Date().getTime()
        days = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)))
      }

      return {
        ...c,
        productName: c.cropName || (c as { productName?: string }).productName || 'Unknown Crop',
        farmName: farmConf?.name || 'Unknown Farm',
        farmLocation: formatFarmLocation(farmConf),
        farmer: farmerName,
        farmerInitials: initials,
        farmerColor: '#2E5A27',
        plantedDate: c.plantingDate
          ? new Date(c.plantingDate).toLocaleDateString()
          : null,
        area: c.areaPlantedHectares ? `${c.areaPlantedHectares} ha` : null,
        daysToHarvest: days,
      }
    })
  }, [cropCycles, farms, user])

  const filteredCycles = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return mappedCycles.filter((c) => {
      const matchesSearch =
        c.productName.toLowerCase().includes(q) ||
        c.farmName.toLowerCase().includes(q) ||
        c.farmer.toLowerCase().includes(q)
      const matchesStatus = cycleMatchesStatusFilter(c.status, statusFilter)
      return matchesSearch && matchesStatus
    })
  }, [mappedCycles, searchQuery, statusFilter])

  const sortedCycles = useMemo(
    () => sortRecordOperationCycles(filteredCycles, sortBy),
    [filteredCycles, sortBy],
  )

  const totalPages = Math.max(1, Math.ceil(sortedCycles.length / rowsPerPage))
  const paginatedCycles = sortedCycles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  const loadError =
    isFarmsError || isCyclesError
      ? (farmsError as Error | undefined)?.message ||
        'Could not load farms or crop cycles. Try again later.'
      : null

  if (loadError && !isLoadingCycles) {
    return (
      <div className="space-y-6">
        <PageHeader
          items={[
            {
              label: 'Dashboard',
              href: '/processor',
              icon: (
                <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              ),
            },
            { label: 'Operations' },
            { label: 'Record Operation' },
          ]}
        />
        <EmptyState
          className="rounded-xl border border-dashed border-red-200 bg-red-50/40 py-16"
          icon={<Package className="size-8 text-red-400" />}
          title="Something went wrong"
          description={loadError}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/processor',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Operations' },
          { label: 'Record Operation' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">RECORD OPERATION</h1>
        <p className="text-sm text-gray-500">Select a crop cycle to record an operation</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          type="text"
          placeholder="Search by crop, farm, or farmer..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full sm:w-72 rounded-md border border-gray-200 px-3.5 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <button type="button" className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Search</button>
        <div className="sm:ml-auto flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            {RECORD_OPERATION_STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500 hidden sm:inline">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as RecordOperationSort)
              setCurrentPage(1)
            }}
            className="rounded-md border border-gray-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="recent">Most recent</option>
            <option value="name">Crop name</option>
            <option value="farm">Farm</option>
          </select>
        </div>
      </div>

      {isLoadingCycles ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
            <div key={cycle.id} className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-brand/40 hover:shadow-lg transition-all flex flex-col">
              <div className="mb-4 flex items-center justify-between relative z-10">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cropCycleStatusPillClass(cycle.status)}`}>
                  {cropCycleStatusLabel(cycle.status)}
                </span>
                {cycle.daysToHarvest !== null && (
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{cycle.daysToHarvest} days to harvest</span>
                )}
              </div>

              <div className="mb-4 relative z-10">
                <h4 className="text-base font-bold text-gray-900 uppercase tracking-tight">
                  {cycle.productName}
                </h4>
                {cycle.variety ? (
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 italic">
                    {cycle.variety}
                  </p>
                ) : null}
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-sm font-bold text-gray-700 tracking-tight">{cycle.farmName}</p>
                <p className="text-xs text-gray-400 italic">{cycle.farmLocation}</p>
              </div>

              <div className="mt-2 flex items-center gap-2 border-t border-gray-50 pt-3">
                <div className="flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-inner" style={{ backgroundColor: cycle.farmerColor }}>
                  {cycle.farmerInitials}
                </div>
                <span className="text-xs text-gray-500 italic lowercase">{cycle.farmer}</span>
              </div>

              <div className="mt-4 space-y-1 text-[11px] font-bold uppercase tracking-tight text-gray-400">
                {cycle.plantedDate && <div className="flex justify-between items-center"><span className="text-gray-300 italic lowercase">Planted</span> <span className="text-gray-900">{cycle.plantedDate}</span></div>}
                {cycle.area && <div className="flex justify-between items-center"><span className="text-gray-300 italic lowercase">Area</span> <span className="text-gray-900">{cycle.area}</span></div>}
              </div>

              <div className="mt-auto pt-6 space-y-2 flex flex-col relative z-10">
                <button
                  type="button"
                  onClick={() => setViewActivitiesCycle(cycle)}
                  className="flex w-full h-10 items-center justify-center gap-1.5 rounded-lg border border-gray-100 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition-colors shadow-none"
                >
                  <svg className="size-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                  Activity Log
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUICycle(cycle)}
                  className="flex w-full h-10 items-center justify-center gap-1.5 rounded-lg bg-brand py-2.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-brand/90 transition-colors shadow-none"
                >
                  <svg className="size-3.5 shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                  </svg>
                  New Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          className="rounded-xl border border-dashed border-gray-200 bg-white py-16"
          icon={<Package className="size-8 text-brand/50" />}
          title="No crop cycles found"
          description="There are no crop cycles matching your filters, or none exist yet."
        />
      )}

      {sortedCycles.length > rowsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={sortedCycles.length}
          itemsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(count) => {
            setRowsPerPage(count)
            setCurrentPage(1)
          }}
          itemLabel="crop cycle(s)"
        />
      )}

      <SelectOperationModal
        isOpen={!!selectedUICycle}
        onClose={() => setSelectedUICycle(null)}
        cropCycle={selectedUICycle}
        basePath="/processor/operations/new"
      />

      <ViewActivitiesModal
        isOpen={!!viewActivitiesCycle}
        onClose={() => setViewActivitiesCycle(null)}
        cropCycle={viewActivitiesCycle}
      />
    </div>
  )
}
