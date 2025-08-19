import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { ENDPOINTS } from '@/utils/api/endpoints'
import withAuthProtection from '@/components/common/ProtectedRoute'
import AsyncStorage from '@react-native-async-storage/async-storage'


interface Leader {
  id: number
  name: string
  points: number
}

const LeaderboardScreen = () => {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)

  // Загружаем таблицу лидеров
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = await AsyncStorage.getItem('access')
        const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app'
        const response = await axios.get(`${BASE_URL}/api/leaderboard/`,{
          headers: {Authorization: `Bearer ${token}`},
        })
        setLeaders(response.data)
      } catch (error) {
        console.error('Failed to load leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // Показываем загрузку, пока данные не получены
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top campus contributors</Text>

        {leaders?.map((user, index) => (
          <View key={user.id} style={styles.item}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.points}>{user.points} points</Text>
            </View>
            {index === 0 && (
              <Ionicons name="trophy" size={18} color="#F59E0B" />
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default withAuthProtection(LeaderboardScreen)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4, color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 20 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  rank: { fontSize: 16, fontWeight: '700', width: 24, textAlign: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  avatarText: {
    fontWeight: '600',
    color: '#374151',
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#111827' },
  points: { fontSize: 14, color: '#6B7280' },
})