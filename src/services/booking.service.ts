// services/booking.service.ts
import { v1Api } from './api';

export interface BookingData {
    property_id: number;
    check_in: string;
    check_out: string;
    guests_count: number;
    guests?: number;
    payment_method: 'mobile_money' | 'card' | 'bank_transfer';
    mobile_money_provider?: 'MTN' | 'Moov' | 'Orange';
    mobile_money_number?: string;
    guest_details: {
        full_name: string;
        email: string;
        phone: string;
        address?: string;
        nationality?: string;
        id_type?: string;
        id_number?: string;
    };
    payment_option?: '50' | '100';
    total_amount?: number;
    payment_amount?: number;
    nights?: number;
    special_requests?: string;
}

class BookingService {
    // ✅ Créer une réservation - ENDPOINT CORRIGÉ selon les routes Laravel
    async create(data: BookingData) {
        const payload = {
            property_id: data.property_id,
            check_in: data.check_in,
            check_out: data.check_out,
            guests_count: data.guests_count || data.guests || 1,
            payment_method: data.payment_method,
            mobile_money_provider: data.mobile_money_provider,
            mobile_money_number: data.mobile_money_number,
            guest_details: data.guest_details,
            payment_option: data.payment_option,
            total_amount: data.total_amount,
            payment_amount: data.payment_amount,
            nights: data.nights,
            special_requests: data.special_requests
        };
        
        console.log('📤 Envoi de la réservation à:', '/bookings');
        console.log('📦 Payload:', payload);
        
        // ✅ Utiliser le bon endpoint: POST /v1/bookings (sans traveler)
        const response = await v1Api.post('/bookings', payload);
        return response.data;
    }

    // Récupérer mes réservations (voyageur)
    async getMyBookings(status?: string) {
        // GET /v1/traveler/bookings existe dans vos routes
        const url = status ? `/traveler/bookings?status=${status}` : '/traveler/bookings';
        const response = await v1Api.get(url);
        return response.data;
    }

    // Récupérer une réservation par ID
    async getById(id: number) {
        // GET /v1/bookings/{id} existe dans vos routes
        const response = await v1Api.get(`/bookings/${id}`);
        return response.data;
    }

    // Annuler une réservation
     async cancel(id: number, reason?: string) {
        try {
            // Essayer avec reason dans le body
            const payload = reason ? { cancellation_reason: reason } : {};
            const response = await v1Api.post(`/bookings/${id}/cancel`, payload);
            return response.data;
        } catch (error: any) {
            console.error('Erreur annulation:', error);
            
            // Récupérer le message d'erreur détaillé
            const errorMessage = error?.response?.data?.message 
                || error?.response?.data?.error 
                || error?.message 
                || 'Impossible d\'annuler la réservation';
            
            // Si l'API attend un format différent, essayer sans raison
            if (error?.response?.status === 422) {
                try {
                    const response = await v1Api.post(`/bookings/${id}/cancel`, {});
                    return response.data;
                } catch (retryError: any) {
                    throw new Error(retryError?.response?.data?.message || 'La réservation ne peut pas être annulée');
                }
            }
            
            throw new Error(errorMessage);
        }
    }

    // Confirmer le paiement
    async confirmPayment(id: number) {
        // POST /v1/bookings/{id}/confirm-payment existe dans vos routes
        const response = await v1Api.post(`/bookings/${id}/confirm-payment`, {});
        return response.data;
    }

    // Mettre à jour les informations de la réservation
    async update(id: number, data: Partial<BookingData>) {
        const response = await v1Api.put(`/bookings/${id}`, data);
        return response.data;
    }

    // Récupérer les réservations d'une propriété (pour hôte)
    async getPropertyBookings(propertyId: number) {
        const response = await v1Api.get(`/properties/${propertyId}/bookings`);
        return response.data;
    }

    // Récupérer les statistiques des réservations
    async getBookingStats() {
        const response = await v1Api.get('/traveler/bookings/stats');
        return response.data;
    }

    
}

export default new BookingService();