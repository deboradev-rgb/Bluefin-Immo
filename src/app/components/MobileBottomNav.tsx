import { Compass, Heart, Calendar, MessageCircle, User, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';

export type Tab = 'explore' | 'favorites' | 'trips' | 'messages' | 'profile' | 'auth';

interface MobileBottomNavProps {
  active?: Tab;
  onNavigate?: (tab: Tab) => void;
}

export function MobileBottomNav({ active = 'explore', onNavigate }: MobileBottomNavProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>('');

  // Vérifier l'état de connexion
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("bluefin_user");
      if (user) {
        setIsLoggedIn(true);
        try {
          const userData = JSON.parse(user);
          setUserName(userData.firstName || '');
        } catch (e) {
          setUserName('');
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    };
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  // Définir les onglets disponibles selon l'état de connexion
  const getAvailableTabs = (): { id: Tab; icon: typeof Compass; label: string }[] => {
    const publicTabs = [
      { id: 'explore' as Tab, icon: Compass, label: 'Explorer' },
      { id: 'favorites' as Tab, icon: Heart, label: 'Favoris' },
    ];
    
    const privateTabs = [
      { id: 'trips' as Tab, icon: Calendar, label: 'Voyages' },
      { id: 'messages' as Tab, icon: MessageCircle, label: 'Messages' },
      { id: 'profile' as Tab, icon: User, label: userName || 'Profil' },
    ];
    
    const authTab = [
      { id: 'auth' as Tab, icon: LogIn, label: 'Connexion' },
    ];
    
    if (isLoggedIn) {
      return [...publicTabs, ...privateTabs];
    } else {
      return [...publicTabs, ...authTab];
    }
  };

  const tabs = getAvailableTabs();

  // ✅ CORRECTION ICI : Gérer tous les cas de navigation
  const handleNavigate = (tabId: Tab) => {
    console.log("Navigation vers:", tabId); // Debug
    
    // Cas où l'utilisateur n'est pas connecté et essaie d'accéder aux onglets privés
    if (!isLoggedIn && (tabId === 'trips' || tabId === 'messages' || tabId === 'profile')) {
      onNavigate?.('auth');
    } 
    // Cas de l'onglet auth (connexion)
    else if (tabId === 'auth') {
      onNavigate?.('auth');
    }
    // ✅ CAS EXPLORE : toujours naviguer vers explore
    else if (tabId === 'explore') {
      onNavigate?.('explore');
    }
    // ✅ CAS FAVORITES : naviguer vers favorites
    else if (tabId === 'favorites') {
      onNavigate?.('favorites');
    }
    // ✅ Autres cas
    else {
      onNavigate?.(tabId);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2f5f2] h-16 sm:h-20 px-2 flex items-center justify-around z-50 safe-area-pb">
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => handleNavigate(id)}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200 ${
            active === id 
              ? 'text-[#00c9a7] scale-105' 
              : 'text-[#9ca3af] hover:text-[#0f2940] hover:scale-105'
          }`}
        >
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${active === id && id !== 'auth' ? 'fill-[#00c9a7]' : ''}`} />
          <span className={`text-[10px] sm:text-xs transition-all ${active === id ? 'font-bold' : ''}`}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}