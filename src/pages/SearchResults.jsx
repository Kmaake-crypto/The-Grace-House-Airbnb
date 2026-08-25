import { useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import Navbar from '../components/Navbar.jsx'
import ListingCard from '../components/ListingCard.jsx'
import { useTaplineListings } from '../hooks/useTaplineListings.js'

const filters = ['Free cancellation', 'Type of place', 'Price', 'Instant Book', 'More filters']

/**
 * Each destination has:
 *  - label      displayed in the sidebar
 *  - query      passed to the URL / Tapline API
 *  - keyword    used to filter fallback listings by location string
 *  - bbox       OpenStreetMap bounding box  left,bottom,right,top  (lon/lat)
 *  - mapUrl     OSM embed URL centred on the city
 */
const SA_DESTINATIONS = [
  {
    label:   'Cape Town',
    query:   'Cape Town, South Africa',
    keyword: 'cape town',
    mapUrl:  'https://www.openstreetmap.org/export/embed.html?bbox=18.3556,-34.1792,18.6702,-33.8386&layer=mapnik',
  },
  {
    label:   'Johannesburg',
    query:   'Johannesburg, South Africa',
    keyword: 'johannesburg',
    mapUrl:  'https://www.openstreetmap.org/export/embed.html?bbox=27.9141,-26.3526,28.1641,-26.1026&layer=mapnik',
  },
  {
    label:   'Durban',
    query:   'Durban, South Africa',
    keyword: 'durban',
    mapUrl:  'https://www.openstreetmap.org/export/embed.html?bbox=30.9073,-29.9783,31.1073,-29.7783&layer=mapnik',
  },
  {
    label:   'Stellenbosch',
    query:   'Stellenbosch, South Africa',
    keyword: 'stellenbosch',
    mapUrl:  'https://www.openstreetmap.org/export/embed.html?bbox=18.7804,-33.9870,18.9804,-33.7870&layer=mapnik',
  },
  {
    label:   'Knysna',
    query:   'Knysna, South Africa',
    keyword: 'knysna',
    mapUrl:  'https://www.openstreetmap.org/export/embed.html?bbox=23.0033,-34.0897,23.1033,-34.0197&layer=mapnik',
  },
  {
    label:   'Kruger Park',
    query:   'Kruger Park, South Africa',
    keyword: 'kruger',
    mapUrl:  'https://www.openstreetmap.org/export/embed.html?bbox=30.8881,-25.5223,32.0881,-22.3223&layer=mapnik',
  },
]

/** Default map — full SA overview */
const SA_DEFAULT_MAP =
  'https://www.openstreetmap.org/export/embed.html?bbox=16.4581,-34.8355,32.8920,-22.1255&layer=mapnik'

/** Return the keyword that matches the current URL location param */
function getActiveKeyword(locationParam) {
  if (!locationParam) return null
  const lower = locationParam.toLowerCase()
  const match = SA_DESTINATIONS.find((d) => lower.includes(d.keyword))
  return match ? match.keyword : null
}

export default function SearchResults() {
  const [params] = useSearchParams()
  const navigate  = useNavigate()
  const locationParam = params.get('location') || 'South Africa'

  const { listings, loading, error } = useTaplineListings(locationParam)

  // Track which city is selected for the map
  const [activeKeyword, setActiveKeyword] = useState(() => getActiveKeyword(locationParam))
  const [mapUrl, setMapUrl] = useState(() => {
    const match = SA_DESTINATIONS.find((d) =>
      locationParam.toLowerCase().includes(d.keyword)
    )
    return match ? match.mapUrl : SA_DEFAULT_MAP
  })

  /** Filter fallback listings to only those matching the active city */
  const filteredListings = useMemo(() => {
    if (!activeKeyword) return listings
    return listings.filter((l) =>
      l.location.toLowerCase().includes(activeKeyword)
    )
  }, [listings, activeKeyword])

  function handleDestinationClick(dest) {
    setActiveKeyword(dest.keyword)
    setMapUrl(dest.mapUrl)
    navigate(`/search?location=${encodeURIComponent(dest.query)}`)
  }

  const displayCount = filteredListings.length

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
        {/* Count + ZAR badge */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {loading
              ? 'Searching South African listings…'
              : `${displayCount} stay${displayCount !== 1 ? 's' : ''} in ${locationParam}`}
          </p>
          <span
            className="text-xs font-medium rounded-full px-3 py-1"
            style={{ background: '#016764', color: '#fff' }}
          >
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

        {/* No results for this city */}
        {!loading && displayCount === 0 && (
          <div
            className="mb-4 text-sm rounded-lg px-4 py-6 text-center"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)', background: 'var(--bg-surface)' }}
          >
            No listings found for <strong style={{ color: 'var(--text-primary)' }}>{locationParam}</strong>.
            Try another destination below.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Listing list ── */}
          <div className="lg:col-span-2">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              filteredListings.map((l) => (
                <ListingCard key={l.id} listing={l} layout="row" />
              ))
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-5">

              {/* Real OSM map iframe */}
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                {/* City label bar */}
                <div
                  className="flex items-center justify-between px-3 py-2 text-xs font-semibold"
                  style={{
                    background: 'linear-gradient(135deg,#016764,#001E1E)',
                    color: '#fff',
                  }}
                >
                  <span>
                    📍{' '}
                    {activeKeyword
                      ? SA_DESTINATIONS.find((d) => d.keyword === activeKeyword)?.label
                      : 'South Africa'}
                  </span>
                  <a
                    href={`https://www.openstreetmap.org/#map=6/-29/25`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    Open full map ↗
                  </a>
                </div>

                <iframe
                  key={mapUrl}          /* key forces reload when URL changes */
                  src={mapUrl}
                  title="South Africa Map"
                  width="100%"
                  height="280"
                  style={{ display: 'block', border: 'none' }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              {/* Destination quick-links */}
              <div
                className="rounded-xl p-4"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
              >
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                  Explore South Africa
                </h3>
                <ul className="space-y-1">
                  {SA_DESTINATIONS.map((dest) => {
                    const isActive = activeKeyword === dest.keyword
                    return (
                      <li key={dest.label}>
                        <button
                          onClick={() => handleDestinationClick(dest)}
                          className="w-full flex items-center gap-2 text-sm rounded-lg px-3 py-2 transition-all text-left"
                          style={
                            isActive
                              ? { background: 'linear-gradient(135deg,#016764,#001E1E)', color: '#fff' }
                              : { color: 'var(--text-muted)', background: 'transparent' }
                          }
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.color = '#016764'
                              e.currentTarget.style.background = 'rgba(1,103,100,0.08)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.color = 'var(--text-muted)'
                              e.currentTarget.style.background = 'transparent'
                            }
                          }}
                        >
                          <span>{isActive ? '📌' : '📍'}</span>
                          <span className="font-medium">{dest.label}</span>
                          {isActive && (
                            <span className="ml-auto text-xs opacity-70">
                              {filteredListings.length} stay{filteredListings.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </button>
                      </li>
                    )
                  })}

                  {/* Show all */}
                  <li className="pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => {
                        setActiveKeyword(null)
                        setMapUrl(SA_DEFAULT_MAP)
                        navigate('/search?location=South Africa')
                      }}
                      className="w-full flex items-center gap-2 text-sm rounded-lg px-3 py-2 transition-all text-left"
                      style={
                        !activeKeyword
                          ? { background: 'linear-gradient(135deg,#016764,#001E1E)', color: '#fff' }
                          : { color: 'var(--text-muted)', background: 'transparent' }
                      }
                      onMouseEnter={(e) => {
                        if (activeKeyword) {
                          e.currentTarget.style.color = '#016764'
                          e.currentTarget.style.background = 'rgba(1,103,100,0.08)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeKeyword) {
                          e.currentTarget.style.color = 'var(--text-muted)'
                          e.currentTarget.style.background = 'transparent'
                        }
                      }}
                    >
                      <span>🗺️</span>
                      <span className="font-medium">All South Africa</span>
                    </button>
                  </li>
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
        <div
          key={i}
          className="flex gap-4 py-5 animate-pulse"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
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
