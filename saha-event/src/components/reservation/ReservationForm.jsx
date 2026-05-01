import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { FaInfo } from 'react-icons/fa6'

const EVENT_TYPES = ["Mariage", "Anniversaire", "Conférence", "Soirée", "Autre"]

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
        <label className="block text-sm font-semibold text-text-light/80 mb-2">Type d'événement</label>
        <select 
          required
          className="input-glass w-full appearance-none cursor-pointer"
          style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23f3e8ff%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '12px', paddingRight: '2.5rem'}}
          value={formData.eventType}
          onChange={(e) => setFormData({...formData, eventType: e.target.value})}
        >
          <option value="" className="bg-primary text-text-light">Sélectionner</option>
          {EVENT_TYPES.map(t => <option key={t} value={t} className="bg-primary text-text-light">{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-light/80 mb-2">Date souhaitée</label>
        <input 
          type="date" 
          required
          className="input-glass w-full"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-light/80 mb-2">Nombre d'invités</label>
        <input 
          type="number" 
          required
          placeholder={`Max ${capacity}`}
          className="input-glass w-full"
          value={formData.guests}
          onChange={(e) => setFormData({...formData, guests: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-text-light/80 mb-2">Notes (Optionnel)</label>
        <textarea 
          placeholder="Détails supplémentaires..."
          className="input-glass w-full resize-none"
          rows="4"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        ></textarea>
      </div>

      <div className="pt-4 border-t border-primary-mid/20 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-text-light/70 font-medium">Total estimé</span>
          <span className="text-2xl font-black gradient-text">{pricePerDay} DA</span>
        </div>
        
        <div className="glass-card p-4 border border-blue-500/30 bg-blue-500/5 mb-6 rounded-xl">
          <div className="flex gap-3">
            <FaInfo className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300 font-medium leading-relaxed">
              Une fois votre demande confirmée par l'administrateur, vous pourrez uploader votre reçu de paiement.
            </p>
          </div>
        </div>
      </div>

      <FieldUI
        type="submit"
        disabled={submitting}
        className={submitting ? 'opacity-70 cursor-not-allowed' : ''}
      >
        {submitting ? 'Traitement...' : 'Envoyer la demande'}
      </FieldUI>
    </form>
  )
}
