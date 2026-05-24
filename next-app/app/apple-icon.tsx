import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff',
        fontFamily: 'sans-serif', borderRadius: 32,
      }}>
        <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: 6, lineHeight: 1 }}>KVL</div>
        <div style={{ fontSize: 14, letterSpacing: 4, opacity: 0.7, marginTop: 12 }}>BUSINESS</div>
      </div>
    ),
    { ...size }
  );
}
