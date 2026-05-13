import React, { useCallback, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { DonutChart, SimpleBarChart } from '~/components/charts/report-charts'
import { EmptyReportState } from '~/components/empty-report-state'
import { Badge } from '~/components/ui/badge'
import type { GetReportsFarmerHarvestSalesParams } from '~/lib/api/generated/models/getReportsFarmerHarvestSalesParams'
import { useGetReportsFarmerHarvestSales } from '~/lib/api/generated/reports-farmer/reports-farmer'
import { useReportFarmOptions } from '~/lib/use-report-farm-options'
import { downloadClientPdf } from '~/lib/reports-pdf/download-client-pdf'
import { HarvestSalesPdfDocument } from '~/lib/reports-pdf/harvest-sales-pdf'

const currentYear = new Date().getFullYear()

export default function HarvestSalesReportPage() {
  const { farmOptions, isLoadingFarms } = useReportFarmOptions()
  const [selectedFarmId, setSelectedFarmId] = useState('')
  const [selectedYear, setSelectedYear] = useState(String(currentYear))
  const [applied, setApplied] = useState<GetReportsFarmerHarvestSalesParams | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const queryParams: GetReportsFarmerHarvestSalesParams = applied ?? {
    year: Number(selectedYear) || currentYear,
  }

  const { data: reportResponse, isLoading, isFetching, isError, error } =
    useGetReportsFarmerHarvestSales(queryParams, { query: { enabled: true } })

  const reportData = reportResponse?.data?.data
  const filterOptions = reportData?.filterOptions

  const handleGenerate = () => {
    setApplied({
      year: Number(selectedYear) || currentYear,
      farmId: selectedFarmId || undefined,
    })
  }

  const farmLabel = useMemo(() => {
    if (!selectedFarmId) return 'All farms'
    return farmOptions.find((o) => o.value === selectedFarmId)?.label ?? selectedFarmId
  }, [farmOptions, selectedFarmId])

  const handleDownloadPdf = useCallback(async () => {
    if (!reportData || !applied) return
    setPdfLoading(true)
    try {
      await downloadClientPdf(
        <HarvestSalesPdfDocument
          title="Harvest & sales report"
          scopeLabel="Farmer"
          metaLines={[`Harvest year: ${applied.year}`, `Farm: ${farmLabel}`]}
          data={reportData}
        />,
        'agtrail-farmer-harvest-sales',
      )
    } finally {
      setPdfLoading(false)
    }
  }, [reportData, applied, farmLabel])

  const donutData = useMemo(() => {
    if (!reportData?.cropDistribution) return []
    const colors = ['#1B4332', '#2D6A4F', '#40916C', '#52B788', '#74C69D']
    return reportData.cropDistribution.map((item, i) => ({
      label: item.crop,
      value: item.percentage,
      color: colors[i % colors.length],
    }))
  }, [reportData?.cropDistribution])

  const barData = useMemo(() => {
    if (!reportData?.cropSalesRevenue) return []
    return reportData.cropSalesRevenue.map((item) => ({
      label: item.crop,
      value: item.revenue,
    }))
  }, [reportData?.cropSalesRevenue])

  const yearOptions = useMemo(() => {
    const years = filterOptions?.years?.length
      ? filterOptions.years
      : [currentYear, currentYear - 1, currentYear - 2]
    return years.map((y) => ({ label: String(y), value: String(y) }))
  }, [filterOptions?.years])

  const isBusy = isLoading || (isFetching && applied !== null)

  return (
    <ReportLayout
      title="Harvest & Sales Report"
      subtitle="Production output and sales performance analysis"
      breadcrumb={[
        { label: 'Reports & Analytics', href: '/farmer/reports' },
        { label: 'Harvest & Sales Report' },
      ]}
      onDownloadPdf={reportData && applied ? handleDownloadPdf : undefined}
      downloadPdfDisabled={!reportData || !applied}
      downloadPdfLoading={pdfLoading}
    >
      <div className="space-y-6">
        <ReportFilter
          showDateRange={false}
          isGenerating={isBusy && applied !== null}
          onGenerate={handleGenerate}
          filters={[
            {
              label: 'Harvest Year',
              placeholder: 'Year',
              options: yearOptions,
              value: selectedYear,
              onChange: setSelectedYear,
              isLoading: isLoading && !filterOptions,
            },
            {
              label: 'Select Farm',
              placeholder: 'All farms',
              options: farmOptions,
              value: selectedFarmId,
              onChange: setSelectedFarmId,
              isLoading: isLoadingFarms,
            },
          ]}
        />

        {isBusy && applied ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-gray-100 bg-white py-20">
            <div className="relative">
              <div className="size-16 animate-spin rounded-full border-4 border-gray-50 border-t-brand" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-5 text-brand" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold uppercase tracking-tight text-gray-900">Processing Logs</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Aggregating harvest and sales…
              </p>
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-md border border-red-100 bg-red-50/50 p-6 text-center text-sm text-red-800">
            {(error as unknown) instanceof Error ? (error as unknown as Error).message : 'Could not load report.'}
          </div>
        ) : reportData && applied ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <TrendStatCard
                title="Total Harvested"
                value={`${reportData.kpis.totalHarvested.value.toLocaleString()} ${reportData.kpis.totalHarvested.unit ?? 'kg'}`}
                trend={{
                  value: `${reportData.kpis.totalHarvested.trend >= 0 ? '+' : ''}${reportData.kpis.totalHarvested.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.totalHarvested.trend >= 0,
                }}
                description="Volume in period"
                trendLabel="Vs prior period"
              />
              <TrendStatCard
                title="Total Revenue"
                value={`${reportData.kpis.totalRevenue.currency ?? '₦'}${reportData.kpis.totalRevenue.value.toLocaleString()}`}
                trend={{
                  value: `${reportData.kpis.totalRevenue.trend >= 0 ? '+' : ''}${reportData.kpis.totalRevenue.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.totalRevenue.trend >= 0,
                }}
                description="Sales in period"
                trendLabel="Vs prior period"
              />
              <TrendStatCard
                title="Sustainability"
                value={`${reportData.kpis.sustainabilityScore.value}${reportData.kpis.sustainabilityScore.unit ?? '%'}`}
                trend={{
                  value: `${reportData.kpis.sustainabilityScore.trend >= 0 ? '+' : ''}${reportData.kpis.sustainabilityScore.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.sustainabilityScore.trend >= 0,
                }}
                description="Sustainability score"
                trendLabel="Vs prior period"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">Crop Distribution</h3>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Production volume by type
                  </p>
                </div>
                <div className="py-2">
                  {donutData.length > 0 ? (
                    <DonutChart
                      centerLabel="Crops"
                      centerValue={String(donutData.length)}
                      data={donutData}
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-100 bg-gray-50/50 text-[10px] font-bold uppercase text-gray-400">
                      No Distribution Data
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">Revenue per Crop</h3>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Financial breakdown by crop
                  </p>
                </div>
                <div className="py-2">
                  {barData.length > 0 ? (
                    <SimpleBarChart data={barData} />
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-gray-100 bg-gray-50/50 text-[10px] font-bold uppercase text-gray-400">
                      No Sales History
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-50 p-5">
                <h3 className="text-base font-bold tracking-tight text-gray-900">Recent Harvest Logs</h3>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Detailed batch history
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Batch ID
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Crop</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Quantity
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reportData.recentHarvestBatches.data.length > 0 ? (
                      reportData.recentHarvestBatches.data.map((b, i) => (
                        <tr key={`${b.batchId}-${i}`} className="transition-colors hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex size-6 items-center justify-center rounded-md bg-gray-100 text-[8px] font-bold uppercase tracking-tighter text-gray-400">
                                BT
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                                #{b.batchId.slice(0, 12)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[11px] font-bold uppercase tracking-tight text-gray-900">
                            {b.crop}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold tracking-tight text-gray-900">
                            {Number(b.quantityHarvestedKg).toLocaleString()} kg
                          </td>
                          <td className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">
                            {format(new Date(b.date), 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className="rounded-md border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-emerald-600"
                            >
                              {b.complianceStatus}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-[10px] font-bold uppercase italic text-gray-400">
                          No harvest logs found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EmptyReportState
            title="Analyze Sales Performance"
            description="Choose harvest year and optional farm, then generate harvest and sales analytics."
            icon="chart"
          />
        )}
      </div>
    </ReportLayout>
  )
}
