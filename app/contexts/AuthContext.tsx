'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

interface AuthContextType {
    isSignIn: boolean;
    setIsSignIn: (value: boolean) => void;
    token: string | null;
    setToken: (value: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isSignIn, setIsSignIn] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const cookies = parseCookies();
        const storedToken = cookies.token;
        if (storedToken) {
            setIsSignIn(true);
            setToken(storedToken);
        }
    }, []);

    const setTokenWithCookie = (value: string | null) => {
        setToken(value);
        if (value) {
            setCookie(null, 'token', value, {
                maxAge: 30 * 60, // 30 minutes
                path: '/',
            });
        } else {
            destroyCookie(null, 'token');
        }
    };

    return (
        <AuthContext.Provider value={{
            isSignIn,
            setIsSignIn,
            token,
            setToken: setTokenWithCookie,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}