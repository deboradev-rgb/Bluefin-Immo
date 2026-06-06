// src/app/components/Footer.tsx
import { useState } from 'react';
import { Facebook, Instagram, MessageCircle, Globe, ChevronRight, MapPin, Phone, Mail, Clock, Building, HelpCircle, FileText, Users, Shield, CreditCard } from 'lucide-react';
import type { Route } from '../router';

interface FooterProps {
  onNavigate?: (route: Route) => void;
}

// Destinations pour le footer
const footerFilters = ['Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou', 'Ouidah', 'Grand-Popo', 'Abomey', 'Dassa-Zoumè'];

const footerDestinations: Record<string, string[]> = {
  'Cotonou': ['Haie Vive', 'Fidjrossè', 'Akpakpa', 'Menontin', 'Ganhi', 'Cocotiers', 'Patte d\'Oie', 'Cadjèhoun'],
  'Porto-Novo': ['Centre-ville', 'Djassin', 'Ouando', 'Ajara', 'Houéyiho', 'Porto-Novo plage'],
  'Abomey-Calavi': ['Calavi centre', 'Kpankpan', 'Togba', 'Blaise Pascal', 'Carrefour Akpakpa'],
  'Parakou': ['Centre ville', 'Wansoun', 'Gogounou', 'Tchatchou', 'Banignangui'],
  'Ouidah': ['Plage de Ouidah', 'Centre historique', 'Route des Esclaves', 'Temple des Pythons'],
  'Grand-Popo': ['Plage de Grand-Popo', 'Bouches du Roy', 'Agoué', 'Ganthier'],
  'Abomey': ['Palais Royaux', 'Zoungou', 'Tokpota', 'Djégbé'],
  'Dassa-Zoumè': ['Centre-ville', 'Collines de Dassa', 'Stade de Dassa', 'Marché central']
};

export function Footer({ onNavigate }: FooterProps) {
  const [selectedFilter, setSelectedFilter] = useState('Cotonou');
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleNavigation = (name: string, type?: 'privacy' | 'cgu') => {
    if (type) {
      onNavigate?.({ name: 'terms', type });
    } else {
      onNavigate?.({ name: name as any });
    }
  };

  const handleCityClick = (city: string) => {
    onNavigate?.({ name: 'city', city });
  };

  return (
    <footer className="bg-slate-950 text-slate-100 mt-16 pb-20 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        {/* Section du milieu - Liens légaux et entreprise */}
        {/* Version mobile: grid-cols-2, Version tablette/desktop: grid-cols-4 */}
        <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-4 border-t border-slate-800 pt-8 sm:pt-12 pb-6 sm:pb-8">
          {/* Bluefin-Immo */}
          <div>
            <h3 className="font-semibold text-white mb-3 sm:mb-5 flex items-center gap-2 text-sm sm:text-base">
              <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00C9A7]" />
              Bluefin-Immo
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-300">
              <li>
                <button onClick={() => handleNavigation('about')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group w-full sm:w-auto">
                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-left">À propos de nous</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('blog')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group w-full sm:w-auto">
                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-left">Blog & Actualités</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="font-semibold text-white mb-3 sm:mb-5 flex items-center gap-2 text-sm sm:text-base">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00C9A7]" />
              Légal
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-300">
              <li>
                <button onClick={() => handleNavigation('terms', 'privacy')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group w-full sm:w-auto">
                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-left">Politique de confidentialité</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('terms', 'cgu')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group w-full sm:w-auto">
                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-left">Conditions générales</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('site-functioning')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group w-full sm:w-auto">
                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-left">Fonctionnement du site</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Infos entreprise */}
          <div>
            <h3 className="font-semibold text-white mb-3 sm:mb-5 flex items-center gap-2 text-sm sm:text-base">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00C9A7]" />
              Infos entreprise
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-300">
              <li>
                <button onClick={() => handleNavigation('popular')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group w-full sm:w-auto">
                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-left">Logements populaires</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('hotels')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group w-full sm:w-auto">
                  <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-left">Hôtels</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-3 sm:mb-5 flex items-center gap-2 text-sm sm:text-base">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00C9A7]" />
              Contact
            </h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2 sm:gap-3">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-[#00C9A7] flex-shrink-0" />
                <span className="break-words">Cotonou, Bénin</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00C9A7] flex-shrink-0" />
                <span className="break-words">+229 01 23 45 67</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00C9A7] flex-shrink-0" />
                <span className="break-words text-xs">contact@bluefinimmo.com</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-[#00C9A7] flex-shrink-0" />
                <span className="break-words">Lun - Ven : 9h - 18h</span>
              </li>
            </ul>
          </div>
        </div>

        

      {/* Copyright et bas de page */}
<div className="flex flex-row justify-between items-center gap-4 border-t border-slate-800 pt-6 sm:pt-8">
  {/* Logo et infos - à gauche */}
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center">
      <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-[#00C9A7] rounded relative">
        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-[#00C9A7] rounded transform rotate-45"></div>
      </div>
    </div>
    <div>
      <div className="font-bold text-white text-sm sm:text-base">Bluefin-Immo</div>
      <div className="text-[10px] sm:text-xs text-slate-400">Cotonou, Bénin</div>
    </div>
  </div>

{/* Copyright et réseaux sociaux - à droite */}
<div className="flex flex-row items-center gap-3 sm:gap-4">
  <div className="flex items-center gap-2 sm:gap-3">
    <a href="#" className="text-slate-400 hover:text-[#00C9A7] transition-all duration-300 hover:scale-110">
      <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
    </a>
    <a href="#" className="text-slate-400 hover:text-[#00C9A7] transition-all duration-300 hover:scale-110">
      <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
    </a>
    <a href="#" className="text-slate-400 hover:text-[#00C9A7] transition-all duration-300 hover:scale-110">
      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
    </a>
  </div>
  <div className="text-[10px] sm:text-xs text-slate-500">
    © {currentYear} Bluefin-Immo SARL
  </div>
</div>
</div>
      </div>
    </footer>
  );
}