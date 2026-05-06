import { Heart, Star, Wifi, Wind, Zap } from 'lucide-react';
import { useState } from 'react';

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

export function ListingCard({
  image,
  title,
  type,
  rating,
  reviewCount,
  price,
  priceEur,
  badge,
  amenities = ['wifi', 'ac', 'generator'],
  onClick,
}: ListingCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,41,64,0.08)] hover:shadow-[0_8px_32px_rgba(15,41,64,0.12)] hover:scale-[1.01] transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f4fffe]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <button
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
        >
          <Heart className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-[#0f2940]'}`} />
        </button>
        {badge && (
          <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-medium text-white ${
            badge === 'certified' ? 'bg-[#00c9a7]' :
            badge === 'superhost' ? 'bg-[#0f2940]' :
            badge === 'new' ? 'bg-[#6b7280]' :
            'bg-[#0f2940]'
          }`}>
            {badge === 'certified' ? 'Certifié Bluefin' :
             badge === 'superhost' ? 'Superhost' :
             badge === 'new' ? 'Nouveau' :
             badge}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-[15px] text-[#0f2940] mb-1">{title}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[13px] text-[#6b7280]">{type}</span>
          <span className="text-[#6b7280]">•</span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#00c9a7] text-[#00c9a7]" />
            <span className="text-[13px] font-medium text-[#0f2940]">{rating}</span>
            <span className="text-[13px] text-[#6b7280]">({reviewCount})</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          {amenities.includes('wifi') && <Wifi className="w-4 h-4 text-[#00c9a7]" />}
          {amenities.includes('ac') && <Wind className="w-4 h-4 text-[#00c9a7]" />}
          {amenities.includes('generator') && <Zap className="w-4 h-4 text-[#00c9a7]" />}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#0f2940]">{price.toLocaleString()} XOF</span>
          <span className="text-[#0f2940]">/nuit</span>
          {priceEur && <span className="text-xs text-[#00c9a7]">≈ {priceEur} €</span>}
        </div>
      </div>
    </div>
  );
}
