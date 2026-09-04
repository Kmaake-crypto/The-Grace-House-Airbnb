import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import logo from '../assets/airbnb.png'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/useAuth.js'

export default function Navbar({ dark = false, showSearch = true }) {
  const { isDark, toggle } = useTheme()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const isHost = user?.role === 'host' || user?.role === 'admin'
  const navLinks = isAuthenticated && user?.role === 'admin'
    ? [{ to: '/admin', label: 'Admin Dashboard' }]
    : isAuthenticated && isHost
    ? [{ to: '/dashboard', label: 'Dashboard' }, { to: '/hosting', label: 'Hosting' }]
    : isAuthenticated
    ? [{ to: '/', label: 'Explore stays' }]
    : []

  return (
    <header
      className="relative transition-colors duration-300"
      style={
        isDark
          ? { background: 'linear-gradient(135deg, #001E1E 0%, #016764 100%)', color: '#e2fafa' }
          : dark
          ? { background: 'linear-gradient(135deg, #001E1E 0%, #016764 100%)', color: '#fff' }
          : { background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', color: 'var(--text-primary)' }
      }
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Air B&B logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-lg text-brand">Air B&amp;B</span>
        </Link>

        {/* Search — hidden on mobile */}
        {showSearch && (
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar compact />
          </div>
        )}

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4 text-sm font-semibold">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="hover:underline">{label}</Link>
          ))}
          <div className="relative">
            <button onClick={() => setProfileOpen((open) => !open)} className="flex items-center gap-2 hover:underline" aria-expanded={profileOpen} aria-label="Open profile menu">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ background: '#016764' }}>
                {isAuthenticated
                  ? (user?.name || 'User').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>}
              </span>
              <span>{isAuthenticated ? user?.name || 'Profile' : 'Profile'}</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-11 z-50 w-56 rounded-xl p-3 shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {isAuthenticated ? <>
                  <button onClick={() => { navigate('/reservations'); setProfileOpen(false) }} className="block w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-black/5">View reservations</button>
                  <button onClick={() => { logout(); setProfileOpen(false) }} className="block w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-black/5">Log out</button>
                </> : <>
                  <p className="text-xs font-semibold uppercase tracking-wide px-3 pb-2" style={{ color: 'var(--text-muted)' }}>Guest account</p>
                  <Link to="/login" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-black/5">Guest sign in</Link>
                  <Link to="/register" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-black/5">Guest sign up</Link>
                  <Link to="/admin/login" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-black/5" style={{ color: '#016764' }}>Host sign in</Link>
                  <Link to="/admin/control/login" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-black/5" style={{ color: '#016764' }}>Admin sign in</Link>
                </>}
              </div>
            )}
          </div>

          {/* Dark / Light toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative w-12 h-6 rounded-full flex items-center focus:outline-none focus-visible:ring-2"
            style={{ background: isDark ? 'linear-gradient(135deg,#016764,#001E1E)' : '#d1d5db' }}
          >
            <span
              className="relative z-10 w-5 h-5 rounded-full shadow-md flex items-center justify-center text-xs transition-all duration-300"
              style={{
                transform: isDark ? 'translateX(26px)' : 'translateX(2px)',
                background: '#ffffff',
              }}
            >
              {isDark ? '🌙' : '☀️'}
            </span>
          </button>
        </nav>

        {/* Mobile right side: toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="relative w-10 h-5 rounded-full flex items-center"
            style={{ background: isDark ? 'linear-gradient(135deg,#016764,#001E1E)' : '#d1d5db' }}
          >
            <span
              className="relative z-10 w-4 h-4 rounded-full shadow flex items-center justify-center text-[10px] transition-all duration-300"
              style={{ transform: isDark ? 'translateX(22px)' : 'translateX(2px)', background: '#fff' }}
            >
              {isDark ? '🌙' : '☀️'}
            </span>
          </button>

          <button
            onClick={() => setProfileOpen((open) => !open)}
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ background: '#016764' }}
          >
            {isAuthenticated
              ? (user?.name || 'User').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>}
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Open menu"
            className="flex flex-col gap-1.5 p-1"
          >
            {menuOpen ? (
              <span className="text-xl leading-none" style={{ color: 'currentColor' }}>✕</span>
            ) : (
              <>
                <span className="block w-5 h-0.5 rounded" style={{ background: 'currentColor' }} />
                <span className="block w-5 h-0.5 rounded" style={{ background: 'currentColor' }} />
                <span className="block w-5 h-0.5 rounded" style={{ background: 'currentColor' }} />
              </>
            )}
          </button>
        </div>
      </div>

      {profileOpen && (
        <div className="md:hidden absolute right-6 top-full z-50 w-56 rounded-xl p-3 shadow-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {isAuthenticated ? <>
            <button onClick={() => { navigate('/reservations'); setProfileOpen(false) }} className="block w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-black/5">View reservations</button>
            <button onClick={() => { logout(); setProfileOpen(false) }} className="block w-full text-left rounded-lg px-3 py-2 text-sm hover:bg-black/5">Log out</button>
          </> : <>
            <p className="text-xs font-semibold uppercase tracking-wide px-3 pb-2" style={{ color: 'var(--text-muted)' }}>Guest account</p>
            <Link to="/login" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-black/5">Guest sign in</Link>
            <Link to="/register" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-semibold hover:bg-black/5">Guest sign up</Link>
            <Link to="/admin/login" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-black/5" style={{ color: '#016764' }}>Host sign in</Link>
            <Link to="/admin/control/login" onClick={() => setProfileOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-black/5" style={{ color: '#016764' }}>Admin sign in</Link>
          </>}
        </div>
      )}

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 z-40 px-6 py-4 flex flex-col gap-3 shadow-xl"
          style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}
        >
          {showSearch && <SearchBar compact />}
          {navLinks.map(({ to, label }) => (
            <Link
              key={to} to={to}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold py-2 px-3 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)', background: 'var(--bg-surface)' }}
            >
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={() => { logout(); setMenuOpen(false) }}
              className="text-left text-sm font-semibold py-2 px-3 rounded-lg"
              style={{ color: 'var(--text-primary)', background: 'var(--bg-surface)' }}
            >
              Log out
            </button>
          )}
        </div>
      )}
    </header>
  )
}
