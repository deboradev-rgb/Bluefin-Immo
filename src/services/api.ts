// services/api.ts
import axios from 'axios';

// URLs de base - Utilisez l'URL de votre backend en ligne
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.bluefin-immo.com';
const PUBLIC_API_URL = `${BASE_URL}/api`;  // Pour les routes publiques (sans /v1)
const V1_API_URL = `${BASE_URL}/api/v1`;   // Pour les routes protégées



console.log('🌐 API BASE URL:', BASE_URL);
console.log('🌐 PUBLIC API URL:', PUBLIC_API_URL);
console.log('🌐 V1 API URL:', V1_API_URL);

// Créez deux instances axios différentes
export const publicApi = axios.create({
    baseURL: PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

export const v1Api = axios.create({
    baseURL: V1_API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
});

// Intercepteur pour ajouter le token sur v1Api uniquement
v1Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`🚀 V1: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

publicApi.interceptors.request.use(
    (config) => {
        console.log(`🚀 PUBLIC: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs globalement
publicApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('🔒 Non autorisé - Redirection vers login');
            // Optionnel: Déconnecter l'utilisateur
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

v1Api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('🔒 Non autorisé - Token invalide ou expiré');
            // Optionnel: Rafraîchir le token ou déconnecter
        }
        return Promise.reject(error);
    }
);

// Export par défaut pour la compatibilité
const api = {
    ...publicApi,
    v1: v1Api,
};

export default api;