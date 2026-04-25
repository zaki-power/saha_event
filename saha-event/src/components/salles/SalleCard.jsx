import { Link } from 'react-router-dom'

export default function SalleCard({ salle }) {
  const { id, name, city, price_per_day, capacity, images, rating = 4.5 } = salle

  const mainImage = Array.isArray(images) ? images[0] : (images || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800')

  return (
    <Link to={`/salles/${id}`} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={mainImage} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-bold text-primary">
          {price_per_day} DA
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-800 text-lg group-hover:text-primary transition line-clamp-1">{name}</h3>
          <div className="flex items-center text-accent">
            <span className="text-sm font-bold mr-1">{rating}</span>
            <span>⭐</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-3 flex items-center">
          <span className="mr-1">📍</span> {city}
        </p>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center text-gray-600 text-sm">
            <span className="mr-1">👥</span>
            <span>Jusqu'à {capacity} pers.</span>
          </div>
          <span className="text-primary font-semibold text-sm">Détails →</span>
        </div>
      </div>
    </Link>
  )
}
