// import React, { useEffect, useState } from 'react'
// import { View, ActivityIndicator } from 'react-native'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { jwtDecode } from 'jwt-decode'
// import { useRouter } from 'expo-router'
// import { Redirect } from 'expo-router'
// import { useAuth } from '@/app/context/AuthContext'
// import axios from 'axios'

// interface DecodedToken {
//   exp: number
//   [key: string]: any
// }

// // компонент для защиты маршрутов?
// // const withAuthProtection = (Component: React.ComponentType) => {
// //   return function ProtectedComponent(props: any){
// //     const [loading,setLoading] = useState(true)
// //     const router = useRouter()
// //     const { isAuthenticated } = useAuth()

// //     // обновляем токен доступа
// //     const refreshAccessToken = async(): Promise<boolean>=>{
// //       const refresh = await AsyncStorage.getItem('refresh')

// //       if(!refresh){
// //         return false
// //       }
// //       try{
// //         // const res = await axios.post('http://localhost:8000/api/token/refresh/',{
// //         const res = await axios.post('https://django-api-1082068772584.us-central1.run.app/api/token/refresh/',{
// //           refresh,
// //         })
    
// //         if(res.status == 200){
// //           const { access } = res.data
// //           await AsyncStorage.setItem('access', access)
// //           return true
// //         }
    
// //         // Если не получилось - выходим из аккаунта
// //         await AsyncStorage.removeItem('access')
// //         await AsyncStorage.removeItem('refresh')
// //         return false
// //       }
// //       catch(error){
// //         console.error('Не получилось обновить токен', error)
// //         return false
// //       }
// //     }
// //     useEffect(()=>{
// //       const checkToken = async (): Promise<void> => {
// //         const token = await AsyncStorage.getItem('access')
// //         if(!token){
// //           router.replace('/signin')
// //           return
// //         }
// //         try{
// //           const decoded = jwtDecode<DecodedToken>(token)
// //           const now = Date.now() / 1000

// //           // Если токен устарел - пробуем обновиться
// //           if(decoded.exp < now){
// //             const refreshed = await refreshAccessToken()
// //             if(!refreshed){
// //               router.replace('/signin')
// //               return
// //             }
// //           }
// //         }
// //         catch(error){
// //           router.replace('/signin')
// //           return
// //         }
// //         setLoading(false)
// //       }
      
// //       checkToken()
// //     },[])
// //     if(!isAuthenticated){
// //       return <Redirect href="/signin" />
// //     }
// //     if(loading){
// //       return (
// //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// //           <ActivityIndicator size="large" color="#2563EB" />
// //         </View>
// //       )
// //     }
    
// //     return <Component {...props} />
// //   }
// // }

// const withAuthProtection = (Component: React.ComponentType) => {
//   return function ProtectedComponent(props: any) {
//     const [loading, setLoading] = useState(true)
//     const router = useRouter()
//     const { isAuthenticated } = useAuth()

//     useEffect(() => {
//       const checkAuth = async () => {
//         if (isAuthenticated) {
//           setLoading(false)
//           return
//         }

//         const refresh = await AsyncStorage.getItem('refresh')
//         if (!refresh) {
//           router.replace('/signin')
//           return
//         }

//         try {
//           const res = await axios.post('https://django-api-1082068772584.us-central1.run.app/api/token/refresh/', { refresh })
//           if (res.status === 200) {
//             await AsyncStorage.setItem('access', res.data.access)
//           } else {
//             router.replace('/signin')
//             return
//           }
//         } catch (error) {
//           router.replace('/signin')
//           return
//         }
//         setLoading(false)
//       }

//       checkAuth()
//     }, [isAuthenticated])

//     if (loading) {
//       return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <ActivityIndicator size="large" color="#2563EB" />
//         </View>
//       )
//     }

//     if (!isAuthenticated) {
//       return null // или спиннер
//     }

//     return <Component {...props} />
//   }
// }

// export default withAuthProtection

import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { useAuth } from '@/app/context/AuthContext'
import axios from 'axios'

const withAuthProtection = (Component: React.ComponentType) => {
  return function ProtectedComponent(props: any) {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const { isAuthenticated, logout } = useAuth()

    useEffect(() => {
      const checkAuth = async () => {
        if (isAuthenticated) {
          setLoading(false)
          return
        }

        const refresh = await AsyncStorage.getItem('refresh')
        if (!refresh) {
          logout()
          return
        }

        try {
          const res = await axios.post('https://django-api-1082068772584.us-central1.run.app/api/token/refresh/', { refresh })
          if (res.status === 200) {
            await AsyncStorage.setItem('access', res.data.access)
          } else {
            logout()
            return
          }
        } catch (error) {
          logout()
          return
        }

        setLoading(false)
      }

      checkAuth()
    }, [isAuthenticated])

    if (loading || isAuthenticated === null) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }
}

export default withAuthProtection
