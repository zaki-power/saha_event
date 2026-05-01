import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SalleCard from '../components/salles/SalleCard'

// Updated to fa6 and renamed icons
import { FaSliders, FaMagnifyingGlass } from 'react-icons/fa6'
import FieldUI from '../components/ui/FieldUI'

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

const AMENITIES = ["WiFi", "Parking", "Climatisation", "Catering", "Scène", "Sonorisation"]

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [salles, setSalles] = useState([])
  const [loading, setLoading] = useState(true)

  // Local state for filters
  const [filters, setFilters] = useState({
    wilaya: searchParams.get('wilaya') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    capacity: searchParams.get('capacity') || ''
  })

  useEffect(() => {
    fetchSalles()
  }, [searchParams])

  const fetchSalles = async () => {
    setLoading(true)
    try {
      let query = supabase.from('salles').select('*').eq('available', true)

      const city = searchParams.get('city') || searchParams.get('wilaya')
      const guests = searchParams.get('guests') || searchParams.get('capacity')
      const type = searchParams.get('type')
      const minPrice = searchParams.get('minPrice')
      const maxPrice = searchParams.get('maxPrice')

      if (city) query = query.ilike('city', `%${city}%`)
      if (guests) query = query.gte('capacity', parseInt(guests))
      if (type) query = query.contains('event_types', [type])
      if (minPrice) query = query.gte('price_per_day', parseInt(minPrice))
      if (maxPrice) query = query.lte('price_per_day', parseInt(maxPrice))

      const { data, error } = await query
      if (error) throw error
      setSalles(data || [])
    } catch (err) {
      console.error('Error fetching salles:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    const params = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value
    })
    setSearchParams(params)
  }

  return (
    <div className="min-h-screen bg-primary section-padding">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="glass-card-lg p-8 sticky top-24 shadow-2xl shadow-primary-mid/20">
              <h2 className="text-xl font-bold text-text-light mb-8 flex items-center">
                <FaSliders className="mr-3 text-accent" /> Filtres
              </h2>

              <div className="space-y-6">
                {/* Wilaya Filter */}
                <div>
                  <FieldUI label="Wilaya" type="select" value={filters.wilaya} onChange={(e) => setFilters({...filters, wilaya: e.target.value})} options={[{value: '', label: 'Toutes'}, ...WILAYAS]} />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-text-light/80 mb-2">Budget (DA)</label>
                  <div className="flex gap-2">
                    <FieldUI type="number" placeholder="Min" className="w-1/2" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} />
                    <FieldUI type="number" placeholder="Max" className="w-1/2" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} />
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <FieldUI label="Capacité Min." type="number" placeholder="Ex: 200" value={filters.capacity} onChange={(e) => setFilters({...filters, capacity: e.target.value})} />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-semibold text-text-light/80 mb-3">Équipements</label>
                  <div className="space-y-2">
                    {AMENITIES.map(amenity => (
                      <label key={amenity} className="flex items-center text-sm text-text-light/70 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="mr-2 rounded border-accent/30 text-accent bg-white/10 focus:ring-accent focus:ring-offset-0" 
                        />
                        <span className="group-hover:text-accent transition-colors">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={applyFilters}
                  className="btn-gradient w-full py-3"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </aside>

          {/* Right Content - Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold gradient-text">
                {loading ? 'Recherche...' : `${salles.length} ${salles.length === 1 ? 'salle' : 'salles'} trouvées`}
              </h1>
              <select className="glass-card px-3 py-2 text-sm font-semibold text-text-light/70 rounded-lg cursor-pointer">
                <option>Trier par: Prix croissant</option>
                <option>Trier par: Prix décroissant</option>
                <option>Trier par: Popularité</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="glass-card-lg h-80 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : salles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {salles.map(salle => (
                  <SalleCard key={salle.id} salle={salle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass-card-lg rounded-3xl">
                <div className="text-6xl mb-4 inline-block text-accent/30">
                  <FaMagnifyingGlass />
                </div>
                <h3 className="text-xl font-bold text-text-light mb-2">Aucun résultat trouvé</h3>
                <p className="text-text-light/60 mb-6">Essayez de modifier vos filtres pour voir plus d'options.</p>
                <button 
                  onClick={() => {
                    setFilters({wilaya: '', type: '', minPrice: '', maxPrice: '', capacity: ''})
                    setSearchParams({})
                  }}
                  className="text-accent font-bold hover:text-accent-pink transition"
                >
                  Réinitialiser tout
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
