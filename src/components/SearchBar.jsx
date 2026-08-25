import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function SearchBar({ compact = false }) {
  const [where, setWhere] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/search?location=${encodeURIComponent(where || 'South Africa')}`)
  }

  if (compact) {
    return (
      <form
        onSubmit={handleSearch}
        className="flex items-center rounded-full shadow-sm text-sm"
        style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
      >
        <input
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder="Start your search"
          className="flex-1 px-4 py-2 rounded-full focus:outline-none bg-transparent"
          style={{ color: 'var(--text-primary)' }}
        />
        <button
          type="submit"
          className="text-white rounded-full w-8 h-8 flex items-center justify-center mr-1"
          style={{ background: '#016764' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSearch}
      className="rounded-full shadow-lg flex items-center divide-x max-w-2xl mx-auto"
      style={{ background: 'var(--bg-card)', divideColor: 'var(--border)', border: '1px solid var(--border)' }}
    >
      <div className="flex-1 px-6 py-3">
        <label className="block text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Hotels</label>
        <input
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder="Select Hotel"
          className="w-full text-sm focus:outline-none bg-transparent"
          style={{ color: 'var(--text-muted)' }}
        />
      </div>
      <div className="flex-1 px-6 py-3" style={{ borderLeft: '1px solid var(--border)' }}>
        <label className="block text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Check in</label>
        <span className="block text-sm" style={{ color: 'var(--text-muted)' }}>Add dates</span>
      </div>
      <div className="flex-1 px-6 py-3" style={{ borderLeft: '1px solid var(--border)' }}>
        <label className="block text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Check out</label>
        <span className="block text-sm" style={{ color: 'var(--text-muted)' }}>Add dates</span>
      </div>
      <div className="flex-1 px-6 py-3 flex items-center justify-between" style={{ borderLeft: '1px solid var(--border)' }}>
        <div>
          <label className="block text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Guests</label>
          <span className="block text-sm" style={{ color: 'var(--text-muted)' }}>Add guests</span>
        </div>
        <button
          type="submit"
          className="text-white rounded-full w-10 h-10 flex items-center justify-center ml-2 shrink-0"
          style={{ background: '#016764' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </form>
  )
}
