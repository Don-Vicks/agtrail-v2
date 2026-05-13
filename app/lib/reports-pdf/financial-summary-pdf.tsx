import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import type { GetReportsCooperativeFinancialSummary200Data } from '~/lib/api/generated/models/getReportsCooperativeFinancialSummary200Data'
import type { GetReportsFarmerFinancialSummary200Data } from '~/lib/api/generated/models/getReportsFarmerFinancialSummary200Data'
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

export type FinancialSummaryPdfData =
  | GetReportsFarmerFinancialSummary200Data
  | GetReportsCooperativeFinancialSummary200Data

function money(currency: string | undefined, value: number) {
  return `${currency ?? '₦'}${value.toLocaleString()}`
}

export function FinancialSummaryPdfDocument({
  title,
  scopeLabel,
  metaLines,
  data,
}: {
  title: string
  scopeLabel: string
  metaLines: string[]
  data: FinancialSummaryPdfData
}) {
  const generatedAt = format(new Date(), "MMM d, yyyy 'at' HH:mm")
  const trend = data.revenueCostsTrend ?? []
  const trendSlice = sliceWithNote(trend, PDF_ROW_CAP)
  const costRows = data.costBreakdown ?? []
  const marginRows = data.cropSalesDetail ?? []
  const cropDetailSlice = sliceWithNote(data.cropSalesDetail ?? [], PDF_ROW_CAP)
  const txSlice = sliceWithNote(data.recentTransactions?.data ?? [], PDF_ROW_CAP)
  const maxMargin = Math.max(1, ...marginRows.map((r) => Math.abs(r.marginPct) || 0))

  return (
    <Document title={title} author="AgTrail">
      <Page size="A4" style={pdfStyles.page}>
        <PdfMetaBlock
          title={title}
          scope={scopeLabel}
          lines={metaLines}
          generatedAtLabel={`Generated ${generatedAt}`}
        />

        <View style={pdfStyles.kpiRow}>
          <View style={pdfStyles.kpiBox}>
            <Text style={pdfStyles.kpiLabel}>Total revenue</Text>
            <Text style={pdfStyles.kpiValue}>
              {money(data.kpis.totalRevenue.currency, data.kpis.totalRevenue.value)}
            </Text>
            <Text style={pdfStyles.kpiTrend}>
              Trend {data.kpis.totalRevenue.trend >= 0 ? '+' : ''}
              {data.kpis.totalRevenue.trend.toFixed(1)}% vs prior
            </Text>
          </View>
          <View style={pdfStyles.kpiBox}>
            <Text style={pdfStyles.kpiLabel}>Total costs</Text>
            <Text style={pdfStyles.kpiValue}>
              {money(data.kpis.totalCosts.currency, data.kpis.totalCosts.value)}
            </Text>
            <Text style={pdfStyles.kpiTrend}>
              Trend {data.kpis.totalCosts.trend >= 0 ? '+' : ''}
              {data.kpis.totalCosts.trend.toFixed(1)}% vs prior
            </Text>
          </View>
          <View style={pdfStyles.kpiBox}>
            <Text style={pdfStyles.kpiLabel}>Net profit</Text>
            <Text style={pdfStyles.kpiValue}>
              {money(data.kpis.netProfit.currency, data.kpis.netProfit.value)}
            </Text>
            <Text style={pdfStyles.kpiTrend}>
              Trend {data.kpis.netProfit.trend >= 0 ? '+' : ''}
              {data.kpis.netProfit.trend.toFixed(1)}% vs prior
            </Text>
          </View>
        </View>

        <PdfSectionTitle>Daily profit (ledger trend)</PdfSectionTitle>
        {trendSlice.rows.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No trend rows for this range.</Text>
        ) : (
          <>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '28%' }]}>Date</Text>
              <Text style={[pdfStyles.th, { width: '72%' }]}>Net profit</Text>
            </PdfTableHeader>
            {trendSlice.rows.map((row, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '28%' }]}>{format(new Date(row.date), 'MMM d, yyyy')}</Text>
                <Text style={[pdfStyles.td, { width: '72%' }]}>{row.profit.toLocaleString()}</Text>
              </PdfTableRow>
            ))}
            {trendSlice.omitted > 0 ? (
              <PdfFootnote>Showing first {trendSlice.rows.length} of {trend.length} days.</PdfFootnote>
            ) : null}
          </>
        )}

        <PdfSectionTitle>Cost breakdown</PdfSectionTitle>
        {costRows.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No cost categories.</Text>
        ) : (
          <>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '55%' }]}>Category</Text>
              <Text style={[pdfStyles.th, { width: '45%' }]}>Amount</Text>
            </PdfTableHeader>
            {costRows.map((c, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '55%' }]}>{c.category}</Text>
                <Text style={[pdfStyles.td, { width: '45%' }]}>{c.amount.toLocaleString()}</Text>
              </PdfTableRow>
            ))}
          </>
        )}

        <PdfSectionTitle>Margin by crop</PdfSectionTitle>
        {marginRows.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No crop-level detail.</Text>
        ) : (
          marginRows.map((c, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={pdfStyles.td}>{c.crop}</Text>
                <Text style={pdfStyles.td}>{c.marginPct.toFixed(1)}%</Text>
              </View>
              <View style={pdfStyles.barTrack}>
                <View style={[pdfStyles.barFill, { width: `${(Math.abs(c.marginPct) / maxMargin) * 100}%` }]} />
              </View>
            </View>
          ))
        )}
      </Page>

      <Page size="A4" style={pdfStyles.page}>
        <PdfSectionTitle>Crop sales detail</PdfSectionTitle>
        {cropDetailSlice.rows.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No crop sales rows.</Text>
        ) : (
          <>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '22%' }]}>Crop</Text>
              <Text style={[pdfStyles.th, { width: '20%' }]}>Revenue</Text>
              <Text style={[pdfStyles.th, { width: '20%' }]}>Costs</Text>
              <Text style={[pdfStyles.th, { width: '20%' }]}>Profit</Text>
              <Text style={[pdfStyles.th, { width: '18%' }]}>Margin</Text>
            </PdfTableHeader>
            {cropDetailSlice.rows.map((c, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '22%' }]}>{c.crop}</Text>
                <Text style={[pdfStyles.td, { width: '20%' }]}>
                  {c.currency}
                  {c.revenue.toLocaleString()}
                </Text>
                <Text style={[pdfStyles.td, { width: '20%' }]}>
                  {c.currency}
                  {c.costs.toLocaleString()}
                </Text>
                <Text style={[pdfStyles.td, { width: '20%' }]}>
                  {c.currency}
                  {c.profit.toLocaleString()}
                </Text>
                <Text style={[pdfStyles.td, { width: '18%' }]}>{c.marginPct.toFixed(1)}%</Text>
              </PdfTableRow>
            ))}
            {cropDetailSlice.omitted > 0 ? (
              <PdfFootnote>
                Showing first {cropDetailSlice.rows.length} of {data.cropSalesDetail.length} crops.
              </PdfFootnote>
            ) : null}
          </>
        )}

        <PdfSectionTitle>Recent transactions</PdfSectionTitle>
        {txSlice.rows.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No recent transactions.</Text>
        ) : (
          <>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '22%' }]}>Batch</Text>
              <Text style={[pdfStyles.th, { width: '18%' }]}>Crop</Text>
              <Text style={[pdfStyles.th, { width: '20%' }]}>Date</Text>
              <Text style={[pdfStyles.th, { width: '15%' }]}>Harvest kg</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Purch.</Text>
              <Text style={[pdfStyles.th, { width: '13%' }]}>Compliance</Text>
            </PdfTableHeader>
            {txSlice.rows.map((t, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '22%' }]}>#{t.batchId.slice(0, 10)}</Text>
                <Text style={[pdfStyles.td, { width: '18%' }]}>{t.crop}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '20%' }]}>
                  {t.date ? format(new Date(t.date), 'MMM d, yyyy') : '—'}
                </Text>
                <Text style={[pdfStyles.td, { width: '15%' }]}>{t.quantityHarvestedKg.toLocaleString()}</Text>
                <Text style={[pdfStyles.td, { width: '12%' }]}>{t.quantityPurchased.toLocaleString()}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '13%' }]}>{t.complianceStatus}</Text>
              </PdfTableRow>
            ))}
            {txSlice.omitted > 0 ? (
              <PdfFootnote>
                Showing first {txSlice.rows.length} of {data.recentTransactions.data.length} transactions.
              </PdfFootnote>
            ) : null}
          </>
        )}
      </Page>
    </Document>
  )
}
