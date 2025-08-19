// leader board
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import withAuthProtection from '@/components/common/ProtectedRoute';
import { usePoints } from '@/app/context/PointsContext';

interface Leader {
  id: number;
  name: string;
  points: number;
}

const LeaderboardScreen = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  // const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app'
  const BASE_URL = 'http://localhost:8000'; // For local development;
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/leaderboard/`);
        const data = await res.json();
        setLeaders(data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top campus contributors</Text>

        {leaders.map((user, index) => (
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
  );
};

export default withAuthProtection(LeaderboardScreen);

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
});
