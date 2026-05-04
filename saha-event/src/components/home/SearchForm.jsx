import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Calendar as CalendarIcon, Users, ArrowRight, ChevronDown, Check } from 'lucide-react'

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
const AMENITIES = ["WiFi", "Climatisation", "Parking", "Catering", "Scène", "Sonorisation", "Sécurité", "Espace extérieur", "Cuisine équipée"]

export default function SearchForm({ onSubmit, variant = "hero" }) {
  const [searchParams, setSearchParams] = useState({
    q: '',
    wilaya: '',
    type: '',
    date: '',
    guests: '',
    amenities: []
  })

  const [focusedField, setFocusedField] = useState(null)
  const [showAmenities, setShowAmenities] = useState(false)
  const [showWilayas, setShowWilayas] = useState(false)
  const amenitiesRef = useRef(null)
  const wilayasRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (amenitiesRef.current && !amenitiesRef.current.contains(event.target)) {
        setShowAmenities(false)
      }
      if (wilayasRef.current && !wilayasRef.current.contains(event.target)) {
        setShowWilayas(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setShowAmenities(false)
    setShowWilayas(false)
    if (onSubmit) {
      const params = {
        ...searchParams,
        amenities: searchParams.amenities.join(',')
      }
      onSubmit(params)
    }
  }

  const toggleAmenity = (e, amenity) => {
    e.preventDefault()
    e.stopPropagation()
    setSearchParams(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const selectWilaya = (w) => {
    setSearchParams(prev => ({ ...prev, wilaya: w }))
    setShowWilayas(false)
  }

  const InputWrapper = ({ label, icon: Icon, children, fieldName }) => (
    <div className="flex flex-col relative group flex-1 ">
      <label className="text-[10px] font-black text-text-light/40 uppercase tracking-[0.2em] mb-1.5 ml-1 transition-colors group-focus-within:text-accent group-hover:text-text-light/60">
        {label}
      </label>
      <div className={`relative transition-all duration-300 ${focusedField === fieldName || (fieldName === 'amenities' && showAmenities) || (fieldName === 'wilaya' && showWilayas) ? 'scale-[1.01]' : ''}`}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light/30 group-focus-within:text-accent transition-colors pointer-events-none">
          <Icon size={18} />
        </div>
        {children}
      </div>
    </div>
  )

  const selectStyles = "w-full input-glass pl-12 pr-10 py-3.5 appearance-none cursor-pointer hover:bg-white/10 transition-all text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-accent/30"
  const inputStyles = "w-full input-glass pl-12 pr-4 py-3.5 focus:bg-white/10 transition-all text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-accent/30 placeholder:text-text-light/20"

  if (variant === "hero") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card-lg max-w-6xl mx-auto p-2 sm:p-3 shadow-2xl shadow-black/50 border border-white/10 ring-1 ring-white/5 relative z-40"
      >
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch gap-2 lg:gap-0">
          {/* SEARCH */}
          <div className="flex-[1.5] min-w-0 p-1">
            <InputWrapper label="Recherche" icon={Search} fieldName="q">
              <input 
                type="text"
                placeholder="Nom, palais, WiFi..."
                className={inputStyles}
                onFocus={() => setFocusedField('q')}
                onBlur={() => setFocusedField(null)}
                value={searchParams.q}
                onChange={(e) => setSearchParams({...searchParams, q: e.target.value})}
              />
            </InputWrapper>
          </div>

          <div className="hidden lg:flex w-px h-10 bg-white/10 self-center mx-2 shrink-0"></div>

          {/* WILAYA */}
          <div className="flex-1 min-w-0 p-1 relative" ref={wilayasRef}>
            <InputWrapper label="Wilaya" icon={MapPin} fieldName="wilaya">
              <button
                type="button"
                className={`${selectStyles} text-left overflow-hidden whitespace-nowrap ${showWilayas ? 'bg-white/10 border-accent/50' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowWilayas(!showWilayas);
                  setShowAmenities(false);
                }}
              >
                <span className={searchParams.wilaya ? 'text-white' : 'text-text-light/40 font-medium'}>
                  {searchParams.wilaya || "Toutes les wilayas"}
                </span>
              </button>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-light/30">
                <ChevronDown size={14} className={`transition-transform duration-300 ${showWilayas ? 'rotate-180' : ''}`} />
              </div>
            </InputWrapper>

            <AnimatePresence>
              {showWilayas && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-[calc(100%+12px)] left-0 right-0 p-2 bg-primary/95 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] shadow-2xl z-50 max-h-64 overflow-y-auto custom-scrollbar ring-1 ring-white/5"
                >
                  <button
                    type="button"
                    onClick={() => selectWilaya("")}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-text-light/40 hover:bg-white/5 hover:text-white transition-all"
                  >
                    Toutes les wilayas
                  </button>
                  {WILAYAS.map(w => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => selectWilaya(w)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${searchParams.wilaya === w ? 'bg-accent/10 text-accent' : 'text-text-light/60 hover:bg-white/5 hover:text-white'}`}
                    >
                      {w}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:flex w-px h-10 bg-white/10 self-center mx-2 shrink-0"></div>

          {/* COMMODITÉS */}
          <div className="flex-1 min-w-0 p-1 relative" ref={amenitiesRef}>
            <InputWrapper label="Commodités" icon={ArrowRight} fieldName="amenities">
              <button
                type="button"
                className={`${selectStyles} text-left overflow-hidden whitespace-nowrap ${showAmenities ? 'bg-white/10 border-accent/50' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowAmenities(!showAmenities);
                  setShowWilayas(false);
                }}
              >
                {searchParams.amenities.length > 0 
                  ? <span className="text-accent">{searchParams.amenities.length} sélectionnés</span> 
                  : <span className="text-text-light/40 font-medium">Équipements</span>}
              </button>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-light/30">
                <ChevronDown size={14} className={`transition-transform duration-300 ${showAmenities ? 'rotate-180' : ''}`} />
              </div>
            </InputWrapper>
            
            <AnimatePresence>
              {showAmenities && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-[calc(100%+12px)] left-0 right-0 p-3 bg-primary/95 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] shadow-2xl z-50 max-h-72 overflow-y-auto custom-scrollbar ring-1 ring-white/5"
                >
                  <div className="grid grid-cols-1 gap-1">
                    {AMENITIES.map(amenity => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={(e) => toggleAmenity(e, amenity)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl transition-all group ${searchParams.amenities.includes(amenity) ? 'bg-accent/10' : 'hover:bg-white/5'}`}
                      >
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${searchParams.amenities.includes(amenity) ? 'bg-accent border-accent shadow-lg shadow-accent/20' : 'border-white/10 group-hover:border-white/20'}`}>
                          {searchParams.amenities.includes(amenity) && <Check size={12} className="text-primary stroke-[4]" />}
                        </div>
                        <span className={`text-xs font-bold transition-colors ${searchParams.amenities.includes(amenity) ? 'text-white' : 'text-text-light/40 group-hover:text-text-light/70'}`}>{amenity}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:flex w-px h-10 bg-white/10 self-center mx-2 shrink-0"></div>

          {/* TYPE & GUESTS ROW FOR MOBILE */}
          <div className="flex flex-row gap-2 lg:gap-0 lg:flex-[1.5]">
            <div className="flex-1 min-w-0 p-1">
              <InputWrapper label="Type" icon={CalendarIcon} fieldName="type">
                <select 
                  className={selectStyles}
                  value={searchParams.type}
                  onFocus={() => setFocusedField('type')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
                >
                  <option value="" className="bg-primary text-text-light">Tous types</option>
                  {EVENT_TYPES.map(t => <option key={t} value={t} className="bg-primary text-text-light">{t}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-light/30">
                  <ChevronDown size={14} />
                </div>
              </InputWrapper>
            </div>

            <div className="hidden lg:flex w-px h-10 bg-white/10 self-center mx-2 shrink-0"></div>

            <div className="w-28 lg:w-24 p-1">
              <InputWrapper label="Invités" icon={Users} fieldName="guests">
                <input 
                  type="number"
                  placeholder="Min"
                  className={inputStyles}
                  onFocus={() => setFocusedField('guests')}
                  onBlur={() => setFocusedField(null)}
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
                />
              </InputWrapper>
            </div>
          </div>

          <div className="hidden lg:flex w-px h-10 bg-white/10 self-center mx-2 shrink-0"></div>

          {/* SUBMIT */}
          <div className="p-1 flex items-end">
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: '#facc15' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full lg:w-auto px-10 bg-accent text-primary h-[54px] rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest shadow-xl shadow-accent/10 hover:shadow-accent/30 transition-all duration-300"
            >
              <Search size={20} className="stroke-[3]" />
              <span className="inline lg:hidden xl:inline">Chercher</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    )
  }

  // Compact variant (filter sidebar)
  if (variant === "compact") {
    return (
      <form onSubmit={handleSearch} className="space-y-6">
        <InputWrapper label="Wilaya" icon={MapPin} fieldName="wilaya">
          <select 
            className={selectStyles}
            value={searchParams.wilaya}
            onChange={(e) => setSearchParams({...searchParams, wilaya: e.target.value})}
          >
            <option value="" className="bg-primary text-text-light">Toutes</option>
            {WILAYAS.map(w => <option key={w} value={w} className="bg-primary text-text-light">{w}</option>)}
          </select>
        </InputWrapper>

        <InputWrapper label="Nombre d'invités" icon={Users} fieldName="guests">
          <input 
            type="number"
            placeholder="Ex: 100"
            className={inputStyles}
            value={searchParams.guests}
            onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
          />
        </InputWrapper>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn-gradient w-full py-4 font-bold uppercase tracking-widest shadow-xl shadow-primary-mid/20"
        >
          Filtrer les résultats
        </motion.button>
      </form>
    )
  }

  // Inline variant
  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputWrapper label="Wilaya" icon={MapPin} fieldName="wilaya">
          <select 
            className={selectStyles}
            value={searchParams.wilaya}
            onChange={(e) => setSearchParams({...searchParams, wilaya: e.target.value})}
          >
            <option value="" className="bg-primary text-text-light">Sélectionner</option>
            {WILAYAS.map(w => <option key={w} value={w} className="bg-primary text-text-light">{w}</option>)}
          </select>
        </InputWrapper>

        <InputWrapper label="Invités" icon={Users} fieldName="guests">
          <input 
            type="number"
            placeholder="Nombre"
            className={inputStyles}
            value={searchParams.guests}
            onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
          />
        </InputWrapper>
      </div>

      <motion.button 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        className="btn-gold w-full py-4 font-bold uppercase tracking-widest shadow-xl shadow-accent/20"
      >
        Lancer la recherche
      </motion.button>
    </form>
  )
}
