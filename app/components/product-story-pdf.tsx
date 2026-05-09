import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Standard styles for a clean, premium compact PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#1d3d1e',
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1d3d1e',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 6,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 30,
  },
  infoBox: {
    flex: 1,
    minWidth: '45%',
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderLeft: 4,
    borderLeftColor: '#10b981',
  },
  label: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1d3d1e',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottom: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 5,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 30,
  },
  scoreCard: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    border: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
  },
  scoreLabel: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  timelineItem: {
    marginBottom: 15,
    paddingLeft: 15,
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  timelineLine: {
    position: 'absolute',
    left: 2,
    top: 10,
    width: 1,
    height: '100%',
    backgroundColor: '#f1f5f9',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    textTransform: 'uppercase',
  },
  timelineDate: {
    fontSize: 8,
    color: '#94a3b8',
  },
  timelineDesc: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 1.4,
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
    fontSize: 8,
    color: '#94a3b8',
  },
})

export const ProductStoryPDF = ({ product, farm, cropCycle, journeySteps, scores }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{product?.productName || 'Product Report'}</Text>
        <Text style={styles.subtitle}>BATCH REF: {product?.batchNumber || 'N/A'}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Origin Farm</Text>
          <Text style={styles.value}>{farm?.name || 'Local Farm'}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Planting Date</Text>
          <Text style={styles.value}>
            {cropCycle?.plantingDate
              ? new Date(cropCycle.plantingDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'N/A'}
          </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Variety</Text>
          <Text style={styles.value}>{cropCycle?.variety || 'N/A'}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{product?.category || 'Crop'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sustainability & Quality Metrics</Text>
        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{scores.sustainability}</Text>
            <Text style={styles.scoreLabel}>Sustainability</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{scores.quality}</Text>
            <Text style={styles.scoreLabel}>Quality</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreValue}>{scores.compliance}</Text>
            <Text style={styles.scoreLabel}>Compliance</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full Journey Timeline</Text>
        {journeySteps.map((step: any, index: number) => (
          <View key={index} style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            {index < journeySteps.length - 1 && <View style={styles.timelineLine} />}
            <View style={styles.timelineHeader}>
              <Text style={styles.timelineTitle}>{step.title}</Text>
              <Text style={styles.timelineDate}>{step.date}</Text>
            </View>
            <Text style={styles.timelineDesc}>{step.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by Agtrail Platform</Text>
        <Text style={styles.footerText}>
          Verification ID: {product?.id?.slice(0, 8).toUpperCase()}
        </Text>
      </View>
    </Page>
  </Document>
)
