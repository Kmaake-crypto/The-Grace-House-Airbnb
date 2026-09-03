import mongoose from 'mongoose'
import dns from 'node:dns'
import { config } from 'dotenv'
import User from './models/User.js'

config({ path: './server/.env' })
dns.setServers((process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8').split(','))

const email = 'koketsomaake295@gmail.com'
const password = 'Kmaake0616368479$'

async function main() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set in server/.env')
    }

    await mongoose.connect(process.env.MONGO_URI)

    const normalizedEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: normalizedEmail })

    if (existing) {
      existing.name = existing.name || 'Koketso Maake'
      existing.role = 'host'
      existing.isActive = true
      existing.setPassword(password)
      await existing.save()
      console.log(`✅ Updated user: ${normalizedEmail}`)
    } else {
      const user = new User({
        name: 'Koketso Maake',
        email: normalizedEmail,
        role: 'host',
        isActive: true,
      })
      user.setPassword(password)
      await user.save()
      console.log(`✅ Created user: ${normalizedEmail}`)
    }

    const saved = await User.findOne({ email: normalizedEmail }).select('+passwordHash')
    console.log('Password valid:', saved.checkPassword(password))
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

main()
