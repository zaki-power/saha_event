import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HiSparkles, 
  HiArrowRight,
  HiShieldCheck,
  HiTrophy,
  HiUsers,
  HiHeart,
  HiMagnifyingGlass,
  HiCalendarDays,
  HiCheckBadge
} from 'react-icons/hi2'

export default function About() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent opacity-40" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-accent to-accent-pink rounded-full blur-3xl opacity-10 animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-l from-accent-pink to-primary-mid rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-widest mb-4">
              L'excellence événementielle en Algérie
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              Réinventer vos <br />
              <span className="gradient-text">Moments Précieux</span>
            </h1>
            <p className="text-xl text-text-light/70 leading-relaxed max-w-2xl mx-auto font-medium">
              Saha-Event est la plateforme leader dédiée à la simplification et à la modernisation de la réservation de salles de réception à travers les 58 wilayas.
            </p>
            </motion.div>
        </div>
      </section>

      {/* Content Section with Image Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-text-light">
              Notre <span className="gradient-text">Vision</span>
            </h2>
            <div className="space-y-6 text-text-light/80 text-lg leading-relaxed">
              <p>
                Né d'une volonté de moderniser le secteur de l'événementiel en Algérie, 
                <span className="font-bold text-accent"> Saha-Event</span> connecte les propriétaires de salles d'exception avec ceux qui souhaitent créer des souvenirs inoubliables.
              </p>
              <p>
                Nous croyons que la recherche de la salle parfaite pour un mariage, une conférence ou un anniversaire ne devrait pas être un obstacle, mais le début d'une belle aventure.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="border-l-2 border-accent pl-6">
                  <p className="text-3xl font-black text-white">500+</p>
                  <p className="text-sm text-text-light/50 font-bold uppercase tracking-wider">Salles Partenaires</p>
                </div>
                <div className="border-l-2 border-accent pl-6">
                  <p className="text-3xl font-black text-white">58</p>
                  <p className="text-sm text-text-light/50 font-bold uppercase tracking-wider">Wilayas Couvertes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-64 rounded-3xl overflow-hidden border border-white/10 group">
                <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Salles de Mariage" />
              </div>
              <div className="h-48 rounded-3xl overflow-hidden border border-white/10 group">
                <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Anniversaire" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-48 rounded-3xl overflow-hidden border border-white/10 group">
                <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Conférence" />
              </div>
              <div className="h-64 rounded-3xl overflow-hidden border border-white/10 group">
                <img src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Soirée" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Comment ça <span className="text-accent">marche</span> ?</h2>
            <p className="text-text-light/60">Trois étapes simples pour votre événement parfait</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: HiMagnifyingGlass, title: "Recherchez", desc: "Explorez des centaines de salles vérifiées selon vos critères." },
              { icon: HiCalendarDays, title: "Réservez", desc: "Vérifiez la disponibilité et envoyez votre demande en un clic." },
              { icon: HiCheckBadge, title: "Célébrez", desc: "Finalisez votre paiement CCP et profitez de votre événement." }
            ].map((step, idx) => (
              <div key={idx} className="relative text-center group">
                <div className="w-20 h-20 bg-primary-mid border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300">
                  <step.icon className="text-3xl text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-text-light/60 text-sm leading-relaxed">{step.desc}</p>
                {idx < 2 && <div className="hidden lg:block absolute top-10 left-[60%] w-full h-px bg-gradient-to-r from-accent/30 to-transparent" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="glass-card-lg p-8 border border-white/10 hover:border-accent/30 transition-all group">
               <HiShieldCheck className="text-4xl text-accent mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-lg font-black mb-3 text-white">Transparence</h3>
               <p className="text-text-light/50 text-sm leading-relaxed">Prix clairs et photos réelles pour chaque établissement.</p>
            </div>
            <div className="glass-card-lg p-8 border border-white/10 hover:border-accent/30 transition-all group">
               <HiUsers className="text-4xl text-accent mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-lg font-black mb-3 text-white">Service Client</h3>
               <p className="text-text-light/50 text-sm leading-relaxed">Une équipe dédiée pour vous accompagner 7j/7.</p>
            </div>
            <div className="glass-card-lg p-8 border border-white/10 hover:border-accent/30 transition-all group">
               <HiHeart className="text-4xl text-accent mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-lg font-black mb-3 text-white">Tradition</h3>
               <p className="text-text-light/50 text-sm leading-relaxed">Le respect de nos coutumes au cœur de notre technologie.</p>
            </div>
            <div className="glass-card-lg p-8 border border-white/10 hover:border-accent/30 transition-all group">
               <HiTrophy className="text-4xl text-accent mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-lg font-black mb-3 text-white">Sûreté</h3>
               <p className="text-text-light/50 text-sm leading-relaxed">Vérification rigoureuse de chaque salle partenaire.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto glass-card-lg p-12 rounded-[3rem] border border-accent/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-3xl rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-8">
              Prêt à organiser votre <br /> 
              <span className="text-accent">prochain événement ?</span>
            </h2>
            <Link 
              to="/search" 
              className="btn-gold px-12 py-4 rounded-full font-black text-lg shadow-2xl shadow-accent/20 hover:scale-105 transition active:scale-95 inline-flex items-center gap-3"
            >
              Lancer la recherche
              <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
