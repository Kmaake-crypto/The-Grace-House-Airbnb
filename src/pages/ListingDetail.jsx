import { useParams } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { listings, reviews } from '../data/listings.js'

export default function ListingDetail() {
  const { id } = useParams()
  const listing = listings.find((l) => String(l.id) === id) || listings[0]
  const [nights] = useState(7)
  const cleaningFee = 62
  const serviceFee = 83
  const occupancyFee = 29
  const subtotal = listing.price * nights
  const total = subtotal + cleaningFee + serviceFee + occupancyFee

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{listing.title}</h1>
            <p className="text-sm text-gray-600 mt-1">
              <span className="inline-flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#111"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
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

        <div className="grid grid-cols-4 grid-rows-2 gap-2 mt-4 rounded-xl overflow-hidden h-96">
          <img src={listing.gallery[0]} alt="" className="col-span-2 row-span-2 w-full h-full object-cover" />
          {listing.gallery.slice(1, 5).map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Entire rental unit hosted by {listing.host}</h2>
                <p className="text-sm text-gray-600">
                  {listing.guests} guests &middot; {listing.beds} bedroom &middot; {listing.beds} bed &middot; {listing.baths} bath
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-300 shrink-0" />
            </div>

            <div className="py-6 border-b border-gray-200 space-y-4">
              <div className="flex gap-4">
                <span>🏠</span>
                <div>
                  <p className="font-semibold text-sm">Entire home</p>
                  <p className="text-sm text-gray-500">You&apos;ll have the apartment to yourself</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span>✨</span>
                <div>
                  <p className="font-semibold text-sm">Enhanced Clean</p>
                  <p className="text-sm text-gray-500">This host committed to Air B&amp;B&apos;s 5-step enhanced cleaning process. <span className="underline">Show more</span></p>
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
                  <p className="font-semibold text-sm">Free cancellation before Feb 14</p>
                </div>
              </div>
            </div>

            <div className="py-6 border-b border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>
              <button className="text-sm font-semibold underline mt-2">Show more</button>
            </div>

            <div className="py-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Where you&apos;ll sleep</h3>
              <div className="w-56">
                <img src={listing.gallery[1]} alt="Bedroom" className="rounded-xl h-36 w-full object-cover" />
                <p className="text-sm font-semibold mt-2">Bedroom</p>
                <p className="text-xs text-gray-500">1 queen bed</p>
              </div>
            </div>

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
                Show all {listing.amenities.length + 27} amenities
              </button>
            </div>

            <div className="py-6 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">{nights} nights in {listing.location.split(',')[0]}</h3>
              <MiniCalendar />
              <button className="text-sm font-semibold underline mt-2">Clear dates</button>
            </div>

            <div className="py-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#111"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                {listing.rating.toFixed(1)} &middot; {listing.reviews} reviews
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {['Cleanliness', 'Accuracy', 'Communication', 'Location', 'Check-in', 'Value'].map((label) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-20 shrink-0">{label}</span>
                    <span className="flex-1 h-1 bg-gray-800 rounded-full max-w-[120px]" />
                    <span>5.0</span>
                  </div>
                ))}
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

          <div className="relative">
            <div className="sticky top-6 border border-gray-200 rounded-xl shadow-lg p-6">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-lg font-semibold">
                  ${listing.price} <span className="text-sm font-normal text-gray-600">/ night</span>
                </span>
                <span className="text-sm flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#111"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                  {listing.rating.toFixed(1)} &middot; {listing.reviews} reviews
                </span>
              </div>
              <div className="border border-gray-300 rounded-lg overflow-hidden mb-4">
                <div className="grid grid-cols-2 divide-x divide-gray-300 border-b border-gray-300">
                  <div className="p-2">
                    <label className="block text-[10px] font-semibold uppercase text-gray-700">Check in</label>
                    <span className="text-sm">2/19/2022</span>
                  </div>
                  <div className="p-2">
                    <label className="block text-[10px] font-semibold uppercase text-gray-700">Checkout</label>
                    <span className="text-sm">2/26/2022</span>
                  </div>
                </div>
                <div className="p-2">
                  <label className="block text-[10px] font-semibold uppercase text-gray-700">Guests</label>
                  <span className="text-sm">{listing.guests} guests</span>
                </div>
              </div>
              <button className="btn-primary w-full">Reserve</button>
              <p className="text-center text-xs text-gray-500 mt-3">You won&apos;t be charged yet</p>

              <div className="mt-5 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="underline">${listing.price} x {nights} nights</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Cleaning fee</span>
                  <span>${cleaningFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Occupancy taxes and fees</span>
                  <span>${occupancyFee}</span>
                </div>
              </div>
              <div className="flex justify-between font-semibold pt-4 mt-4 border-t border-gray-200">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <p className="text-center text-xs text-gray-500 underline mt-4 cursor-pointer">Report this listing</p>
            </div>
          </div>
        </div>

        <div className="py-8 border-t border-gray-200 mt-4 flex items-center gap-4">
          <span className="w-14 h-14 rounded-full bg-gray-300 inline-block shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900">Hosted by {listing.host}</h3>
            <p className="text-sm text-gray-500">Joined {listing.hostSince}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function MiniCalendar() {
  const months = [
    { name: 'February 2022', days: 28, startOffset: 2, highlighted: [4, 5, 6, 7, 8, 10] },
    { name: 'March 2022', days: 31, startOffset: 2, highlighted: [] },
  ]
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
                  className={`rounded-full py-1 ${active ? 'bg-gray-900 text-white' : 'text-gray-700'}`}
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