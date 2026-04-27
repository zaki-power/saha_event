import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
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
  HiChatBubbleLeftEllipsis
} from 'react-icons/hi2'

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRes, setSelectedRes] = useState(null)
  const [feedback, setFeedback] = useState('') // New state for admin feedback

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
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ 
            status: newStatus,
            admin_feedback: feedback // Include feedback in the update
        })
        .eq('id', id)

      if (error) throw error
      
      const updateList = (list) => list.map(res => res.id === id ? { ...res, status: newStatus, admin_feedback: feedback } : res)
      setReservations(prev => updateList(prev))
      
      if (selectedRes?.id === id) {
        setSelectedRes(prev => ({ ...prev, status: newStatus, admin_feedback: feedback }))
      }
      
      alert(`Statut mis à jour: ${newStatus}`)
    } catch (err) {
      alert('Erreur: ' + err.message)
    }
  }

  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-700', label: 'En attente', icon: <HiClock /> },
      confirmed: { color: 'bg-green-100 text-green-700', label: 'Confirmée', icon: <HiCheckCircle /> },
      payment_uploaded: { color: 'bg-blue-100 text-blue-700', label: 'À vérifier', icon: <HiClock /> },
      validated: { color: 'bg-green-600 text-white', label: 'Validée', icon: <HiShieldCheck /> },
      rejected: { color: 'bg-red-100 text-red-700', label: 'Rejetée', icon: <HiXCircle /> }
    }
    const current = config[status] || config.pending
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${current.color}`}>
        {current.icon} {current.label}
      </span>
    )
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel Super Administrateur</h1>
          <p className="text-gray-500">Gérez les demandes et communiquez avec les clients.</p>
        </div>
        
        <div className="bg-primary bg-opacity-10 px-6 py-3 rounded-2xl border border-primary border-opacity-20 text-center min-w-[150px]">
          <p className="text-sm text-primary font-medium">Total des réservations</p>
          <p className="text-2xl font-bold text-primary">{reservations.length}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {['all', 'pending', 'confirmed', 'payment_uploaded', 'validated', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase transition whitespace-nowrap ${
                filterStatus === status 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status === 'all' ? 'Tous' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input 
            type="text" 
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Détails</th>
                <th className="px-6 py-4 text-center">Statut</th>
                <th className="px-6 py-4 text-center">Message</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReservations.length > 0 ? filteredReservations.map((res) => (
                <tr 
                  key={res.id} 
                  onClick={() => setSelectedRes(res)}
                  className="hover:bg-blue-50/50 cursor-pointer transition group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/10">
                        {res.profiles?.avatar_url ? (
                            <img src={res.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : <HiUser className="text-xl" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{res.profiles?.full_name}</p>
                        <p className="text-xs text-gray-500 font-medium">{res.profiles?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{res.salles?.name}</p>
                    <p className="text-xs font-bold text-primary uppercase">{res.event_type}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(res.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {res.admin_feedback ? (
                        <span className="text-primary" title={res.admin_feedback}><HiChatBubbleLeftEllipsis className="text-xl mx-auto" /></span>
                    ) : (
                        <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center gap-2">
                        <button 
                            onClick={() => setSelectedRes(res)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase hover:bg-gray-200 transition"
                        >
                            Gérer
                        </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-500 font-medium">Aucune réservation trouvée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRes && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Gestion de la Réservation</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400 font-mono">ID: #{selectedRes.id.slice(0, 8)}</span>
                  {getStatusBadge(selectedRes.status)}
                </div>
              </div>
              <button onClick={() => setSelectedRes(null)} className="p-2 hover:bg-white rounded-full transition text-gray-400 hover:text-gray-800 border border-transparent hover:border-gray-200">
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Info Column */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2 mb-2">
                            <HiDocumentText className="text-lg" /> Détails Événement
                        </h3>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Salle</label>
                            <p className="font-bold text-gray-800">{selectedRes.salles?.name}</p>
                            <p className="text-sm text-gray-500">{selectedRes.salles?.city}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Date</label>
                                <p className="font-bold text-gray-800 text-sm">{new Date(selectedRes.event_date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })}</p>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Type</label>
                                <p className="font-bold text-primary text-sm">{selectedRes.event_type}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2 mb-4">
                            <HiUser className="text-lg" /> Client
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-white shadow-sm">
                                {selectedRes.profiles?.avatar_url ? <img src={selectedRes.profiles.avatar_url} className="w-full h-full object-cover" /> : <HiUser className="text-2xl" />}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{selectedRes.profiles?.full_name}</p>
                                <p className="text-xs text-gray-500">{selectedRes.profiles?.email}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs flex items-center gap-2 text-gray-600"><HiPhone className="text-primary" /> {selectedRes.profiles?.phone || 'Pas de numéro'}</p>
                            <p className="text-[10px] text-gray-400 font-mono truncate">UID: {selectedRes.profiles?.id}</p>
                        </div>
                    </div>
                  </div>

                  {/* Receipt Preview */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <HiIdentification className="text-lg" /> Justificatif de paiement ({selectedRes.total_price} DA)
                    </h3>
                    {selectedRes.receipt_url ? (
                        <div className="relative group rounded-xl overflow-hidden border-2 border-white shadow-lg">
                            <img src={selectedRes.receipt_url} alt="Reçu" className="w-full h-64 object-cover" />
                            <a href={selectedRes.receipt_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-primary font-black backdrop-blur-[2px]">
                                <span className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs uppercase">Ouvrir en grand <HiArrowTopRightOnSquare /></span>
                            </a>
                        </div>
                    ) : (
                        <div className="p-10 bg-white/50 text-gray-400 rounded-xl text-center border border-gray-200 border-dashed">
                            <HiClock className="text-4xl mx-auto mb-2 opacity-30" />
                            <p className="font-bold text-sm">En attente de l'upload client</p>
                        </div>
                    )}
                  </div>
                </div>

                {/* Actions & Feedback Column */}
                <div className="space-y-6">
                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <HiChatBubbleLeftEllipsis className="text-xl" /> Message au client
                    </h3>
                    <textarea 
                        className="w-full p-4 rounded-xl border border-primary/20 focus:ring-2 focus:ring-primary/20 outline-none text-sm min-h-[150px] shadow-inner"
                        placeholder="Ex: Veuillez uploader un reçu plus lisible / Raison du refus..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    ></textarea>
                    <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                        Ce message sera visible par le client dans son tableau de bord.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase px-2">Actions disponibles</p>
                    {selectedRes.status === 'pending' && (
                        <>
                            <button onClick={() => handleUpdateStatus(selectedRes.id, 'confirmed')} className="w-full bg-green-500 text-white py-4 rounded-xl font-black hover:bg-green-600 transition shadow-lg shadow-green-100 flex items-center justify-center gap-2 uppercase text-sm">
                                <HiCheckCircle className="text-xl" /> Accepter Demande
                            </button>
                            <button onClick={() => handleUpdateStatus(selectedRes.id, 'rejected')} className="w-full bg-red-500 text-white py-4 rounded-xl font-black hover:bg-red-600 transition shadow-lg shadow-red-100 flex items-center justify-center gap-2 uppercase text-sm">
                                <HiXCircle className="text-xl" /> Rejeter
                            </button>
                        </>
                    )}
                    {selectedRes.status === 'payment_uploaded' && (
                        <>
                            <button onClick={() => handleUpdateStatus(selectedRes.id, 'validated')} className="w-full bg-primary text-white py-4 rounded-xl font-black hover:bg-opacity-90 transition shadow-lg shadow-purple-100 flex items-center justify-center gap-2 uppercase text-sm">
                                <HiShieldCheck className="text-xl" /> Valider Paiement
                            </button>
                            <button onClick={() => handleUpdateStatus(selectedRes.id, 'rejected')} className="w-full bg-red-500 text-white py-4 rounded-xl font-black hover:bg-red-600 transition shadow-lg shadow-red-100 flex items-center justify-center gap-2 uppercase text-sm">
                                <HiXCircle className="text-xl" /> Rejeter Paiement
                            </button>
                        </>
                    )}
                    {(selectedRes.status === 'confirmed' || selectedRes.status === 'validated' || selectedRes.status === 'rejected') && (
                        <div className="space-y-3">
                            <div className="bg-gray-100 p-4 rounded-xl text-gray-500 text-[10px] font-bold text-center uppercase">
                                Action déjà effectuée
                            </div>
                            <button 
                                onClick={() => handleUpdateStatus(selectedRes.id, selectedRes.status)}
                                className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition text-xs uppercase"
                            >
                                Mettre à jour le message uniquement
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
  )
}
