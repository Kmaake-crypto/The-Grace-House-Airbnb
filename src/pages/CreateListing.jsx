import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { listingsApi } from '../services/api.js'

const AMENITY_OPTIONS = [
  'Wifi', 'Kitchen', 'Free parking', 'Pool', 'Air conditioning',
  'Braai / BBQ', 'Washing machine', 'TV', 'Pets allowed', 'Workspace',
]

const PROPERTY_TYPES = ['Entire home', 'Entire apartment', 'Private room', 'Shared room', 'Entire studio']

export default function CreateListing() {
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    name: '', location: '', description: '',
    rooms: '', baths: '', guests: '', price: '',
    type: '', amenities: [],
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState(null)

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: null }))
  }

  function toggleAmenity(a) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }))
  }

  function handleImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function validate() {
    const e = {}
    if (!form.name.trim())     e.name     = 'Required'
    if (!form.location.trim()) e.location = 'Required'
    if (!form.price)           e.price    = 'Required'
    if (!form.type)            e.type     = 'Required'
    return e
  }

  async function handleCreate(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }

    setSaving(true)
    setApiError(null)

    try {
      await listingsApi.create({
        title:       form.name,
        location:    form.location,
        description: form.description,
        type:        form.type,
        beds:        Number(form.rooms) || 1,
        baths:       Number(form.baths) || 1,
        guests:      Number(form.guests) || 2,
        price:       Number(form.price),
        amenities:   form.amenities,
        image:       imagePreview || '',
        gallery:     imagePreview ? [imagePreview] : [],
        currency:    'ZAR',
      })
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '0.6rem 0.75rem',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#016764',
    marginBottom: '0.3rem',
  }

  const errorStyle = { fontSize: '0.7rem', color: '#e31c5f', marginTop: '0.25rem' }

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <Navbar showSearch={false} />

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Create a New Listing
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            List your South African property and start earning in ZAR
          </p>
        </div>

        {/* API error */}
        {apiError && (
          <div className="mb-6 text-sm rounded-lg px-4 py-3"
            style={{ background: 'rgba(227,28,95,0.1)', border: '1px solid #E31C5F', color: '#E31C5F' }}>
            {apiError} — check that the backend server is running.
          </div>
        )}

        <form onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* ── Left column ── */}
            <div className="space-y-5">
              <div>
                <label style={labelStyle}>Listing Name</label>
                <input style={inputStyle} value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Clifton Beachfront Villa" />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>

              <div>
                <label style={labelStyle}>Location</label>
                <input style={inputStyle} value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="e.g. Cape Town, South Africa" />
                {errors.location && <p style={errorStyle}>{errors.location}</p>}
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, height: '7rem', resize: 'vertical' }}
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Describe your property..." />
              </div>

              <div>
                <label style={labelStyle}>Property Type</label>
                <select style={inputStyle} value={form.type}
                  onChange={(e) => update('type', e.target.value)}>
                  <option value="">Select type…</option>
                  {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.type && <p style={errorStyle}>{errors.type}</p>}
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label style={labelStyle}>Rooms</label>
                  <input style={inputStyle} type="number" min="1" value={form.rooms}
                    onChange={(e) => update('rooms', e.target.value)} placeholder="2" />
                </div>
                <div>
                  <label style={labelStyle}>Baths</label>
                  <input style={inputStyle} type="number" min="1" value={form.baths}
                    onChange={(e) => update('baths', e.target.value)} placeholder="1" />
                </div>
                <div>
                  <label style={labelStyle}>Guests</label>
                  <input style={inputStyle} type="number" min="1" value={form.guests}
                    onChange={(e) => update('guests', e.target.value)} placeholder="4" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Price per Night (ZAR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold"
                    style={{ color: '#016764' }}>R</span>
                  <input style={{ ...inputStyle, paddingLeft: '1.75rem' }}
                    type="number" min="0" value={form.price}
                    onChange={(e) => update('price', e.target.value)}
                    placeholder="1500" />
                </div>
                {errors.price && <p style={errorStyle}>{errors.price}</p>}
              </div>

              {/* Image upload */}
              <div>
                <label style={labelStyle}>Property Photo</label>
                <div
                  className="rounded-xl overflow-hidden flex items-center justify-center cursor-pointer relative"
                  style={{
                    height: '9rem',
                    border: `2px dashed var(--border)`,
                    background: 'var(--bg-surface)',
                  }}
                  onClick={() => fileRef.current?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl mb-1">📷</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to upload photo</p>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*"
                    className="hidden" onChange={handleImage} />
                </div>
                {imagePreview && (
                  <button type="button"
                    className="text-xs underline mt-1"
                    style={{ color: 'var(--text-muted)' }}
                    onClick={() => setImagePreview(null)}>
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            {/* ── Amenities (full width) ── */}
            <div className="md:col-span-2">
              <label style={labelStyle}>Amenities</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {AMENITY_OPTIONS.map((a) => {
                  const active = form.amenities.includes(a)
                  return (
                    <button key={a} type="button"
                      onClick={() => toggleAmenity(a)}
                      className="text-xs font-semibold rounded-full px-3 py-1.5 transition-colors"
                      style={active
                        ? { background: '#016764', color: '#fff', border: '1px solid #016764' }
                        : { background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                      {a}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ── Actions (full width) ── */}
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <Link to="/dashboard"
                className="font-semibold rounded-lg px-6 py-2.5 text-sm transition-opacity hover:opacity-80"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                Cancel
              </Link>
              <button type="submit"
                disabled={saving}
                className="font-semibold rounded-lg px-8 py-2.5 text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #016764 0%, #001E1E 100%)' }}>
                {saving ? 'Saving…' : 'Create Listing'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}
