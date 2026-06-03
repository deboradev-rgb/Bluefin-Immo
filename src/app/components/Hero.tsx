import { Search, MapPin, Calendar, Users, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface HeroProps {
  onSearch?: (query?: string) => void;
  onNavigate?: (path?: string, params?: URLSearchParams) => void;
}

// Liste des destinations
const destinationsList = [
  "Cotonou", "Porto-Novo", "Abomey-Calavi", "Parakou", "Abomey", "Ouidah", "Grand-Popo", "Dassa-Zoumè",
  "Natitingou", "Lokossa", "Bohicon", "Kandi", "Malanville", "Dogbo", "Savalou", "Pobè", "Sakété",
  "Allada", "Ganvié", "Fidjrossè", "Haie Vive", "Akpakpa", "Menontin", "Patte d'Oie", "Ganhi", "Cocotiers"
];

// Images du carrousel - immeubles modernes
const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&h=800&fit=crop",
    alt: "Immeuble moderne avec piscine"
  },
  {
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=800&fit=crop",
    alt: "Gratte-ciel et immeubles de bureaux"
  },
  {
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&h=800&fit=crop",
    alt: "Immeuble résidentiel de luxe"
  },
  {
    url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1920&h=800&fit=crop",
    alt: "Complexe immobilier moderne"
  }
];

export function Hero({ onSearch, onNavigate }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCounts, setGuestCounts] = useState({ adults: 1, children: 0, babies: 0, pets: 0 });
  const [activeTab, setActiveTab] = useState<"destination" | "dates" | "guests" | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const destinationRef = useRef<HTMLDivElement>(null);
  const datesRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  // Fonction pour le carrousel automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fermer les popups au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        if (activeTab === "destination") setActiveTab(null);
      }
      if (datesRef.current && !datesRef.current.contains(event.target as Node)) {
        if (activeTab === "dates") setActiveTab(null);
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target as Node)) {
        if (activeTab === "guests") setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeTab]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const guestLabel = () => {
    const totalGuests = guestCounts.adults + guestCounts.children;
    const parts = [];
    if (totalGuests > 0) parts.push(`${totalGuests} voyageur${totalGuests > 1 ? 's' : ''}`);
    if (guestCounts.babies > 0) parts.push(`${guestCounts.babies} bébé${guestCounts.babies > 1 ? 's' : ''}`);
    if (guestCounts.pets > 0) parts.push(`${guestCounts.pets} animal${guestCounts.pets > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(" · ") : "Ajouter des voyageurs";
  };

  const dateLabel = () => {
    if (checkIn && checkOut) {
      return `${new Date(checkIn).toLocaleDateString('fr-BJ', { day: 'numeric', month: 'short' })} - ${new Date(checkOut).toLocaleDateString('fr-BJ', { day: 'numeric', month: 'short' })}`;
    }
    return "Ajouter des dates";
  };

  // Fonctions calendrier
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const firstDayOfWeek = firstDay.getDay();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    for (let i = startOffset; i > 0; i--) {
      const prevDate = new Date(year, month, -i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    return days;
  };

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const isDateSelected = (date: Date) => {
    if (!checkIn && !checkOut) return false;
    const dateStr = date.toDateString();
    if (checkIn && dateStr === new Date(checkIn).toDateString()) return true;
    if (checkOut && dateStr === new Date(checkOut).toDateString()) return true;
    return false;
  };

  const isInRange = (date: Date) => {
    if (!checkIn || !checkOut) return false;
    const dateTime = date.getTime();
    const checkInTime = new Date(checkIn).getTime();
    const checkOutTime = new Date(checkOut).getTime();
    return dateTime > checkInTime && dateTime < checkOutTime;
  };

  const handleDateSelect = (date: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date.toISOString().split('T')[0]);
      setCheckOut("");
    } else if (checkIn && !checkOut) {
      if (date < new Date(checkIn)) {
        setCheckOut(checkIn);
        setCheckIn(date.toISOString().split('T')[0]);
      } else {
        setCheckOut(date.toISOString().split('T')[0]);
      }
    }
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  const days = getDaysInMonth(currentMonth);

  // Fonction de recherche
  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (destination) searchParams.set('destination', destination);
    if (checkIn) searchParams.set('checkIn', checkIn);
    if (checkOut) searchParams.set('checkOut', checkOut);
    
    const totalGuests = guestCounts.adults + guestCounts.children;
    if (totalGuests > 0) searchParams.set('guests', totalGuests.toString());
    if (guestCounts.babies > 0) searchParams.set('babies', guestCounts.babies.toString());
    if (guestCounts.pets > 0) searchParams.set('pets', guestCounts.pets.toString());
    
    if (onNavigate) {
      onNavigate('/s/logements', searchParams);
    }
    
    setActiveTab(null);
    setShowMobileSearch(false);
    onSearch?.(destination || undefined);
  };

  return (
    <div className="relative overflow-hidden" style={{ minHeight: 'clamp(300px, 45vw, 500px)' }}>
      {/* Carrousel d'images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f2940]/40 via-[#0f2940]/50 to-[#0f2940]/85"></div>
        </div>
      ))}

      {/* Boutons de navigation du carrousel */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Indicateurs du carrousel */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`transition-all duration-300 ${
              index === currentImageIndex
                ? 'w-6 h-1.5 bg-[#00c9a7] rounded-full'
                : 'w-1.5 h-1.5 bg-white/50 rounded-full hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12" style={{ minHeight: 'clamp(300px, 45vw, 500px)' }}>
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 lg:mb-3 leading-tight">
            Trouvez votre hébergement<br className="hidden sm:block" /> idéal au Bénin
          </h1>
          <p className="text-white/85 text-sm sm:text-base lg:text-lg">
            Appartements, villas, hôtels — partout au Bénin
          </p>
        </div>

        {/* Barre de recherche Desktop - Entièrement en dégradé */}
        <div className="hidden lg:block w-full max-w-4xl" ref={searchRef}>
          <div className="bg-gradient-to-r from-[#00c9a7] to-[#0f2940] shadow-2xl">
            <div className="flex items-center">
              {/* Destination */}
              <div className="flex-1 relative" ref={destinationRef}>
                <button
                  onClick={() => setActiveTab(activeTab === "destination" ? null : "destination")}
                  className="w-full text-left px-5 py-4 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-xs font-semibold text-white/80 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    DESTINATION
                  </div>
                  <div className="text-white font-medium">
                    {destination || "Où allez-vous ?"}
                  </div>
                </button>
                {activeTab === "destination" && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-white shadow-2xl z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-semibold text-[#0f2940]">Choisir une destination</h3>
                        <button onClick={() => setActiveTab(null)} className="p-1 rounded-full hover:bg-gray-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher une ville..."
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                      <div className="mt-3 space-y-1 max-h-80 overflow-y-auto">
                        {destinationsList.filter(place => 
                          place.toLowerCase().includes(destination.toLowerCase())
                        ).map((place) => (
                          <button
                            key={place}
                            onClick={() => { setDestination(place); setActiveTab(null); }}
                            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium text-[#0f2940]">{place}</div>
                            <div className="text-xs text-gray-500">Bénin</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-10 bg-white/30"></div>

              {/* Dates */}
              <div className="flex-1 relative" ref={datesRef}>
                <button
                  onClick={() => setActiveTab(activeTab === "dates" ? null : "dates")}
                  className="w-full text-left px-5 py-4 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-xs font-semibold text-white/80 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    DATES
                  </div>
                  <div className="text-white font-medium">
                    {dateLabel()}
                  </div>
                </button>
                {activeTab === "dates" && (
                  <div className="absolute top-full left-0 mt-2 w-[640px] bg-white shadow-2xl z-50">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-semibold text-[#0f2940]">Sélectionnez vos dates</h3>
                        <button onClick={() => setActiveTab(null)} className="p-1 rounded-full hover:bg-gray-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-full hover:bg-gray-100">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-sm text-[#0f2940]">
                          {currentMonth.toLocaleDateString('fr-BJ', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-1.5 rounded-full hover:bg-gray-100">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map(day => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">{day}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => {
                          const isSelected = isDateSelected(day.date);
                          const inRange = isInRange(day.date);
                          const isToday = day.date.toDateString() === new Date().toDateString();
                          return (
                            <button
                              key={index}
                              onClick={() => handleDateSelect(day.date)}
                              disabled={!day.isCurrentMonth}
                              className={`relative aspect-square rounded-full text-sm transition-all
                                ${!day.isCurrentMonth && 'text-gray-300 cursor-not-allowed'}
                                ${isSelected && 'bg-[#00c9a7] text-white hover:bg-[#00b892]'}
                                ${inRange && !isSelected && 'bg-[#00c9a7]/10'}
                                ${isToday && !isSelected && 'border border-[#00c9a7]'}
                                ${!isSelected && !inRange && day.isCurrentMonth && 'hover:bg-gray-100 text-[#0f2940]'}`}
                            >
                              {day.date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                        <button onClick={() => setActiveTab(null)} className="px-4 py-1.5 text-sm bg-[#00c9a7] text-white font-semibold">
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-10 bg-white/30"></div>

              {/* Voyageurs */}
              <div className="flex-1 relative" ref={guestsRef}>
                <button
                  onClick={() => setActiveTab(activeTab === "guests" ? null : "guests")}
                  className="w-full text-left px-5 py-4 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-xs font-semibold text-white/80 mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    VOYAGEURS
                  </div>
                  <div className="text-white font-medium truncate">
                    {guestLabel()}
                  </div>
                </button>
                {activeTab === "guests" && (
                  <div className="absolute top-full right-0 mt-2 w-96 bg-white shadow-2xl z-50">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-semibold text-[#0f2940]">Voyageurs</h3>
                        <button onClick={() => setActiveTab(null)} className="p-1 rounded-full hover:bg-gray-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-5">
                        {[
                          { label: "Adultes", description: "13 ans et plus", key: "adults" },
                          { label: "Enfants", description: "De 2 à 12 ans", key: "children" },
                          { label: "Bébés", description: "Moins de 2 ans", key: "babies" },
                          { label: "Animaux domestiques", description: "Vous voyagez avec un animal ?", key: "pets" },
                        ].map(({ label, description, key }) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-sm text-[#0f2940]">{label}</p>
                              <p className="text-xs text-gray-500">{description}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => setGuestCounts(prev => ({ ...prev, [key]: Math.max(0, (prev[key as keyof typeof prev] as number) - 1) }))} 
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00c9a7]"
                              >
                                -
                              </button>
                              <span className="w-5 text-center text-sm text-[#0f2940]">{guestCounts[key as keyof typeof guestCounts]}</span>
                              <button 
                                onClick={() => setGuestCounts(prev => ({ ...prev, [key]: (prev[key as keyof typeof prev] as number) + 1 }))} 
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00c9a7]"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 pt-3 border-t border-gray-200">
                        <button 
                          onClick={() => setActiveTab(null)} 
                          className="w-full bg-[#00c9a7] text-white py-2 font-semibold text-sm"
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton recherche */}
              <div className="px-3 py-3">
                <button 
                  onClick={handleSearch}
                  className="bg-white text-[#0f2940] px-6 py-3 hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  style={{ minWidth: '120px' }}
                >
                  <Search className="w-5 h-5" />
                  <span>Rechercher</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile search panel */}
        <div className="lg:hidden w-full max-w-sm">
          {!showMobileSearch ? (
            <button
              onClick={() => setShowMobileSearch(true)}
              className="w-full bg-gradient-to-r from-[#00c9a7] to-[#0f2940] shadow-2xl p-4 flex items-center justify-between gap-3 hover:opacity-90 transition-all"
            >
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-white" />
                <span className="text-white font-medium truncate">
                  {destination || "Rechercher"}
                </span>
              </div>
              {(destination || checkIn || guestCounts.adults > 1) && (
                <div className="text-xs text-white font-medium bg-white/20 px-2 py-1">
                  {guestCounts.adults + guestCounts.children} pers.
                </div>
              )}
            </button>
          ) : (
            <div className="bg-white shadow-2xl p-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#0f2940]">Rechercher</h3>
                <button onClick={() => setShowMobileSearch(false)} className="p-1 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="border border-gray-200 p-3">
                <div className="text-xs font-semibold text-[#00c9a7] mb-1">DESTINATION</div>
                <input
                  type="text"
                  placeholder="Où allez-vous ?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-[#0f2940] outline-none text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-gray-200 p-3">
                  <div className="text-xs font-semibold text-[#00c9a7] mb-1">ARRIVÉE</div>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-[#0f2940] outline-none text-sm"
                  />
                </div>
                <div className="border border-gray-200 p-3">
                  <div className="text-xs font-semibold text-[#00c9a7] mb-1">DÉPART</div>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-[#0f2940] outline-none text-sm"
                  />
                </div>
              </div>
              
              <div className="border border-gray-200 p-3">
                <div className="text-xs font-semibold text-[#00c9a7] mb-2">VOYAGEURS</div>
                <div className="space-y-3">
                  {[
                    { label: "Adultes", key: "adults" },
                    { label: "Enfants", key: "children" },
                    { label: "Bébés", key: "babies" },
                    { label: "Animaux", key: "pets" },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-[#0f2940]">{label}</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setGuestCounts(prev => ({ ...prev, [key]: Math.max(0, (prev[key as keyof typeof prev] as number) - 1) }))} 
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-[#0f2940]">{guestCounts[key as keyof typeof guestCounts]}</span>
                        <button 
                          onClick={() => setGuestCounts(prev => ({ ...prev, [key]: (prev[key as keyof typeof prev] as number) + 1 }))} 
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-[#00c9a7] to-[#0f2940] text-white py-3 font-semibold flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Rechercher
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}