import { useEffect } from 'react'
import { useAuthStore } from './authSlice'

// Хук для работы с аутентификацией
export const useAuth = () => {
  const { isAuthenticated, login, logout, initialize } = useAuthStore()
  
  // При монтировании компонента инициализируем аутентификацию
  useEffect(() => {
    initialize()
  }, [])

  return {
    isAuthenticated,
    login,
    logout,
  }
}