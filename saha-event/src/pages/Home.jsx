import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  Heart, 
  Cake, 
  Briefcase, 
  PartyPopper, 
  Star, 
  Search, 
  Calendar, 
  GlassWater, 
  ChevronRight, 
  Users, 
  CheckCircle2, 
  Gem,
  ArrowDown
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import SalleCard from '../components/salles/SalleCard'
import SearchForm from '../components/home/SearchForm'

const EVENT_CATEGORIES = [
  { 
    name: 'Mariage', 
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80',
    color: 'from-pink-500/20 to-rose-500/20'
  },
  { 
    name: 'Anniversaire', 
    icon: Cake,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  { 
    name: 'Conférence', 
    icon: Briefcase,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    color: 'from-amber-500/20 to-orange-500/20'
  },
  { 
    name: 'Soirée', 
    icon: PartyPopper,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
    color: 'from-purple-500/20 to-indigo-500/20'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Home() {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 200])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const [featuredSalles, setFeaturedSalles] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    salles: '500+',
    events: '10k+',
    wilayas: '58',
    satisfaction: '99%'
  })

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
    } finally {
      setLoading(false)
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
    <div className="flex flex-col min-h-screen bg-primary selection:bg-accent/30">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-primary">
          <motion.div 
            style={{ y: y1 }}
            className="absolute inset-0 opacity-40"
          >
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-mid rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-accent-pink rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] bg-accent rounded-full blur-[80px] opacity-20"></div>
          </motion.div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ opacity }}
          >
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-bold tracking-widest uppercase mb-6"
            >
              La référence en Algérie
            </motion.span>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-tight mb-8">
              Célébrez des Moments <br />
              <span className="gradient-text">Inoubliables</span>
            </h1>
            
            <p className="text-text-light/60 text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Découvrez et réservez les plus belles salles de réception à travers les 58 wilayas pour vos mariages, conférences et événements privés.
            </p>
          </motion.div>

          <SearchForm onSubmit={handleSearch} variant="hero" />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-text-light/30 text-xs font-bold uppercase tracking-widest">Découvrir plus</span>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ArrowDown className="text-accent/50" size={20} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white mb-4"
            >
              Pour Chaque <span className="text-accent">Occasion</span>
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent to-transparent mx-auto rounded-full"></div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {EVENT_CATEGORIES.map((category) => (
              <motion.div 
                key={category.name}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="group relative cursor-pointer"
              >
                <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden border border-white/10">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent transition-opacity duration-300 group-hover:opacity-90`}></div>
                  
                  <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                      <category.icon className="text-accent group-hover:text-primary transition-colors" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">{category.name}</h3>
                    <p className="text-text-light/50 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorer les salles →</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Salles */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Salles <span className="gradient-text">Incontournables</span></h2>
              <p className="text-text-light/50">Une sélection exclusive des espaces les plus prisés pour garantir la réussite de votre événement.</p>
            </div>
            <motion.button 
              whileHover={{ x: 5 }}
              onClick={() => navigate('/search')}
              className="flex items-center gap-2 text-accent font-bold hover:text-white transition-colors"
            >
              Voir toutes les salles <ChevronRight size={20} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-[450px] rounded-3xl bg-white/5 animate-pulse border border-white/10"></div>
              ))
            ) : (
              featuredSalles.map((salle, idx) => (
                <motion.div
                  key={salle.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <SalleCard salle={salle} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-black text-white mb-8 leading-tight">
                L'organisation de votre <br /> 
                événement n'a jamais été <br />
                <span className="text-accent">aussi simple.</span>
              </h2>
              
              <div className="space-y-12 mt-12">
                {[
                  { title: 'Recherche Intelligente', desc: 'Filtrez parmi des centaines de salles par ville, capacité et type d\'événement.', icon: Search },
                  { title: 'Réservation Directe', desc: 'Vérifiez les disponibilités en temps réel et réservez en toute sécurité.', icon: Calendar },
                  { title: 'Célébration Parfaite', desc: 'Profitez de votre journée, nous nous occupons de la mise en relation.', icon: GlassWater }
                ].map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="flex gap-6 group"
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-300">
                      <step.icon size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-text-light/50 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <motion.div 
                animate={{ rotate: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
              >
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80" 
                  alt="Event celebration" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-mid rounded-full blur-[100px] opacity-30 -z-10"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent rounded-full blur-[100px] opacity-20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-b from-primary to-[#0f031d]">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Salles partenaires', value: '500+', icon: Gem },
              { label: 'Événements réussis', value: '10k+', icon: Users },
              { label: 'Wilayas couvertes', value: '58', icon: CheckCircle2 },
              { label: 'Satisfaction client', value: '99%', icon: Star }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center hover:bg-white/10 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon size={24} />
                </div>
                <div className="text-4xl font-black text-white mb-2 tracking-tight">{stat.value}</div>
                <div className="text-text-light/40 text-sm font-bold uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
