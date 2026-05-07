import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingWidget } from './components/BookingWidget';
import { CategoryStrip } from './components/CategoryStrip';
import { DestinationCard } from './components/DestinationCard';
import { FeatureCard } from './components/FeatureCard';
import { Hero } from './components/Hero';
import { ListingCard } from './components/ListingCard';
import { ListingDetail } from './components/ListingDetail';
import { 
  Zap, CheckCircle, Headphones, Home, Heart, MessageCircle, Calendar, 
  ShieldCheck, Rocket, BookOpen, Info, Bookmark, Star, CreditCard, Check, 
  XCircle, BarChart3, CalendarDays, Building2, Sparkles, Search as SearchIcon, HelpCircle  ,
  UserPlus,
  DollarSign,
  FileText,
  Mail,
  Settings,
  Bell,
  User,
  AlertCircle, Eye, Lock, EyeOff, Google,
  Clock,
  X as CloseIcon, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, Globe, X, Users,
  MapPin, Bath, Bed, Filter, ChevronDown, Share2, Award, Crown, Key, Smartphone, Phone, Camera, Image
} from 'lucide-react';
import type { Route } from './router';

// Remplacez l'interface stricte par un type plus flexible
type HotelProperty = {
  id: number;
  title: string;
  location: string;
  price: number;
  priceDisplay: string;
  priceNumber: number;
  rating: number;
  reviews: number;
  image: string;
  beds: number;
  baths: number;
  description: string;
  type?: string;
  category?: string;
  city?: string;
  // Ajoutez les propriétés optionnelles manquantes
  images?: string[];
  host?: string;
  hostImage?: string;
  hostSince?: string;
  superhost?: boolean;
  responseRate?: number;
  responseTime?: string;
  longDescription?: string;
  amenities?: string[];
  testimonials?: Array<{
    name: string;
    date: string;
    text: string;
    rating: number;
    avatar?: string;
    price?:number
  }>;
};interface PageProps {
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

// Version SIMPLE des propriétés populaires (utilisée par HomePage et SearchPage)
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

// Mettez à jour votre hotelsData avec des tableaux d'images
const hotelsData: HotelProperty[] = [
  { 
    id: 4, 
    title: 'Hôtel Golden Tulip', 
    location: 'Cotonou', 
    price: 150000, 
    priceDisplay: '150 000 FCFA / nuit', 
    priceNumber: 150000, 
    rating: 4.9, 
    reviews: 342, 
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    // Ajoutez ceci - au moins 4 images
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80'
    ],
    beds: 2, 
    baths: 2, 
    description: 'Hôtel 5 étoiles avec spa, piscine et restaurant gastronomique.',
    host: 'Sophie',
    hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    hostSince: '2 ans',
    superhost: true,
    responseRate: 98,
    responseTime: 'dans l\'heure',
    amenities: ['Piscine', 'Spa', 'Wifi gratuit', 'Parking', 'Restaurant', 'Room service', 'Climatisation', 'TV'],
    longDescription: 'Situé au cœur de Cotonou, le Golden Tulip offre une expérience de luxe avec ses chambres spacieuses, sa piscine à débordement et son restaurant gastronomique.'
  },
  { 
    id: 5, 
    title: 'Novotel Cotonou', 
    location: 'Cotonou', 
    price: 120000, 
    priceDisplay: '120 000 FCFA / nuit', 
    priceNumber: 120000, 
    rating: 4.8, 
    reviews: 267, 
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
    // Ajoutez ceci - au moins 4 images
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80',
      'https://images.unsplash.com/photo-1582719500961-5e4c91ba3d3a?w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80'
    ],
    beds: 2, 
    baths: 2, 
    description: 'Hôtel d affaires avec vue sur le lagon.',
    host: 'Jean-Marc',
    hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    hostSince: '1 an',
    superhost: true,
    responseRate: 95,
    responseTime: 'dans l\'heure',
    amenities: ['Vue sur lagon', 'Piscine', 'Salle de sport', 'Wifi', 'Restaurant', 'Bar', 'Parking'],
    longDescription: 'Le Novotel Cotonou offre une vue imprenable sur le lagon. Idéal pour les voyageurs d\'affaires et les familles.'
  },
  // Ajoutez les autres hôtels avec leurs images...
];



const hotelsProperties: HotelProperty[] = [
  {
    id: 4,
    title: "Hôtel Golden Tulip",
    location: "Cotonou",
    price: "150 000 FCFA / nuit",
    priceNumber: 150000,
    rating: 4.9,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"],
    beds: 2,
    baths: 2,
    description: "Hôtel 5 étoiles avec spa, piscine et restaurant gastronomique. Parfait pour un séjour détente ou d'affaires.",
    longDescription: "Le Golden Tulip offre une expérience luxueuse avec ses chambres élégantes, son spa de classe mondiale et sa cuisine raffinée. Profitez d'une vue imprenable sur la ville et d'un service irréprochable.",
    host: "Direction Golden Tulip",
    hostImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    hostSince: "10 ans",
    superhost: true,
    responseRate: 100,
    responseTime: "dans l'heure",
    amenities: ["Piscine", "Spa", "Restaurant gastronomique", "Wifi haut débit", "Parking sécurisé", "Salle de sport", "Service d'étage 24h/24", "Navette aéroport"],
    checkInTime: "14:00",
    checkOutTime: "12:00",
    selfCheckIn: true,
    walkScore: "Très bien situé",
    testimonials: [
      { name: "Sophie L.", date: "Il y a 2 semaines", text: "Séjour absolument magnifique ! Le personnel est aux petits soins, la chambre était spacieuse avec une vue imprenable. Le petit-déjeuner buffet est un régal. Je recommande vivement !", rating: 5, avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
      { name: "Marc D.", date: "Il y a 1 mois", text: "Un hôtel d'exception. Le spa est incroyable, et le restaurant mérite au moins une étoile Michelin. Rapport qualité-prix excellent pour un 5 étoiles.", rating: 5, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
      { name: "Amélie K.", date: "Il y a 3 semaines", text: "Parfait pour un voyage d'affaires comme pour des vacances. La piscine est très agréable et le personnel parle parfaitement anglais et français.", rating: 4.8, avatar: "https://randomuser.me/api/portraits/women/2.jpg" }
    ]
  },
  {
    id: 5,
    title: "Novotel Cotonou",
    location: "Cotonou",
    price: "120 000 FCFA / nuit",
    priceNumber: 120000,
    rating: 4.8,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"],
    beds: 2,
    baths: 2,
    description: "Hôtel d'affaires avec vue sur le lagon, piscine et centre de conférence, idéal pour un séjour confortable.",
    longDescription: "Situé face au lagon, le Novotel allie modernité et sérénité. Idéal pour les voyageurs d'affaires avec ses salles de réunion modernes, mais aussi pour les familles grâce à sa piscine et ses espaces verts.",
    host: "Groupe Novotel",
    hostImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    hostSince: "8 ans",
    superhost: true,
    responseRate: 98,
    responseTime: "dans l'heure",
    amenities: ["Vue sur lagon", "Piscine", "Centre d'affaires", "Wifi", "Parking", "Restaurant"],
    checkInTime: "15:00",
    checkOutTime: "11:00",
    selfCheckIn: true,
    testimonials: [
      { name: "Jean-Paul B.", date: "Il y a 1 semaine", text: "Très bon hôtel, chambre confortable et personnel accueillant. La vue sur le lagon est magnifique au coucher du soleil.", rating: 4.5, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
      { name: "Fatima Z.", date: "Il y a 2 mois", text: "Idéalement situé, proche du centre-ville. La piscine est propre et agréable. Je recommande pour un séjour pro ou perso.", rating: 4.7, avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
      { name: "Thomas R.", date: "Il y a 3 semaines", text: "Service de qualité, petit-déjeuner copieux. Un grand merci à l'équipe pour leur disponibilité.", rating: 4.6, avatar: "https://randomuser.me/api/portraits/men/3.jpg" }
    ]
  },
  {
    id: 6,
    title: "Azalaï Hôtel",
    location: "Cotonou",
    price: "95 000 FCFA / nuit",
    priceNumber: 95000,
    rating: 4.7,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80"],
    beds: 2,
    baths: 1,
    description: "Hôtel confortable avec piscine et restaurant, parfait pour les voyageurs d'affaires ou les vacances en couple.",
    longDescription: "L'Azalaï Hôtel vous accueille dans un cadre chaleureux et moderne. Piscine extérieure, restaurant proposant une cuisine locale et internationale, et chambres climatisées.",
    host: "Azalaï Group",
    hostImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    hostSince: "5 ans",
    superhost: false,
    responseRate: 95,
    responseTime: "quelques heures",
    amenities: ["Piscine", "Restaurant", "Wifi", "Parking gratuit", "Climatisation"],
    checkInTime: "14:00",
    checkOutTime: "12:00",
    selfCheckIn: false,
    testimonials: [
      { name: "Laura M.", date: "Il y a 2 semaines", text: "Excellent rapport qualité-prix ! La piscine est très agréable après une journée de travail. Le personnel est souriant et serviable.", rating: 4.5, avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
      { name: "Nicolas P.", date: "Il y a 1 mois", text: "Chambre propre et bien équipée. Le restaurant propose des plats typiques délicieux. Je reviendrai.", rating: 4.4, avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
      { name: "Mariam S.", date: "Il y a 3 semaines", text: "Très bon accueil, hôtel calme et bien situé. Le wifi fonctionne parfaitement, ce qui est rare à Cotonou !", rating: 4.6, avatar: "https://randomuser.me/api/portraits/women/5.jpg" }
    ]
  },
  {
    id: 7,
    title: "Radisson Blu Cotonou",
    location: "Cotonou",
    price: "140 000 FCFA / nuit",
    priceNumber: 140000,
    rating: 4.8,
    reviews: 211,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80", "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80"],
    beds: 2,
    baths: 2,
    description: "Hôtel moderne avec piscine extérieure, salle de sport et restaurant élégant.",
    longDescription: "Découvrez le luxe moderne au Radisson Blu. Piscine à débordement, fitness dernier cri et cuisine internationale raffinée.",
    host: "Radisson Group",
    hostImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80",
    hostSince: "6 ans",
    superhost: true,
    responseRate: 99,
    responseTime: "dans l'heure",
    amenities: ["Piscine", "Salle de sport", "Restaurant gastronomique", "Wifi", "Parking", "Spa"],
    checkInTime: "15:00",
    checkOutTime: "12:00",
    selfCheckIn: true,
    testimonials: [
      { name: "Claire D.", date: "Il y a 2 semaines", text: "Le meilleur hôtel de Cotonou ! La piscine est sublime, le service impeccable.", rating: 4.9, avatar: "https://randomuser.me/api/portraits/women/6.jpg" },
      { name: "Olivier G.", date: "Il y a 1 mois", text: "Chambre luxueuse, petit-déjeuner buffet incroyable. Je reviendrai sans hésiter.", rating: 4.8, avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
      { name: "Sabrina K.", date: "Il y a 3 semaines", text: "Un séjour de rêve. Le personnel est aux petits soins, la vue sur la ville est magnifique.", rating: 4.7, avatar: "https://randomuser.me/api/portraits/women/7.jpg" }
    ]
  },
  {
    id: 8,
    title: "Royal Orchid Hotel",
    location: "Cotonou",
    price: "110 000 FCFA / nuit",
    priceNumber: 110000,
    rating: 4.7,
    reviews: 162,
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80"],
    beds: 2,
    baths: 2,
    description: "Chambres spacieuses, petit déjeuner buffet et service 24h/24.",
    longDescription: "L'hôtel Royal Orchid offre un service de qualité avec des chambres confortables et un personnel attentionné.",
    host: "Royal Orchid",
    hostImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    hostSince: "4 ans",
    superhost: true,
    responseRate: 97,
    responseTime: "dans l'heure",
    amenities: ["Restaurant", "Bar", "Wifi", "Service d'étage"],
    checkInTime: "14:00",
    checkOutTime: "11:00",
    selfCheckIn: true,
    testimonials: [
      { name: "Alain B.", date: "Il y a 1 semaine", text: "Très bon accueil, chambre confortable. Le buffet du petit-déjeuner est varié.", rating: 4.5, avatar: "" },
      { name: "Fanny L.", date: "Il y a 2 mois", text: "Hôtel bien situé, calme. Je recommande.", rating: 4.4, avatar: "" },
      { name: "Karim S.", date: "Il y a 3 semaines", text: "Service rapide, chambre propre.", rating: 4.6, avatar: "" }
    ]
  },
  {
    id: 9,
    title: "Sunset Beach Resort",
    location: "Cotonou",
    price: "135 000 FCFA / nuit",
    priceNumber: 135000,
    rating: 4.9,
    reviews: 278,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80"],
    beds: 3,
    baths: 2,
    description: "Resort de bord de mer avec accès direct à la plage et piscine privée.",
    longDescription: "Paradis tropical, le Sunset Beach Resort vous offre plage privée, piscine à débordement et services exclusifs.",
    host: "Sunset Group",
    hostImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    hostSince: "5 ans",
    superhost: true,
    responseRate: 100,
    responseTime: "dans l'heure",
    amenities: ["Plage privée", "Piscine", "Spa", "Restaurant", "Bar"],
    checkInTime: "15:00",
    checkOutTime: "12:00",
    selfCheckIn: true,
    testimonials: [
      { name: "Julie M.", date: "Il y a 2 semaines", text: "Paradis sur terre! Le coucher de soleil depuis la plage est magique.", rating: 5, avatar: "" },
      { name: "Paul H.", date: "Il y a 1 mois", text: "Resort de luxe, personnel adorable. La piscine est énorme.", rating: 4.9, avatar: "" },
      { name: "Eva C.", date: "Il y a 3 semaines", text: "Un séjour inoubliable, je reviendrai !", rating: 5, avatar: "" }
    ]
  },
  {
    id: 10,
    title: "Palace Hotel Cotonou",
    location: "Cotonou",
    price: "165 000 FCFA / nuit",
    priceNumber: 165000,
    rating: 4.9,
    reviews: 310,
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"],
    beds: 3,
    baths: 3,
    description: "Hôtel de luxe avec spa, suite présidentielle et service haut de gamme.",
    longDescription: "Le Palace Hotel incarne le luxe absolu à Cotonou. Suites présidentielles, spa exclusif et service personnalisé.",
    host: "Palace Group",
    hostImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    hostSince: "7 ans",
    superhost: true,
    responseRate: 100,
    responseTime: "dans l'heure",
    amenities: ["Spa", "Piscine", "Restaurant étoilé", "Service d'étage", "Conciergerie"],
    checkInTime: "14:00",
    checkOutTime: "12:00",
    selfCheckIn: false,
    testimonials: [
      { name: "Henri P.", date: "Il y a 2 semaines", text: "L'apogée du luxe à Cotonou. Suite présidentielle exceptionnelle.", rating: 5, avatar: "" },
      { name: "Isabelle R.", date: "Il y a 1 mois", text: "Service royal, rien à redire.", rating: 5, avatar: "" },
      { name: "Christophe L.", date: "Il y a 3 semaines", text: "Le meilleur hôtel de la ville. Je recommande.", rating: 4.9, avatar: "" }
    ]
  },
  {
    id: 11,
    title: "Lagoon View Suites",
    location: "Cotonou",
    price: "130 000 FCFA / nuit",
    priceNumber: 130000,
    rating: 4.6,
    reviews: 146,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"],
    beds: 2,
    baths: 1,
    description: "Suites avec vue sur le lagon, idéal pour un séjour romantique.",
    longDescription: "Suites élégantes avec vue imprenable sur le lagon. Parfait pour les couples en quête de romantisme.",
    host: "Lagoon Group",
    hostImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80",
    hostSince: "3 ans",
    superhost: false,
    responseRate: 92,
    responseTime: "quelques heures",
    amenities: ["Vue lagon", "Terrasse", "Wifi", "Jacuzzi"],
    checkInTime: "15:00",
    checkOutTime: "11:00",
    selfCheckIn: true,
    testimonials: [
      { name: "Roméo J.", date: "Il y a 1 semaine", text: "Vue magnifique, parfait pour une nuit de Saint-Valentin.", rating: 4.5, avatar: "" },
      { name: "Juliette B.", date: "Il y a 2 mois", text: "Suite romantique, très propre. Le jacuzzi est un plus.", rating: 4.6, avatar: "" },
      { name: "Nina K.", date: "Il y a 3 semaines", text: "Idéal en couple, calme et reposant.", rating: 4.4, avatar: "" }
    ]
  },
  {
    id: 12,
    title: "Cotonou Urban Inn",
    location: "Cotonou",
    price: "90 000 FCFA / nuit",
    priceNumber: 90000,
    rating: 4.5,
    reviews: 103,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80"],
    beds: 1,
    baths: 1,
    description: "Hôtel urbain moderne proche des commerces et du centre-ville.",
    longDescription: "L'Urban Inn est un hôtel moderne idéalement situé près des commerces et restaurants.",
    host: "Urban Group",
    hostImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    hostSince: "4 ans",
    superhost: false,
    responseRate: 89,
    responseTime: "quelques heures",
    amenities: ["Wifi", "Climatisation", "TV", "Mini-bar"],
    checkInTime: "14:00",
    checkOutTime: "11:00",
    selfCheckIn: true,
    testimonials: [
      { name: "Léna S.", date: "Il y a 2 semaines", text: "Pratique et propre, bon rapport qualité-prix.", rating: 4.2, avatar: "" },
      { name: "Moussa T.", date: "Il y a 1 mois", text: "Idéal pour une nuit de transit. Le personnel est sympa.", rating: 4.3, avatar: "" },
      { name: "Claire F.", date: "Il y a 3 semaines", text: "Chambre petite mais bien agencée. Le wifi fonctionne bien.", rating: 4.4, avatar: "" }
    ]
  },
  {
    id: 13,
    title: "Riviera Boutique Hotel",
    location: "Cotonou",
    price: "100 000 FCFA / nuit",
    priceNumber: 100000,
    rating: 4.7,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80", "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80"],
    beds: 2,
    baths: 1,
    description: "Ambiance boutique, décoration soignée et service personnalisé.",
    longDescription: "Hôtel boutique au charme unique, décoration design et service sur mesure.",
    host: "Riviera",
    hostImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    hostSince: "3 ans",
    superhost: true,
    responseRate: 96,
    responseTime: "dans l'heure",
    amenities: ["Décoration design", "Wifi", "Petit-déjeuner inclus", "Parking"],
    checkInTime: "15:00",
    checkOutTime: "11:00",
    selfCheckIn: true,
    testimonials: [
      { name: "Chloé A.", date: "Il y a 2 semaines", text: "Hôtel charmant, ambiance cosy. Le personnel est très attentif.", rating: 4.6, avatar: "" },
      { name: "Romain V.", date: "Il y a 1 mois", text: "Une pépite cachée à Cotonou. Décoration raffinée.", rating: 4.8, avatar: "" },
      { name: "Camille D.", date: "Il y a 3 semaines", text: "Service personnalisé, je me suis sentie comme chez moi.", rating: 4.7, avatar: "" }
    ]
  }
];




const PropertyCard = ({ property, showDescription = false, onNavigate }: any) => (
  <div className="group cursor-pointer" onClick={() => onNavigate?.({ name: 'listing', id: property.id.toString() })}>
    <div className="relative overflow-hidden rounded-2xl">
      <img src={property.image} alt={property.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
      <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10">
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
          <Star className="w-4 h-4 text-[#00c9a7] fill-current" />
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


const asset = (filename: string) => `/src/app/assets/${filename}`;

const themeImages = {
  nature: [asset("oiseaux.jpg"), asset("soleil.jpg"), asset("pêche.jpg"), asset("pêche1.jpg")],
  culture: [asset("culture.jpg"), asset("culture1.jpg"), asset("culture2.jpg"), asset("culture4.jpg")],
  artisanat: [asset("artisanat.jpg"), asset("artisanat1.jpg"), asset("artisanat2.jpg"), asset("artisanat3.jpg")],
  cuisine: [asset("repas.jpg"), asset("repas3.jpg"), asset("repas4.jpg"), asset("repas5.jpg")],
  aventure: [asset("pêche2.jpg"), asset("pêche3.jpg"), asset("pêche4.jpg"), asset("pêche5.jpg")],
  musique: [asset("danse.jpg"), asset("sortie.jpg"), asset("marché.jpg"), asset("marché1.jpg")],
  plage: [asset("soleil.jpg"), asset("oiseaux.jpg"), asset("pêche.jpg"), asset("pêche1.jpg")],
};

const generateReviews = (title: string, location: string) => [
  { name: "Voyageur", location: "Cotonou, Bénin", daysAgo: "il y a 2 jours", text: `Expérience incroyable : "${title}" à ${location} !`, rating: 5.0 },
  { name: "Exploratrice", location: "Porto-Novo, Bénin", daysAgo: "il y a 5 jours", text: `Très bonne organisation, je recommande.`, rating: 4.9 },
  { name: "Passionné", location: "Abomey, Bénin", daysAgo: "il y a 1 semaine", text: `Immersion authentique dans la culture locale.`, rating: 5.0 },
];

// ========== EXPÉRIENCES RECOMMANDÉES ==========
const originalsExperiences = [
  { id: 1, title: "Atelier de teinture adire et batik béninois", location: "Abomey, Bénin", price: 45, priceType: "par voyageur", rating: 4.98, images: themeImages.artisanat, hostType: "Particulier", reviews: generateReviews("Atelier", "Abomey"), description: "Apprenez l'art traditionnel de la teinture.", duration: "3h" },
  { id: 2, title: "Immersion vaudou et marché d'Ouidah", location: "Ouidah, Bénin", price: 35, priceType: "par voyageur", rating: 4.92, images: themeImages.culture, hostType: "Local", reviews: generateReviews("Immersion", "Ouidah"), description: "Découvrez les mystères du vaudou.", duration: "4h" },
  { id: 3, title: "Danse gèlèdé et percussions à Grand-Popo", location: "Grand-Popo, Bénin", price: 50, priceType: "par groupe", rating: 4.95, images: themeImages.musique, hostType: "Professionnel", reviews: generateReviews("Danse", "Grand-Popo"), description: "Initiez-vous aux danses traditionnelles.", duration: "2h" },
  { id: 4, title: "Pêche traditionnelle sur le lac Nokoué", location: "Cotonou, Bénin", price: 40, priceType: "par voyageur", rating: 4.90, images: themeImages.nature, hostType: "Local", reviews: generateReviews("Pêche", "lac Nokoué"), description: "Partez pêcher avec les locaux.", duration: "4h" },
  { id: 5, title: "Balade culturelle au palais royal d'Abomey", location: "Abomey, Bénin", price: 55, priceType: "par voyageur", rating: 4.93, images: themeImages.culture, hostType: "Particulier", reviews: generateReviews("Palais", "Abomey"), description: "Visite guidée des palais royaux.", duration: "3h" },
  { id: 6, title: "Cours de cuisine locale : yassa et akassa", location: "Porto-Novo, Bénin", price: 30, priceType: "par voyageur", rating: 4.97, images: themeImages.cuisine, hostType: "Particulier", reviews: generateReviews("Cuisine", "Porto-Novo"), description: "Apprenez les plats traditionnels.", duration: "3h" },
  { id: 7, title: "Safari photo des oiseaux de Pendjari", location: "Parakou, Bénin", price: 65, priceType: "par groupe", rating: 4.89, images: themeImages.nature, hostType: "Professionnel", reviews: generateReviews("Safari", "Pendjari"), description: "Observation des oiseaux.", duration: "Journée" },
  { id: 8, title: "Atelier de sculpture sur bois béninois", location: "Lokossa, Bénin", price: 28, priceType: "par voyageur", rating: 4.91, images: themeImages.artisanat, hostType: "Particulier", reviews: generateReviews("Sculpture", "Lokossa"), description: "Initiez-vous à la sculpture.", duration: "2h" },
];

// ========== EXPÉRIENCES · COTONOU ==========
const cotonouExperiences = [
  { id: 101, title: "Balade en pirogue sur le lac Nokoué", location: "Cotonou, Bénin", price: 42, priceType: "par voyageur", rating: 4.95, images: themeImages.nature, hostType: "Local", reviews: generateReviews("Pirogue", "lac Nokoué"), description: "Découvrez le lac en pirogue.", duration: "2h" },
  { id: 102, title: "Atelier de batik et teinture", location: "Cotonou, Bénin", price: 38, priceType: "par voyageur", rating: 4.92, images: themeImages.artisanat, hostType: "Artisan", reviews: generateReviews("Batik", "Cotonou"), description: "Créez vos propres tissus.", duration: "3h" },
  { id: 103, title: "Marché Dantokpa : cuisine de rue", location: "Cotonou, Bénin", price: 29, priceType: "par voyageur", rating: 4.88, images: themeImages.cuisine, hostType: "Local", reviews: generateReviews("Marché", "Cotonou"), description: "Découverte culinaire.", duration: "2h" },
  { id: 104, title: "Visite du centre culturel", location: "Cotonou, Bénin", price: 20, priceType: "par voyageur", rating: 4.84, images: themeImages.culture, hostType: "Guide", reviews: generateReviews("Culturel", "Cotonou"), description: "Découverte artistique.", duration: "2h" },
  { id: 105, title: "Circuit street art", location: "Cotonou, Bénin", price: 33, priceType: "par voyageur", rating: 4.90, images: themeImages.culture, hostType: "Artiste", reviews: generateReviews("Street art", "Cotonou"), description: "Street art et créateurs.", duration: "3h" },
  { id: 106, title: "Excursion à Ganvié", location: "Cotonou, Bénin", price: 47, priceType: "par voyageur", rating: 4.97, images: themeImages.aventure, hostType: "Guide", reviews: generateReviews("Ganvié", "Cotonou"), description: "Village sur pilotis.", duration: "4h" },
  { id: 107, title: "Marchés nocturnes", location: "Cotonou, Bénin", price: 25, priceType: "par voyageur", rating: 4.86, images: themeImages.culture, hostType: "Local", reviews: generateReviews("Nocturne", "Cotonou"), description: "Ambiance nocturne.", duration: "2h" },
  { id: 108, title: "Soirée percussions", location: "Cotonou, Bénin", price: 44, priceType: "par groupe", rating: 4.93, images: themeImages.musique, hostType: "Musicien", reviews: generateReviews("Musique", "Cotonou"), description: "Musique au bord du lagon.", duration: "3h" },
];

// ========== EXPÉRIENCES · PORTO-NOVO ==========
const portonovoExperiences = [
  { id: 201, title: "Marché d'Adjohoun", location: "Porto-Novo, Bénin", price: 32, priceType: "par voyageur", rating: 4.90, images: themeImages.cuisine, hostType: "Local", reviews: generateReviews("Adjohoun", "Porto-Novo"), description: "Visite et dégustation.", duration: "2h" },
  { id: 202, title: "Cours de cuisine béninoise", location: "Porto-Novo, Bénin", price: 29, priceType: "par voyageur", rating: 4.97, images: themeImages.cuisine, hostType: "Chef", reviews: generateReviews("Cuisine", "Porto-Novo"), description: "Apprenez les recettes locales.", duration: "3h" },
  { id: 203, title: "Balade au musée Honmè", location: "Porto-Novo, Bénin", price: 22, priceType: "par voyageur", rating: 4.92, images: themeImages.culture, hostType: "Guide", reviews: generateReviews("Honmè", "Porto-Novo"), description: "Histoire et culture.", duration: "2h" },
  { id: 204, title: "Tissus traditionnels", location: "Porto-Novo, Bénin", price: 27, priceType: "par voyageur", rating: 4.89, images: themeImages.artisanat, hostType: "Artisan", reviews: generateReviews("Tissus", "Porto-Novo"), description: "Découverte des tissus.", duration: "2h" },
  { id: 205, title: "Randonnée culturelle", location: "Porto-Novo, Bénin", price: 34, priceType: "par voyageur", rating: 4.91, images: themeImages.nature, hostType: "Guide", reviews: generateReviews("Randonnée", "Porto-Novo"), description: "Parc forestier.", duration: "3h" },
  { id: 206, title: "Atelier percussion", location: "Porto-Novo, Bénin", price: 45, priceType: "par groupe", rating: 4.96, images: themeImages.musique, hostType: "Musicien", reviews: generateReviews("Percussion", "Porto-Novo"), description: "Initiez-vous aux percussions.", duration: "2h" },
  { id: 207, title: "Croisière sur l'Ouémé", location: "Porto-Novo, Bénin", price: 39, priceType: "par voyageur", rating: 4.94, images: themeImages.nature, hostType: "Capitaine", reviews: generateReviews("Croisière", "Porto-Novo"), description: "Coucher de soleil.", duration: "2h" },
  { id: 208, title: "Légendes fon", location: "Porto-Novo, Bénin", price: 25, priceType: "par voyageur", rating: 4.88, images: themeImages.culture, hostType: "Conteur", reviews: generateReviews("Légendes", "Porto-Novo"), description: "Initiation aux légendes.", duration: "2h" },
];

// ========== EXPÉRIENCES · OUIDAH ==========
const ouidahExperiences = [
  { id: 301, title: "Cérémonie vaudou guidée", location: "Ouidah, Bénin", price: 44, priceType: "par voyageur", rating: 4.96, images: themeImages.culture, hostType: "Prêtre", reviews: generateReviews("Vaudou", "Ouidah"), description: "Cérémonie authentique.", duration: "3h" },
  { id: 302, title: "Atelier sculpture sur bois", location: "Ouidah, Bénin", price: 38, priceType: "par voyageur", rating: 4.92, images: themeImages.artisanat, hostType: "Artisan", reviews: generateReviews("Sculpture", "Ouidah"), description: "Apprenez la sculpture.", duration: "2h" },
  { id: 303, title: "Musée des Pêches", location: "Ouidah, Bénin", price: 26, priceType: "par voyageur", rating: 4.88, images: themeImages.culture, hostType: "Guide", reviews: generateReviews("Pêches", "Ouidah"), description: "Visite guidée.", duration: "2h" },
  { id: 304, title: "Plage et contes", location: "Ouidah, Bénin", price: 30, priceType: "par voyageur", rating: 4.90, images: themeImages.plage, hostType: "Conteur", reviews: generateReviews("Contes", "Ouidah"), description: "Balade contée.", duration: "2h" },
  { id: 305, title: "Route des esclaves", location: "Ouidah, Bénin", price: 34, priceType: "par voyageur", rating: 4.94, images: themeImages.culture, hostType: "Historien", reviews: generateReviews("Esclaves", "Ouidah"), description: "Histoire et mémoire.", duration: "3h" },
  { id: 306, title: "Cuisine de rue", location: "Ouidah, Bénin", price: 29, priceType: "par voyageur", rating: 4.89, images: themeImages.cuisine, hostType: "Cuisinier", reviews: generateReviews("Cuisine", "Ouidah"), description: "Poissons au feu de bois.", duration: "2h" },
  { id: 307, title: "Percussions fon", location: "Ouidah, Bénin", price: 42, priceType: "par groupe", rating: 4.95, images: themeImages.musique, hostType: "Musicien", reviews: generateReviews("Percussions", "Ouidah"), description: "Percussions traditionnelles.", duration: "2h" },
  { id: 308, title: "Savoir-faire du tisserand", location: "Ouidah, Bénin", price: 36, priceType: "par voyageur", rating: 4.91, images: themeImages.artisanat, hostType: "Artisan", reviews: generateReviews("Tissage", "Ouidah"), description: "Découverte du tissage.", duration: "2h" },
];

// ========== EXPÉRIENCES · GRAND-POPO ==========
const grandpopoExperiences = [
  { id: 401, title: "Danse gèlèdé sur la plage", location: "Grand-Popo, Bénin", price: 42, priceType: "par groupe", rating: 4.95, images: themeImages.musique, hostType: "Danseur", reviews: generateReviews("Danse", "Grand-Popo"), description: "Cours de danse sur la plage.", duration: "2h" },
  { id: 402, title: "Atelier de coquillages", location: "Grand-Popo, Bénin", price: 30, priceType: "par voyageur", rating: 4.90, images: themeImages.plage, hostType: "Artisan", reviews: generateReviews("Coquillages", "Grand-Popo"), description: "Balade et création.", duration: "2h" },
  { id: 403, title: "Cuisine de la côte", location: "Grand-Popo, Bénin", price: 35, priceType: "par voyageur", rating: 4.92, images: themeImages.cuisine, hostType: "Chef", reviews: generateReviews("Cuisine", "Grand-Popo"), description: "Spécialités côtières.", duration: "3h" },
  { id: 404, title: "Atelier de vannerie", location: "Grand-Popo, Bénin", price: 28, priceType: "par voyageur", rating: 4.89, images: themeImages.artisanat, hostType: "Artisan", reviews: generateReviews("Vannerie", "Grand-Popo"), description: "Apprenez la vannerie.", duration: "2h" },
  { id: 405, title: "Percussions au village", location: "Grand-Popo, Bénin", price: 39, priceType: "par groupe", rating: 4.94, images: themeImages.musique, hostType: "Musicien", reviews: generateReviews("Percussions", "Grand-Popo"), description: "Percussions villageoises.", duration: "2h" },
  { id: 406, title: "Pêcheurs de la lagune", location: "Grand-Popo, Bénin", price: 31, priceType: "par voyageur", rating: 4.91, images: themeImages.nature, hostType: "Pêcheur", reviews: generateReviews("Pêcheurs", "Grand-Popo"), description: "Rencontre avec les pêcheurs.", duration: "2h" },
  { id: 407, title: "Piquenique culturel", location: "Grand-Popo, Bénin", price: 27, priceType: "par voyageur", rating: 4.96, images: themeImages.nature, hostType: "Guide", reviews: generateReviews("Piquenique", "Grand-Popo"), description: "Piquenique et contes.", duration: "3h" },
  { id: 408, title: "Excursion mangrove", location: "Grand-Popo, Bénin", price: 48, priceType: "par voyageur", rating: 4.93, images: themeImages.nature, hostType: "Guide", reviews: generateReviews("Mangrove", "Grand-Popo"), description: "Découverte de la mangrove.", duration: "3h" },
];

// ========== EXPÉRIENCES · ABOMEY ==========
const abomeyExperiences = [
  { id: 501, title: "Visite des palais royaux", location: "Abomey, Bénin", price: 52, priceType: "par voyageur", rating: 4.96, images: themeImages.culture, hostType: "Guide", reviews: generateReviews("Palais", "Abomey"), description: "Découverte des palais.", duration: "3h" },
  { id: 502, title: "Atelier fabrication percussions", location: "Abomey, Bénin", price: 37, priceType: "par voyageur", rating: 4.92, images: themeImages.musique, hostType: "Artisan", reviews: generateReviews("Percussions", "Abomey"), description: "Fabriquez vos percussions.", duration: "2h" },
  { id: 503, title: "Rituels royaux", location: "Abomey, Bénin", price: 45, priceType: "par voyageur", rating: 4.94, images: themeImages.culture, hostType: "Guide", reviews: generateReviews("Rituels", "Abomey"), description: "Initiation aux rituels.", duration: "2h" },
  { id: 504, title: "Tissage et teinture", location: "Abomey, Bénin", price: 29, priceType: "par voyageur", rating: 4.90, images: themeImages.artisanat, hostType: "Artisan", reviews: generateReviews("Tissage", "Abomey"), description: "Atelier textile.", duration: "2h" },
];

// ========== AUTRES VILLES ==========
const parakouExperiences = [
  { id: 601, title: "Safari dans la Pendjari", location: "Parakou, Bénin", price: 120, priceType: "par groupe", rating: 4.97, images: themeImages.nature, hostType: "Guide", reviews: generateReviews("Safari", "Parakou"), description: "Journée safari.", duration: "Journée" },
];

const natitingouExperiences = [
  { id: 701, title: "Découverte des Tata Somba", location: "Natitingou, Bénin", price: 55, priceType: "par voyageur", rating: 4.99, images: themeImages.culture, hostType: "Local", reviews: generateReviews("Tata", "Natitingou"), description: "Habitats fortifiés.", duration: "3h" },
];

const dassaExperiences = [
  { id: 801, title: "Escalade des collines sacrées", location: "Dassa-Zoumè, Bénin", price: 28, priceType: "par voyageur", rating: 4.92, images: themeImages.aventure, hostType: "Guide", reviews: generateReviews("Collines", "Dassa"), description: "Excursion aux collines.", duration: "3h" },
];

const bohiconExperiences = [
  { id: 901, title: "Musée d'histoire", location: "Bohicon, Bénin", price: 18, priceType: "par voyageur", rating: 4.86, images: themeImages.culture, hostType: "Guide", reviews: generateReviews("Histoire", "Bohicon"), description: "Visite du musée.", duration: "2h" },
];

const lokossaExperiences = [
  { id: 1001, title: "Poterie traditionnelle", location: "Lokossa, Bénin", price: 28, priceType: "par voyageur", rating: 4.91, images: themeImages.artisanat, hostType: "Artisan", reviews: generateReviews("Poterie", "Lokossa"), description: "Atelier de poterie.", duration: "2h" },
];

const savalouExperiences = [
  { id: 1101, title: "Fabrication de tambours", location: "Savalou, Bénin", price: 38, priceType: "par voyageur", rating: 4.96, images: themeImages.musique, hostType: "Artisan", reviews: generateReviews("Tambours", "Savalou"), description: "Fabriquez des tambours.", duration: "2h" },
];

const ketouExperiences = [
  { id: 1201, title: "Palais royal de Kétou", location: "Kétou, Bénin", price: 22, priceType: "par voyageur", rating: 4.89, images: themeImages.culture, hostType: "Guide", reviews: generateReviews("Palais", "Kétou"), description: "Visite du palais.", duration: "2h" },
];

const pobeExperiences = [
  { id: 1301, title: "Plantation d'huile de palme", location: "Pobè, Bénin", price: 28, priceType: "par voyageur", rating: 4.90, images: themeImages.nature, hostType: "Agriculteur", reviews: generateReviews("Palme", "Pobè"), description: "Visite de plantation.", duration: "2h" },
];

// ========== TOUTES LES EXPÉRIENCES ==========
const allExperiences = [
  ...originalsExperiences,
  ...cotonouExperiences,
  ...portonovoExperiences,
  ...ouidahExperiences,
  ...grandpopoExperiences,
  ...abomeyExperiences,
  ...parakouExperiences,
  ...natitingouExperiences,
  ...dassaExperiences,
  ...bohiconExperiences,
  ...lokossaExperiences,
  ...savalouExperiences,
  ...ketouExperiences,
  ...pobeExperiences,
];



// ==================== SERVICES PAGE ====================
const ServiceDetailModal = ({ service, onClose }: { service: any; onClose: () => void }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showAllDetails, setShowAllDetails] = useState(false);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % service.images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + service.images.length) % service.images.length);

  const getServiceSteps = (service: any) => [
    `Prise de contact et confirmation de rendez-vous à ${service.location}`,
    `Déroulement du service selon vos besoins spécifiques`,
    `Réalisation de la prestation par un professionnel qualifié`,
    `Suivi de satisfaction et facturation`,
  ];

  const serviceSteps = getServiceSteps(service);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 text-[#0F2940]">
      <div className="mx-auto max-w-6xl bg-white rounded-[32px] shadow-2xl overflow-hidden">
        {/* En-tête */}
        <div className="flex flex-col gap-4 border-b border-gray-200 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm text-gray-500">{service.location}</p>
            <h2 className="text-3xl font-semibold text-[#0F2940] mt-2">{service.title}</h2>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>{service.rating} · {service.reviews} évaluations</span>
              <span>Hôte : {service.hostType}</span>
              <span>À partir de {service.price} € / {service.priceType}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full border border-gray-200 bg-white p-3 text-gray-700 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr] p-6">
          {/* Colonne gauche - Détails */}
          <div className="space-y-6">
            {/* Galerie d'images */}
            <div className="relative">
              <div className="grid grid-cols-4 gap-2">
                {service.images.slice(0, 4).map((img: string, idx: number) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Photo ${idx + 1}`} 
                    className="h-32 w-full rounded-xl object-cover cursor-pointer hover:opacity-80 transition-opacity" 
                    onClick={() => setCurrentImage(idx)}
                  />
                ))}
              </div>
              <div className="relative mt-2 overflow-hidden rounded-2xl">
                <img 
                  src={service.images[currentImage]} 
                  alt={service.title} 
                  className="w-full h-96 object-cover transition-all duration-300" 
                />
                {service.images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 hover:bg-white transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={nextImage} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur rounded-full p-2 hover:bg-white transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {service.images.map((_: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImage(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${currentImage === idx ? 'w-6 bg-white' : 'bg-white/50'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-[#0F2940] mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{service.longDescription || service.description}</p>
            </div>

            {/* Déroulement du service */}
            <div>
              <h3 className="text-xl font-semibold text-[#0F2940] mb-4">Déroulement</h3>
              <div className="space-y-3">
                {serviceSteps.map((step: string, idx: number) => (
                  <div key={idx} className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                    <p className="font-semibold">{`Étape ${idx + 1}`}</p>
                    <p className="mt-2 text-sm text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Équipements inclus */}
            <div>
              <h3 className="text-xl font-semibold text-[#0F2940] mb-4">Ce qui est inclus</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-gray-700"><Check className="w-5 h-5 text-[#00c9a7]" />Service professionnel</div>
                <div className="flex items-center gap-2 text-gray-700"><Check className="w-5 h-5 text-[#00c9a7]" />Personnel qualifié</div>
                <div className="flex items-center gap-2 text-gray-700"><Check className="w-5 h-5 text-[#00c9a7]" />Matériel fourni</div>
                <div className="flex items-center gap-2 text-gray-700"><Check className="w-5 h-5 text-[#00c9a7]" />Assistance prioritaire</div>
              </div>
            </div>

            {/* Avis clients */}
            <div>
              <h3 className="text-xl font-semibold text-[#0F2940] mb-4">Avis des clients</h3>
              <div className="space-y-4">
                {service.reviews?.map((review: any, idx: number) => (
                  <div key={idx} className="rounded-3xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#0F2940]">{review.name}</p>
                        <p className="text-sm text-gray-500">{review.location} · {review.daysAgo}</p>
                      </div>
                      <span className="rounded-full bg-[#00c9a7]/10 px-3 py-1 text-sm text-[#0F2940]">{review.rating.toFixed(1)}</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-700">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite - Réservation */}
          <aside className="space-y-6 rounded-3xl border border-gray-200 bg-[#f8fafb] p-6">
            {/* Prix */}
            <div className="text-center">
              <span className="text-4xl font-bold text-[#0F2940]">{service.price} €</span>
              <span className="text-gray-500"> / {service.priceType}</span>
            </div>

            {/* À savoir */}
            <div>
              <p className="text-sm font-semibold text-gray-700">À savoir</p>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#00c9a7]" />Durée : {service.duration}</li>
                <li className="flex items-center gap-2"><Users className="w-4 h-4 text-[#00c9a7]" />Service personnalisé</li>
                <li className="flex items-center gap-2"><Star className="w-4 h-4 text-[#00c9a7]" />Service professionnel certifié</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00c9a7]" />Annulation gratuite 24h avant</li>
              </ul>
            </div>

            {/* Lieu */}
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">Lieu du service</p>
              <p className="mt-2 font-medium text-[#0F2940]">{service.location}</p>
            </div>

            {/* Bouton de réservation */}
            <button className="w-full rounded-full bg-[#00c9a7] px-5 py-3 text-sm font-semibold text-[#0F2940] hover:bg-[#00b892] transition-colors shadow-md hover:shadow-lg">
              Réserver ce service
            </button>
            <p className="text-center text-xs text-gray-500">Aucun débit pour le moment</p>
          </aside>
        </div>
      </div>
    </div>
  );
};



const benefits = [
  { title: "Publier facilement", description: "Ajoutez votre logement en quelques minutes et atteignez des voyageurs du monde entier.", icon: Home },
  { title: "Gérer vos revenus", description: "Suivez vos réservations, vos gains et vos performances en temps réel.", icon: Sparkles },
  { title: "Séjour sécurisé", description: "Bénéficiez d'un système de réservation sécurisé et d'un support fiable.", icon: ShieldCheck },
];

// ========== COMPOSANT DE CONNEXION GOOGLE ==========
const GoogleLoginModal = ({ onSuccess, onClose }: { onSuccess: (userData: any) => void; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleLogin = () => {
    onSuccess({
      email: "deboralokossou.dev@gmail.com",
      firstName: "Débora",
      lastName: "LOKOSSOU",
      googleId: "123456789"
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#0F2940]">{isSignUp ? "Créer un compte" : "Se connecter"}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-3 px-4 hover:bg-gray-50 transition-colors mb-4">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          <span className="font-medium">Continuer avec Google</span>
        </button>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">ou</span></div>
        </div>
        
        <input type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]" />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]" />
        
        <button className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-full font-semibold hover:bg-[#00b892] transition-colors">{isSignUp ? "S'inscrire" : "Se connecter"}</button>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}
          <button onClick={() => setIsSignUp(!isSignUp)} className="ml-1 text-[#00c9a7] font-medium">{isSignUp ? "Se connecter" : "S'inscrire"}</button>
        </p>
      </div>
    </div>
  );
};

// ========== FORMULAIRE D'INSCRIPTION ==========
const RegistrationForm = ({ userData, onComplete, onBack }: { userData: any; onComplete: (data: any) => void; onBack: () => void }) => {
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    birthDate: "",
    email: userData?.email || "",
    receivePromotions: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.email) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto p-4">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#0F2940]">Maintenant, créons votre compte</h2>
            <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
          </div>
          <p className="text-gray-600 mb-6">Ces informations sont obligatoires pour effectuer une réservation ou accueillir des voyageurs.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom officiel</label>
              <div className="grid grid-cols-2 gap-4">
                <div><input type="text" placeholder="Prénom" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]" required /></div>
                <div><input type="text" placeholder="Nom" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]" required /></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Veillez à ce que le nom corresponde à celui qui figure sur votre pièce d'identité.</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
              <input type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]" required />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse e-mail</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]" required />
              <p className="text-xs text-gray-500 mt-2">Nous vous enverrons vos confirmations de voyage et vos reçus par e-mail.</p>
            </div>
            
            {userData?.googleId && <p className="text-sm text-gray-500 mb-4">Toutes les informations préremplies proviennent de Google.</p>}
            
            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.receivePromotions} onChange={(e) => setFormData({...formData, receivePromotions: e.target.checked})} className="w-4 h-4 rounded border-gray-300 focus:ring-[#00c9a7]" />
                <span className="text-sm text-gray-600">Je ne souhaite pas recevoir de promotions Airbnb.</span>
              </label>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-500">En sélectionnant Accepter et continuer, j'accepte les Conditions de service, les Conditions de service relatives aux paiements et la Politique de non-discrimination et je reconnais avoir pris connaissance de la Politique de confidentialité.</p>
            </div>
            
            <button type="submit" className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-full font-semibold hover:bg-[#00b892] transition-colors">Accepter et continuer</button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ========== ENGAGEMENT COMMUNAUTAIRE ==========
const CommunityCommitment = ({ onAccept, onBack }: { onAccept: () => void; onBack: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#0F2940]">Tout le monde a sa place ici</h2>
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-gray-700 mb-4">Lorsque vous rejoignez Airbnb, nous vous demandons d'accepter notre engagement de la communauté :</p>
        <div className="bg-[#f4fffe] rounded-xl p-6 mb-6">
          <p className="text-[#0F2940] italic">"Je m'engage à traiter avec respect et sans préjugés chacun des membres de la communauté, quels que soient sa couleur de peau, sa religion, sa nationalité, son origine, son handicap, son sexe, son identité de genre, son orientation sexuelle ou son âge."</p>
        </div>
        <button onClick={onAccept} className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-full font-semibold hover:bg-[#00b892] transition-colors">Accepter</button>
      </div>
    </div>
  );
};

// ========== ÉTAPES FACILES ==========
const EasySteps = ({ onContinue, onQuit }: { onContinue: () => void; onQuit: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#0F2940]">Commencer sur Airbnb, c'est facile</h2>
          <button onClick={onQuit} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-[#00c9a7]/20 rounded-full flex items-center justify-center text-[#00c9a7] font-bold text-xl">1</div>
            <div><h3 className="font-semibold text-[#0F2940]">Parlez-nous de votre logement</h3><p className="text-sm text-gray-600">Donnez-nous quelques informations de base, par exemple indiquez-nous où il se trouve et combien de voyageurs il peut accueillir.</p></div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-[#00c9a7]/20 rounded-full flex items-center justify-center text-[#00c9a7] font-bold text-xl">2</div>
            <div><h3 className="font-semibold text-[#0F2940]">Faites en sorte de vous démarquer</h3><p className="text-sm text-gray-600">Ajoutez au moins 5 photos, un titre et une description. Nous allons vous aider.</p></div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-[#00c9a7]/20 rounded-full flex items-center justify-center text-[#00c9a7] font-bold text-xl">3</div>
            <div><h3 className="font-semibold text-[#0F2940]">Terminez et publiez</h3><p className="text-sm text-gray-600">Choisissez un prix de départ, vérifiez quelques détails, puis publiez votre annonce.</p></div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-8">
          <button onClick={onQuit} className="flex-1 border border-gray-300 py-3 rounded-full text-[#0F2940] hover:bg-gray-50 transition-colors">Quitter</button>
          <button onClick={onContinue} className="flex-1 bg-[#00c9a7] text-[#0F2940] py-3 rounded-full font-semibold hover:bg-[#00b892] transition-colors">Commencer</button>
        </div>
      </div>
    </div>
  );
};

// ========== MODAL DE RECHERCHE DE LOCALISATION ==========
const LocationSearchModal = ({ onClose, onCoHostAvailable }: { onClose: () => void; onCoHostAvailable: (available: boolean) => void }) => {
  const [location, setLocation] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<{ available: boolean; message: string } | null>(null);

  const handleSearch = () => {
    if (!location.trim()) { alert("Veuillez entrer une localisation"); return; }
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      const isAvailable = location.length > 5;
      setResult({ available: isAvailable, message: isAvailable ? "✅ Un co-hôte est disponible dans votre région !" : "❌ Aucun co-hôte disponible dans cette zone." });
      onCoHostAvailable(isAvailable);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#0F2940]">Vérifier la disponibilité d'un co-hôte</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3">Entrez la localisation de votre logement pour vérifier si un co-hôte est disponible à proximité.</p>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Ex: Cotonou, Haie Vive, Fidjrossè..." value={location} onChange={(e) => setLocation(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]" />
            </div>
            <button onClick={handleSearch} disabled={searching} className="w-full mt-3 bg-[#00c9a7] text-[#0F2940] py-2 rounded-full font-semibold hover:bg-[#00b892] transition-colors">
              {searching ? "Recherche en cours..." : "Vérifier la disponibilité"}
            </button>
          </div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00c9a7] to-[#0F2940] flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>
        {result && (<div className={`p-4 rounded-xl ${result.available ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}><p className="text-sm">{result.message}</p></div>)}
        <button onClick={onClose} className="w-full mt-4 border border-gray-300 py-2 rounded-full">Fermer</button>
      </div>
    </div>
  );
};

// ========== FORMULAIRE PRINCIPAL DE LOGEMENT ==========
const PropertyForm = ({ onSaveAndQuit, userData, onGoToDashboard }: { onSaveAndQuit: () => void; userData: any; onGoToDashboard: () => void }) => {
  const [step, setStep] = useState(1);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [coHostAvailable, setCoHostAvailable] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    propertyType: "", guests: 1, bedrooms: 1, beds: 1, bathrooms: 1, address: "", city: "", photos: [] as string[], title: "", description: "", price: 50
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const totalSteps = 3;

  const handleNext = () => { if (step < totalSteps) setStep(step + 1); };
  const handlePrev = () => { if (step > 1) setStep(step - 1); };
  const handleCheckCoHost = () => setShowLocationModal(true);
  const handleSaveAndQuit = () => { localStorage.setItem("hostPropertyData", JSON.stringify(formData)); onSaveAndQuit(); };
  const handleGoToDashboard = () => { localStorage.setItem("hostPropertyData", JSON.stringify(formData)); onGoToDashboard(); };

  if (showLocationModal) return <LocationSearchModal onClose={() => setShowLocationModal(false)} onCoHostAvailable={setCoHostAvailable} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex justify-between items-center z-20">
        <button onClick={() => setShowHelpModal(true)} className="flex items-center gap-2 text-[#00c9a7]"><HelpCircle className="w-5 h-5" />Questions</button>
        <div className="flex items-center gap-2"><div className="text-sm text-gray-500">Étape {step}/{totalSteps}</div><button onClick={handleSaveAndQuit} className="text-sm text-gray-500 hover:text-gray-700">Enregistrer et quitter</button></div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {step === 1 && (
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="bg-gradient-to-br from-[#0F2940] to-[#1a3f5c] rounded-3xl p-8 text-white">
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80" alt="Immeuble" className="w-full h-64 object-cover rounded-2xl mb-6" />
              <h3 className="text-2xl font-bold mb-2">Parlez-nous de votre logement</h3>
              <p className="text-white/80">Donnez-nous quelques informations de base, par exemple indiquez-nous où il se trouve et combien de voyageurs il peut accueillir.</p>
            </div>
            <div className="space-y-6">
              <div><label className="block text-sm font-medium mb-2">Type de logement</label><select value={formData.propertyType} onChange={(e) => setFormData({...formData, propertyType: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl"><option value="">Sélectionnez</option><option>Appartement</option><option>Maison</option><option>Villa</option><option>Studio</option><option>Chambre privée</option></select></div>
              <div><label className="block text-sm font-medium mb-2">Nombre de voyageurs</label><input type="number" value={formData.guests} onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" min="1" /></div>
              <div className="grid grid-cols-3 gap-4"><div><label>Chambres</label><input type="number" value={formData.bedrooms} onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" min="1" /></div><div><label>Lits</label><input type="number" value={formData.beds} onChange={(e) => setFormData({...formData, beds: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" min="1" /></div><div><label>Salles de bain</label><input type="number" value={formData.bathrooms} onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" step="0.5" min="0.5" /></div></div>
              <div><label className="block text-sm font-medium mb-2">Adresse</label><input type="text" placeholder="Rue, numéro" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
              <div><label className="block text-sm font-medium mb-2">Ville</label><input type="text" placeholder="Cotonou, Porto-Novo, etc." value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div><label className="block text-sm font-medium mb-2">Photos (au moins 5)</label><div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"><Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-500">Cliquez ou glissez pour ajouter des photos</p><p className="text-xs text-gray-400 mt-1">Ajoutez au moins 5 photos pour vous démarquer</p></div></div>
            <div><label className="block text-sm font-medium mb-2">Titre de l'annonce</label><input type="text" placeholder="Un titre accrocheur" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-2">Description</label><textarea rows={5} placeholder="Décrivez votre logement, ses atouts, le quartier..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" /></div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div><label className="block text-sm font-medium mb-2">Prix par nuit (FCFA)</label><input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full px-4 py-3 border border-gray-200 rounded-xl" min="1" /></div>
            <div className="bg-gray-50 rounded-xl p-4"><h3 className="font-semibold mb-2">Récapitulatif</h3><div className="space-y-2 text-sm"><p><span className="text-gray-500">Type :</span> {formData.propertyType || "Non renseigné"}</p><p><span className="text-gray-500">Voyageurs :</span> {formData.guests}</p><p><span className="text-gray-500">Chambres/Lits/SDB :</span> {formData.bedrooms}/{formData.beds}/{formData.bathrooms}</p><p><span className="text-gray-500">Adresse :</span> {formData.address}, {formData.city}</p><p><span className="text-gray-500">Prix :</span> {formData.price} FCFA / nuit</p></div></div>
            <button className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-full font-semibold hover:bg-[#00b892] transition-colors">Publier l'annonce</button>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-4 border-t">
          <button onClick={handlePrev} disabled={step === 1} className={`px-6 py-2 rounded-full ${step === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "border border-gray-300 hover:bg-gray-50"}`}><ChevronLeft className="w-5 h-5 inline" /> Retour</button>
          <button onClick={handleNext} disabled={step === totalSteps} className={`px-6 py-2 rounded-full ${step === totalSteps ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#00c9a7] text-[#0F2940] font-semibold"}`}>Suivant <ChevronRight className="w-5 h-5 inline" /></button>
        </div>
      </div>

      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold text-[#0F2940]">Des questions ?</h2><button onClick={() => setShowHelpModal(false)} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button></div>
            <button onClick={handleCheckCoHost} className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-colors border mb-3"><div className="flex items-center gap-3"><MessageCircle className="w-5 h-5 text-[#00c9a7]" /><div><h3 className="font-semibold text-[#0F2940]">Discutez avec un Superhôte</h3><p className="text-xs text-gray-500">Recevez des réponses à vos questions rapidement.</p></div></div></button>
            <button onClick={handleGoToDashboard} className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-colors border"><div className="flex items-center gap-3"><UserPlus className="w-5 h-5 text-[#00c9a7]" /><div><h3 className="font-semibold text-[#0F2940]">Faites appel à un co-hôte local</h3><p className="text-xs text-gray-500">Gérez votre logement avec un co-hôte professionnel.</p></div></div></button>
          </div>
        </div>
      )}
    </div>
  );
};

// ========== DASHBOARD HÔTE ==========
const HostDashboard = ({ onLogout, userData }: { onLogout: () => void; userData: any }) => {
  const [activeTab, setActiveTab] = useState<"today" | "calendar" | "listings" | "messages">("today");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onLogout} className="text-gray-500 hover:text-gray-700"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-xl font-semibold text-[#0F2940]">Espace hôte</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200">
              <User className="w-4 h-4" /> {userData?.firstName || "Hôte"}
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 pb-2 flex gap-1 overflow-x-auto">
          <button onClick={() => setActiveTab("today")} className={`px-5 py-2 rounded-full text-sm font-medium ${activeTab === "today" ? "bg-[#00c9a7] text-[#0F2940]" : "hover:bg-gray-100"}`}>Aujourd'hui</button>
          <button onClick={() => setActiveTab("calendar")} className={`px-5 py-2 rounded-full text-sm font-medium ${activeTab === "calendar" ? "bg-[#00c9a7] text-[#0F2940]" : "hover:bg-gray-100"}`}>Calendrier</button>
          <button onClick={() => setActiveTab("listings")} className={`px-5 py-2 rounded-full text-sm font-medium ${activeTab === "listings" ? "bg-[#00c9a7] text-[#0F2940]" : "hover:bg-gray-100"}`}>Annonces</button>
          <button onClick={() => setActiveTab("messages")} className={`px-5 py-2 rounded-full text-sm font-medium ${activeTab === "messages" ? "bg-[#00c9a7] text-[#0F2940]" : "hover:bg-gray-100"}`}>Messages</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-5">
        {activeTab === "today" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-r from-[#0F2940] to-[#1a3f5c] rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Bienvenue, {userData?.firstName || "Hôte"} !</h2>
                <p className="text-white/80">Votre espace de gestion vous permet de suivre vos réservations, gérer vos annonces et communiquer avec vos voyageurs.</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-[#0F2940] mb-4">Résumé de votre activité</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-xl"><p className="text-2xl font-bold text-[#00c9a7]">0</p><p className="text-sm text-gray-500">Annonces</p></div>
                  <div className="p-4 bg-gray-50 rounded-xl"><p className="text-2xl font-bold text-[#00c9a7]">0</p><p className="text-sm text-gray-500">Réservations</p></div>
                  <div className="p-4 bg-gray-50 rounded-xl"><p className="text-2xl font-bold text-[#00c9a7]">0</p><p className="text-sm text-gray-500">Messages</p></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#0F2940] mb-3">Conseils pour bien démarrer</h3>
              <ul className="space-y-3 text-sm text-gray-600"><li>✓ Complétez votre profil</li><li>✓ Ajoutez des photos de qualité</li><li>✓ Définissez un prix compétitif</li><li>✓ Répondez rapidement aux messages</li></ul>
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#0F2940] mb-4">Calendrier des disponibilités</h2>
            <div className="grid grid-cols-7 gap-2">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(day => <div key={day} className="text-center font-medium py-2">{day}</div>)}
              {Array.from({ length: 35 }).map((_, i) => (<div key={i} className="text-center p-3 border rounded-xl hover:bg-gray-50 cursor-pointer"><span className="text-sm">{i + 1}</span></div>))}
            </div>
          </div>
        )}

        {activeTab === "listings" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center py-12">
            <p className="text-gray-500 mb-4">Vous n'avez pas encore d'annonce</p>
            <button className="bg-[#00c9a7] text-[#0F2940] px-6 py-2 rounded-full font-semibold">Créer ma première annonce</button>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center py-12">
            <p className="text-gray-500">Aucun message pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
};



const getMapUrl = (query: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

// ==================== MODAL CHECKOUT ====================
const CheckoutModal = ({ property, checkIn, checkOut, guests, totalPrice, onClose }: any) => {
  const [paymentMethod, setPaymentMethod] = useState<"mtn" | "orange" | "card">("mtn");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Paiement de ${totalPrice.toLocaleString()} FCFA via ${
      paymentMethod === 'mtn' ? 'MTN Mobile Money' : paymentMethod === 'orange' ? 'Orange Money' : 'Carte bancaire'
    } accepté. Merci pour votre réservation !`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Confirmer et payer</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-col lg:flex-row h-full overflow-y-auto">
          <div className="lg:w-3/5 p-6 space-y-6 border-r">
            <div>
              <h3 className="font-semibold text-lg mb-2">Choisissez quand vous souhaitez payer</h3>
              <div className="space-y-2">
                <div className="border rounded-lg p-3 border-[#00c9a7] bg-[#00c9a7]/5">
                  <div className="flex justify-between"><span className="font-medium">Payez {totalPrice.toLocaleString()} FCFA maintenant</span><span>✓</span></div>
                  <div className="text-xs text-gray-500">Paiement immédiat, non remboursable</div>
                </div>
                <div className="border rounded-lg p-3 border-gray-200 opacity-50">
                  <div className="flex justify-between"><span>Payer en 3 fois avec Klarna</span><span>Indisponible</span></div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Ajoutez un mode de paiement</h3>
              <div className="flex gap-3 flex-wrap mb-4">
                <button onClick={() => setPaymentMethod("mtn")} className={`flex items-center gap-2 px-4 py-2 rounded-full border ${paymentMethod === "mtn" ? "border-[#00c9a7] bg-[#00c9a7]/5" : "border-gray-300"}`}>
                  <Smartphone className="w-4 h-4"/> MTN Mobile Money
                </button>
                <button onClick={() => setPaymentMethod("orange")} className={`flex items-center gap-2 px-4 py-2 rounded-full border ${paymentMethod === "orange" ? "border-[#00c9a7] bg-[#00c9a7]/5" : "border-gray-300"}`}>
                  <Smartphone className="w-4 h-4"/> Orange Money
                </button>
                <button onClick={() => setPaymentMethod("card")} className={`flex items-center gap-2 px-4 py-2 rounded-full border ${paymentMethod === "card" ? "border-[#00c9a7] bg-[#00c9a7]/5" : "border-gray-300"}`}>
                  <CreditCard className="w-4 h-4"/> Carte bancaire
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                {(paymentMethod === "mtn" || paymentMethod === "orange") && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Numéro de téléphone</label>
                    <div className="flex items-center border rounded-lg p-2">
                      <Phone className="w-5 h-5 text-gray-400 mr-2" />
                      <input type="tel" placeholder="XX XX XX XX" className="flex-1 outline-none" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                    </div>
                  </div>
                )}
                {paymentMethod === "card" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Numéro de carte</label>
                      <input type="text" placeholder="1234 5678 9012 3456" className="w-full border rounded-lg p-2" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label>Date d'expiration</label><input type="text" placeholder="MM/AA" className="w-full border rounded-lg p-2" value={expiry} onChange={(e) => setExpiry(e.target.value)} required /></div>
                      <div><label>CVV</label><input type="text" placeholder="123" className="w-full border rounded-lg p-2" value={cvv} onChange={(e) => setCvv(e.target.value)} required /></div>
                    </div>
                  </>
                )}
                <button type="submit" className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-lg font-semibold mt-4 hover:bg-[#00b892] transition-colors">Confirmer et payer</button>
              </form>
              <p className="text-xs text-gray-500 text-center mt-3">Vos informations sont sécurisées.</p>
            </div>
          </div>
          <div className="lg:w-2/5 bg-gray-50 p-6 space-y-4">
            <div className="flex gap-4">
              <img src={property.image} alt={property.title} className="w-20 h-20 rounded-lg object-cover" />
              <div>
                <h3 className="font-semibold">{property.title}</h3>
                <div className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 fill-current text-[#00c9a7]" /><span>{property.rating}</span><span className="text-gray-500">({property.reviews})</span></div>
                <div className="text-xs text-green-600 font-semibold mt-1">Coup de cœur voyageurs</div>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-sm"><span>Dates</span><span className="font-medium">{checkIn} – {checkOut}</span></div>
              <div className="flex justify-between text-sm mt-2"><span>Voyageurs</span><span className="font-medium">{guests} adulte{guests > 1 ? 's' : ''}</span></div>
              <button className="text-[#00c9a7] text-sm mt-2 underline">Modifier</button>
            </div>
            <div className="border-t pt-3">
              <h4 className="font-semibold mb-2">Détail du prix</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>{property.priceNumber.toLocaleString()} FCFA x 2 nuits</span><span>{(property.priceNumber * 2).toLocaleString()} FCFA</span></div>
                <div className="flex justify-between"><span>Taxes</span><span>{(property.priceNumber * 2 * 0.1).toLocaleString()} FCFA</span></div>
                <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>{totalPrice.toLocaleString()} FCFA</span></div>
              </div>
            </div>
            <div className="bg-[#0F2940]/10 rounded-lg p-3 text-sm text-[#0F2940]">
              <p className="font-semibold">Perle rare !</p>
              <p>Les réservations pour ce logement sont fréquentes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MODAL DE DÉTAIL ====================
const PropertyDetailModal = ({ property, onClose, onReserve }: { property: HotelProperty; onClose: () => void; onReserve: () => void }) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [checkIn, setCheckIn] = useState("15/05/2026");
  const [checkOut, setCheckOut] = useState("17/05/2026");
  const [guests, setGuests] = useState(1);
  const [selectedPriceOption, setSelectedPriceOption] = useState<"non-remboursable" | "remboursable">("non-remboursable");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Valeurs par défaut pour éviter les erreurs
  const images = property.images && Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : [property.image, property.image, property.image, property.image, property.image];
    
  const host = property.host || "Hôte vérifié";
  const hostImage = property.hostImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80";
  const hostSince = property.hostSince || "1 an";
  const superhost = property.superhost ?? true;
  const responseRate = property.responseRate || 95;
  const responseTime = property.responseTime || "dans l'heure";
  const longDescription = property.longDescription || property.description;
  const amenities = property.amenities || ["Wifi", "Climatisation", "TV", "Parking", "Eau chaude", "Petit déjeuner"];
  const testimonials = property.testimonials || [
    { name: "Marie", date: "mars 2026", text: "Excellent séjour, hôtel magnifique !", rating: 5 },
    { name: "Jean", date: "février 2026", text: "Très bien situé, personnel accueillant.", rating: 4.8 },
    { name: "Sophie", date: "janvier 2026", text: "Je recommande vivement, rapport qualité-prix exceptionnel.", rating: 4.9 }
  ];

  const nights = 2;
  const subtotal = property.priceNumber * nights;
  const cleaningFee = 15000;
  const serviceFee = 12000;
  const total = subtotal + cleaningFee + serviceFee;
  const nonRefundableTotal = total;
  const refundableTotal = total + 35000;

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setAnimate(true);
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setAnimate(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Filtrer les images pour avoir exactement 4 images supplémentaires
  const extraImages = images.slice(1, 5);
  // S'assurer qu'il y a au moins 4 images, sinon répéter
  while (extraImages.length < 4) {
    extraImages.push(property.image);
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex justify-between items-center">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-110">
            <ArrowLeft className="w-5 h-5"/>
          </button>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-110">
              <Share2 className="w-5 h-5"/>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-110">
              <Heart className="w-5 h-5"/>
            </button>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Galerie d'images principale */}
          <div className="relative grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-6 group">
            <div className="col-span-2 row-span-2 overflow-hidden cursor-pointer" onClick={() => setSelectedImageIndex(0)}>
              <img 
                src={images[0]} 
                alt={property.title} 
                className="w-full h-full object-cover min-h-[300px] transition-transform duration-700 group-hover:scale-105" 
              />
            </div>
            {images.slice(1, 5).map((img, i) => (
              <div key={i} className="overflow-hidden cursor-pointer" onClick={() => setSelectedImageIndex(i + 1)}>
                <img 
                  src={img} 
                  alt={`${property.title} - ${i + 2}`} 
                  className="w-full h-36 object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
            ))}
            <button className="absolute bottom-4 right-4 bg-white rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all hover:bg-gray-100">
              Afficher toutes les photos
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Colonne de gauche - Informations */}
            <div className="lg:col-span-2 space-y-8">
              {/* Informations principales */}
              <div className="border-b pb-4">
                <div className="text-sm text-gray-500">
                  Hôtel de luxe · {property.beds} chambres · {property.beds} lits · {property.baths} sdb
                </div>
                <h1 className="text-3xl font-semibold text-[#0F2940] mt-2">{property.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-5 h-5 fill-current text-[#00c9a7]" />
                  <span className="font-medium">{property.rating}</span>
                  <span className="text-gray-500">· {property.reviews} commentaires</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-[#00c9a7] font-medium">Superhôte</span>
                </div>
              </div>

              {/* Badge coup de cœur */}
              <div className="bg-[#00c9a7]/10 rounded-xl p-5 flex gap-4 items-center">
                <Crown className="w-10 h-10 text-[#00c9a7]" />
                <div>
                  <div className="font-semibold text-lg text-[#0F2940]">Coup de cœur · voyageurs</div>
                  <div className="text-gray-600">Un des hôtels préférés des voyageurs au Bénin</div>
                </div>
              </div>

              {/* Informations hôte */}
              <div className="flex gap-5 items-start">
                <img 
                  src={hostImage} 
                  alt={host} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#00c9a7] shadow-lg" 
                />
                <div>
                  <div className="font-semibold text-xl text-[#0F2940]">Hôte : {host}</div>
                  {superhost && (
                    <div className="flex items-center gap-1 text-[#00c9a7]">
                      <Award className="w-4 h-4"/>Superhôte · {hostSince}
                    </div>
                  )}
                  <div className="text-sm text-gray-600">
                    Taux de réponse {responseRate}% · Répond {responseTime}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
                {longDescription && longDescription !== property.description && (
                  <p className="text-gray-700 mt-3 leading-relaxed">{longDescription}</p>
                )}
              </div>

              {/* Équipements */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-xl text-[#0F2940]">Équipements premium</h3>
                  <button onClick={() => setShowAllAmenities(!showAllAmenities)} className="text-[#00c9a7] text-sm underline">
                    Voir tout
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {(showAllAmenities ? amenities : amenities.slice(0, 6)).map((a, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <Check className="w-5 h-5 text-[#00c9a7]"/>{a}
                    </div>
                  ))}
                </div>
              </div>

              {/* Témoignages */}
              <div className="bg-gradient-to-r from-[#0F2940]/5 to-[#00c9a7]/5 rounded-2xl p-6">
                <h3 className="font-semibold text-xl text-[#0F2940] mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#00c9a7]" />
                  Ce que nos clients disent
                </h3>
                <div>
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="relative">
                      <img 
                        src={testimonials[currentTestimonial]?.avatar || `https://ui-avatars.com/api/?background=00c9a7&color=fff&name=${testimonials[currentTestimonial]?.name?.charAt(0) || 'U'}`} 
                        alt={testimonials[currentTestimonial]?.name || "Client"}
                        className="w-20 h-20 rounded-full object-cover border-4 border-[#00c9a7] shadow-xl" 
                      />
                      <div className="absolute -bottom-2 -right-2 bg-[#00c9a7] rounded-full p-1">
                        <Star className="w-4 h-4 fill-white text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="font-bold text-lg text-[#0F2940]">{testimonials[currentTestimonial]?.name || "Client"}</span>
                        <span className="text-sm text-gray-500">{testimonials[currentTestimonial]?.date || "récemment"}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(testimonials[currentTestimonial]?.rating || 5) ? 'fill-current text-[#00c9a7]' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">{testimonials[currentTestimonial]?.rating || 5}</span>
                      </div>
                      <p className="text-gray-700 mt-3 leading-relaxed">"{testimonials[currentTestimonial]?.text || "Excellent séjour !"}"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendrier */}
              <div className="border rounded-xl p-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-[#0F2940]">2 nuits à {property.location.split(',')[0]}</h3>
                  <button onClick={() => setShowCalendar(!showCalendar)} className="text-[#00c9a7] text-sm underline">
                    Sélectionner
                  </button>
                </div>
                {showCalendar && (
                  <div className="mt-4 border rounded-lg p-4">
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {["L","M","M","J","V","S","D"].map(d => <div key={d} className="font-medium text-gray-500">{d}</div>)}
                      {Array.from({length: 35}).map((_, i) => <button key={i} className="aspect-square rounded-full hover:bg-[#00c9a7]/20">{i+1}</button>)}
                    </div>
                  </div>
                )}
                <div className="text-sm text-gray-500 mt-3">
                  <Calendar className="inline w-4 h-4 mr-1"/>{checkIn} — {checkOut}
                </div>
              </div>
            </div>

            {/* Colonne de droite - Réservation + 4 images supplémentaires */}
            <div className="lg:col-span-1 space-y-6">
              {/* Bloc de réservation */}
              <div className="sticky top-24 border rounded-2xl p-6 shadow-xl bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold text-[#0F2940]">{property.priceNumber.toLocaleString()} FCFA</span>
                    <span className="text-gray-500"> / nuit</span>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-current text-[#00c9a7]"/>{property.rating}
                  </div>
                </div>
                <div className="border rounded-xl my-5 overflow-hidden">
                  <div className="flex">
                    <div className="flex-1 p-3 border-r">
                      <div className="text-xs font-bold text-gray-500 uppercase">Arrivée</div>
                      <div className="font-medium">{checkIn}</div>
                    </div>
                    <div className="flex-1 p-3">
                      <div className="text-xs font-bold text-gray-500 uppercase">Départ</div>
                      <div className="font-medium">{checkOut}</div>
                    </div>
                  </div>
                  <div className="p-3 border-t">
                    <div className="text-xs font-bold text-gray-500 uppercase">Voyageurs</div>
                    <div className="font-medium">{guests} adulte</div>
                  </div>
                </div>
                <div className="space-y-3 mb-5">
                  <div className={`border rounded-xl p-3 cursor-pointer transition-all ${selectedPriceOption === "non-remboursable" ? "border-[#00c9a7] bg-[#00c9a7]/5 shadow-md" : ""}`} onClick={() => setSelectedPriceOption("non-remboursable")}>
                    <div className="flex justify-between font-medium">
                      <span>Non remboursable</span>
                      <span>{nonRefundableTotal.toLocaleString()} FCFA</span>
                    </div>
                    <div className="text-xs text-gray-500">Paiement immédiat</div>
                  </div>
                  <div className="border rounded-xl p-3 cursor-not-allowed opacity-50">
                    <div className="flex justify-between">
                      <span>Remboursable</span>
                      <span>{refundableTotal.toLocaleString()} FCFA</span>
                    </div>
                    <div className="text-xs text-gray-500">Annulation gratuite avant le 10 mai</div>
                  </div>
                </div>
                <button 
                  onClick={onReserve} 
                  className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-xl font-bold text-lg hover:bg-[#00b892] transition-all hover:scale-105 transform shadow-md"
                >
                  Réserver
                </button>
                <p className="text-center text-xs text-gray-500 mt-3">Aucun débit pour le moment</p>
              </div>

              {/* 4 images supplémentaires à côté de la carte */}
              <div className="border rounded-2xl p-4 bg-gray-50">
                <h3 className="font-semibold text-[#0F2940] mb-3 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#00c9a7]" />
                  Plus de photos
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {extraImages.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => setSelectedImageIndex(idx + 1)}
                    >
                      <img 
                        src={img} 
                        alt={`${property.title} - supplément ${idx + 1}`} 
                        className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const PropertyCard = ({ property, showDescription = false, onNavigate }: any) => (
//   <div className="group cursor-pointer" onClick={() => onNavigate?.({ name: 'listing', id: property.id.toString() })}>
//     <div className="relative overflow-hidden rounded-2xl">
//       <img src={property.image} alt={property.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
//       <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10">
//         <Heart className="w-5 h-5" />
//       </button>
//     </div>
//     <div className="mt-3">
//       <div className="flex justify-between items-start gap-4">
//         <div>
//           <h3 className="font-semibold text-[#0F2940]">{property.title}</h3>
//           <p className="text-sm text-gray-500 mt-1">{property.location}</p>
//         </div>
//         <div className="flex items-center gap-1 text-sm text-gray-500">
//           <Star className="w-4 h-4 text-[#00c9a7] fill-current" />
//           <span className="font-medium text-[#0F2940]">{property.rating}</span>
//           <span>({property.reviews})</span>
//         </div>
//       </div>
//       {showDescription && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{property.description}</p>}
//       <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
//         <div className="flex items-center gap-1"><Bed className="w-4 h-4" /><span>{property.beds} lits</span></div>
//         <div className="flex items-center gap-1"><Bath className="w-4 h-4" /><span>{property.baths} sdb</span></div>
//       </div>
//       <p className="mt-3 font-semibold text-[#0F2940]">{property.priceDisplay}</p>
//     </div>
//   </div>
// );

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


// ==================== PAGE POPULAR (VERSION COMPLÈTE AVEC CARTE) ====================
export function PopularPage({ onNavigate }: PageProps) {
  
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [detailProperty, setDetailProperty] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [checkIn, setCheckIn] = useState("15/05/2026");
  const [checkOut, setCheckOut] = useState("17/05/2026");
  const [guests, setGuests] = useState(1);
  const [selectedPriceOption, setSelectedPriceOption] = useState<"non-remboursable" | "remboursable">("non-remboursable");

  // Données complètes pour la page Popular
  const popularPropertiesFull = [
    { id: 1, title: "Villa luxueuse avec piscine", location: "Fidjrossè, Cotonou, Bénin", price: "125 000 FCFA / nuit", priceNumber: 125000, rating: 4.9, reviews: 128, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80", beds: 4, baths: 3, description: "Magnifique villa avec piscine privée...", images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80", "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"], host: "Sophie Martin", hostImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", hostSince: "3 ans", superhost: true, responseRate: 98, responseTime: "dans l'heure", amenities: ["Piscine privée", "Wifi", "Climatisation", "Cuisine équipée", "Parking gratuit", "Jardin", "Terrasse", "Personnel"], longDescription: "Cette magnifique villa offre un cadre luxueux avec sa piscine privée, son jardin tropical et sa vue imprenable." },
    { id: 2, title: "Appartement moderne vue mer", location: "Haie Vive, Cotonou, Bénin", price: "85 000 FCFA / nuit", priceNumber: 85000, rating: 4.8, reviews: 94, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80", beds: 2, baths: 2, description: "Appartement chic avec vue sur l'océan...", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"], host: "Jean Dupont", hostImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", hostSince: "2 ans", superhost: true, responseRate: 96, responseTime: "dans l'heure", amenities: ["Vue mer", "Terrasse", "Wifi", "Climatisation", "Cuisine", "TV", "Parking"], longDescription: "Appartement entièrement rénové avec vue imprenable sur l'océan." },
    { id: 3, title: "Studio cosy centre ville", location: "Cocotiers, Cotonou, Bénin", price: "35 000 FCFA / nuit", priceNumber: 35000, rating: 4.7, reviews: 56, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80", beds: 1, baths: 1, description: "Studio confortable en plein cœur de Cotonou.", images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80", "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"], host: "Marie Claire", hostImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", hostSince: "1 an", superhost: false, responseRate: 92, responseTime: "quelques heures", amenities: ["Wifi", "Climatisation", "Mini-réfrigérateur", "TV", "Bureau"], longDescription: "Petit studio fonctionnel et bien situé, à proximité des commerces." },
    { id: 4, title: "Loft design avec rooftop", location: "Ganhi, Cotonou, Bénin", price: "95 000 FCFA / nuit", priceNumber: 95000, rating: 4.9, reviews: 42, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80", beds: 2, baths: 2, description: "Loft lumineux avec terrasse privée sur le toit." },
    { id: 5, title: "Maison de ville traditionnelle", location: "Akpakpa, Cotonou, Bénin", price: "55 000 FCFA / nuit", priceNumber: 55000, rating: 4.6, reviews: 67, image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80", beds: 3, baths: 2, description: "Maison authentique avec cour intérieure." },
    { id: 6, title: "Duplex moderne", location: "Patte d'Oie, Cotonou, Bénin", price: "110 000 FCFA / nuit", priceNumber: 110000, rating: 4.8, reviews: 33, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80", beds: 3, baths: 3, description: "Duplex contemporain avec grande terrasse." },
    { id: 7, title: "Villa de charme", location: "Fidjrossè, Cotonou, Bénin", price: "135 000 FCFA / nuit", priceNumber: 135000, rating: 4.9, reviews: 78, image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&q=80", beds: 4, baths: 3, description: "Villa raffinée avec piscine à débordement." },
    { id: 8, title: "Studio design", location: "Haie Vive, Cotonou, Bénin", price: "45 000 FCFA / nuit", priceNumber: 45000, rating: 4.7, reviews: 44, image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80", beds: 1, baths: 1, description: "Studio moderne, entièrement équipé." },
  ];

  const filterProperties = (properties: any[]) => {
    const filtered = [...properties];
    if (selectedFilter === "Prix croissant") return filtered.sort((a,b)=>a.priceNumber - b.priceNumber);
    if (selectedFilter === "Prix décroissant") return filtered.sort((a,b)=>b.priceNumber - a.priceNumber);
    if (selectedFilter === "Mieux notés") return filtered.sort((a,b)=>b.rating - a.rating);
    return filtered;
  };

  const displayedProperties = filterProperties(popularPropertiesFull);

  const handleReserve = (property: any) => {
    const total = property.priceNumber * 2 * 1.1;
    setCheckoutData({ property, checkIn: "15/05/2026", checkOut: "17/05/2026", guests: 1, totalPrice: total });
    setShowCheckout(true);
    setDetailProperty(null);
  };

  const handleNavigate = (route: Route) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  const getMapUrl = () => "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d634630.827254447!2d2.2569729!3d6.474903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1020a44f6b9c7e9b%3A0x9b4b5c1e4f5a6b7!2sBenin!5e0!3m2!1sfr!2sfr!4v1699999999999!5m2!1sfr!2sfr";

  // Modal de détail complet (seule cette partie change)
  const PropertyModal = ({ property, onClose, onReserve }: any) => {
    const images = property.images && Array.isArray(property.images) && property.images.length > 0 
      ? property.images 
      : [property.image, property.image, property.image, property.image];
      
    const host = property.host || "Hôte vérifié";
    const hostImage = property.hostImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80";
    const hostSince = property.hostSince || "1 an";
    const superhost = property.superhost ?? true;
    const responseRate = property.responseRate || 95;
    const responseTime = property.responseTime || "dans l'heure";
    const longDescription = property.longDescription || property.description;
    const amenities = property.amenities || ["Wifi", "Climatisation", "TV", "Parking", "Eau chaude", "Cuisine"];
    const testimonials = property.testimonials || [
      { name: "Marc", date: "mars 2026", text: "Logement magnifique, tout était parfait !", rating: 5 },
      { name: "Sophie", date: "février 2026", text: "Très bon séjour, je recommande vivement.", rating: 4.8 },
      { name: "Jean", date: "janvier 2026", text: "Excellent rapport qualité-prix, à refaire.", rating: 4.9 }
    ];

    const nights = 2;
    const subtotal = property.priceNumber * nights;
    const cleaningFee = 15000;
    const serviceFee = 12000;
    const total = subtotal + cleaningFee + serviceFee;
    const nonRefundableTotal = total;
    const refundableTotal = total + 35000;

  useEffect(() => {
      if (testimonials.length <= 1) return;
      const interval = setInterval(() => {
        setAnimate(true);
        setTimeout(() => {
          setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
          setAnimate(false);
        }, 300);
      }, 5000);
      return () => clearInterval(interval);
    }, [testimonials.length]);

    const extraImages = images.slice(1, 5);
    while (extraImages.length < 4) {
      extraImages.push(property.image);
    }

    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <div className="min-h-screen">
          <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex justify-between items-center">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-110">
              <ArrowLeft className="w-5 h-5"/>
            </button>
            <div className="flex gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-110">
                <Share2 className="w-5 h-5"/>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-110">
                <Heart className="w-5 h-5"/>
              </button>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Galerie d'images principale */}
            <div className="relative grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-6 group">
              <div className="col-span-2 row-span-2 overflow-hidden cursor-pointer" onClick={() => setSelectedImageIndex(0)}>
                <img 
                  src={images[0]} 
                  alt={property.title} 
                  className="w-full h-full object-cover min-h-[300px] transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              {images.slice(1, 5).map((img: string, i: number) => (
                <div key={i} className="overflow-hidden cursor-pointer" onClick={() => setSelectedImageIndex(i + 1)}>
                  <img 
                    src={img} 
                    alt={`${property.title} - ${i + 2}`} 
                    className="w-full h-36 object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
              ))}
              <button className="absolute bottom-4 right-4 bg-white rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all hover:bg-gray-100">
                Afficher toutes les photos
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Colonne de gauche - Informations */}
              <div className="lg:col-span-2 space-y-8">
                <div className="border-b pb-4">
                  <div className="text-sm text-gray-500">
                    Logement entier · {property.beds} chambres · {property.beds} lits · {property.baths} sdb
                  </div>
                  <h1 className="text-3xl font-semibold text-[#0F2940] mt-2">{property.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-5 h-5 fill-current text-[#00c9a7]" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-gray-500">· {property.reviews} commentaires</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-[#00c9a7] font-medium">Superhôte</span>
                  </div>
                </div>

                <div className="bg-[#00c9a7]/10 rounded-xl p-5 flex gap-4 items-center">
                  <Crown className="w-10 h-10 text-[#00c9a7]" />
                  <div>
                    <div className="font-semibold text-lg text-[#0F2940]">Coup de cœur · voyageurs</div>
                    <div className="text-gray-600">Un des logements préférés des voyageurs au Bénin</div>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <img 
                    src={hostImage} 
                    alt={host} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#00c9a7] shadow-lg" 
                  />
                  <div>
                    <div className="font-semibold text-xl text-[#0F2940]">Hôte : {host}</div>
                    {superhost && (
                      <div className="flex items-center gap-1 text-[#00c9a7]">
                        <Award className="w-4 h-4"/>Superhôte · {hostSince}
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      Taux de réponse {responseRate}% · Répond {responseTime}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  {longDescription && longDescription !== property.description && (
                    <p className="text-gray-700 mt-3 leading-relaxed">{longDescription}</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-xl text-[#0F2940]">Équipements</h3>
                    <button onClick={() => setShowAllAmenities(!showAllAmenities)} className="text-[#00c9a7] text-sm underline">
                      Voir tout
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {(showAllAmenities ? amenities : amenities.slice(0, 6)).map((a: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-gray-700">
                        <Check className="w-5 h-5 text-[#00c9a7]"/>{a}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#0F2940]/5 to-[#00c9a7]/5 rounded-2xl p-6">
                  <h3 className="font-semibold text-xl text-[#0F2940] mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#00c9a7]" />
                    Ce que nos clients disent
                  </h3>
                  <div className={`transition-all duration-300 transform ${animate ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="relative">
                        <img 
                          src={testimonials[currentTestimonial]?.avatar || `https://ui-avatars.com/api/?background=00c9a7&color=fff&name=${testimonials[currentTestimonial]?.name?.charAt(0) || 'U'}`} 
                          alt={testimonials[currentTestimonial]?.name || "Client"}
                          className="w-20 h-20 rounded-full object-cover border-4 border-[#00c9a7] shadow-xl" 
                        />
                        <div className="absolute -bottom-2 -right-2 bg-[#00c9a7] rounded-full p-1">
                          <Star className="w-4 h-4 fill-white text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <span className="font-bold text-lg text-[#0F2940]">{testimonials[currentTestimonial]?.name || "Client"}</span>
                          <span className="text-sm text-gray-500">{testimonials[currentTestimonial]?.date || "récemment"}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(testimonials[currentTestimonial]?.rating || 5) ? 'fill-current text-[#00c9a7]' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">{testimonials[currentTestimonial]?.rating || 5}</span>
                        </div>
                        <p className="text-gray-700 mt-3 leading-relaxed">"{testimonials[currentTestimonial]?.text || "Excellent séjour !"}"</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-[#0F2940]">2 nuits à {property.location.split(',')[0]}</h3>
                    <button onClick={() => setShowCalendar(!showCalendar)} className="text-[#00c9a7] text-sm underline">
                      Sélectionner
                    </button>
                  </div>
                  {showCalendar && (
                    <div className="mt-4 border rounded-lg p-4">
                      <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        {["L","M","M","J","V","S","D"].map(d => <div key={d} className="font-medium text-gray-500">{d}</div>)}
                        {Array.from({length: 35}).map((_, i) => <button key={i} className="aspect-square rounded-full hover:bg-[#00c9a7]/20">{i+1}</button>)}
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-gray-500 mt-3">
                    <Calendar className="inline w-4 h-4 mr-1"/>{checkIn} — {checkOut}
                  </div>
                </div>
              </div>

              {/* Colonne de droite - Réservation */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 border rounded-2xl p-6 shadow-xl bg-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-3xl font-bold text-[#0F2940]">{property.priceNumber.toLocaleString()} FCFA</span>
                      <span className="text-gray-500"> / nuit</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current text-[#00c9a7]"/>{property.rating}
                    </div>
                  </div>
                  <div className="border rounded-xl my-5 overflow-hidden">
                    <div className="flex">
                      <div className="flex-1 p-3 border-r">
                        <div className="text-xs font-bold text-gray-500 uppercase">Arrivée</div>
                        <div className="font-medium">{checkIn}</div>
                      </div>
                      <div className="flex-1 p-3">
                        <div className="text-xs font-bold text-gray-500 uppercase">Départ</div>
                        <div className="font-medium">{checkOut}</div>
                      </div>
                    </div>
                    <div className="p-3 border-t">
                      <div className="text-xs font-bold text-gray-500 uppercase">Voyageurs</div>
                      <div className="font-medium">{guests} adulte</div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-5">
                    <div className={`border rounded-xl p-3 cursor-pointer transition-all ${selectedPriceOption === "non-remboursable" ? "border-[#00c9a7] bg-[#00c9a7]/5 shadow-md" : ""}`} onClick={() => setSelectedPriceOption("non-remboursable")}>
                      <div className="flex justify-between font-medium">
                        <span>Non remboursable</span>
                        <span>{nonRefundableTotal.toLocaleString()} FCFA</span>
                      </div>
                      <div className="text-xs text-gray-500">Paiement immédiat</div>
                    </div>
                    <div className="border rounded-xl p-3 cursor-not-allowed opacity-50">
                      <div className="flex justify-between">
                        <span>Remboursable</span>
                        <span>{refundableTotal.toLocaleString()} FCFA</span>
                      </div>
                      <div className="text-xs text-gray-500">Annulation gratuite avant le 10 mai</div>
                    </div>
                  </div>
                  <button 
                    onClick={onReserve} 
                    className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-xl font-bold text-lg hover:bg-[#00b892] transition-all hover:scale-105 transform shadow-md"
                  >
                    Réserver
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-3">Aucun débit pour le moment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CheckoutModalComponent = ({ property, totalPrice, onClose }: any) => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Confirmer la réservation</h2>
        <p className="mb-2">Total : {totalPrice.toLocaleString()} FCFA</p>
        <button onClick={onClose} className="w-full bg-[#00c9a7] py-3 rounded-xl font-bold">Confirmer</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-4 z-20">
        <button onClick={() => handleNavigate({ name: 'home' })} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-[#0F2940]">Logements populaires · Bénin</h1>
      </div>

      <div className="sticky top-[73px] bg-white border-b px-4 py-2 z-10">
        <div className="relative inline-block">
          <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300">
            <Filter className="w-4 h-4 text-[#00c9a7]"/><span>Trier : {selectedFilter}</span><ChevronDown className="w-4 h-4"/>
          </button>
          {showFilterDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-xl border w-40 z-20">
              {["Tous", "Prix croissant", "Prix décroissant", "Mieux notés"].map(f => (
                <div key={f} className="p-2 hover:bg-[#00c9a7]/10 cursor-pointer" onClick={() => { setSelectedFilter(f); setShowFilterDropdown(false); }}>
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        <div className="lg:w-1/2 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayedProperties.map(property => (
              <div key={property.id} className="border rounded-2xl p-4 hover:shadow-xl cursor-pointer" onClick={() => setDetailProperty(property)}>
                <img src={property.image} className="w-full h-48 object-cover rounded-xl" />
                <h3 className="font-semibold mt-2">{property.title}</h3>
                <p className="text-sm text-gray-500">{property.location}</p>
                <div className="flex items-center gap-1 mt-1"><Star className="w-4 h-4 fill-current text-[#00c9a7]"/>{property.rating} ({property.reviews})</div>
                <p className="font-bold mt-2">{property.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 h-96 lg:h-auto bg-gray-100 relative">
          <iframe title="Carte" src={getMapUrl()} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="w-full h-full" />
        </div>
      </div>

      {detailProperty && <PropertyModal property={detailProperty} onClose={() => setDetailProperty(null)} onReserve={() => handleReserve(detailProperty)} />}
      {showCheckout && checkoutData && <CheckoutModalComponent {...checkoutData} onClose={() => setShowCheckout(false)} />}
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

// ==================== EXPÉRIENCE PAGE ====================
export function ExperiencePage({ onNavigate }: PageProps) {
  const [selectedExperience, setSelectedExperience] = useState<any | null>(null);

  const asset = (filename: string) => `/src/app/assets/${filename}`;

  const themeImages = {
    nature: [asset("oiseaux.jpg"), asset("soleil.jpg"), asset("pêche.jpg"), asset("pêche1.jpg")],
    culture: [asset("culture.jpg"), asset("culture1.jpg"), asset("culture2.jpg"), asset("culture4.jpg")],
    artisanat: [asset("artisanat.jpg"), asset("artisanat1.jpg"), asset("artisanat2.jpg"), asset("artisanat3.jpg")],
    cuisine: [asset("repas.jpg"), asset("repas3.jpg"), asset("repas4.jpg"), asset("repas5.jpg")],
    aventure: [asset("pêche2.jpg"), asset("pêche3.jpg"), asset("pêche4.jpg"), asset("pêche5.jpg")],
    musique: [asset("danse.jpg"), asset("sortie.jpg"), asset("marché.jpg"), asset("marché1.jpg")],
    plage: [asset("soleil.jpg"), asset("oiseaux.jpg"), asset("pêche.jpg"), asset("pêche1.jpg")],
  };

  const generateReviews = (title: string, location: string) => [
    { name: "Voyageur", location: "Cotonou, Bénin", daysAgo: "il y a 2 jours", text: `Expérience incroyable : "${title}" à ${location} !`, rating: 5.0 },
    { name: "Exploratrice", location: "Porto-Novo, Bénin", daysAgo: "il y a 5 jours", text: `Très bonne organisation, je recommande.`, rating: 4.9 },
    { name: "Passionné", location: "Abomey, Bénin", daysAgo: "il y a 1 semaine", text: `Immersion authentique dans la culture locale.`, rating: 5.0 },
  ];

  // Toutes les expériences
  const allExperiences = [
    { id: 1, title: "Atelier de teinture adire et batik béninois", location: "Abomey, Bénin", price: 45, priceType: "pers", rating: 4.98, images: themeImages.artisanat, hostType: "Particulier", description: "Apprenez l'art traditionnel de la teinture.", duration: "3h", reviews: generateReviews("Atelier", "Abomey") },
    { id: 2, title: "Immersion vaudou et marché d'Ouidah", location: "Ouidah, Bénin", price: 35, priceType: "pers", rating: 4.92, images: themeImages.culture, hostType: "Local", description: "Découvrez les mystères du vaudou.", duration: "4h", reviews: generateReviews("Immersion", "Ouidah") },
    { id: 3, title: "Danse gèlèdé et percussions", location: "Grand-Popo, Bénin", price: 50, priceType: "groupe", rating: 4.95, images: themeImages.musique, hostType: "Professionnel", description: "Initiez-vous aux danses traditionnelles.", duration: "2h", reviews: generateReviews("Danse", "Grand-Popo") },
    { id: 4, title: "Pêche traditionnelle", location: "Lac Nokoué", price: 40, priceType: "pers", rating: 4.90, images: themeImages.nature, hostType: "Local", description: "Partez pêcher avec les locaux.", duration: "4h", reviews: generateReviews("Pêche", "lac Nokoué") },
    // Ajoutez toutes vos autres expériences ici
  ];

  const getProgramSteps = (exp: any) => [
    `Accueil et présentation au cœur de ${exp.location}`,
    `Découverte de l'histoire locale et des techniques utilisées`,
    `Mise en pratique avec votre guide ou artisan`,
    `Création d'un souvenir à emporter chez vous`,
  ];

  const ExperienceCard = ({ exp }: { exp: any }) => (
    <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" onClick={() => setSelectedExperience(exp)}>
      <div className="relative h-56 overflow-hidden">
        <img src={exp.images[0]} alt={exp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-3 right-3 p-2 rounded-full bg-white/80"><Heart className="w-4 h-4" /></div>
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">{exp.hostType}</div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-[#0F2940] text-base line-clamp-2">{exp.title}</h3>
          <div className="flex items-center gap-1"><Star className="w-3 h-3 fill-current text-[#00c9a7]" /><span className="text-xs font-medium">{exp.rating}</span></div>
        </div>
        <p className="text-xs text-gray-500 mb-2">{exp.location}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{exp.description}</p>
        <div><span className="font-bold text-[#0F2940] text-lg">{exp.price} €</span><span className="text-xs text-gray-500"> / {exp.priceType}</span></div>
      </div>
    </div>
  );

  const ExperienceDetailModal = ({ exp, onClose }: { exp: any; onClose: () => void }) => {
    const [imgIndex, setImgIndex] = useState(0);
    const steps = getProgramSteps(exp);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
        <div className="mx-auto max-w-6xl bg-white rounded-[32px] shadow-2xl overflow-hidden">
          <div className="flex justify-between border-b p-6">
            <div><h2 className="text-2xl font-semibold">{exp.title}</h2><p className="text-gray-500 mt-1">{exp.location}</p></div>
            <button onClick={onClose} className="rounded-full border p-2"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-2 mb-4">{exp.images.slice(0,4).map((img: string, idx: number) => (<img key={idx} src={img} className="h-32 w-full rounded-xl object-cover" />))}</div>
            <div><h3 className="text-lg font-semibold mb-2">Description</h3><p className="text-gray-700">{exp.description}</p></div>
            <div className="mt-4"><h3 className="text-lg font-semibold mb-2">Au programme</h3>{steps.map((step, idx) => (<div key={idx} className="rounded-xl border bg-gray-50 p-3 mt-2"><p className="font-semibold">Étape {idx + 1}</p><p className="text-sm">{step}</p></div>))}</div>
            <button className="mt-6 w-full bg-[#00c9a7] py-3 rounded-full font-semibold hover:bg-[#00b892]">Réserver ({exp.price}€)</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-4 z-20">
        <button onClick={() => onNavigate?.({ name: 'home' })} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-xl font-semibold text-[#0F2940]">Expériences au Bénin</h1>
      </div>

      {/* Bannière avec dégradé - titre et description uniquement */}
      <div className="bg-gradient-to-r from-[#00c9a7] to-[#0f2940] py-16 text-white text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Expériences de Bluefin-Immo</h1>
        <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto px-4">
          Découvrez des activités uniques organisées par des hôtes et artisans locaux du Bénin.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold text-[#0F2940] mb-6">Toutes les expériences</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {allExperiences.map(exp => (<ExperienceCard key={exp.id} exp={exp} />))}
        </div>
      </main>

      {selectedExperience && <ExperienceDetailModal exp={selectedExperience} onClose={() => setSelectedExperience(null)} />}
    </div>
  );
}


// ==================== SERVICES PAGE ====================
export function ServicesPage({ onNavigate }: PageProps) {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [modalCurrentImage, setModalCurrentImage] = useState(0);

  const asset = (filename: string) => `/src/app/assets/${filename}`;

  const generateServiceReviews = (title: string, location: string) => [
    { name: "Jean-Marc", location: "Cotonou", daysAgo: "il y a 3 jours", text: `Excellent service "${title}" à ${location}.`, rating: 5.0 },
    { name: "Fatima", location: "Porto-Novo", daysAgo: "il y a 1 semaine", text: `Très satisfaite, je recommande.`, rating: 4.9 },
    { name: "Lucien", location: "Abomey-Calavi", daysAgo: "il y a 2 jours", text: `Service impeccable, prix correct.`, rating: 5.0 },
  ];

  // Services aux voyageurs
  const travelServicesList = [
    { id: 1, title: "Transfert aéroport privé", location: "Cotonou, Bénin", price: 25, priceType: "trajet", rating: 4.9, reviews: 128, duration: "30-60 min", images: [asset("marché.jpg"), asset("marché1.jpg")], hostType: "Professionnel", description: "Prise en charge à l'aéroport.", longDescription: "Service premium avec chauffeur.", sousCategorie: "Transport", reviewsList: generateServiceReviews("Transfert", "Cotonou") },
    { id: 2, title: "Guide touristique privé", location: "Cotonou, Bénin", price: 45, priceType: "personne", rating: 4.95, reviews: 87, duration: "4h", images: [asset("culture.jpg"), asset("culture1.jpg")], hostType: "Local", description: "Découvrez les secrets de Cotonou.", longDescription: "Visite personnalisée.", sousCategorie: "Visite", reviewsList: generateServiceReviews("Guide", "Cotonou") },
  ];

  const hostServicesList = [
    { id: 101, title: "Ménage professionnel", location: "Cotonou", price: 25, priceType: "intervention", rating: 4.95, reviews: 156, duration: "2-3h", images: [asset("artisanat.jpg"), asset("artisanat1.jpg")], hostType: "Professionnel", description: "Nettoyage complet.", longDescription: "Linge de maison fourni.", sousCategorie: "Entretien", reviewsList: generateServiceReviews("Ménage", "Cotonou") },
  ];

  const professionalServicesList = [
    { id: 201, title: "Espace de coworking", location: "Cotonou", price: 10, priceType: "jour", rating: 4.92, reviews: 156, duration: "À la demande", images: [asset("pepas1.jpg"), asset("repa13.jpg")], hostType: "Professionnel", description: "Espace de travail partagé.", longDescription: "Accès 24h/24.", sousCategorie: "Bureau", reviewsList: generateServiceReviews("Coworking", "Cotonou") },
  ];

  const emergencyServicesList = [
    { id: 301, title: "Assistance médicale 24/7", location: "Cotonou", price: 50, priceType: "consultation", rating: 4.99, reviews: 203, duration: "24h/24", images: [asset("scrupture.jpg"), asset("scrupture1.jpg")], hostType: "Médecin", description: "Médecin disponible 24h/24.", longDescription: "Déplacement à domicile.", sousCategorie: "Urgence", reviewsList: generateServiceReviews("Assistance médicale", "Cotonou") },
  ];

  const exclusiveServicesList = [
    { id: 401, title: "Masseur à domicile", location: "Cotonou", price: 45, priceType: "séance", rating: 4.99, reviews: 123, duration: "1h", images: [asset("repas.jpg"), asset("repas3.jpg")], hostType: "Masseur", description: "Massage relaxant.", longDescription: "Masseur diplômé.", sousCategorie: "Bien-être", reviewsList: generateServiceReviews("Masseur", "Cotonou") },
  ];

  const serviceCategoriesList = ["Tous", "Services aux voyageurs", "Services aux hôtes", "Services professionnels", "Urgence & Assistance", "Services exclusifs"];

  const allServices = [...travelServicesList, ...hostServicesList, ...professionalServicesList, ...emergencyServicesList, ...exclusiveServicesList];

  const getServicesByCategory = () => {
    if (selectedCategory === "Tous") return allServices;
    if (selectedCategory === "Services aux voyageurs") return travelServicesList;
    if (selectedCategory === "Services aux hôtes") return hostServicesList;
    if (selectedCategory === "Services professionnels") return professionalServicesList;
    if (selectedCategory === "Urgence & Assistance") return emergencyServicesList;
    if (selectedCategory === "Services exclusifs") return exclusiveServicesList;
    return [];
  };

  const getServiceSteps = (service: any) => [
    `Prise de contact et confirmation de rendez-vous à ${service.location}`,
    `Déroulement du service selon vos besoins spécifiques`,
    `Réalisation de la prestation par un professionnel qualifié`,
    `Suivi de satisfaction et facturation`,
  ];

  const ServiceCard = ({ service }: { service: any }) => (
    <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" onClick={() => setSelectedService(service)}>
      <div className="relative h-48 overflow-hidden">
        <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-2 py-1 text-xs font-semibold text-[#00c9a7]">{service.sousCategorie}</div>
        <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">{service.location}</div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-[#0F2940] text-base line-clamp-2">{service.title}</h3>
          <div className="flex items-center gap-1"><Star className="w-3 h-3 fill-current text-[#00c9a7]" /><span className="text-xs font-medium">{service.rating}</span></div>
        </div>
        <p className="text-xs text-gray-500 mb-2">{service.duration}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{service.description}</p>
        <div><span className="font-bold text-[#0F2940] text-lg">{service.price} €</span><span className="text-xs text-gray-500"> / {service.priceType}</span></div>
      </div>
    </div>
  );

  const ServiceDetailModal = ({ service, onClose }: { service: any; onClose: () => void }) => {
    const [imgIndex, setImgIndex] = useState(0);
    const nextImg = () => setImgIndex((prev) => (prev + 1) % service.images.length);
    const prevImg = () => setImgIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
    const steps = getServiceSteps(service);
    const reviews = service.reviewsList || generateServiceReviews(service.title, service.location);

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 text-[#0F2940]">
        <div className="mx-auto max-w-6xl bg-white rounded-[32px] shadow-2xl overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-6 lg:flex-row lg:items-start lg:justify-between">
            <div><p className="text-sm text-gray-500">{service.location}</p><h2 className="text-3xl font-semibold mt-2">{service.title}</h2>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>{service.rating} · {service.reviews} évaluations</span>
              <span>Hôte : {service.hostType}</span>
              <span>{service.price} € / {service.priceType}</span>
            </div></div>
            <button onClick={onClose} className="rounded-full border p-3 hover:bg-gray-100"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr] p-6">
            <div className="space-y-6">
              <div className="relative">
                <div className="grid grid-cols-4 gap-2">
                  {service.images.slice(0,4).map((img: string, idx: number) => (<img key={idx} src={img} className="h-32 w-full rounded-xl object-cover cursor-pointer" onClick={() => setImgIndex(idx)} />))}
                </div>
                <div className="relative mt-2 overflow-hidden rounded-2xl">
                  <img src={service.images[imgIndex]} alt={service.title} className="w-full h-96 object-cover" />
                  {service.images.length > 1 && (<><button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"><ChevronLeft className="w-6 h-6" /></button><button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"><ChevronRight className="w-6 h-6" /></button></>)}
                </div>
              </div>
              <div><h3 className="text-xl font-semibold mb-4">Description</h3><p className="text-gray-700">{service.longDescription || service.description}</p></div>
              <div><h3 className="text-xl font-semibold mb-4">Déroulement</h3>{steps.map((step, idx) => (<div key={idx} className="rounded-3xl border bg-gray-50 p-4 mb-2"><p className="font-semibold">Étape {idx + 1}</p><p className="mt-2 text-sm">{step}</p></div>))}</div>
              <div><h3 className="text-xl font-semibold mb-4">Avis</h3>{reviews.map((review: any, idx: number) => (<div key={idx} className="rounded-3xl border p-4 mb-2"><div className="flex justify-between"><span className="font-semibold">{review.name}</span><span>{review.rating}⭐</span></div><p className="text-sm text-gray-600 mt-1">{review.text}</p></div>))}</div>
            </div>
            <aside className="space-y-6 rounded-3xl border bg-gray-50 p-6">
              <div className="text-center"><span className="text-4xl font-bold">{service.price} €</span><span className="text-gray-500"> / {service.priceType}</span></div>
              <div><p className="text-sm font-semibold">À savoir</p><ul className="mt-4 space-y-2 text-sm"><li>Durée : {service.duration}</li><li>Service professionnel certifié</li></ul></div>
              <button className="w-full rounded-full bg-[#00c9a7] py-3 font-semibold hover:bg-[#00b892]">Réserver</button>
            </aside>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-4 z-20">
        <button onClick={() => onNavigate?.({ name: 'home' })} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-xl font-semibold text-[#0F2940]">Services au Bénin</h1>
      </div>

      {/* Bannière avec dégradé - titre et description uniquement */}
      <div className="bg-gradient-to-r from-[#00c9a7] to-[#0f2940] py-16 text-white text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Services de Bluefin-Immo</h1>
        <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto px-4">
          Transport, ménage, assistance, bien-être et plus encore. Tous les services dont vous avez besoin, partout au Bénin.
        </p>
      </div>

      {/* Filtres par catégorie */}
      <div className="sticky top-[73px] bg-white border-b py-3 overflow-x-auto z-10">
        <div className="max-w-7xl mx-auto px-4 flex gap-2">
          {serviceCategoriesList.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? "bg-[#00c9a7] text-[#0F2940] shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{cat}</button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {getServicesByCategory().map(service => (<ServiceCard key={service.id} service={service} />))}
        </div>
      </main>

      {selectedService && <ServiceDetailModal service={selectedService} onClose={() => setSelectedService(null)} />}
    </div>
  );
}




// ========== PAGE PRINCIPALE BECOME HOST ==========
export function BecomeHost({ onNavigate }: PageProps) {
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showCommitment, setShowCommitment] = useState(false);
  const [showEasySteps, setShowEasySteps] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleStart = () => setShowGoogleLogin(true);
  const handleGoogleSuccess = (data: any) => { setUserData(data); setShowGoogleLogin(false); setShowRegistration(true); };
  const handleRegistrationComplete = () => { setShowRegistration(false); setShowCommitment(true); };
  const handleCommitmentAccept = () => { setShowCommitment(false); setShowEasySteps(true); };
  const handleEasyStepsContinue = () => { setShowEasySteps(false); setShowPropertyForm(true); };
  const handleEasyStepsQuit = () => onNavigate?.({ name: 'home' });
  const handleSaveAndQuit = () => { setShowPropertyForm(false); setShowDashboard(true); };
  const handleGoToDashboard = () => { setShowPropertyForm(false); setShowDashboard(true); };

  if (showGoogleLogin) return <GoogleLoginModal onSuccess={handleGoogleSuccess} onClose={() => onNavigate?.({ name: 'home' })} />;
  if (showRegistration) return <RegistrationForm userData={userData} onComplete={handleRegistrationComplete} onBack={() => { setShowRegistration(false); setShowGoogleLogin(true); }} />;
  if (showCommitment) return <CommunityCommitment onAccept={handleCommitmentAccept} onBack={() => { setShowCommitment(false); setShowRegistration(true); }} />;
  if (showEasySteps) return <EasySteps onContinue={handleEasyStepsContinue} onQuit={handleEasyStepsQuit} />;
  if (showPropertyForm) return <PropertyForm onSaveAndQuit={handleSaveAndQuit} userData={userData} onGoToDashboard={handleGoToDashboard} />;
  if (showDashboard) return <HostDashboard onLogout={() => setShowDashboard(false)} userData={userData} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-4">
        <button onClick={() => onNavigate?.({ name: 'home' })} className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <h1 className="text-2xl text-[#0F2940]">Devenir hôte</h1>
        <p className="text-sm text-gray-500 mt-2">Partagez votre logement et gagnez avec une expérience d'hébergement optimisée.</p>
      </div>

      <div className="px-5 py-8 grid gap-8 lg:grid-cols-[1fr_0.8fr] items-start">
        <div className="space-y-8">
          <div className="rounded-[2rem] bg-[#f4fffe] p-10">
            <h2 className="text-3xl text-[#0F2940] font-semibold mb-4">Héberger n'a jamais été aussi simple.</h2>
            <p className="text-gray-600 leading-relaxed">Notre site reprend l'ergonomie Airbnb pour proposer un parcours clair, un calendrier intuitif et une gestion des annonces adaptée aux hôtes africains.</p>
          </div>
          <div className="grid gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-3xl bg-[#00c9a7]/10 text-[#00c9a7] flex items-center justify-center mb-4"><Icon className="w-7 h-7" /></div>
                  <h3 className="text-lg text-[#0F2940] mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-[2rem] bg-[#0F2940] p-8 text-white">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[#00ffdb]">Hébergeurs</p>
            <h2 className="text-3xl font-semibold mt-4">Rejoignez la communauté</h2>
          </div>
          <p className="text-sm text-white/80 leading-relaxed mb-8">Créez votre annonce, gérez les réservations et proposez votre logement aux voyageurs locaux et internationaux.</p>
          <button onClick={handleStart} className="w-full rounded-2xl bg-[#00c9a7] py-4 text-[#0F2940] font-semibold hover:bg-[#00e0b0] transition-colors">Accéder à mon espace hôte</button>
        </div>
      </div>
    </div>
  );
}

// ==================== AUTH PAGE (INSCRIPTION / CONNEXION) ====================

export function AuthPage({ onNavigate }: PageProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    return newErrors;
  };

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName) newErrors.lastName = "Le nom est requis";
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est requis";
    else if (formData.password.length < 6) newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    return newErrors;
  };

  const validateForgot = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    
    let validationErrors = {};
    if (mode === "login") validationErrors = validateLogin();
    else if (mode === "signup") validationErrors = validateSignup();
    else validationErrors = validateForgot();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    // Simulation d'appel API
    setTimeout(() => {
      setLoading(false);
      if (mode === "login") {
        setSuccessMessage("Connexion réussie ! Redirection...");
        setTimeout(() => {
          onNavigate?.({ name: 'home' });
        }, 1500);
      } else if (mode === "signup") {
        setSuccessMessage("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        setTimeout(() => {
          setMode("login");
          setSuccessMessage("");
          setFormData({ ...formData, password: "", confirmPassword: "" });
        }, 2000);
      } else if (mode === "forgot") {
        setSuccessMessage("Un lien de réinitialisation a été envoyé à votre adresse email.");
        setTimeout(() => {
          setMode("login");
          setSuccessMessage("");
        }, 2000);
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage("Connexion avec Google réussie ! Redirection...");
      setTimeout(() => {
        onNavigate?.({ name: 'home' });
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4fffe] to-[#e8fffb]">
      {/* En-tête */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center gap-4 z-20">
        <button onClick={() => onNavigate?.({ name: 'home' })} className="p-2 rounded-full hover:bg-gray-100 transition-all">
          <ArrowLeft className="w-5 h-5 text-[#0F2940]" />
        </button>
        <h1 className="text-xl font-semibold text-[#0F2940]">
          {mode === "login" && "Connexion"}
          {mode === "signup" && "Créer un compte"}
          {mode === "forgot" && "Mot de passe oublié"}
        </h1>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Carte du formulaire */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8">
              {/* Logo / Titre */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-[#00c9a7] to-[#0f2940] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">B</span>
                </div>
                <h2 className="text-2xl font-bold text-[#0F2940]">
                  {mode === "login" && "Bienvenue !"}
                  {mode === "signup" && "Rejoignez Bluefin-Immo"}
                  {mode === "forgot" && "Besoin d'aide ?"}
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                  {mode === "login" && "Connectez-vous pour continuer"}
                  {mode === "signup" && "Créez votre compte en quelques secondes"}
                  {mode === "forgot" && "Entrez votre email pour réinitialiser votre mot de passe"}
                </p>
              </div>

              {/* Message de succès */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Champs pour l'inscription */}
                {mode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Jean"
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7] transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                          />
                        </div>
                        {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Dupont"
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7] transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`}
                          />
                        </div>
                        {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                  </>
                )}

                {/* Email */}
                {(mode === "login" || mode === "signup" || mode === "forgot") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="vous@exemple.com"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7] transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                )}

                {/* Mot de passe (sauf pour mot de passe oublié) */}
                {mode !== "forgot" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7] transition-all ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                  </div>
                )}

                {/* Confirmation mot de passe (uniquement pour inscription) */}
                {mode === "signup" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7] transition-all ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}

                {/* Lien mot de passe oublié */}
                {mode === "login" && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setErrors({});
                        setSuccessMessage("");
                      }}
                      className="text-sm text-[#00c9a7] hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#00c9a7] to-[#0f2940] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Chargement...</span>
                    </div>
                  ) : (
                    <>
                      {mode === "login" && "Se connecter"}
                      {mode === "signup" && "Créer mon compte"}
                      {mode === "forgot" && "Envoyer le lien"}
                    </>
                  )}
                </button>
              </form>

              {/* Séparateur */}
              {(mode === "login" || mode === "signup") && (
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-400">ou</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              )}

              {/* Bouton Google */}
              {(mode === "login" || mode === "signup") && (
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {mode === "login" ? "Continuer avec Google" : "S'inscrire avec Google"}
                  </span>
                </button>
              )}

              {/* Lien pour basculer entre connexion et inscription */}
              <div className="text-center mt-6">
                {mode === "login" && (
                  <p className="text-sm text-gray-500">
                    Pas encore de compte ?{" "}
                    <button
                      onClick={() => {
                        setMode("signup");
                        setErrors({});
                        setSuccessMessage("");
                      }}
                      className="text-[#00c9a7] font-medium hover:underline"
                    >
                      S'inscrire
                    </button>
                  </p>
                )}
                {mode === "signup" && (
                  <p className="text-sm text-gray-500">
                    Déjà un compte ?{" "}
                    <button
                      onClick={() => {
                        setMode("login");
                        setErrors({});
                        setSuccessMessage("");
                      }}
                      className="text-[#00c9a7] font-medium hover:underline"
                    >
                      Se connecter
                    </button>
                  </p>
                )}
                {mode === "forgot" && (
                  <p className="text-sm text-gray-500">
                    <button
                      onClick={() => {
                        setMode("login");
                        setErrors({});
                        setSuccessMessage("");
                      }}
                      className="text-[#00c9a7] font-medium hover:underline"
                    >
                      Retour à la connexion
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mentions légales */}
          <p className="text-center text-xs text-gray-400 mt-8">
            En continuant, vous acceptez nos{' '}
            <button onClick={() => onNavigate?.({ name: 'terms' })} className="text-[#00c9a7] hover:underline">
              Conditions générales
            </button>{' '}
            et notre{' '}
            <button onClick={() => onNavigate?.({ name: 'terms' })} className="text-[#00c9a7] hover:underline">
              Politique de confidentialité
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}


// ==================== HOTELS PAGE ====================

interface HotelsPageProps {
  onNavigate?: (route: Route) => void;
}

export function HotelsPage({ onNavigate }: HotelsPageProps) {
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [detailProperty, setDetailProperty] = useState<HotelProperty | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(null);

  // Données complètes des hôtels avec images spécifiques
  const hotelsData: HotelProperty[] = [
    { 
      id: 4, 
      title: "Hôtel Golden Tulip", 
      location: "Cotonou, Bénin", 
      price: "150 000 FCFA / nuit", 
      priceNumber: 150000, 
      rating: 4.9, 
      reviews: 342, 
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80"
      ],
      beds: 2, 
      baths: 2, 
      description: "Hôtel 5 étoiles avec spa, piscine et restaurant gastronomique.",
      host: "Sophie Martin",
      hostImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      hostSince: "3 ans",
      superhost: true,
      responseRate: 98,
      responseTime: "dans l'heure",
      amenities: ["Piscine", "Spa", "Wifi gratuit", "Parking", "Restaurant", "Room service", "Climatisation", "TV", "Mini-bar", "Service de blanchisserie"],
      longDescription: "Situé au cœur de Cotonou, le Golden Tulip offre une expérience de luxe avec ses chambres spacieuses, sa piscine à débordement et son restaurant gastronomique. Idéal pour les voyages d'affaires et les séjours touristiques."
    },
    { 
      id: 5, 
      title: "Novotel Cotonou", 
      location: "Cotonou, Bénin", 
      price: "120 000 FCFA / nuit", 
      priceNumber: 120000, 
      rating: 4.8, 
      reviews: 267, 
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
        "https://images.unsplash.com/photo-1582719500961-5e4c91ba3d3a?w=600&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80"
      ],
      beds: 2, 
      baths: 2, 
      description: "Hôtel d'affaires avec vue sur le lagon.",
      host: "Jean Dupont",
      hostImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      hostSince: "5 ans",
      superhost: true,
      responseRate: 95,
      responseTime: "dans l'heure",
      amenities: ["Vue sur lagon", "Piscine", "Salle de sport", "Wifi", "Restaurant", "Bar", "Parking", "Terrasse", "Salle de réunion"],
      longDescription: "Le Novotel Cotonou offre une vue imprenable sur le lagon. Idéal pour les voyageurs d'affaires et les familles avec ses chambres modernes et confortables."
    },
    { 
      id: 6, 
      title: "Azalaï Hôtel", 
      location: "Cotonou, Bénin", 
      price: "95 000 FCFA / nuit", 
      priceNumber: 95000, 
      rating: 4.7, 
      reviews: 189, 
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        "https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"
      ],
      beds: 2, 
      baths: 1, 
      description: "Hôtel confortable avec piscine et restaurant.",
      host: "Marie Claire",
      hostImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      hostSince: "2 ans",
      superhost: false,
      responseRate: 92,
      responseTime: "quelques heures",
      amenities: ["Piscine", "Restaurant", "Wifi", "Parking", "Climatisation", "TV", "Bar"],
      longDescription: "L'Azalaï Hôtel est un établissement confortable et bien situé, parfait pour les voyageurs recherchant un bon rapport qualité-prix."
    }
  ];

  const filterProperties = (properties: HotelProperty[]) => {
    const filtered = [...properties];
    if (selectedFilter === "Prix croissant") return filtered.sort((a,b) => a.priceNumber - b.priceNumber);
    if (selectedFilter === "Prix décroissant") return filtered.sort((a,b) => b.priceNumber - a.priceNumber);
    if (selectedFilter === "Mieux notés") return filtered.sort((a,b) => b.rating - a.rating);
    return filtered;
  };

  const displayedProperties = filterProperties(hotelsData);

  const handleReserve = (property: HotelProperty) => {
    const total = property.priceNumber * 2 * 1.1;
    setCheckoutData({ property, checkIn: "15/05/2026", checkOut: "17/05/2026", guests: 1, totalPrice: total });
    setShowCheckout(true);
    setDetailProperty(null);
  };

  const handleNavigate = (route: Route) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  const getMapUrl = () => "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d634630.827254447!2d2.2569729!3d6.474903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1020a44f6b9c7e9b%3A0x9b4b5c1e4f5a6b7!2sBenin!5e0!3m2!1sfr!2sfr!4v1699999999999!5m2!1sfr!2sfr";

  // Modal de détail complet
  const PropertyDetailModal = ({ property, onClose, onReserve }: { property: HotelProperty; onClose: () => void; onReserve: () => void }) => {
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [checkIn, setCheckIn] = useState("15/05/2026");
    const [checkOut, setCheckOut] = useState("17/05/2026");
    const [guests, setGuests] = useState(1);
    const [selectedPriceOption, setSelectedPriceOption] = useState<"non-remboursable" | "remboursable">("non-remboursable");
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [animate, setAnimate] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const images = property.images && Array.isArray(property.images) && property.images.length > 0 
      ? property.images 
      : [property.image, property.image, property.image, property.image];
      
    const host = property.host || "Hôte vérifié";
    const hostImage = property.hostImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80";
    const hostSince = property.hostSince || "1 an";
    const superhost = property.superhost ?? true;
    const responseRate = property.responseRate || 95;
    const responseTime = property.responseTime || "dans l'heure";
    const longDescription = property.longDescription || property.description;
    const amenities = property.amenities || ["Wifi", "Climatisation", "TV", "Parking", "Eau chaude", "Petit déjeuner"];
    const testimonials = property.testimonials || [
      { name: "Marie", date: "mars 2026", text: "Excellent séjour, hôtel magnifique !", rating: 5 },
      { name: "Jean", date: "février 2026", text: "Très bien situé, personnel accueillant.", rating: 4.8 },
      { name: "Sophie", date: "janvier 2026", text: "Je recommande vivement, rapport qualité-prix exceptionnel.", rating: 4.9 }
    ];

    const nights = 2;
    const subtotal = property.priceNumber * nights;
    const cleaningFee = 15000;
    const serviceFee = 12000;
    const total = subtotal + cleaningFee + serviceFee;
    const nonRefundableTotal = total;
    const refundableTotal = total + 35000;

    useEffect(() => {
      if (testimonials.length <= 1) return;
      const interval = setInterval(() => {
        setAnimate(true);
        setTimeout(() => {
          setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
          setAnimate(false);
        }, 300);
      }, 5000);
      return () => clearInterval(interval);
    }, [testimonials.length]);

    const extraImages = images.slice(1, 5);
    while (extraImages.length < 4) {
      extraImages.push(property.image);
    }

    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <div className="min-h-screen">
          <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex justify-between items-center">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-110">
              <ArrowLeft className="w-5 h-5"/>
            </button>
            <div className="flex gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-110">
                <Share2 className="w-5 h-5"/>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-all hover:scale-110">
                <Heart className="w-5 h-5"/>
              </button>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Galerie d'images principale */}
            <div className="relative grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-6 group">
              <div className="col-span-2 row-span-2 overflow-hidden cursor-pointer" onClick={() => setSelectedImageIndex(0)}>
                <img 
                  src={images[0]} 
                  alt={property.title} 
                  className="w-full h-full object-cover min-h-[300px] transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="overflow-hidden cursor-pointer" onClick={() => setSelectedImageIndex(i + 1)}>
                  <img 
                    src={img} 
                    alt={`${property.title} - ${i + 2}`} 
                    className="w-full h-36 object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
              ))}
              <button className="absolute bottom-4 right-4 bg-white rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all hover:bg-gray-100">
                Afficher toutes les photos
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Colonne de gauche - Informations */}
              <div className="lg:col-span-2 space-y-8">
                <div className="border-b pb-4">
                  <div className="text-sm text-gray-500">
                    Hôtel · {property.beds} chambres · {property.beds} lits · {property.baths} sdb
                  </div>
                  <h1 className="text-3xl font-semibold text-[#0F2940] mt-2">{property.title}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-5 h-5 fill-current text-[#00c9a7]" />
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-gray-500">· {property.reviews} commentaires</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-[#00c9a7] font-medium">Superhôte</span>
                  </div>
                </div>

                <div className="bg-[#00c9a7]/10 rounded-xl p-5 flex gap-4 items-center">
                  <Crown className="w-10 h-10 text-[#00c9a7]" />
                  <div>
                    <div className="font-semibold text-lg text-[#0F2940]">Coup de cœur · voyageurs</div>
                    <div className="text-gray-600">Un des hôtels préférés des voyageurs au Bénin</div>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <img 
                    src={hostImage} 
                    alt={host} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#00c9a7] shadow-lg" 
                  />
                  <div>
                    <div className="font-semibold text-xl text-[#0F2940]">Hôte : {host}</div>
                    {superhost && (
                      <div className="flex items-center gap-1 text-[#00c9a7]">
                        <Award className="w-4 h-4"/>Superhôte · {hostSince}
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      Taux de réponse {responseRate}% · Répond {responseTime}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  {longDescription && longDescription !== property.description && (
                    <p className="text-gray-700 mt-3 leading-relaxed">{longDescription}</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-xl text-[#0F2940]">Équipements premium</h3>
                    <button onClick={() => setShowAllAmenities(!showAllAmenities)} className="text-[#00c9a7] text-sm underline">
                      Voir tout
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {(showAllAmenities ? amenities : amenities.slice(0, 6)).map((a, i) => (
                      <div key={i} className="flex items-center gap-3 text-gray-700">
                        <Check className="w-5 h-5 text-[#00c9a7]"/>{a}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#0F2940]/5 to-[#00c9a7]/5 rounded-2xl p-6">
                  <h3 className="font-semibold text-xl text-[#0F2940] mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-[#00c9a7]" />
                    Ce que nos clients disent
                  </h3>
                  <div className={`transition-all duration-300 transform ${animate ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="relative">
                        <img 
                          src={testimonials[currentTestimonial]?.avatar || `https://ui-avatars.com/api/?background=00c9a7&color=fff&name=${testimonials[currentTestimonial]?.name?.charAt(0) || 'U'}`} 
                          alt={testimonials[currentTestimonial]?.name || "Client"}
                          className="w-20 h-20 rounded-full object-cover border-4 border-[#00c9a7] shadow-xl" 
                        />
                        <div className="absolute -bottom-2 -right-2 bg-[#00c9a7] rounded-full p-1">
                          <Star className="w-4 h-4 fill-white text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <span className="font-bold text-lg text-[#0F2940]">{testimonials[currentTestimonial]?.name || "Client"}</span>
                          <span className="text-sm text-gray-500">{testimonials[currentTestimonial]?.date || "récemment"}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(testimonials[currentTestimonial]?.rating || 5) ? 'fill-current text-[#00c9a7]' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">{testimonials[currentTestimonial]?.rating || 5}</span>
                        </div>
                        <p className="text-gray-700 mt-3 leading-relaxed">"{testimonials[currentTestimonial]?.text || "Excellent séjour !"}"</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-5">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg text-[#0F2940]">2 nuits à {property.location.split(',')[0]}</h3>
                    <button onClick={() => setShowCalendar(!showCalendar)} className="text-[#00c9a7] text-sm underline">
                      Sélectionner
                    </button>
                  </div>
                  {showCalendar && (
                    <div className="mt-4 border rounded-lg p-4">
                      <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        {["L","M","M","J","V","S","D"].map(d => <div key={d} className="font-medium text-gray-500">{d}</div>)}
                        {Array.from({length: 35}).map((_, i) => <button key={i} className="aspect-square rounded-full hover:bg-[#00c9a7]/20">{i+1}</button>)}
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-gray-500 mt-3">
                    <Calendar className="inline w-4 h-4 mr-1"/>{checkIn} — {checkOut}
                  </div>
                </div>
              </div>

              {/* Colonne de droite - Réservation */}
              <div className="lg:col-span-1 space-y-6">
                <div className="sticky top-24 border rounded-2xl p-6 shadow-xl bg-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-3xl font-bold text-[#0F2940]">{property.priceNumber.toLocaleString()} FCFA</span>
                      <span className="text-gray-500"> / nuit</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current text-[#00c9a7]"/>{property.rating}
                    </div>
                  </div>
                  <div className="border rounded-xl my-5 overflow-hidden">
                    <div className="flex">
                      <div className="flex-1 p-3 border-r">
                        <div className="text-xs font-bold text-gray-500 uppercase">Arrivée</div>
                        <div className="font-medium">{checkIn}</div>
                      </div>
                      <div className="flex-1 p-3">
                        <div className="text-xs font-bold text-gray-500 uppercase">Départ</div>
                        <div className="font-medium">{checkOut}</div>
                      </div>
                    </div>
                    <div className="p-3 border-t">
                      <div className="text-xs font-bold text-gray-500 uppercase">Voyageurs</div>
                      <div className="font-medium">{guests} adulte</div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-5">
                    <div className={`border rounded-xl p-3 cursor-pointer transition-all ${selectedPriceOption === "non-remboursable" ? "border-[#00c9a7] bg-[#00c9a7]/5 shadow-md" : ""}`} onClick={() => setSelectedPriceOption("non-remboursable")}>
                      <div className="flex justify-between font-medium">
                        <span>Non remboursable</span>
                        <span>{nonRefundableTotal.toLocaleString()} FCFA</span>
                      </div>
                      <div className="text-xs text-gray-500">Paiement immédiat</div>
                    </div>
                    <div className="border rounded-xl p-3 cursor-not-allowed opacity-50">
                      <div className="flex justify-between">
                        <span>Remboursable</span>
                        <span>{refundableTotal.toLocaleString()} FCFA</span>
                      </div>
                      <div className="text-xs text-gray-500">Annulation gratuite avant le 10 mai</div>
                    </div>
                  </div>
                  <button 
                    onClick={onReserve} 
                    className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-xl font-bold text-lg hover:bg-[#00b892] transition-all hover:scale-105 transform shadow-md"
                  >
                    Réserver
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-3">Aucun débit pour le moment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CheckoutModalComponent = ({ property, totalPrice, onClose }: any) => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Confirmer la réservation</h2>
        <p className="mb-2">Hôtel : {property?.title}</p>
        <p className="mb-4">Total : {totalPrice?.toLocaleString()} FCFA</p>
        <button onClick={onClose} className="w-full bg-[#00c9a7] py-3 rounded-xl font-bold">Confirmer</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-4 z-20">
        <button onClick={() => handleNavigate({ name: 'home' })} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-[#0F2940]">De superbes hôtels pour votre prochain voyage</h1>
      </div>

      <div className="sticky top-[73px] bg-white border-b px-4 py-2 z-10">
        <div className="relative inline-block">
          <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300">
            <Filter className="w-4 h-4 text-[#00c9a7]"/><span>Trier : {selectedFilter}</span><ChevronDown className="w-4 h-4"/>
          </button>
          {showFilterDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-xl border w-40 z-20">
              {["Tous", "Prix croissant", "Prix décroissant", "Mieux notés"].map(f => (
                <div key={f} className="p-2 hover:bg-[#00c9a7]/10 cursor-pointer" onClick={() => { setSelectedFilter(f); setShowFilterDropdown(false); }}>
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)]">
        {/* Colonne gauche : grille des hôtels */}
        <div className="lg:w-1/2 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayedProperties.map(property => (
              <div 
                key={property.id} 
                className="border rounded-2xl p-4 hover:shadow-xl cursor-pointer bg-white group hover:border-[#00c9a7] hover:scale-[1.02] transition-all duration-300" 
                onClick={() => setDetailProperty(property)}
              >
                <div className="relative overflow-hidden rounded-xl">
                  <img src={property.image} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 right-3 bg-[#00c9a7] text-white text-xs font-bold px-2 py-1 rounded-full">Coup de cœur</div>
                </div>
                <h3 className="font-semibold mt-2 text-[#0F2940] text-lg">{property.title}</h3>
                <p className="text-sm text-gray-500">{property.location}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-current text-[#00c9a7]"/>
                  <span className="font-medium">{property.rating}</span>
                  <span className="text-gray-500">({property.reviews})</span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1"><Bed className="w-4 h-4"/><span>{property.beds} lits</span></div>
                  <div className="flex items-center gap-1"><Bath className="w-4 h-4"/><span>{property.baths} sdb</span></div>
                </div>
                <p className="font-bold mt-2 text-[#0F2940] text-lg">{property.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Colonne droite : Carte */}
        <div className="lg:w-1/2 h-96 lg:h-auto bg-gray-100 relative">
          <iframe 
            title="Carte" 
            src={getMapUrl()} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            className="w-full h-full" 
          />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg px-3 py-1 text-xs shadow">
            📍 Hôtels au Bénin
          </div>
        </div>
      </div>

      {detailProperty && (
        <PropertyDetailModal 
          property={detailProperty} 
          onClose={() => setDetailProperty(null)} 
          onReserve={() => handleReserve(detailProperty)} 
        />
      )}
      {showCheckout && checkoutData && (
        <CheckoutModalComponent {...checkoutData} onClose={() => setShowCheckout(false)} />
      )}
    </div>
  );
}
// ==================== CITY PAGE ====================
export function CityPage({ onNavigate }: { onNavigate?: (route: Route) => void }) {
  // Récupérez city depuis les props au lieu de useParams
  // Ou utilisez une prop directe
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Définissez cityCategories à l'intérieur ou importez-la
  const cityCategories: Record<string, { title: string; properties: any[] }> = {
    portonovo: { title: 'Porto-Novo', properties: portonovoProperties },
    abomeycalavi: { title: 'Abomey-Calavi', properties: abomeycalaviProperties },
    akpakpa: { title: 'Akpakpa', properties: akpakpaProperties },
    menontin: { title: 'Menontin', properties: menontinProperties },
    fidjrosse: { title: 'Fidjrossè', properties: fidjrosseProperties },
    abomey: { title: 'Abomey', properties: abomeyProperties },
    parakou: { title: 'Parakou', properties: parakouProperties },
    dassa: { title: 'Dassa-Zoumè', properties: dassaProperties },
    ouidah: { title: 'Ouidah', properties: ouidahProperties },
    grandpopo: { title: 'Grand-Popo', properties: grandpopoProperties },
  };

  // Récupérez cityKey depuis les props au lieu de useParams
  // Pour l'exemple, utilisons une prop city
  // Mais selon votre route, vous devriez avoir city dans les props
  
  // Version temporaire - À adapter selon comment vous passez la ville
  const category = cityCategories["portonovo"]; // Remplacez par la bonne logique

  const filtersList = ['Tous', 'Prix croissant', 'Prix décroissant', 'Mieux notés'];

  const getFilteredProperties = () => {
    if (!category) return [];
    let filtered = [...category.properties];
    switch (selectedFilter) {
      case "Prix croissant":
        return filtered.sort((a, b) => a.price - b.price);
      case "Prix décroissant":
        return filtered.sort((a, b) => b.price - a.price);
      case "Mieux notés":
        return filtered.sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  };

  const filteredProperties = getFilteredProperties();

  const handleNavigate = (route: Route) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  // Définissez PropertyCard à l'intérieur
  const PropertyCard = ({ property, showDescription = false }: { property: any; showDescription?: boolean }) => (
    <div className="group cursor-pointer" onClick={() => handleNavigate({ name: 'listing', id: property.id.toString() })}>
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
        <p className="mt-3 font-semibold text-[#0F2940]">{property.priceDisplay || `${property.price.toLocaleString()} FCFA`}</p>
      </div>
    </div>
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-xl text-center p-8">
          <h1 className="text-2xl font-semibold text-[#222222]">Ville introuvable</h1>
          <p className="mt-4 text-gray-600">La ville demandée n'existe pas.</p>
          <button 
            onClick={() => handleNavigate({ name: 'home' })} 
            className="mt-6 rounded-full bg-[#00c9a7] text-[#0F2940] px-6 py-3 font-semibold hover:bg-[#00b892] transition-colors shadow-md"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-[#00c9a7]/10 to-[#0f2940]/10 pt-8 pb-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => handleNavigate({ name: 'home' })}
            className="text-[#00c9a7] hover:text-[#00b396] transition-colors mb-4 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </button>
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-8 h-8 text-[#00c9a7]" />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0f2940]">Logements à {category.title}</h1>
          </div>
          <p className="text-gray-600 text-lg">Découvrez les meilleurs hébergements à {category.title}, Bénin</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
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
                    {filtersList.map(filter => (
                      <button key={filter} onClick={() => { setSelectedFilter(filter); setShowFilterDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedFilter === filter ? 'text-[#00c9a7] font-medium' : 'text-gray-700'}`}>
                        {filter}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">{filteredProperties.length} logements disponibles</div>
          </div>
        </div>
      </div>

      {/* Grille des logements */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} showDescription={true} />
          ))}
        </div>
      </main>
    </div>
  );
}