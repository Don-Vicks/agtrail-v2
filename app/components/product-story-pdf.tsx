import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Standard styles for a clean, premium compact PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 25,
    borderBottom: 2,
    borderBottomColor: '#1d3d1e',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1d3d1e',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 6,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1d3d1e',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: '#f1f5f9',
    padding: '4 8',
    borderRadius: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  infoBox: {
    width: '30%',
    marginBottom: 10,
  },
  infoBoxWide: {
    width: '45%',
    marginBottom: 10,
  },
  label: {
    fontSize: 7,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  scoreCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    border: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  scoreLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
    marginTop: 4,
    fontWeight: 'bold',
  },
  timelineItem: {
    marginBottom: 12,
    paddingLeft: 12,
    borderLeft: 1,
    borderLeftColor: '#e2e8f0',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
    textTransform: 'uppercase',
  },
  timelineDate: {
    fontSize: 7,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  timelineDesc: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.4,
    marginBottom: 4,
  },
  timelineDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  detailText: {
    fontSize: 7,
    color: '#94a3b8',
  },
  detailValue: {
    color: '#475569',
    fontWeight: 'bold',
  },
  noteBox: {
    marginTop: 6,
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    borderLeft: 2,
    borderLeftColor: '#10b981',
  },
  noteText: {
    fontSize: 8,
    color: '#64748b',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7,
    color: '#94a3b8',
  },
})

export const ProductStoryPDF = ({ product, farm, cropCycle, journeySteps, scores }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{product?.productName || 'Product Report'}</Text>
        <Text style={styles.subtitle}>BATCH IDENTIFIER: {product?.batchNumber || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Details</Text>
        <View style={styles.grid}>
          <View style={styles.infoBoxWide}>
            <Text style={styles.label}>Commodity Type</Text>
            <Text style={styles.value}>{product?.category || 'General Crop'}</Text>
          </View>
          <View style={styles.infoBoxWide}>
            <Text style={styles.label}>Quantity Harvested</Text>
            <Text style={styles.value}>{product?.quantityHarvested} {product?.unit}</Text>
          </View>
          <View style={styles.infoBoxWide}>
            <Text style={styles.label}>Harvest Status</Text>
            <Text style={styles.value}>{product?.status || 'Completed'}</Text>
          </View>
          <View style={styles.infoBoxWide}>
            <Text style={styles.label}>Traceability Code</Text>
            <Text style={styles.value}>{product?.id?.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Origin & Farming Context</Text>
        <View style={styles.grid}>
          <View style={styles.infoBoxWide}>
            <Text style={styles.label}>Farm Name</Text>
            <Text style={styles.value}>{farm?.name || 'Authorized Farm'}</Text>
          </View>
          <View style={styles.infoBoxWide}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{farm?.city}, {farm?.country}</Text>
          </View>
          <View style={styles.infoBoxWide}>
            <Text style={styles.label}>Farmer / Owner</Text>
            <Text style={styles.value}>{farm?.ownerName || 'Verified Producer'}</Text>
          </View>
          <View style={styles.infoBoxWide}>
            <Text style={styles.label}>Farm Size</Text>
            <Text style={styles.value}>{farm?.size} {farm?.sizeUnit}</Text>
          </View>
          <View style={styles.infoBoxWide}>
            <Text style={styles.label}>Variety</Text>
            <Text style={styles.value}>{cropCycle?.variety || 'N/A'}</Text>
          </View>
          <View style={styles.infoBoxWide}>
            <Text style={styles.label}>Season</Text>
            <Text style={styles.value}>{cropCycle?.season || 'N/A'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sustainability & Quality Scores</Text>
        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{scores.sustainability}</Text>
            <Text style={styles.scoreLabel}>Sustainability</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{scores.quality}</Text>
            <Text style={styles.scoreLabel}>Quality Grade</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{scores.compliance}%</Text>
            <Text style={styles.scoreLabel}>Compliance</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full Production Journey</Text>
        {journeySteps.map((step: any, index: number) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineTitle}>{step.title}</Text>
              <Text style={styles.timelineDate}>{step.date} {step.time ? `| ${step.time}` : ''}</Text>
            </View>
            <Text style={styles.timelineDesc}>{step.description}</Text>
            
            {step.details && step.details.length > 0 && (
              <View style={styles.timelineDetails}>
                {step.details.map((detail: any, dIdx: number) => (
                  <Text key={dIdx} style={styles.detailText}>
                    {detail.label}: <Text style={styles.detailValue}>{detail.value}</Text>
                  </Text>
                ))}
              </View>
            )}
            
            {step.note && (
              <View style={styles.noteBox}>
                <Text style={styles.noteText}>{step.note}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Agtrail Digital Passport - Secure Traceability Report</Text>
        <Text style={styles.footerText}>
          Report ID: {product?.id?.slice(0, 12).toUpperCase()}
        </Text>
      </View>
    </Page>
  </Document>
)
