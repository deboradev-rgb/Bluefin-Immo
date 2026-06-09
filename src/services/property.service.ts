// services/property.service.ts
import { publicApi, v1Api } from './api';

export interface PropertyFilters {
    destination?: string;
    check_in?: string;
    check_out?: string;
    guests?: number;
    min_price?: number;
    max_price?: number;
    property_type?: string;
    bedrooms?: number;
    min_rating?: number;
    has_wifi?: boolean;
    has_air_conditioning?: boolean;
    has_generator?: boolean;
    sort_by?: string;
    page?: number;
    per_page?: number;
}

export interface PropertyData {
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

class PropertyService {
    // ==================== ROUTES PUBLIQUES ====================
    
    async getAll(filters: PropertyFilters = {}) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });
       // Request images (if API supports include parameter)
        if (!params.has('include')) {
            params.append('include', 'photos,cover_photo,photo_urls,images,media');
        }
        const response = await v1Api.get(`/properties?${params.toString()}`);
        return response.data;
    }

    async getById(id: number) {
        // Ask API to include related image fields when possible
        const url = `/properties/${id}?include=photos,cover_photo,photo_urls,images,media`;
        const response = await v1Api.get(url);
        return response.data;
    }

   // services/property.service.ts
async checkAvailability(propertyId: number, checkIn: string, checkOut: string) {
    try {
        const response = await v1Api.post(`/properties/${propertyId}/availability`, {
            check_in: checkIn,
            check_out: checkOut
        });
        
        // ✅ Normaliser la réponse pour avoir toujours la structure attendue
        return {
            data: {
                available: response.data?.available ?? response.data?.data?.available ?? false,
                message: response.data?.message || response.data?.data?.message || '',
                price: response.data?.price || response.data?.data?.price || null
            }
        };
    } catch (error: any) {
        console.error('Erreur checkAvailability:', error);
        
        // ✅ En cas d'erreur, retourner un objet par défaut
        return {
            data: {
                available: false,
                message: error.response?.data?.message || 'Impossible de vérifier la disponibilité',
                price: null
            }
        };
    }
}

    async advancedSearch(filters: PropertyFilters) {
        const response = await v1Api.post('/search/advanced', filters);
        return response.data;
    }

    async autocomplete(query: string) {
        const response = await v1Api.get(`/search/autocomplete?q=${query}`);
        return response.data;
    }

    async getPopularDestinations() {
        const response = await v1Api.get('/search/popular-destinations');
        return response.data;
    }

    async getPopularDistricts(city: string) {
        const response = await v1Api.get(`/search/popular-districts/${city}`);
        return response.data;
    }

    async searchMap(filters: PropertyFilters) {
        const response = await v1Api.post('/search/map', filters);
        return response.data;
    }

    // ==================== ROUTES ADMIN ====================
    
    async getAdminPendingProperties() {
        const response = await v1Api.get('/admin/properties/pending');
        return response.data;
    }

    async approveProperty(id: number, notes?: string, featured?: boolean) {
        const response = await v1Api.post(`/admin/properties/${id}/approve`, { notes, featured });
        return response.data;
    }

    async rejectProperty(id: number, reason: string, notes?: string) {
        const response = await v1Api.post(`/admin/properties/${id}/reject`, { reason, notes });
        return response.data;
    }

    // ==================== ROUTES HÔTE ====================
    
    async createProperty(data: PropertyData) {
        try {
            console.log('📤 Création propriété - Données envoyées:', data);
            
            const response = await v1Api.post('/host/properties', data);
            
            let propertyId = null;
            let responseData = response.data;
            
            // Nettoyage des commentaires PHP
            if (typeof responseData === 'string') {
                const cleanedData = responseData.replace(/^\/\/.*\n/, '');
                try {
                    responseData = JSON.parse(cleanedData);
                } catch (e) {
                    console.error('❌ Impossible de parser le JSON:', e);
                }
            }
            
            // Extraction de l'ID
            propertyId = responseData.id || 
                        responseData.property?.id || 
                        responseData.data?.id || 
                        responseData.property_id;
            
            if (!propertyId) {
                throw new Error('Impossible de récupérer l\'ID de la propriété.');
            }
            
            return {
                success: true,
                id: propertyId,
                data: responseData
            };
            
        } catch (error: any) {
            console.error('❌ Erreur création propriété:', error);
            throw error;
        }
    }

    async updateProperty(id: number, data: Partial<PropertyData>) {
        const response = await v1Api.put(`/host/properties/${id}`, data);
        return response.data;
    }

    async deleteProperty(id: number) {
        const response = await v1Api.delete(`/host/properties/${id}`);
        return response.data;
    }

    async submitForReview(propertyId: number) {
        const response = await v1Api.post(`/host/properties/${propertyId}/submit`);
        return response.data;
    }

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

    async updateAmenities(propertyId: number, amenities: any) {
        const response = await v1Api.put(`/host/properties/${propertyId}/amenities`, amenities);
        return response.data;
    }

    async getMyProperties() {
        const response = await v1Api.get('/host/properties');
        return response.data;
    }

    async getMyProperty(id: number) {
        const response = await v1Api.get(`/host/properties/${id}`);
        return response.data;
    }
}

export default new PropertyService();