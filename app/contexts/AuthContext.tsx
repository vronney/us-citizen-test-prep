'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
    isSignIn: boolean;
    setIsSignIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isSignIn, setIsSignIn] = useState(false);

    return (
        <AuthContext.Provider value={{ isSignIn, setIsSignIn }}>
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