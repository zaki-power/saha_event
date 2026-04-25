import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import ReservationForm from '../components/reservation/ReservationForm'
import { FaMapMarkerAlt, FaCheck } from 'react-icons/fa'

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

  if (loading) return <div className="p-20 text-center">Chargement...</div>
  if (error || !salle) return <div className="p-20 text-center text-red-500">{error || "Salle non trouvée"}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Side - Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl overflow-hidden aspect-video bg-gray-200">
            <img 
              src={(Array.isArray(salle.images) ? salle.images[0] : salle.images) || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200'} 
              className="w-full h-full object-cover"
              alt={salle.name}
            />
          </div>

          <div className="flex justify-between items-start border-b border-gray-100 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{salle.name}</h1>
              <p className="text-gray-500 flex items-center text-lg">
                <FaMapMarkerAlt className="mr-2" /> {salle.city}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{salle.price_per_day} DA</p>
              <p className="text-gray-400 text-sm">par jour</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-4 rounded-2xl text-center">
              <p className="text-xs text-purple-400 uppercase font-bold mb-1">Capacité</p>
              <p className="text-xl font-bold text-primary">{salle.capacity} pers.</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-2xl text-center">
              <p className="text-xs text-yellow-500 uppercase font-bold mb-1">Évaluation</p>
              <p className="text-xl font-bold text-accent">4.8 / 5</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl text-center">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">Type</p>
              <p className="text-xl font-bold text-gray-700">Premium</p>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {salle.description || "Une magnifique salle située au cœur de la ville, idéale pour tous vos événements festifs et professionnels. Offrant un cadre élégant et des services de haute qualité."}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Équipements</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(salle.amenities || ["WiFi", "Climatisation", "Parking", "Catering", "Scène", "Sonorisation"]).map(item => (
                <div key={item} className="flex items-center text-gray-600">
                  <FaCheck className="text-accent mr-3" /> {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side - Reservation Form Container */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Réserver maintenant</h2>
            
            {!user ? (
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <p className="text-gray-600 mb-4">Connectez-vous pour effectuer une réservation</p>
                <Link 
                  to="/auth/login" 
                  className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-opacity-90 transition"
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
  )
}
