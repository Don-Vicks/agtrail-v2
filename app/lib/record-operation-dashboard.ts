import type { CropCycle } from '~/lib/api/generated/models'
import type { CropCycleStatus } from '~/lib/api/generated/models/cropCycleStatus'

export type RecordOperationSort = 'recent' | 'name' | 'farm'

/** Crop cycles from parallel `getGetFarmsIdCropCycles` query results (customFetch + list envelope). */
export function extractCropCyclesFromQueries(
  cycleQueries: ReadonlyArray<{ data?: unknown }>,
): CropCycle[] {
  return cycleQueries.flatMap((q) => {
    if (!q.data) return []
    // Handle Axios-style response structure: data.data.data
    const response = q.data as any
    const list = response?.data?.data || response?.data || []
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
  return (status || '').toLowerCase() === filter.toLowerCase()
}

export function sortRecordOperationCycles<
  T extends { productName?: string; farmName?: string; updatedAt?: string },
>(cycles: T[], sortBy: RecordOperationSort): T[] {
  const sorted = [...cycles]
  if (sortBy === 'name') {
    sorted.sort((a, b) => {
      const nameA = a.productName || (a as any).cropName || ''
      const nameB = b.productName || (b as any).cropName || ''
      return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' })
    })
    return sorted
  }
  if (sortBy === 'farm') {
    sorted.sort((a, b) =>
      (a.farmName || '').localeCompare(b.farmName || '', undefined, { sensitivity: 'base' }),
    )
    return sorted
  }
  sorted.sort(
    (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
  )
  return sorted
}

export const RECORD_OPERATION_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'planning', label: 'Planned' },
  { value: 'planted', label: 'Planted' },
  { value: 'growing', label: 'Growing' },
  { value: 'harvesting', label: 'Harvesting' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function cropCycleStatusPillClass(status: string | undefined): string {
  const s = status?.toLowerCase() ?? ''
  if (s === 'planning')
    return 'border border-blue-200 bg-blue-50 text-blue-700'
  if (s === 'growing' || s === 'active' || s === 'planted')
    return 'border border-brand-surface bg-brand-surface/50 text-brand'
  if (s === 'harvesting' || s === 'completed' || s === 'harvested')
    return 'border border-gray-200 bg-gray-50 text-gray-500'
  if (s === 'cancelled' || s === 'failed')
    return 'border border-red-200 bg-red-50 text-red-700'
  if (s === 'abandoned')
    return 'border border-gray-200 bg-gray-100 text-gray-600'
  return 'border border-gray-200 bg-gray-50 text-gray-600'
}

export function cropCycleStatusLabel(status: string | undefined): string {
  if (!status) return 'Unknown'
  const key = status.toLowerCase()
  const labels: Record<string, string> = {
    planning: 'Planned',
    planted: 'Planted',
    growing: 'Growing',
    harvesting: 'Harvesting',
    completed: 'Completed',
    cancelled: 'Cancelled',
    active: 'Active',
    harvested: 'Harvested',
    failed: 'Failed',
    abandoned: 'Abandoned',
  }
  return labels[key] ?? status.replace(/-/g, ' ')
}
