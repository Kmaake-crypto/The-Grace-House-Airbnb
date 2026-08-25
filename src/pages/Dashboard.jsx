import { Link } from 'react-router-dom'
import { useState } from 'react'
import Footer from '../components/Footer.jsx'
import { reservations, listings } from '../data/listings.js'

export default function Dashboard() {
  const [tab, setTab] = useState('reservations')
  const [rows, setRows] = useState(reservations)

  return (
    <div>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C11 10 5 17.5 5 22.5C5 27.7 9.6 31 16 31C22.4 31 27 27.7 27 22.5C27 17.5 21 10 16 2Z" fill="#E31C5F" />
            </svg>
            <span className="font-bold text-lg text-brand">StayFinder</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>John Doe</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v2H4zM4 11h16v2H4zM4 18h16v2H4z" /></svg>
            <span className="w-7 h-7 rounded-full bg-gray-300 inline-block" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setTab('reservations')}
            className={`text-sm font-semibold rounded-md px-4 py-2 border ${tab === 'reservations' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}`}
          >
            View Reservations
          </button>
          <button
            onClick={() => setTab('listings')}
            className={`text-sm font-semibold rounded-md px-4 py-2 border ${tab === 'listings' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}`}
          >
            View Listings
          </button>
          <Link to="/create-listing" className="text-sm font-semibold rounded-md px-4 py-2 border border-gray-300 text-gray-700">
            Create Listing
          </Link>
        </div>

        {tab === 'reservations' ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Reservations</h2>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Booked by</th>
                    <th className="px-4 py-3 font-semibold">Property</th>
                    <th className="px-4 py-3 font-semibold">Checkin</th>
                    <th className="px-4 py-3 font-semibold">Checkout</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="px-4 py-3">{r.bookedBy}</td>
                      <td className="px-4 py-3">{r.property}</td>
                      <td className="px-4 py-3">{r.checkin}</td>
                      <td className="px-4 py-3">{r.checkout}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
                          className="bg-brand hover:bg-brand-dark text-white text-xs font-semibold rounded-md px-4 py-1.5"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Listings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <div key={l.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <img src={l.image} alt={l.title} className="h-36 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">{l.title}</h3>
                    <p className="text-xs text-gray-500">{l.location}</p>
                    <p className="text-sm font-semibold mt-2">${l.price} / night</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}