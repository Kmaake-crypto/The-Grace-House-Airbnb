import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import BookingModal from '../components/BookingModal.jsx'
import { useTaplineListing } from '../hooks/useTaplineListings.js'
import { fetchPrice } from '../services/taplineApi.js'
import { reviews } from '../data/listings.js'
import { useAuth } from '../context/useAuth.js'
import { usersApi } from '../services/api.js'

function zarFormat(amount) {
  return `R ${Number(amount).toLocaleString('en-ZA')}`
}

export default function ListingDetail() {
  const { id } = useParams()
  const { listing, loading: listingLoading } = useTaplineListing(id)
  const { user, isAuthenticated } = useAuth()

  const today = new Date()
  const checkinDate = today.toISOString().split('T')[0]
  const checkoutDate = new Date(today.getTime() + 7 * 86_400_000).toISOString().split('T')[0]
  const [nights] = useState(7)
  const [livePrice, setLivePrice] = useState(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [saved, setSaved] = useState(() => user?.savedListings?.some((savedId) => String(savedId) === String(id)) || JSON.parse(localStorage.getItem('airbnb-saved-listings') || '[]').includes(String(id)))
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [showAllAmenities, setShowAllAmenities] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [feedback, setFeedback] = useState('')

  async function toggleSaved() {
    if (!isAuthenticated) return setFeedback('Sign in as a guest to save this listing.')
    if (String(id).startsWith('sa-')) {
      const current = JSON.parse(localStorage.getItem('airbnb-saved-listings') || '[]')
      const next = saved ? current.filter((savedId) => savedId !== String(id)) : [...new Set([...current, String(id)])]
      localStorage.setItem('airbnb-saved-listings', JSON.stringify(next))
      setSaved(!saved)
      setFeedback(!saved ? 'Listing saved.' : 'Listing removed from saved stays.')
      return
    }
    try {
      const result = await usersApi.toggleSaveListing(user._id, id)
      setSaved(result.saved)
      setFeedback(result.saved ? 'Listing saved.' : 'Listing removed from saved stays.')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  async function shareListing() {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: listing.title, url })
      else await navigator.clipboard.writeText(url)
      setFeedback(navigator.share ? 'Listing shared.' : 'Listing link copied.')
    } catch {
      setFeedback('Sharing was cancelled.')
    }
  }

  useEffect(() => {
    if (!listing || String(listing.id).startsWith('sa-')) return
    let cancelled = false
    setPriceLoading(true)
    fetchPrice(listing.id, checkinDate, checkoutDate, listing.guests)
      .then((data) => { if (!cancelled) setLivePrice(data) })
      .catch((err) => console.warn('Live price fetch failed:', err.message))
      .finally(() => { if (!cancelled) setPriceLoading(false) })
    return () => { cancelled = true }
  }, [listing?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (listingLoading || !listing) {
    return (
      <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-10"><ListingDetailSkeleton /></div>
      </div>
    )
  }

  const nightlyRate = livePrice?.breakdown?.[0]?.unit_price?.amount ?? listing.price
  const nightlyFormatted = livePrice?.breakdown?.[0]?.unit_price?.formatted ?? listing.priceFormatted ?? zarFormat(listing.price)
  const subtotal = livePrice?.breakdown?.[0]?.total?.amount ?? nightlyRate * nights
  const subtotalFormatted = livePrice?.breakdown?.[0]?.total?.formatted ?? zarFormat(subtotal)
  const weeklyDiscount = nights >= 7 ? Math.round(subtotal * (listing.weeklyDiscount ?? 0) / 100) : 0
  const cleaningFee = listing.cleaningFee || Math.round(nightlyRate * 0.15)
  const serviceFee  = listing.serviceFee || Math.round(subtotal * 0.12)
  const occupancyFee = listing.occupancyTax || Math.round(subtotal * 0.03)
  const total = subtotal - weeklyDiscount + cleaningFee + serviceFee + occupancyFee

  return (
    <div className="transition-colors duration-300" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <Navbar />

      {showBooking && (
        <BookingModal listing={listing} onClose={() => setShowBooking(false)} />
      )}

      <div className="max-w-6xl mx-auto px-6 pt-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{listing.title}</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              <span className="inline-flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#111"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                {listing.rating.toFixed(1)}
              </span>{' '}
              &middot; <span className="underline">{listing.reviews} reviews</span> &middot;{' '}
              <span className="underline">{listing.location}</span>
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            <button onClick={shareListing} className="underline">Share</button>
            <button onClick={toggleSaved} className="underline">{saved ? 'Saved' : 'Save'}</button>
          </div>
        </div>
        {feedback && <p className="text-sm mt-3" style={{ color: '#016764' }}>{feedback}</p>}

        {/* Gallery */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 mt-4 rounded-xl overflow-hidden h-96">
          <img src={listing.gallery[0]} alt={listing.title} className="col-span-2 row-span-2 w-full h-full object-cover" />
          {(listing.gallery.length > 1 ? listing.gallery.slice(1, 5) : Array(4).fill(listing.image)).map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
          {/* Left col */}
          <div className="lg:col-span-2">

            {/* Host row */}
            <div className="flex items-center justify-between pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {listing.type} hosted by {listing.host}
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {listing.guests} guests &middot; {listing.beds} bedroom &middot; {listing.beds} bed &middot; {listing.baths} bath
                </p>
              </div>
              <div className="w-12 h-12 rounded-full shrink-0" style={{ background: 'var(--bg-surface)' }} />
            </div>

            {/* Highlights */}
            <div className="py-6 space-y-4" style={{ borderBottom: '1px solid var(--border)' }}>
              {[
                { icon: '🏠', title: 'Entire home', sub: "You'll have the place to yourself" },
                { icon: '✨', title: 'Enhanced Clean', sub: "This host committed to Airbnb's 5-step cleaning process." },
                { icon: '🔑', title: 'Self check-in', sub: 'Check yourself in with the keypad.' },
                { icon: '📅', title: 'Free cancellation before check-in', sub: null },
              ].map((h) => (
                <div key={h.title} className="flex gap-4">
                  <span>{h.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{h.title}</p>
                    {h.sub && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{h.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="py-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <p className={`text-sm leading-relaxed ${descriptionExpanded ? '' : 'line-clamp-3'}`} style={{ color: 'var(--text-primary)' }}>{listing.description}</p>
              <button onClick={() => setDescriptionExpanded((expanded) => !expanded)} className="text-sm font-semibold underline mt-2" style={{ color: 'var(--text-link)' }}>{descriptionExpanded ? 'Show less' : 'Show more'}</button>
            </div>

            {/* Bedroom */}
            <div className="py-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Where you&apos;ll sleep</h3>
              <div className="w-56">
                <img src={listing.gallery[1] ?? listing.image} alt="Bedroom" className="rounded-xl h-36 w-full object-cover" />
                <p className="text-sm font-semibold mt-2" style={{ color: 'var(--text-primary)' }}>Bedroom</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>1 queen bed</p>
              </div>
            </div>

            {/* Amenities */}
            {listing.amenities?.length > 0 && (
              <div className="py-6" style={{ borderBottom: '1px solid var(--border)' }}>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>What this place offers</h3>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  {listing.amenities.slice(0, showAllAmenities ? undefined : 6).map((a) => (
                    <div key={a} className="flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                      <span className="w-4 h-4 rounded-sm inline-block" style={{ border: '1px solid var(--text-muted)' }} />
                      {a}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowAllAmenities((expanded) => !expanded)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold mt-4"
                  style={{ border: '1px solid var(--text-primary)', color: 'var(--text-primary)', background: 'transparent' }}
                >
                  {showAllAmenities ? 'Show fewer amenities' : 'Show all amenities'}
                </button>
              </div>
            )}

            {/* Calendar */}
            <div className="py-6" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {nights} nights in {listing.location.split(',')[0]}
              </h3>
              <MiniCalendar />
              <button className="text-sm font-semibold underline mt-2" style={{ color: 'var(--text-link)' }}>Clear dates</button>
            </div>

            {/* Reviews */}
            <div className="py-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                {listing.rating.toFixed(1)} &middot; {listing.reviews} reviews
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {['Cleanliness', 'Accuracy', 'Communication', 'Location', 'Check-in', 'Value'].map((label) => (
                  <div key={label} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="w-20 shrink-0">{label}</span>
                    <span className="flex-1 h-1 rounded-full max-w-[120px]" style={{ background: 'var(--teal)' }} />
                    <span>5.0</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {reviews.slice(0, showAllReviews ? undefined : 4).map((r) => (
                  <div key={r.name}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-9 h-9 rounded-full inline-block" style={{ background: 'var(--bg-surface)' }} />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.date}</p>
                      </div>
                    </div>
                    <p className="text-sm line-clamp-3" style={{ color: 'var(--text-primary)' }}>{r.text}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAllReviews((expanded) => !expanded)}
                className="rounded-lg px-4 py-2 text-sm font-semibold mt-6"
                style={{ border: '1px solid var(--text-primary)', color: 'var(--text-primary)', background: 'transparent' }}
              >
                {showAllReviews ? 'Show fewer reviews' : `Show all ${listing.reviews} reviews`}
              </button>
            </div>
          </div>

          {/* Booking widget */}
          <div className="relative">
            <div
              className="sticky top-6 rounded-xl shadow-lg p-6"
              style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
            >
              <div className="flex items-baseline justify-between mb-1">
                {priceLoading ? (
                  <span className="h-5 w-28 rounded animate-pulse" style={{ background: 'var(--bg-surface)' }} />
                ) : (
                  <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {nightlyFormatted}{' '}
                    <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/ night</span>
                  </span>
                )}
                <span className="text-sm flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                  {listing.rating.toFixed(1)} &middot; {listing.reviews} reviews
                </span>
              </div>

              <p className="text-xs font-medium mb-4" style={{ color: '#016764' }}>
                🇿🇦 All prices in South African Rand (ZAR)
              </p>

              {/* Dates / guests */}
              <div className="rounded-lg overflow-hidden mb-4" style={{ border: '1px solid var(--border)' }}>
                <div className="grid grid-cols-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="p-2" style={{ borderRight: '1px solid var(--border)' }}>
                    <label className="block text-[10px] font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Check in</label>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{checkinDate}</span>
                  </div>
                  <div className="p-2">
                    <label className="block text-[10px] font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Checkout</label>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{checkoutDate}</span>
                  </div>
                </div>
                <div className="p-2">
                  <label className="block text-[10px] font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>Guests</label>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{listing.guests} guests</span>
                </div>
              </div>

              <button
                onClick={() => setShowBooking(true)}
                className="w-full font-semibold rounded-lg py-3 text-white hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #016764 0%, #001E1E 100%)' }}
              >
                Reserve
              </button>
              <p className="text-center text-xs mt-3" style={{ color: 'var(--text-muted)' }}>You won&apos;t be charged yet</p>

              {/* Breakdown */}
              <div className="mt-5 space-y-2 text-sm">
                {[
                  [`${nightlyFormatted} × ${nights} nights`, subtotalFormatted],
                  ...(weeklyDiscount ? [['Weekly discount', `- ${zarFormat(weeklyDiscount)}`]] : []),
                  ['Cleaning fee', zarFormat(cleaningFee)],
                  ['Service fee', zarFormat(serviceFee)],
                  ['Occupancy taxes and fees', zarFormat(occupancyFee)],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between" style={{ color: 'var(--text-primary)' }}>
                    <span className="underline">{label}</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-semibold pt-4 mt-4" style={{ color: 'var(--text-primary)', borderTop: '1px solid var(--border)' }}>
                <span>Total before taxes</span>
                <span>{zarFormat(total)}</span>
              </div>

              <button onClick={() => setFeedback('Thanks. This listing has been reported for review.')} className="block w-full text-center text-xs underline mt-4" style={{ color: 'var(--text-muted)' }}>
                Report this listing
              </button>
            </div>
          </div>
        </div>

        {/* Host */}
        <div className="py-8 mt-4 flex items-center gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="w-14 h-14 rounded-full inline-block shrink-0" style={{ background: 'var(--bg-surface)' }} />
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Hosted by {listing.host}</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
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
  const month = now.getMonth()

  function buildMonth(offset) {
    const d = new Date(year, month + offset, 1)
    return {
      name: d.toLocaleString('en-ZA', { month: 'long', year: 'numeric' }),
      days: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
      startOffset: d.getDay(),
      highlighted: offset === 0 ? [1, 2, 3, 4, 5, 6, 7] : [],
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-center">
      {[buildMonth(0), buildMonth(1)].map((m) => (
        <div key={m.name}>
          <p className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{m.name}</p>
          <div className="grid grid-cols-7 gap-1 mb-1" style={{ color: 'var(--text-muted)' }}>
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => <span key={d}>{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: m.startOffset }).map((_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: m.days }).map((_, i) => {
              const day = i + 1
              const active = m.highlighted.includes(day)
              return (
                <span
                  key={day}
                  className="rounded-full py-1"
                  style={active
                    ? { background: '#016764', color: '#fff' }
                    : { color: 'var(--text-primary)' }}
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
      <div className="h-8 rounded w-1/2" style={{ background: 'var(--bg-surface)' }} />
      <div className="h-4 rounded w-1/3" style={{ background: 'var(--bg-surface)' }} />
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96">
        <div className="col-span-2 row-span-2 rounded-xl" style={{ background: 'var(--bg-surface)' }} />
        {Array(4).fill(0).map((_, i) => <div key={i} className="rounded" style={{ background: 'var(--bg-surface)' }} />)}
      </div>
    </div>
  )
}
