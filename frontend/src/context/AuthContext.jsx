import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh user data
  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/user/me', {
        headers: { 'x-auth-token': token }
      });
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to refresh user:', err);
      return null;
    }
  };

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      await refreshUser();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      await refreshUser();
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Add to favorites function
  const addFavorite = async (countryCode) => {
    try {
      await axios.post(
        `http://localhost:5000/api/user/favorites/${countryCode}`,
        {},
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      await refreshUser();
    } catch (err) {
      console.error('Failed to add favorite:', err);
      throw err;
    }
  };

  // Remove from favorites function
  const removeFavorite = async (countryCode) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/user/favorites/${countryCode}`,
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      await refreshUser();
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      register, 
      login, 
      logout,
      refreshUser,
      addFavorite,
      removeFavorite
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};