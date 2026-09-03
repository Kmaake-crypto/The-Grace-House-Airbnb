import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SearchResults from './pages/SearchResults.jsx'
import ListingDetail from './pages/ListingDetail.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateListing from './pages/CreateListing.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Reservations from './pages/Reservations.jsx'
import { useAuth } from './context/useAuth.js'

function ProtectedRoute({ hostOnly = false }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  const canAccess = isAuthenticated && (!hostOnly || user?.role === 'host' || user?.role === 'admin')

  return canAccess
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location.pathname }} />
}

function AuthenticatedRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"                 element={<Home />} />
      <Route path="/search"           element={<SearchResults />} />
      <Route path="/listing/:id"      element={<ListingDetail />} />
      <Route path="/login"            element={<Login role="guest" />} />
      <Route path="/register"         element={<Register role="guest" />} />
      <Route path="/admin/login"      element={<Login role="host" />} />
      <Route path="/admin/register"   element={<Register role="host" />} />
      <Route element={<AuthenticatedRoute />}>
        <Route path="/reservations" element={<Reservations />} />
      </Route>
      <Route element={<ProtectedRoute hostOnly />}>
        <Route path="/dashboard"      element={<Dashboard />} />
        <Route path="/hosting"        element={<Dashboard />} />
        <Route path="/create-listing" element={<CreateListing />} />
      </Route>
      {/* Catch-all 404 */}
      <Route path="*"                 element={<NotFound />} />
    </Routes>
  )
}
