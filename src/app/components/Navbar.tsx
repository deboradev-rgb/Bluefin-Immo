import { useState } from 'react';
import { Search, User, Globe, Menu, X, MapPin } from 'lucide-react';
import type { Page } from '../App';

interface NavbarProps {
  onOpenSearch?: () => void;
  onGoHome?: () => void;
  currentPage?: Page;
}

export function Navbar({ onOpenSearch, onGoHome, currentPage }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState('FR');
  const [currency, setCurrency] = useState('XOF');

  return (
    <nav className="bg-white border-b border-[#e2f5f2] sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 lg:gap-3 flex-shrink-0 group"
        >
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#0f2940] rounded-lg lg:rounded-xl flex items-center justify-center group-hover:bg-[#1a3a52] transition-colors">
            <div className="w-4 h-4 lg:w-6 lg:h-6 border-2 border-[#00c9a7] rounded-sm relative">
              <div className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-[#00c9a7] rounded-sm transform rotate-45"></div>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-base lg:text-xl text-[#0f2940] leading-tight">Bluefin-Immo</div>
            <div className="text-xs text-[#6b7280] hidden lg:block">L'hébergement au Bénin</div>
          </div>
        </button>

        {/* Center search — desktop only */}
        <div
          className="hidden lg:flex items-center gap-4 bg-[#f4fffe] border border-[#e2f5f2] rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex-1 max-w-2xl"
          onClick={onOpenSearch}
        >
          <div className="flex items-center gap-4 divide-x divide-[#e2f5f2] flex-1">
            <div className="flex items-center gap-2 pr-4">
              <MapPin className="w-4 h-4 text-[#00c9a7]" />
              <span className="text-sm font-medium text-[#0f2940]">Destination</span>
            </div>
            <span className="text-sm font-medium text-[#0f2940] px-4">Arrivée — Départ</span>
            <span className="text-sm font-medium text-[#0f2940] pl-4">Voyageurs</span>
          </div>
          <button className="bg-[#00c9a7] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#00b396] transition-colors flex-shrink-0">
            <Search className="w-4 h-4" />
            <span className="font-medium text-sm">Rechercher</span>
          </button>
        </div>

        {/* Mobile search pill */}
        <button
          className="lg:hidden flex-1 max-w-xs flex items-center gap-2 bg-[#f4fffe] border border-[#e2f5f2] rounded-full px-4 py-2.5 shadow-sm hover:shadow-md transition-shadow"
          onClick={onOpenSearch}
        >
          <Search className="w-4 h-4 text-[#00c9a7] flex-shrink-0" />
          <span className="text-sm font-medium text-[#0f2940] truncate">Où allez-vous ?</span>
        </button>

        {/* Right actions — desktop */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-1 text-sm text-[#6b7280]">
            <Globe className="w-4 h-4" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent border-none outline-none font-medium cursor-pointer text-[#0f2940]"
            >
              <option>FR</option>
              <option>EN</option>
            </select>
            <span className="text-[#e2f5f2]">|</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent border-none outline-none font-medium cursor-pointer text-[#0f2940]"
            >
              <option>XOF</option>
              <option>EUR</option>
            </select>
          </div>
          <button className="text-[#0f2940] px-4 py-2 rounded-full hover:bg-[#f4fffe] transition-colors font-medium text-sm">
            Connexion
          </button>
          <button className="bg-[#0f2940] text-white px-5 py-2 rounded-full hover:bg-[#1a3a52] transition-colors font-medium text-sm">
            Devenir hôte
          </button>
        </div>

        {/* Mobile right actions */}
        <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
          <button
            className="w-9 h-9 rounded-full border border-[#e2f5f2] flex items-center justify-center hover:border-[#00c9a7] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-4 h-4 text-[#0f2940]" /> : <Menu className="w-4 h-4 text-[#0f2940]" />}
          </button>
          <div className="w-9 h-9 rounded-full bg-[#0f2940] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#e2f5f2] bg-white px-4 py-4 space-y-3">
          <div className="flex items-center gap-3 py-2">
            <Globe className="w-4 h-4 text-[#6b7280]" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium text-[#0f2940]"
            >
              <option>FR</option>
              <option>EN</option>
            </select>
            <span className="text-[#e2f5f2]">|</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium text-[#0f2940]"
            >
              <option>XOF</option>
              <option>EUR</option>
            </select>
          </div>
          <button className="w-full text-left text-[#0f2940] py-2 text-sm font-medium border-b border-[#e2f5f2]">
            Connexion
          </button>
          <button className="w-full text-left text-[#0f2940] py-2 text-sm font-medium border-b border-[#e2f5f2]">
            Créer un compte
          </button>
          <button className="w-full bg-[#00c9a7] text-white py-3 rounded-full font-medium text-sm">
            Devenir hôte
          </button>
        </div>
      )}
    </nav>
  );
}
