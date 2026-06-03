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
    <footer className="bg-slate-950 text-slate-100 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Section des idées pour prochaines escapades */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-white mb-4">Des idées pour vos prochaines escapades</h2>
          <p className="max-w-2xl text-sm text-slate-300 mb-8">Inspirez vos voyages depuis le Bénin : plages, aventures en nature et séjours uniques en Afrique de l'Ouest.</p>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Colonne gauche - Filtres et destinations */}
            <div>
              <div className="mb-6 flex flex-wrap gap-3 text-sm text-slate-200">
                {footerFilters.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => { setSelectedFilter(item); setShowAllDestinations(false); }}
                    className={`rounded-full border px-4 py-2 transition-all duration-300 ${selectedFilter === item ? "border-[#00C9A7] bg-[#00C9A7]/10 text-[#00C9A7]" : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:text-white"}`}
                  > 
                    {item}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {footerDestinations[selectedFilter]?.slice(0, showAllDestinations ? undefined : 4).map(dest => (
                  <button
                    key={dest}
                    onClick={() => handleCityClick(selectedFilter)}
                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-left transition-all duration-300 hover:border-slate-700 hover:bg-slate-900 cursor-pointer"
                  >
                    <div className="font-semibold text-white">{dest}</div>
                    <div className="text-slate-400 text-xs mt-1">Locations de vacances</div>
                  </button>
                ))}
              </div>
              {footerDestinations[selectedFilter]?.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllDestinations(!showAllDestinations)}
                  className="mt-6 rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-slate-800 hover:border-slate-600"
                >
                  {showAllDestinations ? "Voir moins" : "Afficher plus"}
                </button>
              )}
            </div>

            {/* Colonne droite - Liens d'assistance et accueil voyageurs */}
            <div className="grid gap-8 sm:grid-cols-2">
              {/* Assistance */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#00C9A7]" />
                  Assistance
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li>
                    <button onClick={() => handleNavigation('help')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Centre d'aide</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigation('about')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">À propos</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigation('blog')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Blog</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Accueil de voyageurs */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#00C9A7]" />
                  Accueil de voyageurs
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li>
                    <button onClick={() => handleNavigation('become-host')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Mettez votre logement sur Bluefin-Immo</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigation('become-host')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Proposez votre expérience</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleNavigation('become-host')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">Parrainer un hôte</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section du milieu - Liens légaux et entreprise */}
        <div className="grid gap-8 lg:grid-cols-4 border-t border-slate-800 pt-12 pb-8">
          {/* Bluefin-Immo */}
          <div>
            <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#00C9A7]" />
              Bluefin-Immo
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <button onClick={() => handleNavigation('about')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">À propos de nous</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('blog')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Blog & Actualités</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('footer-info')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  
                </button>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00C9A7]" />
              Légal
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <button onClick={() => handleNavigation('terms', 'privacy')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Politique de confidentialité</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('terms', 'cgu')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Conditions générales</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('site-functioning')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Fonctionnement du site</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Infos entreprise */}
          <div>
            <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00C9A7]" />
              Infos entreprise
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <button onClick={() => handleNavigation('company-info')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Qui sommes-nous ?</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('popular')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Logements populaires</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation('hotels')} className="hover:text-[#00C9A7] transition-colors duration-300 flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Hôtels</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#00C9A7]" />
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-[#00C9A7]" />
                <span>Cotonou, Bénin</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#00C9A7]" />
                <span>+229 01 23 45 67</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#00C9A7]" />
                <span>contact@bluefinimmo.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 text-[#00C9A7]" />
                <span>Lun - Ven : 9h - 18h</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Moyens de paiement */}
        <div className="border-t border-slate-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <span className="text-slate-400 text-xs uppercase tracking-wider">Paiement sécurisé</span>
              <div className="flex gap-3">
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Shield className="w-4 h-4 text-[#00C9A7]" />
                  <span className="text-slate-400 text-xs">Mobile Money</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                  <CreditCard className="w-4 h-4 text-[#00C9A7]" />
                  <span className="text-slate-400 text-xs">Visa/Mastercard</span>
                </div>
              </div>
            </div>
            <div className="text-slate-500 text-xs">
              Paiement 100% sécurisé
            </div>
          </div>
        </div>

        {/* Copyright et bas de page */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-slate-800 pt-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#00C9A7] rounded relative">
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00C9A7] rounded transform rotate-45"></div>
                </div>
              </div>
              <div>
                <div className="font-bold text-white">Bluefin-Immo</div>
                <div className="text-xs text-slate-400">Cotonou, Bénin</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-slate-400" />
              <select className="bg-transparent border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-[#00C9A7] transition-colors">
                <option>Français</option>
                <option>English</option>
              </select>
              <select className="bg-transparent border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-[#00C9A7] transition-colors">
                <option>XOF</option>
                <option>EUR</option>
                <option>USD</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-[#00C9A7] transition-all duration-300 hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-[#00C9A7] transition-all duration-300 hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-[#00C9A7] transition-all duration-300 hover:scale-110">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <div className="text-xs text-slate-500">
              © {currentYear} Bluefin-Immo SARL · Tous droits réservés
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}