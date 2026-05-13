import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import type { GetReportsCooperativeFarmSummary200Data } from '~/lib/api/generated/models/getReportsCooperativeFarmSummary200Data'
import type { GetReportsFarmerFarmSummary200Data } from '~/lib/api/generated/models/getReportsFarmerFarmSummary200Data'
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
  const plots = sliceWithNote(data.farmPerformance?.data ?? [], PDF_ROW_CAP)
  const activity = data.activityDistribution ?? []
  const activitySlice = sliceWithNote(activity, 40)
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

        <PdfSectionTitle>Activity distribution (daily counts)</PdfSectionTitle>
        {activitySlice.rows.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No activity buckets in range.</Text>
        ) : (
          <>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '30%' }]}>Date</Text>
              <Text style={[pdfStyles.th, { width: '15%' }]}>Count</Text>
              <Text style={[pdfStyles.th, { width: '55%' }]}>Intensity</Text>
            </PdfTableHeader>
            {activitySlice.rows.map((a, i) => (
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
            {activitySlice.omitted > 0 ? (
              <PdfFootnote>Showing first {activitySlice.rows.length} of {activity.length} days.</PdfFootnote>
            ) : null}
          </>
        )}
      </Page>

      <Page size="A4" style={pdfStyles.page}>
        <PdfSectionTitle>Plot & crop performance</PdfSectionTitle>
        {plots.rows.length === 0 ? (
          <Text style={pdfStyles.tdMuted}>No plot rows.</Text>
        ) : (
          <>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '18%' }]}>Farm</Text>
              <Text style={[pdfStyles.th, { width: '16%' }]}>Farmer</Text>
              <Text style={[pdfStyles.th, { width: '10%' }]}>Ha</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Exp (t)</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Act (t)</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Status</Text>
              <Text style={[pdfStyles.th, { width: '14%' }]}>Compliance</Text>
            </PdfTableHeader>
            {plots.rows.map((p, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '18%' }]}>{p.farmName}</Text>
                <Text style={[pdfStyles.td, { width: '16%' }]}>{p.farmerName}</Text>
                <Text style={[pdfStyles.td, { width: '10%' }]}>{p.hectares}</Text>
                <Text style={[pdfStyles.td, { width: '14%' }]}>{p.expectedYieldTons.toLocaleString()}</Text>
                <Text style={[pdfStyles.td, { width: '14%' }]}>{p.actualYieldTons.toLocaleString()}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '14%' }]}>{p.status}</Text>
                <Text style={[pdfStyles.tdMuted, { width: '14%' }]}>{p.complianceStatus}</Text>
              </PdfTableRow>
            ))}
            {plots.omitted > 0 ? (
              <PdfFootnote>
                Showing first {plots.rows.length} of {data.farmPerformance.data.length} rows (page {data.farmPerformance.page}, limit {data.farmPerformance.limit}).
              </PdfFootnote>
            ) : null}
          </>
        )}
      </Page>
    </Document>
  )
}
