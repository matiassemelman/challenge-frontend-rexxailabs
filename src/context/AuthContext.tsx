
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { toast } from 'sonner';

// Define types for our context
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (savedToken) {
        try {
          setToken(savedToken);
          
          // Get user profile data
          // Note: In a real implementation you would fetch the user profile here
          // For now, we'll simulate it with mock data
          setUser({
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
          });
          
          // const response = await api.get('/auth/profile');
          // setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, you would make an API request here
      // const response = await api.post('/auth/login', { email, password });
      // const { token, user } = response.data;
      
      // Mock successful login
      const mockToken = 'mock-jwt-token';
      const mockUser = { id: '1', name: 'Demo User', email };
      
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // In a real app, you would make an API request here
      // const response = await api.post('/auth/register', { name, email, password });
      // const { token, user } = response.data;
      
      // Mock successful registration
      const mockToken = 'mock-jwt-token';
      const mockUser = { id: '1', name, email };
      
      setToken(mockToken);
      setUser(mockUser);
      localStorage.setItem('token', mockToken);
      
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('You have been logged out');
    navigate('/login');
  };
  
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
