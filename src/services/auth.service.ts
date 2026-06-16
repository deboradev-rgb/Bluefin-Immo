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

export type UserType = 'traveler' | 'host' | 'admin';

class AuthService {
    private currentUserType: UserType = 'traveler';

    // ==================== GESTION DU TYPE D'UTILISATEUR ====================
    
    setUserType(type: UserType) {
        this.currentUserType = type;
        localStorage.setItem('userType', type);
    }

    getUserType(): UserType {
        const stored = localStorage.getItem('userType') as UserType;
        if (stored) return stored;
        return this.currentUserType;
    }

    isHost(): boolean {
        return this.getUserType() === 'host';
    }

    isTraveler(): boolean {
        return this.getUserType() === 'traveler';
    }

    // ==================== INSCRIPTION & CONNEXION ====================
    
    // Inscription avec type d'utilisateur personnalisable
    async register(data: RegisterData, userType: UserType = 'traveler') {
        const endpoint = userType === 'host' ? '/host/register' : '/traveler/register';
        
        // Ajouter le type d'utilisateur aux données
        const registerData = {
            ...data,
            user_type: userType,
            role: userType
        };
        
        const response = await publicApi.post(endpoint, registerData);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            const userData = {
                ...response.data.user,
                user_type: userType,
                role: userType
            };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userType', userType);
            this.currentUserType = userType;
        }
        return response.data;
    }

    // Connexion avec type d'utilisateur personnalisable
    async login(data: LoginData, userType: UserType = 'traveler') {
        const endpoint = userType === 'host' ? '/host/login' : '/traveler/login';
        
        console.log(`🔐 Tentative de login ${userType} avec:`, data.email || data.phone);
        
        const response = await publicApi.post(endpoint, data);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            const userData = {
                ...response.data.user,
                user_type: userType,
                role: userType
            };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userType', userType);
            this.currentUserType = userType;
            
            console.log(`✅ Login ${userType} réussi:`, userData);
        }
        return response.data;
    }

    // Connexion avec OTP (WhatsApp/SMS)
    async loginWithOTP(data: OTPData, userType: UserType = 'traveler') {
        const endpoint = userType === 'host' ? '/host/login-otp' : '/traveler/login-otp';
        return publicApi.post(endpoint, data);
    }

    // Vérification OTP
    async verifyOTP(data: VerifyOTPData, userType: UserType = 'traveler') {
        const endpoint = userType === 'host' ? '/host/verify-otp' : '/traveler/verify-otp';
        const response = await publicApi.post(endpoint, data);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            const userData = {
                ...response.data.user,
                user_type: userType,
                role: userType
            };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userType', userType);
            this.currentUserType = userType;
        }
        return response.data;
    }

    // Envoi de code de vérification email
    async sendVerificationCode(email: string, userType: UserType = 'traveler') {
        const endpoint = userType === 'host' ? '/host/send-verification' : '/traveler/send-verification';
        const response = await publicApi.post(endpoint, { email });
        return response.data;
    }

    // Vérification du code email
    async verifyEmail(email: string, code: string, userType: UserType = 'traveler') {
        const endpoint = userType === 'host' ? '/host/verify-email' : '/traveler/verify-email';
        const response = await publicApi.post(endpoint, { email, code });
        
        if (response.data.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
            const userData = {
                ...response.data.user,
                user_type: userType,
                role: userType,
                is_verified: true
            };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userType', userType);
            this.currentUserType = userType;
        }
        return response.data;
    }

    // Déconnexion
    async logout(userType?: UserType) {
        const type = userType || this.getUserType();
        let endpoint = '';
        
        if (type === 'host') {
            endpoint = '/host/logout';
        } else if (type === 'traveler') {
            endpoint = '/traveler/logout';
        } else if (type === 'admin') {
            endpoint = '/admin/logout';
        } else {
            endpoint = '/auth/logout';
        }
        
        try {
            const response = await v1Api.post(endpoint);
            return response.data;
        } finally {
            // Toujours effacer les données locales même si l'API échoue
            this.clearLocalData();
        }
    }

    clearLocalData() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        localStorage.removeItem('userRole');
        localStorage.removeItem('isHost');
        this.currentUserType = 'traveler';
    }

    // ==================== PROFIL UTILISATEUR ====================

    // Récupérer le profil de l'utilisateur connecté
    async getProfile() {
        const userType = this.getUserType();
        const endpoint = userType === 'host' ? '/host/profile' : '/traveler/profile';
        const response = await v1Api.get(endpoint);
        return response.data;
    }

    // Mettre à jour le profil
    async updateProfile(data: UpdateProfileData) {
        const userType = this.getUserType();
        const endpoint = userType === 'host' ? '/host/profile' : '/traveler/profile';
        const response = await v1Api.put(endpoint, data);
        
        if (response.data.user) {
            const currentUser = this.getCurrentUser();
            const updatedUser = { ...currentUser, ...response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response.data;
    }

    // Changer le mot de passe
    async changePassword(data: ChangePasswordData) {
        const userType = this.getUserType();
        const endpoint = userType === 'host' ? '/host/profile/change-password' : '/traveler/profile/change-password';
        const response = await v1Api.post(endpoint, data);
        return response.data;
    }

    // Upload de la photo de profil
    async uploadProfilePhoto(photo: File) {
        const formData = new FormData();
        formData.append('photo', photo);
        const userType = this.getUserType();
        const endpoint = userType === 'host' ? '/host/profile/photo' : '/traveler/profile/photo';
        const response = await v1Api.post(endpoint, formData, {
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
        const response = await v1Api.get('/traveler/favorites');
        return response.data;
    }

    // Ajouter/Retirer des favoris
    async toggleFavorite(propertyId: number) {
        const response = await v1Api.post(`/traveler/favorites/${propertyId}/toggle`);
        return response.data;
    }

    // Vérifier si une propriété est en favori
    async checkFavorite(propertyId: number) {
        const response = await v1Api.get(`/traveler/favorites/${propertyId}/check`);
        return response.data;
    }

    // ==================== RÉSERVATIONS VOYAGEUR ====================

    // Récupérer les réservations
    async getBookings() {
        const response = await v1Api.get('/traveler/bookings');
        return response.data;
    }

    // Annuler une réservation
    async cancelBooking(bookingId: number) {
        const response = await v1Api.post(`/traveler/bookings/${bookingId}/cancel`);
        return response.data;
    }

    // ==================== RÉSERVATIONS HÔTE ====================

    // Récupérer les réservations en tant qu'hôte
    async getHostBookings() {
        const response = await v1Api.get('/host/bookings');
        return response.data;
    }

    // Confirmer une réservation
    async confirmBooking(bookingId: number, notes?: string) {
        const response = await v1Api.post(`/host/bookings/${bookingId}/confirm`, { notes });
        return response.data;
    }

    // Refuser une réservation
    async declineBooking(bookingId: number, reason?: string) {
        const response = await v1Api.post(`/host/bookings/${bookingId}/decline`, { reason });
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

    // Mettre à jour le type d'utilisateur dans le localStorage
    updateUserType(type: UserType) {
        this.currentUserType = type;
        localStorage.setItem('userType', type);
        localStorage.setItem('userRole', type);
        if (type === 'host') {
            localStorage.setItem('isHost', 'true');
        } else {
            localStorage.removeItem('isHost');
        }
    }

    // Convertir un voyageur en hôte
    async convertToHost(userId: number) {
        try {
            const response = await v1Api.patch('/users/convert-to-host', { user_id: userId });
            
            if (response.data.success) {
                this.updateUserType('host');
                const currentUser = this.getCurrentUser();
                if (currentUser) {
                    const updatedUser = {
                        ...currentUser,
                        user_type: 'host',
                        role: 'host',
                        isHost: true,
                        becameHostAt: new Date().toISOString()
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
                return response.data;
            }
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la conversion en hôte:', error);
            throw error;
        }
    }

/**
 * Récupère les informations de paiement complètes d'un hôte
 */
async getHostPaymentInfo(hostId: string): Promise<{ data: any }> {
  const response = await v1Api.get(`/admin/hosts/${hostId}/payment-info`);
  return response.data;
}
}

export default new AuthService();