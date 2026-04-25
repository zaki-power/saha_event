import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now, just simulate a submission
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une question ? Un besoin particulier pour votre événement ? Notre équipe est là pour vous accompagner.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {submitted && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
                Merci ! Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition"
                    placeholder="Amine Benali"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sujet</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition"
                  placeholder="Ex: Demande d'informations"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none transition"
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-primary text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-opacity-90 transition transform active:scale-95"
              >
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-primary rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📍</div>
              <h2 className="text-2xl font-bold mb-8">Informations</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <h3 className="font-bold">Adresse</h3>
                    <p className="text-purple-100">Cité 1200 Logements, Alger, Algérie</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <h3 className="font-bold">Téléphone</h3>
                    <p className="text-purple-100">+213 (0) 555 12 34 56</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="text-2xl">📧</span>
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p className="text-purple-100">contact@saha-event.dz</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-purple-400 flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition">📱</div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition">📸</div>
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/20 transition">💼</div>
              </div>
            </div>

            <div className="bg-accent/10 rounded-3xl p-8 border border-accent/20">
              <h3 className="font-bold text-gray-800 mb-2">Horaires d'ouverture</h3>
              <p className="text-gray-600 text-sm">Dimanche - Jeudi : 09:00 - 18:00</p>
              <p className="text-gray-600 text-sm">Samedi : 10:00 - 16:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
