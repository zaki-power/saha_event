import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import ReservationForm from '../components/reservation/ReservationForm'
import { FaMapPin, FaCheck, FaUsers, FaStar } from 'react-icons/fa6'

export default function SalleDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  
  const [salle, setSalle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSalleDetails()
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

  if (loading) return <div className="min-h-screen bg-primary flex items-center justify-center p-4"><div className="text-text-light text-xl">Chargement...</div></div>
  if (error || !salle) return <div className="min-h-screen bg-primary flex items-center justify-center p-4"><div className="text-red-400 text-xl">{error || "Salle non trouvée"}</div></div>

  return (
    <div className="min-h-screen bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Side - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="rounded-3xl overflow-hidden aspect-video bg-primary-mid shadow-2xl shadow-primary-mid/20">
              <img 
                src={(Array.isArray(salle.images) ? salle.images[0] : salle.images) || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200'} 
                className="w-full h-full object-cover"
                alt={salle.name}
              />
            </div>

            {/* Title and Price Section */}
            <div className="glass-card-lg border border-primary-mid/20 p-8 flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-4xl font-bold gradient-text mb-4">{salle.name}</h1>
                <p className="text-text-light/70 flex items-center text-lg font-medium">
                   <FaMapPin className="mr-3 text-accent" /> {salle.city}
                 </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black gradient-text mb-1">{salle.price_per_day} DA</p>
                <p className="text-text-light/60 text-sm font-medium">par jour</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="glass-card-lg p-6 border border-primary-mid/20 hover:border-accent/40 transition text-center">
                <p className="text-xs text-text-light/60 uppercase font-bold mb-2 tracking-widest">Capacité</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FaUsers className="text-accent text-lg" />
                  <p className="text-2xl font-black text-text-light">{salle.capacity}</p>
                </div>
                <p className="text-xs text-text-light/60">personnes</p>
              </div>
              <div className="glass-card-lg p-6 border border-primary-mid/20 hover:border-accent/40 transition text-center">
                <p className="text-xs text-text-light/60 uppercase font-bold mb-2 tracking-widest">Évaluation</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <FaStar className="text-accent text-lg" />
                  <p className="text-2xl font-black text-text-light">4.8</p>
                </div>
                <p className="text-xs text-text-light/60">/ 5 étoiles</p>
              </div>
              <div className="glass-card-lg p-6 border border-primary-mid/20 hover:border-accent/40 transition text-center">
                <p className="text-xs text-text-light/60 uppercase font-bold mb-2 tracking-widest">Type</p>
                <p className="text-2xl font-black gradient-text mb-2">Premium</p>
                <p className="text-xs text-text-light/60">qualité</p>
              </div>
            </div>

            {/* Description Section */}
            <div className="glass-card-lg p-8 border border-primary-mid/20">
              <h2 className="text-2xl font-bold gradient-text mb-4">À propos de cette salle</h2>
              <p className="text-text-light/80 leading-relaxed text-lg">
                {salle.description || "Une magnifique salle située au cœur de la ville, idéale pour tous vos événements festifs et professionnels. Offrant un cadre élégant et des services de haute qualité."}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="glass-card-lg p-8 border border-primary-mid/20">
              <h2 className="text-2xl font-bold gradient-text mb-6">Équipements & Services</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(salle.amenities || ["WiFi", "Climatisation", "Parking", "Catering", "Scène", "Sonorisation"]).map(item => (
                  <div key={item} className="flex items-center gap-3 p-3 glass-card rounded-lg border border-primary-mid/10 hover:border-accent/30 transition">
                    <FaCheck className="text-accent text-lg flex-shrink-0" />
                    <span className="text-text-light/80 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Reservation Form Container */}
          <div className="lg:col-span-1">
            <div className="glass-card-lg p-8 border border-primary-mid/20 sticky top-24 shadow-2xl shadow-primary-mid/20">
              <h2 className="text-2xl font-bold gradient-text mb-8 text-center">Réserver maintenant</h2>
              
              {!user ? (
                <div className="text-center p-8 glass-card rounded-2xl border border-primary-mid/20">
                  <p className="text-text-light/70 mb-6 font-medium">Connectez-vous pour effectuer une réservation</p>
                  <Link 
                    to="/auth/login" 
                    className="inline-block btn-gold px-8 py-3 rounded-xl font-bold"
                  >
                    Se connecter
                  </Link>
                </div>
              ) : (
                <ReservationForm 
                  salleId={id} 
                  pricePerDay={salle.price_per_day} 
                  capacity={salle.capacity} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
