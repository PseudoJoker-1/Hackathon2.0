import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import AuthProvider from '@/app/context/AuthContext'
import { PointsProvider } from '@/app/context/PointsContext'
import { useFrameworkReady } from '@/hooks/useFrameworkReady'

// Корневой layout приложения
export default function RootLayout() {
  // Инициализация фреймворка (шрифты и т.д.)
  useFrameworkReady()

  return (
    <AuthProvider>
      <PointsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack>
        <StatusBar style="auto" />
      </PointsProvider>
    </AuthProvider>
  )
}