import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import type { GetReportsCooperativeHarvestSales200Data } from '~/lib/api/generated/models/getReportsCooperativeHarvestSales200Data'
import type { GetReportsFarmerHarvestSales200Data } from '~/lib/api/generated/models/getReportsFarmerHarvestSales200Data'
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
  const batches = sliceWithNote(data.recentHarvestBatches?.data ?? [], PDF_ROW_CAP)
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

        <PdfSectionTitle>Crop distribution (% of batches)</PdfSectionTitle>
        {data.cropDistribution.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No distribution data.</Text>
        ) : (
          <>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '50%' }]}>Crop</Text>
              <Text style={[pdfStyles.th, { width: '25%' }]}>%</Text>
              <Text style={[pdfStyles.th, { width: '25%' }]}>Visual</Text>
            </PdfTableHeader>
            {data.cropDistribution.map((d, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '50%' }]}>{d.crop}</Text>
                <Text style={[pdfStyles.td, { width: '25%' }]}>{d.percentage.toFixed(1)}%</Text>
                <View style={{ width: '25%', justifyContent: 'center' }}>
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

      <Page size="A4" style={pdfStyles.page}>
        <PdfSectionTitle>Recent harvest batches</PdfSectionTitle>
        {batches.rows.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No batch rows.</Text>
        ) : (
          <>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '22%' }]}>Batch</Text>
              <Text style={[pdfStyles.th, { width: '18%' }]}>Crop</Text>
              <Text style={[pdfStyles.th, { width: '22%' }]}>Date</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Expected kg</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Harvest kg</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Purch.</Text>
            </PdfTableHeader>
            {batches.rows.map((b, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '22%' }]}>#{b.batchId.slice(0, 10)}</Text>
                <Text style={[pdfStyles.td, { width: '18%' }]}>{b.crop}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '22%' }]}>{format(new Date(b.date), 'MMM d, yyyy')}</Text>
                <Text style={[pdfStyles.td, { width: '14%' }]}>{b.expectedYieldKg.toLocaleString()}</Text>
                <Text style={[pdfStyles.td, { width: '12%' }]}>{b.quantityHarvestedKg.toLocaleString()}</Text>
                <Text style={[pdfStyles.td, { width: '12%' }]}>{b.quantityPurchased.toLocaleString()}</Text>
              </PdfTableRow>
            ))}
            {batches.omitted > 0 ? (
              <PdfFootnote>
                Showing first {batches.rows.length} of {data.recentHarvestBatches.data.length} batches.
              </PdfFootnote>
            ) : null}
          </>
        )}
      </Page>
    </Document>
  )
}
