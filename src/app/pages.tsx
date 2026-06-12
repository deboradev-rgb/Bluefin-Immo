import React, { useState, useEffect, useRef, useMemo ,useCallback   } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation  } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { BookingWidget } from './components/BookingWidget';
import { CategoryStrip } from './components/CategoryStrip';
import { DestinationCard } from './components/DestinationCard';
import { FeatureCard } from './components/FeatureCard';
import { Hero } from './components/Hero';
import { ListingCard } from './components/ListingCard';
import { ListingDetail } from './components/ListingDetail';
import { Navbar } from './components/Navbar';
import { useFavorites } from './hooks/useFavorites';
import LogoUrl from './assets/Bluefin Immo_01.jpg.jpeg';
import { useInquiryMessages } from './hooks/useInquiryMessages';
import { IdentityVerification } from './components/IdentityVerification';
// import {AdminBookingsPage} from './pages/admin/AdminBookingsPage';

import { Layout } from './components/Layout';

import api  from '../services/api';
// import { PropertyDetailModal } from './components/PropertyDetailModal';

// import { PropertyCard } from '../components/PropertyCard';
import bookingService, { type BookingData } from '../services/booking.service';
import propertyService from '../services/property.service';
import authService from '../services/auth.service';
import adminService from '../services/admin.service';
import { PageSection } from './components/PageSection';
import hostService from '../services/host.service';
import temporaryBookingService from '../services/temporaryBooking.service';

import { toast } from 'react-hot-toast';
import { getImageUrl } from './utils/imageHelper';
import type { Route } from './router';
import messageService, { Conversation, Message } from '../services/message.service';

import { 
  Zap, Headphones, Home, Heart, Calendar, 
  ShieldCheck, Rocket, BookOpen, Info, Bookmark, Star, CreditCard, Check, BarChart3, CalendarDays, Building2, Sparkles, Search as SearchIcon, HelpCircle  ,
  UserPlus,CheckCircle, XCircle, Clock,Flag ,
  DollarSign,ArrowUp ,Activity ,Wallet ,Ban , AlertTriangle , 
  FileText, Send, MessageCircle,PlusCircle,RefreshCw,Printer ,Download ,FileSpreadsheet ,FileJson ,
  Mail,Reply, Wifi,Wind,Coffee ,Car,Baby,Dog,
  Settings,  Calendar as CalendarIcon, Plus,
  Bell,Search ,Monitor,Tablet, Menu, TrendingUp, 
  AlertCircle, Eye, Lock, EyeOff, Compass,Briefcase,Edit2,LogOut,Shield, Fingerprint, User, Trash2 ,
  X as CloseIcon, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, Globe, X, Users,
  MapPin, Bath, Bed, Filter, ChevronDown, Share2, Award, Crown, Key, Smartphone, Phone, Camera, Image
} from 'lucide-react';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,ComposedChart,PieChart ,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import CheckoutModal from './components/CheckoutModal';



// Fonction pour trouver une propriété par ID
const findPropertyById = (id: string) => {
  const numericId = parseInt(id);
  console.log("Recherche de l'ID:", numericId);
  console.log("Nombre total de propriétés:", allProperties.length);
  console.log("IDs disponibles:", allProperties.map(p => p.id));
  
  const found = allProperties.find(p => p.id === numericId);
  console.log("Trouvé:", found?.title);
  return found;
};

// Au début de votre HomePage, ajoutez :


// Remplacez l'interface stricte par un type plus flexible
type HotelProperty = {
  id: number;
  title: string;
  location: string;
  price: number;
    priceDisplay?: string;
    priceNumber?: number;
  rating: number;
  reviews: number;
  image: string;
  beds: number;
  baths: number;
  description: string;
  type?: string;
  category?: string;
  city?: string;
  district?: string;
  // Ajoutez les propriétés optionnelles manquantes
  images?: string[];
  host?: string;
  hostImage?: string | null;
  hostSince?: string;
  superhost?: boolean;
  responseRate?: number;
  responseTime?: string;
  longDescription?: string;
  amenities?: string[];
  hostId?: string | number | null;
  checkInTime?: string;
  checkOutTime?: string;
  selfCheckIn?: boolean;
  walkScore?: string;
  property_type?: string;
  bluefin_certified?: boolean;
  has_generator?: boolean;
  has_wifi?: boolean;
  has_air_conditioning?: boolean;
  has_water_tank?: boolean;
  cancellation_policy?: string;
  instant_booking?: boolean;
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
      price: 150000,
      priceDisplay: "150 000 FCFA / nuit",
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
      price: 120000,
      priceDisplay: "120 000 FCFA / nuit",
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
      price: 95000,
      priceDisplay: "95 000 FCFA / nuit",
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
      price: 140000,
      priceDisplay: "140 000 FCFA / nuit",
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
      price: 110000,
      priceDisplay: "110 000 FCFA / nuit",
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
      price: 135000,
      priceDisplay: "135 000 FCFA / nuit",
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
      price: 165000,
      priceDisplay: "165 000 FCFA / nuit",
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
      price: 130000,
      priceDisplay: "130 000 FCFA / nuit",
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
      price: 90000,
      priceDisplay: "90 000 FCFA / nuit",
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
      price: 100000,
      priceDisplay: "100 000 FCFA / nuit",
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

// ========== COMPOSANT GOOGLE LOGIN + FACE ID ==========
const GoogleLoginModal = ({ onSuccess, onClose }: { onSuccess: (data: any) => void; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFaceIdMode, setIsFaceIdMode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [faceIdError, setFaceIdError] = useState("");
  const [loginMethod, setLoginMethod] = useState<"email" | "google">("email");

  // Simuler la vérification Face ID
  const handleFaceIdVerification = () => {
    setIsVerifying(true);
    setFaceIdError("");
    
    // Simulation de la caméra Face ID
    setTimeout(() => {
      // 90% de chance de succès pour la simulation
      const success = Math.random() > 0.1;
      if (success) {
        onSuccess({ 
          name: "Jean Dupont", 
          email: email || "jean.dupont@email.com",
          verified: true,
          faceIdVerified: true
        });
      } else {
        setFaceIdError("Reconnaissance faciale échouée. Veuillez réessayer.");
      }
      setIsVerifying(false);
    }, 2000);
  };

  const handleEmailLogin = () => {
    if (!email || !password) {
      setFaceIdError("Veuillez remplir tous les champs");
      return;
    }
    setIsFaceIdMode(true);
  };

  const handleGoogleLogin = () => {
    setIsFaceIdMode(true);
  };

  // Composant de capture d'identité (simulation)
  const IdentityCapture = () => {
    const [identityFile, setIdentityFile] = useState<File | null>(null);
    const [identityPreview, setIdentityPreview] = useState<string>("");
    const [identityType, setIdentityType] = useState<"cni" | "passeport" | "permis">("cni");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setIdentityFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setIdentityPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="identity-upload"
          />
          <label htmlFor="identity-upload" className="cursor-pointer block">
            {identityPreview ? (
              <div className="relative">
                <img src={identityPreview} alt="Carte d'identité" className="mx-auto max-h-48 rounded-lg" />
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            ) : (
              <div className="py-8">
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">Cliquez pour prendre une photo ou télécharger</p>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG jusqu'à 5MB</p>
              </div>
            )}
          </label>
        </div>

        <div className="flex gap-3">
          {[
            { id: "cni", label: "Carte d'identité" },
            { id: "passeport", label: "Passeport" },
            { id: "permis", label: "Permis de conduire" }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setIdentityType(type.id as any)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                identityType === type.id 
                  ? "bg-[#00c9a7] text-[#0F2940]" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {identityFile && (
          <button 
            onClick={() => {
              if (identityFile) {
                // Simuler la validation de l'identité
                setIsFaceIdMode(false);
                onSuccess({ 
                  name: "Jean Dupont", 
                  email: email || "jean.dupont@email.com",
                  verified: true,
                  faceIdVerified: true,
                  identityVerified: true,
                  identityType: identityType
                });
              }
            }}
            className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-xl font-semibold hover:bg-[#00b892] transition"
          >
            Vérifier mon identité
          </button>
        )}
      </div>
    );
  };

  if (isFaceIdMode && !isVerifying) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-4">
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-3xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#0F2940]">Vérification d'identité</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 text-center mb-6">
              Pour devenir hôte, nous devons vérifier votre identité
            </p>

            <IdentityCapture />
          </div>
        </div>
      </div>
    );
  }

  if (isFaceIdMode && isVerifying) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-4">
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center">
            <div className="w-24 h-24 mx-auto bg-[#00c9a7]/10 rounded-full flex items-center justify-center mb-6">
              <Fingerprint className="w-12 h-12 text-[#00c9a7] animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-[#0F2940] mb-2">Vérification Face ID</h2>
            <p className="text-gray-500 mb-4">Regardez la caméra pour confirmer votre identité</p>
            <div className="w-32 h-32 mx-auto border-4 border-[#00c9a7] rounded-full animate-pulse mb-4"></div>
            {faceIdError && (
              <p className="text-red-500 text-sm mb-4">{faceIdError}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-4">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#0F2940]">Connexion hôte</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode de connexion */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                loginMethod === "email" 
                  ? "bg-[#00c9a7] text-[#0F2940]" 
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setLoginMethod("google")}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                loginMethod === "google" 
                  ? "bg-[#00c9a7] text-[#0F2940]" 
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Google
            </button>
          </div>

          {loginMethod === "email" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent"
                  placeholder="exemple@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleEmailLogin}
                className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-xl font-semibold hover:bg-[#00b892] transition"
              >
                Se connecter
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span className="font-medium">Continuer avec Google</span>
            </button>
          )}

          <p className="text-center text-xs text-gray-500 mt-6">
            En continuant, vous acceptez nos conditions d'utilisation et la politique de confidentialité
          </p>
        </div>
      </div>
    </div>
  );
};

// ========== FORMULAIRE D'INSCRIPTION HÔTE ==========
const RegistrationForm = ({ userData, onComplete, onBack }: any) => {
  const [formData, setFormData] = useState({
    firstName: userData?.name?.split(" ")[0] || "",
    lastName: userData?.name?.split(" ")[1] || "",
    phone: "",
    address: "",
    city: "Cotonou",
    country: "Bénin"
  });

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-6">
          <ArrowLeft className="w-5 h-5" /> Retour
        </button>
        
        <h1 className="text-2xl font-semibold text-[#0F2940] mb-2">Complétez votre profil</h1>
        <p className="text-gray-500 mb-8">Ces informations seront visibles par les voyageurs</p>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c9a7]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c9a7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c9a7]"
              placeholder="+229 XX XX XX XX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c9a7]"
              placeholder="Votre adresse complète"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c9a7]"
              >
                <option>Cotonou</option>
                <option>Porto-Novo</option>
                <option>Parakou</option>
                <option>Abomey-Calavi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
              <input
                type="text"
                value={formData.country}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-xl font-semibold hover:bg-[#00b892] transition"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== ENGAGEMENT COMMUNAUTAIRE ==========
const CommunityCommitment = ({ onAccept, onBack }: any) => {
  const commitments = [
    "Je fournirai un logement propre et sécurisé",
    "Je répondrai aux voyageurs dans les 24h",
    "Je respecterai les politiques d'annulation choisies",
    "Je traiterai les voyageurs avec respect et courtoisie"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto pb-24 lg:pb-0">
      <div className="max-w-2xl mx-auto p-6 pb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-6">
          <ArrowLeft className="w-5 h-5" /> Retour
        </button>
        
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-[#00c9a7] mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-[#0F2940]">Engagement communautaire</h1>
          <p className="text-gray-500 mt-2">En devenant hôte, vous vous engagez à respecter nos valeurs</p>
        </div>

        <div className="space-y-4 mb-8">
          {commitments.map((commitment, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-[#f4fffe]">
              <CheckCircle className="w-5 h-5 text-[#00c9a7]" />
              <span className="text-gray-700">{commitment}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onAccept}
          className="w-full bg-[#00c9a7] text-[#0F2940] py-3 rounded-xl font-semibold hover:bg-[#00b892] transition"
        >
          J'accepte et je continue
        </button>
      </div>
    </div>
  );
};

// ========== ÉTAPES FACILES ==========
const EasySteps = ({ onContinue, onQuit }: any) => {
  const steps = [
    { icon: Home, title: "Créez votre annonce", desc: "Décrivez votre logement en quelques étapes", color: "from-[#00c9a7] to-[#00b396]" },
    { icon: Calendar, title: "Calendrier et tarifs", desc: "Définissez vos disponibilités et prix", color: "from-[#0f2940] to-[#1a3a52]" },
    { icon: Users, title: "Accueillez les voyageurs", desc: "Recevez des réservations et gérez vos hôtes", color: "from-[#ff6b6b] to-[#ff5252]" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header avec bouton de fermeture */}
          <div className="relative bg-gradient-to-r from-[#0f2940] to-[#1a3a52] px-6 py-8 text-center">
            <button
              onClick={onQuit}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Comment ça marche ?</h1>
            <p className="text-white/80 text-sm md:text-base">Devenez hôte en 3 étapes simples</p>
          </div>

          {/* Steps */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="group text-center">
                    {/* Étape numéro */}
                    <div className="relative mb-4">
                      <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-r from-[#00c9a7] to-[#0f2940] text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div className={`w-20 h-20 mx-auto bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-[#0F2940] text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
              <button
                onClick={onContinue}
                className="flex-1 bg-gradient-to-r from-[#00c9a7] to-[#0f2940] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Créer mon annonce
              </button>
              <button
                onClick={onQuit}
                className="flex-1 border-2 border-slate-200 text-slate-600 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-300"
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== FORMULAIRE PROPRIÉTÉ ==========
const PropertyForm = ({ onSaveAndQuit, userData, onGoToDashboard }: any) => {
  const [propertyData, setPropertyData] = useState({
    title: "",
    type: "appartement",
    guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    price: 50000,
    description: "",
    address: "",
    city: "Cotonou",
    amenities: ["wifi", "climatisation"],
    photos: [] as string[]
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotoPreview([...photoPreview, ...newPhotos]);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else onGoToDashboard();
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#0F2940]">Informations de base</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'annonce</label>
              <input
                type="text"
                value={propertyData.title}
                onChange={(e) => setPropertyData({ ...propertyData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Charmant appartement au cœur de Cotonou"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de logement</label>
              <select
                value={propertyData.type}
                onChange={(e) => setPropertyData({ ...propertyData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="appartement">Appartement</option>
                <option value="maison">Maison</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="chambre">Chambre privée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                value={propertyData.description}
                onChange={(e) => setPropertyData({ ...propertyData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Décrivez votre logement..."
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#0F2940]">Capacité et équipements</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voyageurs max</label>
                <input
                  type="number"
                  min={1}
                  value={propertyData.guests}
                  onChange={(e) => setPropertyData({ ...propertyData, guests: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
                <input
                  type="number"
                  min={0}
                  value={propertyData.bedrooms}
                  onChange={(e) => setPropertyData({ ...propertyData, bedrooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lits</label>
                <input
                  type="number"
                  min={0}
                  value={propertyData.beds}
                  onChange={(e) => setPropertyData({ ...propertyData, beds: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salles de bain</label>
                <input
                  type="number"
                  min={0}
                  value={propertyData.bathrooms}
                  onChange={(e) => setPropertyData({ ...propertyData, bathrooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#0F2940]">Photos</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="photos-upload"
              />
              <label htmlFor="photos-upload" className="cursor-pointer block">
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">Cliquez pour ajouter des photos</p>
                <p className="text-xs text-gray-400">Minimum 5 photos recommandées</p>
              </label>
            </div>
            {photoPreview.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {photoPreview.map((photo, idx) => (
                  <img key={idx} src={photo} alt={`Photo ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#0F2940]">Tarifs et disponibilités</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix par nuit (FCFA)</label>
              <input
                type="number"
                value={propertyData.price}
                onChange={(e) => setPropertyData({ ...propertyData, price: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse exacte</label>
              <input
                type="text"
                value={propertyData.address}
                onChange={(e) => setPropertyData({ ...propertyData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Numéro, rue, quartier"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <select
                value={propertyData.city}
                onChange={(e) => setPropertyData({ ...propertyData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option>Cotonou</option>
                <option>Porto-Novo</option>
                <option>Parakou</option>
                <option>Abomey-Calavi</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#0F2940]">Créer mon annonce</h1>
          <button onClick={onSaveAndQuit} className="text-gray-500 hover:text-gray-700">
            Sauvegarder et quitter
          </button>
        </div>

        {/* Barre de progression */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full transition ${
                step <= currentStep ? "bg-[#00c9a7]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {renderStep()}

        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Précédent
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 bg-[#00c9a7] text-[#0F2940] py-3 rounded-xl font-semibold hover:bg-[#00b892] transition"
          >
            {currentStep === 4 ? "Publier mon annonce" : "Continuer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== DASHBOARD HÔTE ==========
const HostDashboard = ({ onLogout, userData }: any) => {
  const [activeTab, setActiveTab] = useState<"reservations" | "calendar" | "annonces" | "payouts">("reservations");

  const stats = [
    { label: "Réservations", value: "12", change: "+3", icon: Calendar },
    { label: "Chiffre d'affaires", value: "1 250 000 FCFA", change: "+450 000", icon: DollarSign },
    { label: "Avis", value: "4.9 ★", change: "+0.2", icon: Star },
    { label: "Taux d'occupation", value: "78%", change: "+12%", icon: Users }
  ];

  const recentBookings = [
    { id: 1, guest: "Marie K.", dates: "15-20 mai 2026", amount: "275 000 FCFA", status: "confirmée" },
    { id: 2, guest: "Jean D.", dates: "22-25 mai 2026", amount: "180 000 FCFA", status: "en attente" },
    { id: 3, guest: "Sophie L.", dates: "1-5 juin 2026", amount: "350 000 FCFA", status: "confirmée" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b px-5 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onLogout} className="text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-[#0F2940]">Tableau de bord hôte</h1>
              <p className="text-sm text-gray-500">Bienvenue {userData?.name || "Hôte"}</p>
            </div>
          </div>
          <button className="bg-[#00c9a7] text-[#0F2940] px-4 py-2 rounded-full text-sm font-medium">
            + Nouvelle annonce
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-[#00c9a7]" />
                  <span className="text-xs text-green-600">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold text-[#0F2940]">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Onglets */}
        <div className="flex gap-4 border-b mb-6">
          {[
            { id: "reservations", label: "Réservations" },
            { id: "calendar", label: "Calendrier" },
            { id: "annonces", label: "Mes annonces" },
            { id: "payouts", label: "Paiements" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-2 font-medium transition ${
                activeTab === tab.id 
                  ? "text-[#00c9a7] border-b-2 border-[#00c9a7]" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu des onglets */}
        {activeTab === "reservations" && (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Voyageur</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Dates</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Montant</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Statut</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{booking.guest}</td>
                    <td className="p-4 text-sm">{booking.dates}</td>
                    <td className="p-4 font-medium">{booking.amount}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === "confirmée" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-[#00c9a7] text-sm">Voir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center text-gray-500">
            Calendrier des réservations (à implémenter)
          </div>
        )}

        {activeTab === "annonces" && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center text-gray-500">
            Liste de vos annonces (à implémenter)
          </div>
        )}

        {activeTab === "payouts" && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center text-gray-500">
            Historique des paiements (à implémenter)
          </div>
        )}
      </div>
    </div>
  );
};

// ========== BÉNÉFICES POUR LES HÔTES ==========
const benefits = [
  { icon: Shield, title: "Sécurité renforcée", description: "Vos données et paiements sont protégés 24h/24." },
  { icon: Users, title: "Assistance 7j/7", description: "Une équipe dédiée vous accompagne dans votre activité." },
  { icon: CreditCard, title: "Paiements rapides", description: "Virements vers mobile money ou compte bancaire sous 48h." },
  { icon: Globe, title: "Visibilité internationale", description: "Votre logement est visible par des milliers de voyageurs." }
];
//========== COMPOSANT MODAL AVEC ONGLETS FILTRANTS ==========
const ArticleModal = ({ article, onClose }: { article: { id: string; title: string; category: string; content: string }; onClose: () => void }) => {
  const [activeDevice, setActiveDevice] = useState<"ordi" | "ios" | "android" | "mobile">("ordi");

  // Contenu spécifique pour chaque appareil
  const getDeviceContent = () => {
    switch(activeDevice) {
      case "ordi":
        return {
          title: "Ordinateur de bureau",
          steps: [
            "Cliquez sur Voyages, puis sélectionnez la réservation à annuler.",
            "Sous Détails de la réservation, cliquez sur Annuler la réservation.",
            "Choisissez la raison de l'annulation.",
            "Cliquez sur Annuler la réservation."
          ]
        };
      case "ios":
        return {
          title: "Application iOS",
          steps: [
            "Appuyez sur Voyages, puis sélectionnez la réservation.",
            "Sous Détails, appuyez sur Annuler la réservation.",
            "Choisissez la raison de l'annulation.",
            "Appuyez sur Annuler la réservation."
          ]
        };
      case "android":
        return {
          title: "Application Android",
          steps: [
            "Appuyez sur Voyages, puis sélectionnez la réservation.",
            "Sous Détails, appuyez sur Annuler la réservation.",
            "Choisissez la raison de l'annulation.",
            "Appuyez sur Annuler la réservation."
          ]
        };
      case "mobile":
        return {
          title: "Navigateur mobile",
          steps: [
            "Appuyez sur Voyages, puis sélectionnez la réservation.",
            "Sous Détails, appuyez sur Annuler la réservation.",
            "Choisissez la raison de l'annulation.",
            "Appuyez sur Annuler la réservation."
          ]
        };
      default:
        return { title: "", steps: [] };
    }
  };

  const deviceContent = getDeviceContent();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-4">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-[#00c9a7] font-medium">Guide pratique • {article.category}</span>
              <h2 className="text-2xl font-semibold text-[#0F2940]">{article.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <p className="text-gray-700">Vos projets ont changé et vous devez maintenant annuler votre réservation d'un logement ? Aucun problème.</p>
              
              <div className="bg-[#0F2940]/5 rounded-xl p-4 mb-4">
                <h3 className="text-xl font-semibold text-[#0F2940] mt-2 mb-4">Dans cet article</h3>
                <ul className="grid md:grid-cols-2 gap-2 list-disc pl-5">
                  <li><a href="#annuler" className="text-[#00c9a7] hover:underline">Annuler une réservation</a></li>
                  <li><a href="#conditions" className="text-[#00c9a7] hover:underline">Conditions d'annulation pour les séjours dans des logements</a></li>
                  <li><a href="#consequences" className="text-[#00c9a7] hover:underline">Conséquences d'une annulation sur les réservations de service</a></li>
                  <li><a href="#remboursement" className="text-[#00c9a7] hover:underline">Vérifiez si vous recevrez un remboursement avant d'annuler</a></li>
                  <li><a href="#apres-arrivee" className="text-[#00c9a7] hover:underline">Si vous annulez après l'arrivée</a></li>
                  <li><a href="#probleme" className="text-[#00c9a7] hover:underline">Si vous annulez en raison d'un problème pendant votre séjour</a></li>
                  <li><a href="#service" className="text-[#00c9a7] hover:underline">Comment puis-je annuler un service ou une expérience ?</a></li>
                </ul>
              </div>

              <h3 id="annuler" className="text-xl font-semibold text-[#0F2940] mt-6 mb-4 border-l-4 border-[#00c9a7] pl-3">Annuler une réservation</h3>
              
              {/* Onglets filtrants */}
              <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                <button onClick={() => setActiveDevice("ordi")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeDevice === "ordi" ? "bg-[#00c9a7] text-[#0F2940] shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  <Monitor className="w-4 h-4" /> Ordinateur
                </button>
                <button onClick={() => setActiveDevice("ios")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeDevice === "ios" ? "bg-[#00c9a7] text-[#0F2940] shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  <Smartphone className="w-4 h-4" /> iOS
                </button>
                <button onClick={() => setActiveDevice("android")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeDevice === "android" ? "bg-[#00c9a7] text-[#0F2940] shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  <Smartphone className="w-4 h-4" /> Android
                </button>
                <button onClick={() => setActiveDevice("mobile")} className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeDevice === "mobile" ? "bg-[#00c9a7] text-[#0F2940] shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  <Tablet className="w-4 h-4" /> Mobile
                </button>
              </div>
              
              {/* Contenu de l'onglet actif */}
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm mt-4">
                <div className="flex items-center gap-3 mb-4">
                  {activeDevice === "ordi" && <Monitor className="w-6 h-6 text-[#00c9a7]" />}
                  {activeDevice === "ios" && <Smartphone className="w-6 h-6 text-[#00c9a7]" />}
                  {activeDevice === "android" && <Smartphone className="w-6 h-6 text-[#00c9a7]" />}
                  {activeDevice === "mobile" && <Tablet className="w-6 h-6 text-[#00c9a7]" />}
                  <span className="font-semibold text-[#0F2940] text-lg">{deviceContent.title}</span>
                </div>
                <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                  {deviceContent.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="bg-[#0F2940]/5 rounded-xl p-5 mt-4">
                <p className="text-gray-700 leading-relaxed">Les délais d'annulation pour recevoir un remboursement sont calculés à partir de l'heure d'arrivée précisée pour le logement en question, dans le fuseau horaire local, ou 15h si aucune heure d'arrivée n'est spécifiée.</p>
              </div>

              <h3 id="conditions" className="text-xl font-semibold text-[#0F2940] mt-8 mb-4 border-l-4 border-[#00c9a7] pl-3">Conditions d'annulation pour les séjours dans des logements</h3>
              <div className="bg-[#0F2940]/5 rounded-xl p-5">
                <p className="text-gray-700 leading-relaxed">Pour les réservations de logements, les conditions d'annulation sont fixées par l'hôte et varient selon les annonces. Si un hôte a opté pour une politique avec une option de remboursement intégral, vous pouvez annuler la réservation gratuitement. Assurez-vous simplement d'annuler avant l'heure et la date indiquées.</p>
                <p className="text-gray-700 mt-3 leading-relaxed">N'oubliez pas : pour certaines annonces, il est possible que la réservation ne soit pas remboursable, ou qu'elle ne le soit que partiellement, après certaines dates et heures. Dans ce cas, vous ne pourrez pas annuler votre réservation gratuitement. Dans les rares cas où un événement majeur sur votre lieu de destination vous empêcherait de bénéficier de votre réservation, vous pouvez être éligible à un remboursement en vertu de la Politique relative aux circonstances extraordinaires de Bf-Immo.</p>
              </div>

              <h3 id="consequences" className="text-xl font-semibold text-[#0F2940] mt-8 mb-4 border-l-4 border-[#00c9a7] pl-3">Conséquences d'une annulation de réservation de logement sur les réservations de service</h3>
              <div className="bg-[#0F2940]/5 rounded-xl p-5">
                <p className="text-gray-700">Si vous avez réservé des services dans le logement que vous annulez, n'oubliez pas que vous devez les annuler séparément ou contacter l'hôte concerné afin de trouver une autre solution.</p>
              </div>

              <h3 id="remboursement" className="text-xl font-semibold text-[#0F2940] mt-8 mb-4 border-l-4 border-[#00c9a7] pl-3">Vérifiez si vous recevrez un remboursement avant d'annuler</h3>
              <div className="bg-[#0F2940]/5 rounded-xl p-5">
                <p className="text-gray-700">Découvrez les remboursements auxquels vous avez droit en cas d'annulation d'une réservation d'un logement. N'oubliez pas : le montant remboursé ne sera jamais supérieur au montant payé au moment de l'annulation. Vous pouvez connaître le montant du remboursement avant ou après l'annulation de la réservation.</p>
              </div>

              <h3 id="apres-arrivee" className="text-xl font-semibold text-[#0F2940] mt-8 mb-4 border-l-4 border-[#00c9a7] pl-3">Si vous annulez après l'arrivée</h3>
              <div className="bg-[#0F2940]/5 rounded-xl p-5">
                <p className="text-gray-700">Si vous annulez votre réservation après votre arrivée, vous devez quitter le logement immédiatement.</p>
              </div>

              <h3 id="probleme" className="text-xl font-semibold text-[#0F2940] mt-8 mb-4 border-l-4 border-[#00c9a7] pl-3">Si vous annulez en raison d'un problème pendant votre séjour</h3>
              <div className="bg-[#0F2940]/5 rounded-xl p-5">
                <p className="text-gray-700">Si vous rencontrez un problème pendant votre séjour, vous pouvez demander à l'hôte d'y remédier, demander un remboursement partiel ou l'annulation de la réservation pour bénéficier d'un remboursement intégral. Avant d'annuler votre séjour, consultez les options qui s'offrent à vous en cas de problème pendant votre séjour.</p>
              </div>

              <h3 id="service" className="text-xl font-semibold text-[#0F2940] mt-8 mb-4 border-l-4 border-[#00c9a7] pl-3">Comment puis-je annuler un service ou une expérience ?</h3>
              <div className="bg-[#0F2940]/5 rounded-xl p-5">
                <p className="text-gray-700">Vous souhaitez annuler un service ou une expérience ? En général, vous pouvez annuler gratuitement jusqu'à 1 jour (24 heures) avant le début du service ou de l'expérience. Toutefois, certains services et expériences vous permettent d'annuler et d'obtenir un remboursement intégral jusqu'à 3 jours (72 heures) avant l'heure de début. Découvrez comment annuler votre réservation de service ou d'expérience en tant que voyageur.</p>
              </div>

              <div className="bg-gradient-to-r from-[#00c9a7]/10 to-[#0F2940]/10 rounded-xl p-4 mt-8">
                <p className="font-medium text-[#0F2940]">Cet article vous a-t-il été utile ?</p>
                <div className="flex gap-4 mt-3">
                  <button className="px-5 py-2 bg-[#00c9a7] text-[#0F2940] rounded-full text-sm font-medium hover:bg-[#00b892] transition">Oui</button>
                  <button className="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition">Non</button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-8">
                <h4 className="font-semibold text-[#0F2940] mb-3">Sur le même sujet</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-[#00c9a7] text-sm hover:underline flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Trouvez les conditions d'annulation qui s'appliquent à tout logement, service ou expérience</a></li>
                  <li><a href="#" className="text-[#00c9a7] text-sm hover:underline flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Remboursement auquel vous avez droit lorsque vous annulez une réservation de logement</a></li>
                  <li><a href="#" className="text-[#00c9a7] text-sm hover:underline flex items-center gap-2"><ArrowRight className="w-3 h-3" /> Consulter le montant de votre remboursement avant ou après l'annulation</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== DONNÉES DES ARTICLES D'AIDE ==========
const articlesData: Record<string, { title: string; category: string; content: string }> = {
  "annuler-reservation": {
    title: "Annuler votre réservation de logement",
    category: "Voyageur",
    content: "" // Le contenu est géré directement dans le modal
  },
  "modes-paiement": {
    title: "Modes de paiement acceptés",
    category: "Voyageur",
    content: `
      <div class="space-y-6">
        <p class="text-gray-700">Nous acceptons plusieurs modes de paiement. Dans la plupart des pays, vous pouvez payer avec les principales cartes de crédit, ainsi que les cartes de débit qui peuvent être traitées comme des cartes de crédit. Nous acceptons également les portefeuilles numériques comme mobile money, ainsi que les services en ligne tels que Mastercard, Visa. Quel que soit votre mode de paiement, assurez la sécurité de vos transactions en les effectuant toujours sur Bf-Immo.</p>
        
        <div class="bg-[#0F2940]/5 rounded-xl p-4 mb-4">
          <h3 class="text-lg font-semibold text-[#0F2940] mb-3">Dans cet article</h3>
          <ul class="grid md:grid-cols-2 gap-2 list-disc pl-5">
            <li><a href="#fedapay" class="text-[#00c9a7] hover:underline">Paiement différé avec FedaPay</a></li>
            <li><a href="#options" class="text-[#00c9a7] hover:underline">Options de paiement disponibles dans la plupart des pays</a></li>
            <li><a href="#options-pays" class="text-[#00c9a7] hover:underline">Options de paiement disponibles dans certains pays</a></li>
            <li><a href="#securite" class="text-[#00c9a7] hover:underline">Assurez la sécurité de vos paiements en les effectuant toujours sur Bf-Immo</a></li>
          </ul>
        </div>

        <h3 id="fedapay" class="text-xl font-semibold text-[#0F2940] mt-8 mb-4 border-l-4 border-[#00c9a7] pl-3">Paiement différé avec FedaPay</h3>
        <div class="bg-[#0F2940]/5 rounded-xl p-5">
          <p class="text-gray-700">Les résidents des États-Unis et du Canada ont la possibilité de payer avec Fedapay, ce qui leur permet de régler en plusieurs fois plutôt qu'en une seule fois. Fedapay accepte toutes les principales cartes de débit et de crédit (comme Visa et Mastercard). Les cartes prépayées ne sont pas acceptées. En savoir plus sur le paiement avec Fedapay.</p>
        </div>

        <h3 id="options" class="text-xl font-semibold text-[#0F2940] mt-8 mb-4 border-l-4 border-[#00c9a7] pl-3">Options de paiement disponibles dans la plupart des pays</h3>
        <div class="bg-[#0F2940]/5 rounded-xl p-5">
          <ul class="list-disc pl-5 space-y-2 text-gray-700">
            <li>Visa, MasterCard, et les cartes de débit qui peuvent être traitées comme des cartes de crédit</li>
            <li>Apple Pay</li>
            <li>Mobile money</li>
          </ul>
        </div>

        <h3 id="options-pays" class="text-xl font-semibold text-[#0F2940] mt-8 mb-4 border-l-4 border-[#00c9a7] pl-3">Options de paiement disponibles dans certains pays</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-[#0F2940]/5 rounded-xl p-4"><p class="font-semibold text-[#0F2940]">FedaPay :</p><p class="text-gray-700 text-sm">Bénin, Togo, Côte d'Ivoire, Sénégal, Mali, Niger, Burkina Faso, Guinée</p></div>
          <div class="bg-[#0F2940]/5 rounded-xl p-4"><p class="font-semibold text-[#0F2940]">Mobile money :</p><p class="text-gray-700 text-sm">Bénin, Ouganda, Rwanda, Cameroun, Zambie (déploiement progressif selon les pays)</p></div>
          <div class="bg-[#0F2940]/5 rounded-xl p-4 col-span-2"><p class="font-semibold text-[#0F2940]">Visa & MasterCard :</p><p class="text-gray-700 text-sm">Acceptée dans plus de 200 pays et territoires dans le monde</p></div>
        </div>

        <h3 id="securite" class="text-xl font-semibold text-[#0F2940] mt-8 mb-4 border-l-4 border-[#00c9a7] pl-3">Assurez la sécurité de vos paiements en les effectuant toujours sur Bf-Immo</h3>
        <div class="bg-[#0F2940]/5 rounded-xl p-5">
          <p class="text-gray-700">Les paiements en espèces ou effectués en dehors du site vont à l'encontre de nos Conditions de service et peuvent conduire à une exclusion de la communauté Bf-Immo. Lorsque vous payez en dehors de la plateforme, il nous est plus difficile de protéger vos données et vous vous exposez à un risque accru de fraudes et de failles de sécurité.</p>
        </div>

        <div class="bg-gradient-to-r from-[#00c9a7]/10 to-[#0F2940]/10 rounded-xl p-4 mt-8">
          <p class="font-medium text-[#0F2940]">Cet article vous a-t-il été utile ?</p>
          <div class="flex gap-4 mt-3"><button class="px-5 py-2 bg-[#00c9a7] text-[#0F2940] rounded-full text-sm font-medium">Oui</button><button class="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium">Non</button></div>
        </div>
      </div>
    `
  },
  "modifier-date": {
    title: "Modifier la date ou l'heure de votre réservation",
    category: "Voyageur",
    content: `
      <div class="space-y-6">
        <p class="text-gray-700">Si vous avez réservé un service ou une expérience, mais que la date ou l'heure ne vous convient plus, ne vous inquiétez pas, il y a une solution ! Vous avez peut-être la possibilité de modifier votre réservation en fonction des disponibilités de l'hôte et de ses conditions d'annulation.</p>
        
        <div class="bg-[#0F2940]/5 rounded-xl p-4 mb-4">
          <h3 class="text-lg font-semibold text-[#0F2940] mb-3">Dans cet article</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li><a href="#reprogrammer" class="text-[#00c9a7] hover:underline">Reprogrammer si la période d'annulation de l'hôte n'est pas terminée</a></li>
            <li><a href="#comment" class="text-[#00c9a7] hover:underline">Comment reprogrammer la réservation d'un service ou d'une expérience</a></li>
            <li><a href="#demander" class="text-[#00c9a7] hover:underline">Demander une modification de votre réservation si la période d'annulation de l'hôte est terminée</a></li>
          </ul>
        </div>

        <h3 id="reprogrammer" class="text-xl font-semibold text-[#0F2940] mt-8 mb-4 border-l-4 border-[#00c9a7] pl-3">Reprogrammer si la période d'annulation de l'hôte n'est pas terminée</h3>
        <div class="bg-[#0F2940]/5 rounded-xl p-5">
          <p class="text-gray-700">Si la période d'annulation gratuite de votre réservation de service ou d'expérience n'est pas encore terminée, vous pouvez reprogrammer et réserver n'importe quelle autre heure ou date disponibles sur le calendrier de l'hôte.</p>
        </div>

        <div class="bg-gradient-to-r from-[#00c9a7]/10 to-[#0F2940]/10 rounded-xl p-4 mt-8">
          <p class="font-medium text-[#0F2940]">Cet article vous a-t-il été utile ?</p>
          <div class="flex gap-4 mt-3"><button class="px-5 py-2 bg-[#00c9a7] text-[#0F2940] rounded-full text-sm font-medium">Oui</button><button class="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium">Non</button></div>
        </div>
      </div>
    `
  },
  "hote-annule": {
    title: "Si votre hôte annule votre réservation de logement",
    category: "Voyageur",
    content: `
      <div class="space-y-6">
        <p class="text-gray-700">Bien que cette situation soit rare, un hôte peut parfois devoir annuler une réservation. Rassurez-vous : si l'hôte annule votre réservation avant l'arrivée, vous recevez un remboursement intégral.</p>
        
        <div class="bg-[#0F2940]/5 rounded-xl p-4 mb-4">
          <h3 class="text-lg font-semibold text-[#0F2940] mb-3">Dans cet article</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li><a href="#remboursement" class="text-[#00c9a7] hover:underline">Votre remboursement si l'hôte annule</a></li>
            <li><a href="#aide" class="text-[#00c9a7] hover:underline">Aide pour effectuer une nouvelle réservation</a></li>
            <li><a href="#prevenir" class="text-[#00c9a7] hover:underline">Comment nous vous préviendrons</a></li>
            <li><a href="#demande" class="text-[#00c9a7] hover:underline">Si votre hôte vous demande d'annuler</a></li>
          </ul>
        </div>

        <div class="bg-gradient-to-r from-[#00c9a7]/10 to-[#0F2940]/10 rounded-xl p-4 mt-8">
          <p class="font-medium text-[#0F2940]">Cet article vous a-t-il été utile ?</p>
          <div class="flex gap-4 mt-3"><button class="px-5 py-2 bg-[#00c9a7] text-[#0F2940] rounded-full text-sm font-medium">Oui</button><button class="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium">Non</button></div>
        </div>
      </div>
    `
  },
  "quand-payer": {
    title: "Quand vous payerez votre réservation",
    category: "Voyageur",
    content: `
      <div class="space-y-6">
        <p class="text-gray-700">Vous souhaitez savoir quand le montant de votre réservation sera débité ? Tout dépend du type de réservation et du mode de paiement. Dans la plupart des cas, votre mode de paiement est débité dès la confirmation de votre réservation.</p>
        
        <div class="bg-[#0F2940]/5 rounded-xl p-4 mb-4">
          <h3 class="text-lg font-semibold text-[#0F2940] mb-3">Dans cet article</h3>
          <ul class="list-disc pl-5 space-y-1">
            <li><a href="#sejour-court" class="text-[#00c9a7] hover:underline">Séjours de moins de 28 nuits</a></li>
            <li><a href="#sejour-long" class="text-[#00c9a7] hover:underline">Séjours de 28 nuits ou plus</a></li>
            <li><a href="#paiements-programmes" class="text-[#00c9a7] hover:underline">Réservations avec paiements programmés</a></li>
          </ul>
        </div>

        <div class="bg-gradient-to-r from-[#00c9a7]/10 to-[#0F2940]/10 rounded-xl p-4 mt-8">
          <p class="font-medium text-[#0F2940]">Cet article vous a-t-il été utile ?</p>
          <div class="flex gap-4 mt-3"><button class="px-5 py-2 bg-[#00c9a7] text-[#0F2940] rounded-full text-sm font-medium">Oui</button><button class="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium">Non</button></div>
        </div>
      </div>
    `
  },
  "comment-reserver": {
    title: "Comment réserver un logement ?",
    category: "Voyageur",
    content: `
      <div class="space-y-6">
        <p class="text-gray-700">Réserver un logement sur Bf-Immo est simple et rapide. Suivez ces étapes :</p>
        
        <div class="space-y-4">
          <div class="flex gap-4 items-start p-4 bg-[#0F2940]/5 rounded-xl">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold">1</div>
            <div><h3 class="font-semibold text-[#0F2940]">Recherchez votre destination</h3><p class="text-gray-600">Utilisez la barre de recherche.</p></div>
          </div>
          <div class="flex gap-4 items-start p-4 bg-[#0F2940]/5 rounded-xl">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold">2</div>
            <div><h3 class="font-semibold text-[#0F2940]">Choisissez vos dates</h3><p class="text-gray-600">Sélectionnez l'arrivée et le départ.</p></div>
          </div>
          <div class="flex gap-4 items-start p-4 bg-[#0F2940]/5 rounded-xl">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold">3</div>
            <div><h3 class="font-semibold text-[#0F2940]">Indiquez le nombre de voyageurs</h3><p class="text-gray-600">Précisez adultes, enfants, bébés.</p></div>
          </div>
          <div class="flex gap-4 items-start p-4 bg-[#0F2940]/5 rounded-xl">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold">4</div>
            <div><h3 class="font-semibold text-[#0F2940]">Parcourez les annonces</h3><p class="text-gray-600">Filtrez et trouvez le logement idéal.</p></div>
          </div>
          <div class="flex gap-4 items-start p-4 bg-[#0F2940]/5 rounded-xl">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold">5</div>
            <div><h3 class="font-semibold text-[#0F2940]">Réservez</h3><p class="text-gray-600">Confirmez et payez en toute sécurité.</p></div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-[#00c9a7]/10 to-[#0F2940]/10 rounded-xl p-4 mt-8">
          <p class="font-medium text-[#0F2940]">Cet article vous a-t-il été utile ?</p>
          <div class="flex gap-4 mt-3"><button class="px-5 py-2 bg-[#00c9a7] text-[#0F2940] rounded-full text-sm font-medium">Oui</button><button class="px-5 py-2 border border-gray-300 rounded-full text-sm font-medium">Non</button></div>
        </div>
      </div>
    `
  }
};


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


export type UserRole = "traveler" | "host" | "visitor";
export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  languages?: string[];
  avatar?: string;
  createdAt: string;
  isHost?: boolean;
};

// ==================== MODAL DE DÉTAIL ====================


const filters = ['Tous', 'Prix croissant', 'Prix décroissant', 'Mieux notés', 'Nouveautés'];

// pages/HomePage.tsx

const filtersList = ['Tous', 'Prix croissant', 'Prix décroissant', 'Mieux notés'];

// Helper pour mapper une propriété de l'API vers le format attendu par PropertyCard


// Cache pour stocker les résultats de mapProperty
const mappedPropertiesCache = new Map();

// pages.tsx - Version corrigée de mapProperty

// ==================== mapProperty (copié depuis votre code) ====================
const mapProperty = (p: any) => {
  const getAllImages = (): string[] => {
    const images: string[] = [];
    
    const addImage = (url: string) => {
      if (!url) return;
      
      let cleanUrl = url;
      
      if (cleanUrl.includes('hstgr.io') || cleanUrl.includes('srv2197-files')) {
        const filename = cleanUrl.split('/').pop();
        if (filename && p.id) {
          cleanUrl = `https://api.bluefin-immo.com/api/property-image/${p.id}/${filename}`;
        }
      } else if (cleanUrl.startsWith('/storage')) {
        cleanUrl = `https://api.bluefin-immo.com${cleanUrl}`;
      } else if (cleanUrl.startsWith('/api/public/storage')) {
        cleanUrl = `https://api.bluefin-immo.com${cleanUrl}`;
      }
      
      if (!images.includes(cleanUrl) && !cleanUrl.includes('undefined')) {
        images.push(cleanUrl);
      }
    };
    
    // Vérifier les photos
    if (p.photos && Array.isArray(p.photos) && p.photos.length > 0) {
      for (const photo of p.photos) {
        if (photo.photo_url) {
          addImage(photo.photo_url);
        } else if (photo.full_url) {
          addImage(photo.full_url);
        } else if (photo.photo_path) {
          const filename = photo.photo_path.split('/').pop();
          if (filename) {
            addImage(`https://api.bluefin-immo.com/api/property-image/${p.id}/${filename}`);
          }
        }
      }
    }
    
    // Vérifier cover_photo
    if (p.cover_photo && typeof p.cover_photo === 'object') {
      if (p.cover_photo.photo_url) {
        addImage(p.cover_photo.photo_url);
      } else if (p.cover_photo.full_url) {
        addImage(p.cover_photo.full_url);
      } else if (p.cover_photo.photo_path) {
        const filename = p.cover_photo.photo_path.split('/').pop();
        if (filename) {
          addImage(`https://api.bluefin-immo.com/api/property-image/${p.id}/${filename}`);
        }
      }
    }
    
    // Fallback
    if (images.length === 0) {
      images.push(`https://picsum.photos/seed/${p.id}/400/300`);
    }
    
    return images;
  };
  
  const allImages = getAllImages();
  const firstImage = allImages[0];
  
  // Conversion des prix en FCFA et Euros
  const XAF_TO_EUR = 0.0015;
  const priceFCFA = Number(p.price_per_night ?? p.price ?? 0);
  const priceEuro = priceFCFA * XAF_TO_EUR;
  
  return {
    id: p.id,
    title: p.title || 'Logement sans titre',
    description: p.description || '',
    location: `${p.district || ''}${p.district && p.city ? ', ' : ''}${p.city || ''}`.replace(/^,\s/, '') || 'Bénin',
    city: p.city || '',
    district: p.district || '',
    price: priceFCFA,
    priceFCFA: priceFCFA,
    priceDisplay: `${priceFCFA.toLocaleString()} FCFA`,
    priceEuro: priceEuro,
    priceEuroDisplay: `≈ ${priceEuro.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €`,
    priceNumber: priceFCFA,
    rating: p.average_rating || p.rating || 4.5,
    reviews: p.reviews_count || 0,
    images: allImages,
    image: firstImage,
    bedrooms: p.bedrooms || 1,
    beds: p.beds || 1,
    bathrooms: p.bathrooms || 1,
    maxGuests: p.max_guests || p.beds || 2,
    property_type: p.property_type || 'appartement',
    isVisible: p.status === 'active',
    status: p.status,
    has_wifi: p.has_wifi || false,
    has_air_conditioning: p.has_air_conditioning || false,
    has_generator: p.has_generator || false,
    bluefin_certified: p.bluefin_certified || false,
  };
};

// Composant PropertyCard interne (identique à l'original mais utilisant les données mappées)

interface PropertyCardProps {
  property: any;
  showDescription?: boolean;
  compact?: boolean;
  onNavigate?: (route: any) => void;
  isFavorite?: (id: number) => boolean;
  toggleFavorite?: (property: any) => void;
}

export function PropertyCard({ 
  property, 
  showDescription = false, 
  compact = false,
  onNavigate,
  isFavorite: propIsFavorite,
  toggleFavorite: propToggleFavorite
}: PropertyCardProps) {
  const favoritesHook = useFavorites();
  const isFavoriteFn = propIsFavorite || favoritesHook.isFavorite;
  const toggleFavoriteFn = propToggleFavorite || favoritesHook.toggleFavorite;
  const [imgError, setImgError] = useState(false);

  if (!property) return null;

  // ✅ Récupération de l'image - utilise les données qui fonctionnent
  const imageUrl = !imgError && property.images?.[0] 
    ? property.images[0] 
    : property.image || `https://picsum.photos/seed/${property.id}/400/300`;

  const handleCardClick = () => {
    if (onNavigate && property.id) {
      onNavigate({ name: 'listing', id: property.id.toString() });
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavoriteFn(property);
  };

  const priceDisplay = property.priceDisplay || `${(property.price_per_night || property.price || 0).toLocaleString()} FCFA`;
  const location = property.location || (property.district && property.city ? `${property.district}, ${property.city}` : (property.city || property.district || 'Bénin'));
  const rating = property.rating || property.average_rating || 0;
  const reviewCount = property.reviews || property.reviews_count || 0;
  const bedCount = property.beds || property.bedrooms || 1;

  return (
    <div 
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
      onClick={handleCardClick}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
        <img
          src={imageUrl}
          alt={property.title || 'Logement'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        
        {/* Badge Bluefin Certifié */}
        {property.bluefin_certified && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
            ✓ Bluefin Certifié
          </div>
        )}
        
        {/* Bouton favori */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-200 z-10 backdrop-blur-sm shadow-md hover:scale-110"
          aria-label="Ajouter aux favoris"
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-200 ${
              isFavoriteFn(property.id) 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Titre et localisation */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#0F2940] text-base line-clamp-1 hover:text-blue-600 transition-colors">
              {property.title || 'Logement sans titre'}
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          </div>
          
          {/* Note */}
          {rating > 0 && (
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg flex-shrink-0">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
              {reviewCount > 0 && (
                <span className="text-xs text-gray-400">({reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Description (optionnel) */}
        {showDescription && property.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {property.description}
          </p>
        )}

        {/* Équipements clés */}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
          {bedCount > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{bedCount} lit{bedCount > 1 ? 's' : ''}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms} sdb</span>
            </div>
          )}
          {property.max_guests > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{property.max_guests} pers.</span>
            </div>
          )}
        </div>

        {/* Équipements spécifiques */}
        <div className="flex flex-wrap gap-2 mt-2">
          {property.has_wifi && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
              <Wifi className="w-3 h-3" /> Wi-Fi
            </span>
          )}
          {property.has_air_conditioning && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
              <Wind className="w-3 h-3" /> Clim
            </span>
          )}
          {property.has_generator && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
              <Zap className="w-3 h-3" /> Groupe
            </span>
          )}
        </div>

      

{/* Prix avec conversion Euro - Couleurs du site */}
<div className="mt-3 pt-2 border-t border-gray-100">
  <div className="flex items-baseline justify-between">
    <div>
      <span className="text-xl font-bold text-[#00c9a7]">{property.priceDisplay}</span>
      <span className="text-sm text-gray-400"> / nuit</span>
      {property.priceEuroDisplay && (
        <div className="text-xs text-gray-400 mt-0.5">
          {property.priceEuroDisplay}
        </div>
      )}
    </div>
    <button 
      className="text-sm text-[#00c9a7] hover:text-[#0F2940] font-medium transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        handleCardClick();
      }}
    >
      Voir détails →
    </button>
  </div>
</div>
      </div>
    </div>
  );
}

export default PropertyCard;


// PropertyDetailModal.tsx


interface PropertyDetailModalProps {
  property: any;
  onClose: () => void;
  onReserve?: (bookingData: any) => void;
  onChat?: (hostId: number) => void;
  onNavigate?: (route: any) => void;
}

const formatCurrency = (amount: number) => {
  const fCFA = `${amount.toLocaleString()} FCFA`;
  const euro = `${(amount / 655.957).toFixed(2)} €`;
  return { fCFA, euro };
};

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ 
  property, 
  onClose, 
  onReserve, 
  onChat,
  onNavigate  
}) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPaymentStep, setShowPaymentStep] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'available' | 'unavailable' | 'checking'>('idle');
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  
  // États de paiement
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [mobileProvider, setMobileProvider] = useState<'MTN' | 'Moov' | 'Orange'>('MTN');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  
  const [checkIn, setCheckIn] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCheckIn = urlParams.get('check_in');
    if (urlCheckIn) return urlCheckIn;
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  
  const [checkOut, setCheckOut] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCheckOut = urlParams.get('check_out');
    if (urlCheckOut) return urlCheckOut;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  });
  
  const [adults, setAdults] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const guests = urlParams.get('guests');
    return guests ? parseInt(guests) : 1;
  });
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animate, setAnimate] = useState(false);
  
  const maxGuests = property.max_guests || 10;
  const totalGuests = adults + children;

  const formatDisplayFromIso = (isoDate: string) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const host = property.host || 'Hôte vérifié';
  const hostId = property.hostId ?? property.id;
  const hostAvatarUrl = property.hostImage || `https://ui-avatars.com/api/?background=00c9a7&color=fff&name=${encodeURIComponent(host)}&bold=true&size=128`;
  const hostSince = property.hostSince || "1 an";
  const superhost = property.superhost ?? true;
  const responseRate = property.responseRate || 95;

  const nights = Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)));
  const nightlyPrice = property.priceNumber || property.price || 0;
  const subtotal = nightlyPrice * nights;
  const serviceFee = subtotal * 0.10;
  const total = subtotal + serviceFee;
  
  const nightlyPriceFormatted = formatCurrency(nightlyPrice);
  const subtotalFormatted = formatCurrency(subtotal);
  const serviceFeeFormatted = formatCurrency(serviceFee);
  const totalFormatted = formatCurrency(total);

  // Validation des infos de paiement
  const validatePaymentInfo = () => {
    if (paymentMethod === 'mobile_money') {
      if (!mobileProvider) {
        setPaymentError('Veuillez sélectionner votre opérateur');
        return false;
      }
      if (!mobileMoneyNumber || mobileMoneyNumber.length < 8) {
        setPaymentError('Numéro Mobile Money invalide');
        return false;
      }
    } else {
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      if (!cardNumber || cleanCardNumber.length < 16) {
        setPaymentError('Numéro de carte invalide');
        return false;
      }
      if (!cardExpiry || !cardExpiry.includes('/')) {
        setPaymentError('Date d\'expiration invalide');
        return false;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setPaymentError('CVV invalide');
        return false;
      }
      if (!cardName) {
        setPaymentError('Nom sur la carte requis');
        return false;
      }
    }
    return true;
  };

  // Afficher le formulaire de paiement
  const handleShowPayment = () => {
    if (availabilityStatus !== 'available') {
      toast.error('Ce logement n\'est pas disponible pour les dates sélectionnées');
      return;
    }
    setShowPaymentStep(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retour au résumé
  const handleBackToSummary = () => {
    setShowPaymentStep(false);
    setPaymentError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Création de la réservation et paiement
  const handleConfirmPayment = async () => {
    if (!validatePaymentInfo()) return;
    
    setIsPaying(true);
    setPaymentError('');
    
    // Simuler le traitement du paiement
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Préparer les données de réservation
    const bookingData = {
      property_id: property.id,
      check_in: checkIn,
      check_out: checkOut,
      guests_count: totalGuests,
      payment_method: paymentMethod,
      mobile_money_provider: paymentMethod === 'mobile_money' ? mobileProvider : undefined,
      mobile_money_number: paymentMethod === 'mobile_money' ? mobileMoneyNumber : undefined,
      guest_details: {
        full_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Voyageur',
        email: user?.email || '',
        phone: user?.phone || '',
        address: null
      },
      payment_option: '100',
      total_amount: total,
      payment_amount: total,
      nights: nights
    };
    
    try {
      const response = await bookingService.create(bookingData);
      const bookingId = response?.booking?.id || response?.data?.booking?.id || response?.id;
      
      if (bookingId) {
        toast.success('Réservation confirmée !');
        setTimeout(() => {
          setIsPaying(false);
          onNavigate?.({ name: 'confirmation', id: bookingId.toString() });
        }, 1500);
      } else {
        setPaymentError('Erreur lors de la création de la réservation');
        setIsPaying(false);
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      setPaymentError(err.response?.data?.message || 'Une erreur est survenue');
      setIsPaying(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setCardExpiry(value);
  };

  const checkAvailability = async (checkInDate: string, checkOutDate: string) => {
    if (!checkInDate || !checkOutDate) return;
    setIsCheckingAvailability(true);
    setAvailabilityStatus('checking');
    try {
      const response = await propertyService.checkAvailability(property.id, checkInDate, checkOutDate);
      const isAvailable = response?.data?.available === true;
      if (isAvailable) {
        setAvailabilityStatus('available');
      } else {
        setAvailabilityStatus('unavailable');
      }
    } catch (error) {
      console.error('Erreur vérification:', error);
      setAvailabilityStatus('unavailable');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      const debounceTimer = setTimeout(() => checkAvailability(checkIn, checkOut), 800);
      return () => clearTimeout(debounceTimer);
    }
  }, [checkIn, checkOut]);

  const getPropertyImages = (property: any): string[] => {
    if (property.images && Array.isArray(property.images) && property.images.length > 0) return property.images;
    const baseImage = property.image;
    const imageVariants = [baseImage, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'];
    const uniqueImages = [...new Set(imageVariants)];
    while (uniqueImages.length < 5) uniqueImages.push(baseImage);
    return uniqueImages.slice(0, 5);
  };

  const images = getPropertyImages(property);
  const amenities = property.amenities || ["Wi-Fi", "Climatisation", "TV", "Parking", "Eau chaude", "Petit déjeuner"];
  const testimonials = [
    { name: "Marie", date: "mars 2026", text: "Excellent séjour, hôtel magnifique !", rating: 5 },
    { name: "Jean", date: "février 2026", text: "Très bien situé, personnel accueillant.", rating: 4.8 },
    { name: "Sophie", date: "janvier 2026", text: "Je recommande vivement, rapport qualité-prix exceptionnel.", rating: 4.9 }
  ];

  const handleReserveClick = () => {
    if (!isAuthenticated) {
      localStorage.setItem('redirect_intent', 'booking');
      localStorage.setItem('redirect_property_id', property.id.toString());
      onNavigate?.({ name: 'auth', search: `redirect=booking&property=${property.id}` });
      return;
    }
    setShowBookingForm(true);
    setShowPaymentStep(false);
  };

  const handleChatWithAuth = () => {
    if (!isAuthenticated) {
      onNavigate?.({ name: 'auth', search: `redirect=chat&property=${property.id}` });
    } else if (onChat) {
      onChat(hostId);
    }
  };

  const handleBackToDetails = () => {
    setShowBookingForm(false);
    setShowPaymentStep(false);
  };

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => { setAnimate(true); setTimeout(() => { setCurrentTestimonial((prev) => (prev + 1) % testimonials.length); setAnimate(false); }, 300); }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Vue du formulaire de réservation (Résumé + Paiement)
  if (showBookingForm) {
    return (
      <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm overflow-y-auto">
        <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 pb-24 sm:pb-32">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp mx-3 sm:mx-0">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-5 z-20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3 sm:gap-4">
                  <button onClick={handleBackToDetails} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-[#0F2940] to-[#00c9a7] bg-clip-text text-transparent">
                      {!showPaymentStep ? 'Résumé de votre réservation' : 'Paiement sécurisé'}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {!showPaymentStep ? 'Vérifiez vos informations' : 'Finalisez votre réservation'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 max-h-[calc(100vh-200px)] overflow-y-auto pb-32">
              {/* Étape 1: Résumé de la réservation */}
              {!showPaymentStep && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Logement */}
                  <div className="bg-gradient-to-r from-[#00c9a7]/5 to-[#0F2940]/5 rounded-xl p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={images[0]} alt={property.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{property.title}</h3>
                        <p className="text-sm text-gray-500">{property.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm">{property.rating}</span>
                          <span className="text-gray-400 text-sm">({property.reviews} avis)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="border-b pb-3">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#00c9a7]" />
                      Dates
                    </h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Arrivée</span>
                      <span className="font-medium">{new Date(checkIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Départ</span>
                      <span className="font-medium">{new Date(checkOut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-medium">{nights} nuit{nights > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Voyageurs */}
                  <div className="border-b pb-3">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#00c9a7]" />
                      Voyageurs
                    </h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Adultes</span>
                      <span className="font-medium">{adults}</span>
                    </div>
                    {children > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Enfants</span>
                        <span className="font-medium">{children}</span>
                      </div>
                    )}
                    {babies > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-600">Bébés</span>
                        <span className="font-medium">{babies}</span>
                      </div>
                    )}
                  </div>

                  {/* Prix */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-[#00c9a7]" />
                      Détail des prix
                    </h4>
                    <div className="bg-gradient-to-br from-[#0F2940] to-[#1a3a5c] rounded-xl p-4 text-white">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">{nightlyPrice.toLocaleString()} FCFA × {nights} nuits</span>
                          <div className="text-right">
                            <div>{subtotalFormatted.fCFA}</div>
                            <div className="text-xs text-white/50">{subtotalFormatted.euro}</div>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Frais de service (10%)</span>
                          <div className="text-right">
                            <div>{serviceFeeFormatted.fCFA}</div>
                            <div className="text-xs text-white/50">{serviceFeeFormatted.euro}</div>
                          </div>
                        </div>
                        <div className="border-t border-white/20 pt-2 mt-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total à payer</span>
                            <div className="text-right">
                              <div className="text-xl font-bold text-[#00c9a7]">{totalFormatted.fCFA}</div>
                              <div className="text-xs text-white/50">{totalFormatted.euro}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Étape 2: Paiement */}
              {showPaymentStep && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="bg-gradient-to-r from-[#00c9a7]/10 to-[#0F2940]/10 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600">Montant à payer</p>
                    <p className="text-3xl font-bold text-[#00c9a7]">{totalFormatted.fCFA}</p>
                    <p className="text-xs text-gray-500 mt-1">{totalFormatted.euro}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Méthode de paiement</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => { setPaymentMethod('mobile_money'); setPaymentError(''); }} 
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${paymentMethod === 'mobile_money' ? 'border-[#00c9a7] bg-[#00c9a7]/5' : 'border-gray-200'}`}
                      >
                        <Smartphone className={`w-6 h-6 ${paymentMethod === 'mobile_money' ? 'text-[#00c9a7]' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">Mobile Money</span>
                      </button>
                      <button 
                        onClick={() => { setPaymentMethod('card'); setPaymentError(''); }} 
                        className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all ${paymentMethod === 'card' ? 'border-[#00c9a7] bg-[#00c9a7]/5' : 'border-gray-200'}`}
                      >
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-[#00c9a7]' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">Carte bancaire</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'mobile_money' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Opérateur</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['MTN', 'Moov', 'Orange'] as const).map((provider) => (
                            <button 
                              key={provider} 
                              onClick={() => { setMobileProvider(provider); setPaymentError(''); }} 
                              className={`py-3 rounded-xl border-2 transition-all ${mobileProvider === provider ? 'border-[#00c9a7] bg-[#00c9a7]/5 text-[#00c9a7]' : 'border-gray-200'}`}
                            >
                              {provider}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Numéro Mobile Money</label>
                        <input 
                          type="tel" 
                          value={mobileMoneyNumber} 
                          onChange={(e) => { setMobileMoneyNumber(e.target.value); setPaymentError(''); }} 
                          placeholder="97 00 00 00" 
                          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7]" 
                        />
                        <p className="text-xs text-gray-400 mt-1">Vous recevrez une demande de paiement sur ce numéro</p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte</label>
                        <input 
                          type="text" 
                          value={cardNumber} 
                          onChange={handleCardNumberChange} 
                          placeholder="1234 5678 9012 3456" 
                          maxLength={19} 
                          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7]" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiration</label>
                          <input 
                            type="text" 
                            value={cardExpiry} 
                            onChange={handleExpiryChange} 
                            placeholder="MM/AA" 
                            maxLength={5} 
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7]" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <div className="relative">
                            <input 
                              type={showCvv ? 'text' : 'password'} 
                              value={cardCvv} 
                              onChange={(e) => setCardCvv(e.target.value)} 
                              placeholder="123" 
                              maxLength={4} 
                              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7] pr-10" 
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowCvv(!showCvv)} 
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom sur la carte</label>
                        <input 
                          type="text" 
                          value={cardName} 
                          onChange={(e) => setCardName(e.target.value.toUpperCase())} 
                          placeholder="JEAN DUPONT" 
                          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7] uppercase" 
                        />
                      </div>
                    </div>
                  )}

                  {paymentError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
                      {paymentError}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="sticky bottom-0 bg-white border-t px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex gap-3">
                {!showPaymentStep && (
                  <button 
                    onClick={handleShowPayment} 
                    disabled={availabilityStatus !== 'available'} 
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00c9a7] to-[#00a887] text-white font-semibold disabled:opacity-50"
                  >
                    Confirmer et payer
                  </button>
                )}
                {showPaymentStep && (
                  <>
                    <button 
                      onClick={handleBackToSummary} 
                      className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                    >
                      Retour
                    </button>
                    <button 
                      onClick={handleConfirmPayment} 
                      disabled={isPaying} 
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00c9a7] to-[#00a887] text-white font-semibold disabled:opacity-50"
                    >
                      {isPaying ? (
                        <div className="flex justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Paiement...
                        </div>
                      ) : `Payer ${totalFormatted.fCFA}`}
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-3">
                <div className="flex items-center gap-1"><Lock className="w-3 h-3" /><span>Paiement sécurisé</span></div>
                <div className="flex items-center gap-1"><Shield className="w-3 h-3" /><span>Garantie BF-Immo</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue détaillée
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="min-h-screen pb-20">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b px-3 sm:px-4 py-3 flex justify-between items-center shadow-sm">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft className="w-5 h-5 text-[#0F2940]" /></button>
          <div className="flex gap-2"><button className="p-2 rounded-full hover:bg-gray-100"><Share2 className="w-5 h-5" /></button><button className="p-2 rounded-full hover:bg-gray-100"><Heart className="w-5 h-5" /></button></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xl overflow-hidden mb-4">
            <div className="col-span-2 row-span-2 overflow-hidden aspect-[4/3]"><img src={images[0]} alt={property.title} className="w-full h-full object-cover" /></div>
            {images.slice(1, 5).map((img, i) => (<div key={i} className="overflow-hidden aspect-[4/3] hidden sm:block"><img src={img} alt={`${property.title} - ${i + 2}`} className="w-full h-full object-cover" /></div>))}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-5">
              <div><div className="text-xs text-gray-500">{property.property_type || 'Logement'} · {property.beds} chambres</div><h1 className="text-xl sm:text-2xl font-semibold text-[#0F2940] mt-2">{property.title}</h1><div className="flex items-center gap-2 mt-2"><Star className="w-4 h-4 fill-current text-[#00c9a7]" /><span className="text-sm font-medium">{property.rating}</span><span className="text-gray-500 text-sm">· {property.reviews} commentaires</span>{superhost && <span className="text-[#00c9a7] text-sm">· Superhôte</span>}</div></div>
              <div className="flex gap-4"><img src={hostAvatarUrl} alt={host} className="w-12 h-12 rounded-full object-cover border-2 border-[#00c9a7]" /><div><div className="font-semibold">Hôte : {host}</div>{superhost && <div className="text-sm text-[#00c9a7]">⭐ Superhôte · {hostSince}</div>}<div className="text-xs text-gray-600">Taux de réponse {responseRate}%</div></div></div>
              <div className="text-sm text-gray-700 leading-relaxed">{property.description}</div>
              <div><div className="flex justify-between mb-4"><h3 className="font-semibold">Équipements</h3><button onClick={() => setShowAllAmenities(!showAllAmenities)} className="text-[#00c9a7] text-sm underline">Voir tout</button></div><div className="grid grid-cols-2 gap-3">{(showAllAmenities ? amenities : amenities.slice(0, 6)).map((a, i) => (<div key={i} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-[#00c9a7]" />{a}</div>))}</div></div>
            </div>

            <div className="lg:w-96">
              <div className="sticky top-24 bg-white border rounded-xl p-4 shadow-xl">
                <div className="flex justify-between mb-4"><div><div className="flex items-baseline gap-2"><span className="text-2xl font-bold text-[#0F2940]">{nightlyPrice.toLocaleString()} FCFA</span><span className="text-gray-500 text-sm">/ nuit</span></div></div><div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full"><Star className="w-4 h-4 fill-current text-[#00c9a7]" />{property.rating}</div></div>

                <div className="border rounded-xl mb-4 overflow-hidden">
                  <div className="grid grid-cols-2 border-b"><div className="p-3"><div className="text-xs font-bold text-gray-500">Arrivée</div><input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full text-sm mt-1 border-0 p-0 focus:ring-0" /></div><div className="p-3 border-l"><div className="text-xs font-bold text-gray-500">Départ</div><input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn} className="w-full text-sm mt-1 border-0 p-0 focus:ring-0" /></div></div>
                  {availabilityStatus === 'available' && <div className="p-2 bg-green-50 text-center text-xs text-green-600"><CheckCircle className="inline w-3 h-3 mr-1" />Disponible</div>}
                  {availabilityStatus === 'unavailable' && <div className="p-2 bg-red-50 text-center text-xs text-red-600"><AlertCircle className="inline w-3 h-3 mr-1" />Non disponible</div>}
                  <div className="p-3"><div className="text-xs font-bold text-gray-500 mb-2">Voyageurs</div>
                    <div className="flex justify-between py-1"><span className="text-sm">Adultes</span><div className="flex gap-3"><button onClick={() => setAdults(Math.max(1, adults-1))} className="w-7 h-7 rounded-full border flex items-center justify-center">-</button><span>{adults}</span><button onClick={() => setAdults(adults+1)} className="w-7 h-7 rounded-full border flex items-center justify-center">+</button></div></div>
                    <div className="flex justify-between py-1 border-t"><span className="text-sm">Enfants</span><div className="flex gap-3"><button onClick={() => setChildren(Math.max(0, children-1))} className="w-7 h-7 rounded-full border flex items-center justify-center">-</button><span>{children}</span><button onClick={() => setChildren(children+1)} className="w-7 h-7 rounded-full border flex items-center justify-center">+</button></div></div>
                    <div className="flex justify-between py-1 border-t"><span className="text-sm">Bébés</span><div className="flex gap-3"><button onClick={() => setBabies(Math.max(0, babies-1))} className="w-7 h-7 rounded-full border flex items-center justify-center">-</button><span>{babies}</span><button onClick={() => setBabies(babies+1)} className="w-7 h-7 rounded-full border flex items-center justify-center">+</button></div></div>
                    <p className="text-xs text-gray-400 mt-2">Max {maxGuests} pers.</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm"><span>{nightlyPrice.toLocaleString()} FCFA × {nights} nuits</span><span>{subtotalFormatted.fCFA}</span></div>
                  <div className="flex justify-between text-sm"><span>Frais de service (10%)</span><span>{serviceFeeFormatted.fCFA}</span></div>
                  <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span className="text-[#00c9a7]">{totalFormatted.fCFA}</span></div>
                </div>

                <button onClick={handleReserveClick} disabled={availabilityStatus !== 'available'} className={`w-full py-3 rounded-xl font-bold transition-all ${availabilityStatus === 'available' ? 'bg-gradient-to-r from-[#00c9a7] to-[#00a887] text-white hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                  {availabilityStatus === 'available' ? 'Réserver' : 'Non disponible'}
                </button>
                
                {onChat && hostId && (
                  <button onClick={handleChatWithAuth} className="border border-[#00c9a7] text-[#00c9a7] rounded-xl px-6 py-3 font-medium hover:bg-[#00c9a7]/10 transition-colors flex items-center justify-center gap-2 w-full mt-2">
                    <MessageCircle className="w-5 h-5" /> Discutez avec l'hôte
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant manquant
const Receipt = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);


// pages.tsx - Version complète de HomePage


// HomePage.tsx - Version finale avec les couleurs du site et prix en euros


export function HomePage({ onNavigate }: { onNavigate?: (route: Route) => void }) {
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchDestination, setSearchDestination] = useState('');
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingAPI, setIsSearchingAPI] = useState(false);

  const { data: allPropertiesData, isLoading: allPropertiesLoading } = useQuery({
    queryKey: ['all-properties'],
    queryFn: () => propertyService.getAll({ per_page: 50, sort_by: 'popular' }),
  });

  const { data: hotelsData, isLoading: hotelsLoading } = useQuery({
    queryKey: ['hotels-promoted'],
    queryFn: () => propertyService.getAll({ 
      is_hotel_promoted: true,
      per_page: 20 
    }),
  });

  const rawAllProperties = allPropertiesData?.data?.data || allPropertiesData?.data || [];
  const rawHotels = hotelsData?.data?.data || hotelsData?.data || [];
  
  const allProperties = useMemo(() => {
    return rawAllProperties.map(mapProperty).filter((p: any) => p.isVisible);
  }, [rawAllProperties]);

  const hotelsProperties = useMemo(() => {
    return rawHotels.map(mapProperty).filter((p: any) => p.isVisible);
  }, [rawHotels]);

// pages.tsx
const enrichedProperties = useMemo(() => {
    return allProperties;
}, [allProperties]);

const enrichedHotels = useMemo(() => {
    return hotelsProperties;
}, [hotelsProperties]);

  const searchProperties = useCallback(async (searchParams: {
    destination?: string;
    check_in?: string;
    check_out?: string;
    guests?: number;
  }) => {
    setIsSearchingAPI(true);
    setShowSearchResults(true);
    setSearchDestination(searchParams.destination || '');
    
    try {
      const filters: any = { per_page: 50 };
      
      if (searchParams.check_in && searchParams.check_out) {
        filters.check_in = searchParams.check_in;
        filters.check_out = searchParams.check_out;
      }
      
      if (searchParams.guests && searchParams.guests > 0) {
        filters.max_guests = searchParams.guests;
      }
      
      const response = await propertyService.getAll(filters);
      let allResults = response?.data?.data || response?.data || [];
      
      const destination = searchParams.destination?.toLowerCase().trim();
      let filteredResults = allResults;
      
      if (destination) {
        filteredResults = allResults.filter((prop: any) => {
          const city = (prop.city || '').toLowerCase();
          const district = (prop.district || '').toLowerCase();
          return city === destination || city.includes(destination) ||
                 district === destination || district.includes(destination);
        });
      }
      
      const mappedResults = filteredResults.map(mapProperty).filter((p: any) => p.isVisible);
      setSearchResults(mappedResults);
      
      if (mappedResults.length === 0 && destination) {
        toast.error(`Aucun logement trouvé à ${searchParams.destination}`);
      }
    } catch (error) {
      console.error('❌ Erreur recherche:', error);
      setSearchResults([]);
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsSearchingAPI(false);
    }
  }, []);

  const handleRealTimeSearch = (destination: string) => {
    setSearchDestination(destination);
    
    if (!destination.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    const allProps = [...allProperties, ...hotelsProperties];
    const lowerDest = destination.toLowerCase().trim();
    
    const filtered = allProps.filter(prop => {
      const cityMatch = prop.city?.toLowerCase() === lowerDest ||
                       prop.city?.toLowerCase().includes(lowerDest);
      const districtMatch = prop.district?.toLowerCase() === lowerDest ||
                           prop.district?.toLowerCase().includes(lowerDest);
      const locationMatch = prop.location?.toLowerCase().includes(lowerDest);
      
      return cityMatch || districtMatch || locationMatch;
    });
    
    setSearchResults(filtered);
    setShowSearchResults(true);
    setIsSearching(false);
  };

  const clearSearch = () => {
    setSearchDestination('');
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const applyFilters = (properties: any[]) => {
    let filtered = [...properties];
    switch (selectedFilter) {
      case 'Prix croissant':
        return filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'Prix décroissant':
        return filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'Mieux notés':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return filtered;
    }
  };

  const displayProperties = showSearchResults ? searchResults : enrichedProperties;
  const filteredProperties = applyFilters(displayProperties);

  const handleFullSearch = (searchParams: any) => {
    searchProperties({
      destination: searchParams.destination,
      check_in: searchParams.checkIn,
      check_out: searchParams.checkOut,
      guests: searchParams.guests
    });
  };

  const isLoading = allPropertiesLoading || hotelsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00c9a7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des logements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Navbar
        onGoHome={() => window.location.reload()}
        onNavigate={onNavigate}
        currentPage="home"
        onSearch={handleFullSearch}
        onRealTimeSearch={handleRealTimeSearch}
        allLogements={enrichedProperties}
      />

      <Hero 
        onSearch={(query) => {
          setSearchDestination(query);
          handleRealTimeSearch(query);
        }} 
        onNavigate={(path, params) => {
          if (path === 'search-logements') {
            if (params?.destination) {
              setSearchDestination(params.destination);
              handleRealTimeSearch(params.destination);
            }
          } else {
            onNavigate?.({ name: path, ...params });
          }
        }} 
      />

      {showSearchResults && (
        <div className="bg-[#f4fffe] border-b border-gray-200 px-4 py-3">
          <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-[#00c9a7]/10 rounded-full p-1.5">
                <Search className="w-4 h-4 text-[#00c9a7]" />
              </div>
              <span className="text-sm text-gray-600">
                {isSearchingAPI || isSearching ? 'Recherche en cours...' :
                 `${searchResults.length} résultat${searchResults.length > 1 ? 's' : ''} trouvé${searchResults.length > 1 ? 's' : ''} pour "${searchDestination}"`}
              </span>
            </div>
            <button onClick={clearSearch} className="text-sm text-[#00c9a7] hover:underline flex items-center gap-1">
              <X className="w-3 h-3" />
              Effacer la recherche
            </button>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-30 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                <div className="relative">
                  <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:border-gray-400 transition-colors">
                    <Filter className="w-4 h-4 text-[#00c9a7]" />
                    <span className="text-sm text-[#0F2940]">Trier par</span>
                    <ChevronDown className={`w-4 h-4 transition-transform text-[#0F2940] ${showFilterDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showFilterDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-2">
                        {filtersList.map(filter => (
                          <button
                            key={filter}
                            onClick={() => {
                              setSelectedFilter(filter);
                              setShowFilterDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-[#f4fffe] ${selectedFilter === filter ? 'text-[#00c9a7] font-medium' : 'text-gray-700'}`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                <div className="text-sm text-[#0F2940]">
                  {!isLoading ? (
                    `${filteredProperties.length} logement${filteredProperties.length > 1 ? 's' : ''} disponible${filteredProperties.length > 1 ? 's' : ''}`
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#00c9a7] border-t-transparent rounded-full animate-spin"></div>
                      <span>Chargement...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1440px] mx-auto">
          
          {filteredProperties.length > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-[#0F2940]">
                  {showSearchResults ? 'Résultats de recherche' : 'Tous les logements au Bénin'}
                </h2>
                <p className="text-gray-500 mt-1">
                  {showSearchResults 
                    ? `Voici les logements correspondant à "${searchDestination}"`
                    : 'Découvrez notre sélection de logements à travers le Bénin'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    showDescription
                    onNavigate={onNavigate}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </>
          ) : showSearchResults ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[#f4fffe] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-[#00c9a7]" />
              </div>
              <h3 className="text-xl font-semibold text-[#0F2940] mb-2">Aucun résultat</h3>
              <p className="text-gray-500">
                Aucun logement ne correspond à votre recherche "{searchDestination}".
              </p>
              <button onClick={clearSearch} className="mt-4 px-6 py-2 bg-[#00c9a7] text-white rounded-full font-medium hover:bg-[#00b396] transition">
                Voir tous les logements
              </button>
            </div>
          ) : null}

          {/* Section Hôtels */}
          {!showSearchResults && hotelsProperties.length > 0 && (
            <div className="mt-12 mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <button onClick={() => onNavigate?.({ name: 'hotels' })} className="flex items-center gap-2 text-2xl font-semibold text-[#0F2940] hover:text-[#00c9a7] transition-colors group">
                    De superbes hôtels pour votre prochain voyage
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform text-[#00c9a7]" />
                  </button>
                  <p className="text-gray-500 mt-1">Hôtels de qualité supérieure, sélectionnés pour vous</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {hotelsProperties.slice(0, 8).map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    showDescription
                    onNavigate={onNavigate}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// pages/BookingPage.tsx


interface BookingPageProps {
    onNavigate?: (route: any) => void;
    id?: string;
    search?: string;
}

export function BookingPage({ onNavigate, id, search }: BookingPageProps) {
    const params = useParams<{ id: string }>();
    const propertyId = id || params.id;
    const location = useLocation();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
    const [mobileProvider, setMobileProvider] = useState<'MTN' | 'Moov' | 'Orange'>('MTN');
    const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [showCvv, setShowCvv] = useState(false);
    const [specialRequests, setSpecialRequests] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success' | 'error'>('form');
    const [bookingFormData, setBookingFormData] = useState<any>(null);

    // Récupérer les données du formulaire depuis sessionStorage
    useEffect(() => {
        const savedData = sessionStorage.getItem('bookingFormData');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setBookingFormData(parsed);
                console.log('📋 Données du formulaire chargées:', parsed);
            } catch (e) {
                console.error('Erreur lors du chargement des données:', e);
            }
        }
    }, []);

    // Vérifier s'il y a des données temporaires au chargement
    useEffect(() => {
        const tempData = temporaryBookingService.getBookingData();
        console.log('🔍 Vérification données temporaires:', tempData);
        
        if (tempData && !bookingFormData) {
            console.log('📦 Données temporaires trouvées:', tempData);
            
            const guestDetails = tempData.bookingFormData || {};
            
            setBookingFormData({
                check_in: tempData.checkIn,
                check_out: tempData.checkOut,
                guests: tempData.guests,
                nights: tempData.nights,
                guest_details: {
                    full_name: guestDetails.fullName || '',
                    email: guestDetails.email || '',
                    phone: guestDetails.phone || '',
                    address: guestDetails.address || ''
                },
                totalAmount: guestDetails.totalAmount || 0,
                paymentAmount: guestDetails.paymentAmount || 0
            });
            temporaryBookingService.clearBookingData();
        }
    }, []);

    const queryString = search || location.search;
    const searchParams = new URLSearchParams(queryString.startsWith('?') ? queryString.substring(1) : queryString);
    
    const checkIn = searchParams.get('check_in') || bookingFormData?.check_in || '';
    const checkOut = searchParams.get('check_out') || bookingFormData?.check_out || '';
    const guestsParam = searchParams.get('guests') || bookingFormData?.guests;
    const guests = guestsParam ? parseInt(guestsParam) : 1;
    const nightsParam = searchParams.get('nights') || bookingFormData?.nights;
    const nights = nightsParam ? parseInt(nightsParam) : 0;

    const { data: propertyData, isLoading } = useQuery({
        queryKey: ['property', propertyId],
        queryFn: () => propertyService.getById(parseInt(propertyId || '0')),
        enabled: !!propertyId,
    });

    const property = propertyData?.data || propertyData;
    const pricePerNight = property?.price_per_night || 0;
    
    const subtotal = pricePerNight * nights;
    const serviceFee = subtotal * 0.15;
    const cleaningFee = 15000;
    const total = subtotal + serviceFee + cleaningFee;
    
    const paymentAmount = bookingFormData?.paymentAmount || total;

    const validatePaymentDetails = () => {
        if (paymentMethod === 'mobile_money') {
            if (!mobileProvider) {
                setError('Veuillez sélectionner votre opérateur Mobile Money');
                return false;
            }
            if (!mobileMoneyNumber || mobileMoneyNumber.length < 8) {
                setError('Veuillez entrer un numéro Mobile Money valide');
                return false;
            }
        } else if (paymentMethod === 'card') {
            const cleanCardNumber = cardNumber.replace(/\s/g, '');
            if (!cardNumber || cleanCardNumber.length < 16) {
                setError('Veuillez entrer un numéro de carte valide');
                return false;
            }
            if (!cardExpiry || !cardExpiry.includes('/')) {
                setError('Veuillez entrer une date d\'expiration valide (MM/AA)');
                return false;
            }
            if (!cardCvv || cardCvv.length < 3) {
                setError('Veuillez entrer un CVV valide');
                return false;
            }
            if (!cardName) {
                setError('Veuillez entrer le nom sur la carte');
                return false;
            }
        }
        return true;
    };

    const processPayment = async (): Promise<boolean> => {
        if (!validatePaymentDetails()) return false;
        setIsProcessing(true);
        setPaymentStep('processing');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 2000);
        });
    };

    const handleOpenPaymentModal = () => {
        if (!user) {
            onNavigate?.({ name: 'auth' });
            return;
        }
        setError('');
        setShowPaymentModal(true);
        setPaymentStep('form');
    };

    const handlePaymentSubmit = async () => {
        if (!validatePaymentDetails()) return;

        const paymentSuccess = await processPayment();
        if (!paymentSuccess) {
            setPaymentStep('error');
            setError('Le paiement a échoué. Veuillez réessayer.');
            setIsProcessing(false);
            return;
        }

        setPaymentStep('success');
        
        const guestDetails = bookingFormData?.guest_details || {
            full_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email?.split('@')[0] || 'Voyageur',
            email: user?.email || '',
            phone: user?.phone || '',
            address: '',
            nationality: '',
            id_type: '',
            id_number: ''
        };

        const bookingData: BookingData = {
            property_id: parseInt(propertyId || '0'),
            check_in: checkIn,
            check_out: checkOut,
            guests_count: guests,
            payment_method: paymentMethod,
            mobile_money_provider: paymentMethod === 'mobile_money' ? mobileProvider : undefined,
            mobile_money_number: paymentMethod === 'mobile_money' ? mobileMoneyNumber : undefined,
            guest_details: {
                full_name: guestDetails.full_name,
                email: guestDetails.email,
                phone: guestDetails.phone,
                address: guestDetails.address,
                nationality: guestDetails.nationality,
                id_type: guestDetails.id_type,
                id_number: guestDetails.id_number
            },
            payment_option: '100',
            total_amount: total,
            payment_amount: paymentAmount,
            nights: nights,
            special_requests: specialRequests || undefined
        };

        console.log('📤 Envoi à l\'API:', bookingData);

        try {
            setLoading(true);
            const response = await bookingService.create(bookingData);
            const bookingId = response?.booking?.id || response?.data?.booking?.id || response?.id || response?.data?.id;
            sessionStorage.removeItem('bookingFormData');
            
            if (bookingId) {
                setTimeout(() => {
                    setShowPaymentModal(false);
                    setLoading(false);
                    onNavigate?.({ name: 'confirmation', id: bookingId.toString() });
                }, 1500);
            } else {
                setPaymentStep('error');
                setError("Erreur: Impossible de récupérer l'ID de la réservation");
                setIsProcessing(false);
                setLoading(false);
            }
        } catch (err: any) {
            console.error('❌ Erreur:', err);
            setPaymentStep('error');
            setIsProcessing(false);
            setLoading(false);
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat();
                setError(errorMessages.join(', '));
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Une erreur est survenue. Veuillez réessayer.');
            }
        }
    };

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const groups = cleaned.match(/.{1,4}/g);
        return groups ? groups.join(' ') : cleaned;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        setCardExpiry(value);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#f4fffe]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7]"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#f4fffe] p-4">
                <div className="text-center bg-white rounded-2xl p-8 max-w-md">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-red-500 mb-4">Propriété introuvable</p>
                    <button onClick={() => onNavigate?.({ name: 'home' })} className="text-[#00c9a7] underline">Retour à l'accueil</button>
                </div>
            </div>
        );
    }

    const guestInfo = bookingFormData?.guest_details || {};

    return (
        <>
            <div className="bg-[#f4fffe] min-h-screen pb-32 md:pb-12">
                {/* Header sticky */}
                <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => onNavigate?.({ name: 'listing', id: propertyId })} 
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition active:bg-gray-200"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="font-semibold text-[#0F2940] text-base sm:text-lg">Confirmation</h1>
                            <p className="text-xs text-gray-500">Vérifiez vos informations</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1200px] mx-auto px-4 py-4 md:py-6">
                    {/* Carte récapitulative mobile */}
                    <div className="lg:hidden bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
                        <div className="flex items-start gap-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                <img 
                                    src={property.images?.[0] || property.image} 
                                    alt={property.title} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} 
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{property.title}</h3>
                                <p className="text-xs text-gray-500 mt-0.5">{property.district}, {property.city}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs">
                                    <span className="text-gray-500">{nights} nuit{nights > 1 ? 's' : ''}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-gray-500">{guests} voyageur{guests > 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-[#00c9a7] text-sm">{total.toLocaleString()} FCFA</p>
                                <p className="text-xs text-gray-400">total</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                        {/* Colonne gauche - Informations */}
                        <div className="flex-1 space-y-4">
                            {/* Vos dates */}
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <h2 className="font-semibold text-[#0F2940] mb-3 flex items-center gap-2 text-base">
                                    <Calendar className="w-5 h-5 text-[#00c9a7]" />
                                    Vos dates
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs">Arrivée</p>
                                        <p className="font-medium text-sm">{checkIn ? new Date(checkIn).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Départ</p>
                                        <p className="font-medium text-sm">{checkOut ? new Date(checkOut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Durée</p>
                                        <p className="font-medium text-sm">{nights} nuit{nights > 1 ? 's' : ''}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs">Voyageurs</p>
                                        <p className="font-medium text-sm">{guests} pers.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vos informations */}
                            {(guestInfo.full_name || guestInfo.email || guestInfo.phone) && (
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <h2 className="font-semibold text-[#0F2940] mb-3 flex items-center gap-2 text-base">
                                        <User className="w-5 h-5 text-[#00c9a7]" />
                                        Vos informations
                                    </h2>
                                    <div className="space-y-2 text-sm">
                                        {guestInfo.full_name && (
                                            <div className="flex flex-wrap justify-between items-center">
                                                <span className="text-gray-500 text-xs">Nom complet</span>
                                                <span className="font-medium text-sm">{guestInfo.full_name}</span>
                                            </div>
                                        )}
                                        {guestInfo.email && (
                                            <div className="flex flex-wrap justify-between items-center">
                                                <span className="text-gray-500 text-xs">Email</span>
                                                <span className="font-medium text-sm break-all">{guestInfo.email}</span>
                                            </div>
                                        )}
                                        {guestInfo.phone && (
                                            <div className="flex flex-wrap justify-between items-center">
                                                <span className="text-gray-500 text-xs">Téléphone</span>
                                                <span className="font-medium text-sm">{guestInfo.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Demandes spéciales */}
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                <h2 className="font-semibold text-[#0F2940] mb-3 flex items-center gap-2 text-base">
                                    <MessageCircle className="w-5 h-5 text-[#00c9a7]" />
                                    Demandes spéciales
                                </h2>
                                <textarea 
                                    value={specialRequests} 
                                    onChange={(e) => setSpecialRequests(e.target.value)} 
                                    placeholder="Horaires d'arrivée, allergies, demandes particulières..." 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent resize-none text-sm" 
                                    rows={3} 
                                />
                            </div>
                        </div>

                        {/* Colonne droite - Résumé et paiement */}
                        <div className="lg:w-96 space-y-4">
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 sticky top-20">
                                <h2 className="font-semibold text-[#0F2940] mb-3 text-base">Détail des prix</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{pricePerNight.toLocaleString()} FCFA × {nights} nuits</span>
                                        <span>{subtotal.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Frais de ménage</span>
                                        <span>{cleaningFee.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Frais de service (15%)</span>
                                        <span>{serviceFee.toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 mt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">Total</span>
                                            <span className="font-bold text-[#00c9a7] text-base sm:text-lg">{total.toLocaleString()} FCFA</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleOpenPaymentModal} 
                                    disabled={loading} 
                                    className="w-full mt-4 bg-gradient-to-r from-[#00c9a7] to-[#00a887] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm active:scale-[0.98]"
                                >
                                    {loading ? 'Traitement...' : 'Procéder au paiement'}
                                </button>
                                
                                <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        <span>Paiement sécurisé</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        <span>Garantie BF-Immo</span>
                                    </div>
                                </div>
                            </div>

                            {/* Support */}
                            <div className="bg-[#0F2940]/5 rounded-xl p-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#00c9a7]/20 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="w-4 h-4 text-[#00c9a7]" />
                                </div>
                                <div>
                                    <p className="font-medium text-[#0F2940] text-sm">Une question ?</p>
                                    <p className="text-xs text-gray-500">Contactez notre support 24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de paiement */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/50 backdrop-blur-sm" style={{ overflow: 'hidden' }}>
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-fadeInUp shadow-2xl" style={{ overflow: 'hidden' }}>
                        {/* Header modal */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 rounded-t-2xl flex justify-between items-center z-10">
                            <h3 className="text-base sm:text-lg font-semibold text-[#0F2940]">
                                {paymentStep === 'form' && 'Paiement sécurisé'}
                                {paymentStep === 'processing' && 'Traitement en cours...'}
                                {paymentStep === 'success' && 'Paiement réussi !'}
                                {paymentStep === 'error' && 'Erreur de paiement'}
                            </h3>
                            <button 
                                onClick={() => { setShowPaymentModal(false); setPaymentStep('form'); setError(''); }} 
                                className="p-2 rounded-full hover:bg-gray-100 transition active:bg-gray-200"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Body modal */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            {paymentStep === 'form' && (
                                <div className="space-y-5">
                                    {/* Montant */}
                                    <div className="bg-gradient-to-r from-[#00c9a7]/10 to-[#0F2940]/10 rounded-xl p-4 text-center">
                                        <p className="text-xs sm:text-sm text-gray-600">Montant à payer</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-[#00c9a7]">{paymentAmount.toLocaleString()} FCFA</p>
                                    </div>

                                    {/* Méthode de paiement */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Méthode de paiement</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                type="button" 
                                                onClick={() => { setPaymentMethod('mobile_money'); setError(''); }} 
                                                className={`flex flex-col items-center gap-2 p-3 sm:p-4 border-2 rounded-xl transition-all active:scale-[0.98] ${paymentMethod === 'mobile_money' ? 'border-[#00c9a7] bg-[#00c9a7]/5' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <Smartphone className={`w-5 h-5 sm:w-6 sm:h-6 ${paymentMethod === 'mobile_money' ? 'text-[#00c9a7]' : 'text-gray-400'}`} />
                                                <span className="text-xs sm:text-sm font-medium">Mobile Money</span>
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => { setPaymentMethod('card'); setError(''); }} 
                                                className={`flex flex-col items-center gap-2 p-3 sm:p-4 border-2 rounded-xl transition-all active:scale-[0.98] ${paymentMethod === 'card' ? 'border-[#00c9a7] bg-[#00c9a7]/5' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <CreditCard className={`w-5 h-5 sm:w-6 sm:h-6 ${paymentMethod === 'card' ? 'text-[#00c9a7]' : 'text-gray-400'}`} />
                                                <span className="text-xs sm:text-sm font-medium">Carte bancaire</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile Money */}
                                    {paymentMethod === 'mobile_money' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Opérateur</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {(['MTN', 'Moov', 'Orange'] as const).map((provider) => (
                                                        <button 
                                                            key={provider} 
                                                            type="button" 
                                                            onClick={() => { setMobileProvider(provider); setError(''); }} 
                                                            className={`py-2 sm:py-3 rounded-xl border-2 transition-all font-medium text-sm ${mobileProvider === provider ? 'border-[#00c9a7] bg-[#00c9a7]/5 text-[#00c9a7]' : 'border-gray-200 hover:border-gray-300'}`}
                                                        >
                                                            {provider}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro Mobile Money</label>
                                                <input 
                                                    type="tel" 
                                                    value={mobileMoneyNumber} 
                                                    onChange={(e) => { setMobileMoneyNumber(e.target.value); setError(''); }} 
                                                    placeholder="97 00 00 00" 
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent text-sm" 
                                                />
                                                <p className="text-xs text-gray-400 mt-1">Vous recevrez une demande de paiement sur ce numéro</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Carte bancaire */}
                                    {paymentMethod === 'card' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte</label>
                                                <input 
                                                    type="text" 
                                                    value={cardNumber} 
                                                    onChange={handleCardNumberChange} 
                                                    placeholder="1234 5678 9012 3456" 
                                                    maxLength={19} 
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent text-sm" 
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration</label>
                                                    <input 
                                                        type="text" 
                                                        value={cardExpiry} 
                                                        onChange={handleExpiryChange} 
                                                        placeholder="MM/AA" 
                                                        maxLength={5} 
                                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent text-sm" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                                    <div className="relative">
                                                        <input 
                                                            type={showCvv ? 'text' : 'password'} 
                                                            value={cardCvv} 
                                                            onChange={(e) => setCardCvv(e.target.value)} 
                                                            placeholder="123" 
                                                            maxLength={4} 
                                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent text-sm pr-10" 
                                                        />
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setShowCvv(!showCvv)} 
                                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                                        >
                                                            {showCvv ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Nom sur la carte</label>
                                                <input 
                                                    type="text" 
                                                    value={cardName} 
                                                    onChange={(e) => setCardName(e.target.value.toUpperCase())} 
                                                    placeholder="JEAN DUPONT" 
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent text-sm uppercase" 
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                            <p className="text-sm text-red-600">{error}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Écran de traitement */}
                            {paymentStep === 'processing' && (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00c9a7] mx-auto mb-4"></div>
                                    <p className="text-gray-600">Traitement du paiement en cours...</p>
                                    <p className="text-sm text-gray-400 mt-2">Veuillez ne pas fermer cette fenêtre</p>
                                </div>
                            )}

                            {/* Écran de succès */}
                            {paymentStep === 'success' && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-[#0F2940] mb-2">Paiement réussi !</h4>
                                    <p className="text-gray-500">Votre réservation est en cours de confirmation</p>
                                    <p className="text-sm text-gray-400 mt-4">Redirection en cours...</p>
                                </div>
                            )}

                            {/* Écran d'erreur */}
                            {paymentStep === 'error' && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle className="w-8 h-8 text-red-500" />
                                    </div>
                                    <h4 className="text-xl font-semibold text-[#0F2940] mb-2">Erreur de paiement</h4>
                                    <p className="text-gray-500 mb-4">{error || 'Une erreur est survenue. Veuillez réessayer.'}</p>
                                    <button 
                                        type="button" 
                                        onClick={() => { setPaymentStep('form'); setError(''); setIsProcessing(false); }} 
                                        className="px-6 py-2 bg-[#00c9a7] text-white rounded-xl"
                                    >
                                        Réessayer
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer modal - bouton de paiement */}
                        {paymentStep === 'form' && (
                            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 rounded-b-2xl">
                                <button 
                                    type="button" 
                                    onClick={handlePaymentSubmit} 
                                    disabled={isProcessing} 
                                    className="w-full bg-gradient-to-r from-[#00c9a7] to-[#00a887] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm active:scale-[0.98]"
                                >
                                    {isProcessing ? 'Traitement...' : `Payer ${paymentAmount.toLocaleString()} FCFA`}
                                </button>
                                <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mt-3">
                                    <div className="flex items-center gap-1">
                                        <Lock className="w-3 h-3" />
                                        <span>Paiement sécurisé</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        <span>Données chiffrées</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
// Styles d'animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    .animate-fadeInUp {
        animation: fadeInUp 0.3s ease-out;
    }
`;
document.head.appendChild(style);


export function SearchPage({ mode, onNavigate }: { mode: 'logements' | 'hotels'; onNavigate?: (route: Route) => void }) {
  const [searchParams] = useSearchParams();
  const destination = searchParams.get('destination') || '';
  const checkIn = searchParams.get('check_in') || '';
  const checkOut = searchParams.get('check_out') || '';
  const guests = searchParams.get('guests') || '1';
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchDestination, setSearchDestination] = useState(destination);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Utiliser la recherche avancée avec les filtres de l'URL
  const { data, isLoading } = useQuery({
    queryKey: ['search', destination, checkIn, checkOut, guests, mode],
    queryFn: () => propertyService.advancedSearch({
      destination: destination || undefined,
      check_in: checkIn || undefined,
      check_out: checkOut || undefined,
      guests: parseInt(guests) || 1,
      property_type: mode === 'hotels' ? 'hotel' : undefined,
      per_page: 50,
    }),
  });

  const allProperties = (data?.data?.data || []).map(mapProperty);

  // Filtrage local (destination et tri)
  const filterByDestination = (properties: any[]) => {
    if (!searchDestination) return properties;
    const lower = searchDestination.toLowerCase();
    return properties.filter(p => p.location.toLowerCase().includes(lower) || p.city.toLowerCase().includes(lower));
  };

  const applyFilters = (properties: any[]) => {
    let filtered = filterByDestination([...properties]);
    switch (selectedFilter) {
      case 'Prix croissant': return filtered.sort((a,b) => a.price - b.price);
      case 'Prix décroissant': return filtered.sort((a,b) => b.price - a.price);
      case 'Mieux notés': return filtered.sort((a,b) => b.rating - a.rating);
      default: return filtered;
    }
  };

  const displayedProperties = applyFilters(allProperties);

  const performSearch = () => {
    // Mettre à jour l'URL avec la nouvelle destination (optionnel)
    if (searchDestination !== destination) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('destination', searchDestination);
      window.history.pushState({}, '', `${window.location.pathname}?${newParams.toString()}`);
      window.location.reload(); // ou utiliser navigate avec react-router-dom
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7]" /></div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Barre de recherche */}
      <div className="bg-gradient-to-r from-[#00c9a7] to-[#0f2940] py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#00c9a7]">DESTINATION</label>
                <input type="text" placeholder="Où allez-vous ?" value={searchDestination} onChange={(e) => setSearchDestination(e.target.value)} className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#00c9a7]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#00c9a7]">ARRIVÉE</label>
                <input type="date" value={checkIn} onChange={(e) => {}} className="w-full mt-1 p-2 border rounded" disabled />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#00c9a7]">DÉPART</label>
                <input type="date" value={checkOut} onChange={(e) => {}} className="w-full mt-1 p-2 border rounded" disabled />
              </div>
              <div className="flex items-end">
                <button onClick={performSearch} className="w-full bg-[#00c9a7] text-white py-2 rounded-lg font-semibold hover:bg-[#00b396] transition-colors">Rechercher</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-[#0f2940] hover:border-[#00c9a7] transition-colors">
                <Filter className="w-4 h-4" /><span>Filtres</span><ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showFilterDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />
                  <div className="absolute top-full left-0 mt-2 z-50 w-56 rounded-2xl border border-gray-200 bg-white shadow-xl">
                    {filtersList.map(filter => (
                      <button key={filter} onClick={() => { setSelectedFilter(filter); setShowFilterDropdown(false); }} className={`w-full px-4 py-3 text-left text-sm transition-colors ${selectedFilter === filter ? 'text-[#00c9a7] font-semibold' : 'text-[#0f2940] hover:bg-gray-50'}`}>
                        {filter}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="text-sm text-gray-600">{displayedProperties.length} logements disponibles</div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm">
            <MapPin className="w-4 h-4 text-[#00c9a7]" />
            <span>{searchDestination || 'Réservez dans une ville du Bénin'}</span>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedProperties.map(property => (
            <PropertyCard key={property.id} property={property} showDescription onNavigate={onNavigate} isFavorite={isFavorite} toggleFavorite={toggleFavorite} />
          ))}
        </div>
        {displayedProperties.length === 0 && (
          <div className="text-center py-12"><p className="text-gray-500">Aucun logement trouvé pour ces critères.</p></div>
        )}
      </main>
    </div>
  );
}


// ==================== PAGE POPULAR (VERSION COMPLÈTE AVEC CARTE) ====================
export function PopularPage({ onNavigate }: { onNavigate?: (route: Route) => void }) {
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data, isLoading } = useQuery({
    queryKey: ['popular-properties-full'],
    queryFn: () => propertyService.getAll({ sort_by: 'popular', per_page: 50 }),
  });

  const rawProperties = data?.data?.data || [];
  
  // ✅ Utiliser mapProperty qui a la bonne logique d'images
  const properties = rawProperties.map(mapProperty);

  const filterProperties = (props: any[]) => {
    const filtered = [...props];
    if (selectedFilter === 'Prix croissant') return filtered.sort((a,b) => (a.priceNumber || a.price) - (b.priceNumber || b.price));
    if (selectedFilter === 'Prix décroissant') return filtered.sort((a,b) => (b.priceNumber || b.price) - (a.priceNumber || a.price));
    if (selectedFilter === 'Mieux notés') return filtered.sort((a,b) => (b.rating || 0) - (a.rating || 0));
    return filtered;
  };

  const displayedProperties = filterProperties(properties);

  // ✅ Fonction pour obtenir l'image avec fallback
  const getImageUrl = (property: any) => {
    if (property.images && property.images.length > 0 && property.images[0]) {
      return property.images[0];
    }
    if (property.image && property.image !== 'undefined') {
      return property.image;
    }
    return `https://picsum.photos/seed/${property.id}/400/300`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec retour */}
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-4 z-20">
        <button onClick={() => onNavigate?.({ name: 'home' })} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-[#0F2940]">Logements populaires · Bénin</h1>
        <span className="text-sm text-gray-500 ml-auto">{displayedProperties.length} logements</span>
      </div>

      {/* Barre de filtres */}
      <div className="sticky top-[73px] bg-white border-b px-4 py-2 z-10">
        <div className="relative inline-block">
          <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300">
            <Filter className="w-4 h-4 text-[#00c9a7]"/>
            <span>Trier : {selectedFilter}</span>
            <ChevronDown className="w-4 h-4"/>
          </button>
          {showFilterDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-xl border w-44 z-20">
              {["Tous", "Prix croissant", "Prix décroissant", "Mieux notés"].map(f => (
                <div 
                  key={f} 
                  className={`p-3 hover:bg-[#00c9a7]/10 cursor-pointer transition-colors ${selectedFilter === f ? 'text-[#00c9a7] font-medium' : ''}`} 
                  onClick={() => { setSelectedFilter(f); setShowFilterDropdown(false); }}
                >
                  {f}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grille des logements */}
      <div className="p-4">
        {displayedProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun logement trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProperties.map(property => {
              const imageUrl = getImageUrl(property);
              console.log(`🖼️ PopularPage - ID ${property.id}:`, imageUrl.substring(0, 80));
              
              return (
                <div 
                  key={property.id} 
                  className="group cursor-pointer border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        console.error(`❌ Erreur chargement image ID ${property.id}:`, imageUrl);
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${property.id}/400/300`;
                      }}
                      onLoad={() => console.log(`✅ Image chargée ID ${property.id}`)}
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(property); }} 
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-all z-10 backdrop-blur-sm shadow-md"
                    >
                      <Heart className={`w-5 h-5 transition-all ${isFavorite(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                    </button>
                    {property.rating >= 4.8 && (
                      <div className="absolute bottom-3 left-3 bg-[#00c9a7] text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                        Coup de cœur
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-[#0F2940] line-clamp-1">{property.title}</h3>
                      <div className="flex items-center gap-1 text-sm flex-shrink-0">
                        <Star className="w-4 h-4 fill-[#00c9a7] text-[#00c9a7]" />
                        <span className="font-medium">{property.rating}</span>
                        <span className="text-gray-500">({property.reviews})</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{property.location}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      {property.beds > 0 && (
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span>{property.beds} lit{property.beds > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {property.bathrooms > 0 && (
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span>{property.bathrooms} sdb</span>
                        </div>
                      )}
                    </div>
                    <p className="font-bold mt-2 text-[#0F2940]">{property.priceDisplay}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de détail */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onNavigate={onNavigate}
          onReserve={({ checkIn, checkOut, guests, nights }) => 
            onNavigate?.({ 
              name: 'booking', 
              id: selectedProperty.id.toString(), 
              search: `?check_in=${encodeURIComponent(checkIn)}&check_out=${encodeURIComponent(checkOut)}&guests=${guests}&nights=${nights}` 
            })
          }
          onChat={() => onNavigate?.({ name: 'messages', id: 'inquiry', search: `?property=${selectedProperty.id}` })}
        />
      )}
    </div>
  );
}

// ==================== LISTING PAGE ====================
interface ListingPageProps {
  onNavigate?: (route: any) => void;
  id?: string;
}

export function ListingPage({ onNavigate, id }: ListingPageProps) {
  const [selectedCheckIn, setSelectedCheckIn] = useState<string>('');
  const [selectedCheckOut, setSelectedCheckOut] = useState<string>('');
  const [selectedGuests, setSelectedGuests] = useState<number>(1);
  const [selectedNights, setSelectedNights] = useState<number>(0);

  console.log("=== ListingPage (option 2) ===");
  console.log("ID reçu:", id);

  const { data, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await propertyService.getById(parseInt(id || '0'));
      return response.data;
    },
    enabled: !!id,
  });

  if (!id) {
    return <div className="p-8 text-center">ID manquant</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7]"></div>
      </div>
    );
  }

  if (error) {
    console.error(error);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-semibold text-[#0F2940] mb-2">Erreur de chargement</h1>
          <p className="text-gray-500 mb-4">Impossible de récupérer les annonces.</p>
          <button 
            onClick={() => onNavigate({ name: 'home' })} 
            className="px-6 py-3 bg-[#00c9a7] text-[#0F2940] rounded-full font-semibold hover:bg-[#00b892] transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }



  const rawProperty = data?.data || data;

  if (!rawProperty) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-2xl font-semibold text-[#0F2940] mb-2">Logement non trouvé</h1>
          <p className="text-gray-500 mb-4">
            Aucun logement ne correspond à l'ID <strong>{id}</strong>
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Vérifiez que l'URL est correcte ou retournez à l'accueil.
          </p>
          <button 
            onClick={() => onNavigate({ name: 'home' })} 
            className="px-6 py-3 bg-[#00c9a7] text-[#0F2940] rounded-full font-semibold hover:bg-[#00b892] transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // ✅ Fonction pour récupérer les images
  const getPropertyImages = (property: any): string[] => {
    const images: string[] = [];


    
    const addImage = (url: string) => {
      if (!url) return;
      
      let cleanUrl = url;
      
      if (cleanUrl.includes('hstgr.io') || cleanUrl.includes('srv2197-files')) {
        const filename = cleanUrl.split('/').pop();
        if (filename && property.id) {
          cleanUrl = `https://api.bluefin-immo.com/api/property-image/${property.id}/${filename}`;
        }
      } else if (cleanUrl.startsWith('/storage')) {
        cleanUrl = `https://api.bluefin-immo.com${cleanUrl}`;
      } else if (cleanUrl.startsWith('/api/public/storage')) {
        cleanUrl = `https://api.bluefin-immo.com${cleanUrl}`;
      } else if (!cleanUrl.startsWith('http')) {
        cleanUrl = `https://api.bluefin-immo.com/storage/${cleanUrl}`;
      }
      
      if (!images.includes(cleanUrl) && !cleanUrl.includes('undefined')) {
        images.push(cleanUrl);
      }
    };
    
    if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
      for (const photo of property.photos) {
        if (photo.photo_url) {
          addImage(photo.photo_url);
        } else if (photo.full_url) {
          addImage(photo.full_url);
        } else if (photo.photo_path) {
          const filename = photo.photo_path.split('/').pop();
          if (filename) {
            addImage(`https://api.bluefin-immo.com/api/property-image/${property.id}/${filename}`);
          }
        }
      }
    }
    
    if (property.cover_photo && typeof property.cover_photo === 'object') {
      if (property.cover_photo.photo_url) {
        addImage(property.cover_photo.photo_url);
      } else if (property.cover_photo.full_url) {
        addImage(property.cover_photo.full_url);
      } else if (property.cover_photo.photo_path) {
        const filename = property.cover_photo.photo_path.split('/').pop();
        if (filename) {
          addImage(`https://api.bluefin-immo.com/api/property-image/${property.id}/${filename}`);
        }
      }
    }
    
    if (images.length === 0) {
      images.push(`https://picsum.photos/seed/${property.id}/400/300`);
    }
    
    return images;
  };

  

  // ✅ Fonction de réservation
  const handleReserve = (dates: { checkIn: string; checkOut: string; guests: number; nights: number }) => {
    console.log('🔍 Réservation déclenchée avec:', dates);
    
    setSelectedCheckIn(dates.checkIn);
    setSelectedCheckOut(dates.checkOut);
    setSelectedGuests(dates.guests);
    setSelectedNights(dates.nights);
    
    const searchParams = new URLSearchParams({
        check_in: dates.checkIn,
        check_out: dates.checkOut,
        guests: dates.guests.toString(),
        nights: dates.nights.toString()
    });
    
    const url = `/booking/${rawProperty.id}?${searchParams.toString()}`;
    console.log('🔍 Navigation vers:', url);
    
    if (onNavigate) {
        onNavigate({ 
            name: 'booking', 
            id: rawProperty.id.toString(),
            search: searchParams.toString()
        });
    } else {
        window.location.href = url;
    }
  };

 // Dans ListingPage.tsx
const handleChatClick = () => {
    console.log('🔍 handleChatClick - property.id:', property.id);
    
    // Construire les paramètres
    const params = new URLSearchParams();
    params.set('property', property.id.toString());
    
    if (selectedCheckIn && selectedCheckOut) {
        params.set('check_in', selectedCheckIn);
        params.set('check_out', selectedCheckOut);
    }
    if (selectedGuests && selectedGuests > 0) {
        params.set('guests', selectedGuests.toString());
    }
    
    const searchString = params.toString();
    const fullUrl = `/messages/inquiry?${searchString}`;
    console.log('🔗 Navigation vers:', fullUrl);
    
    // Utiliser window.location pour une navigation directe
    window.location.href = fullUrl;
};

  // ✅ Récupérer toutes les images
  const propertyImages = getPropertyImages(rawProperty);
  const firstImage = propertyImages[0] || '/placeholder.jpg';

  // ✅ Transformation des données
  const property = {
    id: rawProperty.id,
    title: rawProperty.title,
    location: `${rawProperty.district}, ${rawProperty.city}`,
    price: rawProperty.price_per_night,
    priceNumber: parseFloat(rawProperty.price_per_night),
    priceDisplay: `${parseInt(rawProperty.price_per_night).toLocaleString()} FCFA / nuit`,
    rating: parseFloat(rawProperty.average_rating) || 0,
    reviews: rawProperty.reviews_count || 0,
    image: firstImage,
    images: propertyImages,
    beds: rawProperty.beds || 0,
    baths: rawProperty.bathrooms || 0,
    description: rawProperty.description,
    longDescription: rawProperty.description,
    amenities: [
      rawProperty.has_wifi && 'Wi-Fi',
      rawProperty.has_air_conditioning && 'Climatisation',
      rawProperty.has_parking && 'Parking gratuit',
      rawProperty.has_pool && 'Piscine',
      rawProperty.has_kitchen && 'Cuisine équipée',
      rawProperty.has_tv && 'Télévision',
      rawProperty.has_breakfast && 'Petit-déjeuner',
      rawProperty.has_generator && 'Générateur',
      rawProperty.has_water_tank && 'Réservoir d\'eau',
      rawProperty.has_gym && 'Salle de sport',
      rawProperty.has_spa && 'Spa',
      rawProperty.has_elevator && 'Ascenseur',
      rawProperty.has_laundry && 'Lave-linge',
      rawProperty.has_cctv && 'Caméras de surveillance',
      rawProperty.has_electric_fence && 'Clôture électrique',
      rawProperty.allows_pets && 'Animaux acceptés',
      rawProperty.allows_children && 'Enfants acceptés',
      rawProperty.airport_shuttle && 'Navette aéroport',
      rawProperty.housekeeping && 'Ménage inclus',
      rawProperty.room_service && 'Service en chambre',
      rawProperty.wheelchair_accessible && 'Accessible fauteuil roulant',
    ].filter(Boolean),
    host: (() => {
      const userName = [rawProperty.user?.first_name, rawProperty.user?.last_name].filter(Boolean).join(' ');
      const hostName = [rawProperty.host?.first_name, rawProperty.host?.last_name].filter(Boolean).join(' ');
      return rawProperty.user?.full_name
        || userName
        || rawProperty.host?.full_name
        || hostName
        || rawProperty.published_by?.full_name
        || rawProperty.host_name
        || 'Hôte vérifié';
    })(),
    hostImage: (() => {
      const hostName = (() => {
        const userName = [rawProperty.user?.first_name, rawProperty.user?.last_name].filter(Boolean).join(' ');
        const hostName = [rawProperty.host?.first_name, rawProperty.host?.last_name].filter(Boolean).join(' ');
        return rawProperty.user?.full_name
          || userName
          || rawProperty.host?.full_name
          || hostName
          || rawProperty.published_by?.full_name
          || rawProperty.host_name
          || 'Hôte vérifié';
      })();
      return `https://ui-avatars.com/api/?background=00c9a7&color=fff&name=${encodeURIComponent(hostName)}&bold=true&size=128`;
    })(),
    hostSince: (rawProperty.user?.created_at || rawProperty.host?.created_at || rawProperty.published_by?.created_at)
      ? new Date(rawProperty.user?.created_at || rawProperty.host?.created_at || rawProperty.published_by?.created_at).getFullYear().toString()
      : '2024',
    hostId: rawProperty.user?.id || rawProperty.host?.id || rawProperty.published_by?.id || rawProperty.host_id || null,
    superhost: rawProperty.superhost || false,
    responseRate: 100,
    responseTime: 'quelques heures',
    property_type: rawProperty.property_type,
    bluefin_certified: rawProperty.bluefin_certified || false,
    has_generator: rawProperty.has_generator || false,
    has_wifi: rawProperty.has_wifi || false,
    has_air_conditioning: rawProperty.has_air_conditioning || false,
    has_water_tank: rawProperty.has_water_tank || false,
    cancellation_policy: rawProperty.cancellation_policy || 'moderate',
    instant_booking: rawProperty.instant_booking || false,
    check_in_time: '15:00',
    check_out_time: '11:00',
    max_guests: rawProperty.max_guests || 1,
    bedrooms: rawProperty.bedrooms || 0,
    min_stay: rawProperty.min_stay || 1,
    status: rawProperty.status,
    status_label: rawProperty.status_label,
    status_color: rawProperty.status_color,
    rejection_reason: rawProperty.rejection_reason,
  };

  console.log('🔍 Property data:', {
    id: property.id,
    title: property.title,
    imagesCount: property.images.length,
    firstImage: property.image,
    host: property.host,
    hostId: property.hostId,
  });

  // ✅ Retour du modal avec toutes les props
  return (
    <PropertyDetailModal
      property={property}
      onClose={() => onNavigate({ name: 'home' })}
      onNavigate={onNavigate}
      onReserve={handleReserve}
      onChat={handleChatClick}
      selectedCheckIn={selectedCheckIn}
      selectedCheckOut={selectedCheckOut}
      selectedGuests={selectedGuests}
    />
  );
}


// components/CancellationPolicy.tsx
interface CancellationPolicyProps {
  checkInDate?: string;
  checkOutDate?: string;
  bookingDate?: Date; // Date de réservation (maintenant par défaut)
  cancellationPolicy?: 'flexible' | 'moderate' | 'strict';
}

interface PolicyRule {
  deadline: Date;
  refundPercentage: number;
  label: string;
  description: string;
  icon: JSX.Element;
}

export function CancellationPolicy({ 
  checkInDate, 
  checkOutDate, 
  bookingDate = new Date(),
  cancellationPolicy = 'moderate'
}: CancellationPolicyProps) {
  const [policyRules, setPolicyRules] = useState<PolicyRule[]>([]);
  const [currentRule, setCurrentRule] = useState<PolicyRule | null>(null);

  // Calculer les différentes deadlines selon la politique
  useEffect(() => {
    if (!checkInDate) return;

    const checkIn = new Date(checkInDate);
    const bookingTime = new Date(bookingDate);
    
    const rules: PolicyRule[] = [];

    if (cancellationPolicy === 'flexible') {
      // Politique flexible
      const fullRefundDeadline = new Date(checkIn);
      fullRefundDeadline.setDate(checkIn.getDate() - 1);
      fullRefundDeadline.setHours(23, 59, 59);
      
      rules.push({
        deadline: fullRefundDeadline,
        refundPercentage: 100,
        label: 'Remboursement intégral',
        description: `Annulez avant le ${fullRefundDeadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} pour un remboursement complet.`,
        icon: <CheckCircle className="w-5 h-5 text-green-500" />
      });
      
      const partialRefundDeadline = new Date(checkIn);
      partialRefundDeadline.setDate(checkIn.getDate() - 7);
      partialRefundDeadline.setHours(15, 0, 0);
      
      if (partialRefundDeadline > bookingTime) {
        rules.push({
          deadline: partialRefundDeadline,
          refundPercentage: 50,
          label: 'Remboursement partiel',
          description: `Annulez avant le ${partialRefundDeadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} pour un remboursement de 50%. Les frais de service ne sont pas remboursés.`,
          icon: <Clock className="w-5 h-5 text-orange-500" />
        });
      }
      
      rules.push({
        deadline: checkIn,
        refundPercentage: 0,
        label: 'Aucun remboursement',
        description: `Annulation moins de 7 jours avant le check-in (à partir du ${partialRefundDeadline.toLocaleDateString('fr-FR')} à 15h00) : aucun remboursement, sans exception.`,
        icon: <XCircle className="w-5 h-5 text-red-500" />
      });
      
    } else if (cancellationPolicy === 'strict') {
      // Politique stricte
      const fullRefundDeadline = new Date(checkIn);
      fullRefundDeadline.setDate(checkIn.getDate() - 14);
      fullRefundDeadline.setHours(23, 59, 59);
      
      rules.push({
        deadline: fullRefundDeadline,
        refundPercentage: 100,
        label: 'Remboursement intégral',
        description: `Annulez avant le ${fullRefundDeadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} pour un remboursement complet.`,
        icon: <CheckCircle className="w-5 h-5 text-green-500" />
      });
      
      const partialRefundDeadline = new Date(checkIn);
      partialRefundDeadline.setDate(checkIn.getDate() - 7);
      partialRefundDeadline.setHours(15, 0, 0);
      
      if (partialRefundDeadline > fullRefundDeadline) {
        rules.push({
          deadline: partialRefundDeadline,
          refundPercentage: 50,
          label: 'Remboursement partiel',
          description: `Annulez avant le ${partialRefundDeadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} pour un remboursement de 50%. Les frais de service ne sont pas remboursés.`,
          icon: <Clock className="w-5 h-5 text-orange-500" />
        });
      }
      
      rules.push({
        deadline: checkIn,
        refundPercentage: 0,
        label: 'Aucun remboursement',
        description: `Annulation moins de 7 jours avant le check-in : aucun remboursement, sans exception.`,
        icon: <XCircle className="w-5 h-5 text-red-500" />
      });
      
    } else {
      // Politique modérée (par défaut)
      // Deadline pour remboursement intégral (24h après réservation)
      const fullRefundDeadline = new Date(bookingTime);
      fullRefundDeadline.setHours(bookingTime.getHours() + 24);
      
      rules.push({
        deadline: fullRefundDeadline,
        refundPercentage: 100,
        label: 'Remboursement intégral',
        description: `Annulez dans les 24h suivant votre réservation (avant le ${fullRefundDeadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}) pour un remboursement complet.`,
        icon: <CheckCircle className="w-5 h-5 text-green-500" />
      });
      
      // Deadline pour remboursement partiel (7 jours avant check-in)
      const partialRefundDeadline = new Date(checkIn);
      partialRefundDeadline.setDate(checkIn.getDate() - 7);
      partialRefundDeadline.setHours(15, 0, 0);
      
      if (partialRefundDeadline > fullRefundDeadline) {
        rules.push({
          deadline: partialRefundDeadline,
          refundPercentage: 50,
          label: 'Remboursement partiel',
          description: `Annulez avant le ${partialRefundDeadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} pour un remboursement de 50%. Les frais de service ne sont pas remboursés.`,
          icon: <Clock className="w-5 h-5 text-orange-500" />
        });
      }
      
      // Aucun remboursement
      rules.push({
        deadline: checkIn,
        refundPercentage: 0,
        label: 'Aucun remboursement',
        description: `Annulation moins de 7 jours avant le check-in (après le ${partialRefundDeadline.toLocaleDateString('fr-FR')} à 15h00) : aucun remboursement, sans exception.`,
        icon: <XCircle className="w-5 h-5 text-red-500" />
      });
    }
    
    setPolicyRules(rules);
    
    // Déterminer la règle actuelle
    const now = new Date();
    let activeRule = rules[rules.length - 1]; // Dernière règle par défaut
    
    for (const rule of rules) {
      if (now < rule.deadline) {
        activeRule = rule;
        break;
      }
    }
    
    setCurrentRule(activeRule);
    
  }, [checkInDate, bookingDate, cancellationPolicy]);

  if (!checkInDate) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 text-center">
        <p className="text-gray-500 text-sm">
          Sélectionnez vos dates pour voir la politique d'annulation
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* En-tête */} 
      <div className="bg-gradient-to-r from-[#0F2940] to-[#1a3a52] px-5 py-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#00c9a7]" />
          <h3 className="font-semibold text-white">Politique d'annulation</h3>
        </div>
      </div>
      
      {/* Règle active */}
      {currentRule && (
        <div className={`p-5 border-b ${
          currentRule.refundPercentage === 100 ? 'bg-green-50 border-green-200' :
          currentRule.refundPercentage === 50 ? 'bg-orange-50 border-orange-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {currentRule.icon}
            </div>
            <div>
              <h4 className={`font-semibold ${
                currentRule.refundPercentage === 100 ? 'text-green-700' :
                currentRule.refundPercentage === 50 ? 'text-orange-700' :
                'text-red-700'
              }`}>
                {currentRule.label}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {currentRule.description}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Liste des règles */}
      <div className="p-5 space-y-4">
        <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          L'heure indiquée est basée sur l'emplacement du logement
        </p>
        
        {policyRules.map((rule, index) => (
          <div 
            key={index} 
            className={`pb-3 ${index < policyRules.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                {rule.refundPercentage === 100 ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : rule.refundPercentage === 50 ? (
                  <Clock className="w-4 h-4 text-orange-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {rule.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {rule.description.split('.')[0]}.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Note supplémentaire */}
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Les frais de service (10%) ne sont pas remboursés en cas d'annulation partielle.
        </p>
      </div>
    </div>
  );
}
// ==================== ALL PROPERTIES PAGE ====================

export function AllPropertiesPage({ onNavigate }: { onNavigate?: (route: Route) => void }) {
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchDestination, setSearchDestination] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();

  // Récupération de TOUS les logements depuis l'API
  const { data, isLoading, error } = useQuery({
    queryKey: ['all-properties', searchDestination],
    queryFn: () => propertyService.getAll({ 
      per_page: 100,
      search: searchDestination || undefined,
    }),
  });

  const rawProperties = data?.data?.data || [];
  
  // Fonction pour récupérer la première photo
  // Dans AllPropertiesPage, remplacez la fonction getFirstPropertyImage :
// Fonction pour récupérer la première photo d'une propriété (photo de couverture)
const getFirstPropertyImage = (property: any): string => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const normalizeUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${API_URL}${url}`;
    return `${API_URL}/${url}`;
  };
  
  // 1. Vérifier les photos (relation)
  if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
    const firstPhoto = property.photos[0];
    // Vérifier photo_url (c'est le champ utilisé par votre API)
    if (firstPhoto.photo_url) {
      return normalizeUrl(firstPhoto.photo_url);
    }
    if (firstPhoto.url) {
      return normalizeUrl(firstPhoto.url);
    }
    if (firstPhoto.path) {
      return normalizeUrl(firstPhoto.path);
    }
  }
  
  // 2. Vérifier cover_photo (si existant)
  if (property.cover_photo) {
    if (typeof property.cover_photo === 'string') {
      return normalizeUrl(property.cover_photo);
    }
    const url = property.cover_photo.photo_url || property.cover_photo.url || property.cover_photo.path;
    if (url) return normalizeUrl(url);
  }
  
  // 3. Fallback
  return '/placeholder.jpg';
};
  // Transformation des données
 // Dans AllPropertiesPage, remplacez la transformation des données :
const getAllPropertyImages = (property: any): string[] => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const images: string[] = [];
  const normalizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${API_URL}${url}`;
    return `${API_URL}/${url}`;
  };

  if (property.cover_photo) {
    const cover = typeof property.cover_photo === 'string' ? property.cover_photo : (property.cover_photo.photo_url || property.cover_photo.url || property.cover_photo.path);
    const n = normalizeUrl(cover);
    if (n) images.push(n);
  }

  if (property.photos && Array.isArray(property.photos)) {
    for (const p of property.photos) {
      if (images.length >= 3) break;
      let url = '' as string;
      if (typeof p === 'string') url = p;
      else if (p && typeof p === 'object') url = p.photo_url || p.url || p.path || '';
      const n = normalizeUrl(url);
      if (n && !images.includes(n)) images.push(n);
    }
  }

  if (images.length < 3 && property.photo_urls && Array.isArray(property.photo_urls)) {
    for (const u of property.photo_urls) {
      if (images.length >= 3) break;
      const n = normalizeUrl(u);
      if (n && !images.includes(n)) images.push(n);
    }
  }

  // Champs alternatifs
  if (images.length < 3 && property.images && Array.isArray(property.images)) {
    for (const u of property.images) {
      if (images.length >= 3) break;
      const n = normalizeUrl(u);
      if (n && !images.includes(n)) images.push(n);
    }
  }

  if (images.length < 3 && property.media && Array.isArray(property.media)) {
    for (const m of property.media) {
      if (images.length >= 3) break;
      const url = typeof m === 'string' ? m : (m.url || m.path || m.photo_url || m.file?.url || '');
      const n = normalizeUrl(url);
      if (n && !images.includes(n)) images.push(n);
    }
  }

  if (images.length < 3 && property.gallery && Array.isArray(property.gallery)) {
    for (const u of property.gallery) {
      if (images.length >= 3) break;
      const n = normalizeUrl(u);
      if (n && !images.includes(n)) images.push(n);
    }
  }

  // Recherche générique d'URL dans l'objet
  const findAnyUrl = (obj: any, depth = 0): string | null => {
    if (!obj || depth > 3) return null;
    if (typeof obj === 'string') {
      if (obj.startsWith('http') || obj.startsWith('/')) return obj;
      return null;
    }
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const r = findAnyUrl(item, depth + 1);
        if (r) return r;
      }
      return null;
    }
    if (typeof obj === 'object') {
      for (const k of Object.keys(obj)) {
        const r = findAnyUrl(obj[k], depth + 1);
        if (r) return r;
      }
    }
    return null;
  };

  if (images.length === 0) {
    const any = findAnyUrl(property);
    if (any) images.push(normalizeUrl(any));
  }

  if (images.length === 0) images.push(getFirstPropertyImage(property));
  return images;
};

const allProperties = rawProperties.map((property: any) => {
  const allImages = getAllPropertyImages(property);
  const firstImage = allImages[0] || getFirstPropertyImage(property);
  const rawPrice = property.price_per_night ?? property.price ?? 0;
  const priceNumber = Number(rawPrice) || 0;

  return {
    id: property.id,
    title: property.title,
    location: `${property.district || ''}, ${property.city || ''}`.replace(/^,\s/, ''),
    price: priceNumber,
    priceNumber: priceNumber,
    priceDisplay: priceNumber ? `${priceNumber.toLocaleString()} FCFA` : '0 FCFA',
    rating: parseFloat(property.average_rating) || 0,
    reviews: property.reviews_count || 0,
    images: allImages,
    image: firstImage,  // ← Première photo
    beds: property.beds || 0,
    baths: property.bathrooms || 0,
    description: property.description,
    type: property.property_type,
    city: property.city,
    district: property.district,
  };
});
  // Enrichir les propriétés affichées en récupérant les détails pour celles sans image
  const [enrichedProperties, setEnrichedProperties] = useState<any[]>([]);

  useEffect(() => {
    setEnrichedProperties(allProperties);
    const missingIds = allProperties
      .filter(p => {
        const img = p.images?.[0] || p.image || '';
        return !img || img.includes('placeholder');
      })
      .map(p => p.id);

    if (missingIds.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(missingIds.map((id) => propertyService.getById(id).catch(() => null)));
        const mapped = results.map(r => {
          if (!r) return null;
          const raw = (r as any).data || r;
          return raw ? mapProperty(raw) : null;
        });
        if (cancelled) return;
        setEnrichedProperties(prev => prev.map(p => {
          const idx = missingIds.indexOf(p.id);
          if (idx === -1) return p;
          const m = mapped[idx];
          return m ? { ...p, images: m.images, image: m.image } : p;
        }));
      } catch (e) {
        console.warn('Enrich all-properties images failed', e);
      }
    })();
    return () => { cancelled = true; };
  }, [data]);
  // Filtrage local
  const filterProperties = (props: any[]) => {
    let filtered = [...props];
    
    if (searchDestination) {
      const lowerDest = searchDestination.toLowerCase();
      filtered = filtered.filter(
        prop => prop.location.toLowerCase().includes(lowerDest) || 
                prop.city?.toLowerCase().includes(lowerDest) ||
                prop.district?.toLowerCase().includes(lowerDest)
      );
    }
    
    switch (selectedFilter) {
      case 'Prix croissant':
        return filtered.sort((a, b) => (a.priceNumber || a.price) - (b.priceNumber || b.price));
      case 'Prix décroissant':
        return filtered.sort((a, b) => (b.priceNumber || b.price) - (a.priceNumber || a.price));
      case 'Mieux notés':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return filtered;
    }
  };

  const displayedProperties = filterProperties(enrichedProperties.length ? enrichedProperties : allProperties);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // ✅ DÉFINITION DE mapUrl (CORRECTION)
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d634630.827254447!2d2.2569729!3d6.474903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1020a44f6b9c7e9b%3A0x9b4b5c1e4f5a6b7!2sBenin!5e0!3m2!1sfr!2sfr!4v1699999999999!5m2!1sfr!2sfr";

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4">
        <div className="text-red-500 text-xl mb-4">⚠️ Erreur de chargement</div>
        <p className="text-gray-600 mb-6">Impossible de récupérer les logements.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-[#00c9a7] text-white rounded-full"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec retour */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-4 z-20">
        <button 
          onClick={() => onNavigate?.({ name: 'home' })} 
          className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F2940]" />
        </button>
        <h1 className="text-base sm:text-xl font-semibold text-[#0F2940]">Tous les logements · Bénin</h1>
        <span className="text-xs sm:text-sm text-gray-500 ml-auto">{displayedProperties.length} logements</span>
      </div>

      {/* Barre de recherche */}
      <div className="bg-gradient-to-r from-[#00c9a7]/5 to-[#0f2940]/5 px-3 sm:px-4 py-3 sm:py-4 border-b">
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="relative">
            <SearchIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par ville ou quartier..."
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent shadow-sm bg-white"
            />
          </div>
        </form>
      </div>

      {/* Barre de filtres */}
      <div className="sticky top-[57px] sm:top-[73px] bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 z-10">
        <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)} 
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 hover:border-gray-400 transition-colors bg-white text-sm sm:text-base"
            >
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00c9a7]"/>
              <span className="text-xs sm:text-sm">Trier : {selectedFilter}</span>
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`}/>
            </button>
            {showFilterDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />
                <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-xl border border-gray-200 w-40 sm:w-48 z-50 py-2">
                  {["Tous", "Prix croissant", "Prix décroissant", "Mieux notés"].map(f => (
                    <div 
                      key={f} 
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm cursor-pointer hover:bg-gray-50 transition-colors ${selectedFilter === f ? 'text-[#00c9a7] font-medium bg-[#00c9a7]/5' : 'text-gray-700'}`} 
                      onClick={() => { setSelectedFilter(f); setShowFilterDropdown(false); }}
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {searchDestination && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                🔍 {searchDestination.length > 15 ? searchDestination.slice(0, 15) + '...' : searchDestination}
              </span>
              <button 
                onClick={() => setSearchDestination('')}
                className="text-[10px] sm:text-xs text-[#00c9a7] hover:underline"
              >
                Effacer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Layout principal */}
      <div className="flex flex-col lg:flex-row">
        {/* Colonne gauche - Grille 2 colonnes responsive */}
        <div className="lg:w-1/2 p-2 sm:p-3 md:p-4 bg-white" style={{ maxHeight: 'calc(100vh - 115px)', overflowY: 'auto' }}>
          {displayedProperties.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🏠</div>
              <h2 className="text-base sm:text-xl font-semibold text-[#0F2940] mb-2">Aucun logement trouvé</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                {searchDestination 
                  ? `Aucun résultat pour "${searchDestination}"`
                  : "Aucun logement n'est disponible pour le moment."}
              </p>
              {searchDestination && (
                <button 
                  onClick={() => setSearchDestination('')}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base bg-[#00c9a7] text-white rounded-full font-medium"
                >
                  Voir tous les logements
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {displayedProperties.map((property) => (
                <div 
                  key={property.id} 
                  className="group cursor-pointer border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
                  onClick={() => onNavigate?.({ name: 'listing', id: property.id.toString() })}
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={property.images?.[0] || property.image || '/placeholder.jpg'}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
                    />
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(property); }} 
                      className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 p-1 sm:p-1.5 rounded-full bg-white/80 hover:bg-white transition-all z-10 backdrop-blur-sm shadow-md"
                    >
                      <Heart className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 ${isFavorite(property.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-700 hover:text-red-500'}`} />
                    </button>
                    {property.rating >= 4.8 && (
                      <div className="absolute bottom-1.5 sm:bottom-3 left-1.5 sm:left-3 bg-[#00c9a7] text-white text-[8px] sm:text-xs px-1 sm:px-2 py-0.5 rounded-full shadow-md">
                        ⭐ Coup de cœur
                      </div>
                    )}
                  </div>
                  
                  <div className="p-1.5 sm:p-2 md:p-3">
                    <div className="flex justify-between items-start gap-1 sm:gap-2">
                      <h3 className="font-semibold text-[#0F2940] line-clamp-1 text-[10px] sm:text-xs md:text-sm">{property.title}</h3>
                      <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                        <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-[#00c9a7] text-[#00c9a7]" />
                        <span className="font-medium text-[9px] sm:text-xs">{property.rating}</span>
                        <span className="text-gray-400 text-[8px] sm:text-xs">({property.reviews})</span>
                      </div>
                    </div>
                    <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 flex items-center gap-0.5 sm:gap-1 truncate">
                      <MapPin className="w-2 h-2 sm:w-3 sm:h-3" />
                      {property.location.length > 25 ? property.location.slice(0, 25) + '...' : property.location}
                    </p>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[8px] sm:text-xs text-gray-500">
                      {property.beds > 0 && (
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <Bed className="w-2 h-2 sm:w-3 sm:h-3" />
                          <span>{property.beds}</span>
                        </div>
                      )}
                      {property.baths > 0 && (
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <Bath className="w-2 h-2 sm:w-3 sm:h-3" />
                          <span>{property.baths}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-1 sm:mt-2 pt-0.5 sm:pt-1 border-t border-gray-100">
                      <p className="font-bold text-[#0F2940] text-[9px] sm:text-xs md:text-sm">{property.priceDisplay}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne droite - Carte */}
        <div className="lg:w-1/2 h-64 sm:h-80 lg:h-auto bg-gray-100 relative border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="lg:sticky lg:top-[115px] h-full">
            <iframe 
              title="Carte des logements au Bénin" 
              src={mapUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '250px' }} 
              allowFullScreen 
              loading="lazy" 
              className="w-full h-full"
            />
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 backdrop-blur rounded-lg px-2 sm:px-3 py-1 text-[10px] sm:text-xs shadow-md">
              📍 {displayedProperties.length} logements
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ==================== BOOKING PAGE ====================

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

interface ProfilePageProps {
  onNavigate?: (route: Route) => void;
  id?: string;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { user, isAuthenticated, loading: authLoading, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
  });

  const queryClient = useQueryClient();

  // ✅ CORRECTION: Désactiver la requête si pas authentifié ou si on a déjà l'utilisateur
  const { data, isLoading: profileLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated && !user, // ✅ Ne charger que si pas déjà d'utilisateur
    retry: false,
  });

  // ✅ Mettre à jour editedUser quand les données du profil changent
  useEffect(() => {
    const profileData = data?.user || user;
    if (profileData) {
      setEditedUser({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        bio: profileData.bio || '',
      });
    }
  }, [data, user]);

  // Mutation pour mettre à jour le profil
  const updateMutation = useMutation({
    mutationFn: (userData: any) => authService.updateProfile(userData),
    onSuccess: (response) => {
      updateUser(response.user);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Erreur mise à jour profil:', error);
    },
  });

  // Mutation pour se déconnecter
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(user?.user_type || 'voyageur'),
    onSuccess: () => {
      logout();
      onNavigate?.({ name: 'home' });
    },
    onError: (error) => {
      console.error('Erreur déconnexion:', error);
      // Force la déconnexion même en cas d'erreur
      logout();
      onNavigate?.({ name: 'home' });
    },
  });

  // ✅ CORRECTION: Attendre que l'authentification soit chargée avant de rediriger
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      onNavigate?.({ name: 'auth' });
    }
  }, [authLoading, isAuthenticated, onNavigate]);

  // ✅ CORRECTION: Afficher un loader pendant le chargement de l'authentification
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7]" />
      </div>
    );
  }

  // ✅ Vérifier l'authentification après le chargement
  if (!isAuthenticated) {
    return null;
  }

  // ✅ Afficher un loader pendant le chargement du profil (optionnel)
  if (profileLoading && !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7]" />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p>Erreur de chargement du profil</p>
          <button 
            onClick={() => onNavigate?.({ name: 'home' })}
            className="mt-4 text-[#00c9a7] underline"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Utiliser d'abord les données de l'API, sinon l'utilisateur du contexte
  const profile = data?.user || user;
  if (!profile) return null;

  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  const userType = profile.user_type === 'hote' ? 'Hôte' : 'Voyageur';
  const userIcon = profile.user_type === 'hote' ? <Home className="w-5 h-5" /> : <Compass className="w-5 h-5" />;

  const handleSave = () => {
    updateMutation.mutate(editedUser);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleBecomeHost = () => {
    onNavigate?.({ name: 'become-host' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4fffe] to-[#e8fffb] py-6">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        <button
          onClick={() => onNavigate?.({ name: 'home' })}
          className="mb-6 flex items-center gap-2 text-[#0f2940] hover:text-[#00c9a7] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Retour à l'accueil</span>
        </button>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Colonne gauche - Informations profil */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 flex-1 shadow-lg">
            {/* En-tête avec avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00c9a7] to-[#0f2940] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {profile.first_name?.charAt(0) || profile.email?.charAt(0) || 'U'}
                {profile.last_name?.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-[#0f2940]">{fullName || 'Utilisateur'}</h1>
                  <span className="px-3 py-1 bg-[#f4fffe] text-[#00c9a7] rounded-full text-xs font-medium flex items-center gap-1">
                    {userIcon}
                    {userType}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Membre depuis {profile.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'récemment'}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Edit2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Formulaire d'édition ou affichage des informations */}
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      value={editedUser.first_name}
                      onChange={(e) => setEditedUser({ ...editedUser, first_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={editedUser.last_name}
                      onChange={(e) => setEditedUser({ ...editedUser, last_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={editedUser.phone}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    value={editedUser.bio}
                    onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                    placeholder="Parlez un peu de vous..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-[#00c9a7] text-white py-2 rounded-xl font-semibold hover:bg-[#00b892] transition-colors disabled:opacity-50"
                  >
                    {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border border-gray-300 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#f4fffe] p-4 border border-[#e2f5f2]">
                    <div className="flex items-center gap-2 text-[#00c9a7] mb-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Email</span>
                    </div>
                    <p className="text-sm text-[#0f2940]">{profile.email}</p>
                  </div>
                  <div className="rounded-2xl bg-[#f4fffe] p-4 border border-[#e2f5f2]">
                    <div className="flex items-center gap-2 text-[#00c9a7] mb-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Téléphone</span>
                    </div>
                    <p className="text-sm text-[#0f2940]">{profile.phone || "Non renseigné"}</p>
                  </div>
                </div>
                {profile.bio && (
                  <div className="rounded-2xl bg-[#f4fffe] p-4 border border-[#e2f5f2]">
                    <div className="flex items-center gap-2 text-[#00c9a7] mb-2">
                      <User className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Bio</span>
                    </div>
                    <p className="text-sm text-[#0f2940]">{profile.bio}</p>
                  </div>
                )}
                <div className="rounded-2xl bg-[#f4fffe] p-4 border border-[#e2f5f2]">
                  <div className="flex items-center gap-2 text-[#00c9a7] mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wider">Membre depuis</span>
                  </div>
                  <p className="text-sm text-[#0f2940]">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Nouveau membre'}
                  </p>
                </div>
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Compte vérifié
                  </span>
                  {profile.verification_status === 'verified' && (
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                      Identité vérifiée
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Colonne droite - Actions */}
          <div className="space-y-4 max-w-md w-full">
            <button
              onClick={() => onNavigate?.({ name: 'account' })}
              className="w-full bg-white border border-[#e2f5f2] text-[#0f2940] px-6 py-4 rounded-2xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <User className="w-5 h-5 text-[#00c9a7]" />
              Mon compte
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'messages' })}
              className="w-full bg-white border border-[#e2f5f2] text-[#0f2940] px-6 py-4 rounded-2xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-[#00c9a7]" />
              Messages
            </button>
            <button
              onClick={() => onNavigate?.({ name: 'favorites' })}
              className="w-full bg-white border border-[#e2f5f2] text-[#0f2940] px-6 py-4 rounded-2xl font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5 text-[#00c9a7]" />
              Favoris
            </button>

            {/* Bouton Accéder au dashboard hôte - visible seulement si l'utilisateur est hôte */}
            {profile.user_type === 'hote' && (
              <button
                onClick={() => onNavigate?.({ name: 'host-dashboard' })}
                className="w-full bg-gradient-to-r from-[#00c9a7] to-[#0f2940] text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Accéder au dashboard hôte
              </button>
            )}

            {/* Bouton Devenir hôte - visible seulement si l'utilisateur n'est pas déjà hôte */}
            {profile.user_type !== 'hote' && (
              <button
                onClick={handleBecomeHost}
                className="w-full bg-gradient-to-r from-[#00c9a7] to-[#0f2940] text-white px-6 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Devenir hôte
              </button>
            )}

            {/* Bouton Déconnexion */}
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full border border-red-200 text-red-600 px-6 py-4 rounded-2xl font-semibold hover:bg-red-50 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <LogOut className="w-5 h-5" />
              {logoutMutation.isPending ? 'Déconnexion...' : 'Se déconnecter'}
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



interface PageProps {
  onNavigate?: (route: any) => void;
}

export function AccountReservationsPage({ onNavigate }: PageProps) {
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['account-reservations'],
    queryFn: () => bookingService.getMyBookings(),
  });

  // Mutation pour annuler une réservation
  const cancelMutation = useMutation({
    mutationFn: async ({ bookingId, reason }: { bookingId: number; reason?: string }) => {
      return await bookingService.cancel(bookingId, reason);
    },
    onSuccess: () => {
      toast.success('Réservation annulée avec succès');
      queryClient.invalidateQueries({ queryKey: ['account-reservations'] });
      setShowCancelModal(false);
      setSelectedBooking(null);
      setCancellationReason('');
    },
    onError: (error: any) => {
      console.error('Erreur annulation:', error);
      const errorMessage = error?.message || 'Impossible d\'annuler la réservation';
      toast.error(errorMessage);
    },
    onSettled: () => {
      setIsCancelling(false);
    },
  });

  // Rafraîchir toutes les 30 secondes
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Vérifier si une réservation peut être annulée
  const canCancel = (booking: any): boolean => {
    if (booking.status === 'cancelled') return false;
    if (booking.status === 'completed') return false;
    
    const checkInDate = new Date(booking.dates?.check_in);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) return false;
    
    return booking.status === 'pending' || booking.status === 'confirmed';
  };

  // Calcul du remboursement
  const getRefundInfo = (booking: any): { percentage: number; amount: number; message: string } => {
    const checkInDate = new Date(booking.dates?.check_in);
    const today = new Date();
    const daysBeforeArrival = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const totalAmount = parseFloat(booking.price_details?.total) || 0;
    
    let refundPercentage = 0;
    let message = '';
    
    if (daysBeforeArrival >= 7) {
      refundPercentage = 100;
      message = 'Remboursement intégral (100%)';
    } else if (daysBeforeArrival >= 1) {
      refundPercentage = 50;
      message = 'Remboursement partiel (50%)';
    } else {
      refundPercentage = 0;
      message = 'Aucun remboursement';
    }
    
    const refundAmount = (totalAmount * refundPercentage) / 100;
    
    return {
      percentage: refundPercentage,
      amount: refundAmount,
      message
    };
  };

  const handleCancelClick = (booking: any) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
    setCancellationReason('');
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;
    setIsCancelling(true);
    await cancelMutation.mutateAsync({
      bookingId: selectedBooking.id,
      reason: cancellationReason || undefined
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => onNavigate?.({ name: 'profile' })} className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-[#0F2940]">Mes réservations</h1>
          </div>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7] mx-auto"></div>
            <p className="mt-4 text-gray-500">Chargement de vos réservations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => onNavigate?.({ name: 'profile' })} className="p-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-[#0F2940]">Mes réservations</h1>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h3>
            <p className="text-red-600">Impossible de charger vos réservations.</p>
            <button onClick={() => refetch()} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const bookings = data?.data?.data || [];
  const stats = data?.stats || {};

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'cancelled': 'Annulée',
      'completed': 'Terminée',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed': return <Star className="w-5 h-5 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête avec bouton retour */}
        <div className="flex items-center justify-between gap-4 pt-4 pb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate?.({ name: 'profile' })}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#0F2940]" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F2940]">Mes réservations</h1>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#00c9a7] transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Rafraîchir</span>
          </button>
        </div>

        {/* Statistiques */}
        {stats.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-[#f4fffe] rounded-xl p-3 text-center border border-[#e2f5f2]">
              <div className="text-xl font-bold text-[#0f2940]">{stats.total || 0}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
              <div className="text-xl font-bold text-green-600">{stats.confirmed || 0}</div>
              <div className="text-xs text-green-600">Confirmées</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-200">
              <div className="text-xl font-bold text-yellow-600">{stats.pending || 0}</div>
              <div className="text-xs text-yellow-600">En attente</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
              <div className="text-xl font-bold text-blue-600">{stats.completed || 0}</div>
              <div className="text-xs text-blue-600">Terminées</div>
            </div>
          </div>
        )}

        {/* Liste des réservations */}
        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-[#e2f5f2] p-12 bg-[#f4fffe] text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#0f2940] mb-2">Aucune réservation</h3>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore effectué de réservation.</p>
            <button
              onClick={() => onNavigate?.({ name: 'home' })}
              className="bg-[#00c9a7] text-white px-6 py-2 rounded-full hover:bg-[#00b396] transition"
            >
              Découvrir des logements
            </button>
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {bookings.map((booking: any) => {
              const refundInfo = getRefundInfo(booking);
              const cancellable = canCancel(booking);
              
              return (
                <div key={booking.id} className="rounded-2xl sm:rounded-3xl border border-[#e2f5f2] overflow-hidden bg-white hover:shadow-lg transition">
                  {/* En-tête avec statut */}
                  <div className={`p-3 sm:p-4 border-b ${booking.status === 'confirmed' ? 'bg-green-50' : booking.status === 'pending' ? 'bg-yellow-50' : booking.status === 'cancelled' ? 'bg-red-50' : 'bg-gray-50'}`}>
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(booking.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                        <span className="text-xs text-gray-500 font-mono hidden sm:inline">
                          Réf: {booking.reference}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {booking.created_at}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono sm:hidden mt-1">
                      Réf: {booking.reference}
                    </div>
                  </div>

                  {/* Contenu principal */}
                  <div className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      {/* Image */}
                      {booking.property?.photo ? (
                        <img 
                          src={booking.property.photo} 
                          alt={booking.property.title}
                          className="w-full sm:w-24 h-24 rounded-xl object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full sm:w-24 h-24 rounded-xl bg-gray-200 flex items-center justify-center">
                          <Home className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-[#0f2940]">
                          {booking.property?.title || 'Propriété'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {booking.property?.district}, {booking.property?.city}
                        </p>
                        
                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 text-xs sm:text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{booking.dates?.check_in} → {booking.dates?.check_out}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{booking.guests_count} voyageur(s)</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="font-medium text-[#00c9a7]">
                              {booking.price_details?.total} FCFA
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hôte */}
                    <div className="mt-3 pt-3 border-t flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs">👤</span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">
                          Hôte: {booking.host?.name || 'Non renseigné'}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => onNavigate?.({ name: 'messages', id: booking.id.toString() })}
                        className="text-xs sm:text-sm text-[#00c9a7] hover:underline flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Contacter l'hôte
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => onNavigate?.({ name: 'listing', id: booking.property?.id?.toString() })}
                        className="flex-1 border border-[#00c9a7] text-[#00c9a7] py-2 rounded-xl text-xs sm:text-sm hover:bg-[#00c9a7] hover:text-white transition"
                      >
                        Voir l'annonce
                      </button>
                      
                      {cancellable && (
                        <button
                          onClick={() => handleCancelClick(booking)}
                          className="flex-1 bg-red-500 text-white py-2 rounded-xl text-xs sm:text-sm hover:bg-red-600 transition flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Annuler
                        </button>
                      )}
                      
                      {booking.status === 'pending' && !cancellable && (
                        <div className="flex-1 text-center text-xs sm:text-sm text-gray-500 py-2 bg-gray-100 rounded-xl">
                          En attente de confirmation
                        </div>
                      )}
                      
                      {booking.status === 'completed' && !booking.has_review && (
                        <button
                          onClick={() => onNavigate?.({ name: 'reviews', id: booking.property?.id?.toString() })}
                          className="flex-1 bg-yellow-500 text-white py-2 rounded-xl text-xs sm:text-sm hover:bg-yellow-600 transition"
                        >
                          Laisser un avis
                        </button>
                      )}
                    </div>

                    {/* Message d'information sur le remboursement */}
                    {cancellable && booking.status !== 'cancelled' && refundInfo.percentage > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-blue-700">
                            {refundInfo.message} - <strong>{refundInfo.amount.toLocaleString()} FCFA</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message pour les réservations annulées */}
                    {booking.status === 'cancelled' && booking.cancellation_reason && (
                      <div className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-red-700">
                            {booking.cancellation_reason}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de confirmation d'annulation - z-index élevé pour être au-dessus de tout */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full mx-auto overflow-hidden shadow-2xl my-auto">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 sm:px-6 py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Annuler la réservation</h2>
              </div>
            </div>
            
            {/* Contenu */}
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                Êtes-vous sûr de vouloir annuler cette réservation ?
              </p>
              
              {/* Informations de la réservation */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 text-sm">
                <p className="font-semibold text-[#0F2940]">{selectedBooking.property?.title}</p>
                <p className="text-gray-500 text-xs mt-1">
                  📅 {selectedBooking.dates?.check_in} → {selectedBooking.dates?.check_out}
                </p>
                <p className="text-gray-500 text-xs">
                  👥 {selectedBooking.guests_count} voyageur(s)
                </p>
                <p className="text-[#00c9a7] font-semibold text-sm mt-2">
                  Montant: {selectedBooking.price_details?.total} FCFA
                </p>
              </div>
              
              {/* Information remboursement */}
              <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700">
                    {(() => {
                      const refund = getRefundInfo(selectedBooking);
                      if (refund.percentage === 100) {
                        return `✓ Remboursement intégral de ${refund.amount.toLocaleString()} FCFA (100%)`;
                      } else if (refund.percentage === 50) {
                        return `⚠️ Remboursement partiel de ${refund.amount.toLocaleString()} FCFA (50%)`;
                      } else {
                        return `❌ Aucun remboursement`;
                      }
                    })()}
                  </div>
                </div>
              </div>
              
              {/* Raison de l'annulation */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison de l'annulation (optionnelle)
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Dites-nous pourquoi vous annulez..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>
            </div>
            
            {/* Boutons d'action - fixés en bas sur mobile */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedBooking(null);
                    setCancellationReason('');
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-100 transition"
                >
                  Retour
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm sm:text-base font-medium hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCancelling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Annulation...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Confirmer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== HOST DASHBOARD PAGE ====================


interface Route {
  name: string;
  id?: string;
}

interface HostDashboardPageProps {
  onNavigate?: (route: Route) => void;
}

// ✅ Fonction sécurisée pour l'URL des images
const getSafeImageUrl = (photo: any, propertyId: number): string => {
  if (!photo) return '';
  
  let imageUrl = '';
  
  try {
    if (typeof photo === 'object' && photo !== null) {
      if (typeof photo.photo_url === 'string' && photo.photo_url) {
        imageUrl = photo.photo_url;
      } else if (typeof photo.full_url === 'string' && photo.full_url) {
        imageUrl = photo.full_url;
      } else if (typeof photo.url === 'string' && photo.url) {
        imageUrl = photo.url;
      }
    } else if (typeof photo === 'string') {
      imageUrl = photo;
    }
    
    if (!imageUrl && photo?.photo_path && typeof photo.photo_path === 'string') {
      const filename = photo.photo_path.split('/').pop();
      if (filename && propertyId) {
        imageUrl = `https://api.bluefin-immo.com/api/property-image/${propertyId}/${filename}`;
      }
    }
    
    if (imageUrl && typeof imageUrl === 'string') {
      if (imageUrl.includes('hstgr.io') || imageUrl.includes('srv2197-files')) {
        const filename = imageUrl.split('/').pop();
        if (filename && propertyId) {
          imageUrl = `https://api.bluefin-immo.com/api/property-image/${propertyId}/${filename}`;
        }
      }
    }
  } catch (e) {
    console.error('Erreur lors du traitement de l\'image:', e);
    return '/placeholder.jpg';
  }
  
  return (imageUrl && typeof imageUrl === 'string') ? imageUrl : '/placeholder.jpg';
};

export function HostDashboardPage({ onNavigate }: HostDashboardPageProps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['host-dashboard'],
    queryFn: () => hostService.getDashboard(),
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4fffe] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4fffe] flex items-center justify-center">
        <div className="text-red-500 text-center max-w-md">
          <p className="text-lg font-semibold">Erreur de chargement</p>
          <p className="text-sm mt-2">Impossible de charger votre tableau de bord</p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 bg-[#00c9a7] text-white px-6 py-2 rounded-full hover:bg-[#00b396] transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const properties = data?.data?.data || data?.data || [];
  const paginationStats = data?.stats || { total: 0, active: 0, pending: 0, draft: 0, rejected: 0 };
  
  const activeProperties = properties.filter((p: any) => p.status === 'active');
  const pendingProperties = properties.filter((p: any) => p.status === 'pending');
  const draftProperties = properties.filter((p: any) => p.status === 'draft');
  
  const totalUpcomingBookings = properties.reduce((sum: number, prop: any) => {
    return sum + (prop.stats?.pending_bookings || 0);
  }, 0);
  
  const monthlyRevenue = activeProperties.reduce((sum: number, prop: any) => {
    return sum + (parseFloat(prop.price_per_night) * 30);
  }, 0);

  return (
    <div className="min-h-screen bg-[#f4fffe] py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0f2940]">Tableau de bord hôte</h1>
            <p className="text-gray-500 mt-1">Gérez vos annonces, revenus et réservations</p>
          </div>
          
          <button
            onClick={() => onNavigate?.({ name: 'publish' })}
            className="group bg-[#00c9a7] hover:bg-[#00b396] text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Nouvelle annonce
          </button>
        </div>

        {/* Cartes statistiques */}
        <div className="grid gap-6 lg:grid-cols-4 mb-8">
          <div className="rounded-3xl bg-white border border-[#e2f5f2] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#6b7280]">Revenus estimés du mois</div>
              <DollarSign className="w-5 h-5 text-[#00c9a7]" />
            </div>
            <div className="text-2xl font-bold text-[#0f2940] mt-3">
              {monthlyRevenue.toLocaleString()} FCFA
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Basé sur {activeProperties.length} propriété{activeProperties.length > 1 ? 's' : ''} active{activeProperties.length > 1 ? 's' : ''}
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-[#e2f5f2] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#6b7280]">Propriétés</div>
              <Home className="w-5 h-5 text-[#00c9a7]" />
            </div>
            <div className="text-2xl font-bold text-[#0f2940] mt-3">
              {paginationStats.total || properties.length}
            </div>
            <div className="flex gap-3 mt-2 text-xs">
              <span className="text-green-600">{activeProperties.length} active{activeProperties.length > 1 ? 's' : ''}</span>
              <span className="text-orange-500">{pendingProperties.length} en attente</span>
              <span className="text-gray-400">{draftProperties.length} brouillon{draftProperties.length > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-[#e2f5f2] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#6b7280]">Réservations à venir</div>
              <Users className="w-5 h-5 text-[#00c9a7]" />
            </div>
            <div className="text-2xl font-bold text-[#0f2940] mt-3">{totalUpcomingBookings}</div>
            <div className="text-xs text-gray-500 mt-2">Demandes en attente</div>
          </div>

          <div className="rounded-3xl bg-white border border-[#e2f5f2] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#6b7280]">Messages non lus</div>
              <MessageCircle className="w-5 h-5 text-[#00c9a7]" />
            </div>
            <div className="text-2xl font-bold text-[#0f2940] mt-3">0</div>
            <button onClick={() => onNavigate?.({ name: 'host-messages' })} className="text-xs text-[#00c9a7] mt-2 hover:underline">
              Voir les messages
            </button>
          </div>
        </div>

        {/* Liste des propriétés */}
        <div className="bg-white rounded-3xl border border-[#e2f5f2] p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">🏠 Mes propriétés</h3>
            <button onClick={() => onNavigate?.({ name: 'host-annonces' })} className="text-xs text-[#00c9a7] hover:underline">
              Voir toutes
            </button>
          </div>
          
          {properties.length === 0 ? (
            <div className="text-center py-8">
              <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune propriété</p>
              <button onClick={() => onNavigate?.({ name: 'publish' })} className="mt-3 text-[#00c9a7] text-sm hover:underline">
                Créer ma première annonce
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {properties.map((property: any) => {
                const firstPhoto = property.photos?.[0] || property.cover_photo;
                const imageUrl = getSafeImageUrl(firstPhoto, property.id);
                
                return (
                  <div 
                    key={property.id} 
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#e2f5f2] pb-3 hover:bg-[#f4fffe] p-3 rounded-lg transition cursor-pointer"
                    // ✅ CORRECTION: Utiliser 'listing' au lieu de 'host-annonce-detail'
                    onClick={() => onNavigate?.({ name: 'listing', id: property.id.toString() })}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {imageUrl && imageUrl !== '/placeholder.jpg' ? (
                          <img 
                            src={imageUrl} 
                            alt={property.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.jpg';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Home className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#0f2940]">{property.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            property.status === 'active' ? 'bg-green-100 text-green-700' :
                            property.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {property.status_label || property.status}
                          </span>
                          <span className="text-xs text-gray-400">{property.city}, {property.district}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-[#00c9a7]">{property.price_formatted || property.price_per_night?.toLocaleString()} FCFA</p>
                        <p className="text-xs text-gray-400">/ nuit</p>
                        <p className="text-xs text-gray-400">
                          ≈ {(property.price_per_night * 0.0015).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{property.stats?.bookings_count || 0} réservations</p>
                        {property.stats?.pending_bookings > 0 && (
                          <p className="text-xs text-orange-500">{property.stats.pending_bookings} en attente</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section évaluations */}
        <div className="bg-white rounded-3xl border border-[#e2f5f2] p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <h3 className="font-semibold text-lg">Évaluations</h3>
          </div>
          
          {properties.every((p: any) => parseFloat(p.average_rating) === 0) ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune évaluation pour le moment</p>
              <p className="text-sm text-gray-400 mt-1">Les évaluations apparaîtront après les séjours</p>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.filter((p: any) => parseFloat(p.average_rating) > 0).map((property: any) => (
                <div key={property.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{property.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= Math.round(parseFloat(property.average_rating)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-xs text-gray-500 ml-2">({property.reviews_count} avis)</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-[#0f2940]">{parseFloat(property.average_rating).toFixed(1)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Liens rapides */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Accès rapides</h3>
          <div className="grid gap-4 lg:grid-cols-3">
            <button onClick={() => onNavigate?.({ name: 'host-annonces' })} className="rounded-3xl bg-white border border-[#e2f5f2] p-6 text-left hover:shadow-lg transition-all hover:border-[#00c9a7] group">
              <div className="flex items-center gap-3 mb-3">
                <Home className="w-5 h-5 text-[#00c9a7] group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-[#0f2940]">Mes annonces</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Gérez les offres publiées et leurs performances.</p>
            </button>
            <button onClick={() => onNavigate?.({ name: 'host-calendrier', id: undefined })} className="rounded-3xl bg-white border border-[#e2f5f2] p-6 text-left hover:shadow-lg transition-all hover:border-[#00c9a7] group">
              <div className="flex items-center gap-3 mb-3">
                <CalendarDays className="w-5 h-5 text-[#00c9a7] group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-[#0f2940]">Calendrier</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Bloquez des dates et gérez les disponibilités.</p>
            </button>
            <button onClick={() => onNavigate?.({ name: 'host-reservations' })} className="rounded-3xl bg-white border border-[#e2f5f2] p-6 text-left hover:shadow-lg transition-all hover:border-[#00c9a7] group">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-5 h-5 text-[#00c9a7] group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-[#0f2940]">Réservations</h3>
              </div>
              <p className="text-sm text-[#6b7280]">Consultez les demandes et les séjours en cours.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== HOST LISTINGS PAGE ====================

interface Route {
  name: string;
  id?: string;
  showConfirmation?: boolean;
  propertyId?: string;
}

// HostListingsPage.tsx



// HostListingsPage.tsx - Version complète avec gestion des images



interface Route {
  name: string;
  id?: string;
  params?: any;
}

interface HostListingsPageProps {
  onNavigate?: (route: Route) => void;
}

export function HostListingsPage({ onNavigate }: HostListingsPageProps) {
  const queryClient = useQueryClient();
  
  // État pour la modale de modification
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    city: '',
    district: '',
    address: '',
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    max_guests: 0,
    price_per_night: 0,
    min_stay: 1,
  });
  
  // États pour les images
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  
  // État pour l'image en cours de suppression
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['host-properties'],
    queryFn: () => hostService.getProperties(),
  });

  // Mutation pour supprimer une propriété
  const deleteMutation = useMutation({
    mutationFn: (id: number) => hostService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-properties'] });
      toast.success('Logement supprimé avec succès');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  // Mutation pour modifier une propriété
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => hostService.updateProperty(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['host-properties'] });
      toast.success(response?.message || 'Logement modifié avec succès');
      setShowEditModal(false);
      setEditingProperty(null);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.response?.data?.errors || 'Erreur lors de la modification';
      if (typeof message === 'object') {
        const errors = Object.values(message).flat().join(', ');
        toast.error(errors);
      } else {
        toast.error(message);
      }
    },
  });

  // Mutation pour ajouter des photos
  const addPhotosMutation = useMutation({
    mutationFn: ({ propertyId, photos }: { propertyId: number; photos: File[] }) => 
      hostService.addPhotos(propertyId, photos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-properties'] });
      toast.success('Photos ajoutées avec succès');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de l\'ajout des photos');
    },
  });

  // Mutation pour supprimer une photo
  const deletePhotoMutation = useMutation({
    mutationFn: ({ propertyId, photoId }: { propertyId: number; photoId: number }) => 
      hostService.deletePhoto(propertyId, photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-properties'] });
      toast.success('Photo supprimée avec succès');
      setDeletingPhotoId(null);
      if (editingProperty) {
        const updatedPhotos = editingProperty.photos?.filter((p: any) => p.id !== deletingPhotoId);
        setEditingProperty((prev: any) => ({ ...prev, photos: updatedPhotos }));
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la suppression de la photo');
      setDeletingPhotoId(null);
    },
  });

  // État pour la modale de confirmation de suppression
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    propertyId: number | null;
    propertyTitle: string;
  }>({
    show: false,
    propertyId: null,
    propertyTitle: '',
  });

  // État pour la modale de confirmation de suppression de photo
  const [photoDeleteConfirmation, setPhotoDeleteConfirmation] = useState<{
    show: boolean;
    propertyId: number | null;
    photoId: number | null;
    photoUrl: string;
  }>({
    show: false,
    propertyId: null,
    photoId: null,
    photoUrl: '',
  });

  // État pour la modale de confirmation de soumission
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const shouldShow = localStorage.getItem('showConfirmation');
    const propertyId = localStorage.getItem('submittedPropertyId');
    if (shouldShow === 'true') {
      setShowSuccessModal(true);
      localStorage.removeItem('showConfirmation');
      localStorage.removeItem('submittedPropertyId');
    }
  }, []);

  const confirmDelete = (propertyId: number, propertyTitle: string) => {
    setDeleteConfirmation({
      show: true,
      propertyId,
      propertyTitle,
    });
  };

  const handleDelete = () => {
    if (deleteConfirmation.propertyId) {
      deleteMutation.mutate(deleteConfirmation.propertyId);
      setDeleteConfirmation({ show: false, propertyId: null, propertyTitle: '' });
    }
  };

  const confirmDeletePhoto = (propertyId: number, photoId: number, photoUrl: string) => {
    setPhotoDeleteConfirmation({
      show: true,
      propertyId,
      photoId,
      photoUrl,
    });
  };

  const handleDeletePhoto = () => {
    if (photoDeleteConfirmation.propertyId && photoDeleteConfirmation.photoId) {
      setDeletingPhotoId(photoDeleteConfirmation.photoId);
      deletePhotoMutation.mutate({
        propertyId: photoDeleteConfirmation.propertyId,
        photoId: photoDeleteConfirmation.photoId,
      });
      setPhotoDeleteConfirmation({ show: false, propertyId: null, photoId: null, photoUrl: '' });
    }
  };

  const formatPrice = (price: number) => {
    if (!price && price !== 0) return '0';
    return price.toLocaleString('fr-FR');
  };

  const convertToEuro = (priceFCFA: number) => {
    const XAF_TO_EUR = 0.0015;
    return priceFCFA * XAF_TO_EUR;
  };

  // Ouvrir la modale de modification
  const handleEdit = (property: any) => {
    console.log('🖊️ Modification de la propriété:', property);
    
    setEditingProperty(property);
    setEditFormData({
      title: property.title || '',
      description: property.description || '',
      property_type: property.property_type || '',
      city: property.city || '',
      district: property.district || '',
      address: property.address || '',
      bedrooms: property.bedrooms || 0,
      beds: property.beds || 0,
      bathrooms: property.bathrooms || 0,
      max_guests: property.max_guests || 0,
      price_per_night: property.price_per_night || 0,
      min_stay: property.min_stay || 1,
    });
    setNewPhotos([]);
    setNewPhotoPreviews([]);
    setShowEditModal(true);
  };

  // Gérer l'ajout de nouvelles photos
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    setNewPhotos((prev) => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Supprimer une nouvelle photo (non encore uploadée)
  const handleRemoveNewPhoto = (index: number) => {
    setNewPhotos(prev => prev.filter((_, i) => i !== index));
    setNewPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Sauvegarder les modifications
  const handleSaveEdit = async () => {
    if (!editingProperty) return;
    
    setUploadingPhotos(true);
    
    try {
      // 1. Mettre à jour les informations de base
      const updateData = {
        title: editFormData.title,
        description: editFormData.description,
        property_type: editFormData.property_type,
        city: editFormData.city,
        district: editFormData.district,
        address: editFormData.address,
        bedrooms: editFormData.bedrooms,
        beds: editFormData.beds,
        bathrooms: editFormData.bathrooms,
        max_guests: editFormData.max_guests,
        price_per_night: editFormData.price_per_night,
        min_stay: editFormData.min_stay,
      };
      
      console.log('📤 Mise à jour de la propriété:', updateData);
      
      await updateMutation.mutateAsync({
        id: editingProperty.id,
        data: updateData,
      });
      
      // 2. Ajouter les nouvelles photos (si des photos ont été sélectionnées)
      if (newPhotos.length > 0) {
        console.log('📤 Ajout de', newPhotos.length, 'nouvelles photos');
        await addPhotosMutation.mutateAsync({
          propertyId: editingProperty.id,
          photos: newPhotos,
        });
      }
      
      toast.success('Toutes les modifications ont été enregistrées');
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur lors de l\'enregistrement des modifications');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  // Fonction pour vérifier si une propriété peut être modifiée
  const canEdit = (property: any) => {
    return property.status !== 'pending';
  };

  // Fonction pour obtenir le message d'outil pour le bouton modifier
  const getEditButtonTooltip = (property: any) => {
    if (property.status === 'pending') {
      return 'Cette annonce est en cours de validation, vous ne pouvez pas la modifier pour le moment';
    }
    return 'Modifier l\'annonce';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>Erreur de chargement des annonces</p>
        <button onClick={() => refetch()} className="mt-4 bg-[#00c9a7] text-white px-6 py-2 rounded-full hover:bg-[#00b892] transition">Réessayer</button>
      </div>
    );
  }

  const properties = data?.data?.data || data?.data || [];

  return (
    <>
      <div className="bg-white min-h-screen py-10 pb-32">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <PageSection title="Mes annonces hôte" subtitle="Gestion de vos annonces publiées et de leur visibilité.">
            <div className="space-y-4">
              {properties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Vous n'avez pas encore d'annonce.</p>
                  <button onClick={() => onNavigate?.({ name: 'publish' })} className="mt-4 bg-[#00c9a7] text-white px-6 py-2 rounded-full hover:bg-[#00b892] transition">Créer ma première annonce</button>
                </div>
              ) : (
                properties.map((property: any) => (
                  <div key={property.id} className="rounded-3xl border border-[#e2f5f2] p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between hover:shadow-lg transition-shadow">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-[#0f2940]">{property.title}</h3>
                      <p className="text-sm text-[#6b7280] mt-1">
                        Statut :{' '}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                          property.status === 'active' ? 'bg-green-100 text-green-700' :
                          property.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          property.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {property.status_label || property.status}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{property.stats?.views_this_month || property.views_count || 0} vues</span>
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" />{property.average_rating || 0} / 5</span>
                        <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" />{property.stats?.bookings_count || property.bookings_count || 0} réservations</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-[#00c9a7]" />{formatPrice(property.price_per_night)} FCFA / nuit</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">📍 {property.city}, {property.district}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button onClick={() => onNavigate?.({ name: 'listing', id: property.id.toString() })} className="border border-[#e2f5f2] rounded-full px-5 py-2.5 text-sm hover:bg-[#f4fffe] transition-colors">Voir</button>
                      <button onClick={() => onNavigate?.({ name: 'host-calendrier', id: property.id.toString() })} className="border border-[#00c9a7] text-[#00c9a7] rounded-full px-5 py-2.5 text-sm hover:bg-[#00c9a7]/10 transition-colors">Calendrier</button>
                      <button 
                        onClick={() => canEdit(property) && handleEdit(property)} 
                        disabled={!canEdit(property)}
                        title={getEditButtonTooltip(property)}
                        className={`border rounded-full px-5 py-2.5 text-sm transition-colors ${
                          !canEdit(property) 
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <Edit2 className="w-4 h-4 inline mr-1" />Modifier
                      </button>
                      <button onClick={() => confirmDelete(property.id, property.title)} disabled={deleteMutation.isPending} className="border border-red-200 text-red-500 rounded-full px-5 py-2.5 text-sm hover:bg-red-50 transition-colors disabled:opacity-50">
                        <Trash2 className="w-4 h-4 inline mr-1" />
                        {deleteMutation.isPending && deleteConfirmation.propertyId === property.id ? 'Suppression...' : 'Supprimer'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PageSection>
        </div>
      </div>

      {/* MODALE DE MODIFICATION */}
      {showEditModal && editingProperty && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeInUp">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-[#0F2940]">Modifier l'annonce</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 rounded-full hover:bg-gray-100 transition"><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Photos existantes */}
              {editingProperty.photos && editingProperty.photos.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">Photos actuelles</label>
                    <p className="text-xs text-gray-400">Cliquez sur la poubelle pour supprimer une photo</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {editingProperty.photos.map((photo: any) => {
                      const imageUrl = getImageUrl(photo.photo_url || photo.photo_path);
                      const isDeleting = deletingPhotoId === photo.id;
                      
                      return (
                        <div key={photo.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                          <img src={imageUrl} alt="Photo" className="w-full h-28 object-cover" />
                          <button
                            onClick={() => confirmDeletePhoto(editingProperty.id, photo.id, imageUrl)}
                            disabled={isDeleting}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all shadow-md disabled:opacity-50"
                            title="Supprimer cette photo"
                          >
                            {isDeleting ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Trash2 className="w-3 h-3" />}
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                            Photo
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ajout de nouvelles photos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Ajouter des photos</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00c9a7] file:text-white hover:file:bg-[#00b892] transition"
                />
                
                {newPhotoPreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Nouvelles photos à ajouter ({newPhotoPreviews.length})</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {newPhotoPreviews.map((preview, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                          <img src={preview} alt={`Nouvelle photo ${index + 1}`} className="w-full h-28 object-cover" />
                          <button
                            onClick={() => handleRemoveNewPhoto(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all shadow-md"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-[#00c9a7] text-white text-xs px-2 py-0.5 rounded-full">
                            Nouvelle
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Formats acceptés : JPG, PNG. Taille max : 5MB par photo.</p>
              </div>

              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                  <input 
                    type="text" 
                    value={editFormData.title} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))} 
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-[#00c9a7]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de propriété *</label>
                  <select 
                    value={editFormData.property_type} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, property_type: e.target.value }))} 
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-[#00c9a7]"
                  >
                    <option value="appartement">Appartement</option>
                    <option value="chambre_habitant">Chambre chez l'habitant</option>
                    <option value="villa">Villa</option>
                    <option value="hotel">Hôtel</option>
                    <option value="motel">Motel</option>
                    <option value="auberge">Auberge</option>
                    <option value="maison_hotes">Maison d'hôtes</option>
                    <option value="ecolodge">Ecolodge</option>
                    <option value="residence_hoteliere">Résidence hôtelière</option>
                    <option value="immeuble_entier">Immeuble entier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea 
                  value={editFormData.description} 
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))} 
                  rows={4} 
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-[#00c9a7]" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                  <input 
                    type="text" 
                    value={editFormData.city} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, city: e.target.value }))} 
                    className="w-full rounded-xl border border-gray-200 px-4 py-3" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quartier *</label>
                  <input 
                    type="text" 
                    value={editFormData.district} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, district: e.target.value }))} 
                    className="w-full rounded-xl border border-gray-200 px-4 py-3" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                  <input 
                    type="text" 
                    value={editFormData.address} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))} 
                    className="w-full rounded-xl border border-gray-200 px-4 py-3" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
                  <input 
                    type="number" 
                    min={0} 
                    value={editFormData.bedrooms} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) || 0 }))} 
                    className="w-full rounded-xl border border-gray-200 px-4 py-3" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lits</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={editFormData.beds} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, beds: parseInt(e.target.value) || 1 }))} 
                    className="w-full rounded-xl border border-gray-200 px-4 py-3" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salles de bain</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={editFormData.bathrooms} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 1 }))} 
                    className="w-full rounded-xl border border-gray-200 px-4 py-3" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacité max</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={editFormData.max_guests} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, max_guests: parseInt(e.target.value) || 1 }))} 
                    className="w-full rounded-xl border border-gray-200 px-4 py-3" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix par nuit (FCFA)</label>
                  <input 
                    type="number" 
                    min={0} 
                    value={editFormData.price_per_night} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, price_per_night: parseInt(e.target.value) || 0 }))} 
                    className="w-full rounded-xl border border-gray-200 px-4 py-3" 
                  />
                  <p className="text-xs text-gray-500 mt-1">≈ {convertToEuro(editFormData.price_per_night).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} €</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Séjour minimum (nuits)</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={editFormData.min_stay} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, min_stay: parseInt(e.target.value) || 1 }))} 
                    className="w-full rounded-xl border border-gray-200 px-4 py-3" 
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition">Annuler</button>
              <button onClick={handleSaveEdit} disabled={updateMutation.isPending || uploadingPhotos} className="px-6 py-2 rounded-xl bg-[#00c9a7] text-white font-medium hover:bg-[#00b892] transition disabled:opacity-50">
                {uploadingPhotos || updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE CONFIRMATION SUPPRESSION PHOTO */}
      {photoDeleteConfirmation.show && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-fadeInUp">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-8 h-8 text-red-600" /></div>
              <h3 className="text-xl font-semibold text-[#0F2940] mb-2">Supprimer cette photo ?</h3>
              <p className="text-gray-500 text-sm">Cette action est irréversible.</p>
              <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                <img src={photoDeleteConfirmation.photoUrl} alt="Photo à supprimer" className="w-full h-32 object-cover" />
              </div>
            </div>
            <div className="flex border-t border-gray-100">
              <button onClick={() => setPhotoDeleteConfirmation({ show: false, propertyId: null, photoId: null, photoUrl: '' })} className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Annuler</button>
              <button onClick={handleDeletePhoto} className="flex-1 py-3 text-red-600 font-medium border-l border-gray-100 hover:bg-red-50 transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE CONFIRMATION DE SUPPRESSION DE PROPRIÉTÉ */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-fadeInUp">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-8 h-8 text-red-600" /></div>
              <h3 className="text-xl font-semibold text-[#0F2940] mb-2">Confirmer la suppression</h3>
              <p className="text-gray-500 text-sm">Êtes-vous sûr de vouloir supprimer le logement <br /><span className="font-semibold text-[#0F2940]">"{deleteConfirmation.propertyTitle}"</span> ?</p>
              <p className="text-xs text-red-500 mt-2">Cette action est irréversible.</p>
            </div>
            <div className="flex border-t border-gray-100">
              <button onClick={() => setDeleteConfirmation({ show: false, propertyId: null, propertyTitle: '' })} className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Annuler</button>
              <button onClick={handleDelete} className="flex-1 py-3 text-red-600 font-medium border-l border-gray-100 hover:bg-red-50 transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE SUCCÈS */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-[500px] rounded-2xl bg-white shadow-xl overflow-hidden border border-[#e2f5f2]">
              <div className="relative bg-gradient-to-br from-[#f3fffc] to-white px-5 py-5 text-center">
                <button onClick={handleSuccessClose} className="absolute top-3 right-3 rounded-full p-1.5 text-gray-400 hover:text-gray-600 transition"><X className="w-4 h-4" /></button>
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f9f3] border border-[#c7f1ea]"><CheckCircle className="w-7 h-7 text-[#00C9A7]" /></div>
                <h2 className="text-lg font-semibold text-[#0F2940]">Votre bien est entre de bonnes mains.</h2>
                <p className="mx-auto mt-2 max-w-md text-xs text-gray-500">Merci pour votre confiance. Nous avons bien reçu votre demande.</p>
              </div>
              <div className="px-5 pb-5">
                <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-[#c7f1ea] bg-[#f4fffe] px-3 py-2"><Clock className="w-3.5 h-3.5 text-[#00C9A7]" /><span className="text-xs font-medium text-[#0F2940]">Notre équipe vous contacte sous 24h</span></div>
                <button onClick={handleSuccessClose} className="w-full bg-[#0F2940] text-white py-3 rounded-xl font-medium hover:bg-[#1a3a5c] transition">OK, j'ai compris</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
// ==================== HOST CALENDAR PAGE ====================

export function HostCalendarPage({ onNavigate, id }: { onNavigate?: (route: Route) => void; id?: string }) {
  const propertyId = id ? parseInt(id) : null;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const [selectedRange, setSelectedRange] = useState<{ start: string | null; end: string | null }>({ start: null, end: null });
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockRange, setBlockRange] = useState({ start: '', end: '', reason: '' });
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // ✅ Fonction showToast
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToastMessage({ type, message });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Récupérer le calendrier
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['host-calendar', propertyId, year, month],
    queryFn: () => hostService.getCalendar(propertyId!, year, month),
    enabled: !!propertyId,
  });

  const queryClient = useQueryClient();

  // Mutation pour mettre à jour les disponibilités
  const updateAvailabilityMutation = useMutation({
    mutationFn: ({ start, end, status, price, reason }: any) =>
      hostService.updateAvailability(propertyId!, start, end, status, price, reason),
    onSuccess: (response) => {
      console.log(' Mise à jour réussie:', response);
      showToast('success', 'Disponibilité mise à jour avec succès');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['host-calendar', propertyId, year, month] });
      setShowBlockModal(false);
      setSelectedRange({ start: null, end: null });
    },
    onError: (error: any) => {
      console.error(' Erreur mise à jour:', error);
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      showToast('error', message);
    },
  });

  // Mutation pour les prix spéciaux
  const specialPriceMutation = useMutation({
    mutationFn: ({ start, end, price }: any) =>
      hostService.updateSpecialPrice(propertyId!, start, end, price),
    onSuccess: () => {
      showToast('success', 'Prix spécial défini avec succès');
      refetch();
      queryClient.invalidateQueries({ queryKey: ['host-calendar', propertyId, year, month] });
    },
    onError: (error: any) => {
      console.error(' Erreur prix spécial:', error);
      showToast('error', error.response?.data?.message || 'Erreur lors de la définition du prix spécial');
    },
  });

  const handleDayClick = async (day: any) => {
    console.log(' Jour cliqué:', day);
    
    if (day.status === 'booked') {
      showToast('error', 'Cette date est déjà réservée, vous ne pouvez pas la modifier');
      return;
    }
    
    // Si on est en mode sélection de plage
    if (selectedRange.start === null) {
      setSelectedRange({ start: day.date, end: null });
      showToast('success', `Date de début sélectionnée: ${day.date}`);
      return;
    } 
    
    if (selectedRange.start && selectedRange.end === null) {
      if (day.date < selectedRange.start) {
        showToast('error', 'La date de fin doit être après la date de début');
        setSelectedRange({ start: null, end: null });
        return;
      }
      
      const action = confirm(
        `Voulez-vous bloquer du ${selectedRange.start} au ${day.date} ?\n\n` +
        `Cela bloquera toutes les dates entre ces deux jours.`
      );
      
      if (action) {
        await updateAvailabilityMutation.mutateAsync({
          start: selectedRange.start,
          end: day.date,
          status: 'blocked',
          price: null,
          reason: 'Bloqué par l\'hôte'
        });
      }
      setSelectedRange({ start: null, end: null });
      return;
    }
    
    // Mode simple
    setIsUpdating(true);
    try {
      if (day.status === 'blocked') {
        if (confirm(`Voulez-vous débloquer le ${day.date} ?`)) {
          await updateAvailabilityMutation.mutateAsync({
            start: day.date,
            end: day.date,
            status: 'available',
            price: null,
            reason: null
          });
        }
      } else if (day.status === 'available') {
        const setSpecialPrice = confirm(`Voulez-vous définir un prix spécial pour le ${day.date} ?`);
        let specialPrice = null;
        
        if (setSpecialPrice) {
          const price = prompt('Entrez le prix spécial (en FCFA):', day.special_price?.toString() || '');
          if (price && !isNaN(parseInt(price))) {
            specialPrice = parseInt(price);
            await specialPriceMutation.mutateAsync({
              start: day.date,
              end: day.date,
              price: specialPrice
            });
          }
        }
        
        if (confirm(`Voulez-vous bloquer le ${day.date} ?`)) {
          await updateAvailabilityMutation.mutateAsync({
            start: day.date,
            end: day.date,
            status: 'blocked',
            price: specialPrice,
            reason: 'Bloqué par l\'hôte'
          });
        }
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBlockRangeSubmit = async () => {
    if (!blockRange.start || !blockRange.end) {
      showToast('error', 'Veuillez sélectionner une plage de dates');
      return;
    }
    
    await updateAvailabilityMutation.mutateAsync({
      start: blockRange.start,
      end: blockRange.end,
      status: 'blocked',
      price: null,
      reason: blockRange.reason || 'Bloqué par l\'hôte'
    });
  };

  const cancelRangeSelection = () => {
    setSelectedRange({ start: null, end: null });
    showToast('info', 'Sélection de plage annulée');
  };

  if (!propertyId) {
    return (
      <div className="min-h-screen bg-[#f4fffe] py-10 text-center">
        <p className="text-gray-500">Sélectionnez d'abord une propriété.</p>
        <button onClick={() => onNavigate?.({ name: 'host-annonces' })} className="mt-4 bg-[#00c9a7] px-4 py-2 rounded-full">
          Voir mes annonces
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4fffe] py-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7] mx-auto"></div>
        <p className="mt-4 text-gray-500">Chargement du calendrier...</p>
      </div>
    );
  }

  const calendar = data?.data?.calendar || [];
  const propertyTitle = data?.data?.property?.title || 'Propriété';

  return (
    <div className="min-h-screen bg-[#f4fffe] py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast notification */}
        {toastMessage && (
          <div className={`fixed top-20 right-4 z-50 p-4 rounded-xl shadow-lg ${
            toastMessage.type === 'success' ? 'bg-green-500 text-white' : 
            toastMessage.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {toastMessage.message}
          </div>
        )}

        <PageSection title={`Calendrier - ${propertyTitle}`} subtitle="Gérez vos disponibilités et tarifs spéciaux.">
          
          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-3 mb-6">
            {selectedRange.start !== null && selectedRange.end === null ? (
              <button
                onClick={cancelRangeSelection}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
              >
                 Annuler la sélection
              </button>
            ) : (
              <button
                onClick={() => setShowBlockModal(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition"
              >
                 Bloquer une plage de dates
              </button>
            )}
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition"
            >
              Rafraîchir
            </button>
          </div>

          {selectedRange.start !== null && selectedRange.end === null && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-center">
              <p className="text-sm text-blue-700">
                 Date de début sélectionnée: <strong>{selectedRange.start}</strong>
                <br />
                Cliquez sur une date de fin pour bloquer la plage.
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl border p-6">
            {/* Navigation mois */}
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => setCurrentDate(new Date(year, month - 2, 1))} 
                className="p-2 rounded-full hover:bg-gray-100 transition"
                disabled={isUpdating}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold">{currentDate.toLocaleString('fr', { month: 'long', year: 'numeric' })}</h2>
              <button 
                onClick={() => setCurrentDate(new Date(year, month, 1))} 
                className="p-2 rounded-full hover:bg-gray-100 transition"
                disabled={isUpdating}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-500 mb-2">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => <div key={d} className="py-2">{d}</div>)}
            </div>

            {/* Calendrier */}
            <div className="grid grid-cols-7 gap-1">
              {calendar.map((day: any, idx: number) => {
                const dayStatus = day.status || (day.is_available ? 'available' : 'blocked');
                const isSelectedStart = selectedRange.start === day.date;
                const isInRange = selectedRange.start && selectedRange.end === null && day.date > selectedRange.start;
                
                let bgColor = '';
                if (dayStatus === 'booked') {
                  bgColor = 'bg-red-100 text-red-700 cursor-not-allowed opacity-60';
                } else if (dayStatus === 'blocked') {
                  bgColor = 'bg-orange-100 text-orange-700 hover:bg-orange-200';
                } else {
                  bgColor = 'bg-green-50 hover:bg-green-100 hover:scale-105';
                }
                
                if (isSelectedStart) {
                  bgColor = 'ring-2 ring-[#00c9a7] shadow-lg bg-[#00c9a7]/10';
                }
                if (isInRange) {
                  bgColor = 'bg-blue-100';
                }
                
                return (
                  <div
                    key={idx}
                    className={`p-2 border rounded-xl text-center cursor-pointer transition-all duration-200 ${bgColor}`}
                    onClick={() => !isUpdating && handleDayClick(day)}
                  >
                    <div className="text-sm font-medium">{day.day}</div>
                    {day.special_price && (
                      <div className="text-xs text-green-600 font-semibold mt-1">
                        {day.special_price.toLocaleString()} FCFA
                      </div>
                    )}
                    <div className="text-xs mt-1">
                      {dayStatus === 'booked' && '📅 Réservé'}
                      {dayStatus === 'blocked' && '🚫 Bloqué'}
                      {dayStatus === 'available' && '✓ Dispo'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-50 border border-gray-200 rounded"></div> Disponible</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div> Bloqué par l'hôte</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div> Réservé</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-[#00c9a7] rounded"></div> Date sélectionnée</div>
            </div>

            {/* Indicateur de chargement */}
            {(updateAvailabilityMutation.isPending || specialPriceMutation.isPending || isUpdating) && (
              <div className="mt-4 text-center text-sm text-gray-500">
                <div className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                  Mise à jour en cours...
                </div>
              </div>
            )}
          </div>
        </PageSection>
      </div>

      {/* Modal pour bloquer une plage de dates */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-[#0F2940] mb-4">Bloquer une plage de dates</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <input
                  type="date"
                  value={blockRange.start}
                  onChange={(e) => setBlockRange({ ...blockRange, start: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                <input
                  type="date"
                  value={blockRange.end}
                  onChange={(e) => setBlockRange({ ...blockRange, end: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                  min={blockRange.start || new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raison (optionnel)</label>
                <input
                  type="text"
                  value={blockRange.reason}
                  onChange={(e) => setBlockRange({ ...blockRange, reason: e.target.value })}
                  placeholder="Travaux, indisponibilité, etc."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleBlockRangeSubmit}
                  disabled={updateAvailabilityMutation.isPending}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {updateAvailabilityMutation.isPending ? 'Blocage...' : 'Bloquer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ==================== HOST RESERVATIONS PAGE ====================


interface Route {
    name: string;
    id?: string;
}

interface HostReservationsPageProps {
    onNavigate?: (route: Route) => void;
}

export function HostReservationsPage({ onNavigate }: HostReservationsPageProps) {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ['host-reservations'],
        queryFn: () => hostService.getHostBookings(),
    });

    const confirmMutation = useMutation({
        mutationFn: (id: number) => hostService.confirmBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['host-reservations'] });
        },
        onError: (error: any) => {
            console.error('Erreur lors de la confirmation:', error);
            alert('Erreur lors de la confirmation de la réservation');
        },
    });

    const declineMutation = useMutation({
        mutationFn: (id: number) => hostService.declineBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['host-reservations'] });
        },
        onError: (error: any) => {
            console.error('Erreur lors du refus:', error);
            alert('Erreur lors du refus de la réservation');
        },
    });

    // ✅ Récupérer les données avec la structure correcte
    const bookings = data?.data?.data || data?.data || [];

    // ✅ Fonction pour formater les montants
    const formatAmount = (amount: any): string => {
        if (!amount && amount !== 0) return '0 FCFA';
        if (typeof amount === 'string') {
            // Supprimer les espaces et convertir en nombre
            const cleanAmount = amount.replace(/\s/g, '');
            const num = parseFloat(cleanAmount);
            if (isNaN(num)) return '0 FCFA';
            return `${num.toLocaleString()} FCFA`;
        }
        const num = typeof amount === 'number' ? amount : parseFloat(amount);
        if (isNaN(num)) return '0 FCFA';
        return `${num.toLocaleString()} FCFA`;
    };

    // ✅ Fonction pour obtenir le statut en français
    const getStatusLabel = (status: string): string => {
        const statusMap: Record<string, string> = {
            'pending': 'En attente',
            'confirmed': 'Confirmée',
            'cancelled': 'Annulée',
            'completed': 'Terminée',
        };
        return statusMap[status] || status;
    };

    // ✅ Fonction pour obtenir la couleur du statut
    const getStatusColor = (status: string): string => {
        const colorMap: Record<string, string> = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800',
            'completed': 'bg-blue-100 text-blue-800',
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen py-10">
                <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7] mx-auto"></div>
                        <p className="mt-4 text-gray-500">Chargement des réservations...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white min-h-screen py-10">
                <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <div className="text-4xl mb-4">❌</div>
                        <h3 className="text-lg font-semibold text-red-700 mb-2">Erreur de chargement</h3>
                        <p className="text-red-600">Impossible de charger les réservations. Veuillez réessayer.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-10">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
                <PageSection title="Réservations hôte" subtitle="Suivez les demandes et les séjours en cours.">
                    {bookings.length === 0 ? (
                        <div className="bg-[#f4fffe] rounded-3xl border border-[#e2f5f2] p-12 text-center">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold text-[#0f2940] mb-2">
                                Aucune réservation
                            </h3>
                            <p className="text-gray-500">
                                Vous n'avez pas encore reçu de réservation.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking: any) => (
                                <div 
                                    key={booking.id} 
                                    className="rounded-3xl border border-[#e2f5f2] p-6 bg-[#f4fffe] hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        {/* Informations réservation */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">
                                                    #{booking.reference || booking.id}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                                                    {getStatusLabel(booking.status)}
                                                </span>
                                                {booking.payment_status && (
                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                        booking.payment_status === 'paid' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {booking.payment_status === 'paid' ? 'Payé' : 'En attente de paiement'}
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <h3 className="text-xl font-semibold text-[#0f2940]">
                                                {booking.property?.title || 'Propriété'}
                                            </h3>
                                            
                                            <p className="text-sm text-[#6b7280] mt-1">
                                                {booking.property?.district}, {booking.property?.city}
                                            </p>
                                            
                                            {/* ✅ Utilisation des nouvelles structures guest et dates */}
                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    {booking.guest?.photo && (
                                                        <img 
                                                            src={booking.guest.photo} 
                                                            alt={booking.guest.name}
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                    )}
                                                    <p className="text-sm">
                                                        <span className="text-gray-500">👤 Voyageur:</span>{' '}
                                                        <span className="font-medium">{booking.guest?.name || 'Non renseigné'}</span>
                                                    </p>
                                                </div>
                                                
                                                {booking.guest?.phone && (
                                                    <p className="text-sm">
                                                        <span className="text-gray-500">📞 Téléphone:</span>{' '}
                                                        <span className="font-medium">{booking.guest.phone}</span>
                                                    </p>
                                                )}
                                                
                                                <p className="text-sm">
                                                    <span className="text-gray-500">👥 Nombre de voyageurs:</span>{' '}
                                                    <span className="font-medium">{booking.guests_count || 1}</span>
                                                </p>
                                                
                                                <p className="text-sm">
                                                    <span className="text-gray-500">🌙 Nuits:</span>{' '}
                                                    <span className="font-medium">{booking.dates?.nights || 0}</span>
                                                </p>
                                                
                                                <p className="text-sm">
                                                    <span className="text-gray-500">📅 Dates:</span>{' '}
                                                    <span className="font-medium">
                                                        {booking.dates?.check_in || '--'} → {booking.dates?.check_out || '--'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Montant et actions */}
                                        <div className="text-left lg:text-right">
                                            <div className="mb-3">
                                                <div className="text-sm text-gray-500">Sous-total</div>
                                                <div className="font-medium">{formatAmount(booking.amount?.subtotal)}</div>
                                                <div className="text-sm text-gray-500 mt-1">Frais de service</div>
                                                <div className="font-medium">{formatAmount(booking.amount?.service_fee)}</div>
                                                {booking.amount?.cleaning_fee && parseFloat(booking.amount.cleaning_fee.replace(/\s/g, '')) > 0 && (
                                                    <>
                                                        <div className="text-sm text-gray-500 mt-1">Frais de ménage</div>
                                                        <div className="font-medium">{formatAmount(booking.amount?.cleaning_fee)}</div>
                                                    </>
                                                )}
                                                <div className="border-t border-gray-200 mt-2 pt-2">
                                                    <div className="text-lg font-bold text-[#00c9a7]">
                                                        {formatAmount(booking.amount?.total)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-3 mt-4 justify-end">
                                                {booking.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => confirmMutation.mutate(booking.id)}
                                                            disabled={confirmMutation.isPending}
                                                            className="rounded-full bg-green-500 text-white px-5 py-2 text-sm hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                                                        >
                                                            {confirmMutation.isPending && confirmMutation.variables === booking.id ? (
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                            ) : (
                                                                <CheckCircle className="w-4 h-4" />
                                                            )}
                                                            Accepter
                                                        </button>
                                                        <button
                                                            onClick={() => declineMutation.mutate(booking.id)}
                                                            disabled={declineMutation.isPending}
                                                            className="rounded-full border border-red-300 text-red-600 px-5 py-2 text-sm hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-1"
                                                        >
                                                            {declineMutation.isPending && declineMutation.variables === booking.id ? (
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                            ) : (
                                                                <XCircle className="w-4 h-4" />
                                                            )}
                                                            Refuser
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                                        {getStatusLabel(booking.status)}
                                                    </span>
                                                )}

                                      <button
                                          onClick={() => onNavigate?.({ name: 'host-messages', id: booking.id.toString() })}
                                          className="border border-[#00c9a7] text-[#00c9a7] rounded-full px-5 py-2 text-sm hover:bg-[#00c9a7] hover:text-white transition-colors flex items-center gap-1"
                                      >
                                          <MessageCircle className="w-4 h-4" />
                                          Message
                                      </button>
                                                                                  </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </PageSection>
            </div>
        </div>
    );
}

// ====================Host MESSAGES PAGE ====================

interface Route {
    name: string;
    id?: string;
}

interface HostMessagesPageProps {
    onNavigate?: (route: Route) => void;
    id?: string; // bookingId
}

export function HostMessagesPage({ onNavigate, id }: HostMessagesPageProps) {
    const { user } = useAuth();
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [selectedType, setSelectedType] = useState<'booking' | 'inquiry'>('booking');
    const [selectedGuestId, setSelectedGuestId] = useState<number | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // Récupérer les conversations
    const { data: conversationsData, isLoading: convLoading, refetch: refetchConversations } = useQuery({
        queryKey: ['host-messages-conversations'],
        queryFn: () => hostService.getHostConversations(),
    });

    // Récupérer les messages d'une conversation (booking)
    const { data: messagesData, refetch: refetchMessages, isLoading: messagesLoading } = useQuery({
        queryKey: ['host-messages', selectedType, selectedConversation?.booking?.id],
        queryFn: () => {
            if (selectedType === 'booking' && selectedConversation?.booking?.id) {
                return hostService.getHostMessages(selectedConversation.booking.id.toString());
            } else if (selectedType === 'inquiry' && selectedGuestId) {
                return hostService.getInquiryMessages(selectedGuestId);
            }
            return Promise.reject('No selection');
        },
        enabled: !!selectedConversation,
    });

    // Mutation pour envoyer un message
    const sendMutation = useMutation({
        mutationFn: (message: string) => {
            if (selectedType === 'booking' && selectedConversation?.booking?.id) {
                return hostService.sendHostMessage(selectedConversation.booking.id.toString(), { message });
            } else if (selectedType === 'inquiry' && selectedGuestId) {
                return hostService.sendInquiryReply(selectedGuestId, { message });
            }
            throw new Error('Invalid conversation type');
        },
        onSuccess: () => {
            setMessageInput('');
            refetchMessages();
            queryClient.invalidateQueries({ queryKey: ['host-messages-conversations'] });
        },
    });

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messagesData]);

    const conversations = conversationsData?.data || [];
    const messages = messagesData?.data?.messages || [];
    const currentBooking = messagesData?.data?.booking;

    const handleSelectConversation = (conv: any) => {
        setSelectedConversation(conv);
        if (conv.type === 'inquiry') {
            setSelectedType('inquiry');
            setSelectedGuestId(conv.booking.guest?.id);
        } else {
            setSelectedType('booking');
            setSelectedGuestId(null);
        }
    };

    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedConversation) return;
        sendMutation.mutate(messageInput);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (convLoading) {
        return (
            <div className="bg-white min-h-screen py-10">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7] mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-10">
            <div className="max-w-[1200px] mx-auto px-4">
                <PageSection title="Messagerie hôte" subtitle="Gérez vos conversations avec les voyageurs">
                    <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-3xl border border-[#e2f5f2] overflow-hidden min-h-[600px]">
                        
                        {/* Liste des conversations */}
                        <div className="lg:w-1/3 border-r bg-[#f4fffe]">
                            <div className="p-4 border-b font-semibold bg-white">
                                Conversations ({conversations.length})
                            </div>
                            <div className="divide-y max-h-[500px] overflow-y-auto">
                                {conversations.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Aucune conversation</p>
                                    </div>
                                ) : (
                                    conversations.map((conv: any, index: number) => {
                                        const conversationKey = conv.type === 'inquiry' 
                                            ? `inquiry_${conv.booking.guest?.id}_${index}`
                                            : `booking_${conv.booking.id}`;
                                        
                                        const isSelected = selectedConversation?.booking?.id === conv.booking.id ||
                                            (conv.type === 'inquiry' && selectedGuestId === conv.booking.guest?.id);
                                        
                                        return (
                                            <button
                                                key={conversationKey}
                                                onClick={() => handleSelectConversation(conv)}
                                                className={`w-full text-left p-4 hover:bg-white transition ${
                                                    isSelected ? 'bg-white shadow-sm' : ''
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-[#0f2940]">
                                                            {conv.booking.guest?.name || 'Voyageur'}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {conv.booking.property?.title || 'Demande d\'information'}
                                                        </p>
                                                        {conv.booking.dates?.check_in && conv.booking.dates?.check_out && (
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {conv.booking.dates.check_in} → {conv.booking.dates.check_out}
                                                            </p>
                                                        )}
                                                        {conv.type === 'inquiry' && (
                                                            <span className="text-xs text-[#00c9a7] mt-1 inline-block">
                                                                Demande d'information
                                                            </span>
                                                        )}
                                                    </div>
                                                    {conv.unread_count > 0 && (
                                                        <span className="bg-[#00c9a7] text-white text-xs rounded-full px-2 py-1 min-w-[24px] text-center">
                                                            {conv.unread_count}
                                                        </span>
                                                    )}
                                                </div>
                                                {conv.last_message && (
                                                    <p className="text-xs text-gray-400 mt-2 truncate">
                                                        {conv.last_message.preview || conv.last_message.message}
                                                    </p>
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Zone de chat */}
                        <div className="lg:w-2/3 flex flex-col h-[600px]">
                            {selectedConversation ? (
                                <>
                                    {/* En-tête */}
                                    <div className="p-4 border-b bg-white">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-[#0f2940]">
                                                    {selectedConversation.booking.guest?.name || 'Voyageur'}
                                                </p>
                                                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {selectedConversation.booking.guest?.phone || 'Non renseigné'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {selectedConversation.booking.guest?.email || 'Non renseigné'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right text-xs text-gray-500">
                                                <p className="flex items-center gap-1">
                                                    <Home className="w-3 h-3" />
                                                    {selectedConversation.booking.property?.title || 'Demande d\'information'}
                                                </p>
                                                {selectedConversation.booking.dates?.check_in && selectedConversation.booking.dates?.check_out && (
                                                    <p className="flex items-center gap-1 mt-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {selectedConversation.booking.dates.check_in} → {selectedConversation.booking.dates.check_out}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f4fffe]">
                                        {messagesLoading ? (
                                            <div className="text-center py-10">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c9a7] mx-auto"></div>
                                            </div>
                                        ) : messages.length === 0 ? (
                                            <div className="text-center py-20 text-gray-400">
                                                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p>Aucun message</p>
                                                <p className="text-sm">Soyez le premier à envoyer un message</p>
                                            </div>
                                        ) : (
                                            messages.map((msg: any) => (
                                                <div key={msg.id} className={`flex ${msg.is_from_me ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[70%] rounded-2xl p-3 ${
                                                        msg.is_from_me 
                                                            ? 'bg-[#00c9a7] text-white' 
                                                            : 'bg-white text-gray-800 shadow-sm border border-[#e2f5f2]'
                                                    }`}>
                                                        <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                                                        <p className={`text-xs mt-1 ${msg.is_from_me ? 'text-white/70' : 'text-gray-400'}`}>
                                                            {msg.created_at}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <div className="p-4 border-t bg-white">
                                        <div className="flex gap-2">
                                            <textarea
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Écrivez votre message..."
                                                rows={1}
                                                className="flex-1 border rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c9a7] resize-none"
                                                style={{ minHeight: '44px', maxHeight: '120px' }}
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!messageInput.trim() || sendMutation.isPending}
                                                className="bg-[#00c9a7] text-white rounded-full p-3 disabled:opacity-50 hover:bg-[#00b396] transition"
                                            >
                                                <Send className="w-5 h-5" />
                                            </button>
                                        </div>
                                        {sendMutation.isPending && (
                                            <p className="text-xs text-gray-400 mt-2 text-center">Envoi en cours...</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-[#f4fffe]">
                                    <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                                    <p className="text-lg font-medium">Sélectionnez une conversation</p>
                                    <p className="text-sm">Pour commencer à discuter avec un voyageur</p>
                                </div>
                            )}
                        </div>
                    </div>
                </PageSection>
            </div>
        </div>
    );
}

// ==================== Host Favorites PAGE ====================


interface Route {
    name: string;
    id?: string;
}

interface HostFavoritesPageProps {
    onNavigate?: (route: Route) => void;
}

export function HostFavoritesPage({ onNavigate }: HostFavoritesPageProps) {
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

    // Récupérer les favoris groupés par propriété
    const { data: groupedData, isLoading: groupedLoading, refetch } = useQuery({
        queryKey: ['host-favorites-grouped'],
        queryFn: () => hostService.getHostFavoritesGroupedByProperty(),
    });

    // Récupérer les statistiques
    const { data: statsData } = useQuery({
        queryKey: ['host-favorites-stats'],
        queryFn: () => hostService.getHostFavoritesStatistics(),
    });

    const properties = groupedData?.data || [];
    const stats = statsData?.data || {};

    // ✅ Fonction pour obtenir l'URL de l'image avec le bon format
    const getImageUrl = (property: any): string => {
        // Vérifier cover_photo (objet)
        if (property.cover_photo && typeof property.cover_photo === 'object') {
            if (property.cover_photo.photo_url) {
                return property.cover_photo.photo_url;
            }
            if (property.cover_photo.full_url) {
                return property.cover_photo.full_url;
            }
        }
        
        // Vérifier cover_photo (string)
        if (property.cover_photo && typeof property.cover_photo === 'string') {
            return property.cover_photo;
        }
        
        // Vérifier cover_photo_url
        if (property.cover_photo_url) {
            return property.cover_photo_url;
        }
        
        // Vérifier photos
        if (property.photos && Array.isArray(property.photos) && property.photos.length > 0) {
            const firstPhoto = property.photos[0];
            if (firstPhoto.photo_url) {
                return firstPhoto.photo_url;
            }
            if (firstPhoto.full_url) {
                return firstPhoto.full_url;
            }
            if (firstPhoto.url) {
                return firstPhoto.url;
            }
        }
        
        // Vérifier photo_url
        if (property.photo_url) {
            return property.photo_url;
        }
        
        // Vérifier image
        if (property.image) {
            return property.image;
        }
        
        // Fallback
        return '/placeholder.jpg';
    };

    // ✅ Fonction pour obtenir l'URL de l'avatar d'un utilisateur
    const getUserAvatar = (user: any): string => {
        if (user?.avatar_url) {
            return user.avatar_url;
        }
        if (user?.photo) {
            return user.photo;
        }
        return `https://ui-avatars.com/api/?background=00c9a7&color=fff&name=${encodeURIComponent(user?.name || 'User')}&bold=true&size=80`;
    };

    // ✅ Formater la date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleExport = async () => {
        try {
            const blob = await hostService.exportHostFavorites();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `favoris_hote_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            console.log('✅ Export réussi');
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
        }
    };

    if (groupedLoading) {
        return (
            <div className="min-h-screen bg-[#f4fffe] py-10">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7] mx-auto"></div>
                        <p className="text-gray-500 mt-4">Chargement des favoris...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4fffe] py-10">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0f2940]">Favoris reçus</h1>
                        <p className="text-gray-500 mt-1">
                            Voyageurs qui ont aimé vos propriétés
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="bg-[#00c9a7] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-[#00b396] transition"
                    >
                        <Download className="w-4 h-4" />
                        Exporter
                    </button>
                </div>

                {/* Statistiques */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="bg-white rounded-2xl p-4 border border-[#e2f5f2] shadow-sm">
                        <div className="flex items-center justify-between">
                            <Heart className="w-5 h-5 text-[#00c9a7]" />
                            <span className="text-2xl font-bold text-[#0f2940]">{stats.total_favorites || 0}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Total favoris</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-[#e2f5f2] shadow-sm">
                        <div className="flex items-center justify-between">
                            <Users className="w-5 h-5 text-[#00c9a7]" />
                            <span className="text-2xl font-bold text-[#0f2940]">{stats.unique_travelers || 0}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Voyageurs uniques</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-[#e2f5f2] shadow-sm">
                        <div className="flex items-center justify-between">
                            <Home className="w-5 h-5 text-[#00c9a7]" />
                            <span className="text-2xl font-bold text-[#0f2940]">{stats.total_properties_with_favorites || 0}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Propriétés avec favoris</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-[#e2f5f2] shadow-sm">
                        <div className="flex items-center justify-between">
                            <TrendingUp className="w-5 h-5 text-[#00c9a7]" />
                            <span className="text-2xl font-bold text-[#0f2940]">{stats.favorites_last_30_days || 0}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Derniers 30 jours</p>
                    </div>
                </div>

                {/* Graphique tendance hebdomadaire */}
                {stats.weekly_trend && stats.weekly_trend.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 border border-[#e2f5f2] mb-8 shadow-sm">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#00c9a7]" />
                            Tendance des favoris (7 derniers jours)
                        </h3>
                        <div className="flex items-end justify-between gap-2 h-32">
                            {stats.weekly_trend.map((day: any, index: number) => {
                                const maxCount = Math.max(...stats.weekly_trend.map((d: any) => d.count), 1);
                                const height = (day.count / maxCount) * 100;
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full relative">
                                            <div 
                                                className="w-full bg-[#00c9a7]/20 rounded-t-lg transition-all hover:bg-[#00c9a7]/40"
                                                style={{ height: `${height}%`, minHeight: '4px' }}
                                            >
                                                {day.count > 0 && (
                                                    <div className="text-center text-xs font-medium text-[#00c9a7] relative -top-5">
                                                        {day.count}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Liste des propriétés avec favoris */}
                <div className="space-y-6">
                    {properties.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-[#e2f5f2] p-12 text-center shadow-sm">
                            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[#0f2940] mb-2">
                                Aucun favori pour le moment
                            </h3>
                            <p className="text-gray-500">
                                Les voyageurs n'ont pas encore ajouté vos propriétés en favoris.
                            </p>
                        </div>
                    ) : (
                        properties.map((property: any) => {
                            const imageUrl = getImageUrl(property);
                            const isExpanded = selectedPropertyId === property.id;
                            
                            return (
                                <div key={property.id} className="bg-white rounded-2xl border border-[#e2f5f2] overflow-hidden shadow-sm">
                                    {/* En-tête propriété */}
                                    <div 
                                        className="p-4 bg-[#f4fffe] border-b border-[#e2f5f2] cursor-pointer hover:bg-[#e8f5f2] transition"
                                        onClick={() => setSelectedPropertyId(isExpanded ? null : property.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Image de la propriété */}
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {imageUrl && imageUrl !== '/placeholder.jpg' ? (
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={property.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/placeholder.jpg';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Home className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-[#0f2940]">{property.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    📍 {property.district}, {property.city}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Heart className="w-4 h-4 text-[#00c9a7]" />
                                                        <span className="text-sm font-medium text-[#00c9a7]">
                                                            {property.favorites_count} favoris
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onNavigate?.({ name: 'listing', id: property.id.toString() });
                                                        }}
                                                        className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        Voir l'annonce
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-gray-400 text-lg">
                                                {isExpanded ? '▲' : '▼'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Liste des voyageurs qui ont favorisé */}
                                    {isExpanded && property.favorites && property.favorites.length > 0 && (
                                        <div className="divide-y divide-[#e2f5f2]">
                                            {property.favorites.map((favorite: any) => (
                                                <div key={favorite.id} className="p-4 hover:bg-[#f4fffe] transition">
                                                    <div className="flex items-start gap-4">
                                                        {/* Avatar du voyageur */}
                                                        <div className="flex-shrink-0">
                                                            {favorite.user_avatar || favorite.user?.avatar_url ? (
                                                                <img 
                                                                    src={favorite.user_avatar || favorite.user?.avatar_url}
                                                                    alt={favorite.user_name || favorite.user?.name}
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = getUserAvatar(favorite.user);
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <User className="w-5 h-5 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                                <h4 className="font-medium text-[#0f2940]">
                                                                    {favorite.user_name || favorite.user?.name || 'Voyageur'}
                                                                </h4>
                                                                <span className="text-xs text-gray-400">
                                                                    Ajouté le {formatDate(favorite.created_at)}
                                                                </span>
                                                            </div>
                                                            
                                                            {favorite.user_email && (
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    ✉️ {favorite.user_email}
                                                                </p>
                                                            )}
                                                            
                                                            {favorite.user_phone && (
                                                                <p className="text-sm text-gray-500">
                                                                    📞 {favorite.user_phone}
                                                                </p>
                                                            )}
                                                            
                                                            {favorite.notes && (
                                                                <p className="text-sm text-gray-600 mt-2 italic bg-gray-50 p-2 rounded-lg">
                                                                    "📝 {favorite.notes}"
                                                                </p>
                                                            )}
                                                            
                                                            <div className="flex gap-2 mt-3">
                                                                {favorite.user_id && (
                                                                    <button
                                                                        onClick={() => onNavigate?.({ name: 'profile', id: favorite.user_id.toString() })}
                                                                        className="text-xs border border-[#00c9a7] text-[#00c9a7] px-3 py-1 rounded-full hover:bg-[#00c9a7] hover:text-white transition"
                                                                    >
                                                                        Voir profil
                                                                    </button>
                                                                )}
                                                                {favorite.user_id && (
                                                                    <button
                                                                        onClick={() => onNavigate?.({ name: 'host-messages', id: favorite.user_id.toString() })}
                                                                        className="text-xs border border-gray-300 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 transition flex items-center gap-1"
                                                                    >
                                                                        <MessageCircle className="w-3 h-3" />
                                                                        Envoyer message
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    
                                    {/* Message si aucun favori pour cette propriété */}
                                    {isExpanded && (!property.favorites || property.favorites.length === 0) && (
                                        <div className="p-8 text-center text-gray-500">
                                            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                            <p>Aucun voyageur n'a encore ajouté cette propriété en favoris.</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
// ==================== MESSAGES PAGE ====================



interface MessagesPageProps {
  onNavigate?: (route: any) => void;
  id?: string;
  search?: string;
}

export function MessagesPage({ onNavigate, id, search }: MessagesPageProps) {
  const { user } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  // États pour les paramètres d'inquiry
  const [inquiryPropertyId, setInquiryPropertyId] = useState<string | null>(null);
  const [inquiryCheckIn, setInquiryCheckIn] = useState<string | null>(null);
  const [inquiryCheckOut, setInquiryCheckOut] = useState<string | null>(null);
  const [inquiryGuests, setInquiryGuests] = useState<string | null>(null);

  // États du composant
  const [selectedConversation, setSelectedConversation] = useState<Conversation | InquiryConversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [hasSentInquiry, setHasSentInquiry] = useState(false);
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);
  const [selectedType, setSelectedType] = useState<'booking' | 'inquiry'>('booking');
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialMessageSent = useRef(false);

  // Récupération des paramètres depuis l'URL (identique à votre code)
  useEffect(() => {
    console.log('=== RÉCUPÉRATION DES PARAMÈTRES ===');
    let propertyId = null;
    let checkIn = null;
    let checkOut = null;
    let guests = null;
    let searchString = '';

    if (search && search !== 'undefined') {
      searchString = search;
    } else if (location.search && location.search !== '') {
      searchString = location.search;
    } else {
      const pendingChat = localStorage.getItem('pendingChatProperty');
      if (pendingChat) {
        try {
          const data = JSON.parse(pendingChat);
          searchString = data.search || '';
          localStorage.removeItem('pendingChatProperty');
        } catch (e) { console.error(e); }
      }
      if (!searchString) {
        const chatIntentStr = localStorage.getItem('chatIntent');
        if (chatIntentStr) {
          try {
            const chatIntent = JSON.parse(chatIntentStr);
            propertyId = chatIntent.propertyId?.toString();
            checkIn = chatIntent.checkIn;
            checkOut = chatIntent.checkOut;
            guests = chatIntent.guests?.toString();
            localStorage.removeItem('chatIntent');
          } catch (e) { console.error(e); }
        }
      }
    }

    if (searchString && !propertyId) {
      const cleanSearch = searchString.startsWith('?') ? searchString.substring(1) : searchString;
      const params = new URLSearchParams(cleanSearch);
      propertyId = params.get('property');
      checkIn = params.get('check_in');
      checkOut = params.get('check_out');
      guests = params.get('guests');
    }

    if (!propertyId && id === 'inquiry') {
      const urlParams = new URLSearchParams(window.location.search);
      propertyId = urlParams.get('property');
      checkIn = urlParams.get('check_in');
      checkOut = urlParams.get('check_out');
      guests = urlParams.get('guests');
    }

    setInquiryPropertyId(propertyId);
    setInquiryCheckIn(checkIn);
    setInquiryCheckOut(checkOut);
    setInquiryGuests(guests);
  }, [search, location.search, location.pathname, id]);

  // Récupération des conversations (bookings + inquiries)
  const { data: conversationsData, isLoading: convLoading, refetch: refetchConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const bookingsResponse = await messageService.getConversations();
      const inquiriesResponse = await messageService.getInquiries();
      const allConversations = [
        ...(bookingsResponse?.data || []),
        ...(inquiriesResponse?.data || [])
      ];
      allConversations.sort((a, b) => {
        const timeA = a.last_message?.sent_at || '';
        const timeB = b.last_message?.sent_at || '';
        return timeB.localeCompare(timeA);
      });
      return { data: allConversations };
    },
  });
  const conversations = conversationsData?.data || [];

  // Mutation pour envoyer une inquiry (premier message)
  const inquiryMutation = useMutation({
    mutationFn: (data: {
      property_id: number;
      message: string;
      check_in?: string;
      check_out?: string;
      guests?: number;
    }) => messageService.sendInquiry(data),
    onSuccess: (response) => {
      console.log('✅ Premier message envoyé avec succès:', response);
      setHasSentInquiry(true);
      setIsSendingInquiry(false);
      initialMessageSent.current = true;
      refetchConversations();
      let retryCount = 0;
      const maxRetries = 10;
      const checkForConversation = setInterval(() => {
        refetchConversations();
        retryCount++;
        if (retryCount >= maxRetries) clearInterval(checkForConversation);
      }, 2000);
      setTimeout(() => clearInterval(checkForConversation), 20000);
      toast.success('Message envoyé à l\'hôte');
    },
    onError: (err: any) => {
      console.error('❌ Erreur inquiry:', err);
      setIsSendingInquiry(false);
      toast.error(err?.response?.data?.message || 'Erreur lors de l\'envoi');
    },
  });

  // Récupération des messages (booking ou inquiry)
  const { data: messagesData, refetch: refetchMessages, isLoading: messagesLoading, error: messagesError } = useQuery({
    queryKey: ['messages', selectedType, selectedId],
    queryFn: async () => {
      if (!selectedId) return { data: { messages: [] } };
      console.log('📥 Récupération messages - type:', selectedType, 'id:', selectedId);
      if (selectedType === 'booking') {
        const res = await messageService.getMessages(selectedId as number);
        return res.data;
      } else if (selectedType === 'inquiry') {
        try {
          const res = await messageService.getInquiryMessages(selectedId as number);
          return res.data;
        } catch (err: any) {
          if (err.response?.status === 500) {
            console.warn('⚠️ API inquiry 500, utilisation localStorage');
            return { data: { host: { id: selectedId }, messages: [] } };
          }
          throw err;
        }
      }
      return { data: { messages: [] } };
    },
    enabled: !!selectedId && !!selectedType,
  });

  // Mutation pour envoyer un message (booking ou inquiry)
  const sendMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!selectedId) throw new Error('No conversation selected');
      if (selectedType === 'booking') {
        return messageService.sendMessage(selectedId as number, { message: text });
      } else if (selectedType === 'inquiry') {
        return messageService.sendInquiryReply(selectedId as number, { message: text });
      }
      throw new Error('Invalid type');
    },
    onSuccess: () => {
      setMessageInput('');
      refetchMessages();
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (err: any) => {
      console.error('❌ Erreur envoi:', err);
      toast.error(err?.response?.data?.message || 'Erreur lors de l\'envoi');
    },
  });

  // Envoi automatique du premier message (inquiry)
  useEffect(() => {
    if (id === 'inquiry' && inquiryPropertyId && !hasSentInquiry && !isSendingInquiry && !initialMessageSent.current && user) {
      setIsSendingInquiry(true);
      let message = `Bonjour, je suis intéressé(e) par votre logement. Pourriez-vous me donner plus d'informations ? Merci !`;
      if (inquiryCheckIn && inquiryCheckOut) {
        const checkInDate = new Date(inquiryCheckIn);
        const checkOutDate = new Date(inquiryCheckOut);
        if (checkOutDate > checkInDate) {
          message = `Bonjour, je suis intéressé(e) par votre logement du ${inquiryCheckIn} au ${inquiryCheckOut}${inquiryGuests ? ` pour ${inquiryGuests} personne(s)` : ''}. Pourriez-vous me donner plus d'informations sur la disponibilité ? Merci !`;
        }
      } else if (inquiryGuests) {
        message = `Bonjour, je suis intéressé(e) par votre logement pour ${inquiryGuests} personne(s). Pourriez-vous me donner plus d'informations ? Merci !`;
      }
      const mutationData: any = { property_id: parseInt(inquiryPropertyId, 10), message };
      if (inquiryCheckIn && inquiryCheckOut) {
        const checkInDate = new Date(inquiryCheckIn);
        const checkOutDate = new Date(inquiryCheckOut);
        if (checkOutDate > checkInDate) {
          mutationData.check_in = inquiryCheckIn;
          mutationData.check_out = inquiryCheckOut;
        }
      }
      if (inquiryGuests && parseInt(inquiryGuests) > 0) {
        mutationData.guests = parseInt(inquiryGuests, 10);
      }
      inquiryMutation.mutate(mutationData);
    }
  }, [id, inquiryPropertyId, inquiryCheckIn, inquiryCheckOut, inquiryGuests, hasSentInquiry, isSendingInquiry, user]);

  // Sélection auto après envoi inquiry
  useEffect(() => {
    if (hasSentInquiry && conversations.length > 0 && !selectedConversation && inquiryPropertyId) {
      const matched = conversations.find((conv: any) =>
        conv.booking.property?.id?.toString() === inquiryPropertyId ||
        conv.booking.property_id?.toString() === inquiryPropertyId
      );
      if (matched) setSelectedConversation(matched);
    }
  }, [hasSentInquiry, conversations, selectedConversation, inquiryPropertyId]);

  // Sélection par id dans l'URL
  useEffect(() => {
    if (!selectedConversation && id && id !== 'inquiry' && conversations.length > 0) {
      const matched = conversations.find((conv: any) => conv.booking.id.toString() === id);
      if (matched) setSelectedConversation(matched);
    }
  }, [id, conversations, selectedConversation]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    sendMutation.mutate(messageInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectConversation = (conv: any) => {
    console.log('📌 Sélection conversation:', conv);
    if (conv.type === 'inquiry') {
      setSelectedType('inquiry');
      const hostId = conv.booking.host?.id;
      setSelectedId(hostId);
    } else {
      setSelectedType('booking');
      const bookingId = conv.booking.id;
      setSelectedId(bookingId);
    }
    setSelectedConversation(conv);
  };

  // Composant de chat pour les inquiries (avec fallback localStorage)
  const InquiryChat = ({ hostId, hostName, propertyTitle }: { hostId: number; hostName: string; propertyTitle: string }) => {
    const { messages, loading, error, sending, sendMessage, reloadMessages } = useInquiryMessages(hostId);
    const [localInput, setLocalInput] = useState('');
    const localMessagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      localMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleLocalSend = async () => {
      if (!localInput.trim()) return;
      const success = await sendMessage(localInput);
      if (success) {
        setLocalInput('');
        localMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b bg-white">
          <p className="font-semibold text-gray-900">{hostName}</p>
          <p className="text-sm text-gray-500">{propertyTitle}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              ⚠️ {error}
              <button onClick={reloadMessages} className="ml-2 text-[#00c9a7] underline">Réessayer</button>
            </div>
          )}
          {loading && messages.length === 0 ? (
            <div className="text-center py-10">Chargement des messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-2" />
              <p>Aucun message</p>
              <p className="text-sm mt-1">Soyez le premier à envoyer un message !</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isFromMe = msg.sender_id === user?.id;
              const isPending = msg.id > 999999999;
              return (
                <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl p-3 ${isFromMe ? 'bg-[#00c9a7] text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className={`text-xs ${isFromMe ? 'text-white/70' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {isPending && <span className="text-xs text-yellow-600">⏳ Envoi...</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={localMessagesEndRef} />
        </div>
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <textarea
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleLocalSend()}
              placeholder="Écrivez votre message..."
              rows={1}
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c9a7] resize-none"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button
              onClick={handleLocalSend}
              disabled={!localInput.trim() || sending}
              className="bg-[#00c9a7] text-white rounded-full p-3 disabled:opacity-50 hover:bg-[#00b89a] transition"
            >
              {sending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Composant de chat pour les bookings (version simplifiée, identique à votre code)
  const BookingChat = ({ bookingId, hostName, propertyTitle }: { bookingId: number; hostName: string; propertyTitle: string }) => {
    const { data: msgsData, isLoading, refetch } = useQuery({
      queryKey: ['bookingMessages', bookingId],
      queryFn: () => messageService.getMessages(bookingId),
      enabled: !!bookingId,
    });
    const messages = msgsData?.data?.messages || [];
    const [localInput, setLocalInput] = useState('');
    const sendBookingMutation = useMutation({
      mutationFn: (text: string) => messageService.sendMessage(bookingId, { message: text }),
      onSuccess: () => {
        setLocalInput('');
        refetch();
      },
      onError: (err: any) => toast.error(err?.response?.data?.message || 'Erreur envoi'),
    });
    const localEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      localEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b bg-white">
          <p className="font-semibold text-gray-900">{hostName}</p>
          <p className="text-sm text-gray-500">{propertyTitle}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {isLoading ? <div className="text-center py-10">Chargement...</div> : messages.length === 0 ? (
            <div className="text-center py-10 text-gray-400"><MessageCircle className="w-12 h-12 mx-auto mb-2" /><p>Aucun message</p></div>
          ) : (
            messages.map((msg: Message) => {
              const isFromMe = msg.sender_id === user?.id;
              return (
                <div key={msg.id} className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl p-3 ${isFromMe ? 'bg-[#00c9a7] text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    <p className={`text-xs mt-1 ${isFromMe ? 'text-white/70' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={localEndRef} />
        </div>
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <textarea value={localInput} onChange={(e) => setLocalInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendBookingMutation.mutate(localInput)} placeholder="Écrivez votre message..." rows={1} className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c9a7] resize-none" style={{ minHeight: '44px', maxHeight: '120px' }} />
            <button onClick={() => sendBookingMutation.mutate(localInput)} disabled={!localInput.trim() || sendBookingMutation.isPending} className="bg-[#00c9a7] text-white rounded-full p-3 disabled:opacity-50 hover:bg-[#00b89a] transition">
              {sendBookingMutation.isPending ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Écrans de chargement
  if (id === 'inquiry' && inquiryPropertyId && isSendingInquiry) {
    return (
      <div className="bg-[#f4fffe] min-h-screen py-10">
        <div className="max-w-[1200px] mx-auto px-4 text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7] mx-auto mb-4"></div>
          <p className="text-gray-600">Envoi de votre message à l'hôte...</p>
        </div>
      </div>
    );
  }

  if (convLoading) {
    return (
      <div className="bg-[#f4fffe] min-h-screen py-10">
        <div className="max-w-[1200px] mx-auto px-4 text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7] mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  // Rendu principal
  return (
    <div className="bg-[#f4fffe] min-h-screen py-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#0F2940]">Messagerie</h1>
          <button onClick={() => onNavigate?.({ name: 'home' })} className="text-sm text-gray-500 hover:text-[#00c9a7] transition">← Retour</button>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-3xl shadow-md overflow-hidden">
          {/* Liste des conversations */}
          <div className="lg:w-1/3 border-r">
            <div className="p-4 border-b font-semibold bg-white">Conversations ({conversations.length})</div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2" />
                  <p>Aucune conversation</p>
                </div>
              ) : (
                conversations.map((conv: any, index: number) => {
                  const conversationKey = conv.type === 'inquiry'
                    ? `inquiry_${conv.booking.host?.id || conv.booking.reference || index}_${index}`
                    : `booking_${conv.booking.id || index}`;
                  const isSelected = selectedConversation === conv;
                  return (
                    <button
                      key={conversationKey}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition ${isSelected ? 'bg-gray-100' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {conv.type === 'inquiry' ? conv.booking.host?.name || 'Hôte' : conv.booking.host?.name || 'Hôte'}
                          </p>
                          <p className="text-sm text-gray-500">{conv.booking.property?.title || 'Demande d\'information'}</p>
                          {conv.booking.dates?.check_in && conv.booking.dates?.check_out && (
                            <p className="text-xs text-gray-400 mt-1">{conv.booking.dates.check_in} → {conv.booking.dates.check_out}</p>
                          )}
                          {conv.type === 'inquiry' && <span className="text-xs text-[#00c9a7] mt-1 inline-block">Demande d'information</span>}
                        </div>
                        {conv.unread_count > 0 && <span className="bg-[#00c9a7] text-white text-xs rounded-full px-2 py-1">{conv.unread_count}</span>}
                      </div>
                      {conv.last_message && <p className="text-xs text-gray-400 mt-2 truncate">{conv.last_message.message}</p>}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Zone de chat dynamique */}
          <div className="lg:w-2/3 flex flex-col h-[600px]">
            {selectedConversation ? (
              selectedConversation.type === 'inquiry' ? (
                <InquiryChat
                  hostId={selectedConversation.booking.host.id}
                  hostName={selectedConversation.booking.host.name}
                  propertyTitle={selectedConversation.booking.property.title}
                />
              ) : (
                <BookingChat
                  bookingId={selectedConversation.booking.id}
                  hostName={selectedConversation.booking.host.name}
                  propertyTitle={selectedConversation.booking.property.title}
                />
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Sélectionnez une conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// ==================== FAVORITES PAGE ====================

export function FavoritesPage({ onNavigate }: PageProps) {
  const { favorites, removeFavorite, toggleFavorite } = useFavorites();
  const [selectedFilter, setSelectedFilter] = useState('Tous');

  // ✅ Extraire les données du favori (la propriété est dans property)
  const getPropertyData = (favorite: any) => {
    // Si c'est déjà un favori transformé avec la structure correcte
    if (favorite.property) {
      return favorite.property;
    }
    // Si c'est déjà une propriété directe
    return favorite;
  };

  // ✅ Fonction pour extraire l'image
  const getImageUrl = (favorite: any): string => {
    const property = getPropertyData(favorite);
    
    // Vérifier photo directe
    if (property.photo) {
      let cleanUrl = property.photo;
      if (cleanUrl.includes('hstgr.io') || cleanUrl.includes('srv2197-files')) {
        const filename = cleanUrl.split('/').pop();
        if (filename && property.id) {
          cleanUrl = `https://api.bluefin-immo.com/api/property-image/${property.id}/${filename}`;
        }
      }
      return cleanUrl;
    }
    
    // Vérifier images array
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      return property.images[0];
    }
    
    // Vérifier cover_photo
    if (property.cover_photo) {
      if (typeof property.cover_photo === 'string') return property.cover_photo;
      if (property.cover_photo.photo_url) return property.cover_photo.photo_url;
      if (property.cover_photo.full_url) return property.cover_photo.full_url;
    }
    
    // Fallback
    return `https://picsum.photos/seed/${property.id}/400/300`;
  };

  // ✅ Fonction pour le prix
  const getPriceDisplay = (favorite: any): string => {
    const property = getPropertyData(favorite);
    const price = property.price_per_night || property.price || 0;
    // Nettoyer le prix (enlever les espaces et convertir en nombre)
    const cleanPrice = typeof price === 'string' ? parseInt(price.replace(/\s/g, '')) : price;
    return `${cleanPrice.toLocaleString()} FCFA`;
  };

  // ✅ Fonction pour la note
  const getRating = (favorite: any): number => {
    const property = getPropertyData(favorite);
    const rating = property.average_rating || property.rating || 0;
    return typeof rating === 'number' ? rating : parseFloat(rating) || 0;
  };

  // ✅ Fonction pour le nombre d'avis
  const getReviews = (favorite: any): number => {
    const property = getPropertyData(favorite);
    return property.reviews_count || property.reviews || 0;
  };

  // ✅ Fonction pour la localisation
  const getLocation = (favorite: any): string => {
    const property = getPropertyData(favorite);
    if (property.location) return property.location;
    const parts = [];
    if (property.district) parts.push(property.district);
    if (property.city) parts.push(property.city);
    return parts.length > 0 ? parts.join(', ') : 'Bénin';
  };

  // ✅ Fonction pour le titre
  const getTitle = (favorite: any): string => {
    const property = getPropertyData(favorite);
    return property.title || 'Logement sans titre';
  };

  // ✅ Fonction pour l'ID
  const getPropertyId = (favorite: any): number => {
    const property = getPropertyData(favorite);
    return property.id;
  };

  // ✅ Filtrage et tri
  const getFilteredFavorites = () => {
    let filtered = [...favorites];
    switch (selectedFilter) {
      case 'Prix croissant':
        return filtered.sort((a, b) => {
          const priceA = parseInt((a.property?.price_per_night || '0').replace(/\s/g, ''));
          const priceB = parseInt((b.property?.price_per_night || '0').replace(/\s/g, ''));
          return priceA - priceB;
        });
      case 'Prix décroissant':
        return filtered.sort((a, b) => {
          const priceA = parseInt((a.property?.price_per_night || '0').replace(/\s/g, ''));
          const priceB = parseInt((b.property?.price_per_night || '0').replace(/\s/g, ''));
          return priceB - priceA;
        });
      case 'Mieux notés':
        return filtered.sort((a, b) => getRating(b) - getRating(a));
      default:
        return filtered;
    }
  };

  const displayedFavorites = getFilteredFavorites();

  if (!favorites || favorites.length === 0) {
    return (
      <div className="min-h-screen bg-white py-10">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => onNavigate?.({ name: 'home' })}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#0F2940]" />
            </button>
            <h1 className="text-2xl font-bold text-[#0F2940]">Mes favoris</h1>
            <span className="text-sm text-gray-500">(0 logement)</span>
          </div>
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#0F2940] mb-2">Aucun favori</h2>
            <p className="text-gray-500 mb-6">Les logements que vous ajoutez aux favoris apparaissent ici.</p>
            <button
              onClick={() => onNavigate?.({ name: 'home' })}
              className="px-6 py-3 bg-[#00c9a7] text-white rounded-full font-semibold hover:bg-[#00b892] transition-colors"
            >
              Découvrir des logements
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate?.({ name: 'home' })}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#0F2940]" />
          </button>
          <h1 className="text-2xl font-bold text-[#0F2940]">Mes favoris</h1>
          <span className="text-sm text-gray-500">({displayedFavorites.length} logements)</span>
        </div>

        {/* Filtres */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['Tous', 'Prix croissant', 'Prix décroissant', 'Mieux notés'].map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap ${
                  selectedFilter === filter 
                    ? 'bg-[#00c9a7] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grille des favoris */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedFavorites.map((favorite) => {
            const propertyId = getPropertyId(favorite);
            const imageUrl = getImageUrl(favorite);
            const title = getTitle(favorite);
            const location = getLocation(favorite);
            const priceDisplay = getPriceDisplay(favorite);
            const rating = getRating(favorite);
            const reviews = getReviews(favorite);
            const propertyData = getPropertyData(favorite);
            
            return (
              <div 
                key={favorite.id} 
                className="group rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                onClick={() => onNavigate?.({ name: 'listing', id: propertyId.toString() })}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${propertyId}/400/300`;
                    }}
                  />
                  
                  {/* Bouton retirer des favoris */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(propertyId);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors z-10 shadow-md"
                    aria-label="Retirer des favoris"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                  
                  {/* Badge Bluefin Certifié */}
                  {propertyData.bluefin_certified && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium z-10">
                      ✓ Bluefin Certifié
                    </div>
                  )}
                  
                  {/* Badge Instant Booking */}
                  {propertyData.instant_booking && (
                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-green-600 text-white text-xs rounded-full z-10">
                      ⚡ Réservation instantanée
                    </div>
                  )}
                </div>
                
                {/* Contenu */}
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-[#0F2940] line-clamp-1">{title}</h3>
                    {rating > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{rating.toFixed(1)}</span>
                        {reviews > 0 && (
                          <span className="text-gray-500">({reviews})</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">{location}</p>
                  
                  {/* Équipements */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {propertyData.has_wifi && (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                        📶 Wi-Fi
                      </span>
                    )}
                    {propertyData.has_air_conditioning && (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                        ❄️ Clim
                      </span>
                    )}
                    {propertyData.has_generator && (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
                        ⚡ Groupe
                      </span>
                    )}
                  </div>
                  
                  {/* Prix */}
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-lg text-[#00c9a7]">{priceDisplay}</span>
                        <span className="text-sm text-gray-400"> / nuit</span>
                      </div>
                      <button 
                        className="text-sm text-[#00c9a7] hover:text-[#0F2940] font-medium transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate?.({ name: 'listing', id: propertyId.toString() });
                        }}
                      >
                        Voir détails →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
// ==================== PUBLISH LISTING PAGE ====================

export function PublishListingPage({ onNavigate }: { onNavigate?: (route: any) => void }) {
  const [isHost, setIsHost] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // État pour la devise
  const [currency, setCurrency] = useState<'XAF' | 'EUR'>('XAF');
  const [priceInEuro, setPriceInEuro] = useState('');
  
  const initialForm = {
    title: '',
    description: '',
    property_type: 'appartement',
    city: '',
    district: '',
    address: '',
    bedrooms: '1',
    beds: '1',
    bathrooms: '1',
    max_guests: '1',
    price_per_night: '0',
    min_stay: '1',
    has_wifi: true,
    has_air_conditioning: false,
    has_generator: false,
    has_water_tank: false,
    has_parking: false,
    has_kitchen: false,
    has_tv: false,
    has_towels: false,
    has_toiletries: false,
    has_hair_dryer: false,
    has_hot_water: false,
    has_bathtub: false,
    has_shower: false,
    has_bed_linen: false,
    has_pillows: false,
    has_blankets: false,
    has_hangers: false,
    has_closet: false,
    has_iron: false,
    has_basic_kitchen_equipment: false,
    has_dishes_cutlery: false,
    has_coffee_maker: false,
    has_kettle: false,
    has_oven: false,
    has_microwave: false,
    has_freezer: false,
    has_refrigerator: false,
    has_dining_table: false,
    has_wine_glasses: false,
    has_toaster: false,
    has_blender: false,
    has_smart_tv: false,
    has_streaming: false,
    has_bluetooth_speaker: false,
    has_books: false,
    has_smoke_detector: false,
    has_first_aid_kit: false,
    has_fire_extinguisher: false,
    has_cctv: false,
    has_electric_fence: false,
    has_breakfast: false,
    has_housekeeping: false,
    has_ironing_service: false,
    has_airport_shuttle: false,
    has_free_parking: false,
    has_luggage_storage: false,
    has_balcony: false,
    has_garden: false,
    has_bbq: false,
    has_pool: false,
    has_loungers: false,
  };

  const [formData, setFormData] = useState(initialForm);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Taux de conversion exacts (sans arrondis flottants)
  // 1 EUR = 655.957 XAF (taux fixe officiel)
  const XAF_TO_EUR = 1 / 655.957;
  const EUR_TO_XAF = 655.957;

  // Fonctions de conversion avec préservation de la valeur exacte
  const convertXAFtoEUR = (xaf: number): string => {
    const eur = xaf / EUR_TO_XAF;
    return eur.toFixed(0);
  };

  const convertEURtoXAF = (eur: number): number => {
    return Math.round(eur * EUR_TO_XAF);
  };

  // Gestionnaire pour le changement de devise
  const handleCurrencyChange = (newCurrency: 'XAF' | 'EUR') => {
    const currentXAF = parseInt(formData.price_per_night) || 0;
    
    if (newCurrency === 'EUR') {
      // Convertir XAF -> EUR pour affichage
      const eurValue = convertXAFtoEUR(currentXAF);
      setPriceInEuro(eurValue);
    } else {
      // Convertir EUR -> XAF pour stockage
      const currentEUR = parseInt(priceInEuro) || 0;
      const xafValue = convertEURtoXAF(currentEUR);
      setFormData(prev => ({ ...prev, price_per_night: xafValue.toString() }));
    }
    setCurrency(newCurrency);
  };

  // Gestionnaire pour le changement de prix en XAF
  const handleXAFPriceChange = (value: string) => {
    const xafPrice = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, price_per_night: xafPrice.toString() }));
    // Mettre à jour l'affichage Euro
    const eurValue = convertXAFtoEUR(xafPrice);
    setPriceInEuro(eurValue);
  };

  // Gestionnaire pour le changement de prix en EUR
  const handleEURPriceChange = (value: string) => {
    const eurPrice = parseInt(value) || 0;
    setPriceInEuro(eurPrice.toString());
    // Convertir en XAF pour stockage
    const xafPrice = convertEURtoXAF(eurPrice);
    setFormData(prev => ({ ...prev, price_per_night: xafPrice.toString() }));
  };

  useEffect(() => {
    checkUserType();
  }, []);

  const checkUserType = () => {
    setCheckingAuth(true);
    try {
      const userStr = localStorage.getItem('user');
      const userType = localStorage.getItem('userType');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.user_type === 'hote' || userType === 'hote') {
          setIsHost(true);
        } else {
          toast.error('Vous devez être connecté en tant qu\'hôte pour publier une annonce');
        }
      } else {
        toast.error('Veuillez vous connecter');
      }
    } catch (error) {
      console.error('Erreur vérification:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleInputChange = (key: keyof typeof initialForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    setPhotos((prev) => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isHost) {
      toast.error('Vous devez être connecté en tant qu\'hôte pour publier une annonce');
      return;
    }
    
    setSubmitting(true);

    try {
      if (photos.length < 3) {
        throw new Error('Veuillez sélectionner au moins 3 photos pour l\'annonce.');
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        property_type: formData.property_type,
        city: formData.city,
        district: formData.district,
        address: formData.address,
        bedrooms: parseInt(formData.bedrooms, 10),
        beds: parseInt(formData.beds, 10),
        bathrooms: parseInt(formData.bathrooms, 10),
        max_guests: parseInt(formData.max_guests, 10),
        price_per_night: parseFloat(formData.price_per_night),
        cleaning_fee: 0,
        min_stay: parseInt(formData.min_stay, 10),
      };

      console.log('📤 Création de la propriété avec prix:', payload.price_per_night);
      
      const propertyResponse = await hostService.createProperty(payload);
      
      let cleanResponse = propertyResponse;
      if (typeof cleanResponse === 'string') {
        const jsonStartIndex = cleanResponse.indexOf('{');
        if (jsonStartIndex !== -1) {
          const jsonString = cleanResponse.substring(jsonStartIndex);
          cleanResponse = JSON.parse(jsonString);
        }
      }
      
      let propertyId = cleanResponse?.data?.id || cleanResponse?.id || null;
      
      if (!propertyId) {
        throw new Error('Impossible de récupérer l\'ID de la propriété.');
      }
      
      await hostService.addPhotos(propertyId, photos);
      
      const amenities = {
        has_wifi: formData.has_wifi,
        has_air_conditioning: formData.has_air_conditioning,
        has_generator: formData.has_generator,
        has_water_tank: formData.has_water_tank,
        has_parking: formData.has_parking,
        has_kitchen: formData.has_kitchen,
        has_tv: formData.has_tv,
        has_towels: formData.has_towels,
        has_toiletries: formData.has_toiletries,
        has_hair_dryer: formData.has_hair_dryer,
        has_hot_water: formData.has_hot_water,
        has_bathtub: formData.has_bathtub,
        has_shower: formData.has_shower,
        has_bed_linen: formData.has_bed_linen,
        has_pillows: formData.has_pillows,
        has_blankets: formData.has_blankets,
        has_hangers: formData.has_hangers,
        has_closet: formData.has_closet,
        has_iron: formData.has_iron,
        has_basic_kitchen_equipment: formData.has_basic_kitchen_equipment,
        has_dishes_cutlery: formData.has_dishes_cutlery,
        has_coffee_maker: formData.has_coffee_maker,
        has_kettle: formData.has_kettle,
        has_oven: formData.has_oven,
        has_microwave: formData.has_microwave,
        has_freezer: formData.has_freezer,
        has_refrigerator: formData.has_refrigerator,
        has_dining_table: formData.has_dining_table,
        has_wine_glasses: formData.has_wine_glasses,
        has_toaster: formData.has_toaster,
        has_blender: formData.has_blender,
        has_smart_tv: formData.has_smart_tv,
        has_streaming: formData.has_streaming,
        has_bluetooth_speaker: formData.has_bluetooth_speaker,
        has_books: formData.has_books,
        has_smoke_detector: formData.has_smoke_detector,
        has_first_aid_kit: formData.has_first_aid_kit,
        has_fire_extinguisher: formData.has_fire_extinguisher,
        has_cctv: formData.has_cctv,
        has_electric_fence: formData.has_electric_fence,
        has_breakfast: formData.has_breakfast,
        has_housekeeping: formData.has_housekeeping,
        has_ironing_service: formData.has_ironing_service,
        has_airport_shuttle: formData.has_airport_shuttle,
        has_free_parking: formData.has_free_parking,
        has_luggage_storage: formData.has_luggage_storage,
        has_balcony: formData.has_balcony,
        has_garden: formData.has_garden,
        has_bbq: formData.has_bbq,
        has_pool: formData.has_pool,
        has_loungers: formData.has_loungers,
      };
      await hostService.updateAmenities(propertyId, amenities);
      
      await hostService.submitForReview(propertyId);
      
      toast.success('Votre annonce a bien été soumise.');
      setFormData(initialForm);
      setPhotos([]);
      setPhotoPreviews([]);
      setShowSuccessModal(true);
      
    } catch (error: any) {
      console.error('❌ Erreur:', error);
      
      let errorMessage = 'Erreur lors de la soumission';
      
      if (error.response?.status === 401) {
        errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
        setTimeout(() => onNavigate?.({ name: 'auth' }), 2000);
      } else if (error.response?.status === 403) {
        errorMessage = error.response?.data?.message || 'Vous n\'avez pas les droits pour créer une annonce.';
        toast.error(errorMessage);
      } else if (error.response?.status === 422) {
        const errors = error.response?.data?.errors;
        if (errors) {
          errorMessage = Object.values(errors).flat().join(', ');
        } else {
          errorMessage = error.response?.data?.message || 'Données invalides';
        }
        toast.error(errorMessage);
      } else {
        errorMessage = error?.response?.data?.message || error?.message || 'Erreur lors de la soumission';
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onNavigate?.({ name: 'host-annonces' });
  };

  if (checkingAuth) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c9a7]" />
        <p className="ml-3 text-gray-600">Vérification de votre compte...</p>
      </div>
    );
  }

  if (!isHost) {
    return (
      <div className="min-h-screen bg-[#f4fffe] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F2940] mb-2">Accès restreint</h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté en tant qu'hôte pour publier une annonce.
          </p>
          <button
            onClick={() => onNavigate?.({ name: 'become-host' })}
            className="bg-[#00c9a7] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#00b892] transition"
          >
            Devenir hôte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4fffe] min-h-screen py-10">
      <div className="max-w-[950px] mx-auto px-4 sm:px-6 lg:px-8">
        <PageSection title="Publier une annonce" subtitle="Remplissez les détails de votre logement puis soumettez-le à l'administration pour publication.">
          <div className="rounded-[2rem] bg-white border border-[#e2f5f2] p-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations de base - inchangé */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#0F2940]">Titre</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full rounded-3xl border border-[#e2f5f2] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                    placeholder="Maison contemporaine à Cotonou"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#0F2940]">Type de propriété</label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => handleInputChange('property_type', e.target.value)}
                    className="w-full rounded-3xl border border-[#e2f5f2] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                  >
                    <option value="appartement">Appartement</option>
                    <option value="chambre_habitant">Chambre chez l'habitant</option>
                    <option value="villa">Villa</option>
                    <option value="hotel">Hôtel</option>
                    <option value="motel">Motel</option>
                    <option value="auberge">Auberge</option>
                    <option value="maison_hotes">Maison d'hôtes</option>
                    <option value="ecolodge">Ecolodge</option>
                    <option value="residence_hoteliere">Résidence hôtelière</option>
                    <option value="immeuble_entier">Immeuble entier</option>
                  </select>
                </div>
                <div className="space-y-3 lg:col-span-2">
                  <label className="text-sm font-medium text-[#0F2940]">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full min-h-[160px] rounded-[1.75rem] border border-[#e2f5f2] px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                    placeholder="Décrivez votre logement, l'ambiance, les équipements et les points forts."
                    required
                  />
                </div>
              </div>

              {/* Localisation */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#0F2940]">Ville</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full rounded-3xl border border-[#e2f5f2] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                    placeholder="Cotonou"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#0F2940]">Quartier</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full rounded-3xl border border-[#e2f5f2] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                    placeholder="Haie Vive"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#0F2940]">Adresse</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full rounded-3xl border border-[#e2f5f2] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                    placeholder="Rue des Filaos, Cotonou"
                  />
                </div>
              </div>

              {/* Capacité */}
              <div className="grid gap-6 lg:grid-cols-4">
                {[
                  { label: 'Chambres', key: 'bedrooms' },
                  { label: 'Lits', key: 'beds' },
                  { label: 'Salles de bain', key: 'bathrooms' },
                  { label: 'Capacité (personnes)', key: 'max_guests' },
                ].map((field) => (
                  <div key={field.key} className="space-y-3">
                    <label className="text-sm font-medium text-[#0F2940]">{field.label}</label>
                    <input
                      type="number"
                      min={1}
                      value={(formData as any)[field.key]}
                      onChange={(e) => handleInputChange(field.key as any, e.target.value)}
                      className="w-full rounded-3xl border border-[#e2f5f2] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Tarification avec double devise - CORRIGÉ */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#0F2940]">Prix par nuit</label>
                  
                  {/* Sélecteur de devise */}
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange('XAF')}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                        currency === 'XAF' 
                          ? 'bg-[#00c9a7] text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      FCFA (XAF)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCurrencyChange('EUR')}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                        currency === 'EUR' 
                          ? 'bg-[#00c9a7] text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Euro (€)
                    </button>
                  </div>
                  
                  {/* Champ de prix selon la devise sélectionnée */}
                  {currency === 'XAF' ? (
                    <div>
                      <input
                        type="number"
                        min={0}
                        step={1000}
                        value={formData.price_per_night}
                        onChange={(e) => handleXAFPriceChange(e.target.value)}
                        className="w-full rounded-3xl border border-[#e2f5f2] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                        placeholder="Prix en FCFA"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        ≈ {priceInEuro || convertXAFtoEUR(parseInt(formData.price_per_night) || 0)} €
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="number"
                        min={0}
                        step={5}
                        value={priceInEuro}
                        onChange={(e) => handleEURPriceChange(e.target.value)}
                        className="w-full rounded-3xl border border-[#e2f5f2] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                        placeholder="Prix en Euros"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        ≈ {convertEURtoXAF(parseInt(priceInEuro) || 0).toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Une commission de 10% sera appliquée sur chaque réservation
                  </p>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#0F2940]">Séjour minimum (nuits)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.min_stay}
                    onChange={(e) => handleInputChange('min_stay', e.target.value)}
                    className="w-full rounded-3xl border border-[#e2f5f2] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
                    required
                  />
                </div>
              </div>

              {/* Équipements - Gardez votre code existant */}
              <div className="rounded-[1.75rem] border border-[#e2f5f2] bg-[#f4fffe] p-5">
                {/* Votre code d'équipements ici */}
              </div>

              {/* Photos */}
              <div>
                <label className="text-sm font-medium text-[#0F2940]">Photos du logement (minimum 3)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="mt-2 block w-full text-sm text-[#0F2940] file:mr-4 file:rounded-full file:border-0 file:bg-[#00c9a7] file:px-4 file:py-2 file:text-white hover:file:bg-[#00b892] transition"
                />
                
                {photoPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {photoPreviews.map((preview, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden border border-[#e2f5f2] bg-white shadow-sm">
                        <img src={preview} alt={`Aperçu ${index + 1}`} className="w-full h-32 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(index)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition transform hover:scale-110"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                          {index + 1}/{photos.length}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {photos.length < 3 && (
                  <p className="text-sm text-red-600 mt-3 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Veuillez sélectionner au moins 3 photos (actuellement {photos.length})
                  </p>
                )}
                
                {photos.length >= 3 && (
                  <p className="text-sm text-green-600 mt-3 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {photos.length} photo{photos.length > 1 ? 's' : ''} sélectionnée{photos.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Informations */}
              <div className="rounded-[1.75rem] border border-[#e2f5f2] bg-[#f4fffe] p-5 text-sm text-[#6b7280]">
                <p className="font-semibold text-[#0F2940] mb-2"> Frais de service</p>
                <p>Une commission de 10% sera automatiquement appliquée sur chaque réservation. Aucun frais de ménage n'est facturé.</p>
              </div>

              <div className="rounded-[1.75rem] border border-[#e2f5f2] bg-[#f4fffe] p-5 text-sm text-[#6b7280]">
                <p className="font-semibold text-[#0F2940] mb-2">Attention</p>
                <p>Après soumission, une équipe admin examinera votre annonce. Si tout est conforme, elle sera publiée sur la page d'accueil.</p>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={submitting || photos.length < 3}
                  className="inline-flex items-center justify-center rounded-full bg-[#00c9a7] px-6 py-3 text-white font-semibold hover:bg-[#00b892] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Envoi en cours...' : 'Soumettre l\'annonce'}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate?.({ name: 'home' })}
                  className="inline-flex items-center justify-center rounded-full border border-[#e2f5f2] px-6 py-3 text-[#0F2940] hover:bg-[#f4fffe] transition"
                >
                  Retour à l'accueil
                </button>
              </div>
            </form>
          </div>
        </PageSection>
      </div>

      {/* Modal de succès */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-[500px] rounded-2xl bg-white shadow-xl overflow-hidden border border-[#e2f5f2] my-8">
            <div className="relative bg-gradient-to-br from-[#f3fffc] to-white px-5 py-5 text-center">
              <button onClick={handleSuccessClose} className="absolute top-3 right-3 rounded-full p-1.5 text-gray-400 hover:text-gray-600 transition">
                <X className="w-4 h-4" />
              </button>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f9f3] border border-[#c7f1ea]">
                <CheckCircle className="w-7 h-7 text-[#00C9A7]" />
              </div>
              <h2 className="text-lg font-semibold text-[#0F2940]">Votre bien est entre de bonnes mains.</h2>
              <p className="mx-auto mt-2 max-w-md text-xs text-gray-500">
                Merci pour votre confiance. Nous avons bien reçu votre demande et notre équipe va l'étudier avec la plus grande attention.
              </p>
            </div>
            <div className="px-5 pb-5">
              <div className="mb-4 flex flex-col items-center gap-2 rounded-xl border border-[#c7f1ea] bg-[#f4fffe] px-3 py-2 text-xs font-medium text-[#0F2940] sm:flex-row sm:justify-center">
                <Clock className="w-3.5 h-3.5 text-[#00C9A7]" />
                <span>Notre équipe vous contacte sous 24h</span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <a href="https://wa.me/22900000000?text=Bonjour%20Bluefin%20Immo%2C%20je%20viens%20de%20soumettre%20mon%20annonce" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-3 py-2 text-white font-semibold text-sm shadow-sm hover:bg-[#1fbf55] transition">
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  WhatsApp
                </a>
                <button onClick={handleSuccessClose} className="inline-flex items-center justify-center rounded-full border border-[#00c9a7] px-3 py-2 text-[#0F2940] font-semibold text-sm hover:bg-[#f4fffe] transition">
                  Voir mes annonces
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ==================== HELP PAGE ====================


// ========== COMPOSANT PRINCIPAL HELP PAGE ==========
export function HelpPage({ onNavigate }: { onNavigate?: (route: any) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<"voyageur" | "hote_logement" | "hote_experience" | "hote_service" | "administrateur">("voyageur");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<{ id: string; title: string; category: string; content: string } | null>(null);
  const [showRolesMenu, setShowRolesMenu] = useState(false);

  const roles = [
    { id: "voyageur", label: "Voyageur", icon: Users },
    { id: "hote_logement", label: "Hôte d'un logement", icon: Home },
    { id: "hote_experience", label: "Hôte d'expérience", icon: Sparkles },
    { id: "hote_service", label: "Hôte de services", icon: Briefcase },

  ];

  // Rôles visibles et cachés pour le menu sur mobile
  const visibleRoles = roles.slice(0, 3);
  const hiddenRoles = roles.slice(3);

  // Contenu pour Hôte d'expérience
  const getExperienceContent = () => ({
    title: "Aide pour les hôtes d'expérience",
    description: "Trouvez des réponses à vos questions sur la création, la gestion et la promotion de vos expériences.",
    articles: [
     { 
  id: "experience-adaptee", 
  title: "Mon expérience est-elle adaptée sur Bluefin ?", 
  description: "Découvrez les critères pour qu'une expérience soit éligible sur Bluefin Immo.",
  content: `
    <div class="space-y-4">
      <p>Les Expériences Bluefin sont des activités mémorables animées par des hôtes passionnés, experts de leur ville.</p>
      <p><strong>Types d'expériences acceptées :</strong></p>
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-[#f4fffe] rounded-xl p-3 text-center">Visites insolites</div>
        <div class="bg-[#f4fffe] rounded-xl p-3 text-center">Dégustations culinaires</div>
        <div class="bg-[#f4fffe] rounded-xl p-3 text-center">Ateliers créatifs</div>
        <div class="bg-[#f4fffe] rounded-xl p-3 text-center">Cours (danse, musique)</div>
        <div class="bg-[#f4fffe] rounded-xl p-3 text-center">Activités en plein air</div>
        <div class="bg-[#f4fffe] rounded-xl p-3 text-center">Expériences culturelles</div>
      </div>
      <p>Chaque expérience est conçue pour être unique et authentique.</p>
      <div class="bg-[#f4fffe] rounded-xl p-4 mt-4">
        <p class="text-sm text-[#0F2940]"><strong> En savoir plus :</strong> Consultez nos critères détaillés pour les expériences Bluefin.</p>
      </div>
    </div>
  `
},
      { 
  id: "experience-deposer-demande", 
  title: "Que dois-je faire pour déposer ma demande ?", 
  description: "Guide étape par étape pour soumettre votre expérience.",
  content: `
    <div class="space-y-4">
      <p>Rien de plus simple ! Suivez ces étapes :</p>
      <div class="space-y-3">
        <div class="flex gap-3">
          <div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">1</div>
          <div><strong>Présentez-vous</strong> et décrivez votre expérience en détail.</div>
        </div>
        <div class="flex gap-3">
          <div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">2</div>
          <div><strong>Enrichissez votre annonce</strong> avec des photos de qualité, des détails précis et un itinéraire.</div>
        </div>
        <div class="flex gap-3">
          <div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">3</div>
          <div><strong>Définissez vos tarifs</strong> de manière compétitive.</div>
        </div>
        <div class="flex gap-3">
          <div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">4</div>
          <div><strong>Soumettez votre annonce</strong> à notre équipe pour validation.</div>
        </div>
      </div>
      <p>Notre équipe pourra vous contacter pour vous suggérer des ajustements ou vous demander certains documents (agréments, justificatif d'assurance). Une fois approuvée, votre annonce est en ligne et vous pouvez commencer à recevoir des réservations.</p>
      <div class=" rounded-xl p-4 text-center">
        <button 
          onclick="window.location.href='/become-host'" 
          class="bg-[#00c9a7] text-white px-6 py-2 rounded-full font-medium hover:bg-[#00b892] transition cursor-pointer"
        >
          Commencer mon inscription
        </button>
      </div>
    </div>
  `
},
      { 
        id: "experience-frais", 
        title: "Quels sont les frais Bluefin ?", 
        description: "Détail des frais de service appliqués.",
        content: `
          <div class="space-y-4">
            <p>La création et l'envoi de l'annonce en vue de sa vérification sont <strong>gratuits</strong>.</p>
            <div class="bg-[#f4fffe] rounded-xl p-4">
              <p class="font-semibold text-[#0F2940]">Frais de service :</p>
              <p class="text-2xl font-bold text-[#00c9a7] mt-2">15%</p>
              <p class="text-sm text-gray-600">Pour chaque expérience réservée, Bluefin-Immo déduit automatiquement 15% des frais de service du versement.</p>
            </div>
            <p class="text-sm text-gray-500">Exemple : Pour une expérience à 100 000 FCFA, vous recevrez 85 000 FCFA.</p>
          </div>
        `
      },
      { 
        id: "experience-visibilite", 
        title: "Comment les voyageurs découvriront-ils mon expérience ?", 
        description: "Visibilité et promotion de votre expérience.",
        content: `
          <div class="space-y-4">
            <p>Votre expérience bénéficie d'une visibilité optimale sur Bluefin Immo grâce à :</p>
            <ul class="list-disc pl-5 space-y-2">
              <li>Un <strong>onglet dédié</strong> aux expériences sur la plateforme</li>
              <li>Les <strong>résultats de recherche</strong> des voyageurs</li>
              <li>Les <strong>recommandations personnalisées</strong></li>
              <li>Les <strong>communications par e-mail et notifications</strong></li>
              <li>Les <strong>suggestions directes</strong> dans le récapitulatif de séjour</li>
            </ul>
          </div>
        `
      },
      { 
        id: "experience-versement", 
        title: "Dans quel délai vais-je recevoir mon versement ?", 
        description: "Délais de paiement pour les hôtes.",
        content: `
          <div class="space-y-4">
            <p>Le délai varie selon :</p>
            <ul class="list-disc pl-5 space-y-2">
              <li>Le <strong>mode de versement</strong> choisi dans votre profil Bluefin Immo</li>
              <li>Les <strong>délais de traitement</strong> de votre établissement bancaire</li>
            </ul>
            <div class="bg-[#f4fffe] rounded-xl p-4">
              <p class="font-semibold text-[#0F2940]">⏱Délai standard :</p>
              <p>Vous recevez votre paiement dès le <strong>lendemain de la réalisation de l'expérience</strong>.</p>
            </div>
          </div>
        `
      },
      { 
        id: "experience-verification", 
        title: "Processus de vérification", 
        description: "Comment se déroule la vérification de votre annonce.",
        content: `
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">En quoi consiste le processus de vérification ?</h3>
            <p>Après envoi de votre annonce :</p>
            <ol class="list-decimal pl-5 space-y-2">
              <li>Vous recevez un <strong>e-mail de confirmation</strong> détaillant les prochaines étapes</li>
              <li>Chaque expérience est <strong>examinée individuellement</strong> par un membre de notre équipe</li>
              <li>Nous vérifions la <strong>conformité</strong> avec nos critères de qualité</li>
            </ol>
            
            <h3 class="font-semibold text-lg mt-4">Comment les expériences sont-elles évaluées ?</h3>
            <p>Critères d'évaluation :</p>
            <ul class="list-disc pl-5 space-y-1">
              <li>Le parcours et l'expertise de l'hôte</li>
              <li>Formations et certifications</li>
              <li>Récompenses et distinctions</li>
              <li>Qualité du portfolio</li>
              <li>Originalité de la proposition</li>
              <li>Avis laissés par les voyageurs</li>
            </ul>
            
            <h3 class="font-semibold text-lg mt-4">Combien de temps dure la vérification ?</h3>
            <div class="bg-[#f4fffe] rounded-xl p-4">
              <p>En général, le processus prend <strong>24h à 48h</strong>. Cependant, cela peut prendre plus de temps dans les zones géographiques où la demande est forte. Dans ce cas, nous pourrions vous mettre en <strong>liste d'attente</strong>.</p>
            </div>
          </div>
        `
      },
      { 
        id: "experience-agrement", 
        title: "Agrément et Assurance", 
        description: "Informations sur les documents requis et les assurances.",
        content: `
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Dois-je avoir un permis d'exploitation ?</h3>
            <p>Tout dépend de votre type d'annonce et de la réglementation locale. Si un agrément ou d'autres documents sont nécessaires, nous vous en informerons après vérification de votre annonce.</p>
            
            <h3 class="font-semibold text-lg mt-4">Dois-je avoir ma propre assurance ?</h3>
            <p><strong>Oui</strong>. Bluefin exige que vous souscriviez une <strong>assurance responsabilité civile</strong> adaptée à votre activité. Il est possible que nous vous demandions de nous fournir une preuve de cette assurance.</p>
            
            <h3 class="font-semibold text-lg mt-4">Est-ce que Bluefin-Immo fournit une assurance ?</h3>
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p>Bluefin Immo <strong>ne propose pas de couverture d'assurance directe</strong>. Dans les rares cas où votre responsabilité serait engagée (préjudice corporel, dommage matériel ou vol), vous seriez personnellement exposé en l'absence d'assurance.</p>
              <p class="mt-2">Nous vous conseillons de vous couvrir en amont, et notre équipe reste à votre disposition pour vous orienter vers les solutions les plus adaptées.</p>
            </div>
          </div>
        `
      }
    ],
    quickLinks: [
      { icon: Sparkles, label: "Créer une expérience" },
      { icon: Calendar, label: "Mon calendrier" },
      { icon: MessageCircle, label: "Messages" },
      { icon: CreditCard, label: "Mes paiements" },
    ]
  });

  // Contenu pour Hôte de service
 
const getServiceContent = () => ({
  title: "Aide pour les hôtes de services",
  description: "Trouvez des réponses à vos questions sur la création et la gestion de vos services.",
  articles: [
    { 
      id: "service-adapte", 
      title: "Mon service est-il adapté sur Bluefin ?", 
      description: "Découvrez les types de services acceptés sur Bluefin Immo.",
      content: `
        <div class="space-y-4">
          <p>Les services Bluefin-Immo sont des prestations d'excellente qualité qui agrémentent le séjour des voyageurs.</p>
          <p><strong>Catégories de services acceptés :</strong></p>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-[#f4fffe] rounded-xl p-3 text-center">Traiteur</div>
            <div class="bg-[#f4fffe] rounded-xl p-3 text-center">Chef privé</div>
            <div class="bg-[#f4fffe] rounded-xl p-3 text-center"> Coiffure</div>
            <div class="bg-[#f4fffe] rounded-xl p-3 text-center"> Maquillage</div>
            <div class="bg-[#f4fffe] rounded-xl p-3 text-center"> Massage</div>
            <div class="bg-[#f4fffe] rounded-xl p-3 text-center"> Mani-pédi</div>
            <div class="bg-[#f4fffe] rounded-xl p-3 text-center"> Coaching privé</div>
            <div class="bg-[#f4fffe] rounded-xl p-3 text-center"> Photographie</div>
            <div class="bg-[#f4fffe] rounded-xl p-3 text-center"> Plats préparés</div>
            <div class="bg-[#f4fffe] rounded-xl p-3 text-center"> Soins bien-être</div>
          </div>
        </div>
      `
    },
    { 
      id: "service-deposer-demande", 
      title: "Que dois-je faire pour déposer ma demande ?", 
      description: "Guide pour soumettre votre service.",
      content: `
        <div class="space-y-4">
          <p>Suivez ces étapes simples :</p>
          <div class="space-y-3">
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">1</div>
              <div><strong>Présentez-vous</strong> et décrivez votre service en détail.</div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">2</div>
              <div><strong>Enrichissez votre annonce</strong> avec des photos de qualité et des informations précises.</div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">3</div>
              <div><strong>Définissez vos tarifs</strong> de manière attractive.</div>
            </div>
            <div class="flex gap-3">
              <div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">4</div>
              <div><strong>Soumettez votre annonce</strong> à notre équipe pour validation.</div>
            </div>
          </div>
          <div class=" rounded-xl p-4 text-center">
        <button 
          onclick="window.location.href='/become-host'" 
          class="bg-[#00c9a7] text-white px-6 py-2 rounded-full font-medium hover:bg-[#00b892] transition cursor-pointer"
        >
          Commencer mon inscription
        </button>
      </div>
        </div>
      `
    },
    { 
      id: "service-frais", 
      title: "Quels sont les frais Bluefin ?", 
      description: "Frais de service pour les services.",
      content: `
        <div class="space-y-4">
          <p>La création et l'envoi de l'annonce sont <strong>gratuits</strong>.</p>
          <div class="bg-[#f4fffe] rounded-xl p-4">
            <p class="font-semibold text-[#0F2940]">Frais de service :</p>
            <p class="text-2xl font-bold text-[#00c9a7] mt-2">15%</p>
            <p>Pour chaque service réservé, Bluefin-Immo déduit automatiquement 15% des frais de service du versement.</p>
          </div>
        </div>
      `
    },
    { 
  id: "service-visibilite", 
  title: "Comment les voyageurs découvriront-ils mon service ?", 
  description: "Visibilité et promotion de votre service.",
  content: `
    <div class="space-y-4">
      <p>Votre service bénéficie d'une visibilité optimale sur Bluefin Immo grâce à :</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Un <strong>onglet dédié</strong> aux services sur la plateforme</li>
        <li>Les <strong>résultats de recherche</strong> des voyageurs</li>
        <li>Les <strong>recommandations personnalisées</strong></li>
        <li>Les <strong>communications par e-mail et notifications</strong></li>
        <li>Les <strong>suggestions directes</strong> dans le récapitulatif de séjour</li>
      </ul>
    </div>
  `
},
    { 
      id: "service-versement", 
      title: "Dans quel délai vais-je recevoir mon versement ?", 
      description: "Délais de paiement.",
      content: `
        <div class="space-y-4">
          <p>Le délai varie selon le mode de versement choisi et les délais de traitement bancaire.</p>
          <div class="bg-[#f4fffe] rounded-xl p-4">
            <p><strong>⏱Délai standard :</strong> Paiement reçu dès le <strong>lendemain de la réalisation du service</strong>.</p>
          </div>
        </div>
      `
    },
    { 
      id: "service-verification", 
      title: "Processus de vérification", 
      description: "Comment se déroule la vérification de votre service.",
      content: `
        <div class="space-y-4">
          <h3 class="font-semibold text-lg">En quoi consiste le processus de vérification ?</h3>
          <p>Après envoi de votre annonce :</p>
          <ol class="list-decimal pl-5 space-y-2">
            <li>Vous recevez un <strong>e-mail de confirmation</strong> détaillant les prochaines étapes</li>
            <li>Chaque service est <strong>examiné individuellement</strong> par un membre de notre équipe</li>
            <li>Nous vérifions la <strong>conformité</strong> avec nos critères de qualité</li>
          </ol>
          
          <h3 class="font-semibold text-lg mt-4">Comment les services sont-ils évalués ?</h3>
          <p>Critères d'évaluation :</p>
          <ul class="list-disc pl-5 space-y-1">
            <li>Le parcours et l'expertise de l'hôte</li>
            <li>Formations et certifications</li>
            <li>Récompenses et distinctions</li>
            <li>Qualité du portfolio</li>
            <li>Originalité de la proposition</li>
            <li>Avis laissés par les voyageurs</li>
          </ul>
          
          <h3 class="font-semibold text-lg mt-4">Combien de temps dure la vérification ?</h3>
          <div class="bg-[#f4fffe] rounded-xl p-4">
            <p>En général, le processus prend <strong>24h à 48h</strong>. Cependant, cela peut prendre plus de temps dans les zones géographiques où la demande est forte. Dans ce cas, nous pourrions vous mettre en <strong>liste d'attente</strong>.</p>
          </div>
        </div>
      `
    },
    { 
  id: "service-agrement", 
  title: "Agrément et Assurance", 
  description: "Informations sur les documents requis et les assurances.",
  content: `
    <div class="space-y-4">
      <h3 class="font-semibold text-lg">Dois-je avoir un permis d'exploitation ?</h3>
      <p>Tout dépend de votre type d'annonce et de la réglementation locale. Si un agrément ou d'autres documents sont nécessaires, nous vous en informerons après vérification de votre annonce.</p>
      
      <h3 class="font-semibold text-lg mt-4">Dois-je avoir ma propre assurance ?</h3>
      <p><strong>Oui</strong>. Bluefin exige que vous souscriviez une <strong>assurance responsabilité civile</strong> adaptée à votre activité. Il est possible que nous vous demandions de nous fournir une preuve de cette assurance.</p>
      
      <h3 class="font-semibold text-lg mt-4">Est-ce que Bluefin-Immo fournit une assurance ?</h3>
      <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p>Bluefin Immo <strong>ne propose pas de couverture d'assurance directe</strong>. Dans les rares cas où votre responsabilité serait engagée (préjudice corporel, dommage matériel ou vol), vous seriez personnellement exposé en l'absence d'assurance.</p>
        <p class="mt-2">Nous vous conseillons de vous couvrir en amont, et notre équipe reste à votre disposition pour vous orienter vers les solutions les plus adaptées.</p>
      </div>
    </div>
  `
},
  ],
  quickLinks: [
    { icon: Briefcase, label: "Créer un service" },
    { icon: Calendar, label: "Mon calendrier" },
    { icon: MessageCircle, label: "Messages" },
    { icon: CreditCard, label: "Mes paiements" },
  ]
});

 // Contenu original pour les voyageurs
const getTravelerContent = () => ({
  title: "Aide pour les voyageurs",
  description: "Trouvez des réponses à vos questions sur les réservations, les annulations, les paiements et plus encore.",
  articles: [
    { 
      id: "paiement", 
      title: "Paiement", 
      description: "Comment payer votre réservation en toute sécurité.",
      content: `
        <div class="space-y-6">
          <div>
            <h3 class="font-semibold text-lg mb-3">Comment puis-je payer ma réservation ?</h3>
            <p>Les paiements sont traités via des prestataires de paiement sécurisés tiers. Bluefin Immo accepte les principaux moyens de paiement disponibles :</p>
            <div class="grid grid-cols-2 gap-3 mt-3">
              <div class="bg-[#f4fffe] rounded-xl p-3 text-center border border-[#e2f5f2]"> Mobile Money (Wave, Orange Money, MTN)</div>
              <div class="bg-[#f4fffe] rounded-xl p-3 text-center border border-[#e2f5f2]"> Carte bancaire (Visa, Mastercard)</div>
              <div class="bg-[#f4fffe] rounded-xl p-3 text-center border border-[#e2f5f2]"> Virement bancaire</div>
            </div>
            <p class="mt-3 text-sm text-gray-600">Une fois votre paiement confirmé, vous recevez automatiquement un e-mail de confirmation.</p>
          </div>

          <div>
            <h3 class="font-semibold text-lg mb-3">Est-ce que mes paiements sont sécurisés ?</h3>
            <div class="bg-green-50 border border-green-200 rounded-xl p-4">
              <p class="text-green-800">Oui. Tous les paiements effectués sur Bluefin Immo transitent par des prestataires de paiement sécurisés certifiés. Vos coordonnées bancaires ne sont jamais stockées directement sur la plateforme.</p>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-lg mb-3">Puis-je obtenir un remboursement ?</h3>
            <p>Toute demande de remboursement est traitée au cas par cas, dans le respect de notre politique d'annulation. Les conditions varient selon le délai entre votre demande et la date de check-in. Consultez notre politique d'annulation pour connaître les conditions applicables à votre réservation.</p>
          </div>
        </div>
      `
    },
    { 
      id: "annulation", 
      title: " Annulation", 
      description: "Comment annuler votre réservation et connaître les conditions de remboursement.",
      content: `
        <div class="space-y-6">
          <div>
            <h3 class="font-semibold text-lg mb-3">Comment annuler ma réservation ?</h3>
            <p>Toute annulation doit être effectuée directement depuis votre compte sur la plateforme, dans la rubrique <strong>"Mes réservations"</strong>.</p>
            <div class="bg-blue-50 rounded-xl p-3 mt-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              <p class="text-sm text-blue-700">Connectez-vous à votre espace personnel, accédez à vos réservations et cliquez sur "Annuler".</p>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-lg mb-3">Quel remboursement puis-je espérer si j'annule ?</h3>
            <p>Les conditions dépendent du délai entre l'annulation et la date de check-in :</p>
            <div class="space-y-3 mt-3">
              <div class="bg-green-50 rounded-xl p-3 border-l-4 border-green-500">
                <p class="font-semibold text-green-800">✓ Annulation dans les 24 heures suivant la réservation</p>
                <p class="text-sm text-green-700">→ remboursement intégral</p>
              </div>
              <div class="bg-yellow-50 rounded-xl p-3 border-l-4 border-yellow-500">
                <p class="font-semibold text-yellow-800"> Annulation 7 jours avant le check-in</p>
                <p class="text-sm text-yellow-700">→ remboursement de 50% des nuits. Les frais de service ne sont pas remboursés.</p>
              </div>
              <div class="bg-red-50 rounded-xl p-3 border-l-4 border-red-500">
                <p class="font-semibold text-red-800"> Annulation moins de 7 jours avant le check-in</p>
                <p class="text-sm text-red-700">→ aucun remboursement, sans exception.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-lg mb-3">Les frais de service sont-ils remboursables ?</h3>
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p class="text-amber-800"><strong>Non.</strong> Quelle que soit la situation, les frais de service Bluefin Immo ne sont pas remboursés en cas d'annulation.</p>
            </div>
          </div>
        </div>
      `
    },
    { 
      id: "logement-qualite", 
      title: " Logement et qualité", 
      description: "Que faire si le logement ne correspond pas à l'annonce ?",
      content: `
        <div class="space-y-6">
          <div>
            <h3 class="font-semibold text-lg mb-3">Que faire si mon logement ne correspond pas à l'annonce ?</h3>
            <p>Si vous constatez une non-conformité à votre arrivée, vous disposez d'un délai de <strong>48 heures après le check-in</strong> pour soumettre une réclamation via votre espace personnel sur la plateforme. Passé ce délai, aucune réclamation ne pourra être prise en compte.</p>
            <div class="bg-blue-50 rounded-xl p-3 mt-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
              <p class="text-sm text-blue-700">Nous vous recommandons de documenter le problème avec des <strong>photos dès votre arrivée</strong>.</p>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-lg mb-3">Bluefin Immo garantit-il la qualité des logements ?</h3>
            <p>Bluefin Immo vérifie chaque annonce avant sa publication. Cependant, cette validation constitue une vérification formelle et ne saurait être interprétée comme une garantie de qualité absolue.</p>
            <p class="mt-2">Chaque propriétaire est personnellement responsable de la conformité de son bien avec les informations publiées. En cas de manquement avéré, l'annonce est automatiquement supprimée et le propriétaire peut être définitivement banni de la plateforme.</p>
          </div>

          <div>
            <h3 class="font-semibold text-lg mb-3">Comment signaler un problème avec mon logement ?</h3>
            <div class="bg-gray-50 rounded-xl p-4">
              <p>Connectez-vous à votre espace personnel, accédez à votre réservation et utilisez le formulaire de réclamation. Notre équipe s'engage à traiter votre demande avec sérieux et à trouver une résolution amiable dans les meilleurs délais.</p>
            </div>
          </div>
        </div>
      `
    },
    { 
      id: "litiges", 
      title: " Litiges", 
      description: "Que faire en cas de litige avec un propriétaire ?",
      content: `
        <div class="space-y-6">
          <div>
            <h3 class="font-semibold text-lg mb-3">Que faire en cas de litige avec un propriétaire ?</h3>
            <p>En cas de différend, Bluefin Immo propose un service de médiation accessible depuis votre espace personnel.</p>
            <div class="bg-gray-50 rounded-xl p-4 mt-3">
              <p class="font-medium mb-2">Pour soumettre votre demande :</p>
              <ul class="list-disc pl-5 space-y-1 text-sm">
                <li>Délai : dans les <strong>48 heures suivant le check-in</strong></li>
                <li>Précisez la nature du problème</li>
                <li>Joignez des preuves (photos, messages)</li>
                <li>Indiquez le montant du préjudice estimé</li>
              </ul>
            </div>
            <p class="mt-3">Notre équipe traitera votre demande dans un délai de <strong>5 jours ouvrés</strong>.</p>
          </div>

          <div>
            <h3 class="font-semibold text-lg mb-3">Quelle est l'issue possible d'une médiation ?</h3>
            <p>Selon les circonstances, Bluefin Immo peut :</p>
            <ul class="list-disc pl-5 space-y-2 mt-2">
              <li>Procéder à un <strong>remboursement partiel ou total</strong></li>
              <li>Maintenir le versement à l'hôte si sa bonne foi est établie</li>
              <li>Suspendre voire bannir un utilisateur en cas de manquement avéré</li>
            </ul>
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-3">
              <p class="text-sm text-amber-800"> La décision rendue est définitive. Vous restez libre de saisir les juridictions compétentes si vous le souhaitez.</p>
            </div>
          </div>
        </div>
      `
    },
    { 
      id: "comment-reserver", 
      title: " Comment réserver un logement ?", 
      description: "Guide pas à pas pour réserver votre séjour.",
      content: `
        <div class="space-y-4">
          <p>Réserver un logement sur Bluefin Immo est simple et rapide :</p>
          <div class="space-y-3">
            <div class="flex gap-3"><div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">1</div><div><strong>Recherchez</strong> votre destination et vos dates</div></div>
            <div class="flex gap-3"><div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">2</div><div><strong>Choisissez</strong> le logement qui vous plaît</div></div>
            <div class="flex gap-3"><div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">3</div><div><strong>Remplissez</strong> vos informations personnelles</div></div>
            <div class="flex gap-3"><div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">4</div><div><strong>Procédez au paiement</strong> sécurisé</div></div>
            <div class="flex gap-3"><div class="w-6 h-6 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-xs font-bold">5</div><div><strong>Confirmez</strong> et recevez votre confirmation par email</div></div>
          </div>
        </div>
      `
    }
  ],
  quickLinks: [
    { icon: CreditCard, label: "Paiements et remboursements", link: "#paiement" },
    { icon: Calendar, label: "Gérer mes réservations", link: "#annulation" },
    { icon: MessageCircle, label: "Contacter l'hôte", link: "#" },
    { icon: AlertCircle, label: "Signaler un problème", link: "#logement-qualite" },
  ]
});

 // Contenu pour Hôte de logement
const getHostContent = () => ({
  title: "Aide pour les hôtes de logement",
  description: "Trouvez des réponses à vos questions sur la gestion de vos annonces, les réservations et plus encore.",
  articles: [
    { 
      id: "devenir-hote", 
      title: " Devenir hôte sur Bluefin-Immo", 
      description: "Comment lancer votre activité d'hôte en quelques étapes.",
      content: `
        <div class="space-y-6">
          <p>Lancer votre activité d'hôte sur Bluefin Immo est simple et accessible à tous. Voici comment procéder :</p>
          
          <div class="space-y-4">
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <h3 class="font-semibold text-[#0F2940]">Décrivez votre logement</h3>
                <p class="text-sm text-gray-600">Présentez-vous et parlez-nous de votre bien : type de logement, superficie, équipements disponibles, localisation et tout ce qui le rend unique et attractif pour les voyageurs.</p>
              </div>
            </div>
            
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <h3 class="font-semibold text-[#0F2940]">Ajoutez vos photos</h3>
                <p class="text-sm text-gray-600">Des visuels de qualité font toute la différence. Prenez le temps de photographier chaque pièce sous son meilleur jour pour donner envie aux voyageurs de réserver.</p>
              </div>
            </div>
            
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <h3 class="font-semibold text-[#0F2940]">Fixez vos tarifs</h3>
                <p class="text-sm text-gray-600">Définissez vos prix à votre rythme, en fonction de vos disponibilités et de vos objectifs. Vous restez libre d'ajuster vos tarifs à tout moment.</p>
              </div>
            </div>
            
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <h3 class="font-semibold text-[#0F2940]">Soumettez votre annonce</h3>
                <p class="text-sm text-gray-600">Une fois votre annonce complète, envoyez-la à notre équipe pour vérification. Nous pourrions vous contacter pour vous suggérer quelques ajustements ou vous demander certains documents, comme un agrément ou une preuve d'assurance.</p>
              </div>
            </div>
            
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <h3 class="font-semibold text-[#0F2940]">Publiez et accueillez</h3>
                <p class="text-sm text-gray-600">Dès que votre annonce est validée, publiez-la en un clic et commencez à recevoir vos premières demandes de réservation. Bienvenue dans la communauté des hôtes Bluefin Immo.</p>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-[#00c9a7]/10 to-[#0F2940]/10 rounded-xl p-4 mt-4">
            <p class="text-sm text-[#0F2940]"> <strong>Prêt à commencer ?</strong> Créez votre annonce dès maintenant et rejoignez notre communauté d'hôtes.</p>
          </div>
        </div>
      `
    },
    { 
      id: "preparer-logement", 
      title: " Comment préparer mon logement pour accueillir des voyageurs ?", 
      description: "Conseils pour offrir un séjour confortable et agréable.",
      content: `
        <div class="space-y-4">
          <p>Avant l'arrivée de vos voyageurs, veillez à ce que votre logement soit :</p>
          <ul class="list-disc pl-5 space-y-2 text-gray-600">
            <li>Propre, bien rangé et en parfait état de fonctionnement</li>
            <li>Prévoyez du <strong>linge de lit frais</strong> en quantité suffisante</li>
            <li>Des <strong>articles de toilette</strong> (savon, shampoing, papier toilette)</li>
            <li>Les équipements de base (cafetière, bouilloire, ustensiles de cuisine)</li>
            <li>Une connexion Wi-Fi fonctionnelle</li>
          </ul>
          <div class="bg-blue-50 rounded-xl p-4">
            <p class="text-sm text-blue-700"> <strong>Conseil :</strong> Pensez à laisser un petit mot de bienvenue ou des recommandations locales pour rendre le séjour de vos voyageurs encore plus agréable.</p>
          </div>
        </div>
      `
    },
    { 
      id: "frais-service", 
      title: " Quels sont les frais appliqués par Bluefin Immo ?", 
      description: "Détail des frais de service pour hôtes et voyageurs.",
      content: `
        <div class="space-y-6">
          <p>La création d'annonce est entièrement <strong>gratuite</strong>. Bluefin Immo applique des frais de service sur chaque réservation confirmée, répartis entre l'hôte et le voyageur.</p>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-[#f4fffe] rounded-xl p-4 border border-[#e2f5f2]">
              <h3 class="font-semibold text-[#0F2940] flex items-center gap-2"> Pour l'hôte</h3>
              <p class="text-2xl font-bold text-[#00c9a7] mt-2">6%</p>
              <p class="text-sm text-gray-600">Des frais de 6% sont déduits de votre sous-total pour calculer votre versement.</p>
              <p class="text-sm text-gray-500 mt-2">Exemple : nuit à 50 000 FCFA → vous percevez <strong>47 000 FCFA</strong></p>
            </div>
            
            <div class="bg-[#f4fffe] rounded-xl p-4 border border-[#e2f5f2]">
              <h3 class="font-semibold text-[#0F2940] flex items-center gap-2">✈️ Pour le voyageur</h3>
              <p class="text-2xl font-bold text-[#00c9a7] mt-2">10%</p>
              <p class="text-sm text-gray-600">Des frais de 10% sont ajoutés au prix affiché lors de la réservation.</p>
              <p class="text-sm text-gray-500 mt-2">Exemple : nuit à 50 000 FCFA → voyageur paie <strong>55 000 FCFA</strong></p>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold text-lg mb-3">À quoi servent ces frais ?</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="flex items-center gap-2 text-sm text-gray-600"><Shield className="w-4 h-4 text-[#00c9a7]" /> Paiements sécurisés</div>
              <div class="flex items-center gap-2 text-sm text-gray-600"><TrendingUp className="w-4 h-4 text-[#00c9a7]" /> Promotion des annonces</div>
              <div class="flex items-center gap-2 text-sm text-gray-600"><MessageCircle className="w-4 h-4 text-[#00c9a7]" /> Assistance hôtes et voyageurs</div>
              <div class="flex items-center gap-2 text-sm text-gray-600"><Settings className="w-4 h-4 text-[#00c9a7]" /> Maintenance et développement</div>
            </div>
          </div>
        </div>
      `
    },
    { 
      id: "gestion-calendrier", 
      title: "Comment gérer mon calendrier ?", 
      description: "Calendrier, disponibilités, blocages et réservations.",
      content: `
        <div class="space-y-6">
          <p>Votre calendrier est votre outil de disponibilité en temps réel. Mettez-le à jour régulièrement pour éviter les réservations indésirables ou les conflits de dates.</p>
          
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-xl p-4">
              <h3 class="font-semibold text-[#0F2940] flex items-center gap-2"><Calendar className="w-5 h-5 text-[#00c9a7]" /> Puis-je bloquer des dates ?</h3>
              <p class="text-sm text-gray-600 mt-1">Oui, à tout moment et sans justification. Rendez-vous dans votre espace hôte, sélectionnez les dates concernées et marquez-les comme indisponibles.</p>
            </div>
            
            <div class="bg-gray-50 rounded-xl p-4">
              <h3 class="font-semibold text-[#0F2940] flex items-center gap-2"><Clock className="w-5 h-5 text-[#00c9a7]" /> Puis-je définir une durée minimale de séjour ?</h3>
              <p class="text-sm text-gray-600 mt-1">Oui. Vous pouvez fixer une durée minimale (exemple : 2 nuits minimum) pour optimiser votre taux d'occupation.</p>
            </div>
            
            <div class="bg-gray-50 rounded-xl p-4">
              <h3 class="font-semibold text-[#0F2940] flex items-center gap-2"><Bell className="w-5 h-5 text-[#00c9a7]" /> Comment éviter les réservations de dernière minute ?</h3>
              <p class="text-sm text-gray-600 mt-1">Dans vos paramètres de calendrier, vous pouvez définir un délai de préavis minimum (ex: interdire les réservations moins de 24h avant l'arrivée).</p>
            </div>
          </div>
        </div>
      `
    },
    { 
      id: "paiements-hote", 
      title: "Comment sont traités les paiements ?", 
      description: "Paiements, modes de paiement et versements.",
      content: `
        <div class="space-y-6">
          <div class="bg-[#f4fffe] rounded-xl p-4">
            <h3 class="font-semibold text-[#0F2940]">Comment sont traités les paiements ?</h3>
            <p class="text-sm text-gray-600 mt-1">Bluefin Immo centralise tous les paiements pour sécuriser les transactions. Le voyageur règle intégralement sa réservation au moment de la confirmation.</p>
          </div>
          
          <div>
            <h3 class="font-semibold text-[#0F2940] mb-3">Quels modes de paiement sont acceptés ?</h3>
            <div class="flex flex-wrap gap-3">
              <div class="bg-gray-100 rounded-lg px-4 py-2 text-sm">📱 Mobile Money (Wave, Orange Money, MTN)</div>
              <div class="bg-gray-100 rounded-lg px-4 py-2 text-sm">💳 Carte bancaire (Visa, Mastercard)</div>
            </div>
          </div>
          
          <div class="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
            <h3 class="font-semibold text-green-800">Quand vais-je recevoir mon versement ?</h3>
            <p class="text-sm text-green-700 mt-1">Pour la plupart des séjours, votre versement est effectué dans un délai de <strong>72 heures</strong> suivant la date d'arrivée confirmée du voyageur, sous réserve qu'aucun litige ne soit en cours.</p>
          </div>
          
          <div class="bg-amber-50 rounded-xl p-4">
            <h3 class="font-semibold text-amber-800">Comment mettre à jour mes coordonnées de paiement ?</h3>
            <p class="text-sm text-amber-700 mt-1">Rendez-vous dans votre profil, section Paiements et versements, et renseignez ou modifiez vos coordonnées bancaires ou mobile money.</p>
          </div>
        </div>
      `
    },
    { 
      id: "reservations-hote", 
      title: "Comment fonctionne le système de réservation ?", 
      description: "Demandes, réservations instantanées et annulations.",
      content: `
        <div class="space-y-6">
          <div class="bg-gray-50 rounded-xl p-4">
            <h3 class="font-semibold text-[#0F2940]">Comment fonctionne le système de réservation ?</h3>
            <p class="text-sm text-gray-600 mt-1">Lorsqu'un voyageur soumet une demande, vous recevez une notification par e-mail et sur l'application. Vous disposez d'un délai de <strong>24 heures</strong> pour accepter ou décliner la demande.</p>
          </div>
          
          <div class="bg-[#f4fffe] rounded-xl p-4">
            <h3 class="font-semibold text-[#0F2940] flex items-center gap-2"><Zap className="w-5 h-5 text-[#00c9a7]" /> Puis-je activer la réservation instantanée ?</h3>
            <p class="text-sm text-gray-600 mt-1">Oui. La réservation instantanée permet aux voyageurs de réserver directement sans attendre votre validation. C'est un excellent moyen d'augmenter votre taux de réservation.</p>
          </div>
          
          <div class="bg-yellow-50 rounded-xl p-4">
            <h3 class="font-semibold text-yellow-800">Puis-je refuser une réservation ?</h3>
            <p class="text-sm text-yellow-700 mt-1">Oui, vous êtes libre d'accepter ou de refuser toute demande. Cependant, un taux de refus élevé peut affecter la visibilité de votre annonce.</p>
          </div>
          
          <div class="bg-red-50 rounded-xl p-4">
            <h3 class="font-semibold text-red-800">Comment annuler une réservation confirmée ?</h3>
            <p class="text-sm text-red-700 mt-1">En cas de force majeure, rendez-vous dans votre espace hôte, sélectionnez la réservation concernée et suivez la procédure d'annulation. Des pénalités peuvent s'appliquer.</p>
          </div>
          
          <div class="bg-blue-50 rounded-xl p-4">
            <h3 class="font-semibold text-blue-800">Comment communiquer avec mon voyageur ?</h3>
            <p class="text-sm text-blue-700 mt-1">Bluefin Immo met à votre disposition une messagerie intégrée sécurisée. Privilégiez ce canal pour toutes vos communications.</p>
          </div>
          
          <div class="bg-[#0f2940] text-white rounded-xl p-4">
            <h3 class="font-semibold flex items-center gap-2">Que faire en cas de problème avec un voyageur ?</h3>
            <p class="text-sm text-white/80 mt-1">Contactez immédiatement notre service d'assistance via la messagerie ou par e-mail. Notre équipe est disponible pour vous accompagner.</p>
          </div>
        </div>
      `
    }
  ],
  quickLinks: [
    { icon: Home, label: "Gérer mon annonce", link: "#" },
    { icon: Calendar, label: "Mon calendrier", link: "#" },
    { icon: MessageCircle, label: "Messages", link: "#" },
    { icon: CreditCard, label: "Paiements reçus", link: "#" },
  ]
});



  const getRoleContent = () => {
    switch (selectedRole) {
      case "voyageur":
        return getTravelerContent();
      case "hote_logement":
        return getHostContent();
      case "hote_experience":
        return getExperienceContent();
      case "hote_service":
        return getServiceContent();
      case "administrateur":
        return getAdminContent();
      default:
        return getTravelerContent();
    }
  };

  const content = getRoleContent();
  
  const suggestions = [
    "Comment réserver un logement ?",
    "Annuler une réservation",
    "Modes de paiement acceptés",
    "Problème avec mon hôte",
    "Devenir hôte",
    "Créer une expérience",
    "Créer un service",
    "Assurance hôte",
  ];

  const handleNavigate = (route: any) => {
    if (onNavigate) onNavigate(route);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-4">
        <button onClick={() => handleNavigate({ name: 'home' })} className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 rotate-180" /> Retour
        </button>
        <h1 className="text-2xl text-[#0F2940]">Centre d'aide</h1>
      </div>

      <section className="bg-gradient-to-r from-[#0F2940] to-[#1a3f5c] py-12 text-white">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bonjour, comment pouvons-nous vous aider ?</h2>
          <p className="text-white/80 mb-8">Rechercher des guides pratiques et plus</p>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Recherche"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-12 pr-4 py-3 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
            />
            {showSuggestions && searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                {suggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase())).map((suggestion, idx) => (
                  <button key={idx} onClick={() => { setSearchQuery(suggestion); setShowSuggestions(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700">
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-12">
        {/* Version Desktop - tous les rôles visibles */}
        <div className="hidden md:flex flex-wrap justify-center gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id as any)}
                className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                  selectedRole === role.id ? "bg-[#00c9a7] text-[#0F2940] shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{role.label}</span>
              </button>
            );
          })}
        </div>

        {/* Version Mobile */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex-1 overflow-x-auto scrollbar-hide flex gap-2 pb-2">
              {visibleRoles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id as any)}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all whitespace-nowrap ${
                      selectedRole === role.id ? "bg-[#00c9a7] text-[#0F2940] shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{role.label}</span>
                  </button>
                );
              })}
            </div>

            {hiddenRoles.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowRolesMenu(!showRolesMenu)}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all whitespace-nowrap ${
                    hiddenRoles.some(r => r.id === selectedRole) 
                      ? "bg-[#00c9a7] text-[#0F2940] shadow-md" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Menu className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    {hiddenRoles.some(r => r.id === selectedRole) 
                      ? hiddenRoles.find(r => r.id === selectedRole)?.label 
                      : "Plus"}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showRolesMenu ? "rotate-180" : ""}`} />
                </button>

                {showRolesMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowRolesMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                      {hiddenRoles.map((role) => {
                        const Icon = role.icon;
                        return (
                          <button
                            key={role.id}
                            onClick={() => {
                              setSelectedRole(role.id as any);
                              setShowRolesMenu(false);
                            }}
                            className={`w-full px-4 py-3 flex items-center gap-3 transition-all text-left ${
                              selectedRole === role.id 
                                ? "bg-[#00c9a7]/10 text-[#0F2940]" 
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{role.label}</span>
                            {selectedRole === role.id && <Check className="w-4 h-4 ml-auto text-[#00c9a7]" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Indicateur de scroll pour mobile */}
        <div className="md:hidden flex justify-center mt-3">
          <div className="flex gap-1">
            <div className="w-6 h-1 rounded-full bg-[#00c9a7]/40"></div>
            <div className="w-3 h-1 rounded-full bg-[#00c9a7]"></div>
            <div className="w-2 h-1 rounded-full bg-[#00c9a7]/40"></div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-[#0F2940] mb-2">{content.title}</h2>
            <p className="text-gray-600 mb-6">{content.description}</p>
            <div className="grid md:grid-cols-2 gap-6">
              {content.articles.map((article, idx) => (
                <div 
                  key={idx} 
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer hover:border-[#00c9a7] group" 
                  onClick={() => {
                    if (article.content) {
                      setSelectedArticle({ 
                        id: article.id, 
                        title: article.title, 
                        category: selectedRole === "voyageur" ? "Voyageur" : 
                                  selectedRole === "hote_experience" ? "Hôte d'expérience" :
                                  selectedRole === "hote_service" ? "Hôte de services" :
                                  selectedRole === "hote_logement" ? "Hôte de logement" : "Administrateur", 
                        content: article.content 
                      });
                    } else {
                      setSelectedArticle({ id: article.id, title: article.title, category: "Voyageur", content: "" });
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00c9a7]/10 flex items-center justify-center group-hover:bg-[#00c9a7]/20 transition">
                      <FileText className="w-5 h-5 text-[#00c9a7]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F2940] mb-1 text-lg">{article.title}</h3>
                      <p className="text-sm text-gray-600">{article.description}</p>
                      <div className="mt-3 text-[#00c9a7] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Lire l'article <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#00c9a7] to-[#00b396] rounded-2xl p-6 text-white text-center">
              <h3 className="text-xl font-semibold mb-2">Nous sommes là pour vous aider</h3>
              <p className="text-white/90 text-sm mb-4">Connectez-vous pour obtenir de l'aide pour vos réservations, votre compte et plus encore.</p>
              <button onClick={() => handleNavigate({ name: 'auth' })} className="bg-white text-[#00c9a7] px-6 py-2 rounded-full font-medium hover:bg-white/90 transition">
                Me connecter ou m'inscrire
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-[#0F2940] mb-4">Liens rapides</h3>
              {content.quickLinks.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <button key={idx} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-[#00c9a7]/10 flex items-center justify-center group-hover:bg-[#00c9a7]/20 transition">
                      <Icon className="w-5 h-5 text-[#00c9a7]" />
                    </div>
                    <span className="text-gray-700 group-hover:text-[#0F2940]">{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </button>
                );
              })}
            </div>
            
            <div className="border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-[#0F2940] mb-3">Les politiques de la communauté</h3>
              <p className="text-sm text-gray-600 mb-3">Nos actions pour établir un climat de confiance.</p>
              <button className="text-[#00c9a7] text-sm font-medium">En savoir plus</button>
            </div>
            
            <div className="border border-gray-200 rounded-2xl p-6">
              <h3 className="font-semibold text-[#0F2940] mb-3">Conseils et consignes de sécurité</h3>
              <p className="text-sm text-gray-600 mb-3">Conseils de sécurité pour les voyageurs.</p>
              <button className="text-[#00c9a7] text-sm font-medium">En savoir plus</button>
            </div>

            <div className="rounded-[2rem] bg-[#f4fffe] border border-[#e2f5f2] p-6">
              <h3 className="text-xl font-semibold text-[#0F2940] mb-3">Contact support</h3>
              <p className="text-sm text-[#6b7280] mb-4">Chat WhatsApp disponible 8h-20h GMT+1. Email support@bluefin-immo.com</p>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-full bg-[#00c9a7] text-white px-6 py-3 hover:bg-[#00b892] transition">
                  WhatsApp
                </button>
                <button className="rounded-full border border-[#e2f5f2] px-6 py-3 text-[#0f2940] hover:bg-gray-50 transition">
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal pour les articles avec contenu */}
      {selectedArticle && selectedArticle.content && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-4">
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <span className="text-sm text-[#00c9a7] font-medium">Guide pratique • {selectedArticle.category}</span>
                  <h2 className="text-2xl font-semibold text-[#0F2940]">{selectedArticle.title}</h2>
                </div>
                <button onClick={() => setSelectedArticle(null)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
            </div>
          </div>
        </div>
      )}
      
      {/* Modal pour les articles de voyageur */}
      {selectedArticle && !selectedArticle.content && selectedArticle.id !== "annuler-reservation" && articlesData[selectedArticle.id] && (
        <div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-4">
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <span className="text-sm text-[#00c9a7] font-medium">Guide pratique • {selectedArticle.category}</span>
                  <h2 className="text-2xl font-semibold text-[#0F2940]">{selectedArticle.title}</h2>
                </div>
                <button onClick={() => setSelectedArticle(null)} className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6" dangerouslySetInnerHTML={{ __html: articlesData[selectedArticle.id as keyof typeof articlesData]?.content || "" }} />
            </div>
          </div>
        </div>
      )}

      {/* Modal spécial pour annuler-reservation */}
      {selectedArticle && selectedArticle.id === "annuler-reservation" && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
}

// ========== PAGE ABOUT ==========




interface PageProps {
  onNavigate?: (page: { name: string }) => void;
}

export function AboutPage({ onNavigate }: PageProps) {
  return (
    <Layout onNavigate={onNavigate} currentPage="about">
      <div className="max-w-[720px] mx-auto px-5 py-8 md:px-6 md:py-10 lg:py-12">
        {/* HERO */}
        <div className="bg-[#0F2940] rounded-2xl p-8 md:p-12 text-center mb-6 relative overflow-hidden">
          <span className="inline-block text-[11px] font-semibold tracking-[0.16em] uppercase text-[#00C9A7] mb-5 animate-pulse">
            À propos de Bluefin Immo
          </span>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
            Confort, Praticité<br />et <em className="text-[#00C9A7] not-italic">Sérénité</em> —<br />à chaque séjour.
          </h1>
          <p className="text-base text-white/50 max-w-md mx-auto">
            Des logements meublés modernes, soigneusement sélectionnés, pour que vous vous sentiez chez vous dès le premier instant.
          </p>
        </div>

        {/* ACCROCHE */}
        <div className="py-6 mb-2">
          <p className="font-serif text-xl md:text-2xl lg:text-[26px] text-[#1a2733] leading-tight">
            Notre mission : rendre la location immobilière <em className="text-[#00C9A7] not-italic">simple, agréable et sans compromis.</em>
          </p>
        </div>

        {/* CORPS */}
        <div className="mb-6 space-y-3">
          <p className="text-[#5a6a78] leading-relaxed">
            Chez Bluefin Immo, nous mettons à votre disposition des appartements meublés modernes, entièrement équipés et pensés dans les moindres détails pour vous offrir un cadre de vie chaleureux, fonctionnel et agréable.
          </p>
          <p className="text-[#5a6a78] leading-relaxed">
            Nous accordons une attention particulière à la qualité de chaque bien, à la fluidité de votre expérience locative et à la réactivité de notre équipe — pour que vous puissiez vous concentrer sur l'essentiel : profiter pleinement de votre séjour.
          </p>
        </div>

        {/* PROFILS */}
        <div className="flex flex-wrap gap-2 my-5">
          {[
            { icon: "M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2", label: "Déplacement professionnel", rect: true },
            { icon: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5", label: "Étudiant" },
            { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", label: "Expatrié" },
            { icon: "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5zM9 21V12h6v9", label: "Logement prêt à vivre" }
          ].map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2 bg-[rgba(0,201,167,0.09)] border border-[rgba(0,201,167,0.22)] rounded-full py-2 px-4 text-sm font-medium text-[#1a2733] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00C9A7] hover:shadow-[0_4px_12px_rgba(0,201,167,0.15)]">
              <svg className="w-3.5 h-3.5 text-[#00C9A7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {item.rect ? <><rect x="2" y="7" width="20" height="14" rx="2"/><path d={item.icon}/></> : <path d={item.icon}/>}
              </svg>
              {item.label}
            </span>
          ))}
        </div>

        {/* ENGAGEMENTS */}
        <div>
          <div className="text-[11px] font-semibold tracking-[0.13em] uppercase text-[#00C9A7] mb-4">
            Nos engagements
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: "M20 9V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-2M9 12h12M15 8l4 4-4 4", title: "Logements confortables et prêts à vivre", desc: "Entièrement meublés et équipés, pour une installation immédiate et sans effort." },
              { icon: "M12 8a6 6 0 100 12 6 6 0 000-12zM8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32", title: "Une sélection de qualité", desc: "Chaque bien est choisi avec soin pour son confort, son emplacement et son standing." },
              { icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", title: "Un accompagnement réactif", desc: "Une équipe disponible et à l'écoute, à chaque étape de votre séjour." },
              { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "Transparence et confiance", desc: "Des conditions claires, des prix affichés, une relation de confiance durable." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-[#eef0f3] rounded-2xl p-5 shadow-[0_2px_16px_rgba(15,41,64,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(0,201,167,0.22)] hover:shadow-[0_12px_24px_rgba(0,201,167,0.12)]">
                <div className="w-10 h-10 bg-[rgba(0,201,167,0.09)] rounded-lg flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#00C9A7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-[#1a2733] mb-1.5">{item.title}</h3>
                <p className="text-xs text-[#5a6a78] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STATS */}
        <div className="bg-[#0F2940] rounded-2xl grid grid-cols-1 md:grid-cols-3 text-center p-6 md:p-8 mb-6 shadow-[0_8px_40px_rgba(15,41,64,0.12)]">
          <div className="px-4 py-3 md:border-r border-white/10">
            <div className="font-serif text-3xl text-[#00C9A7]">100%</div>
            <div className="text-xs text-white/40 mt-1.5">Des biens visités et sélectionnés par notre équipe</div>
          </div>
          <div className="px-4 py-3 md:border-r border-white/10">
            <div className="font-serif text-3xl text-[#00C9A7]">&lt; 30 min</div>
            <div className="text-xs text-white/40 mt-1.5">De réponse de notre équipe, toujours</div>
          </div>
          <div className="px-4 py-3">
            <div className="font-serif text-3xl text-[#00C9A7]">0€</div>
            <div className="text-xs text-white/40 mt-1.5">De frais cachés sur vos réservations</div>
          </div>
        </div>

        {/* SIGNATURE */}
        <div className="bg-[rgba(0,201,167,0.09)] border-l-[3px] border-[#00C9A7] rounded-r-2xl p-5 md:p-6 mb-6 transition-all duration-300 hover:translate-x-1">
          <p className="font-serif text-lg md:text-xl text-[#1a2733] leading-relaxed">
            <strong className="font-sans font-semibold text-[#0F2940]">Bluefin Immo</strong>, votre partenaire de confiance pour la location de biens meublés — parce qu'un beau séjour commence par un beau logement.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-[#0F2940] rounded-2xl p-8 md:p-10 text-center shadow-[0_8px_40px_rgba(15,41,64,0.12)] transition-all duration-300 hover:-translate-y-1">
          <h2 className="font-serif text-2xl md:text-3xl text-white leading-tight mb-2">
            Votre logement idéal<br /><em className="text-[#00C9A7] not-italic">vous attend.</em>
          </h2>
          <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto">
            Parcourez notre sélection ou rejoignez nos hôtes partenaires — des solutions flexibles pour chaque projet.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => onNavigate?.({ name: 'listings' })}
              className="bg-[#00C9A7] text-[#0F2940] border-none rounded-lg px-7 py-3.5 font-sans text-sm font-semibold cursor-pointer transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,201,167,0.3)]"
            >
              Voir les logements →
            </button>
            <button 
              onClick={() => onNavigate?.({ name: 'become-host' })}
              className="bg-transparent text-white/60 border border-white/20 rounded-lg px-7 py-3.5 font-sans text-sm cursor-pointer transition-all duration-300 hover:text-white hover:border-white/40 hover:-translate-y-0.5"
            >
              Devenir hôte ↗
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// ==================== PAGE FONCTIONNEMENT DU SITE ====================

export function SiteFunctioningPage({ onNavigate }: PageProps) {
  const steps = [
    {
      number: "01",
      title: "Recherchez votre logement",
      description: "Utilisez notre moteur de recherche pour trouver le logement idéal selon votre destination, vos dates et votre budget.",
      icon: Search,
      color: "bg-blue-50"
    },
    {
      number: "02",
      title: "Réservez en toute sécurité",
      description: "Choisissez votre logement, sélectionnez vos dates et procédez au paiement sécurisé via Mobile Money ou carte bancaire.",
      icon: CreditCard,
      color: "bg-green-50"
    },
    {
      number: "03",
      title: "Communiquez avec l'hôte",
      description: "Échangez avec votre hôte pour organiser votre arrivée, poser vos questions et préparer votre séjour.",
      icon: MessageCircle,
      color: "bg-purple-50"
    },
    {
      number: "04",
      title: "Profitez de votre séjour",
      description: "Une fois sur place, profitez de votre logement et n'hésitez pas à laisser un avis après votre départ.",
      icon: Star,
      color: "bg-yellow-50"
    }
  ];

  const features = [
    { icon: Shield, title: "Paiement sécurisé", desc: "Vos transactions sont protégées" },
    { icon: Calendar, title: "Annulation flexible", desc: "Selon les politiques des hôtes" },
    { icon: Users, title: "Support 24/7", desc: "Une équipe toujours disponible" },
    { icon: Award, title: "Hôtes vérifiés", desc: "Des professionnels de confiance" }
  ];

  // Nouvelles sections
  const engagements = [
    { title: "Réactivité", desc: "Répondre aux demandes dans les 24 heures", icon: MessageCircle },
    { title: "Accueil", desc: "Accepter les réservations lorsque le logement est disponible", icon: Home },
    { title: "Fiabilité", desc: "Honorer les réservations confirmées", icon: Shield },
    { title: "Qualité", desc: "Maintenir un niveau de satisfaction élevé via les évaluations", icon: Award }
  ];

  const experienceCriteria = [
    { title: "Expertise", desc: "Maîtrise du domaine et partage authentique", icon: Star },
    { title: "Accès privilégié", desc: "Lieux ou activités inaccessibles seul", icon: MapPin },
    { title: "Relation", desc: "Cadre humain et bienveillant", icon: Users }
  ];

  const rankingFactors = [
    { title: "Profil du Locataire", desc: "Lieu de recherche, historique, favoris", icon: User },
    { title: "Qualité de l'annonce", desc: "Avis, prix, localisation, réactivité, équipements", icon: Home },
    { title: "Paramètres de la recherche", desc: "Nombre d'occupants, durée, date, filtres prix", icon: Filter }
  ];

  const paymentMethods = [
    { name: "Visa", icon: "💳", bg: "bg-blue-50" },
    { name: "Mastercard", icon: "💳", bg: "bg-red-50" },
    { name: "Mobile Money", icon: "📱", bg: "bg-green-50" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-4">
        <button onClick={() => onNavigate?.({ name: 'home' })} className="text-sm text-gray-500 mb-4 flex items-center gap-2 hover:text-[#00c9a7] transition">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <h1 className="text-2xl text-[#0F2940]">Fonctionnement du site</h1>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#0F2940] to-[#1a3f5c] py-12 text-white">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comment ça fonctionne ?</h2>
          <p className="text-white/80">Une plateforme simple et intuitive pour trouver votre logement idéal</p>
        </div>
      </section>

      {/* Qu'est-ce que Bluefin Immo */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0F2940] mb-4">Qu'est-ce que Bluefin Immo ?</h2>
            <div className="w-20 h-1 bg-[#00c9a7] mx-auto"></div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-gray-700 leading-relaxed mb-6">
              Bluefin Immo est une plateforme en ligne spécialisée dans la location de logements meublés, 
              la découverte d'expériences locales et l'accès à des services à la demande. Elle met en relation 
              des Propriétaires qui proposent des biens et des prestations avec des Locataires en recherche 
              de logements meublés de qualité ou d'expériences authentiques.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#f4fffe] rounded-xl p-4 text-center border border-[#e2f5f2]">
                <div className="w-12 h-12 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home className="w-6 h-6 text-[#00c9a7]" />
                </div>
                <h3 className="font-semibold text-[#0F2940]">Hébergements</h3>
                <p className="text-sm text-gray-500">Location de logements meublés pour séjours courts, moyens ou longs</p>
              </div>
              <div className="bg-[#f4fffe] rounded-xl p-4 text-center border border-[#e2f5f2]">
                <div className="w-12 h-12 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-[#00c9a7]" />
                </div>
                <h3 className="font-semibold text-[#0F2940]">Expériences</h3>
                <p className="text-sm text-gray-500">Activités animées par des locaux passionnés</p>
              </div>
              <div className="bg-[#f4fffe] rounded-xl p-4 text-center border border-[#e2f5f2]">
                <div className="w-12 h-12 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-[#00c9a7]" />
                </div>
                <h3 className="font-semibold text-[#0F2940]">Services</h3>
                <p className="text-sm text-gray-500">Services à la demande liés au logement ou au séjour</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6 text-center italic">
              La création d'un compte est nécessaire pour publier une Annonce ou effectuer une réservation.
            </p>
          </div>
        </div>
      </section>

      {/* Qui peut devenir propriétaire */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0F2940] mb-4">Qui peut devenir Propriétaire sur Bluefin Immo ?</h2>
            <div className="w-20 h-1 bg-[#00c9a7] mx-auto"></div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <p className="text-gray-700 text-center mb-6">
              Tout particulier ou professionnel peut publier un logement meublé. L'inscription et la mise en ligne sont gratuites.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              {engagements.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="text-center p-4 rounded-xl hover:shadow-md transition">
                    <div className="w-12 h-12 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-[#00c9a7]" />
                    </div>
                    <h3 className="font-semibold text-[#0F2940] text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Qui peut proposer une expérience */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0F2940] mb-4">Qui peut proposer une Expérience sur Bluefin Immo ?</h2>
            <div className="w-20 h-1 bg-[#00c9a7] mx-auto"></div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-gray-700 text-center mb-6">
              Les Expériences sont des activités animées par des passionnés du territoire. Il n'est pas nécessaire de louer un logement pour en proposer ou en réserver une.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {experienceCriteria.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="text-center p-4 rounded-xl bg-[#f4fffe] border border-[#e2f5f2]">
                    <div className="w-14 h-14 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-7 h-7 text-[#00c9a7]" />
                    </div>
                    <h3 className="font-semibold text-[#0F2940] text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Classement des annonces */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0F2940] mb-4">Classement des annonces</h2>
            <div className="w-20 h-1 bg-[#00c9a7] mx-auto"></div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <p className="text-gray-700 text-center mb-6">
              L'algorithme prend en compte trois grandes catégories de facteurs :
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {rankingFactors.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#00c9a7]/10 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[#00c9a7]" />
                      </div>
                      <h3 className="font-semibold text-[#0F2940]">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-500 text-center mt-6 italic">
              Il n'est pas possible de payer pour améliorer le classement de son annonce.
            </p>
          </div>
        </div>
      </section>

      {/* Frais de service */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0F2940] mb-4">Frais de service</h2>
            <div className="w-20 h-1 bg-[#00c9a7] mx-auto"></div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-gray-700 text-center mb-6">
              L'inscription et la mise en ligne sont gratuites. Des frais de service sont prélevés à la confirmation d'une réservation :
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#f4fffe] rounded-xl p-6 text-center border border-[#e2f5f2]">
                <div className="w-12 h-12 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-[#00c9a7]" />
                </div>
                <h3 className="font-semibold text-[#0F2940">Côté Locataire</h3>
                <p className="text-sm text-gray-500 mt-2">Commission affichée avant confirmation</p>
              </div>
              <div className="bg-[#f4fffe] rounded-xl p-6 text-center border border-[#e2f5f2]">
                <div className="w-12 h-12 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home className="w-6 h-6 text-[#00c9a7]" />
                </div>
                <h3 className="font-semibold text-[#0F2940]">Côté Propriétaire</h3>
                <p className="text-sm text-gray-500 mt-2">Commission déduite du montant reversé</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modes de paiement */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0F2940] mb-4">Modes de paiement</h2>
            <div className="w-20 h-1 bg-[#00c9a7] mx-auto"></div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {paymentMethods.map((method, idx) => (
                <div key={idx} className={`${method.bg} rounded-xl px-6 py-3 text-center min-w-[120px]`}>
                  <span className="text-2xl mr-2">{method.icon}</span>
                  <span className="font-medium text-gray-700">{method.name}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-center text-sm">
              Le débit intervient à l'acceptation par le Propriétaire, ou immédiatement en réservation instantanée. 
              Le paiement est retenu 24 heures après l'entrée dans les lieux avant d'être transféré au Propriétaire.
            </p>
          </div>
        </div>
      </section>

      {/* Protection des propriétaires */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0F2940] mb-4">Protection des Propriétaires</h2>
            <div className="w-20 h-1 bg-[#00c9a7] mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#00c9a7]/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#00c9a7]" />
                </div>
                <h3 className="font-semibold text-[#0F2940] text-lg">Garantie Propriétaire</h3>
              </div>
              <p className="text-gray-600 text-sm">Couvre les dommages matériels causés par les Locataires</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#00c9a7]/10 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#00c9a7]" />
                </div>
                <h3 className="font-semibold text-[#0F2940] text-lg">Assurance Responsabilité Civile</h3>
              </div>
              <p className="text-gray-600 text-sm">Protège contre les réclamations de tiers</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 text-center mt-6 italic">
            Ces protections ne remplacent pas votre assurance habitation personnelle.
          </p>
        </div>
      </section>

      {/* Centre de résolution et assistance */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0F2940] mb-4">Centre de résolution et assistance</h2>
            <div className="w-20 h-1 bg-[#00c9a7] mx-auto"></div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#f4fffe] rounded-xl p-5">
                <h3 className="font-semibold text-[#0F2940] mb-2 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#00c9a7]" />
                  Locataire
                </h3>
                <p className="text-gray-600 text-sm">2 jours après le départ pour ouvrir une demande</p>
              </div>
              <div className="bg-[#f4fffe] rounded-xl p-5">
                <h3 className="font-semibold text-[#0F2940] mb-2 flex items-center gap-2">
                  <Home className="w-5 h-5 text-[#00c9a7]" />
                  Propriétaire
                </h3>
                <p className="text-gray-600 text-sm">2 jours après le départ pour demander une retenue</p>
              </div>
            </div>
            <p className="text-gray-600 text-center mt-6 text-sm">
              Si aucun accord n'est trouvé sous 72h, vous pouvez faire intervenir l'équipe Bluefin Immo via votre espace personnel.
            </p>
          </div>
        </div>
      </section>

      {/* Désactivation d'une annonce ou d'un compte */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0F2940] mb-4">Désactivation d'une annonce ou d'un compte</h2>
            <div className="w-20 h-1 bg-[#00c9a7] mx-auto"></div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-gray-700 text-center mb-4">Un compte peut être suspendu en cas de :</p>
            <ul className="space-y-3 max-w-md mx-auto">
              <li className="flex items-center gap-3 text-gray-600"><XCircle className="w-5 h-5 text-red-500" /> Non-respect des valeurs de la communauté</li>
              <li className="flex items-center gap-3 text-gray-600"><AlertCircle className="w-5 h-5 text-orange-500" /> Signalement d'un problème</li>
              <li className="flex items-center gap-3 text-gray-600"><Clock className="w-5 h-5 text-yellow-500" /> Taux de réponse ou d'acceptation trop faible</li>
              <li className="flex items-center gap-3 text-gray-600"><Calendar className="w-5 h-5 text-purple-500" /> Annulations répétées de réservations confirmées</li>
            </ul>
            <p className="text-sm text-gray-500 text-center mt-6 italic">
              En cas de suspension, toutes les réservations en cours ou futures peuvent être annulées.
            </p>
          </div>
        </div>
      </section>

      {/* Étapes pour voyageurs - Conservation du design original */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-[#0F2940] text-center mb-4">Pour les voyageurs</h2>
          <p className="text-gray-600 text-center mb-10">Réservez votre prochain séjour en quelques clics</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className={`${step.color} rounded-2xl p-6 relative overflow-hidden hover:shadow-lg transition-shadow`}>
                  <div className="text-6xl font-bold text-gray-300/30 absolute top-4 right-4">{step.number}</div>
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Icon className="w-7 h-7 text-[#00c9a7]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F2940] mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comment devenir hôte */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#0F2940] mb-4">Pour les hôtes</h2>
            <p className="text-gray-600">Gagnez de l'argent en partageant votre logement</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-[#00c9a7]">1</span>
              </div>
              <h3 className="font-semibold text-[#0F2940] mb-2">Créez votre annonce</h3>
              <p className="text-gray-500 text-sm">Décrivez votre logement, ajoutez des photos et fixez vos tarifs</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-[#00c9a7]">2</span>
              </div>
              <h3 className="font-semibold text-[#0F2940] mb-2">Recevez des réservations</h3>
              <p className="text-gray-500 text-sm">Les voyageurs réservent votre logement directement</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-[#00c9a7]">3</span>
              </div>
              <h3 className="font-semibold text-[#0F2940] mb-2">Recevez vos paiements</h3>
              <p className="text-gray-500 text-sm">Virements vers Mobile Money ou compte bancaire</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-[#0F2940] text-center mb-10">Pourquoi choisir Bluefin-Immo ?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="text-center p-4 group">
                  <div className="w-14 h-14 bg-[#00c9a7]/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-[#00c9a7]/20 transition">
                    <Icon className="w-7 h-7 text-[#00c9a7]" />
                  </div>
                  <h3 className="font-semibold text-[#0F2940] mb-1">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// ========== PAGE COMPANY INFO ==========


interface PageProps {
  onNavigate?: (page: { name: string }) => void;
}

export function CompanyInfoPage({ onNavigate }: PageProps) {
  const sections = [
    { title: "1. Acceptation des conditions", content: "En accédant et en utilisant le service de Bluefin Immo, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service." },
    { title: "2. Description du service", content: "Bluefin Immo met en relation voyageurs et propriétaires pour la location de biens meublés au Bénin, et propose également des expériences et services pour un séjour clé en main." },
    { title: "3. Accès au service", content: "La plateforme est accessible à deux types d'utilisateurs : Propriétaires : créez un compte et soumettez vos annonces. Chaque annonce est examinée par notre équipe et publiée après validation. Visiteurs : créez un compte pour parcourir les logements, expériences et services disponibles, effectuer une réservation et procéder au paiement en ligne." },
    { title: "4. Paiement et remboursement", content: "Les tarifs des logements, expériences et services sont fixés par les propriétaires et affichés sur la plateforme. Les paiements sont traités via des prestataires de paiement sécurisés tiers. Une fois le paiement confirmé, un email de confirmation vous est automatiquement envoyé. Toute demande de remboursement est traitée au cas par cas, dans le respect de notre politique de remboursement." },
    { title: "5. Politique d'annulation", content: "Toute annulation doit être effectuée directement depuis votre compte sur la plateforme. Les conditions de remboursement applicables sont les suivantes :\n\n• Remboursement intégral : annulation effectuée dans les 24 heures suivant la réservation.\n• Remboursement partiel : annulation effectuée 7 jours avant la date de check-in — 50 % des nuits remboursées. Les frais de service ne sont pas remboursés.\n• Aucun remboursement : toute annulation effectuée moins de 7 jours avant la date de check-in, sans exception.\n\nBluefin Immo se réserve le droit de modifier cette politique à tout moment. Les conditions en vigueur au moment de la réservation s'appliquent." },
    { title: "6. Limitation de responsabilité", content: "Bluefin Immo agit exclusivement en tant que plateforme de mise en relation entre propriétaires et visiteurs. Notre responsabilité se limite à la fourniture de cet espace d'intermédiation et ne saurait être engagée dans les situations suivantes :\n\n• Qualité des biens et services : chaque propriétaire est seul responsable de la conformité de son bien, service ou expérience avec les informations publiées sur la plateforme.\n• Propreté et état du logement : il incombe au propriétaire de garantir un logement propre, entretenu et strictement conforme aux standards annoncés.\n• Qualité des expériences et services : les prestataires sont tenus de délivrer des prestations conformes à leur description.\n• Litiges entre parties : tout litige survenant entre un visiteur et un propriétaire relève de leur responsabilité respective.\n• Plafond de responsabilité : dans les cas où la responsabilité de Bluefin Immo serait engagée, celle-ci sera limitée au montant des frais de service perçus.\n• Cas de force majeure : Bluefin Immo ne peut être tenu responsable de tout manquement résultant d'événements imprévisibles.\n\nRéclamations et délais : Tout visiteur souhaitant signaler un problème dispose d'un délai de 48 heures après le check-in pour soumettre une réclamation." },
    { title: "7. Propriété intellectuelle", content: "L'ensemble des contenus présents sur la plateforme Bluefin Immo — notamment le nom, le logo, les textes, les visuels et l'architecture du site — sont la propriété exclusive de Bluefin Immo et sont protégés par les lois applicables en matière de propriété intellectuelle." },
    { title: "8. Protection des données personnelles", content: "Bluefin Immo collecte et traite les données personnelles de ses utilisateurs dans le cadre strict de la fourniture de ses services. Ces données sont utilisées pour la gestion des comptes, le traitement des réservations et l'amélioration de la plateforme." },
    { title: "9. Modifications du service", content: "Bluefin Immo se réserve le droit de modifier, suspendre ou interrompre tout ou partie du service à tout moment, avec ou sans préavis." },
    { title: "10. Droit applicable", content: "Ces conditions d'utilisation sont régies par les lois du Bénin. Tout litige découlant de ces conditions sera soumis à la juridiction exclusive des tribunaux compétents du Bénin." }
  ];

  return (
    <Layout onNavigate={onNavigate} currentPage="cgu">
      <div className="max-w-4xl mx-auto px-5 py-8 md:px-6 md:py-10">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-4 -mt-8 -mx-5 md:-mx-6 mb-8">
          <h1 className="text-2xl text-[#0F2940]">Conditions Générales d'Utilisation</h1>
          <p className="text-sm text-gray-500 mt-1">Dernière mise à jour : mai 2025</p>
        </div>

        <div className="bg-[#f4fffe] rounded-2xl p-6 mb-8">
          <p className="text-gray-700">
            Chez Bluefin Immo, nous accordons une importance capitale à votre confiance. 
            Cette page détaille nos engagements et vos droits concernant l'utilisation de notre plateforme.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-[#0F2940] mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}


// ==================== BLOG PAGE ====================

// Données des articles de blog
const blogArticlesData = [
  {
    id: "preparer-logement",
    title: "Préparez votre logement pour accueillir des voyageurs",
    excerpt: "Des habitudes de nettoyage rigoureuses, des produits de base bien choisis et des attentions particulières : les ingrédients d'un séjour cinq étoiles.",
    category: "Guide Hôte",
    readTime: "8 min de lecture",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    content: `
      <div class="space-y-8">
        <!-- Introduction -->
        <div class="bg-gradient-to-r from-[#00c9a7]/10 to-[#0f2940]/10 rounded-2xl p-6">
          <p class="text-lg text-gray-700 leading-relaxed">
            Un logement bien préparé, c'est la promesse d'une première impression mémorable. 
            Le souci du détail fait toute la différence entre un voyageur satisfait et un voyageur 
            qui revient et qui laisse une évaluation élogieuse.
          </p>
        </div>

        <!-- Section 01 -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold text-xl">01</div>
            <h2 class="text-2xl font-semibold text-[#0f2940]">Un nettoyage irréprochable</h2>
          </div>
          <p class="text-gray-600 mb-4">Les hôtes les plus performants partagent une discipline commune : une routine de nettoyage stricte, appliquée sans exception avant chaque arrivée.</p>
          <ul class="space-y-3 text-gray-600 list-disc pl-5">
            <li>Nettoyez soigneusement les zones très passagères : plans de travail, drains de lavabo, flacons de savon. Vérifiez qu'aucun cheveu ne vous a échappé.</li>
            <li>Aérez chaque pièce. Ouvrez les fenêtres, dépoussiérez les surfaces et nettoyez tous les sols, y compris sous les meubles.</li>
            <li>Faites les lits avec des draps frais et fournissez des serviettes propres pour chaque voyageur.</li>
            <li>Créez une check-list à suivre entre chaque réservation pour ne rien négliger.</li>
          </ul>
        </div>

        <!-- Section 02 -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold text-xl">02</div>
            <h2 class="text-2xl font-semibold text-[#0f2940]">Les produits de base indispensables</h2>
          </div>
          <p class="text-gray-600 mb-4">Les voyageurs s'attendent à trouver certains équipements essentiels dès leur arrivée. Voici les incontournables à toujours avoir en stock :</p>
          <ul class="space-y-2 text-gray-600 list-disc pl-5 mb-6">
            <li>Papier toilette en quantité suffisante</li>
            <li>Savon pour les mains et le corps</li>
            <li>Une serviette propre par voyageur</li>
            <li>Un oreiller et du linge de lit pour chaque couchage</li>
          </ul>
          
          <div class="grid md:grid-cols-2 gap-4 mt-4">
            <div class="bg-[#f4fffe] rounded-xl p-4">
              <h4 class="font-semibold text-[#0f2940] mb-2">🍳 Cuisine</h4>
              <p class="text-sm text-gray-600">Table et chaises pour tous les voyageurs, cafetière, bouilloire, casseroles et ustensiles, sel, poivre, huile de cuisson, liquide vaisselle et torchons.</p>
            </div>
            <div class="bg-[#f4fffe] rounded-xl p-4">
              <h4 class="font-semibold text-[#0f2940] mb-2">🛋️ Salon</h4>
              <p class="text-sm text-gray-600">Places assises pour tous les voyageurs, téléviseur avec service de streaming, manuel de la maison.</p>
            </div>
            <div class="bg-[#f4fffe] rounded-xl p-4">
              <h4 class="font-semibold text-[#0f2940] mb-2">🛁 Salle de bain</h4>
              <p class="text-sm text-gray-600">Serviettes et tapis de bain, brosse à WC et ventouse, shampoing, après-shampoing et sèche-cheveux.</p>
            </div>
            <div class="bg-[#f4fffe] rounded-xl p-4">
              <h4 class="font-semibold text-[#0f2940] mb-2">🛏️ Chambre</h4>
              <p class="text-sm text-gray-600">Stores ou rideaux occultants, rangements pour vêtements et espace pour les bagages, couvertures supplémentaires.</p>
            </div>
          </div>
        </div>

        <!-- Section 03 -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold text-xl">03</div>
            <h2 class="text-2xl font-semibold text-[#0f2940]">Les petits plus qui font la différence</h2>
          </div>
          <p class="text-gray-600 mb-4">Ce sont souvent les attentions inattendues qui transforment un séjour ordinaire en une expérience mémorable.</p>
          <div class="space-y-4">
            <div class="flex gap-3">
              <span class="text-2xl">🎁</span>
              <div><strong>Cadeau de bienvenue</strong> - Laissez une note manuscrite, un panier de produits locaux ou une attention particulière pour une occasion spéciale.</div>
            </div>
            <div class="flex gap-3">
              <span class="text-2xl">🎨</span>
              <div><strong>Décoration soignée</strong> - Tableaux, plantes, coussins — une décoration chaleureuse crée une atmosphère unique.</div>
            </div>
            <div class="flex gap-3">
              <span class="text-2xl">📖</span>
              <div><strong>Manuel de la maison</strong> - Imprimez-le et placez-le sur le comptoir de la cuisine, là où vos voyageurs le trouveront facilement dès leur arrivée.</div>
            </div>
            <div class="flex gap-3">
              <span class="text-2xl">🔌</span>
              <div><strong>Équipements spécifiques</strong> - Bouchons d'oreille, adaptateurs électriques, parapluies, serviettes de plage — pensez aux besoins propres à votre emplacement.</div>
            </div>
          </div>
        </div>

        <div class="bg-[#0f2940] text-white rounded-2xl p-6 text-center">
          <p class="italic">Une fois votre logement prêt, passez-y une nuit ou demandez à des proches d'y séjourner. Leurs retours vous révéleront rapidement ce qui mérite encore d'être amélioré.</p>
        </div>
      </div>
    `
  },
  {
    id: "optimiser-annonce",
    title: "Comment optimiser votre annonce pour attirer plus de voyageurs",
    excerpt: "Photos soignées, équipements bien renseignés, titre accrocheur et règlement clair — quatre leviers pour faire briller votre logement.",
    category: "Guide Hôte",
    readTime: "10 min de lecture",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    content: `
      <div class="space-y-8">
        <div class="bg-gradient-to-r from-[#00c9a7]/10 to-[#0f2940]/10 rounded-2xl p-6">
          <p class="text-lg text-gray-700 leading-relaxed">
            Une annonce bien construite, c'est votre meilleur commercial. Les détails font la différence 
            entre un logement qui passe inaperçu et un logement qui décroche des réservations dès les premières semaines.
          </p>
        </div>

        <!-- Section 01 -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold text-xl">01</div>
            <h2 class="text-2xl font-semibold text-[#0f2940]">Des photos qui donnent envie</h2>
          </div>
          <p class="text-gray-600 mb-4">Les photos sont l'élément le plus décisif de votre annonce. Un voyageur prend sa décision en quelques secondes — vos visuels doivent capter l'attention immédiatement.</p>
          <ul class="space-y-3 text-gray-600 list-disc pl-5">
            <li><strong>Misez sur la lumière naturelle</strong> — Identifiez les moments de la journée où vos pièces sont les mieux éclairées.</li>
            <li><strong>Soignez votre cadrage</strong> — Alternez plans larges et plans rapprochés. Photographiez à hauteur des yeux.</li>
            <li><strong>Créez une visite complète</strong> — Photographiez tous les espaces auxquels les voyageurs auront accès.</li>
          </ul>
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
            <p class="text-sm"><strong>💡 Conseil pro :</strong> Pour aller plus loin, faites appel à un photographe professionnel. Des photos de qualité augmentent significativement le taux de conversion de votre annonce.</p>
          </div>
        </div>

        <!-- Section 02 -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold text-xl">02</div>
            <h2 class="text-2xl font-semibold text-[#0f2940]">Tous vos équipements bien renseignés</h2>
          </div>
          <p class="text-gray-600 mb-4">De nombreux voyageurs filtrent leurs recherches par équipements. Une liste exhaustive augmente directement votre visibilité.</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Wifi</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Piscine</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Jacuzzi</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Cuisine équipée</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Télévision</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Climatisation</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Lave-linge</span>
            <span class="px-3 py-1 bg-gray-100 rounded-full text-sm">Parking gratuit</span>
          </div>
        </div>

        <!-- Section 03 -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold text-xl">03</div>
            <h2 class="text-2xl font-semibold text-[#0f2940]">Un titre et une description qui marquent</h2>
          </div>
          <div class="space-y-4">
            <div class="bg-[#f4fffe] rounded-xl p-4">
              <h4 class="font-semibold text-[#0f2940]">📝 Un titre court et percutant</h4>
              <p>Exemple : <span class="italic">"Loft moderne surplombant le centre-ville"</span></p>
            </div>
            <div class="bg-[#f4fffe] rounded-xl p-4">
              <h4 class="font-semibold text-[#0f2940]">✨ Mettez en avant ce qui vous distingue</h4>
              <p>Exemple : <span class="italic">"Cabane confortable avec cuisine professionnelle"</span></p>
            </div>
            <div class="bg-[#f4fffe] rounded-xl p-4">
              <h4 class="font-semibold text-[#0f2940]">💬 Une description comme une conversation</h4>
              <p>Écrivez comme si vous expliquiez votre logement à un ami.</p>
            </div>
          </div>
        </div>

        <!-- Section 04 -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold text-xl">04</div>
            <h2 class="text-2xl font-semibold text-[#0f2940]">Un règlement intérieur clair</h2>
          </div>
          <p class="text-gray-600 mb-4">Un règlement bien rédigé protège votre logement et évite les malentendus.</p>
          <ul class="space-y-2 text-gray-600 list-disc pl-5">
            <li>Animaux de compagnie</li>
            <li>Événements et fêtes</li>
            <li>Tabac et vapotage</li>
            <li>Heures de calme</li>
            <li>Horaires d'arrivée et de départ</li>
            <li>Nombre maximum de voyageurs autorisés</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: "ameliorer-annonce",
    title: "Améliorer son annonce au fil du temps",
    excerpt: "Quelques ajustements apportés au bon moment peuvent transformer les performances de votre annonce.",
    category: "Guide Hôte",
    readTime: "7 min de lecture",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80",
    content: `
      <div class="space-y-8">
        <div class="bg-gradient-to-r from-[#00c9a7]/10 to-[#0f2940]/10 rounded-2xl p-6">
          <p class="text-lg text-gray-700 leading-relaxed">
            Tout comme votre logement, quelques ajustements apportés au bon moment peuvent transformer les performances de votre annonce.
            En affinant vos photos, vos équipements et votre tarification, vous attirez davantage de voyageurs.
          </p>
        </div>

        <!-- Section 01 -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold text-xl">01</div>
            <h2 class="text-2xl font-semibold text-[#0f2940]">Mettez à jour vos photos</h2>
          </div>
          <ul class="space-y-3 text-gray-600 list-disc pl-5">
            <li>Ajoutez des légendes à vos photos</li>
            <li>Soignez la composition — activez la grille, vérifiez la résolution</li>
            <li>Faites appel à un professionnel si nécessaire</li>
          </ul>
        </div>

        <!-- Section 02 -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold text-xl">02</div>
            <h2 class="text-2xl font-semibold text-[#0f2940]">Enrichissez vos informations</h2>
          </div>
          <ul class="space-y-3 text-gray-600 list-disc pl-5">
            <li>Mettez en avant les équipements recherchés</li>
            <li>Maintenez votre annonce à jour</li>
            <li>Restez simple et direct</li>
            <li>Utilisez les retours de vos voyageurs</li>
          </ul>
        </div>

        <!-- Section 03 -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold text-xl">03</div>
            <h2 class="text-2xl font-semibold text-[#0f2940]">Offrez le meilleur rapport qualité-prix</h2>
          </div>
          <ul class="space-y-3 text-gray-600 list-disc pl-5">
            <li>Adoptez une tarification compétitive</li>
            <li>Justifiez votre prix par votre offre</li>
          </ul>
          <div class="bg-[#f4fffe] rounded-xl p-4 mt-4">
            <p class="text-sm"><strong>💡 À savoir :</strong> Le prix total que voient les voyageurs inclut votre tarif par nuit, les frais supplémentaires, les frais de service Bluefin Immo et les taxes applicables.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "top-destinations-benin",
    title: "Top 10 des destinations incontournables au Bénin",
    excerpt: "Découvrez les villes et villages à ne pas manquer lors de votre prochain voyage au Bénin.",
    category: "Guide Voyageur",
    readTime: "12 min de lecture",
    image: "https://images.unsplash.com/photo-1590759668628-05b3b8986301?w=800&q=80",
    content: `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-[#00c9a7]/10 to-[#0f2940]/10 rounded-2xl p-6">
          <p class="text-lg text-gray-700">Le Bénin regorge de trésors culturels et naturels. Voici notre sélection des 10 destinations à absolument découvrir.</p>
        </div>
        
        <div class="space-y-4">
          <div class="flex gap-4 items-start">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div><strong class="text-[#0f2940]">Cotonou</strong> — La capitale économique, vibrante et animée.</div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div><strong class="text-[#0f2940]">Porto-Novo</strong> — La capitale officielle, riche en histoire.</div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div><strong class="text-[#0f2940]">Ouidah</strong> — Berceau du vaudou et porte du non-retour.</div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
            <div><strong class="text-[#0f2940]">Grand-Popo</strong> — Plages paradisiaques et détente absolue.</div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center font-bold flex-shrink-0">5</div>
            <div><strong class="text-[#0f2940]">Abomey</strong> — Les palais royaux, classés à l'UNESCO.</div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center font-bold flex-shrink-0">6</div>
            <div><strong class="text-[#0f2940]">Parakou</strong> — Porte d'entrée du nord Bénin.</div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center font-bold flex-shrink-0">7</div>
            <div><strong class="text-[#0f2940]">Natitingou</strong> — Les célèbres Tata Somba.</div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center font-bold flex-shrink-0">8</div>
            <div><strong class="text-[#0f2940]">Ganvié</strong> — Le village lacustre sur pilotis.</div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center font-bold flex-shrink-0">9</div>
            <div><strong class="text-[#0f2940]">Pendjari</strong> — Le parc national pour un safari inoubliable.</div>
          </div>
          <div class="flex gap-4 items-start">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] text-white flex items-center justify-center font-bold flex-shrink-0">10</div>
            <div><strong class="text-[#0f2940]">Dassa-Zoumè</strong> — Les collines sacrées et la basilique.</div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "guide-cuisine-beninoise",
    title: "Guide de la cuisine béninoise : plats typiques à déguster",
    excerpt: "Découvrez les saveurs authentiques du Bénin à travers ses plats traditionnels.",
    category: "Culture & Gastronomie",
    readTime: "6 min de lecture",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    content: `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-[#00c9a7]/10 to-[#0f2940]/10 rounded-2xl p-6">
          <p class="text-lg text-gray-700">La cuisine béninoise est riche en saveurs. Voici un guide des plats incontournables à goûter absolument.</p>
        </div>
        
        <div class="space-y-4">
          <div class="bg-white rounded-xl p-4 shadow-sm border-l-4 border-[#00c9a7]">
            <h3 class="font-semibold text-lg text-[#0f2940]">🍛 Le Riz au Gras</h3>
            <p class="text-gray-600">Plat national du Bénin, ce riz cuit dans une sauce tomate épicée avec du poisson ou de la viande.</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm border-l-4 border-[#00c9a7]">
            <h3 class="font-semibold text-lg text-[#0f2940]">🍲 La Pâte (Akassa)</h3>
            <p class="text-gray-600">Préparée à base de maïs ou de manioc, accompagnée de sauces variées (graines, gombo, arachide).</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm border-l-4 border-[#00c9a7]">
            <h3 class="font-semibold text-lg text-[#0f2940]">🐟 Le Poisson braisé</h3>
            <p class="text-gray-600">Spécialité du bord de mer, mariné aux épices locales et grillé au feu de bois.</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm border-l-4 border-[#00c9a7]">
            <h3 class="font-semibold text-lg text-[#0f2940]">🥘 L'Igname pilée (Foutou)</h3>
            <p class="text-gray-600">Accompagnement traditionnel servi avec des sauces relevées.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    id: "conseils-voyage-benin",
    title: "5 conseils pratiques pour un voyage réussi au Bénin",
    excerpt: "Préparez votre séjour avec ces conseils essentiels pour profiter pleinement du Bénin.",
    category: "Guide Voyageur",
    readTime: "5 min de lecture",
    image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=80",
    content: `
      <div class="space-y-6">
        <div class="grid gap-4">
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold">1</div>
            <div><strong>La meilleure période pour voyager</strong> — De novembre à février pendant la saison sèche.</div>
          </div>
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold">2</div>
            <div><strong>Les formalités administratives</strong> — Vérifiez les conditions de visa.</div>
          </div>
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold">3</div>
            <div><strong>La santé et la sécurité</strong> — Vaccins recommandés et précautions sanitaires.</div>
          </div>
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold">4</div>
            <div><strong>Les moyens de transport</strong> — Taxis, zémidjans, bus interurbains.</div>
          </div>
          <div class="flex gap-3">
            <div class="w-8 h-8 rounded-full bg-[#00c9a7] flex items-center justify-center text-white font-bold">5</div>
            <div><strong>La monnaie et le budget</strong> — La monnaie locale est le Franc CFA.</div>
          </div>
        </div>
      </div>
    `
  }
];



export function BlogPage({ onNavigate }: PageProps) {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  return (
    <>
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête avec retour */}
          <div className="mb-8">
            <button 
              onClick={() => onNavigate?.({ name: 'home' })} 
              className="flex items-center gap-2 text-gray-500 hover:text-[#00c9a7] transition-colors mb-4"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>Retour à l'accueil</span>
            </button>
            <h1 className="text-3xl font-bold text-[#0F2940]">Blog & Actualités</h1>
            <p className="text-gray-500 mt-2">Des conseils de voyage au Bénin et des idées d'itinéraires pour les hôtes et voyageurs</p>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button className="px-4 py-2 rounded-full bg-[#00c9a7] text-white text-sm font-medium">
              Tous les articles
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition">
              Guide Hôte
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition">
              Guide Voyageur
            </button>
            <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition">
              Culture & Gastronomie
            </button>
          </div>

          {/* Grille des articles */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogArticlesData.map((article, index) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-[#00c9a7] text-white text-xs rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#0F2940] mb-2 line-clamp-2 group-hover:text-[#00c9a7] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#00c9a7]/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#00c9a7]">B</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#0F2940]">Bluefin-Immo</p>
                        <p className="text-xs text-gray-400">Guide officiel</p>
                      </div>
                    </div>
                    <button className="text-[#00c9a7] text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Lire <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Article */}
      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </>
  );
}

// ========== PAGE TERMS (POLITIQUE & CONFIDENTIALITÉ) ==========
interface TermsPage {
  onNavigate?: (page: { name: string }) => void;
}

export function TermsPage({ onNavigate }: PageProps) {
  const sections = [
    { title: "1. Introduction", content: "Bluefin Immo s'engage à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations personnelles lorsque vous utilisez notre service." },
    { title: "2. Informations que nous collectons", content: "Nous collectons les informations suivantes lorsque vous utilisez notre service : informations d'identification (nom, prénom, adresse e-mail), informations de paiement (montant des transactions, méthodes de paiement traitées par nos prestataires de paiement sécurisés), informations de préférence (langue préférée pour le guide), et données techniques (adresse IP, type de navigateur, pages visitées pour améliorer notre service)." },
    { title: "3. Utilisation des informations", content: "Nous utilisons vos informations pour : fournir et améliorer notre service de mise en relation, traiter vos paiements, vous envoyer vos identifiants d'accès, personnaliser votre expérience selon votre langue préférée, et communiquer avec vous concernant votre compte ou nos services." },
    { title: "4. Partage des informations", content: "Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. Nous pouvons partager vos informations uniquement avec nos prestataires de services de confiance (processeurs de paiement, services d'email) qui nous aident à exploiter notre service, sous réserve qu'ils acceptent de garder ces informations confidentielles." },
    { title: "5. Sécurité des données", content: "Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre l'accès non autorisé, la modification, la divulgation ou la destruction. Vos mots de passe sont cryptés et stockés de manière sécurisée." },
    { title: "6. Vos droits", content: "Vous avez le droit d'accéder, de modifier ou de supprimer vos informations personnelles à tout moment. Vous pouvez également vous opposer au traitement de vos données ou demander la portabilité de vos données. Pour exercer ces droits, contactez-nous via les informations de contact fournies." },
    { title: "7. Conservation des données", content: "Nous conservons vos informations personnelles aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. Si vous supprimez votre compte, nous supprimerons vos données personnelles dans un délai raisonnable, sauf si la loi nous oblige à les conserver." },
    { title: "8. Modifications de cette politique", content: "Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique sur cette page et en mettant à jour la date de « dernière mise à jour »." }
  ];

  return (
    <Layout onNavigate={onNavigate} currentPage="privacy">
      <div className="max-w-4xl mx-auto px-5 py-8 md:px-6 md:py-10">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-4 -mt-8 -mx-5 md:-mx-6 mb-8">
          <h1 className="text-2xl text-[#0F2940]">Politique de confidentialité</h1>
          <p className="text-sm text-gray-500 mt-1">Dernière mise à jour : 1er janvier 2026</p>
        </div>

        <div className="bg-[#f4fffe] rounded-2xl p-6 mb-8">
          <p className="text-gray-700">
            Chez Bluefin Immo, nous accordons une importance capitale à votre confiance. 
            Cette page détaille nos engagements et vos droits concernant vos données personnelles.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-[#0F2940] mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

      
      </div>
    </Layout>
  );
}

// ========== PAGE Cgu (CONDITIONS & CGU) ==========

export function CguPage({ onNavigate }: PageProps) {
  const cguContent = {
    title: "Conditions Générales d'Utilisation",
    lastUpdated: "juin 2025",
    sections: [
      {
        title: "1. Acceptation des conditions",
        content: "En accédant et en utilisant le service de Bluefin Immo, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service."
      },
      {
        title: "2. Description du service",
        content: "Bluefin Immo met en relation voyageurs et propriétaires pour la location de biens meublés au Bénin, et propose également des expériences et services pour un séjour clé en main."
      },
      {
        title: "3. Accès au service",
        content: "La plateforme est accessible à deux types d'utilisateurs :\n\nPropriétaires : créez un compte et soumettez vos annonces. Chaque annonce est examinée par notre équipe et publiée après validation.\nVisiteurs : créez un compte pour parcourir les logements, expériences et services disponibles, effectuer une réservation et procéder au paiement en ligne."
      },
      {
        title: "3bis. Conditions d'éligibilité",
        content: "3bis.1 – Majorité : L'accès et l'utilisation de la plateforme Bluefin Immo sont strictement réservés aux personnes physiques majeures, c'est-à-dire âgées d'au moins 18 ans. En créant un compte, vous déclarez avoir atteint l'âge légal requis dans votre pays de résidence. Bluefin Immo se réserve le droit de suspendre ou de supprimer tout compte dont le titulaire s'avérerait être mineur.\n\n3bis.2 – Vérification d'identité : Dans le cadre de la lutte contre la fraude et pour garantir la sécurité de tous les utilisateurs, Bluefin Immo peut exiger, à tout moment, la vérification de l'identité d'un propriétaire ou d'un visiteur. Cette vérification peut inclure la fourniture d'une pièce d'identité officielle en cours de validité, d'un justificatif de domicile ou de tout autre document jugé nécessaire. Tout refus de se soumettre à cette procédure peut entraîner la suspension ou la résiliation du compte concerné.\n\n3bis.3 – Compte unique : Chaque utilisateur ne peut détenir qu'un seul compte actif sur la plateforme. La création de comptes multiples à des fins frauduleuses ou pour contourner une suspension est strictement interdite et entraîne une exclusion définitive de la plateforme."
      },
      {
        title: "4. Paiement et remboursement",
        content: "Les tarifs des logements, expériences et services sont fixés par les propriétaires et affichés sur la plateforme. Les paiements sont traités via des prestataires de paiement sécurisés tiers. Une fois le paiement confirmé, un email de confirmation vous est automatiquement envoyé. Toute demande de remboursement est traitée au cas par cas, dans le respect de notre politique de remboursement."
      },
      {
        title: "4bis. Frais de service et commissions",
        content: "4bis.1 – Frais applicables aux hôtes : Pour chaque réservation confirmée, Bluefin Immo prélève des frais de service de 6% calculés sur le sous-total de la réservation, hors taxes. Ces frais sont automatiquement déduits du montant versé à l'hôte. Exemple : pour une réservation d'un montant de 50 000 FCFA, l'hôte perçoit 47 000 FCFA.\n\n4bis.2 – Frais applicables aux voyageurs : Des frais de service de 10% sont ajoutés au prix affiché par l'hôte et sont à la charge du voyageur au moment de la réservation. Ces frais sont clairement indiqués avant toute confirmation de paiement. Exemple : pour une nuit affichée à 50 000 FCFA, le voyageur règle 55 000 FCFA.\n\n4bis.3 – Affectation des frais : Les frais de service contribuent au fonctionnement de la plateforme et couvrent notamment : le traitement sécurisé des paiements, la promotion des annonces auprès des voyageurs, l'assistance aux hôtes et aux voyageurs, la maintenance et le développement de la plateforme.\n\n4bis.4 – Modification des frais : Bluefin Immo se réserve le droit de modifier le taux des frais de service à tout moment. Toute modification sera notifiée aux utilisateurs par e-mail au moins 30 jours avant son entrée en vigueur. Les réservations confirmées avant la date d'entrée en vigueur restent soumises aux frais applicables au moment de leur confirmation.\n\n4bis.5 – Taxes : Dans les territoires où la réglementation l'exige, Bluefin Immo peut être amené à collecter et reverser automatiquement les taxes locales applicables (taxe de séjour, TVA, etc.) au nom des hôtes. Le détail des taxes applicables est précisé lors du processus de réservation."
      },
      {
        title: "5. Politique d'annulation",
        content: "Toute annulation doit être effectuée directement depuis votre compte sur la plateforme. Les conditions de remboursement applicables sont les suivantes :\n\n• Remboursement intégral : annulation effectuée dans les 24 heures suivant la réservation.\n• Remboursement partiel : annulation effectuée 7 jours avant la date de check-in — 50% des nuits remboursées. Les frais de service ne sont pas remboursés.\n• Aucun remboursement : toute annulation effectuée moins de 7 jours avant la date de check-in, sans exception.\n\nBluefin Immo se réserve le droit de modifier cette politique à tout moment. Les conditions en vigueur au moment de la réservation s'appliquent."
      },
      {
        title: "6. Conditions de versement aux hôtes",
        content: "6.1 – Délai de versement : Pour la plupart des séjours, le versement du montant dû à l'hôte est effectué dans un délai de 72 heures à compter de la date et de l'heure d'arrivée confirmée du voyageur, sous réserve que : le séjour soit en cours et non annulé, aucun litige n'ait été ouvert par le voyageur dans ce délai, les coordonnées bancaires ou de paiement mobile de l'hôte soient valides et à jour dans son profil.\n\n6.2 – Modes de versement : Le versement est effectué via le mode de paiement sélectionné par l'hôte dans son profil Bluefin Immo. Selon le mode choisi (virement bancaire, mobile money, etc.), des délais supplémentaires propres à l'établissement financier ou à l'opérateur peuvent s'appliquer.\n\n6.3 – Suspension du versement : Bluefin Immo se réserve le droit de suspendre ou de retarder un versement dans les cas suivants : ouverture d'un litige ou d'une réclamation par le voyageur, suspicion de fraude ou d'activité anormale, non-conformité de l'annonce avec les critères de la plateforme, coordonnées de paiement incorrectes ou non vérifiées.\n\n6.4 – Litiges et remboursements : En cas de litige initié avant l'expiration du délai de 72 heures, Bluefin Immo se réserve le droit de bloquer temporairement le versement jusqu'à résolution du différend, conformément à la politique de résolution des litiges de la plateforme.\n\n6.5 – Devise et frais : Les versements sont effectués dans la devise locale applicable. Tout frais de conversion de devises ou frais bancaires éventuels sont à la charge de l'hôte, sauf mention contraire."
      },
      {
        title: "7. Limitation de responsabilité",
        content: "Bluefin Immo agit exclusivement en tant que plateforme de mise en relation entre propriétaires et visiteurs. Notre responsabilité se limite à la fourniture de cet espace d'intermédiation et ne saurait être engagée dans les situations suivantes :\n\n• Qualité des biens et services : chaque propriétaire est seul responsable de la conformité de son bien, service ou expérience avec les informations publiées sur la plateforme. La validation d'une annonce par Bluefin Immo constitue une vérification formelle et ne saurait être interprétée comme une garantie de qualité. En cas de manquement avéré, l'annonce concernée sera automatiquement supprimée et le propriétaire pourra être définitivement banni de la plateforme.\n\n• Propreté et état du logement : il incombe au propriétaire de garantir un logement propre, entretenu et strictement conforme aux standards annoncés.\n\n• Qualité des expériences et services : les prestataires sont tenus de délivrer des prestations conformes à leur description. Bluefin Immo ne saurait être responsable de toute prestation non conforme, incomplète ou annulée par le prestataire.\n\n• Litiges entre parties : tout litige survenant entre un visiteur et un propriétaire relève de leur responsabilité respective. Bluefin Immo peut intervenir en tant que médiateur sans toutefois y être contraint.\n\n• Plafond de responsabilité : dans les cas où la responsabilité de Bluefin Immo serait engagée, celle-ci sera limitée au montant des frais de service perçus lors de la transaction concernée.\n\n• Cas de force majeure : Bluefin Immo ne peut être tenu responsable de tout manquement résultant d'événements imprévisibles ou indépendants de sa volonté, tels que catastrophes naturelles, conflits, pannes techniques ou décisions gouvernementales.\n\nRéclamations et délais : Tout visiteur souhaitant signaler un problème dispose d'un délai de 48 heures après le check-in pour soumettre une réclamation via son espace personnel sur la plateforme. Passé ce délai, aucune réclamation ne pourra être prise en compte. Bluefin Immo s'engage à traiter chaque réclamation avec sérieux et à œuvrer pour une résolution amiable dans les meilleurs délais."
      },
      {
        title: "8. Protection des données personnelles",
        content: "8.1 – Données collectées : Dans le cadre de la fourniture de ses services, Bluefin Immo collecte les données personnelles suivantes : données d'identification (nom, prénom, adresse e-mail, numéro de téléphone, pièce d'identité), données de connexion (adresse IP, historique de navigation sur la plateforme), données transactionnelles (historique des réservations, coordonnées de paiement), données de communication (messages échangés entre utilisateurs via la messagerie intégrée).\n\n8.2 – Finalités du traitement : Les données collectées sont utilisées aux fins suivantes : gestion et sécurisation des comptes utilisateurs, traitement et suivi des réservations, prévention de la fraude et vérification d'identité, amélioration de la plateforme et personnalisation de l'expérience utilisateur, envoi de communications relatives au service (confirmations, notifications, assistance).\n\n8.3 – Durée de conservation : Les données personnelles sont conservées pendant la durée nécessaire à l'accomplissement des finalités pour lesquelles elles ont été collectées, et au maximum : données de compte (pendant toute la durée d'activité du compte, puis 3 ans après sa clôture), données transactionnelles (5 ans à compter de la dernière transaction, conformément aux obligations légales comptables), données de connexion (12 mois à compter de leur collecte).\n\n8.4 – Partage des données : Les données personnelles des utilisateurs ne sont ni vendues ni louées à des tiers. Elles peuvent être partagées uniquement dans les cas suivants : avec les prestataires de paiement tiers pour le traitement des transactions, avec les autorités compétentes en cas d'obligation légale, avec les hôtes dans la stricte limite des informations nécessaires à la réalisation d'une réservation.\n\n8.5 – Droits des utilisateurs : Conformément à la législation en vigueur au Bénin, notamment les dispositions de l'Autorité de Protection des Données Personnelles (APDP), chaque utilisateur dispose des droits suivants : droit d'accès à ses données personnelles, droit de rectification en cas d'inexactitude, droit de suppression sous réserve des obligations légales de conservation, droit d'opposition au traitement de ses données à des fins de prospection commerciale. Pour exercer ces droits, l'utilisateur peut contacter Bluefin Immo via la messagerie de la plateforme ou à l'adresse e-mail dédiée à la protection des données."
      },
      {
        title: "9. Propriété intellectuelle",
        content: "L'ensemble des contenus présents sur la plateforme Bluefin Immo — notamment le nom, le logo, les textes, les visuels et l'architecture du site — sont la propriété exclusive de Bluefin Immo et sont protégés par les lois applicables en matière de propriété intellectuelle. Toute reproduction, distribution ou utilisation sans autorisation préalable est strictement interdite. Les contenus publiés par les propriétaires, tels que les photos et descriptions d'annonces, restent leur propriété, mais ceux-ci accordent à Bluefin Immo une licence d'utilisation aux fins de diffusion sur la plateforme."
      },
      {
        title: "10. Modifications du service",
        content: "Bluefin Immo se réserve le droit de modifier, suspendre ou interrompre tout ou partie du service à tout moment, avec ou sans préavis. Nous ne saurions être tenus responsables envers vous ou tout tiers de toute modification, suspension ou interruption du service."
      },
      {
        title: "11. Médiation et résolution des litiges",
        content: "11.1 – Engagement de médiation : En cas de litige entre un visiteur et un propriétaire, Bluefin Immo propose un service de médiation accessible depuis l'espace personnel de chaque utilisateur. Bluefin Immo s'engage à traiter chaque demande avec sérieux et impartialité, dans un délai de 5 jours ouvrés suivant la réception de la demande.\n\n11.2 – Procédure de médiation : Toute demande de médiation doit être soumise dans un délai de 48 heures suivant le check-in, accompagnée des éléments suivants : description précise du problème constaté, preuves photographiques ou documentaires le cas échéant, montant du préjudice estimé.\n\n11.3 – Issue de la médiation : À l'issue de la procédure de médiation, Bluefin Immo peut, selon les circonstances : procéder à un remboursement partiel ou total au voyageur, maintenir le versement à l'hôte si sa bonne foi est établie, suspendre ou bannir un utilisateur en cas de manquement avéré. La décision rendue par Bluefin Immo dans le cadre de la médiation est définitive et ne peut faire l'objet d'un recours auprès de la plateforme. Les parties restent libres de saisir les juridictions compétentes."
      },
      {
        title: "12. Droit applicable",
        content: "Ces conditions d'utilisation sont régies par les lois du Bénin. Tout litige découlant de ces conditions sera soumis à la juridiction exclusive des tribunaux compétents du Bénin."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-5 py-4">
        <button onClick={() => onNavigate?.({ name: 'home' })} className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <h1 className="text-2xl text-[#0F2940]">{cguContent.title}</h1>
        <p className="text-sm text-gray-500 mt-1">Dernière mise à jour : {cguContent.lastUpdated}</p>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="bg-[#f4fffe] rounded-2xl p-6 mb-8">
          <p className="text-gray-700">
            Chez Bluefin Immo, nous accordons une importance capitale à votre confiance. 
            Cette page détaille nos engagements et vos droits concernant l'utilisation de notre plateforme.
          </p>
        </div>

        <div className="space-y-8">
          {cguContent.sections.map((section, idx) => (
            <div key={idx} className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-[#0F2940] mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>

       
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

// import { CommunityCommitment } from './CommunityCommitment';

interface PageProps {
  onNavigate?: (page: { name: string; params?: any }) => void;
}

export function BecomeHost({ onNavigate }: PageProps) {
  const [selectedOption, setSelectedOption] = useState<'property' | 'experience' | 'service' | null>(null);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [showCommitment, setShowCommitment] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    password_confirmation: ''
  });
  
  const { login, register, switchUserType } = useAuth();

  const handleStart = () => {
    setShowAuthPage(true);
    setAuthMode('login');
    setError(null);
  };
  
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validation
      if (authMode === 'register') {
        if (formData.password !== formData.password_confirmation) {
          throw new Error('Les mots de passe ne correspondent pas');
        }
        if (formData.password.length < 8) {
          throw new Error('Le mot de passe doit contenir au moins 8 caractères');
        }
        if (!formData.first_name || !formData.last_name) {
          throw new Error('Veuillez remplir tous les champs');
        }
      }
      
      if (authMode === 'login') {
        // Connexion en tant qu'hôte
        await login(formData.email, formData.password, 'hote');
      } else {
        // Inscription en tant qu'hôte
        await register({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        }, 'hote');
      }
      
      // Forcer le type hôte
      switchUserType('hote');
      
      // Fermer l'auth et passer aux engagements
      setShowAuthPage(false);
      setShowCommitment(true);
      
    } catch (error: any) {
      console.error('Erreur auth:', error);
      setError(error.message || 'Erreur lors de l\'authentification');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCommitmentAccept = () => {
    setShowCommitment(false);
    
    if (selectedOption === 'property') {
      onNavigate?.({ name: 'publish' });
    } else if (selectedOption === 'experience') {
      onNavigate?.({ name: 'publish-experience' });
    } else if (selectedOption === 'service') {
      onNavigate?.({ name: 'publish-service' });
    } else {
      onNavigate?.({ name: 'host-dashboard' });
    }
  };

  const handleOptionSelect = (option: 'property' | 'experience' | 'service') => {
    setSelectedOption(option);
    setShowAuthPage(true);
    setAuthMode('login');
    setError(null);
  };

  // Page d'authentification
  if (showAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#f4fffe] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <button
            onClick={() => {
              setShowAuthPage(false);
              setSelectedOption(null);
              setError(null);
            }}
            className="absolute top-4 left-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setAuthMode('login');
                setError(null);
              }}
              className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
                authMode === 'login'
                  ? 'text-[#00c9a7] border-b-2 border-[#00c9a7]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Connexion Hôte
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setError(null);
              }}
              className={`flex-1 py-4 text-center font-semibold transition-all duration-300 ${
                authMode === 'register'
                  ? 'text-[#00c9a7] border-b-2 border-[#00c9a7]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Devenir Hôte
            </button>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                      <input
                        type="text"
                        required
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent"
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                      <input
                        type="text"
                        required
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent"
                      placeholder="+229 XX XXX XXX"
                    />
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent"
                  placeholder="Minimum 8 caractères"
                />
              </div>
              
              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent"
                    placeholder="Confirmez votre mot de passe"
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#00c9a7] to-[#0f2940] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Chargement...' : (authMode === 'login' ? 'Se connecter comme hôte' : 'Devenir hôte')}
              </button>
            </form>
            
            {authMode === 'login' && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setError(null);
                  }}
                  className="text-[#00c9a7] font-semibold hover:underline"
                >
                  Créez votre espace hôte
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showCommitment) {
    return <CommunityCommitment 
      onAccept={handleCommitmentAccept} 
      onBack={() => { 
        setShowCommitment(false); 
        setShowAuthPage(true); 
      }} 
    />;
  }

  // Page principale Devenir Hôte
  const hostOptions = [
    { id: 'property' as const, title: 'Logement', description: 'Mettez votre logement en location', icon: Home, color: 'from-[#00c9a7] to-[#00b396]' },
    { id: 'experience' as const, title: 'Expérience', description: 'Partagez votre passion', icon: Compass, color: 'from-[#0f2940] to-[#1a3a52]' },
    { id: 'service' as const, title: 'Service', description: 'Proposez vos services', icon: Briefcase, color: 'from-[#ff6b6b] to-[#ff5252]' },
  ];

  const benefits = [
    { icon: Shield, title: 'Sécurité renforcée', description: 'Paiements sécurisés' },
    { icon: MessageCircle, title: 'Assistance 7j/7', description: 'Une équipe disponible' },
    { icon: CreditCard, title: 'Paiements rapides', description: 'Vos gains sous 24h' },
    { icon: Globe, title: 'Visibilité internationale', description: 'Vue dans le monde entier' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#f4fffe]">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-5 py-4">
        <button onClick={() => onNavigate?.({ name: 'home' })} className="text-sm text-gray-500 mb-3 flex items-center gap-2 hover:text-[#00c9a7] transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour
        </button>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0F2940]">Devenir hôte</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Partagez votre espace et créez des revenus supplémentaires</p>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0f2940] to-[#1a3a52] p-6 sm:p-8 md:p-12 mb-8 sm:mb-12 text-center">
          <div className="relative z-10">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#00ffdb] mb-2 sm:mb-3">Hébergeurs</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">Rejoignez la communauté</h2>
            <p className="text-white/80 text-xs sm:text-sm md:text-base max-w-2xl mx-auto">
              Créez votre annonce, gérez les réservations et proposez votre logement aux voyageurs.
            </p>
          </div>
        </div>

        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F2940] mb-2">Comment souhaitez-vous contribuer ?</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Choisissez le type d'offre que vous voulez proposer</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {hostOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-r ${option.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-[#0F2940] mb-2 group-hover:text-[#00c9a7] transition-colors">
                      {option.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
                      {option.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[#00c9a7] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                      <span>Commencer</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#0F2940] mb-2">Pourquoi devenir hôte ?</h3>
            <p className="text-gray-500 text-xs sm:text-sm">Des avantages conçus pour vous accompagner</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-3 sm:p-4 md:p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-[#00c9a7]/10 text-[#00c9a7] flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <h4 className="text-xs sm:text-sm md:text-base font-semibold text-[#0F2940] mb-1">{benefit.title}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center pt-6 sm:pt-8 border-t border-slate-200">
          <button
            onClick={handleStart}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#00c9a7] to-[#0f2940] px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base">
              Accéder à mon espace
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Nouveau composant AuthPage spécifique pour les hôtes (sans options voyageur/visiteur)
// HostOnlyAuthPage.tsx - Composant dédié aux hôtes avec design moderne
function HostOnlyAuthPage({ onNavigate, onAuthSuccess, hideBackButton = false }: { onNavigate?: (route: Route) => void; onAuthSuccess?: (user: any) => void; hideBackButton?: boolean }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    property_address: '',
    property_type: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // const LogoUrl = './assets/Bluefin Immo_01.jpg.jpeg';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
    else if (formData.password.length < 6) newErrors.password = "Au moins 6 caractères";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    if (!formData.property_address) newErrors.property_address = "L'adresse de la propriété est requise";
    if (!formData.property_type) newErrors.property_type = "Le type de propriété est requis";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    let validationErrors = {};
    if (mode === 'login') validationErrors = validateLogin();
    else validationErrors = validateSignup();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const payload = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          user_type: 'hote',
          property_address: formData.property_address,
          property_type: formData.property_type,
        };
        const response = await register(payload);
        setSuccessMessage('Inscription réussie ! Redirection...');
        setTimeout(() => {
          if (onAuthSuccess) {
            onAuthSuccess(response?.user);
          } else {
            onNavigate?.({ name: 'host-dashboard' });
          }
        }, 1500);
      } else if (mode === 'login') {
        const response = await login(formData.email, formData.password);
        const userType = response?.user?.user_type;
        
        if (userType !== 'hote') {
          setErrors({ general: 'Cet espace est réservé aux hôtes. Veuillez utiliser un compte hôte.' });
          setLoading(false);
          return;
        }
        
        setSuccessMessage('Connexion réussie !');
        setTimeout(() => {
          if (onAuthSuccess) {
            onAuthSuccess(response?.user);
          } else {
            onNavigate?.({ name: 'host-dashboard' });
          }
        }, 1500);
      }
    } catch (err: any) {
      setErrors({ general: err.response?.data?.message || 'Erreur, veuillez réessayer' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#f4fffe]">
      {!hideBackButton && (
      // Dans HostOnlyAuthPage (à l'intérieur de BecomeHost ou dans le fichier pages.tsx)
<div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center gap-4 z-20">
  <button 
    onClick={() => {
      console.log('Retour button clicked');
      
      // Méthode 1: Essayer avec onNavigate
      if (onNavigate) {
        onNavigate({ name: 'become-host' });
      }
      
      // Méthode 2: Forcer la navigation directe après un court délai
      setTimeout(() => {
        // Vérifier si on est toujours sur la même page
        const currentPath = window.location.pathname;
        if (currentPath.includes('auth') || !currentPath.includes('become-host')) {
          console.log('🔍 Fallback: navigation forcée vers become-host');
          window.location.href = '/become-host';
        }
      }, 100);
    }} 
    className="p-2 rounded-full hover:bg-slate-100 transition-all duration-300 group"
  >
    <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-[#0F2940]" />
  </button>
  <h1 className="text-lg font-semibold text-[#0F2940]">
    {mode === 'login' ? 'Espace Hôte' : 'Devenir Hôte'}
  </h1>
</div>
      )}

      <div className="flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-md">
          {/* Card moderne avec effet glassmorphism léger */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="p-8 md:p-10">
              {/* Logo et titre */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#00c9a7]/10 to-[#0f2940]/10 p-1">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-white">
                    <img 
                      src={LogoUrl} 
                      alt="Bluefin-Immo" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<span class="text-3xl font-bold text-white bg-gradient-to-r from-[#00c9a7] to-[#0f2940] w-full h-full flex items-center justify-center">B</span>';
                        }
                      }}
                    />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-[#0F2940] mb-2">
                  {mode === 'login' ? 'Bon retour parmi nous' : 'Commencez votre aventure'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {mode === 'login' 
                    ? 'Connectez-vous à votre espace hôte' 
                    : 'Créez votre compte et partagez votre espace'}
                </p>
              </div>

              {/* Messages de statut */}
              {successMessage && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  <p className="text-sm text-emerald-700">{successMessage}</p>
                </div>
              )}
              
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              )}

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00c9a7] transition-colors" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Jean"
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] outline-none transition-all ${errors.firstName ? 'border-red-500 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'}`}
                          />
                        </div>
                        {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00c9a7] transition-colors" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Dupont"
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] outline-none transition-all ${errors.lastName ? 'border-red-500 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'}`}
                          />
                        </div>
                        {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00c9a7] transition-colors" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+229 XX XX XX XX"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:ring-2 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Adresse de la propriété</label>
                      <input
                        type="text"
                        name="property_address"
                        value={formData.property_address}
                        onChange={handleChange}
                        placeholder="Rue, quartier, ville"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] outline-none transition-all ${errors.property_address ? 'border-red-500 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'}`}
                      />
                      {errors.property_address && <p className="text-xs text-red-500 mt-1">{errors.property_address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Type de propriété</label>
                      <select
                        name="property_type"
                        value={formData.property_type}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] outline-none transition-all bg-slate-50/50 ${errors.property_type ? 'border-red-500' : 'border-slate-200'}`}
                      >
                        <option value="">Sélectionnez un type</option>
                        <option value="appartement">🏢 Appartement</option>
                        <option value="maison">🏠 Maison</option>
                        <option value="villa">🏰 Villa</option>
                        <option value="chambre">🛏️ Chambre privée</option>
                      </select>
                      {errors.property_type && <p className="text-xs text-red-500 mt-1">{errors.property_type}</p>}
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00c9a7] transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mot de passe</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00c9a7] transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] outline-none transition-all ${errors.password ? 'border-red-500 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'}`}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirmer mot de passe</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#00c9a7] transition-colors" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#00c9a7]/20 focus:border-[#00c9a7] outline-none transition-all ${errors.confirmPassword ? 'border-red-500 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'}`}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#00c9a7] to-[#0f2940] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Chargement...</span>
                    </div>
                  ) : mode === 'login' ? (
                    'Se connecter'
                  ) : (
                    'Créer mon compte hôte'
                  )}
                </button>
              </form>

              {/* Switch entre connexion et inscription */}
              <div className="text-center mt-8 pt-6 border-t border-slate-100">
                {mode === 'login' ? (
                  <p className="text-sm text-slate-500">
                    Pas encore de compte hôte ?{' '}
                    <button onClick={() => setMode('signup')} className="text-[#00c9a7] font-semibold hover:underline">
                      S'inscrire
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-slate-500">
                    Déjà un compte hôte ?{' '}
                    <button onClick={() => setMode('login')} className="text-[#00c9a7] font-semibold hover:underline">
                      Se connecter
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer moderne */}
          <p className="text-center text-xs text-slate-400 mt-6">
            En continuant, vous acceptez nos{' '}
            <button className="text-[#00c9a7] hover:underline">conditions générales</button>
          </p>
        </div>
      </div>
    </div>
  );
}


// ==================== AUTH PAGE (INSCRIPTION / CONNEXION) ====================

interface Route {
  name: string;
  id?: string;
  search?: string;
}

export function AuthPage({ onNavigate, onAuthSuccess, hideBackButton = false }: { onNavigate?: (route: Route) => void; onAuthSuccess?: (user: any) => void; hideBackButton?: boolean }) {
  const { login, register } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false); // Pour le mode forgot

  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || 'profile';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
    else if (formData.password.length < 6) newErrors.password = "Au moins 6 caractères";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    return newErrors;
  };

  const validateForgot = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    return newErrors;
  };

  const handleSuccessfulAuth = (userData: any) => {
    console.log('✅ Authentification réussie');
    
    const chatIntent = localStorage.getItem('redirect_intent');
    const propertyId = localStorage.getItem('redirect_property_id');
    const savedChatParams = localStorage.getItem('pendingChatParams');
    
    if (chatIntent === 'chat' && propertyId) {
      const params = savedChatParams || `property=${propertyId}`;
      localStorage.removeItem('redirect_intent');
      localStorage.removeItem('redirect_property_id');
      localStorage.removeItem('redirect_property_title');
      localStorage.removeItem('redirect_property_location');
      localStorage.removeItem('redirect_property_price');
      localStorage.removeItem('redirect_property_image');
      localStorage.removeItem('pendingChatParams');
      localStorage.removeItem('chatIntent');
      
      if (onNavigate) {
        onNavigate({ name: 'messages', id: 'inquiry', search: params });
      } else {
        window.location.href = `/messages/inquiry?${params}`;
      }
      return;
    }
    
    const bookingIntent = localStorage.getItem('redirect_intent');
    const bookingPropertyId = localStorage.getItem('redirect_property_id');
    
    if (bookingIntent === 'booking' && bookingPropertyId) {
      localStorage.removeItem('redirect_intent');
      if (onNavigate) {
        onNavigate({ name: 'listing', id: bookingPropertyId });
      } else {
        window.location.href = `/annonce/${bookingPropertyId}`;
      }
      return;
    }
    
    if (onAuthSuccess) {
      onAuthSuccess(userData);
    } else if (onNavigate) {
      onNavigate({ name: 'profile' });
    } else {
      window.location.href = '/profile';
    }
  };

  // ✅ Fonction pour réinitialiser le mot de passe (envoi d'email)
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForgot();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      // Essayer différents endpoints possibles
      let response;
      try {
        // Option 1: Endpoint standard
        response = await publicApi.post('/traveler/forgot-password', { email: formData.email });
      } catch (err: any) {
        if (err.response?.status === 404) {
          // Option 2: Autre endpoint possible
          response = await publicApi.post('/password/email', { email: formData.email });
        } else {
          throw err;
        }
      }
      
      setResetSent(true);
      setSuccessMessage(`Un email de réinitialisation a été envoyé à ${formData.email}`);
      toast.success('Email envoyé ! Vérifiez votre boîte de réception');
    } catch (err: any) {
      console.error('Erreur forgot password:', err);
      setErrors({ general: err.response?.data?.message || 'Impossible d\'envoyer l\'email. Vérifiez que l\'email existe.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');
    
    const validationErrors = mode === 'login' ? validateLogin() : validateSignup();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const payload = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          user_type: 'voyageur',
        };
        const response = await register(payload);
        setSuccessMessage('Inscription réussie ! Redirection...');
        setTimeout(() => handleSuccessfulAuth(response?.user), 1500);
      } else if (mode === 'login') {
        const response = await login(formData.email, formData.password);
        setSuccessMessage('Connexion réussie !');
        setTimeout(() => handleSuccessfulAuth(response?.user), 1500);
      }
    } catch (err: any) {
      console.error('Erreur:', err);
      
      if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        const errorMessages: string[] = [];
        Object.values(apiErrors).forEach((msgs: any) => {
          if (Array.isArray(msgs)) errorMessages.push(...msgs);
          else errorMessages.push(msgs);
        });
        setErrors({ general: errorMessages.join(', ') });
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
      } else {
        setErrors({ general: err.message || 'Erreur, veuillez réessayer' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4fffe] to-[#e8fffb]">
      {!hideBackButton && (
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center gap-4 z-20">
          <button onClick={() => onNavigate?.({ name: 'home' })} className="p-2 rounded-full hover:bg-gray-100 transition-all">
            <ArrowLeft className="w-5 h-5 text-[#0F2940]" />
          </button>
          <h1 className="text-xl font-semibold text-[#0F2940]">
            {mode === 'login' && 'Connexion'}
            {mode === 'signup' && 'Créer un compte'}
            {mode === 'forgot' && 'Mot de passe oublié'}
          </h1>
        </div>
      )}

      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              {mode === 'forgot' && resetSent ? (
                // Étape 2: Email envoyé avec succès
                <div>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0F2940] mb-2">Email envoyé !</h2>
                    <p className="text-sm text-gray-500">
                      Un lien de réinitialisation a été envoyé à <strong>{formData.email}</strong>
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Vérifiez vos spams si vous ne recevez rien dans les prochaines minutes.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setMode('login');
                      setResetSent(false);
                      setSuccessMessage('');
                    }}
                    className="w-full bg-[#00c9a7] text-white py-3 rounded-xl font-semibold hover:bg-[#00b892] transition"
                  >
                    Retour à la connexion
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg bg-white">
                      <img 
                        src={LogoUrl} 
                        alt="Bluefin-Immo" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<span class="text-2xl font-bold text-white bg-gradient-to-r from-[#00c9a7] to-[#0f2940] w-full h-full flex items-center justify-center">B</span>';
                          }
                        }}
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0F2940]">
                      {mode === 'login' && 'Bienvenue !'}
                      {mode === 'signup' && 'Rejoignez Bluefin-Immo'}
                      {mode === 'forgot' && 'Mot de passe oublié ?'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                      {mode === 'login' && 'Connectez-vous à votre compte voyageur'}
                      {mode === 'signup' && 'Créez votre compte voyageur en quelques secondes'}
                      {mode === 'forgot' && 'Entrez votre email pour réinitialiser votre mot de passe'}
                    </p>
                    
                    {(redirectTo === 'booking' || localStorage.getItem('redirect_intent') === 'booking') && (
                      <div className="mt-3 p-2 bg-amber-50 rounded-lg">
                        <p className="text-xs text-amber-700">🔄 Après connexion, vous serez redirigé pour finaliser votre réservation</p>
                      </div>
                    )}
                    
                    {localStorage.getItem('redirect_intent') === 'chat' && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700">💬 Après connexion, vous pourrez discuter avec l'hôte</p>
                      </div>
                    )}
                  </div>

                  {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                  )}
                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  <form onSubmit={mode === 'forgot' ? handleForgotPassword : handleSubmit} className="space-y-4">
                    {mode === 'signup' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className={`w-full pl-9 pr-3 py-2 border rounded-xl ${errors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                            />
                          </div>
                          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className={`w-full pl-9 pr-3 py-2 border rounded-xl ${errors.lastName ? 'border-red-500' : 'border-gray-200'}`}
                            />
                          </div>
                          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="votre@email.com"
                          className={`w-full pl-9 pr-3 py-2 border rounded-xl ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {mode === 'signup' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (optionnel)</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    {mode !== 'forgot' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-9 pr-10 py-2 border rounded-xl ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                      </div>
                    )}

                    {mode === 'signup' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer mot de passe *</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full pl-9 pr-10 py-2 border rounded-xl ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                      </div>
                    )}

                    {mode === 'login' && (
                      <div className="text-right">
                        <button type="button" onClick={() => setMode('forgot')} className="text-sm text-[#00c9a7] hover:underline">
                          Mot de passe oublié ?
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#00c9a7] to-[#0f2940] text-white py-2.5 rounded-xl font-semibold disabled:opacity-50 transition-all hover:shadow-lg"
                    >
                      {loading
                        ? 'Chargement...'
                        : mode === 'login'
                        ? 'Se connecter'
                        : mode === 'signup'
                        ? 'Créer mon compte voyageur'
                        : 'Envoyer le lien de réinitialisation'}
                    </button>
                  </form>

                  <div className="text-center mt-5">
                    {mode === 'login' && (
                      <p className="text-xs text-gray-500">
                        Pas encore de compte ?{' '}
                        <button onClick={() => setMode('signup')} className="text-[#00c9a7] font-medium hover:underline">
                          S'inscrire
                        </button>
                      </p>
                    )}
                    {mode === 'signup' && (
                      <p className="text-xs text-gray-500">
                        Déjà un compte ?{' '}
                        <button onClick={() => setMode('login')} className="text-[#00c9a7] font-medium hover:underline">
                          Se connecter
                        </button>
                      </p>
                    )}
                    {mode === 'forgot' && (
                      <p className="text-xs text-gray-500">
                        <button onClick={() => setMode('login')} className="text-[#00c9a7] font-medium hover:underline">
                          ← Retour à la connexion
                        </button>
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
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
        price: 150000,
        priceDisplay: "150 000 FCFA / nuit",
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
        price: 120000,
        priceDisplay: "120 000 FCFA / nuit",
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
        price: 95000,
        priceDisplay: "95 000 FCFA / nuit",
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
      if (selectedFilter === "Prix croissant") return filtered.sort((a,b) => (a.priceNumber || a.price || 0) - (b.priceNumber || b.price || 0));
      if (selectedFilter === "Prix décroissant") return filtered.sort((a,b) => (b.priceNumber || b.price || 0) - (a.priceNumber || a.price || 0));
      if (selectedFilter === "Mieux notés") return filtered.sort((a,b) => (b.rating || 0) - (a.rating || 0));
    return filtered;
  };

  const displayedProperties = filterProperties(hotelsData);

  const handleReserve = (property: HotelProperty) => {
      const total = (property.priceNumber || property.price || 0) * 2 * 1.1;
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
                  <img src={property.images?.[0] || property.image || '/placeholder.jpg'} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} />
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
        <CheckoutModal
          propertyId={checkoutData.property.id}
          propertyTitle={checkoutData.property.title || `Réservation #${checkoutData.property.id}`}
          checkIn={checkoutData.checkIn}
          checkOut={checkoutData.checkOut}
          guests={checkoutData.guests}
          totalPrice={checkoutData.totalPrice}
          onClose={() => setShowCheckout(false)}
          onSuccess={(id: number) => onNavigate?.({ name: 'confirmation', id: id.toString() })}
        />
      )}
    </div>
  );
}
// ==================== CITY PAGE ====================
export function CityPage({ onNavigate, city }: { onNavigate?: (route: Route) => void; city?: string }) {
  const [selectedFilter, setSelectedFilter] = useState("Tous");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();

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

  const categoryKey = city || 'portonovo';
  const category = cityCategories[categoryKey];

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

  const PropertyCard = ({ property, showDescription = false }: { property: any; showDescription?: boolean }) => {
    const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFavorite(property);
    };

    return (
      <div className="group cursor-pointer" onClick={() => handleNavigate({ name: 'listing', id: property.id.toString() })}>
        <div className="relative overflow-hidden rounded-2xl">
          <img src={property.images?.[0] || property.image || '/placeholder.jpg'} alt={property.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} />
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10 backdrop-blur-sm shadow-md"
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-200 ${
                isFavorite(property.id) 
                  ? 'fill-red-500 text-red-500 scale-110' 
                  : 'text-gray-700 hover:text-red-500'
              }`} 
            />
          </button>
        </div>
        <div className="mt-3">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-semibold text-[#0F2940] line-clamp-1">{property.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{property.location}</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="w-4 h-4 text-[#00c9a7] fill-current" />
              <span className="font-medium text-[#0F2940]">{property.rating}</span>
              <span>({property.reviews})</span>
            </div>
          </div>
          {showDescription && property.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{property.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
            {property.beds && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.beds} lit{property.beds > 1 ? 's' : ''}</span>
              </div>
            )}
            {property.baths && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.baths} sdb</span>
              </div>
            )}
          </div>
          <p className="mt-3 font-semibold text-[#0F2940]">{property.priceDisplay || `${property.price.toLocaleString()} FCFA`}</p>
        </div>
      </div>
    );
  };

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
    <div className="bg-white min-h-screen pb-16">
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


// pages/admin/AdminDashboardPage.tsx



const COLORS = ['#00c9a7', '#0f2940', '#ff6b6b', '#f5a623', '#4a90e2', '#9013fe'];

export function AdminDashboardPage({ onNavigate }: { onNavigate?: (route: any) => void }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboard(),
    refetchInterval: 30000,
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedCards({ all: true }), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage onRetry={() => refetch()} />;

  const resp: any = data?.data;
  const stats = resp?.stats || {};
  const activities = resp?.recent_activities || [];
  const chartData = resp?.chart_data || { labels: [], revenue: [], bookings: [], users: [] };
  const unreadCount = resp?.unread_notifications || 0;

  const revenueChartData = chartData.labels.map((label: string, idx: number) => ({
    day: label,
    revenue: chartData.revenue[idx] / 1000,
    bookings: chartData.bookings[idx],
    users: chartData.users[idx],
    averageValue: chartData.revenue[idx] / (chartData.bookings[idx] || 1),
  }));

  const conversionRate = stats.properties ? 
    ((stats.properties.approved || 0) / (stats.properties.pending + stats.properties.approved || 1) * 100).toFixed(1) : 0;
  const bookingSuccessRate = stats.bookings ?
    ((stats.bookings.completed || 0) / (stats.bookings.total || 1) * 100).toFixed(1) : 0;

  const topDestinations = resp?.top_destinations || [
    { city: 'Cotonou', count: 234, revenue: 45600000 },
    { city: 'Porto-Novo', count: 89, revenue: 12300000 },
    { city: 'Parakou', count: 56, revenue: 7800000 },
    { city: 'Abomey', count: 45, revenue: 6700000 },
    { city: 'Grand-Popo', count: 34, revenue: 5100000 },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête responsive */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 mb-6">
        <div className="w-full xs:w-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f2940] to-[#00c9a7] bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Aperçu global de la plateforme</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full xs:w-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="flex-1 xs:flex-none bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
          >
            <option value="week">7 jours</option>
            <option value="month">30 jours</option>
            <option value="year">12 mois</option>
          </select>
          <button
            onClick={() => refetch()}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="bg-white border border-gray-200 rounded-xl p-2 hover:bg-gray-50 transition relative"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border z-50">
                <div className="p-3 border-b font-semibold text-sm">Notifications</div>
                <div className="max-h-80 overflow-y-auto">
                  {activities.slice(0, 5).map((act: any, idx: number) => (
                    <div key={idx} className="p-3 hover:bg-gray-50 border-b text-sm">
                      <p className="text-sm">{act.title || act.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{act.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cartes stats - Grille responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6">
        <StatsCard
          icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Utilisateurs"
          value={stats.users?.total || 0}
          subValue={`+${stats.users?.new_today || 0} aujourd'hui`}
          trend={stats.users?.growth || 12}
          color="blue"
          animated={animatedCards.all}
        />
        <StatsCard
          icon={<Home className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Propriétés"
          value={stats.properties?.total || 0}
          subValue={`${stats.properties?.pending || 0} en attente`}
          trend={stats.properties?.growth || 8}
          color="green"
          animated={animatedCards.all}
        />
        <StatsCard
          icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Chiffre d'affaires"
          value={`${(stats.payments?.total_amount || 0).toLocaleString()} FCFA`}
          subValue={`+${(stats.payments?.today_amount || 0).toLocaleString()} FCFA`}
          trend={stats.payments?.growth || 15}
          color="purple"
          animated={animatedCards.all}
        />
        <StatsCard
          icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Réservations"
          value={stats.bookings?.confirmed || 0}
          subValue={`${stats.bookings?.pending_payment || 0} en attente`}
          trend={stats.bookings?.growth || 10}
          color="orange"
          animated={animatedCards.all}
        />
      </div>

      {/* Deuxième ligne stats - responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <MetricCard
          title="Taux de conversion"
          value={`${conversionRate}%`}
          subtitle="Propriétés approuvées"
          color="indigo"
          icon={<Activity className="w-5 h-5" />}
        />
        <MetricCard
          title="Satisfaction"
          value="4.9/5"
          subtitle="Moyenne des notes"
          color="emerald"
          icon={<Star className="w-5 h-5" />}
          stars
        />
        <MetricCard
          title="Taux de réussite"
          value={`${bookingSuccessRate}%`}
          subtitle="Réservations complétées"
          color="rose"
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <MetricCard
          title="Panier moyen"
          value={`${((stats.payments?.total_amount || 0) / (stats.bookings?.confirmed || 1)).toLocaleString()} FCFA`}
          subtitle="par réservation"
          color="amber"
          icon={<Wallet className="w-5 h-5" />}
        />
      </div>

      {/* Graphiques - Stack responsives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <ChartCard title="Évolution du CA" icon={<TrendingUp className="w-5 h-5" />}>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={revenueChartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c9a7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00c9a7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={window.innerWidth < 640 ? 2 : 0} />
              <YAxis tickFormatter={(value) => `${value}k`} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#00c9a7" fill="url(#revenueGradient)" name="CA (k FCFA)" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Réservations vs Utilisateurs" icon={<BarChart3 className="w-5 h-5" />}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={window.innerWidth < 640 ? 2 : 0} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="bookings" fill="#0f2940" name="Réservations" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" fill="#00c9a7" name="Nouveaux users" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Destinations et répartition - responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg lg:col-span-1">
          <h3 className="font-semibold text-base md:text-lg mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#00c9a7]" />
            Top Destinations
          </h3>
          <div className="space-y-3">
            {topDestinations.slice(0, 4).map((dest, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{dest.city}</p>
                    <p className="text-xs text-gray-400">{dest.count} réservations</p>
                  </div>
                </div>
                <p className="font-semibold text-[#00c9a7] text-sm">{(dest.revenue / 1000000).toFixed(1)}M FCFA</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg lg:col-span-2">
          <h3 className="font-semibold text-base md:text-lg mb-3 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#00c9a7]" />
            Répartition des propriétés
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <RePieChart>
                <Pie
                  data={[
                    { name: 'Appartements', value: 45, color: '#00c9a7' },
                    { name: 'Villas', value: 25, color: '#0f2940' },
                    { name: 'Studios', value: 15, color: '#ff6b6b' },
                    { name: 'Maisons', value: 10, color: '#f5a623' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Appartements', value: 45, color: '#00c9a7' },
                    { name: 'Villas', value: 25, color: '#0f2940' },
                    { name: 'Studios', value: 15, color: '#ff6b6b' },
                    { name: 'Maisons', value: 10, color: '#f5a623' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: 'Appartements', value: 45, color: '#00c9a7' },
                { label: 'Villas', value: 25, color: '#0f2940' },
                { label: 'Studios', value: 15, color: '#ff6b6b' },
                { label: 'Maisons', value: 10, color: '#f5a623' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs">{item.label}</span>
                  <span className="text-xs font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activités et alertes - responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg">
          <h3 className="font-semibold text-base md:text-lg mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00c9a7]" />
            Activités récentes
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {activities.slice(0, 8).map((act: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition text-sm">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  {act.type === 'property_submitted' && <Home className="w-4 h-4 text-orange-500" />}
                  {act.type === 'payment_received' && <CreditCard className="w-4 h-4 text-green-500" />}
                  {act.type === 'user_registered' && <UserPlus className="w-4 h-4 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{act.title || act.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg">
          <h3 className="font-semibold text-base md:text-lg mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#00c9a7]" />
            Actions rapides
          </h3>
          <div className="space-y-3">
            <ActionCard
              title="Propriétés en attente"
              count={stats.properties?.pending || 0}
              color="yellow"
              icon={<Home className="w-5 h-5" />}
              action={() => onNavigate?.({ name: 'admin-properties' })}
            />
            <ActionCard
              title="Paiements en attente"
              count={stats.bookings?.pending_payment || 0}
              color="red"
              icon={<CreditCard className="w-5 h-5" />}
              action={() => onNavigate?.({ name: 'admin-payments' })}
            />
            <ActionCard
              title="Utilisateurs à vérifier"
              count={stats.users?.pending_verification || 0}
              color="green"
              icon={<Users className="w-5 h-5" />}
              action={() => onNavigate?.({ name: 'admin-users' })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants auxiliaires responsives
const StatsCard = ({ icon, title, value, subValue, trend, color, animated }: any) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 text-white transform transition-all duration-500 hover:scale-105`}>
      <div className="flex justify-between items-start">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        {trend && <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">↑ {trend}%</span>}
      </div>
      <p className="text-white/80 text-xs sm:text-sm mt-2">{title}</p>
      <p className="text-lg sm:text-xl md:text-2xl font-bold mt-0.5">{value}</p>
      <p className="text-white/60 text-xs mt-1 truncate">{subValue}</p>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, color, icon, stars }: any) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600',
    rose: 'from-rose-500 to-rose-600',
    amber: 'from-amber-500 to-amber-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-3 sm:p-4 text-white hover:scale-105 transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div>{icon}</div>
        {stars && (
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 fill-yellow-300 text-yellow-300" />
            ))}
          </div>
        )}
      </div>
      <p className="text-white/80 text-xs mt-2">{title}</p>
      <p className="text-xl sm:text-2xl font-bold mt-0.5">{value}</p>
      <p className="text-white/60 text-xs mt-1">{subtitle}</p>
    </div>
  );
};

const ChartCard = ({ title, icon, children }: any) => (
  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg">
    <div className="flex items-center gap-2 mb-3">
      <div className="text-[#00c9a7]">{icon}</div>
      <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
    </div>
    {children}
  </div>
);

const ActionCard = ({ title, count, color, icon, action }: any) => {
  const colorClasses = {
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
    red: 'from-red-50 to-red-100 border-red-200',
    green: 'from-green-50 to-green-100 border-green-200',
  };

  const textColors = {
    yellow: 'text-yellow-800',
    red: 'text-red-800',
    green: 'text-green-800',
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl p-3 flex items-center justify-between border`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full bg-white/50 flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className={`font-medium text-sm ${textColors[color]}`}>{title}</p>
          <p className={`text-xs ${textColors[color]} opacity-75`}>{count} élément(s)</p>
        </div>
      </div>
      <button
        onClick={action}
        className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium hover:shadow transition"
      >
        Voir
      </button>
    </div>
  );
};

const ErrorMessage = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <div className="text-red-500 text-xl mb-4">⚠️ Erreur de chargement</div>
    <p className="text-gray-600 text-sm text-center mb-6">Impossible de charger les données</p>
    <button onClick={onRetry} className="px-6 py-2 bg-[#00c9a7] text-white rounded-full">Réessayer</button>
  </div>
);

// pages/admin/AdminPropertiesPage.tsx


export function AdminPropertiesPage({ onNavigate }: { onNavigate?: (route: any) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-pending-properties'],
    queryFn: () => adminService.getPendingProperties(),
    refetchInterval: 10000,
  });
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: ({ id, notes, featured }: { id: number; notes?: string; featured?: boolean }) =>
      adminService.approveProperty(id, notes, featured),
    onSuccess: () => {
      toast.success('Propriété approuvée avec succès');
      queryClient.invalidateQueries({ queryKey: ['admin-pending-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setSelectedProperty(null);
      refetch();
    },
    onError: () => toast.error('Erreur lors de l’approbation'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      adminService.rejectProperty(id, reason),
    onSuccess: () => {
      toast.success('Propriété rejetée');
      queryClient.invalidateQueries({ queryKey: ['admin-pending-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setSelectedProperty(null);
      refetch();
    },
    onError: () => toast.error('Erreur lors du rejet'),
  });

  if (isLoading) return <LoadingSkeleton />;
  
  const payload = data ?? {};
  const properties = Array.isArray(payload)
    ? payload
    : payload.data ?? payload.data?.data ?? [];
  const stats = payload.stats ?? payload.data?.stats ?? { total_pending: 0, pending_today: 0 };
  
  const filteredProperties = properties.filter((property: any) => {
    return searchTerm === '' || 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleApprove = (property: any) => {
    const notes = prompt("Ajouter une note (optionnelle) :");
    approveMutation.mutate({ id: property.id, notes: notes || undefined, featured: false });
  };

  const handleReject = (property: any) => {
    const reason = prompt("Raison du rejet (requise) :");
    if (reason && reason.length >= 10) {
      rejectMutation.mutate({ id: property.id, reason });
    } else if (reason) {
      toast.error('La raison doit contenir au moins 10 caractères');
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f2940] to-[#00c9a7] bg-clip-text text-transparent">
          Modération des propriétés
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Validez ou rejetez les annonces en attente</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard 
          icon={<Home className="w-5 h-5" />} 
          label="En attente" 
          value={stats.total_pending || 0} 
          color="yellow"
        />
        <StatCard 
          icon={<Calendar className="w-5 h-5" />} 
          label="Aujourd'hui" 
          value={stats.pending_today || 0} 
          color="blue"
        />
        <StatCard 
          icon={<Users className="w-5 h-5" />} 
          label="Hôtes" 
          value={new Set(properties.map((p: any) => p.user_id)).size} 
          color="green"
        />
        <StatCard 
          icon={<MapPin className="w-5 h-5" />} 
          label="Villes" 
          value={new Set(properties.map((p: any) => p.city)).size} 
          color="purple"
        />
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, ville ou hôte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
          />
        </div>
      </div>

      {/* Liste des propriétés */}
      <div className="space-y-4">
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
            <Home className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune propriété en attente de modération</p>
          </div>
        ) : (
          filteredProperties.map((property: any) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={() => setSelectedProperty(property)}
              onApprove={() => handleApprove(property)}
              onReject={() => handleReject(property)}
              onNavigate={onNavigate}
            />
          ))
        )}
      </div>

      {/* Modal de détail */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onApprove={() => handleApprove(selectedProperty)}
          onReject={() => handleReject(selectedProperty)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

// pages/admin/AdminUsersPage.tsx

export function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getUsers(),
    refetchInterval: 30000,
  });
  const queryClient = useQueryClient();

  const suspendMutation = useMutation({
    mutationFn: ({ id, days }: { id: number; days: number }) => adminService.suspendUser(id, days),
    onSuccess: () => {
      toast.success('Utilisateur suspendu');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      refetch();
    },
    onError: () => toast.error('Erreur'),
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => adminService.activateUser(id),
    onSuccess: () => {
      toast.success('Utilisateur activé');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      refetch();
    },
    onError: () => toast.error('Erreur'),
  });

  if (isLoading) return <LoadingSkeleton />;
  
  const users = data?.data || data || [];
  
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = searchTerm === '' || 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.user_type === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u: any) => u.is_active).length,
    inactive: users.filter((u: any) => !u.is_active).length,
    hosts: users.filter((u: any) => u.user_type === 'hote').length,
    travelers: users.filter((u: any) => u.user_type === 'voyageur').length,
    admins: users.filter((u: any) => u.user_type === 'admin').length,
    newThisWeek: users.filter((u: any) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(u.created_at) > weekAgo;
    }).length,
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f2940] to-[#00c9a7] bg-clip-text text-transparent">
          Gestion des utilisateurs
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Gérez et modérez les utilisateurs de la plateforme</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 mb-6">
        <StatBadge label="Total" value={stats.total} color="gray" />
        <StatBadge label="Actifs" value={stats.active} color="green" />
        <StatBadge label="Inactifs" value={stats.inactive} color="red" />
        <StatBadge label="Hôtes" value={stats.hosts} color="blue" />
        <StatBadge label="Voyageurs" value={stats.travelers} color="purple" />
        <StatBadge label="Admins" value={stats.admins} color="orange" />
        <StatBadge label="Nouveaux" value={stats.newThisWeek} color="emerald" icon={<UserPlus className="w-3 h-3" />} />
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
            >
              <option value="all">Tous les rôles</option>
              <option value="voyageur">Voyageurs</option>
              <option value="hote">Hôtes</option>
              <option value="admin">Administrateurs</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
            >
              <option value="all">Tous statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
            <button
              onClick={() => refetch()}
              className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          filteredUsers.map((user: any) => (
            <UserCard
              key={user.id}
              user={user}
              onView={() => setSelectedUser(user)}
              onSuspend={() => {
                const days = parseInt(prompt("Durée de suspension (jours) :", "30") || "30");
                if (!isNaN(days) && days > 0) suspendMutation.mutate({ id: user.id, days });
              }}
              onActivate={() => activateMutation.mutate(user.id)}
            />
          ))
        )}
      </div>

      {/* Modal de détail */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}

// Composant de carte utilisateur
const UserCard = ({ user, onView, onSuspend, onActivate }: any) => {
  const roleColors = {
    voyageur: 'bg-blue-100 text-blue-700',
    hote: 'bg-green-100 text-green-700',
    admin: 'bg-purple-100 text-purple-700',
  };

  const getInitials = () => {
    return `${(user.first_name || '')?.charAt(0) || ''}${(user.last_name || '')?.charAt(0) || ''}`.toUpperCase() || '?';
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00c9a7] to-[#0f2940] flex items-center justify-center text-white font-bold text-lg shrink-0">
            {getInitials()}
          </div>
          <div className="sm:hidden">
            <p className="font-semibold">{user.first_name} {user.last_name}</p>
            <p className="text-xs text-gray-500">{user.user_type}</p>
          </div>
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <div className="hidden sm:block">
            <p className="font-semibold">{user.first_name} {user.last_name}</p>
            <p className="text-sm text-gray-500">{user.user_type}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-3 h-3" />
              <span className="text-xs truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-3 h-3" />
              <span className="text-xs">{user.phone || 'Non renseigné'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">Inscrit le {new Date(user.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Statut et actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-500 hidden sm:inline">{user.is_active ? 'Actif' : 'Suspendu'}</span>
          </div>
          
          <button
            onClick={onView}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {user.is_active ? (
            <button
              onClick={onSuspend}
              className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition"
              title="Suspendre"
            >
              <Ban className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onActivate}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
              title="Activer"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal de détail utilisateur
const UserDetailModal = ({ user, onClose }: any) => {
  const getInitials = () => {
    return `${(user.first_name || '')?.charAt(0) || ''}${(user.last_name || '')?.charAt(0) || ''}`.toUpperCase() || '?';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">Détails de l'utilisateur</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">✕</button>
        </div>

        <div className="p-5 space-y-5">
          {/* En-tête avec avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00c9a7] to-[#0f2940] flex items-center justify-center text-white font-bold text-2xl">
              {getInitials()}
            </div>
            <div>
              <p className="text-xl font-bold">{user.first_name} {user.last_name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.user_type === 'hote' ? 'bg-green-100 text-green-700' :
                  user.user_type === 'voyageur' ? 'bg-blue-100 text-blue-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {user.user_type === 'hote' ? 'Hôte' : user.user_type === 'voyageur' ? 'Voyageur' : 'Admin'}
                </span>
                <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">{user.is_active ? 'Actif' : 'Suspendu'}</span>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold text-sm mb-3">👤 Informations personnelles</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nom complet</span>
                <span className="font-medium">{user.first_name} {user.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-mono text-xs">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Téléphone</span>
                <span>{user.phone || 'Non renseigné'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Inscrit le</span>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dernière connexion</span>
                <span>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Jamais'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vérifié</span>
                <span>{user.verification_status === 'verified' ? '✅ Oui' : '❌ Non'}</span>
              </div>
            </div>
          </div>

          {/* Statistiques utilisateur */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold text-sm mb-3">📊 Statistiques</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white rounded-lg p-2">
                <p className="text-lg font-bold text-[#00c9a7]">{user.total_properties || 0}</p>
                <p className="text-xs text-gray-500">Propriétés</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-lg font-bold text-[#00c9a7]">{user.total_bookings || 0}</p>
                <p className="text-xs text-gray-500">Réservations</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-lg font-bold text-[#00c9a7]">{user.total_reviews || 0}</p>
                <p className="text-xs text-gray-500">Avis</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-lg font-bold text-[#00c9a7]">{user.average_rating || 0}★</p>
                <p className="text-xs text-gray-500">Note moyenne</p>
              </div>
            </div>
          </div>

          {/* Historique des suspensions */}
          {user.suspended_until && (
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-700">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-medium">Compte suspendu jusqu'au {new Date(user.suspended_until).toLocaleDateString()}</p>
              </div>
              {user.suspension_reason && (
                <p className="text-xs text-yellow-600 mt-2">Raison : {user.suspension_reason}</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white p-4 border-t flex gap-3">
          {user.is_active ? (
            <button
              onClick={() => {
                const days = parseInt(prompt("Durée de suspension (jours) :", "30") || "30");
                if (!isNaN(days) && days > 0) {
                  window.location.reload();
                }
              }}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              <Ban className="w-5 h-5 inline mr-2" />
              Suspendre
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition"
            >
              <UserCheck className="w-5 h-5 inline mr-2" />
              Activer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// pages/admin/AdminBookingPage.tsx


export function AdminBookingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => adminService.getBookings(),
  });
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: (id: number) => adminService.cancelBooking(id),
    onSuccess: () => {
      toast.success('Réservation annulée');
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      refetch();
    },
    onError: () => toast.error('Erreur'),
  });

  if (isLoading) return <LoadingSkeleton />;
  
  const bookings = data?.data?.data || [];
  
  const filteredBookings = bookings.filter((booking: any) => {
    const matchesSearch = searchTerm === '' || 
      booking.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.booking_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b: any) => b.booking_status === 'confirmed').length,
    pending: bookings.filter((b: any) => b.booking_status === 'pending').length,
    completed: bookings.filter((b: any) => b.booking_status === 'completed').length,
    cancelled: bookings.filter((b: any) => b.booking_status === 'cancelled').length,
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête responsive */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f2940] to-[#00c9a7] bg-clip-text text-transparent">
          Réservations
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Gérez toutes les réservations de la plateforme</p>
      </div>

      {/* Statistiques - grille responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 mb-5">
        <StatBadge label="Total" value={stats.total} color="gray" />
        <StatBadge label="Confirmées" value={stats.confirmed} color="green" />
        <StatBadge label="En attente" value={stats.pending} color="yellow" />
        <StatBadge label="Terminées" value={stats.completed} color="blue" />
        <StatBadge label="Annulées" value={stats.cancelled} color="red" />
      </div>

      {/* Recherche et filtres - responsive */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
            >
              <option value="all">Tous</option>
              <option value="confirmed">Confirmées</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminées</option>
              <option value="cancelled">Annulées</option>
            </select>
            <button
              onClick={() => refetch()}
              className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Liste des réservations - responsive */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune réservation trouvée</p>
          </div>
        ) : (
          filteredBookings.map((booking: any) => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              isExpanded={expandedId === booking.id}
              onToggle={() => toggleExpand(booking.id)}
              onCancel={() => {
                if (confirm("Annuler cette réservation ?")) cancelMutation.mutate(booking.id);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Composant de carte réservation responsive
const BookingCard = ({ booking, isExpanded, onToggle, onCancel }: any) => {
  const statusConfig = {
    confirmed: { color: 'green', icon: CheckCircle, label: 'Confirmée' },
    pending: { color: 'yellow', icon: Clock, label: 'En attente' },
    completed: { color: 'blue', icon: CheckCircle, label: 'Terminée' },
    cancelled: { color: 'red', icon: XCircle, label: 'Annulée' },
  };
  
  const config = statusConfig[booking.booking_status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* En-tête de la carte - toujours visible */}
      <div 
        className="p-3 sm:p-4 cursor-pointer hover:bg-gray-50 transition"
        onClick={onToggle}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className={`w-10 h-10 rounded-xl bg-${config.color}-100 flex items-center justify-center shrink-0`}>
              <StatusIcon className={`w-5 h-5 text-${config.color}-600`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded">
                  #{booking.booking_reference?.slice(-8)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full bg-${config.color}-100 text-${config.color}-700`}>
                  {config.label}
                </span>
              </div>
              <p className="font-semibold text-gray-800 text-sm mt-1 truncate">{booking.property?.title}</p>
              <p className="text-xs text-gray-500">{booking.property?.district}</p>
            </div>
          </div>
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="text-left sm:text-right">
              <p className="text-base sm:text-lg font-bold text-[#00c9a7]">{booking.total_amount?.toLocaleString()} FCFA</p>
              <p className="text-xs text-gray-400">{booking.check_in} → {booking.check_out}</p>
            </div>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </div>

      {/* Détails étendus */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-3 sm:p-4 bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Voyageur */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[#00c9a7]" />
                <h4 className="font-semibold text-sm">Voyageur</h4>
              </div>
              <p className="font-medium text-sm">{booking.user?.full_name}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <Mail className="w-3 h-3" />
                <span className="truncate">{booking.user?.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <Phone className="w-3 h-3" />
                <span>{booking.user?.phone || 'Non renseigné'}</span>
              </div>
            </div>

            {/* Détails séjour */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-[#00c9a7]" />
                <h4 className="font-semibold text-sm">Séjour</h4>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Arrivée</span>
                  <span className="font-medium">{booking.check_in}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Départ</span>
                  <span className="font-medium">{booking.check_out}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nuits</span>
                  <span className="font-medium">{booking.nights_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Voyageurs</span>
                  <span className="font-medium">{booking.guests_count || 1}</span>
                </div>
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-[#00c9a7]" />
                <h4 className="font-semibold text-sm">Paiement</h4>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Méthode</span>
                  <span className="font-medium capitalize">{booking.payment_method || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Statut</span>
                  <span className={`font-medium ${booking.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {booking.payment_status === 'paid' ? 'Payé' : 'En attente'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {booking.booking_status !== 'cancelled' && booking.booking_status !== 'completed' && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={onCancel}
                className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Composant de badge statistique responsive
const StatBadge = ({ label, value, color }: { label: string; value: number; color: string }) => {
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`rounded-lg sm:rounded-xl p-2 sm:p-3 text-center ${colorClasses[color]}`}>
      <p className="text-lg sm:text-2xl font-bold">{value}</p>
      <p className="text-xs hidden sm:block">{label}</p>
      <p className="text-[10px] sm:hidden">{label.slice(0, 3)}</p>
    </div>
  );
};


// pages/admin/AdminPayementsPage.tsx


export function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: () => adminService.getPayments(),
    refetchInterval: 30000,
  });

  if (isLoading) return <LoadingSkeleton />;
  
  const allPayments = data?.data?.data || [];
  
  const filteredPayments = allPayments.filter((payment: any) => {
    const matchesSearch = searchTerm === '' || 
      payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.booking?.booking_reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: allPayments.length,
    totalAmount: allPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
    success: allPayments.filter((p: any) => p.status === 'success').length,
    pending: allPayments.filter((p: any) => p.status === 'pending').length,
    failed: allPayments.filter((p: any) => p.status === 'failed').length,
    today: allPayments.filter((p: any) => {
      const today = new Date().toDateString();
      return new Date(p.created_at).toDateString() === today;
    }).reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
  };

  const successRate = stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : 0;

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f2940] to-[#00c9a7] bg-clip-text text-transparent">
          Suivi des paiements
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Analysez et gérez toutes les transactions financières</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
        <StatCard icon={<CreditCard className="w-5 h-5" />} label="Transactions" value={stats.total} color="blue" />
        <StatCard icon={<Wallet className="w-5 h-5" />} label="Volume total" value={`${(stats.totalAmount / 1000000).toFixed(1)}M`} color="purple" subValue="FCFA" />
        <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Succès" value={stats.success} color="green" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="En attente" value={stats.pending} color="yellow" />
        <StatCard icon={<XCircle className="w-5 h-5" />} label="Échouées" value={stats.failed} color="red" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Taux succès" value={`${successRate}%`} color="emerald" />
      </div>

      {/* Résumé quotidien */}
      <div className="bg-gradient-to-r from-[#00c9a7] to-[#0f2940] rounded-xl sm:rounded-2xl p-4 mb-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <p className="text-white/80 text-sm">Transactions aujourd'hui</p>
            <p className="text-2xl font-bold">{stats.today.toLocaleString()} FCFA</p>
          </div>
          <div className="flex gap-4">
            <div>
              <p className="text-white/80 text-xs">Moyenne par jour</p>
              <p className="text-lg font-semibold">{((stats.totalAmount / 30) || 0).toLocaleString()} FCFA</p>
            </div>
            <div>
              <p className="text-white/80 text-xs">Meilleur jour</p>
              <p className="text-lg font-semibold">{Math.max(...allPayments.map((p: any) => p.amount || 0)).toLocaleString()} FCFA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par transaction ID ou réservation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
            >
              <option value="all">Tous statuts</option>
              <option value="success">Succès</option>
              <option value="pending">En attente</option>
              <option value="failed">Échoué</option>
            </select>
            <button
              onClick={() => refetch()}
              className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="space-y-3">
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune transaction trouvée</p>
          </div>
        ) : (
          filteredPayments.map((payment: any, idx: number) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              index={idx}
              onView={() => setSelectedPayment(payment)}
            />
          ))
        )}
      </div>

      {/* Modal de détails */}
      {selectedPayment && (
        <PaymentDetailModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
}

// Composant de carte paiement
const PaymentCard = ({ payment, index, onView }: any) => {
  const statusConfig = {
    success: { color: 'green', icon: CheckCircle, label: 'Succès' },
    pending: { color: 'yellow', icon: Clock, label: 'En attente' },
    failed: { color: 'red', icon: XCircle, label: 'Échoué' },
  };
  
  const config = statusConfig[payment.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className={`w-10 h-10 rounded-xl bg-${config.color}-100 flex items-center justify-center shrink-0`}>
            <StatusIcon className={`w-5 h-5 text-${config.color}-600`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded">
                {payment.transaction_id?.slice(-12)}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full bg-${config.color}-100 text-${config.color}-700`}>
                {config.label}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              {payment.booking?.property?.title || 'Réservation'}
            </p>
            <p className="text-xs text-gray-500">Réf: {payment.booking?.booking_reference || '-'}</p>
          </div>
        </div>
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div className="text-left sm:text-right">
            <p className="text-base sm:text-lg font-bold text-[#00c9a7]">{payment.amount?.toLocaleString()} FCFA</p>
            <div className="flex items-center gap-1 mt-1">
              <Smartphone className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-400">{payment.payment_method || 'Mobile Money'}</p>
            </div>
          </div>
          <button
            onClick={onView}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de détails du paiement
const PaymentDetailModal = ({ payment, onClose }: any) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b sticky top-0 bg-white">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Détails du paiement</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">✕</button>
          </div>
        </div>
        
        <div className="p-5 space-y-4">
          {/* Montant */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">Montant total</p>
            <p className="text-3xl font-bold text-[#00c9a7]">{payment.amount?.toLocaleString()} FCFA</p>
          </div>

          {/* Détails */}
          <div className="space-y-3">
            <DetailRow label="Transaction ID" value={payment.transaction_id} />
            <DetailRow label="Réservation" value={payment.booking?.booking_reference} />
            <DetailRow label="Propriété" value={payment.booking?.property?.title} />
            <DetailRow label="Voyageur" value={payment.booking?.user?.full_name} />
            <DetailRow label="Méthode" value={payment.payment_method || 'Mobile Money'} />
            <DetailRow label="Statut" value={payment.status} status />
            <DetailRow label="Date" value={new Date(payment.created_at).toLocaleString()} />
            {payment.paid_at && <DetailRow label="Payé le" value={new Date(payment.paid_at).toLocaleString()} />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de ligne de détail
const DetailRow = ({ label, value, status }: any) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-sm text-gray-500">{label}</span>
    {status ? (
      <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
        value === 'success' ? 'bg-green-100 text-green-700' :
        value === 'pending' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {value === 'success' ? 'Succès' : value === 'pending' ? 'En attente' : 'Échoué'}
      </span>
    ) : (
      <span className="text-sm font-medium text-gray-800">{value || '-'}</span>
    )}
  </div>
);



export function AdminMessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [filterType, setFilterType] = useState<'all' | 'flagged' | 'unread'>('all');
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => adminService.getMessages(),
    refetchInterval: 15000,
  });

  if (isLoading) return <LoadingSkeleton />;
  
  const allMessages = data?.data?.data || [];
  
  const filteredMessages = allMessages.filter((msg: any) => {
    const matchesSearch = searchTerm === '' || 
      msg.sender?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.receiver?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'flagged') return matchesSearch && msg.is_flagged;
    if (filterType === 'unread') return matchesSearch && !msg.is_read;
    return matchesSearch;
  });

  const stats = {
    total: allMessages.length,
    unread: allMessages.filter((m: any) => !m.is_read).length,
    flagged: allMessages.filter((m: any) => m.is_flagged).length,
    today: allMessages.filter((m: any) => {
      const today = new Date().toDateString();
      return new Date(m.created_at).toDateString() === today;
    }).length,
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f2940] to-[#00c9a7] bg-clip-text text-transparent">
          Surveillance des messages
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Analysez et modérez les conversations entre utilisateurs</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<MessageCircle className="w-5 h-5" />} label="Total messages" value={stats.total} color="blue" />
        <StatCard icon={<Mail className="w-5 h-5" />} label="Non lus" value={stats.unread} color="yellow" />
        <StatCard icon={<Flag className="w-5 h-5" />} label="Signalés" value={stats.flagged} color="red" />
        <StatCard icon={<Calendar className="w-5 h-5" />} label="Aujourd'hui" value={stats.today} color="green" />
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par expéditeur, destinataire ou contenu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
            />
          </div>
          <div className="flex gap-2">
            <FilterButton active={filterType === 'all'} onClick={() => setFilterType('all')} label="Tous" />
            <FilterButton active={filterType === 'unread'} onClick={() => setFilterType('unread')} label="Non lus" />
            <FilterButton active={filterType === 'flagged'} onClick={() => setFilterType('flagged')} label="Signalés" />
            <button
              onClick={() => refetch()}
              className="px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Liste des messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Colonne gauche - Liste */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredMessages.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Aucun message trouvé</p>
            </div>
          ) : (
            filteredMessages.map((msg: any, idx: number) => (
              <MessageCard
                key={msg.id}
                message={msg}
                isSelected={selectedMessage?.id === msg.id}
                onClick={() => setSelectedMessage(msg)}
              />
            ))
          )}
        </div>

        {/* Colonne droite - Détails du message */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden sticky top-4 h-[600px] flex flex-col">
          {selectedMessage ? (
            <MessageDetail message={selectedMessage} onClose={() => setSelectedMessage(null)} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6">
              <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-center">Sélectionnez un message<br />pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant de carte message
const MessageCard = ({ message, isSelected, onClick }: any) => {
  const isUnread = !message.is_read;
  const isFlagged = message.is_flagged;
  
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-3 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-[#00c9a7] shadow-lg' : 'shadow-sm'
      } ${isUnread ? 'border-l-4 border-l-[#00c9a7]' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00c9a7] to-[#0f2940] flex items-center justify-center text-white font-bold shrink-0">
          {message.sender?.full_name?.charAt(0) || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{message.sender?.full_name || 'Inconnu'}</p>
              <p className="text-xs text-gray-500 truncate">→ {message.receiver?.full_name || 'Inconnu'}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              {isFlagged && <Flag className="w-3 h-3 text-red-500 fill-red-500" />}
              {isUnread && <div className="w-2 h-2 rounded-full bg-[#00c9a7] animate-pulse"></div>}
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{message.message}</p>
          <p className="text-xs text-gray-400 mt-1">{formatDate(message.created_at)}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
      </div>
    </div>
  );
};

// Composant de détail du message
const MessageDetail = ({ message, onClose }: any) => {
  const [showFullMessage, setShowFullMessage] = useState(false);
  
  return (
    <>
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00c9a7] to-[#0f2940] flex items-center justify-center text-white font-bold">
            {message.sender?.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-semibold text-sm">{message.sender?.full_name || 'Expéditeur inconnu'}</p>
            <p className="text-xs text-gray-500">{message.sender?.email || 'Email non disponible'}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Informations de l'expéditeur */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-4 h-4 text-[#00c9a7]" />
            <p className="font-semibold text-sm">Informations expéditeur</p>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Nom complet</span>
              <span className="font-medium">{message.sender?.full_name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-sm">{message.sender?.email || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Téléphone</span>
              <span className="font-medium">{message.sender?.phone || '-'}</span>
            </div>
          </div>
        </div>

        {/* Informations destinataire */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-4 h-4 text-[#00c9a7]" />
            <p className="font-semibold text-sm">Informations destinataire</p>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Nom complet</span>
              <span className="font-medium">{message.receiver?.full_name || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{message.receiver?.email || '-'}</span>
            </div>
          </div>
        </div>

        {/* Contenu du message */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-4 h-4 text-[#00c9a7]" />
            <p className="font-semibold text-sm">Contenu du message</p>
          </div>
          <div className={`text-sm text-gray-700 leading-relaxed ${showFullMessage ? '' : 'max-h-32 overflow-hidden relative'}`}>
            <p className="whitespace-pre-wrap break-words">{message.message}</p>
            {!showFullMessage && message.message?.length > 200 && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
            )}
          </div>
          {message.message?.length > 200 && (
            <button
              onClick={() => setShowFullMessage(!showFullMessage)}
              className="text-xs text-[#00c9a7] mt-2 hover:underline"
            >
              {showFullMessage ? 'Voir moins' : 'Voir plus'}
            </button>
          )}
        </div>

        {/* Métadonnées */}
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-4 h-4 text-[#00c9a7]" />
            <p className="font-semibold text-sm">Métadonnées</p>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Date d'envoi</span>
              <span className="font-medium">{formatDateTime(message.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Lu le</span>
              <span className="font-medium">{message.read_at ? formatDateTime(message.read_at) : 'Non lu'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t bg-gray-50 flex gap-2">
        <button className="flex-1 px-3 py-2 bg-[#00c9a7] text-white rounded-lg text-sm hover:bg-[#00b892] transition flex items-center justify-center gap-2">
          <Reply className="w-4 h-4" />
          Répondre
        </button>
        {!message.is_flagged && (
          <button className="px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition">
            <Flag className="w-4 h-4" />
          </button>
        )}
      </div>
    </>
  );
};

// Composant de carte statistique
const StatCard = ({ icon, label, value, color }: any) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-3 text-white`}>
      <div className="flex justify-between items-center">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xl font-bold">{value}</span>
      </div>
      <p className="text-white/80 text-xs mt-2">{label}</p>
    </div>
  );
};

// Bouton de filtre
const FilterButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-xl text-sm transition ${
      active ? 'bg-[#00c9a7] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

// Utilitaires de formatage
const formatDate = (date: string) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours} h`;
  if (days < 7) return `Il y a ${days} j`;
  return d.toLocaleDateString('fr-FR');
};

const formatDateTime = (date: string) => {
  const d = new Date(date);
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// src/app/pages/admin/AdminReportsPage.tsx


export function AdminReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'annual' | 'custom'>('monthly');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'users' | 'properties'>('overview');
  
  // États pour les modales
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-reports-summary', selectedPeriod, customStartDate, customEndDate],
    queryFn: () => adminService.getSummaryReport({
      period: selectedPeriod,
      start_date: customStartDate,
      end_date: customEndDate,
    }),
  });
  
  // Requête pour les propriétés détaillées
  const { data: propertiesData, refetch: refetchProperties } = useQuery({
    queryKey: ['admin-reports-properties', selectedPeriod, customStartDate, customEndDate],
    queryFn: () => adminService.getPropertiesReport({
      period: selectedPeriod,
      start_date: customStartDate,
      end_date: customEndDate,
    }),
    enabled: false,
  });
  
  // Requête pour les utilisateurs détaillés
  const { data: usersData, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-reports-users', selectedPeriod, customStartDate, customEndDate],
    queryFn: () => adminService.getUsersReport({
      period: selectedPeriod,
      start_date: customStartDate,
      end_date: customEndDate,
    }),
    enabled: false,
  });
  
  // Requête pour les réservations détaillées
  const { data: bookingsData, refetch: refetchBookings } = useQuery({
    queryKey: ['admin-reports-bookings', selectedPeriod, customStartDate, customEndDate],
    queryFn: () => adminService.getBookingsReport({
      period: selectedPeriod,
      start_date: customStartDate,
      end_date: customEndDate,
    }),
    enabled: false,
  });

  if (isLoading) return <LoadingSkeleton />;

  const report = data?.data || {};
console.log('📊 Report complet dans AdminReportsPage:', report);
console.log('📊 total_properties:', report.total_properties);
console.log('📊 total_users:', report.total_users);
console.log('📊 total_bookings:', report.total_bookings);
console.log('📊 total_revenue:', report.total_revenue);
  

  
  // Données pour les graphiques
  const chartData = report.chart_data?.labels?.map((label: string, idx: number) => ({
    name: label,
    revenue: report.chart_data?.revenue?.[idx] || 0,
    users: report.chart_data?.users?.[idx] || 0,
    bookings: report.chart_data?.bookings?.[idx] || 0,
  })) || [
    { name: 'Lun', revenue: 0, users: 0, bookings: 0 },
    { name: 'Mar', revenue: 0, users: 0, bookings: 0 },
    { name: 'Mer', revenue: 0, users: 0, bookings: 0 },
    { name: 'Jeu', revenue: 0, users: 0, bookings: 0 },
    { name: 'Ven', revenue: 0, users: 0, bookings: 0 },
    { name: 'Sam', revenue: 0, users: 0, bookings: 0 },
    { name: 'Dim', revenue: 0, users: 0, bookings: 0 },
  ];

  // ✅ Fonctions pour ouvrir les modales
  const openPropertiesModal = async () => {
    console.log(' Ouverture modal propriétés');
    setModalTitle('Liste des propriétés');
    setShowPropertiesModal(true);
    try {
      const result = await refetchProperties();
      console.log('Données propriétés:', result.data);
      setModalData(result.data?.data || []);
    } catch (error) {
      console.error(' Erreur chargement propriétés:', error);
      setModalData([]);
    }
  };

  const openUsersModal = async () => {
    console.log(' Ouverture modal utilisateurs');
    setModalTitle('Liste des utilisateurs');
    setShowUsersModal(true);
    try {
      const result = await refetchUsers();
      console.log(' Données utilisateurs:', result.data);
      setModalData(result.data?.data || []);
    } catch (error) {
      console.error(' Erreur chargement utilisateurs:', error);
      setModalData([]);
    }
  };

  const openBookingsModal = async () => {
    console.log(' Ouverture modal réservations');
    setModalTitle('Liste des réservations');
    setShowBookingsModal(true);
    try {
      const result = await refetchBookings();
      console.log(' Données réservations:', result.data);
      setModalData(result.data?.data || []);
    } catch (error) {
      console.error(' Erreur chargement réservations:', error);
      setModalData([]);
    }
  };

  const exportReport = async (format: 'csv' | 'pdf' | 'excel' | 'json') => {
    try {
      toast.success(`Export ${format.toUpperCase()} en cours de développement`);
    } catch {
      toast.error('Erreur lors de l\'export');
    }
  };

  const handlePrint = () => window.print();
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rapport Bluefin-Immo',
          text: `Rapport ${selectedPeriod}`,
          url: window.location.href,
        });
        toast.success('Partagé avec succès');
      } catch { toast.error('Partage annulé'); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papier');
    }
  };

  const filteredModalData = modalData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      item.status === statusFilter || 
      (statusFilter === 'published' && item.is_published === 1) ||
      (statusFilter === 'pending' && (item.status === 'pending' || item.is_published === 0));
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f2940] to-[#00c9a7] bg-clip-text text-transparent">
            Rapports & analyses
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Analysez la performance de votre plateforme</p>
        </div>
        
        <div className="flex gap-2">
          <button onClick={handlePrint} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition" title="Imprimer">
            <Printer className="w-4 h-4" />
          </button>
          <button onClick={handleShare} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition" title="Partager">
            <Share2 className="w-4 h-4" />
          </button>
          <button onClick={() => refetch()} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition" title="Rafraîchir">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sélecteur de période */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <PeriodButton active={selectedPeriod === 'monthly'} onClick={() => setSelectedPeriod('monthly')} label="Mensuel" />
            <PeriodButton active={selectedPeriod === 'annual'} onClick={() => setSelectedPeriod('annual')} label="Annuel" />
            <PeriodButton active={selectedPeriod === 'custom'} onClick={() => setSelectedPeriod('custom')} label="Personnalisé" />
          </div>
          {selectedPeriod === 'custom' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]" />
              <span className="text-gray-400 self-center hidden sm:inline">→</span>
              <input type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]" />
            </div>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label=" Vue d'ensemble" />
        <TabButton active={activeTab === 'financial'} onClick={() => setActiveTab('financial')} label=" Financier" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="👥 Utilisateurs" />
        <TabButton active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} label=" Propriétés" />
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'overview' && (
        <OverviewTab 
          report={report} 
          chartData={chartData} 
          onViewUsers={openUsersModal}
          onViewBookings={openBookingsModal}
          onViewProperties={openPropertiesModal}
        />
      )}
      {activeTab === 'financial' && <FinancialTab report={report} chartData={chartData} />}
      {activeTab === 'users' && <UsersTab report={report} onViewAll={openUsersModal} />}
      {activeTab === 'properties' && <PropertiesTab report={report} onViewAll={openPropertiesModal} />}

      {/* Section export */}
      <div className="mt-6 bg-white rounded-xl sm:rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          <Download className="w-5 h-5 text-[#00c9a7]" />
          Exporter le rapport
        </h3>
        <div className="flex flex-wrap gap-3">
          <ExportButton onClick={() => exportReport('csv')} icon={<FileText className="w-4 h-4" />} label="CSV" color="green" />
          <ExportButton onClick={() => exportReport('excel')} icon={<FileText className="w-4 h-4" />} label="Excel" color="blue" />
          <ExportButton onClick={() => exportReport('pdf')} icon={<FileText className="w-4 h-4" />} label="PDF" color="red" />
        </div>
      </div>

      {/* Modal Propriétés */}
      {showPropertiesModal && (
        <DataModal
          title={modalTitle}
          data={filteredModalData}
          onClose={() => setShowPropertiesModal(false)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          type="property"
        />
      )}

      {/* Modal Utilisateurs */}
      {showUsersModal && (
        <DataModal
          title={modalTitle}
          data={filteredModalData}
          onClose={() => setShowUsersModal(false)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          type="user"
        />
      )}

      {/* Modal Réservations */}
      {showBookingsModal && (
        <DataModal
          title={modalTitle}
          data={filteredModalData}
          onClose={() => setShowBookingsModal(false)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          type="booking"
        />
      )}
    </div>
  );
}

// Composant DataModal
const DataModal = ({ title, data, onClose, searchTerm, setSearchTerm, statusFilter, setStatusFilter, type }: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[85vh] flex flex-col">
      <div className="sticky top-0 bg-white border-b border-gray-100 p-4 rounded-t-2xl flex justify-between items-center">
        <h3 className="text-xl font-semibold text-[#0F2940]">{title}</h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="pending">En attente</option>
          <option value="published">Publié</option>
          <option value="confirmed">Confirmé</option>
        </select>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {data.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Aucune donnée disponible</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {type === 'property' && (
                  <>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Titre</th>
                    <th className="p-3 text-left">Hôte</th>
                    <th className="p-3 text-left">Ville</th>
                    <th className="p-3 text-left">Prix/nuit</th>
                    <th className="p-3 text-left">Statut</th>
                    <th className="p-3 text-left">Publié</th>
                  </>
                )}
                {type === 'user' && (
                  <>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Nom</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Date inscription</th>
                    <th className="p-3 text-left">Statut</th>
                  </>
                )}
                {type === 'booking' && (
                  <>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Voyageur</th>
                    <th className="p-3 text-left">Propriété</th>
                    <th className="p-3 text-left">Dates</th>
                    <th className="p-3 text-left">Montant</th>
                    <th className="p-3 text-left">Statut</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item: any, idx: number) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  {type === 'property' && (
                    <>
                      <td className="p-3 font-mono text-xs">#{item.id}</td>
                      <td className="p-3 font-medium">{item.title}</td>
                      <td className="p-3">{item.host_name}</td>
                      <td className="p-3">{item.city}</td>
                      <td className="p-3">{item.price_per_night?.toLocaleString()} FCFA</td>
                      <td className="p-3"><StatusBadge status={item.status} /></td>
                      <td className="p-3">
                        {item.is_published ? 
                          <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Publié</span> : 
                          <span className="text-yellow-600 flex items-center gap-1"><Clock className="w-4 h-4" /> En attente</span>
                        }
                      </td>
                    </>
                  )}
                  {type === 'user' && (
                    <>
                      <td className="p-3 font-mono text-xs">#{item.id}</td>
                      <td className="p-3 font-medium">{item.first_name} {item.last_name}</td>
                      <td className="p-3">{item.email}</td>
                      <td className="p-3"><UserTypeBadge type={item.user_type} /></td>
                      <td className="p-3">{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="p-3">
                        {item.is_active ? 
                          <span className="text-green-600">Actif</span> : 
                          <span className="text-red-600">Inactif</span>
                        }
                      </td>
                    </>
                  )}
                  {type === 'booking' && (
                    <>
                      <td className="p-3 font-mono text-xs">#{item.id}</td>
                      <td className="p-3">{item.guest_name}</td>
                      <td className="p-3">{item.property_title}</td>
                      <td className="p-3">{item.check_in} → {item.check_out}</td>
                      <td className="p-3 font-semibold text-[#00c9a7]">{item.total_amount?.toLocaleString()} FCFA</td>
                      <td className="p-3"><StatusBadge status={item.status} /></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: any) => {
  const config: any = {
    active: { color: 'bg-green-100 text-green-700', label: 'Actif' },
    published: { color: 'bg-green-100 text-green-700', label: 'Publié' },
    pending: { color: 'bg-yellow-100 text-yellow-700', label: 'En attente' },
    cancelled: { color: 'bg-red-100 text-red-700', label: 'Annulé' },
    confirmed: { color: 'bg-green-100 text-green-700', label: 'Confirmé' },
    completed: { color: 'bg-blue-100 text-blue-700', label: 'Terminé' },
  };
  const current = config[status] || config.pending;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${current.color}`}>{current.label}</span>;
};

const UserTypeBadge = ({ type }: any) => {
  const config: any = {
    voyageur: { color: 'bg-blue-100 text-blue-700', label: 'Voyageur' },
    hote: { color: 'bg-green-100 text-green-700', label: 'Hôte' },
    admin: { color: 'bg-purple-100 text-purple-700', label: 'Admin' },
  };
  const current = config[type] || config.voyageur;
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${current.color}`}>{current.label}</span>;
};

// Onglet Vue d'ensemble
const OverviewTab = ({ report, chartData, onViewUsers, onViewBookings, onViewProperties }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard title="Chiffre d'affaires" value={`${(report.total_revenue || 0).toLocaleString()} FCFA`} icon={<DollarSign className="w-5 h-5" />} color="green" />
      <button onClick={() => onViewUsers?.()} className="text-left w-full">
        <KPICard title="Utilisateurs" value={(report.total_users || 0).toLocaleString()} icon={<Users className="w-5 h-5" />} color="blue" />
      </button>
      <button onClick={() => onViewBookings?.()} className="text-left w-full">
        <KPICard title="Réservations" value={(report.total_bookings || 0).toLocaleString()} icon={<Calendar className="w-5 h-5" />} color="purple" />
      </button>
      <button onClick={() => onViewProperties?.()} className="text-left w-full">
        <KPICard title="Propriétés" value={(report.total_properties || 0).toLocaleString()} icon={<Home className="w-5 h-5" />} color="orange" />
      </button>
    </div>

    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#00c9a7]" />
        Évolution des revenus
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00c9a7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00c9a7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
          <Area type="monotone" dataKey="revenue" stroke="#00c9a7" fill="url(#revenueGradient)" name="CA (FCFA)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="font-semibold text-sm mb-3"> Aujourd'hui</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Nouveaux utilisateurs</span><span className="font-semibold">{report.new_users || 0}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Nouvelles propriétés</span><span className="font-semibold">{report.new_properties || 0}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Réservations</span><span className="font-semibold">{report.bookings_count || 0}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Chiffre d'affaires</span><span className="font-semibold text-[#00c9a7]">{(report.revenue || 0).toLocaleString()} FCFA</span></div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="font-semibold text-sm mb-3"> Total général</h4>
        <div className="space-y-2 text-sm">
          <button onClick={() => onViewUsers?.()} className="flex justify-between w-full hover:bg-gray-50 p-1 rounded transition">
            <span className="text-gray-500">Total utilisateurs</span><span className="font-semibold">{report.total_users || 0}</span>
          </button>
          <button onClick={() => onViewProperties?.()} className="flex justify-between w-full hover:bg-gray-50 p-1 rounded transition">
            <span className="text-gray-500">Total propriétés</span><span className="font-semibold">{report.total_properties || 0}</span>
          </button>
          <button onClick={() => onViewBookings?.()} className="flex justify-between w-full hover:bg-gray-50 p-1 rounded transition">
            <span className="text-gray-500">Total réservations</span><span className="font-semibold">{report.total_bookings || 0}</span>
          </button>
          <div className="flex justify-between"><span className="text-gray-500">CA total</span><span className="font-semibold text-[#00c9a7]">{(report.total_revenue || 0).toLocaleString()} FCFA</span></div>
        </div>
      </div>
    </div>
  </div>
);

// Onglet Propriétés
const PropertiesTab = ({ report, onViewAll }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <button onClick={onViewAll} className="text-left w-full">
        <PropertyStatCard title="Total propriétés" value={report.total_properties || 0} icon={<Home className="w-5 h-5" />} color="green" />
      </button>
      <PropertyStatCard title="Actives" value={report.active_properties || 0} icon={<CheckCircle className="w-5 h-5" />} color="blue" />
      <PropertyStatCard title="En attente" value={report.pending_properties || 0} icon={<Clock className="w-5 h-5" />} color="yellow" />
      <PropertyStatCard title="Publiées" value={report.published_properties || 0} icon={<Zap className="w-5 h-5" />} color="purple" />
    </div>
    
    <button onClick={onViewAll} className="w-full bg-white rounded-xl p-4 shadow-sm text-[#00c9a7] hover:bg-gray-50 transition flex items-center justify-center gap-2">
      <Eye className="w-4 h-4" /> Voir toutes les propriétés
    </button>
  </div>
);

// Onglet Utilisateurs
const UsersTab = ({ report, onViewAll }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <button onClick={onViewAll} className="text-left w-full">
        <UserStatCard title="Total utilisateurs" value={report.total_users || 0} icon={<Users className="w-5 h-5" />} color="blue" />
      </button>
      <UserStatCard title="Hôtes" value={report.total_hosts || 0} icon={<Home className="w-5 h-5" />} color="green" />
      <UserStatCard title="Voyageurs" value={report.total_travelers || 0} icon={<Users className="w-5 h-5" />} color="purple" />
      <UserStatCard title="Nouveaux aujourd'hui" value={report.new_users || 0} icon={<Users className="w-5 h-5" />} color="orange" />
    </div>
    <button onClick={onViewAll} className="w-full bg-white rounded-xl p-4 shadow-sm text-[#00c9a7] hover:bg-gray-50 transition flex items-center justify-center gap-2">
      <Eye className="w-4 h-4" /> Voir tous les utilisateurs
    </button>
  </div>
);

// Onglet Financier
const FinancialTab = ({ report, chartData }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
        <p className="text-white/80 text-sm">Revenus totaux</p>
        <p className="text-2xl font-bold mt-1">{report.total_revenue?.toLocaleString() || 0} FCFA</p>
        <p className="text-white/60 text-xs mt-2">Depuis la création</p>
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <p className="text-white/80 text-sm">Réservations</p>
        <p className="text-2xl font-bold mt-1">{report.total_bookings || 0}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
        <p className="text-white/80 text-sm">CA aujourd'hui</p>
        <p className="text-2xl font-bold mt-1">{(report.revenue || 0).toLocaleString()} FCFA</p>
      </div>
    </div>
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-base mb-4"> Évolution quotidienne</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
          <Bar dataKey="revenue" fill="#00c9a7" name="CA" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// Composants auxiliaires
const PeriodButton = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${active ? 'bg-[#00c9a7] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
    {label}
  </button>
);

const TabButton = ({ active, onClick, label }: any) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${active ? 'bg-[#00c9a7] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
    {label}
  </button>
);

const ExportButton = ({ onClick, icon, label, color }: any) => {
  const colors = { green: 'bg-green-50 text-green-600 hover:bg-green-100', blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100', red: 'bg-red-50 text-red-600 hover:bg-red-100' };
  return <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${colors[color]}`}>{icon}{label}</button>;
};

const KPICard = ({ title, value, icon, color }: any) => {
  const colors = { green: 'from-green-500 to-green-600', blue: 'from-blue-500 to-blue-600', purple: 'from-purple-500 to-purple-600', orange: 'from-orange-500 to-orange-600' };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-white transform hover:scale-105 transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">{icon}</div>
      </div>
      <p className="text-white/80 text-xs mt-3">{title}</p>
      <p className="text-xl font-bold mt-0.5">{value}</p>
    </div>
  );
};

const UserStatCard = ({ title, value, icon, color }: any) => {
  const colors = { blue: 'from-blue-500 to-blue-600', green: 'from-green-500 to-green-600', purple: 'from-purple-500 to-purple-600', orange: 'from-orange-500 to-orange-600' };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-white`}>
      <div className="flex justify-between items-center"><div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">{icon}</div></div>
      <p className="text-white/80 text-xs mt-2">{title}</p>
      <p className="text-2xl font-bold mt-0.5">{value.toLocaleString()}</p>
    </div>
  );
};

const PropertyStatCard = ({ title, value, icon, color }: any) => {
  const colors = { green: 'from-green-500 to-green-600', blue: 'from-blue-500 to-blue-600', yellow: 'from-yellow-500 to-yellow-600', purple: 'from-purple-500 to-purple-600' };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-white`}>
      <div className="flex justify-between items-center"><div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">{icon}</div></div>
      <p className="text-white/80 text-xs mt-2">{title}</p>
      <p className="text-2xl font-bold mt-0.5">{value.toLocaleString()}</p>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="p-3 sm:p-4 md:p-6">
    <div className="animate-pulse">
      <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="bg-gray-200 rounded-xl h-16 mb-6"></div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 rounded-xl h-28"></div>)}
      </div>
      <div className="bg-gray-200 rounded-xl h-80 mb-6"></div>
    </div>
  </div>
);