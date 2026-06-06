import { useState, useEffect, useRef } from 'react';
import { Search, User, Globe, Menu, X, MapPin, Home, Star, Server, LogIn, Phone, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Route } from '../router';
import Logo from '../assets/Bluefin Immo_01.jpg.jpeg';

// Liste des destinations
const destinationsList = [
  "Abomey", "Abomey-Calavi", "Adjarra", "Adja-Ouèrè", "Agbangnizoun", "Aglangandan", "Ahomey", "Akpro-Missérété",
  "Allada", "Athiémé", "Avrankou", "Bantè", "Bassila", "Bembéréké", "Bétérou", "Bohicon", "Bonou", "Bopa",
  "Cotonou", "Cové", "Dassa-Zoumè", "Djakotomey", "Dogbo", "Fidjrossè", "Ganhi", "Ganvié", "Glazoué",
  "Godomey", "Grand-Popo", "Guilmaro", "Hinvi", "Hounvè", "Ifangni", "Kandi", "Kérou", "Kétou", "Kouandé",
  "Lalo", "Lokossa", "Malanville", "Massi", "Matéri", "Ménontin", "Monomitenga", "Natitingou", "N'Dali",
  "Nikki", "Ouidah", "Ouèssè", "Pahou", "Parakou", "Péhunco", "Pobè", "Porto-Novo", "Sakété", "Savalou",
  "Savè", "Ségbana", "Sèmè-Kpodji", "Sinendé", "So-Ava", "Tanguiéta", "Tanvè", "Tchaourou", "Toffo", "Tori-Bossito",
  "Toucountouna", "Zagnanado", "Zè", "Zogbodomey"
];

export function Navbar({ onGoHome, onNavigate, currentPage }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('FR');
  const [currency, setCurrency] = useState('XOF');
  
  // États pour la barre de recherche
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCounts, setGuestCounts] = useState({ adults: 0, children: 0, babies: 0, pets: 0 });
  const [activeTab, setActiveTab] = useState<"destination" | "dates" | "guests" | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Dans ton Navbar.tsx, modifie navItems :

const navItems = [
  { name: 'Logement', icon: Home, route: { name: 'home' } as Route },  // Redirige vers SearchPage
  { name: 'Expérience', icon: Star, route: { name: 'experience' } as Route },     // Redirige vers ExperiencePage
  { name: 'Service', icon: Server, route: { name: 'services' } as Route } ,
    // Redirige vers BecomeHostPage
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
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleSearch = () => {
    console.log('Recherche:', { destination, checkIn, checkOut, guestCounts });
    setActiveTab(null);
    setMobileSearchActive(false);
  };

  return (
    <nav className="bg-white border-b border-[#e2f5f2] sticky top-0 z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        
        {/* Première ligne: Logo + Navigation centrale + Actions droite */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo à gauche */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-3 flex-shrink-0 group transition-all hover:scale-105 duration-300"
          >
            <img 
              src={Logo} 
              alt="Bluefin-Immo Logo" 
              className="w-12 h-12 lg:w-16 lg:h-16 object-contain rounded-xl shadow-md group-hover:shadow-xl transition-all"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-lg lg:text-xl bg-gradient-to-r from-[#0f2940] to-[#1a3a52] bg-clip-text text-transparent">
                Bluefin-Immo
              </div>
              <div className="text-xs text-[#00c9a7] font-medium">L'hébergement au Bénin</div>
            </div>
          </button>

          {/* Navigation Links - Desktop centré */}
          <div className="hidden lg:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onNavigate?.(item.route)}
                className={`px-5 py-2.5 rounded-full transition-all duration-300 font-medium text-sm flex items-center gap-2 whitespace-nowrap
                  ${isActive(item.name) 
                    ? 'bg-gradient-to-r from-[#00c9a7] to-[#00b396] text-white shadow-md' 
                    : 'text-[#0f2940] hover:bg-[#f4fffe] hover:scale-105'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Right actions — complètement à droite */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0 ml-auto">
            <button
              onClick={() => onNavigate?.({ name: 'become-host' })}
              className="relative px-6 py-2.5 rounded-full overflow-hidden group bg-gradient-to-r from-[#0f2940] to-[#1a3a52] text-white font-medium text-sm transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <span className="relative z-10">Devenir hôte</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#00c9a7] to-[#00b396] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'auth' })}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#00c9a7]/10 to-transparent text-[#0f2940] font-medium text-sm transition-all duration-300 hover:shadow-md hover:scale-105 flex items-center gap-2 border border-[#00c9a7]/20"
            >
              <LogIn className="w-4 h-4" />
              <span>S'inscrire</span>
            </button>
          </div>

          {/* Mobile right actions */}
          <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
            <button
              className="w-10 h-10 rounded-full border border-[#e2f5f2] flex items-center justify-center hover:border-[#00c9a7] transition-all hover:shadow-md"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5 text-[#0f2940]" /> : <Menu className="w-5 h-5 text-[#0f2940]" />}
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0f2940] to-[#1a3a52] flex items-center justify-center shadow-md">
              
            </div>
          </div>
        </div>

        {/* Barre de recherche interactive - Desktop centrée */}
        <div className="hidden lg:flex justify-center mt-6" ref={searchRef}>
          <div className="bg-white rounded-full shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 max-w-4xl w-full">
            <div className="flex items-center gap-1 p-1">
              {/* Destination */}
              <div className="relative flex-[1.5]">
                <button
                  onClick={() => setActiveTab(activeTab === "destination" ? null : "destination")}
                  className={`w-full text-left px-5 py-3 rounded-full transition-all ${
                    activeTab === "destination" ? "bg-gray-50 shadow-inner" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-xs font-medium text-gray-700">Destination</div>
                  <div className="text-sm text-gray-900 truncate flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#00c9a7]" />
                    {destination || "Rechercher une destination"}
                  </div>
                </button>
                {activeTab === "destination" && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Où souhaitez-vous aller ?</h3>
                        <button onClick={() => setActiveTab(null)} className="p-1 rounded-full hover:bg-gray-100">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher une destination au Bénin"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                      />
                      <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                        <div className="font-semibold text-sm text-gray-500 mb-2">Villes du Bénin</div>
                        {destinationsList.filter(place => 
                          place.toLowerCase().includes(destination.toLowerCase())
                        ).map((place) => (
                          <button
                            key={place}
                            onClick={() => { setDestination(place); setActiveTab(null); }}
                            className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className="font-medium">{place}</div>
                            <div className="text-sm text-gray-500">Bénin</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-gray-200"></div>

              {/* Dates */}
              <div className="relative flex-1">
                <button
                  onClick={() => setActiveTab(activeTab === "dates" ? null : "dates")}
                  className={`w-full text-left px-5 py-3 rounded-full transition-all ${
                    activeTab === "dates" ? "bg-gray-50 shadow-inner" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-xs font-medium text-gray-700">Dates</div>
                  <div className="text-sm text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#00c9a7]" />
                    {dateLabel()}
                  </div>
                </button>
                {activeTab === "dates" && (
                  <div className="absolute top-full left-0 mt-2 w-[640px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Sélectionnez vos dates</h3>
                        <button onClick={() => setActiveTab(null)} className="p-1 rounded-full hover:bg-gray-100">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mb-6">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-semibold">
                          {currentMonth.toLocaleDateString('fr-BJ', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map(day => (
                          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
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
                                ${isToday && !isSelected && 'border-2 border-[#00c9a7]'}
                                ${!isSelected && !inRange && day.isCurrentMonth && 'hover:bg-gray-100'}`}
                            >
                              {day.date.getDate()}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                        <button onClick={() => setActiveTab(null)} className="px-6 py-2 bg-[#00c9a7] text-[#0F2940] rounded-lg font-semibold">
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-gray-200"></div>

              {/* Voyageurs */}
              <div className="relative flex-1">
                <button
                  onClick={() => setActiveTab(activeTab === "guests" ? null : "guests")}
                  className={`w-full text-left px-5 py-3 rounded-full transition-all ${
                    activeTab === "guests" ? "bg-gray-50 shadow-inner" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-xs font-medium text-gray-700">Voyageurs</div>
                  <div className="text-sm text-gray-900 truncate">{guestLabel()}</div>
                </button>
                {activeTab === "guests" && (
                  <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Voyageurs</h3>
                        <button onClick={() => setActiveTab(null)} className="p-1 rounded-full hover:bg-gray-100">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-6">
                        {[
                          { label: "Adultes", description: "13 ans et plus", key: "adults" },
                          { label: "Enfants", description: "De 2 à 12 ans", key: "children" },
                          { label: "Bébés", description: "Moins de 2 ans", key: "babies" },
                          { label: "Animaux domestiques", description: "Vous voyagez avec un animal ?", key: "pets" },
                        ].map(({ label, description, key }) => (
                          <div key={key} className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-[#0F2940]">{label}</p>
                              <p className="text-sm text-gray-500">{description}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => setGuestCounts(prev => ({ ...prev, [key]: Math.max(0, (prev[key as keyof typeof prev] as number) - 1) }))} 
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-[#0F2940]">{guestCounts[key as keyof typeof guestCounts]}</span>
                              <button 
                                onClick={() => setGuestCounts(prev => ({ ...prev, [key]: (prev[key as keyof typeof prev] as number) + 1 }))} 
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => setActiveTab(null)} 
                          className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-lg font-semibold"
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton recherche */}
              <button 
                onClick={handleSearch}
                className="bg-[#00c9a7] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#00b396] transition-all duration-300 hover:scale-105 ml-1"
              >
                <Search className="w-5 h-5" />
                <span className="font-medium">Rechercher</span>
              </button>
            </div>
          </div>
        </div>

        {/* Barre de recherche mobile - Toujours visible */}
        <div className="lg:hidden mt-3">
          <button
            onClick={() => setMobileSearchActive(!mobileSearchActive)}
            className="w-full flex items-center gap-2 bg-[#f4fffe] border border-[#e2f5f2] rounded-full px-4 py-3 shadow-sm hover:shadow-md transition-all"
          >
            <Search className="w-4 h-4 text-[#00c9a7] flex-shrink-0" />
            <span className="text-sm font-medium text-[#0f2940] truncate">
              {destination || "Où allez-vous ?"}
            </span>
          </button>

          {/* Formulaire de recherche mobile expansible */}
          {mobileSearchActive && (
            <div className="fixed inset-x-0 top-0 bg-white shadow-2xl z-50 p-4 animate-slideDown" style={{ top: '80px' }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Rechercher</h3>
                  <button onClick={() => setMobileSearchActive(false)} className="p-2 rounded-full hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">Destination</div>
                  <input
                    type="text"
                    placeholder="Rechercher une destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full outline-none text-sm"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1 border border-gray-200 rounded-xl p-3">
                    <div className="text-xs font-medium text-gray-700 mb-1">Arrivée</div>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full outline-none text-sm"
                    />
                  </div>
                  <div className="flex-1 border border-gray-200 rounded-xl p-3">
                    <div className="text-xs font-medium text-gray-700 mb-1">Départ</div>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full outline-none text-sm"
                    />
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-3">
                  <div className="text-xs font-medium text-gray-700 mb-2">Voyageurs</div>
                  <div className="space-y-3">
                    {[
                      { label: "Adultes", key: "adults" },
                      { label: "Enfants", key: "children" },
                      { label: "Bébés", key: "babies" },
                      { label: "Animaux", key: "pets" },
                    ].map(({ label, key }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm">{label}</span>
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setGuestCounts(prev => ({ ...prev, [key]: Math.max(0, (prev[key as keyof typeof prev] as number) - 1) }))} 
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-6 text-center">{guestCounts[key as keyof typeof guestCounts]}</span>
                          <button 
                            onClick={() => setGuestCounts(prev => ({ ...prev, [key]: (prev[key as keyof typeof prev] as number) + 1 }))} 
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
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
                  className="w-full bg-[#00c9a7] text-white py-3 rounded-xl font-medium"
                >
                  Rechercher
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

     {/* Mobile menu drawer */}
{menuOpen && (
  <div className="lg:hidden fixed inset-x-0 top-[88px] bg-white shadow-xl z-40 border-t border-[#e2f5f2]">
    <div className="px-4 py-3 space-y-2">
      {/* Navigation items */}
      <div className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              onNavigate?.(item.route);
              setMenuOpen(false);
            }}
            className={`w-full text-left py-2.5 px-3 rounded-lg transition-all text-sm flex items-center gap-2
              ${isActive(item.name) 
                ? 'bg-gradient-to-r from-[#00c9a7] to-[#00b396] text-white shadow-sm' 
                : 'text-[#0f2940] hover:bg-gray-50'
              }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </div>
      
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>
      
      {/* Devenir hôte button */}
      <button
        onClick={() => {
          onNavigate?.({ name: 'become-host' });
          setMenuOpen(false);
        }}
        className="w-full bg-gradient-to-r from-[#0f2940] to-[#1a3a52] text-white py-2.5 rounded-lg text-sm font-medium relative overflow-hidden group"
      >
        <span className="relative z-10">✨ Devenir hôte</span>
        <span className="absolute inset-0 bg-gradient-to-r from-[#00c9a7] to-[#00b396] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </button>
      
      {/* Auth button */}
      <button
        onClick={() => {
          onNavigate?.({ name: 'auth' });
          setMenuOpen(false);
        }}
        className="w-full text-[#0f2940] py-2.5 rounded-lg text-sm font-medium border border-[#00c9a7]/30 hover:border-[#00c9a7] transition-all flex items-center justify-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        <span>S'inscrire</span>
      </button>
    </div>
  </div>
)}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}