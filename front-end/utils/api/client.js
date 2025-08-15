import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
export const API_URL = 'https://django-api-1082068772584.us-central1.run.app'

const client = axios.create({
  baseURL: API_URL,
})

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use((response)=> response,
  async(error)=>{
    const originalRequest = error.config
    if(error.response?.status == 401 && !originalRequest._retry){
      originalRequest._retry = true
      const refreshToken = await AsyncStorage.getItem('refresh')
      if(refreshToken){
        try{
          const response = await axios.post(`${API_URL}/api/token/refresh/`,
            {
              refresh: refreshToken
            }
          )
          const { access } = response.data
          await AsyncStorage.setItem('access',access)
          originalRequest.headers.Authorization =`Bearer ${access}`
          return axios(originalRequest)
        }
        catch(error){
          console.error('Refresh token failed',error)
          await AsyncStorage.removeItem('access')
          await AsyncStorage.removeItem('refresh')
        }
      }
    }
    return Promise.reject(error)
  }
);

export default client