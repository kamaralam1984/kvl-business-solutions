import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';
export const runtime = 'edge';

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff',
        fontSize: 16, fontWeight: 900, letterSpacing: 1, fontFamily: 'sans-serif',
      }}>
        K
      </div>
    ),
    { ...size }
  );
}
