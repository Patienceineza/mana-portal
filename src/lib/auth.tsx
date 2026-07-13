import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { api, ApiError, clearToken, getToken, setToken } from './api';
import type { AuthResponse, UpdateUserInput, User } from './types';

const PORTAL_ROLES: User['role'][] = ['admin', 'finance', 'quality_checker'];

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  updateProfile: (input: UpdateUserInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    api
      .get<User>('/auth/me')
      .then((u) => setUser(u))
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    setError(null);
    try {
      const res = await api.post<AuthResponse>('/auth/login', { identifier, password });
      if (!PORTAL_ROLES.includes(res.user.role)) {
        throw new ApiError(403, 'This account does not have portal access. Use an admin, finance, or quality checker account.');
      }
      setToken(res.token);
      setUser(res.user);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (input: UpdateUserInput) => {
    const updated = await api.patch<User>('/profile', input);
    setUser(updated);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, updateProfile, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
