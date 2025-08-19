import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'expo-router'
import { Redirect } from 'expo-router'
import { useAuth } from '@/app/context/AuthContext'
import axios from 'axios'

interface DecodedToken {
  exp: number
  [key: string]: any
}

// Высокоуровневый компонент для защиты маршрутов
const withAuthProtection = (Component: React.ComponentType) => {
  return function ProtectedComponent(props: any) {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { isAuthenticated } = useAuth()

    // Пробуем обновить токен доступа
    const refreshAccessToken = async (): Promise<boolean> => {
      const refresh = await AsyncStorage.getItem('refresh');
      if (!refresh) return false;
    
      try {
        const res = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh,
        });
    
        if (res.status === 200) {
          const { access } = res.data;
          await AsyncStorage.setItem('access', access);
          return true;
        }
    
        // Если не получилось - выходим из аккаунта
        await AsyncStorage.removeItem('access');
        await AsyncStorage.removeItem('refresh');
        return false;
      } catch (error) {
        console.error('Не получилось обновить токен', error);
        return false;
      }
    };

    useEffect(() => {
      const checkToken = async (): Promise<void> => {
        const token = await AsyncStorage.getItem('access')
        
        // Если нет токена - отправляем на вход
        if (!token) {
          router.replace('/signin')
          return
        }

        try {
          const decoded = jwtDecode<DecodedToken>(token)
          const now = Date.now() / 1000

          // Если токен устарел - пробуем обновиться
          if (decoded.exp < now) {
            const refreshed = await refreshAccessToken()
            if (!refreshed) {
              router.replace('/signin')
              return
            }
          }
        } catch (err) {
          // Если что-то пошло не так - отправляем на вход
          router.replace('/signin')
          return
        }
        
        setLoading(false)
      }
      
      checkToken()
    }, [])

    // Если не авторизован - отправляем на вход
    if (!isAuthenticated) {
      return <Redirect href="/signin" />
    }

    // Пока проверяем токен - показываем загрузку
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      )
    }

    // Если все ок - показываем защищенный компонент
    return <Component {...props} />
  }
}

export default withAuthProtection