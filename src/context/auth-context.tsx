import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import api from '@/services/api';

// Define types for our context
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await api.post('/auth/login', {
        email,
        password
      });

      const responseData = response.data;
      const authToken = responseData.data.token;

      // Save token and user data
      setToken(authToken);
      setUser({
        id: responseData.data.user.id || '',
        name: responseData.data.user.email.split('@')[0] || 'Usuario',
        email: responseData.data.user.email || '',
      });

      localStorage.setItem('token', authToken);
      toast.success('Inicio de sesión exitoso!');
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Error de inicio de sesión:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Error al iniciar sesión');
      } else {
        toast.error('Error al iniciar sesión');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });

      const responseData = response.data;
      const authToken = responseData.data.token;

      // Save token and user data
      setToken(authToken);
      setUser({
        id: responseData.data.user.id || '',
        name: name || responseData.data.user.email.split('@')[0] || 'Usuario',
        email: responseData.data.user.email || '',
      });

      localStorage.setItem('token', authToken);
      toast.success('Registro exitoso!');
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Error de registro:', error);
      if (error instanceof Error) {
        toast.error(error.message || 'Error al registrarse');
      } else {
        toast.error('Error al registrarse');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      toast.success('Has cerrado sesión');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  // Verify authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('token');

        if (savedToken) {
          // Set token first so API interceptor can use it
          setToken(savedToken);

          // Get user profile with the token
          const response = await api.get('/auth/me');
          const responseData = response.data;

          setUser({
            id: responseData.data.user.id || '',
            name: responseData.data.user.email.split('@')[0] || 'Usuario',
            email: responseData.data.user.email || '',
          });
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        // Clean up on error
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // No Supabase auth listener needed anymore
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};