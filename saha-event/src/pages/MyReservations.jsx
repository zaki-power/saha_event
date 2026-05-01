import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import ReservationCard from '../components/reservation/ReservationCard'
import { Link } from 'react-router-dom'

export default function MyReservations() {
  const { user } = useAuth()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchReservations()
    }
  }, [user])

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          salles (
            name,
            images,
            city
          )
        `)
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReservations(data || [])
    } catch (err) {
      console.error('Error fetching reservations:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black gradient-text mb-2">Mes Réservations</h1>
          <p className="text-text-light/60 font-medium">Suivez l'état de vos demandes de réservation.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 glass-card animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : reservations.length > 0 ? (
          <div className="space-y-4">
            {reservations.map((res) => (
              <ReservationCard 
                key={res.id} 
                reservation={res} 
                onUpdate={fetchReservations} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card-lg rounded-3xl border border-primary-mid/20">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-text-light mb-2">Aucune réservation</h3>
            <p className="text-text-light/60 mb-8">Vous n'avez pas encore effectué de réservation.</p>
            <Link 
              to="/search" 
              className="btn-gradient inline-block px-8 py-3 rounded-full font-bold"
            >
              Explorer les salles
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
