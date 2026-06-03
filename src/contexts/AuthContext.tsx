// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { publicApi, v1Api } from '../services/api';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type: 'voyageur' | 'hote' | 'admin';
  profile_photo?: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
  bio?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  loginWithOTP: (phone: string) => Promise<any>;
  verifyOTP: (phone: string, otp: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // ✅ Chargement initial depuis localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const getProfileEndpoint = (userType: string | undefined) => {
    if (userType === 'admin') return '/admin/profile';
    if (userType === 'hote') return '/host/profile';
    return '/traveler/profile';
  };

  // Charger l'utilisateur depuis le token stocké
  useEffect(() => {
   // AuthContext.tsx - Modifiez la fonction loadUser
const loadUser = async () => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  if (!token) {
    setLoading(false);
    return;
  }

  if (savedUser) {
    const userData = JSON.parse(savedUser);
    setUser(userData);
    
    // ✅ Si c'est un admin, on s'arrête là (pas d'appel API)
    if (userData.user_type === 'admin') {
      setLoading(false);
      return;
    }
  }

  try {
    // Seulement pour les non-admins
    const response = await v1Api.get('/traveler/profile');
    const userData = response.data.user || response.data;
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  } catch (error) {
    console.error('Erreur chargement profil:', error);
  } finally {
    setLoading(false);
  }
};

    loadUser();
  }, []);

  // ✅ CORRECTION: Login avec mise à jour immédiate de l'état
  // Dans AuthContext.tsx
const login = async (email: string, password: string) => {
  try {
    console.log('🔐 Tentative de login avec:', { email });
    const response = await publicApi.post('/traveler/login', { email, password });

    // --- ÉTAPE 1: Nettoyer la réponse brute ---
    let rawData = response.data;
    console.log('📦 Réponse brute:', rawData);

    // Si la réponse est une chaîne de caractères (string) et commence par '//'
    if (typeof rawData === 'string' && rawData.trim().startsWith('//')) {
      // Enlever la ou les première(s) ligne(s) de commentaire
      // Trouver la première occurrence du caractère '{' qui marque le début du JSON
      const jsonStartIndex = rawData.indexOf('{');
      if (jsonStartIndex !== -1) {
        // Extraire uniquement la partie JSON valide
        const jsonString = rawData.substring(jsonStartIndex);
        try {
          // Parser le JSON nettoyé
          const parsedData = JSON.parse(jsonString);
          rawData = parsedData;
          console.log('📦 Données JSON extraites et parsées avec succès');
        } catch (parseError) {
          console.error('❌ Impossible de parser le JSON extrait:', parseError);
          throw new Error("Format de réponse de l'API invalide.");
        }
      } else {
        console.error('❌ Aucun JSON valide trouvé dans la réponse.');
        throw new Error("Format de réponse de l'API invalide.");
      }
    } else if (typeof rawData === 'string') {
        // Si c'est une string mais sans commentaire, on essaie de la parser directement
        try {
            rawData = JSON.parse(rawData);
        } catch(e) {
            console.error("❌ La réponse n'est pas un JSON valide", e);
            throw new Error("Format de réponse de l'API invalide.");
        }
    }

    // Désormais, `rawData` devrait être un objet JavaScript
    console.log('📦 Données traitées (objet) :', rawData);

    // --- ÉTAPE 2: Extraire le token et l'utilisateur ---
    const token = rawData.token;
    const userData = rawData.user;

    if (!token) {
      console.error('❌ Aucun token trouvé dans la réponse traitée.');
      throw new Error('Token non reçu dans la réponse');
    }

    console.log('🔑 Token reçu avec succès');
    console.log('👤 Utilisateur:', userData);

    // --- ÉTAPE 3: Sauvegarder et mettre à jour l'état ---
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData); // Mettre à jour le contexte d'authentification

    console.log('✅ Login réussi, utilisateur connecté et sauvegardé.');
    return rawData; // Retourner les données traitées

  } catch (error: any) {
    console.error('❌ Erreur complète lors du login :', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    // Relancer l'erreur pour qu'elle soit gérée par le composant qui a appelé login()
    throw error;
  }
};
  const loginWithOTP = async (phone: string) => {
    try {
      const response = await publicApi.post('/traveler/login-otp', { phone });
      return response.data;
    } catch (error) {
      console.error('Erreur login OTP:', error);
      throw error;
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const response = await publicApi.post('/traveler/verify-otp', { phone, otp });
      
      const { token, user: userData } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur vérification OTP:', error);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await publicApi.post('/traveler/register', data);
      
      const { token, user: userData } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur register:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const savedUser = localStorage.getItem('user');
        const parsedUser = savedUser ? JSON.parse(savedUser) : null;
        const logoutEndpoint = parsedUser?.user_type === 'admin'
          ? '/admin/logout'
          : parsedUser?.user_type === 'hote'
            ? '/host/logout'
            : '/traveler/logout';
        await v1Api.post(logoutEndpoint);
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        loginWithOTP,
        verifyOTP,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};