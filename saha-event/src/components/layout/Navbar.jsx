import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
    }
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-primary/95 backdrop-blur-md shadow-2xl shadow-primary-mid/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-bold gradient-text hover:opacity-80 transition">Saha✦Event</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAdmin ? (
              <>
                <Link to="/" className="text-text-light hover:text-accent font-medium transition-colors relative group">
                  Accueil
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/search" className="text-text-light hover:text-accent font-medium transition-colors relative group">
                  Explorer
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </Link>
                {user && (
                  <Link to="/dashboard/reservations" className="text-text-light hover:text-accent font-medium transition-colors relative group">
                    Mes réservations
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                <Link to="/about" className="text-text-light hover:text-accent font-medium transition-colors relative group">
                  À propos
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link to="/contact" className="text-text-light hover:text-accent font-medium transition-colors relative group">
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/admin" className="gradient-text font-bold flex items-center bg-primary-mid/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-primary-mid/30 hover:bg-primary-mid/30 transition">
                  <span className="mr-2">🛡️</span> Gestion des Réservations
                </Link>
                <Link to="/" className="text-text-light hover:text-accent font-medium transition-colors relative group">
                  Voir le site
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </Link>
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
                  <span className="hidden sm:block text-text-light font-medium group-hover:text-accent transition">{fullName}</span>
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full border-2 border-accent/20 group-hover:border-accent transition shadow-lg shadow-accent/10"
                  />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-card-lg shadow-2xl shadow-primary-mid/20 py-2 z-50 animate-scale-in">
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 gradient-text font-bold hover:bg-white/5 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        🛡️ Panel Admin
                      </Link>
                    )}
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-text-light hover:bg-white/5 hover:text-accent transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mon profil
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition"
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/auth/login" className="btn-ghost">Se connecter</Link>
                <Link
                  to="/auth/register"
                  className="btn-gold"
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
