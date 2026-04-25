import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          salles (name),
          profiles:client_id (full_name, email, phone)
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

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      
      setReservations(prev => prev.map(res => 
        res.id === id ? { ...res, status: newStatus } : res
      ))
      alert(`Réservation ${newStatus === 'confirmed' ? 'confirmée' : 'rejetée'}`)
    } catch (err) {
      alert('Erreur: ' + err.message)
    }
  }

  if (loading) return <div className="p-20 text-center">Chargement du panel admin...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel Super Administrateur</h1>
      
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Salle & Événement</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Reçu (PDF)</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{res.profiles?.full_name}</p>
                    <p className="text-xs text-gray-500">{res.profiles?.email}</p>
                    <p className="text-xs text-gray-500">{res.profiles?.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold">{res.salles?.name}</p>
                    <p className="text-xs text-primary">{res.event_type}</p>
                    <p className="text-xs text-gray-400">{res.guests_count} invités</p>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(res.event_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {res.receipt_url ? (
                      <a 
                        href={res.receipt_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary font-bold hover:underline flex items-center"
                      >
                        <span className="mr-1">📄</span> Voir Reçu
                      </a>
                    ) : (
                      <span className="text-red-400 italic">Aucun reçu</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold 
                      ${res.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                        res.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                        'bg-yellow-100 text-yellow-700'}`}>
                      {res.status === 'pending' ? 'En attente' : 
                       res.status === 'confirmed' ? 'Confirmée' : 'Rejetée'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {res.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(res.id, 'confirmed')}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-600 transition"
                        >
                          Confirmer
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(res.id, 'rejected')}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 transition"
                        >
                          Rejeter
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}