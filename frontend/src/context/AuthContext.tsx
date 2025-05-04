'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister } from '@/lib/api';

type User = {
  id: number;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        console.log('Loaded user from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiLogin({ username, password });
      const accessToken = data.access_token;
      console.log('Login token:', accessToken);
      setToken(accessToken);
      localStorage.setItem('token', accessToken);

      // Parse JWT token to get user info
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        console.log('Parsed JWT payload:', payload);
        const userObj = {
          id: payload.user_id || payload.sub || 0, // Fallback to sub if user_id is missing
          username,
          email: payload.email || '',
        };
        console.log('Set user:', userObj);
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
      } catch (err) {
        console.error('Failed to parse token:', err);
        setError('Failed to get user information');
        throw new Error('Failed to parse token');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiRegister({ username, email, password });
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, register, logout }}>
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