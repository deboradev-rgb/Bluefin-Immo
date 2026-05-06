import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useState } from 'react';

interface HeroProps {
  onSearch?: () => void;
}

export function Hero({ onSearch }: HeroProps) {
  const [destination, setDestination] = useState('');

  return (
    <div className="relative overflow-hidden" style={{ minHeight: 'clamp(340px, 55vw, 600px)' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f2940]/20 via-[#0f2940]/50 to-[#0f2940]/80 z-10"></div>
      <img
        src="https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1920&h=900&fit=crop&auto=format"
        alt="Plage de Cotonou, Bénin"
        className="w-full h-full object-cover absolute inset-0"
      />

      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 py-12 lg:py-20" style={{ minHeight: 'clamp(340px, 55vw, 600px)' }}>
        <div className="text-center mb-6 lg:mb-10">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-5xl font-bold mb-2 lg:mb-4 leading-tight">
            Trouvez votre hébergement<br className="hidden sm:block" /> idéal au Bénin
          </h1>
          <p className="text-white/80 text-sm sm:text-base lg:text-lg">
            Appartements, villas, hôtels — partout au Bénin
          </p>
        </div>

        {/* Desktop search panel */}
        <div className="hidden lg:block bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 border-r border-[#e2f5f2] pr-4">
              <label className="text-xs font-medium text-[#6b7280] mb-2 block">Destination</label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00c9a7] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Cotonou, Bénin"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-[#0f2940] font-medium outline-none bg-transparent placeholder:text-[#9ca3af]"
                />
              </div>
            </div>
            <div className="col-span-2 border-r border-[#e2f5f2] pr-4">
              <label className="text-xs font-medium text-[#6b7280] mb-2 block">Arrivée — Départ</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00c9a7] flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Ajouter des dates"
                  className="w-full text-[#0f2940] font-medium outline-none bg-transparent placeholder:text-[#9ca3af]"
                />
              </div>
            </div>
            <div className="col-span-1 flex items-end">
              <div className="w-full">
                <label className="text-xs font-medium text-[#6b7280] mb-2 block">Voyageurs</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#00c9a7]" />
                    <span className="text-[#0f2940] font-medium">2 voyageurs</span>
                  </div>
                  <button
                    onClick={onSearch}
                    className="bg-[#00c9a7] text-white p-3 rounded-full hover:bg-[#00b396] transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile search panel */}
        <div className="lg:hidden bg-white rounded-2xl shadow-2xl p-4 w-full max-w-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3 border border-[#e2f5f2] rounded-xl px-3 py-3">
              <MapPin className="w-4 h-4 text-[#00c9a7] flex-shrink-0" />
              <input
                type="text"
                placeholder="Où allez-vous ?"
                className="flex-1 text-sm text-[#0f2940] outline-none bg-transparent placeholder:text-[#9ca3af]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 border border-[#e2f5f2] rounded-xl px-3 py-3">
                <Calendar className="w-4 h-4 text-[#00c9a7] flex-shrink-0" />
                <span className="text-xs text-[#9ca3af]">Arrivée</span>
              </div>
              <div className="flex items-center gap-2 border border-[#e2f5f2] rounded-xl px-3 py-3">
                <Calendar className="w-4 h-4 text-[#00c9a7] flex-shrink-0" />
                <span className="text-xs text-[#9ca3af]">Départ</span>
              </div>
            </div>
            <button
              onClick={onSearch}
              className="w-full bg-[#00c9a7] text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#00b396] transition-colors"
            >
              <Search className="w-4 h-4" />
              Rechercher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
