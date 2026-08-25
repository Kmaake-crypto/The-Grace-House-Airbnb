import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function CreateListing() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    rooms: '',
    baths: '',
    type: '',
    amenities: '',
  })

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleCreate(e) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C11 10 5 17.5 5 22.5C5 27.7 9.6 31 16 31C22.4 31 27 27.7 27 22.5C27 17.5 21 10 16 2Z" fill="#E31C5F" />
            </svg>
            <span className="font-bold text-lg text-brand">StayFinder</span>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Create Listing</h1>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-brand mb-1">Listing Name</label>
              <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand mb-1">Location</label>
              <input className="input" value={form.location} onChange={(e) => update('location', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand mb-1">Description</label>
              <textarea className="input h-28" value={form.description} onChange={(e) => update('description', e.target.value)} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand mb-1">Rooms</label>
                <input className="input" value={form.rooms} onChange={(e) => update('rooms', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand mb-1">Baths</label>
                <input className="input" value={form.baths} onChange={(e) => update('baths', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-brand mb-1">Type</label>
                <input className="input" value={form.type} onChange={(e) => update('type', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand mb-1">Amenities</label>
              <input className="input" value={form.amenities} onChange={(e) => update('amenities', e.target.value)} placeholder="Wifi, Kitchen, Free parking..." />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-brand mb-1">Images</label>
            <div className="flex items-start gap-4">
              <div className="flex-1 h-24 border border-gray-300 rounded-md" />
              <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md px-4 py-2 whitespace-nowrap">
                Upload Image
              </button>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-8 py-2">
              Create
            </button>
            <Link to="/dashboard" className="bg-brand hover:bg-brand-dark text-white font-semibold rounded-md px-8 py-2 flex items-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}