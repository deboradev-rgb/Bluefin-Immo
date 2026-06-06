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
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false); // ⭐ Commencer à false

  // ⭐ SIMPLIFICATION: Pas de chargement initial, on utilise juste localStorage
  // Le loading reste à false car on a déjà l'utilisateur du localStorage

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 Tentative de login avec:', { email });
      const response = await publicApi.post('/traveler/login', { email, password });

      // Nettoyer la réponse
      let rawData = response.data;
      
      if (typeof rawData === 'string' && rawData.trim().startsWith('//')) {
        const jsonStartIndex = rawData.indexOf('{');
        if (jsonStartIndex !== -1) {
          rawData = JSON.parse(rawData.substring(jsonStartIndex));
        }
      } else if (typeof rawData === 'string') {
        rawData = JSON.parse(rawData);
      }

      const token = rawData.token;
      const userData = rawData.user;

      if (!token) {
        throw new Error('Token non reçu');
      }

      // Sauvegarder
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Mettre à jour l'état
      setUser(userData);
      
      console.log('✅ Login réussi:', userData);
      
      // Déclencher événement
      window.dispatchEvent(new CustomEvent('authChange', { detail: { user: userData } }));
      
      return rawData;
    } catch (error: any) {
      console.error('❌ Erreur login:', error);
      throw error;
    } finally {
      setLoading(false);
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
        window.dispatchEvent(new CustomEvent('authChange', { detail: { user: userData } }));
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
        window.dispatchEvent(new CustomEvent('authChange', { detail: { user: userData } }));
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
      const savedUser = localStorage.getItem('user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      
      // Essayer de faire le logout API si possible, sinon ignorer l'erreur
      if (token && parsedUser) {
        try {
          let logoutEndpoint = '/traveler/logout';
          if (parsedUser.user_type === 'admin') {
            logoutEndpoint = '/admin/logout';
          } else if (parsedUser.user_type === 'hote') {
            logoutEndpoint = '/host/logout';
          }
          await v1Api.post(logoutEndpoint);
        } catch (apiError) {
          // Ignorer les erreurs API pour le logout
          console.warn('API logout failed (endpoint may not exist):', apiError);
        }
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      // Toujours nettoyer le localStorage et l'état
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      window.dispatchEvent(new CustomEvent('authChange', { detail: { user: null } }));
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent('authChange', { detail: { user: updatedUser } }));
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