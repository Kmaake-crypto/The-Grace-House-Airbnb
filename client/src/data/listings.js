/**
 * Static South African fallback listings used when the Tapline API
 * is unavailable or still loading.  Prices are in ZAR (South African Rand).
 */

export const listings = [
  {
    id: 'sa-1',
    title: 'Clifton Beachfront Villa',
    location: 'Clifton, Cape Town, South Africa',
    type: 'Entire home',
    guests: 6,
    beds: 3,
    baths: 2,
    price: 4500,
    priceFormatted: 'R 4,500',
    currency: 'ZAR',
    rating: 4.9,
    reviews: 214,
    host: 'Anele',
    hostSince: 'March 2019',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&q=80',
    ],
    amenities: [
      'Ocean view', 'Wifi', 'Pool', 'Free parking', 'Kitchen',
      'Air conditioning', 'Braai / BBQ', 'Washing machine', 'Smart TV', 'Streaming services', 'Beach gear', 'Pets allowed',
    ],
    description:
      "Wake up to the sound of waves at this stunning Clifton villa. Perched above one of Cape Town's most famous beaches, you get uninterrupted Atlantic Ocean views, a private pool, and all the comforts of a luxury home. Walk to the beach in under two minutes.",
  },
  {
    id: 'sa-2',
    title: 'Sandton Luxury Apartment',
    location: 'Sandton, Johannesburg, South Africa',
    type: 'Entire apartment',
    guests: 2,
    beds: 1,
    baths: 1,
    price: 2200,
    priceFormatted: 'R 2,200',
    currency: 'ZAR',
    rating: 4.8,
    reviews: 189,
    host: 'Thabo',
    hostSince: 'January 2020',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    ],
    amenities: [
      'City view', 'Wifi', 'Gym access', 'Free parking', 'Kitchen',
      'Air conditioning', 'Concierge', 'Security', 'Smart TV', 'Streaming services', 'Workspace', 'Coffee machine',
    ],
    description:
      "Sleek, modern apartment in the heart of Sandton — South Africa's financial capital. Steps from Sandton City Mall, Nelson Mandela Square, and the Gautrain station. Perfect for business travellers or a stylish city break.",
  },
  {
    id: 'sa-3',
    title: 'Winelands Farmhouse Retreat',
    location: 'Stellenbosch, Western Cape, South Africa',
    type: 'Entire home',
    guests: 8,
    beds: 4,
    baths: 3,
    price: 3800,
    priceFormatted: 'R 3,800',
    currency: 'ZAR',
    rating: 4.95,
    reviews: 302,
    host: 'Pieter',
    hostSince: 'June 2018',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80',
      'https://images.unsplash.com/photo-1600566752734-2a0cd53da75f?w=800&q=80',
    ],
    amenities: [
      'Mountain view', 'Wifi', 'Vineyard access', 'Free parking', 'Full kitchen',
      'Braai / BBQ', 'Fire pit', 'Washing machine', 'Smart TV', 'Wine tasting', 'Farm animals', 'Bikes',
    ],
    description:
      'Escape to the Cape Winelands in this charming whitewashed farmhouse surrounded by vineyards and mountain views. Enjoy private wine tastings, morning hikes on the property, and evenings around the fire pit under the stars.',
  },
  {
    id: 'sa-4',
    title: 'V&A Waterfront Studio',
    location: 'V&A Waterfront, Cape Town, South Africa',
    type: 'Entire studio',
    guests: 2,
    beds: 1,
    baths: 1,
    price: 1800,
    priceFormatted: 'R 1,800',
    currency: 'ZAR',
    rating: 4.7,
    reviews: 143,
    host: 'Fatima',
    hostSince: 'September 2021',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    ],
    amenities: [
      'Harbour view', 'Wifi', 'Kitchenette', 'Air conditioning',
      'Smart TV', 'Streaming services', 'Workspace', 'Gym access', 'Concierge',
    ],
    description:
      'Contemporary studio right at the V&A Waterfront. Walk to the Two Oceans Aquarium, top restaurants, and boat trips to Robben Island. Table Mountain is visible from your window — the perfect Cape Town base.',
  },
  {
    id: 'sa-5',
    title: 'Durban Beachside Bungalow',
    location: 'Umhlanga, Durban, South Africa',
    type: 'Entire home',
    guests: 5,
    beds: 3,
    baths: 2,
    price: 2900,
    priceFormatted: 'R 2,900',
    currency: 'ZAR',
    rating: 4.85,
    reviews: 97,
    host: 'Priya',
    hostSince: 'November 2020',
    image: 'https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    ],
    amenities: [
      'Beach access', 'Wifi', 'Pool', 'Outdoor shower', 'Kitchen',
      'Braai / BBQ', 'Surfboards', 'Beach gear', 'Free parking', 'Air conditioning', 'Smart TV', 'Streaming services',
    ],
    description:
      "Laid-back bungalow steps from Umhlanga's famous Blue Flag beach. Warm Indian Ocean water year-round, a private pool for cooler days, and easy access to Gateway Theatre of Shopping and KwaZulu-Natal's best restaurants.",
  },
  {
    id: 'sa-6',
    title: 'Kruger Safari Lodge Room',
    location: 'Hoedspruit, Limpopo, South Africa',
    type: 'Private room',
    guests: 2,
    beds: 1,
    baths: 1,
    price: 5200,
    priceFormatted: 'R 5,200',
    currency: 'ZAR',
    rating: 5.0,
    reviews: 58,
    host: 'Johan',
    hostSince: 'July 2017',
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    ],
    amenities: [
      'Bush view', 'Wifi', 'Game drives included', 'All meals included',
      'Pool', 'Air conditioning', 'Smart TV', 'Game drives included', 'Laundry service', 'Guided walks',
    ],
    description:
      'Fall asleep to lion roars and wake to elephant sightings from this en-suite lodge room on the edge of the Greater Kruger National Park. Twice-daily game drives, bush walks, and all meals are included in the rate.',
  },
  ...[
    {
      id: 'sa-7', city: 'Cape Town', area: 'Sea Point', title: 'Sea Point Oceanfront Loft', type: 'Entire apartment', guests: 4, beds: 2, baths: 1, price: 2400, host: 'Lerato',
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', feature: 'Ocean view', description: 'A bright Sea Point loft with a balcony facing the Atlantic, close to the promenade, beaches, and the city centre.',
    },
    {
      id: 'sa-8', city: 'Cape Town', area: 'Bo-Kaap', title: 'Colourful Bo-Kaap Townhouse', type: 'Entire townhouse', guests: 5, beds: 3, baths: 2, price: 3100, host: 'Aisha',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', feature: 'Mountain view', description: 'A characterful townhouse in the historic Bo-Kaap, with a sunny courtyard and Table Mountain views from the upper room.',
    },
    {
      id: 'sa-9', city: 'Cape Town', area: 'Hout Bay', title: 'Hout Bay Garden Cottage', type: 'Entire cottage', guests: 3, beds: 2, baths: 1, price: 1650, host: 'Marius',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80', feature: 'Garden view', description: 'A peaceful garden cottage near Hout Bay beach, Chapman’s Peak, and local seafood restaurants.',
    },
    {
      id: 'sa-10', city: 'Johannesburg', area: 'Rosebank', title: 'Rosebank Art District Apartment', type: 'Entire apartment', guests: 2, beds: 1, baths: 1, price: 1900, host: 'Nandi',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', feature: 'City view', description: 'A polished Rosebank apartment near galleries, restaurants, the Gautrain, and the weekend rooftop market.',
    },
    {
      id: 'sa-11', city: 'Johannesburg', area: 'Maboneng', title: 'Maboneng Warehouse Studio', type: 'Entire studio', guests: 2, beds: 1, baths: 1, price: 1250, host: 'Kabelo',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', feature: 'Workspace', description: 'A stylish converted warehouse in Maboneng, surrounded by independent cafes, studios, and Sunday markets.',
    },
    {
      id: 'sa-12', city: 'Johannesburg', area: 'Melville', title: 'Melville Jacaranda Home', type: 'Entire home', guests: 6, beds: 3, baths: 2, price: 2350, host: 'Sipho',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80', feature: 'Garden view', description: 'A leafy Melville home with a private garden, braai area, and easy access to 7th Street and the university precinct.',
    },
    {
      id: 'sa-13', city: 'Durban', area: 'North Beach', title: 'North Beach Family Flat', type: 'Entire apartment', guests: 5, beds: 3, baths: 2, price: 2100, host: 'Zanele',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', feature: 'Beach access', description: 'A breezy family flat a short walk from Durban’s Golden Mile, with secure parking and a large balcony.',
    },
    {
      id: 'sa-14', city: 'Durban', area: 'Berea', title: 'Berea Tropical Courtyard House', type: 'Entire home', guests: 6, beds: 3, baths: 2, price: 2600, host: 'Sibusiso',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80', feature: 'Pool', description: 'A relaxed Berea home with tropical gardens and a plunge pool, minutes from Florida Road and the Moses Mabhida Stadium.',
    },
    {
      id: 'sa-15', city: 'Durban', area: 'Umhlanga', title: 'Umhlanga Lighthouse Suite', type: 'Private suite', guests: 2, beds: 1, baths: 1, price: 1750, host: 'Priya',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', feature: 'Sea view', description: 'A calm private suite near the Umhlanga promenade, with sea views, a shared pool, and sunrise walks on the pier.',
    },
    {
      id: 'sa-16', city: 'Stellenbosch', area: 'Jonkershoek', title: 'Jonkershoek Mountain Cabin', type: 'Entire cabin', guests: 4, beds: 2, baths: 1, price: 2750, host: 'Elmarie',
      image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200&q=80', feature: 'Mountain view', description: 'A quiet timber cabin beside the Jonkershoek trails, ideal for fresh mountain mornings and slow evenings outdoors.',
    },
    {
      id: 'sa-17', city: 'Stellenbosch', area: 'Banghoek', title: 'Banghoek Vineyard Cottage', type: 'Entire cottage', guests: 2, beds: 1, baths: 1, price: 2300, host: 'Anika',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', feature: 'Vineyard view', description: 'A romantic cottage among the Banghoek vineyards, with a private patio and complimentary cellar tasting nearby.',
    },
    {
      id: 'sa-18', city: 'Stellenbosch', area: 'Dorp Street', title: 'Dorp Street Heritage Suite', type: 'Entire suite', guests: 3, beds: 2, baths: 1, price: 1850, host: 'Pieter',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', feature: 'Historic charm', description: 'A restored Cape Dutch suite on historic Dorp Street, steps from Stellenbosch cafes, galleries, and wine bars.',
    },
    {
      id: 'sa-19', city: 'Knysna', area: 'Leisure Isle', title: 'Leisure Isle Lagoon Villa', type: 'Entire villa', guests: 6, beds: 3, baths: 2, price: 3200, host: 'Megan',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80', feature: 'Lagoon view', description: 'A light-filled villa on Leisure Isle with a deck overlooking the Knysna Lagoon and bikes for exploring the island.',
    },
    {
      id: 'sa-20', city: 'Knysna', area: 'The Heads', title: 'Knysna Heads Cliff House', type: 'Entire home', guests: 8, beds: 4, baths: 3, price: 4200, host: 'David',
      image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1200&q=80', feature: 'Water view', description: 'A spacious cliffside home near the Knysna Heads, with wide ocean views, a sheltered braai deck, and room for the whole family.',
    },
    {
      id: 'sa-21', city: 'Knysna', area: 'Brenton-on-Sea', title: 'Brenton Beach Hideaway', type: 'Entire cottage', guests: 4, beds: 2, baths: 1, price: 2450, host: 'Lwazi',
      image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200&q=80', feature: 'Beach access', description: 'A tucked-away coastal cottage above Brenton-on-Sea, with a fire pit, ocean air, and direct access to long sandy walks.',
    },
    {
      id: 'sa-22', city: 'Kruger Park', area: 'Hoedspruit', title: 'Hoedspruit Bush Villa', type: 'Entire villa', guests: 6, beds: 3, baths: 2, price: 4800, host: 'Johan',
      image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80', feature: 'Bush view', description: 'A private bush villa near Hoedspruit with an outdoor boma, pool, and guided safari arrangements on request.',
    },
    {
      id: 'sa-23', city: 'Kruger Park', area: 'Sabi Sand', title: 'Sabi Sand Safari Tent', type: 'Private tent', guests: 2, beds: 1, baths: 1, price: 6100, host: 'Thandi',
      image: 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=1200&q=80', feature: 'Game drives', description: 'A comfortable canvas suite beside the Sabi Sand reserve, with dawn drives, outdoor showers, and evening bush dinners.',
    },
    {
      id: 'sa-24', city: 'Kruger Park', area: 'Marloth Park', title: 'Marloth Park Bush Chalet', type: 'Entire chalet', guests: 4, beds: 2, baths: 1, price: 2900, host: 'Bongani',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80', feature: 'Wildlife sightings', description: 'A shaded chalet in Marloth Park where antelope wander past the deck, with a braai area and easy Kruger gate access.',
    },
  ].map((mockup) => ({
    ...mockup,
    amenities: {
      'Cape Town': ['Wifi', 'Free parking', 'Kitchen', 'Smart TV', 'Streaming services', 'Beach gear', 'Braai / BBQ', 'Air conditioning'],
      Johannesburg: ['Wifi', 'Free parking', 'Kitchen', 'Smart TV', 'Streaming services', 'Workspace', 'Gym access', '24-hour security'],
      Durban: ['Wifi', 'Free parking', 'Kitchen', 'Smart TV', 'Streaming services', 'Beach access', 'Surfboards', 'Outdoor shower'],
      Stellenbosch: ['Wifi', 'Free parking', 'Full kitchen', 'Smart TV', 'Wine tasting', 'Vineyard access', 'Bikes', 'Fire pit'],
      Knysna: ['Wifi', 'Free parking', 'Kitchen', 'Smart TV', 'Streaming services', 'Kayaks', 'Beach access', 'Braai / BBQ'],
      'Kruger Park': ['Wifi', 'Free parking', 'Kitchen', 'Outdoor dining', 'Game drives', 'Guided walks', 'Pool', 'Boma / fire pit'],
    }[mockup.city],
    location: `${mockup.area}, ${mockup.city}, South Africa`,
    currency: 'ZAR',
    priceFormatted: `R ${mockup.price.toLocaleString('en-ZA')}`,
    rating: 4.7,
    reviews: 36,
    hostSince: '2022',
    gallery: [mockup.image],
    feature: undefined,
  })),
]

export const inspirationHotels = [
  {
    name: 'Cape Town',
    distance: 'Western Cape',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80',
  },
  {
    name: 'Johannesburg',
    distance: 'Gauteng',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
  },
  {
    name: 'Stellenbosch',
    distance: 'Western Cape',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80',
  },
  {
    name: 'Durban',
    distance: 'KwaZulu-Natal',
    image: 'https://images.unsplash.com/photo-1519449556851-5720b33024e7?w=600&q=80',
  },
]

export const reviews = [
  { name: 'Sipho', date: 'December 2024', text: 'Absolutely loved this place. The views of Table Mountain were breathtaking and the host was incredibly welcoming.' },
  { name: 'Naledi', date: 'January 2025', text: 'Perfect stay in the Winelands. The braai area was fantastic and we enjoyed a private wine tasting on the farm.' },
  {
    name: 'Ruan',
    date: 'November 2024',
    text: 'Amazing location right on the beach. We watched dolphins from the deck every morning. Would 100% return.',
  },
  {
    name: 'Zanele',
    date: 'October 2024',
    text: 'Great value for money. The apartment was spotless, well-equipped, and the Gautrain connection made getting around easy.',
  },
  {
    name: 'Hamish',
    date: 'September 2024',
    text: 'The safari lodge exceeded every expectation. We saw the Big 5 on the very first game drive. An unforgettable experience.',
  },
  {
    name: 'Amira',
    date: 'February 2025',
    text: 'Beautiful waterfront studio with a perfect harbour view. Walking distance to everything Cape Town has to offer.',
  },
]

export const reservations = [
  { bookedBy: 'Johann Coetzee', property: 'Clifton Beachfront Villa', checkin: '19/06/2025', checkout: '24/06/2025' },
  { bookedBy: 'Asif Hassam', property: 'Sandton Luxury Apartment', checkin: '19/06/2025', checkout: '21/06/2025' },
  { bookedBy: 'Kago Kola', property: 'Winelands Farmhouse Retreat', checkin: '25/06/2025', checkout: '30/06/2025' },
]
