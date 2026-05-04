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
  HiArrowRight,
  HiCheckCircle,
  HiClock
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
        .or('available.eq.true,available.is.null')
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
    <div className="min-h-screen bg-primary section-padding">
      <div className="max-w-7xl mx-auto container-custom">
        
        {/* 1. WELCOME & PROFILE HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              <span className="gradient-text">Salut, {fullName}</span> <span className="animate-float inline-block">👋</span>
            </h1>
            <p className="text-text-light/70 font-medium text-lg">
              Prêt pour votre prochain grand événement ?
            </p>
          </div>
          <div className="glass-card p-4 pr-8 flex items-center gap-4 group hover:scale-105 transition-transform">
            <div className="w-14 h-14 bg-gradient-to-br from-accent-pink to-accent rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-accent-pink/30 group-hover:rotate-12 transition-transform">
              <HiUserCircle />
            </div>
            <div>
              <p className="text-xs font-bold text-text-light/60 uppercase tracking-wider">Statut du compte</p>
              <p className="text-sm font-bold text-accent">{profile?.role === 'client' ? 'Client Vérifié' : 'Membre'}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ALERTS SECTION (Only if feedback exists) */}
            {alerts.length > 0 && (
              <section className="glass-card-lg border border-accent-pink/30 bg-gradient-to-br from-accent-pink/10 to-accent/5 p-6 animate-fade-in-up">
                <h2 className="flex items-center gap-2 text-accent font-black uppercase text-xs tracking-widest mb-4">
                  <HiBellAlert className="text-xl" /> Attention requise
                </h2>
                <div className="space-y-3">
                  {alerts.map(alert => (
                    <div key={alert.id} className="glass-card p-4 flex justify-between items-center border border-accent-pink/20 hover:border-accent-pink/40 transition group">
                      <div>
                        <p className="font-bold text-text-light text-sm">Message sur: {alert.salles?.name}</p>
                        <p className="text-xs text-accent-pink italic mt-0.5">"{alert.admin_feedback}"</p>
                      </div>
                      <Link to="/dashboard/reservations" className="text-[10px] font-black bg-gradient-to-r from-accent-pink to-accent text-white px-3 py-1 rounded-full hover:shadow-lg hover:shadow-accent-pink/30 transition group-hover:scale-110 transform">VOIR</Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card-lg p-6 group hover:scale-105 transition-transform hover:border-accent-pink/50 border border-primary-mid/20">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-pink rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-lg shadow-accent/30 group-hover:rotate-12 transition-transform">
                  <HiCalendarDays className="text-white" />
                </div>
                <p className="text-4xl font-black text-text-light">{stats.total}</p>
                <p className="text-xs font-bold text-text-light/60 uppercase mt-2">Total demandes</p>
              </div>
              <div className="glass-card-lg p-6 group hover:scale-105 transition-transform hover:border-accent-pink/50 border border-primary-mid/20">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-lg shadow-green-500/30 group-hover:rotate-12 transition-transform">
                  <HiCheckCircle className="text-white" />
                </div>
                <p className="text-4xl font-black text-text-light">{stats.upcoming}</p>
                <p className="text-xs font-bold text-text-light/60 uppercase mt-2">Validées</p>
              </div>
              <div className="glass-card-lg p-6 group hover:scale-105 transition-transform hover:border-accent-pink/50 border border-primary-mid/20">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 text-2xl shadow-lg shadow-yellow-500/30 group-hover:rotate-12 transition-transform">
                  <HiClock className="text-white" />
                </div>
                <p className="text-4xl font-black text-text-light">{stats.pending}</p>
                <p className="text-xs font-bold text-text-light/60 uppercase mt-2">En cours</p>
              </div>
            </div>

            {/* RECENT RESERVATIONS */}
            <section className="glass-card-lg p-8 border border-primary-mid/20 hover:border-primary-mid/40 transition">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-text-light flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-accent to-accent-pink rounded-xl flex items-center justify-center text-lg">
                    <HiCalendarDays />
                  </span>
                  <span className="gradient-text">Activité Récente</span>
                </h2>
                <Link to="/dashboard/reservations" className="text-xs font-bold text-accent hover:text-accent-pink transition">TOUT VOIR →</Link>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-24 bg-primary-mid/20 animate-pulse rounded-2xl border border-primary-mid/10"></div>)}
                </div>
              ) : recentReservations.length > 0 ? (
                <div className="space-y-4">
                  {recentReservations.map(res => (
                    <ReservationCard key={res.id} reservation={res} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 glass-card rounded-3xl border-2 border-dashed border-primary-mid/30">
                  <HiSparkles className="text-5xl text-accent/30 mx-auto mb-4" />
                  <p className="text-text-light/70 font-medium text-lg">Vous n'avez pas encore de réservations.</p>
                  <Link to="/search" className="mt-6 inline-flex items-center gap-2 btn-gradient px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-accent/40 transition group">
                    <HiMagnifyingGlass className="group-hover:scale-125 transition-transform" /> Trouver une salle
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: SUGGESTIONS & TIPS */}
          <div className="space-y-8">
            
            {/* ACTION: FIND NEW SALLE */}
            <div className="glass-card-lg bg-gradient-to-br from-primary-mid to-primary-mid/50 p-8 text-text-light relative overflow-hidden group border border-accent-pink/20 hover:border-accent-pink/40 transition animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-pink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-3 leading-tight">Envie d'organiser un autre événement ?</h3>
                <p className="text-text-light/70 text-sm mb-6">Parcourez les meilleures salles à Alger et ailleurs.</p>
                <Link to="/search" className="inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-xl font-black text-sm hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-accent/30">
                  EXPLORER <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <HiSparkles className="absolute -bottom-4 -right-4 text-9xl text-accent opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700" />
            </div>

            {/* SUGGESTIONS LIST */}
            <section className="glass-card-lg p-8 border border-primary-mid/20 hover:border-primary-mid/40 transition animate-fade-in-up">
              <h2 className="text-lg font-black text-text-light mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-accent to-accent-pink rounded-lg flex items-center justify-center">
                  <HiSparkles className="text-white" />
                </span>
                <span>Suggestions pour vous</span>
              </h2>
              <div className="space-y-4">
                {suggestedSalles.map(salle => (
                  <Link key={salle.id} to={`/salles/${salle.id}`} className="flex items-center gap-4 group cursor-pointer glass-card p-3 rounded-xl border border-primary-mid/20 hover:border-accent-pink/40 hover:bg-primary-mid/20 transition">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-primary-mid/30 shrink-0 shadow-md group-hover:shadow-lg group-hover:shadow-accent/20 transition ring-2 ring-primary-mid/10 group-hover:ring-accent-pink/30">
                      <img src={Array.isArray(salle.images) ? salle.images[0] : salle.images} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-text-light text-sm truncate group-hover:text-accent transition">{salle.name}</p>
                      <p className="text-xs text-text-light/60 font-medium">{salle.city}</p>
                      <p className="text-[10px] font-black text-accent uppercase mt-1 group-hover:text-accent-pink transition">{salle.price_per_day} DA</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* PLANNING CHECKLIST */}
            <section className="glass-card-lg p-8 border border-primary-mid/20 hover:border-primary-mid/40 transition animate-fade-in-up">
              <h2 className="text-lg font-black text-text-light mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-accent-pink to-accent rounded-lg flex items-center justify-center">
                  <HiClipboardDocumentCheck className="text-white" />
                </span>
                Guide de réservation
              </h2>
              <ul className="space-y-3">
                {[
                  { step: 1, text: "Envoyez votre demande de réservation", done: stats.total > 0 },
                  { step: 2, text: "Attendez la confirmation de l'admin", done: stats.upcoming > 0 },
                  { step: 3, text: "Uploadez votre justificatif CCP", done: false },
                  { step: 4, text: "Recevez votre validation finale", done: stats.upcoming > 0 }
                ].map(item => (
                  <li key={item.step} className="flex items-start gap-3 group p-2 rounded-lg hover:bg-primary-mid/20 transition">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 transition-all ${item.done ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30' : 'bg-primary-mid/40 text-text-light/60 border border-primary-mid/30'}`}>
                      {item.done ? '✓' : item.step}
                    </span>
                    <p className={`text-xs font-bold transition-colors ${item.done ? 'text-text-light/40 line-through' : 'text-text-light/80'}`}>
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
