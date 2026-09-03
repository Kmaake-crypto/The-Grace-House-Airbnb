import { Router } from 'express'
import mongoose from 'mongoose'
import Booking from '../models/Booking.js'
import {
  cancelFallbackBooking,
  createFallbackBooking,
  getFallbackBookings,
} from '../fallbackStore.js'

const router = Router()

// ── GET /api/bookings ──────────────────────────────────────
// Optional query: status, guestEmail, listingId
router.get('/', async (req, res) => {
  try {
    const { status, guestEmail, listingId, limit = 50, page = 1 } = req.query
    const filter = {}

    if (mongoose.connection.readyState !== 1) {
      let bookings = getFallbackBookings()
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
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('listing')
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
    res.json({ success: true, booking })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── POST /api/bookings ─────────────────────────────────────
router.post('/', async (req, res) => {
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
      })
      return res.status(201).json({ success: true, booking })
    }

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
    })

    await booking.save()
    res.status(201).json({ success: true, booking })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// ── PATCH /api/bookings/:id/status ────────────────────────
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed']
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` })
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
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
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const booking = cancelFallbackBooking(req.params.id)
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' })
      return res.json({ success: true, message: 'Booking cancelled', booking })
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
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
