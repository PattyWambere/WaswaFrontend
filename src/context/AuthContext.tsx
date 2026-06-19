import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (authData: AuthResponse) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                const decoded: any = jwtDecode(storedToken);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    logout();
                    setLoading(false);
                } else {
                    setToken(storedToken);
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);

                    // Fetch the latest profile data from backend to ensure we have fullName, phoneNumber, etc.
                    api.get('/auth/profile')
                        .then((res) => {
                            const updatedUser = {
                                ...parsedUser,
                                fullName: res.data.fullName,
                                phoneNumber: res.data.phoneNumber,
                                email: res.data.email,
                                role: res.data.role,
                                followingCode: res.data.followingCode,
                                savedWallets: res.data.savedWallets
                            };
                            localStorage.setItem('user', JSON.stringify(updatedUser));
                            setUser(updatedUser);
                        })
                        .catch((err) => {
                            console.error('Failed to sync profile', err);
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                    return; // Avoid setting loading false immediately
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (authData: AuthResponse) => {
        const { token, ...userData } = authData;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
