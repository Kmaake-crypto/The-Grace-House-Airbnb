import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SearchResults from './pages/SearchResults.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateListing from './pages/CreateListing.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { useAuth } from './context/useAuth.js'

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location.pathname }} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"                 element={<Home />} />
      <Route path="/search"           element={<SearchResults />} />
      <Route path="/listing/:id"      element={<ListingDetail />} />
      <Route path="/login"            element={<Login />} />
      <Route path="/register"         element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/create-listing" element={<CreateListing />} />
      </Route>
      {/* Catch-all 404 */}
      <Route path="*"                 element={<NotFound />} />
    </Routes>
  )
}
