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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mes Réservations</h1>
        <p className="text-gray-500">Suivez l'état de vos demandes de réservation.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : reservations.length > 0 ? (
        <div className="grid gap-6">
          {reservations.map((res) => (
            <ReservationCard key={res.id} reservation={res} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune réservation</h3>
          <p className="text-gray-600 mb-6">Vous n'avez pas encore effectué de réservation.</p>
          <Link 
            to="/search" 
            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition shadow-lg"
          >
            Explorer les salles
          </Link>
        </div>
      )}
    </div>
  )
}
