// src/app/pages/admin/AdminMessagesPage.tsx
import { useQuery } from '@tanstack/react-query';
import { 
  MessageCircle, User, Mail, Clock, Search, 
  Filter, Eye, ChevronRight, Phone, MapPin,
  Calendar, Star, Reply, Flag, CheckCircle, XCircle
} from 'lucide-react';
import adminService from '../../../services/admin.service';
import { useState } from 'react';
import toast from 'react-hot-toast';

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

// Skeleton de chargement
const LoadingSkeleton = () => (
  <div className="p-3 sm:p-4 md:p-6">
    <div className="animate-pulse">
      <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-200 rounded-xl h-20"></div>)}
      </div>
      <div className="bg-gray-200 rounded-xl h-12 mb-6"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="bg-gray-200 rounded-xl h-24"></div>)}
        </div>
        <div className="bg-gray-200 rounded-xl h-[500px]"></div>
      </div>
    </div>
  </div>
);