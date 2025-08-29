import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'exhibitor' | 'attendee';
  company?: string;
  position?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First, try to restore user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData && token) {
          try {
            const userData = JSON.parse(storedUserData);
            setUser(userData);
            console.log('User data restored from localStorage');
          } catch (parseError) {
            console.error('Failed to parse stored user data:', parseError);
            localStorage.removeItem('userData');
          }
        }

        // Then verify with backend if token exists
        if (token) {
          try {
            const profile = await authAPI.getProfile();
            setUser(profile.user);
            // Ensure token is still valid and refresh if needed
            if (profile.token) {
              setToken(profile.token);
              localStorage.setItem('authToken', profile.token);
            }
            // Update stored user data
            localStorage.setItem('userData', JSON.stringify(profile.user));
          } catch (error) {
            console.error('Failed to get user profile:', error);
            // Clear invalid token and user data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear all stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      
      const { token: newToken, user: userData } = response;
      
      // Store token and user data
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('userData', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      
      console.log('Login successful, user data stored');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear all stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
    console.log('User logged out, all data cleared');
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      await authAPI.register(userData);
      // Registration successful, user can now login
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      // This would call an API endpoint to update user profile
      // For now, just update local state
      if (user) {
        setUser({ ...user, ...userData });
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    register,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
