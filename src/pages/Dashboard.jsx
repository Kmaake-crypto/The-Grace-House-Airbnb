import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { reservations as staticReservations, listings as staticListings } from '../data/listings.js'
import { bookingsApi, listingsApi } from '../services/api.js'

function zarFormat(amount) {
  return `R ${Number(amount).toLocaleString('en-ZA')}`
}

const STAT_CARDS = []   // computed inside component from live data

export default function Dashboard() {
  const [tab, setTab] = useState('reservations')

  // ── Bookings from MongoDB ──────────────────────────────
  const [rows, setRows]               = useState([])
  const [bookingsLoading, setBLoading] = useState(true)

  // ── Listings from MongoDB (+ static fallback) ──────────
  const [listings, setListings]         = useState(staticListings)
  const [listingsLoading, setLLoading]  = useState(true)

  useEffect(() => {
    // Fetch bookings
    bookingsApi.getAll()
      .then((data) => {
        // Normalise MongoDB bookings to match table shape
        const normalised = data.bookings.map((b) => ({
          id:       b._id,
          bookedBy: b.guestName,
          property: b.listingTitle,
          checkin:  b.checkin,
          checkout: b.checkout,
          status:   b.status,
          ref:      b.confirmationRef,
        }))
        setRows(normalised.length ? normalised : staticReservations)
      })
      .catch(() => setRows(staticReservations))
      .finally(() => setBLoading(false))

    // Fetch listings
    listingsApi.getAll()
      .then((data) => {
        if (data.listings?.length) setListings(data.listings)
        // else keep staticListings
      })
      .catch(() => {})
      .finally(() => setLLoading(false))
  }, [])

  const statCards = [
    { label: 'Total Listings',      value: listings.length,  icon: '🏠' },
    { label: 'Active Reservations', value: rows.length,      icon: '📅' },
    { label: 'Monthly Revenue',     value: zarFormat(listings.reduce((s, l) => s + (l.price ?? 0) * 7, 0)), icon: '💰' },
    { label: 'Avg. Rating',         value: listings.length
        ? (listings.reduce((s, l) => s + (l.rating ?? 0), 0) / listings.length).toFixed(2)
        : '—', icon: '⭐' },
  ]

  async function handleDeleteBooking(idx) {
    try {
      if (rows[idx]?.id) await bookingsApi.cancel(rows[idx].id)
    } catch (_) {}
    setRows((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <Navbar showSearch={false} />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Host Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Manage your South African properties
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>John Doe</span>
            <span className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#016764,#001E1E)' }}>
              JD
            </span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-xl p-5 flex flex-col gap-2"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <span className="text-2xl">{s.icon}</span>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-3 mb-6">
          {['reservations', 'listings'].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="text-sm font-semibold rounded-lg px-5 py-2 transition-colors"
              style={tab === t
                ? { background: 'linear-gradient(135deg,#016764,#001E1E)', color: '#fff', border: '1px solid transparent' }
                : { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
              {t === 'reservations' ? 'Reservations' : 'My Listings'}
            </button>
          ))}
          <Link to="/create-listing"
            className="text-sm font-semibold rounded-lg px-5 py-2 ml-auto transition-colors"
            style={{ background: 'var(--bg-card)', color: 'var(--teal)', border: '1px solid #016764' }}>
            + Create Listing
          </Link>
        </div>

        {/* Reservations table */}
        {tab === 'reservations' && (
          <div>
            <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--bg-surface)' }}>
                    {['Booked by', 'Property', 'Check-in', 'Check-out', 'Actions'].map((h, i) => (
                      <th key={h} className={`px-4 py-3 font-semibold text-left ${i === 4 ? 'text-right' : ''}`}
                        style={{ color: 'var(--text-primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm"
                        style={{ color: 'var(--text-muted)' }}>
                        No reservations yet.
                      </td>
                    </tr>
                  )}
                  {rows.map((r, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{r.bookedBy}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{r.property}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{r.checkin}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{r.checkout}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteBooking(i)}
                          className="text-xs font-semibold rounded-md px-4 py-1.5 text-white transition-opacity hover:opacity-80"
                          style={{ background: 'linear-gradient(135deg,#016764,#001E1E)' }}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listings grid */}
        {tab === 'listings' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <div key={l.id} className="rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                <div className="relative h-40">
                  <img src={l.image} alt={l.title} className="h-full w-full object-cover" />
                  <span className="absolute top-2 right-2 text-xs font-semibold rounded-full px-2 py-0.5"
                    style={{ background: '#016764', color: '#fff' }}>
                    {l.currency ?? 'ZAR'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{l.title}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{l.location}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm font-bold" style={{ color: '#016764' }}>
                      {l.priceFormatted ?? zarFormat(l.price)}{' '}
                      <span className="font-normal text-xs" style={{ color: 'var(--text-muted)' }}>/night</span>
                    </p>
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      ⭐ {l.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link to={`/listing/${l.id}`}
                      className="flex-1 text-center text-xs font-semibold rounded-md py-1.5 transition-opacity hover:opacity-80"
                      style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                      View
                    </Link>
                    <Link to="/create-listing"
                      className="flex-1 text-center text-xs font-semibold rounded-md py-1.5 text-white transition-opacity hover:opacity-80"
                      style={{ background: 'linear-gradient(135deg,#016764,#001E1E)' }}>
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
