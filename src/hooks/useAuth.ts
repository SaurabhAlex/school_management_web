import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export type UserRole = 'student' | 'faculty' | 'admin';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try {
      const userData = authService.getUser();
      console.log('Initial user data:', userData);
      return userData;
    } catch (error) {
      console.error('Error loading initial user data:', error);
      return null;
    }
  });

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        try {
          const userData = authService.getUser();
          console.log('Checking auth - user data:', userData);
          setUser(userData);
        } catch (error) {
          console.error('Error during auth check:', error);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, role: UserRole = 'student') => {
    try {
      console.log('Attempting login with role:', role);
      const response = await authService.login({ email, password }, role);
      console.log('Login response:', response);
      setIsAuthenticated(true);
      setUser(response.user);
      // Ensure we have the user data before navigating
      if (response.user && response.user.role) {
        navigate('/', { replace: true });
      } else {
        console.error('Login successful but user role not set');
        throw new Error('Login successful but role not set');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register({ name, email, password });
      setIsAuthenticated(true);
      setUser(response.user);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user');
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
  };
}; 