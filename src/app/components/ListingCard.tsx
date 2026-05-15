import { Heart, Star, Wifi, Wind, Zap } from 'lucide-react';
import { useState } from 'react';
import { ListingDetail } from './components/ListingDetail';

interface ListingCardProps {
  image: string;
  title: string;
  type: string;
  rating: number;
  reviewCount: number;
  price: number;
  priceEur?: number;
  badge?: string;
  amenities?: string[];
  location?: string;
  onClick?: () => void;
}

export function  ListingCard({ onNavigate, id }: PageProps & { id?: string }) {
  console.log("===  ListingCard - ID reçu de l'URL:", id); // Debug
  
  const property = findPropertyById(id || '1');
  
  console.log("===  ListingCard - Propriété trouvée:", property ? property.title : "AUCUNE"); // Debug
  
  // Si la propriété n'existe pas, afficher un message d'erreur
  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-semibold text-[#0F2940] mb-2">Logement introuvable</h1>
          <p className="text-gray-500 mb-4">
            Le logement que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <p className="text-sm text-gray-400 mb-6">ID recherché: {id || 'non spécifié'}</p>
          <button 
            onClick={() => onNavigate?.({ name: 'home' })}
            className="px-6 py-3 bg-[#00c9a7] text-[#0F2940] rounded-full font-semibold hover:bg-[#00b892] transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Passer la propriété trouvée à ListingDetail
  return (
    <ListingDetail 
      property={property}
      onBack={() => onNavigate?.({ name: 'home' })}
      onOpenBooking={() => onNavigate?.({ name: 'booking', id: property.id.toString() })}
    />
  );
}