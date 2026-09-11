import { useState, useEffect, useCallback } from 'react'
import { searchListings, getListingDetails, normaliseListing } from '../services/taplineApi.js'
import { listings as fallbackListings } from '../data/listings.js'
import { listingsApi, normaliseMongoListing } from '../services/api.js'

const MONGO_ID_RE = /^[0-9a-f]{24}$/i

function dedupe(listings) {
  const seen = new Set()
  return listings.filter((l) => {
    const key = String(l.id)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Custom hook that fetches South African listings from the Tapline API.
 * Falls back to the static SA listings if the API call fails or is loading.
 *
 * @param {string} location - Search query, defaults to "South Africa"
 * @param {object} options  - Optional checkin / checkout / guests
 * @returns {{ listings, loading, error, refetch }}
 */
export function useTaplineListings(location = 'South Africa', options = {}) {
  const [listings, setListings] = useState(fallbackListings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchListings = useCallback(async () => {
    setLoading(true)
    setError(null)

    const merged = []
    let taplineError = null

    // Host-created listings from MongoDB come first so they are publicly discoverable.
    await listingsApi.getAll()
      .then((data) => {
        const mongo = Array.isArray(data.listings) ? data.listings.map(normaliseMongoListing) : []
        merged.push(...dedupe(mongo))
      })
      .catch(() => {})

    try {
      const data = await searchListings(location, options)

      // Tapline returns either data.listings or data.results — handle both
      const raw = data.listings ?? data.results ?? data.items ?? []

      if (Array.isArray(raw) && raw.length > 0) {
        merged.push(...dedupe(raw.map(normaliseListing)))
      }
    } catch (err) {
      taplineError = err.message
    }

    // Static curated SA listings fill the rest.
    merged.push(...dedupe(fallbackListings))

    setListings(dedupe(merged))
    setError(taplineError)
    setLoading(false)
  }, [location, options.checkin, options.checkout, options.guests]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  return { listings, loading, error, refetch: fetchListings }
}

/**
 * Custom hook that fetches a single listing's details from Tapline.
 * Returns null while loading; on error falls back to the static listing by id.
 *
 * @param {string|number} id - Tapline room_id or local fallback id
 * @returns {{ listing, loading, error }}
 */
export function useTaplineListing(id) {
  const [listing, setListing] = useState(
    () => fallbackListings.find((l) => String(l.id) === String(id)) ?? fallbackListings[0]
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        // Host-created listings (Mongo ObjectIds) resolve from MongoDB first.
        if (MONGO_ID_RE.test(String(id))) {
          try {
            const res = await listingsApi.getById(id)
            if (!cancelled && res.listing) {
              setListing(normaliseMongoListing(res.listing))
              setLoading(false)
              return
            }
          } catch {
            // fall through to Tapline below
          }
        }

        const data = await getListingDetails(id)
        if (!cancelled) {
          setListing(normaliseListing(data))
          setLoading(false)
        }
      } catch (err) {
        // Tapline listing detail error — try MongoDB as a last resort.
        console.warn('Tapline listing detail error, using fallback:', err.message)
        if (!cancelled) {
          try {
            const res = await listingsApi.getById(id)
            if (res.listing) {
              setListing(normaliseMongoListing(res.listing))
              setLoading(false)
              return
            }
          } catch {
            // keep whatever fallback was set in initial state
          }
          setError(err.message)
          setLoading(false)
        }
      }
    }

    // Only hit the API for non-local IDs (local IDs start with 'sa-')
    if (String(id).startsWith('sa-')) {
      setLoading(false)
    } else {
      load()
    }

    return () => { cancelled = true }
  }, [id])

  return { listing, loading, error }
}
