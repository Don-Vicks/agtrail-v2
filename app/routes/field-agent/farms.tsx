import { Archive, ArrowRight, MapPin, Maximize, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { EmptyState } from '~/components/empty-state'
import { FarmCard } from '~/components/farm-card'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { Button } from '~/components/ui/button'
import type { Farm } from '~/lib/api/generated/models/farm'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { extractDataArray } from '~/lib/field-agent-utils'
import { NIGERIA_ROUGH_CENTER } from '~/lib/google-maps'
import { FarmCheckInModal, type CheckInFarm } from './components/farm-check-in-modal'

type FarmAsset = {
  id: string
  name: string
  location: string
  hectares: number
  owner: string
  ownerId?: string
  ownerInitials: string
  lat: number
  lng: number
}

export function meta() {
  return [{ title: 'Farm Assets Inventory | Field Agent' }]
}

export default function FieldAgentFarms() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: farmsResponse, isLoading } = useGetFarms()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedFarm, setSelectedFarm] = useState<CheckInFarm | null>(null)
  const perPage = 12

  const parseFarmCoordinates = (gpsCoordinates: unknown): { lat: number; lng: number } => {
    const parsedInput =
      typeof gpsCoordinates === 'string'
        ? (() => {
          try {
            return JSON.parse(gpsCoordinates) as unknown
          } catch {
            return null
          }
        })()
        : gpsCoordinates
    if (!parsedInput || typeof parsedInput !== 'object') return NIGERIA_ROUGH_CENTER
    const point = parsedInput as {
      coordinates?: unknown
      lat?: unknown
      lng?: unknown
      latitude?: unknown
      longitude?: unknown
    }
    const coords = Array.isArray(point.coordinates) ? point.coordinates : null
    const lng = Number(coords?.[0] ?? point.lng ?? point.longitude)
    const lat = Number(coords?.[1] ?? point.lat ?? point.latitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return NIGERIA_ROUGH_CENTER
    return { lat, lng }
  }

  const farms = useMemo<FarmAsset[]>(() => {
    const items = extractDataArray<Farm>(farmsResponse?.data)
    return items.map((farm) => ({
      ...parseFarmCoordinates(farm.gpsCoordinates),
      id: farm.id,
      name: farm.name,
      location: [farm.lga, farm.state].filter(Boolean).join(', ') || 'Location not specified',
      hectares: Number(farm.sizeHectares ?? 0),
      owner: 'admin@agrolinking.com',
      ownerId: farm.ownerId ?? undefined,
      ownerInitials: 'AD',
    }))
  }, [farmsResponse])

  useEffect(() => {
    const farmId = searchParams.get('checkInFarmId')
    if (!farmId || !farms.length) return
    const farm = farms.find((item) => item.id === farmId)
    if (farm) setSelectedFarm(farm)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('checkInFarmId')
      return next
    }, { replace: true })
  }, [farms, searchParams, setSearchParams])

  const filtered = farms.filter((farm) => {
    const q = searchQuery.toLowerCase()
    return farm.name.toLowerCase().includes(q) || farm.location.toLowerCase().includes(q)
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const totalArea = filtered.reduce((acc, item) => acc + item.hectares, 0)

  return (
    <div className='space-y-6 pb-10'>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/field-agent',
            icon: <Archive className='size-4 text-gray-400' />,
          },
          { label: 'Farm Assets' },
        ]}
      />

      <div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Farm Assets Inventory</h1>
        <p className='text-sm text-gray-500 font-medium'>Manage and monitor all farms assigned for field verification</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <StatCard title='Total Farm Assets' value={isLoading ? '...' : String(filtered.length)} icon={<MapPin className='size-4' />} />
        <StatCard title='Combined Area' value={isLoading ? '...' : `${totalArea.toFixed(1)} ha`} icon={<Maximize className='size-4' />} />
        <StatCard title='Active Status' value={isLoading ? '...' : String(filtered.length)} icon={<Archive className='size-4' />} />
      </div>

      <div className='rounded-md border border-gray-200 bg-white p-5 shadow-sm'>
        <div className='relative w-full md:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            placeholder='Search assets by identity, location, or owner...'
            className='w-full rounded-md border border-gray-200 pl-10 pr-3 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
          />
        </div>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className='h-36 rounded-md border border-gray-100 bg-gray-50 animate-pulse' />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          className='rounded-md border border-dashed border-gray-200'
          icon={<MapPin className='size-8 text-gray-300' />}
          title='No farm assets found'
          description='Try a different search term or refresh your farm assignment data.'
        />
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {paginated.map((farm) => (
            <FarmCard 
              key={farm.id} 
              farm={farm as any} 
              action="start-cycle" 
              actionLabel="Check in" 
              onAction={() => setSelectedFarm(farm)}
            />
          ))}
        </div>
      )}

      <div className='border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-500'>
        <span>Total holdings: {filtered.length} asset records</span>
        <div className='flex items-center gap-2'>
          <Button variant='ghost' size='icon' disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ArrowRight className='size-4 rotate-180' />
          </Button>
          <span>Page {page} / {totalPages}</span>
          <Button variant='ghost' size='icon' disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <ArrowRight className='size-4' />
          </Button>
        </div>
      </div>

      <FarmCheckInModal
        farm={selectedFarm}
        isOpen={!!selectedFarm}
        onClose={() => setSelectedFarm(null)}
      />
    </div>
  )
}
