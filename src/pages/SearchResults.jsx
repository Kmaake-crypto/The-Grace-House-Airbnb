import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ListingCard from '../components/ListingCard.jsx'
import { useTaplineListings } from '../hooks/useTaplineListings.js'

const filters = ['Free cancellation', 'Type of place', 'Price', 'Instant Book', 'More filters']

// South African city suggestions shown in the sidebar
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
    <div>
      <Navbar />

      {/* Filter bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-4 text-sm text-gray-700">
          {filters.map((f) => (
            <button
              key={f}
              className="flex items-center gap-1 border border-gray-300 rounded-full px-4 py-2 hover:border-gray-900"
            >
              {f}
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Result count + API badge */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {loading
              ? 'Searching South African listings…'
              : `${listings.length}+ stays in ${location}`}
          </p>
          <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 font-medium">
            🇿🇦 Prices in ZAR (R)
          </span>
        </div>

        {/* Error banner — non-blocking, fallback data still shown */}
        {error && (
          <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3">
            Live listings unavailable — showing curated South African properties.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Listing list */}
          <div className="lg:col-span-2">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} layout="row" />
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-6">
              {/* Map placeholder */}
              <div className="rounded-xl overflow-hidden h-72 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                Map view
              </div>

              {/* SA destination quick-links */}
              <div className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-3">
                  Explore South Africa
                </h3>
                <ul className="space-y-2">
                  {SA_DESTINATIONS.map((dest) => (
                    <li key={dest}>
                      <a
                        href={`/search?location=${encodeURIComponent(dest)}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-brand hover:underline"
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
        <div key={i} className="flex gap-4 py-5 border-b border-gray-200 animate-pulse">
          <div className="w-40 h-32 bg-gray-200 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-1/4 mt-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}
