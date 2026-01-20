import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      <div className="text-center">
        <h1 className="display-1 fw-bold mb-3" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          404
        </h1>
        <h2 className="h3 mb-4" style={{ color: '#0E0C1D' }}>Page Not Found</h2>
        <p className="text-muted mb-4">The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="btn btn-lg px-5 py-3 fw-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '10px',
          }}
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}
