import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import ReservationCard from '../components/reservation/ReservationCard'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, upcoming: 0, pending: 0 })
  const [recentReservations, setRecentReservations] = useState([])
  const [loading, setLoading] = useState(true)

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'

  useEffect(() => {
    if (user) {
      checkRoleAndFetchData()
    }
  }, [user])

  const checkRoleAndFetchData = async () => {
    setLoading(true)
    try {
      // 1. Check role first
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      
      if (profile?.role === 'admin') {
        navigate('/admin', { replace: true })
        return
      }

      // 2. If not admin, fetch regular dashboard data
      const { data, error } = await supabase
        .from('reservations')
        .select('*, salles(name, images)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      const reservations = data || []
      setRecentReservations(reservations.slice(0, 3))

      // Calculate stats
      const now = new Date().toISOString()
      setStats({
        total: reservations.length,
        upcoming: reservations.filter(r => r.event_date >= now && r.status === 'confirmed').length,
        pending: reservations.filter(r => r.status === 'pending').length
      })

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Header */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue, {fullName} 👋</h1>
        <p className="text-gray-500 text-lg italic">Gérez vos événements et suivez vos réservations en toute simplicité.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-primary p-6 rounded-2xl text-white shadow-lg shadow-purple-100">
          <p className="text-purple-200 text-sm font-bold uppercase mb-1">Total Réservations</p>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-sm font-bold uppercase mb-1">À venir</p>
          <p className="text-4xl font-bold text-gray-800">{stats.upcoming}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-accent">
          <p className="text-gray-400 text-sm font-bold uppercase mb-1">En attente</p>
          <p className="text-4xl font-bold text-gray-800">{stats.pending}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">Réservations récentes</h2>
          <Link to="/dashboard/reservations" className="text-primary font-semibold hover:underline text-sm">
            Voir tout →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-xl"></div>)}
          </div>
        ) : recentReservations.length > 0 ? (
          <div className="space-y-4">
            {recentReservations.map(res => (
              <ReservationCard key={res.id} reservation={res} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">Vous n'avez pas encore de réservations.</p>
            <Link 
              to="/search" 
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition"
            >
              Explorer les salles
            </Link>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800">Besoin d'aide ?</h3>
            <p className="text-sm text-gray-600">Consultez notre guide d'utilisation</p>
          </div>
          <Link to="/contact" className="bg-accent text-white px-4 py-2 rounded-lg font-bold text-sm">Contactez-nous</Link>
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-800">Mon Profil</h3>
            <p className="text-sm text-gray-600">Mettez à jour vos informations</p>
          </div>
          <button className="text-primary font-bold text-sm hover:underline">Modifier</button>
        </div>
      </section>
    </div>
  )
}
