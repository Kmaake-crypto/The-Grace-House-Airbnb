/**
 * Demo accounts for development/testing.
 * In production, set these via environment variables and NEVER commit real passwords.
 * The fallback values below are development-only placeholders.
 */
export const DEMO_ACCOUNTS = [
  {
    name:  process.env.DEMO_GUEST_NAME  || 'Demo Guest',
    email: process.env.DEMO_GUEST_EMAIL || 'guest@gracehouse.co.za',
    password: process.env.DEMO_GUEST_PASSWORD || 'Guest123!',
    role: 'guest',
  },
  {
    name:  process.env.DEMO_HOST_NAME  || 'Demo Host',
    email: process.env.DEMO_HOST_EMAIL || 'host@gracehouse.co.za',
    password: process.env.DEMO_HOST_PASSWORD || 'Host123!',
    role: 'host',
  },
  {
    name:  process.env.DEMO_ADMIN_NAME  || 'Grace House Admin',
    email: process.env.DEMO_ADMIN_EMAIL || 'admin@gracehouse.co.za',
    password: process.env.DEMO_ADMIN_PASSWORD || 'Admin123!',
    role: 'admin',
  },
]
