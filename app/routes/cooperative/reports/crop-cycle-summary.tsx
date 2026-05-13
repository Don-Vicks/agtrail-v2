import React, { useCallback, useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { SimpleAreaChart } from '~/components/charts/simple-area-chart'
import { EmptyReportState } from '~/components/empty-report-state'
import type { GetReportsCooperativeCropCycleSummaryParams } from '~/lib/api/generated/models/getReportsCooperativeCropCycleSummaryParams'
import { useGetReportsCooperativeCropCycleSummary } from '~/lib/api/generated/reports-cooperative/reports-cooperative'
import { useReportFarmOptions } from '~/lib/use-report-farm-options'
import {
  cooperativeReportsQueryEnabled,
  MissingCooperativeOrgBanner,
} from './report-org-context'
import { downloadClientPdf } from '~/lib/reports-pdf/download-client-pdf'
import { CropCyclePdfDocument } from '~/lib/reports-pdf/crop-cycle-pdf'

function defaultDateRange() {
  const end = new Date()
  const start = subDays(end, 90)
  return { startDate: format(start, 'yyyy-MM-dd'), endDate: format(end, 'yyyy-MM-dd') }
}

export default function CooperativeCropCycleSummaryPage() {
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
  const [applied, setApplied] = useState<GetReportsCooperativeCropCycleSummaryParams | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  const queryParams = applied ?? {}
  const { data: reportResponse, isLoading, isFetching, isError, error } =
    useGetReportsCooperativeCropCycleSummary(queryParams, { query: { enabled: coopEnabled } })

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
        <CropCyclePdfDocument
          title="Crop cycle summary"
          scopeLabel="Cooperative"
          metaLines={[
            `Farmer: ${farmerLabel}`,
            `Farm: ${farmLabel}`,
            `Crop filter: ${selectedCrop || '—'}`,
            `Date range: ${applied.startDate ?? '—'} → ${applied.endDate ?? '—'}`,
          ]}
          data={reportData}
        />,
        'agtrail-cooperative-crop-cycle-summary',
      )
    } finally {
      setPdfLoading(false)
    }
  }, [reportData, applied, farmerLabel, farmLabel, selectedCrop])

  const activityChartData = useMemo(() => {
    if (!reportData?.activityDistribution) return []
    return reportData.activityDistribution.map((item) => ({
      label: format(new Date(item.date), 'MMM d'),
      value: item.count,
    }))
  }, [reportData?.activityDistribution])

  const isBusy = isLoading || (isFetching && applied !== null)

  const filterRow = [
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
      label: 'Select Farm',
      placeholder: 'Choose a Farm',
      options: farmOptions,
      value: selectedFarmId,
      onChange: setSelectedFarmId,
      isLoading: isLoadingFarms,
    },
    {
      label: 'Select Crop',
      placeholder: 'Choose a Crop',
      options: filterOptions?.crops.map((c) => ({ label: c, value: c })) || [],
      value: selectedCrop,
      onChange: setSelectedCrop,
      isLoading: isLoading && !filterOptions,
    },
  ]

  return (
    <ReportLayout
      title="Crop Cycle Summary"
      subtitle="Cooperative-wide crop cycle activity and performance"
      breadcrumb={[
        { label: 'Dashboard', href: '/cooperative' },
        { label: 'Reports & Analytics', href: '/cooperative/reports' },
        { label: 'Crop Cycle Summary' },
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
          filters={filterRow}
        />

        {isBusy && applied ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-gray-100 bg-white py-20">
            <div className="relative">
              <div className="size-16 animate-spin rounded-full border-4 border-gray-50 border-t-brand" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-5 text-brand" />
              </div>
            </div>
            <p className="text-center text-lg font-bold uppercase tracking-tight text-gray-900">Compiling Intelligence</p>
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
                description="Expected total harvest"
                trendLabel="Vs prior period"
              />
              <TrendStatCard
                title="Sustainability"
                value={`${reportData.kpis.sustainabilityScore.value}${reportData.kpis.sustainabilityScore.unit ?? '%'}`}
                trend={{
                  value: `${reportData.kpis.sustainabilityScore.trend >= 0 ? '+' : ''}${reportData.kpis.sustainabilityScore.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.sustainabilityScore.trend >= 0,
                }}
                description="Environmental impact score"
                trendLabel="Vs prior period"
              />
            </div>

            <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">Operational Intensity</h3>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Frequency of logs over the range
                </p>
              </div>
              <div className="flex h-[180px] items-end">
                {activityChartData.length > 1 ? (
                  <SimpleAreaChart data={activityChartData} height={180} />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-100 bg-gray-50/50 text-[10px] font-bold uppercase text-gray-400">
                    Insufficient data for intensity visualization
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">Activity timeline</h3>
              </div>
              {reportData.activityTimeline.length > 0 ? (
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gray-100">
                  {reportData.activityTimeline.map((item, i) => (
                    <div key={item.id || i} className="relative pl-12">
                      <div className="absolute left-0 z-10 mt-1 flex size-10 items-center justify-center rounded-full border-4 border-white bg-brand/10 shadow-sm">
                        <div className="size-3 rounded-full bg-brand" />
                      </div>
                      <div className="rounded-md border border-gray-100 bg-gray-50/30 p-5">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-tight text-gray-900">{item.type}</h4>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                              {item.category}
                            </p>
                          </div>
                          <p className="text-[10px] font-bold uppercase text-gray-600">
                            {format(new Date(item.date), 'do MMM yyyy')}
                          </p>
                        </div>
                        {item.description ? (
                          <p className="mt-2 text-[11px] text-gray-600">{item.description}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-[10px] font-bold uppercase text-gray-400">
                  No operations in range
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyReportState
            title="Generate Crop Cycle Summary"
            description="Optionally narrow by farmer, farm, and crop, set dates, then generate."
            icon="file"
          />
        )}
      </div>
    </ReportLayout>
  )
}
