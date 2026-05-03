import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Check, 
  Users, 
  Star, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Info, 
  ShieldCheck, 
  Wifi, 
  ParkingCircle, 
  Wind, 
  Utensils, 
  Music,
  Calendar
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import ReservationForm from '../components/reservation/ReservationForm'

const AMENITY_ICONS = {
  "WiFi": Wifi,
  "Climatisation": Wind,
  "Parking": ParkingCircle,
  "Catering": Utensils,
  "Scène": Music,
  "Sonorisation": Music,
  "Sécurité": ShieldCheck
}

export default function SalleDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  
  const [salle, setSalle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    fetchSalleDetails()
    window.scrollTo(0, 0)
  }, [id])

  const fetchSalleDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('salles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setSalle(data)
    } catch (err) {
      console.error('Error fetching salle:', err)
      setError("Impossible de charger les détails de la salle.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full mb-4"
      />
      <div className="text-text-light/50 font-bold uppercase tracking-widest text-sm">Chargement du palais...</div>
    </div>
  )

  if (error || !salle) return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-4">
      <div className="text-red-400 text-xl font-bold mb-4">{error || "Salle non trouvée"}</div>
      <Link to="/search" className="btn-ghost flex items-center gap-2">
        <ArrowLeft size={20} /> Retour à la recherche
      </Link>
    </div>
  )

  const images = Array.isArray(salle.images) ? salle.images : [salle.images]

  return (
    <div className="min-h-screen bg-primary py-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Actions */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/search" className="group flex items-center gap-2 text-text-light/50 hover:text-accent transition-colors">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all">
              <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">Retour aux salles</span>
          </Link>
          
          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <Share2 size={18} />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <Heart size={18} />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Side - Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Gallery Section */}
            <section>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-[2.5rem] overflow-hidden bg-primary-mid/10 aspect-video shadow-2xl"
              >
                <AnimatePresence mode='wait'>
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={images[activeImage] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200'} 
                    className="w-full h-full object-cover"
                    alt={salle.name}
                  />
                </AnimatePresence>
                
                <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-accent text-primary px-3 py-1.5 rounded-xl font-black text-sm shadow-xl">
                  {salle.price_per_day} DA <span className="text-[10px] font-bold opacity-70">/ JOUR</span>
                </div>
              </motion.div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-4 mt-6 overflow-x-auto pb-2 no-scrollbar">
                  {images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-accent shadow-lg shadow-accent/20' : 'border-transparent opacity-60'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </motion.button>
                  ))}
                </div>
              )}
            </section>

            {/* Title & Stats Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 lg:p-10 shadow-xl"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">{salle.name}</h1>
                  <div className="flex items-center gap-2 text-text-light/50 font-bold">
                    <MapPin size={18} className="text-accent" />
                    <span className="uppercase tracking-widest text-sm">{salle.city}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                    <Star className="text-accent fill-accent" size={20} />
                    <span className="text-xl font-black text-white">4.8</span>
                    <span className="text-text-light/30 text-xs font-bold uppercase ml-1">Rating</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Capacité', value: `${salle.capacity} Pers.`, icon: Users },
                  { label: 'Type', value: 'Premium', icon: ShieldCheck },
                  { label: 'Réservation', value: 'Instant', icon: Calendar },
                  { label: 'Qualité', value: 'Certifiée', icon: Check }
                ].map((stat, idx) => (
                  <div key={idx} className="flex flex-col items-center p-6 rounded-3xl bg-white/5 border border-white/10 group hover:border-accent/30 transition-colors">
                    <stat.icon size={24} className="text-accent mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] text-text-light/40 uppercase font-black tracking-widest mb-1">{stat.label}</p>
                    <p className="text-lg font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Description */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Info size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight">À propos</h2>
                </div>
                <p className="text-text-light/60 leading-relaxed">
                  {salle.description || "Une magnifique salle située au cœur de la ville, idéale pour tous vos événements festifs et professionnels. Offrant un cadre élégant et des services de haute qualité pour garantir le succès de vos moments les plus précieux."}
                </p>
              </motion.div>

              {/* Amenities */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Check size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-tight">Commodités</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(salle.amenities || ["WiFi", "Climatisation", "Parking", "Catering", "Scène", "Sonorisation"]).map((item, idx) => {
                    const Icon = AMENITY_ICONS[item] || Check
                    return (
                      <div key={idx} className="flex items-center gap-2 text-text-light/60">
                        <Icon size={16} className="text-accent" />
                        <span className="text-sm font-medium">{item}</span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Reservation */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 bg-white/5 border border-white/20 rounded-[2.5rem] p-8 lg:p-10 shadow-2xl backdrop-blur-xl"
            >
              <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                <Calendar size={24} className="text-accent" />
                Réservation
              </h2>
              
              {!user ? (
                <div className="text-center py-10 px-6 rounded-3xl bg-primary/50 border border-white/10">
                  <p className="text-text-light/50 mb-8 font-medium">Veuillez vous connecter pour réserver cet espace de prestige.</p>
                  <Link 
                    to="/auth/login" 
                    className="w-full inline-block bg-accent hover:bg-yellow-400 text-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-accent/20"
                  >
                    Se connecter
                  </Link>
                  <p className="mt-6 text-xs text-text-light/30">
                    Pas encore de compte ? <Link to="/auth/register" className="text-accent hover:underline">S'inscrire</Link>
                  </p>
                </div>
              ) : (
                <ReservationForm 
                  salleId={id} 
                  pricePerDay={salle.price_per_day} 
                  pricePerGuest={salle.price_per_guest}
                  capacity={salle.capacity} 
                />
              )}

              {/* Trust Badges */}
              <div className="mt-10 pt-8 border-t border-white/10">
                <div className="flex items-center gap-4 text-text-light/40">
                  <ShieldCheck size={20} className="text-green-500/50" />
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">
                    Paiement Sécurisé <br /> & Protection Client
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
