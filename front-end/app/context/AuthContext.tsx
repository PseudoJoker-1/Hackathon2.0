// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { config } from '@/config';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('access');
      setIsAuthenticated(!!token);
      
      // Добавьте редирект только если не на auth-экранах
      if (!token && router.canGoBack()) {
        router.replace('/signin');
      }
    };
    
    checkAuth();
  }, []);
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('access');
      setIsAuthenticated(!!token);
      if (!token) router.replace('/signin');
    })();
  }, []);

  const login = async (email: string, password: string) => {
    // const res = await fetch('http://localhost:8000/api/token/', {
    const res = await fetch(`${config.URL}:8000/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      // mode:'no-cors',
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('ошибка логина:', err);
      return;
    }
    const { access, refresh } = await res.json();
    await AsyncStorage.setItem('access', access);
    await AsyncStorage.setItem('refresh', refresh);
    setIsAuthenticated(true);
    router.replace('/');
  };

  const logout = async () => {
    await AsyncStorage.removeItem('access');
    await AsyncStorage.removeItem('refresh');
    setIsAuthenticated(false);
    router.replace('/signin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
