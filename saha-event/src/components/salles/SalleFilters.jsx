import React from 'react';
import { FaSliders, FaXmark } from 'react-icons/fa6';
import FieldUI from '../ui/FieldUI'

const WILAYAS = [
  "01 Adrar", "02 Chlef", "03 Laghouat", "04 Oum El Bouaghi", "05 Batna", "06 Béjaïa", "07 Biskra", "08 Béchar",
  "09 Blida", "10 Bouira", "11 Tamanrasset", "12 Tébessa", "13 Tlemcen", "14 Tiaret", "15 Tizi Ouzou", "16 Alger",
  "17 Djelfa", "18 Jijel", "19 Sétif", "20 Saïda", "21 Skikda", "22 Sidi Bel Abbès", "23 Annaba", "24 Guelma",
  "25 Constantine", "26 Médéa", "27 Mostaganem", "28 M'Sila", "29 Mascara", "30 Ouargla", "31 Oran", "32 El Bayadh",
  "33 Illizi", "34 Bordj Bou Arreridj", "35 Boumerdès", "36 El Tarf", "37 Tindouf", "38 Tissemsilt", "39 El Oued",
  "40 Khenchela", "41 Souk Ahras", "42 Tipaza", "43 Mila", "44 Aïn Defla", "45 Naâma", "46 Aïn Témouchent", "47 Ghardaïa",
  "48 Relizane", "49 El M'Ghair", "50 El Meniaa", "51 Ouled Djellal", "52 Bordj Baji Mokhtar", "53 Béni Abbès",
  "54 Timimoun", "55 Touggourt", "56 Djanet", "57 In Salah", "58 In Guezzam"
];

const AMENITIES = ["WiFi", "Parking", "Climatisation", "Catering", "Scène", "Sonorisation"];
const EVENT_TYPES = ["Mariage", "Anniversaire", "Conférence", "Soirée", "Autre"];

const SalleFilters = ({ filters, setFilters, onApply, onReset, isOpen, onClose }) => {
  return (
    <div className={`
      fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-0 transition-all duration-300
      ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto'}
    `}>
      {/* Mobile Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/80 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      ></div>

      {/* Filter Panel */}
      <div className="relative w-full max-w-xs h-full lg:h-auto bg-primary lg:bg-transparent overflow-y-auto lg:overflow-visible">
        <div className="glass-card-lg p-6 sm:p-8 lg:sticky lg:top-24 shadow-2xl shadow-primary-mid/20 border border-white/10 h-full lg:h-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-text-light flex items-center">
              <FaSliders className="mr-3 text-accent" /> Filtres
            </h2>
            <button 
              onClick={onClose}
              className="lg:hidden text-text-light/60 hover:text-accent p-2"
            >
              <FaXmark size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Wilaya Filter */}
            <div>
              <FieldUI
                label="Wilaya"
                type="select"
                value={filters.wilaya}
                onChange={(e) => setFilters({...filters, wilaya: e.target.value})}
                options={[{value: '', label: 'Toutes'}, ...WILAYAS]}
              />
            </div>

            {/* Event Type */}
            <div>
              <FieldUI
                label="Type d'événement"
                type="select"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                options={[{value: '', label: 'Tous'}, ...EVENT_TYPES]}
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-text-light/80 mb-2">Budget (DA)</label>
              <div className="flex gap-2">
                <FieldUI type="number" placeholder="Min" className="w-1/2" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} />
                <FieldUI type="number" placeholder="Max" className="w-1/2" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <FieldUI label="Capacité Min." type="number" placeholder="Ex: 200" value={filters.capacity} onChange={(e) => setFilters({...filters, capacity: e.target.value})} />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-text-light/80 mb-3">Équipements</label>
              <div className="grid grid-cols-1 gap-2">
                {AMENITIES.map(amenity => (
                  <label key={amenity} className="flex items-center text-sm text-text-light/70 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="mr-2 rounded border-white/20 text-accent bg-white/5 focus:ring-accent focus:ring-offset-0 transition-all" 
                    />
                    <span className="group-hover:text-accent transition-colors">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button 
                onClick={() => {
                  onApply();
                  if (onClose) onClose();
                }}
                className="btn-gradient w-full py-3"
              >
                Appliquer
              </button>
              <button 
                onClick={onReset}
                className="w-full py-2 text-sm font-medium text-text-light/50 hover:text-accent transition-colors"
              >
                Réinitialiser tout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalleFilters;
