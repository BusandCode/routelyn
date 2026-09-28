import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin } from '../api/auth';
import type { AuthUser } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('routelyn_token');
    const u = localStorage.getItem('routelyn_user');
    if (t && u) {
      try { setToken(t); setUser(JSON.parse(u)); } catch {}
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    const { token, user } = await apiLogin(email, password);
    localStorage.setItem('routelyn_token', token);
    localStorage.setItem('routelyn_user', JSON.stringify(user));
    setToken(token); setUser(user);
    return user;
  }

  function signOut() {
    localStorage.removeItem('routelyn_token');
    localStorage.removeItem('routelyn_user');
    setToken(null); setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
