import type { LogFarmOperationRequest } from '~/lib/api/generated/models/logFarmOperationRequest'
import { FarmOperationOperationType } from '~/lib/api/generated/models/farmOperationOperationType'

/** URL segment under `.../operations/new/:cropCycleId/<slug>` */
export type FarmOperationRouteSlug =
  | 'land-prep'
  | 'planting'
  | 'fertilizer'
  | 'irrigation'
  | 'weeding'
  | 'pest-control'
  | 'pruning'
  | 'harvesting'
  | 'sorting'
  | 'drying'
  | 'processing'
  | 'packaging'
  | 'storage'

const SLUG_TO_TYPE: Partial<Record<FarmOperationRouteSlug, FarmOperationOperationType>> = {
  'land-prep': FarmOperationOperationType.land_clearing,
  planting: FarmOperationOperationType.planting,
  fertilizer: FarmOperationOperationType.fertilizer_application,
  irrigation: FarmOperationOperationType.irrigation,
  weeding: FarmOperationOperationType.weeding,
  'pest-control': FarmOperationOperationType.pesticide_application,
  harvesting: FarmOperationOperationType.harvesting,
}

const OTHER_LABEL: Partial<Record<FarmOperationRouteSlug, string>> = {
  pruning: 'Pruning',
  sorting: 'Sorting & grading',
  drying: 'Drying',
  processing: 'Post-harvest processing',
  packaging: 'Packaging',
  storage: 'Storage',
}

export function buildLogFarmOperationRequest(
  routeSlug: FarmOperationRouteSlug,
  description: string,
  cropCycleId: string,
  operationDate: string = new Date().toISOString(),
): LogFarmOperationRequest {
  const trimmed = description.trim()
  const mapped = SLUG_TO_TYPE[routeSlug]
  if (mapped) {
    return {
      cropCycleId,
      operationType: mapped,
      description: trimmed,
      operationDate,
    }
  }
  const label =
    OTHER_LABEL[routeSlug] ??
    routeSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    cropCycleId,
    operationType: FarmOperationOperationType.other,
    description: `${label}: ${trimmed}`,
    operationDate,
  }
}
