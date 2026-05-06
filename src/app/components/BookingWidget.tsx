import { Calendar, Users, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface BookingWidgetProps {
  price: number;
  priceEur: number;
}

export function BookingWidget({ price, priceEur }: BookingWidgetProps) {
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(3);

  const subtotal = price * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  return (
    <div className="bg-white border border-[#e2f5f2] rounded-2xl p-6 shadow-[0_4px_24px_rgba(15,41,64,0.08)] sticky top-24">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold text-[#0f2940]">{price.toLocaleString()} XOF</span>
          <span className="text-[#0f2940]">/nuit</span>
        </div>
        <span className="text-sm text-[#00c9a7]">≈ {priceEur} €</span>
      </div>

      <div className="border border-[#e2f5f2] rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 border-b border-[#e2f5f2]">
          <div className="p-3 border-r border-[#e2f5f2]">
            <label className="text-xs font-medium text-[#6b7280] block mb-1">Arrivée</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00c9a7]" />
              <span className="text-sm text-[#0f2940]">06/05/26</span>
            </div>
          </div>
          <div className="p-3">
            <label className="text-xs font-medium text-[#6b7280] block mb-1">Départ</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00c9a7]" />
              <span className="text-sm text-[#0f2940]">09/05/26</span>
            </div>
          </div>
        </div>
        <div className="p-3">
          <label className="text-xs font-medium text-[#6b7280] block mb-2">Voyageurs</label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00c9a7]" />
              <span className="text-sm text-[#0f2940]">{guests} voyageurs</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-8 h-8 rounded-full border border-[#e2f5f2] flex items-center justify-center hover:border-[#00c9a7] transition-colors"
              >
                <Minus className="w-4 h-4 text-[#0f2940]" />
              </button>
              <button
                onClick={() => setGuests(guests + 1)}
                className="w-8 h-8 rounded-full border border-[#e2f5f2] flex items-center justify-center hover:border-[#00c9a7] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#0f2940]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6 pb-6 border-b border-[#e2f5f2]">
        <div className="flex justify-between text-sm">
          <span className="text-[#6b7280]">{price.toLocaleString()} XOF × {nights} nuits</span>
          <span className="text-[#0f2940]">{subtotal.toLocaleString()} XOF</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6b7280]">Frais de service Bluefin</span>
          <span className="text-[#0f2940]">{serviceFee.toLocaleString()} XOF</span>
        </div>
      </div>

      <div className="flex justify-between items-baseline mb-6">
        <span className="font-bold text-[#0f2940]">Total</span>
        <div className="text-right">
          <div className="text-xl font-bold text-[#0f2940]">{total.toLocaleString()} XOF</div>
          <div className="text-xs text-[#00c9a7]">≈ {Math.round(total / 655)} €</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-medium text-[#6b7280] mb-2">Paiement accepté</div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-yellow-400 rounded text-xs font-medium">MTN MoMo</div>
          <div className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium">Moov</div>
          <div className="px-2 py-1 bg-orange-500 text-white rounded text-xs font-medium">Orange</div>
          <div className="px-2 py-1 bg-[#6b7280] text-white rounded text-xs font-medium">Carte</div>
        </div>
      </div>

      <button className="w-full bg-[#00c9a7] text-white py-4 rounded-full font-medium hover:bg-[#00b396] transition-colors mb-3">
        Réserver maintenant
      </button>

      <button className="w-full border-2 border-[#0f2940] text-[#0f2940] py-3 rounded-full font-medium hover:bg-[#0f2940] hover:text-white transition-colors">
        Contacter l'hôte
      </button>
    </div>
  );
}
