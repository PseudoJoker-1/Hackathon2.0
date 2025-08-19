import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { ENDPOINTS } from '@/utils/api/endpoints'
import client from '@/utils/api/client'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Проверяем авторизацию при запуске приложения
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('access')
      setIsAuthenticated(!!token)
      
      // Если нет токена и мы не на auth-экранах - отправляем на вход
      if (!token && router.canGoBack()) {
        router.replace('/signin')
      }
    }
    checkAuth()
  }, [])

  // Входим в аккаунт
  const login = async (email: string, password: string) => {
    try {
      const API_URL = 'https://django-api-1082068772584.us-central1.run.app'
      const response = await axios.post(`${API_URL}${ENDPOINTS.LOGIN}`, { email, password })
      const { access, refresh } = response.data
      
      // Сохраняем токены и обновляем статус авторизации
      await AsyncStorage.setItem('access', access)
      await AsyncStorage.setItem('refresh', refresh)
      setIsAuthenticated(true)
      router.replace('/')
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  // Выходим из аккаунта
  const logout = async () => {
    await AsyncStorage.removeItem('access')
    await AsyncStorage.removeItem('refresh')
    setIsAuthenticated(false)
    router.replace('/signin')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthProvider