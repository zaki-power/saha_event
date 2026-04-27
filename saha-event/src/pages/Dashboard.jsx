import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import ReservationCard from '../components/reservation/ReservationCard'
import { 
  HiCalendarDays, 
  HiBellAlert, 
  HiSparkles, 
  HiClipboardDocumentCheck,
  HiUserCircle,
  HiMagnifyingGlass,
  HiArrowRight
} from 'react-icons/hi2'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ total: 0, upcoming: 0, pending: 0 })
  const [recentReservations, setRecentReservations] = useState([])
  const [suggestedSalles, setSuggestedSalles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profileData)

      if (profileData?.role === 'admin') {
        navigate('/admin', { replace: true })
        return
      }

      // 2. Fetch Reservations
      const { data: resData } = await supabase
        .from('reservations')
        .select('*, salles(name, images, city)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      const reservations = resData || []
      setRecentReservations(reservations.slice(0, 3))

      const now = new Date().toISOString()
      setStats({
        total: reservations.length,
        upcoming: reservations.filter(r => r.event_date >= now && r.status === 'validated').length,
        pending: reservations.filter(r => r.status === 'pending' || r.status === 'payment_uploaded').length
      })

      // 3. Fetch Suggestions (Salles in the same city or just popular ones)
      const { data: salleData } = await supabase
        .from('salles')
        .select('*')
        .eq('available', true)
        .limit(3)
      setSuggestedSalles(salleData || [])

    } catch (err) {
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const fullName = profile?.full_name || user?.email?.split('@')[0] || 'Utilisateur'
  
  // Find reservations that need attention (Admin feedback)
  const alerts = recentReservations.filter(r => r.admin_feedback && r.status !== 'validated')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50/50 min-h-screen">
      
      {/* 1. WELCOME & PROFILE HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">
            Salut, {fullName} <span className="animate-bounce inline-block">👋</span>
          </h1>
          <p className="text-gray-500 mt-1 font-medium italic">
            Prêt pour votre prochain grand événement ?
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-gray-100">
           <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-xl">
              <HiUserCircle />
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Statut du compte</p>
              <p className="text-sm font-bold text-primary">{profile?.role === 'client' ? 'Client Vérifié' : 'Membre'}</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: MAIN CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ALERTS SECTION (Only if feedback exists) */}
          {alerts.length > 0 && (
            <section className="bg-red-50 border-2 border-red-100 rounded-3xl p-6 animate-pulse-subtle">
              <h2 className="flex items-center gap-2 text-red-700 font-black uppercase text-xs tracking-widest mb-4">
                <HiBellAlert className="text-xl" /> Attention requise
              </h2>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className="bg-white p-4 rounded-xl shadow-sm border border-red-50 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">Message sur: {alert.salles?.name}</p>
                      <p className="text-xs text-red-600 italic mt-0.5">"{alert.admin_feedback}"</p>
                    </div>
                    <Link to="/dashboard/reservations" className="text-[10px] font-black bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition">VOIR</Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* QUICK STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="w-10 h-10 bg-purple-50 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <HiCalendarDays className="text-xl" />
              </div>
              <p className="text-3xl font-black text-gray-800">{stats.total}</p>
              <p className="text-xs font-bold text-gray-400 uppercase mt-1">Total demandes</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <HiCheckCircle className="text-xl" />
              </div>
              <p className="text-3xl font-black text-gray-800">{stats.upcoming}</p>
              <p className="text-xs font-bold text-gray-400 uppercase mt-1">Validées</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <HiClock className="text-xl" />
              </div>
              <p className="text-3xl font-black text-gray-800">{stats.pending}</p>
              <p className="text-xs font-bold text-gray-400 uppercase mt-1">En cours</p>
            </div>
          </div>

          {/* RECENT RESERVATIONS */}
          <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <HiCalendarDays className="text-primary" /> Activité Récente
              </h2>
              <Link to="/dashboard/reservations" className="text-xs font-bold text-primary hover:underline">TOUT VOIR</Link>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl"></div>)}
              </div>
            ) : recentReservations.length > 0 ? (
              <div className="space-y-4">
                {recentReservations.map(res => (
                  <ReservationCard key={res.id} reservation={res} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <HiSparkles className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Vous n'avez pas encore de réservations.</p>
                <Link to="/search" className="mt-4 inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition shadow-lg shadow-purple-100">
                  <HiMagnifyingGlass /> Trouver une salle
                </Link>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: SUGGESTIONS & TIPS */}
        <div className="space-y-8">
          
          {/* ACTION: FIND NEW SALLE */}
          <div className="bg-primary rounded-[2rem] p-8 text-white shadow-xl shadow-purple-100 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2 leading-tight">Envie d'organiser un autre événement ?</h3>
              <p className="text-purple-100 text-sm mb-6">Parcourez les meilleures salles à Alger et ailleurs.</p>
              <Link to="/search" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-black text-sm hover:scale-105 transition-transform active:scale-95 shadow-lg">
                EXPLORER <HiArrowRight />
              </Link>
            </div>
            <HiSparkles className="absolute -bottom-4 -right-4 text-9xl text-white opacity-10 group-hover:rotate-12 transition-transform duration-700" />
          </div>

          {/* SUGGESTIONS LIST */}
          <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <HiSparkles className="text-accent" /> Suggestions pour vous
            </h2>
            <div className="space-y-5">
              {suggestedSalles.map(salle => (
                <Link key={salle.id} to={`/salles/${salle.id}`} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 shadow-sm group-hover:shadow-md transition">
                    <img src={Array.isArray(salle.images) ? salle.images[0] : salle.images} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate group-hover:text-primary transition">{salle.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{salle.city}</p>
                    <p className="text-[10px] font-black text-accent uppercase mt-1">{salle.price_per_day} DA</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* PLANNING CHECKLIST */}
          <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <HiClipboardDocumentCheck className="text-primary" /> Guide de réservation
            </h2>
            <ul className="space-y-4">
              {[
                { step: 1, text: "Envoyez votre demande de réservation", done: stats.total > 0 },
                { step: 2, text: "Attendez la confirmation de l'admin", done: stats.upcoming > 0 },
                { step: 3, text: "Uploadez votre justificatif CCP", done: false },
                { step: 4, text: "Recevez votre validation finale", done: stats.upcoming > 0 }
              ].map(item => (
                <li key={item.step} className="flex items-start gap-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 ${item.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {item.done ? '✓' : item.step}
                  </span>
                  <p className={`text-xs font-bold ${item.done ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </section>

        </div>
      </div>
    </div>
  )
}
