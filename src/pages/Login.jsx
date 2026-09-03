import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/useAuth.js'

export default function Login({ role = 'guest' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const isHostLogin = role === 'host'
  const [form, setForm] = useState({ email: '', password: '', role })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const session = await login(form)
      navigate(location.state?.from || (session.user?.role === 'guest' ? '/' : '/dashboard'), { replace: true })
    } catch (err) {
      setError(err.message === 'Failed to fetch'
        ? 'The server is unavailable. Start the API with npm run dev:server and try again.'
        : err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <Navbar showSearch={false} />
      <main className="max-w-md mx-auto px-6 py-16">
        <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{isHostLogin ? 'Host sign in' : 'Guest sign in'}</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{isHostLogin ? 'Access your host dashboard and listings.' : 'Sign in to book and manage your stays.'}</p>
          {error && <p className="mt-5 rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(227,28,95,.1)', color: '#c41854' }}>{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Email
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input mt-1" autoComplete="email" />
            </label>
            <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Password
              <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input mt-1" autoComplete="current-password" />
            </label>
            <button disabled={saving} className="btn-primary w-full disabled:opacity-60" type="submit">
              {saving ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="text-sm text-center mt-6" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account? <Link to={isHostLogin ? '/admin/register' : '/register'} className="font-semibold text-brand hover:underline">Create one</Link>
          </p>
          <p className="text-sm text-center mt-3" style={{ color: 'var(--text-muted)' }}>
            {isHostLogin ? 'Booking a stay?' : 'Hosting a stay?'} <Link to={isHostLogin ? '/login' : '/admin/login'} className="font-semibold text-brand hover:underline">{isHostLogin ? 'Guest sign in' : 'Host sign in'}</Link>
          </p>
        </div>
      </main>
    </div>
  )
}