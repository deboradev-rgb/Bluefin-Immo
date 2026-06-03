// src/app/pages/admin/AdminReportsPage.tsx
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, Download, Calendar, TrendingUp, Users, 
  Home, CreditCard, DollarSign, PieChart, BarChart3,
  ArrowUp, ArrowDown, Printer, Mail, Share2,
  ChevronRight, DownloadCloud, FileSpreadsheet, FileJson,
  RefreshCw, Award, Activity, Clock, Zap, Target
} from 'lucide-react';
import adminService from '../../../services/admin.service';
import { useState } from 'react';
import toast from 'react-hot-toast';
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
  Area
} from 'recharts';

export function AdminReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'annual' | 'custom'>('monthly');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'users' | 'properties'>('overview');
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-reports-summary', selectedPeriod, customStartDate, customEndDate],
    queryFn: () => adminService.getSummaryReport({
      period: selectedPeriod,
      start_date: customStartDate,
      end_date: customEndDate,
    }),
  });

  if (isLoading) return <LoadingSkeleton />;
  
  const report = data?.data || {};
  const chartData = report.chart_data || { labels: [], revenue: [], users: [], bookings: [] };
  
  const revenueChartData = chartData.labels.map((label: string, idx: number) => ({
    name: label,
    revenue: chartData.revenue?.[idx] || 0,
    users: chartData.users?.[idx] || 0,
    bookings: chartData.bookings?.[idx] || 0,
  }));

  // Statistiques de croissance
  const growthRates = {
    users: report.users_growth || 12.5,
    properties: report.properties_growth || 8.3,
    bookings: report.bookings_growth || 15.7,
    revenue: report.revenue_growth || 22.4,
  };

  // Répartition des propriétés par type
  const propertyTypes = [
    { name: 'Appartements', value: report.appartements_count || 45, color: '#00c9a7' },
    { name: 'Villas', value: report.villas_count || 25, color: '#0f2940' },
    { name: 'Studios', value: report.studios_count || 15, color: '#ff6b6b' },
    { name: 'Maisons', value: report.maisons_count || 10, color: '#f5a623' },
  ];

  // Méthodes de paiement
  const paymentMethods = [
    { name: 'Mobile Money', value: report.mobile_money_percentage || 65, color: '#00c9a7' },
    { name: 'Carte bancaire', value: report.card_percentage || 25, color: '#0f2940' },
    { name: 'Autres', value: report.other_percentage || 10, color: '#ff6b6b' },
  ];

  const exportReport = async (format: 'csv' | 'pdf' | 'excel' | 'json') => {
    try {
      const blob = await adminService.exportReport(selectedPeriod, format, {
        start_date: customStartDate,
        end_date: customEndDate,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_${selectedPeriod}_${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'xlsx' : format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Export ${format.toUpperCase()} lancé avec succès`);
    } catch {
      toast.error('Erreur lors de l\'export');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rapport Bluefin-Immo',
          text: `Rapport ${selectedPeriod} - ${report.total_revenue?.toLocaleString()} FCFA de CA`,
          url: window.location.href,
        });
        toast.success('Partagé avec succès');
      } catch {
        toast.error('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papier');
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f2940] to-[#00c9a7] bg-clip-text text-transparent">
            Rapports & analyses
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Analysez la performance de votre plateforme</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            title="Imprimer"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            title="Partager"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => refetch()}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sélecteur de période */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <PeriodButton
              active={selectedPeriod === 'monthly'}
              onClick={() => setSelectedPeriod('monthly')}
              label="Mensuel"
            />
            <PeriodButton
              active={selectedPeriod === 'annual'}
              onClick={() => setSelectedPeriod('annual')}
              label="Annuel"
            />
            <PeriodButton
              active={selectedPeriod === 'custom'}
              onClick={() => setSelectedPeriod('custom')}
              label="Personnalisé"
            />
          </div>
          
          {selectedPeriod === 'custom' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
              />
              <span className="text-gray-400 self-center hidden sm:inline">→</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="📊 Vue d'ensemble" />
        <TabButton active={activeTab === 'financial'} onClick={() => setActiveTab('financial')} label="💰 Financier" />
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="👥 Utilisateurs" />
        <TabButton active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} label="🏠 Propriétés" />
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'overview' && (
        <OverviewTab report={report} growthRates={growthRates} chartData={revenueChartData} />
      )}
      
      {activeTab === 'financial' && (
        <FinancialTab report={report} paymentMethods={paymentMethods} chartData={revenueChartData} />
      )}
      
      {activeTab === 'users' && (
        <UsersTab report={report} growthRates={growthRates} />
      )}
      
      {activeTab === 'properties' && (
        <PropertiesTab report={report} propertyTypes={propertyTypes} growthRates={growthRates} />
      )}

      {/* Section export */}
      <div className="mt-6 bg-white rounded-xl sm:rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          <Download className="w-5 h-5 text-[#00c9a7]" />
          Exporter le rapport
        </h3>
        <div className="flex flex-wrap gap-3">
          <ExportButton onClick={() => exportReport('csv')} icon={<FileSpreadsheet className="w-4 h-4" />} label="CSV" color="green" />
          <ExportButton onClick={() => exportReport('excel')} icon={<FileSpreadsheet className="w-4 h-4" />} label="Excel" color="blue" />
          <ExportButton onClick={() => exportReport('pdf')} icon={<FileText className="w-4 h-4" />} label="PDF" color="red" />
          <ExportButton onClick={() => exportReport('json')} icon={<FileJson className="w-4 h-4" />} label="JSON" color="purple" />
        </div>
      </div>
    </div>
  );
}

// Onglet Vue d'ensemble
const OverviewTab = ({ report, growthRates, chartData }: any) => (
  <div className="space-y-6">
    {/* Cartes KPI */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Chiffre d'affaires"
        value={`${(report.total_revenue || 0).toLocaleString()} FCFA`}
        growth={growthRates.revenue}
        icon={<DollarSign className="w-5 h-5" />}
        color="green"
      />
      <KPICard
        title="Utilisateurs"
        value={(report.total_users || 0).toLocaleString()}
        growth={growthRates.users}
        icon={<Users className="w-5 h-5" />}
        color="blue"
      />
      <KPICard
        title="Réservations"
        value={(report.total_bookings || 0).toLocaleString()}
        growth={growthRates.bookings}
        icon={<Calendar className="w-5 h-5" />}
        color="purple"
      />
      <KPICard
        title="Propriétés"
        value={(report.total_properties || 0).toLocaleString()}
        growth={growthRates.properties}
        icon={<Home className="w-5 h-5" />}
        color="orange"
      />
    </div>

    {/* Graphique d'évolution */}
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[#00c9a7]" />
        Évolution des revenus
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00c9a7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00c9a7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
          <Area type="monotone" dataKey="revenue" stroke="#00c9a7" fill="url(#revenueGradient)" name="CA (FCFA)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    {/* Résumé des périodes */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="font-semibold text-sm mb-3">📈 Période actuelle</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Nouveaux utilisateurs</span>
            <span className="font-semibold">{report.new_users || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Nouvelles propriétés</span>
            <span className="font-semibold">{report.new_properties || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Réservations</span>
            <span className="font-semibold">{report.bookings_count || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Chiffre d'affaires</span>
            <span className="font-semibold text-[#00c9a7]">{(report.revenue || 0).toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="font-semibold text-sm mb-3">🏆 Performances</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Panier moyen</span>
            <span className="font-semibold">{((report.total_revenue || 0) / (report.total_bookings || 1)).toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Taux de conversion</span>
            <span className="font-semibold text-green-600">{report.conversion_rate || 0}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Satisfaction</span>
            <span className="font-semibold">{report.satisfaction_rate || 4.8}/5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Taux d'occupation</span>
            <span className="font-semibold">{report.occupancy_rate || 68}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Onglet Financier
const FinancialTab = ({ report, paymentMethods, chartData }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
        <p className="text-white/80 text-sm">Revenus totaux</p>
        <p className="text-2xl font-bold mt-1">{report.total_revenue?.toLocaleString() || 0} FCFA</p>
        <p className="text-white/60 text-xs mt-2">Depuis la création</p>
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
        <p className="text-white/80 text-sm">Transactions</p>
        <p className="text-2xl font-bold mt-1">{report.total_transactions || 0}</p>
        <p className="text-white/60 text-xs mt-2">+{report.new_transactions || 0} cette période</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
        <p className="text-white/80 text-sm">Commission moyenne</p>
        <p className="text-2xl font-bold mt-1">{report.average_commission || 12}%</p>
        <p className="text-white/60 text-xs mt-2">par transaction</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-base mb-4">📊 Méthodes de paiement</h3>
        <ResponsiveContainer width="100%" height={250}>
          <RePieChart>
            <Pie
              data={paymentMethods}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {paymentMethods.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RePieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-base mb-4">📈 Revenus par période</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => `${value.toLocaleString()} FCFA`} />
            <Bar dataKey="revenue" fill="#00c9a7" name="CA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

// Onglet Utilisateurs
const UsersTab = ({ report, growthRates }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UserStatCard
        title="Total utilisateurs"
        value={report.total_users || 0}
        growth={growthRates.users}
        icon={<Users className="w-5 h-5" />}
        color="blue"
      />
      <UserStatCard
        title="Hôtes"
        value={report.total_hosts || 0}
        growth={report.hosts_growth || 8}
        icon={<Home className="w-5 h-5" />}
        color="green"
      />
      <UserStatCard
        title="Voyageurs"
        value={report.total_travelers || 0}
        growth={report.travelers_growth || 15}
        icon={<Users className="w-5 h-5" />}
        color="purple"
      />
      <UserStatCard
        title="Actifs"
        value={report.active_users || 0}
        growth={report.active_users_growth || 10}
        icon={<Activity className="w-5 h-5" />}
        color="orange"
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="font-semibold text-sm mb-3">🆕 Nouveaux inscrits</h4>
        <p className="text-2xl font-bold text-[#00c9a7]">{report.new_users || 0}</p>
        <p className="text-sm text-gray-500 mt-1">Cette période</p>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h4 className="font-semibold text-sm mb-3">🎯 Taux de rétention</h4>
        <p className="text-2xl font-bold text-[#00c9a7]">{report.retention_rate || 78}%</p>
        <p className="text-sm text-gray-500 mt-1">Utilisateurs revenant</p>
      </div>
    </div>
  </div>
);

// Onglet Propriétés
const PropertiesTab = ({ report, propertyTypes, growthRates }: any) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <PropertyStatCard
        title="Total propriétés"
        value={report.total_properties || 0}
        growth={growthRates.properties}
        icon={<Home className="w-5 h-5" />}
        color="green"
      />
      <PropertyStatCard
        title="Actives"
        value={report.active_properties || 0}
        growth={report.active_properties_growth || 12}
        icon={<Award className="w-5 h-5" />}
        color="blue"
      />
      <PropertyStatCard
        title="En attente"
        value={report.pending_properties || 0}
        growth={-5}
        icon={<Clock className="w-5 h-5" />}
        color="yellow"
      />
      <PropertyStatCard
        title="Publiées"
        value={report.published_properties || 0}
        growth={report.published_growth || 15}
        icon={<Zap className="w-5 h-5" />}
        color="purple"
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-base mb-4">🏠 Répartition par type</h3>
        <ResponsiveContainer width="100%" height={250}>
          <RePieChart>
            <Pie
              data={propertyTypes}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {propertyTypes.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RePieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-base mb-4">📍 Top destinations</h3>
        <div className="space-y-3">
          {report.top_cities?.map((city: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span>{city.name}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-sm text-gray-500">{city.count} propriétés</span>
                <span className="font-semibold text-[#00c9a7]">{city.revenue?.toLocaleString()} FCFA</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Composants auxiliaires
const PeriodButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
      active ? 'bg-[#00c9a7] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const TabButton = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
      active ? 'bg-[#00c9a7] text-white' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

const ExportButton = ({ onClick, icon, label, color }: any) => {
  const colors = {
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    red: 'bg-red-50 text-red-600 hover:bg-red-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${colors[color]}`}
    >
      {icon}
      {label}
    </button>
  );
};

const KPICard = ({ title, value, growth, icon, color }: any) => {
  const isPositive = growth >= 0;
  const colors = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-white transform hover:scale-105 transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(growth)}%
        </div>
      </div>
      <p className="text-white/80 text-xs mt-3">{title}</p>
      <p className="text-xl font-bold mt-0.5">{value}</p>
    </div>
  );
};

const UserStatCard = ({ title, value, growth, icon, color }: any) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-white`}>
      <div className="flex justify-between items-center">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">↑ {growth}%</span>
      </div>
      <p className="text-white/80 text-xs mt-2">{title}</p>
      <p className="text-2xl font-bold mt-0.5">{value.toLocaleString()}</p>
    </div>
  );
};

const PropertyStatCard = ({ title, value, growth, icon, color }: any) => {
  const isPositive = growth >= 0;
  const colors = {
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-white`}>
      <div className="flex justify-between items-center">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <span className={`text-xs ${isPositive ? 'text-green-200' : 'text-red-200'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(growth)}%
        </span>
      </div>
      <p className="text-white/80 text-xs mt-2">{title}</p>
      <p className="text-2xl font-bold mt-0.5">{value.toLocaleString()}</p>
    </div>
  );
};

// Skeleton de chargement
const LoadingSkeleton = () => (
  <div className="p-3 sm:p-4 md:p-6">
    <div className="animate-pulse">
      <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="bg-gray-200 rounded-xl h-16 mb-6"></div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-200 rounded-xl h-28"></div>)}
      </div>
      <div className="bg-gray-200 rounded-xl h-80 mb-6"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-200 rounded-xl h-40"></div>
        <div className="bg-gray-200 rounded-xl h-40"></div>
      </div>
    </div>
  </div>
);