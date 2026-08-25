import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SearchResults from './pages/SearchResults.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateListing from './pages/CreateListing.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/listing/:id" element={<ListingDetail />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-listing" element={<CreateListing />} />
    </Routes>
  )
}
