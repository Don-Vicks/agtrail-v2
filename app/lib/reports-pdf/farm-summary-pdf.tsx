import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import type { GetReportsCooperativeFarmSummary200Data } from '~/lib/api/generated/models/getReportsCooperativeFarmSummary200Data'
import type { GetReportsFarmerFarmSummary200Data } from '~/lib/api/generated/models/getReportsFarmerFarmSummary200Data'
import {
  PdfMetaBlock,
  PdfSectionTitle,
  PdfTableHeader,
  PdfTableRow,
  PDF_TABLE_ROWS_PER_PAGE,
  chunkArray,
  pdfStyles,
} from '~/lib/reports-pdf/shared'

export type FarmSummaryPdfData = GetReportsFarmerFarmSummary200Data | GetReportsCooperativeFarmSummary200Data

export function FarmSummaryPdfDocument({
  title,
  scopeLabel,
  metaLines,
  data,
}: {
  title: string
  scopeLabel: string
  metaLines: string[]
  data: FarmSummaryPdfData
}) {
  const generatedAt = format(new Date(), "MMM d, yyyy 'at' HH:mm")
  const activity = data.activityDistribution ?? []
  const activityChunks = chunkArray(activity, PDF_TABLE_ROWS_PER_PAGE)
  const plots = data.farmPerformance?.data ?? []
  const plotChunks = chunkArray(plots, PDF_TABLE_ROWS_PER_PAGE)
  const maxCount = Math.max(1, ...activity.map((a) => a.count || 0))

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
            <Text style={pdfStyles.kpiLabel}>Quality score</Text>
            <Text style={pdfStyles.kpiValue}>
              {data.kpis.qualityScore.value}
              {data.kpis.qualityScore.unit ?? '/100'}
            </Text>
            <Text style={pdfStyles.kpiTrend}>
              {data.kpis.qualityScore.trend >= 0 ? '+' : ''}
              {data.kpis.qualityScore.trend.toFixed(1)}%
            </Text>
          </View>
          <View style={pdfStyles.kpiBox}>
            <Text style={pdfStyles.kpiLabel}>Estimated yield</Text>
            <Text style={pdfStyles.kpiValue}>
              {data.kpis.estimatedYield.value.toLocaleString()} {data.kpis.estimatedYield.unit ?? ''}
            </Text>
            <Text style={pdfStyles.kpiTrend}>
              {data.kpis.estimatedYield.trend >= 0 ? '+' : ''}
              {data.kpis.estimatedYield.trend.toFixed(1)}%
            </Text>
          </View>
          <View style={pdfStyles.kpiBox}>
            <Text style={pdfStyles.kpiLabel}>Sustainability</Text>
            <Text style={pdfStyles.kpiValue}>
              {data.kpis.sustainabilityScore.value}
              {data.kpis.sustainabilityScore.unit ?? '%'}
            </Text>
            <Text style={pdfStyles.kpiTrend}>
              {data.kpis.sustainabilityScore.trend >= 0 ? '+' : ''}
              {data.kpis.sustainabilityScore.trend.toFixed(1)}%
            </Text>
          </View>
        </View>
      </Page>

      {activityChunks.length === 0 ? (
        <Page key="act-empty" size="A4" style={pdfStyles.page}>
          <PdfSectionTitle>Activity distribution (daily counts)</PdfSectionTitle>
          <Text style={pdfStyles.tdMuted}>No activity buckets in range.</Text>
        </Page>
      ) : (
        activityChunks.map((chunk, pageIdx) => (
          <Page key={`act-${pageIdx}`} size="A4" style={pdfStyles.page}>
            <PdfSectionTitle>
              Activity distribution (daily counts)
              {pageIdx > 0 ? ` (continued ${pageIdx + 1}/${activityChunks.length})` : ''}
            </PdfSectionTitle>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '30%' }]}>Date</Text>
              <Text style={[pdfStyles.th, { width: '15%' }]}>Count</Text>
              <Text style={[pdfStyles.th, { width: '55%' }]}>Intensity</Text>
            </PdfTableHeader>
            {chunk.map((a, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '30%' }]}>{format(new Date(a.date), 'MMM d, yyyy')}</Text>
                <Text style={[pdfStyles.td, { width: '15%' }]}>{a.count}</Text>
                <View style={{ width: '55%', justifyContent: 'center' }}>
                  <View style={pdfStyles.barTrack}>
                    <View style={[pdfStyles.barFill, { width: `${(a.count / maxCount) * 100}%` }]} />
                  </View>
                </View>
              </PdfTableRow>
            ))}
          </Page>
        ))
      )}

      {plotChunks.length === 0 ? (
        <Page key="plots-empty" size="A4" style={pdfStyles.page}>
          <PdfSectionTitle>Plot and crop performance</PdfSectionTitle>
          <Text style={pdfStyles.tdMuted}>No plot rows.</Text>
        </Page>
      ) : (
        plotChunks.map((chunk, pageIdx) => (
          <Page key={`plots-${pageIdx}`} size="A4" style={pdfStyles.page}>
            <PdfSectionTitle>
              Plot and crop performance
              {pageIdx > 0 ? ` (continued ${pageIdx + 1}/${plotChunks.length})` : ''}
            </PdfSectionTitle>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '16%' }]}>Farm</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Product ID</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Farmer</Text>
              <Text style={[pdfStyles.th, { width: '8%' }]}>Ha</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Exp (t)</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Act (t)</Text>
              <Text style={[pdfStyles.th, { width: '12%' }]}>Status</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Compliance</Text>
            </PdfTableHeader>
            {chunk.map((p, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '16%' }]}>{p.farmName}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '12%' }]}>{p.productId}</Text>
                <Text style={[pdfStyles.td, { width: '14%' }]}>{p.farmerName}</Text>
                <Text style={[pdfStyles.td, { width: '8%' }]}>{p.hectares}</Text>
                <Text style={[pdfStyles.td, { width: '12%' }]}>{p.expectedYieldTons.toLocaleString()}</Text>
                <Text style={[pdfStyles.td, { width: '12%' }]}>{p.actualYieldTons.toLocaleString()}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '12%' }]}>{p.status}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '14%' }]}>{p.complianceStatus}</Text>
              </PdfTableRow>
            ))}
            {pageIdx === plotChunks.length - 1 && data.farmPerformance.total > plots.length ? (
              <Text style={[pdfStyles.footnote, { marginTop: 10 }]}>
                API total rows: {data.farmPerformance.total} (showing page {data.farmPerformance.page}, limit{' '}
                {data.farmPerformance.limit}).
              </Text>
            ) : null}
          </Page>
        ))
      )}
    </Document>
  )
}
