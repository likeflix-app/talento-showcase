import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { authService } from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if user is already logged in with valid token
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    setState({
      user,
      isAuthenticated,
      isLoading: false,
    });
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.login(credentials);
      setState({
        user,
        isAuthenticated: authService.isAuthenticated(),
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.register(credentials);
      // Don't automatically set as authenticated since email needs verification
      setState(prev => ({ ...prev, isLoading: false }));
      return user;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
