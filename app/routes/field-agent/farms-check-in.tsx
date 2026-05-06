import { Archive, Upload } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { FarmMap } from '~/components/farm-map.client'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { NIGERIA_ROUGH_CENTER } from '~/lib/google-maps'

export function meta() {
  return [{ title: 'Farm Check-In | Field Agent' }]
}

export default function FieldAgentFarmCheckIn() {
  const [searchParams] = useSearchParams()
  const farmId = searchParams.get('farmId')
  const { data } = useGetFarms()
  const farm = useMemo(() => {
    const farms = data?.data?.data ?? []
    return farms.find((item) => item.id === farmId) ?? null
  }, [data, farmId])

  const farmCoordinates = useMemo(() => {
    const parsedInput =
      typeof farm?.gpsCoordinates === 'string'
        ? (() => {
          try {
            return JSON.parse(farm.gpsCoordinates) as unknown
          } catch {
            return null
          }
        })()
        : farm?.gpsCoordinates
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
  }, [farm?.gpsCoordinates])

  return (
    <div className='space-y-6 pb-10'>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/field-agent',
            icon: <Archive className='size-4 text-gray-400' />,
          },
          { label: 'Farm Assets', href: '/field-agent/farms' },
          { label: 'Check In' },
        ]}
      />

      <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='flex items-center justify-between gap-3 border-b border-gray-100 pb-4'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{farm?.name ?? 'Selected Farm'}</h1>
            <p className='text-sm text-gray-500'>
              {[farm?.lga, farm?.state].filter(Boolean).join(', ') || 'Nigeria'} · {Number(farm?.sizeHectares ?? 0).toFixed(1)} gross hectares
            </p>
          </div>
          <div className='size-12 rounded-full bg-brand text-white font-bold flex items-center justify-center'>
            {farm?.name?.slice(0, 2).toUpperCase() || 'FA'}
          </div>
        </div>

        <FarmMap
          className='mt-5 w-full'
          farms={[
            {
              id: farm?.id ?? 'selected-farm',
              name: farm?.name ?? 'Selected Farm',
              location: [farm?.lga, farm?.state].filter(Boolean).join(', ') || 'Nigeria',
              region: farm?.state ?? 'Nigeria',
              hectares: Number(farm?.sizeHectares ?? 0),
              lat: farmCoordinates.lat,
              lng: farmCoordinates.lng,
            },
          ]}
        />

        <div className='mt-5 grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div className='rounded-md border border-gray-200 p-4 bg-white text-center'>
            <p className='text-sm font-semibold text-gray-900'>3.5 Hectares</p>
            <p className='text-2xl font-bold text-[#cc5e00]'>Maize</p>
          </div>
          <div className='rounded-md border border-gray-200 p-4 bg-white text-center'>
            <p className='text-sm font-semibold text-gray-900'>2.4 Hectares</p>
            <p className='text-2xl font-bold text-[#cc5e00]'>Beans</p>
          </div>
        </div>

        <div className='mt-6'>
          <label className='text-sm font-semibold text-gray-900'>Upload Document *</label>
          <div className='mt-2 rounded-md border-2 border-dashed border-gray-200 bg-white p-10 text-center'>
            <div className='mx-auto mb-4 size-12 rounded-full border border-gray-200 flex items-center justify-center'>
              <Upload className='size-5 text-brand' />
            </div>
            <p className='text-2xl font-medium text-gray-800'>Click to upload farm evidence</p>
            <p className='text-xs uppercase tracking-wider text-gray-400 mt-1'>Max file size: 10MB (PDF, JPG, PNG)</p>
          </div>
        </div>

        <div className='mt-6 flex justify-center'>
          <Button className='h-12 px-10 rounded-md bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-wide'>
            + Check In
          </Button>
        </div>
      </div>
    </div>
  )
}
