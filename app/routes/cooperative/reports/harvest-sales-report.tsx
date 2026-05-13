import React, { useCallback, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { DonutChart, SimpleBarChart } from '~/components/charts/report-charts'
import { EmptyReportState } from '~/components/empty-report-state'
import { Badge } from '~/components/ui/badge'
import type { GetReportsCooperativeHarvestSalesParams } from '~/lib/api/generated/models/getReportsCooperativeHarvestSalesParams'
import { useGetReportsCooperativeHarvestSales } from '~/lib/api/generated/reports-cooperative/reports-cooperative'
import { useReportFarmOptions } from '~/lib/use-report-farm-options'
import {
  cooperativeReportsQueryEnabled,
  MissingCooperativeOrgBanner,
} from './report-org-context'
import { downloadClientPdf } from '~/lib/reports-pdf/download-client-pdf'
import { HarvestSalesPdfDocument } from '~/lib/reports-pdf/harvest-sales-pdf'

const currentYear = new Date().getFullYear()

export default function CooperativeHarvestSalesReportPage() {
  const coopEnabled = cooperativeReportsQueryEnabled()
  const { farmOptions, isLoadingFarms } = useReportFarmOptions({
    query: { enabled: coopEnabled },
  })
  const [selectedFarmerId, setSelectedFarmerId] = useState('')
  const [selectedFarmId, setSelectedFarmId] = useState('')
  const [selectedYear, setSelectedYear] = useState(String(currentYear))
  const [applied, setApplied] = useState<GetReportsCooperativeHarvestSalesParams | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const queryParams: GetReportsCooperativeHarvestSalesParams = applied ?? {
    year: Number(selectedYear) || currentYear,
  }

  const { data: reportResponse, isLoading, isFetching, isError, error } =
    useGetReportsCooperativeHarvestSales(queryParams, { query: { enabled: coopEnabled } })

  const reportData = reportResponse?.data?.data
  const filterOptions = reportData?.filterOptions

  const farmerOptions =
    filterOptions?.farmers?.map((f) => ({
      label: f.name,
      value: f.id,
    })) ?? []

  const handleGenerate = () => {
    setApplied({
      year: Number(selectedYear) || currentYear,
      farmerId: selectedFarmerId || undefined,
      farmId: selectedFarmId || undefined,
    })
  }

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

  const farmerLabel = useMemo(() => {
    if (!selectedFarmerId) return 'All farmers'
    return farmerOptions.find((o) => o.value === selectedFarmerId)?.label ?? selectedFarmerId
  }, [farmerOptions, selectedFarmerId])

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
          scopeLabel="Cooperative"
          metaLines={[
            `Harvest year: ${applied.year}`,
            `Farmer: ${farmerLabel}`,
            `Farm: ${farmLabel}`,
          ]}
          data={reportData}
        />,
        'agtrail-cooperative-harvest-sales',
      )
    } finally {
      setPdfLoading(false)
    }
  }, [reportData, applied, farmerLabel, farmLabel])

  const isBusy = isLoading || (isFetching && applied !== null)

  const filters = [
    {
      label: 'Harvest Year',
      placeholder: 'Year',
      options: yearOptions,
      value: selectedYear,
      onChange: setSelectedYear,
      isLoading: isLoading && !filterOptions,
    },
    ...(farmerOptions.length
      ? [
          {
            label: 'Farmer',
            placeholder: 'All farmers',
            options: farmerOptions,
            value: selectedFarmerId,
            onChange: setSelectedFarmerId,
            isLoading: isLoading && !filterOptions,
          },
        ]
      : []),
    {
      label: 'Farm',
      placeholder: 'All farms',
      options: farmOptions,
      value: selectedFarmId,
      onChange: setSelectedFarmId,
      isLoading: isLoadingFarms,
    },
  ]

  return (
    <ReportLayout
      title="Harvest & Sales Report"
      subtitle="Cooperative harvest and sales performance"
      breadcrumb={[
        { label: 'Dashboard', href: '/cooperative' },
        { label: 'Reports & Analytics', href: '/cooperative/reports' },
        { label: 'Harvest & Sales' },
      ]}
      onDownloadPdf={reportData && applied ? handleDownloadPdf : undefined}
      downloadPdfDisabled={!reportData || !applied}
      downloadPdfLoading={pdfLoading}
    >
      <div className="space-y-6">
        <MissingCooperativeOrgBanner />
        <ReportFilter
          showDateRange={false}
          isGenerating={isBusy && applied !== null}
          onGenerate={handleGenerate}
          filters={filters}
        />

        {isBusy && applied ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-gray-100 bg-white py-20">
            <Loader2 className="size-8 animate-spin text-brand" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading…</p>
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
                <h3 className="mb-4 text-sm font-bold text-gray-900">Crop distribution</h3>
                {donutData.length > 0 ? (
                  <DonutChart centerLabel="Crops" centerValue={String(donutData.length)} data={donutData} />
                ) : (
                  <div className="flex h-40 items-center justify-center text-[10px] font-bold uppercase text-gray-400">
                    No data
                  </div>
                )}
              </div>
              <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-gray-900">Revenue per crop</h3>
                {barData.length > 0 ? (
                  <SimpleBarChart data={barData} />
                ) : (
                  <div className="flex h-40 items-center justify-center text-[10px] font-bold uppercase text-gray-400">
                    No data
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-50 p-5">
                <h3 className="text-base font-bold text-gray-900">Recent harvest batches</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Batch</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Crop</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Qty</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Date</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reportData.recentHarvestBatches.data.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-[10px] font-bold uppercase text-gray-400">
                          No batches
                        </td>
                      </tr>
                    ) : (
                      reportData.recentHarvestBatches.data.map((b, i) => (
                        <tr key={`${b.batchId}-${i}`}>
                          <td className="px-6 py-3 text-[10px] font-bold uppercase">#{b.batchId.slice(0, 12)}</td>
                          <td className="px-6 py-3 font-bold">{b.crop}</td>
                          <td className="px-6 py-3 font-bold">
                            {Number(b.quantityHarvestedKg).toLocaleString()} kg
                          </td>
                          <td className="px-6 py-3 text-[10px] text-gray-500">
                            {format(new Date(b.date), 'MMM d, yyyy')}
                          </td>
                          <td className="px-6 py-3">
                            <Badge className="bg-emerald-50 text-emerald-700">{b.complianceStatus}</Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EmptyReportState
            title="Harvest & sales"
            description="Pick year, optional farmer and farm, then generate."
            icon="chart"
          />
        )}
      </div>
    </ReportLayout>
  )
}
