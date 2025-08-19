import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

export default function SplashScreen() {
  const router = useRouter()

  // Через 3 секунды переходим на onboarding
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding')
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={80} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Coventry Campus</Text>
        <Text style={styles.subtitle}>Excellence in Education</Text>
      </View>
      <Text style={styles.copyright}>© 2025 Con. All rights reserved.</Text>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#93C5FD',
    textAlign: 'center',
  },
  copyright: {
    fontSize: 12,
    color: '#93C5FD',
    marginBottom: 40,
  },
})