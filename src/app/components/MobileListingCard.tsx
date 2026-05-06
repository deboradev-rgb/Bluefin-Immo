import { Heart, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MobileListingCardProps {
  image: string;
  location: string;
  title: string;
  rating: number;
  price: number;
  badge?: string;
}

export function MobileListingCard({ image, location, title, rating, price, badge }: MobileListingCardProps) {
  return (
    <div className="flex-shrink-0 w-[280px] bg-white rounded-2xl overflow-hidden shadow-md">
      <div className="relative aspect-[16/10]">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-2 right-2 p-2 rounded-full bg-white/90">
          <Heart className="w-4 h-4 text-[#0f2940]" />
        </button>
        {badge && (
          <div className="absolute top-2 left-2 bg-[#00c9a7] text-white px-2 py-1 rounded-full text-xs font-medium">
            {badge}
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-xs text-[#6b7280] mb-1">{location}</div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold text-[#0f2940]">{title}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-[#00c9a7] text-[#00c9a7]" />
            <span className="text-xs font-medium text-[#0f2940]">{rating}</span>
          </div>
        </div>
        <div className="text-sm font-bold text-[#00c9a7]">{price.toLocaleString()} XOF /nuit</div>
      </div>
    </div>
  );
}
