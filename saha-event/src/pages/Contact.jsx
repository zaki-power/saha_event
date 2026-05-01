import { useState } from 'react'
import { FaMapPin, FaPhone, FaEnvelope, FaMobile, FaImage, FaBriefcase } from 'react-icons/fa6'
import { HiArrowRight } from 'react-icons/hi2'

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
    <div className="min-h-screen bg-primary section-padding">
      <div className="max-w-7xl mx-auto container-custom">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-text-light">
            <span className="gradient-text">Contactez-nous</span>
          </h1>
          <p className="text-lg text-text-light/70 max-w-2xl mx-auto">
            Une question ? Un besoin particulier pour votre événement ? Notre équipe est là pour vous accompagner.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 glass-card-lg border border-primary-mid/20 p-8 animate-fade-in-up">
            {submitted && (
              <div className="mb-6 glass-card border-l-4 border-green-400 p-4 text-green-300 bg-gradient-to-r from-green-500/10 to-transparent animate-fade-in-up">
                Merci ! Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-text-light mb-2">Nom complet</label>
                  <input
                    type="text"
                    required
                    className="input-glass w-full px-4 py-3 rounded-xl border border-primary-mid/30 bg-primary-mid/10 text-text-light placeholder-text-light/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                    placeholder="Amine Benali"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text-light mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="input-glass w-full px-4 py-3 rounded-xl border border-primary-mid/30 bg-primary-mid/10 text-text-light placeholder-text-light/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-light mb-2">Sujet</label>
                <input
                  type="text"
                  required
                  className="input-glass w-full px-4 py-3 rounded-xl border border-primary-mid/30 bg-primary-mid/10 text-text-light placeholder-text-light/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  placeholder="Ex: Demande d'informations"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-light mb-2">Message</label>
                <textarea
                  required
                  rows="5"
                  className="input-glass w-full px-4 py-3 rounded-xl border border-primary-mid/30 bg-primary-mid/10 text-text-light placeholder-text-light/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition resize-none"
                  placeholder="Comment pouvons-nous vous aider ?"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto btn-gold text-primary font-bold py-4 px-10 rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition transform hover:scale-105 active:scale-95 group inline-flex items-center gap-2 justify-center md:justify-start"
              >
                Envoyer le message
                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-1 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Main Info Card */}
            <div className="glass-card-lg border border-primary-mid/20 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl group-hover:opacity-10 transition-opacity">
                 <FaMapPin />
               </div>
              <h2 className="text-2xl font-black mb-8 text-text-light">
                <span className="gradient-text">Informations</span>
              </h2>
              
              <div className="space-y-6">
                 <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-primary-mid/20 transition">
                   <FaMapPin className="text-2xl mt-1 flex-shrink-0 text-accent" />
                   <div>
                     <h3 className="font-bold text-text-light mb-1">Adresse</h3>
                     <p className="text-text-light/60">Cité 1200 Logements, Alger, Algérie</p>
                   </div>
                 </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-primary-mid/20 transition">
                  <FaPhone className="text-2xl mt-1 flex-shrink-0 text-accent" />
                  <div>
                    <h3 className="font-bold text-text-light mb-1">Téléphone</h3>
                    <p className="text-text-light/60">+213 (0) 555 12 34 56</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-primary-mid/20 transition">
                  <FaEnvelope className="text-2xl mt-1 flex-shrink-0 text-accent" />
                  <div>
                    <h3 className="font-bold text-text-light mb-1">Email</h3>
                    <p className="text-text-light/60">contact@saha-event.dz</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-primary-mid/30 flex space-x-4">
                 <div className="w-10 h-10 bg-gradient-to-br from-accent-pink/20 to-accent/20 rounded-lg flex items-center justify-center cursor-pointer hover:from-accent-pink/40 hover:to-accent/40 transition group/social text-accent hover:text-accent-pink">
                   <FaMobile className="group-hover/social:scale-125 transition-transform" />
                 </div>
                 <div className="w-10 h-10 bg-gradient-to-br from-accent-pink/20 to-accent/20 rounded-lg flex items-center justify-center cursor-pointer hover:from-accent-pink/40 hover:to-accent/40 transition group/social text-accent hover:text-accent-pink">
                   <FaImage className="group-hover/social:scale-125 transition-transform" />
                 </div>
                 <div className="w-10 h-10 bg-gradient-to-br from-accent-pink/20 to-accent/20 rounded-lg flex items-center justify-center cursor-pointer hover:from-accent-pink/40 hover:to-accent/40 transition group/social text-accent hover:text-accent-pink">
                   <FaBriefcase className="group-hover/social:scale-125 transition-transform" />
                 </div>
               </div>
            </div>

            {/* Hours Card */}
            <div className="glass-card border border-accent/30 p-8 hover:border-accent/60 transition rounded-2xl">
              <h3 className="font-black text-text-light mb-4 text-lg">Horaires d'ouverture</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-accent/20">
                  <span className="text-text-light/80 font-bold">Dimanche - Jeudi</span>
                  <span className="text-accent font-black">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-light/80 font-bold">Samedi</span>
                  <span className="text-accent-pink font-black">10:00 - 16:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
