import { useState } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'

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

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(searchParams)
    }
  }

  // Hero variant (home page) - full width, large spacing
  if (variant === "hero") {
    return (
      <div className="glass-card-lg max-w-5xl mx-auto p-6 sm:p-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* WILAYA */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-light/60 uppercase mb-2 ml-1">Wilaya</label>
            <select 
              className="input-glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-light placeholder-text-light/40 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition-all duration-300 hover:border-white/20 appearance-none cursor-pointer"
              style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23f3e8ff%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '12px', paddingRight: '2.5rem'}}
              value={searchParams.wilaya}
              onChange={(e) => setSearchParams({...searchParams, wilaya: e.target.value})}
              required
            >
              <option value="" className="bg-primary text-text-light">Sélectionner...</option>
              {WILAYAS.map(w => <option key={w} value={w} className="bg-primary text-text-light">{w}</option>)}
            </select>
          </div>

          {/* TYPE */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-light/60 uppercase mb-2 ml-1">Événement</label>
            <select 
              className="input-glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-light placeholder-text-light/40 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition-all duration-300 hover:border-white/20 appearance-none cursor-pointer"
              style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23f3e8ff%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '12px', paddingRight: '2.5rem'}}
              value={searchParams.type}
              onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
              required
            >
              <option value="" className="bg-primary text-text-light">Type...</option>
              {EVENT_TYPES.map(t => <option key={t} value={t} className="bg-primary text-text-light">{t}</option>)}
            </select>
          </div>

          {/* DATE */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-light/60 uppercase mb-2 ml-1">Date</label>
            <input 
              type="date"
              className="input-glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-light placeholder-text-light/40 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition-all duration-300 hover:border-white/20"
              value={searchParams.date}
              onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
            />
          </div>

          {/* INVITÉS */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-text-light/60 uppercase mb-2 ml-1">Invités</label>
            <input 
              type="number"
              placeholder="Nombre"
              className="input-glass bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-light placeholder-text-light/40 focus:border-accent focus:ring-2 focus:ring-accent/30 outline-none transition-all duration-300 hover:border-white/20"
              value={searchParams.guests}
              onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
            />
          </div>

          {/* RECHERCHER BUTTON */}
          <button 
            type="submit"
            className="btn-gold h-12 sm:mt-6 flex items-center justify-center gap-2 font-bold uppercase text-primary rounded-xl shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <FaMagnifyingGlass size={16} />
            Rechercher
          </button>
        </form>
      </div>
    )
  }

  // Compact variant (filter sidebar)
  if (variant === "compact") {
    return (
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-light/80 mb-2">Wilaya</label>
          <select 
            className="input-glass w-full appearance-none cursor-pointer"
            style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23f3e8ff%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '12px', paddingRight: '2.5rem'}}
            value={searchParams.wilaya}
            onChange={(e) => setSearchParams({...searchParams, wilaya: e.target.value})}
          >
            <option value="" className="bg-primary text-text-light">Toutes</option>
            {WILAYAS.map(w => <option key={w} value={w} className="bg-primary text-text-light">{w}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-light/80 mb-2">Type d'événement</label>
          <select 
            className="input-glass w-full appearance-none cursor-pointer"
            style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23f3e8ff%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '12px', paddingRight: '2.5rem'}}
            value={searchParams.type}
            onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
          >
            <option value="" className="bg-primary text-text-light">Tous</option>
            {EVENT_TYPES.map(t => <option key={t} value={t} className="bg-primary text-text-light">{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-light/80 mb-2">Date</label>
          <input 
            type="date"
            className="input-glass w-full"
            value={searchParams.date}
            onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-light/80 mb-2">Nombre d'invités</label>
          <input 
            type="number"
            placeholder="Ex: 100"
            className="input-glass w-full"
            value={searchParams.guests}
            onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          className="btn-gradient w-full py-3 font-bold uppercase"
        >
          Rechercher
        </button>
      </form>
    )
  }

  // Inline variant (for pages like reservation)
  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-text-light/80 mb-2">Wilaya</label>
          <select 
            className="input-glass w-full appearance-none cursor-pointer"
            style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23f3e8ff%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '12px', paddingRight: '2.5rem'}}
            value={searchParams.wilaya}
            onChange={(e) => setSearchParams({...searchParams, wilaya: e.target.value})}
          >
            <option value="" className="bg-primary text-text-light">Sélectionner</option>
            {WILAYAS.map(w => <option key={w} value={w} className="bg-primary text-text-light">{w}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-light/80 mb-2">Type</label>
          <select 
            className="input-glass w-full appearance-none cursor-pointer"
            style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22%3E%3Cpath fill=%22%23f3e8ff%22 d=%22M1 1l5 5 5-5%22/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '12px', paddingRight: '2.5rem'}}
            value={searchParams.type}
            onChange={(e) => setSearchParams({...searchParams, type: e.target.value})}
          >
            <option value="" className="bg-primary text-text-light">Sélectionner</option>
            {EVENT_TYPES.map(t => <option key={t} value={t} className="bg-primary text-text-light">{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-text-light/80 mb-2">Date</label>
          <input 
            type="date"
            className="input-glass w-full"
            value={searchParams.date}
            onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-light/80 mb-2">Invités</label>
          <input 
            type="number"
            placeholder="Nombre"
            className="input-glass w-full"
            value={searchParams.guests}
            onChange={(e) => setSearchParams({...searchParams, guests: e.target.value})}
          />
        </div>
      </div>

      <button 
        type="submit"
        className="btn-gold w-full py-3 font-bold uppercase flex items-center justify-center gap-2"
      >
        <FaMagnifyingGlass size={16} />
        Rechercher
      </button>
    </form>
  )
}
