import mongoose from 'mongoose'
import dns from 'node:dns'
import { config } from 'dotenv'
import User from './models/User.js'
import { DEMO_ACCOUNTS } from './demoAccounts.js'

config({ path: './server/.env' })
dns.setServers((process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8').split(','))

async function main() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not set in server/.env')
    }

    await mongoose.connect(process.env.MONGO_URI)

    for (const account of DEMO_ACCOUNTS) {
      const normalizedEmail = account.email.trim().toLowerCase()
      const user = await User.findOne({ email: normalizedEmail }) || new User({ email: normalizedEmail })
      user.name = account.name
      user.role = account.role
      user.isActive = true
      user.setPassword(account.password)
      await user.save()
      console.log(`✅ Demo ${account.role} ready: ${normalizedEmail}`)
    }
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

main()
