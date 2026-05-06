import { useState } from 'react';
import { SlidersHorizontal, MapPin, ChevronLeft, Map } from 'lucide-react';

const filters = [
  'Type de bien',
  'Prix en XOF',
  'Équipements',
  'Réservation instantanée',
  'Mobile Money',
  'Hôte vérifié',
];

const listings = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop&auto=format',
    title: 'Appartement moderne · Haie Vive',
    type: 'Appartement entier',
    rating: 4.87,
    reviewCount: 124,
    price: 45000,
    priceEur: 69,
    badge: 'certified' as const,
    distance: '2.5 km du centre',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop&auto=format',
    title: 'Villa spacieuse · Fidjrossè',
    type: 'Villa entière',
    rating: 4.92,
    reviewCount: 89,
    price: 85000,
    priceEur: 130,
    badge: 'superhost' as const,
    distance: '4.1 km du centre',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=500&fit=crop&auto=format',
    title: 'Studio meublé · Cocotiers',
    type: 'Studio privé',
    rating: 4.75,
    reviewCount: 56,
    price: 32000,
    priceEur: 49,
    distance: '1.8 km du centre',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop&auto=format',
    title: 'Chambre confort · Cadjèhoun',
    type: 'Chambre privée',
    rating: 4.68,
    reviewCount: 43,
    price: 18000,
    priceEur: 27,
    distance: '0.9 km du centre',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop&auto=format',
    title: 'Penthouse vue mer · Fidjrossè',
    type: 'Appartement entier',
    rating: 4.95,
    reviewCount: 211,
    price: 120000,
    priceEur: 183,
    badge: 'superhost' as const,
    distance: '5.2 km du centre',
  },
];

interface SearchResultsProps {
  onSelectListing?: () => void;
  onBack?: () => void;
}

export function SearchResults({ onSelectListing, onBack }: SearchResultsProps) {
  const [activeFilter, setActiveFilter] = useState(0);
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="bg-white min-h-screen">
      {/* Filter bar */}
      <div className="border-b border-[#e2f5f2] sticky top-[57px] lg:top-[73px] bg-white z-40 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 lg:gap-3">
          {/* Back button on mobile */}
          <button
            onClick={onBack}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-[#e2f5f2] hover:border-[#00c9a7] transition-colors lg:hidden"
          >
            <ChevronLeft className="w-4 h-4 text-[#0f2940]" />
          </button>

          <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {filters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFilter(idx)}
                className={`flex-shrink-0 px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all ${
                  activeFilter === idx
                    ? 'bg-[#00c9a7] text-white'
                    : 'bg-white border border-[#e2f5f2] text-[#0f2940] hover:border-[#00c9a7]'
                }`}
              >
                {filter}
              </button>
            ))}
            <button className="flex-shrink-0 px-3 lg:px-4 py-2 rounded-full bg-white border border-[#e2f5f2] text-[#0f2940] hover:border-[#00c9a7] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="text-xs lg:text-sm">Filtres</span>
            </button>
          </div>

          {/* Map toggle on mobile */}
          <button
            onClick={() => setShowMap(!showMap)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all lg:hidden ${
              showMap ? 'bg-[#0f2940] text-white border-[#0f2940]' : 'border-[#e2f5f2] text-[#0f2940]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Carte
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex gap-6 lg:gap-8">
          {/* Listings column */}
          <div className={`flex-1 space-y-3 lg:space-y-4 ${showMap ? 'hidden sm:block' : 'block'}`}>
            <div className="mb-4 lg:mb-6">
              <div className="flex items-center gap-3 mb-1">
                <button
                  onClick={onBack}
                  className="hidden lg:flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#0f2940] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Retour
                </button>
                <h2 className="text-lg lg:text-2xl font-bold text-[#0f2940]">
                  Plus de 300 logements à Cotonou
                </h2>
              </div>
              <p className="text-sm text-[#6b7280]">6–9 mai · 2 voyageurs</p>
            </div>

            {listings.map((listing) => (
              <div
                key={listing.id}
                onClick={onSelectListing}
                className="flex gap-3 lg:gap-4 bg-white rounded-xl lg:rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(15,41,64,0.07)] hover:shadow-[0_6px_24px_rgba(15,41,64,0.12)] transition-all cursor-pointer p-3 lg:p-4 border border-transparent hover:border-[#e2f5f2]"
              >
                <div className="relative w-28 sm:w-40 lg:w-60 h-24 sm:h-32 lg:h-40 flex-shrink-0 rounded-xl overflow-hidden bg-[#f4fffe]">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  {listing.badge && (
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium text-white ${
                      listing.badge === 'certified' ? 'bg-[#00c9a7]' : 'bg-[#0f2940]'
                    }`}>
                      {listing.badge === 'certified' ? 'Certifié' : 'Superhost'}
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm lg:text-lg text-[#0f2940] leading-snug line-clamp-2">{listing.title}</h3>
                      <div className="flex items-center gap-1 px-2 py-1 bg-[#00c9a7]/10 rounded-full flex-shrink-0">
                        <span className="text-xs font-medium text-[#0f2940]">★ {listing.rating}</span>
                        <span className="text-xs text-[#6b7280] hidden sm:inline">({listing.reviewCount})</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#6b7280] mb-2">{listing.type}</p>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#6b7280]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{listing.distance} · Près de l'aéroport</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-2 mt-2">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base lg:text-xl font-bold text-[#0f2940]">{listing.price.toLocaleString()}</span>
                        <span className="text-xs text-[#6b7280]">XOF/nuit</span>
                      </div>
                      <span className="text-xs text-[#00c9a7]">≈ {listing.priceEur} €</span>
                    </div>
                    <button className="hidden sm:block text-[#00c9a7] border-2 border-[#00c9a7] px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#00c9a7] hover:text-white transition-colors flex-shrink-0">
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map column — desktop always shown, mobile only when toggled */}
          <div className={`lg:w-[46%] lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)] ${showMap ? 'block w-full' : 'hidden lg:block'}`}>
            <div className="w-full h-[calc(100vh-12rem)] lg:h-full bg-[#f4fffe] rounded-2xl overflow-hidden relative border border-[#e2f5f2]">
              <div className="absolute inset-0 flex items-center justify-center text-[#6b7280]">
                <div className="text-center">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-[#00c9a7]" />
                  <p className="font-semibold text-[#0f2940]">Carte interactive</p>
                  <p className="text-sm">Cotonou, Bénin</p>
                </div>
              </div>
              {/* Price pins on map */}
              {[
                { top: '20%', left: '25%', price: '45K' },
                { top: '35%', right: '20%', price: '32K' },
                { top: '55%', left: '40%', price: '85K' },
                { top: '70%', right: '30%', price: '18K' },
                { top: '15%', right: '35%', price: '120K' },
              ].map((pin, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full px-3 py-1.5 shadow-md flex items-center gap-1.5 text-sm font-semibold text-[#0f2940] cursor-pointer hover:bg-[#00c9a7] hover:text-white transition-colors"
                  style={{ top: pin.top, left: pin.left, right: (pin as { right?: string }).right }}
                  onClick={onSelectListing}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00c9a7]"></div>
                  {pin.price} XOF
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
