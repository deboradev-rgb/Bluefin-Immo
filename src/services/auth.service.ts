// services/auth.service.ts
import { publicApi, v1Api } from './api';

export interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
}

export interface LoginData {
    email?: string;
    phone?: string;
    password: string;
}

export interface OTPData {
    phone: string;
}

export interface VerifyOTPData {
    phone: string;
    otp: string;
}

export interface UpdateProfileData {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    bio?: string;
    languages?: string[];
    country?: string;
    city?: string;
}

export interface ChangePasswordData {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
}

class AuthService {
    // ==================== INSCRIPTION & CONNEXION ====================
    
    // Inscription voyageur
    async register(data: RegisterData) {
        // ✅ Utiliser publicApi (sans /v1) pour les routes publiques
        const response = await publicApi.post('/traveler/register', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }

    // Connexion standard
    async login(data: LoginData) {
        // ✅ Utiliser publicApi (sans /v1) pour les routes publiques
        const response = await publicApi.post('/traveler/login', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }

    // Demande d'OTP (WhatsApp/SMS)
    async loginWithOTP(data: OTPData) {
        // ✅ Utiliser publicApi (sans /v1) pour les routes publiques
        return publicApi.post('/traveler/login-otp', data);
    }

    // Vérification OTP
    async verifyOTP(data: VerifyOTPData) {
        // ✅ Utiliser publicApi (sans /v1) pour les routes publiques
        const response = await publicApi.post('/traveler/verify-otp', data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }

    // Déconnexion
    async logout(userType: string = 'voyageur') {
        // ✅ Utiliser v1Api pour les routes protégées
        let endpoint = '';
        
        if (userType === 'hote') {
            endpoint = '/host/logout';
        } else if (userType === 'voyageur') {
            endpoint = '/traveler/logout';
        } else if (userType === 'admin') {
            endpoint = '/admin/logout';
        } else {
            endpoint = '/auth/logout'; // Fallback
        }
        
        const response = await v1Api.post(endpoint);
        return response.data;
    }

    // ==================== PROFIL UTILISATEUR ====================

    // Récupérer le profil de l'utilisateur connecté
    async getProfile() {
        // ✅ CORRECTION: Utiliser v1Api avec le bon endpoint /traveler/profile
        const response = await v1Api.get('/traveler/profile');
        return response.data;
    }

    // Mettre à jour le profil
    async updateProfile(data: UpdateProfileData) {
        // ✅ CORRECTION: Utiliser v1Api avec le bon endpoint /traveler/profile
        const response = await v1Api.put('/traveler/profile', data);
        if (response.data.user) {
            const currentUser = this.getCurrentUser();
            const updatedUser = { ...currentUser, ...response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response.data;
    }

    // Changer le mot de passe
    async changePassword(data: ChangePasswordData) {
        // ✅ CORRECTION: Utiliser v1Api avec le bon endpoint
        const response = await v1Api.post('/traveler/profile/change-password', data);
        return response.data;
    }

    // Upload de la photo de profil
    async uploadProfilePhoto(photo: File) {
        const formData = new FormData();
        formData.append('photo', photo); // Selon votre API, peut être 'profile_photo' ou 'photo'
        // ✅ CORRECTION: Utiliser v1Api avec le bon endpoint
        const response = await v1Api.post('/traveler/profile/photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.user) {
            const currentUser = this.getCurrentUser();
            const updatedUser = { ...currentUser, ...response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response.data;
    }

    // Vérification d'identité (CNI, passeport)
    async verifyIdentity(document: File, documentType: 'cni' | 'passeport') {
        const formData = new FormData();
        formData.append('identity_document', document);
        formData.append('document_type', documentType);
        // ✅ Utiliser v1Api pour les routes protégées
        const response = await v1Api.post('/auth/verify-identity', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.user) {
            const currentUser = this.getCurrentUser();
            const updatedUser = { ...currentUser, ...response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response.data;
    }

    // ==================== FAVORIS ====================

    // Récupérer les favoris
    async getFavorites() {
        // ✅ Utiliser v1Api avec le bon endpoint
        const response = await v1Api.get('/traveler/favorites');
        return response.data;
    }

    // Ajouter/Retirer des favoris
    async toggleFavorite(propertyId: number) {
        // ✅ Utiliser v1Api avec le bon endpoint
        const response = await v1Api.post(`/traveler/favorites/${propertyId}/toggle`);
        return response.data;
    }

    // Vérifier si une propriété est en favori
    async checkFavorite(propertyId: number) {
        // ✅ Utiliser v1Api avec le bon endpoint
        const response = await v1Api.get(`/traveler/favorites/${propertyId}/check`);
        return response.data;
    }

    // ==================== RÉSERVATIONS ====================

    // Récupérer les réservations
    async getBookings() {
        // ✅ Utiliser v1Api avec le bon endpoint
        const response = await v1Api.get('/traveler/bookings');
        return response.data;
    }

    // Annuler une réservation
    async cancelBooking(bookingId: number) {
        // ✅ Utiliser v1Api avec le bon endpoint
        const response = await v1Api.post(`/traveler/bookings/${bookingId}/cancel`);
        return response.data;
    }

    // ==================== UTILITAIRES ====================

    // Récupérer l'utilisateur courant depuis localStorage
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    // Récupérer le token JWT
    getToken() {
        return localStorage.getItem('token');
    }
}

export default new AuthService();