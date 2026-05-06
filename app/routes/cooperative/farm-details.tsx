import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Layers,
  LayoutDashboard,
  MapPin,
  Maximize,
  Package,
  Plus,
  Search,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router'
import { EmptyState } from '~/components/empty-state'
import { PageHeader } from '~/components/page-header'
import { SelectOperationModal } from '~/components/select-operation-modal'
import { StartCropCycleModal } from '~/components/start-crop-cycle-modal'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Skeleton } from '~/components/ui/skeleton'
import { useAuth } from '~/context/auth-context'
import { useGetFarmsIdCropCycles } from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import { useGetFarmsId } from '~/lib/api/generated/farms/farms'
import { farms } from '~/lib/mock-data/farmer'
import { cn } from '~/lib/utils'
import type { Route } from './+types/farm-details'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Farm Detail | Agrolinking Cooperative' },
    {
      name: 'description',
      content: 'Manage crop cycles and log farm operations',
    },
  ]
}

export default function CooperativeFarmDetails() {
  const { user } = useAuth()
  const { user: cooperativeUser } = useAuth()
  const params = useParams()

  const { data: farmResponse, isLoading } = useGetFarmsId(params.id as string)
  const farm: any =
    farmResponse?.data?.data ||
    farms.find((f: any) => f.id === params.id) ||
    farms[0]

  const {
    data: cyclesResponse,
    isLoading: isLoadingCycles,
    refetch: refetchCropCycles,
  } = useGetFarmsIdCropCycles(params.id as string, {
    query: { enabled: !!params.id },
  })
  const apiCropCycles = Array.isArray(cyclesResponse?.data?.data)
    ? cyclesResponse.data.data
    : []

  const cropCycles: any[] = apiCropCycles.map((c: any) => ({
    ...c,
    id: c.id,
    productName: c.productName || 'Unknown',
    variety: c.variety || '',
    plantedDate: c.plantingDate
      ? new Date(c.plantingDate).toLocaleDateString()
      : 'N/A',
    expectedHarvest: c.expectedHarvestDate
      ? new Date(c.expectedHarvestDate).toLocaleDateString()
      : 'N/A',
    area: c.areaPlanted || 0,
    season: c.season || 'N/A',
    status: c.status || 'planned',
    farmName: farm?.name || '',
    farmLocation: farm?.lga || '',
    farmer: cooperativeUser?.email || '',
    farmerInitials: cooperativeUser?.email
      ? cooperativeUser.email.slice(0, 2).toUpperCase()
      : 'ME',
    farmerColor: '#4CAF50',
  }))

  const [isCropCycleModalOpen, setIsCropCycleModalOpen] = useState(false)
  const [selectedCropCycle, setSelectedCropCycle] = useState<any | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('name')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const filteredCycles = cropCycles
    .filter(
      (c) =>
        c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.variety.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortOption === 'name') {
        return a.productName.localeCompare(b.productName)
      }
      if (sortOption === 'date') {
        return (
          new Date(b.plantedDate === 'N/A' ? 0 : b.plantedDate).getTime() -
          new Date(a.plantedDate === 'N/A' ? 0 : a.plantedDate).getTime()
        )
      }
      if (sortOption === 'status') {
        return a.status.localeCompare(b.status)
      }
      return 0
    })

  const totalPages = Math.max(1, Math.ceil(filteredCycles.length / rowsPerPage))

  return (
    <div className='space-y-6 pb-10 px-1'>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: <LayoutDashboard className='size-4 text-gray-400' />,
          },
          {
            label: 'Farms',
            href: '/cooperative/farms',
          },
          { label: farm.name },
        ]}
      />

      {/* Page Title Section */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 uppercase tracking-tight'>
            Farm Details
          </h1>
          {isLoading ? (
            <Skeleton className='mt-2 h-4 w-72' />
          ) : (
            <p className='text-sm text-gray-500 mt-1'>
              Manage crop cycles and record activities for {farm.name}
            </p>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => setIsCropCycleModalOpen(true)}
            className='bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm'
          >
            <Plus className='size-4' />
            <span className='font-bold uppercase tracking-wide text-xs'>
              Start New Cycle
            </span>
          </Button>
        </div>
      </div>

      {/* Asset Identity Card */}
      <div className='rounded-md border border-gray-200 bg-white p-6 shadow-sm'>
        {isLoading ? (
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
            <div className='flex items-center gap-5'>
              <Skeleton className='size-16 rounded-2xl' />
              <div className='space-y-2'>
                <Skeleton className='h-5 w-48' />
                <Skeleton className='h-3.5 w-72' />
              </div>
            </div>
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
            <div className='flex items-center gap-5'>
              <div className='size-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xl font-bold text-brand shadow-sm'>
                {farm?.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className='flex items-center gap-2 mb-1'>
                  <h2 className='text-lg font-bold text-gray-900 uppercase tracking-tight'>
                    {farm?.name || 'Farm'}
                  </h2>
                </div>
                <div className='flex flex-wrap items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest italic'>
                  <span className='flex items-center gap-1.5'>
                    <MapPin className='size-3 text-red-400' />{' '}
                    {farm?.lga || farm?.state || 'Verified Location'}, Nigeria
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <User className='size-3 text-gray-300' /> Authorized:{' '}
                    {farm?.owner || 'Cooperative Admin'}
                  </span>
                  <span className='flex items-center gap-1.5'>
                    <Maximize className='size-3 text-gray-300' />{' '}
                    {farm?.sizeHectares || '0.00'} Hectares
                  </span>
                </div>
              </div>
            </div>

            {/* <div className='flex items-center gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-50'>
            <div className='text-right px-4 border-l border-gray-100'>
              <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1'>
                Status
              </p>
              <div className='flex items-center gap-2'>
                <div className='size-2 rounded-full bg-brand animate-pulse' />
                <span className='text-sm font-bold text-brand italic'>
                  Active
                </span>
              </div>
            </div>
          </div> */}
          </div>
        )}
      </div>

      {/* Operational Dashboard */}
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-base font-bold text-gray-900 uppercase tracking-tight'>
              Crop Cycles
            </h3>
            <p className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic'>
              Track current crop cycles
            </p>
          </div>
        </div>

        {/* Global Action Toolbar */}
        <div className='rounded-md border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
            <div className='relative w-full lg:max-w-md'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search cycles by crop name or variety...'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className='w-full rounded-md border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm'
              />
            </div>

            <div className='flex flex-wrap items-center gap-4'>
              <div className='flex items-center gap-2'>
                <span className='text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1'>
                  Sort Metric
                </span>
                <div className='relative'>
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value)
                      setCurrentPage(1)
                    }}
                    className='h-10 rounded-md border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[140px]'
                  >
                    <option value='name'>Crop A-Z</option>
                    <option value='date'>Date</option>
                    <option value='status'>Status</option>
                  </select>
                  <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none' />
                </div>
              </div>

              {searchQuery && (
                <Button
                  variant='ghost'
                  className='h-10 px-4 text-red-500 font-bold text-[11px] uppercase tracking-wider hover:bg-red-50'
                  onClick={() => setSearchQuery('')}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* High Density Cycle Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {isLoadingCycles &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`cycle-skeleton-${i}`}
                className='rounded-md border border-gray-200 bg-white p-6 shadow-sm'
              >
                <div className='mb-6 flex items-start justify-between'>
                  <Skeleton className='size-12 rounded-2xl' />
                  <Skeleton className='h-5 w-20 rounded-full' />
                </div>
                <div className='mb-6 space-y-2'>
                  <Skeleton className='h-5 w-32' />
                  <Skeleton className='h-3 w-20' />
                </div>
                <div className='space-y-4 mb-8 pt-6 border-t border-gray-50'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                </div>
                <Skeleton className='h-11 w-full rounded-md' />
              </div>
            ))}
          {filteredCycles.map((cycle) => (
            <div
              key={cycle.id}
              className='relative rounded-md border border-gray-200 bg-white p-6 shadow-sm hover:border-brand/40 hover:shadow-lg transition-all group overflow-hidden'
            >
              <div className='absolute top-0 right-0 p-3 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20 scale-150'>
                <Layers className='size-16 text-brand' />
              </div>

              <div className='mb-6 flex items-start justify-between relative z-10'>
                <div className='flex size-12 items-center justify-center rounded-2xl bg-brand/5 text-brand shadow-sm border border-brand/10'>
                  <CheckCircle2 className='size-6' />
                </div>
                <Badge
                  className={cn(
                    'px-3 py-1 text-[9px] font-bold uppercase tracking-widest border shadow-none',
                    cycle.status === 'planned'
                      ? 'bg-blue-50 text-blue-600 border-blue-100'
                      : cycle.status === 'active'
                        ? 'bg-green-50 text-brand border-green-100'
                        : 'bg-gray-50 text-gray-400 border-gray-100',
                  )}
                >
                  {cycle.status}
                </Badge>
              </div>

              <div className='mb-6 relative z-10'>
                <h4 className='text-base font-bold text-gray-900 uppercase tracking-tight mb-1 truncate'>
                  {cycle.productName}
                </h4>
                <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest italic'>
                  {cycle.variety || 'Seed Variety'}
                </p>
              </div>

              <div className='space-y-4 mb-8 pt-6 border-t border-gray-50 relative z-10'>
                <div className='flex items-center justify-between text-[11px] font-bold uppercase tracking-tight text-gray-400'>
                  <span className='flex items-center gap-2 italic text-gray-300'>
                    <Calendar className='size-3' /> Planted
                  </span>
                  <span className='text-gray-900'>{cycle.plantedDate}</span>
                </div>
                <div className='flex items-center justify-between text-[11px] font-bold uppercase tracking-tight text-gray-400'>
                  <span className='flex items-center gap-2 italic text-gray-300'>
                    <Clock className='size-3' /> ETA Harvest
                  </span>
                  <span className='text-brand'>{cycle.expectedHarvest}</span>
                </div>
                <div className='flex items-center justify-between text-[11px] font-bold uppercase tracking-tight text-gray-400'>
                  <span className='flex items-center gap-2 italic text-gray-300'>
                    <Maximize className='size-3' /> Area
                  </span>
                  <span className='text-gray-900'>{cycle.area} Hectares</span>
                </div>
              </div>

              <Button
                onClick={() => setSelectedCropCycle(cycle)}
                className='w-full h-11 bg-brand/5 text-brand hover:bg-brand hover:text-white border border-brand/10 shadow-none font-bold uppercase tracking-wider text-[11px] gap-2'
              >
                <Activity className='size-4' />
                Record Activity
              </Button>
            </div>
          ))}
          {filteredCycles.length === 0 && !isLoadingCycles && (
            <div className="col-span-full">
              <EmptyState
                className="rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/20 py-16"
                icon={<Package className="size-8 text-gray-300" />}
                title="No crop cycles"
                description="Start a crop cycle for this farm to record activities here."
              />
            </div>
          )}
        </div>

        {/* Standardized Operational Footer */}
        <div className='mt-12 border-t border-gray-100 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20 rounded-md'>
          <div className='flex items-center gap-2'>
            <span className='text-gray-300'>Total:</span>
            <span className='text-gray-900'>
              {filteredCycles.length} Crop Cycles
            </span>
          </div>
          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-2'>
              <span className='text-gray-300'>Show</span>
              <select className='bg-transparent border-none outline-none text-gray-900 font-bold'>
                <option>10</option>
                <option>25</option>
              </select>
            </div>
            <div className='flex items-center gap-4'>
              <span className='text-gray-300'>
                Page {currentPage} / {totalPages}
              </span>
              <div className='flex items-center gap-1'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-7 text-gray-300'
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ArrowRight className='size-3.5 rotate-180' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-7 text-gray-400 hover:text-brand'
                  disabled={currentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  <ArrowRight className='size-3.5' />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start Crop Cycle Modal */}
      <StartCropCycleModal
        isOpen={isCropCycleModalOpen}
        onClose={() => setIsCropCycleModalOpen(false)}
        onCropCycleCreated={() => {
          void refetchCropCycles()
        }}
        farmId={farm?.id}
        farmName={farm?.name || ''}
        farmLocation={farm?.lga || farm?.state || ''}
        farmerName={farm?.owner || user?.email || 'Cooperative'}
        farmerInitials={farm?.ownerInitials || 'CO'}
        farmerColor={farm?.ownerColor || '#4CAF50'}
      />

      <SelectOperationModal
        isOpen={!!selectedCropCycle}
        onClose={() => setSelectedCropCycle(null)}
        cropCycle={selectedCropCycle}
        basePath='/cooperative/operations/new'
      />
    </div>
  )
}
