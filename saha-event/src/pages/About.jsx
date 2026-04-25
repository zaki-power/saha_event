import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-primary py-20 px-4 text-center text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Notre Mission : Célébrer l'Algérie</h1>
          <p className="text-xl text-purple-100 leading-relaxed">
            Saha-Event est la première plateforme dédiée à la simplification de l'organisation de vos moments les plus précieux.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Qui sommes-nous ?</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>
                Né d'une volonté de moderniser le secteur de l'événementiel en Algérie, 
                <span className="font-bold text-primary"> Saha-Event</span> connecte les propriétaires de salles d'exception avec ceux qui souhaitent créer des souvenirs inoubliables.
              </p>
              <p>
                Que ce soit pour un mariage traditionnel, un anniversaire chaleureux ou une conférence professionnelle de haut niveau, nous croyons que la recherche de la salle parfaite ne devrait pas être un parcours du combattant.
              </p>
              <p>
                Notre plateforme offre une transparence totale, des filtres précis par wilaya et un système de réservation sécurisé pour garantir votre tranquillité d'esprit.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-48 bg-purple-50 rounded-2xl flex items-center justify-center text-4xl">💍</div>
              <div className="h-64 bg-gray-100 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Event" />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-64 bg-gray-100 rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1470753937643-efad93c23abc?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Celebration" />
              </div>
              <div className="h-48 bg-yellow-50 rounded-2xl flex items-center justify-center text-4xl">🎉</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-16">Nos Engagements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-6">🇩🇿</div>
              <h3 className="text-xl font-bold text-primary mb-3">Savoir-faire Local</h3>
              <p className="text-gray-600">Une expertise ancrée dans les traditions algériennes pour répondre aux besoins spécifiques de nos clients.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-6">🛡️</div>
              <h3 className="text-xl font-bold text-primary mb-3">Sécurité & Confiance</h3>
              <p className="text-gray-600">Un processus de vérification rigoureux et un système de paiement par CCP clair et sécurisé.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-6">✨</div>
              <h3 className="text-xl font-bold text-primary mb-3">Excellence</h3>
              <p className="text-gray-600">Nous sélectionnons uniquement les meilleures salles pour garantir le succès de chaque événement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Prêt à trouver votre salle idéale ?</h2>
        <Link 
          to="/search" 
          className="inline-block bg-accent text-white font-bold py-4 px-10 rounded-full shadow-xl hover:bg-opacity-90 transition transform hover:scale-105"
        >
          Commencer la recherche
        </Link>
      </section>
    </div>
  )
}
