import React, { useCallback, useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { SimpleAreaChart } from '~/components/charts/simple-area-chart'
import { DonutChart, SimpleBarChart } from '~/components/charts/report-charts'
import { EmptyReportState } from '~/components/empty-report-state'
import type { GetReportsCooperativeFinancialSummaryParams } from '~/lib/api/generated/models/getReportsCooperativeFinancialSummaryParams'
import { useGetReportsCooperativeFinancialSummary } from '~/lib/api/generated/reports-cooperative/reports-cooperative'
import {
  cooperativeReportsQueryEnabled,
  MissingCooperativeOrgBanner,
} from './report-org-context'
import { downloadClientPdf } from '~/lib/reports-pdf/download-client-pdf'
import { FinancialSummaryPdfDocument } from '~/lib/reports-pdf/financial-summary-pdf'

function defaultDateRange() {
  const end = new Date()
  const start = subDays(end, 90)
  return { startDate: format(start, 'yyyy-MM-dd'), endDate: format(end, 'yyyy-MM-dd') }
}

export default function CooperativeFinancialSummaryPage() {
  const defaults = useMemo(() => defaultDateRange(), [])
  const [selectedFarmerId, setSelectedFarmerId] = useState('')
  const [startDate, setStartDate] = useState(defaults.startDate)
  const [endDate, setEndDate] = useState(defaults.endDate)
  const [applied, setApplied] = useState<GetReportsCooperativeFinancialSummaryParams | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const queryParams = applied ?? {}
  const coopEnabled = cooperativeReportsQueryEnabled()
  const { data: reportResponse, isLoading, isFetching, isError, error } =
    useGetReportsCooperativeFinancialSummary(queryParams, { query: { enabled: coopEnabled } })

  const reportData = reportResponse?.data?.data
  const filterOptions = reportData?.filterOptions

  const farmerOptions =
    filterOptions?.farmers?.map((f) => ({
      label: f.name,
      value: f.id,
    })) ?? []

  const handleGenerate = () => {
    setApplied({
      farmerId: selectedFarmerId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
  }

  const farmerLabel = useMemo(() => {
    if (!selectedFarmerId) return 'All farmers'
    return farmerOptions.find((o) => o.value === selectedFarmerId)?.label ?? selectedFarmerId
  }, [farmerOptions, selectedFarmerId])

  const handleDownloadPdf = useCallback(async () => {
    if (!reportData || !applied) return
    setPdfLoading(true)
    try {
      await downloadClientPdf(
        <FinancialSummaryPdfDocument
          title="Financial summary"
          scopeLabel="Cooperative"
          metaLines={[
            `Farmer filter: ${farmerLabel}`,
            `Date range: ${applied.startDate ?? '—'} → ${applied.endDate ?? '—'}`,
          ]}
          data={reportData}
        />,
        'agtrail-cooperative-financial-summary',
      )
    } finally {
      setPdfLoading(false)
    }
  }, [reportData, applied, farmerLabel])

  const profitTrend = useMemo(() => {
    if (!reportData?.revenueCostsTrend?.length) return []
    return reportData.revenueCostsTrend.map((row) => ({
      label: format(new Date(row.date), 'MMM d'),
      value: row.profit,
    }))
  }, [reportData?.revenueCostsTrend])

  const costDonut = useMemo(() => {
    if (!reportData?.costBreakdown?.length) return []
    const colors = ['#1B4332', '#40916C', '#52B788', '#95D5B2', '#B7E4C7']
    return reportData.costBreakdown.map((c, i) => ({
      label: c.category,
      value: c.amount,
      color: colors[i % colors.length],
    }))
  }, [reportData?.costBreakdown])

  const cropMarginBars = useMemo(() => {
    if (!reportData?.cropSalesDetail?.length) return []
    return reportData.cropSalesDetail.map((c) => ({
      label: c.crop,
      value: c.marginPct,
    }))
  }, [reportData?.cropSalesDetail])

  const isBusy = isLoading || (isFetching && applied !== null)

  const filters = farmerOptions.length
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
    : []

  return (
    <ReportLayout
      title="Financial Summary"
      subtitle="Cooperative revenue, costs, and profit"
      breadcrumb={[
        { label: 'Dashboard', href: '/cooperative' },
        { label: 'Reports & Analytics', href: '/cooperative/reports' },
        { label: 'Financial Summary' },
      ]}
      onDownloadPdf={reportData && applied ? handleDownloadPdf : undefined}
      downloadPdfDisabled={!reportData || !applied}
      downloadPdfLoading={pdfLoading}
    >
      <div className="space-y-6">
        <MissingCooperativeOrgBanner />
        <ReportFilter
          filters={filters}
          isGenerating={isBusy && applied !== null}
          onGenerate={handleGenerate}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
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
                title="Total Revenue"
                value={`${reportData.kpis.totalRevenue.currency ?? '₦'}${reportData.kpis.totalRevenue.value.toLocaleString()}`}
                trend={{
                  value: `${reportData.kpis.totalRevenue.trend >= 0 ? '+' : ''}${reportData.kpis.totalRevenue.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.totalRevenue.trend >= 0,
                }}
                description="Total sales revenue"
                trendLabel="Vs prior period"
              />
              <TrendStatCard
                title="Total Costs"
                value={`${reportData.kpis.totalCosts.currency ?? '₦'}${reportData.kpis.totalCosts.value.toLocaleString()}`}
                trend={{
                  value: `${reportData.kpis.totalCosts.trend >= 0 ? '+' : ''}${reportData.kpis.totalCosts.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.totalCosts.trend <= 0,
                }}
                description="Operating and input costs"
                trendLabel="Vs prior period"
              />
              <TrendStatCard
                title="Net Profit"
                value={`${reportData.kpis.netProfit.currency ?? '₦'}${reportData.kpis.netProfit.value.toLocaleString()}`}
                trend={{
                  value: `${reportData.kpis.netProfit.trend >= 0 ? '+' : ''}${reportData.kpis.netProfit.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.netProfit.trend >= 0,
                }}
                description="Revenue minus costs"
                trendLabel="Vs prior period"
              />
            </div>

            <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-900">Profit trend</h3>
              <div className="flex h-[200px] items-end">
                {profitTrend.length > 1 ? (
                  <SimpleAreaChart data={profitTrend} height={200} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-gray-100 bg-gray-50/50 text-[10px] font-bold uppercase text-gray-400">
                    Insufficient data
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-gray-900">Cost breakdown</h3>
                {costDonut.length > 0 ? (
                  <DonutChart centerLabel="Categories" centerValue={String(costDonut.length)} data={costDonut} />
                ) : (
                  <div className="flex h-40 items-center justify-center text-[10px] font-bold uppercase text-gray-400">
                    No cost data
                  </div>
                )}
              </div>
              <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-gray-900">Margin by crop</h3>
                {cropMarginBars.length > 0 ? (
                  <SimpleBarChart data={cropMarginBars} />
                ) : (
                  <div className="flex h-40 items-center justify-center text-[10px] font-bold uppercase text-gray-400">
                    No crop detail
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-50 p-5">
                <h3 className="text-base font-bold text-gray-900">Crop sales detail</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Crop</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Revenue</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Costs</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Profit</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reportData.cropSalesDetail.map((c, i) => (
                      <tr key={`${c.crop}-${i}`}>
                        <td className="px-6 py-3 font-bold">{c.crop}</td>
                        <td className="px-6 py-3 font-bold text-emerald-700">
                          {c.currency}
                          {c.revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 font-bold">
                          {c.currency}
                          {c.costs.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 font-bold">
                          {c.currency}
                          {c.profit.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 font-bold text-gray-600">{c.marginPct.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EmptyReportState
            title="Financial Summary"
            description="Optionally pick a farmer, set dates, then generate."
            icon="search"
          />
        )}
      </div>
    </ReportLayout>
  )
}
