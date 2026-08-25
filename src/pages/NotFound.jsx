import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300"
      style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <Navbar showSearch={false} />

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-6">
        {/* Big teal 404 */}
        <div className="relative select-none">
          <p className="text-[10rem] font-black leading-none"
            style={{ color: 'var(--bg-surface)', userSelect: 'none' }}>
            404
          </p>
          <p className="absolute inset-0 flex items-center justify-center text-[10rem] font-black leading-none"
            style={{
              WebkitTextStroke: '3px #016764',
              color: 'transparent',
              userSelect: 'none',
            }}>
            404
          </p>
        </div>

        <div className="space-y-2 max-w-sm">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Page not found
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/"
            className="font-semibold rounded-xl px-6 py-2.5 text-sm text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#016764,#001E1E)' }}>
            Go Home
          </Link>
          <Link to="/search?location=South Africa"
            className="font-semibold rounded-xl px-6 py-2.5 text-sm transition-colors"
            style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  )
}
