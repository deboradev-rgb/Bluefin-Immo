import { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { CategoryStrip } from './components/CategoryStrip.tsx';
import { ListingCard } from './components/ListingCard.tsx';
import { DestinationCard } from './components/DestinationCard.tsx';
import { FeatureCard } from './components/FeatureCard.tsx';
import { Footer } from './components/Footer.tsx';
import { SearchResults } from './components/SearchResults.tsx';
import { ListingDetail } from './components/ListingDetail.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { MobileBookingSheet } from './components/MobileBookingSheet.tsx';
import { Zap, CheckCircle, Headphones } from 'lucide-react';

export type Page = 'home' | 'search' | 'listing';

const popularListings = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format',
    title: 'Appartement moderne · Haie Vive',
    type: 'Appartement entier',
    rating: 4.87,
    reviewCount: 124,
    price: 45000,
    priceEur: 69,
    badge: 'certified' as const,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format',
    title: 'Villa spacieuse · Fidjrossè',
    type: 'Villa entière',
    rating: 4.92,
    reviewCount: 89,
    price: 85000,
    priceEur: 130,
    badge: 'superhost' as const,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&auto=format',
    title: 'Studio meublé · Cocotiers',
    type: 'Studio privé',
    rating: 4.75,
    reviewCount: 56,
    price: 32000,
    priceEur: 49,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop&auto=format',
    title: 'Chambre confort · Cadjèhoun',
    type: 'Chambre privée',
    rating: 4.68,
    reviewCount: 43,
    price: 18000,
    priceEur: 27,
  },
];

const destinations = [
  { name: 'Ouidah', subtitle: 'Histoire & Culture', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop&auto=format' },
  { name: 'Abomey', subtitle: 'Palais Royaux', image: 'https://images.unsplash.com/photo-1590759668628-05b3b8986301?w=600&h=400&fit=crop&auto=format' },
  { name: 'Porto-Novo', subtitle: 'Capitale béninoise', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop&auto=format' },
  { name: 'Grand-Popo', subtitle: 'Plages & Détente', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop&auto=format' },
  { name: 'Pendjari', subtitle: 'Safari & Nature', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop&auto=format' },
];

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const [mobileNavActive, setMobileNavActive] = useState<'explore' | 'favorites' | 'trips' | 'messages' | 'profile'>('explore');

  function navigate(to: Page) {
    setPage(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (to === 'home') setMobileNavActive('explore');
    if (to === 'search') setMobileNavActive('explore');
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onOpenSearch={() => navigate('search')}
        onGoHome={() => navigate('home')}
        currentPage={page}
      />

      {/* Home Page */}
      {page === 'home' && (
        <>
          <Hero onSearch={() => navigate('search')} />
          <CategoryStrip />

          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <h2 className="text-xl lg:text-2xl font-bold text-[#0f2940] mb-6 lg:mb-8">
              Logements populaires à Cotonou
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {popularListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  {...listing}
                  onClick={() => navigate('listing')}
                />
              ))}
            </div>
          </section>

          <section className="bg-[#f4fffe] py-10 lg:py-16">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl lg:text-2xl font-bold text-[#0f2940] mb-6 lg:mb-8">
                Explorez le Bénin
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
                {destinations.map((dest, idx) => (
                  <DestinationCard key={idx} {...dest} onClick={() => navigate('search')} />
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <h2 className="text-xl lg:text-2xl font-bold text-[#0f2940] mb-8 text-center">
              Pourquoi Bluefin-Immo ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              <FeatureCard
                icon={({ className }) => <Zap className={className} />}
                title="Paiement Mobile Money"
                description="MTN MoMo, Moov Money et Orange Money acceptés — payez en toute simplicité"
              />
              <FeatureCard
                icon={({ className }) => <CheckCircle className={className} />}
                title="Hôtes vérifiés"
                description="Tous nos logements sont certifiés et vérifiés par notre équipe locale"
              />
              <FeatureCard
                icon={({ className }) => <Headphones className={className} />}
                title="Support local 24/7"
                description="Équipe béninoise disponible jour et nuit pour vous accompagner"
              />
            </div>
          </section>

          <Footer />
        </>
      )}

      {/* Search Results Page */}
      {page === 'search' && (
        <SearchResults
          onSelectListing={() => navigate('listing')}
          onBack={() => navigate('home')}
        />
      )}

      {/* Listing Detail Page */}
      {page === 'listing' && (
        <ListingDetail
          onBack={() => navigate('search')}
          onOpenBooking={() => setIsBookingSheetOpen(true)}
        />
      )}

      {/* Mobile Bottom Nav — visible only on small screens */}
      <div className="lg:hidden">
        <MobileBottomNav
          active={mobileNavActive}
          onNavigate={(tab) => {
            setMobileNavActive(tab);
            if (tab === 'explore') navigate('home');
            if (tab === 'messages') navigate('search');
          }}
        />
      </div>

      {/* Mobile Booking Sheet */}
      <MobileBookingSheet
        isOpen={isBookingSheetOpen}
        onClose={() => setIsBookingSheetOpen(false)}
      />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
