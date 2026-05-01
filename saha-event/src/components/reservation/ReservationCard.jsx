import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { 
  HiCheckCircle, 
  HiXCircle, 
  HiClock, 
  HiDocumentPlus, 
  HiArrowTopRightOnSquare, 
  HiInformationCircle,
  HiXMark,
  HiCalendarDays,
  HiUserGroup,
  HiTag,
  HiMapPin,
  HiChatBubbleLeftEllipsis
} from 'react-icons/hi2'

export default function ReservationCard({ reservation, onUpdate }) {
  const { id, salles, event_date, event_type, status, total_price, receipt_url, client_id, guests_count, notes, admin_feedback } = reservation
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  const mainImage = Array.isArray(salles?.images) ? salles.images[0] : (salles?.images || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=200')

  const statusConfig = {
    pending: {
      color: 'badge-warning',
      label: 'En attente',
      icon: <HiClock />,
      msg: 'Votre demande est en cours d\'examen par un administrateur.'
    },
    confirmed: {
      color: 'badge-success',
      label: 'Confirmée',
      icon: <HiCheckCircle />,
      msg: 'Réservation acceptée ! Veuillez uploader votre reçu de paiement CCP pour valider.'
    },
    payment_uploaded: {
      color: 'badge-info',
      label: 'Paiement envoyé',
      icon: <HiClock />,
      msg: 'Reçu envoyé. Un administrateur va vérifier votre paiement.'
    },
    validated: {
      color: 'badge-success',
      label: 'Validée',
      icon: <HiCheckCircle />,
      msg: 'Réservation validée ! Votre événement est officiellement confirmé.'
    },
    rejected: {
      color: 'badge-error',
      label: 'Rejetée',
      icon: <HiXCircle />,
      msg: 'Votre demande a été refusée.'
    }
  }

  const currentStatus = statusConfig[status] || statusConfig.pending

  const handleFileUpload = async (e) => {
    e.stopPropagation()
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Veuillez uploader un fichier PDF.')
      return
    }

    setUploading(true)
    try {
      const fileName = `${client_id}/${id}_${Date.now()}.pdf`
      const { data, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(data.path)

      const { error: updateError } = await supabase
        .from('reservations')
        .update({ 
          receipt_url: publicUrl,
          status: 'payment_uploaded'
        })
        .eq('id', id)

      if (updateError) throw updateError
      
      alert('Reçu uploadé avec succès !')
      if (onUpdate) onUpdate()
    } catch (err) {
      alert('Erreur: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Card */}
      <div 
        onClick={() => setShowModal(true)}
        className="glass-card-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary-mid/50 cursor-pointer transition"
      >
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 shadow-xl">
            <img 
              src={mainImage} 
              className="w-full h-full object-cover"
              alt={salles?.name}
            />
          </div>
          <div>
            <h4 className="font-bold text-text-light text-lg">{salles?.name || 'Salle'}</h4>
            <div className="flex flex-col gap-0.5 mt-1">
              <p className="text-sm text-text-light/60 font-medium">
                {new Date(event_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-xs font-bold text-accent uppercase tracking-wider">{event_type}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-8 border-t border-white/5 md:border-t-0 pt-4 md:pt-0">
          <div className="text-right">
            <p className="font-black text-text-light text-xl">{total_price} DA</p>
            <span className={`inline-flex items-center gap-1 mt-1 text-xs px-3 py-1 rounded-full font-black uppercase tracking-tighter ${currentStatus.color}`}>
              {currentStatus.icon} {currentStatus.label}
            </span>
          </div>
          <div className="p-2 bg-primary-mid/20 text-accent rounded-full transition">
             <HiArrowTopRightOnSquare className="text-xl" />
          </div>
        </div>
      </div>

      {/* Info Bar with Feedback Preview if status is rejected/confirmed */}
      <div 
        onClick={() => status === 'confirmed' ? null : setShowModal(true)}
        className={`glass-card p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 transition-all duration-300 cursor-pointer
        ${status === 'confirmed' ? 'border-accent/50 ring-2 ring-accent/20' : 'border-white/10'}`}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
          ${status === 'confirmed' ? 'bg-accent/20 text-accent animate-pulse' : 'bg-primary-mid/20 text-text-light/50'}`}>
          <HiInformationCircle className="text-xl" />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className={`text-sm font-bold ${status === 'confirmed' ? 'text-accent' : 'text-text-light/80'}`}>
            {currentStatus.msg}
          </p>
          {admin_feedback && (
            <p className="text-xs text-red-400 font-bold mt-1 bg-red-500/20 inline-block px-2 py-0.5 rounded-lg border border-red-500/30">
               Message: {admin_feedback}
            </p>
          )}
        </div>

        {status === 'confirmed' && (
          <div className="relative group" onClick={(e) => e.stopPropagation()}>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={uploading}
            />
            <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-300 shadow-md
              ${uploading ? 'btn-ghost opacity-50 cursor-not-allowed' : 'btn-gold hover:scale-105 active:scale-95'}`}>
              <HiDocumentPlus className="text-lg" />
              {uploading ? 'Upload...' : 'UPLOADER LE REÇU PDF'}
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
          <div 
            className="glass-card-lg w-full max-w-2xl overflow-hidden flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-primary-mid/30 backdrop-blur-lg">
              <div>
                <h2 className="text-2xl font-bold text-text-light">Détails de ma Réservation</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-text-light/50 font-mono">#{id.slice(0, 8)}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${currentStatus.color}`}>
                    {currentStatus.label}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition text-text-light/50 hover:text-accent border border-transparent hover:border-accent/30"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="space-y-8">
                {/* Admin Feedback Section (Highlighted) */}
                {admin_feedback && (
                  <div className="bg-red-500/20 border-2 border-red-500/40 p-6 rounded-2xl">
                    <h4 className="text-red-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-3">
                        <HiChatBubbleLeftEllipsis className="text-xl" /> Message de l'administrateur
                    </h4>
                    <p className="text-red-300 font-bold text-lg leading-relaxed italic">
                        "{admin_feedback}"
                    </p>
                  </div>
                )}

                {/* Status Message Section */}
                <div className={`p-5 rounded-2xl border-2 border-dashed flex items-start gap-4 ${status === 'confirmed' ? 'bg-accent/10 border-accent/50 text-accent' : 'bg-primary-mid/20 border-white/10 text-text-light/80'}`}>
                  <HiInformationCircle className="text-2xl shrink-0 mt-0.5" />
                  <p className="font-bold leading-relaxed">{currentStatus.msg}</p>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 glass-card rounded-2xl">
                    <div className="w-12 h-12 bg-primary-mid/40 rounded-xl flex items-center justify-center text-accent shadow-sm"><HiMapPin className="text-xl" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-text-light/50 uppercase">Salle & Lieu</p>
                      <p className="font-bold text-text-light">{salles?.name}</p>
                      <p className="text-xs text-text-light/60">{salles?.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 glass-card rounded-2xl">
                    <div className="w-12 h-12 bg-primary-mid/40 rounded-xl flex items-center justify-center text-accent shadow-sm"><HiCalendarDays className="text-xl" /></div>
                    <div>
                      <p className="text-[10px] font-bold text-text-light/50 uppercase">Date</p>
                      <p className="font-bold text-text-light">{new Date(event_date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                {/* Receipt Section */}
                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-text-light">Paiement & Justificatif</h3>
                      <p className="text-sm text-text-light/60">Total: {total_price} DA</p>
                    </div>
                    {receipt_url && (
                      <a href={receipt_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-accent font-bold hover:underline">
                        Voir mon reçu <HiArrowTopRightOnSquare />
                      </a>
                    )}
                  </div>

                  {status === 'confirmed' && (
                    <div className="bg-accent/10 border border-accent/30 p-6 rounded-2xl flex flex-col items-center gap-4">
                       <HiDocumentPlus className="text-4xl text-accent opacity-60" />
                       <div className="text-center">
                         <p className="font-bold text-accent">Prêt pour le paiement ?</p>
                         <p className="text-xs text-text-light/60 mt-1">Uploadez votre reçu CCP au format PDF.</p>
                       </div>
                       <div className="relative w-full">
                          <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={uploading} />
                          <button className={`w-full py-3 rounded-xl font-black transition ${uploading ? 'btn-ghost opacity-50 cursor-not-allowed' : 'btn-gold'}`}>
                            {uploading ? 'Upload en cours...' : 'CHOISIR LE FICHIER PDF'}
                          </button>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 bg-primary-mid/30 border-t border-white/10 text-center">
              <button onClick={() => setShowModal(false)} className="text-text-light/60 font-bold hover:text-accent transition">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
