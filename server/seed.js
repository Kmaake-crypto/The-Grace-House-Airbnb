/**
 * seed.js
 * Seeds demo accounts into MongoDB on server startup.
 * Safe to run on every boot — uses upsert so it never creates duplicates.
 */

import User from './models/User.js'
import { DEMO_ACCOUNTS } from './demoAccounts.js'

export async function seedDemoAccounts() {
  try {
    for (const account of DEMO_ACCOUNTS) {
      const email = account.email.trim().toLowerCase()

      // Check if the user already exists
      const existing = await User.findOne({ email }).select('+passwordHash')

      if (existing) {
        // Make sure the password hash is current (re-set it in case it changed)
        existing.setPassword(account.password)
        existing.role = account.role
        existing.isActive = true
        await existing.save()
        console.log(`✔  Demo account updated: ${email} (${account.role})`)
      } else {
        // Create fresh
        const user = new User({
          name:     account.name,
          email,
          role:     account.role,
          isActive: true,
        })
        user.setPassword(account.password)
        await user.save()
        console.log(`✔  Demo account created: ${email} (${account.role})`)
      }
    }
    console.log('🌱  Demo accounts seeded successfully')
  } catch (err) {
    console.error('⚠️  Demo seed error (non-fatal):', err.message)
  }
}
