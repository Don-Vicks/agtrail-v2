import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import type { GetReportsCooperativeFinancialSummary200Data } from '~/lib/api/generated/models/getReportsCooperativeFinancialSummary200Data'
import type { GetReportsFarmerFinancialSummary200Data } from '~/lib/api/generated/models/getReportsFarmerFinancialSummary200Data'
import {
  PdfMetaBlock,
  PdfSectionTitle,
  PdfTableHeader,
  PdfTableRow,
  PDF_TABLE_ROWS_PER_PAGE,
  chunkArray,
  pdfStyles,
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
  const costRows = data.costBreakdown ?? []
  const marginRows = data.cropSalesDetail ?? []
  const cropRows = data.cropSalesDetail ?? []
  const txRows = data.recentTransactions?.data ?? []
  const maxMargin = Math.max(1, ...marginRows.map((r) => Math.abs(r.marginPct) || 0))
  const trendChunks = chunkArray(trend, PDF_TABLE_ROWS_PER_PAGE)
  const cropChunks = chunkArray(cropRows, PDF_TABLE_ROWS_PER_PAGE)
  const txChunks = chunkArray(txRows, PDF_TABLE_ROWS_PER_PAGE)
  const curr = data.kpis.totalRevenue.currency ?? '₦'

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

        <PdfSectionTitle>Cost breakdown</PdfSectionTitle>
        {costRows.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No cost categories.</Text>
        ) : (
          <>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '45%' }]}>Category</Text>
              <Text style={[pdfStyles.th, { width: '30%' }]}>Amount</Text>
              <Text style={[pdfStyles.th, { width: '25%' }]}>% of costs</Text>
            </PdfTableHeader>
            {costRows.map((c, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '45%' }]}>{c.category}</Text>
                <Text style={[pdfStyles.td, { width: '30%' }]}>{c.amount.toLocaleString()}</Text>
                <Text style={[pdfStyles.td, { width: '25%' }]}>{c.percentage.toFixed(1)}%</Text>
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

      {trendChunks.length === 0 ? (
        <Page key="trend-empty" size="A4" style={pdfStyles.page}>
          <PdfSectionTitle>Daily revenue, costs and profit</PdfSectionTitle>
          <Text style={pdfStyles.tdMuted}>No trend rows for this range.</Text>
        </Page>
      ) : (
        trendChunks.map((chunk, pageIdx) => (
          <Page key={`trend-${pageIdx}`} size="A4" style={pdfStyles.page}>
            <PdfSectionTitle>
              Daily revenue, costs and profit{pageIdx > 0 ? ` (continued ${pageIdx + 1}/${trendChunks.length})` : ''}
            </PdfSectionTitle>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '22%' }]}>Date</Text>
              <Text style={[pdfStyles.th, { width: '26%' }]}>Revenue</Text>
              <Text style={[pdfStyles.th, { width: '26%' }]}>Costs</Text>
              <Text style={[pdfStyles.th, { width: '26%' }]}>Profit</Text>
            </PdfTableHeader>
            {chunk.map((row, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '22%' }]}>{format(new Date(row.date), 'MMM d, yyyy')}</Text>
                <Text style={[pdfStyles.td, { width: '26%' }]}>
                  {curr}
                  {row.revenue.toLocaleString()}
                </Text>
                <Text style={[pdfStyles.td, { width: '26%' }]}>
                  {curr}
                  {row.costs.toLocaleString()}
                </Text>
                <Text style={[pdfStyles.td, { width: '26%' }]}>
                  {curr}
                  {row.profit.toLocaleString()}
                </Text>
              </PdfTableRow>
            ))}
          </Page>
        ))
      )}

      {cropChunks.length === 0 ? (
        <Page key="crop-empty" size="A4" style={pdfStyles.page}>
          <PdfSectionTitle>Crop sales detail</PdfSectionTitle>
          <Text style={pdfStyles.tdMuted}>No crop sales rows.</Text>
        </Page>
      ) : (
        cropChunks.map((chunk, pageIdx) => (
          <Page key={`crop-${pageIdx}`} size="A4" style={pdfStyles.page}>
            <PdfSectionTitle>
              Crop sales detail{pageIdx > 0 ? ` (continued ${pageIdx + 1}/${cropChunks.length})` : ''}
            </PdfSectionTitle>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '20%' }]}>Crop</Text>
              <Text style={[pdfStyles.th, { width: '20%' }]}>Revenue</Text>
              <Text style={[pdfStyles.th, { width: '20%' }]}>Costs</Text>
              <Text style={[pdfStyles.th, { width: '20%' }]}>Profit</Text>
              <Text style={[pdfStyles.th, { width: '20%' }]}>Margin</Text>
            </PdfTableHeader>
            {chunk.map((c, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '20%' }]}>{c.crop}</Text>
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
                <Text style={[pdfStyles.td, { width: '20%' }]}>{c.marginPct.toFixed(1)}%</Text>
              </PdfTableRow>
            ))}
          </Page>
        ))
      )}

      {txChunks.length === 0 ? (
        <Page key="tx-empty" size="A4" style={pdfStyles.page}>
          <PdfSectionTitle>Recent transactions</PdfSectionTitle>
          <Text style={pdfStyles.tdMuted}>No recent transactions.</Text>
        </Page>
      ) : (
        txChunks.map((chunk, pageIdx) => (
          <Page key={`tx-${pageIdx}`} size="A4" style={pdfStyles.page}>
            <PdfSectionTitle>
              Recent transactions{pageIdx > 0 ? ` (continued ${pageIdx + 1}/${txChunks.length})` : ''}
            </PdfSectionTitle>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '18%' }]}>Batch</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Crop</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Date</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Exp. kg</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Harvest kg</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Purch.</Text>
              <Text style={[pdfStyles.th, { width: '18%' }]}>Compliance</Text>
            </PdfTableHeader>
            {chunk.map((t, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '18%' }]}>#{t.batchId.slice(0, 12)}</Text>
                <Text style={[pdfStyles.td, { width: '14%' }]}>{t.crop}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '14%' }]}>
                  {t.date ? format(new Date(t.date), 'MMM d, yyyy') : '—'}
                </Text>
                <Text style={[pdfStyles.td, { width: '12%' }]}>{t.expectedYieldKg.toLocaleString()}</Text>
                <Text style={[pdfStyles.td, { width: '12%' }]}>{t.quantityHarvestedKg.toLocaleString()}</Text>
                <Text style={[pdfStyles.td, { width: '12%' }]}>{t.quantityPurchased.toLocaleString()}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '18%' }]}>{t.complianceStatus}</Text>
              </PdfTableRow>
            ))}
          </Page>
        ))
      )}
    </Document>
  )
}
