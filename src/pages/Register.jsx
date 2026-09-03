import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/useAuth.js'

export default function Register({ role = 'guest' }) {
  const navigate = useNavigate()
  const { register } = useAuth()
  const isHostRegistration = role === 'host'
  const [form, setForm] = useState({ name: '', email: '', password: '', role })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await register(form)
      navigate(isHostRegistration ? '/dashboard' : '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <Navbar showSearch={false} />
      <main className="max-w-md mx-auto px-6 py-16">
        <div className="rounded-2xl p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{isHostRegistration ? 'Create a host account' : 'Create a guest account'}</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{isHostRegistration ? 'List your stays and manage bookings from your host dashboard.' : 'Join Air B&amp;B to discover and book stays.'}</p>
          {error && <p className="mt-5 rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(227,28,95,.1)', color: '#c41854' }}>{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Full name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input mt-1" autoComplete="name" />
            </label>
            <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Email
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input mt-1" autoComplete="email" />
            </label>
            <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Password
              <input required minLength={6} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input mt-1" autoComplete="new-password" />
            </label>
            <button disabled={saving} className="btn-primary w-full disabled:opacity-60" type="submit">
              {saving ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <p className="text-sm text-center mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account? <Link to={isHostRegistration ? '/admin/login' : '/login'} className="font-semibold text-brand hover:underline">Sign in</Link>
          </p>
          <p className="text-sm text-center mt-3" style={{ color: 'var(--text-muted)' }}>
            {isHostRegistration ? 'Looking for a stay?' : 'Want to host?'} <Link to={isHostRegistration ? '/register' : '/admin/register'} className="font-semibold text-brand hover:underline">{isHostRegistration ? 'Guest sign up' : 'Host sign up'}</Link>
          </p>
        </div>
      </main>
    </div>
  )
}