import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar as CalendarIcon, Users, ArrowRight, ChevronDown } from 'lucide-react'

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

export default function SearchForm({ onSubmit, variant = "hero" }) {
  const [searchParams, setSearchParams] = useState({
    wilaya: '',
    type: '',
    date: '',
    guests: ''
  })

  const [focusedField, setFocusedField] = useState(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(searchParams)
    }
  }

  const InputWrapper = ({ label, icon: Icon, children, fieldName }) => (
    <div className="flex flex-col relative group">
      <label className="text-[10px] font-bold text-text-light/50 uppercase tracking-widest mb-1.5 ml-1 transition-colors group-focus-within:text-accent">
        {label}
      </label>
      <div className={`relative transition-all duration-300 ${focusedField === fieldName ? 'scale-[1.02]' : ''}`}>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light/40 group-focus-within:text-accent transition-colors">
          <Icon size={18} />
        </div>
        {children}
      </div>
    </div>
  )

  const selectStyles = "w-full input-glass pl-12 pr-10 py-3.5 appearance-none cursor-pointer hover:bg-white/10"
  const inputStyles = "w-full input-glass pl-12 pr-4 py-3.5 focus:bg-white/10"

  if (variant === "hero") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card-lg max-w-4xl mx-auto p-3 shadow-2xl shadow-black/50 border border-white/10 ring-1 ring-white/5"
      >
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-1 items-stretch">
          {/* WILAYA */}
          <div className="lg:col-span-4 p-1">
            <InputWrapper label="Wilaya" icon={MapPin} fieldName="wilaya">
              <select 
                className={selectStyles}
                value={searchParams.wilaya}
                onFocus={() => setFocusedField('wilaya')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setSearchParams({...searchParams, wilaya: e.target.value})}
              >
                <option value="" className="bg-primary text-text-light">Toutes les Wilayas</option>
                {WILAYAS.map(w => <option key={w} value={w} className="bg-primary text-text-light">{w}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-light/30">
                <ChevronDown size={14} />
              </div>
            </InputWrapper>
          </div>

          <div className="hidden lg:flex w-px h-10 bg-white/10 self-center mx-1"></div>

          {/* TYPE */}
          <div className="lg:col-span-3 p-1">
            <InputWrapper label="Type" icon={CalendarIcon} fieldName="type">
              <select 
                className={selectStyles}
                value={searchParams.type}
                onFocus={() => setFocusedField('type')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
              >
                <option value="" className="bg-primary text-text-light">Tous les types</option>
                {EVENT_TYPES.map(t => <option key={t} value={t} className="bg-primary text-text-light">{t}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-light/30">
                <ChevronDown size={14} />
              </div>
            </InputWrapper>
          </div>

          <div className="hidden lg:flex w-px h-10 bg-white/10 self-center mx-1"></div>

          {/* INVITÉS */}
          <div className="lg:col-span-2 p-1">
            <InputWrapper label="Invités" icon={Users} fieldName="guests">
              <input 
                type="number"
                placeholder="Nombre"
                className={inputStyles}
                onFocus={() => setFocusedField('guests')}
                onBlur={() => setFocusedField(null)}
                value={searchParams.guests}
                onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
              />
            </InputWrapper>
          </div>

          <div className="hidden lg:flex w-px h-10 bg-white/10 self-center mx-1"></div>

          {/* SUBMIT */}
          <div className="lg:col-span-3 p-1 flex items-end">
            <motion.button 
              whileHover={{ scale: 1.02, backgroundColor: '#facc15' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-accent text-primary h-[54px] rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest shadow-xl shadow-accent/10 hover:shadow-accent/30 transition-all duration-300"
            >
              <Search size={20} className="stroke-[3]" />
              <span className="xl:inline">Chercher</span>
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
