// src/app/components/AdminSidebar.tsx
import {
  LayoutDashboard,
  Home,
  Users,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

const menuItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/properties', icon: Home, label: 'Propriétés' },
  { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
  { to: '/admin/bookings', icon: Calendar, label: 'Réservations' },
  { to: '/admin/payments', icon: CreditCard, label: 'Paiements' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/admin/reports', icon: BarChart3, label: 'Rapports' },
];

export function AdminSidebar() {
  const current = typeof window !== 'undefined' ? window.location.pathname : '/';

  const handleClick = (e: React.MouseEvent, to: string) => {
    e.preventDefault();
    if (window.location.pathname === to) return;
    window.history.pushState({}, '', to);
    // Dispatch a popstate so our custom router picks up the change
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
      <div className="p-5 text-xl font-bold border-b border-gray-800">Bluefin Admin</div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = current === item.to;
          return (
            <a
              key={item.to}
              href={item.to}
              onClick={(e) => handleClick(e, item.to)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-gray-800 text-[#00c9a7]' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}