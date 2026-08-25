import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function SearchBar({ compact = false }) {
  const [where, setWhere] = useState('')
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/search?location=${encodeURIComponent(where || 'Bordeaux')}`)
  }

  if (compact) {
    return (
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm text-sm"
      >
        <input
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder="Start your search"
          className="flex-1 px-4 py-2 rounded-full focus:outline-none"
        />
        <button type="submit" className="bg-brand text-white rounded-full w-8 h-8 flex items-center justify-center mr-1">
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
      className="bg-white rounded-full shadow-lg flex items-center divide-x divide-gray-200 max-w-2xl mx-auto"
    >
      <div className="flex-1 px-6 py-3">
        <label className="block text-xs font-semibold text-gray-800">Hotels</label>
        <input
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          placeholder="Select Hotel"
          className="w-full text-sm text-gray-500 focus:outline-none"
        />
      </div>
      <div className="flex-1 px-6 py-3">
        <label className="block text-xs font-semibold text-gray-800">Check in</label>
        <span className="block text-sm text-gray-500">Add dates</span>
      </div>
      <div className="flex-1 px-6 py-3">
        <label className="block text-xs font-semibold text-gray-800">Check out</label>
        <span className="block text-sm text-gray-500">Add dates</span>
      </div>
      <div className="flex-1 px-6 py-3 flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-gray-800">Guests</label>
          <span className="block text-sm text-gray-500">Add guests</span>
        </div>
        <button type="submit" className="bg-brand text-white rounded-full w-10 h-10 flex items-center justify-center ml-2 shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </form>
  )
}