import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, MapPin, Home, Star, Server, LogIn, Calendar, ChevronLeft, ChevronRight, Users, Plus, Minus } from 'lucide-react';
import type { Route } from '../router';
import Logo from '../assets/Bluefin Immo_01.jpg.jpeg';

const destinationsList = [
  "Abomey", "Abomey-Calavi", "Cotonou", "Porto-Novo", "Parakou", "Ouidah", "Grand-Popo",
  "Natitingou", "Kandi", "Lokossa", "Dogbo", "Bohicon", "Dassa-Zoumè", "Savalou", "Fidjrossè",
  "Haie Vive", "Ganhi", "Akpakpa", "Menontin", "Cadjèhoun", "Jéricho", "Saint-Michel"
];

interface NavbarProps {
  onGoHome: () => void;
  onNavigate?: (route: Route) => void;
  currentPage?: string;
  onSearch?: (searchParams: { destination: string; checkIn: string; checkOut: string; guests: number }) => void;
}

export function Navbar({ onGoHome, onNavigate, currentPage, onSearch }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // États pour la barre de recherche
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [activeTab, setActiveTab] = useState<"destination" | "dates" | "guests" | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const destinationPopupRef = useRef<HTMLDivElement>(null);
  const datesPopupRef = useRef<HTMLDivElement>(null);
  const guestsPopupRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Logement', icon: Home, route: { name: 'home' } as Route },
    { name: 'Expérience', icon: Star, route: { name: 'experience' } as Route },
    { name: 'Service', icon: Server, route: { name: 'services' } as Route },
  ];

  const isActive = (itemName: string) => {
    if (itemName === 'Logement' && currentPage === 'home') return true;
    if (itemName === 'Expérience' && currentPage === 'experience') return true;
    if (itemName === 'Service' && currentPage === 'services') return true;
    return false;
  };

  // Fermer les popups au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeTab === "destination" && destinationPopupRef.current && !destinationPopupRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
      if (activeTab === "dates" && datesPopupRef.current && !datesPopupRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
      if (activeTab === "guests" && guestsPopupRef.current && !guestsPopupRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeTab]);

  const guestLabel = () => {
    const totalGuests = adults + children;
    if (totalGuests > 0) {
      return `${totalGuests} voyageur${totalGuests > 1 ? 's' : ''}`;
    }
    return "Ajouter des voyageurs";
  };

  const dateLabel = () => {
    if (checkIn && checkOut) {
      return `${new Date(checkIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${new Date(checkOut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
    }
    if (checkIn) {
      return `${new Date(checkIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} → ?`;
    }
    return "Quand ?";
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
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return;
    
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
    if (isSearching) return;
    
    setIsSearching(true);
    
    const totalGuests = adults + children;
    
    const searchParams = {
      destination: destination,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: totalGuests > 0 ? totalGuests : 1
    };
    
    console.log('🔍 Recherche en cours:', searchParams);
    
    if (onSearch) {
      onSearch(searchParams);
    }
    
    setActiveTab(null);
    setMobileSearchActive(false);
    
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleMobileSearch = () => {
    if (isSearching) return;
    
    setIsSearching(true);
    
    const totalGuests = adults + children;
    
    const searchParams = {
      destination: destination,
      checkIn: checkIn,
      checkOut: checkOut,
      guests: totalGuests > 0 ? totalGuests : 1
    };
    
    if (onSearch) {
      onSearch(searchParams);
    }
    
    setMobileSearchActive(false);
    
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        
        {/* Première ligne - Logo et navigation */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button onClick={onGoHome} className="flex items-center gap-3 flex-shrink-0 group">
            <img src={Logo} alt="Logo" className="w-10 h-10 lg:w-12 lg:h-12 object-contain rounded-xl shadow-md group-hover:shadow-lg transition-all" />
            <div className="hidden sm:block">
              <div className="font-bold text-lg lg:text-xl text-[#0f2940]">Bluefin-Immo</div>
              <div className="text-xs text-[#00c9a7]">L'hébergement au Bénin</div>
            </div>
          </button>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onNavigate?.(item.route)}
                className={`px-4 py-2 rounded-full transition-all text-sm flex items-center gap-2
                  ${isActive(item.name) 
                    ? 'bg-gradient-to-r from-[#00c9a7] to-[#00b396] text-white shadow-md' 
                    : 'text-[#0f2940] hover:bg-gray-50'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Actions droite */}
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => onNavigate?.({ name: 'become-host' })} className="px-5 py-2 rounded-full bg-[#0f2940] text-white text-sm hover:bg-[#1a3a52] transition">
              Devenir hôte
            </button>
            <button onClick={() => onNavigate?.({ name: 'auth' })} className="px-5 py-2 rounded-full border border-[#00c9a7] text-[#0f2940] text-sm flex items-center gap-2 hover:bg-[#00c9a7]/5 transition">
              <LogIn className="w-4 h-4" />
              S'inscrire
            </button>
          </div>

          {/* Mobile buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <button onClick={() => setMobileSearchActive(true)} className="p-2 rounded-full bg-gray-50 border border-gray-200">
              <Search className="w-5 h-5 text-[#00c9a7]" />
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full border border-gray-200">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Barre de recherche Desktop */}
        <div className="hidden lg:flex justify-center mt-6" ref={searchRef}>
          <div className="bg-white rounded-full shadow-xl border border-gray-200 hover:shadow-2xl transition-all w-full max-w-3xl">
            <div className="flex items-center p-1">
              
              {/* Bouton Destination */}
              <div className="relative flex-[1.3]">
                <button
                  onClick={() => setActiveTab(activeTab === "destination" ? null : "destination")}
                  className={`w-full text-left px-5 py-3 rounded-full transition-all ${activeTab === "destination" ? "bg-gray-50" : "hover:bg-gray-50"}`}
                >
                  <div className="text-xs font-medium text-gray-500">Destination</div>
                  <div className="text-sm text-gray-900 truncate flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#00c9a7]" />
                    {destination || "Rechercher une destination"}
                  </div>
                </button>
                
                {/* Popup Destination */}
                {activeTab === "destination" && (
                  <div ref={destinationPopupRef} className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Où souhaitez-vous aller ?</h3>
                        <button onClick={() => setActiveTab(null)} className="p-1 rounded-full hover:bg-gray-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher une destination au Bénin"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        autoFocus
                      />
                      <div className="mt-4 space-y-1 max-h-64 overflow-y-auto">
                        <div className="text-xs font-semibold text-gray-500 mb-2">Destinations populaires</div>
                        {destinationsList
                          .filter(place => place.toLowerCase().includes(destination.toLowerCase()))
                          .slice(0, 10)
                          .map((place) => (
                            <button
                              key={place}
                              onClick={() => { setDestination(place); setActiveTab(null); }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
                            >
                              {place}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-gray-200"></div>

              {/* Bouton Dates */}
              <div className="relative flex-1">
                <button
                  onClick={() => setActiveTab(activeTab === "dates" ? null : "dates")}
                  className={`w-full text-left px-5 py-3 rounded-full transition-all ${activeTab === "dates" ? "bg-gray-50" : "hover:bg-gray-50"}`}
                >
                  <div className="text-xs font-medium text-gray-500">Dates</div>
                  <div className="text-sm text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00c9a7]" />
                    {dateLabel()}
                  </div>
                </button>
                
                {/* Popup Dates - Calendrier */}
                {activeTab === "dates" && (
                  <div ref={datesPopupRef} className="absolute top-full left-0 mt-2 w-[640px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Sélectionnez vos dates</h3>
                        <button onClick={() => setActiveTab(null)} className="p-1 rounded-full hover:bg-gray-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Navigation mois */}
                      <div className="flex items-center justify-between mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-semibold text-base">
                          {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {/* Jours de la semaine */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map(day => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
                        ))}
                      </div>
                      
                      {/* Jours du mois */}
                      <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => {
                          const isSelected = isDateSelected(day.date);
                          const inRange = isInRange(day.date);
                          const isToday = day.date.toDateString() === new Date().toDateString();
                          const isPast = day.date < new Date(new Date().setHours(0, 0, 0, 0));
                          
                          return (
                            <button
                              key={index}
                              onClick={() => !isPast && handleDateSelect(day.date)}
                              disabled={isPast}
                              className={`relative aspect-square rounded-full text-sm transition-all
                                ${isPast && 'text-gray-300 cursor-not-allowed'}
                                ${!day.isCurrentMonth && !isPast && 'text-gray-300'}
                                ${isSelected && 'bg-[#00c9a7] text-white shadow-md'}
                                ${inRange && !isSelected && 'bg-[#00c9a7]/10'}
                                ${isToday && !isSelected && !inRange && !isPast && 'border-2 border-[#00c9a7]'}
                                ${!isSelected && !inRange && !isPast && day.isCurrentMonth && 'hover:bg-gray-100'}`}
                            >
                              {day.date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Boutons d'action */}
                      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between">
                        <button 
                          onClick={() => { setCheckIn(""); setCheckOut(""); }}
                          className="text-sm text-gray-500 hover:text-[#00c9a7] transition"
                        >
                          Effacer les dates
                        </button>
                        <button 
                          onClick={() => setActiveTab(null)} 
                          className="px-5 py-2 bg-[#00c9a7] text-white rounded-lg text-sm font-medium hover:bg-[#00b396] transition"
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-gray-200"></div>

              {/* Bouton Voyageurs */}
              <div className="relative flex-1">
                <button
                  onClick={() => setActiveTab(activeTab === "guests" ? null : "guests")}
                  className={`w-full text-left px-5 py-3 rounded-full transition-all ${activeTab === "guests" ? "bg-gray-50" : "hover:bg-gray-50"}`}
                >
                  <div className="text-xs font-medium text-gray-500">Voyageurs</div>
                  <div className="text-sm text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#00c9a7]" />
                    {guestLabel()}
                  </div>
                </button>
                
                {/* Popup Voyageurs */}
                {activeTab === "guests" && (
                  <div ref={guestsPopupRef} className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Voyageurs</h3>
                        <button onClick={() => setActiveTab(null)} className="p-1 rounded-full hover:bg-gray-100">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-5">
                        {/* Adultes */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Adultes</p>
                            <p className="text-xs text-gray-500">13 ans et plus</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => setAdults(Math.max(1, adults - 1))} 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00c9a7] hover:bg-[#00c9a7]/5 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-base font-medium">{adults}</span>
                            <button 
                              onClick={() => setAdults(adults + 1)} 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00c9a7] hover:bg-[#00c9a7]/5 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Enfants */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Enfants</p>
                            <p className="text-xs text-gray-500">De 2 à 12 ans</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => setChildren(Math.max(0, children - 1))} 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00c9a7] hover:bg-[#00c9a7]/5 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-base font-medium">{children}</span>
                            <button 
                              onClick={() => setChildren(children + 1)} 
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#00c9a7] hover:bg-[#00c9a7]/5 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => setActiveTab(null)} 
                          className="w-full bg-[#00c9a7] text-white py-2.5 rounded-lg font-medium hover:bg-[#00b396] transition"
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton Rechercher */}
              <button 
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-gradient-to-r from-[#00c9a7] to-[#00a887] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-lg transition-all ml-1 font-medium disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? 'Recherche...' : 'Rechercher'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {mobileSearchActive && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
            <button onClick={() => setMobileSearchActive(false)} className="p-2 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-semibold text-[#0F2940]">Rechercher</h2>
            <div className="w-10"></div>
          </div>
          
          <div className="p-4 space-y-5 pb-20">
            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Où allez-vous ?"
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00c9a7]"
                  autoFocus
                />
              </div>
              {destination && (
                <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                  {destinationsList
                    .filter(place => place.toLowerCase().includes(destination.toLowerCase()))
                    .slice(0, 8)
                    .map((place) => (
                      <button
                        key={place}
                        onClick={() => setDestination(place)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        {place}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Dates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dates</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm"
                    placeholder="Arrivée"
                  />
                  <p className="text-xs text-gray-400 mt-1">Arrivée</p>
                </div>
                <div>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm"
                    placeholder="Départ"
                  />
                  <p className="text-xs text-gray-400 mt-1">Départ</p>
                </div>
              </div>
            </div>

            {/* Voyageurs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voyageurs</label>
              <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Adultes</p>
                    <p className="text-xs text-gray-500">13 ans et plus</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white">-</button>
                    <span className="w-8 text-center text-base font-medium">{adults}</span>
                    <button onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white">+</button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Enfants</p>
                    <p className="text-xs text-gray-500">De 2 à 12 ans</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white">-</button>
                    <span className="w-8 text-center text-base font-medium">{children}</span>
                    <button onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white">+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton Rechercher */}
            <button onClick={handleMobileSearch} disabled={isSearching} className="w-full bg-gradient-to-r from-[#00c9a7] to-[#00a887] text-white py-3.5 rounded-xl font-semibold shadow-lg disabled:opacity-50">
              {isSearching ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[73px] bottom-0 bg-white shadow-xl z-40 border-t overflow-y-auto">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <button key={item.name} onClick={() => { onNavigate?.(item.route); setMenuOpen(false); }} className="w-full text-left py-3 px-4 rounded-xl flex items-center gap-3 hover:bg-gray-50">
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
            <div className="h-px bg-gray-100 my-2"></div>
            <button onClick={() => { onNavigate?.({ name: 'become-host' }); setMenuOpen(false); }} className="w-full bg-[#0f2940] text-white py-3 rounded-xl text-center font-medium">
              ✨ Devenir hôte
            </button>
            <button onClick={() => { onNavigate?.({ name: 'auth' }); setMenuOpen(false); }} className="w-full border border-[#00c9a7] py-3 rounded-xl text-center font-medium flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              S'inscrire
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}