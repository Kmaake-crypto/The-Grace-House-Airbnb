import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import mongoose from 'mongoose'
import dns from 'node:dns'

// Load server/.env regardless of where node is invoked from
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '.env') })
dns.setServers((process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8').split(','))

console.log('🔌 Connecting to MongoDB Atlas...')

try {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  console.log('✅ SUCCESS — MongoDB connected!')
  console.log('   DB:', mongoose.connection.db.databaseName)
  await mongoose.disconnect()
  console.log('🔒 Disconnected cleanly.')
} catch (e) {
  console.error('❌ FAILED:', e.message)
}
