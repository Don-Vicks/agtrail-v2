import React, { useCallback, useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'
import { Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { ReportLayout } from '~/components/layout/report-layout'
import { ReportFilter } from '~/components/report-filter'
import { TrendStatCard } from '~/components/trend-stat-card'
import { EmptyReportState } from '~/components/empty-report-state'
import { Badge } from '~/components/ui/badge'
import type { GetReportsCooperativeFinancialSummaryParams } from '~/lib/api/generated/models/getReportsCooperativeFinancialSummaryParams'
import { useGetReportsCooperativeFinancialSummary } from '~/lib/api/generated/reports-cooperative/reports-cooperative'
import {
  cooperativeReportsQueryEnabled,
  MissingCooperativeOrgBanner,
} from './report-org-context'
import { downloadClientPdf } from '~/lib/reports-pdf/download-client-pdf'
import { PaymentLedgerPdfDocument } from '~/lib/reports-pdf/payment-ledger-pdf'

function defaultDateRange() {
  const end = new Date()
  const start = subDays(end, 90)
  return { startDate: format(start, 'yyyy-MM-dd'), endDate: format(end, 'yyyy-MM-dd') }
}

export default function CooperativePaymentHistoryPage() {
  const defaults = useMemo(() => defaultDateRange(), [])
  const [selectedFarmerId, setSelectedFarmerId] = useState('')
  const [startDate, setStartDate] = useState(defaults.startDate)
  const [endDate, setEndDate] = useState(defaults.endDate)
  const [txnFilter, setTxnFilter] = useState<'all' | 'inbound' | 'outbound'>('all')
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

  const rows = reportData?.recentTransactions?.data ?? []
  const filteredRows = useMemo(() => {
    if (txnFilter === 'all') return rows
    if (txnFilter === 'inbound') return rows.filter((t) => t.quantityPurchased > 0)
    return rows.filter((t) => t.quantityPurchased <= 0)
  }, [rows, txnFilter])

  const totalPurchased = useMemo(
    () => rows.reduce((acc, t) => acc + Number(t.quantityPurchased || 0), 0),
    [rows],
  )

  const txnFilterLabel =
    txnFilter === 'all' ? 'All' : txnFilter === 'inbound' ? 'Inbound (purchased)' : 'Outbound / unsettled'

  const farmerLabel = useMemo(() => {
    if (!selectedFarmerId) return 'All farmers'
    return farmerOptions.find((o) => o.value === selectedFarmerId)?.label ?? selectedFarmerId
  }, [farmerOptions, selectedFarmerId])

  const handleDownloadPdf = useCallback(async () => {
    if (!reportData || !applied) return
    setPdfLoading(true)
    try {
      await downloadClientPdf(
        <PaymentLedgerPdfDocument
          title="Payment history & ledger"
          scopeLabel="Cooperative"
          metaLines={[
            `Farmer filter: ${farmerLabel}`,
            `Date range: ${applied.startDate ?? '—'} → ${applied.endDate ?? '—'}`,
          ]}
          kpis={{
            totalRevenue: reportData.kpis.totalRevenue,
            netProfit: reportData.kpis.netProfit,
          }}
          ledgerRows={filteredRows}
          totalPurchasedQty={totalPurchased}
          txnFilterLabel={txnFilterLabel}
        />,
        'agtrail-cooperative-payment-ledger',
      )
    } finally {
      setPdfLoading(false)
    }
  }, [reportData, applied, farmerLabel, filteredRows, totalPurchased, txnFilterLabel])

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
      label: 'Transaction Type',
      placeholder: 'All',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Inbound (purchased)', value: 'inbound' },
        { label: 'Outbound / unsettled', value: 'outbound' },
      ],
      value: txnFilter,
      onChange: (v: string) => setTxnFilter(v as 'all' | 'inbound' | 'outbound'),
    },
  ]

  return (
    <ReportLayout
      title="Payment History & Ledger"
      subtitle="Recent purchase-linked rows (cooperative scope)"
      breadcrumb={[
        { label: 'Dashboard', href: '/cooperative' },
        { label: 'Reports & Analytics', href: '/cooperative/reports' },
        { label: 'Payment History' },
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
                title="Total revenue (period)"
                value={`${reportData.kpis.totalRevenue.currency ?? '₦'}${reportData.kpis.totalRevenue.value.toLocaleString()}`}
                trend={{
                  value: `${reportData.kpis.totalRevenue.trend >= 0 ? '+' : ''}${reportData.kpis.totalRevenue.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.totalRevenue.trend >= 0,
                }}
                description="Financial summary"
                trendLabel="Vs prior period"
              />
              <TrendStatCard
                title="Purchased quantity (sample)"
                value={totalPurchased.toLocaleString()}
                trend={{ value: 'Report', isUp: true }}
                description="Sum of quantityPurchased"
                trendLabel="Recent transactions"
              />
              <TrendStatCard
                title="Net profit (period)"
                value={`${reportData.kpis.netProfit.currency ?? '₦'}${reportData.kpis.netProfit.value.toLocaleString()}`}
                trend={{
                  value: `${reportData.kpis.netProfit.trend >= 0 ? '+' : ''}${reportData.kpis.netProfit.trend.toFixed(1)}%`,
                  isUp: reportData.kpis.netProfit.trend >= 0,
                }}
                description="Same window as table"
                trendLabel="Vs prior period"
              />
            </div>

            <div className="overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-50 p-5">
                <h3 className="text-base font-bold text-gray-900">Ledger (recent)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Reference</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Crop</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Harvested (kg)</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Purchased</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Type</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-[10px] font-bold uppercase text-gray-400">
                          No rows
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((t, i) => {
                        const inbound = t.quantityPurchased > 0
                        return (
                          <tr key={`${t.batchId}-${i}`}>
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-2">
                                {inbound ? (
                                  <ArrowDownCircle className="size-4 text-emerald-600" />
                                ) : (
                                  <ArrowUpCircle className="size-4 text-slate-500" />
                                )}
                                <span className="text-[11px] font-bold uppercase">#{t.batchId.slice(0, 12)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3 font-bold">{t.crop}</td>
                            <td className="px-6 py-3 font-bold">{t.quantityHarvestedKg.toLocaleString()}</td>
                            <td className="px-6 py-3 font-bold">{t.quantityPurchased.toLocaleString()}</td>
                            <td className="px-6 py-3">
                              <Badge className={inbound ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}>
                                {inbound ? 'Purchased' : 'No purchase qty'}
                              </Badge>
                            </td>
                            <td className="px-6 py-3 text-[10px] font-bold uppercase text-gray-400">
                              {t.date ? format(new Date(t.date), 'MMM d, yyyy HH:mm') : '—'}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <EmptyReportState
            title="Payment ledger"
            description="Optionally pick a farmer, set dates, then generate."
            icon="file"
          />
        )}
      </div>
    </ReportLayout>
  )
}
