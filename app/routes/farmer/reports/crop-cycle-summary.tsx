import React, { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { format, parseISO, subDays } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { SimpleAreaChart } from '~/components/charts/simple-area-chart'
import { EmptyReportState } from '~/components/empty-report-state'
import type { GetReportsFarmerCropCycleSummaryParams } from '~/lib/api/generated/models/getReportsFarmerCropCycleSummaryParams'
import type { CropCycle } from '~/lib/api/generated/models/cropCycle'
import {
  getGetFarmsIdCropCyclesQueryKey,
  useGetFarmsIdCropCycles,
} from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import { getGetFarmsQueryKey } from '~/lib/api/generated/farms/farms'
import { extractDataArray } from '~/lib/field-agent-utils'
import { useReportFarmOptions } from '~/lib/use-report-farm-options'
import { useGetReportsFarmerCropCycleSummary } from '~/lib/api/generated/reports-farmer/reports-farmer'
import type { FarmerCropCycleReportParams } from '~/lib/reports-query-params'
import { downloadClientPdf } from '~/lib/reports-pdf/download-client-pdf'
import { CropCyclePdfDocument } from '~/lib/reports-pdf/crop-cycle-pdf'

function defaultDateRange() {
  const end = new Date()
  const start = subDays(end, 90)
  return { startDate: format(start, 'yyyy-MM-dd'), endDate: format(end, 'yyyy-MM-dd') }
}

export default function CropCycleSummaryPage() {
  const queryClient = useQueryClient()
  const { farmOptions, isLoadingFarms } = useReportFarmOptions()
  const defaults = useMemo(() => defaultDateRange(), [])
  const [selectedFarmId, setSelectedFarmId] = useState('')
  const [selectedCropCycleId, setSelectedCropCycleId] = useState('')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [startDate, setStartDate] = useState(defaults.startDate)
  const [endDate, setEndDate] = useState(defaults.endDate)
  const [pdfLoading, setPdfLoading] = useState(false)

  const { data: cropCyclesRes, isLoading: isLoadingCycles } = useGetFarmsIdCropCycles(selectedFarmId, {
    query: { enabled: Boolean(selectedFarmId) },
  })

  const cropCycles = useMemo(
    () => extractDataArray<CropCycle>(cropCyclesRes?.data),
    [cropCyclesRes?.data],
  )

  const reportQueryParams = useMemo((): FarmerCropCycleReportParams => {
    const base: FarmerCropCycleReportParams = {
      farmId: selectedFarmId || undefined,
      crop: selectedCrop || undefined,
      startDate,
      endDate,
      page: 1,
      limit: 100,
    }
    if (selectedCropCycleId) {
      base.cropCycleId = selectedCropCycleId
    }
    return base
  }, [selectedFarmId, selectedCrop, selectedCropCycleId, startDate, endDate])

  const { data: reportResponse, isLoading, isFetching, isError, error, refetch } =
    useGetReportsFarmerCropCycleSummary(
      reportQueryParams as GetReportsFarmerCropCycleSummaryParams,
      { query: { enabled: true } },
    )

  const reportData = reportResponse?.data?.data
  const filterOptions = reportData?.filterOptions

  const cropNameOptions = useMemo(() => {
    const fromReport = filterOptions?.crops ?? []
    const fromCycles = cropCycles.map((c) => c.productName).filter(Boolean) as string[]
    const merged = [...new Set([...fromReport, ...fromCycles])]
    merged.sort((a, b) => a.localeCompare(b))
    return merged.map((c) => ({ label: c, value: c }))
  }, [filterOptions?.crops, cropCycles])

  const handleFarmChange = (farmId: string) => {
    setSelectedFarmId(farmId)
    setSelectedCropCycleId('')
    setSelectedCrop('')
  }

  const handleCropCycleChange = (cycleId: string) => {
    setSelectedCropCycleId(cycleId)
    if (!cycleId) return
    const c = cropCycles.find((x) => x.id === cycleId)
    if (!c) return
    setSelectedCrop(c.productName)
    setStartDate(format(parseISO(c.plantingDate), 'yyyy-MM-dd'))
    const endSrc = c.expectedHarvestDate ?? c.actualHarvestDate
    if (endSrc) {
      try {
        setEndDate(format(parseISO(endSrc), 'yyyy-MM-dd'))
      } catch {
        // ignore invalid date
      }
    }
  }

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: getGetFarmsQueryKey() })
    if (selectedFarmId) {
      void queryClient.invalidateQueries({ queryKey: getGetFarmsIdCropCyclesQueryKey(selectedFarmId) })
    }
    void queryClient.invalidateQueries({ queryKey: ['/reports/farmer/crop-cycle-summary'] })
    void refetch()
  }

  const activityChartData = useMemo(() => {
    if (!reportData?.activityDistribution) return []
    return reportData.activityDistribution.map((item) => ({
      label: format(new Date(item.date), 'MMM d'),
      value: item.count,
    }))
  }, [reportData?.activityDistribution])

  const cycleOptions = useMemo(
    () =>
      cropCycles.map((c) => ({
        label: `${c.productName} · ${format(parseISO(c.plantingDate), 'MMM yyyy')}`,
        value: c.id,
      })),
    [cropCycles],
  )

  const farmLabel = useMemo(() => {
    if (!selectedFarmId) return 'Not specified'
    return farmOptions.find((o) => o.value === selectedFarmId)?.label ?? selectedFarmId
  }, [farmOptions, selectedFarmId])

  const cycleLabel = useMemo(() => {
    if (!selectedCropCycleId) return 'All / none selected'
    return cycleOptions.find((o) => o.value === selectedCropCycleId)?.label ?? selectedCropCycleId
  }, [cycleOptions, selectedCropCycleId])

  const handleDownloadPdf = useCallback(async () => {
    if (!reportData?.kpis) return
    setPdfLoading(true)
    try {
      await downloadClientPdf(
        <CropCyclePdfDocument
          title="Crop cycle summary"
          scopeLabel="Farmer"
          metaLines={[
            `Farm: ${farmLabel}`,
            `Crop cycle: ${cycleLabel}`,
            `Crop name filter: ${selectedCrop || '—'}`,
            `Date range: ${startDate} → ${endDate}`,
          ]}
          data={reportData}
        />,
        'agtrail-farmer-crop-cycle-summary',
      )
    } finally {
      setPdfLoading(false)
    }
  }, [reportData, farmLabel, cycleLabel, selectedCrop, startDate, endDate])

  const initialLoading = isLoading && !reportData
  const updating = isFetching && Boolean(reportData)

  return (
    <ReportLayout
      title="Crop Cycle Summary"
      subtitle="Filters (farm, crop cycle, crop, dates) are sent with every request; crop cycle loads from your farms API."
      breadcrumb={[
        { label: 'Reports & Analytics', href: '/farmer/reports' },
        { label: 'Crop Cycle Summary' },
      ]}
      onDownloadPdf={reportData?.kpis ? handleDownloadPdf : undefined}
      downloadPdfDisabled={!reportData?.kpis}
      downloadPdfLoading={pdfLoading}
    >
      <div className="space-y-6">
        <ReportFilter
          isGenerating={isFetching}
          onGenerate={handleRefresh}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          filters={[
            {
              label: 'Select Farm',
              placeholder: 'Choose a Farm',
              options: farmOptions,
              value: selectedFarmId,
              onChange: handleFarmChange,
              isLoading: isLoadingFarms,
            },
            {
              label: 'Crop cycle',
              placeholder: selectedFarmId ? 'Choose a cycle (optional)' : 'Select a farm first',
              options: cycleOptions,
              value: selectedCropCycleId,
              onChange: handleCropCycleChange,
              isLoading: isLoadingCycles,
            },
            {
              label: 'Crop (name)',
              placeholder: 'Filter by crop name',
              options: cropNameOptions,
              value: selectedCrop,
              onChange: setSelectedCrop,
              isLoading: Boolean(selectedFarmId) && isLoadingCycles && cropNameOptions.length === 0,
            },
          ]}
        />

        {updating ? (
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Updating report…
          </p>
        ) : null}

        {initialLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-gray-100 bg-white py-20">
            <div className="relative">
              <div className="size-16 animate-spin rounded-full border-4 border-gray-50 border-t-brand" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-5 text-brand" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold uppercase tracking-tight text-gray-900">Compiling Intelligence</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Fetching farm activities...
              </p>
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-md border border-red-100 bg-red-50/50 p-6 text-center text-sm text-red-800">
            {(error as unknown) instanceof Error ? (error as unknown as Error).message : 'Could not load report.'}
          </div>
        ) : reportData?.kpis ? (
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
                  Frequency of logs over the cycle
                </p>
              </div>
              <div className="flex h-[180px] items-end">
                {activityChartData.length > 1 ? (
                  <SimpleAreaChart data={activityChartData} height={180} />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-gray-100 bg-gray-50/50 text-[10px] font-bold uppercase text-gray-400">
                    <div className="h-1 w-20 rounded-full bg-gray-200" />
                    Insufficient data for intensity visualization
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">Comprehensive Log History</h3>
                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Chronological record of all farm operations
                </p>
              </div>

              {reportData.activityTimeline.length > 0 ? (
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gray-100">
                  {reportData.activityTimeline.map((item, i) => (
                    <div key={item.id || i} className="relative pl-12">
                      <div className="absolute left-0 z-10 mt-1 flex size-10 items-center justify-center rounded-full border-4 border-white bg-brand/10 shadow-sm">
                        <div className="size-3 rounded-full bg-brand" />
                      </div>

                      <div className="group rounded-md border border-gray-100 bg-gray-50/30 p-5 transition-all hover:bg-white hover:shadow-md">
                        <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row">
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-tight text-gray-900">{item.type}</h4>
                            <div className="mt-0.5 flex items-center gap-2">
                              <div className="flex size-4 items-center justify-center rounded-full bg-brand/10 text-[7px] font-bold text-brand">
                                LOG
                              </div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                Category: {item.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-4 rounded-md border border-gray-50 bg-white p-2.5 shadow-sm">
                            <div className="text-right">
                              <p className="mb-0.5 text-[8px] font-bold uppercase tracking-widest text-gray-300">
                                Execution Date
                              </p>
                              <p className="text-[10px] font-bold uppercase text-gray-900">
                                {format(new Date(item.date), 'do MMM yyyy')}
                              </p>
                            </div>
                            {item.time ? (
                              <div className="border-l border-gray-50 pl-4 text-right">
                                <p className="mb-0.5 text-[8px] font-bold uppercase tracking-widest text-gray-300">
                                  Time Logged
                                </p>
                                <p className="text-[10px] font-bold text-gray-900">{item.time}</p>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {item.description ? (
                          <div className="mb-4 rounded-md border border-gray-50 bg-white/50 p-3">
                            <p className="text-[11px] italic leading-relaxed text-gray-600">&quot;{item.description}&quot;</p>
                          </div>
                        ) : null}

                        <div className="border-t border-gray-100 pt-4">
                          <p className="mb-3 flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-widest text-gray-900">
                            <span className="size-1.5 rounded-full bg-brand" />
                            Operation Parameters
                          </p>
                          <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                            {item.cost != null ? (
                              <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-tight text-gray-400">
                                  Operation Cost
                                </span>
                                <span className="text-[9px] font-bold uppercase text-gray-900">
                                  {Number(item.cost).toLocaleString()} {item.currency || '₦'}
                                </span>
                              </div>
                            ) : null}
                            {item.equipmentUsed && item.equipmentUsed.length > 0 ? (
                              <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-tight text-gray-400">
                                  Equipment
                                </span>
                                <span className="text-[9px] font-bold uppercase text-gray-900">
                                  {item.equipmentUsed.join(', ')}
                                </span>
                              </div>
                            ) : null}
                            {item.certificationNotes ? (
                              <div className="col-span-full mt-2 rounded border border-blue-100/50 bg-blue-50/50 p-2">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-blue-400">
                                  Certification Info
                                </p>
                                <p className="text-[10px] font-medium text-blue-700">{item.certificationNotes}</p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border-2 border-dashed border-gray-100 bg-gray-50/20 py-20 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    No detailed operations found
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyReportState
            title="Crop Cycle Summary"
            description="Pick a farm (and optionally a crop cycle or crop name and dates). Query parameters are sent on each change; use Refresh to force reload."
            icon="file"
          />
        )}
      </div>
    </ReportLayout>
  )
}
