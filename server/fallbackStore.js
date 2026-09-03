import crypto from 'crypto'

const fallbackUsers = new Map()
const fallbackListings = new Map()
const fallbackBookings = new Map()

function hashPassword(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

const seedEmail = 'koketsomaake295@gmail.com'
const seedPassword = 'Kmaake0616368479$'

export function ensureFallbackSeedUser() {
  if (!fallbackUsers.has(seedEmail.toLowerCase())) {
    fallbackUsers.set(seedEmail.toLowerCase(), {
      _id: 'local-seed-user',
      name: 'Koketso Maake',
      email: seedEmail.toLowerCase(),
      phone: '',
      role: 'host',
      avatar: '',
      isSuperhost: false,
      hostSince: null,
      savedListings: [],
      isActive: true,
      passwordHash: hashPassword(seedPassword),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  return fallbackUsers.get(seedEmail.toLowerCase())
}

export function getFallbackUserByEmail(email) {
  const normalized = String(email || '').trim().toLowerCase()
  const user = fallbackUsers.get(normalized)
  if (!user) return null
  return { ...user }
}

export function createFallbackUser({ name, email, password, phone = '', role = 'guest' }) {
  const normalizedEmail = String(email || '').trim().toLowerCase()
  if (!normalizedEmail || !password || !name) return null
  if (fallbackUsers.has(normalizedEmail)) return null

  const user = {
    _id: `local-user-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: String(name).trim(),
    email: normalizedEmail,
    phone: String(phone || ''),
    role,
    avatar: '',
    isSuperhost: false,
    hostSince: null,
    savedListings: [],
    isActive: true,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  fallbackUsers.set(normalizedEmail, user)
  return { ...user }
}

export function verifyFallbackPassword(email, password) {
  const user = getFallbackUserByEmail(email)
  if (!user) return false
  return user.passwordHash === hashPassword(password)
}

export function getFallbackUsers() {
  return Array.from(fallbackUsers.values()).map((user) => ({ ...user }))
}

export function getFallbackListings() {
  return Array.from(fallbackListings.values()).filter((listing) => listing.isActive)
}

export function createFallbackListing(data) {
  const listing = {
    ...data,
    _id: `local-listing-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  fallbackListings.set(listing._id, listing)
  return { ...listing }
}

export function deactivateFallbackListing(id) {
  const listing = fallbackListings.get(id)
  if (!listing) return null
  listing.isActive = false
  listing.updatedAt = new Date().toISOString()
  return { ...listing }
}

export function getFallbackBookings() {
  return Array.from(fallbackBookings.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export function createFallbackBooking(data) {
  const booking = {
    ...data,
    _id: `local-booking-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  fallbackBookings.set(booking._id, booking)
  return { ...booking }
}

export function cancelFallbackBooking(id) {
  const booking = fallbackBookings.get(id)
  if (!booking) return null
  booking.status = 'cancelled'
  booking.updatedAt = new Date().toISOString()
  return { ...booking }
}
