import { useState } from 'react';
import { Star, Users, Bed, Home, Bath, Wifi, Wind, Zap, Droplet, Lock, MapPin, ChevronLeft, Share, Heart } from 'lucide-react';
import { BookingWidget } from './BookingWidget';

interface ListingDetailProps {
  onBack?: () => void;
  onOpenBooking?: () => void;
}

export function ListingDetail({ onBack, onOpenBooking }: ListingDetailProps) {
  const [liked, setLiked] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  const photos = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&auto=format',
  ];

  return (
    <div className="bg-white pb-24 lg:pb-0">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#e2f5f2]">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e2f5f2] hover:border-[#00c9a7] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-[#0f2940]" />
        </button>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e2f5f2]">
            <Share className="w-4 h-4 text-[#0f2940]" />
          </button>
          <button
            onClick={() => setLiked(!liked)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-[#e2f5f2]"
          >
            <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-[#0f2940]'}`} />
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        {/* Desktop back + title */}
        <div className="hidden lg:block mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#0f2940] transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour aux résultats
          </button>
          <h1 className="text-3xl font-bold text-[#0f2940] mb-2">
            Appartement moderne avec vue · Haie Vive
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#00c9a7] text-[#00c9a7]" />
              <span className="font-medium">4.87</span>
              <span className="text-[#6b7280]">(124 avis)</span>
            </div>
            <span className="text-[#6b7280]">·</span>
            <span className="text-[#6b7280]">Haie Vive, Cotonou, Bénin</span>
          </div>
        </div>

        {/* Mobile title */}
        <div className="lg:hidden mb-4">
          <h1 className="text-xl font-bold text-[#0f2940] mb-1">
            Appartement moderne avec vue · Haie Vive
          </h1>
          <div className="flex items-center gap-3 text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#00c9a7] text-[#00c9a7]" />
              <span className="font-medium text-[#0f2940]">4.87</span>
              <span className="text-[#6b7280]">(124 avis)</span>
            </div>
            <span className="text-[#6b7280]">·</span>
            <span className="text-[#6b7280] text-xs">Haie Vive, Cotonou</span>
          </div>
        </div>

        {/* Photo gallery */}
        {/* Desktop: mosaic grid */}
        <div className="hidden lg:grid grid-cols-4 gap-2 mb-8 rounded-2xl overflow-hidden h-[400px]">
          <div className="col-span-2 row-span-2">
            <img src={photos[0]} alt="Vue principale" className="w-full h-full object-cover" />
          </div>
          {photos.slice(1, 4).map((photo, i) => (
            <div key={i} className="col-span-1 bg-[#f4fffe]">
              <img src={photo} alt={`Vue ${i + 2}`} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="col-span-1 relative bg-[#f4fffe]">
            <img src={photos[4]} alt="Vue 5" className="w-full h-full object-cover" />
            <button className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-medium hover:bg-black/50 transition-colors">
              Voir toutes les photos
            </button>
          </div>
        </div>

        {/* Mobile: swipeable single photo */}
        <div className="lg:hidden mb-4">
          <div className="relative rounded-2xl overflow-hidden bg-[#f4fffe]" style={{ aspectRatio: '4/3' }}>
            <img src={photos[activePhoto]} alt="Photo" className="w-full h-full object-cover" />
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === activePhoto ? 'bg-white w-4' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
            {photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(i)}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors bg-[#f4fffe] ${
                  i === activePhoto ? 'border-[#00c9a7]' : 'border-transparent'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content grid */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left: details */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Host info */}
            <div className="flex items-start justify-between pb-6 border-b border-[#e2f5f2]">
              <div>
                <h2 className="text-base lg:text-xl font-bold text-[#0f2940] mb-1">
                  Appartement entier hébergé par Marie
                </h2>
                <div className="flex items-center gap-1.5 text-sm text-[#6b7280] flex-wrap">
                  <span>4 voyageurs</span>
                  <span>·</span>
                  <span>2 chambres</span>
                  <span>·</span>
                  <span>3 lits</span>
                  <span>·</span>
                  <span>2 salles de bain</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#0f2940] flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="flex flex-col gap-1">
                  <div className="px-2.5 py-0.5 bg-[#00c9a7] text-white text-xs font-medium rounded-full text-center">
                    Superhost
                  </div>
                  <div className="px-2.5 py-0.5 bg-[#0f2940] text-white text-xs font-medium rounded-full text-center">
                    Certifié
                  </div>
                </div>
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4 pb-6 border-b border-[#e2f5f2]">
              {[
                { Icon: Users, label: '4 voyageurs', desc: 'Idéal pour les familles' },
                { Icon: Bed, label: '3 lits confortables', desc: '2 chambres spacieuses' },
                { Icon: Home, label: 'Logement entier', desc: 'Vous aurez touta surface pour vous' },
                { Icon: Bath, label: '2 salles de bain', desc: 'Modernes et équipées' },
              ].map(({ Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-2 lg:gap-3">
                  <Icon className="w-5 h-5 text-[#0f2940] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm lg:text-base text-[#0f2940]">{label}</div>
                    <div className="text-xs lg:text-sm text-[#6b7280]">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div className="pb-6 border-b border-[#e2f5f2]">
              <h3 className="font-bold text-base lg:text-lg text-[#0f2940] mb-4">Points forts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: Wifi, label: 'WiFi haut débit', desc: 'Connexion fibre rapide' },
                  { icon: Wind, label: 'Climatisation', desc: 'Dans toutes les pièces' },
                  { icon: Zap, label: 'Groupe électrogène', desc: 'Électricité 24h/24' },
                  { icon: Droplet, label: 'Eau courante', desc: 'Approvisionnement permanent' },
                  { icon: Lock, label: 'Parking sécurisé', desc: 'Gardien 24h/24' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3 p-3 lg:p-4 bg-[#f4fffe] rounded-xl">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[#00c9a7]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-[#00c9a7]" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-[#0f2940]">{label}</div>
                      <div className="text-xs text-[#6b7280]">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="pb-6 border-b border-[#e2f5f2]">
              <h3 className="font-bold text-base lg:text-lg text-[#0f2940] mb-3">Description</h3>
              <p className="text-sm lg:text-base text-[#0f2940] leading-relaxed">
                Magnifique appartement moderne situé dans le quartier prisé de Haie Vive à Cotonou.
                Idéalement situé à proximité des ambassades, restaurants et commerces. L'appartement
                dispose de tout le confort moderne : climatisation dans toutes les pièces, groupe
                électrogène pour une alimentation électrique continue, WiFi haut débit et eau courante permanente.
              </p>
              <p className="text-sm lg:text-base text-[#0f2940] leading-relaxed mt-3">
                Le quartier est sécurisé avec gardiennage 24h/24 et parking privé. À 10 minutes de
                l'aéroport Cadjèhoun et 5 minutes de la plage de Fidjrossè.
              </p>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-bold text-base lg:text-lg text-[#0f2940] mb-3">Emplacement</h3>
              <div className="bg-[#f4fffe] rounded-2xl h-48 lg:h-64 flex items-center justify-center border border-[#e2f5f2]">
                <div className="text-center text-[#6b7280]">
                  <MapPin className="w-10 h-10 mx-auto mb-2 text-[#00c9a7]" />
                  <p className="font-medium text-[#0f2940]">Haie Vive, Cotonou</p>
                  <p className="text-sm">10 min de l'aéroport · 5 min de la plage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: booking widget — desktop only */}
          <div className="hidden lg:block lg:col-span-1">
            <BookingWidget price={45000} priceEur={69} />
          </div>
        </div>
      </div>

      {/* Mobile sticky booking bar at bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#e2f5f2] px-4 py-3 flex items-center justify-between z-40 safe-area-pb">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-[#0f2940]">45 000 XOF</span>
            <span className="text-sm text-[#6b7280]">/nuit</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[#00c9a7]">
            <Star className="w-3 h-3 fill-[#00c9a7]" />
            <span>4.87 · 124 avis</span>
          </div>
        </div>
        <button
          onClick={onOpenBooking}
          className="bg-[#00c9a7] text-white px-6 py-3 rounded-full font-medium hover:bg-[#00b396] transition-colors"
        >
          Réserver
        </button>
      </div>
    </div>
  );
}
