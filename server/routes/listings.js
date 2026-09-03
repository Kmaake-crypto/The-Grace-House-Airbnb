import { Router } from 'express'
import mongoose from 'mongoose'
import Listing from '../models/Listing.js'
import {
  createFallbackListing,
  deactivateFallbackListing,
  getFallbackListings,
} from '../fallbackStore.js'

const router = Router()

// ── GET /api/listings ──────────────────────────────────────
// Query params: location, type, minPrice, maxPrice, guests, search
router.get('/', async (req, res) => {
  try {
    const { location, type, minPrice, maxPrice, guests, search, limit = 50, page = 1 } = req.query
    const filter = { isActive: true }

    if (mongoose.connection.readyState !== 1) {
      const listings = getFallbackListings()
      return res.json({ success: true, total: listings.length, page: Number(page), listings })
    }

    if (location) filter.location = { $regex: location, $options: 'i' }
    if (type)     filter.type     = { $regex: type,     $options: 'i' }
    if (guests)   filter.guests   = { $gte: Number(guests) }
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }
    if (search) {
      filter.$text = { $search: search }
    }

    const skip = (Number(page) - 1) * Number(limit)
    const [items, total] = await Promise.all([
      Listing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Listing.countDocuments(filter),
    ])

    res.json({ success: true, total, page: Number(page), listings: items })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── GET /api/listings/:id ──────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
    res.json({ success: true, listing })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── POST /api/listings ─────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const listing = createFallbackListing(req.body)
      return res.status(201).json({ success: true, listing })
    }

    const listing = new Listing(req.body)
    await listing.save()
    res.status(201).json({ success: true, listing })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// ── PUT /api/listings/:id ──────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
    res.json({ success: true, listing })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// ── DELETE /api/listings/:id ───────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const listing = deactivateFallbackListing(req.params.id)
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
      return res.json({ success: true, message: 'Listing deactivated' })
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
    res.json({ success: true, message: 'Listing deactivated' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
