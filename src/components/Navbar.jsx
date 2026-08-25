import { Link } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'

export default function Navbar({ dark = false, showSearch = true }) {
  return (
    <header className={dark ? 'bg-gray-900 text-white' : 'bg-white border-b border-gray-200'}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M16 2C11 10 5 17.5 5 22.5C5 27.7 9.6 31 16 31C22.4 31 27 27.7 27 22.5C27 17.5 21 10 16 2Z" fill="#E31C5F" />
          </svg>
          <span className="font-bold text-lg text-brand">StayFinder</span>
        </Link>
        {showSearch && <div className="hidden md:block flex-1 max-w-md"><SearchBar compact /></div>}
        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/create-listing" className="hover:underline">Host</Link>
        </nav>
      </div>
    </header>
  )
}