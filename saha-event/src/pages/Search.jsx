import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SlidersHorizontal, 
  Search as SearchIcon, 
  MapPin, 
  Users, 
  Euro, 
  Wifi, 
  FilterX, 
  ChevronDown,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import SalleCard from '../components/salles/SalleCard'

const WILAYAS = [
  "01 Adrar", "02 Chlef", "03 Laghouat", "04 Oum El Bouaghi", "05 Batna", "06 Béjaïa", "07 Biskra", "08 Béchar",
  "09 Blida", "10 Bouira", "11 Tamanrasset", "12 Tébessa", "13 Tlemcen", "14 Tiaret", "15 Tizi Ouzou", "16 Alger",
  "17 Djelfa", "18 Jijel", "19 Sétif", "20 Saïda", "21 Skikda", "22 Sidi Bel Abbès", "23 Annaba", "24 Guelma",
  "25 Constantine", "26 Médéa", "27 Mostaganem", "28 M'Sila", "29 Mascara", "30 Ouargla", "31 Oran", "32 El Bayadh",
  "33 Illizi", "34 Bordj Bou Arreridj", "35 Boumerdès", "36 El Tarf", "37 Tindouf", "38 Tissemsilt", "39 El Oued",
  "40 Khenchela", "41 Souk Ahras", "42 Tipaza", "43 Mila", "44 Aïn Defla", "45 Naâma", "46 Aïn Témouchent", "47 Ghardaïa",
  "48 Relizane", "49 El M'Ghair", "50 El Meniaa", "51 Ouled Djellal", "52 Bordj Baji Mokhtar", "53 Béni Abbès",
  "54 Timimoun", "55 Touggourt", "56 Djanet", "57 In Salah", "58 In Guezzam"
]

const AMENITIES = [
  "WiFi", "Climatisation", "Parking", "Catering", "Scène", "Sonorisation", "Sécurité", "Espace extérieur", "Cuisine équipée"
]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [salles, setSalles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Local state for filters
  const [filters, setFilters] = useState({
    wilaya: searchParams.get('wilaya') || searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    capacity: searchParams.get('capacity') || searchParams.get('guests') || '',
    amenities: searchParams.get('amenities')?.split(',') || []
  })
  
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchSalles()
    window.scrollTo(0, 0)
  }, [searchParams, sortBy])

  const fetchSalles = async () => {
    setLoading(true)
    try {
      let query = supabase.from('salles').select('*').eq('available', true)

      const city = searchParams.get('city') || searchParams.get('wilaya')
      const guests = searchParams.get('guests') || searchParams.get('capacity')
      const type = searchParams.get('type')
      const minPrice = searchParams.get('minPrice')
      const maxPrice = searchParams.get('maxPrice')
      const amenities = searchParams.get('amenities')?.split(',')

      if (city) {
        // Strip the number from "16 Alger" if it exists for better matching
        const cleanCity = city.includes(' ') ? city.split(' ').slice(1).join(' ') : city
        query = query.ilike('city', `%${cleanCity}%`)
      }
      
      if (guests) query = query.gte('capacity', parseInt(guests))
      if (type) query = query.contains('event_types', [type])
      if (minPrice) query = query.gte('price_per_day', parseInt(minPrice))
      if (maxPrice) query = query.lte('price_per_day', parseInt(maxPrice))
      if (amenities && amenities.length > 0 && amenities[0] !== '') {
        query = query.contains('amenities', amenities)
      }

      // Sorting
      if (sortBy === 'price_asc') query = query.order('price_per_day', { ascending: true })
      else if (sortBy === 'price_desc') query = query.order('price_per_day', { ascending: false })
      else if (sortBy === 'capacity_desc') query = query.order('capacity', { ascending: false })
      else query = query.order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error
      setSalles(data || [])
    } catch (err) {
      console.error('Error fetching salles:', err)
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  const applyFilters = () => {
    const params = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) params[key] = value.join(',')
      } else if (value) {
        params[key] = value
      }
    })
    setSearchParams(params)
    if (window.innerWidth < 1024) setShowFilters(false)
  }

  const toggleAmenity = (amenity) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
      return { ...prev, amenities: newAmenities }
    })
  }

  const clearFilters = () => {
    setFilters({wilaya: '', type: '', minPrice: '', maxPrice: '', capacity: '', amenities: []})
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
              Trouver un <span className="gradient-text">Espace</span>
            </h1>
            <p className="text-text-light/40 font-bold uppercase tracking-widest text-xs">
              {loading ? 'Recherche en cours...' : `${salles.length} Résultats trouvés`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold transition-all hover:bg-white/10"
            >
              <SlidersHorizontal size={18} />
              <span>Filtres</span>
            </button>
            
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl">
              <button className="p-2 text-accent bg-white/5 rounded-xl shadow-inner shadow-black/20"><LayoutGrid size={20} /></button>
              <button className="p-2 text-text-light/30 hover:text-text-light transition-colors"><ListIcon size={20} /></button>
            </div>
            
            <div className="relative hidden md:block">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 text-white pl-5 pr-12 py-3.5 rounded-2xl font-bold text-sm focus:outline-none focus:border-accent transition-all cursor-pointer"
              >
                <option value="newest">Plus récents</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="capacity_desc">Capacité max</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light/30 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className={`lg:w-80 flex-shrink-0 ${showFilters ? 'fixed inset-0 z-[100] bg-primary/95 p-6 overflow-y-auto' : 'hidden lg:block'}`}>
            <div className="lg:sticky lg:top-24 space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <SlidersHorizontal size={20} className="text-accent" />
                  Affiner
                </h2>
                {showFilters && (
                  <button onClick={() => setShowFilters(false)} className="lg:hidden text-text-light/50"><FilterX size={24} /></button>
                )}
                {(filters.wilaya || filters.capacity || filters.minPrice || filters.amenities.length > 0) && (
                  <button onClick={clearFilters} className="text-xs font-bold text-accent hover:underline uppercase tracking-widest">Effacer</button>
                )}
              </div>

              <div className="space-y-8">
                {/* Wilaya */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-light/40 uppercase tracking-[0.2em] ml-1">Wilaya</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light/30" size={18} />
                    <select 
                      className="w-full input-glass pl-12 pr-10 py-3.5 appearance-none cursor-pointer"
                      value={filters.wilaya}
                      onChange={(e) => setFilters({...filters, wilaya: e.target.value})}
                    >
                      <option value="" className="bg-primary text-text-light">Toutes les wilayas</option>
                      {WILAYAS.map(w => <option key={w} value={w} className="bg-primary text-text-light">{w}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light/30 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-light/40 uppercase tracking-[0.2em] ml-1">Budget (DA)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="input-glass px-4 py-3.5"
                      value={filters.minPrice} 
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})} 
                    />
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="input-glass px-4 py-3.5"
                      value={filters.maxPrice} 
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} 
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-light/40 uppercase tracking-[0.2em] ml-1">Capacité Min.</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light/30" size={18} />
                    <input 
                      type="number"
                      placeholder="Nombre d'invités"
                      className="w-full input-glass pl-12 pr-4 py-3.5"
                      value={filters.capacity}
                      onChange={(e) => setFilters({...filters, capacity: e.target.value})}
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-light/40 uppercase tracking-[0.2em] ml-1">Commodités</label>
                  <div className="grid grid-cols-1 gap-3">
                    {AMENITIES.map(amenity => (
                      <label key={amenity} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors group">
                        <input 
                          type="checkbox" 
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-accent focus:ring-accent focus:ring-offset-0" 
                        />
                        <span className="text-sm font-bold text-text-light/60 group-hover:text-white transition-colors">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={applyFilters}
                  className="w-full bg-accent hover:bg-yellow-400 text-primary py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-accent/10 transition-all"
                >
                  Appliquer
                </motion.button>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            <AnimatePresence mode='wait'>
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8"
                >
                  {[1, 2, 4, 5, 6].map(i => (
                    <div key={i} className="h-[400px] rounded-[2rem] bg-white/5 animate-pulse border border-white/10"></div>
                  ))}
                </motion.div>
              ) : salles.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8"
                >
                  {salles.map((salle, idx) => (
                    <motion.div
                      key={salle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <SalleCard salle={salle} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-32 bg-white/5 border border-white/10 rounded-[3rem] text-center px-6"
                >
                  <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-8">
                    <SearchIcon size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">Aucun palais trouvé</h3>
                  <p className="text-text-light/40 max-w-md mb-10 leading-relaxed font-medium">
                    Nous n'avons trouvé aucune salle correspondant à vos critères actuels. Essayez d'élargir votre recherche ou de réinitialiser les filtres.
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-accent font-black uppercase tracking-widest bg-accent/10 px-8 py-4 rounded-2xl hover:bg-accent hover:text-primary transition-all"
                  >
                    <FilterX size={20} />
                    <span>Réinitialiser</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
