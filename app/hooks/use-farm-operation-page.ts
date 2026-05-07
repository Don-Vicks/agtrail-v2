import { useMemo } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '~/context/auth-context'
import {
  getGetFarmsCropCyclesIdQueryKey,
  getGetFarmsIdCropCyclesQueryKey,
  useGetFarmsCropCyclesId,
} from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import { useGetFarmsId } from '~/lib/api/generated/farms/farms'
import { usePostFarmsIdOperations } from '~/lib/api/generated/farms-operations/farms-operations'
import { getGetFarmsCropCyclesIdOperationsQueryKey } from '~/lib/api/generated/farms-operations/farms-operations'
import type { CropCycle } from '~/lib/api/generated/models'
import type { Farm } from '~/lib/api/generated/models/farm'
import type { GetFarmsCropCyclesId200 } from '~/lib/api/generated/models/getFarmsCropCyclesId200'
import type { GetFarmsId200 } from '~/lib/api/generated/models/getFarmsId200'
import type { LogFarmOperationRequest } from '~/lib/api/generated/models/logFarmOperationRequest'
import { LogFarmOperationRequestOperationCategory } from '~/lib/api/generated/models/logFarmOperationRequestOperationCategory'
import { buildLogFarmOperationRequest, type FarmOperationRouteSlug } from '~/lib/farm-operation-log'
import type { OperationLayoutCropCycle } from '~/lib/operation-layout-types'
import { getOperationsListPath } from '~/lib/operations-list-path'
import { formatFarmLocation } from '~/lib/record-operation-dashboard'
import type { OperationFormFooterValues } from '~/lib/operation-form-footer'

function cropCycleFromQueryData(
  queryData: { data: GetFarmsCropCyclesId200 } | undefined,
): CropCycle | null {
  const body = queryData?.data
  return body?.data ?? null
}

function farmFromQueryData(queryData: { data: GetFarmsId200 } | undefined): Farm | null {
  const body = queryData?.data
  return body?.data ?? null
}

function parseFarmCoordinates(
  gpsCoordinates: unknown | null | undefined,
): { latitude: number | null; longitude: number | null } {
  console.log('parseFarmCoordinates - input:', gpsCoordinates)
  if (!gpsCoordinates) {
    return { latitude: null, longitude: null }
  }

  // 1. Handle string input (JSON or comma-separated)
  if (typeof gpsCoordinates === 'string') {
    const trimmed = gpsCoordinates.trim()
    if (!trimmed) return { latitude: null, longitude: null }

    // Try JSON first
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return parseFarmCoordinates(JSON.parse(trimmed))
      } catch {
        // Fall through to regex
      }
    }

    // Try "lat, lng" format
    const parts = trimmed.split(/[,\s]+/)
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0])
      const lng = parseFloat(parts[1])
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { latitude: lat, longitude: lng }
      }
    }
  }

  // 2. Handle object input
  if (typeof gpsCoordinates !== 'object' || gpsCoordinates === null) {
    return { latitude: null, longitude: null }
  }

  const point = gpsCoordinates as any

  // Handle GeoJSON Point structure: { coordinates: [lng, lat] }
  if (Array.isArray(point.coordinates)) {
    const lng = Number(point.coordinates[0])
    const lat = Number(point.coordinates[1])
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { latitude: lat, longitude: lng }
    }
  }

  // Handle various flat object structures
  const latCandidate = point.lat ?? point.latitude ?? point.y
  const lngCandidate = point.lng ?? point.longitude ?? point.x ?? point.long

  const lat = Number(latCandidate)
  const lng = Number(lngCandidate)

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { latitude: lat, longitude: lng }
  }

  return { latitude: null, longitude: null }
}

function compactOperationRequest(
  payload: LogFarmOperationRequest,
): Partial<LogFarmOperationRequest> {
  if (payload.cropCycleId) return payload
  const { cropCycleId: _ignored, ...rest } = payload
  return rest
}

function buildFallbackRequests(
  baseRequest: LogFarmOperationRequest,
): Partial<LogFarmOperationRequest>[] {
  const dateOnly = new Date().toISOString().slice(0, 10)
  const candidates: LogFarmOperationRequest[] = [
    baseRequest,
    { ...baseRequest, operationDate: dateOnly },
  ]
  const seen = new Set<string>()
  return candidates
    .map(compactOperationRequest)
    .filter((request) => {
      const key = JSON.stringify(request)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

function extractApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const maybeResponse = (error as Error & { response?: { data?: unknown } }).response
    const data = maybeResponse?.data as
      | { message?: string; error?: string; details?: string }
      | undefined
    return data?.message || data?.error || data?.details || error.message
  }
  return 'Unknown error'
}

function shouldRetryWithAlternateShape(error: unknown): boolean {
  const maybeError = error as
    | {
        response?: {
          status?: number
          data?: { message?: string; error?: string; details?: string }
        }
      }
    | undefined
  const status = maybeError?.response?.status
  if (!status || status >= 500) return false
  const text = (
    maybeError?.response?.data?.message ||
    maybeError?.response?.data?.error ||
    maybeError?.response?.data?.details ||
    ''
  ).toLowerCase()
  return (
    text.includes('invalid crop cycle id') ||
    text.includes('invalid crop cycle') ||
    text.includes('operation date')
  )
}

export function useFarmOperationPage(operationSlug: FarmOperationRouteSlug) {
  const { cropCycleId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const id = cropCycleId ?? ''
  const cycleQuery = useGetFarmsCropCyclesId(id, {
    query: { enabled: !!id },
  })

  const cycle = useMemo(
    () => cropCycleFromQueryData(cycleQuery.data as { data: GetFarmsCropCyclesId200 } | undefined),
    [cycleQuery.data],
  )

  const farmIdFromUrl = searchParams.get('farmId') ?? ''
  const farmId = farmIdFromUrl || cycle?.farmId || ''
  const farmQuery = useGetFarmsId(farmId, {
    query: { enabled: !!farmId },
  })

  const farm = useMemo(
    () => farmFromQueryData(farmQuery.data as { data: GetFarmsId200 } | undefined),
    [farmQuery.data],
  )

  const layoutCropCycle: OperationLayoutCropCycle | null = useMemo(() => {
    if (!cycle) return null
    console.log('useFarmOperationPage - cycle:', cycle)
    console.log('useFarmOperationPage - farm:', farm)
    const cycleCoords = parseFarmCoordinates((cycle as any)?.gpsCoordinates || (cycle as any)?.gps_coordinates)
    const farmCoords = parseFarmCoordinates(farm?.gpsCoordinates || (farm as any)?.gps_coordinates)
    console.log('useFarmOperationPage - parsed cycleCoords:', cycleCoords)
    console.log('useFarmOperationPage - parsed farmCoords:', farmCoords)
    const latitude = cycleCoords.latitude ?? farmCoords.latitude
    const longitude = cycleCoords.longitude ?? farmCoords.longitude
    console.log('useFarmOperationPage - final:', { latitude, longitude })
    const farmerName = user?.email?.split('@')[0] ?? 'Operator'
    const initials = farmerName.slice(0, 2).toUpperCase()
    return {
      id: cycle.id,
      farmId: cycle.farmId,
      latitude,
      longitude,
      productName: (cycle as CropCycle & { cropName?: string }).cropName || 'Crop',
      variety: cycle.variety,
      plantedDate: cycle.plantingDate
        ? new Date(cycle.plantingDate).toLocaleDateString()
        : null,
      area: (cycle as CropCycle & { areaPlantedHectares?: number | null }).areaPlantedHectares ?? null,
      season: cycle.season,
      farmName: farm?.name ?? 'Farm',
      farmLocation: formatFarmLocation(farm),
      farmer: farmerName,
      farmerInitials: initials,
      farmerColor: '#264d10',
      status: cycle.status,
    }
  }, [cycle, farm, user])

  const { mutateAsync: postOperation, isPending } = usePostFarmsIdOperations()

  const submitLog = async (
    description: string,
    footer: OperationFormFooterValues,
    extraData?: Partial<LogFarmOperationRequest>,
  ) => {
    if (!cycle) throw new Error('Crop cycle not loaded')
    if (!farmId) throw new Error('Farm ID is missing for this crop cycle')
    const data = buildLogFarmOperationRequest(operationSlug, description, cycle.id, footer)
    const finalData = { ...data, ...extraData }
    const requestAttempts = buildFallbackRequests(finalData)
    let lastServerError: unknown = null

    for (const requestData of requestAttempts) {
      try {
        await postOperation({ id: farmId, data: requestData as LogFarmOperationRequest })
        lastServerError = null
        break
      } catch (error: unknown) {
        const status =
          (error as { response?: { status?: number } })?.response?.status
        // Do not retry most client errors; only retry known schema/validation shape mismatches.
        if (status && status < 500 && !shouldRetryWithAlternateShape(error)) {
          throw new Error(extractApiErrorMessage(error))
        }
        lastServerError = error
      }
    }

    if (lastServerError) {
      throw new Error(extractApiErrorMessage(lastServerError))
    }

    await queryClient.invalidateQueries({ queryKey: getGetFarmsCropCyclesIdQueryKey(cycle.id) })
    await queryClient.invalidateQueries({
      queryKey: getGetFarmsCropCyclesIdOperationsQueryKey(cycle.id),
    })
    await queryClient.invalidateQueries({ queryKey: getGetFarmsIdCropCyclesQueryKey(farmId) })

    navigate(getOperationsListPath(location.pathname))
  }

  const isLoading = cycleQuery.isLoading || (!!farmId && farmQuery.isLoading)
  const isError = cycleQuery.isError || farmQuery.isError
  const notFound = !isLoading && !cycleQuery.isError && !cycle

  return {
    layoutCropCycle,
    submitLog,
    isPending,
    isLoading,
    isError: isError || notFound,
    cropCycleId: id,
  }
}
