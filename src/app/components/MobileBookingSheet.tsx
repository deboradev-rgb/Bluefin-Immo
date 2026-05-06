import { X, Calendar, Users, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface MobileBookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileBookingSheet({ isOpen, onClose }: MobileBookingSheetProps) {
  const [guests, setGuests] = useState(2);
  const price = 45000;
  const nights = 3;
  const subtotal = price * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50" onClick={onClose}>
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[#e2f5f2] rounded-full"></div>
        </div>
        <div className="sticky top-0 bg-white border-b border-[#e2f5f2] px-6 py-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#0f2940]">{price.toLocaleString()} XOF</span>
            <span className="text-sm text-[#0f2940]">/nuit</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#00c9a7]">≈ 69 €</span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[#e2f5f2] flex items-center justify-center hover:border-[#00c9a7] transition-colors"
            >
              <X className="w-4 h-4 text-[#0f2940]" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-[#0f2940] mb-3 block">Dates du séjour</label>
            <div className="bg-[#f4fffe] rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#00c9a7]" />
                <div className="flex-1">
                  <div className="text-xs text-[#6b7280]">Arrivée</div>
                  <div className="font-medium text-[#0f2940]">6 mai 2026</div>
                </div>
              </div>
              <div className="h-px bg-[#e2f5f2]"></div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#00c9a7]" />
                <div className="flex-1">
                  <div className="text-xs text-[#6b7280]">Départ</div>
                  <div className="font-medium text-[#0f2940]">9 mai 2026</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#0f2940] mb-3 block">Voyageurs</label>
            <div className="bg-[#f4fffe] rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[#00c9a7]" />
                <span className="font-medium text-[#0f2940]">{guests} voyageurs</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-10 h-10 rounded-full bg-white border border-[#e2f5f2] flex items-center justify-center"
                >
                  <Minus className="w-5 h-5 text-[#0f2940]" />
                </button>
                <span className="w-8 text-center font-medium text-[#0f2940]">{guests}</span>
                <button
                  onClick={() => setGuests(guests + 1)}
                  className="w-10 h-10 rounded-full bg-white border border-[#e2f5f2] flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 text-[#0f2940]" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#f4fffe] rounded-2xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">{price.toLocaleString()} XOF × {nights} nuits</span>
              <span className="text-[#0f2940] font-medium">{subtotal.toLocaleString()} XOF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">Frais de service</span>
              <span className="text-[#0f2940] font-medium">{serviceFee.toLocaleString()} XOF</span>
            </div>
            <div className="h-px bg-[#e2f5f2]"></div>
            <div className="flex justify-between">
              <span className="font-bold text-[#0f2940]">Total</span>
              <div className="text-right">
                <div className="font-bold text-lg text-[#0f2940]">{total.toLocaleString()} XOF</div>
                <div className="text-xs text-[#00c9a7]">≈ {Math.round(total / 655)} €</div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[#0f2940] mb-3 block">Mode de paiement</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'MTN MoMo', color: 'bg-yellow-400' },
                { name: 'Moov', color: 'bg-blue-500 text-white' },
                { name: 'Orange', color: 'bg-orange-500 text-white' },
                { name: 'Carte', color: 'bg-[#6b7280] text-white' },
              ].map((payment, idx) => (
                <button
                  key={idx}
                  className={`p-4 rounded-xl border-2 font-medium text-sm transition-all ${
                    idx === 0
                      ? 'border-[#00c9a7] ' + payment.color
                      : 'border-[#e2f5f2] bg-white'
                  }`}
                >
                  {payment.name}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full bg-[#00c9a7] text-white py-4 rounded-full font-medium text-lg">
            Réserver maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
