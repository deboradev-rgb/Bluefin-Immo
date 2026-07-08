// services/api.ts - Version complète

import axios from 'axios';

// ✅ Prioriser la variable d'environnement VITE_API_URL si fournie
const ENV_API_URL = import.meta.env.VITE_API_URL as string | undefined;
const BASE_URL = ENV_API_URL ? ENV_API_URL : (import.meta.env.DEV ? '' : 'https://api.bluefin-immo.com');
const PUBLIC_API_URL = BASE_URL ? BASE_URL : '';
const V1_API_URL = BASE_URL ? `${BASE_URL}/api/v1` : '/api/v1';
const CSRF_URL = BASE_URL ? `${BASE_URL}/sanctum/csrf-cookie` : '/sanctum/csrf-cookie';

console.log('🌐 Mode:', import.meta.env.DEV ? 'DÉVELOPPEMENT (proxy)' : 'PRODUCTION');
console.log('🌐 API BASE URL:', BASE_URL || 'Proxy Vite');
console.log('🌐 CSRF URL:', CSRF_URL);

// ============================================
// ✅ FONCTIONS COOKIES
// ============================================

export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookie = parts.pop()?.split(';').shift();
        return cookie || null;
    }
    return null;
}

export function deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function deleteAllCookies(): void {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        deleteCookie(name.trim());
    }
}

// ============================================
// ✅ CONFIGURATION AXIOS
// ============================================

const baseConfig = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    timeout: 30000,
};

export const publicApi = axios.create({
    baseURL: PUBLIC_API_URL,
    ...baseConfig,
});

export const v1Api = axios.create({
    baseURL: V1_API_URL,
    ...baseConfig,
});

// ============================================
// ✅ INTERCEPTEURS
// ============================================

const addCsrfToken = async (config: any) => {
    // For FormData, let browser set multipart boundary automatically.
    if (typeof FormData !== 'undefined' && config?.data instanceof FormData && config?.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
    }

    const xsrfToken = getCookie('XSRF-TOKEN');
    if (xsrfToken) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
    }
    return config;
};

publicApi.interceptors.request.use(
    async (config) => {
        return await addCsrfToken(config);
    },
    (error) => Promise.reject(error)
);

v1Api.interceptors.request.use(
    async (config) => {
        return await addCsrfToken(config);
    },
    (error) => Promise.reject(error)
);

// services/api.ts

export function getCsrfToken(): string {
    // ✅ Récupérer depuis le meta tag
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) {
        return meta.getAttribute('content') || '';
    }
    return '';
}

// ============================================
// ✅ CSRF TOKEN
// ============================================


export async function refreshCsrfToken(): Promise<boolean> {
    try {
        console.log('🔄 Rafraîchissement du token CSRF...');
        
        const response = await fetch('/sanctum/csrf-cookie', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });
        
        if (!response.ok) {
            console.warn('⚠️ Réponse CSRF non OK:', response.status);
            return false;
        }
        
        // ✅ Le cookie est défini par le serveur, pas besoin de le lire en JS
        console.log('✅ CSRF cookie reçu');
        return true;
        
    } catch (error) {
        console.error('❌ Erreur CSRF:', error);
        return false;
    }
}

// ============================================
// ✅ EXPORT PAR DÉFAUT
// ============================================

export default {
    publicApi,
    v1Api,
    getCookie,
    deleteCookie,
    deleteAllCookies,
    refreshCsrfToken,
};