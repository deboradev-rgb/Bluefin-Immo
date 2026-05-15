// components/PropertyCard.tsx
import { Heart, Star, Bed, Bath } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

interface PropertyCardProps {
  property: any;
  showDescription?: boolean;
  onNavigate?: (route: any) => void;
}

export function PropertyCard({ property, showDescription = false, onNavigate }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔥 Clic sur le cœur pour:', property.title, 'ID:', property.id);
    toggleFavorite(property);
  };

  // Vérifier si la propriété a les champs nécessaires
  const priceDisplay = property.priceDisplay || `${property.price?.toLocaleString()} FCFA / nuit`;

  return (
    <div 
      className="group cursor-pointer" 
      onClick={() => onNavigate?.({ name: 'listing', id: property.id.toString() })}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10 backdrop-blur-sm shadow-md"
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-200 ${
              isFavorite(property.id) 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-700 hover:text-red-500'
            }`} 
          />
        </button>
      </div>
      <div className="mt-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-semibold text-[#0F2940] line-clamp-1">{property.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{property.location}</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Star className="w-4 h-4 text-[#00c9a7] fill-current" />
            <span className="font-medium text-[#0F2940]">{property.rating}</span>
            <span>({property.reviews})</span>
          </div>
        </div>
        {showDescription && property.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{property.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
          {property.beds && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.beds} lit{property.beds > 1 ? 's' : ''}</span>
            </div>
          )}
          {property.baths && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.baths} sdb</span>
            </div>
          )}
        </div>
        <p className="mt-3 font-semibold text-[#0F2940]">{priceDisplay}</p>
      </div>
    </div>
  );
}