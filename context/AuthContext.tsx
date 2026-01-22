'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { decodeJwt } from '@/utils/jwt';

type User = {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión al refrescar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.clear();
    }
    }

    setLoading(false);
  }, []);

 async function login(email: string, password: string) {
  const response = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  const { access_token } = await response.json();

  const payload = decodeJwt(access_token);


  const user: User = {
    id: payload.user_id,
    email: payload.email,
    role: payload.is_admin ? 'ADMIN' : 'USER',
  };

  
  setToken(access_token);
  setUser(user);

  
  localStorage.setItem('token', access_token);
  localStorage.setItem('user', JSON.stringify(user));
  document.cookie = `token=${access_token}; path=/ SameSite=Lax`;
}

  function logout() {
    document.cookie = 'token=; Max-Age=0; path=/';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook de conveniencia
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
