import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

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
      <Navbar showSearch={false} />

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