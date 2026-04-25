export default function ReservationCard({ reservation }) {
  const { salles, event_date, event_type, status, total_price } = reservation
  
  const mainImage = Array.isArray(salles?.images) ? salles.images[0] : (salles?.images || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=200')

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  const statusLabels = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    cancelled: 'Annulée'
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
          <img 
            src={mainImage} 
            className="w-full h-full object-cover"
            alt={salles?.name}
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-800">{salles?.name || 'Salle'}</h4>
          <p className="text-sm text-gray-500">{new Date(event_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="text-xs font-medium text-primary mt-1">{event_type}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between md:justify-end gap-6">
        <div className="text-right">
          <p className="font-bold text-gray-800">{total_price} DA</p>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusColors[status]}`}>
            {statusLabels[status]}
          </span>
        </div>
        <button className="text-gray-400 hover:text-primary transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
