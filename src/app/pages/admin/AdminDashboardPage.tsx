// src/app/pages/admin/AdminDashboardPage.tsx
import { useQuery } from '@tanstack/react-query';
import { 
  Users, Home, CreditCard, TrendingUp, AlertCircle, Bell, 
  Calendar, DollarSign, Eye, Star, CheckCircle, XCircle,
  Clock, Zap, Award, MapPin, Activity, BarChart3, PieChart,
  UserPlus, Building2, Wallet, RefreshCw, ChevronRight,
  Menu, X
} from 'lucide-react';
import adminService from '../../../services/admin.service';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const COLORS = ['#00c9a7', '#0f2940', '#ff6b6b', '#f5a623', '#4a90e2', '#9013fe'];

export function AdminDashboardPage({ onNavigate }: { onNavigate?: (route: any) => void }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboard(),
    refetchInterval: 30000,
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animatedCards, setAnimatedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedCards({ all: true }), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage onRetry={() => refetch()} />;

  const resp: any = data?.data;
  const stats = resp?.stats || {};
  const activities = resp?.recent_activities || [];
  const chartData = resp?.chart_data || { labels: [], revenue: [], bookings: [], users: [] };
  const unreadCount = resp?.unread_notifications || 0;

  const revenueChartData = chartData.labels.map((label: string, idx: number) => ({
    day: label,
    revenue: chartData.revenue[idx] / 1000,
    bookings: chartData.bookings[idx],
    users: chartData.users[idx],
    averageValue: chartData.revenue[idx] / (chartData.bookings[idx] || 1),
  }));

  const conversionRate = stats.properties ? 
    ((stats.properties.approved || 0) / (stats.properties.pending + stats.properties.approved || 1) * 100).toFixed(1) : 0;
  const bookingSuccessRate = stats.bookings ?
    ((stats.bookings.completed || 0) / (stats.bookings.total || 1) * 100).toFixed(1) : 0;

  const topDestinations = resp?.top_destinations || [
    { city: 'Cotonou', count: 234, revenue: 45600000 },
    { city: 'Porto-Novo', count: 89, revenue: 12300000 },
    { city: 'Parakou', count: 56, revenue: 7800000 },
    { city: 'Abomey', count: 45, revenue: 6700000 },
    { city: 'Grand-Popo', count: 34, revenue: 5100000 },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête responsive */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 mb-6">
        <div className="w-full xs:w-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f2940] to-[#00c9a7] bg-clip-text text-transparent">
            Tableau de bord
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Aperçu global de la plateforme</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full xs:w-auto">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="flex-1 xs:flex-none bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
          >
            <option value="week">7 jours</option>
            <option value="month">30 jours</option>
            <option value="year">12 mois</option>
          </select>
          <button
            onClick={() => refetch()}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="bg-white border border-gray-200 rounded-xl p-2 hover:bg-gray-50 transition relative"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border z-50">
                <div className="p-3 border-b font-semibold text-sm">Notifications</div>
                <div className="max-h-80 overflow-y-auto">
                  {activities.slice(0, 5).map((act: any, idx: number) => (
                    <div key={idx} className="p-3 hover:bg-gray-50 border-b text-sm">
                      <p className="text-sm">{act.title || act.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{act.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cartes stats - Grille responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6">
        <StatsCard
          icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Utilisateurs"
          value={stats.users?.total || 0}
          subValue={`+${stats.users?.new_today || 0} aujourd'hui`}
          trend={stats.users?.growth || 12}
          color="blue"
          animated={animatedCards.all}
        />
        <StatsCard
          icon={<Home className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Propriétés"
          value={stats.properties?.total || 0}
          subValue={`${stats.properties?.pending || 0} en attente`}
          trend={stats.properties?.growth || 8}
          color="green"
          animated={animatedCards.all}
        />
        <StatsCard
          icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Chiffre d'affaires"
          value={`${(stats.payments?.total_amount || 0).toLocaleString()} FCFA`}
          subValue={`+${(stats.payments?.today_amount || 0).toLocaleString()} FCFA`}
          trend={stats.payments?.growth || 15}
          color="purple"
          animated={animatedCards.all}
        />
        <StatsCard
          icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6" />}
          title="Réservations"
          value={stats.bookings?.confirmed || 0}
          subValue={`${stats.bookings?.pending_payment || 0} en attente`}
          trend={stats.bookings?.growth || 10}
          color="orange"
          animated={animatedCards.all}
        />
      </div>

      {/* Deuxième ligne stats - responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <MetricCard
          title="Taux de conversion"
          value={`${conversionRate}%`}
          subtitle="Propriétés approuvées"
          color="indigo"
          icon={<Activity className="w-5 h-5" />}
        />
        <MetricCard
          title="Satisfaction"
          value="4.9/5"
          subtitle="Moyenne des notes"
          color="emerald"
          icon={<Star className="w-5 h-5" />}
          stars
        />
        <MetricCard
          title="Taux de réussite"
          value={`${bookingSuccessRate}%`}
          subtitle="Réservations complétées"
          color="rose"
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <MetricCard
          title="Panier moyen"
          value={`${((stats.payments?.total_amount || 0) / (stats.bookings?.confirmed || 1)).toLocaleString()} FCFA`}
          subtitle="par réservation"
          color="amber"
          icon={<Wallet className="w-5 h-5" />}
        />
      </div>

      {/* Graphiques - Stack responsives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <ChartCard title="Évolution du CA" icon={<TrendingUp className="w-5 h-5" />}>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={revenueChartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c9a7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00c9a7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={window.innerWidth < 640 ? 2 : 0} />
              <YAxis tickFormatter={(value) => `${value}k`} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#00c9a7" fill="url(#revenueGradient)" name="CA (k FCFA)" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Réservations vs Utilisateurs" icon={<BarChart3 className="w-5 h-5" />}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={window.innerWidth < 640 ? 2 : 0} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="bookings" fill="#0f2940" name="Réservations" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" fill="#00c9a7" name="Nouveaux users" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Destinations et répartition - responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg lg:col-span-1">
          <h3 className="font-semibold text-base md:text-lg mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#00c9a7]" />
            Top Destinations
          </h3>
          <div className="space-y-3">
            {topDestinations.slice(0, 4).map((dest, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{dest.city}</p>
                    <p className="text-xs text-gray-400">{dest.count} réservations</p>
                  </div>
                </div>
                <p className="font-semibold text-[#00c9a7] text-sm">{(dest.revenue / 1000000).toFixed(1)}M FCFA</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg lg:col-span-2">
          <h3 className="font-semibold text-base md:text-lg mb-3 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#00c9a7]" />
            Répartition des propriétés
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <RePieChart>
                <Pie
                  data={[
                    { name: 'Appartements', value: 45, color: '#00c9a7' },
                    { name: 'Villas', value: 25, color: '#0f2940' },
                    { name: 'Studios', value: 15, color: '#ff6b6b' },
                    { name: 'Maisons', value: 10, color: '#f5a623' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Appartements', value: 45, color: '#00c9a7' },
                    { name: 'Villas', value: 25, color: '#0f2940' },
                    { name: 'Studios', value: 15, color: '#ff6b6b' },
                    { name: 'Maisons', value: 10, color: '#f5a623' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: 'Appartements', value: 45, color: '#00c9a7' },
                { label: 'Villas', value: 25, color: '#0f2940' },
                { label: 'Studios', value: 15, color: '#ff6b6b' },
                { label: 'Maisons', value: 10, color: '#f5a623' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs">{item.label}</span>
                  <span className="text-xs font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activités et alertes - responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg">
          <h3 className="font-semibold text-base md:text-lg mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00c9a7]" />
            Activités récentes
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {activities.slice(0, 8).map((act: any, idx: number) => (
              <div key={idx} className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition text-sm">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  {act.type === 'property_submitted' && <Home className="w-4 h-4 text-orange-500" />}
                  {act.type === 'payment_received' && <CreditCard className="w-4 h-4 text-green-500" />}
                  {act.type === 'user_registered' && <UserPlus className="w-4 h-4 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{act.title || act.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-lg">
          <h3 className="font-semibold text-base md:text-lg mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#00c9a7]" />
            Actions rapides
          </h3>
          <div className="space-y-3">
            <ActionCard
              title="Propriétés en attente"
              count={stats.properties?.pending || 0}
              color="yellow"
              icon={<Home className="w-5 h-5" />}
              action={() => onNavigate?.({ name: 'admin-properties' })}
            />
            <ActionCard
              title="Paiements en attente"
              count={stats.bookings?.pending_payment || 0}
              color="red"
              icon={<CreditCard className="w-5 h-5" />}
              action={() => onNavigate?.({ name: 'admin-payments' })}
            />
            <ActionCard
              title="Utilisateurs à vérifier"
              count={stats.users?.pending_verification || 0}
              color="green"
              icon={<Users className="w-5 h-5" />}
              action={() => onNavigate?.({ name: 'admin-users' })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants auxiliaires responsives
const StatsCard = ({ icon, title, value, subValue, trend, color, animated }: any) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 text-white transform transition-all duration-500 hover:scale-105`}>
      <div className="flex justify-between items-start">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        {trend && <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">↑ {trend}%</span>}
      </div>
      <p className="text-white/80 text-xs sm:text-sm mt-2">{title}</p>
      <p className="text-lg sm:text-xl md:text-2xl font-bold mt-0.5">{value}</p>
      <p className="text-white/60 text-xs mt-1 truncate">{subValue}</p>
    </div>
  );
};

const MetricCard = ({ title, value, subtitle, color, icon, stars }: any) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    emerald: 'from-emerald-500 to-emerald-600',
    rose: 'from-rose-500 to-rose-600',
    amber: 'from-amber-500 to-amber-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-3 sm:p-4 text-white hover:scale-105 transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div>{icon}</div>
        {stars && (
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 fill-yellow-300 text-yellow-300" />
            ))}
          </div>
        )}
      </div>
      <p className="text-white/80 text-xs mt-2">{title}</p>
      <p className="text-xl sm:text-2xl font-bold mt-0.5">{value}</p>
      <p className="text-white/60 text-xs mt-1">{subtitle}</p>
    </div>
  );
};

const ChartCard = ({ title, icon, children }: any) => (
  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-lg">
    <div className="flex items-center gap-2 mb-3">
      <div className="text-[#00c9a7]">{icon}</div>
      <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
    </div>
    {children}
  </div>
);

const ActionCard = ({ title, count, color, icon, action }: any) => {
  const colorClasses = {
    yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
    red: 'from-red-50 to-red-100 border-red-200',
    green: 'from-green-50 to-green-100 border-green-200',
  };

  const textColors = {
    yellow: 'text-yellow-800',
    red: 'text-red-800',
    green: 'text-green-800',
  };

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl p-3 flex items-center justify-between border`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full bg-white/50 flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className={`font-medium text-sm ${textColors[color]}`}>{title}</p>
          <p className={`text-xs ${textColors[color]} opacity-75`}>{count} élément(s)</p>
        </div>
      </div>
      <button
        onClick={action}
        className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium hover:shadow transition"
      >
        Voir
      </button>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="p-3 sm:p-4 md:p-6">
    <div className="animate-pulse">
      <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-200 rounded-xl h-28"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-200 rounded-xl h-64"></div>
        <div className="bg-gray-200 rounded-xl h-64"></div>
      </div>
    </div>
  </div>
);

const ErrorMessage = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4">
    <div className="text-red-500 text-xl mb-4">⚠️ Erreur de chargement</div>
    <p className="text-gray-600 text-sm text-center mb-6">Impossible de charger les données</p>
    <button onClick={onRetry} className="px-6 py-2 bg-[#00c9a7] text-white rounded-full">Réessayer</button>
  </div>
);