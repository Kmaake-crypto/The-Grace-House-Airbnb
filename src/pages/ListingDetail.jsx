import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useTaplineListing } from '../hooks/useTaplineListings.js'
import { fetchPrice } from '../services/taplineApi.js'
import { reviews } from '../data/listings.js'

const CURRENCY = 'ZAR'

/** Format a ZAR amount: R 1,234 */
function zarFormat(amount) {
  return `R ${Number(amount).toLocaleString('en-ZA')}`
}

export default function ListingDetail() {
  const { id } = useParams()
  const { listing, loading: listingLoading } = useTaplineListing(id)

  // Default date window: today + 7 nights
  const today = new Date()
  const checkinDate = today.toISOString().split('T')[0]
  const checkoutDate = new Date(today.getTime() + 7 * 86_400_000).toISOString().split('T')[0]
  const [nights] = useState(7)

  // Live pricing state
  const [livePrice, setLivePrice] = useState(null)
  const [priceLoading, setPriceLoading] = useState(false)

  useEffect(() => {
    if (!listing || String(listing.id).startsWith('sa-')) return

    let cancelled = false
    setPriceLoading(true)

    fetchPrice(listing.id, checkinDate, checkoutDate, listing.guests)
      .then((data) => {
        if (!cancelled) setLivePrice(data)
      })
      .catch((err) => {
        console.warn('Live price fetch failed:', err.message)
      })
      .finally(() => {
        if (!cancelled) setPriceLoading(false)
      })

    return () => { cancelled = true }
  }, [listing?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (listingLoading || !listing) {
    return (
      <div>
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-10">
          <ListingDetailSkeleton />
        </div>
      </div>
    )
  }

  // Pricing figures — prefer live Tapline price, fall back to static
  const nightlyRate = livePrice?.breakdown?.[0]?.unit_price?.amount ?? listing.price
  const nightlyFormatted = livePrice?.breakdown?.[0]?.unit_price?.formatted ?? listing.priceFormatted ?? zarFormat(listing.price)
  const subtotal = livePrice?.breakdown?.[0]?.total?.amount ?? nightlyRate * nights
  const subtotalFormatted = livePrice?.breakdown?.[0]?.total?.formatted ?? zarFormat(subtotal)

  // South African fee estimates in ZAR
  const cleaningFee = Math.round(nightlyRate * 0.15)
  const serviceFee = Math.round(subtotal * 0.12)
  const occupancyFee = Math.round(subtotal * 0.03)
  const total = subtotal + cleaningFee + serviceFee + occupancyFee

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-6">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{listing.title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              <span className="inline-flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#111">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                </svg>
                {listing.rating.toFixed(1)}
              </span>{' '}
              &middot; <span className="underline">{listing.reviews} reviews</span> &middot;{' '}
              <span className="underline">{listing.location}</span>
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold text-gray-700">
            <span className="underline cursor-pointer">Share</span>
            <span className="underline cursor-pointer">Save</span>
          </div>
        </div>

        {/* Photo gallery */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 mt-4 rounded-xl overflow-hidden h-96">
          <img
            src={listing.gallery[0]}
            alt={listing.title}
            className="col-span-2 row-span-2 w-full h-full object-cover"
          />
          {(listing.gallery.length > 1 ? listing.gallery.slice(1, 5) : Array(4).fill(listing.image)).map(
            (src, i) => (
              <img key={i} src={src} alt="" className="w-full h-full object-cover" />
            )
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
          {/* Left column */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {listing.type} hosted by {listing.host}
                </h2>
                <p className="text-sm text-gray-600">
                  {listing.guests} guests &middot; {listing.beds} bedroom &middot; {listing.beds} bed
                  &middot; {listing.baths} bath
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-300 shrink-0" />
            </div>

            {/* Highlights */}
            <div className="py-6 border-b border-gray-200 space-y-4">
              <div className="flex gap-4">
                <span>🏠</span>
                <div>
                  <p className="font-semibold text-sm">Entire home</p>
                  <p className="text-sm text-gray-500">You&apos;ll have the place to yourself</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span>✨</span>
                <div>
                  <p className="font-semibold text-sm">Enhanced Clean</p>
                  <p className="text-sm text-gray-500">
                    This host committed to Airbnb&apos;s 5-step enhanced cleaning process.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span>🔑</span>
                <div>
                  <p className="font-semibold text-sm">Self check-in</p>
                  <p className="text-sm text-gray-500">Check yourself in with the keypad.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span>📅</span>
                <div>
                  <p className="font-semibold text-sm">Free cancellation before check-in</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="py-6 border-b border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>
              <button className="text-sm font-semibold underline mt-2">Show more</button>
            </div>

            {/* Bedroom */}
            <div className="py-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Where you&apos;ll sleep</h3>
              <div className="w-56">
                <img
                  src={listing.gallery[1] ?? listing.image}
                  alt="Bedroom"
                  className="rounded-xl h-36 w-full object-cover"
                />
                <p className="text-sm font-semibold mt-2">Bedroom</p>
                <p className="text-xs text-gray-500">1 queen bed</p>
              </div>
            </div>

            {/* Amenities */}
            {listing.amenities?.length > 0 && (
              <div className="py-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">
                  {listing.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-3">
                      <span className="w-4 h-4 border border-gray-500 rounded-sm inline-block" />
                      {a}
                    </div>
                  ))}
                </div>
                <button className="border border-gray-900 rounded-lg px-4 py-2 text-sm font-semibold mt-4">
                  Show all amenities
                </button>
              </div>
            )}

            {/* Calendar */}
            <div className="py-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                {nights} nights in {listing.location.split(',')[0]}
              </h3>
              <MiniCalendar />
              <button className="text-sm font-semibold underline mt-2">Clear dates</button>
            </div>

            {/* Reviews */}
            <div className="py-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#111">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                </svg>
                {listing.rating.toFixed(1)} &middot; {listing.reviews} reviews
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {['Cleanliness', 'Accuracy', 'Communication', 'Location', 'Check-in', 'Value'].map(
                  (label) => (
                    <div key={label} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="w-20 shrink-0">{label}</span>
                      <span className="flex-1 h-1 bg-gray-800 rounded-full max-w-[120px]" />
                      <span>5.0</span>
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {reviews.map((r) => (
                  <div key={r.name}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-9 h-9 rounded-full bg-gray-300 inline-block" />
                      <div>
                        <p className="text-sm font-semibold">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">{r.text}</p>
                  </div>
                ))}
              </div>
              <button className="border border-gray-900 rounded-lg px-4 py-2 text-sm font-semibold mt-6">
                Show all {listing.reviews} reviews
              </button>
            </div>
          </div>

          {/* Booking widget — right column */}
          <div className="relative">
            <div className="sticky top-6 border border-gray-200 rounded-xl shadow-lg p-6">
              {/* Nightly rate */}
              <div className="flex items-baseline justify-between mb-1">
                {priceLoading ? (
                  <span className="h-5 w-28 bg-gray-200 animate-pulse rounded" />
                ) : (
                  <span className="text-lg font-semibold">
                    {nightlyFormatted}{' '}
                    <span className="text-sm font-normal text-gray-600">/ night</span>
                  </span>
                )}
                <span className="text-sm flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#111">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                  </svg>
                  {listing.rating.toFixed(1)} &middot; {listing.reviews} reviews
                </span>
              </div>

              {/* Currency badge */}
              <p className="text-xs text-green-700 font-medium mb-4">
                🇿🇦 All prices in South African Rand (ZAR)
              </p>

              {/* Date / guest selector */}
              <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-2 divide-x divide-gray-300 border-b border-gray-300">
                  <div className="p-2">
                    <label className="block text-[10px] font-semibold uppercase text-gray-700">
                      Check in
                    </label>
                    <span className="text-sm">{checkinDate}</span>
                  </div>
                  <div className="p-2">
                    <label className="block text-[10px] font-semibold uppercase text-gray-700">
                      Checkout
                    </label>
                    <span className="text-sm">{checkoutDate}</span>
                  </div>
                </div>
                <div className="p-2">
                  <label className="block text-[10px] font-semibold uppercase text-gray-700">
                    Guests
                  </label>
                  <span className="text-sm">{listing.guests} guests</span>
                </div>
              </div>

              <button className="w-full bg-brand text-white font-semibold rounded-lg py-3 hover:opacity-90 transition-opacity">
                Reserve
              </button>
              <p className="text-center text-xs text-gray-500 mt-3">You won&apos;t be charged yet</p>

              {/* Price breakdown */}
              <div className="mt-5 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="underline">
                    {nightlyFormatted} × {nights} nights
                  </span>
                  <span>{subtotalFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>{zarFormat(cleaningFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Service fee</span>
                  <span>{zarFormat(serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Occupancy taxes and fees</span>
                  <span>{zarFormat(occupancyFee)}</span>
                </div>
              </div>

              <div className="flex justify-between font-semibold pt-4 mt-4 border-t border-gray-200">
                <span>Total before taxes</span>
                <span>{zarFormat(total)}</span>
              </div>

              <p className="text-center text-xs text-gray-500 underline mt-4 cursor-pointer">
                Report this listing
              </p>
            </div>
          </div>
        </div>

        {/* Host info */}
        <div className="py-8 border-t border-gray-200 mt-4 flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-gray-300 inline-block shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900">Hosted by {listing.host}</h3>
            <p className="text-sm text-gray-500">
              {typeof listing.hostSince === 'string' ? listing.hostSince : `Joined ${listing.hostSince}`}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function MiniCalendar() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() // 0-indexed

  function buildMonth(offsetMonths) {
    const d = new Date(year, month + offsetMonths, 1)
    return {
      name: d.toLocaleString('en-ZA', { month: 'long', year: 'numeric' }),
      days: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
      startOffset: d.getDay(),
      highlighted: offsetMonths === 0 ? [1, 2, 3, 4, 5, 6, 7] : [],
    }
  }

  const months = [buildMonth(0), buildMonth(1)]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-center">
      {months.map((m) => (
        <div key={m.name}>
          <p className="font-semibold text-sm mb-2">{m.name}</p>
          <div className="grid grid-cols-7 gap-1 text-gray-500 mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: m.startOffset }).map((_, i) => (
              <span key={`b${i}`} />
            ))}
            {Array.from({ length: m.days }).map((_, i) => {
              const day = i + 1
              const active = m.highlighted.includes(day)
              return (
                <span
                  key={day}
                  className={`rounded-full py-1 ${
                    active ? 'bg-gray-900 text-white' : 'text-gray-700'
                  }`}
                >
                  {day}
                </span>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function ListingDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96">
        <div className="col-span-2 row-span-2 bg-gray-200 rounded-xl" />
        <div className="bg-gray-200 rounded" />
        <div className="bg-gray-200 rounded" />
        <div className="bg-gray-200 rounded" />
        <div className="bg-gray-200 rounded" />
      </div>
    </div>
  )
}
