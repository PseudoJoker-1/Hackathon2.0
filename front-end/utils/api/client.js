import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const API_URL = 'https://django-api-1082068772584.us-central1.run.app'
// export const API_URL = 'http://localhost:8000'
const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// тут мы добавляем токен к каждому запросу автоматически
client.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  } catch (error) {
    console.error('Ошибка при добавлении токена:', error)
    return config
  }
})

// тут мы перехватывает ошибки и пытается обновить токен если он устарел
client.interceptors.response.use((response)=> response,
async(error)=>{
    const originalRequest = error.config
    if(error.response?.status == 401 && !originalRequest._retry){
      originalRequest._retry = true
      try{
        const refreshToken = await AsyncStorage.getItem('refresh')
        if(refreshToken){
          const response = await axios.post(`${API_URL}/api/token/refresh/`,{
            refresh: refreshToken
          })
          const { access } = response.data
          // Сохраняем новый токен
          await AsyncStorage.setItem('access',access)
          originalRequest.headers.Authorization = `Bearer ${access}`
          return client(originalRequest)
        }
      }
      catch(refreshError){
        console.error('Error token',refreshError)
        await AsyncStorage.removeItem('access')
        await AsyncStorage.removeItem('refresh')
      }
    }
    
    return Promise.reject(error)
  }
)

export default client