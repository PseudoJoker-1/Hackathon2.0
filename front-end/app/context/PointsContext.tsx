import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { ENDPOINTS } from '@/utils/api/endpoints'

type PointsContextType = {
  points: number
  setPoints: (p: number)=> void
  getPoints: ()=> Promise<void>
}

const PointsContext = createContext<PointsContextType>({
  points: 0,
  setPoints: ()=>{},
  getPoints: async()=>{}, 
})

export const PointsProvider = ({children}:{children: React.ReactNode })=>{
  const [points, setPoints] = useState(0)

  // загружаем баллы пользователя с сервера
  const getPoints = async()=>{
    try {
      const token = await AsyncStorage.getItem('access')
      if(!token){
        console.log('No token found')
        return
      }
      const API_URL = 'https://django-api-1082068772584.us-central1.run.app'
      // const API_URL = 'http://localhost:8000'
      const response = await axios.get(`${API_URL}${ENDPOINTS.USER_PROFILE}`,{
        headers: { Authorization: `Bearer ${token}` }
      })
      
      setPoints(response.data.points || 0)
    }
    catch(error){
      console.error('Failed to fetch points:',error)
    }
  }
  useEffect(()=>{
    getPoints()
  },[])

  return (
    <PointsContext.Provider value={{points,setPoints,getPoints}}>
      {children}
    </PointsContext.Provider>
  )
}

export const usePoints = () => useContext(PointsContext)