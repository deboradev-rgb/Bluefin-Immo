// src/app/App.tsx
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Navbar } from './components/Navbar';
import { MobileBottomNav, type Tab } from './components/MobileBottomNav';
import { MobileBookingSheet } from './components/MobileBookingSheet';
import { Footer } from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
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
  HostMessagesPage,
  MessagesPage,
  FavoritesPage,
  PublishListingPage,
  HelpPage,
  AboutPage,
  BlogPage,
  TermsPage,
  NotFoundPage,
  AllPropertiesPage,
  HotelsPage,
  CityPage,
  ExperiencePage,
  ServicesPage,
  BecomeHost,
  AuthPage,
  SiteFunctioningPage,
  CompanyInfoPage,
  AdminDashboardPage,
  AdminUsersPage,
  AdminBookingsPage,
  AdminPaymentsPage,
  AdminMessagesPage,
  AdminReportsPage,
} from './pages';
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage';
import { parseRoute, routeToPath, tabFromPage, routeFromTab, type Route, type Page } from './router';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function AppContent() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname + window.location.search));
  const [mobileNavActive, setMobileNavActive] = useState<'explore' | 'favorites' | 'trips' | 'messages' | 'profile'>(
    tabFromPage(route.name)
  );
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();

  const navigate = (to: Route) => {
    console.log('🔍 Navigation appelée avec:', to);
    setRoute(to);
    const path = routeToPath(to);
    const current = window.location.pathname + window.location.search;
    if (current !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.dispatchEvent(new Event('authChange'));
  };

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname + window.location.search));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    setMobileNavActive(tabFromPage(route.name));
  }, [route.name]);

  const handleMobileNavigate = (tab: Tab | { name: string; id?: string }) => {
    // Si c'est un objet Route
    if (typeof tab === 'object') {
      navigate(tab);
      return;
    }
    
    // Si c'est un Tab (string)
    const route = routeFromTab(tab);
    navigate(route);
    if (tab !== 'auth') setMobileNavActive(tab);
  };

  const isRouteAllowed = (route: Route): boolean => {
    const protectedRoutes: Page[] = [
      'account', 'account-reservations', 'host-dashboard', 'host-annonces',
      'host-calendrier', 'host-reservations', 'messages', 'host-messages', 'favorites', 'publish',
    ];
    if (protectedRoutes.includes(route.name)) {
      if (loading) return true;
      return isAuthenticated;
    }
    if (route.name.startsWith('host-') && route.name !== 'host-dashboard') {
      if (loading) return true;
      return isAuthenticated && (user?.user_type === 'hote' || user?.user_type === 'admin');
    }
    if (route.name.startsWith('admin-') && route.name !== 'admin-login') {
      if (loading) return true;
      return isAuthenticated && user?.user_type === 'admin';
    }
    return true;
  };

  if (!isRouteAllowed(route)) {
    navigate({ name: 'home' });
    return null;
  }

  if (route.name === 'admin-login') {
    return <AdminLoginPage onNavigate={navigate} />;
  }

  if (route.name.startsWith('admin-') && user?.user_type === 'admin') {
    const renderAdminPage = () => {
      switch (route.name) {
        case 'admin-dashboard': return <AdminDashboardPage onNavigate={navigate} />;
        case 'admin-properties': return <AdminPropertiesPage onNavigate={navigate} />;
        case 'admin-users': return <AdminUsersPage onNavigate={navigate} />;
        case 'admin-bookings': return <AdminBookingsPage onNavigate={navigate} />;
        case 'admin-payments': return <AdminPaymentsPage onNavigate={navigate} />;
        case 'admin-messages': return <AdminMessagesPage onNavigate={navigate} />;
        case 'admin-reports': return <AdminReportsPage onNavigate={navigate} />;
        default: return <AdminDashboardPage onNavigate={navigate} />;
      }
    };
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">{renderAdminPage()}</main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onOpenSearch={() => navigate({ name: 'search-logements' })}
        onGoHome={() => navigate({ name: 'home' })}
        onNavigate={navigate}
        currentPage={route.name}
      />

      {/* Bouton WhatsApp Admin */}
      <a
        href="https://api.whatsapp.com/send?phone=+33651088321&text=Bonjour%20Bluefin%20Immo%20admin%2C%20j%27ai%20besoin%20d%27aide"
        target="_blank"
        rel="noreferrer noopener"
        className="fixed bottom-6 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-xl hover:bg-[#1ebe5b] transition-colors sm:px-5 sm:py-4"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.783 1.14L.855 2.677 3.21 9.713a9.877 9.877 0 001.502 4.844h.004c2.364 2.044 5.921 3.268 9.77 3.268 5.442 0 9.886-4.108 9.886-9.159 0-2.341-.896-4.531-2.521-6.18a9.916 9.916 0 00-7.086-2.937z"/>
        </svg>
        <span className="text-xs sm:text-sm font-semibold">WhatsApp</span>
      </a>

      {/* Routes */}
      {route.name === 'home' && <HomePage onNavigate={navigate} />}
      {route.name === 'search-logements' && <SearchPage mode="logements" onNavigate={navigate} />}
      {route.name === 'search-hotels' && <SearchPage mode="hotels" onNavigate={navigate} />}
      {route.name === 'listing' && <ListingPage onNavigate={navigate} id={route.id} />}
      {route.name === 'booking' && (
        <BookingPage 
          onNavigate={navigate} 
          id={route.id} 
          search={route.search}
        />
      )}
      {route.name === 'confirmation' && <ConfirmationPage id={route.id!} onNavigate={navigate} />}
      {route.name === 'profile' && <ProfilePage onNavigate={navigate} />}
      {route.name === 'account' && <AccountPage onNavigate={navigate} />}
      {route.name === 'account-reservations' && <AccountReservationsPage onNavigate={navigate} />}
      {route.name === 'host-dashboard' && <HostDashboardPage onNavigate={navigate} />}
      {route.name === 'host-annonces' && <HostListingsPage onNavigate={navigate} />}
      {route.name === 'host-calendrier' && <HostCalendarPage onNavigate={navigate} id={route.id} />}
      {route.name === 'host-reservations' && <HostReservationsPage onNavigate={navigate} />}
      {route.name === 'messages' && <MessagesPage onNavigate={navigate} id={route.id} />}
      {route.name === 'host-messages' && <HostMessagesPage onNavigate={navigate} id={route.id} />}
      {route.name === 'favorites' && <FavoritesPage onNavigate={navigate} />}
      {route.name === 'publish' && <PublishListingPage onNavigate={navigate} />}
      {route.name === 'help' && <HelpPage onNavigate={navigate} />}
      {route.name === 'about' && <AboutPage onNavigate={navigate} />}
      {route.name === 'blog' && <BlogPage onNavigate={navigate} />}
      {route.name === 'terms' && <TermsPage type={route.type} onNavigate={navigate} />}
      {route.name === 'popular' && <AllPropertiesPage onNavigate={navigate} />}
      {route.name === 'hotels' && <HotelsPage onNavigate={navigate} />}
      {route.name === 'city' && <CityPage city={route.city!} onNavigate={navigate} />}
      {route.name === 'experience' && <ExperiencePage onNavigate={navigate} />}
      {route.name === 'services' && <ServicesPage onNavigate={navigate} />}
      {route.name === 'become-host' && <BecomeHost onNavigate={navigate} />}
      {route.name === 'auth' && <AuthPage onNavigate={navigate} />}
      {route.name === 'site-functioning' && <SiteFunctioningPage onNavigate={navigate} />}
      {route.name === 'company-info' && <CompanyInfoPage onNavigate={navigate} />}
      {route.name === 'not-found' && <NotFoundPage onNavigate={navigate} />}

      <Footer onNavigate={navigate} />
      <div className="lg:hidden">
        <MobileBottomNav active={mobileNavActive} onNavigate={handleMobileNavigate} />
      </div>
      <MobileBookingSheet isOpen={isBookingSheetOpen} onClose={() => setIsBookingSheetOpen(false)} propertyId={0} pricePerNight={0} />
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </BrowserRouter>
  );
}