import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiCheckCircle, 
  HiXCircle, 
  HiClock, 
  HiMagnifyingGlass, 
  HiDocumentText, 
  HiUser, 
  HiEnvelope, 
  HiPhone, 
  HiIdentification,
  HiXMark,
  HiArrowTopRightOnSquare,
  HiShieldCheck,
  HiChatBubbleLeftEllipsis,
  HiPlusCircle
} from 'react-icons/hi2'

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRes, setSelectedRes] = useState(null)
  const [feedback, setFeedback] = useState('') 
  const [actionLoading, setActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [reservations, filterStatus, searchTerm])

  // Reset feedback when modal opens/changes
  useEffect(() => {
    if (selectedRes) {
      setFeedback(selectedRes.admin_feedback || '')
      setActionSuccess(null)
    }
  }, [selectedRes])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          salles (
            name, 
            price_per_day, 
            city, 
            images
          ),
          profiles:client_id (
            id,
            full_name, 
            email, 
            phone,
            created_at,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReservations(data || [])
    } catch (err) {
      console.error('Error fetching admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = reservations

    if (filterStatus !== 'all') {
      result = result.filter(res => res.status === filterStatus)
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase()
      result = result.filter(res => 
        res.profiles?.full_name?.toLowerCase().includes(lowerSearch) ||
        res.salles?.name?.toLowerCase().includes(lowerSearch) ||
        res.profiles?.email?.toLowerCase().includes(lowerSearch)
      )
    }

    setFilteredReservations(result)
  }

  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoading(true)
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ 
            status: newStatus,
            admin_feedback: feedback 
        })
        .eq('id', id)

      if (error) throw error
      
      const updateList = (list) => list.map(res => res.id === id ? { ...res, status: newStatus, admin_feedback: feedback } : res)
      setReservations(prev => updateList(prev))
      
      if (selectedRes?.id === id) {
        setSelectedRes(prev => ({ ...prev, status: newStatus, admin_feedback: feedback }))
      }
      
      setActionSuccess(`Statut mis à jour: ${newStatus}`)
      setTimeout(() => setActionSuccess(null), 3000)
    } catch (err) {
      alert('Erreur: ' + err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'badge-warning', label: 'En attente', icon: <HiClock /> },
      confirmed: { color: 'badge-success', label: 'Confirmée', icon: <HiCheckCircle /> },
      payment_uploaded: { color: 'badge-info', label: 'À vérifier', icon: <HiClock /> },
      validated: { color: 'badge-success', label: 'Validée', icon: <HiShieldCheck /> },
      rejected: { color: 'badge-error', label: 'Rejetée', icon: <HiXCircle /> }
    }
    const current = config[status] || config.pending
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${current.color}`}>
        {current.icon} {current.label}
      </span>
    )
  }

  if (loading) return (
    <div className="min-h-screen bg-primary flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-primary section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black gradient-text mb-2">Panel Super Administrateur</h1>
            <p className="text-text-light/60 font-medium">Gérez les demandes et communiquez avec les clients.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Link 
              to="/dashboard/add-salle" 
              className="glass-card p-4 px-6 flex items-center gap-3 group hover:scale-105 transition-all border border-accent/30 hover:border-accent"
            >
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-primary text-xl shadow-lg shadow-accent/20 group-hover:rotate-12 transition-transform">
                <HiPlusCircle />
              </div>
              <span className="font-bold text-accent uppercase tracking-wider text-xs">Ajouter une Salle</span>
            </Link>

            <div className="glass-card-lg p-6 rounded-2xl min-w-[180px]">
              <p className="text-sm text-text-light/70 font-medium">Total des réservations</p>
              <p className="text-3xl font-black gradient-text">{reservations.length}</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="glass-card-lg p-4 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex bg-primary-mid/30 p-1 rounded-xl w-full lg:w-auto overflow-x-auto">
            {['all', 'pending', 'confirmed', 'payment_uploaded', 'validated', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase transition whitespace-nowrap ${
                  filterStatus === status 
                  ? 'bg-accent text-primary shadow-lg' 
                  : 'text-text-light/50 hover:text-accent'
                }`}
              >
                {status === 'all' ? 'Tous' : status.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-64">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light/50 text-lg" />
            <input 
              type="text" 
              placeholder="Rechercher..."
              className="input-glass w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="glass-card-lg rounded-3xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-primary-mid/40 text-text-light/80 uppercase text-xs font-bold border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Détails</th>
                  <th className="px-6 py-4 text-center">Statut</th>
                  <th className="px-6 py-4 text-center">Message</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredReservations.length > 0 ? filteredReservations.map((res) => (
                  <tr 
                    key={res.id} 
                    onClick={() => setSelectedRes(res)}
                    className="hover:bg-primary-mid/20 cursor-pointer transition group border-b border-white/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-mid/40 flex items-center justify-center text-accent font-bold overflow-hidden border border-white/10">
                          {res.profiles?.avatar_url ? (
                              <img src={res.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : <HiUser className="text-xl" />}
                        </div>
                        <div>
                          <p className="font-bold text-text-light">{res.profiles?.full_name}</p>
                          <p className="text-xs text-text-light/50 font-medium">{res.profiles?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-light">{res.salles?.name}</p>
                      <p className="text-xs font-bold text-accent uppercase">{res.event_type}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(res.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {res.admin_feedback ? (
                          <span className="text-accent" title={res.admin_feedback}><HiChatBubbleLeftEllipsis className="text-xl mx-auto" /></span>
                      ) : (
                          <span className="text-text-light/30">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center gap-2">
                          <button 
                              onClick={() => setSelectedRes(res)}
                              className="px-3 py-1.5 glass-card text-accent rounded-lg text-[10px] font-black uppercase hover:border-accent transition"
                          >
                              Gérer
                          </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-text-light/50 font-medium">Aucune réservation trouvée</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedRes && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all">
            <div className="glass-card-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-primary-mid/40">
                <div>
                  <h2 className="text-2xl font-bold text-text-light">Gestion de la Réservation</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-text-light/50 font-mono">ID: #{selectedRes.id.slice(0, 8)}</span>
                    {getStatusBadge(selectedRes.status)}
                  </div>
                </div>
                <button onClick={() => setSelectedRes(null)} className="p-2 hover:bg-white/10 rounded-full transition text-text-light/50 hover:text-accent border border-transparent hover:border-accent/30">
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Info Column */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/10">
                          <h3 className="text-sm font-black text-accent uppercase tracking-widest flex items-center gap-2 mb-2">
                              <HiDocumentText className="text-lg" /> Détails Événement
                          </h3>
                          <div>
                              <label className="text-[10px] font-bold text-text-light/50 uppercase">Salle</label>
                              <p className="font-bold text-text-light">{selectedRes.salles?.name}</p>
                              <p className="text-sm text-text-light/60">{selectedRes.salles?.city}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                              <div>
                                  <label className="text-[10px] font-bold text-text-light/50 uppercase">Date</label>
                                  <p className="font-bold text-text-light text-sm">{new Date(selectedRes.event_date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })}</p>
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-text-light/50 uppercase">Type</label>
                                  <p className="font-bold text-accent text-sm">{selectedRes.event_type}</p>
                              </div>
                          </div>
                      </div>

                      <div className="glass-card border border-white/10 rounded-2xl p-6">
                          <h3 className="text-sm font-black text-accent uppercase tracking-widest flex items-center gap-2 mb-4">
                              <HiUser className="text-lg" /> Client
                          </h3>
                          <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-12 rounded-full bg-primary-mid/40 flex items-center justify-center text-accent font-bold overflow-hidden border-2 border-white/10">
                                  {selectedRes.profiles?.avatar_url ? <img src={selectedRes.profiles.avatar_url} className="w-full h-full object-cover" /> : <HiUser className="text-2xl" />}
                              </div>
                              <div>
                                  <p className="font-bold text-text-light">{selectedRes.profiles?.full_name}</p>
                                  <p className="text-xs text-text-light/60">{selectedRes.profiles?.email}</p>
                              </div>
                          </div>
                          <div className="space-y-2">
                              <p className="text-xs flex items-center gap-2 text-text-light/70"><HiPhone className="text-accent" /> {selectedRes.profiles?.phone || 'Pas de numéro'}</p>
                              <p className="text-[10px] text-text-light/50 font-mono truncate">UID: {selectedRes.profiles?.id}</p>
                          </div>
                      </div>
                    </div>

                    {/* Receipt Preview */}
                    <div className="glass-card rounded-2xl p-6 border border-white/10">
                      <h3 className="text-sm font-black text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                        <HiIdentification className="text-lg" /> Justificatif de paiement ({selectedRes.total_price} DA)
                      </h3>
                      {selectedRes.receipt_url ? (
                          <div className="relative group rounded-xl overflow-hidden border-2 border-white/10 shadow-xl">
                              <img src={selectedRes.receipt_url} alt="Reçu" className="w-full h-64 object-cover" />
                              <a href={selectedRes.receipt_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-accent font-black backdrop-blur-sm">
                                  <span className="bg-accent text-primary px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs uppercase font-black">Ouvrir en grand <HiArrowTopRightOnSquare /></span>
                              </a>
                          </div>
                      ) : (
                          <div className="p-10 bg-primary-mid/20 text-text-light/40 rounded-xl text-center border border-white/10 border-dashed">
                              <HiClock className="text-4xl mx-auto mb-2 opacity-30" />
                              <p className="font-bold text-sm">En attente de l'upload client</p>
                          </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Feedback Column */}
                  <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 border border-accent/30 bg-accent/5">
                      <h3 className="text-sm font-black text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                        <HiChatBubbleLeftEllipsis className="text-xl" /> Message au client
                      </h3>
                      <textarea 
                          className="input-glass w-full min-h-[150px]"
                          placeholder="Ex: Veuillez uploader un reçu plus lisible / Raison du refus..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                      ></textarea>
                      <p className="text-[10px] text-text-light/50 mt-2 leading-relaxed">
                          Ce message sera visible par le client dans son tableau de bord.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {actionSuccess && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2"
                        >
                          <HiCheckCircle className="text-lg" /> {actionSuccess}
                        </motion.div>
                      )}

                      <p className="text-[10px] font-black text-text-light/40 uppercase px-2">Actions disponibles</p>
                      {selectedRes.status === 'pending' && (
                          <>
                              <button 
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(selectedRes.id, 'confirmed')} 
                                className="w-full bg-green-600/40 border border-green-500/50 text-green-300 py-4 rounded-xl font-black hover:bg-green-600/60 transition flex items-center justify-center gap-2 uppercase text-sm disabled:opacity-50"
                              >
                                  {actionLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><HiCheckCircle className="text-xl" /> Accepter Demande</>}
                              </button>
                              <button 
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(selectedRes.id, 'rejected')} 
                                className="w-full bg-red-600/40 border border-red-500/50 text-red-300 py-4 rounded-xl font-black hover:bg-red-600/60 transition flex items-center justify-center gap-2 uppercase text-sm disabled:opacity-50"
                              >
                                  <HiXCircle className="text-xl" /> Rejeter
                              </button>
                          </>
                      )}
                      {selectedRes.status === 'payment_uploaded' && (
                          <>
                              <button 
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(selectedRes.id, 'validated')} 
                                className="w-full bg-accent/40 border border-accent/50 text-accent py-4 rounded-xl font-black hover:bg-accent/60 transition flex items-center justify-center gap-2 uppercase text-sm disabled:opacity-50"
                              >
                                  {actionLoading ? <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" /> : <><HiShieldCheck className="text-xl" /> Valider Paiement</>}
                              </button>
                              <button 
                                disabled={actionLoading}
                                onClick={() => handleUpdateStatus(selectedRes.id, 'rejected')} 
                                className="w-full bg-red-600/40 border border-red-500/50 text-red-300 py-4 rounded-xl font-black hover:bg-red-600/60 transition flex items-center justify-center gap-2 uppercase text-sm disabled:opacity-50"
                              >
                                  <HiXCircle className="text-xl" /> Rejeter Paiement
                              </button>
                          </>
                      )}
                      {(selectedRes.status === 'confirmed' || selectedRes.status === 'validated' || selectedRes.status === 'rejected') && (
                          <div className="space-y-3">
                              <div className="glass-card p-4 rounded-xl text-text-light/60 text-[10px] font-bold text-center uppercase border border-white/10">
                                  Action déjà effectuée
                              </div>
                              <button 
                                  disabled={actionLoading}
                                  onClick={() => handleUpdateStatus(selectedRes.id, selectedRes.status)}
                                  className="w-full glass-card border border-white/20 text-accent py-3 rounded-xl font-bold hover:border-accent/50 transition text-xs uppercase disabled:opacity-50"
                              >
                                  {actionLoading ? <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" /> : "Mettre à jour le message uniquement"}
                              </button>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
