// src/app/pages/admin/AdminUsersPage.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, UserPlus, UserX, Shield, Calendar, Search, 
  Filter, ChevronDown, ChevronUp, Mail, Phone, 
  MapPin, Star, Award, Clock, CheckCircle, XCircle,
  AlertCircle, MoreVertical, Eye, Ban, UserCheck
} from 'lucide-react';
import adminService from '../../../services/admin.service';
import { useState } from 'react';
import toast from 'react-hot-toast';

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

// Badge statistique
const StatBadge = ({ label, value, color, icon }: any) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className={`rounded-lg p-2 text-center ${colors[color]}`}>
      <div className="flex items-center justify-center gap-1">
        {icon}
        <p className="text-lg font-bold">{value}</p>
      </div>
      <p className="text-xs hidden sm:block">{label}</p>
      <p className="text-[10px] sm:hidden">{label.slice(0, 3)}</p>
    </div>
  );
};

// Skeleton
const LoadingSkeleton = () => (
  <div className="p-3 sm:p-4 md:p-6">
    <div className="animate-pulse">
      <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="bg-gray-200 rounded-lg h-16"></div>)}
      </div>
      <div className="bg-gray-200 rounded-xl h-12 mb-6"></div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="bg-gray-200 rounded-xl h-24"></div>)}
      </div>
    </div>
  </div>
);