import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import withAuthProtection from '../context/HomeScreen_protected';

const achievements = [
  { id: 1, name: 'First Reporter', description: 'Submitted your first report', icon: 'ribbon', earned: true },
  { id: 2, name: 'Problem Solver', description: 'Reported 10 issues', icon: 'trophy', earned: true },
  { id: 3, name: 'Streak Master', description: 'Reported for 7 days straight', icon: 'calendar', earned: true },
  { id: 4, name: 'Top Contributor', description: 'Reach top 10 leaderboard', icon: 'trophy', earned: false },
];

const recentActivity = [
  { id: 1, type: 'report', title: 'Broken Light in Library', points: 50, date: '2 hours ago', status: 'pending' },
  { id: 2, type: 'resolved', title: 'Water Leak Fixed', points: 75, date: 'Yesterday', status: 'resolved' },
  { id: 3, type: 'purchase', title: 'Redeemed Free Coffee', points: -200, date: '2 days ago', status: 'redeemed' },
  { id: 4, type: 'report', title: 'WiFi Issue in Dorm', points: 50, date: '3 days ago', status: 'resolved' },
];

function ProfileScreen() {
  const [userStats] = useState({
    name: 'Alex Johnson',
    points: 1250,
    rank: 3,
    totalReports: 16,
    resolvedReports: 12,
    joinDate: 'September 2024',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="white" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userStats.name}</Text>
              <Text style={styles.joinDate}>Member since {userStats.joinDate}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Ionicons name="settings" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="star" size={20} color="#F59E0B" />
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <Text style={styles.statValue}>{userStats.points.toLocaleString()}</Text>
            <Text style={styles.statChange}>+150 this week</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Ionicons name="trending-up" size={20} color="#10B981" />
              <Text style={styles.statLabel}>Rank</Text>
            </View>
            <Text style={styles.statValue}>#{userStats.rank}</Text>
            <Text style={styles.statChange}>+1 from last week</Text>
          </View>
        </View>

        {/* Report Stats */}
        <View style={styles.reportStatsCard}>
          <Text style={styles.cardTitle}>Report Statistics</Text>
          <View style={styles.reportStatsGrid}>
            <View style={styles.reportStat}>
              <View style={styles.reportStatIcon}>
                <Ionicons name="time" size={16} color="#3B82F6" />
              </View>
              <Text style={styles.reportStatNumber}>{userStats.totalReports}</Text>
              <Text style={styles.reportStatLabel}>Total Reports</Text>
            </View>
            <View style={styles.reportStat}>
              <View style={styles.reportStatIcon}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              </View>
              <Text style={styles.reportStatNumber}>{userStats.resolvedReports}</Text>
              <Text style={styles.reportStatLabel}>Resolved</Text>
            </View>
            <View style={styles.reportStat}>
              <View style={styles.reportStatIcon}>
                <Ionicons name="trophy" size={16} color="#F59E0B" />
              </View>
              <Text style={styles.reportStatNumber}>
                {Math.round((userStats.resolvedReports / userStats.totalReports) * 100)}%
              </Text>
              <Text style={styles.reportStatLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsCard}>
          <Text style={styles.cardTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={[
                styles.achievementItem,
                !achievement.earned && styles.achievementLocked
              ]}>
                <View style={[
                  styles.achievementIcon,
                  { backgroundColor: achievement.earned ? '#10B981' : '#E5E7EB' }
                ]}>
                  <Ionicons 
                    name={achievement.icon as any}
                    size={16} 
                    color={achievement.earned ? 'white' : '#9CA3AF'} 
                  />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementName,
                    !achievement.earned && styles.achievementNameLocked
                  ]}>
                    {achievement.name}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityCard}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <View style={styles.activityPoints}>
                <Text style={[
                  styles.activityPointsText,
                  { color: activity.points > 0 ? '#10B981' : '#6B7280' }
                ]}>
                  {activity.points > 0 ? '+' : ''}{activity.points}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="time" size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>My Reports</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="trophy" size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>All Achievements</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="settings" size={20} color="#6B7280" />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}
export default withAuthProtection(ProfileScreen);

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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: '#2563EB',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
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
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  reportStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportStat: {
    alignItems: 'center',
  },
  reportStatIcon: {
    marginBottom: 8,
  },
  reportStatNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  reportStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  achievementsCard: {
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
  achievementsGrid: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  achievementNameLocked: {
    color: '#9CA3AF',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
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
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityPoints: {
    marginLeft: 12,
  },
  activityPointsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    marginLeft: 12,
  },
  bottomPadding: {
    height: 20,
  },
});