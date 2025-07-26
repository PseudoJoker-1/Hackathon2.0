import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import withAuthProtection from '../context/HomeScreen_protected';
const leaderboardData = [
  { id: 1, name: 'Sarah Miller', points: 2450, avatar: 'SM', rank: 1, change: '+2' },
  { id: 2, name: 'John Davis', points: 1890, avatar: 'JD', rank: 2, change: '0' },
  { id: 3, name: 'Alex Johnson', points: 1250, avatar: 'AJ', rank: 3, change: '+1' },
  { id: 4, name: 'Emma Wilson', points: 1180, avatar: 'EW', rank: 4, change: '-1' },
  { id: 5, name: 'Michael Chen', points: 980, avatar: 'MC', rank: 5, change: '+3' },
  { id: 6, name: 'Lisa Thompson', points: 890, avatar: 'LT', rank: 6, change: '0' },
  { id: 7, name: 'David Brown', points: 750, avatar: 'DB', rank: 7, change: '+1' },
  { id: 8, name: 'Rachel Green', points: 680, avatar: 'RG', rank: 8, change: '-2' },
  { id: 9, name: 'Tom Anderson', points: 620, avatar: 'TA', rank: 9, change: '0' },
  { id: 10, name: 'Sophie Lee', points: 550, avatar: 'SL', rank: 10, change: '+4' },
];

const timeFilters = ['This Week', 'This Month', 'All Time'];

function LeaderboardScreen() {
  const [selectedFilter, setSelectedFilter] = useState('This Month');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Ionicons name="trophy" size={20} color="#F59E0B" />;
      case 2:
        return <Ionicons name="medal" size={20} color="#9CA3AF" />;
      case 3:
        return <Ionicons name="ribbon" size={20} color="#CD7C2F" />;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#F59E0B';
      case 2:
        return '#9CA3AF';
      case 3:
        return '#CD7C2F';
      default:
        return '#6B7280';
    }
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return '#10B981';
    if (change.startsWith('-')) return '#EF4444';
    return '#6B7280';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>Top campus contributors</Text>
        </View>

        {/* Time Filter */}
        <View style={styles.filterContainer}>
          {timeFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          <View style={styles.podium}>
            {/* Second Place */}
            <View style={[styles.podiumPlace, styles.secondPlace]}>
              <View style={styles.podiumAvatar}>
                <Text style={styles.podiumAvatarText}>JD</Text>
              </View>
              <Text style={styles.podiumName}>John D.</Text>
              <Text style={styles.podiumPoints}>1,890</Text>
              <View style={styles.podiumRank}>
                <Text style={styles.podiumRankText}>2</Text>
              </View>
            </View>

            {/* First Place */}
            <View style={[styles.podiumPlace, styles.firstPlace]}>
              <View style={styles.podiumCrown}>
                <Ionicons name="trophy" size={20} color="#F59E0B" />
              </View>
              <View style={styles.podiumAvatar}>
                <Text style={styles.podiumAvatarText}>SM</Text>
              </View>
              <Text style={styles.podiumName}>Sarah M.</Text>
              <Text style={styles.podiumPoints}>2,450</Text>
              <View style={styles.podiumRank}>
                <Text style={styles.podiumRankText}>1</Text>
              </View>
            </View>

            {/* Third Place */}
            <View style={[styles.podiumPlace, styles.thirdPlace]}>
              <View style={styles.podiumAvatar}>
                <Text style={styles.podiumAvatarText}>AJ</Text>
              </View>
              <Text style={styles.podiumName}>Alex J.</Text>
              <Text style={styles.podiumPoints}>1,250</Text>
              <View style={styles.podiumRank}>
                <Text style={styles.podiumRankText}>3</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Full Leaderboard */}
        <View style={styles.leaderboardContainer}>
          <Text style={styles.sectionTitle}>All Rankings</Text>
          {leaderboardData.map((user) => (
            <View key={user.id} style={styles.leaderboardItem}>
              <View style={styles.rankSection}>
                <View style={[styles.rankBadge, { borderColor: getRankColor(user.rank) }]}>
                  {user.rank <= 3 ? (
                    getRankIcon(user.rank)
                  ) : (
                    <Text style={[styles.rankText, { color: getRankColor(user.rank) }]}>
                      {user.rank}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>{user.avatar}</Text>
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.pointsContainer}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.userPoints}>{user.points.toLocaleString()} points</Text>
                </View>
              </View>

              <View style={styles.changeSection}>
                {user.change !== '0' && (
                  <View style={styles.changeIndicator}>
                    <Ionicons 
                      name={user.change.startsWith('-') ? "trending-down" : "trending-up"}
                      size={12} 
                      color={getChangeColor(user.change)} 
                    />
                    <Text style={[styles.changeText, { color: getChangeColor(user.change) }]}>
                      {user.change}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}
export default withAuthProtection(LeaderboardScreen);

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
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  podiumContainer: {
    marginBottom: 32,
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  podiumPlace: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  firstPlace: {
    marginBottom: 0,
  },
  secondPlace: {
    marginBottom: 20,
  },
  thirdPlace: {
    marginBottom: 40,
  },
  podiumCrown: {
    marginBottom: 8,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    backgroundColor: '#2563EB',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: 'white',
  },
  podiumAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  podiumName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  podiumPoints: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  podiumRank: {
    width: 32,
    height: 32,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumRankText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  leaderboardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rankSection: {
    width: 40,
    alignItems: 'center',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
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
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPoints: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  changeSection: {
    width: 40,
    alignItems: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  bottomPadding: {
    height: 20,
  },
});