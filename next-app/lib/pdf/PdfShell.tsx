import { Document, Page, View, Text, Image, StyleSheet, Svg, Path } from '@react-pdf/renderer';
import { COLORS, PAGE_PADDING } from './theme';

type Settings = { phone?: string; email?: string; addressLine1?: string; addressLine2?: string };

export function contactLine(settings?: Settings) {
  const s = settings || {};
  return {
    phone: s.phone || '+91 99420 00413',
    email: s.email || 'info@kvlbusinesssolutions.com',
    address: [s.addressLine1, s.addressLine2].filter(Boolean).join(', ') || 'Patna, Sultanganj, Bihar, India',
  };
}

const styles = StyleSheet.create({
  cover: { backgroundColor: COLORS.ink, padding: 0, fontFamily: 'Helvetica' },
  coverTopBar: { height: 6, backgroundColor: COLORS.gold },
  coverBody: { flex: 1, justifyContent: 'center', paddingHorizontal: 56 },
  wordmark: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: COLORS.gold, letterSpacing: 6 },
  wordmarkSub: { fontSize: 8, color: COLORS.white, letterSpacing: 4, marginTop: 4, opacity: 0.7 },
  coverTag: {
    fontSize: 10, fontFamily: 'Helvetica-Bold', color: COLORS.ink, backgroundColor: COLORS.gold,
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4,
    letterSpacing: 2, marginTop: 40, marginBottom: 20, textTransform: 'uppercase',
  },
  coverTitle: { fontSize: 34, fontFamily: 'Helvetica-Bold', color: COLORS.white, lineHeight: 1.15, marginBottom: 14 },
  coverSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 380 },
  coverFooter: {
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 56, paddingVertical: 22,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  coverFooterText: { fontSize: 8.5, color: 'rgba(255,255,255,0.55)' },

  page: { fontFamily: 'Helvetica', color: COLORS.text, paddingTop: PAGE_PADDING, paddingBottom: 54, paddingHorizontal: PAGE_PADDING, fontSize: 10 },
  chromeHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: COLORS.gold, paddingBottom: 10, marginBottom: 20,
  },
  chromeWordmark: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: COLORS.ink, letterSpacing: 3 },
  chromeTag: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.goldDark, letterSpacing: 1.5, textTransform: 'uppercase' },
  footer: {
    position: 'absolute', bottom: 20, left: PAGE_PADDING, right: PAGE_PADDING,
    borderTopWidth: 0.5, borderTopColor: COLORS.border, paddingTop: 8,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  footerText: { fontSize: 7.5, color: COLORS.muted },

  heading: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: COLORS.ink, marginBottom: 3 },
  eyebrow: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.goldDark, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  headingBar: { width: 28, height: 3, backgroundColor: COLORS.gold, marginTop: 8, marginBottom: 14, borderRadius: 2 },

  para: { fontSize: 10, color: COLORS.text, lineHeight: 1.7, marginBottom: 10 },

  pill: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: COLORS.white, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },

  statBox: { flex: 1, borderRadius: 8, padding: 14, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgSoft },
  statValue: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  statLabel: { fontSize: 8, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
});

export function CoverPage({ tag, title, subtitle, settings }: { tag: string; title: string; subtitle: string; settings?: Settings }) {
  const c = contactLine(settings);
  const generatedOn = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <Page size="A4" style={styles.cover}>
      <View style={styles.coverTopBar} fixed />
      <View style={styles.coverBody}>
        <Text style={styles.wordmark}>K · V · L</Text>
        <Text style={styles.wordmarkSub}>BUSINESS SOLUTIONS</Text>
        <Text style={styles.coverTag}>{tag}</Text>
        <Text style={styles.coverTitle}>{title}</Text>
        <Text style={styles.coverSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.coverFooter}>
        <Text style={styles.coverFooterText}>{c.address}</Text>
        <Text style={styles.coverFooterText}>Generated {generatedOn}</Text>
      </View>
    </Page>
  );
}

export function ContentPage({ tag, children, settings }: { tag: string; children: React.ReactNode; settings?: Settings }) {
  const c = contactLine(settings);
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.chromeHeader} fixed>
        <Text style={styles.chromeWordmark}>K · V · L BUSINESS SOLUTIONS</Text>
        <Text style={styles.chromeTag}>{tag}</Text>
      </View>
      {children}
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>kvlbusinesssolutions.com · {c.email} · {c.phone}</Text>
        <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </Page>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <View>
      {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.headingBar} />
    </View>
  );
}

export function Para({ children }: { children: React.ReactNode }) {
  return <Text style={styles.para}>{children}</Text>;
}

export function Pill({ label, color = COLORS.goldDark }: { label: string; color?: string }) {
  return <Text style={[styles.pill, { backgroundColor: color }]}>{label}</Text>;
}

export function StatBox({ value, label, color = COLORS.ink }: { value: string; label: string; color?: string }) {
  return (
    <View style={styles.statBox} wrap={false}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export { Document, Page, View, Text, Image, StyleSheet, Svg, Path, styles as pdfStyles };
export { COLORS };
