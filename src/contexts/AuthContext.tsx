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
  login: (email: string, password: string, userType?: 'voyageur' | 'hote' | 'admin') => Promise<any>;
  loginWithOTP: (phone: string, userType?: 'voyageur' | 'hote') => Promise<any>;
  verifyOTP: (phone: string, otp: string, userType?: 'voyageur' | 'hote') => Promise<any>;
  register: (data: any, userType?: 'voyageur' | 'hote') => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  switchUserType: (userType: 'voyageur' | 'hote') => void;
  getUserType: () => 'voyageur' | 'hote' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // Login avec support du type d'utilisateur (y compris admin)
  const login = async (email: string, password: string, userType: 'voyageur' | 'hote' | 'admin' = 'voyageur') => {
    setLoading(true);
    try {
      // Déterminer l'endpoint selon le type d'utilisateur
      let endpoint = '';
      if (userType === 'admin') {
        endpoint = '/admin/login';
      } else if (userType === 'hote') {
        endpoint = '/host/login';
      } else {
        endpoint = '/traveler/login';
      }
      
      console.log(`🔐 Tentative de login ${userType} avec:`, { email });
      
      const response = await publicApi.post(endpoint, { email, password });

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
      let userData = rawData.user;

      if (!token) {
        throw new Error('Token non reçu');
      }

      // Forcer le type d'utilisateur dans les données
      userData = {
        ...userData,
        user_type: userType
      };

      // Sauvegarder
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userType', userType);
      
      // Mettre à jour l'état
      setUser(userData);
      
      console.log(`✅ Login ${userType} réussi:`, userData);
      
      // Déclencher événement
      window.dispatchEvent(new CustomEvent('authChange', { detail: { user: userData, userType } }));
      
      return rawData;
    } catch (error: any) {
      console.error(`❌ Erreur login ${userType}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login avec OTP
  const loginWithOTP = async (phone: string, userType: 'voyageur' | 'hote' = 'voyageur') => {
    try {
      const endpoint = userType === 'hote' ? '/host/login-otp' : '/traveler/login-otp';
      const response = await publicApi.post(endpoint, { phone });
      return response.data;
    } catch (error) {
      console.error('Erreur login OTP:', error);
      throw error;
    }
  };

  // Vérification OTP
  const verifyOTP = async (phone: string, otp: string, userType: 'voyageur' | 'hote' = 'voyageur') => {
    try {
      const endpoint = userType === 'hote' ? '/host/verify-otp' : '/traveler/verify-otp';
      const response = await publicApi.post(endpoint, { phone, otp });
      
      const { token, user: userData } = response.data;
      
      if (token) {
        const finalUserData = {
          ...userData,
          user_type: userType
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(finalUserData));
        localStorage.setItem('userType', userType);
        setUser(finalUserData);
        window.dispatchEvent(new CustomEvent('authChange', { detail: { user: finalUserData, userType } }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur vérification OTP:', error);
      throw error;
    }
  };

  // Inscription
  const register = async (data: any, userType: 'voyageur' | 'hote' = 'voyageur') => {
    setLoading(true);
    try {
      const endpoint = userType === 'hote' ? '/host/register' : '/traveler/register';
      console.log(`📝 Tentative d'inscription ${userType} avec:`, data.email);
      
      const registerData = {
        ...data,
        user_type: userType
      };
      
      const response = await publicApi.post(endpoint, registerData);
      
      const { token, user: userData } = response.data;
      
      if (token) {
        const finalUserData = {
          ...userData,
          user_type: userType
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(finalUserData));
        localStorage.setItem('userType', userType);
        setUser(finalUserData);
        window.dispatchEvent(new CustomEvent('authChange', { detail: { user: finalUserData, userType } }));
      }
      
      console.log(`✅ Inscription ${userType} réussie:`, userData);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur inscription ${userType}:`, error);
      if (error.response?.status === 422) {
        const errors = error.response?.data?.errors;
        if (errors?.email) {
          throw new Error('Cet email est déjà utilisé');
        }
        if (errors?.phone) {
          throw new Error('Ce numéro de téléphone est déjà utilisé');
        }
        throw new Error('Données invalides. Vérifiez vos informations.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : null;
      
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
          console.warn('API logout failed:', apiError);
        }
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      setUser(null);
      window.dispatchEvent(new CustomEvent('authChange', { detail: { user: null, userType: null } }));
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    window.dispatchEvent(new CustomEvent('authChange', { detail: { user: updatedUser } }));
  };

  const switchUserType = (userType: 'voyageur' | 'hote') => {
    if (user) {
      const updatedUser = {
        ...user,
        user_type: userType
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('userType', userType);
      window.dispatchEvent(new CustomEvent('authChange', { detail: { user: updatedUser, userType } }));
    }
  };

  const getUserType = (): 'voyageur' | 'hote' | 'admin' => {
    if (!user) return 'voyageur';
    return user.user_type;
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
        switchUserType,
        getUserType,
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