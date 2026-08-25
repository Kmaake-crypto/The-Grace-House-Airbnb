import { Link } from 'react-router-dom'

/**
 * Format a price amount using the listing's currency.
 * If the listing already has a priceFormatted string (from Tapline), use it.
 * Otherwise format the number with the correct currency symbol.
 */
function formatPrice(listing) {
  if (listing.priceFormatted) return listing.priceFormatted
  if (listing.currency === 'ZAR') return `R ${Number(listing.price).toLocaleString('en-ZA')}`
  return `$${listing.price}`
}

export default function ListingCard({ listing, layout = 'row' }) {
  const displayPrice = formatPrice(listing)

  if (layout === 'row') {
    return (
      <Link
        to={`/listing/${listing.id}`}
        className="flex gap-4 py-5 border-b border-gray-200 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
      >
        <img
          src={listing.image}
          alt={listing.title}
          className="w-40 h-32 object-cover rounded-lg shrink-0"
        />
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-gray-500">Entire home in {listing.location}</p>
          <h3 className="font-semibold text-gray-900">{listing.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {listing.guests} guests &middot; Entire Home &middot; {listing.beds} beds &middot;{' '}
            {listing.baths} bath
          </p>
          <p className="text-xs text-gray-500">Wifi &middot; Kitchen &middot; Free Parking</p>
          <div className="mt-auto flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#E31C5F">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
              {listing.rating.toFixed(1)} ({listing.reviews} reviews)
            </span>
            <span className="font-semibold">
              {displayPrice}{' '}
              <span className="font-normal text-gray-500">/night</span>
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/listing/${listing.id}`} className="block group">
      <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="mt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{listing.title}</h3>
          {listing.rating > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-gray-700 shrink-0 ml-2">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#111">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
              </svg>
              {listing.rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">{listing.location}</p>
        <p className="text-sm font-semibold mt-1">
          {displayPrice}{' '}
          <span className="font-normal text-gray-500 text-xs">/night</span>
        </p>
      </div>
    </Link>
  )
}
