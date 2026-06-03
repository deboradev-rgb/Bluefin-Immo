// components/BookingWidget.tsx
import { Calendar, Users, Minus, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../../services/booking.service';
import propertyService from '../../services/property.service'; 
import { useAuth } from '../hooks/useAuth';
import CheckoutModal from './CheckoutModal';

interface BookingWidgetProps {
  propertyId: number;
  pricePerNight: number;
  pricePerNightEur?: number;
  minStay?: number;
  maxGuests?: number;
}

export function BookingWidget({ 
  propertyId, 
  pricePerNight, 
  pricePerNightEur, 
  minStay = 1, 
  maxGuests = 10 
}: BookingWidgetProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // États pour les dates et voyageurs
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(0);
  const [loading, setLoading] = useState(false);
  const [priceDetails, setPriceDetails] = useState<{
    subtotal: number;
    serviceFee: number;
    total: number;
    nights: number;
  } | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  // Calculer le nombre de nuits et vérifier la disponibilité
  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
      
      if (diffDays >= minStay) {
        checkAvailability();
      } else {
        setAvailabilityError(`Séjour minimum de ${minStay} nuit(s)`);
        setIsAvailable(false);
      }
    } else {
      setNights(0);
      setPriceDetails(null);
    }
  }, [checkIn, checkOut, guests]);

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) return;
    setLoading(true);
    setAvailabilityError(null);
    try {
      const response = await propertyService.checkAvailability(propertyId, checkIn, checkOut, guests);
      if (response.data.available) {
        setIsAvailable(true);
        setPriceDetails(response.data.price_details);
      } else {
        setIsAvailable(false);
        setAvailabilityError('Ces dates ne sont pas disponibles');
      }
    } catch (err: any) {
      setAvailabilityError(err.response?.data?.message || 'Erreur de vérification');
      setIsAvailable(false);
    } finally {
      setLoading(false);
    }
  };

 const handleReservation = () => {
    if (!isAuthenticated) {
        navigate('/login', { state: { from: `/property/${propertyId}` } });
        return;
    }

    if (!isAvailable || !priceDetails || !checkIn || !checkOut) {
        alert('Veuillez sélectionner des dates valides');
        return;
    }

    // ✅ Log de débogage
    console.log('🔍 Navigation vers réservation:', {
        propertyId,
        checkIn,
        checkOut,
        guests,
        nights
    });

    navigate(`/booking/${propertyId}?check_in=${checkIn}&check_out=${checkOut}&guests=${guests}&nights=${nights}`);
};

  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckoutSuccess = (bookingId: number) => {
    // navigate to confirmation
    navigate(`/reserver/confirmation/${bookingId}`);
  };

  // Formater les dates pour l'affichage (DD/MM/YY)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '--/--/--';
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear().toString().slice(-2)}`;
  };

  return (
    <div className="bg-white border border-[#e2f5f2] rounded-2xl p-6 shadow-[0_4px_24px_rgba(15,41,64,0.08)] sticky top-24">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-bold text-[#0f2940]">{pricePerNight.toLocaleString()} XOF</span>
          <span className="text-[#0f2940]">/nuit</span>
        </div>
        {pricePerNightEur && (
          <span className="text-sm text-[#00c9a7]">≈ {pricePerNightEur} €</span>
        )}
      </div>

      {/* Sélecteur de dates */}
      <div className="border border-[#e2f5f2] rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 border-b border-[#e2f5f2]">
          <div className="p-3 border-r border-[#e2f5f2]">
            <label className="text-xs font-medium text-[#6b7280] block mb-1">Arrivée</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00c9a7]" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="text-sm text-[#0f2940] bg-transparent focus:outline-none"
              />
            </div>
          </div>
          <div className="p-3">
            <label className="text-xs font-medium text-[#6b7280] block mb-1">Départ</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00c9a7]" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                disabled={!checkIn}
                className="text-sm text-[#0f2940] bg-transparent focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>
        </div>
        <div className="p-3">
          <label className="text-xs font-medium text-[#6b7280] block mb-2">Voyageurs</label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00c9a7]" />
              <span className="text-sm text-[#0f2940]">{guests} voyageur{guests > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-8 h-8 rounded-full border border-[#e2f5f2] flex items-center justify-center hover:border-[#00c9a7] transition-colors"
              >
                <Minus className="w-4 h-4 text-[#0f2940]" />
              </button>
              <button
                onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                className="w-8 h-8 rounded-full border border-[#e2f5f2] flex items-center justify-center hover:border-[#00c9a7] transition-colors"
              >
                <Plus className="w-4 h-4 text-[#0f2940]" />
              </button>
            </div>
          </div>
          {guests > maxGuests && (
            <p className="text-xs text-red-500 mt-1">Maximum {maxGuests} voyageurs</p>
          )}
        </div>
      </div>

      {/* Message d'erreur disponibilité */}
      {availabilityError && (
        <div className="bg-red-50 text-red-600 text-sm p-2 rounded-lg mb-4">
          {availabilityError}
        </div>
      )}

      {/* Détail des prix */}
      {priceDetails && isAvailable && (
        <>
          <div className="space-y-3 mb-6 pb-6 border-b border-[#e2f5f2]">
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">{pricePerNight.toLocaleString()} XOF × {priceDetails.nights} nuits</span>
              <span className="text-[#0f2940]">{priceDetails.subtotal.toLocaleString()} XOF</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6b7280]">Frais de service Bluefin</span>
              <span className="text-[#0f2940]">{priceDetails.serviceFee.toLocaleString()} XOF</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline mb-6">
            <span className="font-bold text-[#0f2940]">Total</span>
            <div className="text-right">
              <div className="text-xl font-bold text-[#0f2940]">{priceDetails.total.toLocaleString()} XOF</div>
              <div className="text-xs text-[#00c9a7]">≈ {Math.round(priceDetails.total / 655)} €</div>
            </div>
          </div>
        </>
      )}

      <div className="mb-4">
        <div className="text-xs font-medium text-[#6b7280] mb-2">Paiement accepté</div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-2 py-1 bg-yellow-400 rounded text-xs font-medium">MTN MoMo</div>
          <div className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium">Moov</div>
          <div className="px-2 py-1 bg-orange-500 text-white rounded text-xs font-medium">Orange</div>
          <div className="px-2 py-1 bg-[#6b7280] text-white rounded text-xs font-medium">Carte</div>
        </div>
      </div>

      <button
        onClick={handleReservation}
        disabled={!isAvailable || !checkIn || !checkOut || loading}
        className="w-full bg-[#00c9a7] text-white py-4 rounded-full font-medium hover:bg-[#00b396] transition-colors mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        {loading ? 'Vérification...' : 'Réserver maintenant'}
      </button>

      <button
        onClick={() => navigate(`/messages/inquiry?property=${propertyId}`)}
        className="w-full border-2 border-[#0f2940] text-[#0f2940] py-3 rounded-full font-medium hover:bg-[#0f2940] hover:text-white transition-colors"
      >
        Contacter l'hôte
      </button>
      {showCheckout && (
        <CheckoutModal
          propertyId={propertyId}
          propertyTitle={`Réservation #${propertyId}`}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          totalPrice={priceDetails?.total}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}