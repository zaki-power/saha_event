import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HiArrowLeft, 
  HiPhoto, 
  HiCheckCircle, 
  HiPlusCircle, 
  HiXMark,
  HiMapPin,
  HiUsers,
  HiCurrencyDollar,
  HiClipboardDocumentList
} from 'react-icons/hi2'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import FieldUI from '../components/ui/FieldUI'

const COMMON_AMENITIES = [
  "WiFi", "Climatisation", "Parking", "Catering", "Scène", "Sonorisation", "Sécurité", "Espace extérieur", "Cuisine équipée"
]

const COMMON_EVENT_TYPES = [
  "Mariage", "Anniversaire", "Conférence", "Soirée", "Séminaire", "Fête religieuse", "Exposition"
]

export default function AddSalle() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    price_per_day: '',
    price_per_guest: '',
    capacity: '',
    description: '',
    available: true
  })

  const [images, setImages] = useState([''])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [selectedEventTypes, setSelectedEventTypes] = useState([])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleImageChange = (index, value) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
  }

  const addImageField = () => setImages([...images, ''])
  const removeImageField = (index) => setImages(images.filter((_, i) => i !== index))

  const toggleItem = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return alert("Vous devez être connecté.")

    setLoading(true)
    try {
      const filteredImages = images.filter(img => img.trim() !== '')
      
      const { data, error } = await supabase
        .from('salles')
        .insert([{
          ...formData,
          price_per_day: parseFloat(formData.price_per_day),
          price_per_guest: parseFloat(formData.price_per_guest || 0),
          capacity: parseInt(formData.capacity),
          images: filteredImages,
          amenities: selectedAmenities,
          event_types: selectedEventTypes
        }])
        .select()

      if (error) throw error
      
      setShowSuccess(true)
    } catch (err) {
      console.error('Error adding salle:', err)
      alert("Erreur lors de l'ajout: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card-lg max-w-md w-full p-10 text-center space-y-8 border-accent/20"
        >
          <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto ring-8 ring-accent/5">
            <HiCheckCircle className="text-6xl text-accent animate-bounce" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white mb-3">Salle Publiée !</h2>
            <p className="text-text-light/60 font-medium">Votre établissement est maintenant visible par des milliers de clients potentiels.</p>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate('/admin')}
              className="w-full py-4 bg-accent text-primary rounded-2xl font-black uppercase tracking-widest hover:shadow-lg hover:shadow-accent/20 transition-all"
            >
              Retour au Panel
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-white/5 text-text-light/70 rounded-2xl font-bold hover:bg-white/10 transition-all"
            >
              Ajouter une autre salle
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-text-light/50 hover:text-accent transition-colors mb-6"
          >
            <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Retour</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Ajouter une <span className="gradient-text">Salle de Prestige</span>
          </h1>
          <p className="text-text-light/60 font-medium">Remplissez les détails ci-dessous pour lister votre établissement.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Informations de base */}
          <div className="glass-card-lg p-8 border border-white/10 space-y-6">
            <h2 className="text-lg font-black text-accent uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <HiClipboardDocumentList className="text-xl" /> Informations Générales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FieldUI 
                id="name"
                label="Nom de la salle"
                placeholder="Ex: Palais des Roses"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <FieldUI 
                id="city"
                label="Ville / Wilaya"
                placeholder="Ex: Alger"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FieldUI 
                id="price_per_day"
                label="Prix de Base (Location)"
                type="number"
                placeholder="Ex: 50000"
                value={formData.price_per_day}
                onChange={handleChange}
                required
              />
              <FieldUI 
                id="price_per_guest"
                label="Frais par Invité"
                type="number"
                placeholder="Ex: 200"
                value={formData.price_per_guest}
                onChange={handleChange}
                required
              />
              <FieldUI 
                id="capacity"
                label="Capacité (Personnes)"
                type="number"
                placeholder="Ex: 300"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <FieldUI 
              id="description"
              label="Description"
              type="textarea"
              placeholder="Décrivez votre salle, ses points forts..."
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Section 2: Images (URLs) */}
          <div className="glass-card-lg p-8 border border-white/10">
            <h2 className="text-lg font-black text-accent uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <HiPhoto className="text-xl" /> Galerie Photos (URLs)
            </h2>
            <div className="space-y-4">
              {images.map((img, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="flex-1">
                    <FieldUI 
                      id={`img-${idx}`}
                      placeholder="https://image-url.com/photo.jpg"
                      value={img}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                    />
                  </div>
                  {images.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeImageField(idx)}
                      className="p-4 bg-red-500/10 text-red-400 rounded-2xl hover:bg-red-500/20 transition"
                    >
                      <HiXMark className="text-xl" />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addImageField}
                className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-text-light/50 font-bold hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2"
              >
                <HiPlusCircle className="text-xl" /> Ajouter une autre image
              </button>
            </div>
          </div>

          {/* Section 3: Commodités & Types d'événements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Amenities */}
            <div className="glass-card-lg p-8 border border-white/10">
              <h2 className="text-sm font-black text-accent uppercase tracking-[0.2em] mb-6">Commodités</h2>
              <div className="flex flex-wrap gap-2">
                {COMMON_AMENITIES.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem(item, selectedAmenities, setSelectedAmenities)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedAmenities.includes(item) 
                        ? 'bg-accent text-primary border-accent' 
                        : 'bg-white/5 text-text-light/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Types */}
            <div className="glass-card-lg p-8 border border-white/10">
              <h2 className="text-sm font-black text-accent uppercase tracking-[0.2em] mb-6">Types d'Événements</h2>
              <div className="flex flex-wrap gap-2">
                {COMMON_EVENT_TYPES.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem(item, selectedEventTypes, setSelectedEventTypes)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedEventTypes.includes(item) 
                        ? 'bg-accent text-primary border-accent' 
                        : 'bg-white/5 text-text-light/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            <FieldUI 
              type="submit" 
              disabled={loading}
              className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-lg shadow-2xl transition-all ${
                loading ? 'opacity-50 cursor-not-allowed bg-white/10' : 'bg-gradient-to-r from-accent to-yellow-400 text-primary hover:shadow-accent/40 hover:-translate-y-1'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  Publication en cours...
                </div>
              ) : "Publier l'Annonce"}
            </FieldUI>
          </div>

        </form>
      </div>
    </div>
  )
}
