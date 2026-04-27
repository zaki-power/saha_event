import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, role')
        .eq('id', user.id)
        .single()
      
      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
    }
  }

  const isAdmin = profile?.role === 'admin'
  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${fullName}&background=6B21A8&color=fff`

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Saha<span className="text-accent">-Event</span></span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdmin ? (
              <>
                <Link to="/" className="text-gray-600 hover:text-primary font-medium">Accueil</Link>
                <Link to="/search" className="text-gray-600 hover:text-primary font-medium">Explorer</Link>
                {user && (
                  <Link to="/dashboard/reservations" className="text-gray-600 hover:text-primary font-medium">Mes réservations</Link>
                )}
                <Link to="/about" className="text-gray-600 hover:text-primary font-medium">À propos</Link>
                <Link to="/contact" className="text-gray-600 hover:text-primary font-medium">Contact</Link>
              </>
            ) : (
              <>
                <Link to="/admin" className="text-primary font-bold flex items-center bg-primary bg-opacity-5 px-4 py-2 rounded-xl">
                  <span className="mr-2">🛡️</span> Gestion des Réservations
                </Link>
                {/* Admins can still see the home if they need to, but we prioritize the dashboard */}
                <Link to="/" className="text-gray-600 hover:text-primary font-medium">Voir le site</Link>
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none group"
                >
                  <span className="hidden sm:block text-gray-700 font-medium group-hover:text-primary transition">{fullName}</span>
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full border-2 border-primary border-opacity-20 group-hover:border-opacity-100 transition"
                  />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-primary font-bold hover:bg-gray-50 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        🛡️ Panel Admin
                      </Link>
                    )}
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/login" className="text-gray-600 hover:text-primary font-medium">Se connecter</Link>
                <Link
                  to="/auth/register"
                  className="bg-accent text-white px-5 py-2.5 rounded-full font-bold hover:bg-opacity-90 transition shadow-lg shadow-yellow-100"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
