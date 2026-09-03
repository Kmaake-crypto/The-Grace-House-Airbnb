import { config } from 'dotenv'
import dns from 'node:dns'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import { ensureFallbackSeedUser } from './fallbackStore.js'
import User from './models/User.js'
import listingRoutes from './routes/listings.js'
import bookingRoutes from './routes/bookings.js'
import userRoutes   from './routes/users.js'
import taplineRoutes from './routes/tapline.js'

// Load server/.env regardless of where node is invoked from
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env') })
dns.setServers((process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8').split(','))

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Health check ──────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

// ── Routes ────────────────────────────────────────────────
app.use('/api/listings', listingRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/users',    userRoutes)
app.use('/api/tapline',  taplineRoutes)

// ── Global error handler ──────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Request body must be valid JSON' })
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

// ── MongoDB connection + server start ─────────────────────
const MONGO_URI = process.env.MONGO_URI

async function ensureSeedUser() {
  const email = 'koketsomaake295@gmail.com'
  const password = 'Kmaake0616368479$'
  const normalizedEmail = email.trim().toLowerCase()

  try {
    const existing = await User.findOne({ email: normalizedEmail })

    if (existing) {
      existing.name = existing.name || 'Koketso Maake'
      existing.role = 'host'
      existing.isActive = true
      existing.setPassword(password)
      await existing.save()
      console.log(`✅ Seed user updated: ${normalizedEmail}`)
      return
    }

    const newUser = new User({
      name: 'Koketso Maake',
      email: normalizedEmail,
      role: 'host',
      isActive: true,
    })

    newUser.setPassword(password)
    await newUser.save()
    console.log(`✅ Seed user created: ${normalizedEmail}`)
  } catch (err) {
    console.error('⚠️ Seed user setup failed:', err.message)
  }
}

if (!MONGO_URI) {
  console.warn('⚠️  MONGO_URI is not set in server/.env — running with local fallback auth only.')
}

async function startServer() {
  await ensureFallbackSeedUser()

  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI)
      console.log('✅  MongoDB connected')
      await ensureSeedUser()
    } catch (err) {
      console.warn('⚠️  MongoDB connection failed:', err.message)
      console.warn('⚠️  Continuing in fallback auth mode using the local seed user store.')
    }
  }

  app.listen(PORT, () => console.log(`🚀  API server running on http://localhost:${PORT}`))
}

startServer().catch((err) => {
  console.error('❌  Server startup failed:', err.message)
  process.exit(1)
})
