import { useMemo } from 'react'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import type { Farm } from '~/lib/api/generated/models/farm'
import { extractDataArray } from '~/lib/field-agent-utils'

export type ReportFarmOption = { label: string; value: string }

/**
 * Farm options for report filters from GET /farms.
 * Prefer this over `filterOptions.farms` from a report payload so the farm list
 * works even when the report request fails or returns no filter metadata.
 *
 * @param options.query.enabled — e.g. cooperative reports should pass
 * `cooperativeReportsQueryEnabled()` so `/farms` is not called without org context.
 */
export function useReportFarmOptions(options?: { query?: { enabled?: boolean } }) {
  const { data: farmsResponse, isLoading, isError, error } = useGetFarms({
    query: options?.query,
  })
  const farms = useMemo(
    () => extractDataArray<Farm>(farmsResponse?.data),
    [farmsResponse?.data],
  )
  const farmOptions = useMemo(
    (): ReportFarmOption[] => farms.map((f) => ({ label: f.name, value: f.id })),
    [farms],
  )
  return {
    farms,
    farmOptions,
    isLoadingFarms: isLoading,
    farmsQueryError: isError ? error : null,
  }
}
