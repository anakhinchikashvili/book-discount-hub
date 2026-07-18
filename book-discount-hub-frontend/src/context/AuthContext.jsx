import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { userId, fullName, role }
  const [loading, setLoading] = useState(true);

  // გვერდის refresh-ზეც არ დაგვეკარგოს session
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await loginApi(email, password);
    const { token, userId, fullName, role } = response.data;

    const userData = { userId, fullName, role };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isPublisher: user?.role === 'PUBLISHER',
    isAdmin: user?.role === 'ADMIN',
    login,
    logout,
  };

  // სანამ localStorage-ს არ შევამოწმებთ, გვერდი ცარიელ (გამოსული) მდგომარეობას ნუ დაანახებთ -
  // თორემ დალოგინებული მომხმარებელიც წამით "გამოსული" ჩანდება refresh-ისას
  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth უნდა გამოიყენო მხოლოდ <AuthProvider>-ის შიგნით');
  }
  return context;
}