import sharp from 'sharp';
import { Document, View, Text, Image as PdfImage, StyleSheet, CoverPage, ContentPage, SectionHeading, Para, Pill, COLORS } from './PdfShell';
import { caseStudies } from '@/lib/data/case-studies';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kvlbusinesssolutions.com';
const absoluteUrl = (src: string) => (src.startsWith('http') ? src : `${SITE}${src}`);

// The source hero images (real screenshots + branded banner graphics) run
// 1-2MB each as PNGs — embedding 8 of those verbatim would make the emailed
// PDF ~9MB. Downscaling + re-encoding as JPEG before handing them to
// react-pdf keeps the whole document a few hundred KB instead.
async function compressedHero(src: string): Promise<Buffer | null> {
  try {
    const res = await fetch(absoluteUrl(src));
    if (!res.ok) return null;
    const bytes = Buffer.from(await res.arrayBuffer());
    return await sharp(bytes).resize({ width: 900, withoutEnlargement: true }).jpeg({ quality: 78 }).toBuffer();
  } catch {
    return null;
  }
}

const styles = StyleSheet.create({
  heroWrap: { height: 180, borderRadius: 8, backgroundColor: COLORS.ink, marginBottom: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  hero: { width: '100%', height: '100%', objectFit: 'contain' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  liveDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#16a34a' },
  liveBadge: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#16a34a', letterSpacing: 1, textTransform: 'uppercase' },
  category: { fontSize: 8.5, color: COLORS.muted },
  tagline: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: COLORS.ink, marginBottom: 10 },
  label: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: COLORS.goldDark, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3, marginTop: 8 },
  pillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 4 },
  urlText: { fontSize: 8.5, color: COLORS.goldDark },
});

export async function PortfolioPDF({ settings }: { settings?: any }) {
  const heroes = await Promise.all(caseStudies.map(c => compressedHero(c.images.hero)));

  return (
    <Document title="KVL Business Solutions — Portfolio" author="KVL Business Solutions">
      <CoverPage
        tag="Portfolio"
        title="Real Products, Live in Production"
        subtitle={`Every project in this portfolio is a real, working product built by KVL Business Solutions — ${caseStudies.length} of them, verifiable today, not mockups or representative examples.`}
        settings={settings}
      />

      {caseStudies.map((c, i) => (
        <ContentPage key={c.slug} tag="Portfolio" settings={settings}>
          {heroes[i] && (
            <View style={styles.heroWrap}>
              <PdfImage style={styles.hero} src={heroes[i] as Buffer} />
            </View>
          )}

          <View style={styles.metaRow}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadge}>Live</Text>
            <Text style={styles.category}>· {c.industry} · {c.businessCategory}</Text>
          </View>
          <Text style={styles.urlText}>{c.url.replace(/^https?:\/\//, '')}</Text>

          <SectionHeading title={c.name} />
          <Text style={styles.tagline}>{c.tagline}</Text>

          <Text style={styles.label}>Business Challenge</Text>
          <Para>{c.challenge.body}</Para>

          <Text style={styles.label}>Our Solution</Text>
          <Para>{c.solution.body}</Para>

          <Text style={styles.label}>Technology</Text>
          <View style={styles.pillsWrap}>
            {c.tech.map(t => <Pill key={t} label={t} />)}
          </View>
        </ContentPage>
      ))}
    </Document>
  );
}
