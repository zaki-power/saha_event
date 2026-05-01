import { Link } from 'react-router-dom'
import { 
  HiSparkles, 
  HiArrowRight,
  HiShieldCheck,
  HiTrophy,
  HiUsers,
  HiHeart
} from 'react-icons/hi2'

export default function About() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-pink/10 via-transparent to-transparent opacity-40" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-accent-pink to-accent rounded-full blur-3xl opacity-10 animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-gradient-to-l from-accent-pink to-primary-mid rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black mb-8">
            <span className="gradient-text">Notre Mission : Célébrer l'Algérie</span>
          </h1>
          <p className="text-xl text-text-light/70 leading-relaxed max-w-2xl mx-auto">
            Saha-Event est la première plateforme dédiée à la simplification de l'organisation de vos moments les plus précieux.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-black mb-8 text-text-light">
              <span className="gradient-text">Qui sommes-nous ?</span>
            </h2>
            <div className="space-y-6 text-text-light/80 text-lg leading-relaxed">
              <p>
                Né d'une volonté de moderniser le secteur de l'événementiel en Algérie, 
                <span className="font-bold text-accent"> Saha-Event</span> connecte les propriétaires de salles d'exception avec ceux qui souhaitent créer des souvenirs inoubliables.
              </p>
              <p>
                Que ce soit pour un mariage traditionnel, un anniversaire chaleureux ou une conférence professionnelle de haut niveau, nous croyons que la recherche de la salle parfaite ne devrait pas être un parcours du combattant.
              </p>
              <p>
                Notre plateforme offre une transparence totale, des filtres précis par wilaya et un système de réservation sécurisé pour garantir votre tranquillité d'esprit.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="space-y-4">
              <div className="h-48 glass-card-lg rounded-2xl flex items-center justify-center text-5xl border border-accent-pink/20 group hover:scale-105 transition-transform hover:border-accent-pink/40">💍</div>
              <div className="h-64 glass-card-lg rounded-2xl overflow-hidden border border-primary-mid/20 group hover:scale-105 transition-transform hover:border-accent-pink/40">
                <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Event" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-64 glass-card-lg rounded-2xl overflow-hidden border border-primary-mid/20 group hover:scale-105 transition-transform hover:border-accent-pink/40">
                <img src="https://images.unsplash.com/photo-1470753937643-efad93c23abc?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="Celebration" />
              </div>
              <div className="h-48 glass-card-lg rounded-2xl flex items-center justify-center text-5xl border border-accent/20 group hover:scale-105 transition-transform hover:border-accent/40">🎉</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto section-padding">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-black mb-4 text-text-light">
            <span className="gradient-text">Notre Équipe</span>
          </h2>
          <p className="text-text-light/70 text-lg">Passionnés par la création d'expériences inoubliables</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Amine Benali', role: 'Fondateur & CEO', icon: '👨‍💼' },
            { name: 'Fatima Mansouri', role: 'Directrice Opérations', icon: '👩‍💼' },
            { name: 'Karim Abdelkrim', role: 'Lead Developer', icon: '👨‍💻' }
          ].map((member, idx) => (
            <div key={idx} className="glass-card-lg p-8 border border-primary-mid/20 hover:border-accent-pink/40 group hover:scale-105 transition-transform text-center animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent to-accent-pink rounded-2xl flex items-center justify-center text-5xl shadow-lg shadow-accent/30 group-hover:rotate-12 transition-transform">
                {member.icon}
              </div>
              <h3 className="text-xl font-black text-text-light mb-2">{member.name}</h3>
              <p className="text-accent font-bold text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-black mb-4 text-text-light">
              <span className="gradient-text">Nos Engagements</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card-lg p-8 border border-primary-mid/20 hover:border-accent-pink/40 group hover:scale-105 transition-transform text-center animate-fade-in-up">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent to-yellow-400 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-accent/30 group-hover:rotate-12 transition-transform">
                🇩🇿
              </div>
              <h3 className="text-lg font-black text-text-light mb-3">Savoir-faire Local</h3>
              <p className="text-text-light/70 text-sm">Une expertise ancrée dans les traditions algériennes.</p>
            </div>
            <div className="glass-card-lg p-8 border border-primary-mid/20 hover:border-accent-pink/40 group hover:scale-105 transition-transform text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-accent-pink to-red-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-accent-pink/30 group-hover:rotate-12 transition-transform">
                🛡️
              </div>
              <h3 className="text-lg font-black text-text-light mb-3">Sécurité & Confiance</h3>
              <p className="text-text-light/70 text-sm">Un système de paiement clair et sécurisé.</p>
            </div>
            <div className="glass-card-lg p-8 border border-primary-mid/20 hover:border-accent-pink/40 group hover:scale-105 transition-transform text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-green-500/30 group-hover:rotate-12 transition-transform">
                ✨
              </div>
              <h3 className="text-lg font-black text-text-light mb-3">Excellence</h3>
              <p className="text-text-light/70 text-sm">Uniquement les meilleures salles sélectionnées.</p>
            </div>
            <div className="glass-card-lg p-8 border border-primary-mid/20 hover:border-accent-pink/40 group hover:scale-105 transition-transform text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 group-hover:rotate-12 transition-transform">
                ❤️
              </div>
              <h3 className="text-lg font-black text-text-light mb-3">Passion</h3>
              <p className="text-text-light/70 text-sm">Dédié à faire de chaque événement unique.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <h2 className="text-4xl font-black mb-8 text-text-light">
            <span className="gradient-text">Prêt à trouver votre salle idéale ?</span>
          </h2>
          <Link 
            to="/search" 
            className="inline-flex items-center gap-2 btn-gradient px-10 py-4 rounded-full shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/40 transition transform hover:scale-110 font-bold group"
          >
            Commencer la recherche
            <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
