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
    notes: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/auth/login')
      return
    }

    setSubmitting(true)
    try {
      // 1. Insert into reservations table without receipt_url
      const { error: reserveError } = await supabase
        .from('reservations')
        .insert({
          salle_id: salleId,
          client_id: user.id,
          event_type: formData.eventType,
          event_date: formData.date,
          guests_count: parseInt(formData.guests),
          notes: formData.notes,
          total_price: pricePerDay,
          status: 'pending'
        })

      if (reserveError) throw reserveError

      alert('Demande de réservation envoyée ! Un administrateur va l\'examiner.')
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

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Notes (Optionnel)</label>
        <textarea 
          placeholder="Détails supplémentaires..."
          className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary outline-none min-h-[100px]"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        ></textarea>
      </div>

      <div className="pt-4 border-t border-dashed border-gray-100 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-500">Total estimé</span>
          <span className="text-2xl font-bold text-primary">{pricePerDay} DA</span>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            ℹ️ Une fois votre demande confirmée par l'administrateur, vous pourrez uploader votre reçu de paiement.
          </p>
        </div>
      </div>

      <button 
        type="submit"
        disabled={submitting}
        className={`w-full bg-accent text-white font-bold py-4 rounded-xl shadow-xl hover:bg-opacity-90 transition transform active:scale-95 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {submitting ? 'Traitement...' : 'Envoyer la demande'}
      </button>
    </form>
  )
}
