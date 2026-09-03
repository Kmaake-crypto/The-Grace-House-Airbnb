import { Router } from 'express'
import mongoose from 'mongoose'
import Booking from '../models/Booking.js'
import Listing from '../models/Listing.js'
import {
  cancelFallbackBooking,
  createFallbackBooking,
  getFallbackBookingsForUser,
  updateFallbackBookingStatus,
} from '../fallbackStore.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// ── GET /api/bookings ──────────────────────────────────────
// Optional query: status, guestEmail, listingId
router.get('/', requireAuth, async (req, res) => {
  try {
    const { status, guestEmail, listingId, limit = 50, page = 1 } = req.query
    const filter = {}

    if (mongoose.connection.readyState !== 1) {
      let bookings = getFallbackBookingsForUser(req.user.sub, req.user.role)
      if (status) bookings = bookings.filter((booking) => booking.status === status)
      if (guestEmail) bookings = bookings.filter((booking) => booking.guestEmail === guestEmail.toLowerCase())
      return res.json({ success: true, total: bookings.length, page: Number(page), bookings })
    }

    if (status)     filter.status     = status
    if (guestEmail) filter.guestEmail = guestEmail.toLowerCase()
    if (listingId)  filter.$or        = [
      { listing: listingId },
      { externalListingId: listingId },
    ]
    if (req.user.role === 'admin') {
      // Admins can review the complete reservation ledger.
    } else if (req.user.role === 'host') {
      const ownedListings = await Listing.find({ owner: req.user.sub }).distinct('_id')
      filter.$or = [
        { listing: { $in: ownedListings } },
        { hostUser: req.user.sub },
      ]
    } else {
      filter.user = req.user.sub
    }

    const skip = (Number(page) - 1) * Number(limit)
    const [items, total] = await Promise.all([
      Booking.find(filter)
        .populate('listing', 'title location image price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(filter),
    ])

    res.json({ success: true, total, page: Number(page), bookings: items })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── GET /api/bookings/:id ──────────────────────────────────
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const accessFilter = req.user.role === 'admin'
      ? {}
      : req.user.role === 'host'
      ? { hostUser: req.user.sub }
      : { user: req.user.sub }
    const booking = await Booking.findOne({ _id: req.params.id, ...accessFilter }).populate('listing')
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    res.json({ success: true, booking })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── POST /api/bookings ─────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      listingId,
      externalListingId,
      listingTitle,
      listingLocation,
      listingImage,
      guestName,
      guestEmail,
      guests,
      checkin,
      checkout,
      nights,
      nightlyRate,
      subtotal,
      cleaningFee,
      serviceFee,
      totalAmount,
    } = req.body

    // Basic validation
    if (!listingTitle || !guestName || !guestEmail || !checkin || !checkout) {
      return res.status(400).json({ success: false, message: 'Missing required booking fields' })
    }
    if (req.user.role !== 'guest') {
      return res.status(403).json({ success: false, message: 'Only guest accounts can make reservations' })
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checkin) || !/^\d{4}-\d{2}-\d{2}$/.test(checkout) || checkout <= checkin) {
      return res.status(400).json({ success: false, message: 'Checkout must be after check-in' })
    }
    if (!Number.isInteger(Number(guests)) || Number(guests) < 1) {
      return res.status(400).json({ success: false, message: 'Guests must be at least 1' })
    }

    if (mongoose.connection.readyState !== 1) {
      const booking = createFallbackBooking({
        listingTitle,
        listingLocation,
        listingImage,
        guestName,
        guestEmail: guestEmail.toLowerCase(),
        guests,
        checkin,
        checkout,
        nights,
        nightlyRate,
        subtotal,
        cleaningFee,
        serviceFee,
        totalAmount,
        user: req.user.role === 'guest' ? req.user.sub : undefined,
        hostUser: req.user.role === 'host' ? req.user.sub : undefined,
      })
      return res.status(201).json({ success: true, booking })
    }

    const linkedListing = listingId ? await Listing.findById(listingId).select('owner') : null

    const booking = new Booking({
      listing:           listingId    || undefined,
      externalListingId: externalListingId || undefined,
      listingTitle,
      listingLocation,
      listingImage,
      guestName,
      guestEmail:  guestEmail.toLowerCase(),
      guests,
      checkin,
      checkout,
      nights,
      nightlyRate,
      subtotal,
      cleaningFee,
      serviceFee,
      totalAmount,
      status: 'confirmed',
      user: req.user.role === 'guest' ? req.user.sub : undefined,
      hostUser: linkedListing?.owner || (req.user.role === 'host' ? req.user.sub : undefined),
    })

    await booking.save()
    res.status(201).json({ success: true, booking })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// ── PATCH /api/bookings/:id/status ────────────────────────
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed']
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` })
    }

    if (mongoose.connection.readyState !== 1) {
      const booking = updateFallbackBookingStatus(req.params.id, req.user.sub, req.user.role, status)
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
      return res.json({ success: true, booking })
    }

    const accessFilter = req.user.role === 'admin'
      ? {}
      : req.user.role === 'host'
      ? { hostUser: req.user.sub }
      : { user: req.user.sub }
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, ...accessFilter },
      { status },
      { new: true }
    )
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    res.json({ success: true, booking })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── DELETE /api/bookings/:id ───────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const ownedBooking = getFallbackBookingsForUser(req.user.sub, req.user.role)
        .find((item) => String(item._id) === req.params.id)
      const booking = ownedBooking && cancelFallbackBooking(req.params.id)
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
      return res.json({ success: true, message: 'Booking cancelled', booking })
    }

    const accessFilter = req.user.role === 'admin'
      ? {}
      : req.user.role === 'host'
      ? { hostUser: req.user.sub }
      : { user: req.user.sub }
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, ...accessFilter },
      { status: 'cancelled' },
      { new: true }
    )
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    res.json({ success: true, message: 'Booking cancelled', booking })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
