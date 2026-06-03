// components/PropertyCard.tsx
import { Heart, Star, Bed, Bath, Wifi, Wind, Zap } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: any;
  showDescription?: boolean;
  compact?: boolean;
}

export function PropertyCard({ property, showDescription = false, compact = false }: PropertyCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);

  // CORRECTION: Utiliser les bons champs de l'API Laravel
  const {
    id,
    title,
    description,
    city,
    district,
    price_per_night,
    average_rating,
    reviews_count,
    beds,
    bedrooms,
    bathrooms,
    max_guests,
    photos,
    cover_photo,
    has_wifi,
    has_air_conditioning,
    has_generator,
    bluefin_certified
  } = property;

  // Image par défaut ou depuis l'API / mapping client
  const imageUrl = property.images?.[0] || cover_photo?.photo_url || (photos?.[0]?.photo_url) || '/placeholder-house.jpg';

  // Prix formaté
  const formattedPrice = `${price_per_night?.toLocaleString() || '0'} FCFA`;

  // Nombre de lits (si non fourni, estimer par chambres)
  const bedCount = beds || bedrooms || 1;

  // Note moyenne
  const rating = average_rating || 0;
  const reviewCount = reviews_count || 0;

  const handleCardClick = () => {
    navigate(`/property/${id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('❤️ Clic favori pour:', title, 'ID:', id);
    toggleFavorite(property);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-lg rounded-2xl overflow-hidden bg-white ${compact ? 'max-w-sm' : ''}`}
      onClick={handleCardClick}
    >
      {/* Image avec overlay */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img 
          src={imageError ? '/placeholder-house.jpg' : imageUrl}
          alt={title || 'Logement'} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={handleImageError}
        />
        
        {/* Badge Bluefin Certifié */}
        {bluefin_certified && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            ✓ Bluefin Certifié
          </div>
        )}
        
        {/* Bouton favori */}
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-200 z-10 backdrop-blur-sm shadow-md hover:scale-110"
          aria-label="Ajouter aux favoris"
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-200 ${
              isFavorite(id) 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </button>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Titre et localisation */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-[#0F2940] text-lg line-clamp-1 hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              📍 {district}, {city}
            </p>
          </div>
          
          {/* Note */}
          {rating > 0 && (
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-sm">{rating.toFixed(1)}</span>
              {reviewCount > 0 && (
                <span className="text-xs text-gray-400">({reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Description (optionnel) */}
        {showDescription && description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* Équipements clés */}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
          {/* Lits */}
          {bedCount > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{bedCount} lit{bedCount > 1 ? 's' : ''}</span>
            </div>
          )}
          
          {/* Salles de bain */}
          {bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{bathrooms} sdb</span>
            </div>
          )}
          
          {/* Voyageurs max */}
          {max_guests > 0 && (
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>{max_guests} pers.</span>
            </div>
          )}
        </div>

        {/* Équipements spécifiques Bénin */}
        <div className="flex flex-wrap gap-2 mt-2">
          {has_wifi && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
              <Wifi className="w-3 h-3" /> Wi-Fi
            </span>
          )}
          {has_air_conditioning && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
              <Wind className="w-3 h-3" /> Clim
            </span>
          )}
          {has_generator && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full">
              <Zap className="w-3 h-3" /> Groupe électro
            </span>
          )}
        </div>

        {/* Prix */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-bold text-blue-600">{formattedPrice}</span>
              <span className="text-sm text-gray-500"> / nuit</span>
            </div>
            <button 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              Voir détails →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}