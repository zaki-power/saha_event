import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import SalleDetail from './pages/SalleDetail'
import Dashboard from './pages/Dashboard'
import MyReservations from './pages/MyReservations'
import AdminDashboard from './pages/AdminDashboard'

function AppContent() {
  const location = useLocation()
  
  // Define paths where the footer should NOT be shown
  const hideFooterPaths = [
    '/contact',
    '/dashboard/reservations',
    '/admin' // Usually admin panels also don't have a public footer
  ]

  // Check if current path matches or starts with any of the hidden paths
  const shouldHideFooter = hideFooterPaths.some(path => location.pathname === path) || location.pathname.startsWith('/salles/')

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/salles/:id" element={<SalleDetail />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/dashboard/reservations" element={
          <ProtectedRoute><MyReservations /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />
      </Routes>
      {!shouldHideFooter && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}
