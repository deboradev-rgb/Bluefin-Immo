import { Facebook, Instagram, MessageCircle, Globe } from 'lucide-react';
import type { Route } from '../router';

interface FooterProps {
  onNavigate?: (route: Route) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#0f2940] text-white mt-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Bluefin-Immo</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.({ name: 'about' })}
                  className="hover:text-white transition-colors"
                >
                  À propos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.({ name: 'blog' })}
                  className="hover:text-white transition-colors"
                >
                  Blog
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Voyageurs</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.({ name: 'help' })}
                  className="hover:text-white transition-colors"
                >
                  Aide & Support
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Annulation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Paiement Mobile Money</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Guide du voyageur</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Hôtes</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate?.({ name: 'publish' })}
                  className="hover:text-white transition-colors"
                >
                  Devenir hôte
                </button>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Centre de ressources</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Assurance hôte</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Forum de la communauté</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Découvrir le Bénin</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">Cotonou</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ouidah</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Abomey</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Grand-Popo</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#00c9a7] rounded relative">
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00c9a7] rounded transform rotate-45"></div>
                </div>
              </div>
              <div>
                <div className="font-bold">Bluefin-Immo</div>
                <div className="text-xs text-white/60">Cotonou, Bénin</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Globe className="w-5 h-5 text-white/60" />
              <select className="bg-transparent border border-white/30 rounded-lg px-3 py-1 text-sm">
                <option>Français</option>
                <option>English</option>
              </select>
              <select className="bg-transparent border border-white/30 rounded-lg px-3 py-1 text-sm">
                <option>XOF</option>
                <option>EUR</option>
                <option>USD</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <a href="#" className="hover:text-[#00c9a7] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#00c9a7] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#00c9a7] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <div className="text-xs sm:text-sm text-white/60">
              © 2026 Bluefin-Immo · <a href="#" className="hover:text-white">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
