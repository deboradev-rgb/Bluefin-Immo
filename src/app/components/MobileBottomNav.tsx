import { Compass, Heart, Calendar, MessageCircle, User } from 'lucide-react';

type Tab = 'explore' | 'favorites' | 'trips' | 'messages' | 'profile';

interface MobileBottomNavProps {
  active?: Tab;
  onNavigate?: (tab: Tab) => void;
}

export function MobileBottomNav({ active = 'explore', onNavigate }: MobileBottomNavProps) {
  const tabs: { id: Tab; icon: typeof Compass; label: string }[] = [
    { id: 'explore', icon: Compass, label: 'Explorer' },
    { id: 'favorites', icon: Heart, label: 'Favoris' },
    { id: 'trips', icon: Calendar, label: 'Voyages' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2f5f2] h-16 sm:h-20 px-2 flex items-center justify-around z-50 safe-area-pb">
      {tabs.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onNavigate?.(id)}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
            active === id ? 'text-[#00c9a7]' : 'text-[#9ca3af] hover:text-[#0f2940]'
          }`}
        >
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${active === id ? 'fill-[#00c9a7]' : ''}`} />
          <span className={`text-[10px] sm:text-xs ${active === id ? 'font-bold' : ''}`}>{label}</span>
        </button>
      ))}
    </div>
  );
}
