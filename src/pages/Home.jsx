import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import SearchBar from '../components/SearchBar.jsx'
import ListingCard from '../components/ListingCard.jsx'
import { inspirationHotels, listings } from '../data/listings.js'
const heroImage = 'https://images.unsplash.com/photo-1697807646004-31ae73a1a625?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const SA_CITIES = [
  { name: 'Cape Town',     region: 'Western Cape',  query: 'Cape Town, South Africa' },
  { name: 'Johannesburg',  region: 'Gauteng',        query: 'Johannesburg, South Africa' },
  { name: 'Durban',        region: 'KwaZulu-Natal',  query: 'Durban, South Africa' },
  { name: 'Stellenbosch',  region: 'Winelands',      query: 'Stellenbosch, South Africa' },
  { name: 'Knysna',        region: 'Garden Route',   query: 'Knysna, South Africa' },
  { name: 'Kruger Park',   region: 'Limpopo',        query: 'Kruger Park, South Africa' },
]

export default function Home() {
  const navigate = useNavigate()
  const [getawayTab, setGetawayTab] = useState('coast')
  const goTo = (query) => navigate(`/search?location=${encodeURIComponent(query)}`)
  const featuredListings = listings.slice(0, 4)
  const getaways = {
    coast: ['Cape Town', 'Durban', 'Knysna', 'Port Elizabeth'],
    city: ['Johannesburg', 'Pretoria', 'Cape Town', 'Durban'],
    nature: ['Kruger Park', 'Stellenbosch', 'Knysna', 'Drakensberg'],
  }

  return (
    <div className="transition-colors duration-300" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <Navbar dark showSearch={false} />

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-6 pb-8 pt-4">
        <SearchBar />
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-2xl overflow-hidden h-[420px]">
          <img src={heroImage} alt="Featured stay" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center gap-4 px-4"
            style={{ background: 'linear-gradient(to bottom, rgba(0,30,30,0.6) 0%, rgba(1,103,100,0.4) 100%)' }}
          >
            <p className="text-white text-sm font-medium tracking-widest uppercase opacity-90">
              🇿🇦 South Africa&apos;s finest stays
            </p>
            <h1 className="text-white text-4xl font-semibold drop-shadow max-w-lg leading-tight">
              Not sure where to go? Perfect.
            </h1>
            <button
              onClick={() => goTo('South Africa')}
              className="bg-white font-semibold rounded-full px-6 py-3 hover:opacity-90 transition-opacity"
              style={{ color: '#016764' }}
            >
              I&apos;m flexible
            </button>
          </div>
        </div>
      </div>

      {/* SA city quick-picks */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Explore South Africa
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          All prices in South African Rand (ZAR)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {SA_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => goTo(city.query)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:shadow-md"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#016764'; e.currentTarget.style.color = '#016764' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            >
              <span className="font-semibold text-sm">{city.name}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{city.region}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Inspiration */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Inspiration for your next trip
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {inspirationHotels.map((hotel) => (
            <button
              key={hotel.name}
              onClick={() => goTo(`${hotel.name}, South Africa`)}
              className="relative rounded-xl overflow-hidden h-56 group cursor-pointer text-left w-full"
            >
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold leading-tight">{hotel.name}</h3>
                <p className="text-xs opacity-80">{hotel.distance}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Featured South African Stays
          </h2>
          <a href="/search?location=South+Africa" className="text-sm font-semibold underline hover:no-underline" style={{ color: '#016764' }}>
            Show all
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} layout="grid" />
          ))}
        </div>
      </section>

      {/* Future getaways */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Inspiration for future getaways
        </h2>
        <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Future getaway categories">
          {[['coast', 'Coastal escapes'], ['city', 'City breaks'], ['nature', 'Nature retreats']].map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={getawayTab === key}
              onClick={() => setGetawayTab(key)}
              className="rounded-full px-4 py-2 text-sm font-semibold"
              style={getawayTab === key
                ? { background: '#016764', color: '#fff' }
                : { background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" role="tabpanel">
          {getaways[getawayTab].map((destination) => (
            <button
              key={destination}
              onClick={() => goTo(`${destination}, South Africa`)}
              className="text-left rounded-xl p-4 transition-shadow hover:shadow-md"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{destination}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Explore stays in South Africa</p>
            </button>
          ))}
        </div>
      </section>

      {/* Experiences */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Discover Airbnb Experiences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { src: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1000&q=80', title: 'Things to do on your trip', cta: 'Experiences' },
            { src: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1000&q=80', title: 'Things to do from home', cta: 'Online Experiences' },
          ].map((card) => (
            <div key={card.title} className="relative rounded-xl overflow-hidden h-64">
              <img src={card.src} alt={card.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-center pl-8 text-white gap-3">
                <h3 className="text-2xl font-semibold max-w-[220px]">{card.title}</h3>
                <button className="bg-white font-semibold rounded-md px-4 py-2 w-fit" style={{ color: '#016764' }}>
                  {card.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gift cards */}
      <section className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Shop Airbnb gift cards
          </h2>
          <button className="font-semibold rounded-md px-5 py-2.5 text-white" style={{ background: 'var(--teal-dark)' }}>
            Learn more
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80"
            alt="Gift cards on a desk"
            className="w-full max-w-sm h-40 object-cover rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* Hosting CTA */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative rounded-2xl overflow-hidden h-72">
          <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=1400&q=80" alt="Questions about hosting" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center pl-10 text-white gap-4">
            <h3 className="text-4xl font-bold max-w-md">Questions about hosting?</h3>
            <button className="bg-white font-semibold rounded-md px-5 py-2.5 w-fit" style={{ color: '#016764' }}>
              Ask a Superhost
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
