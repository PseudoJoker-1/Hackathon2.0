// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

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
  const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app';
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('access');
      setIsAuthenticated(!!token);
      if (!token) router.replace('/signin');
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('Ошибка логина:', err);
      return;
    }
    const { access, refresh } = await res.json();
    await AsyncStorage.setItem('access', access);
    await AsyncStorage.setItem('refresh', refresh);
    setIsAuthenticated(true);
    router.replace('/(tabs)');
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
