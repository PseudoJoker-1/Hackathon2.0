import React,{useEffect} from 'react';
import { useAuthStore } from './authSlice';

export const useAuth = () => {
  const { isAuthenticated, login, logout, initialize } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, []);

  return { isAuthenticated, login, logout };
};