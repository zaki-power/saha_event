import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Users, Star, ArrowRight } from 'lucide-react'

export default function SalleCard({ salle, searchGuests }) {
  const { id, name, city, price_per_day, price_per_guest = 0, capacity, images, rating = 4.8 } = salle

  const guestsCount = parseInt(searchGuests) || 0
  const basePrice = parseFloat(price_per_day) || 0
  const guestFee = parseFloat(price_per_guest) || 0
  const totalPrice = basePrice + (guestsCount * guestFee)

  const mainImage = Array.isArray(images) ? images[0] : (images || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800')

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group"
    >
      <Link 
        to={`/salles/${id}`} 
        className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-[2rem] overflow-hidden hover:border-accent/50 transition-colors duration-500 shadow-xl hover:shadow-accent/5"
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <motion.img 
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={mainImage} 
            alt={name}
            className="w-full h-full object-cover"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
          
          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <div className={`px-3 py-1.5 rounded-xl font-black shadow-lg transition-all duration-300 ${guestsCount > 0 ? 'bg-primary/80 backdrop-blur-md text-accent border border-accent/20 text-xs' : 'bg-accent text-primary text-sm'}`}>
              {guestsCount > 0 ? (
                <div className="flex flex-col items-end leading-tight">
                  <span className="text-[8px] uppercase tracking-tighter opacity-70">Total pour {guestsCount} pers.</span>
                  <span>{totalPrice} DA</span>
                </div>
              ) : (
                <span>{price_per_day} DA</span>
              )}
            </div>
            {guestsCount > 0 && (
              <div className="bg-accent text-primary px-2 py-1 rounded-lg font-black text-[10px] shadow-lg animate-fade-in">
                Prix Spécial
              </div>
            )}
          </div>

          <div className="absolute top-4 left-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Star className="text-accent fill-accent" size={14} />
              <span className="text-white font-bold text-xs">{rating}</span>
            </div>
          </div>

          {/* Location on image for mobile/quick view */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white/90 text-xs font-medium">
            <MapPin size={14} className="text-accent" />
            <span>{city}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors line-clamp-1 mb-4">
            {name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                <Users size={18} />
              </div>
              <div>
                <p className="text-[10px] text-text-light/40 uppercase font-black tracking-widest">Capacité</p>
                <p className="text-sm font-bold text-text-light">{capacity} Personnes</p>
              </div>
            </div>

            <motion.div 
              whileHover={{ x: 5 }}
              className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all"
            >
              <ArrowRight size={20} />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
