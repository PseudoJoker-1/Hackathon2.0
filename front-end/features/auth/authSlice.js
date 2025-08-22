import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/types';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,

  login: async (access, refresh) => {
    const decoded = jwtDecode(access); 
    await AsyncStorage.setItem('access', access);
    await AsyncStorage.setItem('refresh', refresh);
    set({ 
      isAuthenticated: true, 
      accessToken: access, 
      refreshToken: refresh, 
      user: decoded 
    });
  },

  logout: async () => {
    await AsyncStorage.removeItem('access');
    await AsyncStorage.removeItem('refresh');
    set({ 
      isAuthenticated: false, 
      accessToken: null, 
      refreshToken: null, 
      user: null 
    });
  },

  initialize: async () => {
    const access = await AsyncStorage.getItem('access');
    const refresh = await AsyncStorage.getItem('refresh');
    if (access) {
      const decoded = jwtDecode(access);
      set({ 
        isAuthenticated: true, 
        accessToken: access, 
        refreshToken: refresh, 
        user: decoded 
      });
    }
  },
}));