// profile
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import withAuthProtection from '@/components/common/ProtectedRoute';

interface Report {
  id: number;
  description: string;
  status: string;
  report_type: string;
  created_at?: string;
}

interface UserData {
  FIO: string;
  points: number;
  rank: number;
}

function ProfileScreen() {
  const [user, setUser] = useState<UserData | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  // const BASE_URL = 'https://django-api-1082068772584.us-central1.run.app';
  const BASE_URL = 'http://localhost:8000'; // For local development

  const fetchProfile = async () => {
    const token = await AsyncStorage.getItem('access');
    try {
      const [meRes, reportsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/me/`, {
          headers: { Authorization: `Bearer ${token}` },
          // mode:'no-cors',
        }),
        fetch(`${BASE_URL}/api/reports/`, {
          headers: { Authorization: `Bearer ${token}` },
          // mode:'no-cors',
        })
      ]);

      const userData = await meRes.json();
      const reportData = await reportsRes.json();

      setUser({
        FIO: userData.FIO || userData.username,
        points: userData.points,
        rank: 3 // можно заменить реальным ранком, если доступен
      });

      // фильтрация только пользовательских репортов
      const myReports = reportData.filter((r: any) => r.user === userData.id);
      setReports(myReports);
    } catch (e) {
      console.error('Error loading profile', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading || !user) return <ActivityIndicator size="large" style={{ flex: 1 }} color="#2563EB" />;

  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const successRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="white" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.FIO}</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="star" size={20} color="#F59E0B" />
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <Text style={styles.statValue}>{user.points}</Text>
            <Text style={styles.statChange}>+150 this week</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="trending-up" size={20} color="#10B981" />
              <Text style={styles.statLabel}>Rank</Text>
            </View>
            <Text style={styles.statValue}>#{user.rank}</Text>
            <Text style={styles.statChange}>+1 from last week</Text>
          </View>
        </View>

        {/* Report Statistics */}
        <View style={styles.reportStatsCard}>
          <Text style={styles.cardTitle}>Report Statistics</Text>
          <View style={styles.reportStatsGrid}>
            <View style={styles.reportStat}>
              <View style={styles.reportStatIcon}>
                <Ionicons name="time" size={16} color="#3B82F6" />
              </View>
              <Text style={styles.reportStatNumber}>{totalReports}</Text>
              <Text style={styles.reportStatLabel}>Total Reports</Text>
            </View>
            <View style={styles.reportStat}>
              <View style={styles.reportStatIcon}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              </View>
              <Text style={styles.reportStatNumber}>{resolvedReports}</Text>
              <Text style={styles.reportStatLabel}>Resolved</Text>
            </View>
            <View style={styles.reportStat}>
              <View style={styles.reportStatIcon}>
                <Ionicons name="trophy" size={16} color="#F59E0B" />
              </View>
              <Text style={styles.reportStatNumber}>{successRate}%</Text>
              <Text style={styles.reportStatLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityCard}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          {reports.slice(0, 4).map((r) => (
            <View key={r.id} style={styles.activityItem}>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{r.description}</Text>
                <Text style={styles.activityDate}>{r.status}</Text>
              </View>
              <View style={styles.activityPoints}>
                <Ionicons
                  name={
                    r.status === 'resolved'
                      ? 'checkmark-circle'
                      : r.status === 'pending'
                      ? 'time'
                      : 'alert-circle'
                  }
                  size={18}
                  color={
                    r.status === 'resolved' ? '#10B981' : r.status === 'pending' ? '#F59E0B' : '#EF4444'
                  }
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default withAuthProtection(ProfileScreen);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: '#2563EB',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },

  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginLeft: 8 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  statChange: { fontSize: 12, color: '#10B981', fontWeight: '500' },

  reportStatsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 },
  reportStatsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  reportStat: { alignItems: 'center' },
  reportStatIcon: { marginBottom: 8 },
  reportStatNumber: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  reportStatLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },

  activityCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 16, fontWeight: '500', color: '#111827', marginBottom: 2 },
  activityDate: { fontSize: 14, color: '#6B7280' },
  activityPoints: { marginLeft: 12 },
  bottomPadding: { height: 20 },
});
