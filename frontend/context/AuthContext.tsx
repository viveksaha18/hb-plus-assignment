import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthUser } from '../types/auth';
import { apiRequest, saveSessionToken } from '../services/api';

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/api/auth/me')
      .then((body) => setUser(body.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function signIn(idToken: string) {
    const body = await apiRequest('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    if (body.sessionToken) await saveSessionToken(body.sessionToken);
    setUser(body.user);
  }

  async function logout() {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    await saveSessionToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
