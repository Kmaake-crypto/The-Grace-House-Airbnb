import { Link } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import logo from '../assets/airbnb.png'
import { useTheme } from '../context/ThemeContext.jsx'

export default function Navbar({ dark = false, showSearch = true }) {
  const { isDark, toggle } = useTheme()

  return (
    <header
      className="transition-colors duration-300"
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

        {/* Search */}
        {showSearch && (
          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar compact />
          </div>
        )}

        {/* Nav links + toggle */}
        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/create-listing" className="hover:underline">Host</Link>

          {/* Dark / Light toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 flex items-center"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #016764, #001E1E)'
                : '#d1d5db',
              focusRingColor: '#016764',
            }}
          >
            {/* Track fill */}
            <span
              className="absolute inset-0 rounded-full transition-all duration-300"
              style={{ background: isDark ? 'linear-gradient(135deg, #016764 0%, #001E1E 100%)' : '#d1d5db' }}
            />
            {/* Thumb */}
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
      </div>
    </header>
  )
}
