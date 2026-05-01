import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  Search, 
  Info, 
  Mail,
  ShieldCheck,
  ChevronDown,
  Globe
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
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
      setIsScrolled(window.scrollY > 20)
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

  const navLinks = [
    { name: 'Accueil', path: '/', icon: Globe },
    { name: 'Explorer', path: '/search', icon: Search },
    ...(user ? [{ name: 'Mes Réservations', path: '/dashboard/reservations', icon: Calendar }] : []),
    { name: 'À Propos', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Mail },
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-primary/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-tr from-primary-mid to-accent-pink rounded-xl flex items-center justify-center shadow-lg shadow-primary-mid/20"
            >
              <span className="text-white font-bold text-xl">S</span>
            </motion.div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-accent transition-colors">
              Saha<span className="text-accent">✦</span>Event
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {!isAdmin ? (
              navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative group ${
                    location.pathname === link.path 
                      ? 'text-accent' 
                      : 'text-text-light/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full"
                    />
                  )}
                </Link>
              ))
            ) : (
              <>
                <Link 
                  to="/admin" 
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-mid/20 border border-primary-mid/30 rounded-xl text-primary-mid hover:bg-primary-mid/30 transition-all font-bold"
                >
                  <ShieldCheck size={18} />
                  <span>Panel Admin</span>
                </Link>
                <Link to="/" className="px-4 py-2 text-text-light/70 hover:text-white transition-all text-sm font-medium">
                  Voir le site
                </Link>
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 bg-white/5 border border-white/10 p-1.5 pr-4 rounded-full hover:bg-white/10 transition-all focus:outline-none"
                >
                  <img 
                    src={avatarUrl} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full border border-accent/30 shadow-sm"
                  />
                  <span className="hidden sm:block text-sm font-semibold text-text-light">{fullName.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`text-text-light/50 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-primary/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-xs text-text-light/50 uppercase font-bold tracking-wider">Compte</p>
                        <p className="text-sm font-semibold text-white truncate">{fullName}</p>
                      </div>
                      
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-text-light hover:bg-white/5 hover:text-accent transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <ShieldCheck size={18} />
                          <span>Panel Admin</span>
                        </Link>
                      )}
                      
                      <Link 
                        to="/dashboard" 
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm text-text-light hover:bg-white/5 hover:text-accent transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <LayoutDashboard size={18} />
                        <span>Tableau de bord</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          signOut()
                          setIsProfileOpen(false)
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors mt-1"
                      >
                        <LogOut size={18} />
                        <span>Se déconnecter</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link to="/auth/login" className="px-5 py-2.5 text-sm font-semibold text-white hover:text-accent transition-colors">
                  Connexion
                </Link>
                <Link
                  to="/auth/register"
                  className="px-6 py-2.5 bg-accent text-primary text-sm font-bold rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 transition-all"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-text-light hover:bg-white/5 rounded-xl transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary/95 backdrop-blur-2xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {!isAdmin ? (
                navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path}
                    className="flex items-center space-x-4 p-3 rounded-2xl text-lg font-medium text-text-light/80 hover:text-accent hover:bg-white/5 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon size={22} />
                    <span>{link.name}</span>
                  </Link>
                ))
              ) : (
                <>
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-4 p-3 rounded-2xl text-lg font-bold text-accent bg-accent/10 border border-accent/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShieldCheck size={22} />
                    <span>Panel Admin</span>
                  </Link>
                </>
              )}
              
              {!user && (
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <Link 
                    to="/auth/login" 
                    className="flex items-center justify-center p-4 rounded-2xl bg-white/5 text-white font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link 
                    to="/auth/register" 
                    className="flex items-center justify-center p-4 rounded-2xl bg-accent text-primary font-bold shadow-lg shadow-accent/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
