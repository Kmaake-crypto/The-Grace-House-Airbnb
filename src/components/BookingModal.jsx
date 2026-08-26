import { useState } from 'react'
import { bookingsApi } from '../services/api.js'

function zarFormat(n) {
  return `R ${Number(n).toLocaleString('en-ZA')}`
}

function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function diffDays(a, b) {
  return Math.max(1, Math.round((new Date(b) - new Date(a)) / 86_400_000))
}

const today = new Date().toISOString().split('T')[0]

/**
 * BookingModal
 * Props:
 *   listing   — the listing object
 *   onClose   — called to dismiss the modal
 */
export default function BookingModal({ listing, onClose }) {
  const [step, setStep] = useState('form') // 'form' | 'confirm' | 'done'
  const [checkin, setCheckin]   = useState(today)
  const [checkout, setCheckout] = useState(addDays(today, 7))
  const [guests, setGuests]     = useState(1)
  const [guestName,  setGuestName]  = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [saving, setSaving]         = useState(false)
  const [confirmRef, setConfirmRef] = useState(null)

  const nights       = diffDays(checkin, checkout)
  const nightlyRate  = listing.price ?? 0
  const subtotal     = nightlyRate * nights
  const cleaningFee  = Math.round(nightlyRate * 0.15)
  const serviceFee   = Math.round(subtotal * 0.12)
  const total        = subtotal + cleaningFee + serviceFee

  function handleCheckinChange(val) {
    setCheckin(val)
    if (val >= checkout) setCheckout(addDays(val, 1))
  }

  // ── Overlay click to close ──────────────────────────────
  function handleOverlay(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.55rem 0.75rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={handleOverlay}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg,#016764,#001E1E)' }}
        >
          <div>
            <p className="text-xs text-white/70 uppercase tracking-widest">Booking</p>
            <h2 className="text-base font-semibold text-white truncate max-w-[260px]">
              {listing.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Step: form ── */}
        {step === 'form' && (
          <div className="px-6 py-5 space-y-4">
            {/* Guest info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase mb-1"
                  style={{ color: '#016764' }}>Your Name</label>
                <input type="text" style={inputStyle} value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Full name" />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase mb-1"
                  style={{ color: '#016764' }}>Email</label>
                <input type="email" style={inputStyle} value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="you@email.com" />
              </div>
            </div>

            {/* Date row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-semibold uppercase mb-1"
                  style={{ color: '#016764' }}>Check-in</label>
                <input type="date" style={inputStyle} value={checkin} min={today}
                  onChange={(e) => handleCheckinChange(e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase mb-1"
                  style={{ color: '#016764' }}>Check-out</label>
                <input type="date" style={inputStyle} value={checkout}
                  min={addDays(checkin, 1)}
                  onChange={(e) => setCheckout(e.target.value)} />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-[10px] font-semibold uppercase mb-1"
                style={{ color: '#016764' }}>Guests</label>
              <div className="flex items-center gap-3">
                <button type="button"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center transition-colors"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  −
                </button>
                <span className="text-base font-semibold w-6 text-center"
                  style={{ color: 'var(--text-primary)' }}>{guests}</span>
                <button type="button"
                  onClick={() => setGuests((g) => Math.min(listing.guests ?? 10, g + 1))}
                  className="w-8 h-8 rounded-full font-bold text-lg flex items-center justify-center transition-colors"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                  +
                </button>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  max {listing.guests ?? 10}
                </span>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="rounded-xl p-4 space-y-2 text-sm"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <p className="font-semibold text-xs uppercase mb-2" style={{ color: '#016764' }}>
                Price breakdown · {nights} night{nights > 1 ? 's' : ''}
              </p>
              {[
                [`${listing.priceFormatted ?? zarFormat(nightlyRate)} × ${nights} nights`, zarFormat(subtotal)],
                ['Cleaning fee (15%)', zarFormat(cleaningFee)],
                ['Service fee (12%)', zarFormat(serviceFee)],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between" style={{ color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2"
                style={{ borderTop: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                <span>Total</span>
                <span style={{ color: '#016764' }}>{zarFormat(total)}</span>
              </div>
            </div>

            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              🇿🇦 All prices in South African Rand (ZAR) · You won&apos;t be charged yet
            </p>

            <button
              onClick={() => setStep('confirm')}
              className="w-full font-semibold rounded-xl py-3 text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#016764,#001E1E)' }}>
              Continue to Confirm
            </button>
          </div>
        )}

        {/* ── Step: confirm ── */}
        {step === 'confirm' && (
          <div className="px-6 py-5 space-y-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              Confirm your booking
            </h3>

            <div className="rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--border)' }}>
              <img src={listing.image} alt={listing.title}
                className="w-full h-36 object-cover" />
              <div className="p-3">
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {listing.title}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {listing.location}
                </p>
              </div>
            </div>

            <div className="rounded-xl p-4 text-sm space-y-2"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              {[
                ['Check-in',  checkin],
                ['Check-out', checkout],
                ['Guests',    `${guests} guest${guests > 1 ? 's' : ''}`],
                ['Duration',  `${nights} night${nights > 1 ? 's' : ''}`],
                ['Total',     zarFormat(total)],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                  <span className="font-semibold" style={{ color: l === 'Total' ? '#016764' : 'var(--text-primary)' }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('form')}
                className="flex-1 font-semibold rounded-xl py-2.5 text-sm transition-colors"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                Back
              </button>
              <button onClick={async () => {
                  setSaving(true)
                  try {
                    const res = await bookingsApi.create({
                      externalListingId: String(listing.id),
                      listingTitle:   listing.title,
                      listingLocation: listing.location,
                      listingImage:   listing.image,
                      guestName:  guestName  || 'Guest',
                      guestEmail: guestEmail || 'guest@example.com',
                      guests,
                      checkin,
                      checkout,
                      nights,
                      nightlyRate:  nightlyRate,
                      subtotal,
                      cleaningFee,
                      serviceFee,
                      totalAmount: total,
                    })
                    setConfirmRef(res.booking?.confirmationRef || null)
                  } catch (err) {
                    console.warn('Booking save failed (offline?):', err.message)
                  } finally {
                    setSaving(false)
                    setStep('done')
                  }
                }}
                disabled={saving}
                className="flex-1 font-semibold rounded-xl py-2.5 text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#016764,#001E1E)' }}>
                {saving ? 'Saving…' : 'Confirm & Reserve'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step: done ── */}
        {step === 'done' && (
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg,#016764,#001E1E)' }}>
              ✓
            </div>
            <h3 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Booking Confirmed!
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Your reservation at <strong style={{ color: 'var(--text-primary)' }}>{listing.title}</strong> is confirmed
              for {nights} night{nights > 1 ? 's' : ''} — {checkin} to {checkout}.
            </p>
            <p className="font-bold text-lg" style={{ color: '#016764' }}>{zarFormat(total)}</p>
            {confirmRef && (
              <p className="text-xs font-mono px-3 py-1 rounded-full"
                style={{ background: 'rgba(1,103,100,0.15)', color: '#016764' }}>
                Ref: {confirmRef}
              </p>
            )}
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              A confirmation will be sent to your registered email.
            </p>
            <button onClick={onClose}
              className="mt-2 font-semibold rounded-xl px-8 py-2.5 text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#016764,#001E1E)' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
