import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import listingRoutes from './routes/listings.js'
import bookingRoutes from './routes/bookings.js'
import userRoutes   from './routes/users.js'

// Load server/.env regardless of where node is invoked from
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env') })

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

if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set in server/.env — please add it and restart.')
  process.exit(1)
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected')
    app.listen(PORT, () => console.log(`🚀  API server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message)
    process.exit(1)
  })
