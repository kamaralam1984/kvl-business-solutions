import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Auto-generated PNG logo with transparent background
// Usage:
//   /logo                → 800×400 horizontal
//   /logo?type=stacked   → 600×600 square stacked
//   /logo?type=mark      → 400×400 symbol only
//   /logo?theme=light    → white text (for dark backgrounds)
//   /logo?theme=dark     → dark text (for light backgrounds)
//   /logo?theme=brand    → blue gradient (default)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = url.searchParams.get('type') || 'horizontal';
  const theme = url.searchParams.get('theme') || 'brand';

  const colors = {
    brand: { main: '#3b82f6', accent: '#1d4ed8', sub: '#64748b', dot: '#3b82f6' },
    light: { main: '#ffffff', accent: '#ffffff', sub: '#cbd5e1', dot: '#3b82f6' },
    dark:  { main: '#0f172a', accent: '#1d4ed8', sub: '#475569', dot: '#1d4ed8' },
  };
  const c = colors[theme as keyof typeof colors] || colors.brand;

  if (type === 'mark') {
    return new ImageResponse(
      (
        <div style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'transparent', fontFamily: 'sans-serif',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 180, fontWeight: 900, color: c.main, letterSpacing: 4, lineHeight: 1 }}>K</span>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: c.dot }} />
            <span style={{ fontSize: 180, fontWeight: 900, color: c.main, letterSpacing: 4, lineHeight: 1 }}>V</span>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: c.dot }} />
            <span style={{ fontSize: 180, fontWeight: 900, color: c.main, letterSpacing: 4, lineHeight: 1 }}>L</span>
          </div>
          <div style={{ fontSize: 22, color: c.sub, letterSpacing: 8, marginTop: 24, fontWeight: 700 }}>BUSINESS</div>
        </div>
      ),
      { width: 400, height: 400 }
    );
  }

  if (type === 'stacked') {
    return new ImageResponse(
      (
        <div style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'transparent', fontFamily: 'sans-serif',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 200, fontWeight: 900, color: c.main, letterSpacing: 4, lineHeight: 1 }}>K</span>
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: c.dot }} />
            <span style={{ fontSize: 200, fontWeight: 900, color: c.main, letterSpacing: 4, lineHeight: 1 }}>V</span>
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: c.dot }} />
            <span style={{ fontSize: 200, fontWeight: 900, color: c.main, letterSpacing: 4, lineHeight: 1 }}>L</span>
          </div>
          <div style={{ fontSize: 34, color: c.sub, letterSpacing: 12, marginTop: 30, fontWeight: 700 }}>
            BUSINESS SOLUTIONS
          </div>
          <div style={{ fontSize: 16, color: c.sub, letterSpacing: 6, marginTop: 16, fontWeight: 500, opacity: 0.7 }}>
            NEXT-GEN INDIA
          </div>
        </div>
      ),
      { width: 600, height: 600 }
    );
  }

  // Default: horizontal
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 60,
        background: 'transparent', fontFamily: 'sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 220, fontWeight: 900, color: c.main, letterSpacing: 4, lineHeight: 1 }}>K</span>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: c.dot }} />
          <span style={{ fontSize: 220, fontWeight: 900, color: c.main, letterSpacing: 4, lineHeight: 1 }}>V</span>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: c.dot }} />
          <span style={{ fontSize: 220, fontWeight: 900, color: c.main, letterSpacing: 4, lineHeight: 1 }}>L</span>
        </div>
        <div style={{ fontSize: 36, color: c.sub, letterSpacing: 18, marginTop: 14, fontWeight: 700 }}>
          BUSINESS SOLUTIONS
        </div>
      </div>
    ),
    { width: 800, height: 400 }
  );
}
