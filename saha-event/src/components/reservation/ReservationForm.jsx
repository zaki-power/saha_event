import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function ReservationForm({ salleId, pricePerDay, capacity }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    eventType: '',
    date: '',
    guests: '',
    notes: '',
    receipt: null
  })

  const uploadReceipt = async (file, userId, reservationId) => {
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(`${userId}/${reservationId}.pdf`, file, {
        contentType: 'application/pdf',
        upsert: false
      })
    if (error) throw error
    return data.path
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Seuls les fichiers PDF sont acceptés.')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier est trop volumineux (max 5MB).')
        return
      }
      setFormData({ ...formData, receipt: file })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/auth/login')
      return
    }

    setSubmitting(true)
    try {
      // 1. Create the reservation record first to get an ID if needed, 
      // but here we use a timestamp for the filename as per Phase 6.6 logic 
      // or we can use the requested pattern in Phase 7.
      
      const reservationId = Date.now() // Temporary ID for filename
      const filePath = await uploadReceipt(formData.receipt, user.id, reservationId)

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath)

      // 3. Insert into reservations table
      const { error: reserveError } = await supabase
        .from('reservations')
        .insert({
          salle_id: salleId,
          client_id: user.id,
          event_type: formData.eventType,
          event_date: formData.date,
          guests_count: parseInt(formData.guests),
          notes: formData.notes,
          receipt_url: publicUrl,
          total_price: pricePerDay,
          status: 'pending'
        })

      if (reserveError) throw reserveError

      alert('Réservation envoyée avec succès !')
      navigate('/dashboard/reservations')
    } catch (err) {
      alert(err.message || 'Erreur lors de la réservation')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Type d'événement</label>
        <select 
          required
          className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition"
          value={formData.eventType}
          onChange={(e) => setFormData({...formData, eventType: e.target.value})}
        >
          <option value="">Sélectionner</option>
          <option value="Mariage">Mariage</option>
          <option value="Anniversaire">Anniversaire</option>
          <option value="Conférence">Conférence</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Date souhaitée</label>
        <input 
          type="date" 
          required
          className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre d'invités</label>
        <input 
          type="number" 
          required
          placeholder={`Max ${capacity}`}
          className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
          value={formData.guests}
          onChange={(e) => setFormData({...formData, guests: e.target.value})}
        />
      </div>

      <div className="pt-4 border-t border-dashed border-gray-100 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">Total estimé</span>
          <span className="text-2xl font-bold text-primary">{pricePerDay} DA</span>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-xl mb-4 border border-yellow-100">
          <p className="text-xs text-yellow-700 font-medium leading-relaxed">
            💡 Veuillez joindre le reçu de paiement CCP pour confirmer votre réservation. (Format PDF, max 5MB)
          </p>
        </div>

        <input 
          type="file" 
          accept=".pdf"
          required
          onChange={handleFileChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90 mb-6"
        />
      </div>

      <button 
        type="submit"
        disabled={submitting}
        className={`w-full bg-accent text-white font-bold py-4 rounded-xl shadow-xl hover:bg-opacity-90 transition transform active:scale-95 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {submitting ? 'Traitement...' : 'Confirmer la réservation'}
      </button>
    </form>
  )
}
