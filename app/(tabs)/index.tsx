import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import withAuthProtection from '../context/HomeScreen_protected';

function HomeScreen()  {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>Alex Johnson</Text>
          </View>
          <View style={styles.pointsBadge}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.pointsText}>1,250</Text>
          </View>
        </View>

        {/* Quick Report Button */}
        <TouchableOpacity style={styles.quickReportButton}>
          <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.quickReportText}>Quick Report Issue</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="time" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="warning" size={20} color="#EF4444" />
            </View>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Urgent</Text>
          </View>
        </View>

        {/* Recent Reports */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reports</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reportCard}>
            <View style={styles.reportIcon}>
              <Ionicons name="warning" size={16} color="#EF4444" />
            </View>
            <View style={styles.reportContent}>
              <Text style={styles.reportTitle}>Broken Light in Library</Text>
              <Text style={styles.reportSubtitle}>Room 204A • 2 hours ago</Text>
            </View>
            <View style={[styles.statusBadge, styles.statusPending]}>
              <Text style={styles.statusText}>Pending</Text>
            </View>
          </View>

          <View style={styles.reportCard}>
            <View style={styles.reportIcon}>
              <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            </View>
            <View style={styles.reportContent}>
              <Text style={styles.reportTitle}>Water Leak Fixed</Text>
              <Text style={styles.reportSubtitle}>Room 101B • Yesterday</Text>
            </View>
            <View style={[styles.statusBadge, styles.statusResolved]}>
              <Text style={styles.statusText}>Resolved</Text>
            </View>
          </View>
        </View>

        {/* Leaderboard Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Contributors</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.leaderboardCard}>
            <View style={styles.leaderboardItem}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>1</Text>
              </View>
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>SM</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.leaderName}>Sarah Miller</Text>
                <Text style={styles.leaderPoints}>2,450 points</Text>
              </View>
              <Ionicons name="trophy" size={16} color="#F59E0B" />
            </View>
            
            <View style={styles.leaderboardItem}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>2</Text>
              </View>
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.leaderName}>John Davis</Text>
                <Text style={styles.leaderPoints}>1,890 points</Text>
              </View>
            </View>
            
            <View style={styles.leaderboardItem}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>3</Text>
              </View>
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>AJ</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.leaderName}>Alex Johnson</Text>
                <Text style={styles.leaderPoints}>1,250 points</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default withAuthProtection(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 6,
  },
  quickReportButton: {
    marginBottom: 24,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  quickReportText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
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
  reportIcon: {
    marginRight: 12,
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusResolved: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
  },
  leaderboardCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rankBadge: {
    width: 24,
    height: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  userInfo: {
    flex: 1,
  },
  leaderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  leaderPoints: {
    fontSize: 14,
    color: '#6B7280',
  },
});