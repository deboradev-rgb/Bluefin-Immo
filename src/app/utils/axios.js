// utils/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.bluefin-immo.com',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    }
});

// Intercepteur pour gérer les erreurs CSRF
api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 419) {
            // Token CSRF expiré, on le renouvelle
            await api.get('/sanctum/csrf-cookie');
            return api(error.config);
        }
        return Promise.reject(error);
    }
);

export default api;

// Dans votre composant de login
import api from './utils/axios';

const login = async (email, password) => {
    // Récupérer le token CSRF
    await api.get('/sanctum/csrf-cookie');
    
    // Faire le login
    const response = await api.post('/api/traveler/login', {
        email,
        password
    });
    
    return response.data;
};




