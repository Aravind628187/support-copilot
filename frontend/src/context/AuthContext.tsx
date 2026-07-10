import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import * as authApi from '../api/auth';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetchUser = useCallback(async () => {
    try {
      const current = await authApi.fetchMe();
      setUser(current);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await refetchUser();
      setIsLoading(false);
    })();
  }, [refetchUser]);

  const login = useCallback(async (email: string, password: string) => {
    const current = await authApi.login({ email, password });
    setUser(current);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
