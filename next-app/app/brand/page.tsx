import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from '@/components/shared/PageHero';
import { Download, FileImage, Palette } from 'lucide-react';

export const metadata = {
  title: 'Brand Assets — Logo & Media Kit',
  description: 'Download official KVL Business Solutions logos and brand colors in multiple formats — for partner sites, press, presentations and social media.',
};

const variants = [
  // SVG (vector — best quality, scales infinitely). Rendered `unoptimized`
  // since next/image's built-in optimizer blocks SVG output unless
  // `images.dangerouslyAllowSVG` is enabled — these are small local static
  // assets, so skipping the optimizer costs nothing.
  { name: 'Horizontal · Brand colors', href: '/logo.svg',          preview: '/logo.svg',          bg: 'bg-white',  format: 'SVG · Transparent', w: 240, h: 120, svg: true },
  { name: 'Horizontal · Light (for dark bg)', href: '/logo-light.svg', preview: '/logo-light.svg', bg: 'bg-slate-900', format: 'SVG · Transparent', w: 240, h: 120, svg: true },
  { name: 'Horizontal · Dark (for light bg)', href: '/logo-dark.svg',  preview: '/logo-dark.svg',  bg: 'bg-white',  format: 'SVG · Transparent', w: 240, h: 120, svg: true },
  { name: 'Stacked · Square',          href: '/logo-stacked.svg', preview: '/logo-stacked.svg',   bg: 'bg-white',  format: 'SVG · Transparent', w: 180, h: 180, svg: true },
  { name: 'Mark · Symbol only',        href: '/logo-mark.svg',    preview: '/logo-mark.svg',      bg: 'bg-white',  format: 'SVG · Transparent', w: 180, h: 180, svg: true },

  // PNG (auto-generated, transparent) — dimensions match the real sizes
  // returned by app/logo/route.tsx for each type.
  { name: 'Horizontal · Brand · PNG', href: '/logo?type=horizontal&theme=brand', preview: '/logo?type=horizontal&theme=brand', bg: 'bg-white',     format: 'PNG · Transparent · 800×400', w: 800, h: 400, svg: false },
  { name: 'Horizontal · Light · PNG', href: '/logo?type=horizontal&theme=light', preview: '/logo?type=horizontal&theme=light', bg: 'bg-slate-900', format: 'PNG · Transparent · 800×400', w: 800, h: 400, svg: false },
  { name: 'Horizontal · Dark · PNG',  href: '/logo?type=horizontal&theme=dark',  preview: '/logo?type=horizontal&theme=dark',  bg: 'bg-white',     format: 'PNG · Transparent · 800×400', w: 800, h: 400, svg: false },
  { name: 'Stacked · Brand · PNG',    href: '/logo?type=stacked&theme=brand',    preview: '/logo?type=stacked&theme=brand',    bg: 'bg-white',     format: 'PNG · Transparent · 600×600', w: 600, h: 600, svg: false },
  { name: 'Mark · Brand · PNG',       href: '/logo?type=mark&theme=brand',       preview: '/logo?type=mark&theme=brand',       bg: 'bg-white',     format: 'PNG · Transparent · 400×400', w: 400, h: 400, svg: false },
];

const colors = [
  { name: 'Primary Blue', hex: '#3b82f6', use: 'Main brand color, CTAs, headings' },
  { name: 'Deep Blue',    hex: '#1d4ed8', use: 'Gradient end, accents' },
  { name: 'Slate Dark',   hex: '#0f172a', use: 'Text on light bg, dark backgrounds' },
  { name: 'Slate Mid',    hex: '#64748b', use: 'Subtle text, descriptions' },
  { name: 'Orange',       hex: '#f97316', use: 'Accent, highlights, "new" badges' },
  { name: 'Green',        hex: '#22c55e', use: 'Success, "live" indicators' },
];

export default function BrandPage() {
  return (
    <>
      <PageHero
        eyebrow="BRAND ASSETS"
        title="Logo &"
        accent="brand kit"
        description="Download KVL logos in multiple formats. All transparent backgrounds — use freely on partner sites, presentations, and social media."
        breadcrumb="Brand"
      />

      <section className="section">
        <div className="container">
          <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
            <FileImage className="w-6 h-6 text-primary" /> Logo variants
          </h2>
          <p className="text-text2 text-sm mb-8">10 variants — SVG (vector) and PNG (transparent). Right-click → "Save image as" or click Download.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {variants.map(v => (
              <div key={v.name} className="card-base overflow-hidden">
                <div className={`h-40 ${v.bg} grid place-items-center p-4 relative border-b border-tint`}>
                  {/* Checkerboard pattern indicates transparency */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'repeating-conic-gradient(#aaa 0% 25%, transparent 0% 50%) 50% / 16px 16px',
                  }} />
                  <Image
                    src={v.preview}
                    alt={v.name}
                    width={v.w}
                    height={v.h}
                    unoptimized={v.svg}
                    className="max-h-32 max-w-full w-auto h-auto object-contain relative z-10"
                  />
                </div>
                <div className="p-4">
                  <div className="font-semibold text-sm">{v.name}</div>
                  <div className="text-[10px] text-text2 mt-0.5 mb-3">{v.format}</div>
                  <a href={v.href} download className="btn btn-primary w-full justify-center text-xs">
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
            <Palette className="w-6 h-6 text-primary" /> Brand colors
          </h2>
          <p className="text-text2 text-sm mb-8">Official color palette. Copy HEX codes for design work.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {colors.map(c => (
              <div key={c.hex} className="card-base overflow-hidden">
                <div className="h-24" style={{ backgroundColor: c.hex }} />
                <div className="p-4">
                  <div className="font-bold">{c.name}</div>
                  <div className="font-mono text-xs text-text2 mt-0.5">{c.hex.toUpperCase()}</div>
                  <div className="text-xs text-text2 mt-2">{c.use}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-3xl">
          <div className="card-base p-7">
            <h2 className="text-xl font-bold mb-4">Usage guidelines</h2>
            <ul className="space-y-2 text-sm text-text2">
              <li>✓ Use the <b>brand color version</b> on white or light backgrounds.</li>
              <li>✓ Use the <b>light (white) version</b> on dark backgrounds or photos.</li>
              <li>✓ Use the <b>dark version</b> on light printed materials (newspaper, etc.).</li>
              <li>✓ Keep minimum clear space around the logo (at least 1× the K-letter height).</li>
              <li>✓ Always download the original — don't take screenshots.</li>
              <li>✗ Don't stretch, recolor, or add effects to the logo.</li>
              <li>✗ Don't remove "BUSINESS SOLUTIONS" from the horizontal versions.</li>
              <li>✗ Don't rotate or skew the logo.</li>
            </ul>

            <div className="mt-6 pt-6 border-t border-tint">
              <p className="text-sm text-text2 mb-3">Need a custom format or have brand questions?</p>
              <Link href="/contact" className="btn btn-primary">Contact our team</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
