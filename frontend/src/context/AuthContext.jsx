import { createContext, useContext, useState, useEffect } from 'react';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ username: decoded.username || decoded.user_id });
      } catch (error) {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(REFRESH_TOKEN, refreshToken);
    try {
      const decoded = jwtDecode(accessToken);
      setUser({ username: decoded.username || decoded.user_id });
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setUser(null);
  };

  const refreshToken = async () => {
    const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshTokenValue) {
      logout();
      return null;
    }

    try {
      const res = await api.post('/api/token/refresh/', {
        refresh: refreshTokenValue,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        try {
          const decoded = jwtDecode(res.data.access);
          setUser({ username: decoded.username || decoded.user_id });
        } catch (error) {
          console.error('Error decoding refreshed token:', error);
        }
        return res.data.access;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return null;
    }
    return null;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

