import { Document, View, Text, StyleSheet, CoverPage, ContentPage, SectionHeading, Para, Pill, StatBox, COLORS } from './PdfShell';
import { services } from '@/lib/data/services';

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 4, marginBottom: 22 },
  pillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 22 },
  processRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  processStep: { width: '48%', borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12, marginBottom: 10 },
  processNum: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: COLORS.goldDark, marginBottom: 4 },
  processTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: COLORS.ink, marginBottom: 3 },
  processDesc: { fontSize: 8.5, color: COLORS.muted, lineHeight: 1.5 },
  ctaBox: { backgroundColor: COLORS.ink, borderRadius: 10, padding: 24, marginTop: 10, alignItems: 'center' },
  ctaTitle: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: COLORS.white, marginBottom: 6, textAlign: 'center' },
  ctaDesc: { fontSize: 9.5, color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: 380, lineHeight: 1.6 },
});

const PROCESS = [
  { n: '01', t: 'Discover', d: 'We learn the business, the goals and what the system actually needs to do.' },
  { n: '02', t: 'Planning', d: 'Scope, timeline and pricing get fixed in writing before any work begins.' },
  { n: '03', t: 'Design', d: 'We map the structure and interface before a single line of code is written.' },
  { n: '04', t: 'Development', d: 'Engineers build the system, with weekly progress updates so nothing is a surprise.' },
  { n: '05', t: 'Testing', d: 'The system is reviewed and checked against the original requirements before it goes live.' },
  { n: '06', t: 'Deployment', d: 'We move the system into production and confirm it runs as intended.' },
  { n: '07', t: 'Support', d: 'Training and documentation come standard, plus a year of free updates and support.' },
];

export function CompanyProfilePDF({ settings }: { settings?: any }) {
  return (
    <Document title="KVL Business Solutions — Company Profile" author="KVL Business Solutions">
      <CoverPage
        tag="Company Profile"
        title="Who We Are, What We Do, and How We Work"
        subtitle="A digital transformation and business automation partner, founded 2015 in Patna, Bihar, India."
        settings={settings}
      />

      <ContentPage tag="Company Profile" settings={settings}>
        <SectionHeading eyebrow="Overview" title="Who We Are" />
        <Para>
          KVL Business Solutions is a digital transformation and business automation partner, founded in 2015 in Patna, Bihar, India.
          We combine enterprise software engineering with infrastructure, GPS and industrial systems, civil engineering and digital
          marketing — delivered by one accountable team instead of five disconnected vendors.
        </Para>

        <View style={styles.statsRow}>
          <StatBox value="14+" label="Services Offered" color={COLORS.goldDark} />
          <StatBox value="2015" label="Founded" color={COLORS.goldDark} />
          <StatBox value="MSME" label="Registered" color={COLORS.goldDark} />
          <StatBox value="NDA" label="On Request" color={COLORS.goldDark} />
        </View>

        <SectionHeading eyebrow="Direction" title="Our Mission" />
        <Para>
          Give Indian businesses access to enterprise-grade technology — the systems large companies use, built for businesses of any size.
        </Para>

        <SectionHeading eyebrow="Commitment" title="Our Promise" />
        <Para>
          A 1-hour response, transparent fixed pricing, an NDA on request before we discuss your project, and support that doesn&apos;t
          end when the invoice is paid.
        </Para>

        <SectionHeading eyebrow="Capabilities" title="What We Do" />
        <View style={styles.pillsWrap}>
          {services.map(s => <Pill key={s.slug} label={s.name} color={s.color} />)}
        </View>
      </ContentPage>

      <ContentPage tag="Company Profile" settings={settings}>
        <SectionHeading eyebrow="Delivery" title="How We Work" />
        <Para>
          Scope, timeline and pricing are fixed in writing before any work begins, with weekly progress updates during development
          and a year of free updates and support after launch.
        </Para>
        <View style={styles.processRow}>
          {PROCESS.map(p => (
            <View key={p.n} style={styles.processStep} wrap={false}>
              <Text style={styles.processNum}>{p.n}</Text>
              <Text style={styles.processTitle}>{p.t}</Text>
              <Text style={styles.processDesc}>{p.d}</Text>
            </View>
          ))}
        </View>

        <SectionHeading eyebrow="Trust" title="Certifications" />
        <Para>
          MSME registration (Government of India), formalized in 2023. An NDA is available on request before any project discussion.
        </Para>

        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaTitle}>Ready to talk?</Text>
          <Text style={styles.ctaDesc}>
            Book a free strategy call at kvlbusinesssolutions.com/book-demo, or message us on WhatsApp — we&apos;ll scope your
            project and send a fixed, transparent quote before any work begins.
          </Text>
        </View>
      </ContentPage>
    </Document>
  );
}
