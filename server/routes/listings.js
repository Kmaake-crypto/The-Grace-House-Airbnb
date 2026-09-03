import { Router } from 'express'
import mongoose from 'mongoose'
import Listing from '../models/Listing.js'
import {
  createFallbackListing,
  deactivateFallbackListing,
  getFallbackListingById,
  getFallbackListings,
  updateFallbackListing,
} from '../fallbackStore.js'
import { optionalAuth, requireAuth, requireHost } from '../middleware/auth.js'

const router = Router()

// ── GET /api/listings ──────────────────────────────────────
// Query params: location, type, minPrice, maxPrice, guests, search
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { location, type, minPrice, maxPrice, guests, search, limit = 50, page = 1 } = req.query
    const filter = { isActive: true }

    if (mongoose.connection.readyState !== 1) {
      const listings = req.query.mine === 'true' && req.user
        ? getFallbackListings(req.user.sub)
        : getFallbackListings()
      return res.json({ success: true, total: listings.length, page: Number(page), listings })
    }

    if (location) filter.location = { $regex: location, $options: 'i' }
    if (req.query.mine === 'true' && req.user) filter.owner = req.user.sub
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
    if (mongoose.connection.readyState !== 1) {
      const listing = getFallbackListingById(req.params.id)
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
      return res.json({ success: true, listing })
    }
    const listing = await Listing.findById(req.params.id)
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
    res.json({ success: true, listing })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── POST /api/listings ─────────────────────────────────────
router.post('/', requireAuth, requireHost, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const listing = createFallbackListing({ ...req.body, owner: req.user.sub, host: req.user.name || 'Host' })
      return res.status(201).json({ success: true, listing })
    }

    const listing = new Listing({ ...req.body, owner: req.user.sub, host: req.user.name || 'Host' })
    await listing.save()
    res.status(201).json({ success: true, listing })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// ── PUT /api/listings/:id ──────────────────────────────────
router.put('/:id', requireAuth, requireHost, async (req, res) => {
  try {
    const editable = ['title', 'location', 'description', 'type', 'guests', 'beds', 'baths', 'price', 'priceFormatted', 'currency', 'image', 'gallery', 'amenities']
    const updates = Object.fromEntries(editable.filter((field) => field in req.body).map((field) => [field, req.body[field]]))
    if (mongoose.connection.readyState !== 1) {
      const listing = updateFallbackListing(req.params.id, req.user.sub, updates, req.user.role === 'admin')
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
      return res.json({ success: true, listing })
    }
    const listing = await Listing.findOneAndUpdate(
      req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.sub },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
    res.json({ success: true, listing })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// ── DELETE /api/listings/:id ───────────────────────────────
router.delete('/:id', requireAuth, requireHost, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const listing = deactivateFallbackListing(req.params.id, req.user.sub, req.user.role === 'admin')
      if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
      return res.json({ success: true, message: 'Listing deactivated' })
    }

    const listing = await Listing.findOneAndUpdate(
      req.user.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, owner: req.user.sub },
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
