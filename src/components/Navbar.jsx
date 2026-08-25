import { Link } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'
import logo from '../assets/1787575804347_image.png'

export default function Navbar({ dark = false, showSearch = true }) {
  return (
    <header className={dark ? 'bg-gray-900 text-white' : 'bg-white border-b border-gray-200'}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Air B&B logo" className="w-10 h-10 object-contain" />
          <span className="font-bold text-lg text-brand">Air B&amp;B</span>
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