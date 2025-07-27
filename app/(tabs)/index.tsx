import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withAuthProtection from '../context/HomeScreen_protected';
import { usePoints } from '../context/PointsContext';

interface Report {
  id: number;
  report_type: string;
  status: string;
  room: { number: number };
  description: string;
}

interface Leader {
  id: number;
  name: string;
  points: number;
}

const HomeScreen = () => {
  const [username, setUsername] = useState('');
  const { points } = usePoints(); 
  const [stats, setStats] = useState({ resolved: 0, pending: 0, urgent: 0 });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); 
  const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app';  

  const fetchData = useCallback(async () => {
    const token = await AsyncStorage.getItem('access');
    if (!token) {
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [userRes, reportRes, leaderRes] = await Promise.all([
        fetch(`${BASE_URL}/api/me/`, { headers }),
        fetch(`${BASE_URL}/api/reports/`, { headers }),
        fetch(`${BASE_URL}/api/leaderboard/`, { headers }),
      ]);

      const userData = await userRes.json();
      setUsername(userData.username || 'User');
      setIsAdmin(userData.is_admin === true);

      const reports: Report[] = await reportRes.json();
      const resolved = reports.filter(r => r.status === 'resolved').length;
      const pending = reports.filter(r => r.status === 'pending').length;
      const urgent = reports.filter(r => r.status === 'urgent').length;
      setStats({ resolved, pending, urgent });
      setRecentReports(reports.slice(0, 2));

      const leaders: Leader[] = await leaderRes.json();
      setLeaderboard(leaders.slice(0, 3));
    } catch (error) {
      console.error('API error:', error);
    } finally {
      setLoading(false);
    }
  }, [points]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{username}</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.pointsText}>{points}</Text>
          </View>
        </View>

        {isAdmin && (
          <View style={styles.statsContainer}>
            <StatCard icon="checkmark-circle" color="#10B981" label="Resolved" value={stats.resolved} />
            <StatCard icon="time" color="#F59E0B" label="Pending" value={stats.pending} />
            <StatCard icon="warning" color="#EF4444" label="Urgent" value={stats.urgent} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          {recentReports.map((r) => (
            <View key={r.id} style={styles.reportCard}>
              <Ionicons name="alert-circle" size={20} color="#EF4444" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.reportTitle}>{r.report_type}</Text>
                <Text style={styles.reportSubtitle}>Room {r.room.number}</Text>
              </View>
              <Text style={styles.statusText}>{r.status}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Contributors</Text>
          {leaderboard.map((user, idx) => (
            <View key={user.id} style={styles.reportCard}>
              <Text style={{ marginRight: 8 }}>{idx + 1}.</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.reportTitle}>{user.name}</Text>
                <Text style={styles.reportSubtitle}>{user.points} pts</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({ icon, color, label, value }: { icon: any; color: string; label: string; value: number }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={20} color={color} style={{ marginBottom: 6 }} />
    <Text style={styles.statNumber}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default withAuthProtection(HomeScreen);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { paddingHorizontal: 20, paddingVertical: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 16, color: '#6B7280' },
  userName: { fontSize: 24, fontWeight: '700', color: '#111827' },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pointsText: { fontSize: 16, fontWeight: '600', color: '#D97706', marginLeft: 6 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: { fontSize: 20, fontWeight: '700', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 12 },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  reportTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 2 },
  reportSubtitle: { fontSize: 14, color: '#6B7280' },
  statusText: { fontSize: 12, fontWeight: '600', color: '#D97706' },
});
