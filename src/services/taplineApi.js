/**
 * Tapline Airbnb API Service
 * https://tapline.sh
 *
 * Provides South African listings and ZAR pricing via the Tapline REST API.
 * API key is sent as a Bearer token in the Authorization header.
 */

const TAPLINE_BASE_URL = 'https://tapline.sh'
const API_KEY = 'sk_-As-KoRBBK24anaxn9e_gQibe5nNSzNEs8xzQdo7z6o'
const CURRENCY = 'ZAR'

function authHeaders() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  }
}

/**
 * Search Airbnb listings in a South African location.
 * @param {string} location - e.g. "Cape Town, South Africa"
 * @param {object} options  - optional checkin / checkout / guests
 * @returns {Promise<object>}
 */
export async function searchListings(location = 'South Africa', options = {}) {
  const body = {
    query: location,
    currency: CURRENCY,
    ...(options.checkin && { checkin: options.checkin }),
    ...(options.checkout && { checkout: options.checkout }),
    ...(options.guests && { guests: options.guests }),
  }

  const res = await fetch(`${TAPLINE_BASE_URL}/v1/airbnb/search`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Tapline search error ${res.status}: ${err}`)
  }

  return res.json()
}

/**
 * Fetch details for a single Airbnb listing by room ID.
 * @param {string} roomId
 * @returns {Promise<object>}
 */
export async function getListingDetails(roomId) {
  const res = await fetch(`${TAPLINE_BASE_URL}/v1/airbnb/details`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ room_id: String(roomId), currency: CURRENCY }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Tapline details error ${res.status}: ${err}`)
  }

  return res.json()
}

/**
 * Fetch live price for a listing over a date range.
 * @param {string} roomId
 * @param {string} checkin  - YYYY-MM-DD
 * @param {string} checkout - YYYY-MM-DD
 * @param {number} guests
 * @returns {Promise<object>}
 */
export async function fetchPrice(roomId, checkin, checkout, guests = 2) {
  const res = await fetch(`${TAPLINE_BASE_URL}/v1/airbnb/priceFetch`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      room_id: String(roomId),
      checkin,
      checkout,
      guests,
      currency: CURRENCY,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Tapline price error ${res.status}: ${err}`)
  }

  return res.json()
}

/**
 * Normalise a raw Tapline listing object into the shape the app uses.
 * Falls back to sensible defaults if optional fields are missing.
 * @param {object} raw - item from Tapline search results array
 * @returns {object}
 */
export function normaliseListing(raw) {
  const priceAmount = raw.price?.amount ?? raw.pricing?.price?.amount ?? 0
  const priceFormatted = raw.price?.formatted ?? `R ${priceAmount.toLocaleString('en-ZA')}`

  return {
    id: raw.room_id ?? raw.id,
    title: raw.title ?? 'Listing',
    location: raw.location?.address ?? raw.location ?? 'South Africa',
    type: raw.property_type ?? 'Entire home',
    guests: raw.person_capacity ?? raw.guests ?? 2,
    beds: raw.beds ?? 1,
    baths: raw.baths ?? 1,
    price: priceAmount,
    priceFormatted,
    currency: CURRENCY,
    rating: parseFloat(raw.rating_average ?? raw.rating ?? 0),
    reviews: parseInt(raw.rating_count ?? raw.reviews ?? 0, 10),
    host: raw.host?.name ?? raw.host ?? 'Host',
    hostSince: raw.host?.years_hosting ? `${raw.host.years_hosting} years hosting` : 'Airbnb host',
    image: raw.main_image_url ?? raw.image ?? 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80',
    gallery: raw.images?.map((img) => img.url) ?? [raw.main_image_url ?? raw.image ?? ''],
    amenities:
      raw.amenity_groups
        ?.flatMap((g) => g.amenities.filter((a) => a.available).map((a) => a.title))
        .slice(0, 10) ?? [],
    description: raw.description ?? '',
    isFromApi: true,
  }
}
