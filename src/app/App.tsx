import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav, type Tab } from './components/MobileBottomNav';
import { MobileBookingSheet } from './components/MobileBookingSheet';
import { Footer } from './components/Footer';
import {
  HomePage,
  SearchPage,
  ListingPage,
  BookingPage,
  ConfirmationPage,
  ProfilePage,
  AccountPage,
  AccountReservationsPage,
  HostDashboardPage,
  HostListingsPage,
  HostCalendarPage,
  HostReservationsPage,
  MessagesPage,
  FavoritesPage,
  PublishListingPage,
  HelpPage,
  AboutPage,
  BlogPage,
  TermsPage,
  NotFoundPage,
  PopularPage,
  HotelsPage,
  CityPage,
  ExperiencePage,
  ServicesPage,
  BecomeHost,
  AuthPage
} from './pages';
import { parseRoute, routeToPath, tabFromPage, routeFromTab, type Route } from './router';

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));
  const [mobileNavActive, setMobileNavActive] = useState<'explore' | 'favorites' | 'trips' | 'messages' | 'profile'>(tabFromPage(route.name));
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const path = routeToPath(route);
    if (window.location.pathname !== path) {
      window.history.replaceState({}, '', path);
    }
    setMobileNavActive(tabFromPage(route.name));
  }, [route]);

  function navigate(to: Route) {
    setRoute(to);
    const path = routeToPath(to);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Déclencher un événement pour mettre à jour la navbar et le bottom nav
    window.dispatchEvent(new Event('authChange'));
  }

  // Gestionnaire pour la navigation mobile (inclut l'onglet auth)
  // Gestionnaire pour la navigation mobile (inclut l'onglet auth)
const handleMobileNavigate = (tab: Tab) => {
  console.log("🔵 Navigation mobile - Onglet cliqué:", tab);
  
  const route = routeFromTab(tab);
  console.log("🟢 Route générée:", route);
  
  // Naviguer vers la route correspondante (y compris 'home')
  navigate(route);
  
  // Mettre à jour l'onglet actif pour les onglets standards
  if (tab !== 'auth') {
    setMobileNavActive(tab);
  }
};
  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onOpenSearch={() => navigate({ name: 'search-logements' })}
        onGoHome={() => navigate({ name: 'home' })}
        onNavigate={navigate}
        currentPage={route.name}
      />
      
      {route.name === 'home' && <HomePage onNavigate={navigate} />}
      {route.name === 'search-logements' && <SearchPage mode="logements" onNavigate={navigate} />}
      {route.name === 'search-hotels' && <SearchPage mode="hotels" onNavigate={navigate} />}
      {route.name === 'listing' && <ListingPage id={route.id} onNavigate={navigate} />}
      {route.name === 'booking' && <BookingPage id={route.id} onNavigate={navigate} />}
      {route.name === 'confirmation' && <ConfirmationPage id={route.id} onNavigate={navigate} />}
      {route.name === 'profile' && <ProfilePage id={route.id} onNavigate={navigate} />}
      {route.name === 'account' && <AccountPage onNavigate={navigate} />}
      {route.name === 'account-reservations' && <AccountReservationsPage onNavigate={navigate} />}
      {route.name === 'host-dashboard' && <HostDashboardPage onNavigate={navigate} />}
      {route.name === 'host-annonces' && <HostListingsPage onNavigate={navigate} />}
      {route.name === 'host-calendrier' && <HostCalendarPage onNavigate={navigate} />}
      {route.name === 'host-reservations' && <HostReservationsPage onNavigate={navigate} />}

      {route.name === 'messages' && <MessagesPage />}
      {route.name === 'favorites' && <FavoritesPage onNavigate={navigate} />}
      {route.name === 'publish' && <PublishListingPage />}
      {route.name === 'help' && <HelpPage />}
      {route.name === 'about' && <AboutPage />}
      {route.name === 'blog' && <BlogPage onNavigate={navigate} />}
      {route.name === 'terms' && <TermsPage />}
      {route.name === 'not-found' && <NotFoundPage onNavigate={navigate} />}
      {route.name === 'popular' && <PopularPage onNavigate={navigate} />}
      {route.name === 'hotels' && <HotelsPage onNavigate={navigate} />}
      {route.name === 'city' && <CityPage city={route.city} onNavigate={navigate} />}
      {route.name === 'experience' && <ExperiencePage onNavigate={navigate} />}
      {route.name === 'services' && <ServicesPage onNavigate={navigate} />}
      {route.name === 'become-host' && <BecomeHost onNavigate={navigate} />}
      {route.name === 'auth' && <AuthPage onNavigate={navigate} />}

      <Footer onNavigate={navigate} />

      <div className="lg:hidden">
        <MobileBottomNav
          active={mobileNavActive}
          onNavigate={handleMobileNavigate}
        />
      </div>

      <MobileBookingSheet isOpen={isBookingSheetOpen} onClose={() => setIsBookingSheetOpen(false)} />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .safe-area-pb { padding-bottom: env(safe-area-inset-bottom); }
      `}</style>
    </div>
  );
}