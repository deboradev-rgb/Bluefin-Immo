// services/host.service.ts
import { v1Api } from './api'; // ✅ Utiliser v1Api pour toutes les routes protégées

export interface HostPropertyData {
    title: string;
    description: string;
    property_type: string;
    city: string;
    district: string;
    address?: string;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    max_guests: number;
    price_per_night: number;
    cleaning_fee?: number;
    min_stay?: number;
}

export interface AmenitiesData {
    has_generator?: boolean;
    has_water_tank?: boolean;
    has_air_conditioning?: boolean;
    has_wifi?: boolean;
    has_parking?: boolean;
    has_pool?: boolean;
    has_kitchen?: boolean;
    has_tv?: boolean;
    has_security_guard?: boolean;
    has_breakfast?: boolean;
}

class HostService {
    // ==================== DASHBOARD ====================
    async getDashboard() {
        // ✅ CORRECTION: Utiliser v1Api
        const response = await v1Api.get('/host/dashboard');
        return response.data;
    }

    // ==================== STATISTIQUES ====================
    async getStatistics() {
        const response = await v1Api.get('/host/statistics');
        return response.data;
    }

    async getDailyStats(days: number = 30) {
        const response = await v1Api.get(`/host/statistics/daily?days=${days}`);
        return response.data;
    }

    async getPropertyStats() {
        const response = await v1Api.get('/host/statistics/properties');
        return response.data;
    }

    async getViewsDetails(propertyId: number) {
        const response = await v1Api.get(`/host/statistics/properties/${propertyId}/views`);
        return response.data;
    }

    async exportStats(startDate: string, endDate: string) {
        const response = await v1Api.get(`/host/statistics/export?start_date=${startDate}&end_date=${endDate}`, {
            responseType: 'blob'
        });
        return response.data;
    }

    // ==================== GESTION DES PROPRIÉTÉS ====================
    async getProperties() {
        const response = await v1Api.get('/host/properties');
        return response.data;
    }

    async createProperty(data: HostPropertyData) {
        const response = await v1Api.post('/host/properties', data);
        return response.data;
    }

    async getProperty(id: number) {
        const response = await v1Api.get(`/host/properties/${id}`);
        return response.data;
    }

    async updateProperty(id: number, data: Partial<HostPropertyData>) {
        const response = await v1Api.put(`/host/properties/${id}`, data);
        return response.data;
    }

    async deleteProperty(id: number) {
        const response = await v1Api.delete(`/host/properties/${id}`);
        return response.data;
    }

    // ==================== PHOTOS ====================
    async addPhotos(propertyId: number, photos: File[]) {
        const formData = new FormData();
        photos.forEach(photo => {
            formData.append('photos[]', photo);
        });
        const response = await v1Api.post(`/host/properties/${propertyId}/photos`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }

    async deletePhoto(propertyId: number, photoId: number) {
        const response = await v1Api.delete(`/host/properties/${propertyId}/photos/${photoId}`);
        return response.data;
    }

    async setCoverPhoto(propertyId: number, photoId: number) {
        const response = await v1Api.put(`/host/properties/${propertyId}/photos/${photoId}/cover`);
        return response.data;
    }

    // ==================== ÉQUIPEMENTS ====================
    async updateAmenities(propertyId: number, data: AmenitiesData) {
        const response = await v1Api.put(`/host/properties/${propertyId}/amenities`, data);
        return response.data;
    }

    // ==================== SOUMISSION POUR VALIDATION ====================
    async submitForReview(propertyId: number) {
        const response = await v1Api.post(`/host/properties/${propertyId}/submit`);
        return response.data;
    }

    // ==================== CALENDRIER ====================
    async getCalendar(propertyId: number, year?: number, month?: number) {
        const params = new URLSearchParams();
        if (year) params.append('year', year.toString());
        if (month) params.append('month', month.toString());
        const response = await v1Api.get(`/host/calendar/${propertyId}?${params.toString()}`);
        return response.data;
    }

    async updateAvailability(propertyId: number, startDate: string, endDate: string, status: string, specialPrice?: number) {
        const response = await v1Api.post(`/host/calendar/${propertyId}/availability`, {
            start_date: startDate,
            end_date: endDate,
            status,
            special_price: specialPrice
        });
        return response.data;
    }

    async updateSpecialPrice(propertyId: number, startDate: string, endDate: string, price: number) {
        const response = await v1Api.post(`/host/calendar/${propertyId}/special-price`, {
            start_date: startDate,
            end_date: endDate,
            price
        });
        return response.data;
    }

    // ==================== RÉSERVATIONS HÔTE ====================
    async getHostBookings() {
        const response = await v1Api.get('/host/bookings');
        return response.data;
    }

    async getBookingDetails(bookingId: number) {
        const response = await v1Api.get(`/host/bookings/${bookingId}`);
        return response.data;
    }

    async confirmBooking(bookingId: number, notes?: string) {
        const response = await v1Api.post(`/host/bookings/${bookingId}/confirm`, { notes });
        return response.data;
    }

    async declineBooking(bookingId: number, reason?: string) {
        const response = await v1Api.post(`/host/bookings/${bookingId}/decline`, { reason });
        return response.data;
    }

    async checkIn(bookingId: number) {
        const response = await v1Api.post(`/host/bookings/${bookingId}/checkin`);
        return response.data;
    }

    async checkOut(bookingId: number) {
        const response = await v1Api.post(`/host/bookings/${bookingId}/checkout`);
        return response.data;
    }

    // ==================== PAIEMENTS (PAYOUTS) ====================
    async getBalance() {
        const response = await v1Api.get('/host/payouts/balance');
        return response.data;
    }

    async requestPayout(amount: number, method: string, details: any) {
        const response = await v1Api.post('/host/payouts/request', {
            amount,
            payout_method: method,
            ...details
        });
        return response.data;
    }

    async getPayouts() {
        const response = await v1Api.get('/host/payouts');
        return response.data;
    }

    // ==================== VÉRIFICATION D'IDENTITÉ ====================
    async uploadIdentity(document: File, documentType: string) {
        const formData = new FormData();
        formData.append('identity_document', document);
        formData.append('document_type', documentType);
        const response = await v1Api.post('/host/upload-identity', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }

    async getVerificationStatus() {
        const response = await v1Api.get('/host/verification-status');
        return response.data;
    }

    // ==================== PROFIL HÔTE ====================
    async getProfile() {
        const response = await v1Api.get('/host/profile');
        return response.data;
    }

    async updateProfile(data: any) {
        const response = await v1Api.put('/host/profile', data);
        return response.data;
    }

    async uploadProfilePhoto(photo: File) {
        const formData = new FormData();
        formData.append('photo', photo);
        const response = await v1Api.post('/host/profile/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }

    async changePassword(currentPassword: string, newPassword: string) {
        const response = await v1Api.post('/host/profile/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPassword
        });
        return response.data;
    }

    async getPaymentInfo() {
        const response = await v1Api.get('/host/profile/payment-info');
        return response.data;
    }

    async updatePaymentInfo(data: any) {
        const response = await v1Api.put('/host/profile/payment-info', data);
        return response.data;
    }

    // ==================== MESSAGERIE HÔTE ====================
    async getHostConversations() {
        const response = await v1Api.get('/host/messages/conversations');
        return response.data;
    }

    async getHostMessages(bookingId: string) {
        const response = await v1Api.get(`/host/messages/booking/${bookingId}`);
        return response.data;
    }

    async sendHostMessage(bookingId: string, data: { message: string }) {
        const response = await v1Api.post(`/host/messages/booking/${bookingId}`, data);
        return response.data;
    }

    async markConversationAsRead(bookingId: string) {
        const response = await v1Api.post(`/host/messages/conversation/${bookingId}/read`);
        return response.data;
    }

    async getHostUnreadCount() {
        const response = await v1Api.get('/host/messages/unread/count');
        return response.data;
    }

    async getQuickReplies() {
        const response = await v1Api.get('/host/messages/quick-replies');
        return response.data;
    }

    // ==================== FAVORIS HÔTE ====================
    async getHostFavorites(page: number = 1) {
        const response = await v1Api.get(`/host/favorites?page=${page}`);
        return response.data;
    }

    async getHostFavoritesGroupedByProperty() {
        const response = await v1Api.get('/host/favorites/grouped-by-property');
        return response.data;
    }

    async getPropertyFavorites(propertyId: number) {
        const response = await v1Api.get(`/host/favorites/property/${propertyId}`);
        return response.data;
    }

    async getHostFavoritesStatistics() {
        const response = await v1Api.get('/host/favorites/statistics');
        return response.data;
    }

    async exportHostFavorites() {
        const response = await v1Api.get('/host/favorites/export', {
            responseType: 'blob'
        });
        return response.data;
    }

    // ==================== LOGOUT ====================
    async logout() {
        const response = await v1Api.post('/host/logout');
        return response.data;
    }
}

export default new HostService();