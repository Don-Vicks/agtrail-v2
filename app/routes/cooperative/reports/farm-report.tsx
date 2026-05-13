import React, { useCallback, useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'
import { Loader2, MapPin, Package } from 'lucide-react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { EmptyReportState } from '~/components/empty-report-state'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'
import type { GetReportsCooperativeFarmSummaryParams } from '~/lib/api/generated/models/getReportsCooperativeFarmSummaryParams'
import { useGetReportsCooperativeFarmSummary } from '~/lib/api/generated/reports-cooperative/reports-cooperative'
import { useReportFarmOptions } from '~/lib/use-report-farm-options'
import {
  cooperativeReportsQueryEnabled,
  MissingCooperativeOrgBanner,
} from './report-org-context'
import { downloadClientPdf } from '~/lib/reports-pdf/download-client-pdf'
import { FarmSummaryPdfDocument } from '~/lib/reports-pdf/farm-summary-pdf'

function defaultDateRange() {
  const end = new Date()
  const start = subDays(end, 90)
  return { startDate: format(start, 'yyyy-MM-dd'), endDate: format(end, 'yyyy-MM-dd') }
}

export default function CooperativeFarmReportPage() {
  const defaults = useMemo(() => defaultDateRange(), [])
  const coopEnabled = cooperativeReportsQueryEnabled()
  const { farmOptions, isLoadingFarms } = useReportFarmOptions({
    query: { enabled: coopEnabled },
  })
  const [selectedFarmerId, setSelectedFarmerId] = useState('')
  const [selectedFarmId, setSelectedFarmId] = useState('')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [startDate, setStartDate] = useState(defaults.startDate)
  const [endDate, setEndDate] = useState(defaults.endDate)
  const [applied, setApplied] = useState<GetReportsCooperativeFarmSummaryParams | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const queryParams = applied ?? {}
  const { data: reportResponse, isLoading, isFetching, isError, error } =
    useGetReportsCooperativeFarmSummary(queryParams, { query: { enabled: coopEnabled } })

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
      farmId: selectedFarmId || undefined,
      crop: selectedCrop || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
  }

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
        <FarmSummaryPdfDocument
          title="Farm analysis report"
          scopeLabel="Cooperative"
          metaLines={[
            `Farmer: ${farmerLabel}`,
            `Farm: ${farmLabel}`,
            `Crop filter: ${selectedCrop || 'All crops'}`,
            `Date range: ${applied.startDate ?? '—'} → ${applied.endDate ?? '—'}`,
          ]}
          data={reportData}
        />,
        'agtrail-cooperative-farm-analysis',
      )
    } finally {
      setPdfLoading(false)
    }
  }, [reportData, applied, farmerLabel, farmLabel, selectedCrop])

  const plots = reportData?.farmPerformance?.data ?? []
  const isBusy = isLoading || (isFetching && applied !== null)

  const filters = [
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
      label: 'Target Farm',
      placeholder: 'Choose a Farm',
      options: farmOptions,
      value: selectedFarmId,
      onChange: setSelectedFarmId,
      isLoading: isLoadingFarms,
    },
    {
      label: 'Crop (optional)',
      placeholder: 'All crops',
      options: filterOptions?.crops.map((c) => ({ label: c, value: c })) || [],
      value: selectedCrop,
      onChange: setSelectedCrop,
      isLoading: isLoading && !filterOptions,
    },
  ]

  return (
    <ReportLayout
      title="Farm Analysis Report"
      subtitle="Cooperative farm performance and compliance"
      breadcrumb={[
        { label: 'Dashboard', href: '/cooperative' },
        { label: 'Reports & Analytics', href: '/cooperative/reports' },
        { label: 'Farm Analysis' },
      ]}
      onDownloadPdf={reportData && applied ? handleDownloadPdf : undefined}
      downloadPdfDisabled={!reportData || !applied}
      downloadPdfLoading={pdfLoading}
    >
      <div className="space-y-6">
        <MissingCooperativeOrgBanner />
        <ReportFilter
          isGenerating={isBusy && applied !== null}
          onGenerate={handleGenerate}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
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
                title="Quality Score"
                value={`${reportData.kpis.qualityScore.value}${reportData.kpis.qualityScore.unit ?? '/100'}`}
                trend={{
                  value: `${reportData.kpis.qualityScore.trend >= 0 ? '+' : ''}${reportData.kpis.qualityScore.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.qualityScore.trend >= 0,
                }}
                description="Assessed crop quality"
                trendLabel="Vs prior period"
              />
              <TrendStatCard
                title="Estimated Yield"
                value={`${reportData.kpis.estimatedYield.value.toLocaleString()} ${reportData.kpis.estimatedYield.unit ?? ''}`}
                trend={{
                  value: `${reportData.kpis.estimatedYield.trend >= 0 ? '+' : ''}${reportData.kpis.estimatedYield.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.estimatedYield.trend >= 0,
                }}
                description="Expected harvest"
                trendLabel="Vs prior period"
              />
              <TrendStatCard
                title="Sustainability"
                value={`${reportData.kpis.sustainabilityScore.value}${reportData.kpis.sustainabilityScore.unit ?? '%'}`}
                trend={{
                  value: `${reportData.kpis.sustainabilityScore.trend >= 0 ? '+' : ''}${reportData.kpis.sustainabilityScore.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.sustainabilityScore.trend >= 0,
                }}
                description="Environmental score"
                trendLabel="Vs prior period"
              />
            </div>

            <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-50 p-5">
                <h3 className="text-base font-bold text-gray-900">Plot & crop performance</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Farm</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Farmer</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Ha</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Expected (t)</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Actual (t)</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-500">Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {plots.map((row, i) => (
                      <tr key={`${row.productId}-${i}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-8 items-center justify-center rounded-md bg-brand/10 text-brand">
                              <MapPin className="size-4" />
                            </div>
                            <div>
                              <p className="text-[13px] font-bold text-gray-900">{row.farmName}</p>
                              <p className="text-[9px] font-bold text-gray-300">{row.productId.slice(0, 12)}…</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[11px] font-bold">{row.farmerName}</td>
                        <td className="px-6 py-4 font-bold">{row.hectares}</td>
                        <td className="px-6 py-4 font-bold">{row.expectedYieldTons.toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold">{row.actualYieldTons.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Package className="size-3.5" />
                            <span className="text-[10px] font-bold uppercase">{row.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              'rounded-md px-2 py-0.5 text-[8px] font-bold uppercase',
                              row.complianceStatus?.toLowerCase().includes('compliant')
                                ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                                : 'border-blue-100 bg-blue-50 text-blue-600',
                            )}
                          >
                            {row.complianceStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {plots.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-[10px] font-bold uppercase text-gray-400">
                          No rows for this selection
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EmptyReportState
            title="Generate Farm Analysis"
            description="Filter by farmer, farm, optional crop, and dates, then generate."
            icon="file"
          />
        )}
      </div>
    </ReportLayout>
  )
}
