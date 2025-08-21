import { useEffect } from 'react'
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter'
import * as SplashScreen from 'expo-splash-screen'

declare global {
  interface Window {
    frameworkReady?: () => void
  }
}

// не даем сплеш-скрину скрыться самому
SplashScreen.preventAutoHideAsync()

export function useFrameworkReady() {
  // Загружаем шрифты для всего приложения
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  })

  useEffect(() => {
    // Когда шрифты загружены (или ошибка) - скрываем сплеш-скрин
    if(fontsLoaded || fontError){
      SplashScreen.hideAsync()
      window.frameworkReady?.()
    }
  },[fontsLoaded, fontError])

  return fontsLoaded || fontError
}