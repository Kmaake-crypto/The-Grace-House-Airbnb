import { Router } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'
import {
  createFallbackUser,
  getFallbackUserByEmail,
  verifyFallbackPassword,
} from '../fallbackStore.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, name: user.name },
    process.env.JWT_SECRET || 'development-secret-change-me',
    { expiresIn: '7d' },
  )
}

// ── GET /api/users ─────────────────────────────────────────
router.get('/', async (_req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-passwordHash').sort({ createdAt: -1 })
    res.json({ success: true, users })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── GET /api/users/:id ─────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── POST /api/users/register ───────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email and password are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const accountRole = role === 'host' ? 'host' : 'guest'

    if (mongoose.connection.readyState !== 1) {
      const fallbackUser = getFallbackUserByEmail(normalizedEmail)
      if (fallbackUser) {
        return res.status(409).json({ success: false, message: 'Email already registered' })
      }
      const created = createFallbackUser({
        name,
        email: normalizedEmail,
        password,
        phone,
        role: accountRole,
      })

      if (!created) {
        return res.status(409).json({ success: false, message: 'Email already registered' })
      }

      const { passwordHash: _pw, ...safe } = created
      return res.status(201).json({ success: true, user: safe, token: createToken({ _id: created._id, role: created.role }) })
    }

    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' })
    }

    const user = new User({ name, email: normalizedEmail, phone, role: accountRole })
    user.setPassword(password)
    await user.save()

    res.status(201).json({ success: true, user, token: createToken(user) })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// ── POST /api/users/login ──────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, role = 'guest' } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const isHostLogin = role === 'host'
    const hasExpectedRole = (user) => role === 'admin'
      ? user.role === 'admin'
      : isHostLogin
      ? user.role === 'host'
      : user.role === 'guest'

    if (mongoose.connection.readyState !== 1) {
      const fallbackUser = getFallbackUserByEmail(normalizedEmail)
      if (fallbackUser && verifyFallbackPassword(normalizedEmail, password) && hasExpectedRole(fallbackUser)) {
        const { passwordHash: _pw, ...safe } = fallbackUser
        return res.json({ success: true, user: safe, token: createToken({ _id: fallbackUser._id, role: fallbackUser.role }) })
      }
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' })
    }

    const user = await User.findOne({ email: normalizedEmail, isActive: true }).select('+passwordHash')

    if (!user || !user.checkPassword(password)) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password.',
      })
    }

    // Role check — admin can log in from any login page
    if (role !== 'admin' && user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Please use the admin login page.',
      })
    }

    if (!hasExpectedRole(user)) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as a ${user.role}. Please use the correct sign-in page.`,
      })
    }

    const { passwordHash: _pw, ...safe } = user.toObject()
    res.json({ success: true, user: safe, token: createToken(user) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── PUT /api/users/:id ─────────────────────────────────────
router.put('/:id', requireAuth, async (req, res) => {
  try {
    if (String(req.user.sub) !== String(req.params.id)) {
      return res.status(403).json({ success: false, message: 'You can only update your own profile' })
    }
    // Don't allow password changes through this route
    const { passwordHash: _pw, ...updates } = req.body
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-passwordHash')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, user })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
})

// ── POST /api/users/:id/save-listing ──────────────────────
router.post('/:id/save-listing', requireAuth, async (req, res) => {
  try {
    if (String(req.user.sub) !== String(req.params.id)) {
      return res.status(403).json({ success: false, message: 'You can only update your own saved listings' })
    }
    const { listingId } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    const already = user.savedListings.map(String).includes(String(listingId))
    if (already) {
      user.savedListings = user.savedListings.filter((id) => String(id) !== String(listingId))
    } else {
      user.savedListings.push(listingId)
    }
    await user.save()
    res.json({ success: true, saved: !already, savedListings: user.savedListings })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

export default router
