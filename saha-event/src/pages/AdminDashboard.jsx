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
  HiChevronRight,
  HiXMark,
  HiArrowTopRightOnSquare
} from 'react-icons/hi2'

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRes, setSelectedRes] = useState(null)

  useEffect(() => {
    fetchAdminData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [reservations, filterStatus, searchTerm])

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
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      const updateList = (list) => list.map(res => res.id === id ? { ...res, status: newStatus } : res)
      setReservations(prev => updateList(prev))
      if (selectedRes?.id === id) {
        setSelectedRes(prev => ({ ...prev, status: newStatus }))
      }
    } catch (err) {
      alert('Erreur: ' + err.message)
    }
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
          <p className="text-gray-500">Cliquez sur une ligne pour voir les détails complets.</p>
        </div>
        
        <div className="bg-primary bg-opacity-10 px-6 py-3 rounded-2xl border border-primary border-opacity-20 text-center min-w-[150px]">
          <p className="text-sm text-primary font-medium">Total des réservations</p>
          <p className="text-2xl font-bold text-primary">{reservations.length}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {['all', 'pending', 'confirmed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition capitalize whitespace-nowrap ${
                filterStatus === status 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {status === 'all' ? 'Tous' : status === 'pending' ? 'En attente' : status === 'confirmed' ? 'Confirmé' : 'Rejeté'}
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
                <th className="px-6 py-4">Date & Prix</th>
                <th className="px-6 py-4 text-center">Statut</th>
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
                      <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary font-bold overflow-hidden">
                        {res.profiles?.avatar_url ? (
                            <img src={res.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : <HiUser className="text-xl" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{res.profiles?.full_name}</p>
                        <p className="text-xs text-gray-500">{res.profiles?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{res.salles?.name}</p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{res.event_type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{new Date(res.event_date).toLocaleDateString('fr-FR')}</p>
                    <p className="text-sm font-bold text-primary mt-0.5">{res.total_price} DA</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase
                      ${res.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                        res.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {res.status === 'pending' && <HiClock className="text-xs" />}
                      {res.status === 'confirmed' && <HiCheckCircle className="text-xs" />}
                      {res.status === 'rejected' && <HiXCircle className="text-xs" />}
                      {res.status === 'pending' ? 'En attente' : 
                       res.status === 'confirmed' ? 'Confirmée' : 'Rejetée'}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(res.id, 'confirmed')}
                        className={`p-2 rounded-lg transition shadow-sm ${res.status === 'confirmed' ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                        disabled={res.status === 'confirmed'}
                        title="Confirmer"
                      >
                        <HiCheckCircle className="text-lg" />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(res.id, 'rejected')}
                        className={`p-2 rounded-lg transition shadow-sm ${res.status === 'rejected' ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
                        disabled={res.status === 'rejected'}
                        title="Rejeter"
                      >
                        <HiXCircle className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-500">
                    <p className="text-lg font-medium">Aucune réservation trouvée</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRes && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Détails de la Réservation</h2>
                <p className="text-sm text-gray-500 font-mono">ID: #{selectedRes.id.slice(0, 8)}</p>
              </div>
              <button 
                onClick={() => setSelectedRes(null)}
                className="p-2 hover:bg-white rounded-full transition text-gray-400 hover:text-gray-800 border border-transparent hover:border-gray-200"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Section 1: Reservation & Salle */}
                <div>
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <HiDocumentText className="text-lg" /> Informations Événement
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Salle</label>
                        <p className="font-bold text-gray-800 text-lg">{selectedRes.salles?.name}</p>
                        <p className="text-sm text-gray-500">{selectedRes.salles?.address}, {selectedRes.salles?.city}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Date</label>
                            <p className="font-bold text-gray-800">{new Date(selectedRes.event_date).toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Type</label>
                            <p className="font-bold text-primary">{selectedRes.event_type}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Invités</label>
                            <p className="font-bold text-gray-800">{selectedRes.guests_count} pers.</p>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Prix Total</label>
                            <p className="font-black text-xl text-primary">{selectedRes.total_price} DA</p>
                        </div>
                    </div>
                  </div>

                  {/* Receipt Preview */}
                  <div className="mt-8">
                    <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <HiIdentification className="text-lg" /> Justificatif de paiement
                    </h3>
                    {selectedRes.receipt_url ? (
                        <div className="relative group rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 p-2 hover:border-primary/50 transition">
                            <img 
                                src={selectedRes.receipt_url} 
                                alt="Reçu" 
                                className="w-full h-52 object-cover rounded-xl"
                            />
                            <a 
                                href={selectedRes.receipt_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-primary font-black backdrop-blur-[2px]"
                            >
                                <span className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                    Ouvrir en grand <HiArrowTopRightOnSquare />
                                </span>
                            </a>
                        </div>
                    ) : (
                        <div className="p-10 bg-red-50 text-red-500 rounded-2xl text-center border border-red-100 border-dashed">
                            <HiXCircle className="text-4xl mx-auto mb-2 opacity-50" />
                            <p className="font-bold">Aucun justificatif envoyé</p>
                        </div>
                    )}
                  </div>
                </div>

                {/* Section 2: User Profile */}
                <div>
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <HiUser className="text-lg" /> Profil du Client
                  </h3>
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ring-1 ring-gray-50">
                    <div className="flex flex-col items-center text-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl text-primary font-bold mb-4 overflow-hidden border-2 border-white shadow-md">
                            {selectedRes.profiles?.avatar_url ? (
                                <img src={selectedRes.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : <HiUser className="text-4xl" />}
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">{selectedRes.profiles?.full_name}</h4>
                        <p className="text-xs text-gray-400 font-medium">Membre depuis {new Date(selectedRes.profiles?.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl group hover:bg-white hover:ring-1 hover:ring-primary/20 transition">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                                <HiEnvelope className="text-xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                                <p className="font-semibold text-gray-800">{selectedRes.profiles?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl group hover:bg-white hover:ring-1 hover:ring-primary/20 transition">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                                <HiPhone className="text-xl" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Téléphone</p>
                                <p className="font-semibold text-gray-800">{selectedRes.profiles?.phone || 'Non renseigné'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl group hover:bg-white hover:ring-1 hover:ring-primary/20 transition">
                            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                                <HiIdentification className="text-xl" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">User ID</p>
                                <p className="text-[10px] font-mono text-gray-500 truncate">{selectedRes.profiles?.id}</p>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* Quick Actions in Modal */}
                  <div className="mt-10 flex gap-4">
                        <button 
                            onClick={() => handleUpdateStatus(selectedRes.id, 'confirmed')}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition shadow-lg ${selectedRes.status === 'confirmed' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600 shadow-green-100'}`}
                            disabled={selectedRes.status === 'confirmed'}
                        >
                            <HiCheckCircle className="text-xl" />
                            {selectedRes.status === 'confirmed' ? 'Déjà Confirmée' : 'Confirmer'}
                        </button>
                        <button 
                            onClick={() => handleUpdateStatus(selectedRes.id, 'rejected')}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition shadow-lg ${selectedRes.status === 'rejected' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600 shadow-red-100'}`}
                            disabled={selectedRes.status === 'rejected'}
                        >
                            <HiXCircle className="text-xl" />
                            {selectedRes.status === 'rejected' ? 'Déjà Rejetée' : 'Rejeter'}
                        </button>
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
