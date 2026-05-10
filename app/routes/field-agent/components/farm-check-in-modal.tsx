import { useQueryClient } from '@tanstack/react-query'
import { Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { FarmMap } from '~/components/farm-map.client'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { resolveDocumentUrlForApi } from '~/lib/api/custom-fetch'
import {
  getGetFieldAgentsCheckInsQueryKey,
  useGetFieldAgentsCheckIns,
  usePostFieldAgentsCheckIns,
} from '~/lib/api/generated/field-agent/field-agent'
import type { CheckIn } from '~/lib/api/generated/models/checkIn'
import { CreateCheckInRequestGpsCoordinatesType } from '~/lib/api/generated/models/createCheckInRequestGpsCoordinatesType'
import { usePostUpload } from '~/lib/api/generated/upload/upload'
import { extractDataArray, saveFieldAgentLastCheckIn } from '~/lib/field-agent-utils'

export type CheckInFarm = {
  id: string
  name: string
  location: string
  hectares: number
  ownerId?: string
  lat: number
  lng: number
}

type Props = {
  farm: CheckInFarm | null
  isOpen: boolean
  onClose: () => void
}

export function FarmCheckInModal({ farm, isOpen, onClose }: Props) {
  const queryClient = useQueryClient()
  const [overrideReason, setOverrideReason] = useState('')
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
  const { mutateAsync: submitCheckIn, isPending } = usePostFieldAgentsCheckIns()
  const { mutateAsync: uploadFile, isPending: isUploading } = usePostUpload()
  const { data: recentCheckIns = [] } = useGetFieldAgentsCheckIns({
    query: {
      select: (res) => {
        const list = extractDataArray<CheckIn>(res.data)
        if (!farm?.id) return list.slice(0, 10)
        return list.filter((c) => c.farmId === farm.id).slice(0, 10)
      },
    },
  })

  const handleCheckIn = async () => {
    if (!farm) return
    if (!farm.ownerId) {
      toast.error('This farm has no owner on record — cannot check in.')
      return
    }
    if (!navigator.geolocation) {
      toast.error('Location services are unavailable in this browser.')
      return
    }
    if (!evidenceFile) {
      toast.error('Upload an evidence file before checking in.')
      return
    }
    try {
      // Step 1: Upload evidence and resolve stable document URL.
      const uploadRes = await uploadFile({ data: { files: [evidenceFile] } })
      const uploadedRaw = uploadRes?.data?.urls?.[0]
      const proofPhotoUrl = resolveDocumentUrlForApi(uploadedRaw)
      if (!proofPhotoUrl) {
        toast.error('Evidence upload failed. Please try again.')
        return
      }

      let coordinates: [number, number] = [farm.lng, farm.lat]
      let gpsAccuracyMeters: number | undefined
      let fallbackReason: string | undefined

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 25000,
            maximumAge: 0,
          }),
        )
        coordinates = [position.coords.longitude, position.coords.latitude]
        gpsAccuracyMeters = Number.isFinite(position.coords.accuracy)
          ? position.coords.accuracy
          : undefined
      } catch (geoError: unknown) {
        const code =
          geoError &&
            typeof geoError === 'object' &&
            'code' in geoError &&
            typeof (geoError as { code?: unknown }).code === 'number'
            ? (geoError as { code: number }).code
            : undefined

        // 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
        if (code === 2 || code === 3) {
          fallbackReason = `GPS unavailable at check-in (${code === 2 ? 'position_unavailable' : 'timeout'})`
          toast.warning('Live GPS unavailable. Using farm location fallback for this check-in.')
        } else if (code === 1) {
          toast.error('Location permission denied. Allow location access to check in.')
          return
        } else {
          toast.error('Could not read device location for check-in.')
          return
        }
      }

      const res = await submitCheckIn({
        data: {
          farmerId: farm.ownerId,
          farmId: farm.id,
          gpsCoordinates: {
            type: CreateCheckInRequestGpsCoordinatesType.Point,
            coordinates,
          },
          proofPhotoUrl,
          gpsAccuracyMeters,
          ...(overrideReason.trim() || fallbackReason
            ? {
              overrideReason: [overrideReason.trim(), fallbackReason]
                .filter(Boolean)
                .join(' | '),
            }
            : {}),
        },
      })

      const body = res.data as
        | { offlineQueued?: boolean; message?: string }
        | { success?: boolean; data?: CheckIn }

      if (body && typeof body === 'object' && 'offlineQueued' in body && body.offlineQueued) {
        toast.message(body.message ?? 'Queued for sync when you are back online.')
        void queryClient.invalidateQueries({ queryKey: getGetFieldAgentsCheckInsQueryKey() })
        onClose()
        return
      }

      if ('success' in body && body.success && body.data?.id) {
        saveFieldAgentLastCheckIn({ checkInId: body.data.id, farmId: farm.id })
        toast.success('Check-in recorded.')
        void queryClient.invalidateQueries({ queryKey: getGetFieldAgentsCheckInsQueryKey() })
        setOverrideReason('')
        setEvidenceFile(null)
        onClose()
        return
      }

      toast.error('Unexpected response from check-in.')
    } catch (e: unknown) {
      const err = e as { message?: string; response?: { status?: number } }
      if (err.response?.status === 400) {
        toast.error('Check-in rejected. Add an override reason if you are away from the farm boundary.')
        return
      }
      toast.error(err.message ?? 'Could not complete check-in.')
    }
  }

  if (!farm) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='w-[92vw] max-w-xl max-h-[88vh] overflow-y-auto p-0 border-none shadow-2xl rounded-md'>
        <div className='bg-white p-6 space-y-6'>
          <div className='space-y-1 text-left'>
            <h2 className='text-xl font-bold text-gray-900 tracking-tight'>{farm.name}</h2>
            <p className='text-xs text-gray-500 font-medium'>
              {farm.location} · {farm.hectares.toFixed(1)} gross hectares
            </p>
          </div>

          <FarmMap
            farms={[
              {
                id: farm.id,
                name: farm.name,
                location: farm.location,
                region: 'Field Zone',
                hectares: farm.hectares,
                lat: farm.lat,
                lng: farm.lng,
              },
            ]}
            className='w-full rounded-md overflow-hidden'
          />

          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-900' htmlFor='override-reason'>
              Override reason (required if &gt;500m from boundary)
            </label>
            <textarea
              id='override-reason'
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder='e.g. Visiting edge plot, GPS drift, documented site access…'
              className='w-full min-h-[88px] rounded-md border border-gray-200 p-3 text-sm text-gray-900 focus:border-brand focus:outline-none'
            />
          </div>

          <div className='space-y-3'>
            <label className='text-[11px] font-semibold text-gray-900 uppercase tracking-widest'>Upload Document *</label>
            <label
              htmlFor='checkin-evidence-file'
              className='block rounded-md border-2 border-dashed border-gray-100 bg-white p-8 text-center group hover:border-brand/20 transition-all cursor-pointer'
            >
              <div className='mx-auto mb-3 size-10 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 group-hover:scale-110 transition-transform'>
                <Upload className='size-4 text-brand' />
              </div>
              <p className='text-lg font-semibold text-gray-800'>
                {evidenceFile ? evidenceFile.name : 'Click to upload evidence'}
              </p>
              <p className='text-[10px] uppercase tracking-wider text-gray-400 mt-0.5'>Max file size: 10MB (PDF, JPG, PNG)</p>
              <input
                id='checkin-evidence-file'
                type='file'
                accept='.pdf,.jpg,.jpeg,.png'
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  setEvidenceFile(file)
                }}
              />
            </label>
          </div>

          <div className='flex justify-center'>
            <Button
              type='button'
              className='h-12 px-12 rounded-md bg-brand hover:bg-brand-dark text-white font-semibold uppercase tracking-wide shadow-lg active:scale-95 transition-all'
              disabled={isPending || isUploading}
              onClick={() => void handleCheckIn()}
            >
              {isUploading ? 'Uploading evidence…' : isPending ? 'Checking in…' : '+ Check In Farm'}
            </Button>
          </div>

          {recentCheckIns.length > 0 && (
            <div className='border-t border-gray-100 pt-4'>
              <h3 className='text-sm font-bold text-gray-900 uppercase tracking-wide'>Recent check-ins</h3>
              <ul className='mt-2 space-y-2 text-sm text-gray-600'>
                {recentCheckIns.map((c) => (
                  <li key={c.id} className='flex justify-between gap-2 border-b border-gray-50 pb-2'>
                    <span className='font-mono text-xs text-gray-500'>{c.id.slice(0, 8)}…</span>
                    <span>{new Date(c.checkInTime).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
