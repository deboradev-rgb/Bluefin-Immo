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
    search?: string;
    city?: string;
    district?: string;
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
        if (!params.has('include')) {
            params.append('include', 'photos,cover_photo,photo_urls,images,media');
        }
        const response = await v1Api.get(`/properties?${params.toString()}`);
        return response.data;
    }

    async getById(id: number) {
        const url = `/properties/${id}?include=photos,cover_photo,photo_urls,images,media`;
        const response = await v1Api.get(url);
        return response.data;
    }

    async checkAvailability(propertyId: number, checkIn: string, checkOut: string) {
        try {
            const response = await v1Api.post(`/properties/${propertyId}/availability`, {
                check_in: checkIn,
                check_out: checkOut
            });
            
            return {
                data: {
                    available: response.data?.available ?? response.data?.data?.available ?? false,
                    message: response.data?.message || response.data?.data?.message || '',
                    price: response.data?.price || response.data?.data?.price || null
                }
            };
        } catch (error: any) {
            console.error('Erreur checkAvailability:', error);
            return {
                data: {
                    available: false,
                    message: error.response?.data?.message || 'Impossible de vérifier la disponibilité',
                    price: null
                }
            };
        }
    }

    // ✅ RECHERCHE AVANCÉE COMPLÈTE
    async searchWithFilters(filters: {
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
        city?: string;
        district?: string;
    }) {
        const params = new URLSearchParams();
        
        // Destination : ville ou quartier
        if (filters.destination) {
            params.append('search', filters.destination);
            params.append('city', filters.destination);
        }
        if (filters.city) params.append('city', filters.city);
        if (filters.district) params.append('district', filters.district);
        
        // Dates
        if (filters.check_in) params.append('check_in', filters.check_in);
        if (filters.check_out) params.append('check_out', filters.check_out);
        
        // Capacité
        if (filters.guests) params.append('max_guests', filters.guests.toString());
        if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
        
        // Prix
        if (filters.min_price) params.append('min_price', filters.min_price.toString());
        if (filters.max_price) params.append('max_price', filters.max_price.toString());
        
        // Type et qualité
        if (filters.property_type) params.append('property_type', filters.property_type);
        if (filters.min_rating) params.append('min_rating', filters.min_rating.toString());
        
        // Équipements
        if (filters.has_wifi) params.append('has_wifi', 'true');
        if (filters.has_air_conditioning) params.append('has_air_conditioning', 'true');
        if (filters.has_generator) params.append('has_generator', 'true');
        
        // Pagination et images
        params.append('per_page', '50');
        params.append('include', 'photos,cover_photo,photo_urls,images,media');
        
        try {
            const response = await v1Api.get(`/properties/search?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Erreur recherche avancée:', error);
            return this.getAll(filters);
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
            
            if (typeof responseData === 'string') {
                const cleanedData = responseData.replace(/^\/\/.*\n/, '');
                try {
                    responseData = JSON.parse(cleanedData);
                } catch (e) {
                    console.error('❌ Impossible de parser le JSON:', e);
                }
            }
            
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