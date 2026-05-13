import { StyleSheet, Text, View } from '@react-pdf/renderer'
import type { ReactNode } from 'react'

export const PDF_ROW_CAP = 45

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  brandBar: {
    height: 4,
    backgroundColor: '#1B4332',
    marginBottom: 14,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#0f172a',
  },
  scopePill: {
    marginTop: 6,
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#64748b',
  },
  metaLine: {
    marginTop: 3,
    fontSize: 8,
    color: '#475569',
  },
  generated: {
    marginTop: 10,
    fontSize: 7,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#1B4332',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  kpiBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#f8fafc',
  },
  kpiLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#64748b',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  kpiTrend: {
    marginTop: 4,
    fontSize: 7,
    color: '#475569',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  th: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#64748b',
  },
  td: {
    fontSize: 8,
    color: '#0f172a',
  },
  tdMuted: {
    fontSize: 7,
    color: '#64748b',
  },
  footnote: {
    marginTop: 8,
    fontSize: 7,
    fontStyle: 'italic',
    color: '#94a3b8',
  },
  timelineBlock: {
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 3,
    backgroundColor: '#fafafa',
  },
  timelineTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#0f172a',
  },
  timelineSub: {
    marginTop: 2,
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  barTrack: {
    marginTop: 4,
    height: 5,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    width: '100%',
  },
  barFill: {
    height: 5,
    backgroundColor: '#40916C',
    borderRadius: 2,
  },
})

export function sliceWithNote<T>(items: T[], cap: number): { rows: T[]; omitted: number } {
  if (items.length <= cap) return { rows: items, omitted: 0 }
  return { rows: items.slice(0, cap), omitted: items.length - cap }
}

export function PdfMetaBlock({
  title,
  scope,
  lines,
  generatedAtLabel,
}: {
  title: string
  scope: string
  lines: string[]
  generatedAtLabel: string
}) {
  return (
    <View>
      <View style={pdfStyles.brandBar} />
      <Text style={pdfStyles.docTitle}>{title}</Text>
      <Text style={pdfStyles.scopePill}>{scope}</Text>
      {lines.map((line, i) => (
        <Text key={i} style={pdfStyles.metaLine}>
          {line}
        </Text>
      ))}
      <Text style={pdfStyles.generated}>{generatedAtLabel}</Text>
    </View>
  )
}

export function PdfSectionTitle({ children }: { children: ReactNode }) {
  return <Text style={pdfStyles.sectionTitle}>{children}</Text>
}

export function PdfTableHeader({ children }: { children: ReactNode }) {
  return <View style={pdfStyles.tableHeader}>{children}</View>
}

export function PdfTableRow({ children }: { children: ReactNode }) {
  return <View style={pdfStyles.tableRow}>{children}</View>
}

export function PdfFootnote({ children }: { children: ReactNode }) {
  return <Text style={pdfStyles.footnote}>{children}</Text>
}
