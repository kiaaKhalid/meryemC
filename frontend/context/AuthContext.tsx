"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../services/maintenanceService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: UserProfile | null;
    isLoading: boolean;
    isAdmin: boolean;
    login: (user: UserProfile) => void;
    logout: () => void;
    updateUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Hydrate from localStorage on initial load
        const storedUser = localStorage.getItem('monitor_ai_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const isAdmin = user?.role === 'ADMIN';

    const login = (newUser: UserProfile) => {
        setUser(newUser);
        localStorage.setItem('monitor_ai_user', JSON.stringify(newUser));
        router.push("/admin/dashboard");
    };

    const logout = () => {
        setUser(null);
        setIsLoading(false); // Reset loading just in case
        localStorage.removeItem('monitor_ai_user');
        router.push("/");
    };

    const updateUser = (updatedUser: UserProfile) => {
        setUser(updatedUser);
        localStorage.setItem('monitor_ai_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAdmin, login, logout, updateUser }}>
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
