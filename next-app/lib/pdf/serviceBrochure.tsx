import { Document, View, Text, StyleSheet, CoverPage, ContentPage, SectionHeading, Para, COLORS } from './PdfShell';
import { services } from '@/lib/data/services';

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 },
  card: { width: '48%', borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12, marginBottom: 10, overflow: 'hidden' },
  accent: { position: 'absolute', top: 0, left: 0, bottom: 0, width: 4 },
  cardName: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: COLORS.ink, marginBottom: 4 },
  cardDesc: { fontSize: 8.5, color: COLORS.muted, lineHeight: 1.5 },
  ctaBox: { backgroundColor: COLORS.ink, borderRadius: 10, padding: 24, marginTop: 12, alignItems: 'center' },
  ctaTitle: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: COLORS.white, marginBottom: 6, textAlign: 'center' },
  ctaDesc: { fontSize: 9.5, color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: 400, lineHeight: 1.6 },
  ctaGold: { color: COLORS.gold, fontFamily: 'Helvetica-Bold' },
});

export function ServiceBrochurePDF({ settings }: { settings?: any }) {
  const first = services.slice(0, 10);
  const rest = services.slice(10);

  return (
    <Document title="KVL Business Solutions — Service Brochure" author="KVL Business Solutions">
      <CoverPage
        tag="Service Brochure"
        title="Every Service We Offer, In One Place"
        subtitle="From custom software to civil engineering — all delivered by one accountable team."
        settings={settings}
      />

      <ContentPage tag="Service Brochure" settings={settings}>
        <SectionHeading eyebrow={`${services.length} Services`} title="What We Offer" />
        <View style={styles.grid}>
          {first.map(s => (
            <View key={s.slug} style={styles.card} wrap={false}>
              <View style={[styles.accent, { backgroundColor: s.color }]} />
              <Text style={styles.cardName}>{s.name}</Text>
              <Text style={styles.cardDesc}>{s.description}</Text>
            </View>
          ))}
        </View>
      </ContentPage>

      <ContentPage tag="Service Brochure" settings={settings}>
        <SectionHeading eyebrow="Continued" title="What We Offer" />
        <View style={styles.grid}>
          {rest.map(s => (
            <View key={s.slug} style={styles.card} wrap={false}>
              <View style={[styles.accent, { backgroundColor: s.color }]} />
              <Text style={styles.cardName}>{s.name}</Text>
              <Text style={styles.cardDesc}>{s.description}</Text>
            </View>
          ))}
        </View>

        <SectionHeading eyebrow="Next Step" title="How to Get Started" />
        <Para>
          Book a free strategy call, or message us on WhatsApp — we&apos;ll scope your project and send a fixed, transparent quote
          before any work begins.
        </Para>

        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaTitle}>Ready to build something?</Text>
          <Text style={styles.ctaDesc}>
            <Text style={styles.ctaGold}>kvlbusinesssolutions.com/book-demo</Text> — or WhatsApp us directly.
            {'\n'}Scope, timeline and pricing are fixed in writing before any work begins.
          </Text>
        </View>
      </ContentPage>
    </Document>
  );
}
