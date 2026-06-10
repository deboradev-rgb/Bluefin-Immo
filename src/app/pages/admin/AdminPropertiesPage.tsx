// src/app/pages/admin/AdminPropertiesPage.tsx

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Home, User, MapPin, Calendar, 
  CheckCircle, XCircle, Eye, 
  Wifi, Wind, Zap, Droplet, Users, Search,
  X, Star
} from 'lucide-react';
import adminService from '../../../services/admin.service';
import { useState } from 'react';
import toast from 'react-hot-toast';

// ✅ Fonctions utilitaires
const getImageUrl = (photo: any, propertyId?: number): string => {
  if (!photo) return '/placeholder.jpg';
  
  if (typeof photo === 'string') {
    if (photo.startsWith('http')) return photo;
    return '/placeholder.jpg';
  }
  
  let filename = '';
  let propId = propertyId || photo.property_id;
  
  if (photo.photo_path) {
    filename = photo.photo_path.split('/').pop() || '';
  } else if (photo.photo_url) {
    filename = photo.photo_url.split('/').pop() || '';
  } else if (photo.url) {
    filename = photo.url.split('/').pop() || '';
  }
  
  if (propId && filename) {
    return `https://api.bluefin-immo.com/api/property-image/${propId}/${filename}`;
  }
  
  if (photo.full_url && photo.full_url.startsWith('http')) {
    return photo.full_url;
  }
  
  if (photo.photo_url && photo.photo_url.startsWith('http')) {
    return photo.photo_url;
  }
  
  return '/placeholder.jpg';
};

const getPropertyImage = (property: any): string => {
  if (!property) return '/placeholder.jpg';
  
  if (property.photos && property.photos.length > 0) {
    return getImageUrl(property.photos[0], property.id);
  }
  
  if (property.cover_photo) {
    return getImageUrl(property.cover_photo, property.id);
  }
  
  return '/placeholder.jpg';
};

const getAllPropertyImages = (property: any): string[] => {
  const images: string[] = [];
  if (!property) return images;
  
  if (property.photos && Array.isArray(property.photos)) {
    for (const photo of property.photos) {
      const url = getImageUrl(photo, property.id);
      if (url && url !== '/placeholder.jpg') {
        images.push(url);
      }
    }
  }
  
  return images;
};

// ✅ Composant principal
export function AdminPropertiesPage({ onNavigate }: { onNavigate?: (route: any) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-pending-properties'],
    queryFn: () => adminService.getPendingProperties(),
    refetchInterval: 10000,
  });
  const queryClient = useQueryClient();

  const properties = data?.data?.data || data?.data || [];
  const stats = data?.stats || { total_pending: 0, pending_today: 0 };

  // ✅ Mutation pour approuver
  const approveMutation = useMutation({
    mutationFn: ({ id, notes, featured, isHotelPromoted }: { id: number; notes?: string; featured?: boolean; isHotelPromoted?: boolean }) =>
      adminService.approveProperty(id, notes, featured, isHotelPromoted),
    onSuccess: () => {
      toast.success('Propriété approuvée avec succès');
      queryClient.invalidateQueries({ queryKey: ['admin-pending-properties'] });
      setSelectedProperty(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de l’approbation');
    },
  });

  // ✅ Mutation pour rejeter
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      adminService.rejectProperty(id, reason),
    onSuccess: () => {
      toast.success('Propriété rejetée');
      queryClient.invalidateQueries({ queryKey: ['admin-pending-properties'] });
      setSelectedProperty(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors du rejet');
    },
  });

  // ✅ Mutation pour promouvoir en hôtel
  const promoteToHotelMutation = useMutation({
    mutationFn: ({ id, isHotelPromoted }: { id: number; isHotelPromoted: boolean }) =>
      adminService.toggleHotelPromotion(id, isHotelPromoted),
    onSuccess: (_, variables) => {
      toast.success(variables.isHotelPromoted ? '⭐ Propriété promue en hôtel' : '🏨 Propriété retirée des hôtels');
      queryClient.invalidateQueries({ queryKey: ['admin-pending-properties'] });
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la promotion');
    },
  });

  // ✅ Handlers
  const handleApprove = (property: any) => {
    const notes = prompt("Ajouter une note (optionnelle) :");
    const featured = confirm("Mettre cette propriété à la une ?");
    const isHotelPromoted = confirm("Mettre cette propriété dans la section hôtels ?");
    approveMutation.mutate({ 
      id: property.id, 
      notes: notes || undefined, 
      featured,
      isHotelPromoted 
    });
  };

  const handleReject = (property: any) => {
    const reason = prompt("Raison du rejet (requise) :");
    if (reason && reason.length >= 10) {
      rejectMutation.mutate({ id: property.id, reason });
    } else if (reason) {
      toast.error('La raison doit contenir au moins 10 caractères');
    }
  };

  const handlePromoteToHotel = (property: any) => {
    console.log('🔍 Promotion en cours pour:', property.id, property.title);
    const newStatus = !property.is_hotel_promoted;
    promoteToHotelMutation.mutate({ 
      id: property.id, 
      isHotelPromoted: newStatus 
    });
  };

  const openImagePreview = (images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
  };

  if (isLoading) return <LoadingSkeleton />;
  
  const filteredProperties = properties.filter((property: any) => {
    return searchTerm === '' || 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f2940] to-[#00c9a7] bg-clip-text text-transparent">
          Modération des propriétés
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Validez ou rejetez les annonces en attente</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<Home className="w-5 h-5" />} label="En attente" value={stats.total_pending || 0} color="yellow" />
        <StatCard icon={<Calendar className="w-5 h-5" />} label="Aujourd'hui" value={stats.pending_today || 0} color="blue" />
        <StatCard icon={<Users className="w-5 h-5" />} label="Hôtes" value={new Set(properties.map((p: any) => p.user_id)).size} color="green" />
        <StatCard icon={<MapPin className="w-5 h-5" />} label="Villes" value={new Set(properties.map((p: any) => p.city)).size} color="purple" />
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, ville ou hôte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00c9a7]"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
            <Home className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune propriété en attente de modération</p>
          </div>
        ) : (
          filteredProperties.map((property: any) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={() => setSelectedProperty(property)}
              onApprove={() => handleApprove(property)}
              onReject={() => handleReject(property)}
              onPromoteToHotel={() => handlePromoteToHotel(property)}
              onOpenImagePreview={openImagePreview}
            />
          ))
        )}
      </div>

      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onApprove={() => handleApprove(selectedProperty)}
          onReject={() => handleReject(selectedProperty)}
          onOpenImagePreview={openImagePreview}
        />
      )}

      {previewImages.length > 0 && (
        <ImagePreviewModal
          images={previewImages}
          currentIndex={previewIndex}
          onClose={() => setPreviewImages([])}
        />
      )}
    </div>
  );
}

// ✅ Composant PropertyCard
const PropertyCard = ({ property, onView, onApprove, onReject, onPromoteToHotel, onOpenImagePreview }: any) => {
  const [expanded, setExpanded] = useState(false);
  const mainImage = getPropertyImage(property);
  const imageUrls = getAllPropertyImages(property);
  const isHotelPromoted = property.is_hotel_promoted || false;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-48 shrink-0">
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-32 lg:h-28 rounded-lg object-cover cursor-pointer hover:opacity-80 transition"
              onClick={() => imageUrls.length > 0 && onOpenImagePreview(imageUrls, 0)}
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-[#0F2940]">{property.title}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{property.district}, {property.city}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base sm:text-lg font-bold text-[#00c9a7]">{property.price_per_night?.toLocaleString()} FCFA</p>
                <p className="text-xs text-gray-400">/ nuit</p>
              </div>
            </div>
            
            {isHotelPromoted && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#00c9a7]/10 text-[#00c9a7] text-xs rounded-full">
                  <Star className="w-3 h-3" /> Promu en hôtel
                </span>
              </div>
            )}
            
            <p className={`text-sm text-gray-600 mt-2 ${expanded ? '' : 'line-clamp-2'}`}>{property.description}</p>
            {property.description?.length > 100 && (
              <button onClick={() => setExpanded(!expanded)} className="text-xs text-[#00c9a7] mt-1 hover:underline">
                {expanded ? 'Voir moins' : 'Voir plus'}
              </button>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1"><User className="w-3 h-3" /><span>{property.user?.full_name || property.user?.email}</span></div>
              <div className="flex items-center gap-1"><Users className="w-3 h-3" /><span>{property.max_guests} personnes</span></div>
              <div className="flex items-center gap-1"><Home className="w-3 h-3" /><span>{property.bedrooms} chambres</span></div>
            </div>
          </div>
          
          <div className="flex lg:flex-col gap-2 justify-end shrink-0">
            <button onClick={onView} className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
              <Eye className="w-4 h-4" />
            </button>
            
            {!isHotelPromoted && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onPromoteToHotel();
                }} 
                className="px-3 py-2 bg-[#00c9a7]/10 text-[#00c9a7] rounded-lg text-sm hover:bg-[#00c9a7]/20 transition"
              >
                <Star className="w-4 h-4" />
              </button>
            )}
            
            <button onClick={onApprove} className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition">
              <CheckCircle className="w-4 h-4" />
            </button>
            
            <button onClick={onReject} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ ImagePreviewModal
const ImagePreviewModal = ({ images, currentIndex, onClose }: { images: string[]; currentIndex: number; onClose: () => void }) => {
  const [index, setIndex] = useState(currentIndex);
  const prevImage = () => setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  const nextImage = () => setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));

  if (!images.length) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition"><X className="w-6 h-6" /></button>
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 text-white bg-black/50 rounded-full p-2">◀</button>
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 text-white bg-black/50 rounded-full p-2">▶</button>
        </>
      )}
      <img src={images[index]} alt="Preview" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} />
      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">{index + 1} / {images.length}</div>
    </div>
  );
};

// ✅ PropertyDetailModal
const PropertyDetailModal = ({ property, onClose, onApprove, onReject, onOpenImagePreview }: any) => {
  const imageUrls = getAllPropertyImages(property);

  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">Détails</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">✕</button>
        </div>
        <div className="p-5 space-y-5">
          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {imageUrls.slice(0, 4).map((url, idx) => (
                <img key={idx} src={url} className="w-full h-32 object-cover rounded-lg cursor-pointer" onClick={() => onOpenImagePreview(imageUrls, idx)} onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.jpg'; }} />
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-gray-500 text-xs">Titre</p><p className="font-semibold">{property.title}</p></div>
            <div><p className="text-gray-500 text-xs">Prix</p><p className="font-semibold text-[#00c9a7]">{property.price_per_night?.toLocaleString()} FCFA</p></div>
            <div><p className="text-gray-500 text-xs">Localisation</p><p>{property.district}, {property.city}</p></div>
            <div><p className="text-gray-500 text-xs">Capacité</p><p>{property.max_guests} pers.</p></div>
          </div>
          <div><p className="text-gray-500 text-xs">Description</p><p className="text-sm">{property.description}</p></div>
        </div>
        <div className="sticky bottom-0 bg-white p-4 border-t flex gap-3">
          <button onClick={onApprove} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold">✓ Approuver</button>
          <button onClick={onReject} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold">✗ Rejeter</button>
        </div>
      </div>
    </div>
  );
};

// ✅ StatCard
const StatCard = ({ icon, label, value, color }: any) => {
  const colors = { yellow: 'from-yellow-500 to-yellow-600', blue: 'from-blue-500 to-blue-600', green: 'from-green-500 to-green-600', purple: 'from-purple-500 to-purple-600' };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-3 text-white`}>
      <div className="flex justify-between items-center">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">{icon}</div>
        <span className="text-xl font-bold">{value}</span>
      </div>
      <p className="text-white/80 text-xs mt-1">{label}</p>
    </div>
  );
};

// ✅ LoadingSkeleton
const LoadingSkeleton = () => (
  <div className="p-3 sm:p-4 md:p-6">
    <div className="animate-pulse">
      <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 mb-4"></div>
      <div className="grid grid-cols-4 gap-3 mb-6">{ [1,2,3,4].map(i => <div key={i} className="bg-gray-200 rounded-xl h-20"></div>) }</div>
      <div className="bg-gray-200 rounded-xl h-12 mb-6"></div>
      <div className="space-y-4">{ [1,2,3].map(i => <div key={i} className="bg-gray-200 rounded-xl h-32"></div>) }</div>
    </div>
  </div>
);