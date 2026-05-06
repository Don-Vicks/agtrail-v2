import type { LogFarmOperationRequest } from '~/lib/api/generated/models/logFarmOperationRequest'
import { LogFarmOperationRequestOperationCategory } from '~/lib/api/generated/models/logFarmOperationRequestOperationCategory'
import type { OperationFormFooterValues } from './operation-form-footer'

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

const SLUG_TO_CATEGORY: Record<FarmOperationRouteSlug, LogFarmOperationRequestOperationCategory> = {
  'land-prep': LogFarmOperationRequestOperationCategory.land_preparation,
  planting: LogFarmOperationRequestOperationCategory.planting,
  fertilizer: LogFarmOperationRequestOperationCategory.fertilizer,
  irrigation: LogFarmOperationRequestOperationCategory.irrigation,
  weeding: LogFarmOperationRequestOperationCategory.weeding,
  'pest-control': LogFarmOperationRequestOperationCategory.pest_control,
  pruning: LogFarmOperationRequestOperationCategory.pruning,
  harvesting: LogFarmOperationRequestOperationCategory.harvesting,
  sorting: LogFarmOperationRequestOperationCategory.general,
  drying: LogFarmOperationRequestOperationCategory.general,
  processing: LogFarmOperationRequestOperationCategory.general,
  packaging: LogFarmOperationRequestOperationCategory.general,
  storage: LogFarmOperationRequestOperationCategory.general,
}

export function buildLogFarmOperationRequest(
  routeSlug: FarmOperationRouteSlug,
  description: string,
  cropCycleId: string,
  footer?: OperationFormFooterValues,
  operationDate: string = new Date().toISOString().slice(0, 10),
): LogFarmOperationRequest {
  const trimmed = description.trim()
  const category = SLUG_TO_CATEGORY[routeSlug]
  
  const baseRequest: LogFarmOperationRequest = {
    cropCycleId,
    operationCategory: category,
    operationType: routeSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: trimmed,
    operationDate,
  }

  if (footer) {
    const costRaw = String(footer.costNgn).replace(/,/g, '').trim()
    return {
      ...baseRequest,
      cost: costRaw || undefined as any,
      currency: footer.currency || 'NGN',
      personnelId: footer.personnelId,
      weatherConditions: footer.weatherData as any,
      areaCovered: footer.areaHectares,
      areaUnit: 'hectares',
    }
  }

  return baseRequest
}
