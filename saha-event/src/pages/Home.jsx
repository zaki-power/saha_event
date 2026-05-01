import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import SalleCard from '../components/salles/SalleCard'
import SearchForm from '../components/home/SearchForm'

// Imports for Font Awesome 6
import { 
  FaRing, 
  FaCakeCandles,
  FaHandshake, 
  FaStar, 
  FaMagnifyingGlass,
  FaCalendarDays,
  FaChampagneGlasses,
  FaArrowDown,
  FaUsers,
  FaCheck,
  FaGem
} from 'react-icons/fa6'

const EVENT_CATEGORIES = [
  { 
    name: 'Mariage', 
    icon: FaRing,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80'
  },
  { 
    name: 'Anniversaire', 
    icon: FaCakeCandles,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80'
  },
  { 
    name: 'Conférence', 
    icon: FaHandshake,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'
  },
  { 
    name: 'Soirée', 
    icon: FaStar,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80'
  }
]

export default function Home() {
  const navigate = useNavigate()

  const [featuredSalles, setFeaturedSalles] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    salles: 0,
    events: 0,
    wilayas: 58,
    satisfaction: 99
  })

  useEffect(() => {
    fetchFeaturedSalles()
    fetchStats()
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
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data: sallesData, error: sallesError } = await supabase
        .from('salles')
        .select('count', { count: 'exact' })
      
      const { data: reservationsData, error: reservationsError } = await supabase
        .from('reservations')
        .select('count', { count: 'exact' })
      
      if (!sallesError && sallesData) {
        setStats(prev => ({...prev, salles: sallesData.length || 500}))
      }
      if (!reservationsError && reservationsData) {
        setStats(prev => ({...prev, events: reservationsData.length || 10000}))
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleSearch = (params) => {
    const query = new URLSearchParams({
      city: params.wilaya,
      type: params.type,
      date: params.date,
      guests: params.guests
    }).toString()
    navigate(`/search?${query}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-20">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animate-gradient" style={{
          background: 'linear-gradient(135deg, #1a0533, #6B21A8, #1a0533)',
          backgroundSize: '400% 400%'
        }}></div>

        {/* Floating decorative circles */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent-pink rounded-full opacity-10 blur-3xl animate-float"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-primary-mid rounded-full opacity-10 blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-accent rounded-full opacity-5 blur-3xl animate-float" style={{animationDelay: '4s'}}></div>

        {/* Content */}
        <div className="max-w-7xl mx-auto text-center relative z-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold gradient-text mb-6 animate-fade-in-up">
            Trouvez la Salle Parfaite pour Votre Grand Jour
          </h1>
          <p className="text-text-light/80 text-lg lg:text-xl mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Découvrez les plus belles salles d'Algérie pour célébrer vos moments inoubliables
          </p>

          {/* Search Bar - Glassmorphism */}
          <SearchForm onSubmit={handleSearch} variant="hero" />

          {/* Scroll indicator */}
          <div className="flex justify-center animate-bounce mt-8">
            <FaArrowDown className="text-accent text-2xl" />
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text text-center mb-4">Types d'Événements</h2>
          <p className="text-text-light/60 text-center mb-16 max-w-2xl mx-auto">Explorez nos catégories pour trouver la salle idéale</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EVENT_CATEGORIES.map((type, idx) => (
              <div 
                key={type.name} 
                className="group cursor-pointer animate-fade-in-up"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className="relative rounded-3xl overflow-hidden h-64 shadow-2xl shadow-primary-mid/20 hover:shadow-accent/40 transition-all duration-300 group-hover:scale-105">
                  {/* Background image */}
                  <img 
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <div className="text-5xl mb-4 text-accent group-hover:scale-110 transition-transform duration-300">
                      <type.icon />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{type.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Salles Section */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold gradient-text mb-2">Nos Salles Populaires</h2>
              <div className="w-20 h-1 bg-accent rounded-full"></div>
            </div>
            <button 
              onClick={() => navigate('/search')} 
              className="text-accent font-semibold hover:text-accent-pink transition-colors duration-300 text-lg hidden sm:block"
            >
              Voir tout →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card-lg h-80 animate-pulse"></div>
              ))
            ) : featuredSalles.length > 0 ? (
              featuredSalles.map((salle) => (
                <SalleCard key={salle.id} salle={salle} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-text-light/60 text-lg">Aucune salle disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-mid">
        <div className="container-custom">
          <h2 className="text-4xl lg:text-5xl font-bold gradient-text text-center mb-16">Comment Ça Marche ?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Recherchez", desc: "Filtrez par ville, type d'événement et budget", icon: FaMagnifyingGlass, number: 1 },
              { title: "Réservez", desc: "Réservez en ligne en quelques clics simples", icon: FaCalendarDays, number: 2 },
              { title: "Célébrez", desc: "Profitez de votre moment magique en toute sérénité", icon: FaChampagneGlasses, number: 3 }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="relative group animate-fade-in-up"
                style={{animationDelay: `${idx * 0.15}s`}}
              >
                {/* Number circle */}
                <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-gradient-to-r from-primary-mid to-accent-pink flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-mid/40 z-10">
                  {step.number}
                </div>

                {/* Card */}
                <div className="glass-card-lg p-8 h-full flex flex-col items-center text-center group-hover:bg-white/10 transition-all duration-300">
                  <div className="text-5xl mb-6 text-accent group-hover:text-accent-pink transition-colors duration-300 group-hover:scale-110 transform group-hover:animate-float mt-4">
                    <step.icon />
                  </div>
                  <h3 className="text-2xl font-bold text-text-light mb-3">{step.title}</h3>
                  <p className="text-text-light/70">{step.desc}</p>
                </div>

                {/* Connecting line */}
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 w-12 border-t-2 border-dashed border-accent/30 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Salles Disponibles", value: "500+", icon: FaGem },
              { label: "Événements Organisés", value: "10,000+", icon: FaUsers },
              { label: "Wilayas Couvertes", value: "58", icon: FaCheck },
              { label: "Clients Satisfaits", value: "99%", icon: FaStar }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="glass-card-lg p-8 text-center group hover:bg-white/10 transition-all duration-300 animate-fade-in-up"
                style={{animationDelay: `${idx * 0.1}s`}}
              >
                <div className="text-5xl text-accent mb-4 group-hover:scale-125 transition-transform duration-300 group-hover:animate-float">
                  <stat.icon />
                </div>
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-text-light/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
