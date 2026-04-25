import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">🔧</span> Filtres
            </h2>

            <div className="space-y-6">
              {/* Wilaya Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Wilaya</label>
                <select 
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                  value={filters.wilaya}
                  onChange={(e) => setFilters({...filters, wilaya: e.target.value})}
                >
                  <option value="">Toutes</option>
                  {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Budget (DA)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    className="w-1/2 p-2 border border-gray-200 rounded-lg text-sm"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    className="w-1/2 p-2 border border-gray-200 rounded-lg text-sm"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Capacité Min.</label>
                <input 
                  type="number" 
                  placeholder="Ex: 200" 
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                  value={filters.capacity}
                  onChange={(e) => setFilters({...filters, capacity: e.target.value})}
                />
              </div>

              {/* Amenities - Display only for now */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Équipements</label>
                <div className="space-y-2">
                  {AMENITIES.map(amenity => (
                    <label key={amenity} className="flex items-center text-sm text-gray-600">
                      <input type="checkbox" className="mr-2 rounded border-gray-300 text-primary focus:ring-primary" />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={applyFilters}
                className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-opacity-90 transition shadow-md shadow-purple-100"
              >
                Appliquer
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content - Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {loading ? 'Recherche...' : `${salles.length} salles trouvées`}
            </h1>
            <select className="bg-transparent border-none text-sm font-semibold text-gray-600 outline-none cursor-pointer">
              <option>Trier par: Prix croissant</option>
              <option>Trier par: Popularité</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-100 h-80 animate-pulse rounded-xl"></div>
              ))}
            </div>
          ) : salles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {salles.map(salle => (
                <SalleCard key={salle.id} salle={salle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos filtres pour voir plus d'options.</p>
              <button 
                onClick={() => {
                  setFilters({wilaya: '', type: '', minPrice: '', maxPrice: '', capacity: ''})
                  setSearchParams({})
                }}
                className="mt-6 text-primary font-bold hover:underline"
              >
                Réinitialiser tout
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
