import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,

  // Входим в аккаунт и сохраняем токены
  login: async (access, refresh) => {
    try {
      const decoded = jwtDecode(access)
      await AsyncStorage.setItem('access', access)
      await AsyncStorage.setItem('refresh', refresh)
      set({
        isAuthenticated: true, 
        accessToken: access, 
        refreshToken: refresh, 
        user: decoded,
      })
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },
  
  // Выходим из аккаунта
  logout: async () => {
    try {
      await AsyncStorage.removeItem('access')
      await AsyncStorage.removeItem('refresh')
      set({ 
        isAuthenticated: false, 
        accessToken: null, 
        refreshToken: null, 
        user: null,
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  },
  
  // Проверяем авторизацию при запуске приложения
  initialize: async () => {
    try {
      const access = await AsyncStorage.getItem('access')
      const refresh = await AsyncStorage.getItem('refresh')
      
      if (access) {
        const decoded = jwtDecode(access)
        set({ 
          isAuthenticated: true, 
          accessToken: access, 
          refreshToken: refresh, 
          user: decoded 
        })
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
    }
  },
}))