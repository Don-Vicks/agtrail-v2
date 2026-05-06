import type { CropCycle } from '~/lib/api/generated/models'
import type { CropCycleStatus } from '~/lib/api/generated/models/cropCycleStatus'

export type RecordOperationSort = 'recent' | 'name' | 'farm'

/** Crop cycles from parallel `getGetFarmsIdCropCycles` query results (customFetch + list envelope). */
export function extractCropCyclesFromQueries(
  cycleQueries: ReadonlyArray<{ data?: unknown }>,
): CropCycle[] {
  return cycleQueries.flatMap((q) => {
    const envelope = q.data as { data?: { data?: CropCycle[] } } | undefined
    const list = envelope?.data?.data
    return Array.isArray(list) ? list : []
  })
}

export function formatFarmLocation(
  farm: { state?: string | null; lga?: string | null } | null | undefined,
): string {
  if (!farm) return 'Location not specified'
  const state = farm.state?.trim()
  const lga = farm.lga?.trim()
  if (state && lga) return `${state} · ${lga}`
  if (state) return state
  if (lga) return lga
  return 'Location not specified'
}

export function cycleMatchesStatusFilter(
  status: CropCycleStatus | undefined,
  filter: string,
): boolean {
  if (filter === 'all') return true
  return status === filter
}

export function sortRecordOperationCycles<
  T extends { productName: string; farmName: string; updatedAt: string },
>(cycles: T[], sortBy: RecordOperationSort): T[] {
  const sorted = [...cycles]
  if (sortBy === 'name') {
    sorted.sort((a, b) =>
      a.productName.localeCompare(b.productName, undefined, { sensitivity: 'base' }),
    )
    return sorted
  }
  if (sortBy === 'farm') {
    sorted.sort((a, b) =>
      a.farmName.localeCompare(b.farmName, undefined, { sensitivity: 'base' }),
    )
    return sorted
  }
  sorted.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
  return sorted
}

export const RECORD_OPERATION_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'planned', label: 'Planned' },
  { value: 'active', label: 'Active' },
  { value: 'harvested', label: 'Harvested' },
  { value: 'failed', label: 'Failed' },
  { value: 'abandoned', label: 'Abandoned' },
]

export function cropCycleStatusPillClass(status: string | undefined): string {
  const s = status?.toLowerCase() ?? ''
  if (s === 'planned')
    return 'border border-blue-200 bg-blue-50 text-blue-700'
  if (s === 'active')
    return 'border border-brand-surface bg-brand-surface/50 text-brand'
  if (s === 'harvested')
    return 'border border-gray-200 bg-gray-50 text-gray-500'
  if (s === 'failed')
    return 'border border-red-200 bg-red-50 text-red-700'
  if (s === 'abandoned')
    return 'border border-gray-200 bg-gray-100 text-gray-600'
  return 'border border-gray-200 bg-gray-50 text-gray-600'
}

export function cropCycleStatusLabel(status: string | undefined): string {
  if (!status) return 'Unknown'
  const key = status.toLowerCase()
  const labels: Record<string, string> = {
    planned: 'Planned',
    active: 'Active',
    harvested: 'Harvested',
    failed: 'Failed',
    abandoned: 'Abandoned',
  }
  return labels[key] ?? status.replace(/-/g, ' ')
}
