import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const title = url.searchParams.get('title') || 'KVL Business Solutions';
  const subtitle = url.searchParams.get('subtitle') || 'Enterprise software, GPS, automation — India\'s next-gen business tech';

  return new ImageResponse(
    (
      <div style={{
        height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'center', padding: 80,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1d4ed8 100%)',
        fontFamily: 'sans-serif', color: '#fff',
      }}>
        <div style={{ fontSize: 28, letterSpacing: 6, opacity: 0.7, marginBottom: 16 }}>K·V·L</div>
        <div style={{ fontSize: 14, letterSpacing: 4, opacity: 0.5, marginBottom: 40 }}>BUSINESS SOLUTIONS</div>
        <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.1, marginBottom: 20, maxWidth: 1000 }}>{title}</div>
        <div style={{ fontSize: 28, opacity: 0.8, maxWidth: 900, lineHeight: 1.4 }}>{subtitle}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 'auto', paddingTop: 40, fontSize: 18, opacity: 0.6 }}>
          <span>kvlsolutions.in</span>
          <span>·</span>
          <span>Pune, India</span>
          <span>·</span>
          <span>1000+ businesses trust KVL</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
