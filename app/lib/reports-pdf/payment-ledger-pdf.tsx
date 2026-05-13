import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import type { GetReportsCooperativeFinancialSummary200DataRecentTransactionsDataItem } from '~/lib/api/generated/models/getReportsCooperativeFinancialSummary200DataRecentTransactionsDataItem'
import type { GetReportsFarmerFinancialSummary200DataRecentTransactionsDataItem } from '~/lib/api/generated/models/getReportsFarmerFinancialSummary200DataRecentTransactionsDataItem'
import {
  PdfMetaBlock,
  PdfSectionTitle,
  PdfTableHeader,
  PdfTableRow,
  PDF_TABLE_ROWS_PER_PAGE,
  chunkArray,
  pdfStyles,
} from '~/lib/reports-pdf/shared'

export type PaymentLedgerTxn =
  | GetReportsFarmerFinancialSummary200DataRecentTransactionsDataItem
  | GetReportsCooperativeFinancialSummary200DataRecentTransactionsDataItem

function formatTxnDate(iso: string | null): string {
  if (!iso) return '—'
  try {
    return format(new Date(iso), 'MMM d, yyyy HH:mm')
  } catch {
    return iso
  }
}

/** KPI snapshot + ledger rows (typically filtered to match the UI). */
export function PaymentLedgerPdfDocument({
  title,
  scopeLabel,
  metaLines,
  kpis,
  ledgerRows,
  totalPurchasedQty,
  txnFilterLabel,
}: {
  title: string
  scopeLabel: string
  metaLines: string[]
  kpis: {
    totalRevenue: { value: number; currency?: string; trend: number }
    netProfit: { value: number; currency?: string; trend: number }
  }
  ledgerRows: PaymentLedgerTxn[]
  totalPurchasedQty: number
  txnFilterLabel: string
}) {
  const generatedAt = format(new Date(), "MMM d, yyyy 'at' HH:mm")
  const chunks = chunkArray(ledgerRows, PDF_TABLE_ROWS_PER_PAGE)

  return (
    <Document title={title} author="AgTrail">
      <Page size="A4" style={pdfStyles.page}>
        <PdfMetaBlock
          title={title}
          scope={scopeLabel}
          lines={[...metaLines, `Transaction filter: ${txnFilterLabel}`]}
          generatedAtLabel={`Generated ${generatedAt}`}
        />

        <View style={pdfStyles.kpiRow}>
          <View style={pdfStyles.kpiBox}>
            <Text style={pdfStyles.kpiLabel}>Total revenue (period)</Text>
            <Text style={pdfStyles.kpiValue}>
              {kpis.totalRevenue.currency ?? '₦'}
              {kpis.totalRevenue.value.toLocaleString()}
            </Text>
            <Text style={pdfStyles.kpiTrend}>
              Trend {kpis.totalRevenue.trend >= 0 ? '+' : ''}
              {kpis.totalRevenue.trend.toFixed(1)}%
            </Text>
          </View>
          <View style={pdfStyles.kpiBox}>
            <Text style={pdfStyles.kpiLabel}>Purchased qty (sum)</Text>
            <Text style={pdfStyles.kpiValue}>{totalPurchasedQty.toLocaleString()}</Text>
            <Text style={pdfStyles.kpiTrend}>Across loaded rows</Text>
          </View>
          <View style={pdfStyles.kpiBox}>
            <Text style={pdfStyles.kpiLabel}>Net profit (period)</Text>
            <Text style={pdfStyles.kpiValue}>
              {kpis.netProfit.currency ?? '₦'}
              {kpis.netProfit.value.toLocaleString()}
            </Text>
            <Text style={pdfStyles.kpiTrend}>
              Trend {kpis.netProfit.trend >= 0 ? '+' : ''}
              {kpis.netProfit.trend.toFixed(1)}%
            </Text>
          </View>
        </View>
      </Page>

      {chunks.length === 0 ? (
        <Page key="ledger-empty" size="A4" style={pdfStyles.page}>
          <PdfSectionTitle>Ledger rows</PdfSectionTitle>
          <Text style={pdfStyles.tdMuted}>No transactions for this filter.</Text>
        </Page>
      ) : (
        chunks.map((chunk, pageIdx) => (
          <Page key={`ledger-${pageIdx}`} size="A4" style={pdfStyles.page}>
            <PdfSectionTitle>
              Ledger rows{pageIdx > 0 ? ` (continued ${pageIdx + 1}/${chunks.length})` : ''}
            </PdfSectionTitle>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Batch</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Crop</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Exp. kg</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Harvest kg</Text>
              <Text style={[pdfStyles.th, { width: '10%' }]}>Purch.</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Type</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Date</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Compliance</Text>
            </PdfTableHeader>
            {chunk.map((t, i) => {
              const inbound = t.quantityPurchased > 0
              return (
                <PdfTableRow key={i}>
                  <Text style={[pdfStyles.td, { width: '14%' }]}>#{t.batchId.slice(0, 12)}</Text>
                  <Text style={[pdfStyles.td, { width: '12%' }]}>{t.crop}</Text>
                  <Text style={[pdfStyles.td, { width: '12%' }]}>{t.expectedYieldKg.toLocaleString()}</Text>
                  <Text style={[pdfStyles.td, { width: '12%' }]}>{t.quantityHarvestedKg.toLocaleString()}</Text>
                  <Text style={[pdfStyles.td, { width: '10%' }]}>{t.quantityPurchased.toLocaleString()}</Text>
                  <Text style={[pdfStyles.tdMuted, { width: '14%' }]}>{inbound ? 'Purchased' : 'No purchase qty'}</Text>
                  <Text style={[pdfStyles.tdMuted, { width: '14%' }]}>{formatTxnDate(t.date)}</Text>
                  <Text style={[pdfStyles.tdMuted, { width: '12%' }]}>{t.complianceStatus}</Text>
                </PdfTableRow>
              )
            })}
          </Page>
        ))
      )}
    </Document>
  )
}
