import { useState, useEffect, useCallback } from 'react'
import { searchListings, getListingDetails, normaliseListing } from '../services/taplineApi.js'
import { listings as fallbackListings } from '../data/listings.js'

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

    try {
      const data = await searchListings(location, options)

      // Tapline returns either data.listings or data.results — handle both
      const raw = data.listings ?? data.results ?? data.items ?? []

      if (Array.isArray(raw) && raw.length > 0) {
        setListings([...raw.map(normaliseListing), ...fallbackListings])
      } else {
        // API succeeded but returned empty — keep fallback
        setListings(fallbackListings)
      }
    } catch (err) {
      console.warn('Tapline API error, using fallback listings:', err.message)
      setError(err.message)
      setListings(fallbackListings)
    } finally {
      setLoading(false)
    }
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
        const data = await getListingDetails(id)
        if (!cancelled) {
          setListing(normaliseListing(data))
        }
      } catch (err) {
        console.warn('Tapline listing detail error, using fallback:', err.message)
        if (!cancelled) {
          setError(err.message)
          // keep whatever fallback was set in initial state
        }
      } finally {
        if (!cancelled) setLoading(false)
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
