import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, Send, Calendar, Users, FileText, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import FieldUI from '../ui/FieldUI'

const EVENT_TYPES = ["Mariage", "Anniversaire", "Conférence", "Soirée", "Autre"]

export default function ReservationForm({ salleId, pricePerDay, pricePerGuest = 0, capacity }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    eventType: '',
    date: '',
    guests: '',
    notes: ''
  })

  const guestsCount = parseInt(formData.guests) || 0
  const basePrice = parseFloat(pricePerDay) || 0
  const guestFee = parseFloat(pricePerGuest) || 0
  const totalPrice = basePrice + (guestsCount * guestFee)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/auth/login')
      return
    }

    setSubmitting(true)
    try {
      const { error: reserveError } = await supabase
        .from('reservations')
        .insert({
          salle_id: salleId,
          client_id: user.id,
          event_type: formData.eventType,
          event_date: formData.date,
          guests_count: guestsCount,
          notes: formData.notes,
          total_price: totalPrice,
          status: 'pending'
        })

      if (reserveError) throw reserveError

      setSuccess(true)
      setTimeout(() => {
        navigate('/dashboard/reservations')
      }, 2000)
    } catch (err) {
      alert(err.message || 'Erreur lors de la réservation')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 bg-green-500/10 border border-green-500/20 rounded-[2.5rem]"
      >
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h3 className="text-2xl font-black text-white mb-4">Demande Envoyée !</h3>
        <p className="text-text-light/50 font-medium leading-relaxed mb-8">
          Votre demande de réservation a été transmise avec succès. Notre équipe l'examinera dans les plus brefs délais.
        </p>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2 }}
            className="bg-green-500 h-full"
          />
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldUI 
        label="Type d'événement"
        type="select"
        required
        options={["Sélectionner le type", ...EVENT_TYPES]}
        value={formData.eventType}
        onChange={(e) => setFormData({...formData, eventType: e.target.value})}
      />

      <FieldUI 
        label="Date souhaitée"
        type="date"
        required
        value={formData.date}
        onChange={(e) => setFormData({...formData, date: e.target.value})}
      />

      <FieldUI 
        label="Nombre d'invités"
        type="number"
        required
        placeholder={`Capacité max: ${capacity}`}
        value={formData.guests}
        onChange={(e) => setFormData({...formData, guests: e.target.value})}
      />

      {pricePerGuest > 0 && formData.guests && (
        <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl animate-fade-in">
          <Users size={14} className="text-accent" />
          <p className="text-[10px] font-bold text-accent uppercase tracking-wider">
            + {guestsCount * pricePerGuest} DA pour les invités ({pricePerGuest} DA/pers.)
          </p>
        </div>
      )}

      <FieldUI 
        label="Notes Particulières"
        type="textarea"
        placeholder="Informations complémentaires, traiteur, décorations..."
        rows="4"
        value={formData.notes}
        onChange={(e) => setFormData({...formData, notes: e.target.value})}
      />

      <div className="pt-6 border-t border-white/5 mt-8 space-y-4">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-text-light/50">Prix de Base</span>
          <span className="text-white">{pricePerDay} DA</span>
        </div>
        
        {guestsCount > 0 && pricePerGuest > 0 && (
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-text-light/50">Frais Invités ({guestsCount} × {pricePerGuest} DA)</span>
            <span className="text-accent">+ {guestsCount * pricePerGuest} DA</span>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] font-black text-text-light/30 uppercase tracking-[0.2em] mb-1">Total à payer</p>
            <p className="text-4xl font-black text-white">{totalPrice} <span className="text-accent text-sm ml-1 uppercase">DA</span></p>
          </div>
          <p className="text-[10px] font-bold text-text-light/30 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">TVA Incluse</p>
        </div>
        
        <div className="bg-primary/50 border border-blue-500/20 p-5 rounded-2xl mb-8 flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Info size={18} className="text-blue-400" />
          </div>
          <p className="text-xs text-blue-300/80 font-medium leading-relaxed">
            Suite à la confirmation de l'administrateur, un lien de paiement sécurisé vous sera transmis pour finaliser votre réservation.
          </p>
        </div>

        <FieldUI
          type="submit"
          disabled={submitting}
          className={submitting ? 'opacity-70 cursor-not-allowed' : ''}
        >
          <div className="flex items-center justify-center gap-3">
            {submitting ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <>
                <Send size={18} />
                <span>Envoyer la Demande</span>
              </>
            )}
          </div>
        </FieldUI>
      </div>
    </form>
  )
}
