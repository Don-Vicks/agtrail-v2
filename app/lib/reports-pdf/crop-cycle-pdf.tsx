import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import type { GetReportsCooperativeCropCycleSummary200Data } from '~/lib/api/generated/models/getReportsCooperativeCropCycleSummary200Data'
import type { GetReportsFarmerCropCycleSummary200Data } from '~/lib/api/generated/models/getReportsFarmerCropCycleSummary200Data'
import {
  PdfMetaBlock,
  PdfSectionTitle,
  PdfTableHeader,
  PdfTableRow,
  PDF_TABLE_ROWS_PER_PAGE,
  chunkArray,
  formatPdfUnknownField,
  pdfStyles,
} from '~/lib/reports-pdf/shared'

export type CropCyclePdfData = GetReportsFarmerCropCycleSummary200Data | GetReportsCooperativeCropCycleSummary200Data

/** Timeline cards are tall; fewer per page than dense tables. */
const PDF_TIMELINE_EVENTS_PER_PAGE = 14

export function CropCyclePdfDocument({
  title,
  scopeLabel,
  metaLines,
  data,
}: {
  title: string
  scopeLabel: string
  metaLines: string[]
  data: CropCyclePdfData
}) {
  const generatedAt = format(new Date(), "MMM d, yyyy 'at' HH:mm")
  const dist = data.activityDistribution ?? []
  const distChunks = chunkArray(dist, PDF_TABLE_ROWS_PER_PAGE)
  const maxCount = Math.max(1, ...dist.map((d) => d.count || 0))
  const timeline = data.activityTimeline ?? []
  const timelineChunks = chunkArray(timeline, PDF_TIMELINE_EVENTS_PER_PAGE)

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

      {distChunks.length === 0 ? (
        <Page key="dist-empty" size="A4" style={pdfStyles.page}>
          <PdfSectionTitle>Operational intensity (logs per day)</PdfSectionTitle>
          <Text style={pdfStyles.tdMuted}>No distribution rows.</Text>
        </Page>
      ) : (
        distChunks.map((chunk, pageIdx) => (
          <Page key={`dist-${pageIdx}`} size="A4" style={pdfStyles.page}>
            <PdfSectionTitle>
              Operational intensity (logs per day)
              {pageIdx > 0 ? ` (continued ${pageIdx + 1}/${distChunks.length})` : ''}
            </PdfSectionTitle>
            <PdfTableHeader>
              <Text style={[pdfStyles.th, { width: '30%' }]}>Date</Text>
              <Text style={[pdfStyles.th, { width: '15%' }]}>Count</Text>
              <Text style={[pdfStyles.th, { width: '55%' }]}>Relative</Text>
            </PdfTableHeader>
            {chunk.map((row, i) => (
              <PdfTableRow key={i}>
                <Text style={[pdfStyles.td, { width: '30%' }]}>{format(new Date(row.date), 'MMM d, yyyy')}</Text>
                <Text style={[pdfStyles.td, { width: '15%' }]}>{row.count}</Text>
                <View style={{ width: '55%', justifyContent: 'center' }}>
                  <View style={pdfStyles.barTrack}>
                    <View style={[pdfStyles.barFill, { width: `${(row.count / maxCount) * 100}%` }]} />
                  </View>
                </View>
              </PdfTableRow>
            ))}
          </Page>
        ))
      )}

      {timelineChunks.length === 0 ? (
        <Page key="tl-empty" size="A4" style={pdfStyles.page}>
          <PdfSectionTitle>Activity timeline</PdfSectionTitle>
          <Text style={pdfStyles.tdMuted}>No timeline events in range.</Text>
        </Page>
      ) : (
        timelineChunks.map((chunk, pageIdx) => (
          <Page key={`tl-${pageIdx}`} size="A4" style={pdfStyles.page}>
            <PdfSectionTitle>
              Activity timeline{pageIdx > 0 ? ` (continued ${pageIdx + 1}/${timelineChunks.length})` : ''}
            </PdfSectionTitle>
            {chunk.map((item, i) => {
              const materials = formatPdfUnknownField(item.materialsUsed)
              return (
                <View key={item.id || `${pageIdx}-${i}`} style={pdfStyles.timelineBlock}>
                  <Text style={pdfStyles.timelineTitle}>{item.type}</Text>
                  <Text style={pdfStyles.timelineSub}>
                    {item.category} · {format(new Date(item.date), 'MMM d, yyyy')}
                    {item.time ? ` · ${item.time}` : ''}
                  </Text>
                  {item.description ? (
                    <Text style={[pdfStyles.td, { marginTop: 6 }]}>{item.description}</Text>
                  ) : null}
                  {item.cost != null && item.cost !== '' ? (
                    <Text style={[pdfStyles.tdMuted, { marginTop: 4 }]}>
                      Cost: {Number(item.cost).toLocaleString()} {item.currency ?? '₦'}
                    </Text>
                  ) : null}
                  {item.equipmentUsed && item.equipmentUsed.length > 0 ? (
                    <Text style={[pdfStyles.tdMuted, { marginTop: 2 }]}>Equipment: {item.equipmentUsed.join(', ')}</Text>
                  ) : null}
                  {materials ? (
                    <Text style={[pdfStyles.tdMuted, { marginTop: 2 }]}>Materials: {materials}</Text>
                  ) : null}
                  {item.certificationNotes ? (
                    <Text style={[pdfStyles.td, { marginTop: 4, color: '#1e3a5f' }]}>
                      Certification: {item.certificationNotes}
                    </Text>
                  ) : null}
                  {item.environmentalNotes ? (
                    <Text style={[pdfStyles.td, { marginTop: 4, color: '#14532d' }]}>
                      Environmental: {item.environmentalNotes}
                    </Text>
                  ) : null}
                </View>
              )
            })}
          </Page>
        ))
      )}
    </Document>
  )
}
