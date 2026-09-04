import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { bookingsApi } from '../services/api.js'
import { useAuth } from '../context/useAuth.js'

export default function Reservations() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    bookingsApi.getAll()
      .then((data) => setBookings(data.bookings || []))
      .catch((requestError) => setError(requestError.message))
  }, [])

  async function cancelBooking(id) {
    try {
      await bookingsApi.cancel(id)
      setBookings((current) => current.map((booking) => booking._id === id ? { ...booking, status: 'cancelled' } : booking))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <Navbar showSearch={false} />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/" className="text-sm underline" style={{ color: '#016764' }}>Back to stays</Link>
        <h1 className="text-2xl font-semibold mt-5">{user?.role === 'guest' ? 'Your reservations' : 'Host reservations'}</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Review your upcoming and past stays.</p>
        {error && <p className="mt-5 text-sm" style={{ color: '#c41854' }}>{error}</p>}
        <div className="space-y-4 mt-8">
          {bookings.length === 0 && !error && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No reservations found.</p>}
          {bookings.map((booking) => (
            <article key={booking._id} className="flex flex-col sm:flex-row gap-4 rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {booking.listingImage && <img src={booking.listingImage} alt="" className="w-full sm:w-36 h-28 object-cover rounded-lg" />}
              <div className="flex-1">
                <h2 className="font-semibold">{booking.listingTitle}</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{booking.listingLocation}</p>
                <p className="text-sm mt-2">{booking.checkin} to {booking.checkout} · {booking.guests} guest{booking.guests !== 1 ? 's' : ''}</p>
                <p className="text-sm font-semibold mt-2" style={{ color: '#016764' }}>R {Number(booking.totalAmount).toLocaleString('en-ZA')} · {booking.status}</p>
              </div>
              {booking.status !== 'cancelled' && <button onClick={() => cancelBooking(booking._id)} className="self-start text-sm underline" style={{ color: '#c41854' }}>Cancel</button>}
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
