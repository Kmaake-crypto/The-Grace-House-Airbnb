import { config } from 'dotenv'
import dns from 'node:dns'
import fs from 'node:fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import { ensureFallbackSeedUser } from './fallbackStore.js'
import User from './models/User.js'
import { DEMO_ACCOUNTS } from './demoAccounts.js'
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
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const stripSlash = (s) => (s || '').replace(/\/+$/, '')
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    const allowed = clientOrigin.split(',').map((o) => stripSlash(o.trim()))
    if (allowed.includes(stripSlash(origin)) || allowed.includes('*')) return callback(null, true)
    callback(null, false)
  },
  credentials: true,
}))
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

// ── API Routes ────────────────────────────────────────────
app.use('/api/listings', listingRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/users',    userRoutes)
app.use('/api/tapline',  taplineRoutes)

// ── Serve built React app (only if dist exists) ───────────
const clientDistPath = join(__dirname, '..', 'dist')
const clientDistAlt  = join(__dirname, '..', 'client', 'dist')
const staticPath = fs.existsSync(join(clientDistPath, 'index.html'))
  ? clientDistPath
  : fs.existsSync(join(clientDistAlt, 'index.html'))
    ? clientDistAlt
    : null

if (staticPath) {
  app.use(express.static(staticPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(join(staticPath, 'index.html'), (err) => { if (err) next() })
  })
  console.log('📁  Serving static frontend from:', staticPath)
} else {
  console.log('ℹ️  No static frontend dist found — API-only mode')
  app.get('/', (_req, res) => res.json({ name: 'Grace House API', status: 'running' }))
}

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
  try {
    for (const account of DEMO_ACCOUNTS) {
      const normalizedEmail = account.email.trim().toLowerCase()
      const existing = await User.findOne({ email: normalizedEmail })
      const user = existing || new User({ email: normalizedEmail })
      user.name = account.name
      user.role = account.role
      user.isActive = true
      user.setPassword(account.password)
      await user.save()
      console.log(`✅ Demo ${account.role} ready: ${normalizedEmail}`)
    }
  } catch (err) {
    console.error('⚠️ Demo account setup failed:', err.message)
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
