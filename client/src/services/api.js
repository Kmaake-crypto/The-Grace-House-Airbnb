/**
 * Frontend API service
 * All calls go to the Express backend at /api/*
 * Vite proxies /api → http://localhost:5000 in development (configured in vite.config.js)
 */

const BASE = import.meta.env.VITE_API_URL || '/api'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80'

/**
 * Normalise a MongoDB listing document into the shape the UI uses,
 * mirroring `normaliseListing` in services/taplineApi.js.
 * Host-created listings get `isHostListing: true`.
 */
export function normaliseMongoListing(raw) {
  const price = Number(raw.price) || 0
  return {
    id: raw._id || raw.id,
    title: raw.title || 'Listing',
    location: raw.location || 'South Africa',
    description: raw.description || '',
    type: raw.type || 'Entire home',
    guests: Number(raw.guests) || 2,
    beds: Number(raw.beds) || 1,
    baths: Number(raw.baths) || 1,
    price,
    weeklyDiscount: Number(raw.weeklyDiscount) || 0,
    cleaningFee: Number(raw.cleaningFee) || 0,
    serviceFee: Number(raw.serviceFee) || 0,
    occupancyTax: Number(raw.occupancyTax) || 0,
    priceFormatted: raw.priceFormatted || `R ${price.toLocaleString('en-ZA')}`,
    currency: raw.currency || 'ZAR',
    rating: Number(raw.rating) || 0,
    reviews: Number(raw.reviews) || 0,
    host: raw.host || 'Host',
    hostSince: raw.hostSince || 'New host',
    image: raw.image || DEFAULT_IMAGE,
    gallery: Array.isArray(raw.gallery) && raw.gallery.length ? raw.gallery : [raw.image || DEFAULT_IMAGE],
    amenities: Array.isArray(raw.amenities) ? raw.amenities : [],
    isHostListing: true,
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem('airbnb-auth')
  let authHeader = {}
  try {
    const session = JSON.parse(token)
    if (session?.token) authHeader = { Authorization: `Bearer ${session.token}` }
  } catch {
    authHeader = {}
  }

  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader, ...options.headers },
    ...options,
  })

  const responseText = await res.text()
  let data
  try {
    data = responseText ? JSON.parse(responseText) : {}
  } catch {
    data = { success: false, message: `Server returned an invalid response (${res.status})` }
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`)
  }

  return data
}

// ── Listings ─────────────────────────────────────────────

export const listingsApi = {
  /** Fetch all active listings, with optional filters */
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/listings${qs ? `?${qs}` : ''}`)
  },

  /** Fetch single listing by MongoDB id */
  getById: (id) => request(`/listings/${id}`),

  /** Create a new listing */
  create: (body) =>
    request('/listings', { method: 'POST', body: JSON.stringify(body) }),

  /** Update a listing */
  update: (id, body) =>
    request(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  /** Soft-delete (deactivate) a listing */
  remove: (id) =>
    request(`/listings/${id}`, { method: 'DELETE' }),
}

// ── Bookings ─────────────────────────────────────────────

export const bookingsApi = {
  /** Fetch bookings, optionally filtered by status / guestEmail */
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/bookings${qs ? `?${qs}` : ''}`)
  },

  /** Create a new booking (called from BookingModal on confirm) */
  create: (body) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(body) }),

  /** Update booking status (confirmed / cancelled / completed) */
  updateStatus: (id, status) =>
    request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  /** Cancel a booking */
  cancel: (id) =>
    request(`/bookings/${id}`, { method: 'DELETE' }),
}

// ── Users ────────────────────────────────────────────────

export const usersApi = {
  register: (body) =>
    request('/users/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    request('/users/login', { method: 'POST', body: JSON.stringify(body) }),

  getById: (id) => request(`/users/${id}`),

  update: (id, body) =>
    request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  toggleSaveListing: (userId, listingId) =>
    request(`/users/${userId}/save-listing`, {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    }),
}

// ── Health ───────────────────────────────────────────────

export const checkHealth = () => request('/health')
