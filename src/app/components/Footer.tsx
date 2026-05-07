import { useState } from 'react';
import { Facebook, Instagram, MessageCircle, Globe } from 'lucide-react';
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

  return (
    <footer className="bg-slate-950 text-slate-100 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Section des idées pour prochaines escapades */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-white mb-4">Des idées pour vos prochaines escapades</h2>
          <p className="max-w-2xl text-sm text-slate-300 mb-8">Inspirez vos voyages depuis le Bénin : plages, aventures en nature et séjours uniques en Afrique de l'Ouest.</p>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Colonne gauche - Filtres et destinations */}
            <div>
              <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-200">
                {footerFilters.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => { setSelectedFilter(item); setShowAllDestinations(false); }}
                    className={`rounded-full border px-4 py-2 transition ${selectedFilter === item ? "border-white bg-white/10 text-white" : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:text-white"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {footerDestinations[selectedFilter]?.slice(0, showAllDestinations ? undefined : 4).map(dest => (
                  <div key={dest} className="rounded-3xl border border-slate-800 bg-slate-900 p-4 text-sm">
                    <div className="font-semibold text-white">{dest}</div>
                    <div className="text-slate-400 mt-1">Locations de vacances</div>
                  </div>
                ))}
              </div>
              {footerDestinations[selectedFilter]?.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllDestinations(!showAllDestinations)}
                  className="mt-6 rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  {showAllDestinations ? "Voir moins" : "Afficher plus"}
                </button>
              )}
            </div>

            {/* Colonne droite - Liens d'assistance et accueil voyageurs */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Assistance */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Assistance</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li><button onClick={() => onNavigate?.({ name: 'help' })} className="hover:text-white transition-colors">Centre d'aide</button></li>
                  <li><a href="#" className="hover:text-white transition-colors">Assistance sécurité</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">AirCover</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Lutte contre la discrimination</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Assistance handicap</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Options d'annulation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">J'ai un problème de voisinage</a></li>
                </ul>
              </div>

              {/* Accueil de voyageurs */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Accueil de voyageurs</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li><a href="#" className="hover:text-white transition-colors">Accueil de voyageurs</a></li>
                  <li><button onClick={() => onNavigate?.({ name: 'publish' })} className="hover:text-white transition-colors">Mettez votre logement sur BF-Immo</button></li>
                  <li><a href="#" className="hover:text-white transition-colors">Proposez votre expérience sur BF-Immo</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Proposez votre service sur BF-Immo</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">AirCover pour les hôtes</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Ressources pour les hôtes</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Forum de la communauté</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Hébergement responsable</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Participez à un cours gratuit pour les hôtes</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Trouver un co‑hôte</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Parrainer un hôte</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section du bas - Liens et informations */}
        <div className="grid gap-8 lg:grid-cols-3 border-t border-slate-800 pt-10 text-sm text-slate-300">
          {/* BF-Immo */}
          <div>
            <h3 className="font-semibold text-white mb-4">BF-Immo</h3>
            <ul className="space-y-3">
              <li><button onClick={() => onNavigate?.({ name: 'about' })} className="hover:text-white transition-colors">BF-Immo</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Édition 2026</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Newsroom</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investisseurs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cartes cadeaux</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Séjours d'urgence BF-Immo.org</a></li>
            </ul>
          </div>

          {/* Section de pied de page */}
          <div>
            <h3 className="font-semibold text-white mb-4">Section de pied de page</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Pied de page du site</a></li>
              <li><button onClick={() => onNavigate?.({ name: 'terms' })} className="hover:text-white transition-colors">Confidentialité</button></li>
              <li><button onClick={() => onNavigate?.({ name: 'terms' })} className="hover:text-white transition-colors">Conditions générales</button></li>
              <li><a href="#" className="hover:text-white transition-colors">Fonctionnement du site</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Infos sur l'entreprise</a></li>
            </ul>
          </div>

          {/* Contact et locale */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Contact et locale</h3>
            <p className="text-slate-400 text-sm">BF IMMO – Plateforme de logement et services inspirés pour le Bénin et l'Afrique de l'Ouest.</p>
            <p className="text-slate-400 text-sm">Service client 24/7 · Offre spéciale pour les hôtes au Bénin.</p>
          </div>
        </div>

        {/* Copyright et bas de page */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 mt-10 border-t border-slate-800 pt-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#00c9a7] rounded relative">
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00c9a7] rounded transform rotate-45"></div>
                </div>
              </div>
              <div>
                <div className="font-bold text-white">Bluefin-Immo</div>
                <div className="text-xs text-slate-400">Cotonou, Bénin</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-slate-400" />
              <select className="bg-transparent border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-slate-500">
                <option>Français</option>
                <option>English</option>
              </select>
              <select className="bg-transparent border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-slate-500">
                <option>XOF</option>
                <option>EUR</option>
                <option>USD</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-[#00c9a7] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-[#00c9a7] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-[#00c9a7] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <div className="text-xs text-slate-500">
              © 2026 Bluefin-Immo · <button onClick={() => onNavigate?.({ name: 'terms' })} className="hover:text-white transition-colors">Mentions légales</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}