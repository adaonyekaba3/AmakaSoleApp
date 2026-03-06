'use client';

import React, { useState, useEffect, useCallback } from 'react';
import './globals.css';
import { AuthContext, AuthUser } from '@/lib/auth';
import { dashboardApi } from '@/lib/api';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('dashboard_token');
    const savedUser = localStorage.getItem('dashboard_user');
    if (saved && savedUser) {
      setToken(saved);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await dashboardApi.login(email, password);
    setUser(result.data.user);
    setToken(result.data.accessToken);
    localStorage.setItem('dashboard_token', result.data.accessToken);
    localStorage.setItem('dashboard_user', JSON.stringify(result.data.user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dashboard_token');
    localStorage.removeItem('dashboard_user');
  }, []);

  return (
    <html lang="en">
      <body>
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
          {children}
        </AuthContext.Provider>
      </body>
    </html>
  );
}
