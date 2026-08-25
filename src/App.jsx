import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SearchResults from './pages/SearchResults.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateListing from './pages/CreateListing.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/"                 element={<Home />} />
      <Route path="/search"           element={<SearchResults />} />
      <Route path="/listing/:id"      element={<ListingDetail />} />
      <Route path="/dashboard"        element={<Dashboard />} />
      <Route path="/create-listing"   element={<CreateListing />} />
      {/* Catch-all 404 */}
      <Route path="*"                 element={<NotFound />} />
    </Routes>
  )
}
