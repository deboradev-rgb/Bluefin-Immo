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
  CguPage,
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
import { WhatsAppButton } from './components/WhatsAppButton';

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

  const navigate = (to: Route | string) => {
    let routeObject: Route;
    
    if (typeof to === 'string') {
      routeObject = { name: to as Page };
    } else {
      routeObject = to;
    }
    
    console.log('🔍 Navigation appelée avec:', routeObject);
    
    if (!routeObject.name) {
      console.error('❌ Route invalide:', routeObject);
      routeObject = { name: 'home' };
    }
    
    setRoute(routeObject);
    const path = routeToPath(routeObject);
    const current = window.location.pathname + window.location.search;
    if (current !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.dispatchEvent(new Event('authChange'));
  };

  useEffect(() => {
    const onPop = () => {
      const newRoute = parseRoute(window.location.pathname + window.location.search);
      console.log('🔍 Popstate détecté, nouvelle route:', newRoute);
      setRoute(newRoute);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    setMobileNavActive(tabFromPage(route.name));
  }, [route.name]);

  // ✅ Écouter les changements d'authentification
  useEffect(() => {
    const handleAuthChange = () => {
      console.log('🔄 Changement d\'authentification détecté');
      const currentRoute = parseRoute(window.location.pathname + window.location.search);
      
      if (currentRoute.name.startsWith('admin-') && currentRoute.name !== 'admin-login') {
        if (!isAuthenticated || user?.user_type !== 'admin') {
          console.log('🚫 Accès admin non autorisé, redirection vers home');
          navigate({ name: 'home' });
        }
      }
    };
    
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [isAuthenticated, user]);

  // ✅ Écouter les données de réservation temporaire
  useEffect(() => {
    const handleBookingData = (event: CustomEvent) => {
      const data = event.detail;
      console.log('📦 Événement booking-data-available reçu:', data);
      
      if (data && data.propertyId) {
        const params = new URLSearchParams({
          check_in: data.checkIn,
          check_out: data.checkOut,
          guests: data.guests.toString(),
          nights: data.nights.toString()
        });
        
        navigate({ 
          name: 'booking', 
          id: data.propertyId.toString(),
          search: params.toString()
        });
      }
    };
    
    window.addEventListener('booking-data-available', handleBookingData as EventListener);
    
    return () => {
      window.removeEventListener('booking-data-available', handleBookingData as EventListener);
    };
  }, [navigate]);

  const handleMobileNavigate = (tab: Tab | { name: string; id?: string }) => {
    if (typeof tab === 'object') {
      navigate(tab);
      return;
    }
    
    const routeObj = routeFromTab(tab);
    navigate(routeObj);
    if (tab !== 'auth') setMobileNavActive(tab);
  };

  const isRouteAllowed = (route: Route): boolean => {
    const protectedRoutes: Page[] = [
      'account', 'account-reservations', 'host-dashboard', 'host-annonces',
      'host-calendrier', 'host-reservations', 'messages', 'host-messages', 'favorites', 'publish',
    ];
    
    if (protectedRoutes.includes(route.name)) {
      return isAuthenticated;
    }
    
    if (route.name.startsWith('host-') && route.name !== 'host-dashboard') {
      return isAuthenticated && (user?.user_type === 'hote' || user?.user_type === 'admin');
    }
    
    if (route.name.startsWith('admin-') && route.name !== 'admin-login') {
      return isAuthenticated && user?.user_type === 'admin';
    }
    
    return true;
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4fffe] to-[#e8fffb]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00c9a7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  // Vérifier si la route est autorisée
  if (!isRouteAllowed(route)) {
    console.log('🚫 Route non autorisée, redirection vers home');
    navigate({ name: 'home' });
    return null;
  }

  // Page de login admin
  if (route.name === 'admin-login') {
    return <AdminLoginPage onNavigate={navigate} />;
  }

  // Routes admin protégées
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

  // Routes publiques et protégées classiques
  // ✅ LE NAVBAR N'EST PLUS AFFICHÉ POUR LA PAGE HOME
  // Sur la page home, le Navbar est déjà inclus dans HomePage
  const showNavbar = route.name !== 'home';

  return (
    <div className="min-h-screen bg-white">
      {/* ✅ Navbar affiché seulement sur les pages autres que home */}
      {showNavbar && (
        <Navbar
          onOpenSearch={() => navigate({ name: 'search-logements' })}
          onGoHome={() => navigate({ name: 'home' })}
          onNavigate={navigate}
          currentPage={route.name}
        />
      )}

      <WhatsAppButton />

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
      {route.name === 'cgu' && <CguPage onNavigate={navigate} />}
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