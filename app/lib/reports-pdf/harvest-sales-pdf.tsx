import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import type { GetReportsCooperativeHarvestSales200Data } from '~/lib/api/generated/models/getReportsCooperativeHarvestSales200Data'
import type { GetReportsFarmerHarvestSales200Data } from '~/lib/api/generated/models/getReportsFarmerHarvestSales200Data'
import {
  PdfMetaBlock,
  PdfSectionTitle,
  PdfTableHeader,
  PdfTableRow,
  PDF_TABLE_ROWS_PER_PAGE,
  chunkArray,
  pdfStyles,
} from '~/lib/reports-pdf/shared'

export type HarvestSalesPdfData = GetReportsFarmerHarvestSales200Data | GetReportsCooperativeHarvestSales200Data

export function HarvestSalesPdfDocument({
  title,
  scopeLabel,
  metaLines,
  data,
}: {
  title: string
  scopeLabel: string
  metaLines: string[]
  data: HarvestSalesPdfData
}) {
  const generatedAt = format(new Date(), "MMM d, yyyy 'at' HH:mm")
  const batches = data.recentHarvestBatches?.data ?? []
  const batchChunks = chunkArray(batches, PDF_TABLE_ROWS_PER_PAGE)
  const maxRev = Math.max(1, ...data.cropSalesRevenue.map((r) => r.revenue || 0))

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
            <Text style={pdfStyles.kpiLabel}>Total harvested</Text>
            <Text style={pdfStyles.kpiValue}>
              {data.kpis.totalHarvested.value.toLocaleString()} {data.kpis.totalHarvested.unit ?? 'kg'}
            </Text>
            <Text style={pdfStyles.kpiTrend}>
              Trend {data.kpis.totalHarvested.trend >= 0 ? '+' : ''}
              {data.kpis.totalHarvested.trend.toFixed(1)}%
            </Text>
          </View>
          <View style={pdfStyles.kpiBox}>
            <Text style={pdfStyles.kpiLabel}>Total revenue</Text>
            <Text style={pdfStyles.kpiValue}>
              {data.kpis.totalRevenue.currency ?? '₦'}
              {data.kpis.totalRevenue.value.toLocaleString()}
            </Text>
            <Text style={pdfStyles.kpiTrend}>
              Trend {data.kpis.totalRevenue.trend >= 0 ? '+' : ''}
              {data.kpis.totalRevenue.trend.toFixed(1)}%
            </Text>
          </View>
          <View style={pdfStyles.kpiBox}>
            <Text style={pdfStyles.kpiLabel}>Sustainability</Text>
            <Text style={pdfStyles.kpiValue}>
              {data.kpis.sustainabilityScore.value}
              {data.kpis.sustainabilityScore.unit ?? '%'}
            </Text>
            <Text style={pdfStyles.kpiTrend}>
              Trend {data.kpis.sustainabilityScore.trend >= 0 ? '+' : ''}
              {data.kpis.sustainabilityScore.trend.toFixed(1)}%
            </Text>
          </View>
        </View>

        <PdfSectionTitle>Crop distribution (batches by crop)</PdfSectionTitle>
        {data.cropDistribution.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No distribution data.</Text>
        ) : (
          <>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '35%' }]}>Crop</Text>
              <Text style={[pdfStyles.th, { width: '15%' }]}>Batches</Text>
              <Text style={[pdfStyles.th, { width: '15%' }]}>%</Text>
              <Text style={[pdfStyles.th, { width: '35%' }]}>Share</Text>
            </PdfTableHeader>
            {data.cropDistribution.map((d, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '35%' }]}>{d.crop}</Text>
                <Text style={[pdfStyles.td, { width: '15%' }]}>{d.count.toLocaleString()}</Text>
                <Text style={[pdfStyles.td, { width: '15%' }]}>{d.percentage.toFixed(1)}%</Text>
                <View style={{ width: '35%', justifyContent: 'center' }}>
                  <View style={pdfStyles.barTrack}>
                    <View style={[pdfStyles.barFill, { width: `${Math.min(100, d.percentage)}%` }]} />
                  </View>
                </View>
              </PdfTableRow>
            ))}
          </>
        )}

        <PdfSectionTitle>Revenue by crop</PdfSectionTitle>
        {data.cropSalesRevenue.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No revenue-by-crop rows.</Text>
        ) : (
          data.cropSalesRevenue.map((r, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={pdfStyles.td}>{r.crop}</Text>
                <Text style={pdfStyles.td}>
                  {(r.currency ?? '₦') + r.revenue.toLocaleString()}
                </Text>
              </View>
              <View style={pdfStyles.barTrack}>
                <View style={[pdfStyles.barFill, { width: `${(r.revenue / maxRev) * 100}%` }]} />
              </View>
            </View>
          ))
        )}
      </Page>

      {batchChunks.length === 0 ? (
        <Page key="batches-empty" size="A4" style={pdfStyles.page}>
          <PdfSectionTitle>Recent harvest batches</PdfSectionTitle>
          <Text style={pdfStyles.tdMuted}>No batch rows.</Text>
        </Page>
      ) : (
        batchChunks.map((chunk, pageIdx) => (
          <Page key={`batches-${pageIdx}`} size="A4" style={pdfStyles.page}>
            <PdfSectionTitle>
              Recent harvest batches{pageIdx > 0 ? ` (continued ${pageIdx + 1}/${batchChunks.length})` : ''}
            </PdfSectionTitle>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '16%' }]}>Batch</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Crop</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Harvest kg</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Exp. kg</Text>
              <Text style={[pdfStyles.th, { width: '10%' }]}>Purch.</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Date</Text>
              <Text style={[pdfStyles.th, { width: '22%' }]}>Compliance</Text>
            </PdfTableHeader>
            {chunk.map((b, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '16%' }]}>#{b.batchId.slice(0, 12)}</Text>
                <Text style={[pdfStyles.td, { width: '14%' }]}>{b.crop}</Text>
                <Text style={[pdfStyles.td, { width: '12%' }]}>{b.quantityHarvestedKg.toLocaleString()}</Text>
                <Text style={[pdfStyles.td, { width: '12%' }]}>{b.expectedYieldKg.toLocaleString()}</Text>
                <Text style={[pdfStyles.td, { width: '10%' }]}>{b.quantityPurchased.toLocaleString()}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '14%' }]}>{format(new Date(b.date), 'MMM d, yyyy')}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '22%' }]}>{b.complianceStatus}</Text>
              </PdfTableRow>
            ))}
          </Page>
        ))
      )}
    </Document>
  )
}
