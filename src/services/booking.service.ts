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
    // Créer une réservation avec toutes les informations
    async create(data: BookingData) {
        // S'assurer que guests_count est défini
        const payload = {
            ...data,
            guests_count: data.guests_count || data.guests || 1
        };
        
        const response = await v1Api.post('/bookings', payload);
        return response.data;
    }

    // Récupérer mes réservations (voyageur)
    async getMyBookings(status?: string) {
        const url = status ? `/traveler/bookings?status=${status}` : '/traveler/bookings';
        const response = await v1Api.get(url);
        return response.data;
    }

    // Récupérer une réservation par ID
    async getById(id: number) {
        const response = await v1Api.get(`/traveler/bookings/${id}`);
        return response.data;
    }

    // Annuler une réservation
    async cancel(id: number, reason?: string) {
        const response = await v1Api.post(`/traveler/bookings/${id}/cancel`, { reason });
        return response.data;
    }

    // Confirmer le paiement
    async confirmPayment(id: number) {
        const response = await v1Api.post(`/bookings/${id}/confirm-payment`);
        return response.data;
    }

    // Mettre à jour les informations de la réservation
    async update(id: number, data: Partial<BookingData>) {
        const response = await v1Api.put(`/traveler/bookings/${id}`, data);
        return response.data;
    }

    // Ajouter une demande spéciale
    async addSpecialRequest(id: number, request: string) {
        const response = await v1Api.post(`/traveler/bookings/${id}/special-request`, { request });
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