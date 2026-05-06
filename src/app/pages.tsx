import { useState } from 'react';
import type { ReactNode } from 'react';
import { BookingWidget } from './components/BookingWidget';
import { CategoryStrip } from './components/CategoryStrip';
import { DestinationCard } from './components/DestinationCard';
import { FeatureCard } from './components/FeatureCard';
import { Hero } from './components/Hero';
import { ListingCard } from './components/ListingCard';
import { ListingDetail } from './components/ListingDetail';
import { Zap, CheckCircle, Headphones, Home, Heart, MessageCircle, Calendar, ShieldCheck, Rocket, BookOpen, Info, Bookmark, Star, CreditCard, Check, XCircle, BarChart3, CalendarDays, Building2, Sparkles, Search as SearchIcon, X as CloseIcon, ChevronLeft, ChevronRight, ArrowRight, Globe, MapPin, Bath, Bed, Filter, ChevronDown } from 'lucide-react';
import type { Route } from './router';

interface PageProps {
  onNavigate?: (route: Route) => void;
}

const popularListings = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format',
    title: 'Appartement moderne · Haie Vive',
    type: 'Appartement entier',
    rating: 4.87,
    reviewCount: 124,
    price: 45000,
    priceEur: 69,
    badge: 'Certifié Bluefin',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format',
    title: 'Villa spacieuse · Fidjrossè',
    type: 'Villa entière',
    rating: 4.92,
    reviewCount: 89,
    price: 85000,
    priceEur: 130,
    badge: 'Hôte vérifié',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&auto=format',
    title: 'Studio meublé · Cocotiers',
    type: 'Studio privé',
    rating: 4.75,
    reviewCount: 56,
    price: 32000,
    priceEur: 49,
    badge: 'Populaire',
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format',
    title: 'Chambre confort · Cadjèhoun',
    type: 'Chambre privée',
    rating: 4.68,
    reviewCount: 43,
    price: 18000,
    priceEur: 27,
    badge: 'New',
  },
];

const destinations = [
  { name: 'Ouidah', subtitle: 'Histoire & Culture', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop&auto=format' },
  { name: 'Abomey', subtitle: 'Palais Royaux', image: 'https://images.unsplash.com/photo-1590759668628-05b3b8986301?w=600&h=400&fit=crop&auto=format' },
  { name: 'Porto-Novo', subtitle: 'Capitale béninoise', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop&auto=format' },
  { name: 'Grand-Popo', subtitle: 'Plages & Détente', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&auto=format' },
  { name: 'Pendjari', subtitle: 'Safari & Nature', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop&auto=format' },
];

const blogArticles = [
  { title: 'Top 10 quartiers pour séjourner à Cotonou', excerpt: 'Découvrez les quartiers les plus prisés pour votre séjour dans la capitale économique du Bénin.' },
  { title: 'Visiter Ouidah : guide complet', excerpt: 'Itinéraire, sites historiques et conseils pratiques pour une escapade réussie.' },
  { title: 'Route des Pêches : que faire ?', excerpt: 'Plages, villages de pêcheurs et expériences locales le long du littoral béninois.' },
];

function PageSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="max-w-[1440px] mx-auto">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Bluefin-Immo</p>
          <h2 className="text-2xl lg:text-4xl font-bold text-[#0f2940]">{title}</h2>
          {subtitle && <p className="text-sm lg:text-base text-[#6b7280] mt-3 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

// ==================== DONNÉES ====================
const formatPrice = (price: number) => `${price.toLocaleString()} FCFA / nuit`;

const popularProperties = [
  { id: 1, title: 'Villa luxueuse avec piscine', location: 'Fidjrossè, Cotonou', price: 125000, priceDisplay: formatPrice(125000), rating: 4.9, reviews: 128, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', beds: 4, baths: 3, type: 'Villa', category: 'popular', city: 'Fidjrossè', description: 'Magnifique villa avec piscine privée, jardin tropical et vue imprenable.' },
  { id: 2, title: 'Appartement moderne vue mer', location: 'Haie Vive, Cotonou', price: 85000, priceDisplay: formatPrice(85000), rating: 4.8, reviews: 94, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 2, type: 'Appartement', category: 'popular', city: 'Cotonou', description: 'Appartement chic avec vue sur l océan, terrasse privée.' },
  { id: 3, title: 'Studio cosy centre ville', location: 'Cocotiers, Cotonou', price: 35000, priceDisplay: formatPrice(35000), rating: 4.7, reviews: 56, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'popular', city: 'Cotonou', description: 'Studio confortable en plein cœur de Cotonou.' },
  { id: 101, title: 'Loft design avec rooftop', location: 'Ganhi, Cotonou', price: 95000, priceDisplay: formatPrice(95000), rating: 4.9, reviews: 42, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', beds: 2, baths: 2, type: 'Loft', category: 'popular', city: 'Cotonou', description: 'Loft lumineux avec terrasse privée sur le toit.' },
  { id: 102, title: 'Maison de ville traditionnelle', location: 'Akpakpa, Cotonou', price: 55000, priceDisplay: formatPrice(55000), rating: 4.6, reviews: 67, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'popular', city: 'Akpakpa', description: 'Maison authentique avec cour intérieure.' },
  { id: 103, title: 'Duplex moderne', location: 'Patte d Oie, Cotonou', price: 110000, priceDisplay: formatPrice(110000), rating: 4.8, reviews: 33, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 3, baths: 3, type: 'Duplex', category: 'popular', city: 'Cotonou', description: 'Duplex contemporain avec grande terrasse.' },
  { id: 104, title: 'Villa de charme', location: 'Fidjrossè, Cotonou', price: 135000, priceDisplay: formatPrice(135000), rating: 4.9, reviews: 78, image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80', beds: 4, baths: 3, type: 'Villa', category: 'popular', city: 'Fidjrossè', description: 'Villa raffinée avec piscine à débordement.' },
  { id: 105, title: 'Studio design', location: 'Haie Vive, Cotonou', price: 45000, priceDisplay: formatPrice(45000), rating: 4.7, reviews: 44, image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'popular', city: 'Cotonou', description: 'Studio moderne, entièrement équipé.' },
];

const hotelsProperties = [
  { id: 4, title: 'Hôtel Golden Tulip', location: 'Cotonou', price: 150000, priceDisplay: formatPrice(150000), rating: 4.9, reviews: 342, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 2, baths: 2, type: 'Hôtel', category: 'hotels', city: 'Cotonou', description: 'Hôtel 5 étoiles avec spa, piscine et restaurant gastronomique.' },
  { id: 5, title: 'Novotel Cotonou', location: 'Cotonou', price: 120000, priceDisplay: formatPrice(120000), rating: 4.8, reviews: 267, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', beds: 2, baths: 2, type: 'Hôtel', category: 'hotels', city: 'Cotonou', description: 'Hôtel d affaires avec vue sur le lagon.' },
  { id: 6, title: 'Azalaï Hôtel', location: 'Cotonou', price: 95000, priceDisplay: formatPrice(95000), rating: 4.7, reviews: 189, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 1, type: 'Hôtel', category: 'hotels', city: 'Cotonou', description: 'Hôtel confortable avec piscine et restaurant.' },
  { id: 106, title: 'Radisson Blu', location: 'Cotonou', price: 170000, priceDisplay: formatPrice(170000), rating: 4.9, reviews: 210, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80', beds: 2, baths: 2, type: 'Hôtel', category: 'hotels', city: 'Cotonou', description: 'Luxe moderne, piscine extérieure, fitness.' },
  { id: 107, title: 'Sunset Beach Resort', location: 'Grand-Popo', price: 185000, priceDisplay: formatPrice(185000), rating: 4.8, reviews: 156, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 2, baths: 2, type: 'Resort', category: 'hotels', city: 'Grand-Popo', description: 'Resort de bord de mer, plage privée.' },
  { id: 108, title: 'Hotel du Lac', location: 'Cotonou', price: 105000, priceDisplay: formatPrice(105000), rating: 4.6, reviews: 98, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 2, baths: 1, type: 'Hôtel', category: 'hotels', city: 'Cotonou', description: 'Hôtel au bord du lac.' },
  { id: 109, title: 'Oasis Hotel', location: 'Porto-Novo', price: 80000, priceDisplay: formatPrice(80000), rating: 4.5, reviews: 74, image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=80', beds: 1, baths: 1, type: 'Hôtel', category: 'hotels', city: 'Porto-Novo', description: 'Hôtel confortable proche du centre.' },
  { id: 110, title: 'Royal Palm', location: 'Cotonou', price: 200000, priceDisplay: formatPrice(200000), rating: 4.9, reviews: 287, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 2, baths: 2, type: 'Hôtel', category: 'hotels', city: 'Cotonou', description: 'Hôtel de luxe, suites présidentielles.' },
];

const portonovoProperties = [
  { id: 7, title: 'Maison traditionnelle', location: 'Porto-Novo', price: 45000, priceDisplay: formatPrice(45000), rating: 4.6, reviews: 45, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'portonovo', city: 'Porto-Novo', description: 'Authentique maison traditionnelle.' },
  { id: 8, title: 'Appartement moderne', location: 'Porto-Novo', price: 55000, priceDisplay: formatPrice(55000), rating: 4.7, reviews: 38, image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'portonovo', city: 'Porto-Novo', description: 'Appartement moderne avec vue sur la ville.' },
  { id: 111, title: 'Villa fleurie', location: 'Porto-Novo', price: 75000, priceDisplay: formatPrice(75000), rating: 4.8, reviews: 22, image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80', beds: 3, baths: 2, type: 'Villa', category: 'portonovo', city: 'Porto-Novo', description: 'Villa avec jardin tropical.' },
  { id: 112, title: 'Studio cosy', location: 'Porto-Novo', price: 30000, priceDisplay: formatPrice(30000), rating: 4.4, reviews: 31, image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'portonovo', city: 'Porto-Novo', description: 'Petit studio fonctionnel.' },
  { id: 113, title: 'Duplex familial', location: 'Porto-Novo', price: 85000, priceDisplay: formatPrice(85000), rating: 4.7, reviews: 19, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', beds: 4, baths: 2, type: 'Duplex', category: 'portonovo', city: 'Porto-Novo', description: 'Duplex spacieux.' },
  { id: 114, title: 'Maison de ville', location: 'Porto-Novo', price: 60000, priceDisplay: formatPrice(60000), rating: 4.6, reviews: 27, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'portonovo', city: 'Porto-Novo', description: 'Maison de ville avec patio.' },
  { id: 115, title: 'Loft contemporary', location: 'Porto-Novo', price: 68000, priceDisplay: formatPrice(68000), rating: 4.8, reviews: 24, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 2, baths: 1, type: 'Loft', category: 'portonovo', city: 'Porto-Novo', description: 'Loft design.' },
  { id: 116, title: 'Appartement terrasse', location: 'Porto-Novo', price: 50000, priceDisplay: formatPrice(50000), rating: 4.5, reviews: 18, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'portonovo', city: 'Porto-Novo', description: 'Appartement lumineux avec terrasse.' }
];

const abomeycalaviProperties = [
  { id: 9, title: 'Villa calme', location: 'Abomey-Calavi', price: 65000, priceDisplay: formatPrice(65000), rating: 4.8, reviews: 52, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', beds: 3, baths: 2, type: 'Villa', category: 'abomeycalavi', city: 'Abomey-Calavi', description: 'Villa paisible.' },
  { id: 121, title: 'Appartement moderne', location: 'Abomey-Calavi', price: 40000, priceDisplay: formatPrice(40000), rating: 4.5, reviews: 33, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'abomeycalavi', city: 'Abomey-Calavi', description: 'Appartement fonctionnel.' },
  { id: 122, title: 'Studio économique', location: 'Abomey-Calavi', price: 25000, priceDisplay: formatPrice(25000), rating: 4.3, reviews: 44, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'abomeycalavi', city: 'Abomey-Calavi', description: 'Petit studio idéal.' },
  { id: 123, title: 'Maison familiale', location: 'Abomey-Calavi', price: 80000, priceDisplay: formatPrice(80000), rating: 4.7, reviews: 28, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 4, baths: 3, type: 'Maison', category: 'abomeycalavi', city: 'Abomey-Calavi', description: 'Grande maison avec jardin.' },
  { id: 124, title: 'Villa avec piscine', location: 'Abomey-Calavi', price: 120000, priceDisplay: formatPrice(120000), rating: 4.9, reviews: 17, image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80', beds: 4, baths: 3, type: 'Villa', category: 'abomeycalavi', city: 'Abomey-Calavi', description: 'Villa de luxe avec piscine.' },
  { id: 125, title: 'Loft moderne', location: 'Abomey-Calavi', price: 55000, priceDisplay: formatPrice(55000), rating: 4.6, reviews: 22, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', beds: 2, baths: 1, type: 'Loft', category: 'abomeycalavi', city: 'Abomey-Calavi', description: 'Loft contemporain.' },
  { id: 126, title: 'Duplex avec terrasse', location: 'Abomey-Calavi', price: 70000, priceDisplay: formatPrice(70000), rating: 4.7, reviews: 19, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 3, baths: 2, type: 'Duplex', category: 'abomeycalavi', city: 'Abomey-Calavi', description: 'Duplex tout confort.' },
  { id: 127, title: 'Studio design', location: 'Abomey-Calavi', price: 30000, priceDisplay: formatPrice(30000), rating: 4.4, reviews: 31, image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'abomeycalavi', city: 'Abomey-Calavi', description: 'Studio moderne.' }
];

const akpakpaProperties = [
  { id: 10, title: 'Studio économique', location: 'Akpakpa, Cotonou', price: 25000, priceDisplay: formatPrice(25000), rating: 4.5, reviews: 67, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'akpakpa', city: 'Akpakpa', description: 'Studio économique bien situé.' },
  { id: 131, title: 'Appartement confort', location: 'Akpakpa, Cotonou', price: 40000, priceDisplay: formatPrice(40000), rating: 4.6, reviews: 43, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'akpakpa', city: 'Akpakpa', description: 'Appartement calme.' },
  { id: 132, title: 'Villa moderne', location: 'Akpakpa, Cotonou', price: 85000, priceDisplay: formatPrice(85000), rating: 4.7, reviews: 28, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', beds: 3, baths: 2, type: 'Villa', category: 'akpakpa', city: 'Akpakpa', description: 'Villa contemporaine.' },
  { id: 133, title: 'Duplex lumineux', location: 'Akpakpa, Cotonou', price: 60000, priceDisplay: formatPrice(60000), rating: 4.5, reviews: 34, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', beds: 2, baths: 2, type: 'Duplex', category: 'akpakpa', city: 'Akpakpa', description: 'Duplex traversant.' },
  { id: 134, title: 'Maison traditionnelle', location: 'Akpakpa, Cotonou', price: 50000, priceDisplay: formatPrice(50000), rating: 4.4, reviews: 39, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'akpakpa', city: 'Akpakpa', description: 'Maison de caractère.' },
  { id: 135, title: 'Studio moderne', location: 'Akpakpa, Cotonou', price: 30000, priceDisplay: formatPrice(30000), rating: 4.5, reviews: 51, image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'akpakpa', city: 'Akpakpa', description: 'Studio rénové.' },
  { id: 136, title: 'Appartement vue mer', location: 'Akpakpa, Cotonou', price: 70000, priceDisplay: formatPrice(70000), rating: 4.8, reviews: 23, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'akpakpa', city: 'Akpakpa', description: 'Appartement avec vue sur l océan.' },
  { id: 137, title: 'Loft industriel', location: 'Akpakpa, Cotonou', price: 65000, priceDisplay: formatPrice(65000), rating: 4.7, reviews: 27, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 2, baths: 1, type: 'Loft', category: 'akpakpa', city: 'Akpakpa', description: 'Loft industriel chic.' }
];

const menontinProperties = [
  { id: 11, title: 'Appartement confort', location: 'Menontin, Cotonou', price: 40000, priceDisplay: formatPrice(40000), rating: 4.6, reviews: 43, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'menontin', city: 'Menontin', description: 'Appartement confortable.' },
  { id: 141, title: 'Studio cosy', location: 'Menontin, Cotonou', price: 28000, priceDisplay: formatPrice(28000), rating: 4.4, reviews: 52, image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'menontin', city: 'Menontin', description: 'Petit studio bien agencé.' },
  { id: 142, title: 'Villa avec jardin', location: 'Menontin, Cotonou', price: 85000, priceDisplay: formatPrice(85000), rating: 4.8, reviews: 31, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', beds: 3, baths: 2, type: 'Villa', category: 'menontin', city: 'Menontin', description: 'Villa spacieuse, jardin arboré.' },
  { id: 143, title: 'Duplex familial', location: 'Menontin, Cotonou', price: 65000, priceDisplay: formatPrice(65000), rating: 4.6, reviews: 28, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', beds: 4, baths: 2, type: 'Duplex', category: 'menontin', city: 'Menontin', description: 'Duplex avec deux chambres.' },
  { id: 144, title: 'Maison de charme', location: 'Menontin, Cotonou', price: 50000, priceDisplay: formatPrice(50000), rating: 4.5, reviews: 36, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'menontin', city: 'Menontin', description: 'Maison de ville rénovée.' },
  { id: 145, title: 'Appartement moderne', location: 'Menontin, Cotonou', price: 45000, priceDisplay: formatPrice(45000), rating: 4.7, reviews: 41, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'menontin', city: 'Menontin', description: 'Appartement entièrement meublé.' },
  { id: 146, title: 'Loft design', location: 'Menontin, Cotonou', price: 58000, priceDisplay: formatPrice(58000), rating: 4.8, reviews: 22, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 2, baths: 1, type: 'Loft', category: 'menontin', city: 'Menontin', description: 'Loft décoré avec goût.' },
  { id: 147, title: 'Studio dernier étage', location: 'Menontin, Cotonou', price: 33000, priceDisplay: formatPrice(33000), rating: 4.5, reviews: 29, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'menontin', city: 'Menontin', description: 'Studio sous toit.' }
];

const fidjrosseProperties = [
  { id: 151, title: 'Appartement vue mer', location: 'Fidjrossè, Cotonou', price: 85000, priceDisplay: formatPrice(85000), rating: 4.8, reviews: 67, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 2, type: 'Appartement', category: 'fidjrosse', city: 'Fidjrossè', description: 'Appartement avec vue sur l océan.' },
  { id: 152, title: 'Studio bord de mer', location: 'Fidjrossè, Cotonou', price: 45000, priceDisplay: formatPrice(45000), rating: 4.5, reviews: 44, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'fidjrosse', city: 'Fidjrossè', description: 'Studio à 200m de la plage.' },
  { id: 153, title: 'Villa avec piscine', location: 'Fidjrossè, Cotonou', price: 145000, priceDisplay: formatPrice(145000), rating: 4.9, reviews: 52, image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80', beds: 5, baths: 4, type: 'Villa', category: 'fidjrosse', city: 'Fidjrossè', description: 'Grande villa avec piscine.' },
  { id: 154, title: 'Duplex moderne', location: 'Fidjrossè, Cotonou', price: 95000, priceDisplay: formatPrice(95000), rating: 4.7, reviews: 38, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', beds: 3, baths: 2, type: 'Duplex', category: 'fidjrosse', city: 'Fidjrossè', description: 'Duplex contemporain.' },
  { id: 155, title: 'Loft chic', location: 'Fidjrossè, Cotonou', price: 70000, priceDisplay: formatPrice(70000), rating: 4.8, reviews: 29, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 2, baths: 1, type: 'Loft', category: 'fidjrosse', city: 'Fidjrossè', description: 'Loft design.' },
  { id: 156, title: 'Maison de plage', location: 'Fidjrossè, Cotonou', price: 110000, priceDisplay: formatPrice(110000), rating: 4.8, reviews: 41, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 3, baths: 3, type: 'Maison', category: 'fidjrosse', city: 'Fidjrossè', description: 'Maison de plage avec accès direct à la mer.' },
  { id: 157, title: 'Studio cosy', location: 'Fidjrossè, Cotonou', price: 35000, priceDisplay: formatPrice(35000), rating: 4.4, reviews: 63, image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'fidjrosse', city: 'Fidjrossè', description: 'Petit studio bien situé.' }
];

const abomeyProperties = [
  { id: 12, title: 'Villa Abomey', location: 'Abomey', price: 70000, priceDisplay: formatPrice(70000), rating: 4.7, reviews: 34, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80', beds: 3, baths: 2, type: 'Villa', category: 'abomey', city: 'Abomey', description: 'Villa historique.' },
  { id: 161, title: 'Maison traditionnelle', location: 'Abomey', price: 45000, priceDisplay: formatPrice(45000), rating: 4.5, reviews: 28, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'abomey', city: 'Abomey', description: 'Maison ancienne rénovée.' },
  { id: 162, title: 'Appartement centre', location: 'Abomey', price: 35000, priceDisplay: formatPrice(35000), rating: 4.4, reviews: 33, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'abomey', city: 'Abomey', description: 'Appartement en centre-ville.' },
  { id: 163, title: 'Studio confort', location: 'Abomey', price: 25000, priceDisplay: formatPrice(25000), rating: 4.3, reviews: 41, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'abomey', city: 'Abomey', description: 'Studio fonctionnel.' },
  { id: 164, title: 'Villa avec jardin', location: 'Abomey', price: 80000, priceDisplay: formatPrice(80000), rating: 4.8, reviews: 22, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', beds: 4, baths: 3, type: 'Villa', category: 'abomey', city: 'Abomey', description: 'Villa spacieuse.' },
  { id: 165, title: 'Loft moderne', location: 'Abomey', price: 52000, priceDisplay: formatPrice(52000), rating: 4.6, reviews: 19, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', beds: 2, baths: 1, type: 'Loft', category: 'abomey', city: 'Abomey', description: 'Loft contemporain.' },
  { id: 166, title: 'Duplex famille', location: 'Abomey', price: 65000, priceDisplay: formatPrice(65000), rating: 4.7, reviews: 27, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 3, baths: 2, type: 'Duplex', category: 'abomey', city: 'Abomey', description: 'Duplex lumineux.' },
  { id: 167, title: 'Maison de ville', location: 'Abomey', price: 48000, priceDisplay: formatPrice(48000), rating: 4.5, reviews: 31, image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'abomey', city: 'Abomey', description: 'Maison de ville avec parking.' }
];

const parakouProperties = [
  { id: 13, title: 'Parakou Lodge', location: 'Parakou', price: 60000, priceDisplay: formatPrice(60000), rating: 4.5, reviews: 28, image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1200&q=80', beds: 2, baths: 2, type: 'Lodge', category: 'parakou', city: 'Parakou', description: 'Lodge confortable.' },
  { id: 171, title: 'Appartement moderne', location: 'Parakou', price: 45000, priceDisplay: formatPrice(45000), rating: 4.4, reviews: 35, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'parakou', city: 'Parakou', description: 'Appartement neuf.' },
  { id: 172, title: 'Villa calme', location: 'Parakou', price: 75000, priceDisplay: formatPrice(75000), rating: 4.7, reviews: 22, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', beds: 3, baths: 2, type: 'Villa', category: 'parakou', city: 'Parakou', description: 'Villa au calme.' },
  { id: 173, title: 'Studio cosy', location: 'Parakou', price: 28000, priceDisplay: formatPrice(28000), rating: 4.3, reviews: 44, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'parakou', city: 'Parakou', description: 'Petit studio économique.' },
  { id: 174, title: 'Duplex moderne', location: 'Parakou', price: 68000, priceDisplay: formatPrice(68000), rating: 4.6, reviews: 19, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', beds: 3, baths: 2, type: 'Duplex', category: 'parakou', city: 'Parakou', description: 'Duplex lumineux.' },
  { id: 175, title: 'Maison familiale', location: 'Parakou', price: 55000, priceDisplay: formatPrice(55000), rating: 4.5, reviews: 27, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'parakou', city: 'Parakou', description: 'Grande maison.' },
  { id: 176, title: 'Loft design', location: 'Parakou', price: 50000, priceDisplay: formatPrice(50000), rating: 4.7, reviews: 18, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 2, baths: 1, type: 'Loft', category: 'parakou', city: 'Parakou', description: 'Loft tout équipé.' },
  { id: 177, title: 'Appartement avec terrasse', location: 'Parakou', price: 49000, priceDisplay: formatPrice(49000), rating: 4.5, reviews: 24, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'parakou', city: 'Parakou', description: 'Appartement avec terrasse.' }
];

const dassaProperties = [
  { id: 14, title: 'Dassa Resort', location: 'Dassa-Zoumè', price: 50000, priceDisplay: formatPrice(50000), rating: 4.6, reviews: 41, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', beds: 2, baths: 1, type: 'Resort', category: 'dassa', city: 'Dassa-Zoumè', description: 'Resort avec vue sur les collines.' },
  { id: 181, title: 'Villa avec piscine', location: 'Dassa-Zoumè', price: 85000, priceDisplay: formatPrice(85000), rating: 4.8, reviews: 27, image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80', beds: 3, baths: 2, type: 'Villa', category: 'dassa', city: 'Dassa-Zoumè', description: 'Villa privée avec piscine.' },
  { id: 182, title: 'Appartement vue montagne', location: 'Dassa-Zoumè', price: 35000, priceDisplay: formatPrice(35000), rating: 4.4, reviews: 33, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'dassa', city: 'Dassa-Zoumè', description: 'Appartement avec vue montagne.' },
  { id: 183, title: 'Studio paisible', location: 'Dassa-Zoumè', price: 25000, priceDisplay: formatPrice(25000), rating: 4.3, reviews: 38, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'dassa', city: 'Dassa-Zoumè', description: 'Studio calme.' },
  { id: 184, title: 'Maison de charme', location: 'Dassa-Zoumè', price: 48000, priceDisplay: formatPrice(48000), rating: 4.5, reviews: 29, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'dassa', city: 'Dassa-Zoumè', description: 'Maison traditionnelle rénovée.' },
  { id: 185, title: 'Duplex moderne', location: 'Dassa-Zoumè', price: 62000, priceDisplay: formatPrice(62000), rating: 4.6, reviews: 22, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', beds: 3, baths: 2, type: 'Duplex', category: 'dassa', city: 'Dassa-Zoumè', description: 'Duplex spacieux.' },
  { id: 186, title: 'Loft nature', location: 'Dassa-Zoumè', price: 55000, priceDisplay: formatPrice(55000), rating: 4.7, reviews: 19, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 2, baths: 1, type: 'Loft', category: 'dassa', city: 'Dassa-Zoumè', description: 'Loft au milieu de la nature.' },
  { id: 187, title: 'Studio cosy', location: 'Dassa-Zoumè', price: 28000, priceDisplay: formatPrice(28000), rating: 4.4, reviews: 31, image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'dassa', city: 'Dassa-Zoumè', description: 'Studio fonctionnel.' }
];

const ouidahProperties = [
  { id: 15, title: 'Ouidah Beach House', location: 'Ouidah', price: 55000, priceDisplay: formatPrice(55000), rating: 4.7, reviews: 56, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'ouidah', city: 'Ouidah', description: 'Maison de plage avec accès direct à la mer.' },
  { id: 191, title: 'Villa bord de mer', location: 'Ouidah', price: 95000, priceDisplay: formatPrice(95000), rating: 4.9, reviews: 43, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', beds: 4, baths: 3, type: 'Villa', category: 'ouidah', city: 'Ouidah', description: 'Villa de luxe avec piscine, plage privée.' },
  { id: 192, title: 'Studio vue mer', location: 'Ouidah', price: 40000, priceDisplay: formatPrice(40000), rating: 4.5, reviews: 39, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'ouidah', city: 'Ouidah', description: 'Studio avec terrasse vue mer.' },
  { id: 193, title: 'Appartement confort', location: 'Ouidah', price: 48000, priceDisplay: formatPrice(48000), rating: 4.6, reviews: 34, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'ouidah', city: 'Ouidah', description: 'Appartement moderne.' },
  { id: 194, title: 'Maison traditionnelle', location: 'Ouidah', price: 50000, priceDisplay: formatPrice(50000), rating: 4.5, reviews: 41, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'ouidah', city: 'Ouidah', description: 'Maison authentique.' },
  { id: 195, title: 'Duplex familiale', location: 'Ouidah', price: 70000, priceDisplay: formatPrice(70000), rating: 4.7, reviews: 28, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', beds: 4, baths: 2, type: 'Duplex', category: 'ouidah', city: 'Ouidah', description: 'Grand duplex pour famille.' },
  { id: 196, title: 'Loft vue océan', location: 'Ouidah', price: 65000, priceDisplay: formatPrice(65000), rating: 4.8, reviews: 23, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 2, baths: 1, type: 'Loft', category: 'ouidah', city: 'Ouidah', description: 'Loft avec vue imprenable.' },
  { id: 197, title: 'Studio cosy', location: 'Ouidah', price: 30000, priceDisplay: formatPrice(30000), rating: 4.4, reviews: 47, image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'ouidah', city: 'Ouidah', description: 'Petit studio bien équipé.' }
];

const grandpopoProperties = [
  { id: 16, title: 'Grand-Popo Paradise', location: 'Grand-Popo', price: 80000, priceDisplay: formatPrice(80000), rating: 4.9, reviews: 89, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 4, baths: 3, type: 'Villa', category: 'grandpopo', city: 'Grand-Popo', description: 'Paradis tropical en bord de mer.' },
  { id: 201, title: 'Villa bord de plage', location: 'Grand-Popo', price: 120000, priceDisplay: formatPrice(120000), rating: 4.9, reviews: 67, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80', beds: 4, baths: 3, type: 'Villa', category: 'grandpopo', city: 'Grand-Popo', description: 'Villa de luxe avec accès direct à la plage.' },
  { id: 202, title: 'Bungalow de charme', location: 'Grand-Popo', price: 65000, priceDisplay: formatPrice(65000), rating: 4.7, reviews: 53, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 2, baths: 1, type: 'Bungalow', category: 'grandpopo', city: 'Grand-Popo', description: 'Bungalow typique.' },
  { id: 203, title: 'Appartement vue mer', location: 'Grand-Popo', price: 55000, priceDisplay: formatPrice(55000), rating: 4.6, reviews: 44, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', beds: 2, baths: 1, type: 'Appartement', category: 'grandpopo', city: 'Grand-Popo', description: 'Appartement avec terrasse vue mer.' },
  { id: 204, title: 'Maison de pêcheur', location: 'Grand-Popo', price: 40000, priceDisplay: formatPrice(40000), rating: 4.5, reviews: 58, image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', beds: 3, baths: 2, type: 'Maison', category: 'grandpopo', city: 'Grand-Popo', description: 'Maison authentique.' },
  { id: 205, title: 'Studio face mer', location: 'Grand-Popo', price: 35000, priceDisplay: formatPrice(35000), rating: 4.4, reviews: 39, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', beds: 1, baths: 1, type: 'Studio', category: 'grandpopo', city: 'Grand-Popo', description: 'Petit studio pieds dans l eau.' },
  { id: 206, title: 'Duplex familial', location: 'Grand-Popo', price: 85000, priceDisplay: formatPrice(85000), rating: 4.8, reviews: 32, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', beds: 4, baths: 2, type: 'Duplex', category: 'grandpopo', city: 'Grand-Popo', description: 'Duplex spacieux.' },
  { id: 207, title: 'Loft tropical', location: 'Grand-Popo', price: 70000, priceDisplay: formatPrice(70000), rating: 4.7, reviews: 28, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80', beds: 2, baths: 1, type: 'Loft', category: 'grandpopo', city: 'Grand-Popo', description: 'Loft design en bord de plage.' }
];

const allProperties = [
  ...popularProperties,
  ...hotelsProperties,
  ...portonovoProperties,
  ...abomeycalaviProperties,
  ...akpakpaProperties,
  ...menontinProperties,
  ...fidjrosseProperties,
  ...abomeyProperties,
  ...parakouProperties,
  ...dassaProperties,
  ...ouidahProperties,
  ...grandpopoProperties,
];

const filters = ['Tous', 'Prix croissant', 'Prix décroissant', 'Mieux notés', 'Nouveautés'];

// ==================== HOME PAGE ====================
export function HomePage({ onNavigate }: PageProps) {
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchDestination, setSearchDestination] = useState('');
  const [destination, setDestination] = useState('');

  const filterByDestination = (properties: any[]) => {
    if (!searchDestination) return properties;
    const lowerDest = searchDestination.toLowerCase();
    return properties.filter(
      (prop) =>
        prop.location.toLowerCase().includes(lowerDest) ||
        prop.city.toLowerCase().includes(lowerDest)
    );
  };

  const applyFilters = (properties: any[]) => {
    let filtered = filterByDestination(properties);
    switch (selectedFilter) {
      case 'Prix croissant':
        return [...filtered].sort((a, b) => a.price - b.price);
      case 'Prix décroissant':
        return [...filtered].sort((a, b) => b.price - a.price);
      case 'Mieux notés':
        return [...filtered].sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  };

  const popularFiltered = applyFilters(popularProperties);
  const hotelsFiltered = applyFilters(hotelsProperties);
  const cityCategories = [
    { title: 'Porto-Novo', key: 'portonovo', properties: applyFilters(portonovoProperties) },
    { title: 'Abomey-Calavi', key: 'abomeycalavi', properties: applyFilters(abomeycalaviProperties) },
    { title: 'Akpakpa', key: 'akpakpa', properties: applyFilters(akpakpaProperties) },
    { title: 'Menontin', key: 'menontin', properties: applyFilters(menontinProperties) },
    { title: 'Fidjrossè', key: 'fidjrosse', properties: applyFilters(fidjrosseProperties) },
    { title: 'Abomey', key: 'abomey', properties: applyFilters(abomeyProperties) },
    { title: 'Parakou', key: 'parakou', properties: applyFilters(parakouProperties) },
    { title: 'Dassa-Zoumè', key: 'dassa', properties: applyFilters(dassaProperties) },
    { title: 'Ouidah', key: 'ouidah', properties: applyFilters(ouidahProperties) },
    { title: 'Grand-Popo', key: 'grandpopo', properties: applyFilters(grandpopoProperties) },
  ].filter((cat) => cat.properties.length > 0);

  const PropertyCard = ({ property, showDescription = false }: { property: any; showDescription?: boolean }) => (
    <div className="group cursor-pointer" onClick={() => onNavigate?.({ name: 'listing', id: property.id.toString() })}>
      <div className="relative overflow-hidden rounded-2xl">
        <img src={property.image} alt={property.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-semibold text-[#0F2940]">{property.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{property.location}</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Star className="w-4 h-4 text-[#00c9a7]" />
            <span className="font-medium text-[#0F2940]">{property.rating}</span>
            <span>({property.reviews})</span>
          </div>
        </div>
        {showDescription && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{property.description}</p>}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
          <div className="flex items-center gap-1"><Bed className="w-4 h-4" /><span>{property.beds} lits</span></div>
          <div className="flex items-center gap-1"><Bath className="w-4 h-4" /><span>{property.baths} sdb</span></div>
        </div>
        <p className="mt-3 font-semibold text-[#0F2940]">{property.priceDisplay}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <Hero 
        onSearch={(query) => onNavigate?.({ name: 'search-logements' })} 
        onNavigate={(path, params) => onNavigate?.({ name: 'search-logements' })} 
      />

      {/* Section Filtres */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-30 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <div className="relative">
                  <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:border-gray-400 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filtres</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showFilterDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)}></div>
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-2">
                        {filters.map((filter) => (
                          <button
                            key={filter}
                            onClick={() => {
                              setSelectedFilter(filter);
                              setShowFilterDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedFilter === filter ? 'text-[#00c9a7] font-medium' : 'text-gray-700'}`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-600">{allProperties.length} logements disponibles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1440px] mx-auto">
          {popularFiltered.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <button onClick={() => onNavigate?.({ name: 'popular' })} className="flex items-center gap-2 text-2xl font-semibold text-[#0F2940] hover:text-[#00c9a7] transition-colors group">
                    Logements populaires · Bénin
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-gray-600 mt-1">Les plus réservés par nos voyageurs</p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {popularFiltered.slice(0, 8).map((property) => (
                  <PropertyCard key={property.id} property={property} showDescription={true} />
                ))}
              </div>
            </div>
          )}

          {hotelsFiltered.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <button onClick={() => onNavigate?.({ name: 'hotels' })} className="flex items-center gap-2 text-2xl font-semibold text-[#0F2940] hover:text-[#00c9a7] transition-colors group">
                    De superbes hôtels pour votre prochain voyage
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-gray-600 mt-1">Hôtels de qualité supérieure</p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {hotelsFiltered.slice(0, 8).map((property) => (
                  <PropertyCard key={property.id} property={property} showDescription={true} />
                ))}
              </div>
            </div>
          )}

          {cityCategories.map((category) => (
            <div key={category.key} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <button onClick={() => onNavigate?.({ name: 'city', city: category.key })} className="flex items-center gap-2 text-2xl font-semibold text-[#0F2940] hover:text-[#00c9a7] transition-colors group">
                    Logements {category.title}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-gray-600 mt-1">Découvrez les meilleurs logements à {category.title}</p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.properties.slice(0, 4).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ==================== LES AUTRES PAGES (SearchPage, ListingPage, BookingPage, etc.) ====================
// ... (reste du code identique à ce que tu avais pour les autres pages)

// ==================== SEARCH PAGE ====================
interface SearchPageProps extends PageProps {
  mode: 'logements' | 'hotels';
}

export function SearchPage({ mode, onNavigate }: SearchPageProps) {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCounts, setGuestCounts] = useState({ adults: 1, children: 0, babies: 0, pets: 0 });
  const [activeTab, setActiveTab] = useState<'destination' | 'dates' | 'guests' | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchDestination, setSearchDestination] = useState('');

  const guestLabel = () => {
    const totalGuests = guestCounts.adults + guestCounts.children;
    const parts = [] as string[];
    if (totalGuests > 0) parts.push(`${totalGuests} voyageur${totalGuests > 1 ? 's' : ''}`);
    if (guestCounts.babies > 0) parts.push(`${guestCounts.babies} bébé${guestCounts.babies > 1 ? 's' : ''}`);
    if (guestCounts.pets > 0) parts.push(`${guestCounts.pets} animal${guestCounts.pets > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(' · ') : 'Ajouter des voyageurs';
  };

  const dateLabel = () => {
    if (checkIn && checkOut) {
      return `${new Date(checkIn).toLocaleDateString('fr-BJ', { day: 'numeric', month: 'short' })} - ${new Date(checkOut).toLocaleDateString('fr-BJ', { day: 'numeric', month: 'short' })}`;
    }
    return "Ajouter des dates";
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [] as { date: Date; isCurrentMonth: boolean }[];
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

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

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
      setCheckOut('');
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

  const destinationsList = [
    'Cotonou', 'Porto-Novo', 'Abomey-Calavi', 'Parakou', 'Abomey', 'Ouidah', 'Grand-Popo', 'Dassa-Zoumè',
    'Natitingou', 'Lokossa', 'Bohicon', 'Kandi', 'Fidjrossè', 'Akpakpa', 'Menontin'
  ];

  const filterByDestination = (properties: any[]) => {
    if (!searchDestination) return properties;
    const lowerDest = searchDestination.toLowerCase();
    return properties.filter((prop) =>
      prop.location.toLowerCase().includes(lowerDest) || prop.city.toLowerCase().includes(lowerDest)
    );
  };

  const applyFilters = (properties: any[]) => {
    const filtered = filterByDestination(properties).slice();
    switch (selectedFilter) {
      case 'Prix croissant':
        return filtered.sort((a, b) => a.price - b.price);
      case 'Prix décroissant':
        return filtered.sort((a, b) => b.price - a.price);
      case 'Mieux notés':
        return filtered.sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  };

  const popularFiltered = applyFilters(popularProperties);
  const hotelsFiltered = applyFilters(hotelsProperties);
  const cityCategories = [
    { title: 'Porto-Novo', key: 'portonovo', properties: applyFilters(portonovoProperties) },
    { title: 'Abomey-Calavi', key: 'abomeycalavi', properties: applyFilters(abomeycalaviProperties) },
    { title: 'Akpakpa', key: 'akpakpa', properties: applyFilters(akpakpaProperties) },
    { title: 'Menontin', key: 'menontin', properties: applyFilters(menontinProperties) },
    { title: 'Fidjrossè', key: 'fidjrosse', properties: applyFilters(fidjrosseProperties) },
    { title: 'Abomey', key: 'abomey', properties: applyFilters(abomeyProperties) },
    { title: 'Parakou', key: 'parakou', properties: applyFilters(parakouProperties) },
    { title: 'Dassa-Zoumè', key: 'dassa', properties: applyFilters(dassaProperties) },
    { title: 'Ouidah', key: 'ouidah', properties: applyFilters(ouidahProperties) },
    { title: 'Grand-Popo', key: 'grandpopo', properties: applyFilters(grandpopoProperties) },
  ].filter((cat) => cat.properties.length > 0);

  const performSearch = () => {
    setSearchDestination(destination);
  };

  const PropertyCard = ({ property, showDescription = false }: { property: any; showDescription?: boolean }) => (
    <div className="group cursor-pointer" onClick={() => onNavigate?.({ name: 'listing', id: property.id.toString() })}>
      <div className="relative overflow-hidden rounded-2xl">
        <img src={property.image} alt={property.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-semibold text-[#0F2940]">{property.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{property.location}</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Star className="w-4 h-4 text-[#00c9a7]" />
            <span className="font-medium text-[#0F2940]">{property.rating}</span>
            <span>({property.reviews})</span>
          </div>
        </div>
        {showDescription && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{property.description}</p>}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
          <div className="flex items-center gap-1"><Bed className="w-4 h-4" /><span>{property.beds} lits</span></div>
          <div className="flex items-center gap-1"><Bath className="w-4 h-4" /><span>{property.baths} sdb</span></div>
        </div>
        <p className="mt-3 font-semibold text-[#0F2940]">{property.priceDisplay}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Barre de recherche simplifiée pour la page search */}
      <div className="bg-gradient-to-r from-[#00c9a7] to-[#0f2940] py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#00c9a7]">DESTINATION</label>
                <input
                  type="text"
                  placeholder="Où allez-vous ?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#00c9a7]">ARRIVÉE</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#00c9a7]">DÉPART</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={performSearch}
                  className="w-full bg-[#00c9a7] text-white py-2 rounded-lg font-semibold hover:bg-[#00b396] transition-colors"
                >
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 sticky top-0 bg-white z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-[#0f2940] hover:border-[#00c9a7] transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showFilterDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />
                  <div className="absolute top-full left-0 mt-2 z-50 w-56 rounded-2xl border border-gray-200 bg-white shadow-xl">
                    {filters.map((filter) => (
                      <button key={filter} onClick={() => { setSelectedFilter(filter); setShowFilterDropdown(false); }} className={`w-full px-4 py-3 text-left text-sm transition-colors ${selectedFilter === filter ? 'text-[#00c9a7] font-semibold' : 'text-[#0f2940] hover:bg-gray-50'}`}>
                        {filter}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">{allProperties.length} logements disponibles</div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm">
            <MapPin className="w-4 h-4 text-[#00c9a7]" />
            <span>{searchDestination || 'Réservez dans une ville du Bénin'}</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {popularFiltered.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <button onClick={() => onNavigate?.({ name: mode === 'hotels' ? 'search-hotels' : 'search-logements' })} className="flex items-center gap-2 text-2xl font-semibold text-[#0f2940] hover:text-[#00c9a7] transition-colors">
                  Logements populaires · Bénin
                  <ArrowRight className="w-6 h-6" />
                </button>
                <p className="text-sm text-gray-500 mt-1">Les plus réservés par nos voyageurs.</p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {popularFiltered.slice(0, 8).map((property) => <PropertyCard key={property.id} property={property} showDescription />)}
            </div>
          </div>
        )}

        {mode === 'hotels' && hotelsFiltered.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <button onClick={() => onNavigate?.({ name: 'search-hotels' })} className="flex items-center gap-2 text-2xl font-semibold text-[#0f2940] hover:text-[#00c9a7] transition-colors">
                  De superbes hôtels pour votre prochain voyage
                  <ArrowRight className="w-6 h-6" />
                </button>
                <p className="text-sm text-gray-500 mt-1">Hôtels de qualité supérieure.</p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {hotelsFiltered.slice(0, 8).map((property) => <PropertyCard key={property.id} property={property} showDescription />)}
            </div>
          </div>
        )}

        {cityCategories.map((category) => (
          <div key={category.key} className="mb-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <button onClick={() => onNavigate?.({ name: 'search-logements' })} className="flex items-center gap-2 text-2xl font-semibold text-[#0f2940] hover:text-[#00c9a7] transition-colors">
                  Logements {category.title}
                  <ArrowRight className="w-6 h-6" />
                </button>
                <p className="text-sm text-gray-500 mt-1">Découvrez les meilleurs logements à {category.title}.</p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.properties.slice(0, 4).map((property) => <PropertyCard key={property.id} property={property} />)}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

// ==================== LISTING PAGE ====================
export function ListingPage({ onNavigate }: PageProps & { id?: string }) {
  return (
    <div className="bg-white">
      <ListingDetail
        onBack={() => onNavigate?.({ name: 'search-logements' })}
        onOpenBooking={() => onNavigate?.({ name: 'booking', id: '1' })}
      />
    </div>
  );
}

// ==================== BOOKING PAGE ====================
export function BookingPage({ onNavigate }: PageProps & { id?: string }) {
  return (
    <div className="bg-[#f4fffe] min-h-screen py-12">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-[0_20px_80px_rgba(15,41,64,0.08)] overflow-hidden">
          <div className="bg-[#0f2940] text-white px-6 py-6 sm:px-8">
            <div className="text-xs uppercase tracking-[0.35em] text-[#00c9a7]/90">Tunnel de réservation</div>
            <h1 className="text-3xl lg:text-4xl font-bold mt-3">Réserver votre séjour</h1>
            <p className="mt-2 text-sm text-white/80">Confirmez vos dates, voyageurs et payez en toute sécurité.</p>
          </div>
          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-[#e2f5f2] p-6 bg-[#f4fffe]">
                <div className="text-sm text-[#6b7280] mb-3">Résumé du séjour</div>
                <div className="space-y-3 text-sm text-[#0f2940]">
                  <div className="flex justify-between"><span>Destination</span><span>Haie Vive, Cotonou</span></div>
                  <div className="flex justify-between"><span>Dates</span><span>6 mai - 9 mai</span></div>
                  <div className="flex justify-between"><span>Voyageurs</span><span>2 adultes</span></div>
                  <div className="flex justify-between"><span>Type</span><span>Appartement entier</span></div>
                </div>
              </div>
              <div className="rounded-3xl border border-[#e2f5f2] p-6 bg-white">
                <BookingWidget price={45000} priceEur={69} />
              </div>
            </div>
            <div className="text-sm text-[#6b7280] leading-relaxed">
              <p className="font-semibold text-[#0f2940] mb-3">Modes de paiement disponibles</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-[#f4fffe] px-4 py-3 text-center">MTN MoMo</div>
                <div className="rounded-2xl bg-[#f4fffe] px-4 py-3 text-center">Moov Money</div>
                <div className="rounded-2xl bg-[#f4fffe] px-4 py-3 text-center">Orange Money</div>
                <div className="rounded-2xl bg-[#f4fffe] px-4 py-3 text-center">Carte</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => onNavigate?.({ name: 'confirmation', id: '1' })}
                className="w-full sm:w-auto bg-[#00c9a7] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#00b396] transition-colors"
              >
                Valider la réservation
              </button>
              <button
                onClick={() => onNavigate?.({ name: 'listing', id: '1' })}
                className="w-full sm:w-auto border border-[#e2f5f2] text-[#0f2940] px-6 py-3 rounded-full hover:bg-[#f4fffe] transition-colors"
              >
                Retour à l'annonce
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== CONFIRMATION PAGE ====================
export function ConfirmationPage({ onNavigate }: PageProps & { id?: string }) {
  return (
    <div className="bg-[#e8fffb] min-h-screen py-16">

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white shadow-[0_20px_80px_rgba(15,41,64,0.08)] p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#00c9a7]/10 text-[#00c9a7]">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-[#0f2940] mb-3">Réservation confirmée !</h1>
          <p className="text-sm text-[#6b7280] mb-6">Votre réservation pour l'annonce a bien été prise en compte. Un message de confirmation a été envoyé sur WhatsApp et par email.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => onNavigate?.({ name: 'account-reservations' })}
              className="bg-[#0f2940] text-white px-6 py-3 rounded-full hover:bg-[#1a3a52] transition-colors"
            >
              Voir mes réservations
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'home' })}
              className="border border-[#e2f5f2] text-[#0f2940] px-6 py-3 rounded-full hover:bg-[#f4fffe] transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== PROFILE PAGE ====================
export function ProfilePage({ onNavigate }: PageProps & { id?: string }) {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="bg-[#f4fffe] rounded-[2rem] p-8 flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#0f2940] flex items-center justify-center text-white text-2xl font-bold">M</div>
              <div>
                <h1 className="text-2xl font-bold text-[#0f2940]">Marie Dupont</h1>
                <p className="text-sm text-[#6b7280]">Voyageuse & Superhost</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 border border-[#e2f5f2]">
                <div className="text-xs uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Contact</div>
                <p className="text-sm text-[#0f2940]">marie@bluefin-immo.com</p>
                <p className="text-sm text-[#0f2940]">+229 90 00 00 00</p>
              </div>
              <div className="rounded-3xl bg-white p-5 border border-[#e2f5f2]">
                <div className="text-xs uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Langues</div>
                <p className="text-sm text-[#0f2940]">Français, Anglais, Fon</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-md">
            <button
              onClick={() => onNavigate?.({ name: 'account' })}
              className="w-full bg-[#00c9a7] text-white px-6 py-4 rounded-full font-semibold hover:bg-[#00b396] transition-colors"
            >
              Mon compte
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'messages' })}
              className="w-full border border-[#e2f5f2] text-[#0f2940] px-6 py-4 rounded-full hover:bg-[#f4fffe] transition-colors"
            >
              Messages
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'favorites' })}
              className="w-full border border-[#e2f5f2] text-[#0f2940] px-6 py-4 rounded-full hover:bg-[#f4fffe] transition-colors"
            >
              Favoris
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== ACCOUNT PAGE ====================
export function AccountPage({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-[#f4fffe] py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Mon compte" subtitle="Gestion de votre profil, réservations et préférences.">
          <div className="grid gap-6 lg:grid-cols-3">
            <button
              onClick={() => onNavigate?.({ name: 'account-reservations' })}
              className="rounded-3xl bg-white p-6 border border-[#e2f5f2] text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <CalendarDays className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-xl font-semibold text-[#0f2940]">Mes réservations</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Voir l'historique de vos voyages et les prochaines séjours.</p>
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'favorites' })}
              className="rounded-3xl bg-white p-6 border border-[#e2f5f2] text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-xl font-semibold text-[#0f2940]">Favoris</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Retrouvez vos annonces sauvegardées et préparez votre prochaine réservation.</p>
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'help' })}
              className="rounded-3xl bg-white p-6 border border-[#e2f5f2] text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-xl font-semibold text-[#0f2940]">Aide & support</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Accédez à notre centre d'aide et posez toutes vos questions.</p>
            </button>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== ACCOUNT RESERVATIONS PAGE ====================
export function AccountReservationsPage({ onNavigate }: PageProps) {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Mes réservations" subtitle="Suivez vos voyages passés et futurs.">
          <div className="space-y-4">
            {popularListings.map((listing) => (
              <div key={listing.id} className="rounded-3xl border border-[#e2f5f2] p-6 bg-[#f4fffe]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0f2940]">{listing.title}</h3>
                    <p className="text-sm text-[#6b7280]">6 mai - 9 mai · {listing.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onNavigate?.({ name: 'listing', id: listing.id })}
                      className="text-[#0f2940] border border-[#e2f5f2] rounded-full px-5 py-3 hover:bg-white transition-colors"
                    >
                      Voir l'annonce
                    </button>
                    <span className="text-sm text-[#00c9a7]">Confirmée</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== HOST DASHBOARD PAGE ====================
export function HostDashboardPage({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-[#f4fffe] py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Tableau de bord hôte" subtitle="Gérez vos annonces, revenus et réservations depuis un seul endroit.">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-white border border-[#e2f5f2] p-6">
              <div className="text-sm text-[#6b7280]">Revenus du mois</div>
              <div className="text-3xl font-bold text-[#0f2940] mt-3">1 250 000 XOF</div>
            </div>
            <div className="rounded-3xl bg-white border border-[#e2f5f2] p-6">
              <div className="text-sm text-[#6b7280]">Arrivées prévues</div>
              <div className="text-3xl font-bold text-[#0f2940] mt-3">8</div>
            </div>
            <div className="rounded-3xl bg-white border border-[#e2f5f2] p-6">
              <div className="text-sm text-[#6b7280]">Messages non lus</div>
              <div className="text-3xl font-bold text-[#0f2940] mt-3">3</div>
            </div>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <button
              onClick={() => onNavigate?.({ name: 'host-annonces' })}
              className="rounded-3xl bg-white border border-[#e2f5f2] p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Home className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-lg font-semibold text-[#0f2940]">Mes annonces</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Gérez les offres publiées et leurs performances.</p>
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'host-calendrier' })}
              className="rounded-3xl bg-white border border-[#e2f5f2] p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <CalendarDays className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-lg font-semibold text-[#0f2940]">Calendrier</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Bloquez des dates et gérez les disponibilités.</p>
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'host-reservations' })}
              className="rounded-3xl bg-white border border-[#e2f5f2] p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-5 h-5 text-[#00c9a7]" />
                <h3 className="text-lg font-semibold text-[#0f2940]">Réservations</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Consultez les demandes et les séjours en cours.</p>
            </button>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== HOST LISTINGS PAGE ====================
export function HostListingsPage({ onNavigate }: PageProps) {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Mes annonces hôte" subtitle="Gestion de vos annonces publiées et de leur visibilité.">
          <div className="space-y-4">
            {popularListings.map((listing) => (
              <div key={listing.id} className="rounded-3xl border border-[#e2f5f2] p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-[#0f2940]">{listing.title}</h3>
                  <p className="text-sm text-[#6b7280]">Statut : Publiée · {listing.rating} étoiles</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onNavigate?.({ name: 'listing', id: listing.id })}
                    className="border border-[#e2f5f2] rounded-full px-5 py-3 text-sm hover:bg-[#f4fffe] transition-colors"
                  >
                    Voir
                  </button>
                  <button className="bg-[#00c9a7] text-white rounded-full px-5 py-3 text-sm hover:bg-[#00b396] transition-colors">Statistiques</button>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== HOST CALENDAR PAGE ====================
export function HostCalendarPage({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-[#f4fffe] py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Calendrier hôte" subtitle="Organisez votre disponibilité et bloquez des dates importantes.">
          <div className="rounded-[2rem] bg-white border border-[#e2f5f2] p-8">
            <p className="text-sm text-[#6b7280] mb-4">Vue mensuelle avec blocs de disponibilités et tarifs spéciaux.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-3xl bg-[#f4fffe] p-6">
                <h3 className="font-semibold text-[#0f2940] mb-3">Disponibilités</h3>
                <ul className="space-y-2 text-sm text-[#6b7280]">
                  <li>✅ 6 mai - 9 mai : disponible</li>
                  <li>🔴 15 mai : bloqué pour entretien</li>
                  <li>⭐ 20 mai - 22 mai : taux weekend</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-[#f4fffe] p-6">
                <h3 className="font-semibold text-[#0f2940] mb-3">Tarifs</h3>
                <p className="text-sm text-[#6b7280]">Personnalisez vos prix selon la saison et les événements locaux.</p>
              </div>
            </div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== HOST RESERVATIONS PAGE ====================
export function HostReservationsPage({ onNavigate }: PageProps) {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Réservations hôte" subtitle="Suivez les demandes et les séjours en cours.">
          <div className="space-y-4">
            {popularListings.map((listing) => (
              <div key={listing.id} className="rounded-3xl border border-[#e2f5f2] p-6 bg-[#f4fffe]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0f2940]">{listing.title}</h3>
                    <p className="text-sm text-[#6b7280]">Demande de réservation reçue · 4 voyageurs · 3 nuits</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button className="rounded-full border border-[#e2f5f2] px-5 py-3 text-sm hover:bg-white transition-colors">Accepter</button>
                    <button className="rounded-full border border-[#e2f5f2] px-5 py-3 text-sm hover:bg-white transition-colors">Refuser</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== MESSAGES PAGE ====================
export function MessagesPage() {
  return (
    <div className="bg-[#f4fffe] min-h-screen py-10">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Messagerie" subtitle="Conversations entre voyageurs et hôtes.">
          <div className="space-y-4">
            {['Marie', 'Jean', 'Hotel Azalaï', 'Samira'].map((name) => (
              <div key={name} className="rounded-3xl bg-white border border-[#e2f5f2] p-6 flex items-center justify-between gap-4">
                <div>
                  <div className="text-base font-semibold text-[#0f2940]">{name}</div>
                  <div className="text-sm text-[#6b7280]">Bonjour, je souhaite réserver du 10 au 12 mai...</div>
                </div>
                <div className="text-sm text-[#00c9a7]">1 non lu</div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== FAVORITES PAGE ====================
export function FavoritesPage({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Favoris" subtitle="Vos annonces sauvegardées pour planifier votre prochain séjour.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popularListings.map((listing) => (
              <div key={listing.id} className="rounded-3xl overflow-hidden border border-[#e2f5f2] shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate?.({ name: 'listing', id: listing.id })}>
                <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover" />
                <div className="p-4 bg-[#f4fffe]">
                  <h3 className="font-semibold text-[#0f2940] mb-1">{listing.title}</h3>
                  <p className="text-sm text-[#6b7280]">{listing.type} · {listing.rating} étoiles</p>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== PUBLISH LISTING PAGE ====================
export function PublishListingPage() {
  return (
    <div className="bg-[#f4fffe] min-h-screen py-10">
      <div className="max-w-[950px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Publier une annonce" subtitle="Wizard de création d'annonce pour hôtes et propriétaires.">
          <div className="rounded-[2rem] bg-white border border-[#e2f5f2] p-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {['Type', 'Localisation', 'Photos', 'Équipements', 'Tarifs', 'Disponibilités', 'Règlement', 'Publication'].map((step) => (
                <div key={step} className="rounded-3xl bg-[#f4fffe] p-5 border border-[#e2f5f2]">
                  <div className="text-sm text-[#6b7280]">Étape</div>
                  <div className="font-semibold text-[#0f2940] mt-2">{step}</div>
                </div>
              ))}
            </div>
            <div className="text-sm text-[#6b7280] leading-relaxed">
              Commencez par décrire votre logement, chargez des photos mobiles-friendly, ajoutez vos équipements et tarifs en FCFA, puis publiez rapidement sur Bluefin-Immo.
            </div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== HELP PAGE ====================
export function HelpPage() {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Centre d'aide" subtitle="FAQ, guides et contact support pour les voyageurs et hôtes.">
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { title: 'Réservations', desc: 'Modifier vos dates, annuler une réservation ou obtenir un remboursement.' },
              { title: 'Paiements', desc: 'Tout sur Mobile Money, carte bancaire et facturation en FCFA.' },
              { title: 'Hôtes', desc: 'Gérer une annonce, vérifier un voyageur ou configurer un calendrier.' },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-[#e2f5f2] p-6 bg-[#f4fffe]">
                <h3 className="text-lg font-semibold text-[#0f2940] mb-3">{item.title}</h3>
                <p className="text-sm text-[#6b7280]">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[2rem] bg-[#f4fffe] border border-[#e2f5f2] p-8">
            <h3 className="text-xl font-semibold text-[#0f2940] mb-3">Contact support</h3>
            <p className="text-sm text-[#6b7280] mb-4">Chat WhatsApp disponible 8h-20h GMT+1. Email support@bluefin-immo.com</p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full bg-[#00c9a7] text-white px-6 py-3">WhatsApp</button>
              <button className="rounded-full border border-[#e2f5f2] px-6 py-3 text-[#0f2940]">Email</button>
            </div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== ABOUT PAGE ====================
export function AboutPage() {
  return (
    <div className="bg-[#f4fffe] min-h-screen py-10">
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="À propos de Bluefin-Immo" subtitle="La mission, l'histoire et l'engagement de Bluefin pour le Bénin.">
          <div className="space-y-6 text-[#0f2940] text-sm leading-relaxed">
            <p>Bluefin-Immo connecte les hébergements béninois au monde entier. Nous permettons aux voyageurs d'accéder à des annonces locales de qualité, tout en aidant les hôtes à digitaliser leur gestion de réservations et de paiements.</p>
            <p>Notre plateforme privilégie le marché local du Bénin, avec un focus sur la sécurité, le paiement Mobile Money et l'expérience mobile-first.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white p-6 border border-[#e2f5f2]">
                <div className="text-sm uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Vision</div>
                <p>Devenir la plateforme de référence de l'hébergement au Bénin.</p>
              </div>
              <div className="rounded-3xl bg-white p-6 border border-[#e2f5f2]">
                <div className="text-sm uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Valeurs</div>
                <p>Ouverture, confiance, chaleur locale et performance digitale.</p>
              </div>
              <div className="rounded-3xl bg-white p-6 border border-[#e2f5f2]">
                <div className="text-sm uppercase tracking-[0.3em] text-[#00c9a7] mb-2">Local</div>
                <p>Un ancrage profond au Bénin avec des services adaptés au marché béninois.</p>
              </div>
            </div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== BLOG PAGE ====================
export function BlogPage({ onNavigate }: PageProps) {
  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Blog & Guides" subtitle="Des conseils de voyage au Bénin et des idées d'itinéraires.">
          <div className="grid gap-6">
            {blogArticles.map((article) => (
              <button
                key={article.title}
                onClick={() => onNavigate?.({ name: 'about' })}
                className="text-left rounded-3xl border border-[#e2f5f2] p-6 bg-[#f4fffe] hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-[#0f2940] mb-2">{article.title}</h3>
                <p className="text-sm text-[#6b7280]">{article.excerpt}</p>
              </button>
            ))}
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== TERMS PAGE ====================
export function TermsPage() {
  return (
    <div className="bg-[#f4fffe] min-h-screen py-10">
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Mentions légales" subtitle="CGU, CGV, confidentialité et politique de cookies.">
          <div className="space-y-6 text-sm text-[#0f2940] leading-relaxed">
            <p><strong>Bluefin-Immo</strong> est une plateforme de réservation d'hébergements opérant depuis Cotonou, République du Bénin. Les services proposés sont destinés aux voyageurs et hôtes du Bénin et de l'international.</p>
            <p>Notre politique de confidentialité respecte la loi n°2009-09 du Bénin sur la protection des données personnelles. Toutes les données utilisateur sont traitées avec sécurité et transparence.</p>
            <p>Toutes les transactions sont facturées en FCFA et peuvent être accompagnées de frais de service Bluefin. Les conditions d'annulation et les modalités de paiement sont précisées sur chaque annonce.</p>
          </div>
        </PageSection>
      </div>
    </div>
  );
}

// ==================== NOT FOUND PAGE ====================
export function NotFoundPage({ onNavigate }: PageProps) {
  return (
    <div className="min-h-screen bg-[#e8fffb] flex items-center justify-center px-4">
      <div className="max-w-lg text-center rounded-[2rem] bg-white p-10 shadow-[0_20px_80px_rgba(15,41,64,0.08)]">
        <XCircle className="mx-auto mb-6 w-16 h-16 text-[#00c9a7]" />
        <h1 className="text-3xl font-bold text-[#0f2940] mb-3">Page introuvable</h1>
        <p className="text-sm text-[#6b7280] mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <button
          onClick={() => onNavigate?.({ name: 'home' })}
          className="bg-[#00c9a7] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#00b396] transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}