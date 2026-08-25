import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ListingCard from '../components/ListingCard.jsx'
import { listings } from '../data/listings.js'

const filters = ['Free cancellation', 'Type of place', 'Price', 'Instant Book', 'More filters']

export default function SearchResults() {
  const [params] = useSearchParams()
  const location = params.get('location') || 'Bordeaux'

  return (
    <div>
      <Navbar />
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center gap-4 text-sm text-gray-700">
          {filters.map((f) => (
            <button key={f} className="flex items-center gap-1 border border-gray-300 rounded-full px-4 py-2 hover:border-gray-900">
              {f}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <p className="text-sm text-gray-500 mb-4">200+ stays in {location}</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} layout="row" />
            ))}
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-6 rounded-xl overflow-hidden h-[540px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
              Map view
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}