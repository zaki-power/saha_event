import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SalleCard from '../components/salles/SalleCard'

// Corrected imports for Font Awesome 6
import { 
  FaRing, 
  FaCakeCandles,      // Updated from FaCake
  FaHandshake, 
  FaStar, 
  FaMagnifyingGlass,  // Updated from FaSearch
  FaCalendarDays,     // Updated from FaCalendar
  FaChampagneGlasses  // Replacement for FaPartyhorn
} from 'react-icons/fa6'

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

const EVENT_TYPES = ["Mariage", "Anniversaire", "Conférence", "Soirée", "Autre"]

export default function Home() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState({
    wilaya: '',
    type: '',
    date: '',
    guests: ''
  })

  const [featuredSalles, setFeaturedSalles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFeaturedSalles()
  }, [])

  const fetchFeaturedSalles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('salles')
        .select('*')
        .eq('available', true)
        .limit(6)
      
      if (error) throw error
      setFeaturedSalles(data || [])
    } catch (err) {
      console.error('Error fetching featured salles:', err)
      setError('Impossible de charger les salles en vedette.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const query = new URLSearchParams({
      city: searchParams.wilaya,
      type: searchParams.type,
      date: searchParams.date,
      guests: searchParams.guests
    }).toString()
    navigate(`/search?${query}`)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative moving-bg py-20 lg:py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-in animate-slide-in-up">
            Trouvez la salle parfaite pour votre événement
          </h1>
          <p className="text-purple-100 text-lg lg:text-xl mb-12 max-w-2xl mx-auto animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            Célébrez vos moments inoubliables dans les plus belles salles d'Algérie.
          </p>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-xl shadow-2xl max-w-5xl mx-auto">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-2 mb-1">Wilaya</label>
                <select 
                  className="w-full p-2 border-r border-gray-100 focus:outline-none bg-transparent"
                  value={searchParams.wilaya}
                  onChange={(e) => setSearchParams({...searchParams, wilaya: e.target.value})}
                  required
                >
                  <option value="">Sélectionner</option>
                  {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-2 mb-1">Type</label>
                <select 
                  className="w-full p-2 border-r border-gray-100 focus:outline-none bg-transparent"
                  value={searchParams.type}
                  onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
                  required
                >
                  <option value="">Événement</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-2 mb-1">Date</label>
                <input 
                  type="date"
                  className="w-full p-2 border-r border-gray-100 focus:outline-none"
                  value={searchParams.date}
                  onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-2 mb-1">Invités</label>
                <input 
                  type="number"
                  placeholder="Nombre"
                  className="w-full p-2 focus:outline-none"
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="bg-accent text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition duration-300 transform hover:scale-105"
              >
                Rechercher
              </button>
            </form>
          </div>
        </div>
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-400 rounded-full opacity-10 blur-3xl"></div>
      </section>

      {/* Event Types Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Types d'Événements</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Mariage', icon: FaRing },
            { name: 'Anniversaire', icon: FaCakeCandles }, // Updated name
            { name: 'Conférence', icon: FaHandshake },
            { name: 'Soirée', icon: FaStar }
          ].map((type, idx) => {
            const IconComponent = type.icon
            return (
              <div key={type.name} className="group cursor-pointer animate-slide-in-up" style={{animationDelay: `${idx * 0.1}s`}}>
                <div className="bg-gray-100 rounded-2xl p-8 text-center transition-all duration-300 group-hover:bg-primary group-hover:shadow-xl group-hover:scale-105 transform group-hover:animate-pulse-glow">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm group-hover:scale-110 transition-transform group-hover:animate-spin-slow">
                    <IconComponent className="text-primary group-hover:text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 group-hover:text-white">{type.name}</h3>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Featured Salles */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Salles Populaires</h2>
              <p className="text-gray-600">Découvrez nos salles les plus réservées</p>
            </div>
            <button onClick={() => navigate('/search')} className="text-primary font-semibold hover:underline">
              Voir tout →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : featuredSalles.length > 0 ? (
              featuredSalles.map((salle) => (
                <SalleCard key={salle.id} salle={salle} />
              ))
            ) : (
              <p className="col-span-3 text-center text-gray-500">Aucune salle disponible pour le moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-16">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Recherchez", desc: "Filtrez par ville, budget et capacité", icon: FaMagnifyingGlass }, // Updated
              { title: "Réservez", desc: "Réservez en ligne en quelques clics", icon: FaCalendarDays },       // Updated
              { title: "Célébrez", desc: "Profitez de votre moment magique", icon: FaChampagneGlasses }    // Updated
            ].map((step, idx) => {
              const StepIcon = step.icon
              return (
                <div key={idx} className="relative group animate-slide-in-up" style={{animationDelay: `${idx * 0.15}s`}}>
                  <div className="text-5xl mb-6 text-primary group-hover:text-accent transition-colors duration-300 group-hover:scale-110 transform inline-block group-hover:animate-float">
                    <StepIcon />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-primary group-hover:scale-105 transition-transform">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                  {idx < 2 && (
                    <div className="hidden lg:block absolute top-10 right-[-20%] w-20 border-t-2 border-dashed border-gray-300"></div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
