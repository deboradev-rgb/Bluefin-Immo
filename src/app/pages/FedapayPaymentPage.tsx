// src/app/pages/FedapayPaymentPage.tsx

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  CreditCard, Loader2, CheckCircle, XCircle, ArrowLeft,
  Shield, Lock, Banknote, Smartphone, Wallet, Home, AlertCircle,
  Calendar
} from 'lucide-react';
import { fedapayService } from '../../services/fedapay.service';
import bookingService from '../../services/booking.service';
import propertyService from '../../services/property.service';
import { useAuth } from '../../contexts/AuthContext';

interface FedapayPaymentPageProps {
  onNavigate?: (route: any) => void;
  bookingData?: any;
}

// ✅ Fonction de formatage du téléphone pour Fedapay - Version CORRIGÉE
const formatPhoneForFedapay = (phone: string): string => {
  if (!phone) return '+22969000000';
  
  // Nettoyer : garder uniquement les chiffres et le +
  let cleaned = phone.replace(/[^0-9+]/g, '');
  
  // Si déjà formaté avec +, retourner
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  
  // Enlever tous les non-chiffres
  cleaned = cleaned.replace(/[^0-9]/g, '');
  
  // 🔥 CAS SPÉCIAL : 0150036568 → 50036568
  if (cleaned.startsWith('01') && cleaned.length === 10) {
    return '+229' + cleaned.substring(2);
  }
  
  // Si commence par 0, l'enlever
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // Si commence par 1 (après avoir enlevé 0)
  if (cleaned.startsWith('1') && cleaned.length === 9) {
    cleaned = cleaned.substring(1);
  }
  
  // Si le numéro a plus de 8 chiffres, prendre les 8 derniers
  if (cleaned.length > 8) {
    cleaned = cleaned.slice(-8);
  }
  
  // Si moins de 8 chiffres, compléter avec des zéros
  if (cleaned.length < 8) {
    cleaned = cleaned.padStart(8, '0');
  }
  
  return `+229${cleaned}`;
};

export function FedapayPaymentPage({ onNavigate, bookingData }: FedapayPaymentPageProps) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'processing' | 'success' | 'failed'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'card'>('mobile_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [localBookingData, setLocalBookingData] = useState<any>(null);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'available' | 'unavailable' | 'checking'>('idle');
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Charger les données de réservation
  useEffect(() => {
    console.log('🔍 Chargement des données de réservation...');
    console.log('📦 bookingData prop:', bookingData);
    console.log('🔗 location.search:', location.search);

    // 1️⃣ Données passées en prop (via onNavigate)
    if (bookingData) {
      console.log('✅ Données chargées depuis la prop:', bookingData);
      setLocalBookingData(bookingData);
      sessionStorage.setItem('fedapay_booking_data', JSON.stringify(bookingData));
      setIsDataLoaded(true);
      return;
    }

    // 2️⃣ Données décodées de l'URL (paramètre 'data')
    const params = new URLSearchParams(location.search);
    const dataParam = params.get('data');
    
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        console.log('✅ Données décodées de l\'URL:', decodedData);
        setLocalBookingData(decodedData);
        sessionStorage.setItem('fedapay_booking_data', JSON.stringify(decodedData));
        setIsDataLoaded(true);
        return;
      } catch (e) {
        console.error('❌ Erreur décodage des données URL:', e);
      }
    }

    // 3️⃣ sessionStorage (fedapay_booking_data)
    const fedapayData = sessionStorage.getItem('fedapay_booking_data');
    if (fedapayData) {
      try {
        const parsed = JSON.parse(fedapayData);
        console.log('✅ Données chargées depuis fedapay_booking_data:', parsed);
        setLocalBookingData(parsed);
        setIsDataLoaded(true);
        return;
      } catch (e) {
        console.error('❌ Erreur parsing fedapay_booking_data:', e);
      }
    }

    // 4️⃣ bookingFormData
    const savedData = sessionStorage.getItem('bookingFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        console.log('✅ Données chargées depuis bookingFormData:', parsed);
        setLocalBookingData(parsed);
        setIsDataLoaded(true);
        return;
      } catch (e) {
        console.error('❌ Erreur parsing bookingFormData:', e);
      }
    }

    console.warn('⚠️ Aucune donnée de réservation trouvée');
  }, [bookingData, location.search]);

  // Vérifier la disponibilité UNIQUEMENT quand les données sont chargées
  useEffect(() => {
    if (isDataLoaded && localBookingData?.property_id && localBookingData?.check_in && localBookingData?.check_out) {
      console.log('✅ Données prêtes, vérification de la disponibilité...');
      checkAvailability();
    }
  }, [isDataLoaded, localBookingData?.property_id]);

  // ✅ Vérifier la disponibilité des dates
  const checkAvailability = async () => {
    if (!localBookingData?.property_id || !localBookingData?.check_in || !localBookingData?.check_out) {
      setError('Données de réservation incomplètes');
      return false;
    }

    setIsCheckingAvailability(true);
    setAvailabilityStatus('checking');

    try {
      const propertyId = localBookingData.property_id;
      const checkIn = localBookingData.check_in;
      const checkOut = localBookingData.check_out;
      const guests = localBookingData.guests || localBookingData.guests_count || 1;

      console.log('🔍 Vérification disponibilité Fedapay:', {
        propertyId,
        checkIn,
        checkOut,
        guests
      });

      const response = await propertyService.checkAvailability(
        propertyId,
        checkIn,
        checkOut,
        guests
      );

      console.log('📥 Réponse disponibilité Fedapay:', response);

      const isAvailable = response?.available === true;
      
      if (isAvailable) {
        setAvailabilityStatus('available');
        setError('');
        toast.success('✅ Ces dates sont disponibles !');
        return true;
      } else {
        setAvailabilityStatus('unavailable');
        const message = response?.message || '❌ Ces dates ne sont pas disponibles.';
        setError(message);
        toast.error(message);
        return false;
      }
    } catch (error: any) {
      console.error('❌ Erreur vérification disponibilité:', error);
      setAvailabilityStatus('unavailable');
      const errorMsg = error.response?.data?.message || '❌ Impossible de vérifier la disponibilité.';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Vérifier les paramètres de retour Fedapay
  useEffect(() => {
    const transId = searchParams.get('transaction_id');
    const statusParam = searchParams.get('status');
    const bookingIdParam = searchParams.get('booking_id');
    
    if (transId && statusParam) {
      setTransactionId(transId);
      
      if (bookingIdParam) {
        sessionStorage.setItem('fedapay_booking_id', bookingIdParam);
      }
      
      if (statusParam === 'success') {
        setStatus('success');
        toast.success('✅ Paiement réussi !');
        
        if (bookingIdParam) {
          fedapayService.confirmPayment(transId, bookingIdParam)
            .then(() => {
              console.log('✅ Paiement confirmé côté serveur');
            })
            .catch((err) => {
              console.error('❌ Erreur confirmation:', err);
            });
        }
        
        setTimeout(() => {
          if (onNavigate) {
            onNavigate({ name: 'home' });
          } else {
            navigate('/');
          }
        }, 3000);
      } else if (statusParam === 'cancelled') {
        setStatus('failed');
        setError('Paiement annulé par l\'utilisateur');
        toast.error('❌ Paiement annulé');
      } else {
        setStatus('failed');
        setError('Le paiement a échoué');
        toast.error('❌ Paiement échoué');
      }
    }
  }, [searchParams, onNavigate]);

  // ✅ Initier le paiement - Version CORRIGÉE
  const initiatePayment = async () => {
    if (!localBookingData) {
      toast.error('❌ Données de réservation manquantes');
      return;
    }

    if (paymentMethod === 'mobile_money' && (!phoneNumber || phoneNumber.length < 8)) {
      setError('Veuillez entrer un numéro Mobile Money valide');
      return;
    }

    setLoading(true);
    setStatus('processing');
    setError('');

    try {
      // ✅ ÉTAPE 1 : Vérifier la disponibilité D'ABORD
      const isAvailable = await checkAvailability();
      
      if (!isAvailable) {
        setStatus('failed');
        setLoading(false);
        toast.error('❌ Ces dates ne sont pas disponibles.');
        return;
      }

      // ✅ ÉTAPE 2 : Créer la réservation UNIQUEMENT si disponible
      const userData = user || JSON.parse(localStorage.getItem('user') || '{}');
      const guestDetails = localBookingData?.guest_details || {
        full_name: `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 'Voyageur',
        email: userData?.email || '',
        phone: userData?.phone || '',
        address: ''
      };

      // ✅ Calculer les montants avec frais de service à 10%
      const pricePerNight = localBookingData.price_per_night || 0;
      const nights = localBookingData.nights || 1;
      const subtotal = pricePerNight * nights;
      const serviceFee = Math.round(subtotal * 0.10);
      const totalAmount = subtotal + serviceFee;

      console.log('💰 Détail du calcul (10% de frais):', {
        pricePerNight,
        nights,
        subtotal,
        serviceFee,
        totalAmount
      });

      const bookingPayload = {
        property_id: localBookingData.property_id,
        check_in: localBookingData.check_in,
        check_out: localBookingData.check_out,
        guests_count: localBookingData.guests || 1,
        payment_method: 'fedapay' as const,
        guest_details: guestDetails,
        payment_option: '100' as const,
        total_amount: totalAmount,
        payment_amount: totalAmount,
        nights: localBookingData.nights || 1,
        special_requests: localBookingData.special_requests || undefined
      };

      console.log('📤 Création de la réservation:', bookingPayload);

      const bookingResponse = await bookingService.create(bookingPayload);
      console.log('📥 Réponse création réservation:', bookingResponse);

      // ✅ Récupérer l'ID depuis la réponse
      const bookingDataFromResponse = bookingResponse?.data?.booking || bookingResponse?.booking || bookingResponse?.data;
      const bookingId = bookingDataFromResponse?.id || bookingResponse?.data?.id || bookingResponse?.id;
      const finalTotalAmount = totalAmount;

      if (!bookingId) {
        throw new Error('Impossible de récupérer l\'ID de la réservation');
      }

      console.log('✅ Réservation créée avec ID:', bookingId);
      console.log('💰 Montant total à payer (avec 10% de frais):', finalTotalAmount);

      // Mettre à jour les données locales
      setLocalBookingData({ ...localBookingData, id: bookingId, totalAmount: finalTotalAmount });
      sessionStorage.setItem('fedapay_booking_data', JSON.stringify({ ...localBookingData, id: bookingId, totalAmount: finalTotalAmount }));

      // ✅ ÉTAPE 3 : Formater le numéro de téléphone pour Fedapay (CORRIGÉ)
      const rawPhone = phoneNumber || guestDetails.phone || '69000000';
      const formattedPhone = formatPhoneForFedapay(rawPhone);
      
      console.log('📱 Formatage du téléphone:', {
        raw: rawPhone,
        formatted: formattedPhone,
        isValid: /^\+229[0-9]{8}$/.test(formattedPhone)
      });

      // ✅ Vérifier que le format est valide
      if (!/^\+229[0-9]{8}$/.test(formattedPhone)) {
        setError(`Format de téléphone invalide: ${formattedPhone}`);
        toast.error('❌ Numéro de téléphone invalide');
        setLoading(false);
        return;
      }

      // ✅ ÉTAPE 4 : Initier le paiement Fedapay avec le montant total
   

const paymentData = {
  amount: Math.round(finalTotalAmount),
  currency: 'XAF' as const,
  customer: {
    firstname: guestDetails.full_name.split(' ')[0] || 'Client',
    lastname: guestDetails.full_name.split(' ').slice(1).join(' ') || 'Client',
    email: guestDetails.email || 'client@email.com',
    phone: formattedPhone,
  },
  description: `Réservation - ${localBookingData?.property_title || 'Logement'}`,
  reference: `BOOK-${Date.now()}`,
  booking_id: bookingId,
  // ✅ URL CORRECTE pour le callback
  callback_url: `https://api.bluefin-immo.com/payment/fedapay/callback`,
  cancel_url: `https://api.bluefin-immo.com/payment/fedapay/cancel`
};

      console.log('📤 Données Fedapay:', paymentData);

      const response = await fedapayService.initiatePayment(paymentData);
      
      if (response.success && response.data?.payment_url) {
        setTransactionId(response.data.id);
        setStatus('pending');
        toast.success('✅ Redirection vers Fedapay...');
        
        sessionStorage.setItem('fedapay_transaction_id', response.data.id);
        sessionStorage.setItem('fedapay_booking_id', bookingId.toString());
        sessionStorage.setItem('fedapay_booking_data', JSON.stringify({ ...localBookingData, id: bookingId, totalAmount: finalTotalAmount }));
        
        setTimeout(() => {
          window.location.href = response.data.payment_url;
        }, 1500);
      } else {
        throw new Error(response.message || 'URL de paiement non reçue');
      }
    } catch (error: any) {
      console.error('❌ Erreur paiement:', error);
      
      // ✅ Afficher les erreurs de validation détaillées
      let errorMessage = 'Erreur lors du paiement';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (typeof errors === 'object') {
          const messages = Object.values(errors).flat();
          errorMessage = messages.join(', ');
        } else {
          errorMessage = errors;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setStatus('failed');
      setError(errorMessage);
      toast.error('❌ ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Rendu du statut de paiement
  const renderStatus = () => {
    if (status === 'processing') {
      return (
        <div className="text-center py-8">
          <Loader2 className="w-16 h-16 text-[#00c9a7] animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#0F2940] mb-2">Préparation du paiement...</h3>
          <p className="text-gray-500 text-sm">Nous sécurisons votre transaction</p>
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div className="text-center py-8">
          <Loader2 className="w-16 h-16 text-[#00c9a7] animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-[#0F2940] mb-2">Redirection vers Fedapay...</h3>
          <p className="text-gray-500 text-sm">Vous allez être redirigé vers la page de paiement sécurisée</p>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#0F2940] mb-2">✅ Paiement réussi !</h3>
          <p className="text-gray-600 mb-2">Votre réservation est confirmée.</p>
          <p className="text-gray-400 text-sm">Redirection vers l'accueil dans quelques secondes...</p>
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate({ name: 'home' });
              } else {
                navigate('/');
              }
            }}
            className="mt-4 px-6 py-2 bg-[#00c9a7] text-white rounded-xl hover:bg-[#00b892] transition flex items-center gap-2 mx-auto"
          >
            <Home className="w-4 h-4" />
            Accueil
          </button>
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#0F2940] mb-2">❌ Paiement échoué</h3>
          <p className="text-gray-600 mb-4">{error || 'Une erreur est survenue'}</p>
          <button
            onClick={() => {
              setStatus('idle');
              setError('');
            }}
            className="px-6 py-2 bg-[#00c9a7] text-white rounded-xl hover:bg-[#00b892] transition"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return null;
  };

  // Rendu du formulaire de paiement
  const renderPaymentForm = () => {
    if (status !== 'idle') return null;

    const pricePerNight = localBookingData?.price_per_night || 0;
    const nights = localBookingData?.nights || 1;
    const subtotal = pricePerNight * nights;
    const serviceFee = Math.round(subtotal * 0.10);
    const totalAmount = subtotal + serviceFee;

    return (
      <div className="space-y-6">
        {/* Résumé de la réservation */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-[#0F2940] mb-3 text-sm">📋 Résumé de votre réservation</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Propriété</span>
              <span className="font-medium">{localBookingData?.property_title || 'Non spécifié'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nuits</span>
              <span className="font-medium">{nights} nuits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prix par nuit</span>
              <span className="font-medium">{pricePerNight.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frais de service (10%)</span>
              <span className="font-medium">{serviceFee.toLocaleString()} FCFA</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-[#0F2940]">
              <span>Total</span>
              <span className="text-[#00c9a7] text-lg">{totalAmount.toLocaleString()} FCFA</span>
            </div>
          </div>
        </div>

        {/* Indicateur de disponibilité */}
        <div className="flex items-center gap-2 text-sm bg-gray-50 p-3 rounded-xl">
          <Calendar className="w-4 h-4 text-[#00c9a7]" />
          <span className="text-gray-600">Dates sélectionnées :</span>
          <span className="font-medium">
            {localBookingData?.check_in ? new Date(localBookingData.check_in).toLocaleDateString('fr-FR') : '-'}
            {' → '}
            {localBookingData?.check_out ? new Date(localBookingData.check_out).toLocaleDateString('fr-FR') : '-'}
          </span>
          {availabilityStatus === 'available' && (
            <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">✓ Disponible</span>
          )}
          {availabilityStatus === 'unavailable' && (
            <span className="text-red-600 text-xs bg-red-50 px-2 py-0.5 rounded-full">✗ Non disponible</span>
          )}
        </div>

        {/* Méthode de paiement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Méthode de paiement
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setPaymentMethod('mobile_money');
                setError('');
              }}
              className={`p-3 rounded-xl border-2 transition ${
                paymentMethod === 'mobile_money'
                  ? 'border-[#00c9a7] bg-[#00c9a7]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Smartphone className={`w-5 h-5 ${paymentMethod === 'mobile_money' ? 'text-[#00c9a7]' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Mobile Money</span>
              </div>
            </button>
            <button
              onClick={() => {
                setPaymentMethod('card');
                setError('');
              }}
              className={`p-3 rounded-xl border-2 transition ${
                paymentMethod === 'card'
                  ? 'border-[#00c9a7] bg-[#00c9a7]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-[#00c9a7]' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Carte bancaire</span>
              </div>
            </button>
          </div>
        </div>

        {/* Numéro de téléphone pour Mobile Money */}
        {paymentMethod === 'mobile_money' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de téléphone (Mobile Money)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">+229</span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setError('');
                }}
                placeholder="90 00 00 00"
                className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#00c9a7] focus:border-transparent text-sm"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Vous recevrez un code de confirmation sur ce numéro
            </p>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Bouton de paiement */}
        <button
          onClick={initiatePayment}
          disabled={loading || availabilityStatus === 'unavailable'}
          className={`w-full py-3 rounded-xl font-semibold transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
            availabilityStatus === 'unavailable' 
              ? 'bg-gray-300 text-gray-500' 
              : 'bg-gradient-to-r from-[#00c9a7] to-[#00a887] text-white hover:shadow-lg'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Chargement...
            </>
          ) : availabilityStatus === 'unavailable' ? (
            'Dates non disponibles'
          ) : (
            <>
              <Banknote className="w-5 h-5" />
              Payer maintenant
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-400">
          En cliquant sur "Payer maintenant", vous acceptez nos conditions générales
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4fffe] py-10">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate({ name: 'booking', id: localBookingData?.property_id?.toString() });
              } else {
                navigate(-1);
              }
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-[#0F2940]">Paiement sécurisé</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#e2f5f2]">
          {/* Sécurité */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 bg-gray-50 px-4 py-2 rounded-lg">
            <Lock className="w-4 h-4 text-[#00c9a7]" />
            <span>Paiement sécurisé par Fedapay</span>
            <span className="mx-1">·</span>
            <Shield className="w-4 h-4 text-[#00c9a7]" />
            <span>Transaction cryptée</span>
          </div>

          {/* Formulaire ou statut */}
          {renderPaymentForm()}
          {status !== 'idle' && renderStatus()}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Sécurisé
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Garanti
            </span>
            <span>·</span>
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate({ name: 'home' });
                } else {
                  navigate('/');
                }
              }}
              className="flex items-center gap-1 hover:text-[#00c9a7] transition"
            >
              <Home className="w-3 h-3" />
              Accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}