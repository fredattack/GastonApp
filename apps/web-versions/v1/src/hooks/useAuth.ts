import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../providers/apiClientProvider/axiosClient';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage and fetch user
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axiosClient.get<{ data: User }>('/auth/user');
          setUser(response.data.data);
        } catch {
          localStorage.removeItem('auth_token');
          delete axiosClient.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setError(null);
    try {
      const response = await axiosClient.post<{ data: { user: User; token: string } }>(
        '/auth/register',
        credentials
      );
      const { user: newUser, token } = response.data.data;
      localStorage.setItem('auth_token', token);
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(newUser);
      return newUser;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw err;
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);
    try {
      const response = await axiosClient.post<{ data: { user: User; token: string } }>(
        '/auth/login',
        credentials
      );
      const { user: loggedUser, token } = response.data.data;
      localStorage.setItem('auth_token', token);
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(loggedUser);
      return loggedUser;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosClient.post('/auth/logout', {});
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('auth_token');
      delete axiosClient.defaults.headers.common['Authorization'];
      setUser(null);
      setError(null);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };
}
