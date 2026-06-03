// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import authService from '../../services/auth.service';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    user_type: string;
    profile_photo?: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const register = async (data: any) => {
        const response = await authService.register(data);
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
    };

    return {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        register,
        isHost: user?.user_type === 'hote',
        isAdmin: user?.user_type === 'admin',
    };
};