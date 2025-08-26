// import React, { createContext, useContext, useEffect, useState } from 'react'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { useRouter } from 'expo-router'
// import axios from 'axios'
// import { ENDPOINTS } from '@/utils/api/endpoints'
// import client from '@/utils/api/client'

// interface AuthContextType {
//   isAuthenticated: boolean
//   login: (email: string, password: string)=> Promise<void>
//   logout: ()=> void
// }

// const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   login: async()=>{},
//   logout: ()=>{},
// })

// export const AuthProvider: React.FC<{children: React.ReactNode }> = ({ children })=> {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const router = useRouter()

//   // проверка авторизации при запуске приложения
//   useEffect(()=>{
//     const checkAuth = async()=>{
//       const token = await AsyncStorage.getItem('access')
//       setIsAuthenticated(!!token)
//       // if(token){
//         // setIsAuthenticated(true)
//         // router.replace('/(main)/(tabs)')  // редирект при наличии токена
//       // } else {
//         // setIsAuthenticated(false)
//         // router.replace('/signin')
//       // }

//       // const token = await AsyncStorage.getItem('access')
//       // setIsAuthenticated(!!token)
//       // if(!token && router.canGoBack()){
//       //   router.replace('/signin')
//       // }
//     };
//     checkAuth()
//   },[])

//   // вход в аккаунт
//   const login = async(email:string, password:string)=>{
//     try{
//       const API_URL = 'https://django-api-1082068772584.us-central1.run.app'
//       // const API_URL = 'http://localhost:8000'
//       const response = await axios.post(`${API_URL}${ENDPOINTS.LOGIN}`,{ email,password});
//       const { access,refresh } = response.data
//       await AsyncStorage.setItem('access', access)
//       await AsyncStorage.setItem('refresh', refresh)
//       setIsAuthenticated(true)

//       if (router.canGoBack()){
//         // console.log('Login successful, navigating to main screen')
//         router.replace('/(main)/(tabs)')
//       }
//     } catch(error:any){
//       // console.error('Login error:', error)
//       throw new Error(error.response?.data?.message || 'Login failed')
//     }
//   };

//   const logout = async()=>{
//     await AsyncStorage.removeItem('access')
//     await AsyncStorage.removeItem('refresh')
//     setIsAuthenticated(false)
//     router.replace('/signin')
//   }

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)
// export default AuthProvider


import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import axios from 'axios'
import { ENDPOINTS } from '@/utils/api/endpoints'

interface AuthContextType {
  isAuthenticated: boolean | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  login: async () => {},
  logout: () => {},
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  // Проверка авторизации при запуске приложения
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('access')
      setIsAuthenticated(!!token)
    }
    checkAuth()
  }, [])

  // Вход в аккаунт
  const login = async (email: string, password: string) => {
    try {
      const API_URL = 'https://django-api-1082068772584.us-central1.run.app'
      const response = await axios.post(`${API_URL}${ENDPOINTS.LOGIN}`, { email, password })
      const { access, refresh } = response.data

      await AsyncStorage.setItem('access', access)
      await AsyncStorage.setItem('refresh', refresh)
      setIsAuthenticated(true)

      // Всегда редиректим после успешного логина
      router.replace('/(main)/(tabs)')
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  // Выход из аккаунта
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
