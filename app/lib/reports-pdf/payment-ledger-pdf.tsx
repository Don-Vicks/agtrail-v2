import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import type { GetReportsCooperativeFinancialSummary200DataRecentTransactionsDataItem } from '~/lib/api/generated/models/getReportsCooperativeFinancialSummary200DataRecentTransactionsDataItem'
import type { GetReportsFarmerFinancialSummary200DataRecentTransactionsDataItem } from '~/lib/api/generated/models/getReportsFarmerFinancialSummary200DataRecentTransactionsDataItem'
import {
  PDF_ROW_CAP,
  PdfFootnote,
  PdfMetaBlock,
  PdfSectionTitle,
  PdfTableHeader,
  PdfTableRow,
  pdfStyles,
  sliceWithNote,
} from '~/lib/reports-pdf/shared'

export type PaymentLedgerTxn =
  | GetReportsFarmerFinancialSummary200DataRecentTransactionsDataItem
  | GetReportsCooperativeFinancialSummary200DataRecentTransactionsDataItem

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
  const slice = sliceWithNote(ledgerRows, PDF_ROW_CAP)

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

        <PdfSectionTitle>Ledger rows</PdfSectionTitle>
        {slice.rows.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No transactions for this filter.</Text>
        ) : (
          <>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '22%' }]}>Batch</Text>
              <Text style={[pdfStyles.th, { width: '18%' }]}>Crop</Text>
              <Text style={[pdfStyles.th, { width: '18%' }]}>Harvest kg</Text>
              <Text style={[pdfStyles.th, { width: '15%' }]}>Purch.</Text>
              <Text style={[pdfStyles.th, { width: '15%' }]}>Type</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Date</Text>
            </PdfTableHeader>
            {slice.rows.map((t, i) => {
              const inbound = t.quantityPurchased > 0
              return (
                <PdfTableRow key={i}>
                  <Text style={[pdfStyles.td, { width: '22%' }]}>#{t.batchId.slice(0, 10)}</Text>
                  <Text style={[pdfStyles.td, { width: '18%' }]}>{t.crop}</Text>
                  <Text style={[pdfStyles.td, { width: '18%' }]}>{t.quantityHarvestedKg.toLocaleString()}</Text>
                  <Text style={[pdfStyles.td, { width: '15%' }]}>{t.quantityPurchased.toLocaleString()}</Text>
                  <Text style={[pdfStyles.tdMuted, { width: '15%' }]}>{inbound ? 'Purchased' : 'No purchase qty'}</Text>
                  <Text style={[pdfStyles.tdMuted, { width: '12%' }]}>
                    {t.date ? format(new Date(t.date), 'MMM d, yyyy') : '—'}
                  </Text>
                </PdfTableRow>
              )
            })}
            {slice.omitted > 0 ? (
              <PdfFootnote>Showing first {slice.rows.length} of {ledgerRows.length} rows.</PdfFootnote>
            ) : null}
          </>
        )}
      </Page>
    </Document>
  )
}
