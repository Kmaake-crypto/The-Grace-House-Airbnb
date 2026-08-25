import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import SearchBar from '../components/SearchBar.jsx'
import ListingCard from '../components/ListingCard.jsx'
import { inspirationHotels, listings } from '../data/listings.js'
import heroImage from '../assets/bnb hero (2).png'

// Top South African destinations for the quick-search strips
const SA_CITIES = [
  { name: 'Cape Town', region: 'Western Cape', query: 'Cape Town, South Africa', emoji: '🌊' },
  { name: 'Johannesburg', region: 'Gauteng', query: 'Johannesburg, South Africa', emoji: '🏙️' },
  { name: 'Durban', region: 'KwaZulu-Natal', query: 'Durban, South Africa', emoji: '🏖️' },
  { name: 'Stellenbosch', region: 'Winelands', query: 'Stellenbosch, South Africa', emoji: '🍷' },
  { name: 'Knysna', region: 'Garden Route', query: 'Knysna, South Africa', emoji: '🌿' },
  { name: 'Kruger Park', region: 'Limpopo', query: 'Kruger Park, South Africa', emoji: '🦁' },
]

export default function Home() {
  const navigate = useNavigate()

  function goTo(query) {
    navigate(`/search?location=${encodeURIComponent(query)}`)
  }

  // Show the first 4 SA fallback listings as featured cards
  const featuredListings = listings.slice(0, 4)

  return (
    <div>
      <Navbar dark showSearch={false} />

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-6 pb-8 pt-4">
        <SearchBar />
      </div>

      {/* Hero banner */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-2xl overflow-hidden h-[420px]">
          <img
            src={heroImage}
            alt="Featured stay"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center gap-4 px-4">
            <p className="text-white text-sm font-medium tracking-widest uppercase opacity-80">
              🇿🇦 South Africa&apos;s finest stays
            </p>
            <h1 className="text-white text-4xl font-semibold drop-shadow max-w-lg leading-tight">
              Not sure where to go? Perfect.
            </h1>
            <button
              onClick={() => goTo('South Africa')}
              className="bg-white text-gray-900 font-semibold rounded-full px-6 py-3 hover:bg-gray-100 transition-colors"
            >
              I&apos;m flexible
            </button>
          </div>
        </div>
      </div>

      {/* Quick-pick SA city grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Explore South Africa
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          All prices shown in South African Rand (ZAR)
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {SA_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => goTo(city.query)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-brand hover:shadow-md transition-all group"
            >
              <span className="text-3xl">{city.emoji}</span>
              <span className="font-semibold text-sm text-gray-900 group-hover:text-brand">
                {city.name}
              </span>
              <span className="text-xs text-gray-500">{city.region}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Inspiration section — SA landmarks */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Inspiration for your next trip
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {inspirationHotels.map((hotel) => (
            <button
              key={hotel.name}
              onClick={() => goTo(`${hotel.name}, South Africa`)}
              className="relative rounded-xl overflow-hidden h-56 group cursor-pointer text-left w-full"
            >
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold leading-tight">{hotel.name}</h3>
                <p className="text-xs opacity-80">{hotel.distance}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured SA listings */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Featured South African Stays
          </h2>
          <a
            href="/search?location=South+Africa"
            className="text-sm font-semibold text-brand underline hover:no-underline"
          >
            Show all
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} layout="grid" />
          ))}
        </div>
      </section>

      {/* Discover Experiences */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Discover Airbnb Experiences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative rounded-xl overflow-hidden h-64">
            <img
              src="https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1000&q=80"
              alt="Things to do on your trip"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center pl-8 text-white gap-3">
              <h3 className="text-2xl font-semibold max-w-[220px]">
                Things to do on your trip
              </h3>
              <button className="bg-white text-gray-900 font-semibold rounded-md px-4 py-2 w-fit">
                Experiences
              </button>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden h-64">
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1000&q=80"
              alt="Things to do from home"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-center pl-8 text-white gap-3">
              <h3 className="text-2xl font-semibold max-w-[220px]">
                Things to do from home
              </h3>
              <button className="bg-white text-gray-900 font-semibold rounded-md px-4 py-2 w-fit">
                Online Experiences
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gift cards */}
      <section className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Shop Airbnb gift cards
          </h2>
          <button className="bg-gray-900 text-white font-semibold rounded-md px-5 py-2.5">
            Learn more
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-40 h-24 rounded-lg bg-gradient-to-br from-sky-300 to-indigo-500 -rotate-6 shadow-lg" />
          <div className="w-40 h-24 rounded-lg bg-brand -ml-10 shadow-lg" />
          <div className="w-40 h-24 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 rotate-6 -ml-10 shadow-lg" />
        </div>
      </section>

      {/* Hosting CTA */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative rounded-2xl overflow-hidden h-72">
          <img
            src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=1400&q=80"
            alt="Questions about hosting"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center pl-10 text-white gap-4">
            <h3 className="text-4xl font-bold max-w-md">
              Questions about hosting?
            </h3>
            <button className="bg-white text-gray-900 font-semibold rounded-md px-5 py-2.5 w-fit">
              Ask a Superhost
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
