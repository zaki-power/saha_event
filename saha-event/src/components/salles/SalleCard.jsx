import { Link } from 'react-router-dom'
import { FaMapPin, FaUsers, FaStar } from 'react-icons/fa6'

export default function SalleCard({ salle }) {
  const { id, name, city, price_per_day, capacity, images, rating = 4.5 } = salle

  const mainImage = Array.isArray(images) ? images[0] : (images || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800')

  return (
    <Link to={`/salles/${id}`} className="group glass-card-lg overflow-hidden hover:bg-white/15 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-accent/20 block h-full">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={mainImage} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Price badge */}
        <div className="absolute top-4 right-4 glass-card-lg backdrop-blur-md px-3 py-1.5 rounded-lg border border-accent/30">
          <span className="text-accent font-bold">{price_per_day} DA</span>
        </div>

        {/* Rating badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1 glass-card-lg backdrop-blur-md px-2.5 py-1.5 rounded-lg">
          <FaStar className="text-accent" size={16} />
          <span className="text-text-light font-semibold text-sm">{rating}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Name and city */}
        <h3 className="font-bold text-text-light text-xl group-hover:text-accent transition line-clamp-2 mb-2">{name}</h3>
        
        <p className="text-text-light/60 text-sm mb-4 flex items-center">
           <FaMapPin className="mr-2 text-accent" size={14} /> 
           <span>{city}</span>
         </p>
        
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>
        
        {/* Capacity and action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-text-light/70 text-sm">
            <FaUsers className="mr-2 text-accent" size={14} />
            <span>Jusqu'à {capacity} pers.</span>
          </div>
          <span className="text-accent font-semibold text-sm group-hover:translate-x-1 transition-transform">Voir →</span>
        </div>
      </div>
    </Link>
  )
}
