// services/booking.service.ts
import { v1Api } from './api';

export interface BookingData {
    property_id: number;
    check_in: string;
    check_out: string;
    guests_count?: number;
    guests?: number;
    payment_method: 'mobile_money' | 'card' | 'bank_transfer';
    mobile_money_provider?: 'MTN' | 'Moov' | 'Orange';
    mobile_money_number?: string;
    guest_details: {
        full_name: string;
        email: string;
        phone: string;
    };
}

class BookingService {
    // Créer une réservation
    async create(data: BookingData) {
        // ✅ CORRECTION : Utiliser v1Api
        const response = await v1Api.post('/bookings', data);
        return response.data;
    }

    // Récupérer mes réservations
    async getMyBookings(status?: string) {
        // ✅ CORRECTION : Utiliser v1Api
        const url = status ? `/traveler/bookings?status=${status}` : '/traveler/bookings';
        const response = await v1Api.get(url);
        return response.data;
    }

    // Récupérer une réservation
    async getById(id: number) {
        // ✅ CORRECTION : Utiliser v1Api
        const response = await v1Api.get(`/traveler/bookings/${id}`);
        return response.data;
    }

    // Annuler une réservation
    async cancel(id: number, reason?: string) {
        // ✅ CORRECTION : Utiliser v1Api
        const response = await v1Api.post(`/traveler/bookings/${id}/cancel`, { reason });
        return response.data;
    }

    // Confirmer paiement
    async confirmPayment(id: number) {
        // ✅ CORRECTION : Utiliser v1Api
        const response = await v1Api.post(`/bookings/${id}/confirm-payment`);
        return response.data;
    }
}

export default new BookingService();