import type { GetReportsFarmerCropCycleSummaryParams } from '~/lib/api/generated/models/getReportsFarmerCropCycleSummaryParams'
import type { GetReportsFarmerFarmSummaryParams } from '~/lib/api/generated/models/getReportsFarmerFarmSummaryParams'
import type { GetReportsFarmerFinancialSummaryParams } from '~/lib/api/generated/models/getReportsFarmerFinancialSummaryParams'
import type { GetReportsFarmerHarvestSalesParams } from '~/lib/api/generated/models/getReportsFarmerHarvestSalesParams'

/**
 * Some report endpoints accept extra query keys before OpenAPI is regenerated.
 * `Object.entries` in the generated URL builders will still append these.
 */
export type FarmerCropCycleReportParams = GetReportsFarmerCropCycleSummaryParams & {
  cropCycleId?: string
}

export type FarmerFarmReportParams = GetReportsFarmerFarmSummaryParams & {
  cropCycleId?: string
}

export type FarmerFinancialReportParams = GetReportsFarmerFinancialSummaryParams & {
  farmId?: string
  crop?: string
  cropCycleId?: string
}

export type FarmerHarvestReportParams = GetReportsFarmerHarvestSalesParams & {
  cropCycleId?: string
}
