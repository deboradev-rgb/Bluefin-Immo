// src/app/components/AdminHeader.tsx
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export function AdminHeader() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.history.pushState({}, '', '/admin-login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-800">Administration Bluefin-Immo</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-5 h-5" />
          <span className="text-sm">{user?.first_name} {user?.last_name}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}