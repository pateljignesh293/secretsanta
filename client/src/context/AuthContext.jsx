import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Load user on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    const response = await userAPI.getProfile();
                    setUser(response.data);
                } catch (error) {
                    console.error('Failed to load user:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (updatedData) => {
        const updated = { ...user, ...updatedData };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                updateUser,
                isAuthenticated: !!token,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
