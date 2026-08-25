import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ListingCard from '../components/ListingCard.jsx'
import { useTaplineListings } from '../hooks/useTaplineListings.js'

const filters = ['Free cancellation', 'Type of place', 'Price', 'Instant Book', 'More filters']

const SA_DESTINATIONS = [
  'Cape Town, South Africa',
  'Johannesburg, South Africa',
  'Durban, South Africa',
  'Stellenbosch, South Africa',
  'Knysna, South Africa',
  'Kruger Park, South Africa',
]

export default function SearchResults() {
  const [params] = useSearchParams()
  const location = params.get('location') || 'South Africa'
  const { listings, loading, error } = useTaplineListings(location)

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      <Navbar />

      {/* Filter bar */}
      <div style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-4 text-sm">
          {filters.map((f) => (
            <button
              key={f}
              className="flex items-center gap-1 rounded-full px-4 py-2 transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-primary)', background: 'var(--bg-card)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#016764'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {f}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Count + badge */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {loading ? 'Searching South African listings…' : `${listings.length}+ stays in ${location}`}
          </p>
          <span className="text-xs font-medium rounded-full px-3 py-1" style={{ background: '#016764', color: '#fff' }}>
            🇿🇦 Prices in ZAR (R)
          </span>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="mb-4 text-sm rounded-lg px-4 py-3"
            style={{ background: 'rgba(1,103,100,0.15)', border: '1px solid #016764', color: 'var(--text-primary)' }}
          >
            Live listings unavailable — showing curated South African properties.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Listings */}
          <div className="lg:col-span-2">
            {loading ? <LoadingSkeleton /> : listings.map((l) => (
              <ListingCard key={l.id} listing={l} layout="row" />
            ))}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <div
                className="rounded-xl h-72 flex items-center justify-center text-sm"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
              >
                Map view
              </div>

              <div
                className="rounded-xl p-4"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
              >
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  Explore South Africa
                </h3>
                <ul className="space-y-2">
                  {SA_DESTINATIONS.map((dest) => (
                    <li key={dest}>
                      <a
                        href={`/search?location=${encodeURIComponent(dest)}`}
                        className="flex items-center gap-2 text-sm transition-colors hover:underline"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#016764'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <span>📍</span>
                        {dest.replace(', South Africa', '')}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 py-5 animate-pulse" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-40 h-32 rounded-lg shrink-0" style={{ background: 'var(--bg-surface)' }} />
          <div className="flex-1 space-y-2">
            <div className="h-3 rounded w-1/3" style={{ background: 'var(--bg-surface)' }} />
            <div className="h-4 rounded w-2/3" style={{ background: 'var(--bg-surface)' }} />
            <div className="h-3 rounded w-1/2" style={{ background: 'var(--bg-surface)' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
