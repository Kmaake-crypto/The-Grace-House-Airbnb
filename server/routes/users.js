import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
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

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' })
    }

    const user = new User({ name, email, phone, role: role || 'guest' })
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
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase(), isActive: true }).select('+passwordHash')
    if (!user || !user.checkPassword(password)) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Strip passwordHash before returning
    const { passwordHash: _pw, ...safe } = user.toObject()
    res.json({ success: true, user: safe, token: createToken(user) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// ── PUT /api/users/:id ─────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
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
router.post('/:id/save-listing', async (req, res) => {
  try {
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
